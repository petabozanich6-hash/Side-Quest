// Single-book purchases for Quest Books. Shared by the Quest Books routes and the Stripe webhook (billing.ts),
// kept separate so neither module imports the other.
type DB = D1Database;

const CREATE = `CREATE TABLE IF NOT EXISTS quest_book_purchases (
  id TEXT PRIMARY KEY, family_id TEXT NOT NULL, book_id TEXT NOT NULL, stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL, currency TEXT NOT NULL, livemode INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)`;
const INDEX = "CREATE UNIQUE INDEX IF NOT EXISTS idx_quest_book_purchases_family_book ON quest_book_purchases (family_id, book_id)";

let ensured: Promise<void> | null = null;
/** Migration 0072 creates the table; this keeps purchases working if the migration hasn't been applied yet. */
export function ensurePurchaseTable(db: DB): Promise<void> {
  if (!ensured) {
    ensured = (async () => {
      await db.prepare(CREATE).run();
      await db.prepare(INDEX).run();
    })().catch((e) => { ensured = null; throw e; });
  }
  return ensured;
}

export async function ownedBookIds(db: DB, familyId: string): Promise<Set<string>> {
  try {
    await ensurePurchaseTable(db);
    const { results } = await db.prepare("SELECT book_id FROM quest_book_purchases WHERE family_id = ?").bind(familyId).all<{ book_id: string }>();
    return new Set((results || []).map((r) => r.book_id));
  } catch {
    return new Set();
  }
}

export async function familyOwnsBook(db: DB, familyId: string, bookId: string): Promise<boolean> {
  if (!bookId) return false;
  return (await ownedBookIds(db, familyId)).has(bookId);
}

/**
 * Called only from a signature-verified webhook. Records the purchase when the checkout is a paid Quest Book
 * one-off payment. Idempotent: replays and the async-success event write nothing new.
 */
export async function recordQuestBookPurchase(db: DB, session: any, livemode: boolean, now: Date = new Date()): Promise<string | null> {
  if (session?.object !== "checkout.session" || session.mode !== "payment") return null;
  if (session.metadata?.kind !== "quest_book") return null;
  if (session.payment_status !== "paid") return "quest book checkout not paid yet";
  const familyId = String(session.metadata?.family_id || session.client_reference_id || "");
  const bookId = String(session.metadata?.book_id || "");
  const amount = Number(session.amount_total);
  if (!familyId || !/^[a-z0-9-]{1,64}$/.test(bookId) || !Number.isFinite(amount)) return "quest book checkout missing details";
  const fam = await db.prepare("SELECT id FROM families WHERE id = ?").bind(familyId).first();
  if (!fam) return "quest book checkout for unknown family";
  await ensurePurchaseTable(db);
  await db
    .prepare(`INSERT OR IGNORE INTO quest_book_purchases (id, family_id, book_id, stripe_session_id, amount_cents, currency, livemode, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), familyId, bookId, String(session.id), Math.round(amount), String(session.currency || "aud"), livemode ? 1 : 0, now.toISOString())
    .run();
  return `quest book ${bookId} purchased`;
}
