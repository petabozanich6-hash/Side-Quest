-- Existing sessions remain unpublished. No bookings or billing are created.
CREATE TABLE IF NOT EXISTS support_english_publications (
 class_id TEXT PRIMARY KEY REFERENCES support_english_classes(id) ON DELETE CASCADE,
 enabled INTEGER NOT NULL CHECK(enabled IN (0,1)),
 approved_by TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS support_english_booking_receipts (
 enrolment_id TEXT PRIMARY KEY REFERENCES support_english_enrolments(id) ON DELETE CASCADE,
 parent_user_id TEXT NOT NULL,
 learner_id TEXT NOT NULL,
 terms_version TEXT NOT NULL,
 amount_cents INTEGER NOT NULL CHECK(amount_cents=1200),
 accepted_at TEXT NOT NULL
);
-- Also protects the existing owner enrolment path for canonical learners.
CREATE TRIGGER IF NOT EXISTS support_english_unique_canonical_learner
 BEFORE INSERT ON support_english_enrolments
 WHEN NEW.status<>'cancelled' AND EXISTS(
  SELECT 1 FROM support_portal_enquiries n JOIN support_portal_enquiries p ON p.learner_id=n.learner_id AND p.family_id=n.family_id
  JOIN support_english_enrolments e ON e.request_id=p.request_id
  WHERE n.request_id=NEW.request_id AND e.class_id=NEW.class_id AND e.status<>'cancelled'
 )
 BEGIN SELECT RAISE(ABORT,'Learner already enrolled in this class'); END;
