"""Stage 4 placeholder lessons: 15 subjects x 50 weeks (1,800 lessons).

Core subjects (English, Mathematics): 5 lessons a week (four of 60 minutes, one of 45), 250 lessons each.
All other subjects: 2 lessons a week of 45 minutes, 100 lessons each.
Even-numbered weeks of English and Mathematics end with a fortnightly mini exam in lesson 5 (assumption).

50 weeks is a catch-up pace, not the two-year NESA Stage 4 span. It is meant to be revised later.

SYLLABUSES (2027 planning basis):
  English K-10 (2022), Mathematics K-10 (2022), Science 7-10 (2023), History 7-10 (2024),
  Geography 7-10 (2024), PDHPE 7-10 (2024), Technology 7-8 (2023), Visual Arts 7-10 (2024),
  Music 7-10 (2024), Drama 7-10 (2023), Dance 7-10 (2023), Modern Languages K-10 (2022),
  Classical Languages K-10 (2022), Aboriginal Languages K-10 (2022), Auslan K-10 (2023).
  Life Skills outcomes are deliberately left out.

OUTCOME CODE STATUS.
  Read on curriculum.nsw.edu.au (Oct 2026): Science (16), PDHPE (8), Technology 7-8 (8), Drama (2 of 3).
  Mathematics (16 + MAO-WM-01) and English (6) came from NESA-based sources and should be re-checked.
  Every other subject has an EMPTY outcome_codes list on purpose, because their Stage 4 codes have
  not been read in full. See CODES_TO_VERIFY. Labels are short plain descriptions, not NESA wording.
  Which unit uses which codes is a DRAFT mapping, to be refined against NSW sample scope and sequences.
  Science: all eight Working scientifically outcomes are attached to every Science lesson, like MAO-WM-01.

Unit titles are draft placeholders.

TO BUILD A WEEK OUT: write a full module for it, register it in lesson_library.py LESSON_MODULES, and
add (subject_key, week) to BUILT_OUT below. The generator then skips that week.
"""
BUILT_OUT = set()
WORKING_MATHEMATICALLY = "MAO-WM-01"
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}

_WS = ["SC4-WS-0%d" % i for i in range(1, 9)]

OUTCOMES = {
    "MA4-INT-C-01": "Integers: operating with positive and negative numbers",
    "MA4-FRC-C-01": "Fractions, decimals and percentages",
    "MA4-RAT-C-01": "Ratios and rates",
    "MA4-ALG-C-01": "Algebraic techniques",
    "MA4-IND-C-01": "Indices",
    "MA4-EQU-C-01": "Equations",
    "MA4-LIN-C-01": "Linear relationships",
    "MA4-LEN-C-01": "Length and perimeter",
    "MA4-PYT-C-01": "Pythagoras' theorem",
    "MA4-ARE-C-01": "Area",
    "MA4-VOL-C-01": "Volume",
    "MA4-ANG-C-01": "Angle relationships",
    "MA4-GEO-C-01": "Geometrical figures",
    "MA4-DAT-C-01": "Data: collecting and representing",
    "MA4-DAT-C-02": "Data: interpreting and analysing",
    "MA4-PRO-C-01": "Probability",
    "MAO-WM-01": "Working mathematically: reasoning, communicating and solving problems (applies across all content)",
    "EN4-RVL-01": "Reading, viewing and listening to texts",
    "EN4-URA-01": "Understanding and responding to texts (A)",
    "EN4-URB-01": "Understanding and responding to texts (B)",
    "EN4-URC-01": "Understanding and responding to texts (C)",
    "EN4-ECA-01": "Expressing and composing texts (A)",
    "EN4-ECB-01": "Expressing and composing texts (B)",
    "SC4-WS-01": "Working scientifically: uses scientific tools and instruments for observations",
    "SC4-WS-02": "Working scientifically: identifies questions and makes predictions to guide scientific investigations",
    "SC4-WS-03": "Working scientifically: plans safe and valid investigations",
    "SC4-WS-04": "Working scientifically: follows a planned procedure to undertake safe and valid investigations",
    "SC4-WS-05": "Working scientifically: processing data and information",
    "SC4-WS-06": "Working scientifically (outcome 6)",
    "SC4-WS-07": "Working scientifically (outcome 7)",
    "SC4-WS-08": "Working scientifically (outcome 8)",
    "SC4-OTU-01": "Observing the Universe: how observations increase knowledge of the Universe",
    "SC4-FOR-01": "Forces: effects of forces in everyday contexts",
    "SC4-CLS-01": "Cells and classification: features of cells and how they classify organisms",
    "SC4-SOL-01": "Solutions and mixtures",
    "SC4-LIV-01": "Living systems",
    "SC4-PRT-01": "Periodic table and atomic structure",
    "SC4-CHG-01": "Change",
    "SC4-DA1-01": "Data science",
    "PH4-MSS-01": "Transfers movement skills and concepts for use in a range of dynamic movement environments",
    "PH4-MSS-02": "Demonstrates how strategies and actions can be transferred to solve movement challenges",
    "PH4-SHP-01": "Plans for and uses strategies to participate in activities that encourage safety, health and lifelong physical activity",
    "PH4-SMI-01": "Refines and applies self-management and interpersonal skills to manage complex situations",
    "PH4-SHW-01": "Assesses the influence of contextual factors on attitudes and behaviours to propose strategies that enhance safety, health and wellbeing",
    "PH4-IPS-01": "Investigates and uses health information, products and support services to propose strategies that enhance safety, health and wellbeing",
    "PH4-RRL-01": "Explains and applies strategies for promoting safe and respectful relationships in a range of contexts",
    "PH4-IBC-01": "Investigates and explains factors that shape identity and sense of belonging",
    "TE4-SDP-01": "Explains relationships between sustainability, design and production",
    "TE4-PDP-01": "Describes the practices and processes of designers and producers",
    "TE4-MSC-01": "Explains how materials, systems and components contribute to solutions",
    "TE4-PPM-01": "Applies processes in the planning, management and production of projects",
    "TE4-DES-01": "Communicates and evaluates design ideas and solutions",
    "TE4-SAF-01": "Selects and safely uses tools, materials, technologies and processes",
    "TE4-DIG-01": "Demonstrates technological literacy to safely interact in digital environments",
    "TE4-DIG-02": "Uses data and digital systems to code, design and produce projects",
    "DR4-MAK-01": "Creates meaning through experimentation with dramatic contexts, processes and elements",
    "DR4-APP-01": "Explains how creative choices shape works and experiences",
}

