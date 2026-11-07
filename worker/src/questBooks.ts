// Quest Books: Side-Quest's own subject books (Maths, English, Science, History, Geography) for each year level.
//
// Ground rules
// - Book content is paid content and lives only in the private R2 bucket, never in this public repository.
//   The platform owner imports each book as one JSON file (plus an optional cover PNG) from the Quest Books page.
// - A book is a list of ordinary lessons. "Add to My lessons" copies them into the family's own `lessons` table,
//   so assigning, the child lesson player, review, XP, evidence and the Outcome Tracker all work unchanged.
// - Copies are tagged with the book id and a stable lesson key in the lesson JSON (no D1 migration). Adding is
//   idempotent: re-adding a book only copies lessons the family doesn't already have, so a book can grow over time.
//   Updating a book never changes lessons a family has already copied (the same rule as assignment snapshots).
// - Every imported lesson passes the same validation as a parent-built lesson. Outcome codes are filtered to the
//   family's own verified catalogue when copied, exactly like any other lesson.
// - Access: Family Membership (and the owner) get every book. Anyone can browse covers and outlines.
//   A free-preview family can add one free sample lesson per book. A family without membership can buy a whole
//   book (owner-set price, Stripe Checkout); the verified webhook records it, and that book's lessons then stay
//   assignable even after the preview ends (see assignLesson). Books without a price are for members only.
import type { App, Guards } from "./types";
import { getEntitlement, sanitizeLessonInput, toLessonData, familyOutcomeCodes, countLessons } from "./lessonBuilder";
import { isPlatformOwner } from "./access";
import { UPGRADE_MESSAGE } from "./entitlements";
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
/** The lesson's learning_area, matching the names the rest of the app already uses. */
const SUBJECT_AREA: Record<QuestSubject, string> = {
  mathematics: "Mathematics",
  english: "English",
  science: "Science",
  history: "History",
  geography: "Geography",
};
/** Foundation is year 0. */
export const QUEST_YEARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stageForYear = (y: number) => (y === 0 ? "ES1" : y <= 2 ? "S1" : y <= 4 ? "S2" : y <= 6 ? "S3" : y <= 8 ? "S4" : "S5");
export const yearLabel = (y: number) => (y === 0 ? "Foundation" : `Year ${y}`);

const ROOT = "quest-books/v1/";
const VALID_ID = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const VALID_KEY = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;
const bookKey = (id: string) => `${ROOT}${id}.json`;
const coverKey = (id: string) => `${ROOT}${id}-cover.png`;
const MAX_BOOK_BYTES = 8_000_000;
const MAX_COVER_BYTES = 7_000_000;
const MAX_LESSONS = 200;
export const COVER_THEMES = ["meadow", "ocean", "sunset", "forest", "twilight", "desert"] as const;

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, n) : "");

export type QuestLesson = { key: string; unit: string; lesson: Record<string, unknown> };
export type QuestBook = {
  id: string;
  year: number;
  subject: QuestSubject;
  title: string;
  subtitle: string;
  description: string;
  theme: string;
  /** Price for buying the whole book without a membership, in Australian cents. Null: members only. */
  price_cents: number | null;
  /** The lesson free-preview families can add for free. */
  sample_key: string;
  lessons: QuestLesson[];
};

type Fail = { ok: false; status: number; detail: string; code?: string };
const fail = (status: number, detail: string, code?: string): Fail => ({ ok: false, status, detail, code });

