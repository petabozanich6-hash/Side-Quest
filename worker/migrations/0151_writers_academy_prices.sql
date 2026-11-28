-- Transactional, additive migration history: preserve existing records and exact IDs.

-- No production execution authorised. Drop/recreate dependent views and triggers without weakening proof guards.

DROP TRIGGER club_invoice_issue_guard;

DROP TRIGGER club_invoice_issue_apply;

DROP TRIGGER club_settlement_guard;

DROP TRIGGER club_settlement_apply;

DROP TRIGGER club_financial_hold_apply;

DROP TRIGGER club_release_guard;

DROP TRIGGER club_release_apply;

DROP VIEW support_club_certificate_candidates;

DROP VIEW support_club_certificate_verified_seats;

DROP VIEW support_club_certificate_seats;

DROP VIEW support_club_certificate_bookings;

DROP VIEW support_club_obligation_seats;

DROP VIEW support_club_payment_obligations;

CREATE TABLE academy_copy_support_english_rounds AS SELECT * FROM support_english_rounds;

CREATE TABLE academy_copy_support_english_round_classes AS SELECT * FROM support_english_round_classes;

CREATE TABLE academy_copy_support_english_round_enrolments AS SELECT * FROM support_english_round_enrolments;

CREATE TABLE academy_copy_support_english_round_payments AS SELECT * FROM support_english_round_payments;

CREATE TABLE academy_copy_support_english_single_bookings AS SELECT * FROM support_english_single_bookings;

DROP TABLE support_english_single_bookings;

DROP TABLE support_english_round_payments;

DROP TABLE support_english_round_enrolments;

DROP TABLE support_english_round_classes;

DROP TABLE support_english_rounds;

CREATE TABLE IF NOT EXISTS support_english_rounds (
 id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',
 session_count INTEGER NOT NULL CHECK(session_count BETWEEN 2 AND 12),
 price_per_session_cents INTEGER NOT NULL DEFAULT 1500 CHECK(price_per_session_cents IN (1500,2500,3000,4500)),
 published INTEGER NOT NULL DEFAULT 0 CHECK(published IN (0,1)),
 created_by TEXT NOT NULL,created_at TEXT NOT NULL,curriculum_id TEXT,
 price_version TEXT NOT NULL DEFAULT 'legacy-v1',upfront_cents INTEGER,
 CHECK((price_version='legacy-v1' AND price_per_session_cents=1500 AND upfront_cents IS NULL) OR (price_version='academy-launch-v1' AND session_count=6 AND upfront_cents IS NOT NULL AND ((curriculum_id='english-creative-camp-junior-v1' AND price_per_session_cents=2500 AND upfront_cents=13500) OR (curriculum_id='english-creative-camp-senior-v1' AND price_per_session_cents=3000 AND upfront_cents=16500) OR (curriculum_id='english-author-studio-adult-v1' AND price_per_session_cents=4500 AND upfront_cents=24000))))
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
 total_cents INTEGER NOT NULL CHECK(total_cents BETWEEN 3000 AND 27000),
 terms_version TEXT NOT NULL,terms_snapshot TEXT NOT NULL,
 certificate_delivery TEXT NOT NULL CHECK(certificate_delivery IN ('pdf','post','both')),
 created_at TEXT NOT NULL,
 UNIQUE(round_id,learner_id)
);

CREATE TABLE IF NOT EXISTS support_english_round_payments (
 id TEXT PRIMARY KEY,
 round_enrolment_id TEXT NOT NULL REFERENCES support_english_round_enrolments(id) ON DELETE RESTRICT,
 sequence INTEGER NOT NULL CHECK(sequence BETWEEN 0 AND 12),
 amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 1500 AND 24000),
 due_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'awaiting_invoice' CHECK(status IN ('awaiting_invoice','issued','paid','review','cancelled')),
 UNIQUE(round_enrolment_id,sequence)
);

