# Gold v2 assessment quality audit (October 2026)

**Branch:** `feature/gold-v2-assessment-quality-hardening`  
**Worktree:** `.worktrees/assessment-quality-hardening` (isolated from live authoring)  
**Sample source:** committed authored JSON at branch point `770843b9` on `feature/gold-v2-resumable-pipeline` (read-only evidence). Main checkout had additional uncommitted Stage 4 maths files; those were inspected only as optional extras.  
**Scope:** Phase 1 Written Core assessment surfaces (`quiz`, teach-step `check`, parent marking guidance).  
**Honesty:** This audit is automated + editorial inspection. It does **not** certify educational review, NESA verification, browser verification, or release approval.

## Sampling method

1. **Full inventory scan** of `lesson-pipeline/authored/*.json` in the isolated worktree (**1,475** bundles at audit time).
2. **Stratified deep sample** of **70** lessons: for each `(stage, subject, year)` bucket, take early / quartile / middle / late files (Stage 2 Y3–Y4 across eng/mat/sci/hsie/pdhpe/arts; Stage 4 Y7 eng + mat).
3. **Contrast cases:** hand-authored strong English Week 1 Lesson 2 vs generator-backed Arts/HSIE/Science/PDHPE/S4 bundles.
4. **Classifier:** structural regex/heuristic flags for meta/study stems, ellipsis truncation, filler distractors, circular explanations, mechanical marking guides, subject metadata mismatch. Flags are **confirmed** when observed in file text; pedagogical “thin teaching” remains **suspected** unless teach-step length gates already fail.

### Inventory at audit (worktree)

| Stage | Subject | Count |
|---|---|---|
| S2 | English | 319 |
| S2 | Mathematics | 320 |
| S2 | Science | 160 |
| S2 | HSIE | 160 |
| S2 | PDHPE | 160 |
| S2 | Creative Arts | 160 |
| S4 | English Y7 | 160 |
| S4 | Mathematics Y7 | 36 |

Years present in authored: Y3 (639), Y4 (640), Y7 (196).

## Executive findings

| Finding | Severity | Status | Prevalence (full scan) |
|---|---|---|---|
| Study-behaviour / meta assessment templates from shared generator | **Critical** | Confirmed | **1,472 / 1,475** lessons with ≥1 banned-style study stem; **1,472** “study-heavy” (≥3 such stems) |
| Truncated MC options ending in ellipsis (`…`) from `_clip` | **High** | Confirmed | **609** lessons |
| Implausible filler distractors (“Ignore the task…”, “Copy the worked example…”, “Choose randomly…”) | **High** | Confirmed | **796** lessons |
| Cross-subject identical generator stems | **High** | Confirmed | e.g. “A learner is practising …” in **1,472** lessons spanning all subjects |
| Circular / near-circular explanations (correct option restated) | **Medium** | Confirmed in sample | Sample mean low; systemic risk wherever answer text is pasted into `explanation` |
| Mechanical short-answer marking guides (`Require new numbers…`) | **Medium** | Confirmed | Dominant in generator-backed SA items |
| Answers answerable without lesson content (pure study habits) | **High** | Confirmed for template items; mixed for Q1 content prompts | Template items Q3–Q8 often test “how you study”, not the concept |
| Wrong-subject curriculum metadata | **Low in sample** | Suspected elsewhere | **0 / 70** stratified mismatches; seed↔`learning_area` generally aligned |
| Thin teaching while 8+8 structure passes | **Medium** | Suspected for review/unit lessons | Teach-step length often meets ≥300 chars; instructional depth still needs human review |
| Validator passes structurally complete weak quizzes | **Critical (tooling)** | Confirmed | Prior gate banned only 4 meta stems; not study templates, truncation, or filler family |

**Confirmed root cause:** Nearly all Written Core bundles without a hand-authored `assessment` list call `assessment_quiz.build_skill_quiz` via `written_bundle.py`. That builder previously emitted a fixed 8-stem study-behaviour template (application of “transfer / understanding / feedback / habit”) with `_clip(..., n)` producing ellipsis-truncated options and generic filler pads. Early English W01 L2 (and the rounding pilot `s2-mat-y3-w02-l1`) show what content-specific assessment looks like when authored directly.

## Evidence by subject / year

### Strong contrast (confirmed pass for content specificity)

- `lesson-pipeline/authored/s2-eng-y3-w01-l2.json` — complete-sentence identification, subject/verb items, short answers that demand production; distractors are linguistic, not study slogans.
- `lesson-pipeline/authored/s2-mat-y3-w02-l1.json` — rounding with concrete numbers, neighbouring tens/hundreds, midpoint rule (pilot-quality assessment).

### Generator-backed failures (confirmed)

Representative stems observed across unrelated subjects:

| Template | Approx. count | Example path |
|---|---|---|
| `A learner is practising … Which approach best shows understanding?` | 1,472 | `s2-arts-y3-w01-l1.json`, `s4-mat-y7-w01-l1.json` |
| `Which practice choice shows transfer of …` / maths feedback/working-note stems | 355 (maths) | `s2-mat-y3-w01-l1.json` |
| `Which habit strengthens evidence…` / `respect and accuracy` / `independent use` | 480 (hsie/pdhpe/arts) | `s2-hsie-y3-w01-l1.json` |
| `Which investigation habit keeps a comparison fair?` | 160 (science) | `s2-sci-y3-w01-l1.json` |
| `Which revision actually repairs meaning?` | 477 (english generator path) | `s2-eng-y4-w01-l1.json` |

