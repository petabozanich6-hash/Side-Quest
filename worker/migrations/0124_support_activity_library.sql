-- Private reusable teaching activities; never shared until reviewed and explicitly launched.
CREATE TABLE IF NOT EXISTS support_activity_templates (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 subject TEXT NOT NULL,
 year_level TEXT NOT NULL,
 question TEXT NOT NULL,
 activity_type TEXT NOT NULL CHECK(activity_type IN ('choice','poll','short')),
 options_json TEXT NOT NULL,
 answer_key TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','reviewed','archived')),
 revision INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_support_activity_templates_search ON support_activity_templates(status,updated_at DESC);
