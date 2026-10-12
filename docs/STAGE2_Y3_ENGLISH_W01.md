# Priority batch: Year 3 English Week 1

The parent has expanded the rebuild to **every lesson across every stage**, with **Stage 2 and Stage 4 first**. [The master register](LESSON_REBUILD_MASTER.md) records the full scope and priority order.

This batch completes the writing of Year 3 English Week 1 beside the approved gold Lesson 1. It replaces only Lessons 2–4; it does not change the gold or any Stage 3 row.

| Lesson | Content | Readable review |
|---|---|---|
| 1 | Approved Voice Detective gold | [Existing full lesson](GOLD_Y3_ENGLISH_W01_L1_REVIEW.md) |
| 2 | Clear information statements, complete ideas, marks and useful detail | [Read](stage2/s2-eng-y3-w01-l2.md) |
| 3 | Sounds, syllables, taught patterns and a spelling-check routine | [Read](stage2/s2-eng-y3-w01-l3.md) |
| 4 | Short story retelling, rehearsal and readable handwriting cues | [Read](stage2/s2-eng-y3-w01-l4.md) |

Each new lesson has four substantial teaching steps, modelled thinking, small tries with feedback, a complete model, guided practice, a 20-minute task, 8 MC + 2 written questions, one original internal episode, teaching SVGs and three specific hints for each generated stage. Lesson 3 also has a spelling segment. Lesson 4 distinguishes oral, handwritten and typed evidence; its simple joined-letter drawing is an illustrative practice model, not a complete prescribed handwriting alphabet.

## What was checked

- The actual Node lesson validator passed all three patches: required fields, checks, mixed quizzes, parent models, hints, SVG restrictions, episode shape/timing and per-statement budgets.
- The existing validator negative tests passed.
- The existing player/print logic checks passed.
- Every new SVG parsed as XML.
- Local SQLite reconstruction and migration simulation passed: exactly three targeted rows changed, all IDs and other rows were preserved, old optional activities were cleared, and content was stable when reapplied.
- Repository inventory reconstruction passed: 19,202 unique lesson rows, with current stage assignments and priority groups checked.

**Not checked:** production React build, live D1 state or quotas, actual child submission flow, real-device audio, visual rendering of the new diagrams or live Stuck helper interaction. No remote database mutation or deployment was performed. Merging files does not by itself apply their SQL.

## Usage check

Estimated rows written: **3**. Largest SQL statement: **26,671 bytes**.

## Commands, one at a time

Open the repository root in Terminal and check out the PR branch before running checks.

Validate this batch:

```sh
node scripts/validate-lessons.mjs worker/migrations/0046_s2_y3_english_w01_remaining.sql
```

Run the local SQL check:

```sh
python3 scripts/check-s2-week1-migration.py
```

Run existing validation/player checks:

```sh
node scripts/validate-lessons.test.mjs
```

```sh
node scripts/check-gold-ui.mjs
```

If checking the frontend build:

```sh
npm run build
```

Stop if a command reports an error.

## Apply only these three lessons when ready

1. Back up the remote database:

```sh
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Keep this file private.

2. Save the current recovery bookmark from the output:

```sh
npx wrangler d1 time-travel info sidequest-db1
```

3. Check that all three target rows exist. Expected result: **3**.

```sh
npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key IN ('s2-eng-y3-w01-l2', 's2-eng-y3-w01-l3', 's2-eng-y3-w01-l4');"
```

If the count differs, stop and inspect missing migrations rather than creating new IDs.

4. Apply only this migration file:

```sh
npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0046_s2_y3_english_w01_remaining.sql
```

Direct execute does not register migration history. A later normal migrations apply can rerun the same stable content patches. Avoid a blanket application of pending placeholder migrations for this review.

5. Find the new Year 3 English titles in the parent lesson list. Assign/open each from the child dashboard. The child route uses an assignment ID, not a seed key.

## Site checks

- At each stage, open Stuck → Help with this step and reveal its three hints. Move stages and confirm the new stage starts with its own first hint.
- Lessons 2 and 4: accept, teach0–teach3, learn, guided, write, quiz, submit. Lesson 3 additionally has spelling.
- Check each teaching try, then the scored check and progression.
- Play the internal episode with and without audio; read its transcript and resume after the pause prompt.
- Check diagrams at phone width. Review the handwriting drawing visually and preserve a child's familiar taught style when different.
- Complete both written quiz answers and verify they appear in the parent submission. The existing 90% rule requires 8/8 choices; written responses are manually reviewed.
- Use a typed-summary route for paper work. No photo or recording is required.
- For Lesson 4, only observed speaking demonstrates delivery and only a handwritten sample demonstrates the join practice.
- Print a lesson and confirm parent model answers are excluded.

## Undo

Paid-plan Time Travel provides **30 days** of point-in-time recovery.

If database recovery is required, use the pre-change bookmark:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

This restores the **whole database**, including unrelated changes since the bookmark. Keep the export too. Do not import a full export blindly over populated tables; restore into a separate empty database first if recovering selected rows. Reverting frontend files alone does not undo lesson data.

**Next priority batch: Stage 4 Year 7 English Week 1.** The Stage 3 work is preserved; all-stage authoring remains authorised.
