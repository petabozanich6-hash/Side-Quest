-- AI multi-lesson drafting: remember each requested set of lessons on the server so parents never lose
-- access to the drafts when they open one, navigate away or refresh. Additive only: no existing rows change.
-- The lessons themselves stay ordinary rows in `lessons`; a batch item only points at the lesson it produced.
CREATE TABLE IF NOT EXISTS lesson_batches (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT,
  title TEXT NOT NULL,
  request TEXT NOT NULL DEFAULT '{}', -- JSON: what the parent asked for, so remaining or failed lessons can be written later
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  dismissed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_lesson_batches_family ON lesson_batches (family_id, created_at);

CREATE TABLE IF NOT EXISTS lesson_batch_items (
  batch_id TEXT NOT NULL,
  idx INTEGER NOT NULL,
  family_id TEXT NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending', -- pending | generating | done | failed
  lesson_id TEXT,
  error TEXT,
  meta TEXT NOT NULL DEFAULT '{}', -- JSON: how the lesson was made (child, year, length, delivery, theme, warnings, generation report)
  updated_at TEXT NOT NULL,
  PRIMARY KEY (batch_id, idx)
);
CREATE INDEX IF NOT EXISTS idx_lesson_batch_items_lesson ON lesson_batch_items (lesson_id);
