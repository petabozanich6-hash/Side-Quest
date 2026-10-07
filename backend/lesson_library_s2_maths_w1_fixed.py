"""Corrected Stage 2 Maths Week 1. Imports the original lessons and fixes four content errors in place.
Register WEEK_1_MATHS from THIS module (not lesson_library_s2_maths_w1) in lesson_library.py.
Fixes:
1. L1 Part A: confusing 'underlined digit ... 4_72 style' wording.
2. L2 sorter: 'the 4 in 3 241' was filed under Ones; the 4 is in the tens place.
3. L2 step 4: the check sum 3 000 + 1 200 + 40 + 5 = 4 245 did not match 4 325.
4. L4 worked example: left a visible '34? Careful:' self-correction.
Patches warn instead of raising if a target is not found, so the app still imports."""
import warnings

from lesson_library_s2_english_w1_w2 import _sort
from lesson_library_s2_maths_w1 import WEEK_1_MATHS as _ORIGINAL

_TEXT_FIXES = [
    ("Part A (value): write the value of the underlined digit: 4 in 4_72 style, written as: the 7 in 372, the 3 in 372, the 2 in 372, the 9 in 905.",
     "Part A (value): write the value of each digit named: the 7 in 372, the 3 in 372, the 2 in 372 and the 9 in 905."),
    ("Check: 3 000 + 1 200 + 40 + 5 is also 4 245.",
     "Check: 3 000 + 1 300 + 20 + 5 is also 4 325."),
    ("Option 2 rounding and adjusting: 63 - 30 = 33, add 1 back = 34? Careful: 28 is 2 less than 30, so I took away 2 too many and add 2 back: 33 + 2 = 35.",
     "Option 2 rounding and adjusting: 28 is 2 less than 30, so 63 - 30 = 33, then I add the 2 back: 33 + 2 = 35."),
]

_SORT_ARGS = ("Which place?", "In which place is the digit 4 in each number? Tap a place, then press Check.",
              ["Ones", "Tens", "Hundreds", "Thousands"])
_SORT_OLD = [("the 4 in 3 241", 0), ("the 4 in 2 054", 0), ("the 4 in 7 340", 1), ("the 4 in 1 642", 1),
             ("the 4 in 9 428", 2), ("the 4 in 5 401", 2), ("the 4 in 4 120", 3), ("the 4 in 4 953", 3)]
_SORT_NEW = [("the 4 in 3 241", 1)] + _SORT_OLD[1:]


def _sub(obj, old, new):
    count = 0
    if isinstance(obj, dict):
        items = list(obj.items())
    elif isinstance(obj, list):
        items = list(enumerate(obj))
    else:
        return 0
    for key, value in items:
        if isinstance(value, str):
            if old in value:
                obj[key] = value.replace(old, new)
                count += 1
        else:
            count += _sub(value, old, new)
    return count


def _apply():
    lessons = list(_ORIGINAL)
    for old, new in _TEXT_FIXES:
        if sum(_sub(lesson, old, new) for lesson in lessons) == 0:
            warnings.warn("Maths W1 patch target not found: " + old[:60])
    old_sorter, new_sorter = _sort(*_SORT_ARGS, _SORT_OLD), _sort(*_SORT_ARGS, _SORT_NEW)
    swapped = False
    for lesson in lessons:
        for key, value in list(lesson.items()):
            if value == old_sorter:
                lesson[key] = new_sorter
                swapped = True
    if not swapped:
        warnings.warn("Maths W1 L2 sorter target not found")
    return lessons


WEEK_1_MATHS = _apply()