CREATE TABLE IF NOT EXISTS support_english_single_bookings (
 id TEXT PRIMARY KEY,
 enrolment_id TEXT NOT NULL UNIQUE REFERENCES support_english_enrolments(id) ON DELETE RESTRICT,
 request_id TEXT NOT NULL UNIQUE REFERENCES support_guest_requests(id) ON DELETE RESTRICT,
 learner_id TEXT NOT NULL REFERENCES support_portal_learners(id) ON DELETE RESTRICT,
 amount_cents INTEGER NOT NULL CHECK(amount_cents IN (1500,2500,3000,4500)),
 due_at TEXT NOT NULL,
 terms_version TEXT NOT NULL,terms_snapshot TEXT NOT NULL,
 certificate_delivery TEXT NOT NULL CHECK(certificate_delivery IN ('pdf','post','both')),
 status TEXT NOT NULL DEFAULT 'awaiting_invoice' CHECK(status IN ('awaiting_invoice','issued','paid','review','cancelled')),
 created_at TEXT NOT NULL
);

INSERT INTO support_english_rounds(id,title,description,session_count,price_per_session_cents,published,created_by,created_at,curriculum_id) SELECT id,title,description,session_count,price_per_session_cents,published,created_by,created_at,curriculum_id FROM academy_copy_support_english_rounds;

INSERT INTO support_english_round_classes SELECT * FROM academy_copy_support_english_round_classes;

INSERT INTO support_english_round_enrolments SELECT * FROM academy_copy_support_english_round_enrolments;

INSERT INTO support_english_round_payments SELECT * FROM academy_copy_support_english_round_payments;

INSERT INTO support_english_single_bookings SELECT * FROM academy_copy_support_english_single_bookings;

DROP TABLE academy_copy_support_english_rounds;

DROP TABLE academy_copy_support_english_round_classes;

DROP TABLE academy_copy_support_english_round_enrolments;

DROP TABLE academy_copy_support_english_round_payments;

DROP TABLE academy_copy_support_english_single_bookings;

CREATE VIEW IF NOT EXISTS support_club_payment_obligations AS
 SELECT 'single' kind,s.id obligation_id,s.request_id,s.learner_id,s.amount_cents,s.due_at,s.status,
 s.terms_version,s.terms_snapshot,1 expected_seats,'single' payment_mode
 FROM support_english_single_bookings s
 WHERE s.amount_cents=1500 OR EXISTS(SELECT 1 FROM support_english_enrolments e JOIN support_english_round_classes x ON x.class_id=e.class_id JOIN support_english_rounds r ON r.id=x.round_id WHERE e.id=s.enrolment_id AND e.request_id=s.request_id AND r.price_version='academy-launch-v1' AND r.price_per_session_cents=s.amount_cents)
 UNION ALL
 SELECT 'round',p.id,e.request_id,e.learner_id,p.amount_cents,p.due_at,p.status,
 e.terms_version,e.terms_snapshot,CASE WHEN p.sequence=0 THEN r.session_count ELSE 1 END,e.payment_mode
 FROM support_english_round_payments p JOIN support_english_round_enrolments e ON e.id=p.round_enrolment_id
 JOIN support_english_rounds r ON r.id=e.round_id
 WHERE (p.sequence=0 AND e.payment_mode='upfront' AND p.amount_cents=COALESCE(r.upfront_cents,r.session_count*r.price_per_session_cents) AND p.amount_cents=e.total_cents)
 OR (p.sequence BETWEEN 1 AND r.session_count AND e.payment_mode='weekly' AND p.amount_cents=r.price_per_session_cents AND e.total_cents=r.session_count*r.price_per_session_cents);

CREATE VIEW IF NOT EXISTS support_club_obligation_seats AS
 SELECT 'single' kind,s.id obligation_id,e.id seat_id,c.id class_id,c.start_at,c.end_at,e.status,e.payment_due_at
 FROM support_english_single_bookings s JOIN support_english_enrolments e ON e.id=s.enrolment_id AND e.request_id=s.request_id
 JOIN support_english_classes c ON c.id=e.class_id
 UNION ALL
 SELECT 'round',p.id,e.id,c.id,c.start_at,c.end_at,e.status,e.payment_due_at
 FROM support_english_round_payments p JOIN support_english_round_enrolments r ON r.id=p.round_enrolment_id
 JOIN support_english_round_classes x ON x.round_id=r.round_id AND (p.sequence=0 OR p.sequence=x.sequence)
 JOIN support_english_classes c ON c.id=x.class_id JOIN support_english_enrolments e ON e.class_id=c.id AND e.request_id=r.request_id;

