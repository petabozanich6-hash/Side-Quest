# Resumable lesson development pipeline

This infrastructure prepares reviewable lesson drafts. It cannot certify teaching
quality or deploy content. Main remains the production source; the feature branch
`feature/gold-v2-resumable-pipeline` holds the queue, receipts and pilot. Resume
from that branch, not conversational memory. Do not merge, deploy, migrate remote
D1, modify billing or enable paid generation.

## Inventory and architecture evidence

The engine reconstructs **all 19,202 unique repository lesson rows** by applying
every migration on this branch to in-memory SQLite. Membership is cross-checked
against `docs/inventory/*.csv`, excluding the summary. This is repository data,
not a production database count. Counts: ES1 640, S1 1,280, S2 1,282, S3 1,280,
S4 3,620, S5 3,420, S6 7,680. Current stage controls priority; some s5-prefixed
keys are actually Stage 4. Those keys are preserved.

Three architectures must remain distinct:

| Architecture | Authority and runtime | Support |
|---|---|---|
| D1/Worker JSON | Protected `0044_s2_y3_w01_l1_gold_expression.sql`, `docs/GOLD_Y3_ENGLISH_W01_L1_REVIEW.md`, `docs/LESSON_REBUILD_MASTER.md`; Hono `worker/src/core.ts`, React `ChildLesson`, `QuestTeach`, `QuestVisual`, `QuestQuiz` | All 19,202 queue records; strict age-band validator and local SQL simulation |
| Python lesson library | `docs/LESSON_BUILD_HANDOFF.md`, protected `backend/lesson_library_s2_english_w09_l1.py`, `tools/check_lesson.py` | Benchmark, backend and checker absent on main and the inspected feature branch; adapter blocked |
| Markdown/JSON lesson bank | `lesson-bank/tools/build_bank.py`, `lesson-bank/scope-and-sequence.md` | Separate converter with basic consistency checks; no approved Gold v2 adapter; not falsely counted as extra D1 records |

`AGENTS.md`, the corrective audit, its audit script and marker-gate regressions
were read from `feature/stage2-y3-science-hsie-0050` and carried onto this
main-based branch. Its lesson migrations and cartoon changes were not imported.
This avoids silently replacing the main inventory with the unaudited drafts in
PR #104. The handoff's older direct-main instructions are superseded by the
current user instruction and audit safeguards.

The repository's generators are migration-program builders, the local CSV
exporter and the Markdown bank converter. None provides pedagogical assurance.
The standard application uses root/worker/frontend npm locks, Wrangler local
D1, Worker type checking, a React production build and `worker/test/smoke.mjs`.
Main has no GitHub workflows; the inspected feature branch has a Stage 2 audit
workflow tied to a narrow migration-number range. This branch adds independent
pipeline CI without that range restriction.

## Durable data and execution

`lesson-pipeline/inventory.jsonl` is the complete immutable queue, with stable
seed keys, architecture, placement, current-stage priority and content hashes.
`manifest.json` binds it to migration hashes and the protected D1 benchmark.
`checkpoint.json` stores sparse attempted-record state and an event history.
All other inventory records are implicitly queued, except the preserved
reference. Protected reference status is not counted as a pipeline completion.

The pipeline uses only Python's standard library and Node; it has **no model
SDK, generation API, Cloudflare token or production connection**. It assembles
individually authored bundles into deterministic JSON merge patches. The supplied
pilot adapter is original rounding content for exactly one lesson; it is not a
generic bulk generator. To rebuild another topic, author a complete bundle under
`lesson-pipeline/authored/<seed_key>.json`, using its own scope, teaching examples
and subject-specific visuals. Use the pilot as a schema illustration, not as
reusable prose. Missing authored inputs remain queued. The next cloud agent does
the curriculum engineering before invoking the deterministic runner.

