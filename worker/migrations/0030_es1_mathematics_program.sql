-- Early Stage 1 (Kindergarten) Mathematics: 160 coming-soon placeholder lessons.
-- 40 weeks, 4 lessons a week (concept, strategies, problem solving, fluency and review).
-- Ten four-week units. Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Build a lesson by replacing its row's data and removing coming_soon (keep the seed_key or add a topic suffix).
-- Stage code is ES1. Outcome codes are left empty until mapped to the NESA Mathematics K-6 Early Stage 1 syllabus.
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 4, 'Counting and numbers to 5', 'Number and Algebra'),
  (2, 5, 8, 'Numbers to 10', 'Number and Algebra'),
  (3, 9, 12, 'Sorting and patterns', 'Number and Algebra'),
  (4, 13, 16, 'Combining and separating groups', 'Number and Algebra'),
  (5, 17, 20, 'Length, mass and capacity', 'Measurement and Space'),
  (6, 21, 24, '2D shapes and 3D objects', 'Measurement and Space'),
  (7, 25, 28, 'Numbers to 20', 'Number and Algebra'),
  (8, 29, 32, 'Position, time and money', 'Measurement and Space'),
  (9, 33, 36, 'Sharing, grouping and fractions', 'Number and Algebra'),
  (10, 37, 40, 'Data, chance and investigation', 'Statistics and Probability')
),
w(wk, t1, t2, t3, t4) AS (VALUES
  (1, 'Counting and comparing groups to 3', 'Counting objects with one-to-one matching', 'Which group has more', 'Fluency: counting to 3'),
  (2, 'Numbers 1 to 4', 'Counting forwards and backwards', 'Showing numbers in different ways', 'Fluency: counting to 4'),
  (3, 'Numbers 1 to 5', 'Subitising: seeing small groups', 'Finger and object counting', 'Fluency: counting to 5'),
  (4, 'Reading and writing numerals to 5', 'Ordering numbers to 5', 'Number problems to 5', 'Unit review and check-in'),
  (5, 'Numbers 6 and 7', 'Counting on from a number', 'Making groups of 6 and 7', 'Fluency: counting to 7'),
  (6, 'Numbers 8 and 9', 'Counting backwards from 9', 'Making groups of 8 and 9', 'Fluency: counting to 9'),
  (7, 'Number 10 and zero', 'Ten frames', 'Number problems to 10', 'Fluency: counting to 10'),
  (8, 'Writing numerals to 10', 'Comparing numbers to 10', 'One more and one less', 'Unit review and check-in'),
  (9, 'Sorting by one attribute', 'Describing what is the same and different', 'Sorting problems', 'Fluency: sorting'),
  (10, 'Repeating patterns with objects', 'Continuing patterns', 'Creating my own pattern', 'Fluency: patterns'),
  (11, 'Patterns with sounds and movement', 'Patterns in the world', 'Pattern problems', 'Fluency: pattern practice'),
  (12, 'Number patterns: counting by ones', 'Skip counting by twos: a first look', 'Pattern investigation', 'Unit review and check-in'),
  (13, 'Joining groups: adding', 'Adding with objects', 'Adding stories', 'Fluency: adding to 5'),
  (14, 'Taking away: subtracting', 'Subtracting with objects', 'Subtracting stories', 'Fluency: subtracting from 5'),
  (15, 'Making 5 in different ways', 'Number bonds to 5', 'Adding and subtracting problems', 'Fluency: number bonds to 5'),
  (16, 'Adding and subtracting to 10', 'Using ten frames to add and subtract', 'Number story problems', 'Unit review and check-in'),
  (17, 'Comparing length: longer and shorter', 'Measuring length with objects', 'Length problems', 'Fluency: length words'),
  (18, 'Comparing height: taller and shorter', 'Measuring with hands and feet', 'Ordering by length', 'Fluency: measuring'),
  (19, 'Comparing mass: heavier and lighter', 'Using balance scales', 'Mass problems', 'Fluency: mass words'),
  (20, 'Comparing capacity: full and empty', 'Filling containers', 'Capacity problems', 'Unit review and check-in'),
  (21, 'Naming circles, squares and triangles', 'Sides and corners', 'Shapes in the classroom', 'Fluency: naming shapes'),
  (22, 'Rectangles and other shapes', 'Sorting 2D shapes', 'Making pictures with shapes', 'Fluency: shape sorting'),
  (23, 'Spheres, cubes and cylinders', 'Describing 3D objects', 'Building with 3D objects', 'Fluency: naming 3D objects'),
  (24, 'Stacking, rolling and sliding', 'Shape hunt: shapes around us', 'Shape problems', 'Unit review and check-in'),
  (25, 'Numbers 11 to 13', 'Teen numbers with ten frames', 'Counting to 13', 'Fluency: counting to 13'),
  (26, 'Numbers 14 to 16', 'Counting on from 10', 'Counting to 16', 'Fluency: counting to 16'),
  (27, 'Numbers 17 to 20', 'Counting to 20', 'Ordering numbers to 20', 'Fluency: counting to 20'),
  (28, 'Writing numerals to 20', 'Comparing numbers to 20', 'Number problems to 20', 'Unit review and check-in'),
  (29, 'Position words: on, under, next to', 'Following position directions', 'Position problems', 'Fluency: position words'),
  (30, 'Days of the week', 'Months and seasons', 'Time problems', 'Fluency: days and months'),
  (31, 'Daily routines and time words', 'Reading a simple clock: o clock', 'Time problems', 'Fluency: time words'),
  (32, 'Australian coins', 'Naming and recognising coins', 'Money problems', 'Unit review and check-in'),
  (33, 'Sharing into equal groups', 'Sharing objects fairly', 'Sharing problems', 'Fluency: sharing'),
  (34, 'Grouping objects', 'Equal groups of 2, 5 and 10: a first look', 'Grouping problems', 'Fluency: grouping'),
  (35, 'Halves: sharing into two', 'Halves of shapes and objects', 'Half problems', 'Fluency: halves'),
  (36, 'Quarters: a first look', 'Fair shares', 'Fractions around us', 'Unit review and check-in'),
  (37, 'Collecting and sorting data', 'Making a pictograph', 'Reading a pictograph', 'Fluency: data questions'),
  (38, 'Our class data', 'Comparing groups in data', 'Data problems', 'Fluency: data practice'),
  (39, 'Chance: will it happen', 'Likely and unlikely: a first look', 'Chance experiments', 'Fluency: chance words'),
  (40, 'Kindergarten investigation: planning', 'Kindergarten investigation: doing and sharing', 'Kindergarten skills check', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2), (3), (4)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 WHEN 2 THEN w.t2 WHEN 3 THEN w.t3 ELSE w.t4 END AS tt,
    'es1-mat-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'Mathematics', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Concept' WHEN 2 THEN 'Strategies' WHEN 3 THEN 'Problem solving' ELSE 'Fluency and review' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Concept lesson in the unit ' || unit || '. Focus: ' || tt || '. Children learn the big idea with objects, pictures and talk.'
        WHEN 2 THEN 'Strategies lesson in the unit ' || unit || '. Focus: ' || tt || '. Children practise simple strategies with hands-on materials and clear modelling.'
        WHEN 3 THEN 'Problem solving lesson in the unit ' || unit || '. Focus: ' || tt || '. Children use the week''s ideas to solve simple problems and explain what they did.'
        ELSE 'Fluency and review lesson in the unit ' || unit || '. Focus: ' || tt || '. Children build confidence and speed through games and quick activities.'
      END || CASE WHEN uw = uweeks THEN ' This is the review and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA Mathematics K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:00:00Z', '2026-10-11T08:00:00Z'
FROM x;
