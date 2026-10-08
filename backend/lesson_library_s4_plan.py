"""Stage 4 placeholder lessons: 15 subjects x 50 weeks (1,800 lessons), replacing the old repeating placeholders.

Core subjects (English, Mathematics): 5 lessons a week (four of 60 minutes, one of 45), 250 lessons each.
Other subjects: 2 lessons a week of 45 minutes, 100 lessons each.
Even-numbered weeks of English and Mathematics end with a fortnightly mini exam in lesson 5 (assumption carried over).

Each unit has an ordered list of distinct lesson topics in TOPICS (keyed by subject and unit title). They are filled
in lesson by lesson, skipping the mini-exam slots. If a unit has no list yet, or the list runs short, the generator
uses a numbered fallback title so nothing repeats and the import never fails. UNPLANNED lists those units.

Seed keys keep the old format s4-<prefix>-wNN-lN, so a finished lesson module registered earlier in
lesson_library.py LESSON_MODULES replaces its placeholder. The 50-week pace is a catch-up scaffold, not the
two-year NESA Stage 4 span. Unit sequencing and outcome mapping are DRAFTS to check against NSW syllabuses.
Aboriginal Languages has no outcome codes on purpose (not yet verified). Drama DR4-PER-01 is inferred.
"""
WM = "MAO-WM-01"
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}
_WS = ["SC4-WS-0%d" % i for i in range(1, 9)]

OUTCOMES = {
    "MA4-INT-C-01": "Integers", "MA4-FRC-C-01": "Fractions, decimals and percentages", "MA4-RAT-C-01": "Ratios and rates",
    "MA4-ALG-C-01": "Algebraic techniques", "MA4-IND-C-01": "Indices", "MA4-EQU-C-01": "Equations",
    "MA4-LIN-C-01": "Linear relationships", "MA4-LEN-C-01": "Length and perimeter", "MA4-PYT-C-01": "Pythagoras' theorem",
    "MA4-ARE-C-01": "Area", "MA4-VOL-C-01": "Volume", "MA4-ANG-C-01": "Angle relationships",
    "MA4-GEO-C-01": "Geometrical figures", "MA4-DAT-C-01": "Data: collecting and representing",
    "MA4-DAT-C-02": "Data: interpreting and analysing", "MA4-PRO-C-01": "Probability",
    "MAO-WM-01": "Working mathematically (applies across all content)",
    "EN4-RVL-01": "Reading, viewing and listening to texts", "EN4-URA-01": "Understanding and responding to texts (A)",
    "EN4-URB-01": "Understanding and responding to texts (B)", "EN4-URC-01": "Understanding and responding to texts (C)",
    "EN4-ECA-01": "Expressing and composing texts (A)", "EN4-ECB-01": "Expressing and composing texts (B)",
    "SC4-WS-01": "Working scientifically 1", "SC4-WS-02": "Working scientifically 2", "SC4-WS-03": "Working scientifically 3",
    "SC4-WS-04": "Working scientifically 4", "SC4-WS-05": "Working scientifically 5", "SC4-WS-06": "Working scientifically 6",
    "SC4-WS-07": "Working scientifically 7", "SC4-WS-08": "Working scientifically 8",
    "SC4-OTU-01": "Observing the Universe", "SC4-FOR-01": "Forces", "SC4-CLS-01": "Cells and classification",
    "SC4-SOL-01": "Solutions and mixtures", "SC4-LIV-01": "Living systems", "SC4-PRT-01": "Periodic table and atomic structure",
    "SC4-CHG-01": "Change", "SC4-DA1-01": "Data science",
    "HI4-CON-01": "Continuity and change", "HI4-SPE-01": "Features of past societies, periods and events",
    "HI4-CPP-01": "Contexts and perspectives of the past", "HI4-IEP-01": "Ideas and events that shaped the past",
    "HI4-APP-01": "Aboriginal Peoples' experiences of colonisation", "HI4-SOU-01": "Using evidence from sources",
    "HI4-INQ-01": "Historical inquiry", "HI4-COM-01": "Communicating historical ideas",
    "GE4-DFC-01": "Features and characteristics of places", "GE4-PRI-01": "Processes and interactions",
    "GE4-PER-01": "Perspectives on geographical issues", "GE4-MAN-01": "Management and protection of places",
    "GE4-APC-01": "Aboriginal Peoples' Custodianship of Country", "GE4-TAP-01": "Geographical tools",
    "GE4-COM-01": "Communicating geographical information",
    "PH4-MSS-01": "Movement skills and concepts", "PH4-MSS-02": "Strategies for movement challenges",
    "PH4-SHP-01": "Safety, health and lifelong physical activity", "PH4-SMI-01": "Self-management and interpersonal skills",
    "PH4-SHW-01": "Safety, health and wellbeing", "PH4-IPS-01": "Health information, products and services",
    "PH4-RRL-01": "Safe and respectful relationships", "PH4-IBC-01": "Identity and belonging",
    "TE4-SDP-01": "Sustainability, design and production", "TE4-PDP-01": "Practices of designers and producers",
    "TE4-MSC-01": "Materials, systems and components", "TE4-PPM-01": "Planning, management and production",
    "TE4-DES-01": "Design ideas and solutions", "TE4-SAF-01": "Safe use of tools and technologies",
    "TE4-DIG-01": "Digital literacy and safety", "TE4-DIG-02": "Data and digital systems",
    "VA4-AMC-01": "Artmaking: Artworld concepts", "VA4-AMV-01": "Artmaking: Viewpoints", "VA4-AMP-01": "Artmaking: Practice",
    "VA4-CHC-01": "Critical and historical: concepts", "VA4-CHV-01": "Critical and historical: Viewpoints",
    "VA4-CHP-01": "Critical and historical: Practice",
    "MU4-PER-01": "Music performance", "MU4-LIS-01": "Music listening", "MU4-COM-01": "Music composition",
    "DR4-MAK-01": "Drama making", "DR4-PER-01": "Drama performing", "DR4-APP-01": "Drama appreciating",
    "DA4-PER-01": "Dance performing", "DA4-COM-01": "Dance composing", "DA4-APP-01": "Dance appreciating",
    "ML4-INT-01": "Modern Languages: interacting", "ML4-UND-01": "Modern Languages: understanding",
    "ML4-CRT-01": "Modern Languages: creating", "CL4-UND-01": "Classical Languages: understanding",
    "CL4-UND-02": "Classical Languages: translating", "CL4-ICU-01": "Classical Languages: language, culture, identity",
    "AU4-INT-01": "Auslan: interacting", "AU4-UND-01": "Auslan: understanding", "AU4-CRE-01": "Auslan: creating",
    "AU4-RLC-01": "Auslan: language, culture and identity",
}

