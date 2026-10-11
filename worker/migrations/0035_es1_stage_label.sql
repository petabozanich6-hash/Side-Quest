-- The Lessons page decides a lesson's stage card in stagesOf() (frontend/src/pages/parent/Lessons.jsx).
-- It treats any stage text containing the word early as Early Stage 1, and otherwise takes the first digit 1-6
-- as the stage number. The code ES1 has no word early and contains the digit 1, so those lessons landed in Stage 1.
-- Use the full label for the Early Stage 1 placeholder lessons (migrations 0029 to 0034). Safe to re-run.
UPDATE lessons
SET stage = 'Early Stage 1'
WHERE seed_key LIKE 'es1-%' AND stage = 'ES1';
