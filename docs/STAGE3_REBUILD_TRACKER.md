# Stage 3 rebuild register

**Priority update:** The parent now requests every lesson across every stage, with Stage 2 and Stage 4 first. [The master register](LESSON_REBUILD_MASTER.md) controls the build order. Keep the Stage 3 inventory and four authored lessons; pause its former next batch while priority work proceeds.

The parent approved the deeper gold lesson and authorised the same teaching depth for **every Stage 3 lesson**. Scope: Years 5 and 6, every subject in the repository. Approved Lesson Standard v2 remains unchanged.

## Scope and source

The repository plans contain **1,280 unique seed keys** and **480 subject-week batches**. This is a repository inventory, not a live D1 count. Sources: `worker/migrations/0037_s3_program.sql` and `worker/migrations/0013_s3_maths_program.sql`.

| Subject | Year 5 | Year 6 | Total |
|---|---:|---:|---:|
| English | 160 | 160 | 320 |
| Mathematics | 160 | 160 | 320 |
| Science and Technology | 80 | 80 | 160 |
| HSIE | 80 | 80 | 160 |
| PDHPE | 80 | 80 | 160 |
| Creative Arts | 80 | 80 | 160 |
| **Total** | **640** | **640** | **1,280** |

[Complete per-lesson inventory](STAGE3_REBUILD_INVENTORY.csv) lists seed keys, original focus, role and status. `authored_in_pr` does not mean merged, deployed, syllabus mapping approved or taught.

## Current progress

- Authored in this batch: **4 / 1,280** (Year 5 English Week 1).
- Remaining to author: **1,276**.
- Migration: `0045_s3_y5_english_w01_complete.sql`.
- Main's latest existing migration at start: 0044; open PR #95 reserves 0043.
- New PRs target **main directly**, not another feature branch.
- Do not rewrite the approved gold lesson or regenerate old migrations.

## Teaching depth to preserve

Each lesson teaches a beginner at its own year level. Within each of the four teaching steps, explain the rule and its purpose, model the thinking, compare examples where useful, provide a small try with feedback, then check understanding. The complete model is followed by guided practice and an independent task with clear response instructions. Keep each paragraph manageable; extra words alone are not a quality standard.

Do not assume earlier lessons were completed: include any text, definition or prerequisite needed for the current task. Increase sophistication for Years 5 and 6 through evidence, explanation, purposeful choices and revision.

Standard v2 requirements include internal original episodes/SVGs where useful; no runtime AI or external embeds; 8 MC + 2 written questions; existing 90% pass mark; exactly three specific hints for every generated stage; parent guidance/evidence; review status; verified outcome codes or an empty array.

Cultural, language and Aboriginal and Torres Strait Islander content follows the parent's review rules. Check subject facts and source mapping at authoring time; placeholder titles do not establish complete syllabus coverage.

## Batch order

Default order is week-first within each year: English, Mathematics, Science and Technology, HSIE, PDHPE, Creative Arts. Complete Year 5 weeks 1–40, then Year 6 weeks 1–40, unless the parent steers the order. This does not reduce the all-Stage-3 scope.

**Next within Stage 3 when its turn resumes: Year 5 Mathematics Week 1, four lessons.**

1. `s3-mat-y5-w01-l1` — Reading and writing numbers to the millions.
2. `s3-mat-y5-w01-l2` — Place value charts and expanded form.
3. `s3-mat-y5-w01-l3` — Comparing and ordering large numbers.
4. `s3-mat-y5-w01-l4` — Number sense warm-ups and fluency.

## Continuing safely

Read this register, the inventory, current renderer and latest migration/PR numbering before the next batch. Reuse the approved depth, not the Year 3 topic or reading level. Author original subject-specific content; do not fill the queue by cloning one generic lesson.

Each PR can combine multiple subject-weeks, up to 50 lessons per migration, with one UPDATE per lesson or two (text then media) for lessons over about 90 KB; every statement must be at most 100,000 bytes. Complete arrays replace old arrays. Preserve seed keys, row IDs and assignments. Include readable reviews, actual validation results, a brief Usage check (estimated rows written and largest statement size) and beginner backup/apply/undo instructions.

This environment had no execution container for this batch. The validator's pure functions were run in tool JavaScript; Node CLI, SQLite, React build and browser interactions were not run. Do not copy an earlier batch's testing claims.

The parent has authorised the full rebuild. Do not ask for the scope again. Keep the register and inventory honest as batches are authored, reviewed and merged; never mark the entire stage complete from one week's progress.

The [paid-plan usage policy](LESSON_USAGE_POLICY.md) controls usage wording and technical limits; there is no daily lesson quota.
