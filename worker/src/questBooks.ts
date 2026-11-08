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
import { ownerPowers } from "./viewAs";
import { authenticateToken, verifyFileToken } from "./session";
import { billingConfig, stripeCall, appOrigin } from "./billing";
import { ownedTiers, ownedLessonKeys, type Tier } from "./questBookPurchases";
import { familyOutcomeCodes, countLessons, ownLesson } from "./lessonBuilder";
import { draftLessonWithAi } from "./aiDraft";
import { fastLessonPipelineEnabled, splitLessonStagesEnabled } from "./aiPipeline";

type DB = D1Database;

export const QUEST_SUBJECTS = ["mathematics", "english", "science", "history", "geography"] as const;
/** Specialist books may also use "other" with their own topic label. */
const SPECIALIST_SUBJECTS = [...QUEST_SUBJECTS, "other"] as const;

/** "core" is the year-by-year shelf (Foundation to Year 10, five core subjects). The rest are specialist collections. */
export const QUEST_COLLECTIONS = [
  { id: "core", label: "Year-level books", blurb: "Maths, English, Science, History and Geography for each year." },
  { id: "naplan", label: "NAPLAN prep", blurb: "Reading, writing, language conventions and numeracy practice for Years 3, 5, 7 and 9." },
  { id: "hsc", label: "HSC prep", blurb: "NSW Year 11 and 12 courses: revision, practice questions and exam technique." },
  { id: "senior", label: "Senior certificates (other states)", blurb: "VCE, QCE, SACE, WACE and other senior secondary courses." },
  { id: "selective", label: "Selective, OC & scholarship tests", blurb: "Reasoning, reading, maths and writing practice for selective school, Opportunity Class and scholarship tests." },
  { id: "reading", label: "Reading & phonics", blurb: "Learning to read, phonics, sight words and spelling." },
  { id: "handwriting", label: "Handwriting", blurb: "Letter formation, neat print and cursive." },
  { id: "study-skills", label: "Study skills", blurb: "Note-taking, research, essay writing, time management and exam technique." },
  { id: "life-skills", label: "Life skills", blurb: "Money, budgeting, everyday maths and practical literacy." },
] as const;
const COLLECTION_IDS = QUEST_COLLECTIONS.map((c) => c.id) as string[];
export const SPECIALIST_YEARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
export const subjectLabel = (m: { subject: string; topic?: string }) => m.topic || SUBJECT_LABEL[m.subject as QuestSubject] || "Specialist";
export const yearLabel = (y: number | null) => (y === null ? "All ages" : y === 0 ? "Foundation" : `Year ${y}`);

const ROOT = "quest-books/v1/";
const VALID_ID = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
export const FILE_KINDS = ["book", "sample", "cover"] as const;
type FileKind = (typeof FILE_KINDS)[number];
const keyFor = (id: string, kind: FileKind | "meta" | "chapters" | "lessons") =>
  `${ROOT}${id}/${kind === "meta" ? "meta.json" : kind === "chapters" ? "chapters.json" : kind === "lessons" ? "lessons.json" : kind === "cover" ? "cover.png" : `${kind}.pdf`}`;
const MAX_CHAPTERS = 60;
const MAX_CHAPTER_TEXT = 30000;
type Chapter = { id: string; title: string; start: number; end: number; text: string };

/** Owner-supplied chapters (read from the PDF's bookmarks in the owner's browser). */
export function validateChapters(raw: unknown): { ok: true; chapters: Chapter[] } | Fail {
  const list = (raw as any)?.chapters;
  if (!Array.isArray(list)) return fail(400, "Chapters are missing.");
  if (list.length > MAX_CHAPTERS) return fail(400, `A book can have at most ${MAX_CHAPTERS} chapters.`);
  const chapters: Chapter[] = [];
  for (const [i, c] of list.entries()) {
    const title = clip(c?.title, 120);
    const start = Number(c?.start), end = Number(c?.end);
    if (!title) return fail(400, `Chapter ${i + 1} needs a title.`);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > 5000) return fail(400, `Chapter ${i + 1} has invalid pages.`);
    const text = typeof c?.text === "string" ? c.text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, " ").slice(0, MAX_CHAPTER_TEXT) : "";
    if (text.replace(/\s/g, "").length < 40) return fail(400, `Chapter “${title}” has no readable text. Make sure the PDF has real text, not just pictures of pages.`);
    chapters.push({ id: `c${i + 1}`, title, start, end, text });
  }
  return { ok: true, chapters };
}

