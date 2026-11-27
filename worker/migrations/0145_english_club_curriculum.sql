-- Public workshop description is distinct from private facilitator preparation.
ALTER TABLE support_english_classes ADD COLUMN public_description TEXT NOT NULL DEFAULT '';
ALTER TABLE support_english_rounds ADD COLUMN curriculum_id TEXT;
