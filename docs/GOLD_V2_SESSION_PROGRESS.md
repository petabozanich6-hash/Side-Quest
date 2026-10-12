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
| Automated validation passed (pipeline) | 399 |
| Educationally reviewed | 0 |
| NESA verified | 0 |
| Browser verified | 0 |
| Fully approved Gold Standard | **0** |

Protected gold reference on main: `s2-eng-y3-w01-l1` (not counted as pipeline completion).

### Year 3 Written Core auto-validated

| Subject | Count | Status |
|---|---|---|
| English | 159 (+ protected w01-l1) | Complete (auto) |
| Mathematics | 160 | Complete (auto) |
| Science and Technology | 80 | Complete (auto) |
| HSIE | 0 / 80 | Next: `s2-hsie-y3-w01-l1` |
| PDHPE | 0 / 80 | Queued after HSIE |
| Creative Arts | 0 / 80 | Queued after PDHPE |

**Not Gold Standard full approval.** Human educational / NESA / browser gates remain closed. Do not apply draft SQL to remote D1.

## Next resume point

1. Continue Y3 HSIE Written Core from `s2-hsie-y3-w01-l1`.
2. Keep coherent batches; do not start Phase 2 media.
3. Preserve draft PR; no merge/deploy without owner authorisation.

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 -c "import json;print(json.load(open('lesson-pipeline/completion-manifest.json'))['next_resume'])"
```

## Known constraints

- Validator still requires 1–2 existing Pip/Juno `CartoonEpisode` payloads for Gold-shaped JSON.
- Avoid banned visual process words in SVG/captions (`explain`, `check`, `model`, `try`, `learn`, `notice`, `verify`, `apply`, step-one phrasing).
- Avoid `\bpets?\b` anywhere in lesson JSON (validator ban).
- First Nations HSIE content must stay protocol-aware; do not invent Dreaming stories or Nation-specific claims without verified sources.
- Automation must remain subject-specific; do not lower validator thresholds.
