# Pilot result: Year 3 rounding

Date: 12 October 2026. Branch: `feature/gold-v2-resumable-pipeline`.
Lesson: **s2-mat-y3-w02-l1**, “Rounding numbers: which landmark is nearer?”
Architecture: D1/Worker JSON. It replaces a repository placeholder only in
staged artifacts and disposable local test storage. No numbered migration,
production write, reference lesson edit, deployment or paid API call occurred.

The authored lesson has four teaching stages, original explanations with rules,
reasons, worked thinking, misconceptions and corrections, distinct guided
attempts and feedback, four number-line diagrams, one internal captioned episode,
different model/guided/independent inputs, eight MCQs and two written prompts,
30 distinct hints for the ten actual stages, parent-labelled models, paper/typed
evidence options and an extension. It is **a review draft**, not certified Gold v2.

## Actual status

| Gate | Result |
|---|---|
| Drafted | Yes, one individually authored lesson |
| Automated validation passed | Yes, strict validator, additional quality audit and local SQL simulation |
| Educationally reviewed | No independent sign-off |
| NESA verified | No individual lesson sign-off; official outcome wording was retrieved |
| Browser verified | No; functional rendering/submission checks passed but two existing application defects failed acceptance |
| Fully approved | No |

Queue totals: **19,202 records**, **19,200 queued**, **one awaiting review**,
**one protected reference**. **Zero pipeline completions**. The protected
reference remains untouched and is not counted as a new pipeline approval.
The earlier branch's 69 edits are not imported or counted as certified content.

## Actual checks

- **26 Python tests passed**, zero failed: complete inventory/current-stage
  priority, real pilot validation, byte-identical no-op resume, interrupted claim
  recovery, failed-input repair, missing content, reference protection, identity
  mismatch, inventory/source/artifact drift, validator revision revalidation,
  stale-pass exclusion, human-attestation requirements, batch limits, exclusive
  locking, atomic-write failure, and assignment/metadata preservation.
- **21 Node test-runner tests passed**, zero failed, including the two existing
  validator scripts. The gold script additionally exercises its existing 15
  invalid-content cases. New cases reject omitted markers even for non-Year-3
  files, shallow/incomplete teaching evidence, curriculum self-certification,
  generic/duplicated hints, repeated assessment, leaked independent inputs,
  absent diagrams and child-visible parent paragraph labels.
- Strict CLI validator and Year 3 audit passed on the actual final draft SQL;
  the audit returned no issues. Historical-marker bypass was not used.
- Local reconstruction and simulation changed **exactly one** target, preserved
  the other **19,201** rows, every identity/metadata column and assignment linkage,
  and produced identical content on repeated application. The simulation rolled
  back. A separate isolated Wrangler D1 state also applied all base migrations
  and the staged patch successfully.
- Worker TypeScript check, existing player/print-logic checks and existing API
  smoke suite passed. The unchanged frontend build from onboarding was reused;
  no new frontend build is claimed in this task.
- **Actual Chromium** ran the child lesson at 390px width: four teaching/example
  stages, accessible SVGs, knowledge checks, eight correct MC selections, two
  typed written responses and submission. Parent API receipt preserved both
  written responses. Chromium rendered the print document with seven SVG
  instances; parent models were absent from the print output. The phone screenshot
  was inspected. A generated local test account was deleted after each run.
- The browser smoke command **exited 1**, with the two failures below. Six
  functional/cleanup check groups passed; it did not advance a review gate.
- An unchanged second pipeline invocation processed **zero** lessons and kept
  the checkpoint intact. Changing validator/content revisions produced new
  retained attempts, with all human gates reset.

Logs, screenshots, the generated print document and machine-readable results are
in `lesson-pipeline/pilot-evidence/`. The summary hashes the evidence files.
The authored file SHA in the browser report ties rendering to the final input.
Local functional checks are not independent educational review.

## Confirmed application blockers

1. **Parent answer exposure through child API.** `worker/src/core.ts` returns
   `lessonOut` unchanged to authenticated child lesson/assignment routes. The
   browser test directly received `parent_notes`, short-answer `sample_answer`
   and `marking_guide`. UI hiding and `Parent:` prefixes do not prevent network
   inspection. A separate application fix must apply role-based redaction across
   child routes, with regression tests, before browser/approval sign-off.
