# Stage 1 Phase A audit — Gold Standard v2

**Status:** PHASE A COMPLETE — audit only. No Stage 1 lessons authored.  
**Agent:** Stage 1 Curriculum Development Lead  
**Date:** 13 October 2026  
**Checkout used for this report:** isolated worktree `.worktrees/stage1-phase-a-audit` on branch `cursor/stage1-phase-a-audit-19a7` (from `origin/main` at `7a082072`)  
**Gold hub inspected (read-only):** `.worktrees/parallel-workers` on `feature/gold-v2-parallel-workers` (`a3d6a017`)

This document answers the required Phase A report. It does **not** author lessons, modify partitions, alter checkpoints, merge to main, deploy, or change production D1.

---

## Safety scan (completed before any proposal)

| Check | Finding |
|---|---|
| Active primary checkout | Main repo was on `cursor/stage2-phase-a-audit-eba6` (Stage 2 audit agent). Stage 1 work stayed out of that branch. |
| Worktrees | Many Gold v2 builder worktrees and `parallel-workers` hub are active under `.worktrees/`. Episode, auth, messaging and pet-room worktrees also exist. |
| Gold pipeline location | `scripts/gold-pipeline/` + `lesson-pipeline/` on `feature/gold-v2-resumable-pipeline` / `feature/gold-v2-parallel-workers` (ahead of main; not merged). |
| Coordinator / partitions | `lesson-pipeline/partitions.json` on the parallel hub. 20 workers. **Zero `s1-*` seed patterns.** |
| Stage 1 authored content | **0** `lesson-pipeline/authored/s1-*.json` on hub and remote gold tips. |
| Protected lesson IDs | Inventory marks only **`s2-eng-y3-w01-l1`** as protected. No Stage 1 seed is protected. |
| Parallel cloud agents (same environment) | Concurrent audit agents observed for Stage 1, Stage 2 and Early Stage 1. None hold a Stage 1 partition. |
| Pipeline lock | Untracked `lesson-pipeline/.pipeline.lock` observed in the primary checkout. Treated as in-use by another process; left untouched. |

**Ownership conclusion:** All **1,280** Stage 1 seed keys are currently unassigned in the Gold v2 partition system. They are catalogue placeholders only. Safe ownership for *authoring* still requires an explicit owner decision because binding Gold instructions currently prioritise Stage 2 and Stage 4 Written Core before any other stage.

---

## 1. Exact Stage 1 catalogue size

**1,280 lessons.**

Sources that agree:

- `docs/inventory/S1.csv` — 1,280 data rows (+ header)
- `docs/LESSON_REBUILD_MASTER.md` — Stage 1 = 1,280
- `worker/migrations/0036_s1_program.sql` — inserts the full Stage 1 program
- Gold hub `lesson-pipeline/inventory.jsonl` — 1,280 records with `stage: "S1"`

### Catalogue structure

| Year | Subject | Lessons | Pattern |
|---|---|---:|---|
| Year 1 | English | 160 | 40 weeks × 4 lessons |
| Year 1 | Mathematics | 160 | 40 weeks × 4 lessons |
| Year 1 | Science and Technology | 80 | 40 weeks × 2 lessons |
| Year 1 | HSIE | 80 | 40 weeks × 2 lessons |
| Year 1 | Creative Arts | 80 | 40 weeks × 2 lessons |
| Year 1 | PDHPE | 80 | 40 weeks × 2 lessons |
| Year 2 | English | 160 | 40 weeks × 4 lessons |
| Year 2 | Mathematics | 160 | 40 weeks × 4 lessons |
| Year 2 | Science and Technology | 80 | 40 weeks × 2 lessons |
| Year 2 | HSIE | 80 | 40 weeks × 2 lessons |
| Year 2 | Creative Arts | 80 | 40 weeks × 2 lessons |
| Year 2 | PDHPE | 80 | 40 weeks × 2 lessons |
| **Total** | | **1,280** | |

Seed-key pattern: `s1-<sub>-y<1|2>-w<WW>-l<N>`  
Subject tokens: `eng`, `math`, `sci`, `hsie`, `pdh`, `arts`.

