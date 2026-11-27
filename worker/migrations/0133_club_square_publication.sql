ALTER TABLE support_club_square_intents ADD COLUMN publish_attempted_at TEXT;
ALTER TABLE support_club_square_intents ADD COLUMN publish_approved_version INTEGER;
ALTER TABLE support_club_square_intents ADD COLUMN publish_approved_by TEXT;
ALTER TABLE support_club_square_intents ADD COLUMN provider_issued_at TEXT;
ALTER TABLE support_club_square_intents ADD COLUMN provider_public_url TEXT;
-- Issuance is atomic with the mapped obligation and its exact provisional seats.
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