CODES_TO_VERIFY = {
    "history": "HI4 codes, 8 Stage 4 outcomes", "geography": "GE4 codes, 7 Stage 4 outcomes",
    "visual_arts": "VA4 codes, 6 Stage 4 outcomes", "music": "MU4 codes, 3 Stage 4 outcomes",
    "drama": "third Stage 4 outcome (performing); DR4-MAK-01 and DR4-APP-01 confirmed",
    "dance": "DA4 codes, 3 Stage 4 outcomes", "modern_languages": "ML4 codes",
    "classical_languages": "Stage 4 codes", "aboriginal_languages": "Stage 4 codes", "auslan": "Stage 4 codes",
}

_M = ["MA4-INT-C-01", "MA4-FRC-C-01", "MA4-RAT-C-01", "MA4-ALG-C-01", "MA4-IND-C-01", "MA4-EQU-C-01",
      "MA4-LIN-C-01", "MA4-LEN-C-01", "MA4-PYT-C-01", "MA4-ARE-C-01", "MA4-VOL-C-01", "MA4-ANG-C-01",
      "MA4-GEO-C-01", "MA4-DAT-C-01", "MA4-DAT-C-02", "MA4-PRO-C-01"]
_E = ["EN4-RVL-01", "EN4-URA-01", "EN4-URB-01", "EN4-URC-01", "EN4-ECA-01", "EN4-ECB-01"]
_SC = ["SC4-OTU-01", "SC4-FOR-01", "SC4-CLS-01", "SC4-SOL-01", "SC4-LIV-01", "SC4-PRT-01", "SC4-CHG-01", "SC4-DA1-01"]
_PH = ["PH4-MSS-01", "PH4-MSS-02", "PH4-SHP-01", "PH4-SMI-01", "PH4-SHW-01", "PH4-IPS-01", "PH4-RRL-01", "PH4-IBC-01"]
_TE = ["TE4-SDP-01", "TE4-PDP-01", "TE4-MSC-01", "TE4-PPM-01", "TE4-DES-01", "TE4-SAF-01", "TE4-DIG-01", "TE4-DIG-02"]

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
        (1, 10, "Historical inquiry and sources", []), (11, 20, "The ancient world", []),
        (21, 30, "The medieval world", []), (31, 40, "Australia and First Nations history", []),
        (41, 50, "Depth study and review", [])]),
    "geography": ("Geography", "geography", "NSW Geography 7-10 Syllabus (2024)", 2, [
        (1, 10, "Geographical inquiry and skills", []), (11, 20, "Landscapes and landforms", []),
        (21, 30, "Place and liveability", []), (31, 40, "Water in the world", []),
        (41, 50, "Fieldwork and review", [])]),
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
        (1, 12, "Drawing and painting", []), (13, 25, "Sculpture and design", []),
        (26, 37, "Artists and artworks", []), (38, 50, "Digital and mixed media", [])]),
    "music": ("Music", "music", "NSW Music 7-10 Syllabus (2024)", 2, [
        (1, 17, "Performing", []), (18, 34, "Listening", []), (35, 50, "Composing", [])]),
    "drama": ("Drama", "drama", "NSW Drama 7-10 Syllabus (2023)", 2, [
        (1, 17, "Making", ["DR4-MAK-01"]), (18, 34, "Performing", []), (35, 50, "Appreciating", ["DR4-APP-01"])]),
    "dance": ("Dance", "dance", "NSW Dance 7-10 Syllabus (2023)", 2, [
        (1, 17, "Performing", []), (18, 34, "Composing", []), (35, 50, "Appreciating", [])]),
    "modern_languages": ("Modern Languages", "mlang", "NSW Modern Languages K-10 Syllabus (2022)", 2, [
        (1, 10, "Introducing myself", []), (11, 20, "Family and friends", []), (21, 30, "School and daily life", []),
        (31, 40, "Food, places and culture", []), (41, 50, "Review and project", [])]),
    "classical_languages": ("Classical Languages", "clang", "NSW Classical Languages K-10 Syllabus (2022)", 2, [
        (1, 12, "Reading and forming Latin", []), (13, 25, "Roman daily life", []),
        (26, 38, "Myth and stories", []), (39, 50, "The Roman world and review", [])]),
    "aboriginal_languages": ("Aboriginal Languages", "alang", "NSW Aboriginal Languages K-10 Syllabus (2022)", 2, [
        (1, 13, "Sounds and greetings", []), (14, 25, "Family and community", []),
        (26, 38, "Country and place", []), (39, 50, "Stories and review", [])]),
    "auslan": ("Auslan", "auslan", "NSW Auslan K-10 Syllabus (2023)", 2, [
        (1, 10, "Fingerspelling and greetings", []), (11, 25, "Family and identity", []),
        (26, 38, "Deaf culture and community", []), (39, 50, "Signed texts and review", [])]),
}

