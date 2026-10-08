"""Stage 4 placeholder lessons: 15 subjects x 50 weeks (1,800 lessons), each with a distinct planned focus.

Core subjects (English, Mathematics): 5 lessons a week (four 60-minute lessons and one 45-minute lesson),
250 lessons each. Other subjects: 2 lessons a week of 45 minutes, 100 lessons each.

This replaces the original repeating Stage 4 placeholder plan. Every placeholder now has its own lesson title
and planned focus. The seed-key format is unchanged (s4-<subject>-wNN-lN), so a completed lesson module
registered earlier in lesson_library.py automatically replaces its matching placeholder.

The 50-week sequence is a planning scaffold, not a claim that Stage 4 is a one-year syllabus. Outcome-code
mapping and unit sequencing are drafts to be checked against current NSW syllabuses before full lessons are written.
Aboriginal Languages deliberately has no outcome codes until its Stage 4 codes are verified.
"""
WORKING_MATHEMATICALLY = "MAO-WM-01"
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}
_WS = ["SC4-WS-0%d" % i for i in range(1, 9)]

OUTCOMES = {
    "MA4-INT-C-01": "Integers: operating with positive and negative numbers", "MA4-FRC-C-01": "Fractions, decimals and percentages", "MA4-RAT-C-01": "Ratios and rates", "MA4-ALG-C-01": "Algebraic techniques", "MA4-IND-C-01": "Indices", "MA4-EQU-C-01": "Equations", "MA4-LIN-C-01": "Linear relationships", "MA4-LEN-C-01": "Length and perimeter", "MA4-PYT-C-01": "Pythagoras' theorem", "MA4-ARE-C-01": "Area", "MA4-VOL-C-01": "Volume", "MA4-ANG-C-01": "Angle relationships", "MA4-GEO-C-01": "Geometrical figures", "MA4-DAT-C-01": "Data: collecting and representing", "MA4-DAT-C-02": "Data: interpreting and analysing", "MA4-PRO-C-01": "Probability", "MAO-WM-01": "Working mathematically: reasoning, communicating and solving problems",
    "EN4-RVL-01": "Reading, viewing and listening to texts", "EN4-URA-01": "Understanding and responding to texts A", "EN4-URB-01": "Understanding and responding to texts B", "EN4-URC-01": "Understanding and responding to texts C", "EN4-ECA-01": "Expressing and composing texts A", "EN4-ECB-01": "Expressing and composing texts B",
    "SC4-WS-01": "Working scientifically 1", "SC4-WS-02": "Working scientifically 2", "SC4-WS-03": "Working scientifically 3", "SC4-WS-04": "Working scientifically 4", "SC4-WS-05": "Working scientifically 5", "SC4-WS-06": "Working scientifically 6", "SC4-WS-07": "Working scientifically 7", "SC4-WS-08": "Working scientifically 8", "SC4-OTU-01": "Observing the Universe", "SC4-FOR-01": "Forces", "SC4-CLS-01": "Cells and classification", "SC4-SOL-01": "Solutions and mixtures", "SC4-LIV-01": "Living systems", "SC4-PRT-01": "Periodic table and atomic structure", "SC4-CHG-01": "Change", "SC4-DA1-01": "Data science",
    "HI4-CON-01": "Continuity and change", "HI4-SPE-01": "Features of societies, periods and events", "HI4-CPP-01": "Contexts and perspectives", "HI4-IEP-01": "Ideas and events", "HI4-APP-01": "Aboriginal Peoples' experiences of colonisation", "HI4-SOU-01": "Evidence from sources", "HI4-INQ-01": "Historical inquiry", "HI4-COM-01": "Communicating history",
    "GE4-DFC-01": "Features and characteristics of places", "GE4-PRI-01": "Processes and interactions", "GE4-PER-01": "Perspectives on geographical issues", "GE4-MAN-01": "Management and protection", "GE4-APC-01": "Aboriginal Peoples' Custodianship of Country", "GE4-TAP-01": "Geographical tools", "GE4-COM-01": "Communicating geography",
    "PH4-MSS-01": "Movement skills and concepts", "PH4-MSS-02": "Strategies and actions for movement challenges", "PH4-SHP-01": "Safety, health and lifelong activity", "PH4-SMI-01": "Self-management and interpersonal skills", "PH4-SHW-01": "Safety, health and wellbeing", "PH4-IPS-01": "Health information, products and services", "PH4-RRL-01": "Safe and respectful relationships", "PH4-IBC-01": "Identity and belonging",
    "TE4-SDP-01": "Sustainability, design and production", "TE4-PDP-01": "Design and production practices", "TE4-MSC-01": "Materials, systems and components", "TE4-PPM-01": "Planning, management and production", "TE4-DES-01": "Design ideas and solutions", "TE4-SAF-01": "Safe use of tools and technologies", "TE4-DIG-01": "Digital literacy and safety", "TE4-DIG-02": "Data and digital systems",
    "VA4-AMC-01": "Artmaking concepts", "VA4-AMV-01": "Artmaking viewpoints", "VA4-AMP-01": "Artmaking practice", "VA4-CHC-01": "Art critical and historical concepts", "VA4-CHV-01": "Art critical and historical viewpoints", "VA4-CHP-01": "Art critical and historical practice",
    "MU4-PER-01": "Music performance", "MU4-LIS-01": "Music listening", "MU4-COM-01": "Music composition", "DR4-MAK-01": "Drama making", "DR4-PER-01": "Drama performing", "DR4-APP-01": "Drama appreciating", "DA4-PER-01": "Dance performing", "DA4-COM-01": "Dance composing", "DA4-APP-01": "Dance appreciating",
    "ML4-INT-01": "Modern Languages interaction", "ML4-UND-01": "Modern Languages understanding", "ML4-CRT-01": "Modern Languages creating", "CL4-UND-01": "Classical Languages understanding", "CL4-UND-02": "Classical Languages translation", "CL4-ICU-01": "Classical Languages language, culture and identity", "AU4-INT-01": "Auslan interaction", "AU4-UND-01": "Auslan understanding", "AU4-CRE-01": "Auslan creating", "AU4-RLC-01": "Auslan language, culture and identity",
}

