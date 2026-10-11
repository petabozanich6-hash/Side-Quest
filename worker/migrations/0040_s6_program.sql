-- Stage 6 (Years 11-12) two-year program: 3,840 coming-soon placeholder lessons across 24 courses.
-- Each course has 8 modules (4 in Year 11, 4 in Year 12), 10 weeks per module, 2 lessons a week = 160 lessons per course.
-- Module names are planned placeholders: check them against the current NESA syllabus for each course before building.
-- learning_area is the course name. Placeholders are shared lessons (family_id NULL) flagged coming_soon.
-- Safe to re-run (INSERT OR IGNORE). Build a lesson by replacing its row's data and removing coming_soon.
WITH c(code, area) AS (VALUES
  ('engs', 'English Standard'), ('enga', 'English Advanced'),
  ('mst2', 'Mathematics Standard 2'), ('mada', 'Mathematics Advanced'), ('mex1', 'Mathematics Extension 1'),
  ('bio', 'Biology'), ('chem', 'Chemistry'), ('phys', 'Physics'), ('invs', 'Investigating Science'),
  ('mhis', 'Modern History'), ('ahis', 'Ancient History'), ('geo', 'Geography'),
  ('bus', 'Business Studies'), ('eco', 'Economics'), ('leg', 'Legal Studies'),
  ('pdh', 'PDHPE'), ('va', 'Visual Arts'), ('mus', 'Music 1'), ('dra', 'Drama'),
  ('sofe', 'Software Engineering'), ('dt', 'Design and Technology'), ('food', 'Food Technology'),
  ('sor', 'Studies of Religion I'), ('sc', 'Society and Culture')
),
m(code, y, n, name) AS (VALUES
  ('engs', 11, 1, 'Reading to Write: Transition to Senior English'), ('engs', 11, 2, 'Close Study of Literature'), ('engs', 11, 3, 'Craft of Writing'), ('engs', 11, 4, 'Skills portfolio and review'),
  ('engs', 12, 1, 'Common Module: Texts and Human Experiences'), ('engs', 12, 2, 'Module A: Language, Identity and Culture'), ('engs', 12, 3, 'Module B: Close Study of Literature'), ('engs', 12, 4, 'Module C: The Craft of Writing'),
  ('enga', 11, 1, 'Reading to Write: Transition to Senior English'), ('enga', 11, 2, 'Critical Study of Literature'), ('enga', 11, 3, 'Craft of Writing'), ('enga', 11, 4, 'Skills portfolio and review'),
  ('enga', 12, 1, 'Common Module: Texts and Human Experiences'), ('enga', 12, 2, 'Module A: Textual Conversations'), ('enga', 12, 3, 'Module B: Critical Study of Literature'), ('enga', 12, 4, 'Module C: The Craft of Writing'),
  ('mst2', 11, 1, 'Algebra and Equations'), ('mst2', 11, 2, 'Measurement'), ('mst2', 11, 3, 'Financial Mathematics'), ('mst2', 11, 4, 'Statistical Analysis'),
  ('mst2', 12, 1, 'Algebraic Modelling'), ('mst2', 12, 2, 'Statistical Analysis and Data'), ('mst2', 12, 3, 'Networks and Queuing'), ('mst2', 12, 4, 'Probability and Non-linear Relationships'),
  ('mada', 11, 1, 'Functions'), ('mada', 11, 2, 'Trigonometric Functions'), ('mada', 11, 3, 'Calculus'), ('mada', 11, 4, 'Exponential and Logarithmic Functions'),
  ('mada', 12, 1, 'Trigonometric Functions and Graphs'), ('mada', 12, 2, 'Differential Calculus'), ('mada', 12, 3, 'Integral Calculus'), ('mada', 12, 4, 'Series and Statistical Analysis'),
  ('mex1', 11, 1, 'Further Work with Functions'), ('mex1', 11, 2, 'Trigonometric Functions'), ('mex1', 11, 3, 'Calculus'), ('mex1', 11, 4, 'Combinatorics'),
  ('mex1', 12, 1, 'Proof by Mathematical Induction'), ('mex1', 12, 2, 'Vectors'), ('mex1', 12, 3, 'Trigonometric Equations and Inverse Functions'), ('mex1', 12, 4, 'Applications of Calculus and Statistics'),
  ('bio', 11, 1, 'Cells as the Basis of Life'), ('bio', 11, 2, 'Organisation of Living Things'), ('bio', 11, 3, 'Biological Diversity'), ('bio', 11, 4, 'Ecosystem Dynamics'),
  ('bio', 12, 1, 'Heredity'), ('bio', 12, 2, 'Genetic Change'), ('bio', 12, 3, 'Infectious Disease'), ('bio', 12, 4, 'Non-infectious Disease and Disorders'),
  ('chem', 11, 1, 'Properties and Structure of Matter'), ('chem', 11, 2, 'Introduction to Quantitative Chemistry'), ('chem', 11, 3, 'Reactive Chemistry'), ('chem', 11, 4, 'Drivers of Reactions'),
  ('chem', 12, 1, 'Equilibrium and Acid Reactions'), ('chem', 12, 2, 'Acid and Base Reactions'), ('chem', 12, 3, 'Organic Chemistry'), ('chem', 12, 4, 'Applying Chemical Ideas'),
  ('phys', 11, 1, 'Kinematics'), ('phys', 11, 2, 'Dynamics'), ('phys', 11, 3, 'Waves and Thermodynamics'), ('phys', 11, 4, 'Electricity and Magnetism'),
  ('phys', 12, 1, 'Advanced Mechanics'), ('phys', 12, 2, 'Electromagnetism'), ('phys', 12, 3, 'The Nature of Light'), ('phys', 12, 4, 'From the Universe to the Atom'),
  ('invs', 11, 1, 'Cause and Effect: Observing'), ('invs', 11, 2, 'Cause and Effect: Inferences and Generalisations'), ('invs', 11, 3, 'Scientific Models'), ('invs', 11, 4, 'Theories and Laws'),
  ('invs', 12, 1, 'Scientific Investigations'), ('invs', 12, 2, 'Technologies'), ('invs', 12, 3, 'Fact or Fallacy'), ('invs', 12, 4, 'Science and Society'),
  ('mhis', 11, 1, 'Investigating Modern History'), ('mhis', 11, 2, 'Historical Investigation'), ('mhis', 11, 3, 'Case Studies in Modern History'), ('mhis', 11, 4, 'Skills and review'),
  ('mhis', 12, 1, 'Core Study: Power and Authority in the Modern World'), ('mhis', 12, 2, 'National Studies'), ('mhis', 12, 3, 'Peace and Conflict'), ('mhis', 12, 4, 'Change in the Modern World'),
  ('ahis', 11, 1, 'Investigating Ancient History'), ('ahis', 11, 2, 'Features of Ancient Societies'), ('ahis', 11, 3, 'Historical Investigation'), ('ahis', 11, 4, 'Skills and review'),
  ('ahis', 12, 1, 'Core Study: Cities of Vesuvius'), ('ahis', 12, 2, 'Ancient Societies'), ('ahis', 12, 3, 'Personalities in Their Times'), ('ahis', 12, 4, 'Historical Periods'),
  ('geo', 11, 1, 'Earth Natural Systems'), ('geo', 11, 2, 'Human Systems and Geographical Processes'), ('geo', 11, 3, 'Global Challenges'), ('geo', 11, 4, 'Geographical Skills and Fieldwork'),
  ('geo', 12, 1, 'Ecosystems at Risk'), ('geo', 12, 2, 'Urban Places'), ('geo', 12, 3, 'People and Economic Activity'), ('geo', 12, 4, 'Geographical Investigation'),
  ('bus', 11, 1, 'Nature of Business'), ('bus', 11, 2, 'Business Management'), ('bus', 11, 3, 'Business Planning'), ('bus', 11, 4, 'Skills and review'),
  ('bus', 12, 1, 'Operations'), ('bus', 12, 2, 'Marketing'), ('bus', 12, 3, 'Finance'), ('bus', 12, 4, 'Human Resources'),
  ('eco', 11, 1, 'Introduction to Economics'), ('eco', 11, 2, 'Consumers and Business'), ('eco', 11, 3, 'Markets'), ('eco', 11, 4, 'Labour Markets'),
  ('eco', 12, 1, 'Australia in the Global Economy'), ('eco', 12, 2, 'Economic Issues'), ('eco', 12, 3, 'Economic Policies and Management'), ('eco', 12, 4, 'Economic Reasoning and Review'),
  ('leg', 11, 1, 'The Legal System'), ('leg', 11, 2, 'The Individual and the Law'), ('leg', 11, 3, 'The Law in Practice'), ('leg', 11, 4, 'Skills and review'),
  ('leg', 12, 1, 'Crime'), ('leg', 12, 2, 'Human Rights'), ('leg', 12, 3, 'Option 1: Consumers'), ('leg', 12, 4, 'Option 2: Workplace'),
  ('pdh', 11, 1, 'Better Health for Individuals'), ('pdh', 11, 2, 'The Body in Motion'), ('pdh', 11, 3, 'Option: First Aid'), ('pdh', 11, 4, 'Option: Fitness Choices'),
  ('pdh', 12, 1, 'Health Priorities in Australia'), ('pdh', 12, 2, 'Factors Affecting Performance'), ('pdh', 12, 3, 'Option: Sports Medicine'), ('pdh', 12, 4, 'Option: Improving Performance'),
  ('va', 11, 1, 'Art Practice and the Conceptual Framework'), ('va', 11, 2, 'Artmaking Skills and Materials'), ('va', 11, 3, 'Art Criticism and Art History'), ('va', 11, 4, 'Developing Ideas'),
  ('va', 12, 1, 'Body of Work'), ('va', 12, 2, 'Case Studies'), ('va', 12, 3, 'Frames and the Conceptual Framework'), ('va', 12, 4, 'Exam and portfolio review'),
  ('mus', 11, 1, 'Music Skills'), ('mus', 11, 2, 'Performance'), ('mus', 11, 3, 'Composition'), ('mus', 11, 4, 'Musicology and Aural'),
  ('mus', 12, 1, 'Core Performance'), ('mus', 12, 2, 'Core Composition'), ('mus', 12, 3, 'Core Musicology'), ('mus', 12, 4, 'Additional Topics'),
  ('dra', 11, 1, 'Improvisation, Playbuilding and Acting'), ('dra', 11, 2, 'Elements of Production in Performance'), ('dra', 11, 3, 'Theatrical Traditions and Performance Styles'), ('dra', 11, 4, 'Skills portfolio'),
  ('dra', 12, 1, 'Australian Drama and Theatre'), ('dra', 12, 2, 'Studies in Drama and Theatre'), ('dra', 12, 3, 'Group Performance'), ('dra', 12, 4, 'Individual Project'),
  ('sofe', 11, 1, 'Programming Fundamentals'), ('sofe', 11, 2, 'The Object-Oriented Paradigm'), ('sofe', 11, 3, 'Programming Mechatronics'), ('sofe', 11, 4, 'Secure Software Foundations'),
  ('sofe', 12, 1, 'Secure Software Architecture'), ('sofe', 12, 2, 'Programming for the Web'), ('sofe', 12, 3, 'Software Automation'), ('sofe', 12, 4, 'Software Engineering Project'),
  ('dt', 11, 1, 'Designers and Design Thinking'), ('dt', 11, 2, 'Design Processes'), ('dt', 11, 3, 'Design and Production Projects'), ('dt', 11, 4, 'Skills and review'),
  ('dt', 12, 1, 'Innovation and Emerging Technologies'), ('dt', 12, 2, 'Major Design Project'), ('dt', 12, 3, 'Project Management and Evaluation'), ('dt', 12, 4, 'Exam and portfolio review'),
  ('food', 11, 1, 'Food Availability and Selection'), ('food', 11, 2, 'Food Quality'), ('food', 11, 3, 'Nutrition'), ('food', 11, 4, 'Skills and review'),
  ('food', 12, 1, 'The Australian Food Industry'), ('food', 12, 2, 'Food Manufacture'), ('food', 12, 3, 'Food Product Development'), ('food', 12, 4, 'Contemporary Nutrition Issues'),
  ('sor', 11, 1, 'Nature of Religion and Beliefs'), ('sor', 11, 2, 'Religious Tradition 1'), ('sor', 11, 3, 'Religious Tradition 2'), ('sor', 11, 4, 'Skills and review'),
  ('sor', 12, 1, 'Religion and Belief Systems in Australia'), ('sor', 12, 2, 'Religious Tradition Depth Studies'), ('sor', 12, 3, 'Religion and Peace'), ('sor', 12, 4, 'Religion and Non-Religion'),
  ('sc', 11, 1, 'The Social and Cultural World'), ('sc', 11, 2, 'Personal and Social Identity'), ('sc', 11, 3, 'Intercultural Communication'), ('sc', 11, 4, 'Skills and review'),
  ('sc', 12, 1, 'Social and Cultural Continuity and Change'), ('sc', 12, 2, 'Personal Interest Project'), ('sc', 12, 3, 'Depth Studies'), ('sc', 12, 4, 'Review and exam preparation')
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
  JOIN m ON m.code = c.code
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
  '2026-10-11T09:40:00Z', '2026-10-11T09:40:00Z'
FROM x;