2. **Learner progress loses later stages.** `ChildLesson.jsx` assigns
   `onClick={mark("learn")}` and `onClick={mark("guided")}`. React passes an event
   rather than a boolean; `done` consequently contains a React event whose JSON
   serialization fails. The catch retains an earlier localStorage checkpoint.
   The browser recorded missing completed learn/guided stages, task response,
   quiz result and written answers before and after reload. Submission still
   reaches the backend in the live session. This is distinct from the new
   pipeline's durable checkpoints, whose interruption/resume tests passed.

These confirmed repository defects are not hidden by weakening tests or toggling
approval flags. This infrastructure PR records them without expanding into an
application rewrite.

## Curriculum evidence and remaining review

The official NESA **Mathematics K–10 Syllabus (2022)** outcome page confirms
**MA2-RN-01**: “applies an understanding of place value and the role of zero to
represent numbers to at least tens of thousands”. An HTTPS retrieval receipt
records the source URL, exact wording and full retrieved-page hash in
`lesson-pipeline/sources/nesa-ma2-rn-01.json`. The application catalogue's
`MA2-RWN-01` spelling disagrees with the official source; it was not changed here.

The rounding lesson provides partial place-value reasoning evidence and does
not cover representation to tens of thousands or the entire outcome. Exact
Stage 2 content-point alignment, pedagogy, every answer and diagram, graduated
hints, accessibility and age suitability still need independent review. An
official code lookup is not a NESA-verified lesson.

## Usage check

**Estimated rows written: 1 per staged application. Largest validator-counted
SQL statement: 27,495 bytes**, including its adjacent comment; compact JSON is
27,266 bytes. The isolated engine reports 27,419 bytes for the executable UPDATE.
No production rows were written. Actual D1 index-related writes are not inferred.

## Reproduce the local checks

From the repository root:

```sh
node --test scripts/gold-pipeline/validate.test.mjs scripts/gold-v2-marker-gate.test.mjs scripts/validate-lessons.test.mjs scripts/validate-stage3-batch.test.mjs
python3 scripts/gold-pipeline/test_pipeline.py
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/pipeline.py run --seed s2-mat-y3-w02-l1
```

The last command should be a no-op on the committed unchanged checkpoint. The
pipeline validates available authored inputs, not arbitrary unreviewed SQL.

For actual browser reproduction, retain `.dev.vars` securely and use a separate
ignored Wrangler config mirroring `wrangler.jsonc` without its mutable custom
build command (prepared by the environment setup). Build the frontend with
`CI=false npm --prefix frontend run build` if its sources or output changed.
Export `XDG_CONFIG_HOME=/workspace/.config` and `WRANGLER_SEND_METRICS=false`.
Apply base migrations using **only local** disposable storage:

```sh
./node_modules/.bin/wrangler d1 migrations apply DB --local --persist-to /tmp/sidequest-gold-pilot-d1
```

Read the current `draft.sql` path from the pilot checkpoint artifact map, then:

```sh
./node_modules/.bin/wrangler d1 execute DB --local --persist-to /tmp/sidequest-gold-pilot-d1 --file "$PILOT_SQL_PATH"
./node_modules/.bin/wrangler dev --config .dev.vars.cloud.json --local --persist-to /tmp/sidequest-gold-pilot-d1 --ip 127.0.0.1 --port 8788 --show-interactive-dev-session=false
```

Run Chromium in another session, restricted to loopback debugging, with a fresh
profile. The browser runner uses the platform-provided Chromium binary and Node
24 WebSocket; no browser package or paid service is added:

```sh
chromium --headless --no-sandbox --disable-dev-shm-usage --no-proxy-server --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir=/tmp/sidequest-gold-chrome about:blank
node scripts/gold-pipeline/browser-pilot.mjs
```

The runner rejects non-loopback URLs, creates only synthetic local accounts,
checks role isolation and saved progress, writes screenshots/reports, and cleans
up its account. It must continue returning failure while the two application
defects remain. Do not interpret the synthetic correct quiz selections as a
learner demonstration or educational sign-off. Stop only services started for
the test when finished. No remote backup/apply/undo commands are needed because
the pipeline has no production operation; disposable state can be discarded.

## Next invocation

Pull the feature branch, run status and read its blockers. Independently review
the pilot, address the documented app defects in a scoped coding task, and verify
exact curriculum alignment. In parallel, author the next small Stage 2/4 bundle
using its actual scope and sources, run the queue and tests, and commit both
receipts and checkpoint. Keep all reviews and the PR draft; enable recurrence
only through the separately authorised mechanism in `GOLD_V2_PIPELINE.md`.
