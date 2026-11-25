CREATE TABLE IF NOT EXISTS support_payment_warnings (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 due_at TEXT NOT NULL, reference TEXT NOT NULL, recipient TEXT NOT NULL,
 body_text TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('sending','sent','review')),
 attempted_at TEXT NOT NULL, sent_at TEXT
);
