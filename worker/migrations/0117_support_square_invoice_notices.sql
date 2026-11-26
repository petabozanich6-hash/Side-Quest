-- Each notification type is claimed once per issued invoice. Unknown delivery is reviewed, never auto-resent.
CREATE TABLE IF NOT EXISTS support_square_invoice_notices (
 order_id TEXT NOT NULL REFERENCES support_square_invoice_intents(order_id) ON DELETE RESTRICT,
 invoice_id TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('confirmation','reminder','overdue')),
 status TEXT NOT NULL CHECK(status IN ('sending','sent','review','suppressed')),
 attempted_at TEXT NOT NULL,
 sent_at TEXT,
 PRIMARY KEY(order_id,kind)
);
CREATE INDEX IF NOT EXISTS idx_support_square_invoice_notices_status ON support_square_invoice_notices(status,attempted_at);
