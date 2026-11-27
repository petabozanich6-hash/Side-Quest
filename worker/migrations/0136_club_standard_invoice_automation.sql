CREATE TABLE IF NOT EXISTS support_club_invoice_auto_attempts (
 kind TEXT NOT NULL CHECK(kind IN ('single','round')),
 obligation_id TEXT NOT NULL,
 approved_by TEXT NOT NULL,
 attempted_at TEXT NOT NULL,
 finished_at TEXT,
 status TEXT NOT NULL CHECK(status IN ('running','issued','review')),
 PRIMARY KEY(kind,obligation_id)
);
