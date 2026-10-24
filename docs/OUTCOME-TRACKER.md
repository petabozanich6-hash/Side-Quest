# Curriculum Outcome & Mastery Tracker

Status: built on branch `feat/outcome-mastery-tracker`, **not merged or deployed**. Needs migration `0057` (see "Deploying").

## What it does

Each child has one record per curriculum outcome showing how far along they are (**Not Started, Introduced, Developing, Demonstrated, Prior learning, Achieved**), the evidence behind it, and why it last changed. It updates itself as children hand in work and parents review it. Parents never have to fill it in, and finishing a lesson never marks anything Achieved.

## Audit findings it is built on

| Area | What exists | How the tracker uses it |
|---|---|---|
| Curriculum data | `NSW_OUTCOMES` (NSW syllabuses, seed v3) is the only verified outcome list. Every other state/territory has `codes: "none"` in `data/jurisdictions.ts`. An AC9 import exists on the unmerged `data/ac9-import` branch. | NSW is the only catalogue. Other jurisdictions get an explicit "not available yet" explanation, never NSW outcomes and never invented ones. |
| Jurisdiction | `families.jurisdiction` (migration 0054), chosen at sign-up. | Decides which catalogue a family sees. Records are keyed by framework, so moving interstate hides but keeps them. |
| Lesson mapping | `outcome_codes` on lessons (manual builder and AI drafts, validated against the NSW list). Assignments keep a `lesson_snapshot`. | The snapshot's codes say which outcomes a piece of work addresses. |
| Completion and review | Quiz marked on the server (`quiz_results`), hand-in (`submissions`), parent review with per-outcome `outcome_mappings`. | Each is an evidence source. Review marks became "Shown it / Practising / Not yet" plus support. |
| Life Learning | `life_evidence.accepted_mappings` after parent review (NSW codes only; other states store plain-language mappings). | Reviewed NSW mappings count. Unreviewed AI suggestions never do. |
| Evidence Backpack | `portfolio.ts` builds the record from reviewed work, life learning, `evidence_notes` and reading. | Tracker links to these rows rather than copying them. The Backpack shows the tracker status beside its own per-work marks. |
| Learning plans | `learning_plans.ai_content` lists indicative outcome codes. No completion records exist for plan activities. | Shown as "Planned in…" on an outcome. Not counted as evidence. Lessons made from a plan count as lessons. |
| Existing tracking | Portfolio summary counted an outcome "achieved" whenever a review marked it so; the review screen pre-selected "Achieved". | Replaced by the tracker as the single record of mastery. The review no longer pre-selects anything. |

## Architecture

```
child hands in / passes quiz ─┐
parent reviews lesson work ───┤                      ┌─> outcome_evidence (one row per source per outcome, links only)
parent reviews life learning ─┼─> outcomeTracker.ts ─┼─> outcome_progress (current status + wording snapshot)
parent adds / links evidence ─┤   (hooks, safely())  └─> outcome_status_history (append-only, every change + reason)
Backpack note deleted ────────┘
```

* `worker/src/outcomeTracker.ts`: catalogue, rules, evidence sync, recompute, parent actions and `/api/outcomes/*` routes.
* Hooks are called from `lessonBuilder.submitWork`, `checkQuiz`, `reviewSubmission`, the life-learning review route and `planning.deleteEvidenceNote`. They run inside `safely()`, so a tracker problem can never fail a hand-in or review.
* `syncStudent()` rebuilds a child's evidence from existing records. It runs automatically the first time a child's tracker is opened (so families with history get a populated tracker), and from the "Recheck all records" button. It is idempotent.
* Frontend: `/parent/outcomes/:sid` (browse by subject, status, gap, search), `/parent/outcomes/:sid/:code` (evidence, criteria, confirm, history, suggestions), a "Curriculum progress" card on the Parent Hub and child overview, and a nav entry.

### API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/outcomes/summary` | Per-child counts for the Parent Hub |
| GET | `/api/outcomes/students/:sid` | Tracker for one child (`?refresh=1` resyncs) |
| POST | `/api/outcomes/students/:sid/rebuild` | Resync from all records |
| PUT | `/api/outcomes/students/:sid/support` | Documented adjustments on/off |
| GET | `/api/outcomes/students/:sid/outcomes/:code` | Outcome detail |
| POST | `…/outcomes/:code/confirm` · `…/unconfirm` | Parent confirmation (note required to override or withdraw) |
| POST | `…/outcomes/:code/evidence` | New observation, or link an Evidence Backpack note |
| PUT | `/api/outcomes/evidence/:eid` | Edit, remove or move parent-added evidence |
| POST | `/api/outcomes/evidence/:eid/exclude` · `/include` | Stop or resume counting any evidence (reason required) |

All routes are parent-only and scoped to the signed-in family.

## Mastery rules (platform guidelines, not curriculum-authority thresholds)

