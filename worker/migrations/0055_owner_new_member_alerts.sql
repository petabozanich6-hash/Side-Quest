-- One celebration per family when the first real, paid Stripe membership checkout succeeds.
-- No parent or child names, emails, payment details or card data are stored in this ledger.
CREATE TABLE IF NOT EXISTS owner_new_member_alerts (
  family_id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  claimed_at TEXT,
  claim_token TEXT,
  sent_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_owner_new_member_alerts_unsent
  ON owner_new_member_alerts (sent_at, claimed_at);
