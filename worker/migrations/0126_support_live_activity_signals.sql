-- Ephemeral participation status, scoped to a single active activity and seat.
CREATE TABLE IF NOT EXISTS support_live_activity_signals (
 activity_id TEXT NOT NULL REFERENCES support_live_activities(id) ON DELETE CASCADE,
 seat_id TEXT NOT NULL,
 signal TEXT NOT NULL CHECK(signal IN ('question','hint','time','confused','ready','clear')),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(activity_id,seat_id)
);
