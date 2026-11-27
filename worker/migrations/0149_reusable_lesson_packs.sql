CREATE TABLE IF NOT EXISTS support_reusable_lesson_packs (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 subject TEXT NOT NULL,
 year_level TEXT NOT NULL,
 minutes INTEGER NOT NULL CHECK(minutes BETWEEN 15 AND 180),
 pack_json TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS support_reusable_lesson_packs_created ON support_reusable_lesson_packs(created_at DESC);