Each piece of evidence has a **level** and a **support** value.

| Source | Level |
|---|---|
| Handed in, not reviewed | Took part |
| Quiz attempted but not passed | Took part (needs more practice) |
| Quiz passed (auto-marked) | Practised. Never "understanding" on its own |
| Review: Shown it | Showed understanding |
| Review: Practising, or approved but not judged | Practised |
| Review: Not yet / Needs more practice | Practised (needs more practice) |
| Returned for revision | Took part (needs more practice) |
| Life learning: Demonstrated / Accepted / Needs more evidence | Showed understanding / Practised / Took part |
| Parent observation or linked Backpack note | Whatever the parent chooses |

Support comes from the review (per outcome), else the assignment's support level (green = independently, yellow/amber = some help, red = a lot of help), and "asked for help" means a lot of help.

| Status | Rule |
|---|---|
| Not Started | No counted evidence |
| Introduced | Evidence of taking part only |
| Developing | Any practice, or more than one experience |
| Demonstrated | At least **2** pieces showing understanding on at least **2** different days, done independently or with some help. One parent-flagged comprehensive assessment can stand in for both counts. Help-heavy work counts only when the child has documented adjustments. |
| Achieved | **Only** by parent confirmation. Below the guideline, the parent can still confirm with an explicit override and a note. |

Refinement: `DEFAULT_RULES` and `RULE_OVERRIDES` (by framework, learning area or outcome code prefix) in `outcomeTracker.ts`, plus per-child documented adjustments. No overrides are set today.

Gaps flagged per outcome: not introduced, introduced but not revisited (one occasion, 28+ days ago), limited evidence, needs consolidation (latest evidence says so), ready for confirmation, and confirmed but its evidence changed. Gap suggestions link to an AI lesson draft (paid plans; prompt pre-filled), a manual lesson pre-linked to the outcome, or an everyday Life Learning idea for that learning area. All only for outcomes in the family's catalogue.

## Prior learning (met before Side-Quest)

Children who join part-way through the year, or who covered work at school, can have outcomes recognised as **Prior
learning**: its own status, between Demonstrated and Achieved. Like Achieved, only a parent can set it. It clears the
outcome from every gap, Plan My Week stops scheduling it, and the Evidence Backpack and printed record count it
separately. A parent can still confirm it as Achieved later (Achieved wins), or remove it with a note.

* **Add prior learning** on the tracker opens a dialog with two routes:
  * **Read a report or NAPLAN result** (`POST /api/outcomes/students/:sid/prior-learning/analyse`, `priorLearning.ts`):
    upload a PDF or photo (converted to text with Workers AI `toMarkdown`) or paste the text. One AI call picks, by
    number, from the child's own program outcomes not already met, described with Side-Quest's plain-English summaries
    (never official wording, never codes). Out-of-list picks are dropped and codes stripped. NAPLAN gives a level per
    domain, not per outcome, so its picks are capped at medium confidence. Nothing is recorded; every suggestion starts
    unticked. Limit: 10 documents per family per day (`ai_usage` kind `prior_learning_scan`); the owner account is
    exempt.
  * **Choose outcomes myself**: tick outcomes from the child's program.
* Saving (`POST /api/outcomes/students/:sid/prior-learning`) needs a source ("Year 4 Semester 1 school report") and
  records one `prior_learning` evidence row per outcome, sets `prior_learning_*` on `outcome_progress` (migration
  `0071`, also added at runtime) and logs the change as the parent's. An uploaded report is kept as one Evidence
  Backpack note listing the outcomes. Outcomes already Achieved or recognised are skipped.
* `POST …/outcomes/:code/prior-learning/remove` undoes it; its evidence is kept with the reason and stops counting.
* All routes are parent-only and need Family Membership.

### Starting check

**Starting check** on the tracker makes a short placement quiz per subject (`startingCheck.ts`,
`POST /api/outcomes/students/:sid/starting-checks` with `{ subject }`; `GET` lists them with results).

* One AI call per subject writes one multiple-choice question for each of up to 8 of the child's unmet program
  outcomes, picked across strands and described with plain-English summaries (no codes sent). Malformed, duplicate and
  out-of-list questions are dropped; fewer than 3 usable questions fails without using the allowance. Limit: 16 per
  family per day (`ai_usage` kind `starting_check`); the owner account is exempt.
* It becomes an ordinary ready lesson ("Starting check: Mathematics"), labelled AI-generated, with **no outcome codes**,
  assigned to the child for today. `starting_checks` (created at runtime) links each question to its outcome.
* The quiz never blocks hand-in (`checkQuiz` / `quizPassed` treat any attempt as passed), and **only the first attempt**
  is used for results, so retries can't inflate them.
* Answered checks show "N of M right first time". **Use results** opens the prior-learning dialog with the correctly
  answered outcomes suggested (unticked) and the source filled in ("Starting check: Mathematics (21 Oct 2026)"). Wrong
  answers stay open for teaching. The check is never recorded as tracker evidence by itself.

