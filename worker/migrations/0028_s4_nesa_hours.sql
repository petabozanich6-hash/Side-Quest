-- Resize Stage 4 placeholder banks to NESA hours (1 lesson = 1 hour).
-- Hours per two years: Technology 7-8 = 200; each elective course = 100.
-- Only unbuilt placeholder rows are touched (seed_key patterns below).

-- 1. Dance, Drama, Music and Visual Arts now come from the elective banks, so drop the earlier rotation bank.
DELETE FROM lessons WHERE seed_key LIKE 's4-arts-%';

-- 2. Technology 7-8: 240 -> 200 (remove lesson 3 in every even week).
DELETE FROM lessons
WHERE seed_key LIKE 's4-tech-%'
  AND CAST(json_extract(data, '$.lesson_number') AS INTEGER) = 3
  AND CAST(json_extract(data, '$.week') AS INTEGER) % 2 = 0;

-- 3. Electives (created by 0026, moved to Stage 4 by 0027): 160 -> 100.
-- Keep the first 12 lessons of each unit, plus 2 year-end review lessons in units 4 and 8.
DELETE FROM lessons
WHERE seed_key LIKE 's5-%' AND created_at = '2026-10-11T14:00:00Z'
  AND NOT (
    ((CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER)) <= 12
    OR (CAST(json_extract(data, '$.unit_number') AS INTEGER) IN (4, 8)
        AND ((CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER)) IN (13, 14))
  );

-- Renumber: lessons 1-50 in each year, spread over 40 weeks.
UPDATE lessons SET
  title = 'Year ' || replace(json_extract(data, '$.year_level'), 'Year ', '') || ', Lesson '
    || (((CAST(json_extract(data, '$.unit_number') AS INTEGER) - 1) % 4) * 12
        + (CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER))
    || ': ' || json_extract(data, '$.unit_title'),
  data = json_set(
    data,
    '$.lesson_number', (((CAST(json_extract(data, '$.unit_number') AS INTEGER) - 1) % 4) * 12
        + (CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER)),
    '$.week', ((((CAST(json_extract(data, '$.unit_number') AS INTEGER) - 1) % 4) * 12
        + (CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER)) - 1) * 4 / 5 + 1,
    '$.week_in_unit', ((CAST(json_extract(data, '$.week_in_unit') AS INTEGER) - 1) * 2 + CAST(json_extract(data, '$.lesson_number') AS INTEGER) + 1) / 2
  ),
  updated_at = '2026-10-11T16:00:00Z'
WHERE seed_key LIKE 's5-%' AND created_at = '2026-10-11T14:00:00Z';
