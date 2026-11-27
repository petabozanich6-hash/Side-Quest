-- A certificate is an educational acknowledgement, not an invoice or qualification.
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
CREATE TABLE IF NOT EXISTS support_club_certificates (
 id TEXT PRIMARY KEY,kind TEXT NOT NULL CHECK(kind IN ('single','round')),booking_id TEXT NOT NULL,
 request_id TEXT NOT NULL,family_id TEXT NOT NULL,parent_user_id TEXT NOT NULL,learner_id TEXT NOT NULL,
 learner_name TEXT NOT NULL CHECK(length(learner_name) BETWEEN 1 AND 80),title TEXT NOT NULL,session_count INTEGER NOT NULL,
 delivery TEXT NOT NULL CHECK(delivery IN ('pdf','post','both')),completed_at TEXT NOT NULL,approved_by TEXT NOT NULL,approved_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'approved' CHECK(status IN ('approved','withdrawn')),withdrawn_at TEXT,
 UNIQUE(kind,booking_id)
);
CREATE INDEX IF NOT EXISTS idx_club_certificates_parent ON support_club_certificates(family_id,parent_user_id);
