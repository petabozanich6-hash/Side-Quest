# Larger priority batch: 20 complete lessons

This review package combines Year 8 English Week 1 with Mathematics Week 1 for Years 3, 4, 7 and 8. It continues the every-stage rebuild with Stage 2 and Stage 4 first. There is no weekly authoring approval gate.

Every lesson includes complete explanations, modelled decisions, a small try with feedback, checks, a complete worked model with mistake/fix, guided practice, an independent task, reflection, parent models, offline alternative and extension. It preserves age-band reading level and task demands rather than copying primary teaching into secondary topics.

## Read every lesson

| Seed key | Lesson | Full stage-by-stage review |
|---|---|---|
| s4-eng-y8-w01-l1 | Year 8: Evaluate a narrator’s reliability | [Read](priority-batch/s4-eng-y8-w01-l1.md) |
| s4-eng-y8-w01-l2 | Year 8: Rewrite a scene from another perspective | [Read](priority-batch/s4-eng-y8-w01-l2.md) |
| s4-eng-y8-w01-l3 | Year 8: Control complex sentences and clauses | [Read](priority-batch/s4-eng-y8-w01-l3.md) |
| s4-eng-y8-w01-l4 | Year 8: Tell a story with deliberate perspective | [Read](priority-batch/s4-eng-y8-w01-l4.md) |
| s2-mat-y3-w01-l1 | Year 3: Read and count whole numbers | [Read](priority-batch/s2-mat-y3-w01-l1.md) |
| s2-mat-y3-w01-l2 | Year 3: Explain place value and partitions | [Read](priority-batch/s2-mat-y3-w01-l2.md) |
| s2-mat-y3-w01-l3 | Year 3: Compare and order whole numbers | [Read](priority-batch/s2-mat-y3-w01-l3.md) |
| s2-mat-y3-w01-l4 | Year 3: Whole-number fluency with reasons | [Read](priority-batch/s2-mat-y3-w01-l4.md) |
| s4-mat-y7-w01-l1 | Year 7: Represent positive and negative integers | [Read](priority-batch/s4-mat-y7-w01-l1.md) |
| s4-mat-y7-w01-l2 | Year 7: Order integers and justify comparisons | [Read](priority-batch/s4-mat-y7-w01-l2.md) |
| s4-mat-y7-w01-l3 | Year 7: Add integers as signed changes | [Read](priority-batch/s4-mat-y7-w01-l3.md) |
| s4-mat-y7-w01-l4 | Year 7: Integer fluency with checks | [Read](priority-batch/s4-mat-y7-w01-l4.md) |
| s2-mat-y4-w01-l1 | Year 4: Read and count whole numbers | [Read](priority-batch/s2-mat-y4-w01-l1.md) |
| s2-mat-y4-w01-l2 | Year 4: Explain place value and partitions | [Read](priority-batch/s2-mat-y4-w01-l2.md) |
| s2-mat-y4-w01-l3 | Year 4: Compare and order whole numbers | [Read](priority-batch/s2-mat-y4-w01-l3.md) |
| s2-mat-y4-w01-l4 | Year 4: Whole-number fluency with reasons | [Read](priority-batch/s2-mat-y4-w01-l4.md) |
| s4-mat-y8-w01-l1 | Year 8: Classify rational and irrational numbers | [Read](priority-batch/s4-mat-y8-w01-l1.md) |
| s4-mat-y8-w01-l2 | Year 8: Explain and estimate square roots | [Read](priority-batch/s4-mat-y8-w01-l2.md) |
| s4-mat-y8-w01-l3 | Year 8: Use scientific notation accurately | [Read](priority-batch/s4-mat-y8-w01-l3.md) |
| s4-mat-y8-w01-l4 | Year 8: Real-number fluency with checks | [Read](priority-batch/s4-mat-y8-w01-l4.md) |

## Teaching and media

Primary maths teaches place groups, zeroes, words, partitions, comparison and checking, with Year 3 working to 10,000 and Year 4 to 100,000. Year 7 teaches signed position, distance, ordering and addition. Year 8 teaches exact rational/irrational distinctions, roots and bounds, and scientific-notation conventions. Year 8 English uses original courtyard narratives to teach reliability, controlled perspective, complex clauses and oral storytelling.

There are 20 original in-site episodes, explanatory SVGs throughout, a perspective planner and one optional in-site storytelling cue organiser. The SQL contains 40 SVG instances, including reused diagrams beside the complete models. Two secondary review lessons have five teach steps; the other lessons have four. There are **203 generated stages and 609 stage hints**.

Year 3/4 quizzes: eight MC plus two written responses; unchanged 90% requires 8/8 scored choices. Year 7/8 quizzes: ten MC; unchanged 90% requires 9/10. Written reasoning is also reviewed in main tasks. Outcome codes are empty pending verified mapping; do not describe this as completed official outcome coverage.

No runtime AI, new paid service or external embed is introduced. No teaching or media was cut for cost. Lesson identity, ownership and assignments remain unchanged.

