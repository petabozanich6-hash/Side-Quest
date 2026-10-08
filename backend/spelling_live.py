"""Spelling segments for the lessons that are currently live.

The lesson library was rebuilt, and the live Week 1 Lesson 1 uses the seed key
's2-eng-w01-l1-reading-expression'. The older spelling data in spelling_s2_w1.py
is keyed to other seed keys, so nothing was being attached and the spelling stage
never appeared. This module merges both sets and attaches `spelling` to any
lesson whose seed_key matches. It is safe to call more than once.
"""
from spelling_s2_w1 import SPELLING_W1, _w, _c

SPELLING_LIVE = {
    "s2-eng-w01-l1-reading-expression": {
        "focus": "Sounds and syllables",
        "teaching": (
            "A syllable is one beat in a word. Say the word and feel your chin drop: it drops once for each beat. "
            "Spell one syllable at a time and a long word becomes a few short ones.\n\n"
            "Reading and spelling use the same skill in opposite directions. When you read, you join the syllables. "
            "When you spell, you split the word back into syllables, write each chunk, then read the whole word back to check it."
        ),
        "words": [
            _w("wonderful", "won-der-ful", "three beats, and the ending is ful with one l"),
            _w("adventure", "ad-ven-ture", "three beats, and the ture at the end says cher"),
            _w("expression", "ex-pres-sion", "double s, and the sion says shun"),
            _w("excellent", "ex-cel-lent", "double l in the middle"),
            _w("remember", "re-mem-ber", "three beats, with an m in the middle"),
            _w("beautiful", "beau-ti-ful", "the beau at the start says byoo, and the ending is ful with one l"),
        ],
        "check": [
            _c("How many syllables are in 'beautiful'?", ["2", "3", "4"], 1, "beau-ti-ful has three beats."),
        ],
    },
}

ALL_SPELLING = {**SPELLING_W1, **SPELLING_LIVE}


def apply_spelling(lessons):
    """Attach a spelling object to every lesson that has matching content."""
    for lesson in lessons:
        data = ALL_SPELLING.get(lesson.get("seed_key"))
        if data:
            lesson["spelling"] = data
    return lessons
