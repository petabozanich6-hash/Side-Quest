# Year 5 English Week 1: complete lessons

This is the first completed subject-week in the all-Stage-3 rebuild. Scope of the whole rebuild: 1,280 repository-planned lessons. This batch authors **four**, with **1,276 still queued**. Read [the progress register](STAGE3_REBUILD_TRACKER.md) and [full inventory](STAGE3_REBUILD_INVENTORY.csv).

## Read the lessons

| Lesson | Focus | Full readable review |
|---|---|---|
| 1 | Plot goals, obstacles, choices, turning point and resolution | [Read](stage3/s3-eng-y5-w01-l1.md) |
| 2 | Plan and draft a connected narrative | [Read](stage3/s3-eng-y5-w01-l2.md) |
| 3 | Tense, cause/result links, references and verb-ending spelling | [Read](stage3/s3-eng-y5-w01-l3.md) |
| 4 | Select, prepare and rehearse an oral retelling with readable cues | [Read](stage3/s3-eng-y5-w01-l4.md) |

Each has four fully taught steps, a complete model, guided practice, an independent task, 8 MC + 2 written questions, internal original media and three hints for every generated stage. All texts are internal and original. Activities differ according to their learning purpose. Lesson 2 uses a planner; Lesson 3 has a spelling segment. No other year or subject is changed.

Exact outcome codes remain empty because the accessible official page did not establish the required Stage 3 code mapping. The content follows the repository's narrative unit, but this batch must not be presented as a fully verified syllabus-outcome map.

## Validation and limits

The source validator's pure functions were run in tool JavaScript. Four lessons and the four-statement migration passed schema, checks, quiz counts/types, parent model/prefix, hint keys/uniqueness/answer-leak, SVG safety, episode structure/timing, target seed and byte-limit checks. Eleven deliberately invalid variants were rejected.

**Not run:** Node CLI commands, SQLite/D1 execution, the full React build, real browser render, audio-device tests, live row count, live quota usage or end-to-end submission. The execution container was unavailable. Existing frontend support was already merged in #96; this batch changes lesson data, validation and documentation, not the player or helper.

The validator now checks **each SQL statement**, not the whole file, against the 95 KB authoring budget. A multi-lesson file can be larger than the D1 per-statement maximum while every statement remains within it. Added checks also validate spelling checks and flip-card structure.

Free-tier check:

- 4 lessons; **4 UPDATE statements**, one per lesson.
- File: **116,792 bytes**.
- Individual UPDATE statements (excluding initial comments): **29,140, 28,789, 29,502, 29,035 bytes**.
- Compact JSON per lesson: **26,254, 25,759, 26,196, 26,158 bytes**.
- One original in-site episode per lesson; small original SVG diagrams, each under 6 KB.
- No added dependencies, external embeds, paid services, uploaded PDFs or AI runtime calls.
- Existing indexed, unique seed keys are used. Actual D1 rows_read/rows_written and account-wide daily storage/usage have not been observed.
- Parent's D1 budgets remain 100,000 writes/day, 5 million reads/day and 5 GB total storage. The full rebuild is not applied in this batch.

## Commands, one at a time

Open the repository root folder in Terminal and use the PR branch.

Validate the four lessons:

```sh
node scripts/validate-lessons.mjs worker/migrations/0045_s3_y5_english_w01_complete.sql
```

Run the new batch checks:

```sh
node scripts/validate-stage3-batch.test.mjs
```

Run the existing validator checks:

```sh
node scripts/validate-lessons.test.mjs
```

Run a frontend build if you want to verify the existing lesson renderer in this checkout:

```sh
npm run build
```

Stop if a command reports an error. No deployment command was run by the assistant.

## Apply this subject-week when ready

Merging the PR brings files to main. It does **not** apply D1 lesson content by itself.

1. Export the remote backup:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Keep the backup private; it contains application data.

2. Save the current recovery bookmark from the output:

```sh
npx wrangler d1 time-travel info sidequest-db1
```

3. Confirm all four target rows exist. Expected count is **4**:

```sh
npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key IN ('s3-eng-y5-w01-l1', 's3-eng-y5-w01-l2', 's3-eng-y5-w01-l3', 's3-eng-y5-w01-l4');"
```

If the result is not 4, stop. Do not create replacement IDs or apply all placeholder migrations to fix that count without checking which migrations are missing.

4. Apply **only this file**:

```sh
npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0045_s3_y5_english_w01_complete.sql
```

Direct execute does not register the file in migration history. A later normal migration apply may rerun these content patches. They replace the same fields in place; they do not create lessons. Avoid a blanket migrations apply during this one-week review.

5. In the parent lesson list, find Year 5 English Week 1 Lessons 1–4 by the new titles. Assign one to a child, then open it from the child dashboard. The child route uses the assignment ID.

## Site checks

Check a new assignment for each lesson so previous local progress does not obscure stages.

- Read the teaching and try the checks. A correct check should unlock the next teaching stage.
- Play the internal episode, pause, use captions/transcript and resume after its prompt.
- Check diagrams at phone width.
- Open Stuck → Help with this step at each generated stage. Reveal all three hints, change stage and verify that the new stage's first hint appears.
- All lessons: accept, teach0–teach3, learn, guided, write, quiz, submit.
- Lesson 2 additionally: plan. Lesson 3 additionally: spelling.
- Enter both written quiz responses. Check that incomplete responses block checking and that completed responses appear in the parent submission.
- With the unchanged 90% rule, 7/8 choices fails and 8/8 passes; written answers remain manually reviewed.
- Use the typed-summary path if working on paper. No upload or recording is required.
- For Lesson 4, distinguish written planning evidence from actual oral delivery and handwritten-card evidence.
- Print one lesson and check that parent model answers are excluded.

## Undo

Reverting code does not revert lesson rows. Use the pre-change recovery bookmark if a database restore is required:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

That restores the **whole database**, including other changes since the bookmark. Keep the export too. Do not import a complete backup blindly over an already populated database; restore it to a separate empty database first before recovering selected rows.

Next queued subject-week: Year 5 Mathematics Week 1. The all-Stage-3 rebuild remains authorised.
