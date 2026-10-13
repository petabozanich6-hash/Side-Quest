# Rewrite prompt (LLM or human brief)

You convert one legacy lesson into the canonical lesson JSON (`schema/lesson.schema.json`).

Inputs: the legacy text, `lesson_id`, subject and level, and the template for the lesson type.

Rules:
1. Output a single JSON object, valid against the schema. No markdown, no UI or layout fields.
2. Keep correct existing content; fix or remove anything inaccurate. Do not invent facts, standards or sources. If unsure, add the issue to nothing in the lesson and report it separately for review.
3. Objectives start with a measurable verb (identify, calculate, explain, ...). Never "understand" or "know". Max 3 per lesson is preferred.
4. Every objective is assessed by at least one `formative_checks` item (`objective_index`).
5. Teach in order: activate -> explain -> 2 worked examples with reasoning -> guided practice with hints -> independent practice at foundation/core/stretch.
6. Anticipate at least two misconceptions, each with cause and correction.
7. Every answer has a rationale or reason. Wrong-answer feedback tells the learner what to do next.
8. Include remediation, an extension, a recap, 3 or more retrieval prompts with spacing, and inclusivity notes.
9. Plain language for the stated level, short sentences, neutral everyday contexts.
10. No placeholders (TODO, TBD, lorem). Set `status: "draft"` and `version: "0.1.0"`.
