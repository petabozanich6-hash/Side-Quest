-- Parent feedback inbox: server-derived family/account identifiers and private Owner HQ workflow.
-- No children's data, browser tokens or credentials are collected.
CREATE TABLE IF NOT EXISTS parent_feedback (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('problem','idea','feedback','other')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  page_hint TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','in_progress','resolved','closed')),
  owner_note TEXT NOT NULL DEFAULT '',
  seen_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_parent_feedback_created ON parent_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_feedback_family ON parent_feedback(family_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parent_feedback_unseen ON parent_feedback(seen_at,created_at DESC);
