# Preview and review the one gold lesson

This is Step 2 only. No other lesson has been rewritten. Main has not been changed and nothing has been deployed or applied to your remote database by the assistant.

Read [the complete lesson, stage by stage](GOLD_Y3_ENGLISH_W01_L1_REVIEW.md) first. It includes both episode scripts, diagrams described in words, every quiz question, reviewer answers and all 30 hints.

## Teaching revision after the parent’s first review

The four-step structure and quiz remain unchanged. Each step now teaches the idea, explains why it helps a listener, shows the reading decision in numbered thinking, contrasts useful and unhelpful approaches, and gives a new small oral try with feedback. The lesson also explains quotation marks and narrator/character words before asking the child to read dialogue, models pace, volume and pitch separately, compares different word stresses, and teaches how to identify and fix one reading problem.

The whole-text model now shows every decision, including a fully marked reading. Guided practice moves through five small attempts with comparison suggestions and a final reflection starter. The independent task has four response labels so the child knows what to write. The time estimate is 60 minutes; take breaks and resume saved progress if needed. This is a deeper version of the same gold lesson, not a change to Approved Standard v2.

## What the technical checks resolved

- Main was at `067e591d335d7593cba0356333f33e76ee9084c7`; highest migration 0042. Open PR #95 uses 0043. Gold uses **0044**.
- There are two historical 0013 files. They have not been renamed or edited.
- `seed_key` is unique in the repository schema. The UPDATE keeps row identity, ownership, assignments and unit metadata, supplies complete replacement arrays, deletes obsolete content fields with JSON merge-patch nulls, and updates the row title as well as the JSON title.
- The spelling override in `worker/src/data/spelling.ts` does not match `s2-eng-y3-w01-l1`, so it will not silently add an unplanned spelling stage.
- PR #95's QuestVisual diff retains the original SVG/image renderer. Its original player has timer and seeking problems, and CSS animation can override the character's positioning transform. This gold PR includes a corrected version of those two player files, with explicit pause points and local-device voices only. PR #95's **0043 Lesson 2 migration is not included**. Leave that PR unmerged during gold review; its old player changes overlap this PR.
- The child quiz previously hid short answers. It now displays them, requires a response before checking, saves them with local progress and adds them to the submitted work. It does not automatically score written answers. **90% of eight scored questions means 8/8**, with retries. This retains the approved standard and existing scoring method.
- Bold key terms now render safely as bold in teaching explanations. A generic worked-example label replaces the story-only label.
- The print flow includes teaching steps, episode transcripts, the task, an optional recording sheet and unanswered quiz questions. It escapes plain text and leaves parent-only model answers out.
- The step helper is in its own earlier PR: **#96**. It takes the displayed stage key/title, puts Help with this step first when valid hints exist and resets the selected topic/hint depth when the stage changes. Other existing behaviour is retained.
- R2 uploads are unconfigured in the current Wrangler config. The task therefore has a typed-summary route and does not require a photo or recording.

## Checks actually run

These were local checks, not a deployed-app test:

- Gold JSON/schema, teach checks, 8+2 quiz shape, index ranges, parent prefix, hint completeness/uniqueness and exact correct-option leaks, SVG restrictions, episode structure and estimated timing, no external media, and size budget: passed.
- Fifteen invalid-content regression cases, including missing hints, wrong indexes, answer leaks, scripts inside SVG, external embeds and missing written models: passed.
- SQLite simulation against the repository's lessons schema and existing 0013 lesson: passed. IDs and metadata preserved, old activities removed, the other lesson left unchanged, repeated content stable.
- Actual player logic under simulated timers: speech watchdog cleared on completion, seeking pauses safely, pause points resume, remote voices rejected: passed.
- Print content: teaching and transcripts present, parent answers absent, injected titles escaped: passed.

**Not verified:** production React build, real DOM rendering, phone layout, real speech timing/voice availability, live D1 row contents, full application submission flow, live usage or the helper on an actual signed-in child account. No deployment or remote database mutation was performed.

## Usage check

Estimated rows written: **1**. Largest SQL statement: **40,145 bytes**.

## Before opening the app

Use the repository root folder in Terminal. Run one command at a time and stop if one reports an error.

1. Check out the gold PR branch:

   ```sh
   git fetch origin
   git switch feature/gold-y3-english-w01-l1-v2
   ```

2. Validate the gold migration:

   ```sh
   node scripts/validate-lessons.mjs worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql
   ```

3. Run the validator regression checks:

   ```sh
   node scripts/validate-lessons.test.mjs
   ```

4. Run the player/print logic checks:

   ```sh
   node scripts/check-gold-ui.mjs
   ```

5. Optionally run the local SQL simulation (Python 3 is needed):

   ```sh
   python3 scripts/check-gold-migration.py
   ```

6. Check the production frontend build:

   ```sh
   npm run build
   ```

   This installs the repository's existing free frontend packages. The assistant has not run this build.

## Preview before changing the live database

The gold PR is stacked on the helper branch, so its checkout includes #96 for combined review. Its PR diff excludes those earlier helper changes. Merge #96 first only when you are ready; the gold PR can then target main.