Hours in `docs/lesson-plans/stage-1.md` match this catalogue (English 400, Mathematics 240, each other KLA 120 across the two-year stage).

---

## 2. Existing authored and validated Stage 1 lessons

| Measure | Count |
|---|---:|
| Inventory status `queued` | 1,280 |
| Inventory status authored / validated | 0 |
| Gold authored bundles `s1-*` | 0 |
| Gold artifacts for `s1-*` | 0 |
| Human educational / NESA / browser / release gates for Stage 1 | 0 |

On main, Stage 1 rows are **coming-soon placeholders** from migration `0036_s1_program.sql`:

- title, year, week, unit, lesson role
- generic `learning_intention`
- `outcome_codes: []`
- `coming_soon: true`
- source note stating outcomes are not assigned yet

No Stage 1 lesson has Gold Standard v2 Written Core content.

For comparison only (other stages on the parallel hub): hub dashboard reported **2,719** auto-validated authored bundles across Stage 2 / Stage 4 / electives, with **human gates still at 0**. That work must not be disturbed.

---

## 3. Lessons already assigned or reserved

**Stage 1 reserved by partitions: none.**

Current parallel-hub workers (all Stage 2 / Stage 4 / elective patterns):

- `builder-y3` → `s2-*-y3-*`
- `builder-y4` → `s2-*-y4-*`
- `builder-y7-hsie`, `builder-y8-eng`, eight `builder-tech-*`, eight Stage 4 elective builders

Protected benchmark (must never be overwritten):

- `s2-eng-y3-w01-l1` (migration `0044_s2_y3_w01_l1_gold_expression.sql`)

Open Gold-related draft PRs inspected earlier in the audit window include `#104` (guardrails) and `#105` (resumable pipeline). Neither assigns Stage 1 seeds.

---

## 4. Unassigned Stage 1 lesson identifiers

**All 1,280 `s1-*` seed keys are unassigned.**

Examples of free Week 1 identifiers suitable for master-lesson proposals:

- `s1-eng-y1-w01-l1` … `l4`
- `s1-math-y1-w01-l1` … `l4`
- `s1-sci-y1-w01-l1`, `l2`
- `s1-hsie-y2-w01-l1`, `l2`
- `s1-arts-y2-w01-l1`, `l2`
- `s1-pdh-y2-w01-l1`, `l2`

Availability in the queue is **not** the same as authorisation to start production. See binding-priority conflict below.

---

## 5. Current Stage 1 lesson quality

**Grade: catalogue scaffolding only — not teachable premium content.**

Strengths already present:

- Complete two-year, six-subject catalogue
- Sensible unit titles and weekly topic stems
- Year 2 topics generally build on Year 1 (e.g. counting to 20 → to 1000; local family history → local area long ago)
- Lesson roles give a repeated weekly rhythm (Reading / Writing / Language / Speaking for English; Concept / Strategies / Problem solving / Fluency for Mathematics)

Gaps against premium Gold Standard v2:

- No explicit teaching, worked examples, guided practice, independent tasks, quizzes, parent guidance, hints, offline alternatives or evidence instructions
- Outcome codes empty across the whole stage
- No instructional SVG / episode / verified video
- No interactive activities populated
- English subject content plan still marked open in `docs/lesson-plans/stage-1.md`
- English unit order starts with story retelling (weeks 1–4) before a dedicated phonics unit (weeks 5–8). NESA Stage 1 still has `EN1-PHOKW-01`; phonics must remain strong. Master-lesson design should either teach phonics inside early reading weeks or seek approval to emphasise a later phonics seed as the English master
- HSIE outcome codes are still listed as missing in the build checklist
- Placeholder `learning_intention` text is generic and unsuitable for parent delivery

**AUTOMATED VALIDATION PASSED:** not applicable — no Stage 1 authored bundles exist.  
**VISUAL TESTING PASSED:** not performed — nothing Stage 1 to render beyond coming-soon cards.  
**HUMAN EDUCATIONAL REVIEW PENDING:** 1,280 / 1,280.

---

## 6. Existing video capabilities

