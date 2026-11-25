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