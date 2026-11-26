-- Explicit parent-confirmed historical member enquiry mapping; no inferred identity.
CREATE TABLE support_portal_member_learners (request_id TEXT PRIMARY KEY REFERENCES parent_feedback(id) ON DELETE CASCADE, learner_id TEXT NOT NULL REFERENCES support_portal_learners(id) ON DELETE CASCADE, parent_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, linked_at TEXT NOT NULL);
CREATE INDEX idx_support_portal_member_learners_learner ON support_portal_member_learners(learner_id);
