-- Early Stage 1 (Kindergarten) Creative Arts: 80 coming-soon placeholder lessons.
-- 40 weeks, 2 lessons a week (explore, then create and share). Eight five-week units across visual arts, music, drama and dance.
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Build a lesson by replacing its row's data and removing coming_soon (keep the seed_key or add a topic suffix).
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 5, 'Visual arts: lines, shapes and colour', 'Visual Arts'),
  (2, 6, 10, 'Music: beat, rhythm and singing', 'Music'),
  (3, 11, 15, 'Drama: pretend play and stories', 'Drama'),
  (4, 16, 20, 'Dance: moving to music', 'Dance'),
  (5, 21, 25, 'Visual arts: making and craft', 'Visual Arts'),
  (6, 26, 30, 'Music: instruments and sounds', 'Music'),
  (7, 31, 35, 'Drama: puppets and performing', 'Drama'),
  (8, 36, 40, 'Our art show and celebration', 'Visual Arts')
),
w(wk, t1, t2) AS (VALUES
  (1, 'Drawing lines and shapes', 'Making a line picture'),
  (2, 'Exploring colours', 'Mixing primary colours'),
  (3, 'Looking at artworks', 'Talking about art we like'),
  (4, 'Painting with brushes and fingers', 'Painting my favourite thing'),
  (5, 'Investigation: my art', 'Unit review and showcase'),
  (6, 'Feeling the beat', 'Clapping and stepping to a beat'),
  (7, 'Loud and soft', 'Singing loud and soft'),
  (8, 'Fast and slow', 'Moving to fast and slow music'),
  (9, 'Singing songs together', 'Action songs'),
  (10, 'Investigation: our class song', 'Unit review and showcase'),
  (11, 'Pretend play', 'Role play: home and shop'),
  (12, 'Using my voice and body to show feelings', 'Feelings charades'),
  (13, 'Acting out a story', 'Retelling a story with actions'),
  (14, 'Characters in stories', 'Dressing up as a character'),
  (15, 'Investigation: a class play', 'Unit review and showcase'),
  (16, 'Moving to music', 'Freeze dance'),
  (17, 'High, low, big and small movements', 'Animal movements'),
  (18, 'Dancing with scarves and ribbons', 'Making a dance pattern'),
  (19, 'Dances from different cultures', 'Learning a simple dance'),
  (20, 'Investigation: our dance', 'Unit review and showcase'),
  (21, 'Collage with paper', 'Making a paper collage'),
  (22, 'Clay and playdough', 'Modelling an animal'),
  (23, 'Printing and stamping', 'Making a pattern print'),
  (24, 'Craft with recycled materials', 'Creating a junk model'),
  (25, 'Investigation: making art', 'Unit review and showcase'),
  (26, 'Instruments in the classroom', 'Playing percussion instruments'),
  (27, 'Sounds around us', 'Making sounds with found objects'),
  (28, 'Long and short sounds', 'Making sound patterns'),
  (29, 'Listening to music', 'Drawing what music sounds like'),
  (30, 'Investigation: our sound story', 'Unit review and showcase'),
  (31, 'What is a puppet', 'Making a stick puppet'),
  (32, 'Giving puppets voices', 'Puppet conversations'),
  (33, 'Puppet show planning', 'Rehearsing a puppet show'),
  (34, 'Performing for others', 'Puppet show for the class'),
  (35, 'Investigation: our puppet show', 'Unit review and showcase'),
  (36, 'Choosing my best work', 'Planning an art show'),
  (37, 'Displaying and describing art', 'Making labels for artworks'),
  (38, 'Sharing a song, dance or play', 'Rehearsing a performance'),
  (39, 'Class showcase', 'Performing and sharing'),
  (40, 'Kindergarten creative arts reflection', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 ELSE w.t2 END AS tt,
    'es1-arts-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'Creative Arts', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Explore' ELSE 'Create and share' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Explore lesson in the unit ' || unit || '. Focus: ' || tt || '. Children look, listen and try out the big idea through play.'
        ELSE 'Create and share lesson in the unit ' || unit || '. Focus: ' || tt || '. Children make, perform and share their own work.'
      END || CASE WHEN uw = uweeks THEN ' This is the showcase and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA Creative Arts K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:30:00Z', '2026-10-11T08:30:00Z'
FROM x;
