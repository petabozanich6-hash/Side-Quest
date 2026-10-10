CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  family_id TEXT,
  seed_key TEXT UNIQUE,
  title TEXT NOT NULL,
  stage TEXT,
  learning_area TEXT,
  unit_id TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  due_date TEXT,
  scheduled_date TEXT,
  support_level TEXT NOT NULL DEFAULT 'green',
  parent_notes TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  lesson_id TEXT,
  response_text TEXT,
  reflection TEXT,
  file_ids TEXT NOT NULL DEFAULT '[]',
  needs_help INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'submitted',
  parent_feedback TEXT,
  next_step TEXT,
  outcome_mappings TEXT NOT NULL DEFAULT '[]',
  reviewed_at TEXT,
  reviewed_by TEXT,
  submitted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  provider TEXT,
  resource_type TEXT NOT NULL DEFAULT 'link',
  learning_area TEXT,
  stage TEXT,
  purpose TEXT,
  licence TEXT NOT NULL DEFAULT 'unknown',
  attribution TEXT,
  response_task TEXT,
  offline_alternative TEXT,
  age_suitability TEXT,
  approved INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'needs_checking',
  shared INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cheers (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  from_user_id TEXT,
  from_name TEXT,
  message TEXT NOT NULL,
  emoji TEXT,
  seen INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT,
  duration_minutes INTEGER,
  event_type TEXT NOT NULL DEFAULT 'lesson',
  linked_lesson_id TEXT,
  linked_assignment_id TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_family ON lessons(family_id);
CREATE INDEX IF NOT EXISTS idx_assignments_family ON assignments(family_id, student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_family ON submissions(family_id, student_id);
CREATE INDEX IF NOT EXISTS idx_resources_family ON resources(family_id);
CREATE INDEX IF NOT EXISTS idx_cheers_student ON cheers(student_id);
CREATE INDEX IF NOT EXISTS idx_calendar_family ON calendar_events(family_id);
