-- Manual invoice tracking, independent of membership billing.
CREATE TABLE IF NOT EXISTS support_manual_invoices (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, reference TEXT NOT NULL COLLATE NOCASE UNIQUE, due_at TEXT NOT NULL, issued_at TEXT NOT NULL, issued_by TEXT NOT NULL, verified_at TEXT, verified_by TEXT, cancelled_at TEXT);

CREATE INDEX IF NOT EXISTS idx_support_invoice_due ON support_manual_invoices(due_at);
