-- Dragon's Hoard. Additive Owner HQ discount catalogue; Stripe remains billing authority.
-- Promotions are environment-scoped and do not change entitlements or subscription rows.
CREATE TABLE IF NOT EXISTS dragon_hoard_offers (
  id TEXT PRIMARY KEY NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('test','live')),
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  percent_off INTEGER NOT NULL CHECK (percent_off BETWEEN 5 AND 50),
  duration_months INTEGER NOT NULL CHECK (duration_months = 1),
  max_redemptions INTEGER NOT NULL CHECK (max_redemptions BETWEEN 1 AND 500),
  expires_at TEXT NOT NULL,
  stripe_coupon_id TEXT NOT NULL,
  stripe_promotion_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_by TEXT,
  created_at TEXT NOT NULL,
  disabled_at TEXT,
  UNIQUE(mode, code)
);
CREATE INDEX IF NOT EXISTS idx_hoard_offers_created ON dragon_hoard_offers(created_at DESC);
