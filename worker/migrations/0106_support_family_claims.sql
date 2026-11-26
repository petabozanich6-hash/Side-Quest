-- Explicit legacy claim, not a backfill or an entitlement. Keep legacy IDs and channels intact.
CREATE TABLE IF NOT EXISTS support_family_claims (
 guest_family_id TEXT PRIMARY KEY REFERENCES support_guest_families(id) ON DELETE CASCADE,
 family_id TEXT NOT NULL UNIQUE REFERENCES families(id) ON DELETE CASCADE,
 parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 claimed_at TEXT NOT NULL
);
-- The claim itself is the durable linking record. No raw token or copied private notes.
CREATE INDEX IF NOT EXISTS idx_support_family_claims_parent ON support_family_claims(parent_user_id);
