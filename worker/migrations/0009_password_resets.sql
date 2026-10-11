-- Single-use password reset tokens. Only a SHA-256 hash of each token is stored.
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets (token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id, created_at);
