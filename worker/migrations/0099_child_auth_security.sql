-- Invalidate child sessions after PIN changes and track login attempts across Workers.
ALTER TABLE students ADD COLUMN credential_version INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS child_login_attempts (
  key TEXT PRIMARY KEY,
  window_started INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
