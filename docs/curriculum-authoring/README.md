# Side-Quest Curriculum Authoring Master README

> **Status: FOUNDATION — NOT A COMPLETE AUTHORED CURRICULUM.**
> This document defines how the *actual instructional content* for each lesson must be written, verified, stored and handed to Cursor. It does **not** claim that the thousands of inventoried lesson titles already contain complete teaching. Do not use it as permission to mass-fill lessons with templates.

## Purpose and division of responsibility

**Curriculum author (ChatGPT + educational review):** research and verify the applicable NSW syllabus, map outcomes, decide exactly what each lesson teaches, write every teaching explanation, example, prompt, worked solution, practice task, response key, misconception and feedback message, and verify progression.

**Cursor (software implementer):** import the *approved, complete* lesson specifications, implement interactions faithfully, use approved static artwork, connect progress/assessment and test rendering. Cursor must not invent, condense, paraphrase away, or automatically fabricate missing teaching.

**Owner:** approves educational exemplars and publication policy. No automatic assumption that passing tests constitutes educational approval.

## Repository evidence and source-of-truth rules

- `docs/inventory/S3.csv` lists Stage 3 lesson keys, year levels, learning areas, titles and inventory status.
- `docs/inventory/S4.csv` lists Stage 4 lesson keys, including Year 7 English.
- `docs/STAGE3_REBUILD_INVENTORY.csv` gives Stage 3 role/focus/sequence detail for many lessons.
- `docs/LESSON_REBUILD_MASTER.md` documents an earlier lesson rebuild and its earlier approved exemplar `s2-eng-y3-w01-l1`. This is historical context, not evidence that every lesson is now complete.
- **Owner's newly approved reference:** `s3-mat-y6-w01-l1`, Year 6 Week 1 Lesson 1, “Reading and writing very large numbers.” The owner has approved the version currently visible in their Cursor preview. **Verify its exact commit/branch and source before treating repository content as an identical snapshot.** Never overwrite it.
- Inventory titles are *planning labels*, **not** complete syllabuses or proof of outcome alignment.
- Before authoring, resolve the current NSW syllabus version, implementation timeline, precise outcome code and wording, relevant content points, stage/year appropriateness, and prior/next lesson context. Record authoritative citations/URLs and verification date. Where these are not established, use `CURRICULUM_RESEARCH_REQUIRED`, never guess.

## Mandatory file architecture

Keep this README concise enough to navigate. The complete curriculum belongs in separate files:

```text
docs/curriculum-authoring/
  README.md                       # this contract
  coverage.csv                    # every inventory lesson key, stage, title, status, path, sources
  stage-1/<lesson-id>.md          # complete individual lesson manuscript
  stage-2/<lesson-id>.md
  stage-3/<lesson-id>.md
  stage-4/<lesson-id>.md
  stage-5/<lesson-id>.md
  review/                         # curriculum and pedagogy review records
```

**Do not create empty lesson manuscripts and mark them done.** A coverage record may be `DISCOVERED` while its manuscript does not yet exist. A generated outline is `PLANNED`, not `AUTHORED`.

## Every complete lesson manuscript must contain

1. **Identity:** exact inventory seed key; stage, year, subject, unit, week, sequence, source inventory row and relevant role.
2. **Curriculum traceability:** verified NSW syllabus version, exact outcome code and wording, specific content points, URLs, review date and mapping rationale. Flag uncertainty.
3. **Precise learning target:** what the learner will know/do by the end; explicit success criteria and evidence.
4. **Prerequisites:** prior skills, diagnostic opening prompt, anticipated gaps, quick catch-up explanation.
5. **Teaching manuscript:** the **complete student-facing prose**, definitions, careful conceptual explanations, vocabulary, visual description and rationale. Not “explain X.”
6. **Worked models:** complete topic-specific examples with every intermediate step, teacher reasoning, answer and why it works; correct and incorrect contrasts.
7. **Guided practice:** exact questions, scaffolds, hints, expected answers, explanations, error-specific feedback and decreasing support.
8. **Independent practice:** exact varied tasks of appropriate complexity, including transfer/application; full answers and marking criteria.
9. **Misconceptions:** at least the meaningful topic-specific errors, how to recognise them and how to remediate them; do not pad with generic items.
10. **Assessment:** aligned exit/diagnostic questions, answer keys, scoring criteria, threshold for understanding and next-step branching; distinguish machine-markable and human-judged evidence.
11. **Accessibility and independence:** reading load, accessibility text, keyboard/touch interactions, offline/material requirements, parent support where needed.
12. **Static media specification:** existing approved asset key OR a precisely described educational diagram/image requirement; accessibility alt text and placement. **No videos or video placeholders.** Do not use decorative images instead of accurate diagrams.
13. **Pip/Juno use:** optional, meaningful, age-appropriate and relevant to this specific lesson. Never insert stock dialogue.
14. **Duration and pacing:** credible activity estimates, breaks and optional extension; no arbitrary word/stage quotas.
15. **Implementation specification:** precise interaction state, answer validation, retries, persistence, progress criteria, edge cases and no-regression requirements.
16. **Quality review:** factual verification, syllabus mapping, independent-learning walkthrough, assessment alignment, distinctness from adjacent lessons, technical preview, and owner-review state.
17. **Sources and rights:** authoritative curriculum source; links/credits for any third-party texts/images, licence restrictions, and source-derived claims.

## Authorship status and acceptance

`DISCOVERED → CURRICULUM_RESEARCH_REQUIRED → CURRICULUM_VERIFIED → PLANNED → FULLY_AUTHORED → PEDAGOGY_REVIEWED → IMPLEMENTED → TESTED → OWNER_APPROVED`.