/** A chapter lesson as published to a book: a snapshot of the owner's reviewed lesson. */
type Published = { key: string; chapter_id: string; chapter_title: string; title: string; stage: string; learning_area: string; data: Record<string, unknown> };

const clip = (v: unknown, n: number) => { const t = typeof v === "string" ? v.replace(/\s+/g, " ").trim() : ""; return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };
const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);

export function lessonPreview(l: Published) {
  const d: any = l.data || {};
  return {
    title: l.title, chapter_title: l.chapter_title, stage: l.stage, learning_area: l.learning_area,
    minutes: Number(d.duration_minutes) || null,
    summary: clip(d.why_it_matters || d.summary || "", 260),
    objectives: (Array.isArray(d.objectives) ? d.objectives : []).slice(0, 4).map((o: unknown) => clip(o, 160)).filter(Boolean),
    opening: clip(d.introduction || "", 320),
    sections: (Array.isArray(d.sections) ? d.sections : []).map((s: any) => clip(s?.heading || s?.title, 90)).filter(Boolean).slice(0, 8),
    key_words: (Array.isArray(d.key_words) ? d.key_words : []).map((k: any) => clip(typeof k === "string" ? k : k?.word ?? k?.term, 40)).filter(Boolean).slice(0, 8),
    includes: {
      worked_examples: count(d.worked_examples), activities: count(d.activities) + count(d.guided_practice),
      questions: count(d.questions), quiz: count(d.quiz), parent_script: Boolean(d.parent_script), answer_key: Boolean(d.answer_key),
    },
  };
}

async function readPublished(bucket: R2Bucket, id: string): Promise<Published[]> {
  const obj = await bucket.get(keyFor(id, "lessons"));
  if (!obj) return [];
  try {
    const list = JSON.parse(await new Response(obj.body).text());
    return Array.isArray(list?.lessons) ? list.lessons.filter((l: any) => l && typeof l.key === "string" && l.data && typeof l.title === "string") : [];
  } catch {
    return [];
  }
}

/** lesson key -> lesson id for the family's (unarchived) copies of this book's lessons. */
async function familyBookLessons(db: DB, familyId: string, bookId: string): Promise<Map<string, string>> {
  const { results } = await db.prepare(`SELECT id, json_extract(data, '$.quest_lesson_key') AS k FROM lessons
    WHERE family_id = ? AND archived_at IS NULL AND json_valid(data) AND json_extract(data, '$.quest_book_id') = ?
    AND json_extract(data, '$.source') = 'side_quest_book'`).bind(familyId, bookId).all<any>();
  return new Map((results || []).filter((r) => r.k).map((r) => [String(r.k), String(r.id)]));
}