For a Cloudflare PR preview, confirm the frontend includes both PRs. A frontend preview alone does **not** apply lesson SQL. The current config has no dedicated preview D1 binding; do not assume a preview URL has an isolated database. Use the readable lesson document until you have confirmed where that preview's data comes from.

To preview the lesson on your existing site, the corrected frontend and helper need to be deployed, and the one lesson SQL needs to be applied. These are actions for you after review; the assistant has done neither.

## Apply only this lesson when you are ready

1. Export the remote backup before changing data:

   ```sh
   npx wrangler d1 export sidequest-db1 --remote --output backup.sql
   ```

   Keep this file private; it contains application data.

2. Save the current recovery bookmark from this command's output:

   ```sh
   npx wrangler d1 time-travel info sidequest-db1
   ```

3. Confirm the target row exists. The result must be **1** before continuing:

   ```sh
   npx wrangler d1 execute sidequest-db1 --remote --command "SELECT COUNT(*) AS matching_rows FROM lessons WHERE seed_key = 's2-eng-y3-w01-l1';"
   ```

4. Apply just the gold lesson file:

   ```sh
   npx wrangler d1 execute sidequest-db1 --remote --file worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql
   ```

   This intentionally avoids running every pending migration. Direct `d1 execute` does not register 0044 in the migration-history table. A later normal `migrations apply` can therefore run this lesson again; its content is stable on rerun, but the timestamp changes. Do not run a blanket migration apply as part of this one-lesson review.

5. Verify the updated title and cleared placeholder flag:

   ```sh
   npx wrangler d1 execute sidequest-db1 --remote --command "SELECT id, title, json_extract(data, '$.coming_soon') AS coming_soon, json_array_length(json_extract(data, '$.teach_steps')) AS teaching_steps, json_array_length(json_extract(data, '$.quiz')) AS quiz_questions FROM lessons WHERE seed_key = 's2-eng-y3-w01-l1';"
   ```

   Expected: the Voice Detective title, a null coming_soon value, 4 teaching steps and 10 quiz questions.

6. In the parent lesson list, find **Reading with expression: The Voice Detective**, Stage 2 English Year 3 Week 1 Lesson 1. Assign it to the child if it is not already assigned. Open it from the child's dashboard. The child URL uses the **assignment ID**, not the seed key.

## Check every stage's Stuck helper

Use a fresh test assignment so old saved progress does not hide the steps. At each stage, open **Stuck?**, choose **Help with this step**, then reveal hints 1, 2 and 3. Confirm each is different, calm, specific to that stage and does not reveal a check or quiz answer. Move to the next stage and reopen help: it must show the new stage title and begin with hint 1. Check a lesson without stage_hints too; its original help topics should remain.

| Stage key | Stage title | What the hints should focus on |
|---|---|---|
| accept | Accept the quest | Mission, sequence and materials |
| teach0 | Find the meaning first | Feeling clues in the words |
| teach1 | Pause without breaking the meaning | Punctuation and word groups |
| teach2 | Choose a voice that fits | Speaking clues and voice tools |
| teach3 | Stress a word, then reread | Clear words and one improvement |
| learn | Put it all together | Model plan and tool cards |
| guided | Try it with help | Ben's line and the sentence starter |
| write | Do the task | First clue and beginning a response |
| quiz | Quest check | Method and revisiting teaching, never answers |
| submit | Hand it in | Evidence, reflection and sending for review |

Also check:

- Both episodes Play, Pause, Back, Next and Restart. Test audio off and with no local voice: captions/transcripts must still work. Confirm the final prompt pauses until Play is pressed.
- Read the diagrams on a phone-width screen. Confirm letters remain readable and meaning does not depend on colour.
- Try a wrong teaching answer, then a correct one; progression should unlock only after the correct choice.
- Flip all four cards. Check the guided stage and typed task route.
- Enter both written quiz answers. Leave one blank once: checking should remain disabled. Try 7/8 correct: it should fail. Retry with 8/8: it should pass. The written answers should survive a reload and appear in the parent submission.
- Use Print at Hand it in; verify the reading sheet has writing space, transcripts are readable and parent model answers are absent.
- Submit and check the parent sees the reading plan, reflection and questions 9–10 answers.

## Undo

Reverting the frontend PR does not undo D1 lesson data. For database recovery, use the saved bookmark:

```sh
npx wrangler d1 time-travel restore sidequest-db1 --bookmark YOUR_SAVED_BOOKMARK
```

Replace the last part with the real bookmark saved before applying the lesson. Time Travel restores the **whole database** to that point, including unrelated changes made since then, so review the command's confirmation carefully. See [Cloudflare Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/). Paid-plan Time Travel provides **30 days** of point-in-time recovery; keep `backup.sql` as the durable backup. Do not blindly import a full export over an existing populated database. If using the export instead, restore it to a separate empty database first and recover the lesson row from there.

Stop here for the parent's gold-lesson approval. No Week 1 Lesson 2 or later lesson should be authored until this lesson is approved.
