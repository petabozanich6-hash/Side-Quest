# Releasing Side-Quest safely

Production: Worker `side-quest` on `sidequestlearning.app`, D1 `sidequest-db1` (`d26b63e2-d9e1-4021-b9c5-c494b607aa14`,
binding `DB`). Check the binding on the live Worker, not just the name: `npx wrangler versions view <id> --name side-quest`.

## How deploys work

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
