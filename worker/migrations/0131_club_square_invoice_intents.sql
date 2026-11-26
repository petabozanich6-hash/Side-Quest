-- Club obligations are intentionally not tutoring service orders.
CREATE VIEW IF NOT EXISTS support_club_payment_obligations AS
 SELECT 'single' kind,s.id obligation_id,s.request_id,s.learner_id,s.amount_cents,s.due_at,s.status,
 s.terms_version,s.terms_snapshot,1 expected_seats,'single' payment_mode
 FROM support_english_single_bookings s
 UNION ALL
 SELECT 'round',p.id,e.request_id,e.learner_id,p.amount_cents,p.due_at,p.status,
 e.terms_version,e.terms_snapshot,CASE WHEN p.sequence=0 THEN r.session_count ELSE 1 END,e.payment_mode
 FROM support_english_round_payments p JOIN support_english_round_enrolments e ON e.id=p.round_enrolment_id
 JOIN support_english_rounds r ON r.id=e.round_id
 WHERE (p.sequence=0 AND e.payment_mode='upfront' AND p.amount_cents=r.session_count*r.price_per_session_cents AND p.amount_cents=e.total_cents)
 OR (p.sequence BETWEEN 1 AND r.session_count AND e.payment_mode='weekly' AND p.amount_cents=r.price_per_session_cents);
CREATE VIEW IF NOT EXISTS support_club_obligation_seats AS
 SELECT 'single' kind,s.id obligation_id,e.id seat_id,c.id class_id,c.start_at,c.end_at,e.status,e.payment_due_at
 FROM support_english_single_bookings s JOIN support_english_enrolments e ON e.id=s.enrolment_id AND e.request_id=s.request_id
 JOIN support_english_classes c ON c.id=e.class_id
 UNION ALL
 SELECT 'round',p.id,e.id,c.id,c.start_at,c.end_at,e.status,e.payment_due_at
 FROM support_english_round_payments p JOIN support_english_round_enrolments r ON r.id=p.round_enrolment_id
 JOIN support_english_round_classes x ON x.round_id=r.round_id AND (p.sequence=0 OR p.sequence=x.sequence)
 JOIN support_english_classes c ON c.id=x.class_id JOIN support_english_enrolments e ON e.class_id=c.id AND e.request_id=r.request_id;
CREATE TABLE IF NOT EXISTS support_club_square_intents (
 kind TEXT NOT NULL CHECK(kind IN ('single','round')),
 obligation_id TEXT NOT NULL,
 request_id TEXT NOT NULL,
 fingerprint TEXT NOT NULL,
 snapshot_json TEXT NOT NULL,
 customer_id TEXT NOT NULL,
 location_id TEXT NOT NULL,
 amount_cents INTEGER NOT NULL,
 due_at TEXT NOT NULL,
 order_key TEXT NOT NULL UNIQUE,
 invoice_key TEXT NOT NULL UNIQUE,
 publish_key TEXT NOT NULL UNIQUE,
 approved_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'prepared' CHECK(state IN ('prepared','order_pending','order_created','invoice_pending','draft_created','publish_pending','issued','paid','review','cancelled')),
 provider_order_id TEXT UNIQUE,
 provider_invoice_id TEXT UNIQUE,
 PRIMARY KEY(kind,obligation_id)
);
