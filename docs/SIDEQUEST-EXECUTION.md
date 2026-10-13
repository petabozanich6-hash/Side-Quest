# Side-Quest execution record

**Last updated:** 14 October 2026. **Authoritative development branch:** `dev/sidequest-execution`. **Recovery checkpoint:** `checkpoint/pre-cleanup-2026-10-13` (preserve). This is the single project execution document. The code and confirmed tests outrank any stale statement below.

## Current mission — Australia-wide parent-to-child homeschooling platform

**Cancelled:** Producing 19,202 / 4,902 / 900 prewritten lessons, the Stage 2/4 lesson-authoring program, legacy curriculum research, lesson-excellence pipelines and proprietary curriculum release targets. Do not restart them. Do not promise complete syllabus coverage.

**Current product:** Parent creates or brings learning material -> saves in family lesson library -> assigns to child -> child learns and submits -> parent reviews -> progress, evidence and XP update. Preserve branding, parent and child dashboards, family-owned lessons, reusable assignment snapshots, independent child work and gamification. Future AI lesson drafting is optional; no paid AI API calls without approval.

**National scope:** Welcome Australian families, but do not claim that the application automatically satisfies any state or territory's homeschooling requirements. Links and any mapping must be verified for that jurisdiction.

**Pricing concept (not live):** AUD $12.95/month or $129/year, family-wide; a seven-day restricted free preview (one child, two family-created lessons and two active assignments) enforced on the server. No live billing or charges without approval.

## Codebase

- `frontend/`: React parent/child UI. Parent Lesson Builder: `frontend/src/pages/parent/LessonBuilder.jsx`; family library: `frontend/src/pages/parent/Lessons.jsx`.
- `worker/`: Cloudflare Worker API, D1, permissions, subscriptions/entitlements, assignments, submissions and XP.
- `worker/migrations/`: **historical immutable D1 migration chain**. Preserve all applied migration files and the schema, including `0050_lesson_builder_entitlements.sql`. The legacy curriculum seeds within older migrations remain for database reproducibility. Current family lesson APIs hide the 19,202 legacy records; their runtime database removal, if ever desired, requires separate backup, staging verification and explicit approval.
- `wrangler.jsonc`: deployment config; do not modify production services as part of source cleanup.

## Operating mode (14 Oct 2026)

Claude builds and integrates; the owner tests by hand on a private staging site; ChatGPT may prepare small PRs (wording, docs, small UI) on separate branches; GitHub Actions verifies. Build order: (1) lesson builder and library, (2) assign and schedule, (3) child dashboard and lessons, (4) submissions, review, progress, evidence, XP, (5) uploads, (6) weekly planner, (7) portfolio and exports, (8) national onboarding, (9) preview entitlements and upgrade screens, (10) billing prep (owner approval needed). No AI generation until the core works and API costs are approved.

## Implemented on the development branch (verified by CI unless noted)

- GitHub Actions (`.github/workflows/ci.yml`): npm install, worker tests (11), worker TypeScript check, real frontend production build, and a browser end-to-end run against a local Worker and local D1. Logs and screenshots are pushed to the `ci-results` branch. Latest confirmed: install, tests, typecheck and build pass; end-to-end 23 of 24 steps passed, the one failure was a test-script bug that is now fixed (re-run pending).
- End-to-end covers: register a new free-preview family, add a child, build/preview/save/duplicate a lesson, library, assign, child signs in on a phone-size screen and picks a pet, sees real lesson content, answers saved across refresh, server-marked quiz, server refuses hand-in before quiz is passed, hand in, parent reviews with answer key, XP awarded once, evidence page, snapshot unchanged after library edit, another family cannot read or change anything, legacy 19,202 lessons hidden and not assignable, plan cannot be self-upgraded, expired preview blocks create/assign but keeps data, phone layouts.
- Quiz answers are marked on the server; child lesson responses carry no answer keys or parent notes. Children's work in progress is saved on the server.
- Migration 0050 applies cleanly in CI to a fresh local database. It has **not** been approved or applied to production.
- Responsive parent layout (menu drawer on phones), usable child header on phones, parent "get started" checklist and an example lesson, child dashboard shows XP, completed and waiting quests.

## Private staging

`wrangler.staging.jsonc` and `.github/workflows/deploy-staging.yml` (manual). Separate Worker `side-quest-staging` and separate D1 `sidequest-staging`; never production. The staging API is gated by a cookie obtained from `/api/staging-access?key=<STAGING_KEY>`.

Owner steps: (1) Cloudflare dashboard > My Profile > API Tokens > Create Token from the "Edit Cloudflare Workers" template, add Account > D1 > Edit. (2) Copy the Account ID (Workers & Pages overview). (3) GitHub repo > Settings > Environments > New environment `staging` > secrets CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, STAGING_JWT_SECRET (long random text), STAGING_KEY (long random text). (4) Actions > "Deploy staging (private)" > Run workflow on `dev/sidequest-execution`. (5) Open `https://side-quest-staging.<your-workers-subdomain>.workers.dev/api/staging-access?key=<STAGING_KEY>` once, then use the site.

## Known limitations and blockers

- No Cloudflare credentials in the build environment: staging deploy needs the owner's secrets (above).
- Uploads: the R2 code in `worker/src/family.ts` (family-scoped, type allow-list, 50 MB cap, nosniff, sandbox CSP) is sound, but no bucket is bound. Not enabled; the app says photo upload is unavailable. Enabling needs `wrangler r2 bucket create` and a binding (owner approval).
- Billing and AI are not live. Remaining NSW-specific tools (curriculum links, learning plans, legal copy) are truthful about being NSW-based but need owner/legal review.
- Pet-care XP and lesson XP share one counter; first-time children must choose a pet before anything else.

## Targeted legacy lesson source cleanup

On branch `cleanup/remove-legacy-lesson-history-2026-10-14` (PR into `dev/sidequest-execution`), 149 obsolete files were removed from the **working tree only**: `docs/archive/`, `docs/lesson-plans/`, `docs/inventory/`, `lesson-bank/`, `lesson-excellence/`, legacy `scripts/`, and obsolete lesson-only scope/style documents. Root package scripts, README and CI tests were updated to remove discontinued pipeline references.

**What was not deleted:** applied migrations; live D1 records; Git commit history, backups and old branches; lesson builder implementation; assignment/submission/evidence/XP data; working parent/child interfaces. Original files remain recoverable through Git until intentional history rewriting (not authorised). This cleanup branch is not production.

## Next verified milestone

1. Obtain passing GitHub Actions install, worker tests, typecheck and frontend build **on the current development code**; fix failures rather than redoing the audit.
2. Run the full parent-register -> child -> build -> assign -> submit -> review -> evidence/XP journey in a real browser and on a phone, including preview expiry and family isolation.
3. Audit and correct remaining child-facing data leaks, missing attachments, data persistence, report/export access and national/legal wording. Clearly identify unsupported features.
4. Take a private remote D1 backup, verify staging migration 0050, and obtain owner approval before deploying.
5. Start with invited beta families only if functionality, privacy and safety checks pass. Payments remain off until live billing is secure, tested and approved.

**Anti-loop:** Do not reopen the cancelled lesson-production project, create new lesson validation frameworks or count placeholders as deliverables. Do not merge, deploy, rewrite Git history, delete remote branches, migrate production or incur costs without owner approval. Make small verified commits and continue with integration/testing.