## Validation actually run

- Actual Node validation passed all 20 lesson schemas, quiz shapes/indexes, parent prefixes/models, exact stage hints, answer-leak checks, safe SVGs, episode structures and per-statement byte limits.
- Existing invalid-content and paid-usage regressions passed; player and print logic checks passed.
- Independent arithmetic/representation checks: **91**, including signed sums, place-value contributions, parsed number words, partition totals, exact fractions, square bounds and power-of-ten scales.
- All 40 SVG instances parsed as XML.
- Local SQLite applied exactly the intended 20 rows, preserved identities and all other rows, removed obsolete activities/coming_soon, and produced stable content on rerun.
- Repository inventory remains 19,202 unique identities. After this batch, 36 have new-standard authored content and 19,166 remain queued. This is not a live deployment count.

Not verified: production React build, phone visual layout, real-device audio, live D1 capacity or query timing, actual Stuck interactions or end-to-end submissions. No remote database change or deployment was performed.

## Usage check

Estimated rows written: **20**. Largest SQL statement: **30,203 bytes**.

## Commands from repository root

Run one at a time; stop on a reported error:

```sh
node scripts/validate-lessons.mjs worker/migrations/0049_priority_english_and_maths_batch.sql
```

```sh
python3 scripts/check-priority-bulk.py
```

```sh
node scripts/validate-lessons.test.mjs
```

```sh
node scripts/check-gold-ui.mjs
```

The local arithmetic/SQLite/SVG check uses Python lxml for XML parsing. Run your normal production build separately; it was not executed here.

## Back up, apply and preview when ready

Merging/building files does not itself apply lesson content to D1. Migration 0049 follows 0048 on checked main. Open PR #95 reserves 0043; policy PR #101 has no migration.

Before every live change, export and keep the file private:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Save the pre-change recovery bookmark:

```sh
npx wrangler d1 time-travel info sidequest-db1
```

Confirm exactly 20 matching rows before applying:

```sh
npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key IN ('s4-eng-y8-w01-l1', 's4-eng-y8-w01-l2', 's4-eng-y8-w01-l3', 's4-eng-y8-w01-l4', 's2-mat-y3-w01-l1', 's2-mat-y3-w01-l2', 's2-mat-y3-w01-l3', 's2-mat-y3-w01-l4', 's4-mat-y7-w01-l1', 's4-mat-y7-w01-l2', 's4-mat-y7-w01-l3', 's4-mat-y7-w01-l4', 's2-mat-y4-w01-l1', 's2-mat-y4-w01-l2', 's2-mat-y4-w01-l3', 's2-mat-y4-w01-l4', 's4-mat-y8-w01-l1', 's4-mat-y8-w01-l2', 's4-mat-y8-w01-l3', 's4-mat-y8-w01-l4');"
```

If the count differs, investigate missing migrations rather than inventing replacement identities. Check live capacity and command results against the technical limits: a statement at most 100,000 bytes, a row at most 2 MB, a database at most 10 GB and a query within 30 seconds. The source validator does not establish live capacity or timing.

Apply only this file:

```sh
npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0049_priority_english_and_maths_batch.sql
```

Direct execute does not register migration history. Later normal migration application can rerun these stable content patches. Do not apply unrelated pending placeholders for this review.

Find the new titles in the parent lesson list, assign a fresh lesson and open it from the child dashboard. The child route uses an assignment ID. Test each lesson before relying on the live result.

## Stuck and lesson-flow checks

Most lessons generate: accept, teach0, teach1, teach2, teach3, learn, guided, write, quiz, submit.

- Year 8 English Lesson 2 adds **plan** between guided and write.
- Year 7 Mathematics Lesson 4 and Year 8 Mathematics Lesson 4 add **teach4** before learn.
- No lesson in this batch generates spelling, sort, watch or words.

At **every generated stage**, open Stuck → Help with this step, reveal all three hints and compare them with the readable review. Check that the hints are specific, progress from nudge to method, and do not supply check/quiz answers. Change stage and confirm its first hint replaces the previous stage’s hint ladder.

Check bold teaching text, checks, episode captions/transcript and learner pause, diagrams at phone width, planner persistence and the optional cue organiser print. Test 7/8 then 8/8 on primary quizzes; test 8/10 then 9/10 on secondary quizzes. Confirm primary written quiz answers reach parent submissions. Printed child materials should omit parent model answers.

For oral tasks, distinguish a plan or solo practice record from observed speaking. A listener, recording or upload is optional; label the evidence actually produced.

## Undo

Paid-plan Time Travel provides **30 days** of point-in-time recovery. Use the saved pre-change bookmark:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

The restore affects the whole database, including intervening unrelated changes. Keep the export too. Do not import it blindly over populated tables; restore into a separate empty database first if recovering selected rows. Reverting code alone does not revert D1 lesson data.

Next: larger packages covering the priority stages’ remaining Week 1 subjects and electives, before later weeks. The full every-stage rebuild remains authorised; no new scope approval is needed.
