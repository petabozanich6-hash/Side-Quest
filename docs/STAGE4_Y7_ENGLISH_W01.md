# Priority batch: Year 7 English Week 1

This is the next subject-week in the authorised all-stage rebuild. Stage 2 and Stage 4 remain first priority. It authors four Year 7 lessons without changing any earlier lesson.

| Lesson | Focus | Full readable review |
|---|---|---|
| 1 | Setting effects, character inference, causal plot and evidence-based analysis | [Read](stage4/s4-eng-y7-w01-l1.md) |
| 2 | Purposeful story openings, detail, viewpoint and revision | [Read](stage4/s4-eng-y7-w01-l2.md) |
| 3 | Nouns, complete verb groups, sentence purpose and clause structures | [Read](stage4/s4-eng-y7-w01-l3.md) |
| 4 | Reading aloud, discussion preparation, evidence and reflection | [Read](stage4/s4-eng-y7-w01-l4.md) |

Each lesson is self-contained and original. Four teaching steps explain terms, model decisions, provide a small try with feedback and check understanding. A complete model, guided practice and a 25–30-minute independent task follow. Lesson 2 uses a three-field planner. Each includes one original internal episode, small teaching SVGs and exactly three specific hints per generated stage.

The Year 7 quizzes use **ten multiple-choice questions**, so the unchanged **90% threshold requires 9/10**. Written reasoning is reviewed in the independent task and reflection. This follows the approved Years 7–10 quiz rule; the younger 8 MC + 2 written mix applies to Years 3–6.

Exact outcome codes are empty pending verified Stage 4 mapping. The content follows the repository's Year 7 narrative unit, but should not be described as a completed official outcome map.

## What was actually checked

- The actual Node validator passed four lesson patches: required fields, checks, quiz shape/indexes, parent paragraphs, hint keys/uniqueness/leaks, SVG restrictions, episode shape/timing, exact seed targets and statement budgets.
- Existing validator invalid-content regression checks passed.
- Existing player and print logic regression checks passed.
- All new SVGs parsed as XML.
- Local SQLite reconstructed the repository's lessons and applied this batch. Exactly four target rows changed, all IDs and other rows were preserved, coming_soon and old optional fields were removed, and content was stable on reapplication.
- The inventory export reflected four new authored Stage 4 rows without adding or duplicating lesson identities.

**Not verified:** production React build, visual rendering of the new SVGs, phone layout, actual browser/device audio, live D1 data or quota usage, end-to-end submissions or live helper behaviour. No remote database mutation or deployment was run.

## Free-tier check

Migration **0047**, four lessons and **four UPDATE statements**, one per lesson. File **116,441 bytes**. Statements including adjacent comments: approximately **29,720**, **29,000**, **27,349**, **30,371 bytes**. Compact JSON: **26,532**, **25,900**, **24,365**, **27,399 bytes**. Every statement is below the authoring budget; the total multi-statement file may be larger than a single-statement limit. Each SVG is below 6 KB.

No new dependencies, paid services, uploaded PDFs, external embeds or runtime AI. Existing unique indexed seed keys are retained. Actual rows_read/rows_written and account-wide daily usage still need checking remotely. The full rebuild is not applied as one operation.

## Commands — repository root, one at a time

Check out this PR's branch before running checks.

```sh
node scripts/validate-lessons.mjs worker/migrations/0047_s4_y7_english_w01_complete.sql
```

```sh
python3 scripts/check-s4-week1-migration.py
```

```sh
node scripts/validate-lessons.test.mjs
```

```sh
node scripts/check-gold-ui.mjs
```

Build if you want to verify the existing renderer in this checkout:

```sh
npm run build
```

Stop if a command reports an error. The assistant did not run that production build.

## Apply only this subject-week when ready

Merging the PR and building the site do **not** apply D1 content automatically.

1. Export a backup:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Keep the backup private.

2. Save the recovery bookmark from the output:

```sh
npx wrangler d1 time-travel info sidequest-db1
```

3. Confirm four target rows exist. Expected count: **4**.

```sh
npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key IN ('s4-eng-y7-w01-l1', 's4-eng-y7-w01-l2', 's4-eng-y7-w01-l3', 's4-eng-y7-w01-l4');"
```

If the count differs, stop and inspect the missing program migrations; do not create new identities to work around it.

4. Apply just this file:

```sh
npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0047_s4_y7_english_w01_complete.sql
```

Direct execute does not record migration history. A later normal migration apply may repeat these stable content patches. Avoid applying all unrelated pending placeholders for this review.

5. Find the new Year 7 English Week 1 titles in the parent lesson list. Assign and open one from the child dashboard. The child route uses an assignment ID.

## Site checks

- Read the steps and try wrong then correct checks; progression should unlock when appropriate.
- Check the original episode with and without audio, its transcript, pause prompt and restart.
- Inspect the diagrams at phone width.
- At accept, teach0–teach3, learn, guided, write, quiz and submit, open Stuck → Help with this step. Reveal three hints and confirm a stage change resets to the new stage's first hint.
- Lesson 2 additionally has plan. Each planner response needs at least three characters; use meaningful notes rather than one-word labels.
- Try 8/10 quiz choices: it should fail. Retry with 9/10 or 10/10: it should pass.
- Keep written analysis, revision and reflection in the main-task text. No written quiz fields are expected in these ten-choice quizzes.
- Submit and verify the parent sees the task and reflection.
- For Lesson 4, record solo rehearsal versus observed reading or interaction. A written plan alone does not establish oral performance or active listening.
- Print one lesson and check the text/transcripts are present while parent model guidance is excluded.

## Undo

If database recovery is needed, use the saved pre-change bookmark:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

This restores the **whole database**, including unrelated changes after the bookmark. Keep the export too; do not import it blindly over populated tables. Reverting code alone does not restore lesson rows.

Next priority batch: **Stage 2, Year 4 English Week 1**, followed by Stage 4 Year 8 English Week 1, as recorded in the master queue.
