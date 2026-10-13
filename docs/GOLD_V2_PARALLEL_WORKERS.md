# Gold v2 parallel curriculum workers

Phase 1 Written Core can run as **partitioned workers** that share one hub queue
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
  workers/
    builder-y7-hsie/
      worker.json
      checkpoint.json                    # worker-only progress
      .pipeline.lock
      authored/ artifacts/
      inventory.jsonl + manifest.json    # copies from hub at init-worker
```

## Commands

```sh
# Register exclusive partitions (once per worker)
python3 scripts/gold-pipeline/parallel_workers.py init-worker \
  --worker builder-y7-hsie --pattern 's4-hsie-y7-*' --label 'S4 Y7 HSIE'

python3 scripts/gold-pipeline/parallel_workers.py init-worker \
  --worker builder-y8-eng --pattern 's4-eng-y8-*' --label 'S4 Y8 English'

# Author into the worker inbox, then validate inside that worker state
python3 scripts/gold-pipeline/parallel_workers.py run \
  --worker builder-y7-hsie --limit 12

# Merge independently authored batches into the hub (fail-closed on conflicts)
python3 scripts/gold-pipeline/parallel_workers.py reconcile --dry-run
python3 scripts/gold-pipeline/parallel_workers.py reconcile

python3 scripts/gold-pipeline/parallel_workers.py dashboard
```

## Partition map (owner directive)

| Worker | Ownership | Notes |
|---|---|---|
| builder-y3 | `s2-*-y3-*` | Stage 2 Year 3; nearly complete (protected W01 L1 excluded) |
| builder-y4 | `s2-*-y4-*` | Complete 640/640 — repairs only |
| builder-y7-hsie / builder-y7 | `s4-*-y7-*` split by subject as registered | Continue HSIE from `s4-hsie-y7-w25-l1` |
| builder-y8 | `s4-*-y8-*` split by subject as registered | Greenfield |

Overlapping `--pattern` values are rejected at `init-worker`.

## Integration with curriculum branch

1. Land infrastructure on `feature/gold-v2-parallel-workers` (draft PR into
   `feature/gold-v2-resumable-pipeline`).
2. Merge/rebase this branch into the curriculum hub branch (code + reconciled
   hub receipts). Do not reset `checkpoint.json`.
3. Initialise workers against the **hub** `lesson-pipeline/` that already holds
   validated receipts — never `pipeline.py init` over it.
4. Builder worktrees (exclusive partitions):
   - `.worktrees/builder-y3` → `feature/gold-v2-builder-y3` (`s2-*-y3-*`)
   - `.worktrees/builder-y4` → `feature/gold-v2-builder-y4` (`s2-*-y4-*`, repairs only)
   - `.worktrees/builder-y7` → `feature/gold-v2-builder-y7` (`s4-hsie-y7-*` / Y7 subjects)
   - `.worktrees/builder-y8` → `feature/gold-v2-builder-y8` (`s4-eng-y8-*` / Y8 subjects)
5. Author into `lesson-pipeline/workers/<id>/authored/`, `parallel_workers.py run`,
   then `reconcile` on the hub. Skip seeds already auto-validated on the hub.

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
