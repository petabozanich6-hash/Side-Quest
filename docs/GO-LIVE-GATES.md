# Side-Quest modernisation go-live gates

Release branch: release/sidequest-modernisation; consolidated PR #367. Do not merge previous component PRs separately.

## Verified vs external
GitHub CI must be green on the exact final head, including all browser suites. The Cloudflare production-worker preview guard deliberately rejects non-main previews; keep it, and disable preview builds in the dashboard. A passed local D1/Chromium test does not establish production readiness.

## Owner-controlled Cloudflare preflight
1. Confirm account billing is current and the live Worker remains healthy. Check dashboard AI model overrides, observability usage, spend alerts, production R2 binding, and email sending configuration. Do not share API tokens in chat or commit them.
2. Run `npm run db:audit` with authenticated Wrangler. Review missing migration records rather than inserting fake history.
3. Run `npm run db:backup` to a private encrypted directory outside the checkout. Preserve both SQL and verification report independently of Cloudflare. Confirm an independent copy of existing R2 objects and restore representative objects in isolated storage, including family files. Never upload family backups to GitHub Actions artifacts or the repository. Record checks in HQ only after verification.
4. Rehearse pending migrations through 0089 against a private local copy of the verified backup. Compare pre-existing table counts and constraints. Migration 0087 replaces only the package payment-status trigger from 0086; it must be applied, not skipped. Confirm trigger behavior for upfront and instalment packages. Do not delete historical commerce tables or modify paid member records.

## Private staging
Run Actions > Deploy staging (private) on the release branch, using the existing staging environment and configured secrets. Only synthetic accounts/children. Staging fails closed until its staging key is set; do not reuse production credentials or data. Configure separate R2 only if authorised, separate sandbox billing credentials and safe test email delivery. Confirm staging origin allowlist and mail delivery. Run actual workflows: parent/member and guest enquiry, quotation and plan, date invitation and conflict checks, package invoicing and independently paid/cancelled lessons, resource upload/download privacy, whiteboard, owner passkey security, outage copies, daily briefing preview, and existing subscription/lesson/offline workflows.

Video remains staging-only; no production video until the pinned SDK, actual two-device camera/mic/screen sharing, permission presets, closure/revocation and long-session authentication are tested. No new provider or paid service without owner approval. Confirm NSW child-safety requirements, service terms, privacy/retention and cancellation/refund arrangements before accepting tutoring customers.

## Production
Only after these gates pass: apply pending migrations from the verified release checkout with the documented production command, then merge the reviewed exact head to main. Observe the production Workers Build, verify version and existing app behavior with synthetic accounts, and enable individually tested optional flags only. Keep guest portal, classroom, resource AI, background generation and daily email disabled until their prerequisites are confirmed. If a regression occurs, roll back code using the known previous Worker version; do not restore a production DB snapshot without separately assessing changes since that backup.

No production deployment, billing transaction, migration, backup attestation or live email is performed merely by creating this file.
