CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  results TEXT NOT NULL DEFAULT '[]',
  completed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_evidence (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  text TEXT,
  file_name TEXT,
  file_ids TEXT NOT NULL DEFAULT '[]',
  submitted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS life_evidence (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  duration_minutes INTEGER,
  location TEXT,
  file_ids TEXT NOT NULL DEFAULT '[]',
  parent_note TEXT,
  status TEXT NOT NULL DEFAULT 'awaiting_mapping',
  suggested_mappings TEXT NOT NULL DEFAULT '[]',
  accepted_mappings TEXT NOT NULL DEFAULT '[]',
  ai_summary TEXT,
  ai_activity_type TEXT,
  ai_additional TEXT,
  created_by TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS learning_plans (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  title TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  interests TEXT NOT NULL DEFAULT '[]',
  subject_focus TEXT NOT NULL DEFAULT '[]',
  teaching_approach TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  ai_content TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

ALTER TABLE students ADD COLUMN electives TEXT NOT NULL DEFAULT '[]';
ALTER TABLE students ADD COLUMN subject_levels TEXT NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_quiz_results_family_lesson ON quiz_results(family_id, lesson_id, child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_evidence_family_lesson ON lesson_evidence(family_id, lesson_id, child_id);
CREATE INDEX IF NOT EXISTS idx_life_evidence_family_student ON life_evidence(family_id, student_id, status);
CREATE INDEX IF NOT EXISTS idx_learning_plans_family_student ON learning_plans(family_id, student_id);
