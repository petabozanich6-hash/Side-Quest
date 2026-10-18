-- One successful or in-flight complimentary AI draft per family, for life.
-- Failed drafts remain in the audit trail but release the entitlement for a retry.
-- Requires a verified production backup and local rehearsal before the Worker code is deployed.
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_one_free_lesson_per_family
ON ai_usage (family_id)
WHERE kind = 'free_lesson_draft' AND status IN ('pending','ok');
