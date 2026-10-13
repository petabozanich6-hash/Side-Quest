# Stage 3 Phase A — quality audit (read-only)

**Date:** 2026-10-13  
**Agent role:** Stage 3 Curriculum Development Lead — Phase A continuation  
**Authority hub inspected:** `.worktrees/parallel-workers` (`feature/gold-v2-parallel-workers`)  
**This branch:** documentation only. No lesson authoring. No partition, checkpoint, or coordinator changes.

Machine-readable exports:

- [stage3-audit/quality-audit-summary.json](stage3-audit/quality-audit-summary.json)
- [stage3-audit/quality-audit-lessons.csv](stage3-audit/quality-audit-lessons.csv)
- [stage3-audit/quality-audit-cultural.csv](stage3-audit/quality-audit-cultural.csv)

---

## Ownership still blocks authoring

Live state at audit time:

| Band | Partition owner | Hub authored + auto-validated |
|---|---|---:|
| `s3-eng-y5-*` | `builder-s4-music` | 160/160 |
| `s3-mat-y5-*` | `builder-s4-food` | 138/160 (rising during audit; earlier snapshot 126) |
| `s3-sci-y5-*` | `builder-s4-design` | 80/80 |
| `s3-hsie-y5-*` | `builder-s4-ist` | 80/80 |
| `s3-arts-y5-*` | `builder-s4-visual` | 80/80 |
| `s3-pdh-y5-*` | reserved wave-1 → `builder-s4-dance` | 0 |
| All `s3-*-y6-*` | reserved wave-1 → existing subject lanes | 0 |

**Safely claimable Stage 3 seeds for a new worker: none.**  
Coordinator `auto_attach` remains off; tick is active. Human gates remain 0.

This audit therefore evaluates existing hub lessons only. It does **not** start Phase B master authoring.

---

## Snapshot counts

| Metric | Count |
|---|---:|
| Stage 3 inventory | 1,280 |
| Hub authored Stage 3 JSON aligned to checkpoint | **538** |
| Auto-validated (`automated_validation_passed`) | **538** |
| Educationally reviewed / NESA verified / browser verified / fully approved | **0** |
| `review_status: unreviewed` | 538 |
| Lessons with `interactive_activities` | 0 |
| Lessons with cartoon episode + SVG | 538 |
| Remaining unauthored Stage 3 | 742 |

Subject totals in this authored set: English 160, Mathematics 138, Science 80, HSIE 80, Creative Arts 80 (all Year 5).

---

## Teaching quality (structural)

Sampled and scanned fields across all authored Stage 3 lessons:

- Four teach steps with substantial `explain` text (subject means ~765–961 characters).
- Guided practice, independent task, worked example, quiz (10 items), stage hints, parent notes present in the Written Core schema.
- No thin-teaching failures under a simple length/structure scan (steps ≥ 4, mean explain ≥ 400, guided + independent present).
- Adventure framing and explicit instruction are present in titles/missions.

**Honest limits of this scan**

- AUTOMATED VALIDATION PASSED for hub receipts.
- This audit did **not** run browser rendering, mobile layout tests, or live D1 application.
- Static length checks cannot certify pedagogical accuracy, diagram usefulness, or cultural correctness.
- HUMAN EDUCATIONAL REVIEW PENDING for all 538.

---

## NESA / outcome mapping

### Repository map lag (important)

`worker/src/data/nsw-outcomes.ts` still contains an older/partial Stage 3 set (for example `MA3-RWN-01`, `ST3-4LW-S`, `HT3-1`, `VA3-1`).

The Gold v2 hub instead authors against pipeline source files under `lesson-pipeline/sources/nesa-*.json` (retrieved 2026-10-13 from curriculum.nsw.edu.au), including:

- Mathematics: `MA3-RN-01` … (not `MA3-RWN-01`)
- Science & Technology 2024: `ST3-SCI-01`, `ST3-PQU-01`, `ST3-DAT-01`, …
- HSIE 2024: `HS3-ACH-01`, `HS3-HIS-01`, `HS3-GEO-01`, …
- Creative Arts 2024: `CA3-VIS-01`, `CA3-MUS-01`, `CA3-CWT-01`
- English: includes `EN3-SPELL-01` (present in pipeline English source; absent from `nsw-outcomes.ts`)

### Audit vs repo map

| Result | Lessons |
|---|---:|
| All listed codes exist in `nsw-outcomes.ts` | 165 |
| At least one code missing from `nsw-outcomes.ts` | 373 |

