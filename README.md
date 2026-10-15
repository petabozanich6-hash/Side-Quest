# Side-Quest Learning

Side-Quest is becoming an **Australia-wide homeschooling management and parent-to-child learning platform**.

Families will build or bring their own lessons, assign activities to children, review work, and manage planning, resources, learning evidence and progress. The product no longer depends on building thousands of proprietary curriculum lessons. Do not present this app as a complete K–10 curriculum or as automatically compliant with each state's registration requirements.

**Development status:** The family Lesson Builder, child lesson player, assignments, review, XP and plan limits are built and pass CI (build, TypeScript, worker tests and a browser end-to-end run). **Before this code is deployed, back up the live database and apply migrations `0050` and `0051` (`npm run db:migrate`), otherwise registration and lessons will error.** Stripe subscriptions are built for sandbox testing only (migration `0053`, see `docs/STRIPE-BILLING.md`); real payments are not enabled. AI lesson drafting is built for paid plans only (Cloudflare Workers AI) and needs migration 0051. See `docs/SIDEQUEST-EXECUTION.md`. The Curriculum Outcome & Mastery Tracker (NSW families; other states see an honest "not available yet") needs migration `0057`; see `docs/OUTCOME-TRACKER.md`.

## Repository structure

- `frontend/` — React single-page app (Create React App, CRACO), parent and child interfaces.
- `worker/` — Cloudflare Worker (Hono + D1, TypeScript) for `/api/*`, authentication, assignments, portfolios and progress.
- `worker/migrations/` — historical **database migration chain**, including large retired prewritten curriculum seeds. **Keep these migration files unchanged until a tested replacement/baseline strategy is approved.** Removing them may break fresh database setup or migration history for existing databases.
- `wrangler.jsonc` — Worker deploy configuration, D1 binding and static frontend settings.
- `docs/CLOUDFLARE_MIGRATION.md` — existing platform hosting/migration notes.
- `docs/OWNER_HQ.md` — the owner-only command centre (Owner HQ): what it does, how it is protected, and the approval-gated steps to turn it on.

The 2026 prewritten curriculum project has been **cancelled**. Its independent `lesson-bank/`, `lesson-excellence/`, old authoring/checking scripts, stage plans, drafts, lesson reviews and inventory exports are removed from the *current working tree*. They are still recoverable through Git history. Their deletion does **not** delete historical database rows or rewrite commit history.

## Development

Requires Node 20+, an appropriate Cloudflare local development environment, and the committed lockfiles:

```bash
npm ci
npm --prefix worker ci
npm --prefix frontend ci --legacy-peer-deps
echo 'JWT_SECRET=dev-secret-change-me' > .dev.vars
npm run db:migrate:local
CI=false npm --prefix frontend run build
npm run dev
```

Open `http://localhost:8787`.

Useful verification:

```bash
npm run typecheck
npm run test:worker
CI=false npm --prefix frontend run build
npx wrangler deploy --dry-run
BASE_URL=http://localhost:8787 npm run smoke
```

## Production safeguards

Do not delete or rewrite applied D1 migrations or production lesson/assignment data to simplify the repository. Before any new live database changes, take a private backup, test in staging and obtain explicit owner approval:

```bash
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Cloudflare R2 uploads and subscription payments require separately configured services. No deployment, domain change or live migration is implied by this documentation/content cleanup.

Refer to the development branch's `docs/SIDEQUEST-EXECUTION.md` for the current implementation priorities and tested capabilities.
