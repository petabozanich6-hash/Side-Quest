-- Move the elective placeholder cards added in 0026 from Stage 5 (Years 9-10) to Stage 4 (Years 7-8).
-- Only rows created by 0026 are touched.
UPDATE lessons SET
  stage = 'S4',
  title = replace(replace(title, 'Year 10,', 'Year 8,'), 'Year 9,', 'Year 7,'),
  data = json_set(
    data,
    '$.year_level', CASE json_extract(data, '$.year_level') WHEN 'Year 10' THEN 'Year 8' ELSE 'Year 7' END,
    '$.source_note', replace(json_extract(data, '$.source_note'),
      'the current NESA Stage 5 syllabus for',
      'the current NESA syllabus (Stage 4 content; check which stage the syllabus covers) for')
  ),
  updated_at = '2026-10-11T15:00:00Z'
WHERE seed_key LIKE 's5-%' AND created_at = '2026-10-11T14:00:00Z';
