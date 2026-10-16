-- Additive. Every existing user is grandfathered in, regardless of email_verified_at.
ALTER TABLE users ADD COLUMN email_verified_at TEXT;
ALTER TABLE users ADD COLUMN email_verification_required_at TEXT;
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verification_tokens(user_id, created_at DESC);