From the existing checkout at `/workspace/Side-Quest`:

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/pipeline.py run --limit 1
```

Resume commands are automatic: completed identical inputs are skipped, changed
inputs are new attempts, and an interrupted `in_progress` claim is retried under
the process lock. Batches are capped at five; default one. Available authored
inputs are sorted by current-stage priority, year, subject, week and lesson.
An explicit `--seed` selects a coherent pilot. No unavailable content is filled
with generic drafts. A failed input is retained and skipped until changed, while
later available inputs can proceed. A failed attempted validation exits nonzero.

For an empty state only:

```sh
python3 scripts/gold-pipeline/pipeline.py init
python3 scripts/gold-pipeline/build-pilot.py
```

Do not rerun init to reset progress. It refuses existing checkpoints. Use the
existing isolated checkout, not a new worktree unless expressly requested.

Every attempt saves the original baseline, complete authored bundle, proposed
SQL and validation receipt under a content-and-validator revision directory.
The runner always writes a claim before work, then atomically saves the receipt
and final checkpoint. File and directory fsync plus `os.replace` preserve the
previous checkpoint if writing fails. A nonblocking flock prevents concurrent
writers. Live processes and machine-local locks are not durable state.

On resume, inventory/migration drift or altered receipt files fail closed.
Validator changes trigger revalidation and revoke prior review gates; status
does not count stale validation as passed. A changed lesson also revokes all
sign-offs. Keep historical artifacts for audit. Source migration changes need
an explicit inventory reconciliation in a reviewed coding change: compare
old/new records by seed, preserve unchanged evidence, requeue changed content,
and verify membership and benchmark hashes. There is deliberately no reset
command that silently erases reviews or adopts drift.

After a successful or failed run, commit `lesson-pipeline/` and authored changes
to the feature branch and push; a local checkpoint alone cannot survive an
unrelated fresh checkout. Never commit local auth tokens or user-data databases.

## Acceptance gates

The checkpoint retains independent booleans for **drafted**, **automated
validation passed**, **educationally reviewed**, **NESA verified**, **browser
verified**, and **fully approved**. Zero human-reviewed records is a legitimate
outcome. No generated draft or passing static test is called completed.

Automated validation requires the actual strict validator (`--strict`), regardless
of filename, subject, migration number or the optional `Standard v2` marker.
The branch audit is an additional Year 3 check, not an age-band replacement.
All existing acceptance thresholds remain. This first implementation retains
the validator's conservative single-statement and size limits; support for
larger/split patches requires a separate tested implementation, not truncation.

Additional checks require rendered evidence for rule, purpose, model, misconception,
specific fix, guided attempt and feedback at every teaching stage; distinct
model/guided/independent inputs; no repeated quiz prompts; explanatory feedback;
complete, unique stage hint ladders; multiple topic visual evidence entries; and
an individual proposed curriculum contribution with scope limits and official
source. Static checks cannot determine whether a diagram genuinely teaches, a
fact is true or a proposed code is correct. The reviewer checklist calls these
out explicitly. Empty or fabricated alignment must not be called NESA verified.

The generated SQL updates only a public seed-key match. In throwaway SQLite it
must change exactly one row, preserve identity, ownership, placement and every
other metadata column, leave all neighbours/assignments/submissions untouched,
and produce identical rows when reapplied. The savepoint is rolled back. SQL
artifacts stay **outside `worker/migrations`**, so ordinary deployment or local
migration commands cannot pick them up.

Human sign-offs are imported with:

```sh
python3 scripts/gold-pipeline/pipeline.py record-review path/to/attestation.json
```

The attestation must identify a human reviewer, date, pass decision, gate,
seed key, exact bundle content SHA and evidence files with SHA-256 hashes
under `lesson-pipeline/`. It is an auditable human declaration, not a cryptographic
identity system. Repository/PR access controls establish reviewer authority.
Do not fabricate an attestation to advance a gate. NESA verification additionally
requires exact proposed-code coverage, official wording, syllabus version,
individual mapping and NESA source URLs. Full approval requires all five other
gates and an owner's release attestation. It still does not authorise deployment.

Example schema (illustrative, not an actual sign-off):

```json
{
  "seed_key": "s2-mat-y3-w02-l1",
  "gate": "educationally_reviewed",
  "content_sha256": "<exact current bundle SHA>",
  "reviewer": "<human name>",
  "reviewer_type": "human",
  "reviewed_at": "<date>",
  "decision": "pass",
  "evidence": {"reviews/<seed>/editorial-review.md": "<file SHA>"}
}
```

## Cloud execution, permissions and cost

The workflow `lesson-pipeline.yml` performs local tests and checks on PRs; manual
dispatch can process 1–5 available bundles. Actions are pinned, permissions are
read-only, concurrency is serial per ref and jobs stop at 15 minutes. It does not
merge, deploy, commit, call a model or run a schedule. Uploads retain the complete
checkpoint as a review artifact for 14 days, including failed-run state. Download
and review any changed checkpoint, then commit it to the same feature branch
before another execution. Artifact storage alone is not permanent persistence.
The PR workflow passed on GitHub (run 38207550951): the validator, Python
integration, checkpoint-verification and artifact-preservation steps succeeded.
The manual batch-processing step was correctly skipped on the PR event.
No manual dispatch was initiated. Dispatch availability
depends on GitHub recognising the workflow; it may require an owner-approved
merge later. This task does not authorise such a merge.

A safe recurring agent integration should: check out/pull this feature branch;
acquire one writer per branch; read AGENTS and the checkpoint; author one coherent
bundle using verified sources; run the bounded runner and tests; always preserve
and commit its checkpoint even on content failure; push only this feature branch;
keep its PR draft; and report remaining human gates. Give it contents-write access
only for feature branches plus pull-request write access, **no Cloudflare or
production credentials**, no secrets on fork PRs, a per-run timeout and owner-set
run/day and spending limits. Refuse dirty or conflicting updates instead of
force-pushing. A protected main branch should prevent merges by that integration.

**No recurring scheduler is enabled.** Enabling a scheduler/agent service, its
GitHub permissions and any metered inference needs separate owner authorisation.
This implementation makes zero paid API calls. Existing Codex/cloud tasks use
the owner's existing plan; GitHub Actions private-repository runner minutes and
artifact storage may consume the account's allowance or incur overage. Confirm
the account's current limits and billing before dispatch or recurrence; no account
price, allowance or authorised new spend is asserted here. A read-only timed
simulation cannot author new lessons without a human or agent supplying content.

The environment proxy initially denied HTTPS CONNECT to `curriculum.nsw.edu.au`
and `api.github.com` during this task. After the domain configuration change,
read-only GitHub API requests and official NESA syllabus retrieval succeeded.
The source receipt in `lesson-pipeline/sources/nesa-ma2-rn-01.json` confirms the
official code and wording; exact lesson content-point alignment still awaits review.
Native authenticated Git reads work, so an
unset/raw-token test is not a reason to request a replacement GitHub token.
Domain additions for both hosts were saved in the environment configuration
draft, preserving the package-manager presets. Review/save them in environment
settings, then publish for reusable configuration as required by the UI. Current-instance access
was independently retested; draft persistence alone does not establish publication.
Any remaining GitHub API credential must be supplied through secure environment
configuration with repository/PR scope, never pasted into chat.