Missing-from-repo-map concentration: arts 80, sci 80, hsie 80, mat 90, eng 43.

This is primarily a **catalogue synchronisation problem**, not proof that hub codes are fabricated. Pipeline sources include official wording + URL + retrieval hash, and each source file states that content-point alignment and NESA gates remain pending.

### Required human NESA work

1. Update `nsw-outcomes.ts` (and lesson-plan outcome docs) to the 2022/2024 Stage 3 codes used by the hub sources.
2. Independently verify each code/wording against NESA.
3. Map lessons to content points, not only outcome codes.
4. Only then advance `nesa_verified` via real attestations.

Do **not** treat auto-validation or pipeline source JSON as NESA verification.

---

## Cultural / First Nations review

Strong-term scan (Aboriginal / Torres Strait / First Nations / First Peoples / Indigenous Australians / Dreaming / explicit CULTURAL REVIEW), plus HSIE lessons using Country:

| Result | Count |
|---|---:|
| Lessons with First Nations content signals | 100 |
| Explicit cultural-review flag in source/parent notes | 80 |
| Content signals **without** explicit flag | 20 |

Unflagged set at audit time: `s3-sci-y5-w31-l1` … `s3-sci-y5-w40-l2` (food/fibre and related Investigate lessons). These need specialist cultural review flags before any release claim.

HSIE Week 1 (`s3-hsie-y5-w01-l1`, First Nations Peoples and Country) is flagged `CULTURAL REVIEW` and remains `unreviewed`. Do not invent community-specific cultural knowledge in repairs; keep specialist review required.

Full list: [stage3-audit/quality-audit-cultural.csv](stage3-audit/quality-audit-cultural.csv).

---

## Media and interactivity gaps

| Capability | Stage 3 hub status |
|---|---|
| CartoonEpisode (captions / optional speechSynthesis) | Present in all 538 |
| Instructional SVG | Present in all 538 |
| Hosted/real video files or verified embeds | None observed |
| `interactive_activities` (flip/sort/sentence/planner) | **0 / 538** |
| Phase 2 premium video packs | Not started (owner Written Core directive) |

Renderer already supports flip cards, sort, choice sets, sentence builder, planner, spelling. Stage 3 Written Core has not populated those fields yet.

---

## Proposed six **review** masters (not new authoring)

Because the original Phase B authoring masters are owned/reserved, use already-authored hub lessons as review masters:

| # | Seed | Why |
|---|---|---|
| 1 | `s3-eng-y5-w01-l1` | Plot/comprehension; English outcome already in repo map |
| 2 | `s3-mat-y5-w01-l1` | Place value; tests `MA3-RN-01` vs stale `MA3-RWN-01` map |
| 3 | `s3-mat-y5-w17-l1` | Fractions; different maths representation demand |
| 4 | `s3-sci-y5-w01-l1` | Adaptations; 2024 Science code path |
| 5 | `s3-hsie-y5-w01-l1` | First Nations HSIE; cultural review required |
| 6 | `s3-arts-y5-w01-l1` | Drawing techniques; Creative Arts 2024 codes |

These are for human educational / NESA / browser review — **not** for this agent to overwrite.

---

## Recommended next steps (owner decision)

1. **Keep this agent read-only for authoring** until an exclusive Stage 3 partition is explicitly assigned, or existing lanes finish and attach wave-1 bands.
2. **Approve a docs/fix sync task** (separate from lesson ownership): align `nsw-outcomes.ts` + Stage 3 lesson-plan outcome docs to hub `lesson-pipeline/sources/nesa-*.json`.
3. **Queue human review** of the six review masters above before any wider Stage 3 release claim.
4. **Flag** science w31–w40 for cultural review.
5. **Defer** Phase B new-lesson authoring and Phase 2 premium video work until ownership is cleared.
6. Optionally refresh stale `STAGE3_REBUILD_TRACKER.md` counts in a later docs PR (current tracker still says 4 authored).

---

## Status labels for this work

| Gate | Status |
|---|---|
| Phase A inventory + ownership audit | Complete |
| Read-only quality audit of authored Y5 hub lessons | Complete (this document) |
| AUTOMATED VALIDATION PASSED | Yes for 538 hub lessons |
| VISUAL TESTING PASSED | Not run in this pass |
| HUMAN EDUCATIONAL REVIEW | Pending |
| NESA VERIFICATION | Pending |
| Phase B lesson authoring by this agent | **Blocked — ownership conflict** |
