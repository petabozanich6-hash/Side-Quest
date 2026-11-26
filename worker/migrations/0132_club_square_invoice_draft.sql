-- Persist the approved operation and its bounded retry window before provider writes.
ALTER TABLE support_club_square_intents ADD COLUMN order_attempted_at TEXT;
ALTER TABLE support_club_square_intents ADD COLUMN invoice_attempted_at TEXT;
ALTER TABLE support_club_square_intents ADD COLUMN provider_invoice_version INTEGER;
ALTER TABLE support_club_square_intents ADD COLUMN updated_at TEXT;
