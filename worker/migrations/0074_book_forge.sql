-- Owner-only Book Forge. Additive; mirrored by runtime ensures.
CREATE TABLE IF NOT EXISTS book_forge_projects (
 id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, title TEXT NOT NULL, revision INTEGER NOT NULL,
 document TEXT NOT NULL, updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS book_forge_jobs (
 project_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, family_id TEXT NOT NULL,
 status TEXT NOT NULL, phase TEXT NOT NULL, cursor INTEGER NOT NULL DEFAULT 0,
 payload TEXT NOT NULL, error TEXT NOT NULL DEFAULT '', lease TEXT, lease_until TEXT,
 updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_forge_one_active_owner ON book_forge_jobs(owner_id) WHERE status IN ('queued','running');
