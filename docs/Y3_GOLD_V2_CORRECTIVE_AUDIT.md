# Year 3 Gold Standard v2: corrective audit and acceptance gate

Audit date: 12 October 2026. Scope: draft PR #104, especially D1 migrations 0083–0085 (12 latest lesson records), compared with the approved D1 reference in `docs/GOLD_Y3_ENGLISH_W01_L1_REVIEW.md`, `docs/LESSON_REBUILD_MASTER.md`, the existing `scripts/validate-lessons.mjs` and the separate backend handoff.

## Status correction

- **69** is the count of records edited in the draft PR at this point; **not** the number of independently Gold Standard v2-verified lessons.
- **0 of those 69 have been independently certified** in this audit. This does not assert that none can pass after review; it means the acceptance evidence has not been produced.
- The old **163 remaining** count tracks drafts not yet edited, not the quality backlog. All 69 edited records require a quality gate before being marked complete.
- Keep PR #104 **draft, unmerged and undeployed**. Do not apply the migrations to remote D1 until validated, backed up and expressly authorised.

## Evidence from latest twelve committed records

1. All twelve have four teaching steps and ten quiz entries, but these are **structural counts**, not instructional assurance.
2. All twelve have **empty `outcome_codes`**. NESA attribution cannot be claimed.
3. All twelve use only **one `worked_visuals`** entry. Inspection found repeated four-stage process-card drawings rather than diagrams that directly illustrate the lesson concepts (arrays, punctuation, labels, etc.).
4. The hints repeat the same generic pattern across stages. They fail the intended three escalating, stage-specific interventions.
5. Several lesson-step examples repeat the *entire independent task* or merge the same generic guided example into every step, potentially exposing assessment prompts prematurely.
6. In migration 0085, parent notes include paragraphs beginning “Written model” without the required `Parent:` prefix. The D1 validator explicitly requires every parent paragraph to carry that prefix to support child/parent separation.
7. The migration validator currently runs strict `validateLesson` checks only for SQL containing `Standard v2`. The recent SQL headers do not contain that marker, so the normal validator can treat them as historical rather than reviewing them as v2 content.
8. The existing checks do not prove that quiz explanations are pedagogically adequate, the answer keys are correct, stage visuals are effective, or NESA codes correspond to actual lesson objectives.

## Two architectures: do not substitute one for another

The repository contains **both** a D1/Worker JSON content system with its own approved Year 3 Week 1 Lesson 1 example (migration 0044), **and** a Python lesson-library handoff whose benchmark is `backend/lesson_library_s2_english_w09_l1.py`. The 9 October handoff explicitly says the Python benchmark is approved and must not be changed. Its lesson modules and registration/versioning rules differ from D1 SQL. Before authoring a lesson, identify the actual intended runtime/lesson route and apply the matching benchmark. Never silently equate a four-step D1 JSON patch with an eight-step Python module. Do not push to main solely because the handoff has an old direct-main instruction; this PR remains a draft by user-approved workflow.

## Required acceptance before counting a lesson “done”

1. **Architecture:** identify renderer, storage and lesson identifier; preserve current seed_key, assignment IDs, lesson placement and ownership.
2. **Exact curriculum:** verify each applicable NESA outcome against an authoritative syllabus, record how this *individual* lesson supplies evidence, and explicitly flag unresolved alignment.
3. **Four-step D1 instruction:** each stage introduces a new skill in a logical sequence with a rule, reason, original worked example, misconception and specific correction. No copy-pasted explanation across stages.
4. **Teaching visuals:** SVG or interactive visual demonstrably teaches the topic (not decorative “LEARN/TRY/CHECK” boxes); verify its alt text, rendering and accuracy.
5. **Escalating hints:** three distinct, stage-specific hints per *actual generated stage*: orient to concept → show partial reasoning → give nearly complete process without exposing the answer.
6. **Practice and assessment:** fully worked teacher demonstration; *different* guided-practice inputs with feedback; independent task with different material; eight accurate, non-repeated MCQs and two assessable written prompts; keep parent models unavailable in the child interface.
7. **Parent/evidence UX:** every paragraph in `parent_notes` begins `Parent:`; student can type answers or use an appropriate accessible alternative; parent can capture evidence without extra subscriptions.
8. **Automated checks:** run `node scripts/validate-lessons.mjs <migration>` with strict v2 validation actually applied; run `node scripts/audit-y3-d1-quality.mjs <migration>`. Both need to pass, and false positives require documented manual review rather than bypassing the quality requirements.
9. **Execution:** run SQL against a local throwaway SQLite/D1-compatible database; verify row targeting, metadata preservation, repeated application, and no effect on neighbouring lessons. Measure each UPDATE statement's byte budget.
10. **Editorial/UX review:** inspect rendered lesson and visuals, manually check every answer and working, confirm hints and answers do not leak across student/parent roles, then record reviewer sign-off and QA evidence.

A passing automated audit is **necessary but not sufficient** for Gold Standard v2 acceptance. Never mark a batch complete from JSON structure alone. Report separately: drafted, mechanically validated, pedagogically reviewed, NESA-verified, and deployed.

## Immediate next steps

- Use the committed `scripts/audit-y3-d1-quality.mjs` to enumerate blocking flags. This is an additional static check, **not** a replacement for the official validator or visual review.
- Fix the validator-marker bypass before claiming full automated quality assurance. Do not simply insert “Standard v2” into historical SQL and assume all content is correct.
- Repair and audit previously committed records starting with the latest Week 10 batch; submit a **fully verified pilot lesson** with topic-specific visual, hints, independent practice and correct parental separation. Then enforce the same test on batches before increasing the completed count.
- Keep the existing PR draft and do not merge/deploy during the audit.

## Commands for an actual repository checkout

```sh
node scripts/audit-y3-d1-quality.mjs worker/migrations/0085_s2_y3_w10_four_depth_revisions.sql
node scripts/validate-lessons.mjs worker/migrations/0085_s2_y3_w10_four_depth_revisions.sql
```

The original generic validator can report a historical migration as acceptable without applying v2 checks. **Inspect its output rather than interpreting exit code 0 as Gold v2 approval.** These commands have not been executed in a checked-out repository as part of this connector-only audit.