A lesson is **FULLY_AUTHORED** only when a student could read the manuscript and complete all learning and assessment tasks *without Cursor inventing any educational content*. No lesson is **OWNER_APPROVED** by automation unless the owner expressly establishes that policy.

### Hard-fail examples

- Title plus generic “introduction / explore / practise / quiz.”
- Empty placeholders such as “add three examples here.”
- Duplicated content with only nouns changed.
- Incorrect syllabus code, unverifiable mapping or invented outcomes.
- Repetitive exercises that never build understanding.
- “Correct!” / “Try again!” without meaningful explanation.
- Activities requiring facts not yet taught or not supplied.
- Static diagrams whose mathematical/scientific information is wrong.
- Claiming an entire lesson is complete when only the framework is written.

## Distinct lesson progression — verified example from inventory

The following *topic sequence* is supported by the Stage 3 inventory, but the exact syllabus mappings and full manuscripts still require separate authoring:

| Key | Inventory title | Distinct instructional job | Status |
|---|---|---|---|
| `s3-mat-y6-w01-l1` | Reading and writing very large numbers | Read/write large numbers and understand grouping; approved **in the owner's Cursor preview**, exact source snapshot to verify | OWNER_PREVIEW_APPROVED |
| `s3-mat-y6-w01-l2` | Place value and expanded form | Build/place digits, decompose into powers of ten, explain zero placeholders; **do not repeat L1's full lesson** | DISCOVERED |
| `s3-mat-y6-w01-l3` | Comparing and ordering large numbers | Compare by place from left, justify ordering, resolve zero and digit-count traps, apply to data | DISCOVERED |
| `s3-mat-y6-w01-l4` | Number sense warm-ups | Targeted fluency, retrieval, diagnosis and application across L1–L3; not four generic warm-ups | DISCOVERED |

### Authoring blueprint — `s3-mat-y6-w01-l2` (NOT a finished lesson)

**Topic:** Place value and expanded form, Year 6, Week 1, Lesson 2. **Curriculum mapping:** UNVERIFIED; retrieve current NSW Mathematics K–10 Stage 3 syllabus and sequence before finalising.

**Learning target proposal:** represent the value of each digit in a large whole number and express the number in standard and expanded form, including internal zero digits.

**Prerequisite check:** read a large number in standard notation and distinguish digit from digit value (from L1).

**Required explanation:** demonstrate why moving one place left multiplies value by ten, why zero reserves a position, and why writing “6 + 4 + 2” is not the expanded form of 604,020.

**Worked-model candidates (verify and fully author):**
- 4,306,052 = 4,000,000 + 300,000 + 6,000 + 50 + 2. Explain zero in ten-thousands and hundreds places, and why zero-value terms can be omitted without moving other digits.
- 70,040,009 = 70,000,000 + 40,000 + 9. Explain why 4 represents forty thousand rather than four thousand.
- Reverse conversion: 8,000,000 + 20,000 + 600 + 5 = 8,020,605. Show place-value columns and check by recomposing.

**Misconceptions to teach explicitly:** digit versus digit value; missing zero placeholders; treating the comma-separated groups as addition without place value; confusing 40,000 with 4,000.

**Assessment must include:** conversion in both directions; explaining the value of an underlined digit; error diagnosis; at least one unfamiliar application. Provide worked keys, targeted feedback and a clear understanding threshold in the complete manuscript.

**Do not pass this blueprint to Cursor as finished educational content.** It is an example of what the author must expand into full explanations, exercises, feedback and assessments.

## Curriculum-wide research and coverage procedure

1. Enumerate all inventory CSVs and canonical lesson keys from the actual selected repository branch. Deduplicate; identify conflicts, missing keys and subject/year gaps. Record the exact source commit.
2. Group by stage, year, subject and unit; read the full planned sequence, not isolated titles. Detect repeated/ambiguous lesson labels.
3. Obtain and verify authoritative NSW syllabuses for each subject and implementation year. Record content points and precise outcome mapping. Flag unresolved mapping, including electives and language-specific requirements.
4. Author full manuscripts **one lesson at a time** (or small coherent batches) in curriculum sequence. Every manuscript must contain all 17 required sections with real student-facing content.
5. Cross-check adjacent lessons: deliberate progression, no redundant lessons, increasing complexity, prerequisite alignment, cumulative assessment.
6. Review accuracy and teachability; then hand complete manuscripts to Cursor for faithful implementation.
7. Preview and test the implemented lesson; correct discrepancies in the manuscript or code as appropriate.
8. Track coverage honestly; continue until every canonical lesson has been authored and reviewed. **A central README alone cannot substitute for thousands of complete manuscripts.**

## Cursor handoff instruction

> Implement only lesson files with status `PEDAGOGY_REVIEWED` or explicitly authorised for preview. Treat the manuscript as immutable educational source material. Preserve its explanations, examples, feedback and assessment. Build the required interactions and approved static media. Do not generate teaching to fill gaps. Report missing specifications instead. Do not resume bulk lesson generation, alter approved exemplar content, or publish unapproved lessons.

## Immediate next research work

- Confirm which branch/commit holds the exact owner-approved `s3-mat-y6-w01-l1` preview.
- Complete canonical inventory coverage across all stages and subjects.
- Verify NSW syllabus outcome mappings against authoritative documents.
- Fully author the first small coherent batch (e.g. Year 6 mathematics Week 1 lessons 2–4) to this standard and obtain educational review before scaling.

**This README is the production contract, not an assertion that those tasks have been completed.**
