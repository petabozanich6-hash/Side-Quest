-- Owner replies to feedback; parent reads only replies to their own submitted reports.
-- Private internal owner_note remains only in parent_feedback, never sent to the parent.
CREATE TABLE IF NOT EXISTS parent_feedback_replies (
  id TEXT PRIMARY KEY,
  feedback_id TEXT NOT NULL REFERENCES parent_feedback(id) ON DELETE CASCADE,
  author_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  parent_read_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_thread ON parent_feedback_replies(feedback_id,created_at,id);
CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_unread ON parent_feedback_replies(feedback_id,parent_read_at);
