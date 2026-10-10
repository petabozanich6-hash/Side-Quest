# Side Quest Learning

A homeschool planning and learning platform (NSW curriculum aware).

- `frontend/` – React (Create React App + craco) single page app.
- `worker/` – Cloudflare Worker API (Hono + D1, TypeScript). Serves everything under `/api/*`.
- `wrangler.jsonc` (repo root) – the **single** deployment config. The Worker serves the built
  frontend (`frontend/build`) as static assets with SPA fallback, and handles `/api/*` itself.
- `backend/` – the original FastAPI/MongoDB server. **Legacy reference only**; it is not deployed.
  See [docs/CLOUDFLARE_MIGRATION.md](docs/CLOUDFLARE_MIGRATION.md) for the endpoint-by-endpoint port.

The frontend always talks to the API on the same origin (`/api`), so no API URL env var is needed.

## Deploy to Cloudflare (sidequestlearning.app)

Prerequisites: Node 20+, a Cloudflare account, and `npm install` run once at the repo root
(installs `wrangler`).

1. **Log in**

   ```bash
   npx wrangler login
   ```

2. **Create the D1 database** (skip if `sidequest-db1` already exists – the ID in `wrangler.jsonc`
   must match your database; if you create a new one, paste the new `database_id` into `wrangler.jsonc`).

   ```bash
   npx wrangler d1 create sidequest-db1
   ```

3. **Apply the migrations** (creates every table and seeds the lesson library). Safe to re-run.

   ```bash
   npm run db:migrate          # = wrangler d1 migrations apply DB --remote
   ```

4. **Set secrets**

   ```bash
   npx wrangler secret put JWT_SECRET            # any long random string, e.g. `openssl rand -hex 32`
   # optional – only if you want Google sign-in:
   npx wrangler secret put GOOGLE_OAUTH_CLIENT_ID
   npx wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET
   ```

5. **(Optional) enable file uploads** (evidence photos, work samples) with an R2 bucket:

   ```bash
   npx wrangler r2 bucket create sidequest-files
   ```

   then uncomment the `r2_buckets` entry at the bottom of `wrangler.jsonc`. Without it, everything else
   works and uploads return a clear "File storage not configured" error.

6. **Deploy** – builds the frontend (`frontend/build`) and uploads the Worker + assets:

   ```bash
   npm run deploy              # = wrangler deploy
   ```

7. **Attach the custom domain**: Cloudflare dashboard → *Workers & Pages* → `side-quest` →
   *Settings* → *Domains & Routes* → *Add* → *Custom domain* → `sidequestlearning.app`
   (and `www.sidequestlearning.app` if wanted). The zone must be on your Cloudflare account.

### Deploying from GitHub (Workers Builds)

Connect the repo in the dashboard, with root directory `/`, build command `npm install` (the
`build` step in `wrangler.jsonc` installs and builds the frontend) and deploy command
`npx wrangler deploy`. Run the D1 migrations (step 3) whenever a new file is added to
`worker/migrations/`.

### First use

Open the site, **Register** a parent account, add children under *Children*, and the parent
dashboard, lessons, word hoard, pets, achievements, etc. are ready. Data from the old Mongo
database is not migrated automatically.

## Local development

```bash
npm install && npm --prefix worker install && npm --prefix frontend install --legacy-peer-deps
echo 'JWT_SECRET=dev-secret-change-me' > .dev.vars
npm run db:migrate:local            # local D1 (stored in .wrangler/)
npm --prefix frontend run build     # the Worker serves frontend/build
npm run dev                         # http://localhost:8787
```

For frontend hot reload run `npm --prefix frontend start` (port 3000) and add a `"proxy":
"http://localhost:8787"` entry to `frontend/package.json` temporarily.

## Checks

```bash
npm run typecheck                              # TypeScript check of the Worker
CI=false npm --prefix frontend run build       # frontend production build
npx wrangler deploy --dry-run                  # validates config + bundle without deploying
BASE_URL=http://localhost:8787 npm run smoke   # end-to-end API smoke test against a running dev server
```
