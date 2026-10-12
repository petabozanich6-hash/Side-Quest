# Year 4 English Week 1: complete lessons

This completes authoring the next authorised subject-week, with Stage 2 and Stage 4 first. All four lessons teach the topic independently through explanation, modelled thinking, a small try and feedback, a check, a complete worked model, guided practice and a main task. Each is about 60 minutes, with a 20–25-minute task.

| Lesson | Focus | Read stage by stage |
|---|---|---|
| 1 | Narrative connections, event versus telling order, flashback, opening effects | [Story Tracker](stage2/s2-eng-y4-w01-l1.md) |
| 2 | Gentle suspense, fair clue, purposeful pace, reveal, resolution and revision | [Suspense Writer](stage2/s2-eng-y4-w01-l2.md) |
| 3 | Identifying relative clauses, y-to-i and one-syllable doubling patterns | [Sentence Editor](stage2/s2-eng-y4-w01-l3.md) |
| 4 | Connected oral retelling, cues, delivery, rehearsal and honest evidence | [Storyteller](stage2/s2-eng-y4-w01-l4.md) |

Includes four internal original episodes, eight explanatory SVGs, a three-box writing planner in Lesson 2, spelling practice in Lesson 3 and an optional in-site storytelling cue sheet in Lesson 4. All texts, models and activities are stored in the lesson. No new service or dependency is introduced.

Each quiz has eight multiple-choice and two written questions. The unchanged 90% threshold requires **8/8 scored answers**; the two written responses are reviewed manually. Outcome codes remain empty pending verified mapping. Oral preparation is distinguished from observed performance; no listener, recording or upload is required.

## Validation

Actual Node validation passed the four lessons, SQL targets and statement sizes. Existing invalid-content, Stage 3 batch, paid-usage and player/print logic checks passed. Local SQLite applied exactly four target rows, preserved IDs and all other rows, cleared obsolete activities and coming_soon, and produced stable content when rerun. All eight SVGs parsed as XML. The inventory remains 19,202 unique rows.

Not verified: production React build, actual device audio, visual phone layout, live D1 capacity/query duration/data, live helper interactions or end-to-end submission. No deployment or remote database mutation was performed.

## Usage check

Estimated rows written: **4**. Largest SQL statement: **29,601 bytes**.

## Validate locally

From the repository root, run one command at a time:

```sh
node scripts/validate-lessons.mjs worker/migrations/0048_s2_y4_english_w01_complete.sql
```

```sh
python3 scripts/check-y4-week1-migration.py
```

```sh
node scripts/validate-lessons.test.mjs
```

```sh
node scripts/check-gold-ui.mjs
```

The SQLite check uses Python lxml to parse SVGs. It never contacts Cloudflare. Run your usual production build separately; that was not executed here.

## Apply and preview when ready

Merging or building brings code files to main; it does not apply D1 lesson content by itself. Migration 0048 is unused on the checked main branch; open PR #95 reserves 0043. The paid-policy correction in PR #101 has no migration.

Before every live change, export a private backup:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Save the current recovery bookmark:

```sh
npx wrangler d1 time-travel info sidequest-db1
```

Confirm the four target rows exist. Expected matching_rows: **4**.

```sh
npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key IN ('s2-eng-y4-w01-l1','s2-eng-y4-w01-l2','s2-eng-y4-w01-l3','s2-eng-y4-w01-l4');"
```

If the count differs, investigate before applying; do not create replacement identities. Check live database capacity and execution results against the technical limits in the paid-policy brief. Apply only this file:

```sh
npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0048_s2_y4_english_w01_complete.sql
```

Direct execute does not record migration history. Later normal migration application can rerun these stable content patches. Do not apply unrelated pending placeholder migrations for this one-week review.

In the parent lesson list, open Year 4 English Week 1 by the new titles above, assign each lesson and open it from the child dashboard. The child route uses the assignment ID.

## Test Stuck at every stage

Use a fresh assignment so saved progress does not obscure stages. Every stage below has exactly three distinct lesson-specific hints: **42 stages, 126 hints** in total.

| Lesson | Generated stage keys |
|---|---|
| 1 | accept, teach0, teach1, teach2, teach3, learn, guided, write, quiz, submit |
| 2 | accept, teach0, teach1, teach2, teach3, learn, guided, plan, write, quiz, submit |
| 3 | accept, teach0, teach1, teach2, teach3, learn, spelling, guided, write, quiz, submit |
| 4 | accept, teach0, teach1, teach2, teach3, learn, guided, write, quiz, submit |

At each stage, open **Stuck → Help with this step**, reveal all three hints and compare with the readable review. Confirm the first is a nudge, the next breaks down the step, and the third gives a method or partial opening. Check that no check or quiz answer is supplied. Move to another stage and confirm it starts at that stage’s first hint.

Also check teaching bold text and checks, captions/transcript and learner pauses, SVG legibility at phone width, Lesson 2 planner persistence, Lesson 3 spelling, and Lesson 4 cue-sheet printing. Test 7/8 then 8/8 scored answers. Enter both written responses and confirm they reach parent review with the main task and reflection. Check printed child material excludes parent model answers. Oral performance should only be recorded as observed if someone actually observed or recorded it.

## Undo

Workers Paid Time Travel provides **30 days** of point-in-time recovery. Restore with the saved pre-change bookmark:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

This restores the whole database, including unrelated intervening changes. Keep the export private. Do not import it blindly over populated tables; restore to a separate empty database first if selected-row recovery is needed. Reverting code alone does not revert lesson rows.

Next priority batch: **Stage 4, Year 8 English Week 1**, then Stage 2/4 Mathematics in the agreed alternation. The every-stage scope remains authorised.
