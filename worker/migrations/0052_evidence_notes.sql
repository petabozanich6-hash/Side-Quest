-- Parent-added evidence that is not tied to a lesson (excursions, observations, projects). Additive only.
CREATE TABLE IF NOT EXISTS evidence_notes (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  title TEXT NOT NULL,
  learning_area TEXT,
  notes TEXT,
  occurred_on TEXT NOT NULL,
  file_ids TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evidence_notes_family_student ON evidence_notes (family_id, student_id, occurred_on);
