-- The Australian state or territory a family is registered (or applying) for home education in.
-- Learning plans are written for this jurisdiction. Additive only; existing families stay NULL until the parent picks one.
-- Allowed values (checked in worker/src/data/jurisdictions.ts): NSW, VIC, QLD, WA, SA, TAS, ACT, NT.
ALTER TABLE families ADD COLUMN jurisdiction TEXT;
