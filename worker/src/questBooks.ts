// Quest Books: Side-Quest's own downloadable subject books (Maths, English, Science, History, Geography) per year level.
//
// Ground rules
// - Each book is a finished PDF the platform owner uploads, with an optional sample PDF and cover PNG. Everything lives
//   only in the private R2 bucket (quest-books/v1/<id>/...), never in this public repository.
// - Family Membership (and the owner) can download every book. Any parent can download a book's sample.
//   A family without membership can buy one whole book (owner-set price, Stripe Checkout); only the signature-verified
//   webhook records the purchase (questBookPurchases.ts), and the family can then download that book for good.
// - Books without a full PDF yet are drafts: only the owner sees them.
import type { App, Guards } from "./types";
import { getEntitlement } from "./lessonBuilder";
import { isPlatformOwner } from "./access";
import { authenticateToken, verifyFileToken } from "./session";
import { billingConfig, stripeCall, appOrigin } from "./billing";
import { familyOwnsBook, ownedBookIds } from "./questBookPurchases";

type DB = D1Database;

export const QUEST_SUBJECTS = ["mathematics", "english", "science", "history", "geography"] as const;
export type QuestSubject = (typeof QUEST_SUBJECTS)[number];
export const SUBJECT_LABEL: Record<QuestSubject, string> = {
  mathematics: "Mathematics",
  english: "English",
  science: "Science",
  history: "History",
  geography: "Geography",
};
/** Foundation is year 0. */
export const QUEST_YEARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const yearLabel = (y: number) => (y === 0 ? "Foundation" : `Year ${y}`);

const ROOT = "quest-books/v1/";
const VALID_ID = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
export const FILE_KINDS = ["book", "sample", "cover"] as const;
type FileKind = (typeof FILE_KINDS)[number];
const keyFor = (id: string, kind: FileKind | "meta") =>
  `${ROOT}${id}/${kind === "meta" ? "meta.json" : kind === "cover" ? "cover.png" : `${kind}.pdf`}`;
const MAX_PDF_BYTES = 95_000_000; // Workers accept request bodies up to 100 MB
const MAX_COVER_BYTES = 7_000_000;

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, n) : "");
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64).replace(/-+$/, "");

export type QuestBookMeta = {
  id: string;
  year: number;
  subject: QuestSubject;
  title: string;
  subtitle: string;
  description: string;
  /** Pages in the full book, as the owner states it (shown to parents). */
  pages: number | null;
  /** Price for buying the whole book without a membership, in Australian cents. Null: members only. */
  price_cents: number | null;
  updated_at: string;
};

type Fail = { ok: false; status: number; detail: string };
const fail = (status: number, detail: string): Fail => ({ ok: false, status, detail });

export function validateMeta(raw: unknown, now: Date = new Date()): { ok: true; meta: QuestBookMeta } | Fail {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fail(400, "Book details are missing.");
  const b = raw as Record<string, unknown>;
  const title = clip(b.title, 120);
  if (!title) return fail(400, "The book needs a title.");
  const id = clip(b.id, 64) || slugify(title);
  if (!VALID_ID.test(id)) return fail(400, "The book id must use lowercase letters, numbers and dashes.");
  const year = Number(b.year);
  if (!QUEST_YEARS.includes(year)) return fail(400, "Choose a year level from Foundation to Year 10.");
  const subject = String(b.subject || "").toLowerCase() as QuestSubject;
  if (!QUEST_SUBJECTS.includes(subject)) return fail(400, "Choose Mathematics, English, Science, History or Geography.");
  let price_cents: number | null = null;
  if (b.price_cents !== undefined && b.price_cents !== null && b.price_cents !== "") {
    const p = Number(b.price_cents);
    if (!Number.isInteger(p) || p < 100 || p > 50000) return fail(400, "The price must be between $1 and $500, or left empty for members only.");
    price_cents = p;
  }
  let pages: number | null = null;
  if (b.pages !== undefined && b.pages !== null && b.pages !== "") {
    const n = Number(b.pages);
    if (!Number.isInteger(n) || n < 1 || n > 2000) return fail(400, "Pages must be a whole number from 1 to 2000.");
    pages = n;
  }
  return {
    ok: true,
    meta: { id, year, subject, title, subtitle: clip(b.subtitle, 160), description: clip(b.description, 2000), pages, price_cents, updated_at: now.toISOString() },
  };
}

