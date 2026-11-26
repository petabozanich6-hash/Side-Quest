-- Moderated collaboration reuses private short-answer submissions.
ALTER TABLE support_activity_templates ADD COLUMN collaborative INTEGER NOT NULL DEFAULT 0 CHECK(collaborative IN (0,1));
ALTER TABLE support_live_activities ADD COLUMN collaborative INTEGER NOT NULL DEFAULT 0 CHECK(collaborative IN (0,1));
CREATE TABLE IF NOT EXISTS support_live_collaboration_entries (
 id TEXT PRIMARY KEY,
 activity_id TEXT NOT NULL REFERENCES support_live_activities(id) ON DELETE CASCADE,
 position INTEGER NOT NULL CHECK(position BETWEEN 1 AND 20),
 body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 500),
 created_at TEXT NOT NULL,
 UNIQUE(activity_id,position)
);
