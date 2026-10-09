"""Quality checker for Side Quest lesson files.

Usage (from repo root):  python tools/check_lesson.py backend/lesson_library_s2_english_w09_l3.py
Exit code 0 = pass, 1 = fail. Prints every problem found.
Thresholds are tuned to W9 L1. Adjust the constants below if the standard changes.
"""
import importlib.util
import json
import os
import re
import sys

MIN_STEPS = 8
MIN_STEP_WORDS = 1500
MIN_EXPLICIT_WORDS = 900
QUIZ_LEN = 10
WORD_CHALLENGES = 8


def words(text):
    return len(re.findall(r"\b\w[\w'-]*\b", text))


def load(path):
    backend = os.path.join(os.path.dirname(os.path.abspath(path)))
    sys.path.insert(0, backend)
    spec = importlib.util.spec_from_file_location("lesson_under_test", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def check(path):
    problems = []
    src = open(path, encoding="utf-8").read()
    if "<<FILL" in src:
        problems.append("Template marker <<FILL still present")
    if "\u2014" in src:
        problems.append("Em dash found in file")
    if "no video attached" not in src.lower() and "_video(" not in src:
        problems.append("No videos and no 'no video attached' note in the docstring")
    try:
        mod = load(path)
    except Exception as e:
        return problems + [f"Import failed: {type(e).__name__}: {e}"]
    lesson = getattr(mod, "LESSON", None)
    if lesson is None:
        return problems + ["No LESSON object"]

    steps = lesson.get("teach_steps", [])
    if len(steps) < MIN_STEPS:
        problems.append(f"Only {len(steps)} teaching steps (need {MIN_STEPS}+)")
    step_words = words(json.dumps(steps, default=str))
    if step_words < MIN_STEP_WORDS:
        problems.append(f"Teaching steps total {step_words} words (need {MIN_STEP_WORDS}+)")
    if len(lesson.get("quiz", [])) != QUIZ_LEN:
        problems.append(f"Quiz has {len(lesson.get('quiz', []))} questions (need {QUIZ_LEN})")
    if len(lesson.get("word_challenges", [])) != WORD_CHALLENGES:
        problems.append(f"{len(lesson.get('word_challenges', []))} word challenges (need {WORD_CHALLENGES})")

    et = lesson.get("explicit_teaching", "")
    if words(et) < MIN_EXPLICIT_WORDS:
        problems.append(f"explicit_teaching is {words(et)} words (need {MIN_EXPLICIT_WORDS}+)")

    wv = lesson.get("worked_visuals", [])
    if not wv:
        problems.append("No worked_visuals")
    for i, v in enumerate(wv):
        svg = v.get("svg", "")
        if not (svg.startswith("<svg") and svg.endswith("</svg>")):
            problems.append(f"worked_visuals[{i}] is not a complete SVG")
        if len(v.get("alt", "")) < 40:
            problems.append(f"worked_visuals[{i}] alt text is too short")

    for key in ("parent_check", "spelling", "hoard_words", "spelling_focus", "planner_title"):
        if not lesson.get(key):
            problems.append(f"Missing or empty: {key}")
    sp = lesson.get("spelling", {})
    if isinstance(sp, dict) and len(sp.get("words", [])) != 6:
        problems.append("Spelling should list exactly 6 words")

    blob = json.dumps(lesson, default=str)
    if "TODO" in blob or "placeholder" in blob.lower():
        problems.append("TODO or placeholder text found in lesson data")
    return problems


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/check_lesson.py <lesson file> [more files]")
        sys.exit(2)
    failed = False
    for p in sys.argv[1:]:
        issues = check(p)
        if issues:
            failed = True
            print(f"FAIL {p}")
            for i in issues:
                print(f"  - {i}")
        else:
            print(f"PASS {p}")
    sys.exit(1 if failed else 0)