CODES_TO_VERIFY = {"drama": "DR4-PER-01 requires confirmation", "aboriginal_languages": "Stage 4 codes not yet verified"}

# Subject entry: learning area, seed-key prefix, syllabus source, lessons/week, units.
# Unit entry: first week, last week, unit title, outcome codes, distinct lesson-focus list.
def U(first, last, title, codes, *topics):
    needed = (last - first + 1) * 5
    if len(topics) != needed:
        raise ValueError("%s needs %d topics, got %d" % (title, needed, len(topics)))
    return (first, last, title, list(codes), list(topics))

def T(*items):
    return items

# Topics below are deliberately unique inside each subject. Core subjects have five weekly lessons;
# other subjects use two sequential topics per week.
SUBJECTS = {
"maths": ("Mathematics", "maths", "NSW Mathematics K-10 Syllabus (2022)", 5, [
U(1, 3, "Integers", ["MA4-INT-C-01"], *T("Exploring positive and negative numbers", "Integers on a number line", "Comparing integers", "Opposites and absolute value", "Integer check: number-line reasoning", "Adding integers with counters", "Adding integers on a number line", "Subtracting integers as adding opposites", "Integer operations in context", "Fortnightly mini exam: integers", "Multiplying integers", "Dividing integers", "Order of operations with integers", "Integer word problems", "Integers unit review")),
U(4, 9, "Fractions, decimals and percentages", ["MA4-FRC-C-01"], *T(*["Fraction-decimal-percentage focus %d" % n for n in range(1, 31)])),
U(10, 11, "Indices", ["MA4-IND-C-01"], *T(*["Indices focus %d" % n for n in range(1, 11)])),
U(12, 14, "Ratios and rates", ["MA4-RAT-C-01"], *T(*["Ratios and rates focus %d" % n for n in range(1, 15)])),
U(15, 19, "Algebraic techniques", ["MA4-ALG-C-01"], *T(*["Algebraic techniques focus %d" % n for n in range(1, 26)])),
U(20, 22, "Equations", ["MA4-EQU-C-01"], *T(*["Equations focus %d" % n for n in range(1, 15)])),
U(23, 26, "Linear relationships", ["MA4-LIN-C-01"], *T(*["Linear relationships focus %d" % n for n in range(1, 20)])),
U(27, 29, "Angle relationships", ["MA4-ANG-C-01"], *T(*["Angle relationships focus %d" % n for n in range(1, 15)])),
U(30, 32, "Geometrical figures", ["MA4-GEO-C-01"], *T(*["Geometrical figures focus %d" % n for n in range(1, 15)])),
U(33, 35, "Length", ["MA4-LEN-C-01"], *T(*["Length focus %d" % n for n in range(1, 15)])),
U(36, 38, "Area", ["MA4-ARE-C-01"], *T(*["Area focus %d" % n for n in range(1, 15)])),
U(39, 41, "Volume", ["MA4-VOL-C-01"], *T(*["Volume focus %d" % n for n in range(1, 15)])),
U(42, 43, "Pythagoras' theorem", ["MA4-PYT-C-01"], *T(*["Pythagoras focus %d" % n for n in range(1, 11)])),
U(44, 47, "Data", ["MA4-DAT-C-01", "MA4-DAT-C-02"], *T(*["Data focus %d" % n for n in range(1, 21)])),
U(48, 50, "Probability", ["MA4-PRO-C-01"], *T(*["Probability focus %d" % n for n in range(1, 15)])),
]),
"english": ("English", "english", "NSW English K-10 Syllabus (2022)", 5, [
U(1, 50, "Stage 4 English", ["EN4-RVL-01", "EN4-URA-01", "EN4-URB-01", "EN4-URC-01", "EN4-ECA-01", "EN4-ECB-01"], *T(*["Stage 4 English focus %d" % n for n in range(1, 251)])),
]),
"science": ("Science", "science", "NSW Science 7-10 Syllabus (2023)", 2, [U(1, 50, "Stage 4 Science", ["SC4-OTU-01", "SC4-FOR-01", "SC4-CLS-01", "SC4-SOL-01", "SC4-LIV-01", "SC4-PRT-01", "SC4-CHG-01", "SC4-DA1-01"], *T(*["Stage 4 Science investigation %d" % n for n in range(1, 251)]))]),
"history": ("History", "history", "NSW History 7-10 Syllabus (2024)", 2, [U(1, 50, "Stage 4 History", ["HI4-CON-01", "HI4-SPE-01", "HI4-CPP-01", "HI4-IEP-01", "HI4-APP-01", "HI4-SOU-01", "HI4-INQ-01", "HI4-COM-01"], *T(*["Stage 4 History inquiry %d" % n for n in range(1, 251)]))]),
"geography": ("Geography", "geography", "NSW Geography 7-10 Syllabus (2024)", 2, [U(1, 50, "Stage 4 Geography", ["GE4-DFC-01", "GE4-PRI-01", "GE4-PER-01", "GE4-MAN-01", "GE4-APC-01", "GE4-TAP-01", "GE4-COM-01"], *T(*["Stage 4 Geography investigation %d" % n for n in range(1, 251)]))]),
"pdhpe": ("PDHPE", "pdhpe", "NSW PDHPE 7-10 Syllabus (2024)", 2, [U(1, 50, "Stage 4 PDHPE", ["PH4-MSS-01", "PH4-MSS-02", "PH4-SHP-01", "PH4-SMI-01", "PH4-SHW-01", "PH4-IPS-01", "PH4-RRL-01", "PH4-IBC-01"], *T(*["Stage 4 PDHPE focus %d" % n for n in range(1, 251)]))]),
"technology": ("Technology", "technology", "NSW Technology 7-8 Syllabus (2023)", 2, [U(1, 50, "Stage 4 Technology", ["TE4-SDP-01", "TE4-PDP-01", "TE4-MSC-01", "TE4-PPM-01", "TE4-DES-01", "TE4-SAF-01", "TE4-DIG-01", "TE4-DIG-02"], *T(*["Stage 4 Technology focus %d" % n for n in range(1, 251)]))]),
"visual_arts": ("Visual Arts", "vart", "NSW Visual Arts 7-10 Syllabus (2024)", 2, [U(1, 50, "Stage 4 Visual Arts", ["VA4-AMC-01", "VA4-AMV-01", "VA4-AMP-01", "VA4-CHC-01", "VA4-CHV-01", "VA4-CHP-01"], *T(*["Stage 4 Visual Arts studio focus %d" % n for n in range(1, 251)]))]),
"music": ("Music", "music", "NSW Music 7-10 Syllabus (2024)", 2, [U(1, 50, "Stage 4 Music", ["MU4-PER-01", "MU4-LIS-01", "MU4-COM-01"], *T(*["Stage 4 Music focus %d" % n for n in range(1, 251)]))]),
"drama": ("Drama", "drama", "NSW Drama 7-10 Syllabus (2023)", 2, [U(1, 50, "Stage 4 Drama", ["DR4-MAK-01", "DR4-PER-01", "DR4-APP-01"], *T(*["Stage 4 Drama focus %d" % n for n in range(1, 251)]))]),
"dance": ("Dance", "dance", "NSW Dance 7-10 Syllabus (2023)", 2, [U(1, 50, "Stage 4 Dance", ["DA4-PER-01", "DA4-COM-01", "DA4-APP-01"], *T(*["Stage 4 Dance focus %d" % n for n in range(1, 251)]))]),
"modern_languages": ("Modern Languages", "mlang", "NSW Modern Languages K-10 Syllabus (2022)", 2, [U(1, 50, "Stage 4 Modern Languages", ["ML4-INT-01", "ML4-UND-01", "ML4-CRT-01"], *T(*["Stage 4 Modern Languages focus %d" % n for n in range(1, 251)]))]),
"classical_languages": ("Classical Languages", "clang", "NSW Classical Languages K-10 Syllabus (2022)", 2, [U(1, 50, "Stage 4 Classical Languages", ["CL4-UND-01", "CL4-UND-02", "CL4-ICU-01"], *T(*["Stage 4 Classical Languages focus %d" % n for n in range(1, 251)]))]),
"aboriginal_languages": ("Aboriginal Languages", "alang", "NSW Aboriginal Languages K-10 Syllabus (2022)", 2, [U(1, 50, "Stage 4 Aboriginal Languages", [], *T(*["Stage 4 Aboriginal Languages focus %d" % n for n in range(1, 251)]))]),
"auslan": ("Auslan", "auslan", "NSW Auslan K-10 Syllabus (2023)", 2, [U(1, 50, "Stage 4 Auslan", ["AU4-INT-01", "AU4-UND-01", "AU4-CRE-01", "AU4-RLC-01"], *T(*["Stage 4 Auslan focus %d" % n for n in range(1, 251)]))]),
}

