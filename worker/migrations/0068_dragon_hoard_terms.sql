-- Additive: original hoard offers remain first-invoice-only by default.
-- Keeps the old offers CHECK constraint unchanged on deployed databases.
CREATE TABLE IF NOT EXISTS dragon_hoard_terms (
  offer_id TEXT PRIMARY KEY NOT NULL,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('once','month1','month3','month6'))
);