CODES_TO_VERIFY = {"drama": "DR4-PER-01 is inferred from the naming pattern", "aboriginal_languages": "Stage 4 codes not read"}

_M = ["MA4-INT-C-01", "MA4-FRC-C-01", "MA4-RAT-C-01", "MA4-ALG-C-01", "MA4-IND-C-01", "MA4-EQU-C-01", "MA4-LIN-C-01", "MA4-LEN-C-01", "MA4-PYT-C-01", "MA4-ARE-C-01", "MA4-VOL-C-01", "MA4-ANG-C-01", "MA4-GEO-C-01", "MA4-DAT-C-01", "MA4-DAT-C-02", "MA4-PRO-C-01"]
_E = ["EN4-RVL-01", "EN4-URA-01", "EN4-URB-01", "EN4-URC-01", "EN4-ECA-01", "EN4-ECB-01"]
_SC = ["SC4-OTU-01", "SC4-FOR-01", "SC4-CLS-01", "SC4-SOL-01", "SC4-LIV-01", "SC4-PRT-01", "SC4-CHG-01", "SC4-DA1-01"]
_HI = ["HI4-CON-01", "HI4-SPE-01", "HI4-CPP-01", "HI4-IEP-01", "HI4-APP-01", "HI4-SOU-01", "HI4-INQ-01", "HI4-COM-01"]
_ML = ["ML4-INT-01", "ML4-UND-01", "ML4-CRT-01"]

