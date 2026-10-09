# Lesson audit (Stage 2 English): findings and fix plan

Started: 9 October 2026. Status: IN PROGRESS. Only the items marked VERIFIED were checked directly in the code. Anything marked TO CHECK has not been confirmed.

## Why this audit exists

The user says the live lessons are not good enough for a primary learning source. They need much more comprehensive teaching, and parts of them do not make sense. Example: W9 L1 step 1 says "A diagram shows the parts of an echidna. A graph shows how many people chose each animal. Notice: Read the words and the visuals together." but no diagram or graph appears on the page.

## Findings about the site (VERIFIED in the code)

Sources: backend/lesson_library_s2_english_w1_w2.py (build helpers) and frontend/src/pages/child/ChildLesson.jsx.

1. NO VISUALS. A teaching step has only text fields: explain, example, notice and a check question. There is no field for an image, SVG diagram or graph. Lessons that say "look at the diagram" show nothing. Videos and links are the only non-text resources.
2. THE PRACTICE TEXT IS NEVER SHOWN TO THE CHILD. ChildLesson.jsx does not render lesson.guided_practice at all. It only appears in the print view. Our lessons say "Type your answers in the practice boxes" inside that text, so the child never sees those instructions.
3. THE "PRACTICE BOXES" ARE ACTUALLY THE PLANNER. The practice_fields list passed to build() becomes planner_fields. These show as a stage called "Plan your work" with the intro "Good writers plan first. Fill in each box with a few words." Every box needs at least 3 characters before the child can continue. So Parts A to D, stage boxes and spelling boxes appear as a mislabelled planning stage. The same boxes are repeated under "Your plan" in the task stage.
4. LINE BREAKS ARE LOST. worked_example is shown in a plain div and independent_task is shown inside a list item, with no whitespace-pre-wrap. The blank lines and line breaks we wrote collapse, so long model pages and staged tasks appear as one run-on block. Only explicit_teaching (used when there are no teach steps) has whitespace-pre-wrap.
5. PARENT NOTES SHOW TO THE CHILD. In W9 L1 and L2 (and probably other lessons written the same way) the independent_task text ends with a "Parent: check ..." paragraph. The child sees it, because independent_task is displayed in the task stage.
6. THE MODEL PAGE IS TEXT ONLY. The echidna and koala model pages describe a diagram and a graph in words, so the child cannot see what is described.
7. PASS MARK. Lessons need 90% on the quiz, set by build(). Check that the quiz is fair for the age group.
8. build() adds a generic accessibility note and six generic steps to every lesson. TO CHECK: whether the child page uses lesson.steps at all (it appears to use teach_steps and fixed stages instead).

## Not yet read (TO CHECK next)

- frontend/src/components/shared/QuestTeach.jsx (how a teach step is shown; where an optional visual should go).
- QuestActivities.jsx (Planner, SortActivity, ChoiceSet, RevealCards) and SpellingSegment.jsx.
- Every lesson module from W1 L1 to W9 L2, for content problems (text that refers to things not on the page, thin teaching, wrong facts, unverified videos).

## Fix plan (needs the user's approval before the front-end work starts)

Stage A: make the site able to teach properly (front end and shared builder).
- Add an optional `visual` object to a teach step and to the model text: { type: "svg" or "image", svg or src, alt, caption }. Render it in QuestTeach.jsx and in the worked example.
- Show guided_practice to the child (a "Try it with help" stage), and add a separate field for real practice boxes with their own label, so Plan and Practice are not mixed up.
- Add whitespace-pre-wrap (or proper paragraph rendering) to worked_example, guided_practice and independent_task.
- Separate parent_check text from the child's task text, and show it only in the parent notes.
- Keep old lessons working (all new fields optional).

Stage B: rewrite lessons to the higher standard.
- Every step: rule, reason, worked example, common mistake and fix, check. Add a real visual wherever the text says "look at".
- Model walkthrough: I do, We do, You do. Main task with written success criteria. Parent check in parent notes only.
- Verify every fact. Attach only verified videos.
- Order: fix visual-dependent lessons first (W9 L1, W9 L2, W7 and W8 lessons that mention pictures, tables or layouts), then audit Weeks 1 to 6.

Stage C: audit table (one row per lesson: week, lesson, problems found, priority). To be filled as each lesson is read.

| Lesson | Problems found | Priority |
|---|---|---|
| W9 L1 | Describes visuals that are not shown (items 1, 6). Practice boxes mislabelled (3). Parent text shown to child (5). Teaching thin. | High |
| W9 L2 | Same site issues (1 to 6). Teaching is stronger. | High |
| W1 L1 to W8 L4 | Not yet read. | TO CHECK |

## Resume

Next action: read QuestTeach.jsx, QuestActivities.jsx and SpellingSegment.jsx, then ask the user to approve the Stage A front-end changes. Do not start rewriting lesson content until the site can show visuals, or the rewrite will have the same problem.