/** Validates a whole book before anything is stored: one bad lesson rejects the import with its position named. */
export function validateBook(raw: unknown): { ok: true; book: QuestBook } | Fail {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fail(400, "The book file must be a JSON object.");
  const b = raw as Record<string, unknown>;
  const id = clip(b.id, 64);
  if (!VALID_ID.test(id)) return fail(400, "Book id must use lowercase letters, numbers and dashes, for example y3-mathematics.");
  const year = Number(b.year);
  if (!QUEST_YEARS.includes(year)) return fail(400, "Year must be 0 (Foundation) to 10.");
  const subject = String(b.subject || "").toLowerCase() as QuestSubject;
  if (!QUEST_SUBJECTS.includes(subject)) return fail(400, `Subject must be one of: ${QUEST_SUBJECTS.join(", ")}.`);
  const title = clip(b.title, 120);
  if (!title) return fail(400, "The book needs a title.");
  const theme = COVER_THEMES.includes(String(b.theme) as any) ? String(b.theme) : "meadow";
  if (!Array.isArray(b.lessons) || !b.lessons.length) return fail(400, "The book needs at least one lesson.");
  if (b.lessons.length > MAX_LESSONS) return fail(400, `A book can hold at most ${MAX_LESSONS} lessons.`);
  const seen = new Set<string>();
  const lessons: QuestLesson[] = [];
  for (const [i, entry] of (b.lessons as unknown[]).entries()) {
    const e = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const key = clip(e.key, 40);
    if (!VALID_KEY.test(key)) return fail(400, `Lesson ${i + 1} needs a key using lowercase letters, numbers and dashes (for example u1-l1).`);
    if (seen.has(key)) return fail(400, `Lesson key ${key} is used twice. Keys must be unique within a book.`);
    seen.add(key);
    const clean = sanitizeLessonInput(e.lesson);
    if (!clean.ok) return fail(400, `Lesson ${i + 1} (${key}): ${clean.detail}`);
    lessons.push({ key, unit: clip(e.unit, 120), lesson: e.lesson as Record<string, unknown> });
  }
  let price_cents: number | null = null;
  if (b.price_cents !== undefined && b.price_cents !== null && b.price_cents !== "") {
    const p = Number(b.price_cents);
    if (!Number.isInteger(p) || p < 100 || p > 50000) return fail(400, "price_cents must be a whole number of cents from 100 ($1) to 50000 ($500), or left out for members only.");
    price_cents = p;
  }
  const sampleRaw = clip(b.sample_key, 40);
  if (sampleRaw && !seen.has(sampleRaw)) return fail(400, `sample_key ${sampleRaw} doesn't match any lesson key in this book.`);
  return {
    ok: true,
    book: { id, year, subject, title, subtitle: clip(b.subtitle, 160), description: clip(b.description, 1200), theme, price_cents, sample_key: sampleRaw || lessons[0].key, lessons },
  };
}

type Meta = { title: string; subtitle: string; year: string; subject: string; theme: string; lessons: string; description: string; price: string };
const metaOf = (book: QuestBook): Meta => ({
  title: book.title,
  subtitle: book.subtitle,
  year: String(book.year),
  subject: book.subject,
  theme: book.theme,
  lessons: String(book.lessons.length),
  price: book.price_cents === null ? "" : String(book.price_cents),
  // R2 custom metadata is small; the full description is in the book itself.
  description: book.description.slice(0, 600),
});

type Listed = { id: string; year: number; subject: QuestSubject; title: string; subtitle: string; description: string; theme: string; lesson_count: number; price_cents: number | null; has_cover: boolean; updated: number };

async function listBooks(bucket: R2Bucket | undefined): Promise<Listed[]> {
  if (!bucket) return [];
  const books = new Map<string, Listed>();
  const covers = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: ROOT, limit: 1000, cursor, include: ["customMetadata"] } as any);
    for (const obj of page.objects) {
      const name = obj.key.slice(ROOT.length);
      const cover = /^([a-z0-9-]+)-cover\.png$/.exec(name);
      if (cover) { covers.add(cover[1]); continue; }
      const json = /^([a-z0-9-]+)\.json$/.exec(name);
      if (!json || !VALID_ID.test(json[1])) continue;
      const m = (obj.customMetadata || {}) as Partial<Meta>;
      const year = Number(m.year);
      const subject = String(m.subject || "") as QuestSubject;
      if (!QUEST_YEARS.includes(year) || !QUEST_SUBJECTS.includes(subject)) continue;
      books.set(json[1], {
        id: json[1], year, subject,
        title: clip(m.title, 120) || json[1],
        subtitle: clip(m.subtitle, 160),
        description: clip(m.description, 600),
        theme: COVER_THEMES.includes(String(m.theme) as any) ? String(m.theme) : "meadow",
        lesson_count: Number(m.lessons) || 0,
        price_cents: m.price && Number.isInteger(Number(m.price)) ? Number(m.price) : null,
        has_cover: false,
        updated: obj.uploaded?.getTime?.() || 0,
      });
    }
    cursor = page.truncated ? (page as any).cursor : undefined;
  } while (cursor);
  for (const b of books.values()) b.has_cover = covers.has(b.id);
  return [...books.values()].sort((a, b) => a.year - b.year || QUEST_SUBJECTS.indexOf(a.subject) - QUEST_SUBJECTS.indexOf(b.subject) || a.title.localeCompare(b.title));
}

