-- Early Stage 1 (Kindergarten) HSIE: 80 coming-soon placeholder lessons.
-- 40 weeks, 2 lessons a week (learn, then apply and share). Eight five-week units.
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Build a lesson by replacing its row's data and removing coming_soon (keep the seed_key or add a topic suffix).
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 5, 'Me and my family', 'History'),
  (2, 6, 10, 'Family stories and celebrations', 'History'),
  (3, 11, 15, 'Then and now', 'History'),
  (4, 16, 20, 'Our school and local community', 'Geography'),
  (5, 21, 25, 'Places we belong to', 'Geography'),
  (6, 26, 30, 'Weather, seasons and places around the world', 'Geography'),
  (7, 31, 35, 'Aboriginal and Torres Strait Islander peoples and Country', 'History and Geography'),
  (8, 36, 40, 'Rules, fairness and belonging', 'Civics and Citizenship')
),
w(wk, t1, t2) AS (VALUES
  (1, 'Who am I', 'All about me poster'),
  (2, 'My family', 'Drawing my family'),
  (3, 'Families around us', 'Different families, same needs'),
  (4, 'Where I live', 'Home and neighbourhood map'),
  (5, 'Investigation: my family', 'Unit review and showcase'),
  (6, 'Family stories', 'Interviewing a family member'),
  (7, 'Special days and celebrations', 'Celebrations in Australia'),
  (8, 'Traditions in families', 'Sharing a tradition'),
  (9, 'Photos and objects from the past', 'Making a family timeline'),
  (10, 'Investigation: a family tradition', 'Unit review and showcase'),
  (11, 'Past, present and future', 'Sequencing events'),
  (12, 'Toys then and now', 'Comparing old and new toys'),
  (13, 'Homes then and now', 'Clothes then and now'),
  (14, 'Old and new objects', 'Museum in the classroom'),
  (15, 'Investigation: how things have changed', 'Unit review and showcase'),
  (16, 'Our school', 'School map and tour'),
  (17, 'People who help us at school', 'Thank you cards'),
  (18, 'Our local community', 'Places in our community'),
  (19, 'Jobs in the community', 'Community helpers'),
  (20, 'Investigation: a place in our community', 'Unit review and showcase'),
  (21, 'Places we belong to', 'Special places'),
  (22, 'Features of places', 'Natural and built features'),
  (23, 'Looking after places', 'Caring for our school grounds'),
  (24, 'Maps and pictures', 'Drawing a simple map'),
  (25, 'Investigation: a special place', 'Unit review and showcase'),
  (26, 'Weather and where we live', 'Weather around Australia'),
  (27, 'Seasons and how people live', 'Clothes and homes in different places'),
  (28, 'Places around the world', 'Comparing places near and far'),
  (29, 'Australia on a globe or map', 'Finding our country'),
  (30, 'Investigation: a place far away', 'Unit review and showcase'),
  (31, 'First Nations peoples of Australia', 'Listening to Aboriginal and Torres Strait Islander stories'),
  (32, 'Country and place', 'Learning about the local Country'),
  (33, 'Dreaming stories: a first look', 'Retelling a story with art'),
  (34, 'Respect for people and Country', 'Caring for Country'),
  (35, 'Investigation: stories of Country', 'Unit review and showcase'),
  (36, 'Rules at home and school', 'Making class rules'),
  (37, 'Fairness and sharing', 'Taking turns and being fair'),
  (38, 'Rights and responsibilities', 'Being a good friend'),
  (39, 'Belonging to groups', 'Our class community'),
  (40, 'Kindergarten HSIE reflection', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 ELSE w.t2 END AS tt,
    'es1-hsie-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'HSIE', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Learn' ELSE 'Apply and share' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Learn lesson in the unit ' || unit || '. Focus: ' || tt || '. Children explore the big idea through stories, pictures and talk.'
        ELSE 'Apply and share lesson in the unit ' || unit || '. Focus: ' || tt || '. Children draw, make or talk to show and share what they learned.'
      END || CASE WHEN uw = uweeks THEN ' This is the showcase and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA HSIE K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:30:00Z', '2026-10-11T08:30:00Z'
FROM x;
