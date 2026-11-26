-- No provider operations are enabled by this migration.
CREATE TABLE IF NOT EXISTS support_standard_invoice_attempts (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE RESTRICT,
 approved_by TEXT NOT NULL,
 attempted_at TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('running','issued','review')),
 finished_at TEXT
);