async function readBook(bucket: R2Bucket, id: string): Promise<QuestBook | null> {
  const obj = await bucket.get(bookKey(id));
  if (!obj) return null;
  try {
    const checked = validateBook(JSON.parse(await new Response(obj.body).text()));
    return checked.ok ? checked.book : null;
  } catch {
    return null;
  }
}

/** For each book, the family's copied lesson keys (archived copies count: restoring them is the parent's choice). */
async function familyCopies(db: DB, familyId: string, bookId?: string): Promise<Map<string, Map<string, { id: string; archived: boolean }>>> {
  let sql = `SELECT id, archived_at, json_extract(data, '$.quest_book_id') AS book, json_extract(data, '$.quest_lesson_key') AS lkey
    FROM lessons WHERE family_id = ? AND json_valid(data) AND json_extract(data, '$.quest_book_id') IS NOT NULL`;
  const binds: unknown[] = [familyId];
  if (bookId) { sql += " AND json_extract(data, '$.quest_book_id') = ?"; binds.push(bookId); }
  const { results } = await db.prepare(sql).bind(...binds).all<any>();
  const out = new Map<string, Map<string, { id: string; archived: boolean }>>();
  for (const r of results || []) {
    const book = String(r.book);
    if (!out.has(book)) out.set(book, new Map());
    out.get(book)!.set(String(r.lkey), { id: r.id, archived: !!r.archived_at });
  }
  return out;
}

/** member: every book. Otherwise per book: owned (bought), sample (free preview: one lesson) or none. */
export async function questAccess(db: DB, user: { id: string; family_id: string }) {
  const owner = await isPlatformOwner(db, user.id);
  const { plan, limits } = await getEntitlement(db, user.family_id);
  const member = owner || limits.aiGeneration; // the paid-plan marker, as the Printable Vault uses
  return { owner, member, preview: plan === "FREE_PREVIEW", plan, owned: member ? new Set<string>() : await ownedBookIds(db, user.family_id) };
}
type Access = Awaited<ReturnType<typeof questAccess>>;
const bookAccess = (a: Access, bookId: string): "full" | "sample" | "none" =>
  a.member || a.owned.has(bookId) ? "full" : a.preview ? "sample" : "none";