| Capability | Where | Stage 1 readiness |
|---|---|---|
| External iframe embeds (`resource.embed_url`) | `ChildLesson.jsx` watch stage | Usable only with verified, rights-cleared URLs. Gold rules forbid inventing URLs and discourage external embeds for new Gold content. |
| In-browser cartoon episode (`CartoonEpisode.jsx` via `QuestVisual`) | Main frontend | Schema exists; needs original scene/transcript content per lesson. |
| Teaching episode player (`frontend/src/components/episode/*`) | `feature/gold-v2-episode-pilot-rounding` | Phase 2 pilot (Year 3 rounding). Not on main. Not Stage 1 content. |
| Browser speech synthesis (`frontend/src/lib/speak.js`) | Main | Useful for short word/letter audio; prefers en-AU voices when available. Not a full lesson narration system. |
| Owner Gold directive | `AGENTS.md` on gold branches | **PHASE 1 = Written Core first** for Stage 2/4. **PHASE 2 = moving/interactive media after Written Core.** Videos are not a Phase 1 prerequisite. |

**Conclusion for Stage 1 media:** outstanding educational video is a Phase 2 / premium-media track. For any early Stage 1 masters, produce **PROPOSED** scripts, storyboards, captions, runtime estimates and placement notes. Do not mark videos completed. Do not invent URLs.

---

## 7. Existing image and illustration capabilities

| Capability | Notes |
|---|---|
| Inline instructional SVG in `worked_visuals` / `QuestVisual` | Approved Gold path. Content-specific diagrams required; generic process cards are rejected by the standard. |
| Printable resources | Supported field in authored schema (`printable_resource`). |
| External stock / copyrighted images | Not authorised by default. |
| Generated asset pipeline | No dedicated Stage 1 illustration factory found in-repo. Assets must be original SVG/text or separately authorised. |

Stage 1 currently has **no** completed instructional visuals.

---

## 8. Existing interactive components

Working components already rendered by the child lesson player:

- Quest accept / teach steps / learn stage
- `RevealCards` (tap-to-flip)
- `SortActivity` (tap-to-bucket classification)
- `ChoiceSet` / `QuestQuiz`
- `SentenceBuilder`
- `Planner`
- Spelling segment with optional speech
- Word challenges / suspense builder
- File/photo evidence hand-in
- Pet help hint ladders driven from lesson content
- Support level banner (green / yellow / red)

Authored Gold schema also includes `interactive_activities`, but the inspected Written Core sample left it unused (`null`), consistent with Phase 1 Written Core.

**Not present as production-ready Stage 1 components:**

- Drag-and-drop matching
- Dedicated phonics / grapheme builders
- Interactive number lines (episode branch has related pieces; not a general Stage 1 library)
- Counting manipulative canvases
- Picture comprehension boards beyond sort/reveal patterns

Premium Stage 1 can use existing tap/sort/quiz/planner/spelling patterns immediately. New interaction types should be proposed separately and built before lessons depend on them.

---

## 9. Missing functionality required for premium Stage 1 lessons

1. **Owner authorisation to open Stage 1 production** while Stage 2/4 Written Core is still incomplete (binding conflict).
2. **Exclusive Stage 1 partition(s)** in `partitions.json` (do not invent a second hub).
3. **NESA outcome capture for HSIE K–6 Stage 1** (still flagged missing in build checklist).
4. **Verified Stage 1 outcome mapping** for English, Mathematics, Science and Technology, PDHPE and Creative Arts against current NESA pages/syllabus versions before codes are written into lessons.
5. **Stage 1 age-band teaching adaptations** in authored content (shorter instructions, stronger scaffolding, parent-assisted reading paths).
6. **Phonics sequencing decision** relative to the existing catalogue order.
7. **Audio-supported teaching path** beyond spelling TTS (scripts + proposed narration; later Phase 2 media).
8. **Instructional SVG library** for letter formation, number lines, place-value, maps, science diagrams.
9. **Proposed video package workflow** (script → storyboard → captions → rights → production), separate from Written Core completion.
10. **Optional new interactives** (phonics builder, number line, drag-drop) if required after masters are designed against existing components.
11. **Human review capacity** — automated validation alone never certifies educational completion.

