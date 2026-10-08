"""Stage 2 Maths: 50-week placeholder lessons (250 lessons), generated from maths_s2_scope.SCOPE.
Source plan: docs/maths_stage2_scope.md.

Each week has 5 lessons: four of 60 minutes and one 45 minute consolidation lesson.
Even-numbered weeks end with a fortnightly mini exam in lesson 5 (assumption, mirrors English).
Every lesson also carries MAO-WM-01 (Working mathematically), the cross-stage process outcome.

TO BUILD A WEEK OUT: write a full module for that week, register it in lesson_library.py
LESSON_MODULES, and add the week number to BUILT_OUT_WEEKS below. The generator then skips
that week, so there are no duplicates.

This module is self-contained. It does not import the English builder, which hardcodes
learning_area English. Old lesson_library_s2_maths_w1.py and _w2.py are not registered.
"""
from maths_s2_scope import SCOPE, LESSON_MINUTES
from nsw_outcomes_stage2_maths import STAGE2_MATHS_OUTCOMES, WORKING_MATHEMATICALLY

BUILT_OUT_WEEKS = set()

SLOTS = ["Explore", "Build", "Apply", "Reason and solve", "Consolidate"]
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}


def _unit_for(week):
    for a, b, title, codes in SCOPE:
        if a <= week <= b:
            return a, b, title, codes
    raise ValueError(week)


def _codes_for(week, slot, codes):
    if len(codes) <= 4:
        return list(codes)
    return list(codes[slot * 4: slot * 4 + 4])


def _make(week, slot):
    a, b, unit, unit_codes = _unit_for(week)
    codes = _codes_for(week, slot, unit_codes)
    if WORKING_MATHEMATICALLY not in codes:
        codes.append(WORKING_MATHEMATICALLY)
    mini_exam = slot == 4 and week % 2 == 0
    slot_name = "Fortnightly mini exam" if mini_exam else SLOTS[slot]
    topic = "%s: %s" % (unit, slot_name)
    title = "Week %d, Lesson %d: %s" % (week, slot + 1, topic)
    minutes = LESSON_MINUTES[slot]
    steps = [{"icon": str(i), "title": "Part %d" % i, "explain": PLACEHOLDER, "example": "Example to be added.",
              "notice": "Key idea to be added.", "check": dict(_CHECK)} for i in range(1, 6)]
    steps.append({"icon": "6", "title": "Fluency practice", "explain": PLACEHOLDER + " Short number-fact fluency practice goes here.",
                  "example": "Example to be added.", "notice": "Little and often builds recall.", "check": dict(_CHECK)})
    return {
        "seed_key": "s2-maths-w%02d-l%d" % (week, slot + 1), "library": True, "stage": "S2", "year_level": "Stage 2",
        "learning_area": "Mathematics", "subject": unit, "title": title,
        "child_mission": "Placeholder lesson: %s." % topic, "duration_minutes": minutes, "pass_mark": 0.9,
        "outcome_codes": codes, "outcome_notes": {c: STAGE2_MATHS_OUTCOMES[c] for c in codes},
        "learning_intention": "We are learning about: %s." % topic,
        "success_criteria": ["I can explain the main idea of this lesson.", "I can use it to solve problems.",
                             "I can score 90% or more on the Quest check."],
        "key_vocabulary": [], "materials": ["Paper or notebook", "Pencil"], "prior_knowledge": "To be added.",
        "explicit_teaching": PLACEHOLDER, "teach_steps": steps, "worked_example": "To be added.",
        "guided_practice": "To be added.", "independent_task": "To be added.",
        "response_prompt": "Write your answers in your notebook.", "self_check": "To be added.",
        "accessibility_notes": "To be added.", "interactive_activities": [], "sort_activity": None,
        "word_challenges": [], "steps": [], "resources": [], "quiz": [],
        "reflection_prompts": [], "evidence_instructions": "To be added.",
        "parent_notes": "PLACEHOLDER lesson. Not ready to teach. Practice lesson only.",
        "source_note": "Outcome codes from the NSW Mathematics K-10 Syllabus (NESA 2022), Stage 2, checked on curriculum.nsw.edu.au.",
        "offline_alternative": "To be added.", "extension": "To be added.", "follow_up_challenges": [],
        "unit_weeks": [a, b], "is_placeholder": True, "is_mini_exam": mini_exam,
    }


LESSONS = []
for _w in range(1, 51):
    if _w in BUILT_OUT_WEEKS:
        continue
    for _slot in range(5):
        LESSONS.append(_make(_w, _slot))


if __name__ == "__main__":
    keys = [l["seed_key"] for l in LESSONS]
    assert len(keys) == len(set(keys)), "duplicate seed keys"
    assert len(LESSONS) == 250, len(LESSONS)
    assert all(WORKING_MATHEMATICALLY in l["outcome_codes"] for l in LESSONS)
    used = {c for l in LESSONS for c in l["outcome_codes"]}
    missing = set(STAGE2_MATHS_OUTCOMES) - used
    assert not missing, missing
    print("OK: 250 lessons, all 21 outcomes used")
