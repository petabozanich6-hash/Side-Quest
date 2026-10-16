# Releasing Side-Quest safely

Production: Worker `side-quest` on `sidequestlearning.app`, D1 `sidequest-db1` (`d26b63e2-d9e1-4021-b9c5-c494b607aa14`,
binding `DB`). Check the binding on the live Worker, not just the name: `npx wrangler versions view <id> --name side-quest`.

## How deploys work

- **R2 file binding**: production `wrangler.jsonc` binds `BUCKET` to the existing `sidequest-files` R2 bucket in the same account. Owner HQ reports R2 configured only if this binding reaches the Worker. New uploaded files require a paid membership. Staging deliberately does not bind production R2. If a deploy reports an unknown bucket, confirm the real Cloudflare bucket name before changing production configuration.
- **Workers AI cost tracking**: migration `0063_ai_cost_usage.sql` (and runtime additive schema) tracks individual model calls, token counts, and estimated USD inference cost from the deployment onward. Neither prompts nor student data are stored. Rates reflect Cloudflare's publicly posted model pricing as checked 16 October 2026; adjust in `worker/src/aiCost.ts` if pricing changes. The estimate is before daily free allocation, taxes and billing adjustments, and excludes prior usage and R2/Workers costs. For actual charged amounts, use Cloudflare's Billing and Workers AI dashboard.
- **Code**: Cloudflare Workers Builds deploys `main` on every push (`npx wrangler deploy`). Deploying never changes the
  database schema; the Worker also creates any missing *additive* tables/columns at runtime, so a deploy cannot break
  if a migration is late.
- **Other branches** never build on Cloudflare: `worker/scripts/guard-build-branch.mjs` (first step of the build
  command) fails them, because a preview would run unreviewed code against the production database. Pull requests are
  tested by GitHub Actions (unit tests, typecheck, build, browser E2E against a local D1).
- **Migrations** are applied deliberately, never by a deploy. `npm run db:migrate` is a no-op that prints this advice.

## Release checklist

1. `npm run test:worker && npm run typecheck && CI=false npm --prefix frontend run build` and the E2E
   (`PW_PATH=… node worker/test/e2e/run.mjs`) pass on the branch.
2. List pending migrations: `npx wrangler d1 migrations list DB --remote`. Read each one: additive only
   (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN … DEFAULT`), no `DROP`, no `DELETE`, no `UPDATE` of family data.
   Anything else needs the owner's written approval first.
3. `npm run db:backup` — records the Time Travel bookmark, exports to `../backups/` (outside the repo; backups contain
   family data), restores the export and checks every table's row count against live. **No verified backup, no migration.**
4. Rehearse: load the backup into a local D1 and apply the pending migrations to it
   (`wrangler d1 execute DB --local --file <backup.sql>` then `wrangler d1 migrations apply DB --local`, with a throwaway
   config); confirm no existing table's row count changes.
5. `npm run db:migrate:prod` (applies only the pending migrations).
6. Merge to `main`; watch the Workers Build; confirm the new version: `npx wrangler deployments list --name side-quest`.
7. Verify on https://sidequestlearning.app with test accounts and synthetic children only.

## Rollback

- **Code**: `npx wrangler rollback --name side-quest` (or pick the previous version in the dashboard). Additive
  migrations are compatible with the previous code, so the schema can stay.
- **Data** (only with the owner's approval — it discards every change since the bookmark):
  `npx wrangler d1 time-travel restore DB --bookmark=<bookmark from the backup report>`. The SQL export is the second
  line of defence (Time Travel keeps 30 days).

## Cloudflare settings (dashboard: Workers & Pages → side-quest → Settings → Build)

- Git repository: `petabozanich6-hash/Side-Quest`; production branch `main`; root directory `/`; `NODE_VERSION=22`.
- Build command: *(empty; `wrangler.jsonc` `build.command` runs the guard and builds the frontend)*.
- Deploy command: `npx wrangler deploy` (no migrations).
- Non-production branch builds: **disabled** (the guard blocks them anyway).
- Build API token: a token on this account with *Workers Scripts: Edit*, *Workers Builds Configuration: Edit*,
  *Account Settings: Read*, *User Details: Read*, *Workers Routes: Edit* (zone `sidequestlearning.app`) and
  *D1: Edit* only if Cloudflare-side migrations are ever wanted again (they are not).


## Read-only production schema integrity audit

Before a schema-dependent release, run `npm run db:audit` from a machine authenticated to the production Cloudflare account. The command issues **SELECT-only** D1 queries; it does not apply migrations, update migration history, write family data or create backups. Run the offline comparison tests with `npm run test:db-audit`.

Exit codes: 0 = checked critical schema objects present and migration records match repository; 1 = missing critical table/column/index or migration-history discrepancy; 2 = query/permission/JSON error (audit inconclusive). A migration absent from `d1_migrations` may have had its schema created at runtime or manually; do **not** assume its changes are missing. Likewise a recorded migration does not guarantee its objects still exist.

This is an intentionally scoped integrity check (authentication, billing, promotions, feedback, owner security, lessons and outcomes), not a complete SQL migration replay or constraint/data-integrity audit. Investigate discrepancies using a verified backup and local rehearsal per the release checklist. Never insert migration-history rows or blindly run all pending migrations.