# skey: (learning_area, prefix, source, lessons_per_week, units[(first_week, last_week, title, codes)])
SUBJECTS = {
    "maths": ("Mathematics", "maths", "NSW Mathematics K-10 Syllabus (2022)", 5, [
        (1, 3, "Integers", ["MA4-INT-C-01"]), (4, 9, "Fractions, decimals and percentages", ["MA4-FRC-C-01"]),
        (10, 11, "Indices", ["MA4-IND-C-01"]), (12, 14, "Ratios and rates", ["MA4-RAT-C-01"]),
        (15, 19, "Algebraic techniques", ["MA4-ALG-C-01"]), (20, 22, "Equations", ["MA4-EQU-C-01"]),
        (23, 26, "Linear relationships", ["MA4-LIN-C-01"]), (27, 29, "Angle relationships", ["MA4-ANG-C-01"]),
        (30, 32, "Geometrical figures", ["MA4-GEO-C-01"]), (33, 35, "Length", ["MA4-LEN-C-01"]),
        (36, 38, "Area", ["MA4-ARE-C-01"]), (39, 41, "Volume", ["MA4-VOL-C-01"]),
        (42, 43, "Pythagoras' theorem", ["MA4-PYT-C-01"]), (44, 47, "Data", ["MA4-DAT-C-01", "MA4-DAT-C-02"]),
        (48, 50, "Probability", ["MA4-PRO-C-01"])]),
    "english": ("English", "english", "NSW English K-10 Syllabus (2022)", 5, [
        (1, 6, "Novel study", ["EN4-RVL-01", "EN4-URA-01", "EN4-ECA-01"]),
        (7, 12, "Persuasive speaking and writing", ["EN4-URB-01", "EN4-URC-01", "EN4-ECA-01"]),
        (13, 18, "Poetry", ["EN4-URA-01", "EN4-URB-01", "EN4-ECB-01"]),
        (19, 24, "Film and visual texts", ["EN4-RVL-01", "EN4-URC-01", "EN4-ECA-01"]),
        (25, 30, "Drama text", ["EN4-URA-01", "EN4-URB-01", "EN4-ECA-01"]),
        (31, 36, "Australian and First Nations texts", ["EN4-URA-01", "EN4-URC-01", "EN4-ECB-01"]),
        (37, 42, "Informative and imaginative writing", ["EN4-URB-01", "EN4-ECA-01", "EN4-ECB-01"]),
        (43, 50, "Multimodal presentation and review", list(_E))]),
    "science": ("Science", "science", "NSW Science 7-10 Syllabus (2023)", 2, [
        (1, 6, "Observing the Universe", ["SC4-OTU-01"]), (7, 12, "Forces", ["SC4-FOR-01"]),
        (13, 18, "Cells and classification", ["SC4-CLS-01"]), (19, 24, "Solutions and mixtures", ["SC4-SOL-01"]),
        (25, 32, "Living systems", ["SC4-LIV-01"]), (33, 38, "Periodic table and atomic structure", ["SC4-PRT-01"]),
        (39, 44, "Change", ["SC4-CHG-01"]), (45, 48, "Data science", ["SC4-DA1-01"]),
        (49, 50, "Depth study and review", list(_SC))]),
    "history": ("History", "history", "NSW History 7-10 Syllabus (2024)", 2, [
        (1, 8, "Historical inquiry and sources", ["HI4-INQ-01", "HI4-SOU-01", "HI4-COM-01"]),
        (9, 20, "The ancient past", ["HI4-SPE-01", "HI4-CON-01", "HI4-CPP-01", "HI4-SOU-01"]),
        (21, 32, "The medieval world", ["HI4-SPE-01", "HI4-IEP-01", "HI4-CPP-01", "HI4-CON-01"]),
        (33, 44, "The era of colonisation", ["HI4-APP-01", "HI4-IEP-01", "HI4-CPP-01", "HI4-SOU-01"]),
        (45, 50, "Depth studies and review", list(_HI))]),
    "geography": ("Geography", "geography", "NSW Geography 7-10 Syllabus (2024)", 2, [
        (1, 8, "Geographical inquiry and skills", ["GE4-TAP-01", "GE4-COM-01", "GE4-PER-01"]),
        (9, 20, "Landscapes and landforms", ["GE4-DFC-01", "GE4-PRI-01", "GE4-MAN-01", "GE4-TAP-01"]),
        (21, 32, "Liveability of places", ["GE4-DFC-01", "GE4-PER-01", "GE4-PRI-01", "GE4-COM-01"]),
        (33, 42, "Water in the world", ["GE4-PRI-01", "GE4-MAN-01", "GE4-APC-01", "GE4-TAP-01"]),
        (43, 50, "Interconnections and trade", ["GE4-PRI-01", "GE4-PER-01", "GE4-DFC-01", "GE4-APC-01"])]),
    "pdhpe": ("PDHPE", "pdhpe", "NSW PDHPE 7-10 Syllabus (2024)", 2, [
        (1, 10, "Movement skills and strategies", ["PH4-MSS-01", "PH4-MSS-02", "PH4-SMI-01"]),
        (11, 20, "Health and wellbeing through physical activity", ["PH4-SHP-01", "PH4-SHW-01", "PH4-SMI-01"]),
        (21, 30, "Safe, active and healthy lifestyle choices", ["PH4-SHP-01", "PH4-SHW-01", "PH4-IPS-01"]),
        (31, 40, "Respectful relationships", ["PH4-RRL-01", "PH4-SHW-01", "PH4-SMI-01"]),
        (41, 50, "Identity, belonging and change", ["PH4-IBC-01", "PH4-SHW-01", "PH4-SMI-01"])]),
    "technology": ("Technology", "technology", "NSW Technology 7-8 Syllabus (2023)", 2, [
        (1, 12, "Digital and communication technologies", ["TE4-DIG-01", "TE4-DIG-02", "TE4-DES-01", "TE4-SAF-01"]),
        (13, 25, "Engineering technologies and systems", ["TE4-MSC-01", "TE4-PPM-01", "TE4-DES-01", "TE4-SAF-01"]),
        (26, 38, "Food and agricultural practices", ["TE4-PDP-01", "TE4-SDP-01", "TE4-PPM-01", "TE4-SAF-01"]),
        (39, 50, "Materials and production processes", ["TE4-MSC-01", "TE4-PPM-01", "TE4-SAF-01", "TE4-PDP-01"])]),
    "visual_arts": ("Visual Arts", "vart", "NSW Visual Arts 7-10 Syllabus (2024)", 2, [
        (1, 12, "Drawing and painting", ["VA4-AMC-01", "VA4-AMV-01", "VA4-AMP-01"]),
        (13, 25, "Sculpture and design", ["VA4-AMC-01", "VA4-AMP-01", "VA4-AMV-01"]),
        (26, 37, "Artists and artworks", ["VA4-CHC-01", "VA4-CHV-01", "VA4-CHP-01"]),
        (38, 50, "Digital and mixed media", ["VA4-AMP-01", "VA4-AMV-01", "VA4-CHV-01"])]),
    "music": ("Music", "music", "NSW Music 7-10 Syllabus (2024)", 2, [
        (1, 17, "Performing", ["MU4-PER-01"]), (18, 34, "Listening", ["MU4-LIS-01"]), (35, 50, "Composing", ["MU4-COM-01"])]),
    "drama": ("Drama", "drama", "NSW Drama 7-10 Syllabus (2023)", 2, [
        (1, 17, "Making", ["DR4-MAK-01"]), (18, 34, "Performing", ["DR4-PER-01"]), (35, 50, "Appreciating", ["DR4-APP-01"])]),
    "dance": ("Dance", "dance", "NSW Dance 7-10 Syllabus (2023)", 2, [
        (1, 17, "Performing", ["DA4-PER-01"]), (18, 34, "Composing", ["DA4-COM-01"]), (35, 50, "Appreciating", ["DA4-APP-01"])]),
    "modern_languages": ("Modern Languages", "mlang", "NSW Modern Languages K-10 Syllabus (2022)", 2, [
        (1, 10, "Introducing myself", list(_ML)), (11, 20, "Family and friends", list(_ML)),
        (21, 30, "School and daily life", list(_ML)), (31, 40, "Food, places and culture", list(_ML)),
        (41, 50, "Review and project", list(_ML))]),
    "classical_languages": ("Classical Languages", "clang", "NSW Classical Languages K-10 Syllabus (2022)", 2, [
        (1, 12, "Reading and forming Latin", ["CL4-UND-01", "CL4-UND-02"]),
        (13, 25, "Roman daily life", ["CL4-UND-01", "CL4-ICU-01"]),
        (26, 38, "Myth and stories", ["CL4-UND-01", "CL4-UND-02"]),
        (39, 50, "The Roman world and review", ["CL4-UND-02", "CL4-ICU-01"])]),
    "aboriginal_languages": ("Aboriginal Languages", "alang", "NSW Aboriginal Languages K-10 Syllabus (2022)", 2, [
        (1, 13, "Sounds and greetings", []), (14, 25, "Family and community", []),
        (26, 38, "Country and place", []), (39, 50, "Stories and review", [])]),
    "auslan": ("Auslan", "auslan", "NSW Auslan K-10 Syllabus (2023)", 2, [
        (1, 10, "Fingerspelling and greetings", ["AU4-INT-01", "AU4-UND-01"]),
        (11, 25, "Family and identity", ["AU4-INT-01", "AU4-RLC-01", "AU4-CRE-01"]),
        (26, 38, "Deaf culture and community", ["AU4-RLC-01", "AU4-UND-01"]),
        (39, 50, "Signed texts and review", ["AU4-UND-01", "AU4-CRE-01"])]),
}


