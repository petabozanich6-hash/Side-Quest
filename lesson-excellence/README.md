# Lesson Excellence Framework

Content-only system for turning legacy lessons into consistent, high-quality teaching assets.
It defines **what a lesson must contain** (pedagogy), never how it looks. No UI fields exist in the schema.

| Piece | Location |
|---|---|
| Canonical schema (JSON Schema 2020-12) | `schema/lesson.schema.json` |
| Rubric (human doc + machine config) | `docs/RUBRIC.md`, `rubric.json` |
| Templates (concept, procedural, problem-solving, review, mini-project) | `templates/*.template.json` |
| Gold-standard lessons + failing examples | `examples/gold/`, `examples/failing/` |
| Validator, scorer / quality gate, batch pipeline | `scripts/` (Node 20+, zero dependencies) |
| Rewrite prompt for LLM/author conversion | `prompts/rewrite-prompt.md` |
| Migration pipeline guide | `docs/PIPELINE.md` |
| Author / reviewer / remediation / versioning | `docs/WORKFLOW.md` |
| Output location for migrated lessons | `content/<lesson_id>.json` |

## Commands (run from the repository root)

```bash
npm run lessons:test                                   # framework self-tests
npm run lessons:validate                               # schema + pedagogy checks on lesson-excellence/content
npm run lessons:score                                  # quality gate (default target: good) on content/
node lesson-excellence/scripts/validate.mjs <file|dir> [--quiet]
node lesson-excellence/scripts/score.mjs <file|dir> [--target good|excellent] [--reviews reviews.json] [--json]
node lesson-excellence/scripts/pipeline.mjs ingest <legacyDir> [--work .work] [--chunk-size 500] [--ext .md,.json,.txt,.html]
node lesson-excellence/scripts/pipeline.mjs status [--work .work] [--out lesson-excellence/content]
node lesson-excellence/scripts/pipeline.mjs next   [--limit 50] [--state empty|partial|decent]
node lesson-excellence/scripts/pipeline.mjs queue  [--reviews reviews.json]
```

Exit code `0` = pass, `1` = at least one lesson failed, `2` = usage error. Try the examples:

```bash
node lesson-excellence/scripts/validate.mjs lesson-excellence/examples/gold      # all PASS
node lesson-excellence/scripts/validate.mjs lesson-excellence/examples/failing   # FAIL with reasons
node lesson-excellence/scripts/score.mjs lesson-excellence/examples/gold --reviews lesson-excellence/examples/reviews.json --target excellent
```

## Quality gate in one paragraph

A lesson is **draft** until it is schema-valid *and* scores >= 28/40 with no rubric dimension below 2 (**good**).
It is **excellent** at >= 36/40, no dimension below 3, and a human reviewer has supplied a `conceptual_accuracy` score
(accuracy cannot be proven by script; automated scoring caps it at 3). See `docs/RUBRIC.md`.

## Extending

- New required field: add it to `schema/lesson.schema.json` (`required` + `properties`), bump `schema_version`, update templates and gold lessons.
- New rubric check: edit `scripts/lib/score.mjs` and `docs/RUBRIC.md` together; thresholds live in `rubric.json`.
- New measurable verb: `scripts/lib/verbs.mjs`.
