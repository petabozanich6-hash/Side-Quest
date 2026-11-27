-- Parent-facing reports are separate from private tutor evidence.
CREATE TABLE IF NOT EXISTS support_family_progress_reports (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('tutoring','club')),
 session_id TEXT NOT NULL,
 seat_id TEXT NOT NULL,
 request_id TEXT NOT NULL,
 family_id TEXT NOT NULL,
 parent_user_id TEXT NOT NULL,
 learner_id TEXT NOT NULL,
 sections_json TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 published_sections_json TEXT,
 published_at TEXT,
 updated_at TEXT NOT NULL,
 UNIQUE(kind,session_id,seat_id)
);
CREATE INDEX IF NOT EXISTS idx_support_family_progress_reports_parent ON support_family_progress_reports(family_id,parent_user_id,published_at);