### NESA / syllabus notes already in-repo (do not invent beyond these)

Documented in `docs/lesson-plans/`:

- English K–10 (2022): Stage 1 codes include `EN1-OLC-01`, `EN1-VOCAB-01`, `EN1-PHOKW-01`, `EN1-REFLU-01`, `EN1-RECOM-01`, `EN1-CWT-01`, `EN1-SPELL-01`, `EN1-HANDW-01`, `EN1-UARL-01`
- Mathematics K–10 (2022): Stage 1 codes such as `MA1-RWN-01/02`, `MA1-CSQ-01`, `MA1-FG-01`, measure/space/data/chance codes; overarching `MAO-WM-01`
- Science and Technology K–6 (2024, from 2027): `ST1-SCI-01`, `ST1-PQU-01`, `ST1-DAT-01`, `ST1-DDT-01`
- PDHPE K–6 (2024, from 2027): `PH1-MSP-01`, `PH1-RRS-01`, `PH1-IHW-01`, `PH1-SMI-01`
- Creative Arts K–6 (2024, from 2027): `CA1-DAN-01`, `CA1-DRA-01`, `CA1-MUS-01`, `CA1-VIS-01`
- HSIE K–6 (2024, from 2027): codes **not yet captured** in repository outcome maps

Every lesson’s `curriculum` block must keep `verification_status` honest until checked against NESA.

---

## 10. Safest isolated development strategy

### Binding conflict (must resolve before Phase B)

`AGENTS.md` on the Gold branches states a binding owner directive (12 October 2026):

> Complete all **1,282 Stage 2** and **3,620 Stage 4** existing lesson records before working on any other stage.  
> PHASE 1 = Written Core first. PHASE 2 = media later.

`docs/LESSON_REBUILD_MASTER.md` on main also marks Stage 1 priority as **Later**.

This Stage 1 lead brief authorises **Phase A only**. Phase B+ needs an explicit owner override or a sequenced hand-off after Stage 2/4 Written Core.

### Recommended safe approach (after approval)

1. **Keep Stage 1 out of the live parallel hub** until the owner opens a Stage 1 partition.
2. Continue Stage 1 work in an **isolated worktree/branch** based on `origin/main` or a read-only snapshot of the gold pipeline tooling, without editing:
   - `lesson-pipeline/checkpoint.json`
   - `lesson-pipeline/partitions.json`
   - active worker checkpoints under `lesson-pipeline/workers/*`
   - continuous reconcile state
3. When authorised, register **one exclusive worker**, e.g. `builder-s1-masters` with seed patterns limited to the six master seeds (or a tiny Week 1 slice), via the existing parallel-worker mechanism — not a competing hub.
4. Author Gold bundles as `lesson-pipeline/authored/<seed_key>.json` using architecture `d1-worker`, matching the existing schema (`lesson`, `curriculum`, `requirements`).
5. Run the existing validator / pipeline locally for those seeds only.
6. For premium media ambitions, attach **PROPOSED** video/storyboard packages in docs beside Written Core; do not claim Phase 2 complete.
7. Never merge to main, deploy, or apply remote D1 without owner instruction.
8. Avoid writing into the primary checkout while it remains on another audit agent’s branch.

### What this audit already did for isolation

- Created worktree `.worktrees/stage1-phase-a-audit` on `cursor/stage1-phase-a-audit-19a7`
- Left Stage 2 audit branch, parallel hub, builder worktrees and pipeline lock untouched

---

## 11. Proposed six master lessons

These use **existing unassigned catalogue seed keys** and demonstrate Year 1 + Year 2 coverage across all six subjects.