type Listed = QuestBookMeta & { has_book: boolean; has_sample: boolean; has_cover: boolean; book_bytes: number | null; sample_bytes: number | null };

async function listBooks(bucket: R2Bucket | undefined): Promise<Listed[]> {
  if (!bucket) return [];
  const files = new Map<string, Partial<Record<FileKind, number>>>();
  const metaIds: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: ROOT, limit: 1000, cursor });
    for (const obj of page.objects) {
      const m = /^([a-z0-9-]+)\/(meta\.json|book\.pdf|sample\.pdf|cover\.png)$/.exec(obj.key.slice(ROOT.length));
      if (!m || !VALID_ID.test(m[1])) continue;
      if (m[2] === "meta.json") { metaIds.push(m[1]); continue; }
      const kind = m[2].split(".")[0] as FileKind;
      files.set(m[1], { ...(files.get(m[1]) || {}), [kind]: obj.size });
    }
    cursor = page.truncated ? (page as any).cursor : undefined;
  } while (cursor);
  const metas = await Promise.all(metaIds.map((id) => readMeta(bucket, id)));
  return metas
    .filter((m): m is QuestBookMeta => !!m)
    .map((m) => {
      const f = files.get(m.id) || {};
      return { ...m, has_book: f.book !== undefined, has_sample: f.sample !== undefined, has_cover: f.cover !== undefined, book_bytes: f.book ?? null, sample_bytes: f.sample ?? null };
    })
    .sort((a, b) => a.year - b.year || QUEST_SUBJECTS.indexOf(a.subject) - QUEST_SUBJECTS.indexOf(b.subject) || a.title.localeCompare(b.title));
}

async function readMeta(bucket: R2Bucket, id: string): Promise<QuestBookMeta | null> {
  const obj = await bucket.get(keyFor(id, "meta"));
  if (!obj) return null;
  try {
    const parsed = JSON.parse(await new Response(obj.body).text());
    const checked = validateMeta({ ...parsed, id });
    return checked.ok ? { ...checked.meta, updated_at: String(parsed.updated_at || checked.meta.updated_at) } : null;
  } catch {
    return null;
  }
}

/** member: every book. Otherwise a family can download books it bought, plus every sample. */
async function accessFor(db: DB, familyId: string, userId: string | null) {
  const owner = userId ? await isPlatformOwner(db, userId) : false;
  const { plan, limits } = await getEntitlement(db, familyId);
  const member = owner || limits.aiGeneration; // the paid-plan marker, as the Printable Vault uses
  return { owner, member, preview: plan === "FREE_PREVIEW", owned: member ? new Set<string>() : await ownedBookIds(db, familyId) };
}

