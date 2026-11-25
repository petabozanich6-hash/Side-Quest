# Side-Quest modernisation release candidate
Combines previously reviewed cleanup #363, Learning Support intake #364, Cloudflare readiness #365 and Parent Hub performance #366. Do not merge those separately if this release is chosen.
No D1 migration or production write. Preserve all family records, membership entitlements, Square Online billing, child/offline routes, Document Studio and historical migration files.
Release gate:
1. Resolve the Cloudflare billing deadline and verify independently stored D1 and R2 backups.
2. Full GitHub CI and visual proofs on this integrated branch. Check Cloudflare build preview isolation; production preview failures are expected for non-main branches, and the guard must remain.
3. On separately authenticated staging, verify Square sandbox subscription activation/renewal/cancellation/undo, document exports, new free Learning Support account and request, Owner HQ private responses, expired-member access, and no child access. No live transactions.
4. Check Cloudflare dashboard AI overrides, account-wide observability usage and spend alerts; sample rate proposal is 10% (not a spending cap).
5. Compare bundle size and real performance on an Australian device, then deploy from main with an explicit rollback point.
6. Do not delete historical tables/records or legacy purchase entitlements. Avoid new paid services until usage is measured.
Limitations: Learning Support is enquiry intake/manual quotations, not paid checkout/automatic bookings. WWCC/safeguarding/insurance and service terms must be confirmed before live tutoring. Future work: background AI generation, query plans/indexes, accessibility and further measured performance improvements.

Student UX: distinguish API failure from genuinely empty work, provide retry and reconnect refresh, flag unavailable calendar dates, accessible week navigation and correct waiting-for-help states. No offline storage, entitlement or lesson format changes. Added retry regression test.

Student dashboard batches legacy lesson reads with a family/shared scope and preserves snapshots and child-safe filtering. Added open legacy assignment privacy regression. No changes to assignment limits or offline cache formats.


AI phase: opt-in scheduled lesson-set writer, existing five-minute cron, no new binding or migration. Off by default (AI_BACKGROUND_BATCHES unset); enable only in isolated staging first. One pending lesson per tick; excludes unconfirmed legacy requests, suspended families, deleted creators, dismissed/paused sets and sets with failed/generating items. Membership and platform budget checks remain. No automatic retry on uncertain failures; retry remains explicit. Pause is prospective, not cancellation of in-flight work. Validate long running requests, cost cap/concurrency, timeout recovery, multiple families, and actual Cloudflare scheduled runtime before enabling production. Single lesson and Auto-Quest generation still use existing interactive workflows; no stage checkpoints yet.


Learning Support proposals: additive migration 0075 (also idempotently ensured on quote routes). Owner proposes scope, delivery details, AUD total and validity; only submitting parent can express interest or decline, including expired preview accounts. Single open immutable proposal, explicit withdrawal before replacement. No contract acceptance, payment, booking or membership change. Owner inbox is marked unread on parent response; parent receives in-app notification on issue. Email delivery of new proposals is not yet implemented. Paid services remain subject to confirmed policies and staging. Backup and apply migration explicitly before production (no destructive SQL).

Quote history is batched into the private Learning Support list response; individual refresh remains available. Migration 0075 supersedes earlier zero-migration release notes.


Standalone Learning Support: migration 0076 creates isolated email links, sessions, requests, messages and quotes; no families/users/trials are created. Single-use hashed links (30 min), hashed guest session tokens (12 h), separate header and sessionStorage, explicit redemption, throttled email requests, owner passkey routes, scoped history and proposal responses. SUPPORT_GUEST_ENABLED must be true to use portal; default off until isolated staging proves email delivery, session security and accessibility. Existing member enquiry path remains. Guest email notices use production SITE_URL: configure and test staging link origin before enabling. No classroom, payment or booking yet. Additive migrations 0075 and 0076 require backups and verification.

Guest rollout gate: public status hides the portal launch button until explicitly enabled and email is configured. Staging requires SUPPORT_GUEST_ORIGIN equal to the isolated side-quest-staging workers.dev origin; never uses request Host to generate links. Production uses canonical SITE_URL. Set flag only after separate test email delivery and production data backup.


Service arrangements and Square sandbox: additive migration 0077. Shared order ledger for member and guest proposals, immutable server-derived AUD price, owner-defined terms, optional UTC appointment interval with atomic overlap prevention, parent confirmation, no-charge completion, sandbox-only hosted checkout (SUPPORT_CHECKOUT_TEST=true with sandbox credentials), stable idempotency, signature-verified/retrieved Square payment isolation from membership. Checkout disabled for live credentials. Unstarted orders only may be cancelled; once checkout is attempted, reconcile in Square before releasing the slot. Refunds observed on completed-payment updates flag review; dedicated refund webhooks, cancellation/refund reconciliation, notifications, availability calendar and classroom are still outstanding. Do not activate paid services before those gaps, policies and staging checks are addressed. No new subscriptions.
