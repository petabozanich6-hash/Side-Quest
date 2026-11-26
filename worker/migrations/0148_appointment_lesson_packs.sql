-- Owner-only reviewed resource snapshots for exact tutoring appointments.
CREATE TABLE IF NOT EXISTS support_appointment_lesson_packs (
 order_id TEXT NOT NULL PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 pack_json TEXT NOT NULL,
 deck_id TEXT NOT NULL,
 created_at TEXT NOT NULL
);
