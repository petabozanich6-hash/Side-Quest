# Unified family portal — architecture decision 001

Status: accepted design; implementation and acceptance testing pending. 26 November 2026.
Master checklist: UNIFIED-FAMILY-PORTAL-CHECKLIST.md.

## Canonical identity
Use the existing families.id, users.id/users.family_id and existing password/Google login/session JWT. The authenticated database-backed family and parent role are authoritative. Never introduce a second permanent credential system. Family identity is independent of billing. Owner access still requires existing permission and passkey step-up.

Use existing PREVIEW_EXPIRED as the initial homeschool entitlement for new support-only registrations (no trial start/end, no subscription); a separate provenance row records voluntary support-only registration. It is not a billing plan or permission override. Existing accounts retain their exact current plan and trial dates; a later explicit membership purchase uses existing billing paths. A support-only account remains an ordinary authenticated account after membership cancellation. Do not grant a new preview merely on sign-in, verification, reset or adding a tutoring service. Review the UI copy for support-only accounts rather than calling their preview expired. Do not create a new unsupported billing plan enum across the system.

Require verified email for any new unified portal access and always for support-only signup, independently of the existing optional homeschool verification rollout. Do not break legacy subscriber login; use an explicit proof-of-address upgrade at the unified portal boundary. New support-only signup is feature gated, private staging only until the entire portal and verification tests are ready. Use correct environment-specific links; staging must never mail production account links. Existing Google callback creates a preview when new; support-only Google registration must have a verified, server-validated intent before enabling it. Existing Google login is retained. Password recovery and verified Google login may prove inbox ownership, but claim/merge is separate, explicit and audited.

## Entitlement matrix
| Identity or state | Account / own portal | Homeschool creation | Tutoring / club booking access |
|---|---|---|---|
| Anonymous | Marketing, register/sign in | No | No |
| Unverified parent | Verification/recovery only at unified boundary | Existing legacy policy unchanged | No unified private records |
| Verified support-only parent | Yes | No; expired-plan limits | Own enquiries; only agreed/paid access to booked services |
| Verified homeschool preview | Yes | Existing preview limits | Same separate booking rules |
| Verified paid homeschool parent | Yes | Existing paid limits | Same separate booking rules |
| Verified expired/cancelled homeschool parent | Yes | Existing historical read/review rules | Existing paid support survives membership expiry |
| Child session | Existing child-safe experience only | Existing child entitlements | No parent invoices, private messages, agreements or family administration |
| Suspended/deleted/revoked session | No private portal | No authenticated access | No access, safe owner review of paid commitments |

Payment for a booking is not payment for membership. Payment for membership is not payment for a booking. Paid/approved/consented session access is independently verified; refunds, cancellation, review states and expiry restrict only relevant service access.

## Legacy transition
Existing member support threads are parent_feedback rows with family_id AND user_id, page_hint learning-support; preserve both scopes until explicitly approved changes to multi-parent visibility. Guest records are email-verified support_guest_requests with support_guest_families and support_guest_learners; downstream quotes, service orders, grants, terms receipts and club seats use existing IDs and channel. Do not rewrite IDs or convert guest orders to member orders blindly. Link a guest family to a canonical family only after fresh authenticated verified-parent proof and an explicit claim, with ambiguity and multi-parent cases reviewed; preserve legacy channel adapters behind the new portal. A matching email string alone does not establish proof or justify a merge. Claim implementation must coordinate guest link/session revocation, new identity resolution, deletion/retention and ongoing bookings before disabling legacy access.

Keep learner records minimal and separate from child-login provisioning: a support-only learner need not have a homeschool username/PIN or consume a paid homeschool slot. A canonical support learner belongs to families.id and optionally references an existing student of the SAME family, confirmed explicitly; enforce ownership in database constraints/queries, never infer by name. No private notes in parent responses. Preserve existing student IDs and legacy support learner IDs. Siblings must have distinct seats. Link and learner schema will be implemented with their actual consuming routes after checking deletion and payment history constraints; no speculative automatic backfill.

## Review and proof
Current code references: index.ts (register/login/me/student add/middleware), family.ts (Google signup, student ownership), session.ts (JWT revocation/family suspension/child credential version), entitlements.ts/lessonBuilder.ts/membershipAccess.ts (plans and writes), emailVerification.ts/passwordReset.ts (one-use proof), account.ts (dynamic family purge), feedback.ts (member support), guestSupport.ts and migration 0100 (guest support), englishClub.ts (legacy guest seat link), supportOrders/supportPackages/supportSlots/supportFiles (downstream channel IDs), square.ts (existing signed webhook plus provider re-read). Current staging already supports a signed sandbox Square webhook bypass with exact hostname and path; extend only after reviewing it. Remaining full route/notification/delete/retention and frontend inventory stays open under B07. New account/portal feature must not be exposed until A03–A08 and relevant portal tests pass. No production activation.

## Initial additive change
Migration 0105 introduces only support_account_intents: one provenance row per canonical family, no legacy backfill, no paid entitlement or access grant. A verified-parent helper can read canonical identity and this provenance; fail closed for unverified, child, suspended, missing or inconsistent identities. It must be called after existing authenticated token checks. This is not a guest claim mechanism. The signup endpoint and secure claim flow follow in separately tested changes.
