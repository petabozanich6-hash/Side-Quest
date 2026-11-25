-- Record the support-only registration intent separately from the homeschool billing plan.
-- Additive; no existing rows are updated, no entitlement granted, no backfill or email-based merge.
CREATE TABLE IF NOT EXISTS support_account_intents (
  family_id TEXT PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
  registration_intent TEXT NOT NULL CHECK(registration_intent = 'support_only'),
  created_at TEXT NOT NULL
);
