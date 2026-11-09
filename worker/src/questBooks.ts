// Quest Books: Side-Quest's own downloadable subject books (Maths, English, Science, History, Geography) per year level.
//
// Ground rules
// - Each book is a finished PDF the platform owner uploads, with an optional sample PDF and cover PNG. Everything lives
//   only in the private R2 bucket (quest-books/v1/<id>/...), never in this public repository.
// - Active Family Membership reads core books online and prints selected pages. Only the owner or buyers can download full PDFs; signed-in families can get samples.
//   A family without membership can buy one whole book (owner-set price, Stripe Checkout); only the signature-verified
//   webhook records the purchase (questBookPurchases.ts), and the family can then download that book for good.
// - Books without a full PDF yet are drafts: only the owner sees them.
import type { App, Guards, Env } from "./types";
import { getEntitlement } from "./lessonBuilder";
import { isPlatformOwner } from "./access";
import { ownerPowers } from "./viewAs";
import { authenticateToken, verifyFileTokenUser } from "./session";
import { billingConfig, stripeCall, appOrigin } from "./billing";
import { squareConfig, createCartPaymentLink, createShopPaymentLink } from "./square";
import { loadPlatformSettings } from "./platformSettings";
import { createShopOrder, shopOrderFor, resendShopLinks, ensureShopOrders, MAX_SHOP_DOWNLOADS, type ShopLine } from "./shopOrders";
import { priceItems, publicCatalog, squareLinesFor } from "./shopRoutes";
import { guidedProductState } from "./documentEntitlement";
import { quoteStandardPost, ShippingQuoteError } from "./shopShipping";

/** Books can be sold when Square (preferred) or Stripe is configured. */
const canSell = (env: any) => squareConfig(env).ok || billingConfig(env).ok;
import { ownedTiers, ownedLessonKeys, ensurePurchaseTable, ensureLessonTable, saveCart, cartPaid, type Tier, type CartLine } from "./questBookPurchases";
import { familyOutcomeCodes, countLessons, ownLesson } from "./lessonBuilder";
import { codesForAllFrameworks, lessonYears, poolFor, suggestFromCatalogue, type FrameworkCodes } from "./questOutcomes";
import { catalogueFor } from "./outcomeTracker";
import { getFamilyJurisdiction } from "./data/jurisdictions";
import { draftLessonWithAi, refineLessonWithAi, applyLessonPatch, DEFAULT_MODEL } from "./aiDraft";
import { planBookAiRepair } from "./questBookRepairs";
import { validatePlanRequest, suggestBookSubsections } from "./questBookSubsections";
import { fastLessonPipelineEnabled, splitLessonStagesEnabled } from "./aiPipeline";

type DB = D1Database;

export const QUEST_SUBJECTS = ["mathematics", "english", "science", "history", "geography", "pdhpe", "creative-arts"] as const;
/** The year-level shelf has the five core subjects; PDHPE and Creative Arts are for specialist books only. */
export const CORE_SUBJECTS = new Set<string>(["mathematics", "english", "science", "history", "geography"]);
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
  { id: "life-skills", label: "Life skills", blurb: "Money, cooking, first aid, safety and everyday maths and literacy." },
  { id: "unit-studies", label: "Unit studies", blurb: "Themed books that weave several subjects together: space, the ocean, dinosaurs, ancient Egypt and more." },
  { id: "first-nations", label: "First Nations perspectives", blurb: "Country and place, seasons, languages and stories of Aboriginal and Torres Strait Islander peoples." },
  { id: "coding", label: "Coding & digital tech", blurb: "Scratch, Python, micro:bit, how computers work and staying safe online." },
  { id: "nature", label: "Nature & outdoor learning", blurb: "Nature journals, bush walks, backyard science and citizen science." },
  { id: "wellbeing", label: "Wellbeing & feelings", blurb: "Emotions, calm-down strategies, friendships and resilience." },
  { id: "growing-up", label: "Growing up", blurb: "Gentle, age-appropriate books about puberty and body changes for girls and boys." },
  { id: "languages", label: "Languages", blurb: "Beginner workbooks for Japanese, Indonesian, French, Auslan and more." },
  { id: "early-learning", label: "Early learning (ages 3–5)", blurb: "Fine motor skills, pre-writing, counting, colours and shapes before school." },
  { id: "learning-support", label: "Learning support", blurb: "Dyslexia-friendly reading, maths foundations and visual supports for learners who need a different path." },
  { id: "seasonal", label: "Seasonal & events", blurb: "Activity books for the monthly themes and special weeks like NAIDOC Week and Science Week." },
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
  pdhpe: "PDHPE",
  "creative-arts": "Creative Arts",
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
const MAX_CHAPTERS = 250; // Workbook chapters are divided into multiple skill-level subsections.
const MAX_CHAPTER_TEXT = 30000;
type Chapter = { id: string; title: string; start: number; end: number; text: string; skill_goal?: string; exercise_ref?: string; unit_title?: string; source_abbreviated?: boolean };

/** Stable fingerprint of the exact session source and its page references. A changed plan needs a new draft. */
export function chapterRevision(ch: Chapter): string {
  const parts: (string | number)[] = [ch.title, ch.start, ch.end, ch.text, ch.skill_goal || "", ch.exercise_ref || ""];
  if (ch.unit_title) parts.push(ch.unit_title); // Do not stale pre-existing lessons without chapter metadata.
  if (ch.source_abbreviated) parts.push("SELECTED_EXCERPTS");
  const input = JSON.stringify(parts);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) hash = Math.imul(hash ^ input.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(36);
}

/** New book-companion lessons must be full teachable and printable lessons, not chapter summaries. */
export function companionLessonIssues(d: any): string[] {
  const n = (value: any) => Array.isArray(value) ? value.length : 0;
  const issues: string[] = [];
  if (n(d.objectives) < 2) issues.push("at least two learning objectives");
  if (n(d.sections) < 2 || (d.sections || []).some((x: any) => !String(x?.body || "").trim())) issues.push("two complete teaching explanations");
  if (n(d.worked_examples) < 2 || (d.worked_examples || []).some((x: any) => n(x?.steps) < 2 || !x?.answer)) issues.push("two worked examples with complete steps and answers");
  if (n(d.guided_practice) < 4 || (d.guided_practice || []).some((x: any) => !x?.prompt || !x?.answer)) issues.push("four answered guided practice questions");
  if (n(d.activities) < 2 || (d.activities || []).some((a: any) => n(a?.tasks) < 3 || a.tasks.some((t: any) => !t?.prompt || !t?.answer))) issues.push("two independent activities with three answered tasks each");
  if (n(d.questions) < 3 || (d.questions || []).some((q: any) => !q?.answer_key)) issues.push("three written questions with marking guidance");
  if (n(d.quiz) < 3 || (d.quiz || []).some((q: any) => !Array.isArray(q?.options) || q.options.length < 2 || !Number.isInteger(q?.correct_index) || q.correct_index < 0 || q.correct_index >= q.options.length)) issues.push("three valid assessment questions");
  if (!String(d.parent_script || "").trim() || !String(d.answer_key || "").trim()) issues.push("parent teaching notes and complete answer key");
  return issues;
}

/** Owner-supplied chapters (read from the PDF's bookmarks in the owner's browser). */
export function validateChapters(raw: unknown): { ok: true; chapters: Chapter[] } | Fail {
  const list = (raw as any)?.chapters;
  if (!Array.isArray(list)) return fail(400, "Chapters are missing.");
  if (list.length > MAX_CHAPTERS) return fail(400, `A book can have at most ${MAX_CHAPTERS} chapters.`);
  const chapters: Chapter[] = [];
  const ids = new Set<string>();
  for (const [i, c] of list.entries()) {
    const title = clip(c?.title, 120);
    const start = Number(c?.start), end = Number(c?.end);
    if (!title) return fail(400, `Chapter ${i + 1} needs a title.`);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > 5000) return fail(400, `Chapter ${i + 1} has invalid pages.`);
    const text = typeof c?.text === "string" ? c.text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, " ").slice(0, MAX_CHAPTER_TEXT) : "";
    if (text.replace(/\s/g, "").length < 40) return fail(400, `Chapter “${title}” has no readable text. Make sure the PDF has real text, not just pictures of pages.`);
    const skill_goal = clip(c?.skill_goal, 220);
    const exercise_ref = clip(c?.exercise_ref, 160);
    const unit_title = clip(c?.unit_title, 120);
    const source_abbreviated = c?.source_abbreviated === true;
    // Preserve IDs on rescans/splits. Lesson purchases and family copies are keyed by this ID.
    const suppliedId = clip(c?.id, 40);
    const sessionId = suppliedId || `c${i + 1}`; // Backward compatibility for older clients and saved books.
    if (!/^(?:c[1-9][0-9]*|s-[a-z0-9]{20})$/.test(sessionId) || ids.has(sessionId))
      return fail(400, `Chapter “${title}” has a missing, duplicate or invalid stable lesson ID. Re-read the PDF and try again.`);
    ids.add(sessionId);
    chapters.push({ id: sessionId, title, start, end, text, ...(skill_goal ? { skill_goal } : {}), ...(exercise_ref ? { exercise_ref } : {}), ...(unit_title ? { unit_title } : {}), ...(source_abbreviated ? { source_abbreviated } : {}) });
  }
  return { ok: true, chapters };
}

/** A chapter lesson as published to a book: a snapshot of the owner's reviewed lesson. */
type Published = { key: string; chapter_id: string; chapter_title: string; title: string; stage: string; learning_area: string; data: Record<string, unknown>; codes?: FrameworkCodes };

const snip = (v: unknown, n: number) => { const t = typeof v === "string" ? v.replace(/\s+/g, " ").trim() : ""; return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };
const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);

