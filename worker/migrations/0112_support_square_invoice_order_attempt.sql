-- Persist the first remote attempt; never reset its retry window.
ALTER TABLE support_square_invoice_intents ADD COLUMN order_attempted_at TEXT;
