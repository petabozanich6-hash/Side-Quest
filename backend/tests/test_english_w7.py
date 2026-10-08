import importlib
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

MODULES = [
    "lesson_library_s2_english_w07_l1",
    "lesson_library_s2_english_w07_l2",
    "lesson_library_s2_english_w07_l3",
    "lesson_library_s2_english_w07_l4",
]
VALID = {
    "EN2-OLC-01", "EN2-REFLU-01", "EN2-RECOM-01", "EN2-VOCAB-01", "EN2-UARL-01", "EN2-CWT-01",
    "EN2-CWT-02", "EN2-CWT-03", "EN2-SPELL-01", "EN2-HANDW-01", "EN2-HANDW-02",
}
REQUIRED = [
    "seed_key", "library", "stage", "year_level", "learning_area", "subject", "title", "child_mission",
    "duration_minutes", "pass_mark", "outcome_codes", "outcome_notes", "learning_intention", "success_criteria",
    "key_vocabulary", "materials", "prior_knowledge", "explicit_teaching", "teach_steps", "worked_example",
    "guided_practice", "independent_task", "response_prompt", "self_check", "steps", "quiz", "evidence_instructions",
]


def _lessons_in(module):
    found = []
    for name in sorted(dir(module)):
        if name.startswith("_"):
            continue
        value = getattr(module, name)
        if isinstance(value, dict) and value.get("seed_key"):
            found.append(value)
    return found


def _all_lessons():
    lessons = []
    for name in MODULES:
        module = importlib.import_module(name)
        found = _lessons_in(module)
        assert len(found) == 1, (name, len(found))
        lessons.extend(found)
    return lessons


def test_week_7_has_four_unique_lessons():
    lessons = _all_lessons()
    keys = [l["seed_key"] for l in lessons]
    assert len(keys) == 4 and len(set(keys)) == 4
    for i, key in enumerate(keys, start=1):
        assert key.startswith("s2-eng-w07-l%d" % i), key


def test_week_7_lessons_are_well_formed():
    for lesson in _all_lessons():
        key = lesson["seed_key"]
        for field in REQUIRED:
            assert field in lesson, (key, field)
        assert set(lesson["outcome_codes"]) <= VALID, key
        assert set(lesson["outcome_notes"]) == set(lesson["outcome_codes"]), key
        assert sum(s["duration_minutes"] for s in lesson["steps"]) == lesson["duration_minutes"] == 60, key
        assert len(lesson["quiz"]) == 10, key
        checks = lesson["quiz"] + [s["check"] for s in lesson["teach_steps"]]
        for q in checks:
            assert 0 <= q["correct_index"] < len(q["options"]), (key, q)
            assert len(set(q["options"])) == len(q["options"]), (key, q)


def test_week_7_spelling_has_six_words():
    for lesson in _all_lessons():
        spelling = lesson.get("spelling")
        assert spelling, lesson["seed_key"]
        assert len(spelling["words"]) == 6, lesson["seed_key"]
        assert len(lesson.get("hoard_words", [])) == 6, lesson["seed_key"]


def test_week_7_registered_and_not_duplicated_by_placeholders():
    import lesson_library_s2_english_placeholders as placeholders
    assert 7 in placeholders.BUILT_OUT_WEEKS
    assert not [l for l in placeholders.LESSONS if l["seed_key"].startswith("s2-eng-w07-")]
    source = open(os.path.join(os.path.dirname(__file__), "..", "lesson_library.py")).read()
    for name in MODULES:
        assert '"%s"' % name in source, name
