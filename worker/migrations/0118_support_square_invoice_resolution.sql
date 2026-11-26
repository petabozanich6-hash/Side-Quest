-- Strict resolution proof for a single fully refunded, previously settled arrangement.
CREATE TABLE support_square_invoice_refund_resolutions (
 order_id TEXT PRIMARY KEY REFERENCES support_square_invoice_intents(order_id) ON DELETE RESTRICT,
 invoice_id TEXT NOT NULL UNIQUE,
 payment_id TEXT NOT NULL UNIQUE,
 refund_id TEXT NOT NULL UNIQUE,
 amount_cents INTEGER NOT NULL CHECK(amount_cents>0),
 verified_by TEXT NOT NULL,
 verified_at TEXT NOT NULL
);
CREATE TABLE support_square_invoice_recheck (
 order_id TEXT PRIMARY KEY REFERENCES support_square_invoice_intents(order_id) ON DELETE RESTRICT,
 checked_at TEXT NOT NULL,
 outcome TEXT NOT NULL
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
    AND NOT EXISTS(SELECT 1 FROM support_square_invoice_settlements p WHERE p.order_id=OLD.id))
   AND NOT EXISTS(SELECT 1 FROM support_square_invoice_refund_resolutions r JOIN support_square_invoice_settlements p ON p.order_id=r.order_id
    JOIN support_square_invoice_intents i ON i.order_id=r.order_id
    WHERE r.order_id=OLD.id AND r.payment_id=p.payment_id AND r.invoice_id=i.provider_invoice_id
    AND r.amount_cents=OLD.amount_cents AND OLD.status='review' AND r.verified_at=NEW.updated_at))
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
