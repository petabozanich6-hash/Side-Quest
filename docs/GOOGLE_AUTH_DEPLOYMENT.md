# Google sign-in deployment and recovery

This has not been applied to production. Do not run the remote commands below until the Owner account work and this branch are both ready to ship, and the owner has approved the deploy.

## What the migration does

`worker/migrations/0050_google_auth.sql` is additive:

- `users.google_sub` stores the Google subject. Existing rows stay `NULL`.
- `users.platform_role` defaults to `parent`. `users.is_owner` stays the family-account flag and is not the platform Owner.
- `auth_sessions` and `oauth_login_tickets` are new tables.

It does not update emails, password hashes, family ids, children, assignments or submissions. Registration, email matching and Google sign-in insert `platform_role = 'parent'`. They never write `owner`. The Owner account branch assigns `owner` on the server. Its local file `worker/dev-migrations/owner_account.sql` adds the same column; skip that `ALTER` after 0050 has been applied. That file is outside `worker/migrations` and must not be run with `--remote`.

## Safe sequence

1. Export the remote database and keep the file outside the repo:

   ```bash
   npx wrangler d1 export sidequest-db1 --remote --output ~/sidequest-pre-google-auth.sql
   ```

2. In Google Cloud Console, set the redirect URIs listed in the README. Confirm the OAuth app is allowed for the parent accounts that will sign in.

3. Apply the migration before the new Worker. The current production Worker does not read these columns, so this step alone does not change sign-in:

   ```bash
   npm run db:migrate
   ```

4. Set the Google secrets. Do not put them in git or the frontend:

   ```bash
   npx wrangler secret put GOOGLE_OAUTH_CLIENT_ID
   npx wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET
   ```

5. Deploy the Worker only after the migration has succeeded:

   ```bash
   npm run deploy
   ```

6. Check password sign-in, a child username and PIN, the Google button's redirect to `https://sidequestlearning.app/api/auth/google/callback`, linking an existing password account, and logout. Existing sessions end because tokens now require a row in `auth_sessions`. Family data stays.

The platform Owner is assigned later by the Owner account feature, by setting `users.platform_role` to `owner` for one user id. Google sign-in reads that value and does not change it. Lifetime access is that database value, not a claim in the browser token.

## Recovery

- Migration applied, new Worker not deployed: leave the new columns and tables. The previous Worker ignores them. Do not drop them.
- New Worker deployed before the migration: password and Google sign-in fail because they write `auth_sessions` and read `platform_role`. Apply `npm run db:migrate` at once, or roll the Worker back with `npx wrangler rollback`. Do not delete families to fix this.
- A Google link was attached to the wrong parent: set that user's `google_sub` and `oauth_provider` back to `NULL`. The password hash, family, children and progress are not cleared by linking.
- Owner role needs to be corrected: update `platform_role` for that user id on the server. Do not grant it by matching an email address.
- Do not run 0050 by hand a second time. `ALTER TABLE` is not repeatable. Wrangler records it once in `d1_migrations`.
- Full restore only with an explicit decision to replace the live database: import `~/sidequest-pre-google-auth.sql`. That export is the recovery copy from step 1. Anything written after the export is lost.

## Other branches

Checked without modifying them:

- `feature/pet-room-gamification` does not change the auth files, login pages, `wrangler.jsonc`, or migration 0050.
- `feature/gold-v2-resumable-pipeline` does not change those files either. Its Worker overlap with `origin/main` in this area is `worker/src/core.ts`.
- `feature/owner-account` has uncommitted `worker/src/entitlements.ts`, `worker/src/session.ts`, and `worker/dev-migrations/owner_account.sql`. Product access belongs there: a family is entitled when a member's `platform_role` is exactly `owner`, ahead of trial and subscription. This branch does not add a second access system. When the branches merge, their session reader must keep the `auth_sessions` revocation from this branch, and their column `ALTER` must not run again.