/** Copies every lesson the family doesn't already have. Each insert re-checks, so double clicks can't duplicate. */
export async function addBookToFamily(db: DB, familyId: string, book: QuestBook, now: Date = new Date(), opts: { onlyKeys?: Set<string> } = {}) {
  const { limits } = await getEntitlement(db, familyId, now);
  const have = (await familyCopies(db, familyId, book.id)).get(book.id) || new Map();
  const wanted = book.lessons.filter((l) => !opts.onlyKeys || opts.onlyKeys.has(l.key));
  const missing = wanted.filter((l) => !have.has(l.key));
  // Members share the normal library cap. Bought books and free samples don't use preview lesson slots.
  if (limits.aiGeneration && (await countLessons(db, familyId)) + missing.length > limits.maxLessons) {
    return fail(402, `This book would take your library past ${limits.maxLessons} lessons. Archive some lessons first.`, "LIBRARY_FULL");
  }
  const ts = now.toISOString();
  let added = 0;
  for (const [index, entry] of book.lessons.entries()) {
    if (have.has(entry.key) || (opts.onlyKeys && !opts.onlyKeys.has(entry.key))) continue;
    const clean = sanitizeLessonInput({
      ...entry.lesson,
      learning_area: SUBJECT_AREA[book.subject],
      year_level: entry.lesson.year_level || yearLabel(book.year),
      stage: entry.lesson.stage || stageForYear(book.year),
      status: "ready",
    });
    if (!clean.ok) continue; // validated on import; skip rather than fail the whole book if rules tighten later
    clean.value.builder.outcome_codes = await familyOutcomeCodes(db, familyId, (clean.value.builder.outcome_codes as string[]) || []);
    const data = {
      ...toLessonData(clean.value),
      source: "side_quest_book",
      review_status: "side_quest_book",
      quest_book_id: book.id,
      quest_book_title: book.title,
      quest_lesson_key: entry.key,
      quest_unit: entry.unit,
      quest_position: index + 1,
    };
    const id = crypto.randomUUID();
    const r = await db
      .prepare(
        `INSERT INTO lessons (id, family_id, title, stage, learning_area, unit_id, status, data, version, created_at, updated_at)
         SELECT ?, ?, ?, ?, ?, NULL, 'ready', ?, 1, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE family_id = ? AND json_valid(data)
           AND json_extract(data, '$.quest_book_id') = ? AND json_extract(data, '$.quest_lesson_key') = ?)`
      )
      .bind(id, familyId, clean.value.title, clean.value.stage, clean.value.learning_area, JSON.stringify(data), ts, ts, familyId, book.id, entry.key)
      .run();
    if ((r as any)?.meta?.changes) added++;
  }
  return { ok: true as const, added, already: have.size, total: wanted.length };
}

const isPortraitPng = (data: ArrayBuffer) => {
  const b = new Uint8Array(data);
  const magic = [137, 80, 78, 71, 13, 10, 26, 10];
  if (b.length < 33 || !magic.every((v, i) => b[i] === v)) return false;
  const dv = new DataView(data);
  const w = dv.getUint32(16), h = dv.getUint32(20);
  return w >= 600 && h >= 800 && w <= 10000 && h <= 14000 && w / h >= 0.55 && w / h <= 0.9;
};

