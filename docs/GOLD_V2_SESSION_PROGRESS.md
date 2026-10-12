# Gold v2 session progress — 13 October 2026 (Y4 Maths in progress)

Resume from `feature/gold-v2-resumable-pipeline`. Do not merge, deploy, or apply remote D1.

Machine-readable tracker: `lesson-pipeline/completion-manifest.json`.

## Completion gates (honest)

| Gate | Count |
|---|---|
| Automatically validated (pipeline) | **835** |
| Educationally reviewed / NESA / browser / fully approved | **0** |

## Year 4 English Written Core — COMPLETE (auto)

- **160 / 160** auto-validated (`s2-eng-y4-w01-l1` … `w40-l4`)
- Builders: `build-written-english-y4-batch01.py` … `batch14.py` + `english_y4_support.py`
- Assessment: `assessment_quiz` skill quizzes; meta stems remaining **0**

## Year 4 Mathematics — in progress

- **36 / 160** auto-validated (`s2-mat-y4-w01-l1` … `w09-l4`)
- Builders: `build-written-maths-y4-batch01.py` … + `maths_y4_support.py`
- Catalogue codes (content points pending): MA2-RN-01 (wording in sources/), AR-01/02, MR-01, PF-01, RN-02, NSM-01, GM-01, …

## Next resume

`s2-mat-y4-w10-l1` — continue Year 4 Mathematics Written Core in 12-lesson batches.

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/build-written-maths-y4-batch04.py
python3 scripts/gold-pipeline/pipeline.py run --limit 12
```
