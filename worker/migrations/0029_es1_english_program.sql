-- Early Stage 1 (Kindergarten) English: 160 coming-soon placeholder lessons.
-- 40 weeks, 4 lessons a week (reading, writing, letters sounds and handwriting, speaking and listening).
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon. Build a lesson by replacing its row's data
-- (keep the seed_key, or add a topic suffix to the key) and removing coming_soon.
-- Stage code is ES1. Outcome codes are left empty until mapped to the NESA English K-6 Early Stage 1 syllabus.
WITH u(n, wf, wt, unit, strand) AS (VALUES
  (1, 1, 4, 'Starting school: books, talk and my name', 'Early literacy'),
  (2, 5, 8, 'First sounds and letters: s, a, t, p, i', 'Early literacy'),
  (3, 9, 12, 'More sounds and letters: n, m, d, g, o', 'Early literacy'),
  (4, 13, 16, 'Blending and segmenting short words', 'Early literacy'),
  (5, 17, 20, 'Sounds and letters: e, u, r, h, b, f, l', 'Early literacy'),
  (6, 21, 24, 'Sentences and simple stories', 'Reading and writing'),
  (7, 25, 28, 'Rhyme, rhythm and poems', 'Reading and writing'),
  (8, 29, 32, 'Sight words and simple books', 'Reading and writing'),
  (9, 33, 36, 'Information texts and facts', 'Reading and writing'),
  (10, 37, 40, 'Review, sharing and celebration', 'Reading and writing')
),
w(wk, t1, t2, t3, t4) AS (VALUES
  (1, 'Sharing a book together', 'Drawing and talking about my day', 'Learning my name', 'Class rules and good listening'),
  (2, 'Parts of a book: front, back and pages', 'Drawing a picture and telling about it', 'Holding a pencil and making marks', 'Taking turns to talk'),
  (3, 'Reading pictures', 'Labelling a picture', 'Letters in my name', 'Listening to a story'),
  (4, 'Favourite books', 'Writing my name', 'Tracing lines and curves', 'Show and tell'),
  (5, 'Sound s', 'Making marks and letters for s', 'Hearing the first sound in words', 'Songs and chants about sounds'),
  (6, 'Sound a', 'Writing with s and a', 'Forming the letter a', 'Sound games: s and a'),
  (7, 'Sound t', 'Writing the word at', 'Forming the letter t', 'Sound games: s, a, t'),
  (8, 'Sounds p and i', 'Writing the words sat and pat', 'Forming the letters p and i', 'Review: s, a, t, p, i'),
  (9, 'Sound n', 'Writing the words in and tin', 'Forming the letter n', 'Rhyming words: pin, tin, sin'),
  (10, 'Sound m', 'Writing the words mat and man', 'Forming the letter m', 'Sound games: m, n, p'),
  (11, 'Sound d', 'Writing the words dad and did', 'Forming the letter d', 'Rhyming words: sad, mad, dad'),
  (12, 'Sounds g and o', 'Writing the words got and dog', 'Forming the letters g and o', 'Review: letters and sounds so far'),
  (13, 'Sounds c and k', 'Writing the words cat and kit', 'Forming the letters c and k', 'Sound games: c, k, g'),
  (14, 'Blending sounds to read words', 'Writing simple words', 'Letter formation review', 'Segmenting sounds in words'),
  (15, 'Reading short words in a book', 'Making a word list', 'The alphabet song and letter names', 'Rhyme time'),
  (16, 'Reading with a partner', 'Writing a short caption', 'Capital and lower case letters', 'Sharing my caption'),
  (17, 'Sound e', 'Writing the words pen and net', 'Forming the letter e', 'Sound games: e'),
  (18, 'Sounds u and r', 'Writing the words sun and run', 'Forming the letters u and r', 'Sound games: u and r'),
  (19, 'Sounds h and b', 'Writing the words hat and bat', 'Forming the letters h and b', 'Sound games: h and b'),
  (20, 'Sounds f and l', 'Writing the words fan and leg', 'Forming the letters f and l', 'Review: sounds e to l'),
  (21, 'Reading simple sentences', 'Writing a sentence', 'Capital letters and full stops', 'Talking in sentences'),
  (22, 'Reading with expression: a first look', 'Writing a sentence about me', 'Spaces between words', 'Retelling in order'),
  (23, 'Story characters', 'Drawing and writing about a character', 'Handwriting: letters on the line', 'Telling a story with props'),
  (24, 'Beginning, middle and end', 'Writing a story in three parts', 'Handwriting review', 'Sharing my story'),
  (25, 'Rhymes in stories', 'Writing rhyming words', 'Letters: x, y, z, w, v, j, q', 'Reciting nursery rhymes'),
  (26, 'Rhythm and beat in poems', 'Writing a rhyming pair', 'Syllables: clapping words', 'Chanting a poem'),
  (27, 'Poems about animals', 'Writing a line for a poem', 'Handwriting: neat letters', 'Reading poems together'),
  (28, 'Favourite poem', 'Writing a class poem', 'Poetry review', 'Performing a poem'),
  (29, 'Sight words: the, a, is', 'Writing with sight words', 'Handwriting sight words', 'Listening for sight words'),
  (30, 'Sight words: I, to, and', 'Writing a sentence with sight words', 'Handwriting: words on a line', 'Talking about a book'),
  (31, 'Reading a simple book', 'Writing about a book', 'Spelling sight words', 'Asking questions about a book'),
  (32, 'Reading decodable texts', 'Writing about a book in pictures and words', 'Sight word review', 'Book talk'),
  (33, 'Information texts: what are they', 'Writing a fact', 'Labelling a diagram', 'Listening for facts'),
  (34, 'Reading facts about animals', 'Writing facts about an animal', 'Handwriting: facts', 'Sharing facts'),
  (35, 'Facts about my family and home', 'Writing about my home', 'Handwriting review', 'Talking about my family'),
  (36, 'Using pictures to find information', 'Making a mini book of facts', 'Spelling review', 'Presenting my mini book'),
  (37, 'Favourite stories', 'Writing a letter to a friend', 'Letters and sounds review', 'Speaking clearly'),
  (38, 'Reading aloud with a friend', 'Writing my best sentence', 'Handwriting check', 'Listening and responding'),
  (39, 'Reading check-in', 'Writing check-in', 'Letters and sounds check-in', 'Speaking and listening check-in'),
  (40, 'Reading celebration', 'Portfolio: my best writing', 'Handwriting showcase', 'Reflection and celebration')
),
l(n) AS (VALUES (1), (2), (3), (4)),
x AS (
  SELECT
    w.wk AS wk, u.n AS un, (w.wk - u.wf + 1) AS uw, (u.wt - u.wf + 1) AS uweeks,
    u.unit AS unit, u.strand AS strand, l.n AS ln,
    CASE l.n WHEN 1 THEN w.t1 WHEN 2 THEN w.t2 WHEN 3 THEN w.t3 ELSE w.t4 END AS tt,
    'es1-eng-k-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON w.wk BETWEEN u.wf AND u.wt
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Kindergarten, Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'ES1', 'English', NULL, 'approved',
  json_object(
    'year_level', 'Kindergarten',
    'subject', strand,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Reading' WHEN 2 THEN 'Writing' WHEN 3 THEN 'Letters, sounds and handwriting' ELSE 'Speaking and listening' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Reading lesson in the unit ' || unit || '. Focus: ' || tt || '. Children explore books and words with an adult through shared and guided reading.'
        WHEN 2 THEN 'Writing lesson in the unit ' || unit || '. Focus: ' || tt || '. Children draw, talk and write with modelling and lots of support.'
        WHEN 3 THEN 'Letters, sounds and handwriting lesson in the unit ' || unit || '. Focus: ' || tt || '. Children learn letter sounds, shapes and early spelling through short, hands-on activities.'
        ELSE 'Speaking and listening lesson in the unit ' || unit || '. Focus: ' || tt || '. Children talk, listen and share ideas in small steps and fun activities.'
      END || CASE WHEN uw = uweeks THEN ' This is the review and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: map this lesson to the NESA English K-6 Early Stage 1 syllabus before it is built.'
  ),
  '2026-10-11T08:00:00Z', '2026-10-11T08:00:00Z'
FROM x;
