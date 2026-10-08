"""Stage 2 placeholder lessons for Science and Technology, HSIE, PDHPE and Creative Arts.
50 weeks each, 2 lessons per week of 45 minutes (90 minutes a week per subject, about 6.3% of a
23.75 hour week; NESA K-6 advice is 6 to 10% for each of these areas). 400 lessons in total.

Outcome codes are the ones already in nsw_outcomes.py (ST2-*, GE2-*, HT2-1, PH2-1, VA2-1, MU2-1).
They are NOT yet verified against curriculum.nsw.edu.au, and the syllabus has more Stage 2 outcomes
than these (for example more Science and Technology and Creative Arts codes). Full coverage of every
Stage 2 code in these subjects still needs a verified code list, as was done for Maths.

TO BUILD A WEEK OUT: write a full module, register it in lesson_library.py LESSON_MODULES, and add
(subject_key, week) to BUILT_OUT below. The generator then skips it.
"""
BUILT_OUT = set()
LESSON_MINUTES = 45
LESSONS_PER_WEEK = 2
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}

# key: (learning area, key prefix, source, [(unit title, [codes], {code: description})] x 5 units of 10 weeks)
_SCI = ("Science and Technology", "sci", "NSW Science and Technology K-6 Syllabus", [
    ("Working scientifically", ["ST2-1WS-S"]),
    ("Living things", ["ST2-4LW-S", "ST2-1WS-S"]),
    ("Electrical circuits", ["ST2-7PW-T", "ST2-1WS-S"]),
    ("Investigations: question, plan, test", ["ST2-1WS-S"]),
    ("Living things and environments", ["ST2-4LW-S", "ST2-1WS-S"]),
])
_HSIE = ("HSIE", "hsie", "NSW Geography K-10 and History K-10 Syllabuses", [
    ("Features of places and environments", ["GE2-1"]),
    ("People, places and environments", ["GE2-2"]),
    ("Celebrations and commemorations", ["HT2-1"]),
    ("Places and environments in Australia", ["GE2-1", "GE2-2"]),
    ("Significant events and people", ["HT2-1"]),
])
_PDHPE = ("PDHPE", "pdhpe", "NSW PDHPE K-10 Syllabus", [
    ("Health, safety and wellbeing", ["PH2-1"]),
    ("Relationships and respect", ["PH2-1"]),
    ("Movement skills and games", ["PH2-1"]),
    ("Active lifestyles", ["PH2-1"]),
    ("Safe choices and decision making", ["PH2-1"]),
])
_ARTS = ("Creative Arts", "arts", "NSW Creative Arts K-6 Syllabus", [
    ("Visual arts: making and appreciating", ["VA2-1"]),
    ("Music: sing, play and move", ["MU2-1"]),
    ("Visual arts: materials and techniques", ["VA2-1"]),
    ("Music: rhythm and composing", ["MU2-1"]),
    ("Arts showcase", ["VA2-1", "MU2-1"]),
])
SUBJECTS = {"science": _SCI, "hsie": _HSIE, "pdhpe": _PDHPE, "arts": _ARTS}
SLOT_NAMES = ("Explore", "Create and apply")


def _make(skey, week, slot):
    area, prefix, source, units = SUBJECTS[skey]
    unit_title, unit_codes = units[(week - 1) // 10]
    week_in_unit = (week - 1) % 10 + 1
    codes = list(unit_codes)
    topic = "%s, week %d of 10: %s" % (unit_title, week_in_unit, SLOT_NAMES[slot])
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    steps = [{"icon": str(i), "title": "Part %d" % i, "explain": PLACEHOLDER, "example": "Example to be added.",
              "notice": "Key idea to be added.", "check": dict(_CHECK)} for i in range(1, 5)]
    return {
        "seed_key": "s2-%s-w%02d-l%d" % (prefix, week, slot + 1), "library": True, "stage": "S2",
        "year_level": "Stage 2", "learning_area": area, "subject": unit_title, "title": title,
        "child_mission": "Placeholder lesson: %s." % topic, "duration_minutes": LESSON_MINUTES, "pass_mark": 0.9,
        "outcome_codes": codes, "outcome_notes": {c: "Unit focus: " + unit_title for c in codes},
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
        "parent_notes": "PLACEHOLDER lesson. Not ready to teach. Practice lesson only.",
        "source_note": "Outcome codes from the %s. Codes not yet verified against curriculum.nsw.edu.au." % source,
        "offline_alternative": "To be added.", "extension": "To be added.", "follow_up_challenges": [],
        "is_placeholder": True,
    }


LESSONS = []
for _skey in SUBJECTS:
    for _w in range(1, 51):
        if (_skey, _w) in BUILT_OUT:
            continue
        for _slot in range(LESSONS_PER_WEEK):
            LESSONS.append(_make(_skey, _w, _slot))


if __name__ == "__main__":
    keys = [l["seed_key"] for l in LESSONS]
    assert len(keys) == len(set(keys)), "duplicate seed keys"
    assert len(LESSONS) == 400, len(LESSONS)
    print("OK: 400 lessons")
