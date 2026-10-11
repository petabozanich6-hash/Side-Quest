-- Encrypted copy of each child's PIN so the parent can view it after re-entering their password.
-- The existing pin_hash column is still what the child signs in against.
ALTER TABLE students ADD COLUMN pin_enc TEXT;