/** Copies every published lesson the family doesn't already have (including archived copies). Re-checks per insert. */
export async function addPublishedLessons(db: DB, familyId: string, bookId: string, bookTitle: string, published: Published[], member: boolean, now: Date = new Date()) {
  const { results } = await db.prepare(`SELECT json_extract(data, '$.quest_lesson_key') AS k FROM lessons WHERE family_id = ? AND json_valid(data)
    AND json_extract(data, '$.quest_book_id') = ? AND json_extract(data, '$.source') = 'side_quest_book'`).bind(familyId, bookId).all<any>();
  const have = new Set((results || []).map((r) => String(r.k)));
  const missing = published.filter((l) => !have.has(l.key));
  if (member) {
    const { limits } = await getEntitlement(db, familyId, now);
    if ((await countLessons(db, familyId)) + missing.length > limits.maxLessons) return fail(402, `These lessons would take your library past ${limits.maxLessons} lessons. Archive some first.`);
  }
  const ts = now.toISOString();
  let added = 0;
  for (const l of missing) {
    const codes = Array.isArray(l.data.outcome_codes) ? await familyOutcomeCodes(db, familyId, (l.data.outcome_codes as unknown[]).map(String)) : [];
    const data = {
      ...l.data, outcome_codes: codes,
      source: "side_quest_book", ai_generated: false, review_status: "side_quest_book", ai_flags: [],
      quest_book_id: bookId, quest_book_title: bookTitle, quest_chapter_id: l.chapter_id, quest_chapter_title: l.chapter_title, quest_lesson_key: l.key,
    };
    const r = await db.prepare(`INSERT INTO lessons (id, family_id, title, stage, learning_area, unit_id, status, data, version, created_at, updated_at)
      SELECT ?, ?, ?, ?, ?, NULL, 'ready', ?, 1, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE family_id = ? AND json_valid(data) AND json_extract(data, '$.quest_book_id') = ?
        AND json_extract(data, '$.quest_lesson_key') = ? AND json_extract(data, '$.source') = 'side_quest_book')`)
      .bind(crypto.randomUUID(), familyId, l.title, l.stage, l.learning_area, JSON.stringify(data), ts, ts, familyId, bookId, l.key).run();
    if ((r as any)?.meta?.changes) added++;
  }
  return { ok: true as const, added, already: have.size, total: published.length };
}

async function readChapters(bucket: R2Bucket, id: string): Promise<Chapter[]> {
  const obj = await bucket.get(keyFor(id, "chapters"));
  if (!obj) return [];
  try {
    const checked = validateChapters(JSON.parse(await new Response(obj.body).text()));
    return checked.ok ? checked.chapters : [];
  } catch {
    return [];
  }
}
const MAX_PDF_BYTES = 95_000_000; // Workers accept request bodies up to 100 MB
const MAX_COVER_BYTES = 7_000_000;

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, n) : "");
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64).replace(/-+$/, "");

