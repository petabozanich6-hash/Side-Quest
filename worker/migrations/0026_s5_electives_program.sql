-- Stage 5 elective programs (Years 9-10): coming-soon placeholder lessons.
-- 23 electives x 8 units x 20 lessons = 3,680 cards. Each unit is 10 weeks, 2 lessons a week.
-- Units 1-4 are Year 9, units 5-8 are Year 10. learning_area equals the card name used on the Lessons page.

-- 1. Refile Stage 4 Creative Arts placeholders onto the cards the Lessons page actually has.
UPDATE lessons SET learning_area = json_extract(data, '$.subject')
WHERE seed_key LIKE 's4-arts-%' AND json_extract(data, '$.subject') IN ('Visual Arts', 'Music', 'Drama', 'Dance');
DELETE FROM lessons WHERE seed_key LIKE 's4-arts-%' AND json_extract(data, '$.subject') = 'Creative Arts Showcase';

-- 2. Stage 5 electives.
WITH u(sub, n, unit) AS (VALUES
('Aboriginal Studies',1,'Aboriginal identity, Country and connection'),('Aboriginal Studies',2,'Aboriginal heritage and cultures'),('Aboriginal Studies',3,'Aboriginal Peoples and the land'),('Aboriginal Studies',4,'Aboriginal communities and local studies'),('Aboriginal Studies',5,'Invasion, colonisation and resistance'),('Aboriginal Studies',6,'Rights, law and justice'),('Aboriginal Studies',7,'Contemporary issues and activism'),('Aboriginal Studies',8,'Research project'),
('Commerce',1,'Consumer choices'),('Commerce',2,'Personal finance and budgeting'),('Commerce',3,'Investing and managing money'),('Commerce',4,'Employment and work futures'),('Commerce',5,'Law, society and political involvement'),('Commerce',6,'Business and enterprise'),('Commerce',7,'Promoting and selling'),('Commerce',8,'Commerce investigation project'),
('Work Education',1,'Work in society'),('Work Education',2,'Career planning'),('Work Education',3,'Work health and safety'),('Work Education',4,'Employability skills'),('Work Education',5,'Teamwork and communication'),('Work Education',6,'Resumes and interviews'),('Work Education',7,'Work experience and placement'),('Work Education',8,'Work portfolio'),
('Dance',1,'Dance elements and technique'),('Dance',2,'Safe dance practice'),('Dance',3,'Dance composition'),('Dance',4,'Dance appreciation'),('Dance',5,'Choreography'),('Dance',6,'Dance performance'),('Dance',7,'Dance in context'),('Dance',8,'Major dance work'),
('Drama',1,'Improvisation and acting skills'),('Drama',2,'Playbuilding'),('Drama',3,'Theatre styles and forms'),('Drama',4,'Scripted performance'),('Drama',5,'Physical and visual theatre'),('Drama',6,'Directing and design'),('Drama',7,'Theatre history and context'),('Drama',8,'Group performance project'),
('Music',1,'Aural skills and listening'),('Music',2,'Notation and theory'),('Music',3,'Performance skills'),('Music',4,'Composition'),('Music',5,'Music technology'),('Music',6,'Popular and contemporary music'),('Music',7,'Australian music'),('Music',8,'Music portfolio'),
('Photographic and Digital Media',1,'Photographic practice'),('Photographic and Digital Media',2,'Light and composition'),('Photographic and Digital Media',3,'Digital editing'),('Photographic and Digital Media',4,'Video and moving image'),('Photographic and Digital Media',5,'Documentary and narrative'),('Photographic and Digital Media',6,'Critical and historical study'),('Photographic and Digital Media',7,'Digital media production'),('Photographic and Digital Media',8,'Body of work'),
('Visual Arts',1,'Drawing'),('Visual Arts',2,'Painting'),('Visual Arts',3,'Printmaking'),('Visual Arts',4,'Art criticism and critical study'),('Visual Arts',5,'Sculpture and three-dimensional work'),('Visual Arts',6,'Mixed media and collage'),('Visual Arts',7,'Art history and contexts'),('Visual Arts',8,'Body of work and diary'),
('Visual Design',1,'The design process'),('Visual Design',2,'Graphic design'),('Visual Design',3,'Typography and layout'),('Visual Design',4,'Illustration'),('Visual Design',5,'Product and packaging design'),('Visual Design',6,'Digital design tools'),('Visual Design',7,'Design contexts and critical study'),('Visual Design',8,'Design portfolio'),
('Child Studies',1,'Preparing for parenthood'),('Child Studies',2,'Conception and pregnancy'),('Child Studies',3,'Birth and the newborn'),('Child Studies',4,'Child growth and development'),('Child Studies',5,'Play and learning'),('Child Studies',6,'Nutrition and health in childhood'),('Child Studies',7,'Child safety and wellbeing'),('Child Studies',8,'Family, community and culture'),
('Physical Activity and Sports Studies',1,'Body systems and movement'),('Physical Activity and Sports Studies',2,'Fitness and training'),('Physical Activity and Sports Studies',3,'Coaching and officiating'),('Physical Activity and Sports Studies',4,'Nutrition and performance'),('Physical Activity and Sports Studies',5,'Sport psychology'),('Physical Activity and Sports Studies',6,'Injury prevention and first aid'),('Physical Activity and Sports Studies',7,'Sport, technology and society'),('Physical Activity and Sports Studies',8,'Sport and physical activity project'),
('Modern Languages',1,'Introducing myself and greetings'),('Modern Languages',2,'Family and friends'),('Modern Languages',3,'School and daily life'),('Modern Languages',4,'Food, shopping and money'),('Modern Languages',5,'Travel and places'),('Modern Languages',6,'Leisure, sport and interests'),('Modern Languages',7,'Culture and communities'),('Modern Languages',8,'Communication project'),
('Classical Languages',1,'Alphabet, sounds and basics'),('Classical Languages',2,'Nouns and cases'),('Classical Languages',3,'Verbs and tenses'),('Classical Languages',4,'Reading simple texts'),('Classical Languages',5,'Mythology and stories'),('Classical Languages',6,'Daily life in the ancient world'),('Classical Languages',7,'Literature and translation'),('Classical Languages',8,'Translation project'),
('Aboriginal Languages',1,'Language and Country'),('Aboriginal Languages',2,'Sounds and greetings'),('Aboriginal Languages',3,'Family and kinship'),('Aboriginal Languages',4,'Everyday words and sentences'),('Aboriginal Languages',5,'Stories and songs'),('Aboriginal Languages',6,'Place names and land'),('Aboriginal Languages',7,'Language revival and community'),('Aboriginal Languages',8,'Community language project'),
('Auslan',1,'Fingerspelling and numbers'),('Auslan',2,'Greetings and introductions'),('Auslan',3,'Family and home'),('Auslan',4,'Daily routines'),('Auslan',5,'Deaf culture and community'),('Auslan',6,'Conversation skills'),('Auslan',7,'Storytelling and description'),('Auslan',8,'Auslan project'),
('Agricultural Technology',1,'Plant production'),('Agricultural Technology',2,'Animal production'),('Agricultural Technology',3,'Soils and water'),('Agricultural Technology',4,'Farm management'),('Agricultural Technology',5,'Sustainability in agriculture'),('Agricultural Technology',6,'Technology in farming'),('Agricultural Technology',7,'Marketing farm products'),('Agricultural Technology',8,'Agricultural enterprise project'),
('Design and Technology',1,'The design process'),('Design and Technology',2,'Materials and tools'),('Design and Technology',3,'Sustainable design'),('Design and Technology',4,'Innovation and creativity'),('Design and Technology',5,'Project management'),('Design and Technology',6,'Prototyping and making'),('Design and Technology',7,'Evaluating designs'),('Design and Technology',8,'Major design project'),
('Food Technology',1,'Food safety and hygiene'),('Food Technology',2,'Nutrition and health'),('Food Technology',3,'Food preparation and cooking'),('Food Technology',4,'Food product development'),('Food Technology',5,'Food trends and the food industry'),('Food Technology',6,'Australian food and culture'),('Food Technology',7,'Food and society'),('Food Technology',8,'Food project'),
('Graphics Technology',1,'Sketching and freehand drawing'),('Graphics Technology',2,'Technical drawing'),('Graphics Technology',3,'3D modelling and CAD'),('Graphics Technology',4,'Orthogonal and sectional drawing'),('Graphics Technology',5,'Pictorial and perspective drawing'),('Graphics Technology',6,'Rendering and presentation'),('Graphics Technology',7,'Architectural and engineering drawing'),('Graphics Technology',8,'Graphics folio'),
('Industrial Technology',1,'Workshop safety and skills'),('Industrial Technology',2,'Timber technologies'),('Industrial Technology',3,'Metal technologies'),('Industrial Technology',4,'Engineering and mechanical systems'),('Industrial Technology',5,'Electronics'),('Industrial Technology',6,'Construction and joining'),('Industrial Technology',7,'Project management'),('Industrial Technology',8,'Major project'),
('Information and Software Technology',1,'Digital basics and data'),('Information and Software Technology',2,'Programming'),('Information and Software Technology',3,'Web design'),('Information and Software Technology',4,'Databases'),('Information and Software Technology',5,'Networks and communication'),('Information and Software Technology',6,'Cybersecurity and ethics'),('Information and Software Technology',7,'Software design and development'),('Information and Software Technology',8,'Software project'),
('Marine and Aquaculture Technology',1,'Marine environments'),('Marine and Aquaculture Technology',2,'Fish and marine biology'),('Marine and Aquaculture Technology',3,'Aquaculture systems'),('Marine and Aquaculture Technology',4,'Water quality'),('Marine and Aquaculture Technology',5,'Boating and water safety'),('Marine and Aquaculture Technology',6,'Sustainability and conservation'),('Marine and Aquaculture Technology',7,'Seafood and marketing'),('Marine and Aquaculture Technology',8,'Marine project'),
('Textiles Technology',1,'Fibres and fabrics'),('Textiles Technology',2,'Sewing skills'),('Textiles Technology',3,'Pattern making'),('Textiles Technology',4,'Textile design and decoration'),('Textiles Technology',5,'Fashion and culture'),('Textiles Technology',6,'Sustainable textiles'),('Textiles Technology',7,'Textile project'),('Textiles Technology',8,'Textiles folio')
),
k(k) AS (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10)),
l(n) AS (VALUES (1),(2)),
x AS (
  SELECT u.sub AS sub, u.n AS un, u.unit AS unit, k.k AS uw,
    CASE WHEN u.n <= 4 THEN 9 ELSE 10 END AS y,
    ((u.n - 1) % 4) * 10 + k.k AS wk,
    l.n AS ln,
    replace(replace(lower(u.sub), ' ', '-'), 'and-', '') AS slug
  FROM u CROSS JOIN k CROSS JOIN l
)
INSERT OR IGNORE INTO lessons (id, family_id, seed_key, title, stage, learning_area, unit_id, status, data, created_at, updated_at)
SELECT
  'seed-s5-' || slug || '-y' || y || '-w' || printf('%02d', wk) || '-l' || ln,
  NULL,
  's5-' || slug || '-y' || y || '-w' || printf('%02d', wk) || '-l' || ln,
  'Year ' || y || ', Week ' || wk || ', Lesson ' || ln || ': ' || unit,
  'S5', sub, NULL, 'approved',
  json_object(
    'year_level', 'Year ' || y,
    'subject', sub,
    'unit_title', unit,
    'unit_number', un,
    'week', wk,
    'week_in_unit', uw,
    'lesson_number', ln,
    'lesson_role', CASE ln WHEN 1 THEN 'Learn' ELSE 'Apply' END,
    'learning_intention',
      CASE ln
        WHEN 1 THEN 'Learn lesson in the unit ' || unit || ' (' || sub || '). Students build knowledge and skills through explicit teaching, examples and discussion.'
        ELSE 'Apply lesson in the unit ' || unit || ' (' || sub || '). Students practise, make, perform or investigate, then reflect on their work.'
      END || CASE WHEN uw = 10 THEN ' This is the consolidation and assessment week for the unit.' ELSE '' END,
    'outcome_codes', json('[]'),
    'coming_soon', json('true'),
    'source_note',
      'Coming soon. This is a planned lesson card with a generic unit outline. Outcome codes are not assigned yet: map this lesson to the current NESA Stage 5 syllabus for ' || sub || ' before it is built, and replace the generic outline with the syllabus content and focus areas.'
      || CASE
           WHEN sub IN ('Aboriginal Studies', 'Aboriginal Languages')
             THEN ' Aboriginal content and language must be checked with the relevant Aboriginal community or authorised sources before use.'
           WHEN sub IN ('Food Technology', 'Industrial Technology', 'Textiles Technology', 'Agricultural Technology', 'Marine and Aquaculture Technology', 'Design and Technology', 'Graphics Technology')
             THEN ' Complete a safety and risk assessment before any practical work.'
           ELSE ''
         END
  ),
  '2026-10-11T14:00:00Z', '2026-10-11T14:00:00Z'
FROM x;
