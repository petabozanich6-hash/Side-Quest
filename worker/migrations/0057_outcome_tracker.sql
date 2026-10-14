-- Curriculum Outcome & Mastery Tracker. Additive only: three new tables, no existing rows are changed or deleted.
-- The Worker also creates these tables at runtime if this migration has not been applied yet (see outcomeTracker.ts).
--
-- outcome_evidence: one row per piece of learning evidence for one child and one outcome. Each row LINKS to where the
--   evidence already lives (a submission, a quiz attempt set, a life learning entry, an Evidence Backpack note) by
--   source_type + source_id; it never copies the work itself. The unique key stops the same source counting twice.
--   removed_at: the source was deleted or no longer maps to this outcome (kept for history, not counted).
--   excluded_at: a parent chose not to count this evidence (kept for history, never undone by a resync).
-- outcome_progress: the current status per child and outcome, with a snapshot of the outcome wording and the catalogue
--   version, so later curriculum updates cannot rewrite what a parent saw or confirmed.
-- outcome_status_history: append-only log of every status change and the reason for it.

CREATE TABLE IF NOT EXISTS outcome_evidence (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  framework TEXT NOT NULL,
  outcome_code TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  lesson_id TEXT,
  assignment_id TEXT,
  origin TEXT,
  level TEXT NOT NULL,
  support TEXT,
  consolidate INTEGER NOT NULL DEFAULT 0,
  comprehensive INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  total INTEGER,
  summary TEXT,
  note TEXT,
  file_ids TEXT NOT NULL DEFAULT '[]',
  occurred_on TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  removed_at TEXT,
  removed_reason TEXT,
  excluded_at TEXT,
  excluded_reason TEXT,
  UNIQUE (student_id, framework, outcome_code, source_type, source_id)
);

CREATE TABLE IF NOT EXISTS outcome_progress (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  framework TEXT NOT NULL,
  outcome_code TEXT NOT NULL,
  learning_area TEXT,
  stage TEXT,
  description TEXT,
  catalogue_version TEXT,
  computed_status TEXT NOT NULL DEFAULT 'not_started',
  status TEXT NOT NULL DEFAULT 'not_started',
  status_reason TEXT,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  first_evidence_on TEXT,
  last_evidence_on TEXT,
  parent_confirmed_at TEXT,
  parent_confirmed_by TEXT,
  confirmation_note TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (student_id, framework, outcome_code)
);

CREATE TABLE IF NOT EXISTS outcome_status_history (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  framework TEXT NOT NULL,
  outcome_code TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  computed_status TEXT,
  reason TEXT NOT NULL,
  actor TEXT NOT NULL,
  actor_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outcome_evidence_student ON outcome_evidence (family_id, student_id, framework, outcome_code);
CREATE INDEX IF NOT EXISTS idx_outcome_evidence_source ON outcome_evidence (family_id, source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_outcome_progress_student ON outcome_progress (family_id, student_id, framework);
CREATE INDEX IF NOT EXISTS idx_outcome_history_student ON outcome_status_history (family_id, student_id, framework, outcome_code, created_at);