export type QuestBookMeta = {
  id: string;
  /** Shelf: "core" or a specialist collection id. */
  collection: string;
  /** Null for specialist books suited to all ages. */
  year: number | null;
  subject: QuestSubject | "other";
  /** Specialist books: the label shown instead of the subject (e.g. "Numeracy", "Mathematics Advanced"). */
  topic: string;
  title: string;
  subtitle: string;
  description: string;
  /** Pages in the full book, as the owner states it (shown to parents). */
  pages: number | null;
  /** Price for buying the whole book without a membership, in Australian cents. Null: members only. */
  price_cents: number | null;
  /** Price for the book plus all its ready-made chapter lessons, without a membership. Null: no bundle. */
  lessons_price_cents: number | null;
  /** Price for one chapter lesson on its own, without a membership. Null: single lessons aren't sold. */
  lesson_price_cents: number | null;
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
  const collection = COLLECTION_IDS.includes(String(b.collection)) ? String(b.collection) : "core";
  const core = collection === "core";
  const allAges = !core && (b.year === null || b.year === "" || b.year === "all" || b.year === undefined);
  const year = allAges ? null : Number(b.year);
  if (core ? !QUEST_YEARS.includes(year as number) : !(allAges || SPECIALIST_YEARS.includes(year as number))) {
    return fail(400, core ? "Choose a year level from Foundation to Year 10." : "Choose a year level from Foundation to Year 12, or All ages.");
  }
  const subject = String(b.subject || (core ? "" : "other")).toLowerCase() as QuestSubject | "other";
  if (core ? !QUEST_SUBJECTS.includes(subject as QuestSubject) : !(SPECIALIST_SUBJECTS as readonly string[]).includes(subject)) {
    return fail(400, "Choose Mathematics, English, Science, History or Geography.");
  }
  const topic = core ? "" : clip(b.topic, 60);
  if (!core && !topic && subject === "other") return fail(400, "Give a specialist book a topic, for example Numeracy or Mathematics Advanced.");
  let price_cents: number | null = null;
  if (b.price_cents !== undefined && b.price_cents !== null && b.price_cents !== "") {
    const p = Number(b.price_cents);
    if (!Number.isInteger(p) || p < 100 || p > 50000) return fail(400, "The price must be between $1 and $500, or left empty for members only.");
    price_cents = p;
  }
  let lessons_price_cents: number | null = null;
  if (b.lessons_price_cents !== undefined && b.lessons_price_cents !== null && b.lessons_price_cents !== "") {
    const p = Number(b.lessons_price_cents);
    if (!Number.isInteger(p) || p < 100 || p > 50000) return fail(400, "The book + lessons price must be between $1 and $500, or left empty.");
    if (price_cents === null) return fail(400, "Set the book price before the book + lessons price.");
    if (p < price_cents + 50) return fail(400, "The book + lessons price must be at least 50c more than the book price.");
    lessons_price_cents = p;
  }
  let lesson_price_cents: number | null = null;
  if (b.lesson_price_cents !== undefined && b.lesson_price_cents !== null && b.lesson_price_cents !== "") {
    const p = Number(b.lesson_price_cents);
    if (!Number.isInteger(p) || p < 50 || p > 5000) return fail(400, "The single lesson price must be between 50c and $50, or left empty.");
    lesson_price_cents = p;
  }
  let pages: number | null = null;
  if (b.pages !== undefined && b.pages !== null && b.pages !== "") {
    const n = Number(b.pages);
    if (!Number.isInteger(n) || n < 1 || n > 2000) return fail(400, "Pages must be a whole number from 1 to 2000.");
    pages = n;
  }
  return {
    ok: true,
    meta: { id, collection, year, subject, topic, title, subtitle: clip(b.subtitle, 160), description: clip(b.description, 2000), pages, price_cents, lessons_price_cents, lesson_price_cents, updated_at: now.toISOString() },
  };
}

type Listed = QuestBookMeta & { has_book: boolean; has_sample: boolean; has_cover: boolean; has_chapters: boolean; has_lessons: boolean; book_bytes: number | null; sample_bytes: number | null };

async function listBooks(bucket: R2Bucket | undefined): Promise<Listed[]> {
  if (!bucket) return [];
  const files = new Map<string, Partial<Record<FileKind | "chapters" | "lessons", number>>>();
  const metaIds: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: ROOT, limit: 1000, cursor });
    for (const obj of page.objects) {
      const m = /^([a-z0-9-]+)\/(meta\.json|book\.pdf|sample\.pdf|cover\.png|chapters\.json|lessons\.json)$/.exec(obj.key.slice(ROOT.length));
      if (!m || !VALID_ID.test(m[1])) continue;
      if (m[2] === "meta.json") { metaIds.push(m[1]); continue; }
      const kind = m[2].split(".")[0] as FileKind | "chapters" | "lessons";
      files.set(m[1], { ...(files.get(m[1]) || {}), [kind]: obj.size });
    }
    cursor = page.truncated ? (page as any).cursor : undefined;
  } while (cursor);
  const metas = await Promise.all(metaIds.map((id) => readMeta(bucket, id)));
  return metas
    .filter((m): m is QuestBookMeta => !!m)
    .map((m) => {
      const f = files.get(m.id) || {};
      return { ...m, has_book: f.book !== undefined, has_sample: f.sample !== undefined, has_cover: f.cover !== undefined, has_chapters: f.chapters !== undefined, has_lessons: f.lessons !== undefined, book_bytes: f.book ?? null, sample_bytes: f.sample ?? null };
    })
    .sort((a, b) => (a.year ?? 99) - (b.year ?? 99) || QUEST_SUBJECTS.indexOf(a.subject as QuestSubject) - QUEST_SUBJECTS.indexOf(b.subject as QuestSubject) || a.title.localeCompare(b.title));
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