def _t(text):
    return [p.strip() for p in text.split(";") if p.strip()]


# Distinct lesson topics per unit, in teaching order. Mini-exam slots (core subjects) are not listed.
TOPICS = {
    ("maths", "Integers"): _t("Exploring positive and negative numbers; Adding integers on the number line; Adding integers with the same signs; Adding integers with different signs; Zero pairs and the integer chip model; Subtracting integers on the number line; Subtracting a negative integer; Addition and subtraction patterns and rules; Mixed addition and subtraction problems; Multiplying integers; Dividing integers; Order of operations with integers; Integers in context: temperature, money and elevation; Integer problem solving and unit review"),
    ("maths", "Fractions, decimals and percentages"): _t("Factors, multiples and equivalent fractions; Simplifying fractions; Comparing and ordering fractions; Improper fractions and mixed numbers; Adding fractions with different denominators; Subtracting fractions with different denominators; Adding and subtracting mixed numbers; Multiplying fractions; Dividing fractions; Fractions of quantities; Multiplying and dividing mixed numbers; Fraction problem solving; Place value and decimal notation; Ordering and rounding decimals; Adding and subtracting decimals; Multiplying decimals; Dividing decimals; Converting fractions to decimals; Converting decimals to fractions; Introducing percentages; Converting between fractions, decimals and percentages; Finding a percentage of a quantity; Expressing one quantity as a percentage of another; Percentage increase and decrease; Discounts and GST; Money and best buys with percentages; Fractions, decimals and percentages review"),
    ("maths", "Indices"): _t("Index notation and powers; Squares, square roots, cubes and cube roots; Multiplying powers with the same base; Dividing powers with the same base; Power of a power; The zero index; Index laws mixed practice; Scientific notation for large and small numbers; Indices problem solving and review"),
    ("maths", "Ratios and rates"): _t("Introducing ratios; Simplifying ratios; Equivalent ratios and missing values; Dividing a quantity in a given ratio; Ratio problems; Introducing rates; Unit rates and the unitary method; Speed as a rate; Converting rate units; Comparing rates and best buys; Scale drawings and maps; Ratio and rate problem solving; Ratios and rates review"),
    ("maths", "Algebraic techniques"): _t("Patterns and the idea of a variable; Algebraic notation; Substituting into expressions; Substituting into formulas; Like terms and unlike terms; Adding and subtracting algebraic terms; Multiplying algebraic terms; Dividing algebraic terms; Simplifying algebraic expressions; Expanding using the distributive law; Expanding with negative terms; Highest common factor of terms; Factorising using a common factor; Expanding and simplifying together; Algebraic fractions with numerical denominators; Index laws with algebraic terms; Writing expressions from words; Writing expressions from diagrams and contexts; Using formulas in real contexts; Algebra problem solving; Error analysis: spotting algebra mistakes; Algebraic techniques review; Algebra extension: number puzzles and reasoning"),
    ("maths", "Equations"): _t("What is an equation? The balance model; One-step equations: addition and subtraction; One-step equations: multiplication and division; Two-step equations; Equations with brackets; Equations with variables on both sides; Equations with fractions; Checking solutions by substitution; Writing equations from word problems; Solving worded problems with equations; Equations with negative numbers; Introducing inequalities; Equations review and problem solving"),
    ("maths", "Linear relationships"): _t("The Cartesian plane; Plotting points in four quadrants; Number patterns and tables of values; Rules for number patterns; Graphing linear relationships from tables; From rule to graph; Gradient as a rate of change; Calculating gradient from two points; The y-intercept; The equation y = mx + b; Graphing lines using gradient and intercept; Horizontal and vertical lines; Direct proportion and lines through the origin; Linear relationships in real contexts; Reading and interpreting linear graphs; Comparing linear relationships; Parallel lines on the number plane; Linear relationships review and problem solving"),
    ("maths", "Angle relationships"): _t("Naming and measuring angles; Types of angles and estimating; Angles at a point and on a straight line; Vertically opposite angles; Complementary and supplementary angles; Corresponding angles in parallel lines; Alternate angles in parallel lines; Co-interior angles in parallel lines; Finding unknown angles with parallel lines; Testing for parallel lines; The angle sum of a triangle; The exterior angle of a triangle; The angle sum of a quadrilateral; Angle reasoning and review"),
    ("maths", "Geometrical figures"): _t("Classifying triangles; Properties of triangles; Classifying quadrilaterals; Properties of parallelograms and rhombuses; Properties of rectangles, squares, trapeziums and kites; Congruent figures; Tests for congruent triangles; Constructing shapes with a ruler and protractor; Constructions with compasses; Polygons and their angle sums; Transformations: translation, reflection and rotation; Geometric reasoning and explaining; Geometrical figures review"),
    ("maths", "Length"): _t("Units of length and converting; Estimating and measuring length; Perimeter of polygons; Perimeter of composite shapes; Circumference and the meaning of pi; Circumference of circles; Arc length, semicircles and quarter circles; Perimeter of composite shapes with curves; Finding unknown side lengths from perimeter; Perimeter and algebra; Length problems in context; Measurement accuracy and rounding; Length problem solving; Length review"),
    ("maths", "Area"): _t("Units of area and converting; Area of rectangles and squares; Area of triangles; Area of parallelograms; Area of rhombuses and kites; Area of trapeziums; Area of composite shapes; Area of circles; Area of sectors and semicircles; Area of composite shapes with circles; Area and perimeter problems; Area in context: land, rooms and costs; Area review"),
    ("maths", "Volume"): _t("Units of volume and capacity; Volume of rectangular prisms; Volume of cubes and cuboids; Volume of prisms using the cross-section; Volume of triangular prisms; Volume of cylinders; Capacity and converting between kL, L and mL; Volume of composite solids; Surface area of prisms; Nets of solids; Surface area of cylinders; Volume problems in context; Volume and capacity problem solving; Volume review"),
    ("maths", "Pythagoras' theorem"): _t("Right-angled triangles and the hypotenuse; Discovering Pythagoras' theorem; Finding the hypotenuse; Finding a shorter side; Pythagorean triads; Testing for right angles; Pythagoras in context problems; Pythagoras in two-step problems; Pythagoras' theorem review"),
    ("maths", "Data"): _t("Types of data: categorical and numerical; Collecting data: surveys and questions; Sampling and bias; Frequency tables and tallies; Column graphs and picture graphs; Dot plots and stem-and-leaf plots; Histograms and frequency polygons; Sector graphs; The mean; The median and mode; Range and outliers; Choosing the best measure of centre; Comparing two data sets; Back-to-back stem-and-leaf plots; Line graphs and trends; Misleading graphs; Data investigation: planning and presenting; Data review"),
    ("maths", "Probability"): _t("Chance language and likelihood; The probability scale from 0 to 1; Theoretical probability of single events; Sample spaces and listing outcomes; Complementary events; Experimental probability and relative frequency; Comparing experimental and theoretical probability; Venn diagrams; Two-way tables; Tree diagrams for two-step events; Probability simulations; Probability in real contexts; Probability and final course review"),
    ("english", "Novel study"): _t("Introducing the novel: setting and context; Predicting from the cover, title and blurb; Reading chapter one: first impressions; Narrator and point of view; Meeting the protagonist; Setting and atmosphere; Plot structure: exposition and rising action; Vocabulary in context; Writing a PEEL paragraph about the novel; Supporting characters and relationships; Conflict: internal and external; Figurative language: simile and metaphor; Symbolism and imagery in the novel; Inference: reading between the lines; Theme: identifying the big ideas; Dialogue and voice; Tracking character change; Writing about theme; Climax and turning points; Mood and tone; Author's techniques and purpose; Comparing the novel with a related text; Responding to the novel creatively; Writing a character study; Planning an analytical essay; Drafting and editing a novel response; Novel study reflection and review"),
    ("english", "Persuasive speaking and writing"): _t("What is persuasion?; Audience, purpose and context; Ethos, pathos and logos; Rhetorical questions and repetition; Emotive language; Analysing a persuasive speech; Facts, opinions and evidence; Structuring an argument; Writing a strong thesis; Topic sentences and supporting paragraphs; Counter-arguments and rebuttals; Persuasive openings and conclusions; Tone and register for persuasion; Persuasion in advertising; Persuasion in the media; Spotting bias and fallacies; Planning a persuasive speech; Using voice and gesture; Drafting a persuasive speech; Editing for impact; Delivering and recording speeches; Listening and giving feedback; Debating basics; Debate: team roles and rebuttal; Writing a letter to the editor; Persuasive writing portfolio; Persuasion unit review"),
    ("english", "Poetry"): _t("What is poetry?; Reading poems aloud; Imagery and the senses; Simile, metaphor and personification; Alliteration and onomatopoeia; Rhythm and rhyme; Stanzas and line breaks; Free verse and structured forms; Tone and mood in poetry; Narrative poems and ballads; Poems about identity; Poems about nature and place; Poems about conflict and change; Analysing a poem closely; Comparing two poems; Haiku and cinquain; Acrostic and concrete poems; Writing a poem from observation; Writing a protest poem; Writing narrative verse; Drafting and revising poetry; Performing poetry; Responding to a poet's style; Writing an analytical paragraph about a poem; Planning a poetry anthology; Publishing a poetry anthology; Poetry review and reflection"),
    ("english", "Film and visual texts"): _t("Introducing visual literacy; Reading images: colour, framing and layout; Camera shots and angles; Movement and editing; Sound, music and lighting; Film genres and conventions; Mise-en-scene; Storyboarding a scene; Character in film; Narrative structure in film; Visual metaphor and symbolism; Picture books as visual texts; Graphic novels and comics; Advertisements and posters; Analysing a film trailer; Analysing a film scene closely; Comparing page and screen; Representation: who and what we see; Perspective and bias in visual texts; Digital and social media images; Planning a short film or photo story; Scripting dialogue and voiceover; Filming or producing a visual text; Editing and finishing a visual text; Writing a film review; Presenting and discussing visual texts; Visual texts review"),
    ("english", "Drama text"): _t("Introducing drama texts; Script format and stage directions; Reading a play aloud; Characters in drama; Setting and staging; Dialogue and subtext; Dramatic structure; Conflict and tension; Soliloquy and monologue; Comedy and tragedy; Language and humour; Shakespeare: the language; Shakespeare: reading a scene; Shakespeare: characters and motives; Themes in the play; Comparing script and performance; Writing a character monologue; Writing a scene with stage directions; Rehearsing and reading dramatically; Directing choices; Reviewing a performance; Analytical writing about drama; Responding creatively to the play; Writing a playscript; Editing and presenting a script; Performing selected scenes; Drama text review"),
    ("english", "Australian and First Nations texts"): _t("Introducing Australian voices in literature; First Nations storytelling traditions; Respectful reading of First Nations texts; Country, place and connection; Dreaming stories and their purposes; First Nations poetry and song; Memoir and life writing; Identity and belonging; History and truth-telling in literature; Australian short stories; Humour in Australian writing; Bush, urban and coastal settings; Migration and multicultural voices; Australian English and idiom; Young adult texts about Australian teenagers; Speeches and essays; Visual texts by First Nations creators; Comparing two Australian texts; Representation and stereotypes; Themes across texts; Writing a response to an Australian text; Writing about connection to place; Creative response: story or poem; Planning a comparative response; Drafting and editing a comparative response; Sharing and discussing texts; Australian texts unit review"),
    ("english", "Informative and imaginative writing"): _t("Purposes of writing; Planning an informative text; Researching and noting sources; Paraphrasing and avoiding plagiarism; Structuring a report; Explanation texts; Procedures and instructions; Writing biographies; Interviews and feature articles; Sentence variety; Paragraphing and cohesion; Punctuation for effect; Grammar for clarity; Editing and proofreading; Imaginative writing: story ideas; Characters that feel real; Setting and atmosphere in stories; Plot and pacing; Show, don't tell; Dialogue punctuation and style; Openings and endings; Writing from a different point of view; Narrative voice and style; Drafting an imaginative story; Revising for impact; Publishing and sharing writing; Writing unit reflection"),
    ("english", "Multimodal presentation and review"): _t("Planning a multimodal presentation; Choosing a topic and purpose; Researching reliable sources; Organising ideas and slides; Designing visuals and layout; Writing a spoken script; Using images, graphs and video; Voice, pace and body language; Rehearsing and timing; Giving and receiving feedback; Presenting to an audience; Answering questions with confidence; Reflecting on a presentation; Reviewing reading: literal and inferential; Reviewing text types and structures; Reviewing grammar and punctuation; Reviewing spelling and vocabulary; Reviewing persuasive texts; Reviewing poetry and visual texts; Reviewing drama and Australian texts; Reviewing informative writing; Reviewing imaginative writing; Timed reading response; Timed writing task; Editing under time pressure; Portfolio selection; Portfolio reflection; Reading for enjoyment: book talk; Creative project planning; Creative project: making; Creative project: sharing; Course reflection; Setting goals for next stage; Skills showcase; Final English review; Course wrap-up"),
    ("science", "Observing the Universe"): _t("Observing the night sky; Earth's rotation, day and night; Seasons and Earth's tilt; The Moon's phases; Eclipses and tides; The solar system; Stars and galaxies; Telescopes and observation; Measuring astronomical distances; Space exploration history; Australian contributions to astronomy; First Nations astronomy"),
    ("science", "Forces"): _t("What is a force?; Balanced and unbalanced forces; Friction and air resistance; Gravity and weight; Measuring forces; Speed and motion; Distance-time graphs; Contact and non-contact forces; Simple machines; Forces in sport; Designing a forces investigation; Forces review"),
    ("science", "Cells and classification"): _t("Using a microscope; Cells: the basic units of life; Plant and animal cells; Organelles and their functions; Unicellular and multicellular organisms; Levels of organisation; Classifying living things; Dichotomous keys; Vertebrates and invertebrates; Classifying plants; Microorganisms; Cells and classification review"),
    ("science", "Solutions and mixtures"): _t("States of matter; The particle model; Changes of state; Pure substances and mixtures; Solutions: solute and solvent; Solubility and temperature; Separating mixtures: filtration and evaporation; Distillation and chromatography; Water purification; Concentration; Mixtures in industry and daily life; Solutions review"),
    ("science", "Living systems"): _t("Body systems overview; The digestive system; Enzymes and digestion; The circulatory system; The respiratory system; Gas exchange; Photosynthesis; Respiration in cells; Plant transport systems; Interdependence of body systems; Ecosystems and food webs; Energy flow in ecosystems; Human impact on ecosystems; Adaptations; Fieldwork investigation; Living systems review"),
    ("science", "Periodic table and atomic structure"): _t("Atoms and elements; Atomic structure; Protons, neutrons and electrons; The layout of the periodic table; Metals and non-metals; Groups and periods; Electron arrangement; Isotopes; Compounds and formulas; Elements in everyday life; Chemical symbols and models; Periodic table review"),
    ("science", "Change"): _t("Physical and chemical change; Signs of chemical change; Reactants and products; Word equations; Conservation of mass; Energy in reactions; Acids and bases; Indicators and pH; Rates of reaction; Rusting and combustion; Chemical change in society; Change review"),
    ("science", "Data science"): _t("Collecting scientific data; Organising data in tables; Graphing data; Spotting patterns and trends; Reliability and validity; Data and models; Using digital tools for data; Data science review"),
    ("science", "Depth study and review"): _t("Planning a depth study; Conducting the investigation; Reporting findings; Stage 4 Science review"),
    ("history", "Historical inquiry and sources"): _t("What is history?; Timelines and chronology; Primary and secondary sources; Asking historical questions; Evaluating sources; Reliability and bias; Archaeology and evidence; Oral history; Perspectives in history; Continuity and change; Cause and effect; Historical significance; Historical terms and concepts; Writing a historical explanation; Referencing sources; Inquiry skills review"),
    ("history", "The ancient past"): _t("What is the ancient past?; Early humans; Archaeology of ancient sites; Ancient Australia: First Peoples; Deep time and continuity; Ancient Egypt: geography and the Nile; Egyptian society and beliefs; Pharaohs and power; Pyramids and tombs; Daily life in ancient Egypt; Mummification and the afterlife; Ancient Greece: city-states; Athens and Sparta; Greek democracy; Greek religion and myth; The Olympics and Greek culture; Ancient Rome: republic to empire; Roman society and law; Roman engineering; Gladiators and entertainment; Ancient China: an overview; Comparing ancient societies; Legacy of the ancient world; Ancient past review"),
    ("history", "The medieval world"): _t("What was the medieval world?; Europe after Rome; Feudalism; Castles and knights; Life in a medieval village; The medieval Church; The Black Death; The Crusades; Viking expansion; The Islamic Golden Age; Trade networks; Medieval Japan; Samurai and shoguns; Medieval China; The Mongol Empire; Medieval African kingdoms: Mali; Mesoamerican civilisations; Medieval art and architecture; Medieval science and medicine; Women in medieval societies; Law, crime and punishment; Writing and manuscripts; Legacy of the medieval world; Medieval world review"),
    ("history", "The era of colonisation"): _t("The age of exploration; Reasons for exploration; First contacts and encounters; Aboriginal Peoples before 1788; Arrival of the First Fleet; Colonisation of Sydney Cove; Frontier conflict; Impact on Aboriginal Peoples; Resistance and survival; Convicts and their lives; Free settlers; Exploration inland; The gold rushes; Colonial society; Pacific Islander experiences; Colonisation in the Pacific; Slavery and its abolition; Industrial Revolution links; Immigration and the colonies; Laws and policies affecting Aboriginal Peoples; Perspectives on colonisation; Truth-telling and memory; Colonisation timeline and legacy; Colonisation review"),
    ("history", "Depth studies and review"): _t("Depth study: choosing a topic; Depth study: research; Depth study: source analysis; Depth study: planning; Depth study: drafting; Depth study: presenting; Ancient world revision; Medieval world revision; Colonisation revision; Historical skills revision; Exam practice; Stage 4 History reflection"),
}

