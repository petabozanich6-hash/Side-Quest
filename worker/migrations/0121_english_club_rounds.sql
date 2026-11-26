CREATE TABLE IF NOT EXISTS support_english_rounds (
 id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',
 session_count INTEGER NOT NULL CHECK(session_count BETWEEN 2 AND 12),
 published INTEGER NOT NULL DEFAULT 0 CHECK(published IN (0,1)),
 created_by TEXT NOT NULL,created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS support_english_round_classes (
 round_id TEXT NOT NULL REFERENCES support_english_rounds(id) ON DELETE RESTRICT,
 class_id TEXT NOT NULL UNIQUE REFERENCES support_english_classes(id) ON DELETE RESTRICT,
 sequence INTEGER NOT NULL CHECK(sequence BETWEEN 1 AND 12),
 PRIMARY KEY(round_id,sequence)
);
CREATE TABLE IF NOT EXISTS support_english_round_enrolments (
 id TEXT PRIMARY KEY,round_id TEXT NOT NULL REFERENCES support_english_rounds(id) ON DELETE RESTRICT,
 request_id TEXT NOT NULL UNIQUE REFERENCES support_guest_requests(id) ON DELETE RESTRICT,
 learner_id TEXT NOT NULL REFERENCES support_portal_learners(id) ON DELETE RESTRICT,
 payment_mode TEXT NOT NULL CHECK(payment_mode IN ('weekly','upfront')),
 total_cents INTEGER NOT NULL CHECK(total_cents BETWEEN 2400 AND 14400),
 terms_version TEXT NOT NULL,created_at TEXT NOT NULL,
 UNIQUE(round_id,learner_id)
);
-- Standalone classes remain historical; retire unpublished individual self-service pilot.
UPDATE support_english_publications SET enabled=0 WHERE enabled=1;
