-- Durable sandbox invoice intent, never parent visible.
CREATE TABLE IF NOT EXISTS support_square_draft_intents (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('guest','member')), request_id TEXT NOT NULL,
 fingerprint TEXT NOT NULL, customer_id TEXT NOT NULL, location_id TEXT NOT NULL, application_id TEXT NOT NULL,
 due_at TEXT NOT NULL, order_key TEXT NOT NULL UNIQUE, invoice_key TEXT NOT NULL UNIQUE,
 provider_order_id TEXT UNIQUE, provider_invoice_id TEXT UNIQUE, provider_invoice_version INTEGER,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS support_square_draft_blocks_manual_invoice
 BEFORE INSERT ON support_manual_invoices WHEN EXISTS(SELECT 1 FROM support_square_draft_intents d WHERE d.order_id=NEW.order_id)
 BEGIN SELECT RAISE(ABORT,'Managed Square draft requires reconciliation'); END;
