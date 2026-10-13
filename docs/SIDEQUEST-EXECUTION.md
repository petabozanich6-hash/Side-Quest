# Side-Quest execution record

This is the single project memory. Read it first each session. If it disagrees with the code, the code wins; fix this file.

Last updated: 14 October 2026. Branch: `dev/sidequest-execution` (from `main` at 92a2b4e).
Recovery checkpoint (pre-cleanup main): branch `checkpoint/pre-cleanup-2026-10-13`. Never delete it.

## 0. Current priority (14 Oct 2026, supersedes the lesson-authoring plan in section 4)

Early-access, Australia-wide homeschool platform. Pre-made lessons are out of scope: the 19,202 seeded rows stay in the database (nothing deleted) but are hidden from every family library and cannot be assigned; the UI says "Ready-made Side-Quest lessons: upgrade coming later". The product is the parent Lesson Builder -> family library -> assign -> child completes -> parent reviews -> progress, evidence and XP.

Built and tested this session (11 tests, `npm run test:worker`, real migrations 0001-0050 on an in-memory SQLite):
- Migration 0050: lesson versions/archive, assignment snapshots (`lesson_snapshot`, `lesson_version`), idempotent XP (`xp_awarded`), family plan columns. Existing families become `INTERNAL` (unrestricted) so nobody is locked out; new sign-ups start `FREE_PREVIEW` for 7 days.
- `worker/src/entitlements.ts`: plan states, limits, expiry. Preview = 1 child, 2 parent lessons, 2 active assignments, no AI, no full exports. Paid/INTERNAL/PAST_DUE (grace) = fair-use caps 20 children / 5000 lessons / 5000 active assignments. PREVIEW_EXPIRED/CANCELLED(after period end) = cannot create or assign; data is kept. Unknown plan fails closed. Plan is never changed by any API route. Billing is NOT LIVE.
- `worker/src/lessonBuilder.ts`: validation (https/http links only, server-computed YouTube/Vimeo embeds, size caps), create/update/duplicate/archive/delete (delete archives if ever assigned), assign (ownership checks, drafts and archived blocked, duplicate-active blocked, snapshot stored), submit (once), review (XP once: 20 accepted, 45 demonstrated; evidence row), child-safe lesson view (no answer keys or parent notes).
- Routes in `core.ts`: `GET /api/account/plan`, `PUT /api/lessons/:id`, `POST /api/lessons/:id/{duplicate,archive,restore}`; library queries are family-only; child endpoints return the child-safe snapshot. `POST /api/students` enforces the child limit.
- Frontend (written, syntax-checked with bun, NOT run in a browser): `LessonBuilder.jsx` (guided form, preview, save draft / save to library / save and assign), rewritten `Lessons.jsx` (search, edit, duplicate, archive/restore, assign, preview-limit banners), routes in `App.js`, national wording on Landing, Register and Curriculum.

Not done / known gaps:
- App never built or run (npm blocked). Owner must run `npm install`, build, and click through the workflow.
- Migration 0050 not applied to the live database. Back up first (section 8).
- Quiz `correct_index` is still sent to the child (existing client-side quiz scoring).
- File/image upload needs R2 enabled (upload returns 501); builder supports links and videos only.
- Remaining NSW/NESA wording: LearningPlans, Audit, LifeLearning, ReadingLog, LessonDetail and `legalContent.js`. Legal copy needs owner review. No compliance claims should be made.
- Parent-facing progress pages, portfolio export limits for preview, and mobile layout were not reviewed in a browser.
- No AI generation (no credentials, no spend approved). No billing.
- Domain sidequestlearning.app is behind Cloudflare and restricted to the owner's IP. Not touched. For invited beta families, consider Cloudflare Access with an email allow-list (owner action).

## 1. Confirmed architecture

