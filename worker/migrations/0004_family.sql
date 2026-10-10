ALTER TABLE students ADD COLUMN extra TEXT NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN oauth_provider TEXT;

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  title TEXT NOT NULL,
  framework TEXT NOT NULL DEFAULT 'NSW',
  stage TEXT NOT NULL,
  year_level TEXT,
  learning_areas TEXT NOT NULL DEFAULT '[]',
  start_date TEXT,
  end_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  program_id TEXT NOT NULL REFERENCES programs(id),
  title TEXT NOT NULL,
  big_question TEXT,
  essential_understanding TEXT,
  subjects TEXT NOT NULL DEFAULT '[]',
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  outcomes TEXT NOT NULL DEFAULT '[]',
  description TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  uploader_id TEXT NOT NULL,
  uploader_role TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  context TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reading_log (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  student_id TEXT NOT NULL REFERENCES students(id),
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
  difficulty TEXT,
  parent_note TEXT,
  logged_by TEXT NOT NULL,
  logged_role TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_programs_family_student ON programs(family_id, student_id);
CREATE INDEX IF NOT EXISTS idx_units_family_program ON units(family_id, program_id);
CREATE INDEX IF NOT EXISTS idx_files_family ON files(family_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reading_log_family_student_date ON reading_log(family_id, student_id, read_date);
