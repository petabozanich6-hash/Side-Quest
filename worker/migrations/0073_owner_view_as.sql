-- "View site as" for the platform owner (worker/src/viewAs.ts). Additive only.
-- The Worker also creates this table itself on first use. Rows only ever exist for the owner's own family and expire.
CREATE TABLE IF NOT EXISTS owner_view_as (
  family_id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  user_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
