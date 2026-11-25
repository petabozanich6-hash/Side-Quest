-- Independent learner identity for support services. No child credentials, no homeschool slot.
CREATE TABLE IF NOT EXISTS support_portal_learners (
 id TEXT PRIMARY KEY,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 student_id TEXT UNIQUE REFERENCES students(id) ON DELETE SET NULL,
 label TEXT NOT NULL CHECK(length(label) BETWEEN 1 AND 100),
 year_level TEXT NOT NULL DEFAULT '',
 request_key TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(parent_user_id,request_key)
);
CREATE INDEX IF NOT EXISTS idx_support_portal_learners_family ON support_portal_learners(family_id);
-- Legacy learner links are explicit and unique; do not copy private notes or rewrite old records.
CREATE TABLE IF NOT EXISTS support_portal_legacy_learners (
 legacy_learner_id TEXT PRIMARY KEY REFERENCES support_guest_learners(id) ON DELETE CASCADE,
 learner_id TEXT NOT NULL UNIQUE REFERENCES support_portal_learners(id) ON DELETE CASCADE,
 parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 linked_at TEXT NOT NULL
);
