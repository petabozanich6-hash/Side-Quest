-- Sandbox-only durable invoice preparation. No provider operation is enabled by this migration.
CREATE TABLE IF NOT EXISTS support_square_invoice_intents (
  order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE RESTRICT,
  fingerprint TEXT NOT NULL CHECK(length(fingerprint)=64),
  location_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 1 AND 1000000),
  due_at TEXT NOT NULL,
  order_updated_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  create_order_key TEXT NOT NULL UNIQUE,
  create_invoice_key TEXT NOT NULL UNIQUE,
  publish_invoice_key TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL DEFAULT 'prepared' CHECK(state IN ('prepared','order_pending','order_created','invoice_pending','draft_created','publish_pending','issued','review')),
  provider_order_id TEXT UNIQUE,
  provider_invoice_id TEXT UNIQUE,
  provider_invoice_version INTEGER CHECK(provider_invoice_version IS NULL OR provider_invoice_version>=0),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
