# Transformation Pipeline (19,202 lessons)

```
legacy lessons -> ingest/classify -> chunk work orders -> rewrite to schema -> validate -> score -> review queue -> promote
```

1. **Ingest + classify**: `pipeline.mjs ingest <legacyDir> --chunk-size 500`
   - Writes `.work/manifest.jsonl` (one line per lesson) and `.work/chunks/chunk-NNNN.json` (work orders; 39 chunks for 19,202 lessons).
   - **Deterministic IDs**: `lesson_id = slug(relative path) + "-" + first 8 hex of sha1(relative path)`; the same input tree always yields the same IDs. Collisions get `-2`, `-3`...
   - **States**: `empty` (< 200 chars), `partial` (some sections), `decent` (>= 1500 chars with >= 5 section hints, or an already schema-valid JSON lesson).
   - Chunks are ordered empty -> partial -> decent so the worst lessons are rebuilt first.
2. **Rewrite**: for each work order, use `prompts/rewrite-prompt.md` (LLM or author) with the legacy text plus the matching template from `templates/`. Save exactly one file per lesson: `lesson-excellence/content/<lesson_id>.json`. Keep and improve `decent` content rather than replacing it. Never invent facts; flag uncertain content for review.
3. **Validate**: `npm run lessons:validate` (schema + measurable verbs + objective/check alignment + placeholder text).
4. **Score**: `npm run lessons:score` applies the quality gate; `--json` for machine output.
5. **Review queue**: `pipeline.mjs queue` re-scores `content/` and writes `.work/review-queue.json` (lessons still below *good*, weakest dimensions first, with the first errors).
6. **Promote**: once reviewed, set `status`, bump `version`, add a changelog entry (see WORKFLOW.md).

## Resumability and batching
- **No hidden state.** A lesson is *done* when a schema-valid `content/<lesson_id>.json` exists. Interrupt anytime.
- `pipeline.mjs status` shows done/pending per state; `pipeline.mjs next --limit 50 [--state empty]` returns the next batch. Loop: `next` -> rewrite -> validate -> `status`.
- Process one chunk per branch/PR (500 lessons) so review stays tractable. Run validation in CI on `content/`.
- Re-running `ingest` is safe: manifest and chunks regenerate identically; `.work/` is git-ignored.
- Parallelise by giving different workers different chunk files; outputs never collide because filenames are the IDs.