export function lessonPreview(l: Published) {
  const d: any = l.data || {};
  return {
    title: l.title, chapter_title: l.chapter_title, stage: l.stage, learning_area: l.learning_area,
    minutes: Number(d.duration_minutes) || null,
    book_pages: Number.isInteger(d.quest_page_start) && Number.isInteger(d.quest_page_end) ? { start: d.quest_page_start, end: d.quest_page_end } : null,
    skill_goal: snip(d.quest_skill_goal || "", 200),
    summary: snip(d.why_it_matters || d.summary || "", 260),
    objectives: (Array.isArray(d.objectives) ? d.objectives : []).slice(0, 4).map((o: unknown) => snip(o, 160)).filter(Boolean),
    opening: snip(d.introduction || "", 320),
    sections: (Array.isArray(d.sections) ? d.sections : []).map((s: any) => snip(s?.heading || s?.title, 90)).filter(Boolean).slice(0, 8),
    key_words: (Array.isArray(d.key_words) ? d.key_words : []).map((k: any) => snip(typeof k === "string" ? k : k?.word ?? k?.term, 40)).filter(Boolean).slice(0, 8),
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
export async function addPublishedLessons(db: DB, familyId: string, bookId: string, bookTitle: string, published: Published[], member: boolean, now: Date = new Date(), bookYear: number | null = null) {
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
  // Each family gets the outcome codes for its own state's curriculum (matched when the owner published).
  const cat = catalogueFor(await getFamilyJurisdiction(db, familyId).catch(() => null));
  const framework = cat.available ? cat.framework : null;
  let matched = 0;
  let without_matches = 0;
  for (const l of missing) {
    // Always use this family's catalogue. Published books can predate the
    // multi-framework snapshot, or the publishing-time matcher may have found
    // nothing. Never borrow NSW codes as the fallback for another state.
    const lesson = {
      ...l.data,
      title: l.title, stage: l.stage, learning_area: l.learning_area,
      ...(bookYear !== null ? { year_level: bookYear === 0 ? "Foundation" : `Year ${bookYear}` } : {}),
    };
    // Even a code from the correct state can be for the wrong YEAR or HASS
    // discipline in an older snapshot. Check it against this book's actual
    // year/subject pool, including VIC edition availability, before importing.
    const eligible = cat.available ? new Set(
      (bookYear !== null ? [bookYear] : lessonYears(lesson))
        .flatMap((year) => poolFor(cat, lesson, year).map((outcome) => outcome.code)),
    ) : new Set<string>();
    let mapped = framework && l.codes && Array.isArray(l.codes[framework]) ? l.codes[framework] : [];
    mapped = mapped.filter((code) => eligible.has(code));
    if (cat.available && !mapped.length) {
      mapped = (await suggestFromCatalogue(cat, lesson, undefined, {}, 3)).suggestions
        .map((suggestion) => suggestion.code).filter((code) => eligible.has(code));
    }
    const codes = await familyOutcomeCodes(db, familyId, mapped);
    if (codes.length) matched++; else without_matches++;
    const data = {
      ...l.data, outcome_codes: codes, curriculum_refs: codes,
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
  return { ok: true as const, added, already: have.size, total: published.length,
    framework, catalogue_name: cat.available ? cat.name : null, matched, without_matches,
    mapping_note: !cat.available
      ? "No state curriculum catalogue is available for your family. No NSW outcomes have been substituted."
      : "Links are suggested planning references, not certification that a lesson fully meets the curriculum." };
}

/**
 * Retire an outdated working AI draft only after its replacement has been
 * generated successfully. Never delete previously assigned or reviewed work.
 * Archived drafts are still available from the owner's archived library.
 */
export async function retireSupersededBookDrafts(db: DB, familyId: string, bookId: string, chapterId: string, newestId: string, now = new Date()) {
  const result = await db.prepare(`UPDATE lessons SET archived_at = ?, updated_at = ?
    WHERE family_id = ? AND archived_at IS NULL AND id != ? AND json_valid(data)
      AND json_extract(data, '$.quest_book_id') = ?
      AND json_extract(data, '$.quest_chapter_id') = ?
      AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book'
      AND json_extract(data, '$.ai_generated') = 1`)
    .bind(now.toISOString(), now.toISOString(), familyId, newestId, bookId, chapterId).run();
  return Number((result as any)?.meta?.changes || 0);
}

export async function readChapters(bucket: R2Bucket, id: string): Promise<Chapter[]> {
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
  /** Ready for families: shown in Quest Books and the public shop. Off until the owner switches it on for a finished book. */
  released: boolean;
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
  if (id === "cart") return fail(400, "“Cart” is reserved. Give the book a longer title.");
  const collection = COLLECTION_IDS.includes(String(b.collection)) ? String(b.collection) : "core";
  const core = collection === "core";
  const allAges = !core && (b.year === null || b.year === "" || b.year === "all" || b.year === undefined);
  const year = allAges ? null : Number(b.year);
  if (core ? !QUEST_YEARS.includes(year as number) : !(allAges || SPECIALIST_YEARS.includes(year as number))) {
    return fail(400, core ? "Choose a year level from Foundation to Year 10." : "Choose a year level from Foundation to Year 12, or All ages.");
  }
  const subject = String(b.subject || (core ? "" : "other")).toLowerCase() as QuestSubject | "other";
  if (core ? !QUEST_SUBJECTS.includes(subject as QuestSubject) : !(SPECIALIST_SUBJECTS as readonly string[]).includes(subject)) {
    return fail(400, core ? "Choose Mathematics, English, Science, History or Geography." : "Choose a subject, or Other with a topic.");
  }
  if (core && !CORE_SUBJECTS.has(subject)) {
    return fail(400, "Year-level books are Mathematics, English, Science, History or Geography. Put PDHPE and Creative Arts books on a specialist shelf.");
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
    meta: { id, collection, year, subject, topic, title, subtitle: clip(b.subtitle, 160), description: clip(b.description, 2000), pages, price_cents, lessons_price_cents, lesson_price_cents, released: b.released === true, updated_at: now.toISOString() },
  };
}

const MAX_LOOK_PAGES = 8;
const MAX_LOOK_BYTES = 900_000;
const lookKey = (id: string, n: number) => `${ROOT}${id}/look-${n}.jpg`;
// Reader pages: every page of the book as a picture, for members to read and print in the site (no PDF).
const MAX_READ_PAGES = 400;
const MAX_READ_BYTES = 2_500_000;
const readKey = (id: string, n: number) => `${ROOT}${id}/read/${n}.jpg`;
const READER_ID = /^[a-f0-9-]{36}$/i;
const readerManifestKey = (id: string) => `${ROOT}${id}/reader.json`;
const readerBuildKey = (id: string, generation: string, n: number) => `${ROOT}${id}/read-build/${generation}/${n}.jpg`;
type ReaderManifest = { generation: string; pages: number; source_id: string; created_at: string };
const pdfSourceId = (head: R2Object | null) => head ? String(head.etag || `size-${head.size}`) : "";
async function readerManifest(bucket: R2Bucket, id: string): Promise<ReaderManifest | null> {
  const obj = await bucket.get(readerManifestKey(id));
  if (!obj) return null;
  try {
    const parsed: any = JSON.parse(await new Response(obj.body).text());
    return READER_ID.test(String(parsed.generation)) && Number.isInteger(parsed.pages) && parsed.pages > 0 &&
      parsed.pages <= MAX_READ_PAGES && typeof parsed.source_id === "string" ? parsed as ReaderManifest : null;
  } catch { return null; }
}

type Listed = QuestBookMeta & { look_pages: number; read_pages: number; has_book: boolean; has_sample: boolean; has_cover: boolean; has_chapters: boolean; has_lessons: boolean; book_bytes: number | null; sample_bytes: number | null };

async function deleteReadPages(bucket: R2Bucket, id: string) {
  let cursor: string | undefined;
  for (const prefix of [`${ROOT}${id}/read/`, `${ROOT}${id}/read-build/`]) {
    cursor = undefined;
    do {
      const page = await bucket.list({ prefix, limit: 1000, cursor });
      const keys = page.objects.map((o) => o.key);
      if (keys.length) await bucket.delete(keys);
      cursor = page.truncated ? (page as any).cursor : undefined;
    } while (cursor);
  }
  await bucket.delete(readerManifestKey(id));
}

export async function listBooks(bucket: R2Bucket | undefined): Promise<Listed[]> {
  if (!bucket) return [];
  const files = new Map<string, Partial<Record<FileKind | "chapters" | "lessons", number>>>();
  const metaIds: string[] = [];
  const looks = new Map<string, number>();
  const reads = new Map<string, number>();
  const manifests = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix: ROOT, limit: 1000, cursor });
    for (const obj of page.objects) {
      const m = /^([a-z0-9-]+)\/(meta\.json|book\.pdf|sample\.pdf|cover\.png|chapters\.json|lessons\.json|look-[1-8]\.jpg|read\/[0-9]{1,3}\.jpg|reader\.json)$/.exec(obj.key.slice(ROOT.length));
      if (!m || !VALID_ID.test(m[1])) continue;
      if (m[2].startsWith("look-")) { looks.set(m[1], (looks.get(m[1]) || 0) + 1); continue; }
      if (m[2].startsWith("read/")) { reads.set(m[1], Math.max(reads.get(m[1]) || 0, Number(m[2].slice(5, -4)))); continue; }
      if (m[2] === "reader.json") { manifests.add(m[1]); continue; }
      if (m[2] === "meta.json") { metaIds.push(m[1]); continue; }
      const kind = m[2].split(".")[0] as FileKind | "chapters" | "lessons";
      files.set(m[1], { ...(files.get(m[1]) || {}), [kind]: obj.size });
    }
    cursor = page.truncated ? (page as any).cursor : undefined;
  } while (cursor);
  const metas = await Promise.all(metaIds.map((id) => readMeta(bucket, id)));
  const activeReaders = new Map<string, number>();
  await Promise.all([...manifests].map(async (id) => {
    const [manifest, source] = await Promise.all([readerManifest(bucket, id), bucket.head(keyFor(id, "book"))]);
    if (manifest && source && manifest.source_id === pdfSourceId(source)) activeReaders.set(id, manifest.pages);
  }));
  return metas
    .filter((m): m is QuestBookMeta => !!m)
    .map((m) => {
      const f = files.get(m.id) || {};
      return { ...m, look_pages: looks.get(m.id) || 0, read_pages: manifests.has(m.id) ? (activeReaders.get(m.id) || 0) : (reads.get(m.id) || 0), has_book: f.book !== undefined, has_sample: f.sample !== undefined, has_cover: f.cover !== undefined, has_chapters: f.chapters !== undefined, has_lessons: f.lessons !== undefined, book_bytes: f.book ?? null, sample_bytes: f.sample ?? null };
    })
    .sort((a, b) => (a.year ?? 99) - (b.year ?? 99) || QUEST_SUBJECTS.indexOf(a.subject as QuestSubject) - QUEST_SUBJECTS.indexOf(b.subject as QuestSubject) || a.title.localeCompare(b.title));
}

export async function readMeta(bucket: R2Bucket, id: string): Promise<QuestBookMeta | null> {
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
/** Families only see books the owner has marked ready, plus any book they already bought. The owner sees everything. */
const familyCanSee = (a: { owner: boolean; owned: Set<string> }, b: { id: string; released?: boolean }) => a.owner || !!b.released || a.owned.has(b.id);

async function accessFor(db: DB, familyId: string, userId: string | null) {
  const owner = userId ? await ownerPowers(db, { id: userId, family_id: familyId }) : false;
  const { plan, limits } = await getEntitlement(db, familyId);
  const member = owner || limits.aiGeneration; // the paid-plan marker, as the Printable Vault uses
  // Members can buy books too (specialist books, or a year-level PDF to keep), so purchases always count.
  const tiers = await ownedTiers(db, familyId);
  return { owner, member, preview: plan === "FREE_PREVIEW", owned: new Set(tiers.keys()), tiers };
}
type Access = Awaited<ReturnType<typeof accessFor>>;

/** Each book + lessons pack after a family's first is 10% cheaper again: 2nd 10% off, 3rd 20% ... capped at 50% off. */
export const PACK_STEP_PCT = 10;
export const PACK_MAX_PCT = 50;
export const packDiscountPct = (packsOwned: number) => Math.min(PACK_MAX_PCT, Math.max(0, packsOwned) * PACK_STEP_PCT);
export const packPrice = (fullCents: number, packsOwned: number) => Math.floor(fullCents * (100 - packDiscountPct(packsOwned)) / 100 + 1e-6);
/** What this family pays for this book's pack now. A family that already bought the book alone pays the difference (at least 50c). */
export function plusPriceFor(meta: { price_cents: number | null; lessons_price_cents: number | null }, ownedTier: Tier | undefined, packsOwned: number) {
  if (meta.lessons_price_cents === null) return null;
  const pack = packPrice(meta.lessons_price_cents, packsOwned);
  return ownedTier === "book" ? Math.max(50, pack - (meta.price_cents ?? 0)) : pack;
}
const packsOwned = (a: Access, exceptId?: string) => [...a.tiers].filter(([id, t]) => t === "plus" && id !== exceptId).length;
/**
 * Membership includes the year-level (core) books and their lessons, to read and print in the site while subscribed.
 * Specialist books (NAPLAN, HSC ...) are always bought separately. Only a purchase (or the owner) gets the PDF to keep.
 */
type BookLike = { id: string; collection?: string | null };
// Quest Books are bought separately by everyone (not included with membership). Only the owner gets them free.
const included = (a: Access, _b: BookLike) => a.owner;
const ownsPdf = (a: Access, id: string) => a.owner || a.tiers.has(id);
const canReadBook = (a: Access, b: BookLike) => included(a, b) || a.tiers.has(b.id);
const hasLessons = (a: Access, b: BookLike) => included(a, b) || a.tiers.get(b.id) === "plus";

const fileName = (m: QuestBookMeta, kind: "book" | "sample") =>
  `Side-Quest ${yearLabel(m.year)} ${subjectLabel(m)} - ${m.title}${kind === "sample" ? " (sample)" : ""}.pdf`.replace(/[\\/:*?"<>|]/g, "");

function out(b: Listed, a: Access, canBuy: boolean) {
  const inc = included(a, b);
  const tier = a.tiers.get(b.id);
  const plusOnSale = !inc && b.has_book && b.has_lessons && b.lessons_price_cents !== null && canBuy && tier !== "plus";
  return {
    id: b.id, collection: b.collection, topic: b.topic, year: b.year, year_label: yearLabel(b.year), subject: b.subject, subject_label: subjectLabel(b),
    title: b.title, subtitle: b.subtitle, description: b.description, pages: b.pages, price_cents: b.price_cents,
    has_book: b.has_book, has_sample: b.has_sample, has_cover: b.has_cover, book_bytes: b.book_bytes, look_pages: b.look_pages,
    read_pages: b.read_pages,
    included: inc,
    can_download: ownsPdf(a, b.id) && b.has_book,
    can_read: canReadBook(a, b) && b.read_pages > 0,
    owned: a.owned.has(b.id),
    // Members can still buy a year-level book to keep the PDF.
    can_buy: !a.tiers.has(b.id) && !a.owner && b.has_book && b.price_cents !== null && canBuy,
    lessons_price_cents: b.lessons_price_cents, lesson_price_cents: b.lesson_price_cents, has_lessons: b.has_lessons, has_chapters: b.has_chapters,
    ...(a.owner ? { released: !!b.released } : {}),
    owned_tier: tier || null,
    can_add_lessons: b.has_lessons && hasLessons(a, b),
    can_buy_lesson: !inc && b.has_lessons && b.lesson_price_cents !== null && canBuy && tier !== "plus",
    // A family that bought the book alone upgrades for the difference.
    can_buy_plus: plusOnSale,
    plus_price_cents: plusOnSale ? plusPriceFor(b, tier, packsOwned(a, b.id)) : null,
    plus_full_price_cents: plusOnSale ? (tier === "book" ? Math.max(50, b.lessons_price_cents! - (b.price_cents ?? 0)) : b.lessons_price_cents) : null,
    pack_discount_pct: plusOnSale ? packDiscountPct(packsOwned(a, b.id)) : 0,
    ...(a.owner ? { sample_bytes: b.sample_bytes, updated_at: b.updated_at } : {}),
  };
}

/** A cart item as the browser sends it. */
type CartItem = { book_id: string; tier: Tier | "lesson"; lesson_key?: string };
const MAX_CART = 30;

/**
 * Prices a cart on the server (the browser's prices are never trusted). Tidies it first: a pack replaces the same
 * book and its single lessons; things already owned are dropped. Each pack after the family's first is 10% cheaper
 * again, counting packs earlier in this cart too.
 */
export async function quoteCart(db: DB, bucket: R2Bucket, familyId: string, userId: string, raw: unknown) {
  const a = await accessFor(db, familyId, userId);
  const items: CartItem[] = (Array.isArray(raw) ? raw : []).slice(0, MAX_CART).map((x: any): CartItem => ({
    book_id: clip(x?.book_id, 64), tier: x?.tier === "plus" ? "plus" : x?.tier === "lesson" ? "lesson" : "book", lesson_key: clip(x?.lesson_key, 40) || undefined,
  })).filter((x) => VALID_ID.test(x.book_id) && (x.tier !== "lesson" || !!x.lesson_key));
  const books = new Map((await listBooks(bucket)).map((b) => [b.id, b]));
  // A pack in the cart covers that book and its lessons (unless membership already includes the lessons).
  const packIn = new Set(items.filter((x) => {
    const b = books.get(x.book_id);
    // Only a pack that can actually be bought covers the book: one with lessons for sale, not owned, not already included.
    return x.tier === "plus" && !!b && b.has_book && b.has_lessons && b.lessons_price_cents !== null && b.price_cents !== null
      && a.tiers.get(b.id) !== "plus" && !included(a, b);
  }).map((x) => x.book_id));
  const lines: (CartLine & { book_title: string; full_cents: number; note?: string })[] = [];
  const removed: { book_id: string; tier: string; lesson_key?: string; reason: string }[] = [];
  const seen = new Set<string>();
  let packs = packsOwned(a);
  const published = new Map<string, Published[]>();
  for (const it of items) {
    const key = `${it.book_id}|${it.tier}|${it.lesson_key || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const b = books.get(it.book_id);
    const drop = (reason: string) => removed.push({ book_id: it.book_id, tier: it.tier, ...(it.lesson_key ? { lesson_key: it.lesson_key } : {}), reason });
    if (!b || !b.has_book || !familyCanSee(a, b)) { drop("This book isn't available any more."); continue; }
    if (it.tier !== "book" && included(a, b)) { drop("Your Family Membership already includes this book's lessons."); continue; }
    if (b.price_cents === null) { drop("This book is only available with Family Membership."); continue; }
    const owned = a.tiers.get(b.id);
    if (it.tier !== "plus" && packIn.has(b.id)) continue; // the pack in the cart covers it
    if (it.tier === "book") {
      if (owned) { drop("You already own this book."); continue; }
      lines.push({ book_id: b.id, tier: "book", amount_cents: b.price_cents, full_cents: b.price_cents, title: `Quest Book: ${b.title}`, book_title: b.title });
    } else if (it.tier === "plus") {
      if (owned === "plus") { drop("You already have this book and its lessons."); continue; }
      if (!b.has_lessons || b.lessons_price_cents === null) { drop("This book's lessons aren't for sale yet."); continue; }
      const amount = plusPriceFor(b, owned, packs)!;
      const full = owned === "book" ? Math.max(50, b.lessons_price_cents - b.price_cents) : b.lessons_price_cents;
      lines.push({ book_id: b.id, tier: "plus", amount_cents: amount, full_cents: full, title: `Quest Book + lessons: ${b.title}${owned === "book" ? " (upgrade)" : ""}`, book_title: b.title,
        ...(packDiscountPct(packs) ? { note: `${packDiscountPct(packs)}% pack discount` } : {}) });
      packs++;
    } else {
      if (owned === "plus") { drop("Your pack already includes this lesson."); continue; }
      if (b.lesson_price_cents === null) { drop("This lesson isn't for sale on its own."); continue; }
      if (!published.has(b.id)) published.set(b.id, b.has_lessons ? await readPublished(bucket, b.id) : []);
      const l = published.get(b.id)!.find((x) => x.key === it.lesson_key);
      if (!l) { drop("This lesson isn't available any more."); continue; }
      if ((await ownedLessonKeys(db, familyId, b.id)).has(l.key)) { drop("You already have this lesson."); continue; }
      lines.push({ book_id: b.id, tier: "lesson", lesson_key: l.key, amount_cents: b.lesson_price_cents, full_cents: b.lesson_price_cents, title: `Lesson: ${l.title}`, book_title: b.title });
    }
  }
  return { member: a.member, lines, removed, total_cents: lines.reduce((n, l) => n + l.amount_cents, 0) };
}

/** Download links carry the files-only token (?ft=) so the browser can save a large PDF directly. */
async function familyFromRequest(c: any): Promise<{ familyId: string; userId: string | null } | null> {
  const header = c.req.header("Authorization") || "";
  if (header.startsWith("Bearer ")) {
    const auth = await authenticateToken(c.env, header.slice(7));
    return auth.ok && auth.user.role === "parent" ? { familyId: auth.user.family_id, userId: auth.user.id } : null;
  }
  // The files-only token names the parent too, so the owner (who never "buys" a book) can download it.
  const ft = c.req.query("ft");
  return ft ? await verifyFileTokenUser(c.env, ft) : null;
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

/** One guarded repair pass reused by individual review and unattended cross-book repairs.
 * Review and publication are NEVER automatic; each pass saves exact existing version.
 */
export async function repairQuestCompanionLessonPass(
  env: Env, user: { id: string; family_id: string },
  id: string, cid: string, lessonId: string, expectedVersion: number
): Promise<any> {
  if (!env.BUCKET || !VALID_ID.test(id) || !lessonId || !Number.isInteger(expectedVersion))
    return { ok: false, status: 400, detail: "Choose a current working book lesson." };
    const chapter = (await readChapters(env.BUCKET!, id)).find((ch) => ch.id === cid);
    if (!chapter) return { ...{ detail: "The book lesson plan changed. Reload before repairing." }, ok: false, status: 409 };
    const original = await ownLesson(env.DB, user.family_id, lessonId);
    if (!original || original.archived_at) return { ...{ detail: "The working lesson no longer exists." }, ok: false, status: 404 };
    if (original.version !== expectedVersion)
      return { ...{ detail: "The lesson changed since the last repair. Reload before continuing." }, ok: false, status: 409 };
    let before: Record<string, any>;
    try { before = JSON.parse(original.data || "{}"); } catch { return { ...{ detail: "The lesson cannot be read." }, ok: false, status: 409 }; }
    if (before.quest_book_id !== id || before.quest_chapter_id !== cid ||
      before.source === "side_quest_book" || before.ai_generated !== true)
      return { ...{ detail: "Only this book's original AI working lesson can be repaired here." }, ok: false, status: 403 };
    if (before.quest_source_revision !== chapterRevision(chapter))
      return { ...{ detail: "The workbook source changed. Re-analyse this lesson before repairing." }, ok: false, status: 409 };
    if (original.status !== "draft")
      return { ...{ detail: "Mark this lesson as Needs Repair to unlock AI repair without editing approved content." }, ok: false, status: 409 };
    const note = before.book_repair_requested === true && before.book_repair_ai_attempted !== true
      ? String(before.book_repair_note || "") : "";
    const plan = planBookAiRepair(before.ai_flags, companionLessonIssues(before), note);
    if (!plan.issues.length) {
        return { ok: true, changed: false, lesson_id: original.id, version: original.version,
        remaining: [], remaining_count: 0, owner_recheck: before.book_repair_requested === true };
    }
    const refined = await refineLessonWithAi(env.DB, env.AI, {
      familyId: user.family_id, userId: user.id, model: env.AI_MODEL, gatewayId: env.AI_GATEWAY_ID,
      lessonId: original.id, instruction: plan.instruction, target: plan.target,
    });
    if (!refined.ok) return { ...{ detail: refined.detail, code: (refined as any).code }, ok: false, status: refined.status };
    if (refined.base_version !== original.version)
      return { ...{ detail: "Another edit occurred during AI repair. The proposed changes were not applied." }, ok: false, status: 409 };
    const applied = await applyLessonPatch(env.DB, user.family_id, original.id,
      refined.patch, new Date(), original.version, { data: original.data, status: original.status });
    if (!applied.ok) return { ...{ detail: applied.detail, code: (applied as any).code }, ok: false, status: applied.status };
    const saved = await ownLesson(env.DB, user.family_id, original.id);
    if (!saved || saved.version !== applied.lesson.version)
      return { ...{ detail: "AI edits saved, but the final version could not be verified. Reload the lesson." }, ok: false, status: 502 };
    let current: Record<string, any>;
    try { current = JSON.parse(saved.data || "{}"); } catch {
      return { ...{ detail: "AI edits saved, but the lesson record could not be verified. Reload the lesson." }, ok: false, status: 502 };
    }
    if (current.quest_book_id !== id || current.quest_chapter_id !== cid ||
      current.quest_source_revision !== chapterRevision(chapter))
      return { ...{ detail: "AI edits saved, but the book link changed. Reload the lesson plan." }, ok: false, status: 409 };
    // Save the exact changed version to the Book Plan as part of this repair.
    // A manually reported error remains in Needs Repair until the owner reviews it.
    current.book_plan_saved_version = saved.version;
    current.book_plan_saved_at = new Date().toISOString();
    current.book_plan_saved_by = user.id;
    if (note) current.book_repair_ai_attempted = true;
    const changed = await env.DB.prepare(`UPDATE lessons SET data = ? WHERE id = ?
      AND family_id = ? AND version = ? AND status = 'draft' AND data = ? AND archived_at IS NULL`)
      .bind(JSON.stringify(current), saved.id, user.family_id, saved.version, saved.data).run();
    if (!changed.meta?.changes)
      return { ...{ detail: "The AI repair was saved, but the Book Plan link was not confirmed. Reload and inspect the lesson." }, ok: false, status: 409 };
    const confirmed = await ownLesson(env.DB, user.family_id, original.id);
    let finalData: Record<string, any>;
    try { finalData = JSON.parse(confirmed?.data || "{}"); } catch { finalData = {}; }
    if (!confirmed || Number(finalData.book_plan_saved_version) !== confirmed.version)
      return { ...{ detail: "The updated lesson was saved, but the Book Plan confirmation failed. Reload before continuing." }, ok: false, status: 502 };
    const remaining = planBookAiRepair(finalData.ai_flags, companionLessonIssues(finalData),
      finalData.book_repair_requested === true && finalData.book_repair_ai_attempted !== true ? finalData.book_repair_note : "");
    return { ok: true, changed: true, lesson_id: original.id, version: confirmed.version,
      repaired: plan.selected, remaining: remaining.issues, remaining_count: remaining.issues.length,
      owner_recheck: finalData.book_repair_requested === true, saved_to_plan: true };
}

/** Shared, exact source-grounded AI draft pipeline for interactive and overnight generation.
 * Overnight requests SKIP existing working lessons; they never remake or archive
 * something the owner has generated or reviewed already.
 */
export async function generateQuestCompanionLesson(
  env: Env,
  user: { id: string; family_id: string },
  id: string,
  cid: string,
  skipExisting = false
): Promise<any> {
  const meta = VALID_ID.test(id) && env.BUCKET ? await readMeta(env.BUCKET, id) : null;
  const chapter = meta && env.BUCKET ? (await readChapters(env.BUCKET, id)).find((ch) => ch.id === cid) : null;
  if (!meta || !chapter) return { ok: false, status: 404, detail: "Book chapter no longer exists." };
  if (chapter.text.length > 8000) return { ok: false, status: 400,
    detail: "This subsection contains over 8,000 source characters. Analyse and split it into smaller skills before generating." };
  if (skipExisting) {
    const existing = await env.DB.prepare(`SELECT id FROM lessons
      WHERE family_id = ? AND archived_at IS NULL AND json_valid(data)
      AND json_extract(data, '$.quest_book_id') = ?
      AND json_extract(data, '$.quest_chapter_id') = ?
      AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book'
      LIMIT 1`).bind(user.family_id, id, cid).first<{ id: string }>();
    if (existing) return { ok: true, skipped: true, lesson_id: existing.id };
  }
  const level = yearLabel(meta.year);
  const exerciseRef = chapter.exercise_ref || "Exercises on the specified workbook pages";
  const sourceNote = chapter.source_abbreviated ? "SOURCE LIMIT: The excerpt contains labelled samples from ALL pages in the subsection, not their full text. Base explanations on the stated skill; never invent quotations or claim to reproduce workbook text that was not provided." : "";
  const r = await draftLessonWithAi(env.DB, env.AI, {
    familyId: user.family_id, userId: user.id, model: env.AI_MODEL, gatewayId: env.AI_GATEWAY_ID,
    compact: env.AI_COMPACT_GENERATION === "true", fastPipeline: fastLessonPipelineEnabled(env), splitStages: splitLessonStagesEnabled(env),
    request: {
      topic: chapter.title, learning_area: subjectLabel(meta), year_level: level, duration_minutes: 60,
      delivery: meta.year !== null && meta.year <= 3 ? "parent_guided" : "independent",
      goal: chapter.skill_goal || chapter.title,
      request: `Create one COMPLETE, self-contained ${level} ${subjectLabel(meta)} lesson teaching subsection "${chapter.title}" from chapter "${chapter.unit_title || chapter.title}" in "${meta.title}". Use the exact source and teach the method before guided and independent practice. Do not try to teach adjacent skills from other subsections.`,
      notes: `WORKBOOK COMPANION: This lesson matches "${meta.title}", printed PDF pages ${chapter.start}–${chapter.end}. Parent-only optional follow-on practice reference: ${exerciseRef}. Include the workbook reference in parent_script/parent_notes, but teach and reproduce ALL necessary explanations, exercises, readings, data and responses inside the online lesson so it ALSO prints and assigns independently. Never require a child to open the PDF to complete the lesson. Match the depth of a normal Side-Quest lesson, not a chapter summary. ${sourceNote}`,
      source_text: chapter.text,
      link_outcomes: true,
    } as any,
    questBook: { bookId: id, bookTitle: meta.title, chapterId: chapter.id, chapterTitle: chapter.unit_title || chapter.title,
      pageStart: chapter.start, pageEnd: chapter.end, exerciseRef: chapter.exercise_ref || "", skillGoal: chapter.skill_goal || chapter.title, sourceRevision: chapterRevision(chapter) },
  });
  if (!r.ok) return r;
  if (!skipExisting) {
    try { await retireSupersededBookDrafts(env.DB, user.family_id, id, cid, String(r.lesson.id)); }
    catch (e: any) { console.error("Could not retire older Quest Book lesson drafts", e?.message || e); }
  }
  return { ok: true, lesson: r.lesson, warnings: r.warnings, skipped: false };
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
    const canBuy = canSell(c.env);
    const books = (await listBooks(c.env.BUCKET)).filter((b) => (a.owner || b.has_book) && familyCanSee(a, b));
    c.header("Cache-Control", "private, no-store");
    return c.json({
      member: a.member, preview: a.preview, owner: a.owner, can_buy: canBuy,
      subjects: QUEST_SUBJECTS.map((s) => ({ id: s, label: SUBJECT_LABEL[s], core: CORE_SUBJECTS.has(s) })),
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
    const book = (await listBooks(c.env.BUCKET)).find((b) => b.id === id && (a.owner || b.has_book) && familyCanSee(a, b));
    if (!book) return c.json({ detail: "Book not found" }, 404);
    // The lesson list (titles only) is shown to everyone; adding lessons needs membership or a "book + lessons" purchase.
    const published = book.has_lessons ? await readPublished(c.env.BUCKET, id) : [];
    const mine = published.length ? await familyBookLessons(c.env.DB, user.family_id, id) : new Map();
    const allLessons = hasLessons(a, book);
    const boughtKeys = published.length && !allLessons ? await ownedLessonKeys(c.env.DB, user.family_id, id) : new Set<string>();
    c.header("Cache-Control", "private, no-store");
    return c.json({
      member: a.member, preview: a.preview, owner: a.owner, book: out(book, a, canSell(c.env)),
      lessons: published.map((l, i) => ({ key: l.key, position: i + 1, title: l.title, chapter_title: l.chapter_title,
        book_pages: typeof l.data.quest_page_start === "number" && typeof l.data.quest_page_end === "number" &&
          Number.isInteger(l.data.quest_page_start) && Number.isInteger(l.data.quest_page_end)
          ? { start: l.data.quest_page_start, end: l.data.quest_page_end } : null,
        lesson_id: mine.get(l.key) || null, unlocked: allLessons || boughtKeys.has(l.key) })),
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
    const book = (await listBooks(c.env.BUCKET)).find((b) => b.id === id && (a.owner || b.has_book) && familyCanSee(a, b));
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
    const meta0 = await readMeta(c.env.BUCKET, id);
    if (!meta0 || !familyCanSee(a, meta0)) return c.json({ detail: "Book not found" }, 404);
    const bought = meta0 && hasLessons(a, meta0) ? null : await ownedLessonKeys(c.env.DB, user.family_id, id);
    const allowed = bought ? wanted.filter((l) => bought.has(l.key)) : wanted;
    if (!allowed.length) return c.json({ code: "UPGRADE_REQUIRED", detail: "This book's lessons come with Family Membership, the book + lessons bundle, or one at a time." }, 402);
    const meta = await readMeta(c.env.BUCKET, id);
    const r = await addPublishedLessons(c.env.DB, user.family_id, id, meta?.title || id, allowed, !!meta && included(a, meta) && !a.owner, new Date(), meta?.year ?? null);
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

  // "Look inside": a few low-resolution, watermarked page pictures made in the owner's browser. Any signed-in parent.
  app.get("/api/quest-books/books/:id/look/:n", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_LOOK_PAGES || !c.env.BUCKET) return c.json({ detail: "Page not found" }, 404);
    const obj = await c.env.BUCKET.get(lookKey(id, n));
    if (!obj) return c.json({ detail: "Page not found" }, 404);
    c.header("Content-Type", "image/jpeg");
    c.header("Cache-Control", "private, no-store");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  // Reader pages: members (year-level books), buyers and the owner read and print in the site.
  app.get("/api/quest-books/books/:id/read/:n", g.auth, g.parent, async (c) => {
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_READ_PAGES || !c.env.BUCKET) return c.json({ detail: "Page not found" }, 404);
    const user = c.get("user");
    const meta = await readMeta(c.env.BUCKET, id);
    if (!meta) return c.json({ detail: "Book not found" }, 404);
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    if (!familyCanSee(a, meta)) return c.json({ detail: "Book not found" }, 404);
    if (!canReadBook(a, meta)) return c.json({ code: "UPGRADE_REQUIRED", detail: "Reading this book in Side-Quest comes with Family Membership or buying the book." }, 402);
    const manifest = await readerManifest(c.env.BUCKET, id);
    const source = manifest ? await c.env.BUCKET.head(keyFor(id, "book")) : null;
    if (manifest && (!source || manifest.source_id !== pdfSourceId(source) || n > manifest.pages))
      return c.json({ detail: "These reader pages are being updated. Please return to the book." }, 409);
    const obj = await c.env.BUCKET.get(manifest ? readerBuildKey(id, manifest.generation, n) : readKey(id, n));
    if (!obj) return c.json({ detail: "Page not found" }, 404);
    c.header("Content-Type", "image/jpeg");
    c.header("Cache-Control", "private, no-store");
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

  // The full book PDF: the owner, or a family that bought it.
  app.get("/api/quest-books/books/:id/download", async (c) => {
    const who = await familyFromRequest(c);
    if (!who) return c.json({ detail: "This link has expired. Refresh the page and try again." }, 401);
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Book not found" }, 404);
    const a = await accessFor(c.env.DB, who.familyId, who.userId);
    if (!ownsPdf(a, id)) {
      return c.json({ code: "UPGRADE_REQUIRED", detail: "The PDF comes with buying the book. Members can read and print it in Side-Quest." }, 402);
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
    if (!familyCanSee(await accessFor(c.env.DB, user.family_id, user.id), meta)) return c.json({ detail: "Book not found" }, 404);
    const body: any = await c.req.json().catch(() => ({}));
    const tier: Tier | "lesson" = body?.tier === "plus" ? "plus" : body?.tier === "lesson" ? "lesson" : "book";
    const lessonKey = tier === "lesson" ? clip(body?.lesson_key, 40) : "";
    let lessonTitle = "";
    if (meta.price_cents === null) return c.json({ code: "MEMBERS_ONLY", detail: "This book isn't on sale yet." }, 409);
    const a = await accessFor(c.env.DB, user.family_id, user.id);
    if (tier !== "book" && included(a, meta)) return c.json({ code: "ALREADY_INCLUDED", detail: "Your Family Membership already includes this book's lessons." }, 409);
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
      amount = plusPriceFor(meta, owned, packsOwned(a, id))!;
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

  // ---------------------------------------------------------------- cart
  // The cart itself lives in the browser; the server prices it and starts one checkout for everything.
  app.post("/api/quest-books/cart/quote", g.auth, g.parent, async (c) => {
    if (!c.env.BUCKET) return c.json({ lines: [], removed: [], total_cents: 0 });
    const user = c.get("user");
    const body: any = await c.req.json().catch(() => ({}));
    c.header("Cache-Control", "private, no-store");
    return c.json({ ...(await quoteCart(c.env.DB, c.env.BUCKET, user.family_id, user.id, body?.items)), can_buy: canSell(c.env) });
  });

  app.post("/api/quest-books/cart/checkout", g.auth, g.parent, async (c) => {
    const sq = squareConfig(c.env);
    const cfg = billingConfig(c.env);
    if (!sq.ok && !cfg.ok) return c.json({ code: "BILLING_NOT_CONFIGURED", detail: "Buying books isn't available yet." }, 503);
    if (!c.env.BUCKET) return c.json({ detail: "Cart is empty." }, 400);
    const user = c.get("user");
    const body: any = await c.req.json().catch(() => ({}));
    const q = await quoteCart(c.env.DB, c.env.BUCKET, user.family_id, user.id, body?.items);
    if (!q.lines.length) return c.json({ code: "CART_EMPTY", detail: q.removed[0]?.reason || "Your cart is empty.", removed: q.removed }, 409);
    // The browser sends the total it showed: if prices changed since, show the new ones before charging.
    if (body?.expected_total_cents != null && Number(body.expected_total_cents) !== q.total_cents) return c.json({ code: "CART_CHANGED", detail: "Prices in your cart changed. Please check the new total.", quote: q }, 409);
    const cartId = await saveCart(c.env.DB, user.family_id, q.lines.map(({ book_id, tier, lesson_key, amount_cents, title }) => ({ book_id, tier, lesson_key, amount_cents, title })), q.total_cents);
    try {
      const parentRow = await c.env.DB.prepare("SELECT email FROM users WHERE id = ?").bind(user.id).first<{ email: string }>();
      const origin = appOrigin(c.env, c.req.url);
      if (sq.ok) {
        // Square: one hosted checkout for the whole cart (2.2%, no fixed fee per sale).
        const url = await createCartPaymentLink(sq, {
          cartId, familyId: user.family_id, email: parentRow?.email,
          redirectUrl: `${origin}/parent/quest-books/cart?purchase=success&cart=${cartId}`,
          lines: q.lines.map((l) => ({ name: l.title, amount_cents: l.amount_cents, note: l.note ? `${l.book_title} · ${l.note}` : l.book_title })),
        });
        return c.json({ url, cart_id: cartId });
      }
      if (!cfg.ok) throw new Error("no payment provider");
      const session = await stripeCall(cfg.key, "POST", "checkout/sessions", {
        mode: "payment",
        client_reference_id: user.family_id,
        ...(parentRow?.email ? { customer_email: parentRow.email } : {}),
        line_items: q.lines.map((l) => ({
          quantity: 1,
          price_data: { currency: "aud", unit_amount: l.amount_cents, product_data: { name: l.title.slice(0, 250), description: (l.note ? `${l.book_title} · ${l.note}` : l.book_title).slice(0, 250) } },
        })),
        metadata: { kind: "quest_cart", family_id: user.family_id, cart_id: cartId, total_cents: String(q.total_cents) },
        payment_intent_data: { metadata: { kind: "quest_cart", family_id: user.family_id, cart_id: cartId } },
        success_url: `${origin}/parent/quest-books/cart?purchase=success&cart=${cartId}`,
        cancel_url: `${origin}/parent/quest-books/cart?purchase=cancelled`,
      }, { idempotencyKey: `sq-cart-${cartId}` });
      return c.json({ url: session.url, cart_id: cartId });
    } catch (e: any) {
      console.error("quest cart checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  app.get("/api/quest-books/cart/:id/status", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    c.header("Cache-Control", "private, no-store");
    return c.json({ paid: await cartPaid(c.env.DB, user.family_id, clip(c.req.param("id"), 64)) });
  });

  // ---------------------------------------------------------------- owner

  // Explicitly COPY an owner's family lesson to an isolated official standalone
  // working draft. This is NOT publication: no catalogue or purchase access is granted.
  app.post("/api/quest-books/admin/lessons/:id/copy-to-standalone", g.auth, g.parent, ownerOnly, async (c) => {
    const user = c.get("user");
    const original = await ownLesson(c.env.DB, user.family_id, c.req.param("id"));
    if (!original || original.archived_at) return c.json({ detail: "Restore the lesson before copying it into the official library." }, 404);
    let data: Record<string, any>;
    try { data = JSON.parse(original.data || "{}"); } catch { return c.json({ detail: "The original lesson data could not be read." }, 409); }
    for (const key of ["quest_book_id", "quest_book_title", "quest_chapter_id", "quest_chapter_title",
      "quest_lesson_key", "quest_page_start", "quest_page_end", "quest_exercise_ref", "quest_skill_goal",
      "quest_source_revision", "book_reviewed_version", "book_reviewed_at", "book_reviewed_by"]) delete data[key];
    data.source = "side_quest_standalone";
    data.review_status = "official_standalone_draft";
    const lessonId = crypto.randomUUID();
    const now = new Date().toISOString();
    const title = (String(original.title).slice(0, 183) + " (official draft)").slice(0, 200);
    await c.env.DB.prepare(`INSERT INTO lessons
      (id, family_id, title, stage, learning_area, unit_id, status, data, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NULL, 'draft', ?, 1, ?, ?)`)
      .bind(lessonId, user.family_id, title, original.stage, original.learning_area, JSON.stringify(data), now, now).run();
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, lesson: { id: lessonId, title, status: "draft", source: "side_quest_standalone" },
      message: "Official standalone draft created. The original lesson remains private and unchanged. Nothing has been published." });
  });

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

  // Look-inside pages, uploaded one at a time as JPEGs (page n of up to 8). DELETE clears them all first.
  app.put("/api/quest-books/admin/books/:id/look/:n", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_LOOK_PAGES) return c.json({ detail: "Unknown book or page" }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Book not found" }, 404);
    if (c.req.header("content-type")?.split(";")[0].trim().toLowerCase() !== "image/jpeg") return c.json({ detail: "Look-inside pages must be JPEG images." }, 415);
    const bytes = await c.req.arrayBuffer();
    const head = new Uint8Array(bytes.slice(0, 3));
    if (!bytes.byteLength || bytes.byteLength > MAX_LOOK_BYTES || head[0] !== 0xff || head[1] !== 0xd8 || head[2] !== 0xff) return c.json({ detail: "That page picture is empty, too large or not a JPEG." }, 400);
    await c.env.BUCKET!.put(lookKey(id, n), bytes, { httpMetadata: { contentType: "image/jpeg" } });
    return c.json({ ok: true, n });
  });
  // Two-phase reader preparation: browser rendering happens in a bounded
  // upload pipeline; the existing reader stays live until ALL pages have been
  // uploaded and the owner explicitly commits the new generation.
  app.get("/api/quest-books/admin/books/:id/read-source", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book ID" }, 400);
    const source = await c.env.BUCKET!.head(keyFor(id, "book"));
    if (!source) return c.json({ detail: "Upload the book PDF first." }, 404);
    c.header("Cache-Control", "no-store");
    return c.json({ source_id: pdfSourceId(source), max_pages: MAX_READ_PAGES });
  });
  app.get("/api/quest-books/admin/books/:id/read-build/:generation/progress", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id"), generation = c.req.param("generation");
    if (!VALID_ID.test(id) || !READER_ID.test(generation)) return c.json({ detail: "Invalid reader generation." }, 400);
    const prefix = `${ROOT}${id}/read-build/${generation}/`;
    const page = await c.env.BUCKET!.list({ prefix, limit: 1000 });
    const uploaded = page.objects.map((o) => Number(o.key.slice(prefix.length).replace(/\.jpg$/, "")))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= MAX_READ_PAGES);
    c.header("Cache-Control", "no-store");
    return c.json({ uploaded });
  });
  app.put("/api/quest-books/admin/books/:id/read-build/:generation/:n", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id"), generation = c.req.param("generation"), n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !READER_ID.test(generation) || !Number.isInteger(n) || n < 1 || n > MAX_READ_PAGES)
      return c.json({ detail: "Invalid reader page." }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "book")))) return c.json({ detail: "Book PDF is missing." }, 404);
    if (c.req.header("content-type")?.split(";")[0].trim().toLowerCase() !== "image/jpeg")
      return c.json({ detail: "Reader pages must be JPEG images." }, 415);
    const bytes = await c.req.arrayBuffer();
    const head = new Uint8Array(bytes.slice(0, 3));
    if (!bytes.byteLength || bytes.byteLength > MAX_READ_BYTES || head[0] !== 0xff || head[1] !== 0xd8 || head[2] !== 0xff)
      return c.json({ detail: "This page is empty, too large, or not a JPEG." }, 400);
    await c.env.BUCKET!.put(readerBuildKey(id, generation, n), bytes, { httpMetadata: { contentType: "image/jpeg" } });
    return c.json({ ok: true, n });
  });
  app.post("/api/quest-books/admin/books/:id/read-build/:generation/finish", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id"), generation = c.req.param("generation");
    const body: any = await c.req.json().catch(() => ({}));
    const total = Number(body?.total);
    if (!VALID_ID.test(id) || !READER_ID.test(generation) || !Number.isInteger(total) || total < 1 || total > MAX_READ_PAGES ||
        typeof body?.source_id !== "string") return c.json({ detail: "Invalid reader job or page count." }, 400);
    const source = await c.env.BUCKET!.head(keyFor(id, "book"));
    if (!source || pdfSourceId(source) !== body.source_id)
      return c.json({ detail: "The book PDF changed during rendering. Reopen it and rebuild the members' reader." }, 409);
    const prefix = `${ROOT}${id}/read-build/${generation}/`;
    const objects = await c.env.BUCKET!.list({ prefix, limit: 1000 });
    if (objects.truncated) return c.json({ detail: "Too many reader objects were uploaded." }, 409);
    const received = new Set(objects.objects.map((o) => Number(o.key.slice(prefix.length).replace(/\.jpg$/, ""))));
    for (let i = 1; i <= total; i++) if (!received.has(i))
      return c.json({ detail: `Page ${i} has not finished uploading. Resume reader preparation.` }, 409);
    const ready: ReaderManifest = { generation, pages: total, source_id: body.source_id, created_at: new Date().toISOString() };
    await c.env.BUCKET!.put(readerManifestKey(id), JSON.stringify(ready), { httpMetadata: { contentType: "application/json" } });
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, pages: total, generation });
  });

  // Reader pages, uploaded one at a time (page n). DELETE clears them all before a fresh set is made.
  app.put("/api/quest-books/admin/books/:id/read/:n", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_READ_PAGES) return c.json({ detail: "Unknown book or page" }, 400);
    if (!(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Book not found" }, 404);
    if (c.req.header("content-type")?.split(";")[0].trim().toLowerCase() !== "image/jpeg") return c.json({ detail: "Reader pages must be JPEG images." }, 415);
    const bytes = await c.req.arrayBuffer();
    const head = new Uint8Array(bytes.slice(0, 3));
    if (!bytes.byteLength || bytes.byteLength > MAX_READ_BYTES || head[0] !== 0xff || head[1] !== 0xd8 || head[2] !== 0xff) return c.json({ detail: "That page picture is empty, too large or not a JPEG." }, 400);
    await c.env.BUCKET!.put(readKey(id, n), bytes, { httpMetadata: { contentType: "image/jpeg" } });
    return c.json({ ok: true, n });
  });
  app.delete("/api/quest-books/admin/books/:id/read", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    await deleteReadPages(c.env.BUCKET!, id);
    return c.json({ ok: true });
  });
  app.delete("/api/quest-books/admin/books/:id/look", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Invalid book id" }, 400);
    await c.env.BUCKET!.delete(Array.from({ length: MAX_LOOK_PAGES }, (_, i) => lookKey(id, i + 1)));
    return c.json({ ok: true });
  });

  // Chapters read from the PDF's bookmarks in the owner's browser. Body: { chapters: [{ title, start, end, text }] }.
  app.put("/api/quest-books/admin/books/:id/chapters", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !(await c.env.BUCKET!.head(keyFor(id, "meta")))) return c.json({ detail: "Book not found" }, 404);
    if (Number(c.req.header("content-length") || "0") > 3_000_000) return c.json({ detail: "Too much chapter text." }, 413);
    const checked = validateChapters(await c.req.json().catch(() => null));
    if (!checked.ok) return c.json({ detail: checked.detail }, checked.status as any);
    // Published keys may already be owned individually. Removing or silently
    // renumbering them during a rescan would orphan existing lesson purchases.
    const published = await readPublished(c.env.BUCKET!, id);
    const newKeys = new Set(checked.chapters.map((ch) => ch.id));
    const removed = published.find((lesson) => !newKeys.has(lesson.key));
    if (removed) return c.json({
      detail: `Keep the existing published session ID for “${removed.chapter_title}”. Families may already own this lesson. Edit its content or publish a new book edition rather than removing its purchase key.`,
      code: "PUBLISHED_LESSON_KEY_REMOVED",
    }, 409);
    await c.env.BUCKET!.put(keyFor(id, "chapters"), JSON.stringify({ chapters: checked.chapters }), { httpMetadata: { contentType: "application/json" } });
    return c.json({ ok: true, chapters: checked.chapters.map(({ text, ...ch }) => ({ ...ch, chars: text.length })) });
  });

  // Analyse ONE source chapter into focused subsections. This does not save or draft any lessons.
  // The owner's browser reads the already-uploaded PDF; only text from the selected chapter is sent to AI.
  app.post("/api/quest-books/admin/books/:id/chapters/plan", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const meta = VALID_ID.test(id) ? await readMeta(c.env.BUCKET!, id) : null;
    if (!meta || !(await c.env.BUCKET!.head(keyFor(id, "book")))) return c.json({ detail: "Book PDF not found" }, 404);
    if (!c.env.AI) return c.json({ detail: "The lesson planner is not enabled. No chapters have been changed." }, 503);
    if (Number(c.req.header("content-length") || "0") > 230_000) return c.json({ detail: "Chapter text is too large to plan at once." }, 413);
    const checked = validatePlanRequest(await c.req.json().catch(() => null));
    if (!checked.ok) return c.json({ detail: checked.detail }, 400);
    try {
      const subsections = await suggestBookSubsections(
        c.env.AI, checked.title, checked.pages, yearLabel(meta.year), subjectLabel(meta),
        c.env.AI_MODEL || DEFAULT_MODEL, c.env.AI_GATEWAY_ID,
      );
      return c.json({ chapter_title: checked.title, subsections });
    } catch (e: any) {
      console.warn("quest book chapter planning failed", e?.message || e);
      return c.json({ detail: "Could not identify reliable subsections for this chapter. No changes were saved. Try analysing this chapter again." }, 502);
    }
  });

  // Clean pre-launch rebuild. Leaves the Book PDF, cover, preview, metadata,
  // pricing and student assignment history untouched; only the owner's
  // generated lesson workspace and published lesson list are reset.
  app.post("/api/quest-books/admin/books/:id/lessons/reset", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !(await c.env.BUCKET!.head(keyFor(id, "meta"))))
      return c.json({ detail: "Book not found." }, 404);
    const body: any = await c.req.json().catch(() => ({}));
    if (body?.confirm !== "REBUILD_FROM_PDF")
      return c.json({ detail: "Confirm that you want to retire the working lesson collection." }, 400);
    const user = c.get("user");
    try {
      // Fail closed: do not rely on the owner's UI or a statement that
      // purchases are not live. This must be checked against both tables.
      await ensurePurchaseTable(c.env.DB);
      await ensureLessonTable(c.env.DB);
      const [books, singles, familyCopies] = await Promise.all([
        c.env.DB.prepare("SELECT COUNT(*) AS n FROM quest_book_purchases WHERE book_id = ?").bind(id).first<{ n: number }>(),
        c.env.DB.prepare("SELECT COUNT(*) AS n FROM quest_lesson_purchases WHERE book_id = ?").bind(id).first<{ n: number }>(),
        c.env.DB.prepare(`SELECT COUNT(*) AS n FROM lessons
          WHERE family_id != ? AND json_valid(data) AND json_extract(data, '$.quest_book_id') = ?
            AND json_extract(data, '$.source') = 'side_quest_book'`).bind(user.family_id, id).first<{ n: number }>(),
      ]);
      if (Number(books?.n || 0) + Number(singles?.n || 0) + Number(familyCopies?.n || 0) > 0)
        return c.json({
          code: "QUEST_BOOK_ALREADY_DISTRIBUTED",
          detail: "This book has a recorded purchase or a lesson copied into another family's library. Its lesson identifiers cannot be reset. Remake individual lessons instead, or create a new book edition.",
        }, 409);

      const keys = [keyFor(id, "chapters"), keyFor(id, "lessons")];
      const originals = await Promise.all(keys.map(async (key) => {
        const file = await c.env.BUCKET!.get(key);
        return file ? await new Response(file.body).text() : null;
      }));
      // Keep private last-version snapshots for recovery. Never publish backup
      // keys as ordinary book files.
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      for (let i = 0; i < originals.length; i++) {
        if (originals[i] !== null)
          await c.env.BUCKET!.put(`${ROOT}${id}/rebuild-backup-${stamp}-${i === 0 ? "chapters" : "lessons"}.json`,
            originals[i]!, { httpMetadata: { contentType: "application/json" } });
      }
      await c.env.BUCKET!.delete(keys);
      if ((await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)))).some(Boolean))
        throw new Error("Could not clear the old lesson plan.");

      try {
        // Archive (never delete) only the owner's linked working drafts.
        // Retain manually created lessons and all assignment history.
        await c.env.DB.prepare(`UPDATE lessons SET archived_at = ?, updated_at = ?
          WHERE family_id = ? AND archived_at IS NULL AND json_valid(data)
            AND json_extract(data, '$.quest_book_id') = ?
            AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book'
            AND json_extract(data, '$.ai_generated') = 1`)
          .bind(new Date().toISOString(), new Date().toISOString(), user.family_id, id).run();
      } catch (e) {
        // If archiving fails, restore the published list and plan.
        for (let i = 0; i < originals.length; i++)
          if (originals[i] !== null) await c.env.BUCKET!.put(keys[i], originals[i]!, { httpMetadata: { contentType: "application/json" } });
        throw e;
      }
      c.header("Cache-Control", "no-store");
      return c.json({ ok: true, cleared_plan: !!originals[0], cleared_published: !!originals[1],
        message: "Old lesson drafts archived. Re-analyse the uploaded book to make a new plan." });
    } catch (e: any) {
      console.error("Quest Books lesson rebuild failed", e?.message || e);
      return c.json({ detail: "Could not safely reset this book's lessons. The existing book files have not been deleted." }, 503);
    }
  });

  // The owner's working view: chapters, the owner's draft lesson for each, and what's published.
  app.get("/api/quest-books/admin/books/:id/chapters", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    if (!VALID_ID.test(id)) return c.json({ detail: "Book not found" }, 404);
    const user = c.get("user");
    const chapters = await readChapters(c.env.BUCKET!, id);
    const published = await readPublished(c.env.BUCKET!, id);
    const { results } = await c.env.DB.prepare(`SELECT id, title, status, version, updated_at, data, json_extract(data, '$.quest_chapter_id') AS ch, json_extract(data, '$.quest_source_revision') AS revision,
        json_extract(data, '$.book_reviewed_version') AS reviewed_version, json_extract(data, '$.book_reviewed_at') AS reviewed_at,
        json_extract(data, '$.book_plan_saved_version') AS plan_saved_version, json_extract(data, '$.book_plan_saved_at') AS plan_saved_at FROM lessons
      WHERE family_id = ? AND archived_at IS NULL AND json_valid(data) AND json_extract(data, '$.quest_book_id') = ?
      AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book' ORDER BY updated_at DESC`).bind(user.family_id, id).all<any>();
    const drafts = new Map<string, any>();
    for (const r of results || []) {
      if (!r.ch || drafts.has(r.ch)) continue;
      const data = JSON.parse(r.data || "{}");
      const issues = companionLessonIssues(data);
      const flagged = !Array.isArray(data.ai_flags) || data.ai_flags.length !== 0;
      drafts.set(r.ch, {
        lesson_id: r.id, title: r.title, status: r.status, updated_at: r.updated_at, revision: r.revision,
        quality_issues: issues,
        // An AI-clear lesson is eligible for a separate owner-confirmed fast approval.
        // Never infer "clear" from missing AI flags or from the browser checkbox.
        ai_cleared: data.ai_generated === true && !flagged && issues.length === 0 && data.book_repair_requested !== true,
        repair_requested: data.book_repair_requested === true,
        repair_note: data.book_repair_requested === true ? String(data.book_repair_note || "").slice(0, 420) : "",
        ai_warning_count: Array.isArray(data.ai_flags) ? data.ai_flags.length : null,
        version: r.version, reviewed_at: r.reviewed_at,
        plan_saved_at: r.plan_saved_at,
        saved_to_plan: r.plan_saved_version !== null && Number(r.plan_saved_version) === Number(r.version),
        reviewed: r.status === "ready" && r.reviewed_version !== null && Number(r.reviewed_version) === Number(r.version),
      });
    }
    c.header("Cache-Control", "no-store");
    return c.json({
      chapters: chapters.map(({ text, ...ch }) => ({ ...ch, chars: text.length,
        revision: chapterRevision({ ...ch, text }), draft: drafts.get(ch.id) ? {
          ...drafts.get(ch.id), stale: drafts.get(ch.id).revision !== chapterRevision({ ...ch, text }),
          reviewed: drafts.get(ch.id).reviewed && drafts.get(ch.id).revision === chapterRevision({ ...ch, text }),
          ai_cleared: drafts.get(ch.id).ai_cleared && drafts.get(ch.id).revision === chapterRevision({ ...ch, text }),
          saved_to_plan: drafts.get(ch.id).saved_to_plan && drafts.get(ch.id).revision === chapterRevision({ ...ch, text }),
        } : null, published: published.some((p) => p.chapter_id === ch.id && (!p.data.quest_source_revision || p.data.quest_source_revision === chapterRevision({ ...ch, text }))) })),
      published_count: published.length,
      draft_count: (results || []).length,
    });
  });

  // Owner-confirmed fast approval: accept only the latest AI-generated draft for
  // each current subsection when the AI reported NO warnings and the same
  // content requirements as normal publication are satisfied.
  // This never publishes the lessons, removes flags or touches family copies.
  app.post("/api/quest-books/admin/books/:id/lessons/approve-ai-cleared", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id");
    const body: any = await c.req.json().catch(() => ({}));
    if (!VALID_ID.test(id) || body.confirm !== "APPROVE_AI_CLEARED")
      return c.json({ detail: "Explicitly confirm approval of AI-cleared lessons." }, 400);
    const chapters = await readChapters(c.env.BUCKET!, id);
    if (!chapters.length) return c.json({ detail: "This book has no saved chapter plan." }, 409);
    const user = c.get("user");
    const { results } = await c.env.DB.prepare(`SELECT id, title, status, version, updated_at, data
      FROM lessons WHERE family_id = ? AND archived_at IS NULL AND json_valid(data)
      AND json_extract(data, '$.quest_book_id') = ?
      AND COALESCE(json_extract(data, '$.source'), '') != 'side_quest_book'
      ORDER BY updated_at DESC`).bind(user.family_id, id).all<any>();
    const newest = new Map<string, any>();
    for (const row of results || []) {
      const saved = JSON.parse(row.data || "{}");
      if (saved.quest_chapter_id && !newest.has(saved.quest_chapter_id))
        newest.set(saved.quest_chapter_id, { row, saved });
    }
    const approved: { id: string; title: string; lesson_id: string }[] = [];
    const skipped: { id: string; title: string; reason: string }[] = [];
    let previouslyReviewed = 0;
    for (const chapter of chapters) {
      const found = newest.get(chapter.id);
      if (!found) continue;
      const { row, saved } = found;
      const skip = (reason: string) => skipped.push({ id: chapter.id, title: chapter.title, reason });
      if (saved.quest_book_id !== id || saved.quest_chapter_id !== chapter.id || saved.source === "side_quest_book") {
        skip("The lesson is not the original working companion for this chapter."); continue;
      }
      if (saved.quest_source_revision !== chapterRevision(chapter)) { skip("Book source changed. Regenerate this lesson."); continue; }
      if (row.status === "ready" && Number(saved.book_reviewed_version) === Number(row.version)) {
        previouslyReviewed++; continue;
      }
      if (row.status !== "draft" && row.status !== "ready") { skip("The lesson has an unsupported status."); continue; }
      if (saved.ai_generated !== true || !Array.isArray(saved.ai_flags)) { skip("This lesson has no verified AI quality-check result."); continue; }
      if (saved.book_repair_requested === true) { skip("The owner marked this lesson as needing repair."); continue; }
      if (saved.ai_flags.length) { skip("The AI flagged issues that need attention."); continue; }
      const issues = companionLessonIssues(saved);
      if (issues.length) { skip(`Missing required content: ${issues.join("; ")}`); continue; }
      const now = new Date().toISOString();
      const next = {
        ...saved, review_status: "parent_reviewed",
        book_review_method: "owner_bulk_ai_cleared",
        book_plan_saved_version: Number(row.version), book_plan_saved_at: now, book_plan_saved_by: user.id,
        book_reviewed_version: Number(row.version), book_reviewed_at: now, book_reviewed_by: user.id,
      };
      // Compare the exact data payload, not only the version. Other review actions
      // can update metadata without bumping the lesson's content version.
      const updated = await c.env.DB.prepare(`UPDATE lessons SET status = 'ready', data = ?, updated_at = ?
        WHERE id = ? AND family_id = ? AND version = ? AND status = ? AND data = ? AND archived_at IS NULL`)
        .bind(JSON.stringify(next), now, row.id, user.family_id, row.version, row.status, row.data).run();
      if (!updated.meta?.changes) { skip("The saved lesson changed during approval. Reload and retry."); continue; }
      approved.push({ id: chapter.id, title: chapter.title, lesson_id: row.id });
    }
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, approved_count: approved.length, approved, already_reviewed: previouslyReviewed,
      skipped_count: skipped.length, skipped });
  });

  // A book plan stores the ID and saved version of its ORIGINAL companion lesson.
  // Never overwrite the PDF source/chapters, silently publish, or copy family lessons.
  app.post("/api/quest-books/admin/books/:id/chapters/:cid/save-to-plan", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id"), cid = c.req.param("cid");
    const body: any = await c.req.json().catch(() => ({}));
    if (!VALID_ID.test(id) || !body?.lesson_id || !Number.isInteger(body?.expected_version))
      return c.json({ detail: "Choose a valid book lesson and its current saved version." }, 400);
    const chapter = (await readChapters(c.env.BUCKET!, id)).find((ch) => ch.id === cid);
    if (!chapter) return c.json({ detail: "The book plan no longer contains this chapter." }, 404);
    const user = c.get("user");
    const row = await ownLesson(c.env.DB, user.family_id, body.lesson_id);
    if (!row || row.archived_at) return c.json({ detail: "The working lesson was not found." }, 404);
    let data: Record<string, any>;
    try { data = JSON.parse(row.data || "{}"); } catch { return c.json({ detail: "The lesson cannot be read." }, 409); }
    if (data.quest_book_id !== id || data.quest_chapter_id !== cid || data.source === "side_quest_book")
      return c.json({ detail: "Only an existing official companion lesson can be saved to its own book plan." }, 403);
    if (data.quest_source_revision !== chapterRevision(chapter))
      return c.json({ detail: "The PDF chapter source changed. Re-analyse it before saving to the plan." }, 409);
    if (Number(row.version) !== body.expected_version)
      return c.json({ detail: "The lesson changed while you were reviewing it. Reopen it before saving to the plan." }, 409);
    data.book_plan_saved_version = row.version;
    data.book_plan_saved_at = new Date().toISOString();
    data.book_plan_saved_by = user.id;
    const saved = await c.env.DB.prepare("UPDATE lessons SET data = ? WHERE id = ? AND family_id = ? AND version = ?")
      .bind(JSON.stringify(data), row.id, user.family_id, row.version).run();
    if (!saved.meta?.changes) return c.json({ detail: "Another edit occurred. Reload the lesson and try again." }, 409);
    const confirm = await ownLesson(c.env.DB, user.family_id, row.id);
    let confirmed: Record<string, any>;
    try { confirmed = JSON.parse(confirm?.data || "{}"); } catch { confirmed = {}; }
    if (Number(confirmed.book_plan_saved_version) !== row.version)
      return c.json({ detail: "The book plan save could not be verified." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, lesson_id: row.id, book_id: id, chapter_id: cid,
      saved_version: row.version, saved_at: confirmed.book_plan_saved_at });
  });

  // A book review belongs to the owner's working lesson version, not to a browser checkbox.
  // This does not publish anything or change family-owned copies.
  app.post("/api/quest-books/admin/books/:id/chapters/:cid/review", g.auth, g.parent, ownerOnly, async (c) => {
    const id = c.req.param("id"), cid = c.req.param("cid");
    const body: any = await c.req.json().catch(() => ({}));
    if (!VALID_ID.test(id) || typeof body?.lesson_id !== "string" || typeof body?.approved !== "boolean")
      return c.json({ detail: "Choose a valid book lesson and review action." }, 400);
    const chapter = (await readChapters(c.env.BUCKET!, id)).find((ch) => ch.id === cid);
    if (!chapter) return c.json({ detail: "This book chapter no longer exists." }, 404);
    const user = c.get("user");
    const row = await ownLesson(c.env.DB, user.family_id, body.lesson_id);
    if (!row || row.archived_at) return c.json({ detail: "The working lesson was not found." }, 404);
    if (body.expected_version !== undefined && (!Number.isInteger(body.expected_version) || Number(row.version) !== body.expected_version))
      return c.json({ detail: "This lesson changed since you opened it. Reload and review the current saved version." }, 409);
    let data: Record<string, any>;
    try { data = JSON.parse(row.data || "{}"); } catch { return c.json({ detail: "The lesson data could not be read." }, 409); }
    if (data.quest_book_id !== id || data.quest_chapter_id !== cid || data.source === "side_quest_book")
      return c.json({ detail: "Only this book's original companion lesson may be reviewed here." }, 403);
    if (data.quest_source_revision !== chapterRevision(chapter))
      return c.json({ detail: "The workbook source changed. Regenerate and review the lesson first." }, 409);
    // If a previously approved lesson contains an error, return the exact
    // saved version to the repair queue without deleting any teaching content.
    // A written note is optional but helps the AI find a problem automatic
    // quality checks cannot detect (e.g. an incorrect answer).
    if (!body.approved && body.needs_repair === true) {
      if (row.status !== "draft" && row.status !== "ready")
        return c.json({ detail: "Only an editable working lesson can be returned to repair." }, 409);
      const note = typeof body.repair_note === "string" ? body.repair_note.trim().slice(0, 420) : "";
      data.book_repair_requested = true;
      data.book_repair_note = note || "Check this lesson for the error I spotted, especially teaching examples and answer keys.";
      data.book_repair_ai_attempted = false;
      if (data.ai_generated === true) data.review_status = "ai_draft_needs_review";
      delete data.book_reviewed_version;
      delete data.book_reviewed_at;
      delete data.book_reviewed_by;
      const now = new Date().toISOString();
      const updated = await c.env.DB.prepare(`UPDATE lessons SET status = 'draft', data = ?, updated_at = ?
        WHERE id = ? AND family_id = ? AND version = ? AND status = ? AND data = ? AND archived_at IS NULL`)
        .bind(JSON.stringify(data), now, row.id, user.family_id, row.version, row.status, row.data).run();
      if (!updated.meta?.changes)
        return c.json({ detail: "The lesson changed while it was being returned to repair. Reload and retry." }, 409);
      c.header("Cache-Control", "no-store");
      return c.json({ ok: true, reviewed: false, needs_repair: true, status: "draft", version: row.version });
    }
    // Explicit owner review confirmation can promote an already-checked draft to
    // Ready while approving that exact saved version. This is never automatic.
    const confirmCheckedDraft = body.approved === true && body.complete_review === true;
    if (body.approved) {
      if (row.status !== "ready" && !(row.status === "draft" && confirmCheckedDraft))
        return c.json({ detail: "Confirm that you checked this draft before marking it Ready and Reviewed." }, 409);
      const issues = companionLessonIssues(data);
      if (issues.length) return c.json({ detail: `Complete the lesson before approving it: ${issues.join("; ")}.` }, 409);
      // Match the normal Save as Ready action only after the owner has explicitly
      // confirmed that the AI draft was checked; do not clear warnings on save alone.
      if (confirmCheckedDraft && data.ai_generated === true) {
        data.review_status = "parent_reviewed";
        data.ai_flags = [];
      }
      // Only the owner's explicit review can clear a manually flagged error.
      delete data.book_repair_requested;
      delete data.book_repair_note;
      delete data.book_repair_ai_attempted;
      // Approving a saved lesson also links that exact version to the book plan.
      // Commit both flags in one UPDATE so a successful approval cannot leave
      // the lesson in a "reviewed but not saved to plan" state.
      data.book_plan_saved_version = Number(row.version);
      data.book_plan_saved_at = new Date().toISOString();
      data.book_plan_saved_by = user.id;
      data.book_reviewed_version = Number(row.version);
      data.book_reviewed_at = data.book_plan_saved_at;
      data.book_reviewed_by = user.id;
    } else {
      delete data.book_reviewed_version;
      delete data.book_reviewed_at;
      delete data.book_reviewed_by;
    }
    // Do not bump the content version for an approval: that would invalidate
    // the review we just recorded. Also guard against concurrent lesson edits.
    const promoteDraft = confirmCheckedDraft && row.status === "draft";
    const changed = promoteDraft
      ? await c.env.DB.prepare("UPDATE lessons SET status = 'ready', data = ?, updated_at = ? WHERE id = ? AND family_id = ? AND version = ? AND status = 'draft'")
          .bind(JSON.stringify(data), data.book_reviewed_at, row.id, user.family_id, row.version).run()
      : await c.env.DB.prepare("UPDATE lessons SET data = ? WHERE id = ? AND family_id = ? AND version = ? AND status = ?")
          .bind(JSON.stringify(data), row.id, user.family_id, row.version, row.status).run();
    if (!changed.meta?.changes) return c.json({ detail: "This lesson changed while you reviewed it. Reload and check the latest version." }, 409);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, reviewed: body.approved, reviewed_at: data.book_reviewed_at || null,
      saved_to_plan: Number(data.book_plan_saved_version) === Number(row.version), status: promoteDraft ? "ready" : row.status,
      version: row.version });
  });

  // One server-verified pass of "Fix all with AI". The owner starts a bounded
  // sequence in the browser; each pass rereads the latest saved warning list.
  // No approval, publication, source replacement or changes to family copies.
  app.post("/api/quest-books/admin/books/:id/chapters/:cid/repair-pass", g.auth, g.parent, ownerOnly, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const result = await repairQuestCompanionLessonPass(
      c.env, c.get("user"), c.req.param("id"), c.req.param("cid"),
      String(body.lesson_id || ""), Number(body.expected_version));
    c.header("Cache-Control", "no-store");
    return result.ok ? c.json(result) : c.json({ detail: result.detail, code: result.code }, (result.status || 500) as any);
  });

  // Draft a lesson from one chapter with the normal AI lesson generator, into the owner's own library for review.
  app.post("/api/quest-books/admin/books/:id/chapters/:cid/draft", g.auth, g.parent, ownerOnly, async (c) => {
    const user = c.get("user");
    const r = await generateQuestCompanionLesson(c.env, user, c.req.param("id"), c.req.param("cid"));
    return r.ok ? c.json({ lesson: r.lesson, warnings: r.warnings, retired_previous_drafts: 0 })
      : c.json({ detail: r.detail, code: r.code }, r.status as any);
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
      if (data.quest_book_id === id) {
        if (data.quest_chapter_id !== ch.id || data.quest_source_revision !== chapterRevision(ch))
          return c.json({ detail: `“${ch.title}” has changed since its lesson was generated. Remake and review the lesson before publishing.` }, 409);
        if (row.status !== "ready" || it?.reviewed !== true || Number(data.book_reviewed_version) !== Number(row.version))
          return c.json({ detail: `Review “${ch.title}”, mark it ready, and save its book approval before publishing.` }, 409);
        const issues = companionLessonIssues(data);
        if (issues.length) return c.json({ detail: `“${ch.title}” cannot be published yet: ${issues.join("; ")}.` }, 409);
      }
      const { quest_book_id, quest_book_title, quest_chapter_id, quest_chapter_title, quest_lesson_key, ai_flags, ...clean } = data as any;
      lessons.push({ key: ch.id, chapter_id: ch.id, chapter_title: ch.unit_title || ch.title, title: String(row.title), stage: String(row.stage || ""), learning_area: String(row.learning_area || ""), data: clean });
    }
    // Publishing replaces the book's R2 snapshot. Never silently remove purchased
    // lesson keys when only a subset of working drafts was submitted.
    const priorPublished = await readPublished(c.env.BUCKET!, id);
    const incomingKeys = new Set(lessons.map((l) => l.key));
    if (incomingKeys.size !== lessons.length) return c.json({ detail: "A companion lesson was selected more than once." }, 400);
    const missingPublished = priorPublished.find((l) => !incomingKeys.has(l.key));
    if (missingPublished) return c.json({
      detail: `Publishing would remove the previously published lesson “${missingPublished.title}”. Restore its chapter and lesson in this publishing batch instead of silently removing a lesson families may have purchased.`,
      code: "PUBLISHED_LESSON_KEY_REMOVED",
    }, 409);
    // Match every lesson to each state's curriculum now, so families anywhere get their own codes when they add it.
    const meta = await readMeta(c.env.BUCKET!, id);
    await Promise.all(lessons.map(async (l) => {
      l.codes = await codesForAllFrameworks({ ...l.data, title: l.title, learning_area: l.learning_area }, meta?.year ?? null, c.env.AI as any, { model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID });
    }));
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
    await deleteReadPages(c.env.BUCKET!, id);
    const keys = [...(["meta", "chapters", "lessons", ...FILE_KINDS] as const).map((k) => keyFor(id, k)), ...Array.from({ length: MAX_LOOK_PAGES }, (_, i) => lookKey(id, i + 1))];
    await c.env.BUCKET!.delete(keys);
    const after = await Promise.all(keys.map((k) => c.env.BUCKET!.head(k)));
    if (after.some(Boolean)) return c.json({ detail: "The book could not be fully deleted. Please retry." }, 502);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true, id });
  });
}