| # | Seed key | Year | Subject | Catalogue title | Why this master |
|---|---|---|---|---|---|
| 1 | `s1-eng-y1-w01-l1` | Year 1 | English | Retelling familiar stories (Reading) | Entry reading lesson; can model parent-assisted retell, oral language and scaffolded comprehension. **Optional alternate if phonics-first preferred:** `s1-eng-y1-w05-l1` Digraphs sh, ch and th. |
| 2 | `s1-math-y1-w01-l1` | Year 1 | Mathematics | Counting to 20 (Concept) | Foundational number sense with concrete manipulatives and visual counting. |
| 3 | `s1-sci-y1-w01-l1` | Year 1 | Science and Technology | What is alive (Investigate) | Observation and living/non-living criteria; screen-free investigation friendly. |
| 4 | `s1-hsie-y2-w01-l1` | Year 2 | HSIE | Our local area long ago (Investigate) | Local history inquiry; blocked for final NESA codes until HSIE outcomes are captured. |
| 5 | `s1-arts-y2-w01-l1` | Year 2 | Creative Arts | Observational drawing (Explore and learn) | Visual arts technique demo + create workflow; maps to `CA1-VIS-01` pending verification. |
| 6 | `s1-pdh-y2-w01-l1` | Year 2 | PDHPE | Who I am (Learn and discuss) | Identity/wellbeing discussion with practise-and-apply partner lesson available as `l2`. |

Each master, when authorised, should be Written Core first and include:

- Accurate (or explicitly pending) NESA mapping
- Parent instructions vs child-facing content
- Explicit teaching, worked example, guided + independent practice
- Existing-component interactive (sort / reveal / quiz / planner as appropriate)
- Screen-free activity
- Assessment evidence + parent marking guidance
- Differentiation and extension
- **PROPOSED** video script/storyboard package (not counted as completed media)

---

## 12. Estimated production and media requirements

These are scope measures, not calendar estimates.

### Written Core (Phase D after masters approved)

- **1,280** lessons total
- After 6 masters: **1,274** remaining
- Suggested production slices: exclusive partitions by year×subject (12 partitions) or smaller week-band workers
- English + Mathematics = 640 lessons (highest literacy/numeracy scaffolding cost)
- Other KLAs = 640 lessons (2 lessons/week pattern)

### Media (Phase 2 / premium track — proposed, not completed)

| Asset class | Approximate need | Notes |
|---|---|---|
| Instructional SVGs | Often 1–4 per lesson where they teach | Letter formation, number lines, maps, science diagrams |
| Proposed short teaching videos | Target 1 purposeful segment for most lessons; denser for phonics/movement/arts demos | Scripts + storyboards + captions first |
| Episode/cartoon scenes | Selective flagship lessons | Reuse `CartoonEpisode` / episode player only with original content |
| Audio supports | High need in Year 1 English | TTS may cover words; full narration remains proposed until produced |

### Prerequisite work before mass production

- Owner decision on Stage 1 start vs Stage 2/4 Written Core priority
- HSIE outcome code capture
- Stage 1 English phonics sequencing confirmation
- Master-lesson validation + browser render checks
- Human educational review of the six masters

---

## 13. Recommended next steps

**Awaiting your approval. Phase B has not started.**

1. **Decide priority:**  
   - (A) Keep Stage 1 paused until Stage 2/4 Written Core finishes, or  
   - (B) Authorise a narrow Stage 1 master-lesson exception now.
2. If (B), approve the six seed keys above (and the optional English phonics alternate if preferred).
3. Authorise creation of an exclusive Stage 1 partition / worker through the existing coordinator — without modifying current S2/S4 worker assignments.
4. Capture HSIE Stage 1 NESA outcomes into the repository outcome maps before HSIE masters are marked NESA-ready.
5. Proceed to **Phase B — master lessons** as Written Core + proposed media packages only.
6. Run automated validation and browser rendering on the six masters; keep human educational review pending until you review them.
7. Only after master approval, plan Phase D partitions for the remaining 1,274 lessons.

---

## Testing status for this Phase A report

| Gate | Result |
|---|---|
| AUTOMATED VALIDATION PASSED | Not run for Stage 1 content (none authored). Inventory/partition inspection performed. |
| VISUAL TESTING PASSED | Not performed for Stage 1 lessons (placeholders only). |
| HUMAN EDUCATIONAL REVIEW PENDING | Entire Stage 1 catalogue. |

No lessons were generated. No validators were weakened. No checkpoints, partitions, deployments or production data were modified.
