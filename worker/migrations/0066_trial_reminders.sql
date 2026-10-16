-- One automatic attempt per family and reminder kind. A provider handoff is
-- deliberately not retried: duplicate subscription emails are worse than an occasional miss.
CREATE TABLE IF NOT EXISTS trial_reminder_deliveries (
  family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('two_days_left','preview_ended')),
  status TEXT NOT NULL CHECK (status IN ('attempting','sent','failed')),
  claimed_at TEXT NOT NULL,
  completed_at TEXT,
  PRIMARY KEY (family_id, kind)
);
CREATE INDEX IF NOT EXISTS idx_trial_reminder_status ON trial_reminder_deliveries(status,claimed_at);