// ---------------------------------------------------------------- public shop (no account)
// Opened and closed by the owner in Owner HQ (features.shopOpen). Sells book PDFs only: lessons need an account.
const MAX_SHOP_ITEMS = 20;
const EMAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;

async function shopOpen(db: DB) {
  try { return (await loadPlatformSettings(db)).features.shopOpen === true; } catch { return false; }
}
const shopBook = (b: Listed) => ({
  id: b.id, title: b.title, subtitle: b.subtitle, description: b.description, collection: b.collection,
  year_label: yearLabel(b.year), subject_label: subjectLabel(b), pages: b.pages, price_cents: b.price_cents,
  has_cover: b.has_cover, look_pages: b.look_pages,
});

export function registerShop(app: App) {
  const closed = (c: any) => c.json({ open: false, detail: "The shop isn't open yet." }, 404);

  app.get("/api/shop", async (c) => {
    c.header("Cache-Control", "no-store");
    if (!(await shopOpen(c.env.DB))) return c.json({ open: false, books: [], products: [], departments: [] });
    const books = (await listBooks(c.env.BUCKET)).filter((b) => b.has_book && b.price_cents !== null && b.released);
    const catalog = await publicCatalog(c.env.DB).catch((e) => { console.error("shop catalogue failed", e?.message); return { departments: [], collections: [], products: [] as any[] }; });
    // Printed copies: which switched-on print products offer each book.
    const printed = (id: string) => catalog.products.filter((p: any) => p.prints_books).flatMap((p: any) => p.variants.filter((v: any) => v.book_id === id && v.price_cents != null)
      .map((v: any) => ({ product_id: p.id, variant_id: v.id, title: p.title, price_cents: v.price_cents, can_buy: p.can_buy && v.available })));
    return c.json({ open: true, can_buy: squareConfig(c.env).ok, books: books.map((b) => ({ ...shopBook(b), printed: printed(b.id) })), ...catalog });
  });

  app.get("/api/shop/books/:id/cover", async (c) => {
    if (!(await shopOpen(c.env.DB))) return closed(c);
    const id = c.req.param("id");
    if (!VALID_ID.test(id) || !c.env.BUCKET) return c.json({ detail: "Cover not found" }, 404);
    const obj = await c.env.BUCKET.get(keyFor(id, "cover"));
    if (!obj) return c.json({ detail: "Cover not found" }, 404);
    c.header("Content-Type", "image/png");
    c.header("Cache-Control", "public, max-age=300");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  app.get("/api/shop/books/:id/look/:n", async (c) => {
    if (!(await shopOpen(c.env.DB))) return closed(c);
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!VALID_ID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_LOOK_PAGES || !c.env.BUCKET) return c.json({ detail: "Page not found" }, 404);
    const obj = await c.env.BUCKET.get(lookKey(id, n));
    if (!obj) return c.json({ detail: "Page not found" }, 404);
    c.header("Content-Type", "image/jpeg");
    c.header("Cache-Control", "no-store");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  // Body: { book_ids: string[], email }. Prices come from the stored books.
  app.post("/api/shop/checkout", async (c) => {
    if (!(await shopOpen(c.env.DB))) return closed(c);
    const sq = squareConfig(c.env);
    if (!sq.ok || !c.env.BUCKET) return c.json({ detail: "Checkout isn't available right now." }, 503);
    const body: any = await c.req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return c.json({ detail: "Enter the email address your books should go to." }, 400);
    const ids: string[] = [...new Set<string>((Array.isArray(body?.book_ids) ? body.book_ids : []).map((x: unknown) => String(x)))].filter((x) => VALID_ID.test(x)).slice(0, MAX_SHOP_ITEMS);
    const books = new Map((await listBooks(c.env.BUCKET)).map((b) => [b.id, b]));
    const bookLines: ShopLine[] = ids.map((id) => books.get(id)).filter((b): b is Listed => !!b && b.has_book && b.price_cents !== null && b.released)
      .map((b) => ({ book_id: b.id, title: b.title, amount_cents: b.price_cents! }));
    // Catalogue products (physical, made to order, printed books, digital): priced from the database.
    const priced = await priceItems(c.env.DB, Array.isArray(body?.items) ? body.items : []);
    if (!priced.ok) return c.json({ detail: priced.detail }, 409);
    const lines = [...bookLines, ...priced.lines];
    if (!lines.length) return c.json({ detail: "Your cart is empty." }, 400);
    let postage = 0;
    let quotedPostcode: string | null = null;
    if (priced.physical) {
      try {
        const quote = await quoteStandardPost(c.env, priced.lines, String(body?.destination_postcode || ""));
        postage = quote?.postage_cents ?? 0;
        quotedPostcode = quote?.postcode ?? null;
      } catch (e) {
        if (e instanceof ShippingQuoteError) return c.json({ detail: e.message }, e.status as 400 | 409 | 503);
        console.error("shop postage calculation failed", e);
        return c.json({ detail: "Postage is temporarily unavailable. Please try again." }, 503);
      }
    }
    const total = lines.reduce((n, l) => n + l.amount_cents, 0) + postage;
    if (body?.expected_total_cents != null && Number(body.expected_total_cents) !== total) return c.json({ code: "CART_CHANGED", detail: "Prices or postage changed. Please refresh the quote.", total_cents: total }, 409);
    const order = await createShopOrder(c.env.DB, email, lines, new Date(), postage, quotedPostcode);
    const origin = appOrigin(c.env, c.req.url);
    try {
      const url = await createShopPaymentLink(sq, {
        orderId: order.id, email, askShipping: priced.physical,
        redirectUrl: `${origin}/shop/order/${order.id}?t=${order.token}`,
        lines: squareLinesFor(lines, postage),
      });
      return c.json({ url, order_id: order.id });
    } catch (e: any) {
      console.error("shop checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  // The order page (from Square's redirect or the emailed link): status, then download buttons once paid.
  app.get("/api/shop/orders/:id", async (c) => {
    c.header("Cache-Control", "no-store");
    const o = await shopOrderFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    if (!o) return c.json({ detail: "This order link isn't valid. Use \"Get my downloads\" to receive a fresh one." }, 404);
    // Discover guided-document links only for products the authenticated order
    // actually bought. This is display metadata, not an access grant: the
    // document endpoint independently verifies the paid order and product.
    const productIds = [...new Set(o.lines.map((l: any) => l.product_id).filter((id: any) => /^[0-9a-f-]{36}$/.test(String(id || ""))))] as string[];
    const guided = new Set<string>();
    if (o.paid_at && productIds.length) {
      const { results } = await c.env.DB.prepare(`SELECT id, tags FROM shop_products WHERE id IN (${productIds.map(() => "?").join(",")})`).bind(...productIds).all<any>();
      for (const p of results || []) {
        if (guidedProductState({ ...p, fulfilment: "digital" })) guided.add(p.id);
      }
    }
    return c.json({
      paid: !!o.paid_at, status: o.status, tracking: o.tracking || null, postage_cents: o.postage_cents || 0,
      items: o.lines.map((l: any) => ({ book_id: l.book_id || null, product_id: l.product_id || null, title: l.title, qty: l.qty || 1, physical: !!l.physical, download: !!l.book_id || (!!l.product_id && !l.physical), guided_document: !!o.paid_at && guided.has(l.product_id) })),
      total_cents: o.total_cents, downloads_left: Math.max(0, MAX_SHOP_DOWNLOADS - Number(o.downloads || 0)),
    });
  });

  app.get("/api/shop/orders/:id/download/:bookId", async (c) => {
    const o = await shopOrderFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    const bookId = c.req.param("bookId");
    if (!o || !o.paid_at || !o.lines.some((l: any) => l.book_id === bookId)) return c.json({ detail: "This download link isn't valid." }, 404);
    if (Number(o.downloads || 0) >= MAX_SHOP_DOWNLOADS) return c.json({ detail: "This order has reached its download limit. Contact us if you need help." }, 429);
    const meta = await readMeta(c.env.BUCKET!, bookId);
    const obj = meta ? await c.env.BUCKET!.get(keyFor(bookId, "book")) : null;
    if (!meta || !obj) return c.json({ detail: "Book not found" }, 404);
    await c.env.DB.prepare("UPDATE shop_orders SET downloads = downloads + 1 WHERE id = ?").bind(o.id).run();
    return pdfResponse(obj, fileName(meta, "book"));
  });

  // Lost the link: email fresh links for every paid order of this address. Always answers the same, so it can't be
  // used to find out who has bought something.
  app.post("/api/shop/resend", async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return c.json({ detail: "Enter a valid email address." }, 400);
    await ensureShopOrders(c.env.DB);
    try { await resendShopLinks(c.env.DB, c.env, email, appOrigin(c.env, c.req.url)); } catch (e: any) { console.error("shop resend failed", e?.message); }
    return c.json({ ok: true, detail: "If that email has bought from the shop, we've sent its download links." });
  });
}
