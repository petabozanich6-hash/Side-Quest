-- Adult drafts can be scheduled by the owner but must never enter a child booking
-- or classroom workflow before the adult-specific reservation and access system is verified.
CREATE TRIGGER IF NOT EXISTS academy_adult_round_insert_guard BEFORE INSERT ON support_english_rounds
WHEN NEW.curriculum_id='english-author-studio-adult-v1' AND NEW.published<>0
BEGIN SELECT RAISE(ABORT,'Adult bookings not enabled'); END;
CREATE TRIGGER IF NOT EXISTS academy_adult_round_publish_guard BEFORE UPDATE OF published,curriculum_id ON support_english_rounds
WHEN (OLD.curriculum_id='english-author-studio-adult-v1' AND NEW.curriculum_id IS NOT OLD.curriculum_id)
 OR (NEW.curriculum_id='english-author-studio-adult-v1' AND NEW.published<>0)
BEGIN SELECT RAISE(ABORT,'Adult draft cannot be published or reclassified'); END;
CREATE TRIGGER IF NOT EXISTS academy_adult_seat_guard BEFORE INSERT ON support_english_enrolments
WHEN EXISTS(SELECT 1 FROM support_english_round_classes x JOIN support_english_rounds r ON r.id=x.round_id WHERE x.class_id=NEW.class_id AND r.curriculum_id='english-author-studio-adult-v1')
BEGIN SELECT RAISE(ABORT,'Adult studio requires separate reservations'); END;
CREATE TRIGGER IF NOT EXISTS academy_adult_seat_update_guard BEFORE UPDATE OF class_id ON support_english_enrolments
WHEN EXISTS(SELECT 1 FROM support_english_round_classes x JOIN support_english_rounds r ON r.id=x.round_id WHERE x.class_id=NEW.class_id AND r.curriculum_id='english-author-studio-adult-v1')
BEGIN SELECT RAISE(ABORT,'Adult studio requires separate reservations'); END;
