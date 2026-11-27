-- Adult self-registration is a separate identity, never a homeschool child or parent-selected learner.
CREATE TABLE IF NOT EXISTS support_academy_adult_participants (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 display_name TEXT NOT NULL CHECK(length(trim(display_name)) BETWEEN 1 AND 80),
 age_attestation_version TEXT NOT NULL CHECK(age_attestation_version='adult-self-v1'),
 attested_at TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS academy_adult_identity_guard BEFORE INSERT ON support_academy_adult_participants
BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM users u JOIN families f ON f.id=u.family_id LEFT JOIN family_admin_state s ON s.family_id=f.id WHERE u.id=NEW.user_id AND u.family_id=NEW.family_id AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(s.status,'active')='active') THEN RAISE(ABORT,'Verified adult account required') END;
END;
