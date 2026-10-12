# Gold v2 session progress — 13 October 2026 (Y4 Maths in progress)

Resume from `feature/gold-v2-resumable-pipeline`. Do not merge, deploy, or apply remote D1.

Machine-readable tracker: `lesson-pipeline/completion-manifest.json`.

## Completion gates (honest)

| Gate | Count |
|---|---|
| Automatically validated (pipeline) | **847** |
| Educationally reviewed / NESA / browser / fully approved | **0** |

## Year 4 English Written Core — COMPLETE (auto)

- **160 / 160** auto-validated

## Year 4 Mathematics — in progress

- **48 / 160** auto-validated (`s2-mat-y4-w01-l1` … `w12-l4`)
- Builders: `build-written-maths-y4-batch01.py` … + `maths_y4_support.py`

## Next resume

`s2-mat-y4-w13-l1`

```sh
python3 scripts/gold-pipeline/pipeline.py status
python3 scripts/gold-pipeline/build-written-maths-y4-batch05.py
python3 scripts/gold-pipeline/pipeline.py run --limit 12
```
