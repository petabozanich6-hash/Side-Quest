CREATE TABLE IF NOT EXISTS support_private_lesson_drafts (
 owner_id TEXT PRIMARY KEY,
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision >= 1),
 minutes INTEGER NOT NULL CHECK(minutes BETWEEN 15 AND 180),
 pack_json TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
