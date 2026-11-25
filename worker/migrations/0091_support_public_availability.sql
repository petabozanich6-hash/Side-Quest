CREATE TABLE IF NOT EXISTS support_public_availability (
 id INTEGER PRIMARY KEY CHECK(id=1), enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
 windows_json TEXT NOT NULL DEFAULT '[]', revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL
);
