-- Participant-owned showcase draft. No publishing, gallery, external sharing or certificate eligibility.
CREATE TABLE support_academy_showcases (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 audience TEXT NOT NULL CHECK(audience IN ('minor','adult')),
 participant_id TEXT NOT NULL,
 round_id TEXT NOT NULL REFERENCES support_english_rounds(id) ON DELETE RESTRICT,
 title TEXT NOT NULL CHECK(length(title)<=120),
 byline TEXT NOT NULL CHECK(length(byline)<=80),
 blurb TEXT NOT NULL CHECK(length(blurb)<=1800),
 body TEXT NOT NULL CHECK(length(body)<=36000),
 reflection TEXT NOT NULL CHECK(length(reflection)<=2000),
 cover TEXT NOT NULL CHECK(cover IN ('portal','moon','manuscript')),
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>=1),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(user_id,family_id,audience,participant_id,round_id)
);