CORE_MINUTES = (60, 60, 60, 60, 45)


def _spanned(skey, week):
    return [u for u in SUBJECTS[skey][4] if u[0] <= week and u[1] >= week - 1]


def _make(skey, week, slot, unit, codes, topic):
    area, prefix, source, per_week, _units = SUBJECTS[skey]
    codes = list(codes)
    if skey == "maths" and WM not in codes:
        codes.append(WM)
    if skey == "science":
        codes.extend(c for c in _WS if c not in codes)
    core = per_week == 5
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    steps = [{"icon": str(i), "title": "Part %d" % i, "explain": PLACEHOLDER, "example": "Example to be added.",
              "notice": "Key idea to be added.", "check": dict(_CHECK)} for i in range(1, 6 if core else 5)]
    return {
        "seed_key": "s4-%s-w%02d-l%d" % (prefix, week, slot + 1), "library": True, "stage": "S4",
        "year_level": "Stage 4", "learning_area": area, "subject": unit, "title": title,
        "child_mission": "Placeholder lesson: %s." % topic, "duration_minutes": CORE_MINUTES[slot] if core else 45,
        "pass_mark": 0.9, "outcome_codes": codes, "outcome_notes": {c: OUTCOMES[c] for c in codes},
        "learning_intention": "We are learning about: %s." % topic,
        "success_criteria": ["I can explain the main idea of this lesson.", "I can use it in my own work.",
                             "I can score 90% or more on the Quest check."],
        "key_vocabulary": [], "materials": ["Paper or notebook", "Pencil"], "prior_knowledge": "To be added.",
        "explicit_teaching": PLACEHOLDER, "teach_steps": steps, "worked_example": "To be added.",
        "guided_practice": "To be added.", "independent_task": "To be added.",
        "response_prompt": "Write or draw your answers in your notebook.", "self_check": "To be added.",
        "accessibility_notes": "To be added.", "interactive_activities": [], "sort_activity": None,
        "word_challenges": [], "steps": [], "resources": [], "quiz": [], "reflection_prompts": [],
        "evidence_instructions": "To be added.",
        "parent_notes": "PLACEHOLDER lesson. Not ready to teach. Practice lesson only." + ("" if codes else " Outcome codes for this subject are still to be verified."),
        "source_note": "Based on the %s. Planned focus is a draft." % source,
        "offline_alternative": "To be added.", "extension": "To be added.", "follow_up_challenges": [],
        "is_placeholder": True,
    }


