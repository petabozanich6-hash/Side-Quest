-- Adult invoice publication and settlement proofs are separate from child accounts.
CREATE TABLE support_academy_adult_publications (
 obligation_id TEXT PRIMARY KEY REFERENCES support_academy_adult_invoice_intents(obligation_id) ON DELETE RESTRICT,
 fingerprint TEXT NOT NULL,
 invoice_id TEXT NOT NULL UNIQUE,
 approved_version INTEGER NOT NULL CHECK(approved_version>=0),
 publish_key TEXT NOT NULL UNIQUE,
 approved_by TEXT NOT NULL,
 attempted_at TEXT NOT NULL,
 issued_at TEXT,
 issued_version INTEGER,
 public_url TEXT,
 CHECK((issued_at IS NULL AND issued_version IS NULL AND public_url IS NULL) OR (issued_at IS NOT NULL AND issued_version IS NOT NULL AND public_url IS NOT NULL))
);
CREATE TRIGGER academy_adult_publication_guard BEFORE INSERT ON support_academy_adult_publications
WHEN NOT EXISTS(SELECT 1 FROM support_academy_adult_invoice_intents i JOIN support_academy_adult_obligations o ON o.id=i.obligation_id WHERE i.obligation_id=NEW.obligation_id AND i.state='draft_created' AND i.fingerprint=NEW.fingerprint AND i.provider_invoice_id=NEW.invoice_id AND i.provider_invoice_version=NEW.approved_version AND o.status='awaiting_invoice' AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at AND julianday(o.due_at)>julianday(NEW.attempted_at))
BEGIN SELECT RAISE(ABORT,'Adult invoice draft changed'); END;
CREATE TABLE support_academy_adult_financial_holds (
 obligation_id TEXT PRIMARY KEY REFERENCES support_academy_adult_publications(obligation_id) ON DELETE RESTRICT,
 reason TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE support_academy_adult_settlements (
 obligation_id TEXT PRIMARY KEY REFERENCES support_academy_adult_publications(obligation_id) ON DELETE RESTRICT,
 payment_id TEXT NOT NULL UNIQUE,
 invoice_id TEXT NOT NULL UNIQUE,
 amount_cents INTEGER NOT NULL CHECK(amount_cents IN (4500,24000)),
 captured_at TEXT NOT NULL,
 verified_at TEXT NOT NULL
);
CREATE TRIGGER academy_adult_settlement_guard BEFORE INSERT ON support_academy_adult_settlements
WHEN NOT EXISTS(
 SELECT 1 FROM support_academy_adult_publications p JOIN support_academy_adult_invoice_intents i ON i.obligation_id=p.obligation_id JOIN support_academy_adult_obligations o ON o.id=i.obligation_id JOIN support_academy_adult_bookings b ON b.id=o.booking_id
 WHERE p.obligation_id=NEW.obligation_id AND p.issued_at IS NOT NULL AND p.invoice_id=NEW.invoice_id AND i.provider_invoice_id=NEW.invoice_id AND i.fingerprint=p.fingerprint AND i.state='draft_created' AND o.status='awaiting_invoice' AND o.amount_cents=NEW.amount_cents AND i.amount_cents=NEW.amount_cents AND i.due_at=o.due_at AND julianday(NEW.captured_at) BETWEEN julianday(p.attempted_at) AND julianday(o.due_at) AND julianday(NEW.verified_at)>=julianday(NEW.captured_at)
 AND NOT EXISTS(SELECT 1 FROM support_academy_adult_financial_holds h WHERE h.obligation_id=p.obligation_id)
 AND (SELECT COUNT(*) FROM support_academy_adult_seats s JOIN support_english_round_classes x ON x.class_id=s.class_id AND x.round_id=b.round_id JOIN support_english_classes c ON c.id=s.class_id WHERE s.booking_id=b.id AND s.user_id=b.user_id AND (o.sequence=0 OR x.sequence=o.sequence) AND s.status='provisional' AND julianday(c.start_at)>julianday(NEW.verified_at) AND EXISTS(SELECT 1 FROM json_each(json_extract(i.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=c.start_at AND json_extract(j.value,'$.end_at')=c.end_at AND json_extract(j.value,'$.due_at')=s.due_at))=o.expected_seats
 )
BEGIN SELECT RAISE(ABORT,'Adult settlement mismatch or financial hold'); END;
-- Proof does not mutate child enrolments or open a classroom. Adult access will
-- require the exact settlement, seat mapping, time window and absence of holds.
