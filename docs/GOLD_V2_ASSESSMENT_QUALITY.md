# Gold v2 assessment quality gate

Automated validation can pass structurally complete lessons that still fail as assessments. This gate exists so weak quizzes cannot pass unnoticed.

See also:

- `docs/GOLD_V2_ASSESSMENT_QUALITY_AUDIT.md` — evidence from the October 2026 sample
- `docs/GOLD_V2_ASSESSMENT_QUALITY_REPAIR.md` — safe offline repair process

## Banned patterns

- Meta stems: “Which idea is taught…”, “Which feedback is most useful…”, “Which statement appeared…”
- Study-behaviour templates: “A learner is practising…”, “Which approach best shows understanding…”, “Which practice choice shows transfer…”, “Which habit strengthens evidence…”, and related generator stems listed in `validate.mjs` / `assessment_quiz.BANNED_STEM`
- Correct-answer concentration: more than half of MC items sharing one `correct_index`
- Duplicate option text within an item (exact, case-insensitive)
- Truncated MC options ending with ellipsis (`…` / `...`)
- Filler distractors: “Any answer is equally supported”, “Ignore the task and invent…”, “Copy the worked example and call it…”, “Choose randomly because any option…”
- Generic feedback: “The other choices avoid explaining the actual strategy.” / “The correct choice applies the lesson skill; the others use a common mistake…”
- Circular explanations that only restate the correct option
- Mechanical short-answer guides beginning `Require new…` / `Require a real…` / `Require independently…`
- Learning-area metadata that disagrees with the seed subject code (`s2-mat-` vs English, etc.)

## Required shape (Year 3–6 D1 Written Core; Stage 4 uses the same quiz shape with higher demand)

- ≥ 8 multiple-choice items assessing skill application / misconception / reasoning **on the lesson content**
- ≥ 2 short-answer items requiring new material and reasoning
- Varied correct-answer positions
- Parent models remain in `parent_notes` / `sample_answer` / `marking_guide` (server-redacted for children)

## Authoring path

- Prefer subject-specific items in builder specs (`assessment` list)
- Otherwise `assessment_quiz.build_skill_quiz` generates skill-focused items from lesson fields (maths calculation/reasoning; English textual evidence; science evidence/prediction; HSIE/PDHPE/Arts evidence moves; Stage 4 wording more demanding)
- Repair existing authored JSON **offline** with:

```sh
python3 scripts/gold-pipeline/repair_authored_assessments.py \
  --authored-dir /path/to/offline/authored --all-weak --dry-run
```

Do not bulk-repair a live authoring worktree without an explicit handoff (`--allow-live-authored`).

## Honest status

Passing this gate means **automatically validated**, not educationally reviewed, NESA verified, browser verified, or fully approved.
