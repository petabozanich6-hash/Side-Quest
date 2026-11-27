-- Release only the exact overdue obligation after safe no-provider or cancelled-provider proof.
CREATE TABLE IF NOT EXISTS support_club_square_releases (
 kind TEXT NOT NULL CHECK(kind IN ('single','round')),obligation_id TEXT NOT NULL,
 reason TEXT NOT NULL CHECK(reason IN ('never_attempted','provider_cancelled')),
 provider_invoice_id TEXT,provider_version INTEGER,
 released_by TEXT NOT NULL,notified_at TEXT NOT NULL,released_at TEXT NOT NULL,
 PRIMARY KEY(kind,obligation_id)
);
CREATE TABLE IF NOT EXISTS support_club_recheck_claims (
 kind TEXT NOT NULL,obligation_id TEXT NOT NULL,checked_at TEXT NOT NULL,
 PRIMARY KEY(kind,obligation_id)
);
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