/** member: every book and its lessons. Otherwise a family gets what it bought ("book" or "plus"), plus every sample. */
async function accessFor(db: DB, familyId: string, userId: string | null) {
  const owner = userId ? await ownerPowers(db, { id: userId, family_id: familyId }) : false;
  const { plan, limits } = await getEntitlement(db, familyId);
  const member = owner || limits.aiGeneration; // the paid-plan marker, as the Printable Vault uses
  const tiers = member ? new Map<string, Tier>() : await ownedTiers(db, familyId);
  return { owner, member, preview: plan === "FREE_PREVIEW", owned: new Set(tiers.keys()), tiers };
}
type Access = Awaited<ReturnType<typeof accessFor>>;
const hasBook = (a: Access, id: string) => a.member || a.tiers.has(id);
const hasLessons = (a: Access, id: string) => a.member || a.tiers.get(id) === "plus";

const fileName = (m: QuestBookMeta, kind: "book" | "sample") =>
  `Side-Quest ${yearLabel(m.year)} ${subjectLabel(m)} - ${m.title}${kind === "sample" ? " (sample)" : ""}.pdf`.replace(/[\\/:*?"<>|]/g, "");

function out(b: Listed, a: Access, canBuy: boolean) {
  const full = hasBook(a, b.id);
  const tier = a.tiers.get(b.id);
  const plusOnSale = !a.member && b.has_book && b.has_lessons && b.lessons_price_cents !== null && canBuy && tier !== "plus";
  return {
    id: b.id, collection: b.collection, topic: b.topic, year: b.year, year_label: yearLabel(b.year), subject: b.subject, subject_label: subjectLabel(b),
    title: b.title, subtitle: b.subtitle, description: b.description, pages: b.pages, price_cents: b.price_cents,
    has_book: b.has_book, has_sample: b.has_sample, has_cover: b.has_cover, book_bytes: b.book_bytes,
    can_download: full && b.has_book,
    owned: a.owned.has(b.id),
    can_buy: !full && b.has_book && b.price_cents !== null && canBuy,
    lessons_price_cents: b.lessons_price_cents, lesson_price_cents: b.lesson_price_cents, has_lessons: b.has_lessons, has_chapters: b.has_chapters,
    owned_tier: tier || null,
    can_add_lessons: b.has_lessons && hasLessons(a, b.id),
    can_buy_lesson: !a.member && b.has_lessons && b.lesson_price_cents !== null && canBuy && tier !== "plus",
    // A family that bought the book alone upgrades for the difference.
    can_buy_plus: plusOnSale,
    plus_price_cents: plusOnSale ? (tier === "book" ? b.lessons_price_cents! - (b.price_cents ?? 0) : b.lessons_price_cents) : null,
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
      specialist_years: SPECIALIST_YEARS.map((y) => ({ year: y, label: yearLabel(y) })),
      collections: QUEST_COLLECTIONS,
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
    // The lesson list (titles only) is shown to everyone; adding lessons needs membership or a "book + lessons" purchase.
    const published = book.has_lessons ? await readPublished(c.env.BUCKET, id) : [];
    const mine = published.length ? await familyBookLessons(c.env.DB, user.family_id, id) : new Map();
    const boughtKeys = published.length && !a.member ? await ownedLessonKeys(c.env.DB, user.family_id, id) : new Set<string>();
    const allLessons = hasLessons(a, id);
    c.header("Cache-Control", "private, no-store");
    return c.json({
      member: a.member, preview: a.preview, book: out(book, a, billingConfig(c.env).ok),
      lessons: published.map((l, i) => ({ key: l.key, position: i + 1, title: l.title, chapter_title: l.chapter_title, lesson_id: mine.get(l.key) || null, unlocked: allLessons || boughtKeys.has(l.key) })),
    });
  });

  // A small "peek inside" for a published lesson, so parents can see what they'd be buying.
  // Only a taste: goals, the opening, section headings and counts. Never the worked examples, questions or answers.
  app.get("/api/quest-books/books/:id/lessons/:key/preview", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    const key = c.req.param("key");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Lesson not found" }, 404);
    const user = c.get("user");
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    const book = (await listBooks(c.env.BUCKET)).find((b) => b.id === id && (a.owner || b.has_book));
    const lesson = book && book.has_lessons ? (await readPublished(c.env.BUCKET, id)).find((l) => l.key === key) : null;
    if (!lesson) return c.json({ detail: "Lesson not found" }, 404);
    c.header("Cache-Control", "private, no-store");
    return c.json(lessonPreview(lesson));
  });

  // Copy the book's ready-made chapter lessons into the family's library (members and "book + lessons" buyers).
  app.post("/api/quest-books/books/:id/lessons/add", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const user = c.get("user");
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    const published = await readPublished(c.env.BUCKET, id);
    if (!published.length) return c.json({ detail: "This book doesn't have lessons yet." }, 404);
    const body: any = await c.req.json().catch(() => ({}));
    const wanted = typeof body?.key === "string" ? published.filter((l) => l.key === body.key) : published;
    const bought = hasLessons(a, id) ? null : await ownedLessonKeys(c.env.DB, user.family_id, id);
    const allowed = bought ? wanted.filter((l) => bought.has(l.key)) : wanted;
    if (!allowed.length) return c.json({ code: "UPGRADE_REQUIRED", detail: "This book's lessons come with Family Membership, the book + lessons bundle, or one at a time." }, 402);
    const meta = await readMeta(c.env.BUCKET, id);
    const r = await addPublishedLessons(c.env.DB, user.family_id, id, meta?.title || id, allowed, a.member);
    if (!r.ok) return c.json({ detail: r.detail }, r.status as any);
    return c.json(r);
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
    if (!hasBook(a, id)) {
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
    const body: any = await c.req.json().catch(() => ({}));
    const tier: Tier | "lesson" = body?.tier === "plus" ? "plus" : body?.tier === "lesson" ? "lesson" : "book";
    const lessonKey = tier === "lesson" ? clip(body?.lesson_key, 40) : "";
    let lessonTitle = "";
    if (meta.price_cents === null) return c.json({ code: "MEMBERS_ONLY", detail: "This book is included with Family Membership and isn't sold separately." }, 409);
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    if (a.member) return c.json({ code: "ALREADY_INCLUDED", detail: "Your Family Membership already includes every Quest Book." }, 409);
    const owned = a.tiers.get(id);
    let amount = meta.price_cents;
    if (tier === "lesson") {
      const published = await readPublished(c.env.BUCKET, id);
      const l = published.find((x) => x.key === lessonKey);
      if (!l || meta.lesson_price_cents === null) return c.json({ code: "NO_LESSONS", detail: "This lesson isn't for sale on its own." }, 409);
      if (owned === "plus" || (await ownedLessonKeys(c.env.DB, user.family_id, id)).has(lessonKey)) return c.json({ code: "ALREADY_OWNED", detail: "You already have this lesson." }, 409);
      amount = meta.lesson_price_cents;
      lessonTitle = l.title;
    } else if (tier === "plus") {
      if (meta.lessons_price_cents === null || !(await c.env.BUCKET.head(keyFor(id, "lessons")))) return c.json({ code: "NO_LESSONS", detail: "This book's lessons aren't for sale yet." }, 409);
      if (owned === "plus") return c.json({ code: "ALREADY_OWNED", detail: "You already have this book and its lessons." }, 409);
      amount = owned === "book" ? meta.lessons_price_cents - meta.price_cents : meta.lessons_price_cents;
    } else if (owned) {
      return c.json({ code: "ALREADY_OWNED", detail: "You already own this book." }, 409);
    }
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
            unit_amount: amount,
            product_data: {
              name: tier === "lesson" ? `Quest Book lesson: ${lessonTitle}`.slice(0, 250) : tier === "plus" ? `Quest Book + lessons: ${meta.title}` : `Quest Book: ${meta.title}`,
              description: (tier === "lesson" ? `${meta.title} · ${yearLabel(meta.year)} ${subjectLabel(meta)} · ready-made lesson` : tier === "plus"
                ? `${yearLabel(meta.year)} ${subjectLabel(meta)} · PDF book and ready-made lessons${owned === "book" ? " (upgrade)" : ""}`
                : `${yearLabel(meta.year)} ${subjectLabel(meta)} · digital download (PDF)`).slice(0, 250),
            },
          },
        }],
        metadata: { kind: "quest_book", family_id: user.family_id, book_id: id, tier, price_cents: String(amount), ...(tier === "lesson" ? { lesson_key: lessonKey } : {}) },
        payment_intent_data: { metadata: { kind: "quest_book", family_id: user.family_id, book_id: id, tier } },
        success_url: `${origin}/parent/quest-books/${id}?purchase=success&tier=${tier}${lessonKey ? `&key=${lessonKey}` : ""}`,
        cancel_url: `${origin}/parent/quest-books/${id}?purchase=cancelled`,
      }, { idempotencyKey: `sq-book-${user.family_id}-${id}-${tier}${lessonKey ? "-" + lessonKey : ""}-${amount}-${Math.floor(Date.now() / 60000)}` });
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

  // Chapters read from the PDF's bookmarks in the owner's browser. Body: { chapters: [{ title, start, end, text }] }.
  app.put("/api/quest-books/admin/books/:id/chapters", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Book not found" }, 404);
    if (Number(c.req.header("content-length") || "0") > 3_000_000) return c.json({ detail: "Too much chapter text." }, 413);
    const checked = validateChapters(await c.req.json().catch(() => null));
    if (!checked.ok) return c.json({ detail: checked.detail }, checked.status as any);
    await c.env.BUCKET!.put(keyFor(id, "chapters"), JSON.stringify({ chapters: checked.chapters }), { httpMetadata: { contentType: "application/json" } });
    return c.json({ ok: true, chapters: checked.chapters.map(({ text, ...ch }) => ({ ...ch, chars: text.length })) });
  });

  // The owner's working view: chapters, the owner's draft lesson for each, and what's published.
  app.get("/api/quest-books/admin/books/:id/chapters", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Book not found" }, 404);
    const user = c.get("user");
    const chapters = await readChapters(c.env.BUCKET!, id);
    const published = await readPublished(c.env.BUCKET!, id);
    const { results } = await c.env.DB.prepare(`SELECT id, title, status, updated_at, json_extract(data, '$.quest_chapter_id') AS ch FROM lessons
      WHERE family_id = ? AND archived_at IS NULL AND json_valid(data) AND json_extract(data, '$.quest_book_id') = ?
      AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book' ORDER BY updated_at DESC`).bind(user.family_id, id).all<any>();
    const drafts = new Map<string, any>();
    for (const r of results || []) if (r.ch && !drafts.has(r.ch)) drafts.set(r.ch, { lesson_id: r.id, title: r.title, status: r.status, updated_at: r.updated_at });
    c.header("Cache-Control", "no-store");
    return c.json({
      chapters: chapters.map(({ text, ...ch }) => ({ ...ch, chars: text.length, draft: drafts.get(ch.id) || null, published: published.some((p) => p.chapter_id === ch.id) })),
      published_count: published.length,
    });
  });

  // Draft a lesson from one chapter with the normal AI lesson generator, into the owner's own library for review.
  app.post("/api/quest-books/admin/books/:id/chapters/:cid/draft", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const cid = c.req.param("cid");
    const meta = VALID_ID.test(id) ? await readMeta(c.env.BUCKET!, id) : null;
    const chapter = meta ? (await readChapters(c.env.BUCKET!, id)).find((ch) => ch.id === cid) : null;
    if (!meta || !chapter) return c.json({ detail: "Chapter not found" }, 404);
    const user = c.get("user");
    const level = yearLabel(meta.year);
    const r = await draftLessonWithAi(c.env.DB, c.env.AI, {
      familyId: user.family_id, userId: user.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID,
      compact: c.env.AI_COMPACT_GENERATION === "true", fastPipeline: fastLessonPipelineEnabled(c.env as any), splitStages: splitLessonStagesEnabled(c.env as any),
      request: {
        request: `Create one complete ${level} ${subjectLabel(meta)} lesson teaching the chapter "${chapter.title}" from the workbook "${meta.title}". Base the lesson on the chapter text provided: teach the same skills, in the same order, at the same level.`,
        source_text: chapter.text,
        link_outcomes: true,
      } as any,
      questBook: { bookId: id, bookTitle: meta.title, chapterId: chapter.id, chapterTitle: chapter.title },
    });
    if (!r.ok) return c.json({ detail: r.detail, code: (r as any).code }, r.status as any);
    return c.json({ lesson: r.lesson, warnings: r.warnings });
  });

  // Publish the owner's reviewed lessons to the book. Body: { items: [{ chapter_id, lesson_id }] } in chapter order.
  // Snapshots each lesson; editing it later doesn't change what's published until the owner publishes again.
  app.post("/api/quest-books/admin/books/:id/lessons/publish", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Book not found" }, 404);
    const body: any = await c.req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? body.items.slice(0, MAX_CHAPTERS) : [];
    const chapters = await readChapters(c.env.BUCKET!, id);
    const user = c.get("user");
    const lessons: Published[] = [];
    for (const it of items) {
      const ch = chapters.find((x) => x.id === it?.chapter_id);
      if (!ch) return c.json({ detail: "One of the chapters no longer exists. Refresh and try again." }, 400);
      const row = await ownLesson(c.env.DB, user.family_id, String(it?.lesson_id || ""));
      if (!row || row.archived_at) return c.json({ detail: `The lesson for “${ch.title}” wasn't found in your library.` }, 400);
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(row.data || "{}"); } catch {}
      const { quest_book_id, quest_book_title, quest_chapter_id, quest_chapter_title, quest_lesson_key, ai_flags, ...clean } = data as any;
      lessons.push({ key: ch.id, chapter_id: ch.id, chapter_title: ch.title, title: String(row.title), stage: String(row.stage || ""), learning_area: String(row.learning_area || ""), data: clean });
    }
    if (!lessons.length) {
      await c.env.BUCKET!.delete(keyFor(id, "lessons"));
      return c.json({ ok: true, published: 0 });
    }
    await c.env.BUCKET!.put(keyFor(id, "lessons"), JSON.stringify({ lessons, published_at: new Date().toISOString() }), { httpMetadata: { contentType: "application/json" } });
    if (!(await c.env.BUCKET!.head(keyFor(id, "lessons")))) return c.json({ detail: "Storage confirmation failed; please retry." }, 502);
    return c.json({ ok: true, published: lessons.length });
  });

  // Removes the whole book. Families who bought it keep their purchase record (and anything they already downloaded).
  app.delete("/api/quest-books/admin/books/:id", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "No book with that id is stored." }, 404);
    const keys = (["meta", "chapters", "lessons", ...FILE_KINDS] as const).map((k) => keyFor(id, k));
    await c.env.BUCKET!.delete(keys);
    const after = await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)));
    if (after.some(Boolean)) return c.json({ detail: "The book could not be fully deleted. Please retry." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id });
  });
}