UNPLANNED = []
LESSONS = []
for _skey, _spec in SUBJECTS.items():
    _per_week = _spec[3]
    for _first, _last, _unit, _codes in _spec[4]:
        _queue = list(TOPICS.get((_skey, _unit), []))
        if not _queue:
            UNPLANNED.append((_skey, _unit))
        _fallback = 0
        for _week in range(_first, _last + 1):
            for _slot in range(_per_week):
                if _per_week == 5 and _slot == 4 and _week % 2 == 0:
                    _span = _spanned(_skey, _week)
                    _ecodes = []
                    for _u in _span:
                        _ecodes.extend(c for c in _u[3] if c not in _ecodes)
                    _text = "Fortnightly mini exam, weeks %d and %d (%s)" % (_week - 1, _week, " and ".join(u[2] for u in _span))
                    LESSONS.append(_make(_skey, _week, _slot, _span[-1][2], _ecodes, _text))
                    continue
                if _queue:
                    _text = _queue.pop(0)
                else:
                    _fallback += 1
                    _text = "%s: planned lesson %d" % (_unit, _fallback)
                LESSONS.append(_make(_skey, _week, _slot, _unit, _codes, _text))

if __name__ == "__main__":
    keys = [lesson["seed_key"] for lesson in LESSONS]
    assert len(keys) == len(set(keys)) == 1800, len(keys)
    for _k, _s in SUBJECTS.items():
        _weeks = [w for a, b, t, c in _s[4] for w in range(a, b + 1)]
        assert _weeks == list(range(1, 51)), (_k, "weeks")
        _own = [x for x in LESSONS if x["seed_key"].startswith("s4-%s-" % _s[1])]
        assert len(_own) == 50 * _s[3], (_k, len(_own))
        _texts = [x["title"].split(": ", 1)[1] for x in _own]
        assert len(_texts) == len(set(_texts)), (_k, "repeated lesson titles")
    for lesson in LESSONS:
        assert set(lesson["outcome_codes"]) <= set(OUTCOMES), lesson["seed_key"]
    for (_k, _u), _topics in TOPICS.items():
        _spec = SUBJECTS[_k]
        _unit = [u for u in _spec[4] if u[2] == _u][0]
        _slots = (_unit[1] - _unit[0] + 1) * _spec[3]
        if _spec[3] == 5:
            _slots -= len([w for w in range(_unit[0], _unit[1] + 1) if w % 2 == 0])
        if len(_topics) != _slots:
            print("COUNT MISMATCH", _k, _u, len(_topics), "topics for", _slots, "slots")
    print("OK: 1800 lessons. Units still unplanned:", len(UNPLANNED))
