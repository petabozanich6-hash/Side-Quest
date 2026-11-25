-- Prevent older checkout/manual-payment/cancellation paths from racing a durable invoice intent.
-- All changes are additive. Existing orders without an intent are unaffected.
CREATE TRIGGER IF NOT EXISTS support_invoice_intent_blocks_checkout_or_settlement
BEFORE UPDATE ON support_service_orders
WHEN EXISTS(SELECT 1 FROM support_square_invoice_intents i WHERE i.order_id=OLD.id)
 AND (
   (NEW.status IS NOT OLD.status AND NEW.status IN ('paid','completed','cancelled'))
   OR (NEW.checkout_started_at IS NOT OLD.checkout_started_at AND NEW.checkout_started_at IS NOT NULL)
   OR (NEW.square_order_id IS NOT OLD.square_order_id AND NEW.square_order_id IS NOT NULL)
   OR (NEW.square_link_id IS NOT OLD.square_link_id AND NEW.square_link_id IS NOT NULL)
   OR (NEW.checkout_url IS NOT OLD.checkout_url AND NEW.checkout_url IS NOT NULL)
   OR (NEW.square_payment_id IS NOT OLD.square_payment_id AND NEW.square_payment_id IS NOT NULL)
 )
BEGIN
 SELECT RAISE(ABORT,'Square invoice intent requires reconciliation');
END;

CREATE TRIGGER IF NOT EXISTS support_invoice_intent_blocks_manual_insert
BEFORE INSERT ON support_manual_invoices
WHEN EXISTS(SELECT 1 FROM support_square_invoice_intents i WHERE i.order_id=NEW.order_id)
BEGIN
 SELECT RAISE(ABORT,'Square invoice intent requires reconciliation');
END;

CREATE TRIGGER IF NOT EXISTS support_invoice_intent_blocks_manual_reassignment
BEFORE UPDATE OF order_id ON support_manual_invoices
WHEN EXISTS(SELECT 1 FROM support_square_invoice_intents i WHERE i.order_id=NEW.order_id)
BEGIN
 SELECT RAISE(ABORT,'Square invoice intent requires reconciliation');
END;

-- Retain an audit event for an explicitly discarded, never-submitted local preparation.
CREATE TABLE IF NOT EXISTS support_square_invoice_intent_releases (
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL,
 fingerprint TEXT NOT NULL,
 released_by TEXT NOT NULL,
 released_at TEXT NOT NULL
);
