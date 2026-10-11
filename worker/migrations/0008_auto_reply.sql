-- Tracks the last automatic reply sent to each sender so nobody gets more than one per 24 hours.
CREATE TABLE IF NOT EXISTS auto_replies (
  sender TEXT PRIMARY KEY,
  last_sent_at TEXT NOT NULL
);