**Arts example (`s2-arts-y3-w05-l2.json`):** MC options include truncated “Strong answer: …” strings ending mid-sentence; correct options dump model feedback; SA sample begins “Original response on new material: Strong answer: …”; marking guide is “Require independently produced work…”.

**Stage 4 English (`s4-eng-y7-w01-l1.json`, `s4-eng-y7-w20-l4.json`):** Same Stage 2 generator templates with slightly richer teaching text; assessment still asks whether a learner “shows understanding/transfer”, not Year 7 literary analysis on a fresh extract.

**Stage 4 Mathematics (`s4-mat-y7-w01-l1.json`, `s4-mat-y7-w09-l4.json` on main):** Financial fluency / integers teaching present, but quiz still uses “practising financial fluency / shows understanding” plus filler “Copy the model numbers…”.

### Subject metadata

- Stratified sample: **no confirmed** seed↔learning_area mismatches.
- Repair helper previously only recognised `s2-` prefixes for some subjects; Stage 4 `s4-mat-` / `s4-eng-` risked English default — **suspected** for any future repair runs (fixed in this branch’s repair script).

## Validator weaknesses (pre-hardening)

`scripts/gold-pipeline/validate.mjs` required ≥8 MC + ≥2 SA, unique stems, explanation length ≥50, narrow meta-stem ban, position balance, and a small filler phrase. It did **not** fail:

1. Study-behaviour templates that replaced the banned “Which idea is taught…” phrasing.
2. Ellipsis-truncated options.
3. Broader filler family used by the generator.
4. Circular explanations that paste the correct option.
5. Mechanical SA marking guides.
6. Dense repeated study templates within one quiz.
7. Seed subject vs `learning_area` consistency.

Consequently a lesson could pass “assessment quality” merely by having ten structurally shaped items.

## Root-cause analysis

1. **Shared generator design** optimised for “not meta stage recall” but substituted **generic learning-habit items** reusable across every subject.
2. **`_clip` + ellipsis** turned long teaching sentences into unreadable MC options.
3. **Filler pads** (`Ignore the task…`) were treated as acceptable uniqueness fuel.
4. **Authoring throughput** preferred `build_from_spec` without per-lesson `assessment` lists, so templates propagated to ~all subjects/years.
5. **Validation lag:** gate documented in `docs/GOLD_V2_ASSESSMENT_QUALITY.md` banned only the first meta family; repair script’s `quiz_is_weak` matched that narrow set, so “repaired” lessons could still be pedagogically weak.
6. **False confidence:** static_quality `passed` ≠ educational sign-off (already stated in pipeline docs; still easy to misread in batch reports).

## Recommended corrections (implemented on this branch)

| Layer | Action |
|---|---|
| Generator | Rewrite `assessment_quiz.build_skill_quiz` with subject strategies (maths calc/reasoning; English text evidence; Science evidence/prediction; HSIE/PDHPE/Arts evidence moves); ban study-meta stems; forbid ellipsis/filler options; Stage 4 stems more demanding |
| Validator | Expand structural/semantic checks in `validate.mjs` (templates, truncation, fillers, circular explain, mechanical guides, subject metadata) |
| Tests | Strong pilot still passes; weak mutations / generator regressions must fail |
| Repair | Path-argument resumable repair with live-authored refusal; dry-run; Stage 4 subject detection |
| Process | Authoring agent adopts generator+validator first; bulk repair only on offline copy after handoff |

## Before / after examples

### Before (generator template — `s2-mat-y3-w01-l1`)

- Stem: “A learner is practising whole number. Which approach best shows understanding?”
- Distractors: “Choose randomly because any option could be right.”
- Does not require place-value knowledge.

### After (new generator intent)

- Stem: “Which working best supports a correct answer for this lesson on whole number?” / number-bearing transfer items.
- Distractors: missing working, place-value errors, warned misconception.
- SA marking guides name accept/reject criteria for the skill, not “Require new numbers…” boilerplate alone.

### Still strong (unchanged hand-authored)

- `s2-eng-y3-w01-l2` / `s2-mat-y3-w02-l1` remain the quality bar for content-specific items.

## Integration note for authoring agent

See `docs/GOLD_V2_ASSESSMENT_QUALITY_REPAIR.md` and the draft PR body. Do **not** bulk-edit live `lesson-pipeline/authored` while another agent is writing. Pull/rebase this branch’s **code** (`assessment_quiz.py`, `validate.mjs`, repair script) when convenient; run offline repair later.

## Confirmed vs suspected summary

- **Confirmed:** template prevalence, truncation, fillers, validator gap, generator root cause, Stage 4 reuse of Stage 2 templates.
- **Suspected / needs human review:** whether individual review/showcase lessons have adequate teaching depth; occasional curriculum code nuance beyond seed↔area; any lesson whose Q1 prompt is already content-rich but later items are pure study habits (hybrid weakness).
