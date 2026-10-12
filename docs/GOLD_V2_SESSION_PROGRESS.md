# Gold v2 session progress — 13 October 2026 (Y4 English + batch sizing)

Resume from `feature/gold-v2-resumable-pipeline`. Do not merge, deploy, or apply remote D1.

Machine-readable tracker: `lesson-pipeline/completion-manifest.json`.

## Why batches were ~8 (evidence, not a policy)

| Layer | Actual bound | Evidence |
|---|---|---|
| Owner authoring directive | **12-lesson** coherent written batches | `AGENTS.md` line 46 |
| Pipeline `--limit` (was) | **1–5** (default 1) | former `pipeline.py` `run_batch` guard |
| Pipeline `--limit` (now) | **1–16** (default 1) | `scripts/gold-pipeline/pipeline.py` after measured raise |
| Trailing subject builders labelled “(8)” | leftover **w37–w40** at 2 lessons/week | e.g. `build-written-science-batch07.py`, `build-written-hsie-batch07.py`, `build-written-pdhpe-batch07.py`, `build-written-arts-batch07.py` docstrings |

So “~8” was year-close remainder size for some subjects, **not** the intended steady-state authoring size. Steady-state remains **12**.

## Assessment quality confirmation (this session)

| Check | Result |
|---|---|
| `python3 scripts/gold-pipeline/assessment_quiz.test.py` | passed (english/maths/science/hsie/pdhpe) |
| `node --test scripts/gold-pipeline/validate.test.mjs` | **20/20** pass (includes meta-stem ban) |
| Spot-check meta stems in authored | **0** hits for banned stems |
| Y4 authored quizzes | **0** meta stems |

## Batch-size benchmark (measured)

| Size | Author build (12-lesson script) | Pipeline wall time | Validation failures |
|---|---|---|---|
| 8 lessons | n/a (subset of batch01) | **3.21 s** | 0 |
| 12 lessons | **~0.20–0.30 s** | **3.94–5.63 s** typical | 0 |
| 16 lessons | n/a (pipeline only) | **6.27 s**; full stale revalidation 639 @16 = **247 s**, 0 fails | 0 |

**Selected sustainable sizes:** authoring **12**; pipeline `--limit` **12** (up to **16** for revalidation sweeps). Changing `pipeline.py` updates validator hashes and requires revalidation of prior passes.

## Continuous unattended processing

- **Supported in-session:** agent can author → `pipeline.py run` → next batch without user “continue”, with checkpoint persistence.
- **Not enabled by AGENTS.md:** always-on scheduler / recurring paid automation. Session continuity ≠ authorised recurring cloud loop.

## Progress

| Gate | Count |
|---|---|
| Automatically validated (pipeline) | **723** |
| Educationally reviewed / NESA / browser / fully approved | **0** |

| Slice | Auto-validated |
|---|---|
| Y3 all subjects Written Core | 639 (+ protected w01-l1) |
| Y4 English Written Core | **84 / 160** (`s2-eng-y4-w01-l1` … `w21-l4`) |

## Next resume point

`s2-eng-y4-w22-l1` (continue Year 4 English in 12-lesson builders `build-written-english-y4-batch08.py` onward). Keep PR #105 draft; no merge/deploy.

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/assessment_quiz.test.py
node --test scripts/gold-pipeline/validate.test.mjs
```