CREATE VIEW IF NOT EXISTS support_club_certificate_bookings AS
 SELECT 'single' kind,b.id booking_id,b.request_id,b.learner_id,b.certificate_delivery,c.topic title,1 expected_count
 FROM support_english_single_bookings b JOIN support_english_enrolments e ON e.id=b.enrolment_id AND e.request_id=b.request_id JOIN support_english_classes c ON c.id=e.class_id
 UNION ALL
 SELECT 'round',b.id,b.request_id,b.learner_id,b.certificate_delivery,r.title,r.session_count
 FROM support_english_round_enrolments b JOIN support_english_rounds r ON r.id=b.round_id;

CREATE VIEW IF NOT EXISTS support_club_certificate_seats AS
 SELECT 'single' kind,b.id booking_id,e.id seat_id,e.class_id,e.status,e.attendance,c.start_at,c.end_at,c.topic
 FROM support_english_single_bookings b JOIN support_english_enrolments e ON e.id=b.enrolment_id AND e.request_id=b.request_id JOIN support_english_classes c ON c.id=e.class_id
 UNION ALL
 SELECT 'round',b.id,e.id,e.class_id,e.status,e.attendance,c.start_at,c.end_at,c.topic
 FROM support_english_round_enrolments b JOIN support_english_round_classes x ON x.round_id=b.round_id
 JOIN support_english_classes c ON c.id=x.class_id JOIN support_english_enrolments e ON e.class_id=c.id AND e.request_id=b.request_id;

CREATE VIEW IF NOT EXISTS support_club_certificate_verified_seats AS
 SELECT s.*,
 CASE WHEN s.status='paid' AND EXISTS(
 SELECT 1 FROM support_club_obligation_seats m JOIN support_club_payment_obligations o ON o.kind=m.kind AND o.obligation_id=m.obligation_id
 JOIN support_club_square_intents i ON i.kind=o.kind AND i.obligation_id=o.obligation_id AND i.request_id=o.request_id AND i.amount_cents=o.amount_cents
 JOIN support_club_square_settlements p ON p.kind=i.kind AND p.obligation_id=i.obligation_id AND p.invoice_id=i.provider_invoice_id AND p.amount_cents=i.amount_cents
 WHERE m.seat_id=s.seat_id AND m.class_id=s.class_id AND m.start_at=s.start_at AND m.end_at=s.end_at AND o.status='paid' AND i.state='paid'
 AND NOT EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=i.kind AND v.obligation_id=i.obligation_id)
 AND EXISTS(SELECT 1 FROM json_each(json_extract(i.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.seat_id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=s.start_at AND json_extract(j.value,'$.end_at')=s.end_at)
 ) THEN 1 ELSE 0 END verified_paid
 FROM support_club_certificate_seats s;

CREATE VIEW IF NOT EXISTS support_club_certificate_candidates AS
 SELECT b.*,p.family_id,p.parent_user_id,u.email,COALESCE(st.name,l.label) learner_label,
 (SELECT COUNT(*) FROM support_club_certificate_verified_seats s WHERE s.kind=b.kind AND s.booking_id=b.booking_id) seat_count,
 (SELECT COUNT(*) FROM support_club_certificate_verified_seats s WHERE s.kind=b.kind AND s.booking_id=b.booking_id AND s.attendance='present' AND s.verified_paid=1) completed_count,
 (SELECT MAX(s.end_at) FROM support_club_certificate_verified_seats s WHERE s.kind=b.kind AND s.booking_id=b.booking_id) last_end_at
 FROM support_club_certificate_bookings b
 JOIN support_portal_enquiries p ON p.request_id=b.request_id AND p.learner_id=b.learner_id AND p.service='english-club'
 JOIN support_portal_learners l ON l.id=b.learner_id AND l.family_id=p.family_id
 LEFT JOIN students st ON st.id=l.student_id AND st.family_id=l.family_id
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email
 WHERE NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=p.family_id AND a.status<>'active');