CORE_MINUTES = (60, 60, 60, 60, 45)
CORE_SLOTS = ("Explore", "Build", "Apply", "Reason and solve", "Consolidate")
OTHER_SLOTS = ("Explore", "Create and apply")


def _unit_for(skey, week):
    for a, b, title, codes in SUBJECTS[skey][4]:
        if a <= week <= b:
            return a, b, title, codes
    raise ValueError((skey, week))


def _make(skey, week, slot):
    area, prefix, source, per_week, _units = SUBJECTS[skey]
    a, b, unit, unit_codes = _unit_for(skey, week)
    codes = list(unit_codes)
    if skey == "maths" and WORKING_MATHEMATICALLY not in codes:
        codes.append(WORKING_MATHEMATICALLY)
    if skey == "science":
        codes.extend(c for c in _WS if c not in codes)
    core = per_week == 5
    mini_exam = core and slot == 4 and week % 2 == 0
    slot_name = "Fortnightly mini exam" if mini_exam else (CORE_SLOTS if core else OTHER_SLOTS)[slot]
    topic = "%s, week %d: %s" % (unit, week - a + 1, slot_name)
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    minutes = CORE_MINUTES[slot] if core else 45
    steps = [{"icon": str(i), "title": "Part %d" % i, "explain": PLACEHOLDER, "example": "Example to be added.",
              "notice": "Key idea to be added.", "check": dict(_CHECK)} for i in range(1, 6 if core else 5)]
    notes = {c: OUTCOMES[c] for c in codes}
    codes_note = "" if codes else " Outcome codes for this subject are still to be verified."
    return {
        "seed_key": "s4-%s-w%02d-l%d" % (prefix, week, slot + 1), "library": True, "stage": "S4",
        "year_level": "Stage 4", "learning_area": area, "subject": unit, "title": title,
        "child_mission": "Placeholder lesson: %s." % topic, "duration_minutes": minutes, "pass_mark": 0.9,
        "outcome_codes": codes, "outcome_notes": notes,
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
        "parent_notes": "PLACEHOLDER lesson. Not ready to teach. Practice lesson only." + codes_note,
        "source_note": "Based on the %s. Unit titles are draft placeholders." % source,
        "offline_alternative": "To be added.", "extension": "To be added.", "follow_up_challenges": [],
        "is_placeholder": True,
    }


LESSONS = []
for _skey, _spec in SUBJECTS.items():
    for _w in range(1, 51):
        if (_skey, _w) in BUILT_OUT:
            continue
        for _slot in range(_spec[3]):
            LESSONS.append(_make(_skey, _w, _slot))


if __name__ == "__main__":
    keys = [l["seed_key"] for l in LESSONS]
    assert len(keys) == len(set(keys)), "duplicate seed keys"
    assert len(LESSONS) == 1800, len(LESSONS)
    for _k, _s in SUBJECTS.items():
        weeks = [w for a, b, t, c in _s[4] for w in range(a, b + 1)]
        assert weeks == list(range(1, 51)), (_k, "weeks not 1-50 without gaps")
    for _l in LESSONS:
        assert set(_l["outcome_codes"]) <= set(OUTCOMES), (_l["seed_key"], "code missing from OUTCOMES")
    assert {c for u in SUBJECTS["maths"][4] for c in u[3]} == set(_M), "maths codes"
    assert {c for u in SUBJECTS["english"][4] for c in u[3]} == set(_E), "english codes"
    assert {c for u in SUBJECTS["science"][4] for c in u[3]} == set(_SC), "science codes"
    assert {c for u in SUBJECTS["pdhpe"][4] for c in u[3]} == set(_PH), "pdhpe codes"
    assert {c for u in SUBJECTS["technology"][4] for c in u[3]} == set(_TE), "technology codes"
    print("OK: 1800 lessons across 15 subjects")
