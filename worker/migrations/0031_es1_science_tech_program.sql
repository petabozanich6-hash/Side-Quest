-- Early Stage 1 (Kindergarten) Science and Technology: 80 coming-soon placeholder lessons.
-- 40 weeks, 2 lessons a week (investigate, then apply and make). Eight five-week units.
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Build a lesson by replacing its row's data and removing coming_soon (keep the seed_key or add a topic suffix).
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 5, 'My senses and my body', 'Living World'),
  (2, 6, 10, 'Plants and animals around us', 'Living World'),
  (3, 11, 15, 'Materials and how they feel', 'Material World'),
  (4, 16, 20, 'Pushes, pulls and movement', 'Physical World'),
  (5, 21, 25, 'Day, night and weather', 'Earth and Space'),
  (6, 26, 30, 'Making and building', 'Engineering and Design'),
  (7, 31, 35, 'Digital technologies: devices and instructions', 'Digital Technologies'),
  (8, 36, 40, 'Food, gardens and our project', 'Agriculture and Food Technologies')
),
w(wk, t1, t2) AS (VALUES
  (1, 'Our five senses', 'Sense detectives: what can we see and hear'),
  (2, 'Touch, smell and taste', 'Mystery bag: guess by touch and smell'),
  (3, 'Parts of my body', 'Drawing and labelling my body'),
  (4, 'Keeping my body clean and healthy', 'Making a healthy body poster'),
  (5, 'Investigation: my favourite sense', 'Unit review and showcase'),
  (6, 'Plants we see every day', 'Looking closely at leaves and flowers'),
  (7, 'Animals we know', 'Sorting animals: pets, farm and wild'),
  (8, 'What animals need to live', 'Caring for a class plant or pet'),
  (9, 'Where animals live', 'Making a habitat in a box'),
  (10, 'Mini beast hunt', 'Unit review and showcase'),
  (11, 'Everyday materials', 'Sorting by hard, soft, rough and smooth'),
  (12, 'Natural and made things', 'Treasure hunt for natural and made things'),
  (13, 'Floating and sinking', 'Fair test: will it float'),
  (14, 'Wet and dry', 'Which material keeps us dry'),
  (15, 'Using materials to make things', 'Unit review and showcase'),
  (16, 'Pushing and pulling', 'Pushes and pulls in the playground'),
  (17, 'Fast and slow', 'Rolling things down ramps'),
  (18, 'Things that spin, slide and roll', 'Making a moving toy'),
  (19, 'Magnets: a first look', 'Magnet treasure hunt'),
  (20, 'Wind and moving air', 'Unit review and showcase'),
  (21, 'Day and night', 'Sun and shadow play'),
  (22, 'The Sun keeps us warm', 'Staying sun safe'),
  (23, 'Weather: sunny, cloudy, rainy and windy', 'Making a weather chart'),
  (24, 'Seasons and clothes', 'Dressing for the weather'),
  (25, 'Looking at the sky', 'Unit review and showcase'),
  (26, 'What is design', 'Design a place for a toy'),
  (27, 'Joining and building', 'Building with blocks and recycled boxes'),
  (28, 'Strong and stable', 'Testing the tallest tower'),
  (29, 'Making a model', 'Improving my model'),
  (30, 'Sharing what I made', 'Unit review and showcase'),
  (31, 'What is a device', 'Devices in my home and school'),
  (32, 'Giving instructions', 'Following and giving steps'),
  (33, 'Direction games', 'Programming a floor robot or a friend'),
  (34, 'Staying safe with devices', 'Using a device with an adult'),
  (35, 'Digital showcase', 'Unit review and showcase'),
  (36, 'Where food comes from', 'Fruit and vegetable tasting'),
  (37, 'Planting seeds', 'Watching seeds grow'),
  (38, 'Caring for a garden', 'Garden helpers'),
  (39, 'Healthy food choices', 'Making a healthy snack'),
  (40, 'Kindergarten science and technology reflection', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 ELSE w.t2 END AS tt,
    'es1-sci-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'Science and Technology', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Investigate' ELSE 'Apply and make' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Investigate lesson in the unit ' || unit || '. Focus: ' || tt || '. Children explore the big idea through talk, observation and hands-on play.'
        ELSE 'Apply and make lesson in the unit ' || unit || '. Focus: ' || tt || '. Children use what they learned to try, make, test or share something simple.'
      END || CASE WHEN uw = uweeks THEN ' This is the showcase and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA Science and Technology K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:30:00Z', '2026-10-11T08:30:00Z'
FROM x;
