-- Quest Books bought one at a time by families who don't have a Family Membership.
-- Additive only. The Worker also creates this table itself (CREATE TABLE IF NOT EXISTS) if this migration hasn't been applied.
-- A row is written only by the signature-verified Stripe webhook for a paid checkout; the checkout return page grants nothing.
CREATE TABLE IF NOT EXISTS quest_book_purchases (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quest_book_purchases_family_book ON quest_book_purchases (family_id, book_id);
