# Side-Quest execution record

This is the single project memory. Read it first each session. If it disagrees with the code, the code wins; fix this file.

Last updated: 13 October 2026. Branch: `dev/sidequest-execution` (from `main` at 92a2b4e).
Recovery checkpoint (pre-cleanup main): branch `checkpoint/pre-cleanup-2026-10-13`. Never delete it.

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

## 4. Approved product direction

Supersedes the all-lessons plan (19,202 / 4,902 individually authored lessons is cancelled; reuse existing work, delete none).

- A. Verified core teaching modules (reusable, with worked examples, practice, feedback, misconceptions, assessment, mapping).
- B. Adaptive practice and pathways.
- C. AI-supported electives and enrichment, kept separate from verified curriculum in the data model, with parent approval, caching and family-wide quotas.
- D. Homeschool management: parent and child dashboards, planning, portfolios, exports, printables, gamification (keep existing identity).
- E. Automatic curriculum and evidence tracking: NOT STARTED, INTRODUCED, PRACTISING, DEMONSTRATED, CONSOLIDATING, never awarded just for opening a lesson.
- Test focus: Stage 2 Year 3 and Stage 4 Year 7. Do not claim full K-10 coverage.
- Stage 2 is parent-guided; Stage 4 must support independent learning.
- No video. Interactive lessons only (SVG, in-site episodes, quizzes, activities). No external embeds, no runtime AI in verified lessons.
- Pricing (tentative, billing not activated): AUD $12.95/month or $129/year per family, all children and subjects included.
- 7-day limited free preview: one child, about 2-3 complete sample modules, one small assessment, demo of progress and planning, locked premium features. Enforced server-side. States: FREE_PREVIEW, PREVIEW_EXPIRED, ACTIVE_MONTHLY, ACTIVE_ANNUAL, PAST_DUE, CANCELLED. Never delete data at expiry. Cancelled keeps access to period end.
- Must not claim the app establishes legal compliance with NSW home education requirements.

## 5. Prioritised backlog

1. Confirm app and checkpoint. DONE.
2. Targeted repo cleanup (docs/scripts that describe a removed Python backend; list obsolete remote branches for owner approval; no history rewrite).
3. Run and verify the existing app. BLOCKED by npm access.
4. Reusable module schema: adapt `lesson-excellence` schema; one module renders in the real app and records progress.
5. Exemplar modules: Y7 Maths Integers, Y3 Maths Place Value, Y7 English Reading and Text Analysis, Y3 English Reading Comprehension.
6. Child and parent workflows: assign, complete, feedback, record, parent review.
7. Planning and evidence: map modules to verified outcomes; portfolio; export.
8. Entitlements: preview and paid states, server-side enforcement, configurable limits.
9. AI foundation: boundary, quotas, caching, approval, validation.
10. Expand verified coverage across required learning areas.
11. Beta hardening: family data separation, accessibility, mobile, journeys.

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

Exemplar module authoring (no npm needed).

## 11. Exact next task

Author the Year 7 Mathematics "Integers" module in the lesson-excellence schema; validate with `npm run lessons:validate` and `npm run lessons:score`; then wire it into the app once npm access is available.
