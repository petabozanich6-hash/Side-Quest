# Cloudflare service changes: release and recovery checklist
Reviewed 2026-11-25 against Cloudflare documentation.
- November 20: retired model overrides. Main and child-help text settings now normalise only explicitly retired IDs to the existing supported main/default model. Preserve historic cost rates. Review actual AI_MODEL and AI_HELP_MODEL dashboard variables and AI Gateway routing; do not run paid benchmarks without approval. The fallback may cost more than a formerly cheap override. Default model and image generation are unchanged.
- December 1: observability volume-based pricing. Proposed production sampling 10% instead of 100%, not a hard cap or guaranteed bill saving. Some rare errors will not be captured by sampled Cloudflare logs; existing application error ledger stays intact. Review account-wide ingestion/storage and AI Gateway logging in the dashboard. Confirm retention and budget alerts. Never enable more paid datasets merely for testing.
- December 8: version retention is 30 days except the latest 100 and current deployment. Keep a Git tag/commit for known-good production and record its deployment ID; code rollback is not database restore. Do not depend on old preview/version URLs.
- Production binding isolation: keep guard-build-branch.mjs intact. Feature branches must use local CI or separate staging (separate DB, R2, credentials). The Cloudflare preview build failure is expected for non-production branches.
## Before any release
1. Verify account billing status; do not rely on an unpaid account retaining storage. No billing or account settings changed by this PR.
2. From an authorised local checkout, run npm run db:backup (Node 22, Wrangler authenticated). Store encrypted/offline and verify restore counts. Do not upload customer SQL or backup manifests to public GitHub, CI logs, or chat. A count mismatch on an active DB needs a fresh backup/verification, not a production restore.
3. Separately inventory/download the production R2 bucket using authorised read-only access (e.g. rclone copy, not sync or delete). Keep a private manifest and verify object counts/checksums and test retrieval. D1 export does not contain R2 object contents. Also inspect any account-level KV or other services outside this repo. Keep backups outside Cloudflare and encrypted.
4. Check GitHub CI and staging; record known-good production commit and version; then deploy approved changes from main only. No migrations in this PR. Confirm login, family records, file reads, billing webhook, and ordinary AI features (avoid customer data in tests).
5. Review Observability usage after deployment. Increase sampling temporarily for debugging only if needed and approved.
Sources:
https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/
https://developers.cloudflare.com/observability/pricing/
https://developers.cloudflare.com/workers/observability/logs/workers-logs/
https://developers.cloudflare.com/changelog/post/2026-11-19-workers-pages-version-retention/
https://developers.cloudflare.com/d1/reference/time-travel/
