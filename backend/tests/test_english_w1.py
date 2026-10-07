import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from lesson_library_s2_english_w1_w2 import WEEK_1  # noqa: E402

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


def test_week_1_lessons_are_well_formed():
    keys = set()
    for lesson in WEEK_1:
        assert lesson["seed_key"] not in keys
        keys.add(lesson["seed_key"])
        for field in REQUIRED:
            assert field in lesson, (lesson["seed_key"], field)
        assert set(lesson["outcome_codes"]) <= VALID
        assert set(lesson["outcome_notes"]) == set(lesson["outcome_codes"])
        assert sum(s["duration_minutes"] for s in lesson["steps"]) == lesson["duration_minutes"] == 60
        assert len(lesson["quiz"]) == 10
        checks = lesson["quiz"] + [s["check"] for s in lesson["teach_steps"]]
        for q in checks:
            assert 0 <= q["correct_index"] < len(q["options"])
            assert len(set(q["options"])) == len(q["options"])
