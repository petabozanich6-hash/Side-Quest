# How to use this system

## Author workflow
1. Pick a work order from `pipeline.mjs next` (or start from `templates/<type>.template.json`).
2. Choose the lesson type and copy its template. Read the `_guidance` field, then delete it.
3. Write objectives first (measurable verb + content + criterion), then checks that assess each objective, then the teaching.
4. Save as `lesson-excellence/content/<lesson_id>.json`; set `status: "draft"`, `version: "0.1.0"`.
5. Run `node lesson-excellence/scripts/validate.mjs <file>` and `score.mjs <file>` and fix everything reported.
6. Open a PR with at most one chunk (about 500 lessons).

## Reviewer workflow
1. CI/author runs `npm run lessons:validate` and `npm run lessons:score`; do not review lessons that fail.
2. Check what the script cannot: factual accuracy, age-appropriate language, bias, answers that are actually correct.
3. Record dimension scores in a reviews file (`{ "<lesson_id>": { "conceptual_accuracy": 4 } }`) and run `score.mjs --reviews ... --target excellent`.
4. Approve (set `status`), or return with comments referencing rubric dimensions.

## Remediation loop
`pipeline.mjs queue` -> take lowest-scoring lessons -> fix the weakest dimensions listed -> validate -> score -> re-queue.
Repeat until the queue is empty. Typical fixes: vague objectives (rewrite verbs), missing checks for an objective, no wrong-answer feedback, single-difficulty practice.

## Versioning and change log
- `version` is semver for **content**: PATCH = typo/wording, MINOR = added or improved examples/practice, MAJOR = changed objectives or mastery criteria (learner progress may need resetting).
- Every change adds an entry to `changelog` (`version`, `date`, `change`); one line, imperative.
- `schema_version` changes only with schema changes; migrate all lessons in the same PR and keep gold examples valid.
- Never reuse or rename a `lesson_id`; retire a lesson by removing it in a PR that explains the replacement id.
