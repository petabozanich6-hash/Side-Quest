-- Private, ordered activity preparation per scheduled session.
CREATE TABLE IF NOT EXISTS support_session_activity_plans (
 kind TEXT NOT NULL CHECK(kind IN ('tutoring','club')),
 session_id TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 items_json TEXT NOT NULL DEFAULT '[]',
 updated_at TEXT NOT NULL,
 PRIMARY KEY(kind,session_id)
);
