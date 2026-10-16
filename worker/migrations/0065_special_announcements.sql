-- Special broadcast messages: opt-in for optional news, provider handoff tracking, one mail per parent.
-- Default opt-in is FALSE for existing accounts. Does not migrate any personal data.
CREATE TABLE IF NOT EXISTS announcement_email_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  opted_in INTEGER NOT NULL DEFAULT 0,
  opted_in_at TEXT,
  consent_source TEXT,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS announcement_broadcasts (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS announcement_recipients (
  broadcast_id TEXT NOT NULL REFERENCES announcement_broadcasts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  claimed_at TEXT,
  sent_at TEXT,
  PRIMARY KEY (broadcast_id,user_id)
);
CREATE INDEX IF NOT EXISTS idx_ann_queued ON announcement_recipients(status,broadcast_id);
CREATE INDEX IF NOT EXISTS idx_ann_recent ON announcement_broadcasts(created_at DESC);
