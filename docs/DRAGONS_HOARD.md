# The Dragon's Hoard — Owner HQ

Path: **Parent Hub → Owner HQ → Dragon’s Hoard** (`/parent/command-centre/dragon-hoard`).

The first release includes Stripe promotional discount scrolls and manually gifted **extra free preview days**. It does not yet include a referral programme, full-membership sponsorship, or new child-room cosmetics. Those should not be advertised as active features.

## Discount scrolls

- The Owner can create an alphanumeric promotional code, name, percentage (5–50%), discount duration (first invoice or first 2/3 months), maximum number of redemptions (1–500) and expiry (within 366 days).
- Creation uses the **currently configured Stripe environment** (test or live) and calls Stripe to create a coupon and promotion code. Stripe — not D1 and not the browser — enforces whether the code is active, eligible, expired or used up. Codes are restricted to first-time transactions.
- Parent **Your plan** page sends families to Stripe Checkout, where they may enter a promo code. Stripe displays the discounted total before checkout confirmation. The user cannot supply a price, discount identifier or entitlement via the app API. Checkout returns never grant access: the verified Stripe webhook remains the authority.
- All existing Stripe Checkout prices and intervals stay unchanged. A promotional code discounts that checkout price; it does not change the base plan price in HQ.
- HQ shows each code's local creation metadata. For authoritative live redemption totals, invoice amounts and discounts, consult the **matching Stripe environment**. The HQ's active count is a count of unexpired, non-retired codes, **not redemptions**.
- Retiring a code deactivates it in Stripe, blocking future redemptions. Already-applied subscription discounts retain their terms. A disabled or expired code is not automatically reusable.
- Stripe restricted API keys must permit **Coupons write**, **Promotion Codes write**, and the existing Checkout permissions. If these permissions are missing, campaign creation fails without creating an HQ row. Network failures can leave a Stripe coupon or code that requires checking in the Stripe dashboard before retrying.
- A test-mode code never becomes a live promotion. After separately authorising live billing, issue new live-mode codes.

## Helping Hand — preview days

The Owner can open a customer's HQ page and choose **Gift 7 preview days**. It requires entering `GIFT` and a reason (5–500 characters), which is written to the admin audit log. This adjusts `families.trial_ends_at` only; it **does not provide Family Membership features**. The backend also allows 1- or 14-day gifts for future use, but the first interface offers seven days.

Gifts are permitted only to active, non-admin families whose stored plan is `FREE_PREVIEW` and who have no Stripe subscription/status; extensions are capped at 35 days from the original trial start and compare-and-swap on the previous trial end to avoid concurrent overwrites. A paid plan, internal owner family, or suspended family cannot be gifted preview days.

Trial reminder emails already use the updated preview end date. Confirm existing reminder cadence when gifting near an upcoming scheduled notification.

## Security and deployment

All endpoints inherit existing Owner-only server-side role checks, recent passkey step-up, same-origin CSRF checks, rate limits and admin audit logging. A parental browser never calls the Stripe coupon API. Child names, work, evidence and payment data are not included in Hoard response bodies.

New additive migration: `worker/migrations/0067_dragons_hoard.sql`. The feature also safely creates its tables with `CREATE TABLE IF NOT EXISTS` on first use because deploying the Worker does not automatically run D1 migrations. Back up D1 before running the production migration in the normal way. This change never enables live Stripe by itself.

Validate with `npm run test:worker`, `npm --prefix worker run typecheck`, `CI=false npm --prefix frontend run build`, and the existing Owner HQ browser test. In Stripe sandbox, create, redeem, expire and retire a code; check the final checkout amount and that webhook updates the family only after payment confirmation.

## Later phases (not implemented here)

An opt-in referral programme with abuse controls, full-membership sponsorship that never silently changes a paid subscription, and a no-purchase child-room seasonal gift catalogue integrated into existing pet assets. Promotions sent by email must use the existing **opt-in special news** audience; do not send marketing to the essential service-notice list.
