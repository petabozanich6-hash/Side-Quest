# Gold v2 parallel curriculum workers

Phase 1 Written Core runs as **partitioned workers** that share one hub queue
but never share a live checkpoint lock. Human/NESA/browser/release gates are
never advanced by automation or reconcile.

## Quality prerequisite

New authoring must use the assessment-quality hardening on this branch
(`docs/GOLD_V2_ASSESSMENT_QUALITY.md`). Do **not** bulk-repair live
`lesson-pipeline/authored/` on the curriculum hub; offline repair only.

## Layout

```
lesson-pipeline/                         # hub (integration)
  inventory.jsonl / manifest.json        # shared authority (do not reset)
  checkpoint.json                        # reconciled integration receipts
  authored/ artifacts/                   # integrated outputs
  partitions.json                        # exclusive seed ownership
  parallel-dashboard.json                # latest dashboard snapshot
  parallel-ramp-metrics.json             # concurrency ramp measurements
  workers/<id>/
      worker.json
      checkpoint.json                    # worker-only progress
      .pipeline.lock
      authored/ artifacts/
```

## Commands

```sh
# Register exclusive partitions (once per worker)
python3 scripts/gold-pipeline/parallel_workers.py init-worker \
  --worker builder-tech-01 --pattern 's4-tech-y8-w05-*' --label 'S4 Y8 Tech w05–w09'

# Author into the worker inbox, then validate inside that worker state
python3 scripts/gold-pipeline/parallel_workers.py run \
  --worker builder-tech-01 --limit 12

# N-way concurrent cycle (generate → validate → reconcile)
python3 scripts/gold-pipeline/run_parallel_cycle.py --concurrency 8 --limit 12

# Provision eight exclusive Y8 Tech week shards + worktrees (after inventory)
python3 scripts/gold-pipeline/provision_tech_octo.py

python3 scripts/gold-pipeline/parallel_workers.py reconcile
python3 scripts/gold-pipeline/parallel_workers.py dashboard
```

## Inventory outcome (2026-10-13 re-verify)

Suggested owner slots (S2 Y3, Y7 Eng/Mat/Sci/HSIE, Y8 Eng/Mat/Sci) were
**already auto-validated**. Remaining unfinished Stage 2/Stage 4 catalogue work
was **Y8 Technology** (88 lessons from `s4-tech-y8-w05-l3`). Those were
reassigned to eight exclusive week-range builders.

| Partition | Status |
|---|---|
| S2 Y3 / Y4 | Complete Written Core (Y3 protects `s2-eng-y3-w01-l1`) |
| S4 Y7 all subjects | Complete |
| S4 Y8 Eng/Mat/Sci/HSIE/PDHPE | Complete |
| S4 Y8 Tech | Complete 100/100 after octo shards |
| S4 Y9+ | **No catalogue rows** in D1 reconstruct yet |
| Stage 3+ | Present in DB but **deferred** until S2/S4 owner scope is exhausted |

## Active partition map (eight concurrent builders)

| Worker | Ownership | Worktree / branch | Notes |
|---|---|---|---|
| builder-tech-01 | `s4-tech-y8-w05-*` … `w09-*` | `.worktrees/builder-tech-01` / `feature/gold-v2-builder-tech-01` | drained |
| builder-tech-02 | `w10–w14` | `builder-tech-02` | drained |
| builder-tech-03 | `w15–w18` | `builder-tech-03` | drained |
| builder-tech-04 | `w19–w22` | `builder-tech-04` | drained |
| builder-tech-05 | `w23–w26` | `builder-tech-05` | drained |
| builder-tech-06 | `w27–w30` | `builder-tech-06` | drained |
| builder-tech-07 | `w31–w35` | `builder-tech-07` | drained |
| builder-tech-08 | `w36–w40` | `builder-tech-08` | drained |

Idle / repair (not counted in active concurrency):

| Worker | Ownership | Notes |
|---|---|---|
| builder-y3 | `s2-*-y3-*` | idle/repair |
| builder-y4 | `s2-*-y4-*` | complete — repairs only |
| builder-y7-hsie | Y7 HSIE/PDHPE/Tech + Y8 Maths | complete — idle |
| builder-y8-eng | Y8 Eng/Sci/HSIE/PDHPE | complete — idle (Tech moved to shards) |

Overlapping `--pattern` values are rejected at `init-worker`.

## Concurrency ramp (measured on hub)

| Concurrency | Lessons gained | Elapsed | Lessons/min | Result |
|---|---|---|---|---|
| 2 | 12 | 7.7s | 93.4 | stable |
| 4 | 23 | 11.0s | **125.8** | peak |
| 6 | 32 | 16.0s | 119.9 | stable |
| 8 | 21 (remainder) | 12.1s | 104.3 | stable; 4 shards still had work |

**Chosen concurrency: 8.** No conflicts, no validation failures, no flock
contention requiring backoff. Peak throughput was at 4 workers; 8 remained
stable and cleared the queue. Auto-backoff was armed but not triggered.

## Integration with curriculum branch

1. Land infrastructure on `feature/gold-v2-parallel-workers` (compare-link PR;
   `gh pr create` PAT currently 403).
2. Never reset hub `checkpoint.json`.
3. Author into `lesson-pipeline/workers/<id>/authored/`, run worker validation,
   then `reconcile` on the hub.
4. Skip seeds already auto-validated on the hub.
5. Episode-pilot worktree stays untouched.

### HSIE learning_area note

Stage 4 `s4-hsie-*` catalogue rows often use `Geography` / `History` as
`learning_area`. The assessment-quality validator accepts those tokens under the
`hsie` seed subject code (in addition to `hsie` / `human`).

## Safeguards

- No merge to main, deploy, or remote D1 from this workflow.
- Reconcile copies validation receipts and authored JSON; it does **not** set
  educationally_reviewed / nesa_verified / browser_verified / fully_approved.
- Conflicts (same seed, different validated content) abort the merge.
- Episode-pilot and assessment-quality worktrees remain independent.
- Human gates stay honestly at 0 until independent reviewers attest.
