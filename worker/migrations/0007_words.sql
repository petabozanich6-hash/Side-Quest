CREATE TABLE IF NOT EXISTS word_bank (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  word TEXT NOT NULL,
  hint TEXT,
  stage TEXT NOT NULL DEFAULT 'wild',
  streak INTEGER NOT NULL DEFAULT 0,
  correct_days TEXT NOT NULL DEFAULT '[]',
  attempts INTEGER NOT NULL DEFAULT 0,
  attempt_day TEXT,
  attempts_today INTEGER NOT NULL DEFAULT 0,
  misses INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual',
  lesson_id TEXT,
  added_by TEXT,
  created_at TEXT NOT NULL,
  last_practised TEXT,
  mastered_at TEXT,
  UNIQUE(student_id, family_id, word)
);

CREATE TABLE IF NOT EXISTS word_practice (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  word_id TEXT NOT NULL REFERENCES word_bank(id),
  word TEXT NOT NULL,
  correct INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_submissions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  family_id TEXT NOT NULL REFERENCES families(id),
  title TEXT NOT NULL,
  author TEXT,
  read_date TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  pages INTEGER,
  book_type TEXT NOT NULL DEFAULT 'fiction',
  reading_mode TEXT NOT NULL DEFAULT 'independent',
  status TEXT NOT NULL DEFAULT 'pending',
  parent_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  reading_log_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_word_bank_student ON word_bank(student_id, family_id);
CREATE INDEX IF NOT EXISTS idx_word_bank_stage ON word_bank(student_id, stage);
CREATE INDEX IF NOT EXISTS idx_word_practice_student ON word_practice(student_id, date);
CREATE INDEX IF NOT EXISTS idx_word_practice_word ON word_practice(word_id, at);
CREATE INDEX IF NOT EXISTS idx_reading_submissions_student ON reading_submissions(student_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reading_submissions_pending ON reading_submissions(family_id, status, created_at);
