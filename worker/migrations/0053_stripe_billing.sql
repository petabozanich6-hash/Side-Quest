-- Stripe subscription billing (sandbox first). Additive only: no family, lesson, progress or evidence rows are changed.
-- The plan column is still the single source of entitlement; these columns record which Stripe objects it came from.

ALTER TABLE families ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE families ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE families ADD COLUMN stripe_price_id TEXT;
-- weekly | fortnightly | monthly | yearly
ALTER TABLE families ADD COLUMN billing_interval TEXT;
-- Stripe's own subscription status (active, past_due, canceled, ...), as last fetched from Stripe.
ALTER TABLE families ADD COLUMN subscription_status TEXT;
ALTER TABLE families ADD COLUMN cancel_at_period_end INTEGER NOT NULL DEFAULT 0;
ALTER TABLE families ADD COLUMN billing_updated_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_families_stripe_customer ON families (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_families_stripe_subscription ON families (stripe_subscription_id);

-- Webhook de-duplication. A row with processed_at set is never processed again.
CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  outcome TEXT
);
