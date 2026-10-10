# Cloudflare migration: audit & status

Original stack (Emergent → Render): React CRA `frontend/` + FastAPI/MongoDB `backend/`.
Target stack: the same `frontend/` served as Worker static assets + a Hono/D1 Worker in `worker/`.
See the root [README](../README.md) for deployment.

## Root cause of the broken site

The Worker only implemented ~35 of the ~100 API routes the frontend uses, so Dashboard widgets, Word Hoard,
pets, achievements, reading, life learning, etc. all failed with 404s. In addition there were three
conflicting deployment configs (root `wrangler.jsonc`, `worker/wrangler.jsonc` pointing at a different D1
database, and an unrelated React Router starter in `cloudflare-site/`).

## API audit (FastAPI route → Worker module)

Every route in `backend/*.py` (102 incl. the `/api` root) now exists in the Worker with the same path,
method and response shape (`{detail}` errors, same JSON keys). Every endpoint the frontend calls
(`frontend/src/pages/**`, `context/AuthContext`, `components/**`) is covered.

| Area | Routes | Worker file | Tables (migration) |
|---|---|---|---|
| Auth: register/login/child-login/me | `/auth/register`, `/auth/login`, `/auth/child-login`, `/auth/me` | `index.ts` | users, families, students (0001) |
| Auth: logout, Google, session | `/auth/logout`, `/auth/google`, `/auth/google/callback`, `/auth/session` | `family.ts` | users (+`oauth_provider`, 0004) |
| Account deletion | `/auth/delete-account` | `account.ts` | sweeps every table by `family_id`/`student_id` |
| Dashboards | `/dashboard/parent`, `/dashboard/child` | `core.ts` | – |
| Students | `/students` CRUD, `/students/:id/overview` | `index.ts`, `family.ts` | students (+`extra`, 0004) |
| Programs, units | `/programs`, `/units` | `family.ts` | programs, units (0004) |
| Curriculum | `/curriculum/stages|learning-areas|pattern/:stage|outcomes` | `family.ts`, `data/curriculum.ts`, `data/nsw-outcomes*.ts` | static TS data |
| Lessons, lesson index | `/lessons`, `/lesson-index`, `/lessons/:id` | `core.ts` (spelling attached from `data/spelling.ts`) | lessons (0002/0003) |
| Quiz, lesson evidence | `/lessons/:id/quiz`, `/lessons/:id/evidence` | `learning.ts` | lesson_evidence (0005) |
| Assignments, submissions, resources, cheers | as FastAPI | `core.ts` | 0002 |
| Cheers seen | `/cheers/:id/seen` | `pets.ts` | cheers |
| Calendar | list/create/done/delete, `PUT /calendar/:id`, `/calendar/ics` | `core.ts`, `family.ts` | calendar_events |
| Files | `/files/upload`, `/files/:id` | `family.ts` | files (0004) + R2 `BUCKET` |
| Reading log | `/reading-log`, `/reading-log/stats` | `family.ts` | reading_log (0004) |
| Reading approvals | `/reading-submissions*` | `words.ts` | reading_submissions (0007) |
| Word Hoard | `/word-bank*` | `words.ts`, `data/wordBank.ts` | word_bank, word_practice (0007) |
| Life learning | `/life-evidence*` | `learning.ts` | life_evidence (0005) |
| Learning plans | `/learning-plans*`, `/:id/build` | `learning.ts`, `data/planBuilder.ts` | learning_plans (0005) |
| Audit | `/audit` | `family.ts` | – |
| Pets & pet care | `/pet*`, `/pet/care/*`, `/pet/state` | `pets.ts` | pets (0006) |
| Achievements | `/achievements*` | `pets.ts`, `data/achievements.ts` | 0006 |
| Seasonal | `/seasonal*` | `pets.ts`, `data/seasonal.ts` | 0006 |

Worker-only additions: `/api/health`, `POST /learning-plans/:pid/generate` (alias), `POST /life-evidence/analyse`
(called by the frontend but absent from FastAPI; implemented as deterministic keyword mapping).

## Data layer

Mongo collections became D1 tables via new migrations `0004`–`0007` (0001–0003 untouched). Nested
arrays/objects are JSON `TEXT` columns, booleans are `0/1` and converted back in responses.
Static data (NSW outcomes, curriculum pattern, word bank, spelling lists, seasonal packs, achievements,
pet species, plan builder rules) lives in `worker/src/data/*.ts`. The lesson library is seeded by migration SQL.

## Things that changed or could not be ported 1:1

- **Passwords**: bcrypt is unavailable on Workers; new hashes use PBKDF2-SHA256 (WebCrypto, 100k iterations).
  Existing bcrypt hashes from the old Mongo DB are not importable – the old data is not migrated, so re-register.
- **Emergent session auth** (`/auth/session`, `AuthCallback`): the Emergent service is discontinued for this app; the
  endpoint returns a clear 410 and the UI shows "sign-in failed". Email/password and child PIN login are the supported methods.
- **Google sign-in** (`/auth/google`, `/auth/google/callback`): implemented with `fetch` to Google; needs the
  `GOOGLE_OAUTH_CLIENT_ID` (+ `GOOGLE_OAUTH_CLIENT_SECRET`) secrets. The UI does not currently render a Google button.
  The old hard-coded Render redirect URI was replaced with a same-origin check.
- **File uploads**: GridFS → R2 (`BUCKET` binding, optional, see README). Without the binding uploads return 501.
- **LLM calls**: none were present in the backend (pet help was already a fixed message); life-evidence mapping
  suggestions are keyword based.
- **Startup seeding** (owner account from `OWNER_PASSWORD`, outcome reseed) is replaced by migrations/static data;
  register the owner account through the UI.
- **Query limits**: D1 allows max 100 bound parameters per statement; code chunks `IN (...)` lists accordingly.

## Frontend / config changes

- Removed `assets.emergent.sh` script, PostHog (Emergent host) snippet, `@emergentbase/*` and `cra-template` dependencies,
  and the Emergent overlay/visual-edits hooks in `craco.config.js`.
- API base is same-origin `/api` (`frontend/src/lib/api.js`), no `REACT_APP_BACKEND_URL`.
- One deployment config: root `wrangler.jsonc` (worker `worker/src/index.ts`, assets `frontend/build`, SPA fallback,
  `run_worker_first: ["/api/*"]`, D1 `DB` → `sidequest-db1`, `migrations_dir` `worker/migrations`).
  Removed `worker/wrangler.jsonc` and `cloudflare-site/`.

## Verification

- `npm run typecheck` (tsc, strict) passes.
- `CI=false npm --prefix frontend run build` passes.
- `npx wrangler deploy --dry-run` passes.
- `worker/test/smoke.mjs` exercises auth, students, dashboards, lessons, assignments/submissions, pets, word hoard,
  reading, life learning, plans, curriculum, audit, role checks and account deletion against `wrangler dev`
  with locally migrated D1 (all green).
