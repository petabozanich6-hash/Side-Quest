# Side-Quest Learning

Side-Quest is an **Australia-wide homeschool planning and learning-management platform**. Families build or bring their own lessons and resources, assign work to children, review submissions, and keep progress and learning evidence. It is **not** marketed as a complete proprietary curriculum.

## Current architecture

- `frontend/`: React, Create React App and CRACO. Separate parent and child experiences.
- `worker/`: Cloudflare Worker API (Hono, D1, TypeScript); all API routes are under `/api/*`.
- `worker/src/lessonBuilder.ts`: family-owned lesson creation, assignments, review, entitlements and child-safe lesson views (alongside `worker/src/core.ts`).
- `worker/migrations/`: historical migration chain **required for existing databases**, including past curriculum seed data. Do not delete or rewrite applied migrations.
- `wrangler.jsonc`: single deployment configuration; the Worker also serves the built frontend.

The frontend accesses the API on the same origin (`/api`). Authentication, data separation and entitlement enforcement belong on the server.

**Current decisions, verified status, launch blockers and next action:** [`docs/SIDEQUEST-EXECUTION.md`](docs/SIDEQUEST-EXECUTION.md).

## Product scope

A parent can create and reuse lessons, assign them to children, and review submitted work. Children see a separate lesson and quest experience; submissions connect to progress and evidence. State-specific regulatory compliance and curriculum alignment are not automatically guaranteed.

An old curriculum-production effort and its offline authoring assets were discontinued in October 2026. Its source archives, inventory files, validators and lesson-production scripts were removed from the active tree on a dedicated cleanup branch. They remain recoverable in previous Git commits. Historical lesson records embedded in the D1 migration chain are **intentionally preserved** and are hidden from the family lesson library in current application code.

## Local development

Requires Node 20+ and the dependencies defined in the lockfiles.

```bash
npm ci
npm --prefix worker ci
npm --prefix frontend ci --legacy-peer-deps
echo 'JWT_SECRET=dev-secret-change-me' > .dev.vars
npm run db:migrate:local
npm --prefix frontend run build
npm run dev
```

Then open `http://localhost:8787`. Use `npm --prefix frontend start` for React hot reload with an appropriate local API proxy.

## Checks

```bash
npm run test:worker
npm run typecheck
CI=false npm --prefix frontend run build
npx wrangler deploy --dry-run
BASE_URL=http://localhost:8787 npm run smoke
```

The GitHub Actions workflow also exercises tests, build and local end-to-end checks. Passing tests do not replace a real browser walkthrough, mobile check or security review.

## Production safeguards

**Never automatically deploy or migrate the live database as part of ordinary cleanup.** Before applying new migrations, export and back up remote D1 data, confirm migration status, test against staging and obtain explicit approval.

```bash
npx wrangler d1 export sidequest-db1 --remote --output backup.sql
```

Do not publish this backup. Cloudflare R2 is required for real file uploads; a placeholder or link field is not an upload service. Billing is not live until separately integrated and tested. For domain/deployment setup, use the Cloudflare Worker settings and the existing `wrangler.jsonc`; do not assume a build implies a safe launch.
