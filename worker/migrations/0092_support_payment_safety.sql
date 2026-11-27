CREATE TABLE IF NOT EXISTS support_cancellation_requests (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 requested_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','withdrawn','resolved')),
 resolved_at TEXT
);
CREATE TABLE IF NOT EXISTS support_invoice_notices (
 order_id TEXT NOT NULL REFERENCES support_service_orders(id) ON DELETE CASCADE,
 due_at TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('reminder','overdue')),
 status TEXT NOT NULL CHECK(status IN ('sending','sent','review')), attempted_at TEXT NOT NULL, sent_at TEXT,
 PRIMARY KEY(order_id,due_at,kind)
);
