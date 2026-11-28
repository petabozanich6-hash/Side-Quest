-- Adult Square preparation is separate from tutoring and child club invoices.
-- No provider publication, payment or classroom access is possible in this migration.
CREATE TABLE support_academy_adult_invoice_intents (
 obligation_id TEXT PRIMARY KEY REFERENCES support_academy_adult_obligations(id) ON DELETE RESTRICT,
 fingerprint TEXT NOT NULL CHECK(length(fingerprint)=64),
 snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json)),
 customer_id TEXT NOT NULL,
 location_id TEXT NOT NULL,
 amount_cents INTEGER NOT NULL CHECK(amount_cents IN (4500,24000)),
 due_at TEXT NOT NULL,
 order_key TEXT NOT NULL UNIQUE,
 invoice_key TEXT NOT NULL UNIQUE,
 approved_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'prepared' CHECK(state IN ('prepared','order_pending','order_created','invoice_pending','draft_created','review')),
 order_attempted_at TEXT,
 invoice_attempted_at TEXT,
 provider_order_id TEXT UNIQUE,
 provider_invoice_id TEXT UNIQUE,
 provider_invoice_version INTEGER,
 CHECK(state<>'draft_created' OR (provider_order_id IS NOT NULL AND provider_invoice_id IS NOT NULL AND provider_invoice_version>=0))
);
CREATE TRIGGER academy_adult_invoice_intent_guard BEFORE INSERT ON support_academy_adult_invoice_intents
WHEN NEW.state<>'prepared' OR NOT EXISTS(
 SELECT 1 FROM support_academy_adult_obligations o WHERE o.id=NEW.obligation_id
 AND o.status='awaiting_invoice' AND o.amount_cents=NEW.amount_cents AND o.due_at=NEW.due_at
)
BEGIN SELECT RAISE(ABORT,'Adult obligation changed'); END;
