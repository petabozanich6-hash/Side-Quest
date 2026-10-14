# Owner alerts: New Adventurer (paid memberships)

Side-Quest can email the owner **once when each family first joins with a genuinely paid membership**.

## Setup (before paid launch)

1. Set the destination in **Cloudflare Workers → side-quest → Settings → Variables and Secrets** as a secret named `OWNER_NOTIFICATION_EMAIL`. Its value must be the actual inbox where the owner wants notifications. Alternatively, from a correctly authenticated project checkout, run `npx wrangler secret put OWNER_NOTIFICATION_EMAIL` and paste the address at the secure prompt. **Do not commit that address to GitHub.**
2. Confirm the existing Cloudflare `EMAIL` Email Sending binding is configured and permitted to send to that recipient.
3. Apply the D1 migration `0055_owner_new_member_alerts.sql` through the normal migration/deployment process. Do not skip it.
4. Launch live Stripe billing only after the existing `STRIPE_SECRET_KEY`, live prices, `STRIPE_WEBHOOK_SECRET` and `STRIPE_LIVE_ENABLED=true` have been independently confirmed. This feature **does not** enable live Stripe billing.

## What triggers the alert?

- A **Stripe-signature-verified**, **live**, subscription checkout event (`checkout.session.completed` or `checkout.session.async_payment_succeeded`) reporting `payment_status=paid` and `amount_total > 0`.
- The app re-fetches the current Stripe subscription and requires an active, valid paid family membership.
- Recipient is controlled by the private `OWNER_NOTIFICATION_EMAIL` setting. No address configured means no alert.

## What does not trigger it?

- Test-mode payments, preview registrations, unpaid or zero-dollar checkout, one-off payments, renewals (`invoice.paid`), or subsequent subscription purchases by an already-notified family.
- Events where the Stripe subscription does not belong to an active paid Side-Quest family.

## Contents and privacy

Whimsical dragon/goblin **ACHIEVEMENT UNLOCKED** email including the membership frequency/price and a live count of active paying families. No children, names, personal contact information, payment-card details, or Stripe secrets in the email or the alert ledger.

## Reliability notes

`owner_new_member_alerts` has a unique family ID and atomically claims the first send to guard against concurrent webhook deliveries. Once sent, it will not be resent just because Stripe retries or the family buys a different subscription. A failed email attempt releases the claim, allowing a later genuine paid checkout to retry it. Delivery is best-effort and does **not block customer access or their subscription confirmation**. An extremely rare crash between provider acceptance and recording delivery can produce a duplicate after a stale claim expires; email providers without idempotency keys cannot guarantee strict exactly-once delivery.

The owner alert is deliberately not tied to all `invoice.paid` events; it must never become a notification for every renewal.

## Testing

The Node/SQLite billing tests cover live/test gating, success, non-qualifying events, duplicate paid checkouts, concurrent claims, privacy in the template and an email failure. A **real live checkout** (once Stripe billing is intentionally enabled) remains the final end-to-end proof that the Cloudflare sender and recipient are configured. Do not use an actual card until business launch approval.
