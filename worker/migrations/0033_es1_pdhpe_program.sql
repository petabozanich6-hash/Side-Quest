-- Early Stage 1 (Kindergarten) PDHPE: 80 coming-soon placeholder lessons.
-- 40 weeks, 2 lessons a week (learn and discuss, then practise and apply). Eight five-week units.
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Build a lesson by replacing its row's data and removing coming_soon (keep the seed_key or add a topic suffix).
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 5, 'Me and my feelings', 'Personal, Social and Community Health'),
  (2, 6, 10, 'Friends and being kind', 'Personal, Social and Community Health'),
  (3, 11, 15, 'Staying safe', 'Personal, Social and Community Health'),
  (4, 16, 20, 'Healthy bodies', 'Healthy, Safe and Active Lifestyles'),
  (5, 21, 25, 'Moving my body', 'Movement Skill and Performance'),
  (6, 26, 30, 'Throwing, catching and games', 'Movement Skill and Performance'),
  (7, 31, 35, 'Dance, rhythm and active play', 'Movement Skill and Performance'),
  (8, 36, 40, 'Growing and changing', 'Personal, Social and Community Health')
),
w(wk, t1, t2) AS (VALUES
  (1, 'Naming feelings', 'Feelings faces and stories'),
  (2, 'Calm and happy bodies', 'Breathing and calming tools'),
  (3, 'When I feel upset', 'Asking for help'),
  (4, 'Things I am good at', 'Celebrating my strengths'),
  (5, 'Investigation: my feelings', 'Unit review and showcase'),
  (6, 'Making friends', 'Playing together'),
  (7, 'Being kind and respectful', 'Kind words and actions'),
  (8, 'Sharing and taking turns', 'Solving a problem with a friend'),
  (9, 'Including others', 'Games that include everyone'),
  (10, 'Investigation: friends', 'Unit review and showcase'),
  (11, 'Staying safe at home and school', 'Safe and unsafe situations'),
  (12, 'Safe people and trusted adults', 'My safety network'),
  (13, 'Road and pedestrian safety', 'Practising crossing safely'),
  (14, 'Sun, water and play safety', 'Safety rules in games'),
  (15, 'Investigation: staying safe', 'Unit review and showcase'),
  (16, 'Healthy food and drinks', 'Everyday foods and sometimes foods'),
  (17, 'Sleep and rest', 'Our daily routine'),
  (18, 'Germs and handwashing', 'Practising good hygiene'),
  (19, 'Being active every day', 'Our activity chart'),
  (20, 'Investigation: a healthy day', 'Unit review and showcase'),
  (21, 'Walking and running', 'Run, stop and change direction'),
  (22, 'Jumping and hopping', 'Jumping games'),
  (23, 'Balancing', 'Obstacle course'),
  (24, 'Climbing and crawling', 'Moving in different ways'),
  (25, 'Investigation: moving my body', 'Unit review and showcase'),
  (26, 'Throwing', 'Throwing at targets'),
  (27, 'Catching', 'Catching with a partner'),
  (28, 'Kicking and rolling a ball', 'Ball games'),
  (29, 'Team games and fair play', 'Playing by the rules'),
  (30, 'Investigation: ball skills', 'Unit review and showcase'),
  (31, 'Moving to music', 'Dance patterns'),
  (32, 'Fast and slow, high and low', 'Creating a movement story'),
  (33, 'Skipping, galloping and sliding', 'Action rhymes and games'),
  (34, 'Rhythm and beat', 'Making a class dance'),
  (35, 'Investigation: dance', 'Unit review and showcase'),
  (36, 'How I have grown', 'Then and now: me'),
  (37, 'My body and keeping it private', 'Body parts and privacy'),
  (38, 'Changes and new experiences', 'Getting ready for Year 1'),
  (39, 'Looking forward', 'Setting a goal'),
  (40, 'Kindergarten PDHPE reflection', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 ELSE w.t2 END AS tt,
    'es1-pdh-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'PDHPE', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Learn and discuss' ELSE 'Practise and apply' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Learn and discuss lesson in the unit ' || unit || '. Focus: ' || tt || '. Children talk, listen and explore the big idea through stories and simple activities.'
        ELSE 'Practise and apply lesson in the unit ' || unit || '. Focus: ' || tt || '. Children practise the skill through movement, games and role play.'
      END || CASE WHEN uw = uweeks THEN ' This is the showcase and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA PDHPE K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:30:00Z', '2026-10-11T08:30:00Z'
FROM x;
