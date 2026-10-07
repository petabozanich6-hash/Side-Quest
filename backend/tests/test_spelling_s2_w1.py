import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from lesson_library_s2_english_w1_w2 import WEEK_1  # noqa: E402
from spelling_s2_w1 import SPELLING_W1, apply_week1_spelling  # noqa: E402


def test_every_week1_lesson_has_spelling_content():
    keys = {lesson["seed_key"] for lesson in WEEK_1}
    assert keys == set(SPELLING_W1)


def test_apply_adds_spelling_object():
    lessons = apply_week1_spelling([dict(lesson) for lesson in WEEK_1])
    for lesson in lessons:
        assert "spelling" in lesson


def test_spelling_structure_is_valid():
    for key, sp in SPELLING_W1.items():
        assert sp["focus"], key
        assert len(sp["teaching"].split("\n\n")) >= 2, key
        assert 3 <= len(sp["words"]) <= 5, key
        for w in sp["words"]:
            assert w["word"] and w["parts"] and w["tip"], (key, w)
        words = [w["word"] for w in sp["words"]]
        assert len(words) == len(set(words)), key
        assert sp["check"], key
        for q in sp["check"]:
            assert 0 <= q["correct_index"] < len(q["options"]), (key, q)
            assert q["explanation"], (key, q)