const fileName = (m: QuestBookMeta, kind: "book" | "sample") =>
  `Side-Quest ${yearLabel(m.year)} ${SUBJECT_LABEL[m.subject]} - ${m.title}${kind === "sample" ? " (sample)" : ""}.pdf`.replace(/[\\/:*?"<>|]/g, "");

function out(b: Listed, a: Awaited<ReturnType<typeof accessFor>>, canBuy: boolean) {
  const full = a.member || a.owned.has(b.id);
  return {
    id: b.id, year: b.year, year_label: yearLabel(b.year), subject: b.subject, subject_label: SUBJECT_LABEL[b.subject],
    title: b.title, subtitle: b.subtitle, description: b.description, pages: b.pages, price_cents: b.price_cents,
    has_book: b.has_book, has_sample: b.has_sample, has_cover: b.has_cover, book_bytes: b.book_bytes,
    can_download: full && b.has_book,
    owned: a.owned.has(b.id),
    can_buy: !full && b.has_book && b.price_cents !== null && canBuy,
    ...(a.owner ? { sample_bytes: b.sample_bytes, updated_at: b.updated_at } : {}),
  };
}

/** Download links carry the files-only token (?ft=) so the browser can save a large PDF directly. */
async function familyFromRequest(c: any): Promise<{ familyId: string; userId: string | null } | null> {
  const header = c.req.header("Authorization") || "";
  if (header.startsWith("Bearer ")) {
    const auth = await authenticateToken(c.env, header.slice(7));
    return auth.ok && auth.user.role === "parent" ? { familyId: auth.user.family_id, userId: auth.user.id } : null;
  }
  const ft = c.req.query("ft");
  const familyId = ft ? await verifyFileToken(c.env, ft) : null;
  return familyId ? { familyId, userId: null } : null;
}

function pdfResponse(obj: R2ObjectBody, name: string) {
  return new Response(obj.body, {
    headers: {
      "content-type": "application/pdf",
      "content-length": String(obj.size),
      "content-disposition": `attachment; filename="${name.replace(/[^\x20-\x7e]/g, "")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
    },
  });
}

export function registerQuestBooks(app: App, g: Guards) {
  const ownerOnly = async (c: any, next: any) => {
    if (!(await isPlatformOwner(c.env.DB, c.get("user").id))) return c.json({ detail: "Platform-owner access required" }, 403);
    if (!c.env.BUCKET) return c.json({ detail: "Private storage is not configured" }, 503);
    return next();
  };

  app.get("/api/quest-books", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    const canBuy = billingConfig(c.env).ok;
    const books = (await listBooks(c.env.BUCKET)).filter((b) => a.owner || b.has_book);
    c.header("Cache-Control", "private, no-store");
    return c.json({
      member: a.member, preview: a.preview, owner: a.owner, can_buy: canBuy,
      subjects: QUEST_SUBJECTS.map((s) => ({ id: s, label: SUBJECT_LABEL[s] })),
      years: QUEST_YEARS.map((y) => ({ year: y, label: yearLabel(y) })),
      books: books.map((b) => out(b, a, canBuy)),
    });
  });

  app.get("/api/quest-books/books/:id", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const user = c.get("user");
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    const book = (await listBooks(c.env.BUCKET)).find((b) => b.id === id && (a.owner || b.has_book));
    if (!book) return c.json({ detail: "Book not found" }, 404);
    c.header("Cache-Control", "private, no-store");
    return c.json({ member: a.member, preview: a.preview, book: out(book, a, billingConfig(c.env).ok) });
  });

  app.get("/api/quest-books/books/:id/cover", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Cover not found" }, 404);
    const obj = await c.env.BUCKET.get(keyFor(id, "cover"));
    if (!obj) return c.json({ detail: "Cover not found" }, 404);
    c.header("Content-Type", "image/png");
    c.header("Cache-Control", "private, max-age=300");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  // The sample is free for every signed-in parent.
  app.get("/api/quest-books/books/:id/sample", async (c) => {
    const who = await familyFromRequest(c);
    if (!who) return c.json({ detail: "This link has expired. Refresh the page and try again." }, 401);
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Sample not found" }, 404);
    const meta = await readMeta(c.env.BUCKET, id);
    const obj = meta ? await c.env.BUCKET.get(keyFor(id, "sample")) : null;
    if (!meta || !obj) return c.json({ detail: "This book doesn't have a sample yet." }, 404);
    return pdfResponse(obj, fileName(meta, "sample"));
  });

  // The full book: members, the owner, or a family that bought it.
  app.get("/api/quest-books/books/:id/download", async (c) => {
    const who = await familyFromRequest(c);
    if (!who) return c.json({ detail: "This link has expired. Refresh the page and try again." }, 401);
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const a = await accessFor(c.env.DB, who.familyId, who.userId);
    if (!a.member && !(await familyOwnsBook(c.env.DB, who.familyId, id))) {
      return c.json({ code: "UPGRADE_REQUIRED", detail: "This book is included with Family Membership, or you can buy it on its own." }, 402);
    }
    const meta = await readMeta(c.env.BUCKET, id);
    const obj = meta ? await c.env.BUCKET.get(keyFor(id, "book")) : null;
    if (!meta || !obj) return c.json({ detail: "Book not found" }, 404);
    return pdfResponse(obj, fileName(meta, "book"));
  });

  // Buy one whole book without a membership. The price comes from the stored book, never the browser.
  // Access is granted only by the verified webhook (questBookPurchases.ts); the return page grants nothing.
  app.post("/api/quest-books/books/:id/checkout", g.auth, g.parent, async (c) => {
    const cfg = billingConfig(c.env);
    if (!cfg.ok) return c.json({ code: "BILLING_NOT_CONFIGURED", detail: "Buying books isn't available yet." }, 503);
    const user = c.get("user");
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const meta = await readMeta(c.env.BUCKET, id);
    if (!meta || !(await c.env.BUCKET.head(keyFor(id, "book")))) return c.json({ detail: "Book not found" }, 404);
    if (meta.price_cents === null) return c.json({ code: "MEMBERS_ONLY", detail: "This book is included with Family Membership and isn't sold separately." }, 409);
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    if (a.member) return c.json({ code: "ALREADY_INCLUDED", detail: "Your Family Membership already includes every Quest Book." }, 409);
    if (a.owned.has(id)) return c.json({ code: "ALREADY_OWNED", detail: "You already own this book." }, 409);
    try {
      const parentRow = await c.env.DB.prepare("SELECT email FROM users WHERE id = ?").bind(user.id).first<{ email: string }>();
      const origin = appOrigin(c.env, c.req.url);
      const session = await stripeCall(cfg.key, "POST", "checkout/sessions", {
        mode: "payment",
        client_reference_id: user.family_id,
        ...(parentRow?.email ? { customer_email: parentRow.email } : {}),
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "aud",
            unit_amount: meta.price_cents,
            product_data: { name: `Quest Book: ${meta.title}`, description: `${yearLabel(meta.year)} ${SUBJECT_LABEL[meta.subject]} · digital download (PDF)`.slice(0, 250) },
          },
        }],
        metadata: { kind: "quest_book", family_id: user.family_id, book_id: id, price_cents: String(meta.price_cents) },
        payment_intent_data: { metadata: { kind: "quest_book", family_id: user.family_id, book_id: id } },
        success_url: `${origin}/parent/quest-books/${id}?purchase=success`,
        cancel_url: `${origin}/parent/quest-books/${id}?purchase=cancelled`,
      }, { idempotencyKey: `sq-book-${user.family_id}-${id}-${meta.price_cents}-${Math.floor(Date.now() / 60000)}` });
      return c.json({ url: session.url });
    } catch (e: any) {
      console.error("quest book checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  // ---------------------------------------------------------------- owner

  // Create a book or update its details. Body: { id?, title, subtitle, description, year, subject, pages, price_cents }.
  // A new book gets its id from the title; editing an existing book sends its id.
  app.post("/api/quest-books/admin/books", g.auth, g.parent, ownerOnly, async (c) => {
    const body: any = await c.req.json().catch(() => null);
    const checked = validateMeta(body);
    if (!checked.ok) return c.json({ detail: checked.detail }, checked.status as any);
    const meta = checked.meta;
    const exists = await c.env.BUCKET!.head(keyFor(meta.id, "meta"));
    if (exists && !clip(body?.id, 64)) {
      return c.json({ code: "BOOK_EXISTS", detail: `There's already a book called “${meta.title}”. Give this one a different title, or edit the existing book.` }, 409);
    }
    await c.env.BUCKET!.put(keyFor(meta.id, "meta"), JSON.stringify(meta), { httpMetadata: { contentType: "application/json" } });
    if (!(await c.env.BUCKET!.head(keyFor(meta.id, "meta")))) return c.json({ detail: "Storage confirmation failed; please retry." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, book: meta, created: !exists });
  });

  // Upload the full book PDF, the sample PDF or the cover PNG. The raw file is the request body.
  app.put("/api/quest-books/admin/books/:id/files/:kind", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const kind = c.req.param("kind") as FileKind;
    if (!VALID_ID.test(id) || !FILE_KINDS.includes(kind)) return c.json({ detail: "Unknown book or file type" }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Save the book's details before uploading files." }, 404);
    const type = c.req.header("content-type")?.split(";")[0].trim().toLowerCase();
    const isCover = kind === "cover";
    if (isCover ? type !== "image/png" : type !== "application/pdf") return c.json({ detail: isCover ? "Covers must be PNG images." : "Books and samples must be PDF files." }, 415);
    const limit = isCover ? MAX_COVER_BYTES : MAX_PDF_BYTES;
    const length = Number(c.req.header("content-length") || "0");
    if (length > limit) return c.json({ detail: isCover ? "Cover is too large (7 MB limit)." : "This PDF is too large (95 MB limit). Try Canva's “Compress file” or a smaller image quality when exporting." }, 413);
    const key = keyFor(id, kind);
    const contentType = isCover ? "image/png" : "application/pdf";
    const FLS = (globalThis as any).FixedLengthStream;
    let size = 0;
    if (!isCover && FLS && length > 0 && c.req.raw.body) {
      // Stream large PDFs straight into storage instead of holding up to 95 MB in the Worker's memory.
      const { readable, writable } = new FLS(length);
      const piping = c.req.raw.body.pipeTo(writable);
      await c.env.BUCKET!.put(key, readable, { httpMetadata: { contentType } });
      await piping;
      size = length;
    } else {
      const bytes = await c.req.arrayBuffer();
      if (!bytes.byteLength || bytes.byteLength > limit) return c.json({ detail: "The file is empty or too large." }, 413);
      const head = new Uint8Array(bytes.slice(0, 33));
      if (isCover) {
        const magic = [137, 80, 78, 71, 13, 10, 26, 10];
        const dv = new DataView(bytes);
        const ok = head.length >= 33 && magic.every((v, i) => head[i] === v) && (() => {
          const w = dv.getUint32(16), h = dv.getUint32(20);
          return w >= 600 && h >= 800 && w <= 10000 && h <= 14000 && w / h >= 0.55 && w / h <= 0.9;
        })();
        if (!ok) return c.json({ detail: "Use a portrait PNG at least 600 by 800 pixels (book-cover proportions)." }, 400);
      }
      await c.env.BUCKET!.put(key, bytes, { httpMetadata: { contentType } });
      size = bytes.byteLength;
    }
    const saved = await c.env.BUCKET!.get(key, isCover ? undefined : { range: { offset: 0, length: 5 } } as any);
    if (!saved) return c.json({ detail: "Storage confirmation failed; please retry this file." }, 502);
    if (!isCover) {
      const start = new Uint8Array(await new Response((saved as R2ObjectBody).body).arrayBuffer()).slice(0, 5);
      if (String.fromCharCode(...start) !== "%PDF-") {
        await c.env.BUCKET!.delete(key);
        return c.json({ detail: "That file isn't a PDF. Export your book from Canva as “PDF Standard” or “PDF Print”." }, 400);
      }
    }
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id, kind, bytes: size });
  });

  app.delete("/api/quest-books/admin/books/:id/files/:kind", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const kind = c.req.param("kind") as FileKind;
    if (!VALID_ID.test(id) || !FILE_KINDS.includes(kind)) return c.json({ detail: "Unknown book or file type" }, 400);
    await c.env.BUCKET!.delete(keyFor(id, kind));
    if (await c.env.BUCKET!.head(keyFor(id, kind))) return c.json({ detail: "The file could not be deleted. Please retry." }, 502);
    return c.json({ ok: true, id, kind });
  });

  // Removes the whole book. Families who bought it keep their purchase record (and anything they already downloaded).
  app.delete("/api/quest-books/admin/books/:id", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "No book with that id is stored." }, 404);
    const keys = (["meta", ...FILE_KINDS] as const).map((k) => keyFor(id, k));
    await c.env.BUCKET!.delete(keys);
    const after = await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)));
    if (after.some(Boolean)) return c.json({ detail: "The book could not be fully deleted. Please retry." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id });
  });
}
