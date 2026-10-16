# Stripe subscriptions (sandbox)

Code: `worker/src/billing.ts` (checkout, portal, webhook), `worker/src/entitlements.ts` (plans),
`frontend/src/pages/parent/Upgrade.jsx` (`/parent/plan`), migration `worker/migrations/0053_stripe_billing.sql`,
tests `worker/test/billing.test.mjs`.

## How it works

| Step | What happens |
| --- | --- |
| Parent picks weekly / fortnightly / monthly / yearly | Browser sends the interval and an **optional Dragon's Hoard code** to `POST /api/billing/checkout`. |
| Server | Looks up the price ID from its own list and, if a code was entered, resolves it only from active, unexpired **SideQuest Owner HQ** offers for the current Stripe mode. It uses the signed-in parent's family, creates or reuses the customer, and creates a Checkout Session (no extra trial) with the **server-resolved Stripe promotion ID**. |
| Stripe Checkout | Card is collected and charged on Stripe's hosted page. |
| Return to `/parent/plan?checkout=success` | Grants nothing. The page polls `/api/account/plan` until the server confirms. |
| Webhook `POST /api/billing/webhook` | Signature verified, event de-duplicated, subscription re-fetched from Stripe, family plan set from its *current* state. |

Plans: `ACTIVE_WEEKLY`, `ACTIVE_FORTNIGHTLY`, `ACTIVE_MONTHLY`, `ACTIVE_ANNUAL` all unlock the same Family Membership.
Failed renewal → `PAST_DUE` with 7 days' access while Stripe retries. Cancelled at period end → full access until the
period end, then `CANCELLED`. Nothing is ever deleted when access ends. `INTERNAL` (early-access) families are never
changed by Stripe and cannot start checkout; test with a newly registered family.

Sandbox vs live is decided by the key: `sk_test_`/`rk_test_` uses the sandbox prices in `billing.ts`. A live key is
refused unless `STRIPE_LIVE_ENABLED=true` **and** live prices are added to `PRICES.live` (currently empty).

## 1. Apply the database migration

Back up D1, then `npm run db:migrate` (adds 0053; additive only). Until this is applied, checkout and the webhook
return errors (the plan page still loads).

## 2. Cloudflare secrets (Worker `side-quest`)

Dashboard: Workers & Pages → side-quest → Settings → Variables and Secrets → Add → type **Secret**.
Or `npx wrangler secret put <NAME>` (add `--config wrangler.staging.jsonc` for staging).

| Secret | Value | Where in Stripe (Sandbox mode on) |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_...` or a restricted `rk_test_...` | Developers → API keys. Restricted key needs: Customers write, Checkout Sessions write, Customer portal write, Subscriptions read. To create/retire Dragon's Hoard campaigns also allow Prices read, Coupons write and Promotion Codes write. Prices are read so coupons apply only to SideQuest subscription products, never another product sharing the Stripe account. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Shown on the webhook destination after step 3 ("Signing secret"). |

Optional plain variable: `APP_URL=https://sidequestlearning.app`. Do **not** set `STRIPE_LIVE_ENABLED`.

## 3. Webhook endpoint

Stripe (Sandbox) → Developers → Webhooks → Add destination → Your account →
URL `https://sidequestlearning.app/api/billing/webhook`, events:

`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
`customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`,
`customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`, `invoice.payment_succeeded`,
`invoice.payment_failed`.

**The site is IP-restricted, so Stripe will be blocked.** In Cloudflare → Security → WAF, edit the IP block rule to
add `and not (http.request.uri.path eq "/api/billing/webhook")`. The endpoint authenticates every request by signature.
Then use "Send test event" in Stripe; it should return 200.

## 4. Customer portal

Stripe (Sandbox) → Settings → Billing → Customer portal: allow updating payment methods and viewing invoices; allow
cancellation with **"At end of billing period"**; turn **off** switching plans; save.

## 5. Test all four subscriptions

Register a fresh parent (it starts on the 7-day preview, no card). On **Your plan**, for each interval
(use a new family each time, or cancel immediately in Stripe and retry):

1. Choose the option → Stripe Checkout shows the right amount (A$3/week, A$6 every 2 weeks, A$13/month, A$130/year).
2. Pay with `4242 4242 4242 4242`, any future date, any CVC.
3. Back on Your plan: "confirming" then "Family Membership (weekly/fortnightly/monthly/yearly)" with a renewal date.
4. Stripe → Webhooks → your destination → events show 200s. Also try `4000 0025 0000 3155` (3-D Secure).

## 6. Cancellation and failed payments

- **Cancel:** Your plan → Manage billing → Cancel. Page shows "Full access continues until …". In Stripe, cancel the
  subscription *immediately* to simulate the period ending → plan shows "Membership ended", lessons and progress remain,
  creating lessons is blocked.
- **Failed payment:** Manage billing → replace the card with `4000 0000 0000 0341`. Force a renewal now with the Stripe
  CLI: `stripe subscriptions update sub_... --billing-cycle-anchor=now --proration-behavior=none`. The invoice fails →
  plan shows "payment needed" (access kept 7 days). Put `4242…` back and pay the invoice in Stripe → returns to active.
- **Declined at checkout:** `4000 0000 0000 9995` → Checkout shows the error, plan unchanged.
- **Duplicates:** In Stripe, resend any delivered event → returns 200, nothing changes.

## Before live payments

1. Explicit approval to go live.
2. Create live products/prices; add their ids to `PRICES.live` in `worker/src/billing.ts`.
3. Live webhook destination + live portal settings (same as above, in live mode).
4. Set live `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` on the production Worker and `STRIPE_LIVE_ENABLED=true`;
   keep test keys on staging only.
5. Remove the IP restriction (keep the webhook path open), and complete Stripe account activation (business details,
   bank account, ABN/GST settings, statement descriptor). Add terms, privacy and refund policy pages linked from checkout.
