-- Curriculum outcome progress per child: the shared five-level progression used by the Outcome & Mastery Tracker and
-- Auto-Quest (not_started, introduced, developing, demonstrated, achieved). Additive only; no existing rows change.
-- One row per child and outcome holds the current level; every change is also written to the history table.
CREATE TABLE IF NOT EXISTS outcome_progress (
  student_id TEXT NOT NULL,
  code TEXT NOT NULL,
  family_id TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'not_started',
  parent_confirmed INTEGER NOT NULL DEFAULT 0, -- 1 when a parent set this level themselves; automatic updates never lower it
  source TEXT NOT NULL DEFAULT 'parent',      -- parent | review | lesson
  note TEXT,
  updated_by TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (student_id, code)
);
CREATE INDEX IF NOT EXISTS idx_outcome_progress_family ON outcome_progress (family_id, student_id);

CREATE TABLE IF NOT EXISTS outcome_progress_events (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  code TEXT NOT NULL,
  from_level TEXT,
  to_level TEXT NOT NULL,
  source TEXT NOT NULL,
  parent_confirmed INTEGER NOT NULL DEFAULT 0,
  ref_type TEXT, -- submission | lesson | null
  ref_id TEXT,
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outcome_progress_events_student ON outcome_progress_events (student_id, code, created_at);
