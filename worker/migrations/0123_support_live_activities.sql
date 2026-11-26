-- Shared live question engine. No rooms or activities are opened by migration.
CREATE TABLE IF NOT EXISTS support_live_activities (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('tutoring','club')),
 session_id TEXT NOT NULL,
 question TEXT NOT NULL,
 activity_type TEXT NOT NULL CHECK(activity_type IN ('choice','poll','short')),
 options_json TEXT NOT NULL,
 answer_key TEXT,
 state TEXT NOT NULL DEFAULT 'open' CHECK(state IN ('open','revealed','closed')),
 created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_support_live_activity_current ON support_live_activities(kind,session_id) WHERE state<>'closed';
CREATE TABLE IF NOT EXISTS support_live_activity_responses (
 activity_id TEXT NOT NULL REFERENCES support_live_activities(id) ON DELETE CASCADE,
 seat_id TEXT NOT NULL,
 response TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 PRIMARY KEY(activity_id,seat_id)
);
