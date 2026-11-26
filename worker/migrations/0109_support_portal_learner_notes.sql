-- Owner-only teaching preparation, separate from parent-visible learner identity.
CREATE TABLE IF NOT EXISTS support_portal_learner_notes (
 learner_id TEXT PRIMARY KEY REFERENCES support_portal_learners(id) ON DELETE CASCADE,
 goals TEXT NOT NULL DEFAULT '',
 interests TEXT NOT NULL DEFAULT '',
 approach TEXT NOT NULL DEFAULT '',
 private_notes TEXT NOT NULL DEFAULT '',
 revision INTEGER NOT NULL CHECK(revision>=1),
 updated_at TEXT NOT NULL
);
