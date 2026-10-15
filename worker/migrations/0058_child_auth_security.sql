-- Sign-in security. Additive only: one new column (default 0, so every existing child keeps signing in) and one new table.
-- students.credential_version: bumped whenever a parent changes a child's PIN; child sessions carry it and stop working
--   when it no longer matches, so an old PIN's sessions are revoked.
-- login_attempts: failed sign-in counters (hashed keys only) shared by every Worker instance, for child and parent sign-in.
ALTER TABLE students ADD COLUMN credential_version INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS login_attempts (
  key TEXT PRIMARY KEY,
  window_started INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
