// Single-book purchases for Quest Books. Shared by the Quest Books routes, the Stripe webhook (billing.ts) and
// assignLesson (lessonBuilder.ts), kept separate so none of them import each other.
// Two tiers: "book" (download the PDF) and "plus" (the PDF and the book's ready-made chapter lessons).
type DB = D1Database;
export type Tier = "book" | "plus";

const CREATE = `CREATE TABLE IF NOT EXISTS quest_book_purchases (
  id TEXT PRIMARY KEY, family_id TEXT NOT NULL, book_id TEXT NOT NULL, stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL, currency TEXT NOT NULL, livemode INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'book')`;
const INDEX = "CREATE UNIQUE INDEX IF NOT EXISTS idx_quest_book_purchases_family_book ON quest_book_purchases (family_id, book_id)";

// Once per database binding (the binding is reused for the life of a Worker isolate).
const ensured = new WeakMap<object, Promise<void>>();
/** Migration 0072 creates the table; this adds the tier column and keeps purchases working if it hasn't been applied. */
export function ensurePurchaseTable(db: DB): Promise<void> {
  let p = ensured.get(db);
  if (!p) {
    p = (async () => {
      await db.prepare(CREATE).run();
      await db.prepare(INDEX).run();
      // Tables created before the "book + lessons" tier lack the column.
      await db.prepare("ALTER TABLE quest_book_purchases ADD COLUMN tier TEXT NOT NULL DEFAULT 'book'").run().catch(() => undefined);
    })().catch((e) => { ensured.delete(db); throw e; });
    ensured.set(db, p);
  }
  return p;
}

const CREATE_LESSONS = `CREATE TABLE IF NOT EXISTS quest_lesson_purchases (
  id TEXT PRIMARY KEY, family_id TEXT NOT NULL, book_id TEXT NOT NULL, lesson_key TEXT NOT NULL, stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL, currency TEXT NOT NULL, livemode INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,
  UNIQUE (family_id, book_id, lesson_key))`;
const ensuredLessons = new WeakMap<object, Promise<void>>();
export function ensureLessonTable(db: DB) {
  let p = ensuredLessons.get(db);
  if (!p) {
    p = db.prepare(CREATE_LESSONS).run().then(() => undefined).catch((e) => { ensuredLessons.delete(db); throw e; });
    ensuredLessons.set(db, p);
  }
  return p;
}

/** Lesson keys this family bought one at a time for a book. */
export async function ownedLessonKeys(db: DB, familyId: string, bookId: string): Promise<Set<string>> {
  try {
    await ensureLessonTable(db);
    const { results } = await db.prepare("SELECT lesson_key FROM quest_lesson_purchases WHERE family_id = ? AND book_id = ?").bind(familyId, bookId).all<{ lesson_key: string }>();
    return new Set((results || []).map((r) => r.lesson_key));
  } catch {
    return new Set();
  }
}

/** book id -> tier this family owns. */
export async function ownedTiers(db: DB, familyId: string): Promise<Map<string, Tier>> {
  try {
    await ensurePurchaseTable(db);
    const { results } = await db.prepare("SELECT book_id, tier FROM quest_book_purchases WHERE family_id = ?").bind(familyId).all<{ book_id: string; tier: string }>();
    return new Map((results || []).map((r) => [r.book_id, r.tier === "plus" ? "plus" : "book"] as [string, Tier]));
  } catch {
    return new Map();
  }
}

export async function ownedBookIds(db: DB, familyId: string): Promise<Set<string>> {
  return new Set((await ownedTiers(db, familyId)).keys());
}

export async function familyOwnsBook(db: DB, familyId: string, bookId: string): Promise<boolean> {
  return !!bookId && (await ownedTiers(db, familyId)).has(bookId);
}

/**
 * Called only from a signature-verified webhook. Records a paid Quest Book checkout. Idempotent: replays write nothing
 * new, and an upgrade from "book" to "plus" updates the existing row once.
 */
export async function recordQuestBookPurchase(db: DB, session: any, livemode: boolean, now: Date = new Date()): Promise<string | null> {
  if (session?.object !== "checkout.session" || session.mode !== "payment") return null;
  if (session.metadata?.kind !== "quest_book") return null;
  if (session.payment_status !== "paid") return "quest book checkout not paid yet";
  const familyId = String(session.metadata?.family_id || session.client_reference_id || "");
  const bookId = String(session.metadata?.book_id || "");
  const tier: Tier = session.metadata?.tier === "plus" ? "plus" : "book";
  const amount = Number(session.amount_total);
  if (!familyId || !/^[a-z0-9-]{1,64}$/.test(bookId) || !Number.isFinite(amount)) return "quest book checkout missing details";
  const fam = await db.prepare("SELECT id FROM families WHERE id = ?").bind(familyId).first();
  if (!fam) return "quest book checkout for unknown family";
  if (session.metadata?.tier === "lesson") {
    const key = String(session.metadata?.lesson_key || "");
    if (!/^[a-z0-9-]{1,40}$/.test(key)) return "quest lesson checkout missing lesson";
    await ensureLessonTable(db);
    await db.prepare(`INSERT OR IGNORE INTO quest_lesson_purchases (id, family_id, book_id, lesson_key, stripe_session_id, amount_cents, currency, livemode, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), familyId, bookId, key, String(session.id), Math.round(amount), String(session.currency || "aud"), livemode ? 1 : 0, now.toISOString()).run();
    return `quest lesson ${bookId}/${key} purchased`;
  }
  await ensurePurchaseTable(db);
  await db
    .prepare(`INSERT INTO quest_book_purchases (id, family_id, book_id, stripe_session_id, amount_cents, currency, livemode, created_at, tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(family_id, book_id) DO UPDATE SET tier = 'plus', amount_cents = quest_book_purchases.amount_cents + excluded.amount_cents
      WHERE excluded.tier = 'plus' AND quest_book_purchases.tier != 'plus'`)
    .bind(crypto.randomUUID(), familyId, bookId, String(session.id), Math.round(amount), String(session.currency || "aud"), livemode ? 1 : 0, now.toISOString(), tier)
    .run()
    .catch(async (e: any) => {
      // A replay of an already-recorded session hits the stripe_session_id UNIQUE constraint: nothing to do.
      if (!/UNIQUE/i.test(String(e?.message))) throw e;
    });
  return `quest book ${bookId} purchased (${tier})`;
}

/** True when this library lesson came from a Quest Book the family bought with lessons (bundle or that single lesson): it stays assignable without a membership. */
export async function isBookLessonGrant(db: DB, familyId: string, lessonRow: any): Promise<boolean> {
  try {
    const data = typeof lessonRow?.data === "string" ? JSON.parse(lessonRow.data) : lessonRow?.data;
    const bookId = typeof data?.quest_book_id === "string" ? data.quest_book_id : "";
    if (!bookId || data?.source !== "side_quest_book") return false;
    if ((await ownedTiers(db, familyId)).get(bookId) === "plus") return true;
    const key = typeof data?.quest_lesson_key === "string" ? data.quest_lesson_key : "";
    return !!key && (await ownedLessonKeys(db, familyId, bookId)).has(key);
  } catch {
    return false;
  }
}
