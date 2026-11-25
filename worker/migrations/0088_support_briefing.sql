-- Owner-controlled daily digest. No learner details or email addresses stored in the delivery ledger.
CREATE TABLE IF NOT EXISTS support_briefing_settings (id INTEGER PRIMARY KEY CHECK(id=1), enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)), hour INTEGER NOT NULL DEFAULT 7 CHECK(hour BETWEEN 0 AND 23), updated_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS support_briefing_delivery (local_date TEXT PRIMARY KEY, status TEXT NOT NULL CHECK(status IN ('sending','sent','review')), attempted_at TEXT NOT NULL, sent_at TEXT);
