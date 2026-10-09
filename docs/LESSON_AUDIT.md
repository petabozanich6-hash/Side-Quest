# Lesson audit (Stage 2 English): findings and status

Originally started 9 October 2026. Re-verified against the code on 9 October 2026 (Phase 0). Status: FRONT END VERIFIED, mostly resolved. Lesson content audit still to do.

The code wins over this document. If the code and this file disagree, trust the code and update this file.

## Why this audit exists

The live lessons were not good enough as a primary learning source. They needed much more comprehensive teaching, and parts did not make sense. Example: W9 L1 step 1 described a diagram and a graph that did not appear on the page.

## Phase 0 re-check (verified in the code)

Files read: frontend/src/pages/child/ChildLesson.jsx, frontend/src/components/shared/QuestTeach.jsx, frontend/src/components/shared/QuestVisual.jsx, backend/lesson_library_s2_english_w1_w2.py, backend/lesson_library_s2_english_w09_l1.py.

| # | Original finding | Status now | Evidence |
|---|---|---|---|
| 1 | No visuals on teach steps | FIXED, WORKS | QuestTeach.jsx renders step.visual_before under the explanation and step.visual inside the example box, using QuestVisual. build helper _step() accepts visual and visual_before. |
| 2 | worked_visuals | WORKS | ChildLesson.jsx renders lesson.worked_visuals in the worked example stage. build() accepts worked_visuals. |
| 3 | Inline SVG | WORKS | QuestVisual.jsx puts svg into a figure with dangerouslySetInnerHTML, with alt text and a caption. |
| 4 | guided_practice never shown | FIXED, WORKS | ChildLesson.jsx shows guided_practice (parent paragraphs removed) in its own stage. |
| 5 | Practice boxes mislabelled as the planner | PARTLY FIXED | ChildLesson.jsx reads planner_title and planner_intro, but build() does not set them. Without them the stage reads "Plan your work" and "Good writers plan first." Only W9 L1 relabels, by setting LESSON["planner_title"] and LESSON["planner_intro"] after build(). Every lesson must do this. |
| 6 | Line breaks lost | FIXED, WORKS | whitespace-pre-wrap is used for teach step text, worked example, guided practice and task text. |
| 7 | Parent text shown to child | FIXED, WORKS with a caveat | childText() in ChildLesson.jsx removes paragraphs starting with Parent, Parent note, Parent check, Grown-up or Grown up followed by a colon. Parent text worded any other way would still show. parent_check goes into parent_notes only. |
| 8 | Videos | WORKS | _video(title, vid, prompt, offline, chk) builds a watch link, a youtube-nocookie embed, a prompt note, an offline alternative and a check question. The child page shows the embed, the prompt and the check. All video IDs are unwatched unless a lesson says otherwise. |
| 9 | Pass mark | REPORTED, not changed | build() sets pass_mark 0.9. ChildLesson.jsx uses lesson.pass_mark or 0.9, and its submit message says 90% or more. A lesson can set its own pass_mark. Whether 90% is fair for Stage 2 is the parent's decision. |

Extra findings:
- Print view shows worked_visuals but not teach step visuals.
- build() hardcodes stage S2, learning area English, 60 minutes, generic six steps, "need 9 out of 10" and English-only parent notes. Maths and other subjects need their own builder.
- The planner stage needs at least 3 characters in every box, which blocks short numeric answers (for example 7).

## Still to do

- QuestActivities.jsx and SpellingSegment.jsx have not been read in Phase 0.
- Every lesson module from W1 L1 to W9 L2 (except the benchmark W9 L1) has not been audited for content: thin teaching, missing visuals, wrong facts, unverified videos, parent text in child fields, missing planner_title.
- Live page check of the benchmark lesson by the parent (rendering cannot be seen from the code).

## Audit table (one row per lesson)

| Lesson | Problems found | Priority |
|---|---|---|
| W9 L1 | Benchmark, approved by the parent. Videos not yet watched. | At standard |
| W9 L2 | Not re-read after the front-end fixes. Likely needs planner_title and visuals. | TO CHECK |
| W1 L1 to W8 L4 | Not yet read. | TO CHECK |

See docs/LESSON_TRACKER.md for the full list.
