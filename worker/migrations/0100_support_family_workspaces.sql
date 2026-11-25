-- Additive Learning Support workspace schema. Existing requests, proposals, invoices and bookings are unchanged.
-- Existing guest family identities are backfilled by the authorised family directory on first access.
CREATE TABLE IF NOT EXISTS support_guest_families (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,created_at TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS support_guest_learners (id TEXT PRIMARY KEY,family_id TEXT NOT NULL REFERENCES support_guest_families(id) ON DELETE CASCADE,label TEXT NOT NULL,year_level TEXT NOT NULL DEFAULT '',goals TEXT NOT NULL DEFAULT '',interests TEXT NOT NULL DEFAULT '',approach TEXT NOT NULL DEFAULT '',private_notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_support_guest_learners_family ON support_guest_learners(family_id,created_at);

CREATE TABLE IF NOT EXISTS support_guest_learner_enquiries (request_id TEXT PRIMARY KEY REFERENCES support_guest_requests(id) ON DELETE CASCADE,learner_id TEXT NOT NULL REFERENCES support_guest_learners(id) ON DELETE CASCADE);

CREATE INDEX IF NOT EXISTS idx_support_guest_learner_enquiries_learner ON support_guest_learner_enquiries(learner_id);

CREATE TRIGGER IF NOT EXISTS support_guest_family_on_request AFTER INSERT ON support_guest_requests BEGIN INSERT OR IGNORE INTO support_guest_families(id,email,created_at) VALUES(lower(hex(randomblob(16))),NEW.email,NEW.created_at); END;

CREATE TRIGGER IF NOT EXISTS support_guest_family_on_last_request_deleted AFTER DELETE ON support_guest_requests WHEN NOT EXISTS (SELECT 1 FROM support_guest_requests WHERE email=OLD.email) BEGIN DELETE FROM support_guest_families WHERE email=OLD.email; END;

CREATE TABLE IF NOT EXISTS support_quote_schedules (channel TEXT NOT NULL CHECK(channel IN ('member','guest')),quote_id TEXT NOT NULL,request_id TEXT NOT NULL,minutes_json TEXT NOT NULL,PRIMARY KEY(channel,quote_id));

CREATE TABLE IF NOT EXISTS support_invoice_portal_links (order_id TEXT PRIMARY KEY REFERENCES support_manual_invoices(order_id) ON DELETE CASCADE,url TEXT NOT NULL UNIQUE);