## Data integrity

* **No duplicates**: unique key per child, outcome, source type and source id. Re-reviews, repeated quiz attempts and resyncs update the same row.
* **History preserved**: status changes are appended to `outcome_status_history`; removed or excluded evidence is kept with its reason.
* **Edits, deletions and reassignment**: re-reviewing, changing life learning mappings, deleting a Backpack note, moving or removing a parent observation all recalculate the affected outcomes. Assignments can only be reassigned before work starts, so no evidence moves with them.
* **Parent judgement wins**: confirmations are never removed automatically. If the evidence drops below the guideline, the outcome stays Achieved and is flagged. A resync never undoes a parent's "don't count this".
* **Separation**: every query is scoped by family and child; another family gets 404. Deleting a child deletes their tracker rows; account deletion sweeps the new tables automatically.
* **Curriculum updates**: each record stores the outcome wording and catalogue version it was recorded against. If the catalogue wording changes, the detail page shows both.
* **Relevance**: families only see outcomes from their own jurisdiction's catalogue and their child's stage (outcomes from other stages appear only if the child has evidence for them, behind a toggle).
* **No fabrication**: AI suggestions (life learning, outcome matching) are never evidence. Only parent-reviewed work can show understanding.

## Limitations

1. **Only NSW is tracked.** VIC, QLD, WA, SA, TAS, ACT and NT families see a clear "not available yet" message. Loading the AC9 list (used by QLD, SA, TAS, ACT, NT) needs the `data/ac9-import` branch reviewed and a code-mapping for lessons and life learning; VIC and WA need their own verified lists.
2. The NSW list is the platform's seed (v3), not a complete set of every syllabus outcome for every course, and Stage 6 is partial.
3. Learning plan activities have no completion records, so plans show as "planned" only.
4. Reading log entries are not mapped to outcomes (unchanged policy: reading shows engagement, it never awards outcomes). Parents can link a reading note as an observation.
5. Life learning reviews don't capture support yet, so it is recorded as "not stated" and counts like independent work.
6. The first open of a child's tracker runs a full sync of their records (bounded at 1,000 submissions and life entries). Fine at current scale; a background job would be better later.

## Deploying (needs approval)

1. Back up: `npx wrangler d1 export sidequest-db1 --remote --output backup.sql`
2. Apply on staging first, then production: `npm run db:migrate` (adds `0057_outcome_tracker.sql`; additive only). The Worker also creates the tables itself if the migration hasn't run.
3. Existing families' trackers fill from their records the first time they're opened.

## Tests

`worker/test/outcomes.test.mjs` (12 tests, real migrations on SQLite) covers the full journey (five lessons, hand-ins, mixed support, reviews, linked evidence, confirmation, new evidence with history kept), manual vs AI origin, life learning, duplicates and resyncs, deleted / excluded / moved evidence, multiple children and families, non-NSW families and moving interstate, curriculum wording updates, documented adjustments, the pure rules, hook failure safety, and runtime-vs-migration schema parity. The browser end-to-end run (`worker/test/e2e/run.mjs`, steps O and P) checks the QLD gap message, the API flow, the tracker pages and confirming through the UI.

## Curriculum sources, licences and coverage (reviewed 15 October 2026)

Side-Quest displays **official outcome codes only**. Outcome wording stays with the curriculum authority; the API strips
catalogued wording from every response (`worker/src/syllabusText.ts`), and lessons reference outcomes by code.

| Jurisdiction | Catalogue used | Source and licence | Status |
| --- | --- | --- | --- |
| NSW | NESA syllabus outcome codes (`nsw-outcomes.ts`) | NESA — limited non-commercial permissions for registered home-schooling parents; commercial republication of syllabus text needs NESA permission (https://www.nsw.gov.au/education-and-training/nesa/copyright) | Codes only; seed not certified complete |
| QLD, SA, TAS, ACT, NT | ACARA Australian Curriculum v9 content descriptions, MRAC/2024/04 (`ac9-outcomes.ts`, ~1,395 records) | CC BY 4.0 with attribution (https://www.australiancurriculum.edu.au/copyright-and-terms-of-use/) | Partial reference: excludes Languages and achievement standards; not state-specific implementation |
| VIC | none | VCAA Victorian Curriculum F–10 v2.0 is CC BY-NC; commercial use needs permission (https://f10.vcaa.vic.edu.au/copyright-statement) | Tracker unavailable; the app says so |
| WA | none | SCSA terms to be confirmed (https://k10outline.scsa.wa.edu.au/) | Tracker unavailable; the app says so |

The server enforces the family's jurisdiction everywhere codes are accepted (lessons, reviews, quizzes, life learning,
Auto-Quest): codes from another framework are dropped, never relabelled. Nothing in Side-Quest certifies compliance
with any state's home education registration requirements.