export function registerQuestBooks(app: App, g: Guards) {
  const ownerOnly = async (c: any, next: any) => {
    if (!(await isPlatformOwner(c.env.DB, c.get("user").id))) return c.json({ detail: "Platform-owner access required" }, 403);
    if (!c.env.BUCKET) return c.json({ detail: "Private storage is not configured" }, 503);
    return next();
  };

  app.get("/api/quest-books", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const access = await questAccess(c.env.DB, user);
    const books = await listBooks(c.env.BUCKET);
    const copies = await familyCopies(c.env.DB, user.family_id);
    c.header("Cache-Control", "private, no-store");
    return c.json({
      unlocked: access.member,
      member: access.member,
      preview: access.preview,
      owner: access.owner,
      can_buy: billingConfig(c.env).ok,
      subjects: QUEST_SUBJECTS.map((s) => ({ id: s, label: SUBJECT_LABEL[s] })),
      years: QUEST_YEARS.map((y) => ({ year: y, label: yearLabel(y) })),
      books: books.map(({ updated, ...b }) => {
        const mine = copies.get(b.id);
        return {
          ...b,
          access: bookAccess(access, b.id),
          owned: access.owned.has(b.id),
          added_count: mine ? [...mine.values()].filter((x) => !x.archived).length : 0,
        };
      }),
    });
  });

  app.get("/api/quest-books/books/:id", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const book = await readBook(c.env.BUCKET, id);
    if (!book) return c.json({ detail: "Book not found" }, 404);
    const user = c.get("user");
    const access = await questAccess(c.env.DB, user);
    const level = bookAccess(access, id);
    const mine = (await familyCopies(c.env.DB, user.family_id, id)).get(id) || new Map();
    const head = await c.env.BUCKET.head(coverKey(id));
    c.header("Cache-Control", "private, no-store");
    // An outline only: titles, aims and timing. Full lesson content is read from the family's own copies.
    return c.json({
      unlocked: level === "full",
      access: level,
      member: access.member,
      owned: access.owned.has(id),
      can_buy: !access.member && !access.owned.has(id) && book.price_cents !== null && billingConfig(c.env).ok,
      book: {
        id: book.id, year: book.year, year_label: yearLabel(book.year), subject: book.subject, subject_label: SUBJECT_LABEL[book.subject],
        title: book.title, subtitle: book.subtitle, description: book.description, theme: book.theme, has_cover: !!head,
        price_cents: book.price_cents, sample_key: book.sample_key,
        lesson_count: book.lessons.length,
        lessons: book.lessons.map((l, i) => {
          const mineL = mine.get(l.key);
          const objectives = Array.isArray(l.lesson.objectives) ? (l.lesson.objectives as unknown[]).map((o) => clip(o, 300)).filter(Boolean).slice(0, 3) : [];
          const minutes = Number(l.lesson.duration_minutes);
          return {
            key: l.key, position: i + 1, unit: l.unit,
            title: clip(l.lesson.title, 200), objectives,
            duration_minutes: Number.isInteger(minutes) && minutes > 0 ? minutes : null,
            sample: l.key === book.sample_key,
            lesson_id: mineL && !mineL.archived ? mineL.id : null,
            archived: !!mineL?.archived,
          };
        }),
      },
    });
  });

  app.get("/api/quest-books/books/:id/cover", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Cover not found" }, 404);
    const obj = await c.env.BUCKET.get(coverKey(id));
    if (!obj) return c.json({ detail: "Cover not found" }, 404);
    c.header("Content-Type", "image/png");
    c.header("Cache-Control", "private, max-age=300");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  // Members and buyers get every lesson; a free-preview family gets the book's one free sample lesson.
  app.post("/api/quest-books/books/:id/add", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const book = await readBook(c.env.BUCKET, id);
    if (!book) return c.json({ detail: "Book not found" }, 404);
    const level = bookAccess(await questAccess(c.env.DB, user), id);
    if (level === "none") {
      return c.json({ code: "UPGRADE_REQUIRED", detail: `Quest Books are included with Family Membership${book.price_cents !== null ? ", or you can buy this book on its own" : ""}. ${UPGRADE_MESSAGE}` }, 402);
    }
    const r = await addBookToFamily(c.env.DB, user.family_id, book, new Date(), level === "sample" ? { onlyKeys: new Set([book.sample_key]) } : {});
    if (!r.ok) return c.json({ detail: r.detail, code: r.code }, r.status as any);
    return c.json({ ...r, sample_only: level === "sample" });
  });

  // Buy one whole book without a membership. The price comes from the stored book, never the browser.
  // Access is granted only by the verified webhook (questBookPurchases.ts); the return page grants nothing.
  app.post("/api/quest-books/books/:id/checkout", g.auth, g.parent, async (c) => {
    const cfg = billingConfig(c.env);
    if (!cfg.ok) return c.json({ code: "BILLING_NOT_CONFIGURED", detail: "Buying books isn't available yet." }, 503);
    const user = c.get("user");
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const book = await readBook(c.env.BUCKET, id);
    if (!book) return c.json({ detail: "Book not found" }, 404);
    if (book.price_cents === null) return c.json({ code: "MEMBERS_ONLY", detail: "This book is included with Family Membership and isn't sold separately." }, 409);
    const access = await questAccess(c.env.DB, user);
    if (access.member) return c.json({ code: "ALREADY_INCLUDED", detail: "Your Family Membership already includes every Quest Book." }, 409);
    if (await familyOwnsBook(c.env.DB, user.family_id, id)) return c.json({ code: "ALREADY_OWNED", detail: "You already own this book." }, 409);
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
            unit_amount: book.price_cents,
            product_data: { name: `Quest Book: ${book.title}`, description: `${yearLabel(book.year)} ${SUBJECT_LABEL[book.subject]} · ${book.lessons.length} lessons`.slice(0, 250) },
          },
        }],
        metadata: { kind: "quest_book", family_id: user.family_id, book_id: id, price_cents: String(book.price_cents) },
        payment_intent_data: { metadata: { kind: "quest_book", family_id: user.family_id, book_id: id } },
        success_url: `${origin}/parent/quest-books/${id}?purchase=success`,
        cancel_url: `${origin}/parent/quest-books/${id}?purchase=cancelled`,
      }, { idempotencyKey: `sq-book-${user.family_id}-${id}-${book.price_cents}-${Math.floor(Date.now() / 60000)}` });
      return c.json({ url: session.url });
    } catch (e: any) {
      console.error("quest book checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  // Owner import. ?replace=1 is required to overwrite a book that already exists, so a typo can't wipe one.
  app.post("/api/quest-books/admin/books", g.auth, g.parent, ownerOnly, async (c) => {
    const length = Number(c.req.header("content-length") || "0");
    if (length > MAX_BOOK_BYTES) return c.json({ detail: "This book file is too large (8 MB limit)." }, 413);
    const text = await c.req.text();
    if (text.length > MAX_BOOK_BYTES) return c.json({ detail: "This book file is too large (8 MB limit)." }, 413);
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return c.json({ detail: "This is not a valid JSON book file." }, 400); }
    const checked = validateBook(raw);
    if (!checked.ok) return c.json({ detail: checked.detail }, checked.status as any);
    const book = checked.book;
    const exists = await c.env.BUCKET!.head(bookKey(book.id));
    if (exists && c.req.query("replace") !== "1") {
      return c.json({ code: "BOOK_EXISTS", detail: `A book with the id ${book.id} already exists. Tick "Replace existing books" to update it.` }, 409);
    }
    await c.env.BUCKET!.put(bookKey(book.id), JSON.stringify(book), { httpMetadata: { contentType: "application/json" }, customMetadata: metaOf(book) });
    const saved = await c.env.BUCKET!.head(bookKey(book.id));
    if (!saved) return c.json({ detail: "Storage confirmation failed; please retry this book." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id: book.id, title: book.title, lessons: book.lessons.length, replaced: !!exists });
  });

  app.post("/api/quest-books/admin/books/:id/cover", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    if (!(await c.env.BUCKET!.head(bookKey(id)))) return c.json({ detail: "Import the book before adding its cover." }, 404);
    if (c.req.header("content-type")?.split(";")[0].trim().toLowerCase() !== "image/png") return c.json({ detail: "PNG images only" }, 415);
    const bytes = await c.req.arrayBuffer();
    if (bytes.byteLength > MAX_COVER_BYTES) return c.json({ detail: "Cover is too large (7 MB limit)" }, 413);
    if (!isPortraitPng(bytes)) return c.json({ detail: "Use a portrait PNG at least 600 by 800 pixels (book-cover proportions)." }, 400);
    await c.env.BUCKET!.put(coverKey(id), bytes, { httpMetadata: { contentType: "image/png" } });
    if (!(await c.env.BUCKET!.head(coverKey(id)))) return c.json({ detail: "Storage confirmation failed; please retry this cover." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id, bytes: bytes.byteLength });
  });

  // Owner sets or clears the single-book price without re-uploading the book. Body: { price_cents: number | null }.
  app.put("/api/quest-books/admin/books/:id/price", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    const book = await readBook(c.env.BUCKET!, id);
    if (!book) return c.json({ detail: "Book not found" }, 404);
    const body: any = await c.req.json().catch(() => ({}));
    const checked = validateBook({ ...book, price_cents: body?.price_cents ?? null });
    if (!checked.ok) return c.json({ detail: checked.detail }, checked.status as any);
    await c.env.BUCKET!.put(bookKey(id), JSON.stringify(checked.book), { httpMetadata: { contentType: "application/json" }, customMetadata: metaOf(checked.book) });
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id, price_cents: checked.book.price_cents });
  });

  // Removes the book (and its cover) from Quest Books. Lessons families already copied stay in their libraries.
  app.delete("/api/quest-books/admin/books/:id", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    const keys = [bookKey(id), coverKey(id)];
    const before = await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)));
    if (!before[0]) return c.json({ detail: "No book with that id is stored." }, 404);
    await c.env.BUCKET!.delete(keys);
    const after = await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)));
    if (after.some(Boolean)) return c.json({ detail: "The book could not be fully deleted. Please retry." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id });
  });
}
