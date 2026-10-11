-- Stage 2 English two-year program: 320 coming-soon placeholder lessons.
-- Year 3 and Year 4, 40 weeks each, 4 lessons a week (reading, writing, language and spelling, speaking and handwriting).
-- Placeholders are shared lessons (family_id NULL) flagged coming_soon. Build a lesson by replacing its row's data
-- (keep the seed_key, or add a topic suffix to the key as the build guide describes) and removing coming_soon.
WITH u(y, n, unit, cw, cu, dig) AS (VALUES
  (3, 1, 'Narrative: story elements and planning', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (3, 2, 'Information reports', 'EN2-CWT-02', '', 0),
  (3, 3, 'Poetry: rhyme, rhythm and imagery', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (3, 4, 'Persuasion: opinions and reasons', 'EN2-CWT-03', '', 0),
  (3, 5, 'Class novel study', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (3, 6, 'Procedures and explanations', 'EN2-CWT-02', '', 0),
  (3, 7, 'Myths, legends and First Nations stories', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (3, 8, 'Research project and portfolio', 'EN2-CWT-02', '', 1),
  (4, 1, 'Narrative: suspense, point of view and voice', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (4, 2, 'Explanations, news and digital texts', 'EN2-CWT-02', '', 1),
  (4, 3, 'Poetry: figurative language and ballads', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (4, 4, 'Persuasion: exposition, bias and advertising', 'EN2-CWT-03', '', 0),
  (4, 5, 'Novel study 2', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (4, 6, 'Discussion texts and comparing viewpoints', 'EN2-CWT-03', '', 0),
  (4, 7, 'Folktales and world stories compared', 'EN2-CWT-01', 'EN2-UARL-01', 0),
  (4, 8, 'Independent research and portfolio', 'EN2-CWT-02', '', 1)
),
w(y, wk, t1, t2, t3, t4, sp) AS (VALUES
  (3, 1, 'Reading with expression', 'Writing a clear sentence', 'Spelling strategies: sounds and syllables', 'Storytelling aloud and joined handwriting', 'Sounds and syllables'),
  (3, 2, 'Story elements: character, setting and plot', 'Planning a story with a story mountain', 'Nouns, verbs and adjectives', 'Retelling a story aloud', 'Vowel teams: ai, ay, ee, ea, oa'),
  (3, 3, 'Predicting and questioning', 'Orientation and complication', 'Verb tense and adverbs', 'Readers theatre: reading dialogue aloud', 'Suffixes: -ing and -ed'),
  (3, 4, 'Inference from clues', 'Show, don''t tell', 'Conjunctions and complex sentences', 'Handwriting speed and legibility', 'Prefixes: un-, re-, dis-, mis-'),
  (3, 5, 'Summarising a story', 'Resolution, revising and editing', 'Punctuating dialogue', 'Publishing and sharing your story', 'Homophones: there, their, they''re'),
  (3, 6, 'Text features: headings, glossary and index', 'Planning a report', 'Technical words and vocabulary', 'Listening and note-taking', 'Words ending in -tion'),
  (3, 7, 'Main idea and key details', 'Writing a classification paragraph', 'Pronouns and cohesion', 'Finding reliable sources', 'Words ending in -sion and -ssion'),
  (3, 8, 'Fact versus opinion', 'Writing a description paragraph', 'Timeless present tense', 'Oral presentation skills', 'Plurals: -s, -es, -ves and irregular'),
  (3, 9, 'Diagrams, graphs and captions', 'Writing a report with visuals', 'Compound and complex sentences', 'Handwriting labels and captions', 'Silent letters: kn, wr, mb, gn'),
  (3, 10, 'Synthesising two texts', 'Editing and publishing the report', 'Punctuation review: commas and apostrophes', 'Presenting the report', 'Review of Weeks 6 to 9'),
  (3, 11, 'What makes a poem: rhyme and rhythm', 'Writing a rhyming poem', 'Alliteration and onomatopoeia', 'Performing poems', 'ph, ch and gh sounds'),
  (3, 12, 'Imagery: simile and metaphor', 'Writing simile and metaphor poems', 'Noun groups with adjectives', 'Haiku and syllable counting', 'Syllable patterns and double letters'),
  (3, 13, 'Free verse and mood', 'Writing free verse about nature', 'Strong verbs', 'Poetry recital', 'Suffixes: -ful, -less, -ly'),
  (3, 14, 'Australian bush ballads', 'Writing a ballad', 'Synonyms, antonyms and the thesaurus', 'Choral reading', 'Homophones: to, too, two; here, hear'),
  (3, 15, 'Comparing two poems', 'Writing a poem response', 'Figurative language review', 'Poetry anthology and joined handwriting', 'Review of Weeks 11 to 14'),
  (3, 16, 'Persuasion in everyday texts', 'Opinion and reasons', 'Modality: should, must, might', 'Debate basics', 'Words ending in -ous and -ious'),
  (3, 17, 'Reading an argument', 'Writing a position statement', 'Connectives for reasons', 'Listening to speeches', 'Words ending in -able and -ible'),
  (3, 18, 'Bias and audience', 'Argument paragraphs with evidence', 'Emotive language', 'Rebuttal practice', 'Prefixes: in-, im-, il-, ir-'),
  (3, 19, 'Advertisements and posters', 'Writing a persuasive letter', 'Letter conventions and formal language', 'Handwriting a formal letter', 'Endings: -er, -or, -ar'),
  (3, 20, 'Evaluating arguments', 'Writing a final exposition', 'Clause review', 'Presenting a speech', 'Review of Weeks 16 to 19'),
  (3, 21, 'Setting and prediction', 'Writing a diary entry in role', 'Verb groups and tense', 'Read-aloud and discussion', 'Soft c and g'),
  (3, 22, 'Character traits and evidence', 'Writing a character description', 'Adverbials of time and place', 'Hot seat: interviewing a character', 'Words with ie and ei'),
  (3, 23, 'Plot and problem', 'Writing a plot summary', 'Paragraph cohesion', 'Book discussion circle', 'Greek roots: auto, tele, photo'),
  (3, 24, 'Theme and the author''s message', 'Writing a theme paragraph', 'Direct and indirect speech', 'Readers theatre of a chapter', 'Latin roots: port, rupt, scrib'),
  (3, 25, 'Author''s craft', 'Writing a book review', 'Language review', 'Portfolio checkpoint', 'Review of Weeks 21 to 24'),
  (3, 26, 'Reading procedures', 'Writing a procedure', 'Imperative verbs', 'Demonstrating a procedure aloud', 'Science words'),
  (3, 27, 'Cause and effect in explanations', 'Planning an explanation', 'Causal connectives', 'Explaining a process orally', 'Words ending in -ence and -ance'),
  (3, 28, 'Diagrams and flow charts', 'Writing an explanation with a diagram', 'Technical language', 'Handwriting labelled diagrams', 'Words ending in -ment and -ness'),
  (3, 29, 'Reading websites and digital texts', 'Searching and making notes', 'Reliable and unreliable sources', 'Digital citizenship and presenting', 'Compound words'),
  (3, 30, 'Comparing two explanations', 'Publishing an explanation', 'Language and spelling review', 'Presenting to an audience', 'Review of Weeks 26 to 29'),
  (3, 31, 'Dreaming stories and cultural protocols', 'Retelling with respect for sources', 'Verb types and tense', 'Listening to oral storytelling', 'Place-name spelling'),
  (3, 32, 'Greek myths', 'Planning a myth', 'Noun and pronoun agreement', 'Dramatic retelling', 'Latin roots: spect, dict, struct'),
  (3, 33, 'Folktales from around the world', 'Writing a folktale', 'Direct speech review', 'Readers theatre', 'Words with -ough'),
  (3, 34, 'Legend structure', 'Writing a legend', 'Sentence variety', 'Peer feedback', 'Homophones: knew, new; threw, through'),
  (3, 35, 'Comparing myths and legends', 'Writing a compare and contrast paragraph', 'Language review', 'Presenting a legend', 'Review of Weeks 31 to 34'),
  (3, 36, 'Choosing a research topic', 'Planning a research report', 'Asking good research questions', 'Oral presentation practice', 'Spelling revision: Weeks 1 to 10'),
  (3, 37, 'Reading to find information', 'Making notes and drafting', 'Citing sources', 'Interviewing an expert', 'Spelling revision: Weeks 11 to 20'),
  (3, 38, 'Organising ideas', 'Drafting the research report', 'Editing for grammar and punctuation', 'Handwriting a final copy', 'Spelling revision: Weeks 21 to 30'),
  (3, 39, 'Creating a digital presentation', 'Publishing the report', 'Final grammar review', 'Presenting the research project', 'Spelling revision: Weeks 31 to 38'),
  (3, 40, 'End-of-year reading reflection', 'Portfolio selection and reflection', 'Language and spelling check', 'Reflection and celebration', 'Year 3 spelling check'),
  (4, 1, 'Narrative structure variations', 'Building suspense', 'Relative clauses', 'Oral storytelling', 'Suffix rules: y to i and doubling'),
  (4, 2, 'Point of view: first and third person', 'Dialogue and character voice', 'Advanced dialogue punctuation', 'Handwriting speed and fluency', 'Homophones: affect, effect; past, passed'),
  (4, 3, 'Setting description', 'Descriptive writing using the senses', 'Prepositional phrases', 'Reading illustrations and visual texts', 'Words ending in -cial and -tial'),
  (4, 4, 'Plot twists and endings', 'Drafting a longer narrative', 'Sentence variety', 'Peer feedback', 'Prefixes: sub-, inter-, super-'),
  (4, 5, 'Reading as a writer', 'Revising and publishing', 'Editing checklist', 'Presenting the story', 'Review of Weeks 1 to 4'),
  (4, 6, 'News articles: structure', 'Writing a news report', 'Headlines and noun groups', 'Radio news reading', 'Words ending in -ful and -ous'),
  (4, 7, 'Fact-checking claims', 'Writing evidence paragraphs', 'Quoting sources', 'Interviewing', 'Silent letters revisited'),
  (4, 8, 'Reading explanations: cause and effect', 'Planning an explanation', 'Causal connectives and conjunctions', 'Explaining a process orally', 'Words ending in -ence and -ance revisited'),
  (4, 9, 'Diagrams, flow charts and data', 'Writing an explanation with a diagram', 'Technical language', 'Handwriting labelled diagrams', 'Words ending in -ment and -ness revisited'),
  (4, 10, 'Reading websites and digital texts', 'Creating a digital text', 'Reliable and unreliable sources', 'Presenting digital work', 'Review of Weeks 6 to 9'),
  (4, 11, 'Poetry and mood: how poets choose words', 'Writing mood poems', 'Figurative language: simile, metaphor and personification', 'Performing poems with expression', 'Homophones: aloud, allowed; board, bored'),
  (4, 12, 'Imagery and the senses in poems', 'Writing imagery poems', 'Hyperbole and idioms', 'Haiku and tanka', 'Syllable patterns'),
  (4, 13, 'Rhythm and rhyme schemes', 'Writing poems with a rhyme scheme', 'Word choice and connotation', 'Choral reading', 'Words ending in -ious and -eous'),
  (4, 14, 'Australian bush ballads and verse', 'Writing a ballad', 'Synonyms and shades of meaning', 'Reciting a ballad', 'Homophones: whether, weather; which, witch'),
  (4, 15, 'Comparing poets and poems', 'Writing a poetry response', 'Figurative language review', 'Poetry anthology and joined handwriting', 'Review of Weeks 11 to 14'),
  (4, 16, 'Reading expositions', 'Planning an exposition', 'Modality and certainty', 'Speaking to persuade', 'Words with -ough revisited'),
  (4, 17, 'Bias and point of view', 'Writing arguments with evidence', 'Persuasive devices and emotive language', 'Listening critically', 'Words ending in -able and -ible revisited'),
  (4, 18, 'Advertising techniques', 'Designing an advertisement', 'Slogans and wordplay', 'Pitching to an audience', 'Homophones: stationary, stationery; principal, principle'),
  (4, 19, 'Evaluating advertisements', 'Writing a persuasive review', 'Evaluating sources and claims', 'Debating', 'Prefixes: anti-, auto-, trans-'),
  (4, 20, 'Reading a multimodal persuasive text', 'Creating a multimodal persuasive presentation', 'Language review', 'Presenting', 'Review of Weeks 16 to 19'),
  (4, 21, 'Setting and character', 'Writing in role', 'Verb tense and consistency', 'Book discussion circle', 'Soft c and g revisited'),
  (4, 22, 'Plot and conflict', 'Writing a plot summary', 'Complex sentences', 'Hot seat', 'Greek roots: graph, phone, scope'),
  (4, 23, 'Relationships and character change', 'Writing a letter between characters', 'Pronoun reference', 'Readers theatre', 'Latin roots: vis, aud, form'),
  (4, 24, 'Theme and the author''s message', 'Writing a theme response', 'Punctuation review', 'Debating a character''s choice', 'Word origins'),
  (4, 25, 'Author''s craft and style', 'Writing a book review', 'Language review', 'Portfolio checkpoint', 'Review of Weeks 21 to 24'),
  (4, 26, 'Reading discussion texts', 'Planning a discussion', 'Contrast connectives', 'Class discussion skills', 'Words from other languages'),
  (4, 27, 'Comparing two viewpoints', 'Writing a balanced discussion', 'Modality and balanced language', 'Respectful debate', 'Plurals review'),
  (4, 28, 'Evidence and reasoning', 'Writing from evidence', 'Reported speech', 'Listening and responding', 'Contractions and possessives'),
  (4, 29, 'Opinion pieces and letters to the editor', 'Writing a letter to the editor', 'Formal and informal language', 'Handwriting a formal letter', 'Homophones review'),
  (4, 30, 'Evaluating a discussion', 'Publishing a discussion text', 'Language and spelling review', 'Class forum', 'Review of Weeks 26 to 29'),
  (4, 31, 'Fables and their morals', 'Writing a fable', 'Verb groups', 'Telling a fable aloud', 'Compound words revisited'),
  (4, 32, 'Folktales from different cultures', 'Writing a folktale', 'Direct speech and punctuation', 'Readers theatre', 'Words with -ough: a closer look'),
  (4, 33, 'First Nations stories and protocols', 'Retelling with respect', 'Noun groups', 'Listening to oral storytelling', 'Place names'),
  (4, 34, 'Comparing stories across cultures', 'Writing a compare and contrast paragraph', 'The language of comparison', 'Storytelling circle', 'Greek and Latin roots review'),
  (4, 35, 'Retelling traditional tales in a new way', 'Writing a modern retelling', 'Language review', 'Presenting a retelling', 'Review of Weeks 31 to 34'),
  (4, 36, 'Choosing a research question', 'Planning a research project', 'Evaluating sources', 'Presenting a plan', 'Spelling revision: Weeks 1 to 10'),
  (4, 37, 'Reading widely for research', 'Making notes and organising ideas', 'Paraphrasing and quoting', 'Interview or survey', 'Spelling revision: Weeks 11 to 20'),
  (4, 38, 'Writing for an audience', 'Drafting the research report', 'Editing and proofreading', 'Handwriting a final copy', 'Spelling revision: Weeks 21 to 30'),
  (4, 39, 'Creating a digital presentation', 'Publishing the research', 'Final language review', 'Presenting the research project', 'Spelling revision: Weeks 31 to 38'),
  (4, 40, 'Stage 2 reading reflection', 'Portfolio selection and reflection', 'Stage 2 language and spelling check', 'Reflection and celebration', 'Stage 2 spelling check')
),
l(n) AS (VALUES (1), (2), (3), (4)),
x AS (
  SELECT
    w.y AS y, w.wk AS wk, ((w.wk - 1) / 5) + 1 AS un, ((w.wk - 1) % 5) + 1 AS uw,
    u.unit AS unit, u.cw AS cw, u.cu AS cu, u.dig AS dig, l.n AS ln, w.sp AS sp,
    CASE l.n WHEN 1 THEN w.t1 WHEN 2 THEN w.t2 WHEN 3 THEN w.t3 ELSE w.t4 END AS tt,
    's2-eng-y' || w.y || '-w' || printf('%02d', w.wk) || '-l' || l.n AS k
  FROM w
  JOIN u ON u.y = w.y AND u.n = ((w.wk - 1) / 5) + 1
  CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Year ' || y || ', Week ' || wk || ', Lesson ' || ln || ': ' || tt,
  'S2', 'English', NULL, 'approved',
  json_object(
    'year_level', 'Year ' || y,
    'subject', 'English',
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Reading' WHEN 2 THEN 'Writing' WHEN 3 THEN 'Language and spelling' ELSE 'Speaking and handwriting' END,
    'spelling_focus', sp,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Reading lesson in the unit ' || unit || '. Focus: ' || tt || '. Children build comprehension and fluency through explicit teaching, worked examples and guided practice.'
        WHEN 2 THEN 'Writing lesson in the unit ' || unit || '. Focus: ' || tt || '. Children plan, draft and improve their own writing using clear teaching and models.'
        WHEN 3 THEN 'Language lesson in the unit ' || unit || '. Focus: ' || tt || '. Includes this week''s spelling focus: ' || sp || '.'
        ELSE 'Speaking and handwriting lesson in the unit ' || unit || '. Focus: ' || tt || '. Children practise oral language and joined handwriting.'
      END || CASE WHEN uw = 5 THEN ' This is the showcase and consolidation week for the unit.' ELSE '' END,
    'outcome_codes', json(
      CASE ln
        WHEN 1 THEN CASE WHEN cu = '' THEN '["EN2-RECOM-01"]' ELSE '["EN2-RECOM-01","' || cu || '"]' END
        WHEN 2 THEN CASE WHEN cu = '' THEN '["' || cw || '"]' ELSE '["' || cw || '","' || cu || '"]' END
        WHEN 3 THEN '["EN2-VOCAB-01","EN2-SPELL-01"]'
        ELSE CASE WHEN dig = 1 THEN '["EN2-OLC-01","EN2-HANDW-01","EN2-HANDW-02"]' ELSE '["EN2-OLC-01","EN2-HANDW-01"]' END
      END
    ),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes must be checked against the NESA English K-10 syllabus before the lesson is built.'
  ),
  '2026-10-11T00:00:00Z', '2026-10-11T00:00:00Z'
FROM x;
