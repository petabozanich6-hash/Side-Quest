# SideQuest parent email verification — controlled rollout

New-family email verification is opt-in to prevent breaking registration while the
Cloudflare Email Service or D1 schema is incomplete.

## Before switching it on
1. Back up production D1 and apply **0069_parent_email_verification.sql**.
   Verify new columns on users and the email_verification_tokens table.
2. Confirm the existing Cloudflare `EMAIL` send-email binding can deliver an
   on-brand email from `no-reply@sidequestlearning.app` to a real external inbox.
3. Merge this PR; verify the website has /verify-email and the Worker endpoints
   before enabling the gate.
4. Set Worker variable `EMAIL_VERIFICATION_REQUIRED = "true"` only after 1–3.
   **This PR does not change that production variable.**
5. Register a new test family with a real mailbox. Confirm registration has no
   token, sign-in returns EMAIL_VERIFICATION_REQUIRED, resend works, emailed
   one-use confirmation opens /verify-email, and sign-in succeeds afterwards.
   Verify the trial runs for seven days from confirmation.

## Safety behaviour
- Existing parent accounts remain usable regardless of old verification status.
- Only accounts created while the flag is on receive verification-required markers.
- A new unverified family never receives an auth token. Existing child records
  and user data are unaffected.
- Tokens are 32 random bytes, SHA-256 hashed in D1, 48-hour expiry, one use.
- Public resend checks its own rate-limit namespace and uses generic responses.
- A mail outage refuses *new gated signup* if no binding; if a particular send
  fails after registration, resend is available (no access bypass).
- Email syntax alone does not confirm the mailbox exists or belongs to the user.
- Enabling verification does not retroactively affect families; no purge occurs.
- Do not use fake addresses for manual production testing: use a mailbox you control.
