CREATE TABLE IF NOT EXISTS support_club_notices (
 kind TEXT NOT NULL CHECK(kind IN ('single','round')),
 obligation_id TEXT NOT NULL,
 notice_type TEXT NOT NULL CHECK(notice_type IN ('confirmation','payment_reminder','overdue','session_reminder')),
 seat_key TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL CHECK(status IN ('sending','sent','review','suppressed')),
 attempted_at TEXT NOT NULL,
 sent_at TEXT,
 PRIMARY KEY(kind,obligation_id,notice_type,seat_key)
);
