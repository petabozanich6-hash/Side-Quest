CREATE TABLE IF NOT EXISTS support_teaching_decks (id TEXT PRIMARY KEY,title TEXT NOT NULL,subject TEXT NOT NULL,year_level TEXT NOT NULL,slides_json TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('draft','reviewed','archived')),revision INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_decks_subject ON support_teaching_decks(status,subject,year_level,updated_at DESC);
