# Gold v2 recovery verification (2026-10-13)

Verified against repository files in the hub worktree
`/Users/petab/Side-Quest/.worktrees/parallel-workers` on
`feature/gold-v2-parallel-workers` @ current HEAD after recovery. Human gates
are never inferred from automation.

## Branch / worktree map

| Location | Branch | Role |
|---|---|---|
| `/Users/petab/Side-Quest` | `feature/gold-v2-resumable-pipeline` @ `ce035417` | Older sequential curriculum tip (behind hub) |
| `.worktrees/parallel-workers` | `feature/gold-v2-parallel-workers` | **Curriculum hub** (authoritative authored + checkpoint) |
| `.worktrees/builder-y3` … `builder-y8`, `builder-tech-01`…`08` | matching `feature/gold-v2-builder-*` | Isolated workers (mostly drained) |
| `.worktrees/assessment-quality-hardening` | `feature/gold-v2-assessment-quality-hardening` | Quality generator/validator source (cherry-picked into hub) |
| `/Users/petab/Side-Quest-episode-pilot` | `feature/gold-v2-episode-pilot-rounding` | Isolated Phase 2 pilot (untouched) |

Main checkout has **no** `lesson-pipeline/authored` of the hub’s size; do not treat
`ce035417` alone as current curriculum progress.

## CURRICULUM PROGRESS (file-verified)

Inventory totals (stage field): **S2 = 1282**, **S4 = 3620**, sum **4902**
(matches AGENTS.md counts). Full DB reconstruct inventory = 19202.

### Stage 2 (stage field)

| Metric | Count |
|---|---|
| Expected | 1282 |
| Authored + auto-validated (awaiting_review) | 1279 |
| Remaining | 3 |

Remaining detail:

- `s2-eng-y3-w01-l1` — **protected reference** (intentionally not pipeline-completed)
- `s2-english-persuasive-writing-01`, `s2-maths-place-value-01` — legacy unparsed seed keys (not week/lesson shaped)

Y3/Y4 Eng/Mat/Sci/HSIE/PDHPE/Arts week/lesson rows: **complete** at automated gate.

### Stage 4 (stage field)

| Metric | Count |
|---|---|
| Expected | 3620 |
| Authored + auto-validated | 1320 |
| Remaining | **2300** |

Completed: all `s4-*-y7-*` and `s4-*-y8-*` core/tech rows (1320).

**Remaining 2300 are all `s5-*` elective seeds for Years 9–10** (Commerce, Dance,
Visual Arts, Aboriginal Studies, Technologies electives, etc.) that are tagged
`stage: "S4"` in inventory while using Stage-5-style seed prefixes. There are
**zero** `s4-*-y9-*` core English/Maths/Science rows in inventory.

Interpretation (do not collapse these):

1. **Y7/Y8 Stage 4 Written Core (s4- prefix): complete** at automated validation.
2. **AGENTS 3620 Stage-4 inventory rows: NOT complete** — 2300 electives remain.
3. Taxonomy risk: NSW Stage 4 is Years 7–8; these electives look Stage 5. Owner
   should confirm whether they stay in Phase 1 scope before mass authoring.

### Gate honesty

| Gate | Count |
|---|---|
| drafted | 2599 |
| automated_validation_passed (any validator generation) | 2599 |
| automated_validation_passed **matching current validator hash** | **2599** (`requires_revalidation` = 0) |
| educationally_reviewed | **0** |
| nesa_verified | **0** |
| browser_verified | **0** |
| fully_approved | **0** |

Auto-validated ≠ Gold Standard approved.

### Assessment quality repair (this recovery)

| Metric | Before recovery | After repair pass |
|---|---|---|
| Weak quizzes (`quiz_is_weak`) | **1726** | **0** |
| Quality hardening on hub | adopted | adopted + generator fix for ellipsis/options |
| Validator / assessment tests | — | `assessment_quiz` + `validate.test.mjs` 27/27 + parallel tests OK |

Repaired assessments still need **revalidation against the current validator
hash** (`pipeline.py run`) before `gates.automated_validation_passed` matching
current tooling catches up.

## PARALLEL DEVELOPMENT

| Worker | Assignment | Remaining | Status |
|---|---|---|---|
| builder-tech-01…08 | Y8 Tech week shards | 0 | drained |
| builder-y3 | S2 Y3 | 0 (protected W01L1) | idle/repair |
| builder-y4 | S2 Y4 | 0 | idle/repair |
| builder-y7-hsie | Y7 HSIE/PDHPE/Tech + Y8 Maths | 0 | idle |
| builder-y8-eng | Y8 Eng/Sci/HSIE/PDHPE | 0 | idle; foreign tech receipts cleaned |

- Parallel system operational: **YES** (process-level `parallel_workers.py` /
  `run_parallel_cycle.py`; 8 worktrees exist)
- Assessment-quality fixes active: **YES** on hub
- Safe reconciliation verified: **YES** after cleaning y8-eng foreign tech seeds
- Genuinely active Cursor AI builders in Agent mode: **1** (this session)
- Maximum tested process concurrency (prior ramp): **8** (stable; peak rate at 4)

Agent mode cannot pretend eight interactive agents are running. Throughput for
new authoring should use `run_parallel_cycle.py` process pools when unfinished
partitions exist.

## INFRASTRUCTURE checklist

- [x] Exclusive seed patterns in `partitions.json`
- [x] Worker-specific checkpoints under `lesson-pipeline/workers/<id>/`
- [x] Isolated worktrees/branches
- [x] Hub reconcile without advancing human gates
- [x] Conflict detection (identical keep / divergent abort)
- [x] Quality hardening integrated
- [x] Dashboard JSON (`lesson-pipeline/parallel-dashboard.json`)
- [x] Uncommitted repair/generator fixes captured on hub branch (this session)

## NEXT ACTION

1. ~~Revalidation catch-up~~ **done** (2599/2599 current validator).
2. **Owner decision** on the 2300 `s5-*` electives tagged Stage 4: keep in
   Phase 1, re-stage as S5, or defer.
3. If electives stay in scope, provision new exclusive partitions + subject
   strategies before `run_parallel_cycle.py --concurrency 8`.
4. Open draft PRs manually (PAT lacks `createPullRequest`):
   - https://github.com/petabozanich6-hash/Side-Quest/compare/feature/gold-v2-resumable-pipeline...feature/gold-v2-parallel-workers?expand=1
   - https://github.com/petabozanich6-hash/Side-Quest/compare/feature/gold-v2-resumable-pipeline...feature/gold-v2-assessment-quality-hardening?expand=1
5. Keep episode pilot isolated; no merge/deploy/remote D1.