CREATE TRIGGER IF NOT EXISTS club_invoice_issue_guard
BEFORE UPDATE OF state ON support_club_square_intents
WHEN NEW.state='issued' AND OLD.state<>'issued'
BEGIN
 SELECT CASE WHEN OLD.state<>'publish_pending' OR NEW.provider_issued_at IS NULL OR NEW.provider_public_url IS NULL
 OR NEW.publish_approved_version IS NULL OR NEW.provider_invoice_version IS NULL
 OR NOT EXISTS(SELECT 1 FROM support_club_payment_obligations o WHERE o.kind=NEW.kind AND o.obligation_id=NEW.obligation_id AND o.request_id=NEW.request_id AND o.amount_cents=NEW.amount_cents AND o.due_at=NEW.due_at AND o.status='awaiting_invoice')
 OR (SELECT COUNT(*) FROM support_club_obligation_seats s WHERE s.kind=NEW.kind AND s.obligation_id=NEW.obligation_id)<>json_array_length(json_extract(NEW.snapshot_json,'$.snapshot.seats_json'))
 OR EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=NEW.kind AND s.obligation_id=NEW.obligation_id AND (s.status<>'reserved' OR NOT EXISTS(SELECT 1 FROM json_each(json_extract(NEW.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.seat_id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=s.start_at AND json_extract(j.value,'$.end_at')=s.end_at AND json_extract(j.value,'$.payment_due_at')=s.payment_due_at)))
 THEN RAISE(ABORT,'Club invoice issue mapping changed') END;
END;

CREATE TRIGGER IF NOT EXISTS club_invoice_issue_apply
AFTER UPDATE OF state ON support_club_square_intents
WHEN NEW.state='issued' AND OLD.state='publish_pending'
BEGIN
 UPDATE support_english_single_bookings SET status='issued' WHERE NEW.kind='single' AND id=NEW.obligation_id AND status='awaiting_invoice';
 UPDATE support_english_round_payments SET status='issued' WHERE NEW.kind='round' AND id=NEW.obligation_id AND status='awaiting_invoice';
 UPDATE support_english_enrolments SET status='invoiced' WHERE status='reserved' AND id IN (SELECT seat_id FROM support_club_obligation_seats WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id);
END;

CREATE TRIGGER IF NOT EXISTS club_settlement_guard BEFORE INSERT ON support_club_square_settlements BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM support_club_square_intents i JOIN support_club_payment_obligations o ON o.kind=i.kind AND o.obligation_id=i.obligation_id AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email
 WHERE i.kind=NEW.kind AND i.obligation_id=NEW.obligation_id AND i.state='issued' AND o.status='issued' AND i.provider_invoice_id=NEW.invoice_id AND i.amount_cents=NEW.amount_cents
 AND julianday(NEW.captured_at)>=julianday(i.publish_attempted_at) AND julianday(NEW.captured_at)<=julianday(i.due_at) AND julianday(NEW.captured_at)<=julianday(NEW.verified_at)
 AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND lower(u.email)=lower(json_extract(i.snapshot_json,'$.snapshot.recipient')) AND r.status NOT IN ('closed','resolved')
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=u.family_id AND a.status<>'active')
 AND (SELECT COUNT(*) FROM support_club_obligation_seats s WHERE s.kind=i.kind AND s.obligation_id=i.obligation_id)=o.expected_seats
 AND o.expected_seats=json_array_length(json_extract(i.snapshot_json,'$.snapshot.seats_json'))
 AND NOT EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=i.kind AND s.obligation_id=i.obligation_id AND (s.status<>'invoiced' OR julianday(s.start_at)<=julianday(NEW.verified_at) OR NOT EXISTS(SELECT 1 FROM json_each(json_extract(i.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.seat_id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=s.start_at AND json_extract(j.value,'$.end_at')=s.end_at AND json_extract(j.value,'$.payment_due_at')=s.payment_due_at))))
 OR EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=NEW.kind AND v.obligation_id=NEW.obligation_id AND v.reason IN ('refund','dispute','provider_cancellation'))
 OR EXISTS(SELECT 1 FROM support_square_invoice_settlements t WHERE t.payment_id=NEW.payment_id OR t.invoice_id=NEW.invoice_id)
 THEN RAISE(ABORT,'Club payment proof or seat mapping changed') END;
END;

CREATE TRIGGER IF NOT EXISTS club_settlement_apply AFTER INSERT ON support_club_square_settlements BEGIN
 UPDATE support_club_square_intents SET state='paid',updated_at=NEW.verified_at WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id AND state='issued';
 UPDATE support_english_single_bookings SET status='paid' WHERE NEW.kind='single' AND id=NEW.obligation_id AND status='issued';
 UPDATE support_english_round_payments SET status='paid' WHERE NEW.kind='round' AND id=NEW.obligation_id AND status='issued';
 UPDATE support_english_enrolments SET status='paid' WHERE status='invoiced' AND id IN (SELECT seat_id FROM support_club_obligation_seats WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id);
 DELETE FROM support_club_square_reviews WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id AND reason IN ('payment_uncertain','payment_retry');
