-- Selected evidence is a private tutor record, not a parent report.
CREATE TABLE IF NOT EXISTS support_activity_evidence (
 activity_id TEXT NOT NULL REFERENCES support_live_activities(id),
 seat_id TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('tutoring','club')),
 session_id TEXT NOT NULL,
 question TEXT NOT NULL,
 response TEXT NOT NULL,
 game_json TEXT,
 observation TEXT NOT NULL CHECK(length(observation) BETWEEN 1 AND 600),
 achievement TEXT NOT NULL CHECK(achievement IN ('covered','independent','supported','practise')),
 response_updated_at TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 saved_at TEXT NOT NULL,
 PRIMARY KEY(activity_id,seat_id)
);
CREATE INDEX IF NOT EXISTS idx_support_activity_evidence_session ON support_activity_evidence(kind,session_id,seat_id);
