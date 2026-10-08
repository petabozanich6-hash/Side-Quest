"""Stage 2 placeholder lessons for Science and Technology, HSIE, PDHPE and Creative Arts.
50 weeks each, 2 lessons per week of 45 minutes (400 lessons in total).

SYLLABUSES. Every Stage 2 outcome below was read on curriculum.nsw.edu.au outcome pages (Oct 2026).
All four K-6 (2024) syllabuses are implemented from 2027:
  Science and Technology K-6 (2024): ST2-SCI-01, ST2-PQU-01, ST2-DAT-01, ST2-DDT-01, ST2-DDT-02.
  HSIE K-6 (2024): HS2-ACH-01, HS2-GEO-01, HS2-HIS-01.
  Creative Arts K-6 (2024): CA2-VIS-01, CA2-MUS-01, CA2-DRA-01, CA2-DAN-01.
  PDHPE K-6 (2024): PH2-MSP-01, PH2-RRS-01, PH2-RRS-02, PH2-IHW-01, PH2-SMI-01.
The older PD2-* codes (PDHPE K-10, 2018) are no longer used here.

Unit titles follow the NSW Department of Education sample Stage 2 units. They are placeholders and
will be refined when each week is built out.

TO BUILD A WEEK OUT: write a full module, register it in lesson_library.py LESSON_MODULES, and add
(subject_key, week) to BUILT_OUT below. The generator then skips it.
"""
BUILT_OUT = set()
LESSON_MINUTES = 45
LESSONS_PER_WEEK = 2
PLACEHOLDER = "PLACEHOLDER. Full teaching content for this lesson will be added later."
_CHECK = {"question": "Placeholder check: choose the first answer.", "options": ["Yes", "No"],
          "correct_index": 0, "explanation": "Placeholder only."}

OUTCOMES = {
    "ST2-SCI-01": "uses information to investigate the solar system and the effects of energy on living, physical and geological systems",
    "ST2-PQU-01": "poses questions to create fair tests that investigate the effects of energy on living things and physical systems",
    "ST2-DAT-01": "uses and interprets data to describe patterns and relationships",
    "ST2-DDT-01": "uses a design process to create products to address user needs or opportunities",
    "ST2-DDT-02": "designs and uses algorithms, represents data and uses digital systems for a purpose",
    "HS2-ACH-01": "describes Aboriginal Peoples' obligations to Country, Culture and Community",
    "HS2-GEO-01": "explains how people care for Australia's environments and participate in Australian society, using geographical information",
    "HS2-HIS-01": "explains how people lived in the past, how navigation connected the world, and what life was like in the Sydney Cove penal settlement, using sources as evidence",
    "CA2-VIS-01": "makes artworks using art forms to represent subject matter and ideas, and describes ways artists convey ideas about their world to audiences through artworks",
    "CA2-MUS-01": "performs, uses listening skills and composes to communicate musical ideas, and describes ways the elements of music are used to convey musical ideas",
    "CA2-DRA-01": "makes and performs drama to embody and enact characters, ideas and stories for an audience, and describes ways the dramatic elements are used to convey meaning",
    "CA2-DAN-01": "composes and performs dance to communicate ideas to an audience, and describes ways the elements of dance are used to convey ideas through movement",
    "PH2-MSP-01": "applies movement skills, strategies and teamwork in physical activities",
    "PH2-RRS-01": "describes and applies skills and strategies to strengthen respectful relationships",
    "PH2-RRS-02": "describes and applies skills and strategies to interact safely in offline and online contexts",
    "PH2-IHW-01": "explains how related factors influence identity, health and wellbeing",
    "PH2-SMI-01": "explains and applies self-management and interpersonal skills in a range of contexts",
}
_ALL_PH = ["PH2-MSP-01", "PH2-RRS-01", "PH2-RRS-02", "PH2-IHW-01", "PH2-SMI-01"]

_SCI = ("Science and Technology", "sci", "NSW Science and Technology K-6 Syllabus (2024)", [
    ("Living things, Earth's systems and energy", ["ST2-SCI-01", "ST2-PQU-01"]),
    ("Fair tests and data", ["ST2-PQU-01", "ST2-DAT-01"]),
    ("The solar system", ["ST2-SCI-01", "ST2-DAT-01"]),
    ("Design inspired by nature", ["ST2-DDT-01", "ST2-DAT-01"]),
    ("Algorithms and design for living beyond Earth", ["ST2-DDT-01", "ST2-DDT-02", "ST2-SCI-01", "ST2-PQU-01"]),
])
_HSIE = ("HSIE", "hsie", "NSW HSIE K-6 Syllabus (2024)", [
    ("Climate zones and geographical features", ["HS2-GEO-01"]),
    ("Connections to Country", ["HS2-ACH-01", "HS2-GEO-01"]),
    ("How people lived in the past", ["HS2-HIS-01"]),
    ("Navigation and Sydney Cove", ["HS2-HIS-01"]),
    ("Caring for Australia's environments", ["HS2-GEO-01", "HS2-ACH-01"]),
])
_PDHPE = ("PDHPE", "pdhpe", "NSW PDHPE K-6 Syllabus (2024)", [
    ("Identity, health and wellbeing", ["PH2-IHW-01", "PH2-SMI-01"]),
    ("Respectful relationships", ["PH2-RRS-01", "PH2-SMI-01"]),
    ("Movement skills, strategies and teamwork", ["PH2-MSP-01"]),
    ("Staying safe offline and online", ["PH2-RRS-02", "PH2-SMI-01"]),
    ("Review: health, movement and relationships", _ALL_PH),
])
_ARTS = ("Creative Arts", "arts", "NSW Creative Arts K-6 Syllabus (2024)", [
    ("Visual arts", ["CA2-VIS-01"]),
    ("Music", ["CA2-MUS-01"]),
    ("Drama", ["CA2-DRA-01"]),
    ("Dance", ["CA2-DAN-01"]),
    ("Arts showcase", ["CA2-VIS-01", "CA2-MUS-01", "CA2-DRA-01", "CA2-DAN-01"]),
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
        "outcome_codes": codes, "outcome_notes": {c: OUTCOMES[c] for c in codes},
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
        "source_note": "Outcome codes and wording from the %s, checked on curriculum.nsw.edu.au." % source,
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
    for skey, (area, prefix, source, units) in SUBJECTS.items():
        used = {c for _t, cs in units for c in cs}
        want = {c for c in OUTCOMES if c.split("-")[0] in {c2.split("-")[0] for c2 in used}}
        assert used == want, (skey, want ^ used)
    print("OK: 400 lessons, every Stage 2 outcome used")
