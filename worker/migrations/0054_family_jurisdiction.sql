-- The state or territory a family is registered in. Decides which curriculum framework Life Learning maps to.
-- Additive only. The Worker also adds this column at runtime if this migration hasn't been applied yet.
ALTER TABLE families ADD COLUMN jurisdiction TEXT;
