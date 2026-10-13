# Side-Quest — Lesson Content Authoring

**Reset instruction (owner, 13 October 2026):** Start fresh on **lesson content**. All existing Coming Soon lessons already have titles and attached learning outcomes. Treat those assignments as fixed; do not re-verify, remap or redesign them. Disregard previous requests to use any old lesson as an approved content benchmark.

## What this repository needs from the curriculum author

Write the **entire educational content** for every Coming Soon lesson, based on its existing title and attached outcomes. Each manuscript must be self-contained and specific to that lesson, so Cursor can implement it without inventing teaching.

Store complete manuscripts at `docs/curriculum-authoring/lessons/<existing-lesson-id>.md`.

### Required contents of EACH manuscript

1. Exact existing lesson ID, title, attached learning outcomes, stage/year/subject and sequence.
2. Complete student-facing explanation of necessary prior knowledge.
3. Full instructional prose: definitions, concepts, why/how explanations, accurate topic-specific examples.
4. Step-by-step worked models, including reasoning and answers.
5. Guided practice: actual questions, scaffolds, hints, answers and error-specific feedback.
6. Independent practice: actual tasks and questions, expected responses, answers and solutions.
7. Application/reasoning tasks and any source passages, data or scenarios needed to complete them.
8. Specific misconceptions, diagnostic questions and corrective explanations.
9. Actual assessment questions, answer key, marking criteria and useful next-step feedback.
10. Static illustration/diagram specifications and alt text where educationally useful; **no videos**.
11. Precise interactive behaviour and completion requirements for Cursor to implement.
12. Age-appropriate pacing, accessibility/support guidance and optional purposeful Pip/Juno dialogue.

No generic outline, “explain X”, “add example here”, or placeholder quiz is a completed manuscript. No content should be delegated back to Cursor.

## Existing data is authoritative

Retrieve title and learning outcomes **from the existing Coming Soon lesson records**, not solely from an inventory CSV title. Do not invent missing fields. If the attached outcomes are inaccessible, flag that data access problem and do not pretend a manuscript is finished.

## Cursor's job

Implement the exact authored content in the existing app: layout, interactions, saving progress, feedback, accessibility and approved static assets. **Do not ask Cursor to author, shorten, or replace the teaching.**

## Workflow and progress

Enumerate all Coming Soon lesson IDs and their existing title/outcome metadata. Write each manuscript fully, in sequence, with distinct teaching suited to its topic. Track which manuscripts actually exist and are complete. A README is an index, **not** a substitute for the lesson files.

**Current status:** This file is the corrected handoff contract. It does not claim that any lesson manuscripts have yet been authored.
