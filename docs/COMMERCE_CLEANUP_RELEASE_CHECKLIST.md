# Side-Quest commerce cleanup: pre-merge verification

PR #363 removes retired in-app sales while preserving Square Family Memberships and Owner HQ Document Studio. There are **no historic in-app shop purchases** to migrate, per the owner. Do not remove historical D1 migrations.

## Automated checks (must pass on the final commit)
- Worker unit tests, database audit, frontend tests, TypeScript checks and built app.
- Square webhook signature/activation/renewal/failed-charge/cancel/keep tests, including subscriptions sold directly in Square Online.
- Owner HQ passkey and permission tests. A normal parent must not see Document Studio. Old public-shop feature switch must be absent.
- End-to-end timetable, learning, child and offline workflows.
- The **Document Studio PDF Proof** workflow on pull requests to PDF generator code, rendering and auditing the entire 150-PDF test corpus for all eight Australian jurisdictions.

## Staging only — before production merge/deployment
1. Use the existing isolated Cloudflare staging Worker and D1 database. Do not point staging at production D1, R2, Square access tokens or live webhooks.
2. In **Square sandbox**, create a test Family Membership and send signed subscription/webhook notifications to staging, using the sandbox's webhook signature key and the exact staging webhook URL. Confirm new account link/reset-password delivery, paid access, renewal, cancellation and the undo-cancellation state. Confirm ordinary non-membership Square subscriptions remain ignored.
3. In Owner HQ staging, open Document Studio as the Owner. Generate NSW and one non-NSW print and fillable PDFs; inspect every page and saved form field. Check the separate worksheet authoring export too. No action should create a Square catalogue listing or collect a payment.
4. Confirm the shop link points to the external Square store and the retired in-app order pages do not exist. Test the parent login, child login, lesson review, calendar and evidence.
5. Review CI, deployment branch rules, security and monitoring, and confirm rollback to the last known good deployment is available.

Never claim a Square sandbox payment or Cloudflare staging deployment has been tested unless its actual event and result were observed. This repository's isolated test doubles do not replace live provider verification.