END;

CREATE TRIGGER IF NOT EXISTS club_financial_hold_apply AFTER UPDATE OF state ON support_club_square_intents WHEN NEW.state='review' AND OLD.state IN ('issued','paid') BEGIN
 UPDATE support_english_single_bookings SET status='review' WHERE NEW.kind='single' AND id=NEW.obligation_id AND status IN ('issued','paid');
 UPDATE support_english_round_payments SET status='review' WHERE NEW.kind='round' AND id=NEW.obligation_id AND status IN ('issued','paid');
 UPDATE support_english_enrolments SET status='invoiced' WHERE status='paid' AND id IN (SELECT seat_id FROM support_club_obligation_seats WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id);
END;

CREATE TRIGGER IF NOT EXISTS club_release_guard BEFORE INSERT ON support_club_square_releases BEGIN
 SELECT CASE WHEN NOT EXISTS(
 SELECT 1 FROM support_club_payment_obligations o WHERE o.kind=NEW.kind AND o.obligation_id=NEW.obligation_id AND julianday(o.due_at)<=julianday(NEW.released_at)
 AND (SELECT COUNT(*) FROM support_club_obligation_seats s WHERE s.kind=o.kind AND s.obligation_id=o.obligation_id)=o.expected_seats
 AND NOT EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=o.kind AND s.obligation_id=o.obligation_id AND (s.status NOT IN ('reserved','invoiced') OR julianday(s.start_at)<=julianday(NEW.released_at)))
 AND NOT EXISTS(SELECT 1 FROM support_club_square_settlements p WHERE p.kind=o.kind AND p.obligation_id=o.obligation_id)
 AND NOT EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=o.kind AND v.obligation_id=o.obligation_id AND v.reason IN ('refund','dispute'))
 AND ((NEW.reason='never_attempted' AND o.status='awaiting_invoice' AND NEW.provider_invoice_id IS NULL AND NEW.provider_version IS NULL
 AND NOT EXISTS(SELECT 1 FROM support_club_square_intents i WHERE i.kind=o.kind AND i.obligation_id=o.obligation_id AND (i.state<>'prepared' OR i.order_attempted_at IS NOT NULL OR i.invoice_attempted_at IS NOT NULL OR i.publish_attempted_at IS NOT NULL OR i.provider_order_id IS NOT NULL OR i.provider_invoice_id IS NOT NULL)))
 OR (NEW.reason='provider_cancelled' AND o.status IN ('issued','review') AND EXISTS(SELECT 1 FROM support_club_square_intents i WHERE i.kind=o.kind AND i.obligation_id=o.obligation_id AND i.state IN ('issued','review') AND i.provider_invoice_id=NEW.provider_invoice_id AND i.provider_order_id IS NOT NULL AND i.provider_issued_at IS NOT NULL AND NEW.provider_version>=i.provider_invoice_version
 AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at
 AND o.expected_seats=json_array_length(json_extract(i.snapshot_json,'$.snapshot.seats_json'))
 AND NOT EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=i.kind AND s.obligation_id=i.obligation_id AND NOT EXISTS(SELECT 1 FROM json_each(json_extract(i.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.seat_id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=s.start_at AND json_extract(j.value,'$.end_at')=s.end_at AND json_extract(j.value,'$.payment_due_at')=s.payment_due_at)))))
 ) THEN RAISE(ABORT,'Club release proof or seat mapping changed') END;
END;

CREATE TRIGGER IF NOT EXISTS club_release_apply AFTER INSERT ON support_club_square_releases BEGIN
 UPDATE support_english_single_bookings SET status='cancelled' WHERE NEW.kind='single' AND id=NEW.obligation_id;
 UPDATE support_english_round_payments SET status='cancelled' WHERE NEW.kind='round' AND id=NEW.obligation_id;
 UPDATE support_english_enrolments SET status='cancelled' WHERE status IN ('reserved','invoiced') AND id IN (SELECT seat_id FROM support_club_obligation_seats WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id);
 UPDATE support_club_square_intents SET state='cancelled',updated_at=NEW.released_at WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id;
END;
