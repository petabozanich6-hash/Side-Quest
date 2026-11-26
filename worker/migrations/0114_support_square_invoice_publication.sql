-- Sandbox publication metadata. A recorded attempt is never reset.
ALTER TABLE support_square_invoice_intents ADD COLUMN publish_attempted_at TEXT;
ALTER TABLE support_square_invoice_intents ADD COLUMN publish_approved_version INTEGER;
ALTER TABLE support_square_invoice_intents ADD COLUMN publish_approved_by TEXT;
ALTER TABLE support_square_invoice_intents ADD COLUMN provider_issued_at TEXT;
ALTER TABLE support_square_invoice_intents ADD COLUMN provider_public_url TEXT;
