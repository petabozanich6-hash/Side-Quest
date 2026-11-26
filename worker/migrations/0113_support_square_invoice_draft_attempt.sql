-- Persist the first draft invoice attempt independently of CreateOrder.
ALTER TABLE support_square_invoice_intents ADD COLUMN invoice_attempted_at TEXT;
