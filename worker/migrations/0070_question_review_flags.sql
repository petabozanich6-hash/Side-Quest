-- Keep specific parent revision flags alongside the existing submission feedback.
-- No changes to the existing send-back, draft, lesson or approval tables.
ALTER TABLE submissions ADD COLUMN review_flags TEXT NOT NULL DEFAULT '[]';
