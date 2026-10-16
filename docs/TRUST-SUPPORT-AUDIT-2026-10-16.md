# Trust & Support content audit — 16 October 2026

**Scope:** public and signed-in Trust & Support copy, Help & FAQ, support navigation and the subscription-expiry notice journey. This is a product-content and UX consistency audit, **not** an independent security audit or a legal opinion. Reviewed against Side-Quest's current repository: `entitlements.ts`, `membershipAccess.ts`, `Upgrade.jsx`, `ParentFeedback.jsx`, PWA/offline documentation, Homeschooling Compass, Owner HQ announcements and billing code.

## Changes made in this PR

| Area | Finding | Correction |
| --- | --- | --- |
| Free preview | Several pages explained the sign-up trial without clearly stating the post-trial restrictions. | Added the 7-day expiry, no-auto-charge, preserved records, assigned-work completion and optional membership details. |
| Trial communications | No automatic expiry reminder existed. | Branded factual Day 5 and Day 7 emails, plus a Day 6 Parent Hub banner, with one-send-per-kind ledger. |
| Family Membership | Free AI/offline entitlement could be inferred from general help copy. | Explained AI lesson building, child assistance, uploads, offline lessons and fuller evidence as paid options, with fair-use limitations. |
| Curriculum coverage | National coverage claims could read as comprehensive. | Explicitly disclose that some states/subjects/electives/outcomes remain incomplete, and legacy automated suggestions may be NSW-based. |
| Registration | New Homeschooling Compass barely appeared in help guidance. | Added a dedicated FAQ and Trust Hub link, stressing links/guidance are not official applications or approvals. |
| Apps/offline | Parent and SQ Kids installable web app behaviour wasn't described clearly. | New FAQ explaining installable web apps, initial online setup, offline lessons for paid child accounts and later syncing. |
| Owner HQ feedback | Some support pages described email as the only path, omitted in-app replies and dashboard notifications. | Updated Contact, Report a Problem, Request a Correction, Help, Trust Hub and in-app Support links to the current two-way feedback experience; kept email fallback for login problems. |
| Children/AI | Some generic text sounded as though hints were universally available. | Clarified optional guided hints are paid and parent controlled; no open-ended child chat. |
| Data use | Policy did not discuss new service emails and private HQ conversations. | Added factual account-email disclosure, separate optional promotional consent and private feedback conversations. |
| Tone/navigation | References to a support 'team' and onboarding FAQ grouping did not match a one-parent operation. | Updated copy and fixed Help section rendering; direct Trust Hub links now open plan and registration guidance. |

## Page-by-page status

- **Privacy Policy:** updated for account emails and in-app support records. **Legal/privacy review still required** before publishing a new policy version.
- **Terms of Use:** subscription timing, post-preview records, billing schedules and cancellation described. **Legal review still required**, particularly refunds, statutory rights and billing disclosures.
- **Educational Disclaimer:** updated to recognise learning-content tools without implying official accreditation; curriculum outcomes explicitly incomplete.
- **AI Use & Limitations:** revised paid AI and NSW legacy outcome statements; parental review remains essential. Confirm live AI data flows if new models or image processing are added later.
- **Contact Us:** prioritises in-app Ideas & Feedback, including private owner replies, with email fallback.
- **Help & FAQ:** new answers on trial expiry/reminders, web apps/offline work, Compass and tracker; pricing and feature limits clarified.
- **Report a Problem:** updated where to report and where to receive a response.
- **Request a Correction:** current feedback thread route and outcome-catalogue caveat.
- **Privacy Complaint:** request procedure remains manual and email-based; do not claim an automated legal resolution.
- **Request Your Data:** remains manual, identity-checked; no automated data export entitlement is claimed.
- **How I Handle Data:** support threads and current retention/hosting descriptions clarified.
- **Third-Party Services:** clarifies Cloudflare outgoing email, Stripe and Google support/video roles.
- **Safety Overview:** now distinguishes parent-HQ messages from prohibited child-to-child communication; parent supervision remains essential.
- **Acknowledgement of Country:** existing content retained. Ask relevant local Traditional Custodians to check local names and wording if making substantive changes.

## Follow-up checks before merging/deploying

1. Run current CI, including Worker membership/reminder tests, TypeScript, frontend build, parent/browser and offline E2E. Review results from the **latest** head commit, not an earlier run.
2. Apply additive D1 migration `0066_trial_reminders.sql` and verify the configured Cloudflare `EMAIL` binding and sending quota. Existing cron runs every five minutes.
3. Verify trial reminders with real sandbox families without emailing any real customers. Check displayed Parent Hub alert at T+6 days, emails at T+5 days and after T+7 days, and suppressed mail once a paid subscription becomes active.
4. Get a human legal/privacy review of Privacy Policy and Terms. The source explicitly labels the pages **DRAFT COPY**; software tests cannot validate legal sufficiency.
5. Reassess these pages when the national outcome catalogue, new AI capabilities or app offline behaviour changes. Outcome tracking should not be advertised as nationally exhaustive until the database is verified.
6. Parent Support remains a one-person inbox. Do not publish a hard turnaround guarantee. Users should keep independent copies of legally important education records.

**Email delivery trade-off:** the new reminder ledger is at-most-once provider attempt per family and kind. Network/provider failures are recorded rather than retried blindly, because a failed response can occur after a provider has accepted the email. This avoids duplicate automatic reminders but cannot guarantee receipt.

**Release:** PR content only until deliberately merged and deployed; public production behaviour has not been independently retested by this report.
