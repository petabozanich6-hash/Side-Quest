"""Shared builder for fully written Stage 4 lessons.

Reuses the small helpers from the Stage 2 module (_q, _step, _sort, _wc, _video, _article) and
builds the same lesson dictionary shape as the Stage 4 placeholders, so a finished lesson with the same
seed_key replaces its placeholder. This module holds no lesson data and does not change LESSON_LIBRARY_VERSION.
"""
from lesson_library_s2_english_w1_w2 import _q, _step, _sort, _wc, _video, _article  # noqa: F401

ACCESS_S4 = (
    "Allow typing, dictation or handwriting on paper. Split the lesson into two sittings if needed: teaching and "
    "checks first, then the practice and independent task. Reduce the independent task to the first few stages if time "
    "is short, then return to the rest. Use a printed number line and a ruler for support. Pause any video as often as you like."
)


def build_s4(key, title, mission, subject, codes, notes, intention, criteria, vocab, materials, prior,
             teaching, steps, worked, guided, independent, response, selfcheck, quiz, evidence, extension, cards,
             resources, sort_activity, word_challenges, planner, mistakes, challenges, answer_key,
             area="Mathematics", minutes=60, source="NSW Mathematics K-10 Syllabus (NESA 2022), Stage 4",
             subject_name="Mathematics"):
    def mins(n):
        return max(1, round(n * minutes / 60))

    lesson = {
        "seed_key": key, "library": True, "stage": "S4", "year_level": "Stage 4", "learning_area": area,
        "subject": subject, "title": title, "child_mission": mission, "duration_minutes": minutes, "pass_mark": 0.9,
        "outcome_codes": codes, "outcome_notes": notes, "learning_intention": intention,
        "success_criteria": criteria + ["I can score 90% or more on the Quest check."],
        "key_vocabulary": vocab, "materials": materials, "prior_knowledge": prior,
        "explicit_teaching": teaching + "\n\nCommon mistakes to watch for:\n" + "\n".join("- " + m for m in mistakes),
        "teach_steps": steps, "worked_example": worked, "guided_practice": guided, "independent_task": independent,
        "response_prompt": response, "self_check": selfcheck, "accessibility_notes": ACCESS_S4,
        "interactive_activities": [{"type": "flip_cards", "title": "Quest Codex: key terms",
                                    "cards": [{"front": f, "back": b} for f, b in cards]}],
        "sort_activity": sort_activity, "word_challenges": word_challenges,
        "steps": [
            {"title": "Step 1: Accept the quest", "detail": "Read your mission and the learning goals.", "duration_minutes": mins(5)},
            {"title": "Step 2: Learn the map", "detail": "Work through the short teaching steps. Each has an explanation, an example and a quick check.", "duration_minutes": mins(20)},
            {"title": "Step 3: Practise the craft", "detail": "Flip the key-term cards, then complete the sorting activity and the word challenges.", "duration_minutes": mins(10)},
            {"title": "Step 4: Apply it", "detail": "Study the worked example, try the guided practice, then complete the independent task.", "duration_minutes": mins(15)},
            {"title": "Step 5: Quest check", "detail": "Answer the 10-question check. You need 9 out of 10.", "duration_minutes": mins(5)},
            {"title": "Step 6: Hand it in", "detail": "Check your work against the success criteria and submit your evidence.", "duration_minutes": mins(5)},
        ],
        "resources": resources, "quiz": quiz,
        "reflection_prompts": [],
        "evidence_instructions": evidence,
        "parent_notes": ("Practice lesson only. Quiz scores are formative; competency is decided by the fortnightly mini exam. "
                         "Check the independent task against the success criteria, and look for reasoning, not only answers.\n\n"
                         "Answer key for the guided practice and independent task:\n" + answer_key +
                         "\n\nVerify the outcome mapping against the current NESA " + subject_name + " syllabus."),
        "source_note": "Outcome codes from the " + source + ". Parent to verify alignment on curriculum.nsw.edu.au.",
        "offline_alternative": "Complete all written tasks on paper and read the questions aloud. Any video can be skipped if the worked example is read through carefully.",
        "extension": extension, "follow_up_challenges": challenges,
    }
    if planner:
        lesson["planner_fields"] = planner
    return lesson
