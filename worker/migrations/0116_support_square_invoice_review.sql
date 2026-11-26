-- Explicitly verified unpaid cancellation proof. No remote mutation.
CREATE TABLE IF NOT EXISTS support_square_invoice_cancellations (
 order_id TEXT PRIMARY KEY REFERENCES support_square_invoice_intents(order_id) ON DELETE RESTRICT,
 invoice_id TEXT NOT NULL UNIQUE,
 provider_version INTEGER NOT NULL CHECK(provider_version>=0),
 verified_at TEXT NOT NULL,
 verified_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS support_square_invoice_reviews (
 order_id TEXT PRIMARY KEY REFERENCES support_square_invoice_intents(order_id) ON DELETE RESTRICT,
 reason TEXT NOT NULL CHECK(reason IN ('payment_uncertain','payment_retry','refund','provider_cancellation','dispute')),
 first_at TEXT NOT NULL,
 last_at TEXT NOT NULL,
 resolved_at TEXT
);
DROP TRIGGER IF EXISTS support_invoice_intent_blocks_checkout_or_settlement;
CREATE TRIGGER support_invoice_intent_blocks_checkout_or_settlement
BEFORE UPDATE ON support_service_orders
WHEN EXISTS(SELECT 1 FROM support_square_invoice_intents i WHERE i.order_id=OLD.id)
 AND (
  (NEW.status IS NOT OLD.status AND NEW.status='cancelled' AND NOT EXISTS(
   SELECT 1 FROM support_square_invoice_cancellations c JOIN support_square_invoice_intents i ON i.order_id=c.order_id
   WHERE c.order_id=OLD.id AND c.invoice_id=i.provider_invoice_id AND i.state='issued'
    AND OLD.status='confirmed' AND c.verified_at=NEW.updated_at
    AND NOT EXISTS(SELECT 1 FROM support_square_invoice_settlements p WHERE p.order_id=OLD.id)))
  OR (NEW.status IS NOT OLD.status AND NEW.status IN ('paid','completed') AND NOT EXISTS(
   SELECT 1 FROM support_square_invoice_settlements p JOIN support_square_invoice_intents i ON i.order_id=p.order_id
   WHERE p.order_id=OLD.id AND p.review_at IS NULL AND p.amount_cents=NEW.amount_cents AND i.state='issued'
    AND p.invoice_id=i.provider_invoice_id AND NEW.paid_at=p.captured_at
    AND ((OLD.status='confirmed' AND NEW.status='paid') OR (OLD.status='paid' AND NEW.status='completed'))))
  OR (NEW.checkout_started_at IS NOT OLD.checkout_started_at AND NEW.checkout_started_at IS NOT NULL)
  OR (NEW.square_order_id IS NOT OLD.square_order_id AND NEW.square_order_id IS NOT NULL)
  OR (NEW.square_link_id IS NOT OLD.square_link_id AND NEW.square_link_id IS NOT NULL)
  OR (NEW.checkout_url IS NOT OLD.checkout_url AND NEW.checkout_url IS NOT NULL)
  OR (NEW.square_payment_id IS NOT OLD.square_payment_id AND NEW.square_payment_id IS NOT NULL)
 )
BEGIN
 SELECT RAISE(ABORT,'Square invoice intent requires reconciliation');
END;
