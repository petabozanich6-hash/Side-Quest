-- Only aggregate outcomes. Never retain tokens, customer addresses, or removed row identifiers.
CREATE TABLE IF NOT EXISTS support_temporary_housekeeping_runs (
 local_date TEXT PRIMARY KEY,
 run_id TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL CHECK(status IN ('running','complete','review')),
 attempted_at TEXT NOT NULL,
 finished_at TEXT,
 links_removed INTEGER NOT NULL DEFAULT 0,
 sessions_removed INTEGER NOT NULL DEFAULT 0
);
