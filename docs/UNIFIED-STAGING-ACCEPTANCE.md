# Unified Learning Support — private sandbox acceptance runbook

This is a release candidate, not authorisation to merge to main or enable real payments.
All stacked development commits through #379 are in this branch. Verify CI at the exact final head. Earlier successful runs are not evidence for new revisions.

## Preflight (owner-controlled, private staging only)
- GitHub Actions > Deploy staging (private) > select this release candidate branch. The new `enable_invoice_pilot` input defaults to false.
- In the existing GitHub staging environment, supply private secrets `STAGING_SUPPORT_TEST_EMAIL` (a controlled synthetic parent inbox), `STAGING_SQUARE_ACCESS_TOKEN` and `STAGING_SQUARE_WEBHOOK_SIGNATURE_KEY`. Existing Cloudflare/JWT/staging access secrets remain required. Never paste credentials into chat or commit them.
- Staging environment/repository variables: `STAGING_SUPPORT_ORIGIN` (exact https://side-quest-staging.<subdomain>.workers.dev, no trailing slash), `STAGING_SQUARE_APPLICATION_ID` (sandbox-sq0idb-...), `STAGING_SQUARE_LOCATION_ID`. Configure Square Sandbox webhook to that origin + /api/billing/square-webhook; subscribe to payment.created/updated, invoice.payment_made, refund.created/updated, dispute.created/state.updated. Verify the pinned Square API version and sandbox feature availability. The configuration script fails closed on missing settings or non-isolated targets.
- Pilot mail flag remains OFF; the current staging config does not provision an EMAIL binding. Configure and verify a staging-only mail binding and test recipient before separately enabling notices or registration-email testing. Use a verified synthetic existing account to test invoices until email onboarding can be safely tested.
- Staging migrations through 0118 only against sidequest-staging, not sidequest-db1. Check staging resource isolation and API health. No production credential or customer record.

## Acceptance evidence (record actual outcome, revision and provider evidence; no secrets)
| Case | Expected outcome | Status |
|---|---|---|
| Existing active subscriber; support-only parent; expired homeschool | independent entitlement and correct home | Not run in real staging |
| New canonical learner and guided enquiry | correct owner family/learner and no duplicate | Not run in real staging |
| Single session, upfront package, per-session instalments | correct price, slots, terms and due dates | Not run in real staging |
| Draft, refresh, review and explicit publish | one invoice/order, verified version, no automatic charge | Not run against Square |
| Parent link, unrelated parent, child, expired/closed enquiry | only intended parent receives current eligible hosted link | Not run against Square |
| Valid signed webhook, duplicate, missing/early event | exact verified captured payment only, no membership change | Not run against Square |
| Partial, failed, late and uncertain payment | no paid booking or release; review | Not run against Square |
| Cancelled unpaid invoice and full refund | verify exact provider proof before local release | Not run against Square |
| Partial/complex refund or unresolved dispute | preserve hold and reservation, manual owner reconciliation | Not run against Square |
| Booking confirmation, reminder, overdue | exactly once to synthetic mailbox; no delivery on hold | Not run; staging EMAIL binding missing/unverified |
| English Club | $12 per learner per session, eight seats, independent payments and access | Not run; current new invoice ledger only covers tutoring orders; club manual invoicing remains |
| Desktop/mobile owner and parent walkthrough | focused pages, correct back/refresh and safe state | Not run in real staging |

The mandatory synthetic lifecycle test uses a mocked Square provider and injected mail sender. It does not prove Square API compatibility, mail delivery or real browser acceptance of the entire new invoice workflow. Do not mark external acceptance complete merely because CI passes.

## Release decision
Keep manual invoice alternative and existing membership/store paths. Finish missing canonical Square customer mapping, English Club integration or explicitly approve manual club invoicing, complex financial resolution, full owner/parent browser acceptance and notification configuration. Rehearse migration of independent encrypted D1/R2 backups through 0118 (or latest final migration); preserve historical records. Complete independent GO-LIVE-GATES.md, legal/safeguarding and actual provider checks before any production merge or flag activation.
