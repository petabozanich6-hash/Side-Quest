CREATE TABLE IF NOT EXISTS support_club_square_settlements (
 kind TEXT NOT NULL,obligation_id TEXT NOT NULL,payment_id TEXT NOT NULL UNIQUE,invoice_id TEXT NOT NULL UNIQUE,
 amount_cents INTEGER NOT NULL,captured_at TEXT NOT NULL,verified_at TEXT NOT NULL,
 PRIMARY KEY(kind,obligation_id),
 FOREIGN KEY(kind,obligation_id) REFERENCES support_club_square_intents(kind,obligation_id)
);
CREATE TABLE IF NOT EXISTS support_club_square_reviews (
 kind TEXT NOT NULL,obligation_id TEXT NOT NULL,reason TEXT NOT NULL CHECK(reason IN ('payment_uncertain','payment_retry','refund','dispute','provider_cancellation')),updated_at TEXT NOT NULL,
 PRIMARY KEY(kind,obligation_id),
 FOREIGN KEY(kind,obligation_id) REFERENCES support_club_square_intents(kind,obligation_id)
);
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
-- A financial hold preserves capacity and evidence, but blocks access for the affected seats only.
CREATE TRIGGER IF NOT EXISTS club_financial_hold_apply AFTER UPDATE OF state ON support_club_square_intents WHEN NEW.state='review' AND OLD.state IN ('issued','paid') BEGIN
 UPDATE support_english_single_bookings SET status='review' WHERE NEW.kind='single' AND id=NEW.obligation_id AND status IN ('issued','paid');
 UPDATE support_english_round_payments SET status='review' WHERE NEW.kind='round' AND id=NEW.obligation_id AND status IN ('issued','paid');
 UPDATE support_english_enrolments SET status='invoiced' WHERE status='paid' AND id IN (SELECT seat_id FROM support_club_obligation_seats WHERE kind=NEW.kind AND obligation_id=NEW.obligation_id);
END;
