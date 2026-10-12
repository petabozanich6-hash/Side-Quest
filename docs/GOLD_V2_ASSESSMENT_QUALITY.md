# Gold v2 assessment quality gate

Automated validation can pass structurally complete lessons that still fail as assessments. This gate exists so weak quizzes cannot pass unnoticed.

## Banned patterns

- Meta stems: “Which idea is taught…”, “Which feedback is most useful…”, “Which statement appeared…”
- Correct-answer concentration: more than half of MC items sharing one `correct_index`
- Duplicate option text within an item (exact, case-insensitive)
- Filler distractors: “Any answer is equally supported”, “There is no need to compare…”
- Generic feedback: “The other choices avoid explaining the actual strategy.”

## Required shape (Year 3–6 D1 Written Core)

- ≥ 8 multiple-choice items assessing skill application / misconception / reasoning
- ≥ 2 short-answer items requiring new material and reasoning
- Varied correct-answer positions
- Parent models remain in `parent_notes` / `sample_answer` / `marking_guide` (server-redacted for children)

## Authoring path

- Prefer subject-specific items in builder specs (`assessment` list)
- Otherwise `assessment_quiz.build_skill_quiz` generates skill-focused items from lesson fields
- Repair existing authored JSON with `python3 scripts/gold-pipeline/repair_authored_assessments.py --all-weak`

## Honest status

Passing this gate means **automatically validated**, not educationally reviewed, NESA verified, browser verified, or fully approved.
