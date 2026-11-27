CREATE TABLE IF NOT EXISTS support_private_lesson_drafts (
 owner_id TEXT PRIMARY KEY,
 draft_id TEXT NOT NULL UNIQUE,
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision >= 1),
 minutes INTEGER NOT NULL CHECK(minutes BETWEEN 15 AND 180),
 pack_json TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
