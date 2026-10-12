# Gold v2 session progress — 13 October 2026 (resumed)

Resume from `feature/gold-v2-resumable-pipeline`. Do not merge, deploy, or apply remote D1.

Machine-readable tracker: `lesson-pipeline/completion-manifest.json`.

## Platform inventory (repository D1 reconstruction)

| Stage | Lesson records |
|---|---|
| ES1 | 640 |
| S1 | 1,280 |
| S2 | 1,282 |
| S3 | 1,280 |
| S4 | 3,620 |
| S5 | 3,420 |
| S6 | 7,680 |
| **Total** | **19,202** |

Binding owner order: finish **all Stage 2 then all Stage 4 Written Core** (4,902 records) before other stages. Phase 1 = written teaching in existing D1 schema; Phase 2 media later.

### Completion gates (honest counts)

| Gate | Count |
|---|---|
| Automated validation passed (pipeline) | 160 |
| Educationally reviewed | 0 |
| NESA verified | 0 |
| Browser verified | 0 |
| Fully approved Gold Standard | **0** |

Protected gold reference on main: `s2-eng-y3-w01-l1` (not counted as pipeline completion).

### Year 3 English Written Core

**COMPLETE for Phase 1 automated validation:** `s2-eng-y3-w01-l2` through `s2-eng-y3-w40-l4` (159 program lessons + protected `w01-l1` on main). Batches 01–13.

Also awaiting review: maths pilot `s2-mat-y3-w02-l1`.

**Not Gold Standard full approval.** Human educational / NESA / browser gates remain closed. Do not apply draft SQL to remote D1.

## Next resume point

1. Continue Stage 2 Written Core with the next unfinished subject sequence (see `completion-manifest.json` → `next_resume`).
2. Keep coherent 12-lesson batches; do not start Phase 2 media.
3. Preserve draft PR; no merge/deploy without owner authorisation.

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 -c "import json;print(json.load(open('lesson-pipeline/completion-manifest.json'))['next_resume'])"
```

## Known constraints

- Validator still requires 1–2 existing Pip/Juno `CartoonEpisode` payloads for Gold-shaped JSON.
- Avoid banned visual process words in SVG/captions (`explain`, `check`, `model`, `try`, `learn`, `notice`, `verify`, `apply`, step-one phrasing).
- Automation must remain subject-specific; do not lower validator thresholds.
