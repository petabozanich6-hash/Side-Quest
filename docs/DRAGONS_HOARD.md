# The Dragon's Hoard — Owner HQ

Path: **Parent Hub → Owner HQ → Dragon’s Hoard** (`/parent/command-centre/dragon-hoard`).

The first release includes Stripe promotional discount scrolls and manually gifted **extra free preview days**. It does not yet include a referral programme, full-membership sponsorship, or new child-room cosmetics. Those should not be advertised as active features.

## Discount scrolls

- The Owner can create an alphanumeric promotional code, name, percentage (5–50%), discount duration (first invoice only), maximum number of redemptions (1–500) and expiry (within 366 days).
- Creation uses the **currently configured Stripe environment** (test or live), retrieves the products behind all configured SideQuest subscription prices, and creates a coupon **restricted to those Stripe products**. A SideQuest offer cannot discount Pocket Goblin or other products sharing that Stripe account. Stripe — not D1 and not the browser — enforces whether the code is active, eligible, expired or used up. Codes are restricted to first-time transactions.
- Parents enter an optional Dragon’s Hoard code **in Your plan**, then choose a subscription. The Worker validates that the code was created in SideQuest HQ, is active, has not expired and belongs to the currently configured Stripe mode. Only the stored Stripe promotion ID is forwarded to Checkout. Stripe displays the final discounted amount before the parent authorises payment and enforces redemption limits. **Unrelated Stripe promotions cannot be redeemed through this checkout**, even when multiple products share a Stripe account. Checkout returns never grant access: the verified Stripe webhook remains the authority.
- All existing Stripe Checkout prices and intervals stay unchanged. A promotional code discounts the first checkout invoice (including annual checkout if selected); it does not change the base plan price in HQ. Multi-month discounts are deferred until they can be restricted safely by billing interval.
- HQ shows each code's local creation metadata. For authoritative live redemption totals, invoice amounts and discounts, consult the **matching Stripe environment**. The HQ's active count is a count of unexpired, non-retired codes, **not redemptions**.
- Retiring a code deactivates it in Stripe, blocking future redemptions. Already-applied subscription discounts retain their terms. A disabled or expired code is not automatically reusable.
- Stripe restricted API keys must permit **Prices read**, **Coupons write**, **Promotion Codes write**, and the existing Checkout permissions. If these permissions are missing, campaign creation fails without creating an HQ row. Network failures can leave a Stripe coupon or code that requires checking in the Stripe dashboard before retrying.
- A test-mode code never becomes a live promotion. After separately authorising live billing, issue new live-mode codes.

## Helping Hand — preview days

The Owner can open a customer's HQ page and choose **Gift 7 preview days**. It requires entering `GIFT` and a reason (5–500 characters), which is written to the admin audit log. This adjusts `families.trial_ends_at` only; it **does not provide Family Membership features**. The interface lets you select a 1-, 7- or 14-day gift.

Gifts are permitted only to active, non-admin families whose stored plan is `FREE_PREVIEW` and who have no Stripe subscription/status; extensions are capped at 35 days from the original trial start and compare-and-swap on the previous trial end to avoid concurrent overwrites. A paid plan, internal owner family, or suspended family cannot be gifted preview days.

An eligible family sees a Dragon’s Hoard gift confirmation on **Your plan**, with the number of bonus days and new preview end date. The owner's reason remains private in the audit log. Trial reminder emails already use the updated preview end date. Confirm existing reminder cadence when gifting near an upcoming scheduled notification.

## Security and deployment

All endpoints inherit existing Owner-only server-side role checks, recent passkey step-up, same-origin CSRF checks, rate limits and admin audit logging. A parental browser never calls the Stripe coupon API. Child names, work, evidence and payment data are not included in Hoard response bodies.

New additive migration: `worker/migrations/0067_dragons_hoard.sql`. The feature also safely creates its tables with `CREATE TABLE IF NOT EXISTS` on first use because deploying the Worker does not automatically run D1 migrations. Back up D1 before running the production migration in the normal way. This change never enables live Stripe by itself.

Validate with `npm run test:worker`, `npm --prefix worker run typecheck`, `CI=false npm --prefix frontend run build`, and the existing Owner HQ browser test. In Stripe sandbox, create, redeem, expire and retire a code; check the final checkout amount and that webhook updates the family only after payment confirmation.

## Later phases (not implemented here)

An opt-in referral programme with abuse controls, full-membership sponsorship that never silently changes a paid subscription, and a no-purchase child-room seasonal gift catalogue integrated into existing pet assets. Promotions sent by email must use the existing **opt-in special news** audience; do not send marketing to the essential service-notice list.
