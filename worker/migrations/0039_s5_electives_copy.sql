-- Add the elective placeholder cards to Stage 5 (Years 9-10) as well as Stage 4.
-- 0026 created them, 0027 moved them all to Stage 4 (Year 10 -> Year 8, Year 9 -> Year 7).
-- This copies those rows back as separate Stage 5 rows (Year 8 -> Year 10, Year 7 -> Year 9), leaving the Stage 4 rows alone.
-- Only rows created by 0026 are copied. New seed keys start with s5e- so nothing collides. Safe to re-run (INSERT OR IGNORE).
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-s5e-' || substr(seed_key, 4),
  family_id,
  's5e-' || substr(seed_key, 4),
  replace(replace(title, 'Year 8,', 'Year 10,'), 'Year 7,', 'Year 9,'),
  'S5',
  learning_area,
  unit_id,
  status,
  json_set(
    data,
    '$.year_level', CASE json_extract(data, '$.year_level') WHEN 'Year 8' THEN 'Year 10' ELSE 'Year 9' END,
    '$.source_note', replace(json_extract(data, '$.source_note'),
      'the current NESA syllabus (Stage 4 content; check which stage the syllabus covers) for',
      'the current NESA Stage 5 syllabus for')
  ),
  '2026-10-11T09:30:00Z',
  '2026-10-11T09:30:00Z'
FROM lessons
WHERE seed_key LIKE 's5-%' AND created_at = '2026-10-11T14:00:00Z' AND stage = 'S4';
