-- Stage 6 (Years 11-12): the remaining courses not covered by 0040. 3,840 coming-soon placeholder lessons across 27 courses.
-- 15 two-year courses (160 lessons each), 6 Year 12 only extension courses (80 each), 6 Continuers languages (160 each).
-- Each module is 10 weeks at 2 lessons a week. Module names are planned placeholders: check them against the current NESA syllabus before building.
-- learning_area is the course name. Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Safe to re-run (INSERT OR IGNORE). Build a lesson by replacing its row's data and removing coming_soon.
WITH c(code, grp, area) AS (VALUES
  ('ee1', 'ee1', 'English Extension 1'), ('ee2', 'ee2', 'English Extension 2'), ('ests', 'ests', 'English Studies'), ('eeal', 'eeal', 'English EAL/D'),
  ('mst1', 'mst1', 'Mathematics Standard 1'), ('mex2', 'mex2', 'Mathematics Extension 2'),
  ('ees', 'ees', 'Earth and Environmental Science'), ('sext', 'sext', 'Science Extension'),
  ('text', 'text', 'Textiles and Design'), ('ind', 'ind', 'Industrial Technology'), ('engr', 'engr', 'Engineering Studies'), ('ipt', 'ipt', 'Information Processes and Technology'),
  ('agr', 'agr', 'Agriculture'), ('cafs', 'cafs', 'Community and Family Studies'), ('slr', 'slr', 'Sport, Lifestyle and Recreation Studies'),
  ('mus2', 'mus2', 'Music 2'), ('musx', 'musx', 'Music Extension'), ('dan', 'dan', 'Dance'), ('pvd', 'pvd', 'Photography, Video and Digital Imaging'),
  ('hext', 'hext', 'History Extension'), ('abs', 'abs', 'Aboriginal Studies'),
  ('fre', 'lang', 'French Continuers'), ('jap', 'lang', 'Japanese Continuers'), ('chi', 'lang', 'Chinese Continuers'), ('ita', 'lang', 'Italian Continuers'), ('spa', 'lang', 'Spanish Continuers'), ('ger', 'lang', 'German Continuers')
),
m(grp, y, n, name) AS (VALUES
  ('ee1', 12, 1, 'Common Module: Literary Worlds'), ('ee1', 12, 2, 'Elective: Literary Homelands'), ('ee1', 12, 3, 'Elective: Worlds of Upheaval'), ('ee1', 12, 4, 'Elective: Reimagined Worlds'),
  ('ee2', 12, 1, 'Major Work: Proposal and Reading'), ('ee2', 12, 2, 'Major Work: Drafting'), ('ee2', 12, 3, 'Major Work: Refining'), ('ee2', 12, 4, 'Major Work: Reflection Statement'),
  ('ests', 11, 1, 'Achieving Through English'), ('ests', 11, 2, 'Texts and Society'), ('ests', 11, 3, 'Telling Stories'), ('ests', 11, 4, 'Skills portfolio'),
  ('ests', 12, 1, 'Common Module: Texts and Human Experiences'), ('ests', 12, 2, 'Module A: Language and Texts in Context'), ('ests', 12, 3, 'Module B: Close Study of Literature'), ('ests', 12, 4, 'Module C: Texts and Society'),
  ('eeal', 11, 1, 'Reading to Write: Transition to Senior English'), ('eeal', 11, 2, 'Close Study of Literature'), ('eeal', 11, 3, 'Craft of Writing'), ('eeal', 11, 4, 'Skills portfolio'),
  ('eeal', 12, 1, 'Common Module: Texts and Human Experiences'), ('eeal', 12, 2, 'Module A: Language, Identity and Culture'), ('eeal', 12, 3, 'Module B: Close Study of Literature'), ('eeal', 12, 4, 'Module C: The Craft of Writing'),
  ('mst1', 11, 1, 'Algebra and Number'), ('mst1', 11, 2, 'Measurement'), ('mst1', 11, 3, 'Financial Mathematics'), ('mst1', 11, 4, 'Statistics'),
  ('mst1', 12, 1, 'Applications of Measurement'), ('mst1', 12, 2, 'Further Statistics'), ('mst1', 12, 3, 'Networks and Planning'), ('mst1', 12, 4, 'Financial Applications and Review'),
  ('mex2', 12, 1, 'Proof'), ('mex2', 12, 2, 'Complex Numbers'), ('mex2', 12, 3, 'Vectors and Integration'), ('mex2', 12, 4, 'Mechanics'),
  ('ees', 11, 1, 'Earth Resources'), ('ees', 11, 2, 'Plate Tectonics'), ('ees', 11, 3, 'Energy Transformations'), ('ees', 11, 4, 'Human Impacts'),
  ('ees', 12, 1, 'Earth Processes'), ('ees', 12, 2, 'Hazards'), ('ees', 12, 3, 'Climate Science'), ('ees', 12, 4, 'Resource Sustainability'),
  ('sext', 12, 1, 'Scientific Research Foundations'), ('sext', 12, 2, 'Data and Methods'), ('sext', 12, 3, 'Research Project'), ('sext', 12, 4, 'Scientific Report and Communication'),
  ('text', 11, 1, 'Design'), ('text', 11, 2, 'Properties and Performance of Textiles'), ('text', 11, 3, 'Textile Projects'), ('text', 11, 4, 'Skills and review'),
  ('text', 12, 1, 'Design, Manufacture and Marketing'), ('text', 12, 2, 'Australian Fashion and Textile Industries'), ('text', 12, 3, 'Major Textiles Project'), ('text', 12, 4, 'Exam and portfolio review'),
  ('ind', 11, 1, 'Industry Study'), ('ind', 11, 2, 'Design'), ('ind', 11, 3, 'Management and Communication'), ('ind', 11, 4, 'Production'),
  ('ind', 12, 1, 'Industry Study'), ('ind', 12, 2, 'Major Project'), ('ind', 12, 3, 'Management and Communication'), ('ind', 12, 4, 'Design and Production'),
  ('engr', 11, 1, 'Engineering Fundamentals'), ('engr', 11, 2, 'Engineering Materials'), ('engr', 11, 3, 'Engineering Products'), ('engr', 11, 4, 'Engineering Reports'),
  ('engr', 12, 1, 'Engineering and Society'), ('engr', 12, 2, 'Engineering Applications'), ('engr', 12, 3, 'Engineering Electives'), ('engr', 12, 4, 'Engineering Report'),
  ('ipt', 11, 1, 'Introduction to Information Skills and Systems'), ('ipt', 11, 2, 'Tools for Information Processes'), ('ipt', 11, 3, 'Developing Information Systems'), ('ipt', 11, 4, 'Skills and review'),
  ('ipt', 12, 1, 'Project Management'), ('ipt', 12, 2, 'Information Systems and Databases'), ('ipt', 12, 3, 'Communication Systems'), ('ipt', 12, 4, 'Option: Transaction Processing or Decision Support'),
  ('agr', 11, 1, 'Overview of Australian Agriculture'), ('agr', 11, 2, 'Plant Production'), ('agr', 11, 3, 'Animal Production'), ('agr', 11, 4, 'Skills and review'),
  ('agr', 12, 1, 'Plant and Animal Production'), ('agr', 12, 2, 'Farm Case Study'), ('agr', 12, 3, 'Agri-food, Fibre and Fuel Technologies'), ('agr', 12, 4, 'Agricultural Research'),
  ('cafs', 11, 1, 'Resource Management'), ('cafs', 11, 2, 'Individuals and Groups'), ('cafs', 11, 3, 'Families and Communities'), ('cafs', 11, 4, 'Skills and review'),
  ('cafs', 12, 1, 'Parenting and Caring'), ('cafs', 12, 2, 'Groups in Context'), ('cafs', 12, 3, 'Research Methodology'), ('cafs', 12, 4, 'Option: Social Impact of Technology'),
  ('slr', 11, 1, 'Fundamentals of Movement'), ('slr', 11, 2, 'Games and Sports Applications'), ('slr', 11, 3, 'Health and Safety'), ('slr', 11, 4, 'Skills and review'),
  ('slr', 12, 1, 'Australian Sporting Identity'), ('slr', 12, 2, 'Sport and Physical Activity'), ('slr', 12, 3, 'Coaching and Administration'), ('slr', 12, 4, 'Event Management'),
  ('mus2', 11, 1, 'Performance'), ('mus2', 11, 2, 'Composition'), ('mus2', 11, 3, 'Musicology'), ('mus2', 11, 4, 'Aural Skills'),
  ('mus2', 12, 1, 'Core Performance'), ('mus2', 12, 2, 'Core Composition'), ('mus2', 12, 3, 'Core Musicology'), ('mus2', 12, 4, 'Additional Topics'),
  ('musx', 12, 1, 'Major Project Proposal'), ('musx', 12, 2, 'Performance or Composition Development'), ('musx', 12, 3, 'Musicology Project'), ('musx', 12, 4, 'Reflection and Presentation'),
  ('dan', 11, 1, 'Dance Performance'), ('dan', 11, 2, 'Dance Composition'), ('dan', 11, 3, 'Dance Appreciation'), ('dan', 11, 4, 'Skills and review'),
  ('dan', 12, 1, 'Core Performance'), ('dan', 12, 2, 'Core Composition'), ('dan', 12, 3, 'Core Appreciation'), ('dan', 12, 4, 'Major Study'),
  ('pvd', 11, 1, 'Image Making Foundations'), ('pvd', 11, 2, 'Photography and Digital Imaging'), ('pvd', 11, 3, 'Video and Moving Images'), ('pvd', 11, 4, 'Skills portfolio'),
  ('pvd', 12, 1, 'Body of Work'), ('pvd', 12, 2, 'Critical and Historical Studies'), ('pvd', 12, 3, 'Case Studies'), ('pvd', 12, 4, 'Exam and portfolio review'),
  ('hext', 12, 1, 'What is History'), ('hext', 12, 2, 'Historiography'), ('hext', 12, 3, 'History Project'), ('hext', 12, 4, 'Reflection and Presentation'),
  ('abs', 11, 1, 'Aboriginal Societies and Cultures'), ('abs', 11, 2, 'Aboriginal Heritage and Identity'), ('abs', 11, 3, 'Land, Rights and Responsibilities'), ('abs', 11, 4, 'Skills and review'),
  ('abs', 12, 1, 'Research Methodology'), ('abs', 12, 2, 'Social Justice and Human Rights'), ('abs', 12, 3, 'Aboriginal Health and Wellbeing'), ('abs', 12, 4, 'Contemporary Issues'),
  ('lang', 11, 1, 'The Individual: Personal Identity'), ('lang', 11, 2, 'The Language Community'), ('lang', 11, 3, 'Travel and Tourism'), ('lang', 11, 4, 'Skills portfolio'),
  ('lang', 12, 1, 'Personal Identity and Relationships'), ('lang', 12, 2, 'Education and Work'), ('lang', 12, 3, 'Leisure and Cultural Life'), ('lang', 12, 4, 'Language and Culture in Texts')
),
ph(i, label) AS (VALUES
  (1, 'Introduction and key ideas'), (2, 'Core concepts'), (3, 'Core concepts in depth'), (4, 'Skills and techniques'), (5, 'Case study or practical'),
  (6, 'Applying knowledge'), (7, 'Extended practice'), (8, 'Assessment preparation'), (9, 'Assessment task'), (10, 'Feedback and revision')
),
r(ln, role) AS (VALUES (1, 'Learn'), (2, 'Apply and practise')),
x AS (
  SELECT
    c.code AS code, c.area AS area, m.y AS y, m.n AS n, m.name AS name,
    ((m.n - 1) * 10 + ph.i) AS wk, ph.i AS uw, ph.label AS label, r.ln AS ln, r.role AS role,
    's6-' || c.code || '-y' || m.y || '-w' || printf('%02d', (m.n - 1) * 10 + ph.i) || '-l' || r.ln AS k
  FROM c
  JOIN m ON m.grp = c.grp
  CROSS JOIN ph
  CROSS JOIN r
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-' || k, NULL, k,
  'Year ' || y || ', Week ' || wk || ', Lesson ' || ln || ': ' || name || ' - ' || label || ' (' || role || ')',
  'S6', area, NULL, 'approved',
  json_object(
    'year_level', 'Year ' || y,
    'subject', area,
    'unit_title', name,
    'unit_number', n,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', role,
    'learning_intention', role || ' lesson in the module ' || name || ' (' || area || '). Focus: ' || label || '. Students learn through explicit teaching, worked examples and a short independent task.'
      || CASE WHEN uw >= 9 THEN ' This is the assessment and revision stage of the module.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note', 'Coming soon. This is a planned lesson card. Outcome codes are not assigned yet: check the module name and map this lesson to the current NESA Stage 6 ' || area || ' syllabus before it is built.'
  ),
  '2026-10-11T09:50:00Z', '2026-10-11T09:50:00Z'
FROM x;