- Authoritative app: this repository, `main`. Nothing exists in Floot.
- `frontend/`: React (Create React App + craco, Tailwind), 72 source files, about 10,500 lines.
- `worker/`: Cloudflare Worker, Hono + D1, TypeScript, about 7,000 lines. Serves `/api/*` and the built frontend as static assets.
- Config: one root `wrangler.jsonc` (D1 binding `DB`, `send_email` binding `EMAIL`, optional R2 commented out).
- Database: 49 migrations in `worker/migrations/`. Keep all of them.
- Lesson content lives in the `lessons` table (JSON in `data`). Content is shipped as SQL migrations.
- Content tooling: `lesson-excellence/` (schema, rubric, scorer, pipeline, zero-dependency Node) and `scripts/` (migration checkers).
- Separate repos `sidequest-cloudflare` (unused React Router starter) and `Poket-Goblin` (different app) are out of scope.

## 2. Current functionality (read from code; NOT yet run, see Blockers)

Per README and worker sources: parent registration, child profiles, dashboard, lessons, word hoard, pets, achievements, help requests, child inbox, welcome email, password reset, family data. File upload returns 501 until R2 is enabled.

Lesson content: 19,202 lesson rows exist, but only 36 are written to the Lesson Standard v2 (1 approved gold, 35 unreviewed). The other 19,166 are queued placeholders.

Verified this session (static checks that run without npm):
- `npm run lessons:test` passes (5 tests); gold examples validate.
- `scripts/check-priority-bulk.py`, `check-gold-migration.py`, `check-s2-week1-migration.py` pass.
- Authored lessons average 27 KB and 3,300 words each, 4 teaching steps, 10 quiz questions, 2 SVGs.

Known content defect: 4 of 35 authored learning intentions are templated and ungrammatical ("We are learning to explain and apply represent ..."): s4-mat-y7-w01-l1/l2/l3, s4-mat-y8-w01-l3.
Known curriculum risk: placeholder rows mix older 2012 outcome codes with new 2022/2023 codes. `worker/src/data/nsw-outcomes.ts` is generated from a Python file that no longer exists. No outcome code is treated as verified until checked against NESA.

## 3. Known blockers

1. The npm registry is blocked from this environment (403 on CONNECT via the policy proxy). `npm install` leaves `wrangler` and `react-scripts` missing, so the app cannot be run, built or smoke-tested here. Not worked around. Needs: a network allowance for `registry.npmjs.org`, or running installs on the owner's machine.
2. GitHub tag pushes are refused by the proxy; checkpoints are branches instead.
3. No Cloudflare connector: cannot read or apply to the live D1 database or deploy. All live changes (backup, apply migrations, deploy) are done by the owner.
4. Billing: no payment provider connected. Billing status is NOT LIVE.
5. AI: no API credentials. Integration boundary only; no simulated AI presented as live.

## 4. Product direction (current)

Australia-wide homeschool management platform. The product is the parent Lesson Builder and the family-created lesson library, assigned to children who learn on a dedicated child dashboard, with submissions, parent review, evidence, progress and XP.

- No pre-written curriculum, no curriculum frameworks, no curriculum audits. The 19,202 legacy lesson rows are kept in the database but hidden; they are not deleted and not presented as curriculum. "Ready-made Side-Quest lessons: upgrade coming later."
- Interactive lessons only (no video production). Parents may link or embed YouTube/Vimeo.
- Pricing (tentative, billing NOT LIVE): AUD $12.95/month or $129/year per family. Do not charge until billing is built, tested and approved.
- 7-day free preview: one child, two parent-made lessons, two active assignments. Enforced on the server. States: FREE_PREVIEW, PREVIEW_EXPIRED, ACTIVE_MONTHLY, ACTIVE_ANNUAL, PAST_DUE, CANCELLED (plus INTERNAL for pre-launch families). Never delete data at expiry. Cancelled keeps access to period end.
- Must not claim the app establishes legal compliance with any state or territory's home education requirements; requirements differ by state.
- Historical plan (cancelled): `docs/archive/SUPERSEDED-curriculum-plan-2026-10-13.md`.

## 5. Backlog (current order)

