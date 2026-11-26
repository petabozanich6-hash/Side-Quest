-- Individual places in published rounds, distinct from historical $12 classes.
CREATE TABLE IF NOT EXISTS support_english_single_bookings (
 id TEXT PRIMARY KEY,
 enrolment_id TEXT NOT NULL UNIQUE REFERENCES support_english_enrolments(id) ON DELETE RESTRICT,
 request_id TEXT NOT NULL UNIQUE REFERENCES support_guest_requests(id) ON DELETE RESTRICT,
 learner_id TEXT NOT NULL REFERENCES support_portal_learners(id) ON DELETE RESTRICT,
 amount_cents INTEGER NOT NULL CHECK(amount_cents=1500),
 due_at TEXT NOT NULL,
 terms_version TEXT NOT NULL,terms_snapshot TEXT NOT NULL,
 certificate_delivery TEXT NOT NULL CHECK(certificate_delivery IN ('pdf','post','both')),
 status TEXT NOT NULL DEFAULT 'awaiting_invoice' CHECK(status IN ('awaiting_invoice','issued','paid','review','cancelled')),
 created_at TEXT NOT NULL
);
