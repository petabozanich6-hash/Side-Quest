CREATE TABLE IF NOT EXISTS help_requests (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  emailed_at TEXT,
  resolved_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_help_requests_family ON help_requests (family_id, resolved_at);
