CREATE TABLE IF NOT EXISTS reading_log (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  family_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  pages INTEGER,
  pages_read INTEGER,
  read_date TEXT NOT NULL,
  duration_minutes INTEGER,
  source TEXT NOT NULL DEFAULT 'home',
  book_type TEXT NOT NULL DEFAULT 'fiction',
  reading_mode TEXT NOT NULL DEFAULT 'independent',
  comprehension_notes TEXT,
  favourite_part TEXT,
  difficulty TEXT NOT NULL DEFAULT 'just_right',
  parent_note TEXT,
  verified_by_parent INTEGER NOT NULL DEFAULT 0,
  submitted_by_child INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_submissions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  family_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  read_date TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  pages INTEGER,
  book_type TEXT NOT NULL DEFAULT 'fiction',
  reading_mode TEXT NOT NULL DEFAULT 'independent',
  status TEXT NOT NULL DEFAULT 'pending',
  parent_note TEXT NOT NULL DEFAULT '',
  reading_log_id TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reading_log_student ON reading_log(student_id, read_date);
CREATE INDEX IF NOT EXISTS idx_reading_log_family ON reading_log(family_id);
CREATE INDEX IF NOT EXISTS idx_reading_subs_family ON reading_submissions(family_id, status);
CREATE INDEX IF NOT EXISTS idx_reading_subs_student ON reading_submissions(student_id, created_at);
