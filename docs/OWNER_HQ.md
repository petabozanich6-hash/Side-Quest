# Owner HQ

Owner HQ is the owner-only command centre inside Side-Quest (Parent Hub → **Owner HQ**, at `/parent/command-centre`).
It replaces the first "Command Centre" page, which treated any family on the `INTERNAL` plan as the owner.

## What it does

| Area      | What you can do                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overview  | Families, parents, children, new families (7/30 days, 14-day chart), plans, Stripe status, AI requests and failures, storage, server errors and a "needs attention" list. Unmeasured billing and user statistics still say **Not configured** (revenue, active users). Workers AI now has a privacy-safe per-inference token ledger with a **clearly labelled USD gross estimate**, not an invoice or a guess from request counts. Cloudflare remains authoritative for charges. |
| Customers | Search families by parent email or family id. A family's page shows account details and **counts only**: never children's names, lessons, answers, evidence, notes or files. Suspend, restore and "sign out everywhere", each with a reason. |
| Settings  | Announcement banner, maintenance notice, feature switches (new sign-ups, AI, YouTube suggestions) and the platform-wide daily AI limit. Changes that could cost money or shut people out ask for a second confirmation. |
| Audit log | Every administrative change, newest first.                                                                                                                               |
| Security  | Your passkeys (keep at least two).                                                                                                                                       |

## How it is protected

1. **Owner role, not a plan.** Ownership is a row in `user_roles`. Plans (`families.plan`, including `INTERNAL`) only
   give features. No API endpoint can grant a role.
2. **Invisible to everyone else.** Every `/api/admin/*` request is checked on the server; anyone who isn't the Owner
   (signed out, children, ordinary parents) gets "Not found", as if it did not exist.
3. **Passkey step-up.** After signing in normally, HQ unlocks only with a passkey (Face ID, Touch ID, Windows Hello or
   a security key) for 15 minutes, on that sign-in only. Adding the first passkey asks for your password again.
4. **CSRF protection.** Changes must come from the Side-Quest site itself (allow-listed origin + a custom header).
5. **Rate limits** per account, and **an audit record** for every change.

Suspending a family signs out every parent and child in it and blocks sign-in (email, Google and child PIN) until
restored. Nothing is deleted and Stripe billing is not changed.

## Turning it on (needs your approval at each step)

Nothing here has been done yet. In order:

1. **Review and merge the pull request.** Merging deploys the code automatically. It is safe before step 2: the Worker
   creates the new tables itself, and nobody is an Owner yet, so HQ stays invisible.
2. **Apply migration 0060** the usual way (docs/RELEASE.md: backup first, then `npm run db:migrate:prod`). It only
   adds new tables and one reference row (`roles`: owner). It changes no existing row.
3. **Find your Account ID.** Sign in to https://sidequestlearning.app → **Trust & Support** → scroll to
   **Your account** → copy the **Account ID**.
4. **Promote your account (one time).** On this Mac, in the Side-Quest folder, with `wrangler login` done:

   ```bash
   OWNER_EXPECTED_EMAIL=<your email> node worker/scripts/owner-promotion.mjs preflight --user-id <Account ID>
   ```

   It changes nothing. Check the masked email and creation date are yours and "Existing Owners: 0". Then:

   ```bash
   OWNER_EXPECTED_EMAIL=<your email> node worker/scripts/owner-promotion.mjs apply --user-id <Account ID> --confirm PROMOTE
   ```

   It records a Time Travel restore point first, then grants the owner role with one guarded statement (it re-checks
   the id, the email, that your family is active and that no Owner exists) and writes an audit entry.
5. **Sign out and sign in again**, open **Owner HQ**, enter your password once and add a passkey. Then add a second
   passkey on another device under **Security**.

## Undo and recovery

- **Remove the owner role** (keeps everything else):
  `npx wrangler d1 execute DB --remote --command "UPDATE user_roles SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE role = 'owner' AND revoked_at IS NULL"`
- **Lost all passkeys:** delete them, then add a new one (your password is asked again):
  `npx wrangler d1 execute DB --remote --command "DELETE FROM webauthn_credentials WHERE user_id = '<Account ID>'"`
- **Reset every setting to its default:** `npx wrangler d1 execute DB --remote --command "DELETE FROM platform_settings"`
- **Code rollback:** `npx wrangler rollback --name side-quest`. The new tables are additive and harmless to older code.

## Notes for developers

- Schema: `worker/src/ownerSchema.ts` = `worker/migrations/0060_owner_hq.sql` (a test keeps them identical).
- Tokens now carry `sid` (sign-in id for step-up) and `av` (the family's auth version). Tokens issued before this
  change keep working for the normal app; the Owner signs in again once to open HQ.
- Settings are cached for 30 seconds per Worker instance. The AI switch and the platform AI limit work by withholding
  the `AI` binding from requests (every AI path already treats that as "AI unavailable"); the YouTube switch withholds
  `YOUTUBE_API_KEY`.
- Staging: set `ADMIN_ORIGINS` to the staging workers.dev origin so HQ changes are accepted there.
- Tests: `worker/test/ownerHq.test.mjs` (real migrations on SQLite, real WebAuthn verification with a software
  passkey) and `worker/test/e2e/owner-hq.mjs` (browser, virtual authenticator, phone/tablet/desktop).
