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

// ---------------------------------------------------------------- cart
// A cart checkout stores its priced lines here (Stripe metadata is too small for a list); the webhook reads them back.
export type CartLine = { book_id: string; tier: Tier | "lesson"; lesson_key?: string; amount_cents: number; title: string };
const CREATE_CARTS = `CREATE TABLE IF NOT EXISTS quest_carts (
  id TEXT PRIMARY KEY, family_id TEXT NOT NULL, lines TEXT NOT NULL, total_cents INTEGER NOT NULL, created_at TEXT NOT NULL, paid_at TEXT)`;
const ensuredCarts = new WeakMap<object, Promise<void>>();
export function ensureCartTable(db: DB) {
  let p = ensuredCarts.get(db);
  if (!p) {
    p = db.prepare(CREATE_CARTS).run().then(() => undefined).catch((e) => { ensuredCarts.delete(db); throw e; });
    ensuredCarts.set(db, p);
  }
  return p;
}
export async function saveCart(db: DB, familyId: string, lines: CartLine[], total: number, now: Date = new Date()): Promise<string> {
  await ensureCartTable(db);
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO quest_carts (id, family_id, lines, total_cents, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, familyId, JSON.stringify(lines), total, now.toISOString()).run();
  return id;
}
export async function cartPaid(db: DB, familyId: string, cartId: string): Promise<boolean> {
  await ensureCartTable(db);
  const row = await db.prepare("SELECT paid_at FROM quest_carts WHERE id = ? AND family_id = ?").bind(cartId, familyId).first<{ paid_at: string | null }>();
  return !!row?.paid_at;
}

/** Records one paid item. `ref` is unique per item (a session id, or session id + line number for carts). Idempotent. */
async function recordItem(db: DB, familyId: string, bookId: string, tier: Tier | "lesson", lessonKey: string, ref: string, amount: number, currency: string, livemode: boolean, now: Date) {
  if (tier === "lesson") {
    await ensureLessonTable(db);
    await db.prepare(`INSERT OR IGNORE INTO quest_lesson_purchases (id, family_id, book_id, lesson_key, stripe_session_id, amount_cents, currency, livemode, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), familyId, bookId, lessonKey, ref, Math.round(amount), currency, livemode ? 1 : 0, now.toISOString()).run();
    return;
  }
  await ensurePurchaseTable(db);
  await db
    .prepare(`INSERT INTO quest_book_purchases (id, family_id, book_id, stripe_session_id, amount_cents, currency, livemode, created_at, tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(family_id, book_id) DO UPDATE SET tier = 'plus', amount_cents = quest_book_purchases.amount_cents + excluded.amount_cents
      WHERE excluded.tier = 'plus' AND quest_book_purchases.tier != 'plus'`)
    .bind(crypto.randomUUID(), familyId, bookId, ref, Math.round(amount), currency, livemode ? 1 : 0, now.toISOString(), tier)
    .run()
    .catch(async (e: any) => {
      // A replay of an already-recorded session hits the stripe_session_id UNIQUE constraint: nothing to do.
      if (!/UNIQUE/i.test(String(e?.message))) throw e;
    });
}

/**
 * Records every item of a paid cart once (Stripe or Square). `ref` is the payment's own id; each line gets ref#n.
 * Called only after the payment provider's signed notification has been verified. Idempotent.
 */
export async function recordPaidCart(db: DB, familyId: string, cartId: string, ref: string, currency: string, livemode: boolean, now: Date = new Date(), expectedTotal?: number): Promise<string> {
  await ensureCartTable(db);
  const cart = await db.prepare("SELECT lines, total_cents FROM quest_carts WHERE id = ? AND family_id = ?").bind(cartId, familyId).first<{ lines: string; total_cents: number }>();
  if (!cart) return "quest cart not found";
  if (expectedTotal !== undefined && Number(cart.total_cents) !== expectedTotal) return `quest cart ${cartId} paid amount ${expectedTotal} does not match ${cart.total_cents}`;
  let lines: CartLine[] = [];
  try { lines = JSON.parse(cart.lines); } catch { return "quest cart unreadable"; }
  let i = 0;
  for (const l of lines) {
    i++;
    if (!/^[a-z0-9-]{1,64}$/.test(l.book_id)) continue;
    if (l.tier === "lesson" && !/^[a-z0-9-]{1,40}$/.test(String(l.lesson_key || ""))) continue;
    await recordItem(db, familyId, l.book_id, l.tier === "plus" ? "plus" : l.tier === "lesson" ? "lesson" : "book", String(l.lesson_key || ""), `${ref}#${i}`, Number(l.amount_cents) || 0, currency, livemode, now);
  }
  await db.prepare("UPDATE quest_carts SET paid_at = COALESCE(paid_at, ?) WHERE id = ?").bind(now.toISOString(), cartId).run();
  return `quest cart ${cartId} purchased (${lines.length} items)`;
}

/**
 * Called only from a signature-verified webhook. Records a paid Quest Book checkout (one item, or a whole cart).
 * Idempotent: replays write nothing new, and an upgrade from "book" to "plus" updates the existing row once.
 */
export async function recordQuestBookPurchase(db: DB, session: any, livemode: boolean, now: Date = new Date()): Promise<string | null> {
  if (session?.object !== "checkout.session" || session.mode !== "payment") return null;
  const kind = session.metadata?.kind;
  if (kind !== "quest_book" && kind !== "quest_cart") return null;
  if (session.payment_status !== "paid") return "quest book checkout not paid yet";
  const familyId = String(session.metadata?.family_id || session.client_reference_id || "");
  const currency = String(session.currency || "aud");
  if (!familyId) return "quest book checkout missing details";
  const fam = await db.prepare("SELECT id FROM families WHERE id = ?").bind(familyId).first();
  if (!fam) return "quest book checkout for unknown family";

  if (kind === "quest_cart") return recordPaidCart(db, familyId, String(session.metadata?.cart_id || ""), String(session.id), currency, livemode, now);

  const bookId = String(session.metadata?.book_id || "");
  const amount = Number(session.amount_total);
  if (!/^[a-z0-9-]{1,64}$/.test(bookId) || !Number.isFinite(amount)) return "quest book checkout missing details";
  if (session.metadata?.tier === "lesson") {
    const key = String(session.metadata?.lesson_key || "");
    if (!/^[a-z0-9-]{1,40}$/.test(key)) return "quest lesson checkout missing lesson";
    await recordItem(db, familyId, bookId, "lesson", key, String(session.id), amount, currency, livemode, now);
    return `quest lesson ${bookId}/${key} purchased`;
  }
  const tier: Tier = session.metadata?.tier === "plus" ? "plus" : "book";
  await recordItem(db, familyId, bookId, tier, "", String(session.id), amount, currency, livemode, now);
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
