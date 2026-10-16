-- Per-child, per-jurisdiction Home Schooling Compass checklist, self-reported status and dates.
-- Registration remains with the government authority. Never store government identity/court documents here.
CREATE TABLE IF NOT EXISTS homeschool_compass_progress (
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  jurisdiction TEXT NOT NULL,
  completed_steps TEXT NOT NULL DEFAULT '[]',
  registration_status TEXT NOT NULL DEFAULT 'not_started',
  submitted_on TEXT,
  approved_on TEXT,
  expires_on TEXT,
  notes TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (family_id, student_id, jurisdiction)
);
CREATE INDEX IF NOT EXISTS idx_homeschool_compass_family
  ON homeschool_compass_progress (family_id, jurisdiction);
