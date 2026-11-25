-- Additive tutoring order ledger, separate from membership billing.
CREATE TABLE IF NOT EXISTS support_service_orders (id TEXT PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL, quote_id TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000), scope TEXT NOT NULL, delivery TEXT NOT NULL, terms TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('live','written')), start_at TEXT, end_at TEXT, status TEXT NOT NULL DEFAULT 'awaiting_confirmation' CHECK(status IN ('awaiting_confirmation','confirmed','paid','review','cancelled','completed')), confirmed_at TEXT, square_order_id TEXT UNIQUE, square_link_id TEXT UNIQUE, checkout_url TEXT, square_payment_id TEXT UNIQUE, checkout_started_at TEXT, paid_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);

CREATE UNIQUE INDEX IF NOT EXISTS idx_support_order_quote ON support_service_orders(channel,quote_id) WHERE status<>'cancelled';

CREATE INDEX IF NOT EXISTS idx_support_order_slot ON support_service_orders(start_at,end_at,status);

CREATE INDEX IF NOT EXISTS idx_support_order_request ON support_service_orders(channel,request_id,created_at DESC);
