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
| Automated validation passed (pipeline) | 27 |
| Educationally reviewed | 0 |
| NESA verified | 0 |
| Browser verified | 0 |
| Fully approved Gold Standard | **0** |

Protected gold reference on main: `s2-eng-y3-w01-l1` (not counted as pipeline completion).

Year 3 English program keys (`s2-eng-y3-wXX-lY`): Written Core auto-validated through **w07-l3** (26 program lessons + protected w01-l1 on main). Next batch starts at `s2-eng-y3-w07-l4`.

## Batches completed this branch (Written Core only)

### Batch 01 — `s2-eng-y3-w01-l2` … `s2-eng-y3-w04-l1` (12)

Automated validation passed. Human gates pending.

### Batch 02 — `s2-eng-y3-w04-l2` … `s2-eng-y3-w07-l3` (14)

| Seed | Focus | Proposed code |
|---|---|---|
| s2-eng-y3-w04-l2 | Show, don't tell | EN2-CWT-01 |
| s2-eng-y3-w04-l3 | Conjunctions / complex sentences | EN2-CWT-01 |
| s2-eng-y3-w04-l4 | Handwriting speed and legibility | EN2-HANDW-01 |
| s2-eng-y3-w05-l1 | Summarising a story | EN2-RECOM-01 |
| s2-eng-y3-w05-l2 | Resolution, revising and editing | EN2-CWT-01 |
| s2-eng-y3-w05-l3 | Punctuating dialogue | EN2-CWT-01 |
| s2-eng-y3-w05-l4 | Publishing and sharing | EN2-CWT-01 |
| s2-eng-y3-w06-l1 | Text features | EN2-RECOM-01 |
| s2-eng-y3-w06-l2 | Planning a report | EN2-CWT-02 |
| s2-eng-y3-w06-l3 | Technical vocabulary | EN2-RECOM-01 |
| s2-eng-y3-w06-l4 | Listening and note-taking | EN2-OLC-01 |
| s2-eng-y3-w07-l1 | Main idea and key details | EN2-RECOM-01 |
| s2-eng-y3-w07-l2 | Classification paragraph | EN2-CWT-02 |
| s2-eng-y3-w07-l3 | Pronouns and cohesion | EN2-CWT-01 |

Also awaiting review: maths pilot `s2-mat-y3-w02-l1`.

**Not Gold Standard.** Do not apply draft SQL to remote D1.

## Next resume point

1. Upgrade `scripts/gold-pipeline/build-written-english-batch03.py` to the same quality as batch 02.
2. Author/validate next 12 starting at `s2-eng-y3-w07-l4`.
3. Keep human educational / NESA / browser gates closed until real review.
4. After Year 3 English Written Core advances, continue Stage 2 subjects in order; then Stage 4.

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 -c "import json;print(json.load(open('lesson-pipeline/completion-manifest.json'))['next_resume'])"
```

## Known constraints

- Validator still requires 1–2 existing Pip/Juno `CartoonEpisode` payloads for Gold-shaped JSON.
- Batch 03 builder remains template-heavy until upgraded like batch 02.
- Markdown drafts in `lesson-pipeline/drafts/batch-001` do not count.
- Draft SQL lives under `lesson-pipeline/artifacts/` only.
- Full 19,202 completion is multi-session; do not claim platform-complete.