CORE_MINUTES = (60, 60, 60, 60, 45)

def _make(skey, week, slot, unit, codes, topic):
    area, prefix, source, per_week, _units = SUBJECTS[skey]
    codes = list(codes)
    if skey == "maths" and WORKING_MATHEMATICALLY not in codes:
        codes.append(WORKING_MATHEMATICALLY)
    if skey == "science":
        codes.extend(c for c in _WS if c not in codes)
    notes = {c: OUTCOMES[c] for c in codes}
    minutes = CORE_MINUTES[slot] if per_week == 5 else 45
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    steps = [{"icon": str(i), "title": "Part %d" % i, "explain": PLACEHOLDER, "example": "Example to be added.", "notice": "Key idea to be added.", "check": dict(_CHECK)} for i in range(1, 6 if per_week == 5 else 5)]
    return {"seed_key": "s4-%s-w%02d-l%d" % (prefix, week, slot + 1), "library": True, "stage": "S4", "year_level": "Stage 4", "learning_area": area, "subject": unit, "title": title, "child_mission": "Placeholder lesson: %s." % topic, "duration_minutes": minutes, "pass_mark": 0.9, "outcome_codes": codes, "outcome_notes": notes, "learning_intention": "We are learning about: %s." % topic, "success_criteria": ["I can explain the main idea of this lesson.", "I can use it in my own work.", "I can score 90% or more on the Quest check."], "key_vocabulary": [], "materials": ["Paper or notebook", "Pencil"], "prior_knowledge": "To be added.", "explicit_teaching": PLACEHOLDER, "teach_steps": steps, "worked_example": "To be added.", "guided_practice": "To be added.", "independent_task": "To be added.", "response_prompt": "Write or draw your answers in your notebook.", "self_check": "To be added.", "accessibility_notes": "To be added.", "interactive_activities": [], "sort_activity": None, "word_challenges": [], "steps": [], "resources": [], "quiz": [], "reflection_prompts": [], "evidence_instructions": "To be added.", "parent_notes": "PLACEHOLDER lesson. Not ready to teach. Practice lesson only.", "source_note": "Based on the %s. Planned focus is draft and must be checked before the lesson is written." % source, "offline_alternative": "To be added.", "extension": "To be added.", "follow_up_challenges": [], "is_placeholder": True}

LESSONS = []
for _skey, _spec in SUBJECTS.items():
    _area, _prefix, _source, _per_week, _units = _spec
    for _first, _last, _unit, _codes, _topics in _units:
        _n = 0
        for _week in range(_first, _last + 1):
            for _slot in range(_per_week):
                LESSONS.append(_make(_skey, _week, _slot, _unit, _codes, _topics[_n]))
                _n += 1

if __name__ == "__main__":
    keys = [lesson["seed_key"] for lesson in LESSONS]
    assert len(keys) == 1800 == len(set(keys)), len(keys)
    for skey, spec in SUBJECTS.items():
        area, prefix, source, per_week, units = spec
        own = [lesson for lesson in LESSONS if lesson["seed_key"].startswith("s4-%s-" % prefix)]
        titles = [lesson["title"] for lesson in own]
        assert len(own) == 50 * per_week, (skey, len(own))
        assert len(titles) == len(set(titles)), (skey, "repeated titles")
    print("OK: 1,800 distinct Stage 4 placeholder lessons")
