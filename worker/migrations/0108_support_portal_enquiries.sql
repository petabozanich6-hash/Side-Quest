-- Canonical ownership of new enquiries using the existing service/booking channel.
-- No existing enquiries are changed, claimed or copied.
CREATE TABLE IF NOT EXISTS support_portal_enquiries (
 request_id TEXT PRIMARY KEY REFERENCES support_guest_requests(id) ON DELETE CASCADE,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 learner_id TEXT NOT NULL REFERENCES support_portal_learners(id) ON DELETE RESTRICT,
 service TEXT NOT NULL CHECK(service IN ('tutoring','english-club')),
 request_key TEXT NOT NULL,
 payload_hash TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(parent_user_id,request_key)
);
CREATE INDEX IF NOT EXISTS idx_support_portal_enquiries_family ON support_portal_enquiries(family_id,parent_user_id,created_at);
