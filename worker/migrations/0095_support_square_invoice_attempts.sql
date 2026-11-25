CREATE TABLE IF NOT EXISTS support_square_invoice_attempts (
 order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE,
 channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL,
 customer_id TEXT NOT NULL, recipient TEXT NOT NULL, location_id TEXT NOT NULL,
 amount_cents INTEGER NOT NULL CHECK(amount_cents>0), due_at TEXT NOT NULL, due_date TEXT NOT NULL,
 state TEXT NOT NULL CHECK(state IN ('creating','draft','publishing','published','review')),
 square_order_id TEXT UNIQUE, invoice_id TEXT UNIQUE, payment_url TEXT,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
