-- Google subject is the stable parent identity. NULL stays allowed for password-only accounts.
ALTER TABLE users ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);

-- Separate from users.is_owner, which only marks the parent who holds the family account.
-- Existing rows become 'parent'. Nothing in this migration, Google sign-in, email
-- matching, or registration sets 'owner'. The Owner account work assigns that value
-- on the server. Its local file worker/dev-migrations/owner_account.sql adds this same
-- column; skip that ALTER once this migration has been applied.
ALTER TABLE users ADD COLUMN platform_role TEXT NOT NULL DEFAULT 'parent';
CREATE INDEX IF NOT EXISTS idx_users_platform_role ON users(platform_role);

-- Server-side sessions so logout can revoke a token before it expires.
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  family_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id, revoked_at);

-- One-time handoff from the Google redirect to the browser. The raw ticket is never stored.
CREATE TABLE IF NOT EXISTS oauth_login_tickets (
  token_hash TEXT PRIMARY KEY,
  bind_hash TEXT NOT NULL,
  kind TEXT NOT NULL,
  payload TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL
);
