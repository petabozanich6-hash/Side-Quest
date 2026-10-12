# Safe assessment repair process (offline / resumable)

This process rebuilds weak `quiz` / teach-check surfaces using the hardened
`assessment_quiz.build_skill_quiz` **without** touching a live authoring worktree.

Passing repair + validate means **automatically improved**, not educationally
reviewed, NESA verified, browser verified, or release approved.

## When to run

1. Authoring agent has **paused** or finished a coherent batch, **or**
2. You operate on a **copy / other worktree / offline inventory**, not the live
   `feature/gold-v2-resumable-pipeline` working tree the authoring agent is writing.

Never run bulk `--all-weak` against another agent’s active `lesson-pipeline/authored`.

## Script

```sh
# From this quality-hardening checkout or after merging its scripts:
python3 scripts/gold-pipeline/repair_authored_assessments.py \
  --authored-dir /path/to/offline-or-copy/lesson-pipeline/authored \
  --all-weak \
  --dry-run \
  --limit 12

# Then without --dry-run for a bounded batch:
python3 scripts/gold-pipeline/repair_authored_assessments.py \
  --authored-dir /path/to/offline-or-copy/lesson-pipeline/authored \
  --all-weak \
  --limit 12
```

### Safety switches

| Flag | Purpose |
|---|---|
| `--authored-dir` | Required for intentional bulk work; defaults to this checkout’s authored/ |
| `--dry-run` | List would-repair seeds only |
| `--limit N` | Resumable batches (e.g. 12) |
| `--seed KEY` | Repair specific lessons |
| `--glob` | Narrow file set (e.g. `s2-mat-y3-*.json`) |
| `--allow-live-authored` | Required if path matches known live authoring authored/ locations |

The script **refuses** known live paths
(`/Users/petab/Side-Quest/lesson-pipeline/authored`, `/workspace/Side-Quest/lesson-pipeline/authored`)
unless `--allow-live-authored` is set after an explicit handoff.

## What it changes

- Rebuilds `lesson.quiz` (8 MC + 2 SA) from teaching/practice fields
- Refreshes `parent_notes` sample/marking paragraphs (still `Parent:`-prefixed)
- Rewrites teach-step `check` items that still use banned meta stems
- Does **not** change seed keys, placement, outcome codes, teaching prose, or visuals

## Recommended resume loop

```sh
# 1) Snapshot authored away from the live agent tree
rsync -a --delete \
  /path/to/paused-authored/ \
  /path/to/assessment-repair-inventory/authored/

# 2) Dry-run census
python3 scripts/gold-pipeline/repair_authored_assessments.py \
  --authored-dir /path/to/assessment-repair-inventory/authored \
  --all-weak --dry-run

# 3) Repair in 12-lesson (or larger) chunks; re-run skips already-strong quizzes
python3 scripts/gold-pipeline/repair_authored_assessments.py \
  --authored-dir /path/to/assessment-repair-inventory/authored \
  --all-weak --limit 48

# 4) Spot-validate repaired seeds (bundle + baseline from same file identity fields)
#    Use pipeline validate on repaired bundles as the authoring agent normally does.
```

Checkpointing is inherent: `quiz_is_weak` skips lessons that already pass the
hardened weakness detector, so interrupted runs are safe to continue.

## Integration with authoring agent

1. **Adopt code first:** merge/rebase `feature/gold-v2-assessment-quality-hardening`
   scripts into the curriculum branch so **new** `build_from_spec` lessons emit
   stronger quizzes and fail CI/validate if templates return.
2. **Do not** let two agents rewrite the same authored JSON concurrently.
3. After a pause, either:
   - authoring agent pulls this branch and runs repair itself on its tree with
     `--allow-live-authored`, **or**
   - quality agent repairs an rsync’d inventory and hands back a patch/PR of
     authored diffs as a separate reviewable operation.
4. Keep draft PRs separate until owner directs integration order.

## Limits

- Repair cannot invent richer subject items than the fields present in the bundle;
  thin teaching still needs human authoring.
- Hand-authored strong quizzes (e.g. `s2-eng-y3-w01-l2`, `s2-mat-y3-w02-l1`) are
  skipped when not weak.
- Full Gold v2 Full Experience / media is out of scope (Phase 1 Written Core only).
