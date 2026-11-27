-- Adult-only provisional reservations. No child identity, guest request, invoice or paid seat is created.
CREATE TABLE support_academy_adult_pilot_rounds (
 round_id TEXT PRIMARY KEY REFERENCES support_english_rounds(id) ON DELETE RESTRICT,
 enabled INTEGER NOT NULL CHECK(enabled IN (0,1)),
 approved_by TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE TRIGGER academy_adult_pilot_round_guard BEFORE INSERT ON support_academy_adult_pilot_rounds
WHEN NOT EXISTS(SELECT 1 FROM support_english_rounds r WHERE r.id=NEW.round_id AND r.curriculum_id='english-author-studio-adult-v1' AND r.published=0 AND r.price_version='academy-launch-v1' AND r.session_count=6 AND r.price_per_session_cents=4500 AND r.upfront_cents=24000)
BEGIN SELECT RAISE(ABORT,'Not an adult pilot round'); END;
CREATE TABLE support_academy_adult_bookings (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES support_academy_adult_participants(user_id) ON DELETE RESTRICT,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE RESTRICT,
 round_id TEXT NOT NULL REFERENCES support_english_rounds(id) ON DELETE RESTRICT,
 single_class_id TEXT REFERENCES support_english_classes(id) ON DELETE RESTRICT,
 request_key TEXT NOT NULL,
 payload_hash TEXT NOT NULL,
 payment_mode TEXT NOT NULL CHECK(payment_mode IN ('single','weekly','upfront')),
 total_cents INTEGER NOT NULL,
 terms_version TEXT NOT NULL CHECK(terms_version='adult-studio-reservation-v1'),
 terms_snapshot TEXT NOT NULL,
 certificate_delivery TEXT NOT NULL CHECK(certificate_delivery IN ('pdf','post','both')),
 created_at TEXT NOT NULL,
 UNIQUE(user_id,request_key),
 CHECK((payment_mode='single' AND total_cents=4500 AND single_class_id IS NOT NULL) OR (payment_mode='weekly' AND total_cents=27000 AND single_class_id IS NULL) OR (payment_mode='upfront' AND total_cents=24000 AND single_class_id IS NULL))
);
CREATE TRIGGER academy_adult_booking_guard BEFORE INSERT ON support_academy_adult_bookings
WHEN NOT EXISTS(
 SELECT 1 FROM support_academy_adult_participants p JOIN support_academy_adult_pilot_rounds a ON a.round_id=NEW.round_id
 JOIN support_english_rounds r ON r.id=a.round_id
 WHERE p.user_id=NEW.user_id AND p.family_id=NEW.family_id AND a.enabled=1 AND r.curriculum_id='english-author-studio-adult-v1' AND r.published=0 AND r.price_version='academy-launch-v1' AND r.price_per_session_cents=4500 AND r.upfront_cents=24000
)
BEGIN SELECT RAISE(ABORT,'Adult round or participant unavailable'); END;
CREATE TABLE support_academy_adult_seats (
 id TEXT PRIMARY KEY,
 booking_id TEXT NOT NULL REFERENCES support_academy_adult_bookings(id) ON DELETE RESTRICT,
 class_id TEXT NOT NULL REFERENCES support_english_classes(id) ON DELETE RESTRICT,
 user_id TEXT NOT NULL REFERENCES support_academy_adult_participants(user_id) ON DELETE RESTRICT,
 due_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'provisional' CHECK(status IN ('provisional','cancelled')),
 UNIQUE(booking_id,class_id)
);
CREATE UNIQUE INDEX academy_adult_one_active_seat ON support_academy_adult_seats(class_id,user_id) WHERE status<>'cancelled';
CREATE TRIGGER academy_adult_seat_capacity BEFORE INSERT ON support_academy_adult_seats
BEGIN
 SELECT CASE WHEN NEW.status<>'provisional' OR NOT EXISTS(
 SELECT 1 FROM support_academy_adult_bookings b JOIN support_english_round_classes x ON x.round_id=b.round_id AND x.class_id=NEW.class_id
 JOIN support_english_classes c ON c.id=x.class_id JOIN support_academy_adult_pilot_rounds a ON a.round_id=b.round_id
 WHERE b.id=NEW.booking_id AND b.user_id=NEW.user_id AND a.enabled=1 AND (b.single_class_id IS NULL OR b.single_class_id=NEW.class_id)
 AND julianday(c.start_at)>julianday(b.created_at)+1 AND julianday(c.end_at)-julianday(c.start_at) BETWEEN 89.99/1440 AND 90.01/1440
 AND abs(julianday(NEW.due_at)-(julianday(c.start_at)-1))<0.000001
 ) OR (SELECT COUNT(*) FROM support_academy_adult_seats WHERE class_id=NEW.class_id AND status<>'cancelled')>=8
 THEN RAISE(ABORT,'Adult seat unavailable') END;
END;
CREATE TABLE support_academy_adult_obligations (
 id TEXT PRIMARY KEY,
 booking_id TEXT NOT NULL REFERENCES support_academy_adult_bookings(id) ON DELETE RESTRICT,
 sequence INTEGER NOT NULL CHECK(sequence BETWEEN 0 AND 6),
 amount_cents INTEGER NOT NULL,
 expected_seats INTEGER NOT NULL,
 due_at TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'awaiting_invoice' CHECK(status IN ('awaiting_invoice','cancelled')),
 UNIQUE(booking_id,sequence)
);
CREATE TRIGGER academy_adult_obligation_guard BEFORE INSERT ON support_academy_adult_obligations
WHEN NEW.status<>'awaiting_invoice' OR NOT EXISTS(
 SELECT 1 FROM support_academy_adult_bookings b WHERE b.id=NEW.booking_id AND
 ((b.payment_mode='single' AND NEW.sequence=0 AND NEW.amount_cents=4500 AND NEW.expected_seats=1)
 OR (b.payment_mode='weekly' AND NEW.sequence BETWEEN 1 AND 6 AND NEW.amount_cents=4500 AND NEW.expected_seats=1)
 OR (b.payment_mode='upfront' AND NEW.sequence=0 AND NEW.amount_cents=24000 AND NEW.expected_seats=6))
)
BEGIN SELECT RAISE(ABORT,'Adult payment obligation mismatch'); END;