1. CI build and tests green (GitHub Actions).
2. Verify the full workflow in a real browser (parent and child, mobile, permissions, expired preview, family isolation).
3. Fix defects found. Secure quiz answers, evidence, uploads disclosure.
4. Early-access hardening: privacy, legal copy review, migration backup/approval, billing readiness assessment.
5. Only then: AI lesson drafting (needs credentials and approval), billing.

## 6. Acceptance criteria (internal beta)

Parent can register, add children, assign modules; child completes a real module with feedback; results and evidence are saved; parent dashboard shows progress; records export; one family cannot read another's data; preview limits hold when called directly through the API; unverified mappings are labelled; every claim in this file is backed by a check that ran.

## 7. Work completed (numbers below are items, not lesson counts)

- Audit of both lesson system and app code (above).
- Recovery checkpoint branch and development branch pushed.
- Static content checks run (section 2).

- Cleanup (commit on this branch): deleted 6 obsolete docs that described a removed Python backend (`LESSON_BUILDER_TEMPLATE`, `LESSON_BUILD_GUIDE`, `LESSON_BUILD_HANDOFF`, `LESSON_TRACKER`, `LESSON_AUDIT`, `templates/lesson_template.py.txt`). Everything is still in the checkpoint branch. Moved the old lesson source/review markdown and the superseded all-lessons plan to `docs/archive/`. No migrations, scripts, inventory CSVs, curriculum research (`docs/lesson-plans/`) or `lesson-bank/` were touched. All 5 migration checkers, `lessons:test` (5) and `scripts/*.test.mjs` (2) still pass.

## 8. Facts preserved from the superseded plan

- Inventory (repository sources, not live D1): 19,202 unique lesson rows; regenerate with `python3 scripts/export-lesson-inventory.py`.
- Migration 0027 moved some elective rows to Stage 4 but kept their older `s5-` keys. Never change seed keys or row IDs: a background cleanup deletes assignments for lessons whose ID disappears.
- Each SQL statement must be at most 100,000 bytes; split lessons over about 90 KB into two UPDATEs (text, then media). D1 limits: 2 MB per row, 10 GB per database, 30 s per query.
- Before any live change: `npx wrangler d1 export sidequest-db1 --remote --output backup.sql` and record a Time Travel bookmark (30 days on the Paid plan). Remote application of migrations 0044-0049 is NOT verified.
- `lesson-bank/` holds an older, independent Stage 2 Maths Weeks 1-2 lesson set (Markdown + JSON, built by `lesson-bank/tools/build_bank.py`). Not referenced by the app. Review for reuse when building the Year 3 Maths module; do not delete.
- Two lesson validators exist (`scripts/validate-lessons.mjs` for the SQL migrations, `lesson-excellence/` for JSON modules). Decide during the module work which is canonical; do not build a third.

## 9. Remote branches (recommendation only; nothing deleted)

141 remote branches (including the new `dev/sidequest-execution` and `checkpoint/pre-cleanup-2026-10-13`): 49 `feature/*`, 18 `fix/*`, 5 `docs/*`, 4 `copilot/*`, 3 `cursor/*`, 3 `maths/*`, 3 `bump-*`, and about 50 single branches. Keep `main`, `checkpoint/*`, `archive-*`, `backup/*`. Recommend the owner review the rest and delete merged ones in GitHub (Branches page, "merged" filter). Nothing is deleted without approval.

## 10. Work underway

Builder-first workflow is implemented and tested at the API level. Next is verification in a real build.

## 11. Exact next task

1. Owner: `npm install`, `npm run test:worker`, `npm run lessons:test`, build the frontend, run locally (`wrangler dev`), and walk through: register -> add child -> create lesson -> save to library -> assign -> child login -> complete -> parent review -> XP and evidence. Check it on a phone.
2. Back up D1 (`npx wrangler d1 export sidequest-db1 --remote --output backup.sql`), note a Time Travel bookmark, then apply migration 0050 to a staging copy first.
3. Fix whatever the click-through finds. Then the remaining NSW wording and legal copy review.
4. Only after that: private beta for invited families. Do not charge until billing is built, tested and approved.
