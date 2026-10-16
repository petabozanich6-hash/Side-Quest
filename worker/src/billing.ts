// Stripe subscription billing: Checkout, Customer Portal and verified webhooks.
//
// Security model
// - The browser only ever sends a plan key ("weekly" | "fortnightly" | "monthly" | "yearly").
//   The Stripe price id, family id, customer and redirect URLs are all chosen here on the server.
// - Membership is granted ONLY by the signature-verified webhook. The checkout success URL grants nothing.
// - Every webhook re-fetches the subscription from Stripe and applies its CURRENT state, so duplicate
//   or out-of-order events converge on the same result instead of replaying stale payloads.
// - Sandbox and live are separated by the secret key itself: an sk_test_/rk_test_ key uses the sandbox
//   price list below; a live key is refused unless STRIPE_LIVE_ENABLED=true AND live prices are filled in.
import { ACTIVE_PLANS, PAST_DUE_GRACE_DAYS } from "./entitlements";
import { membershipActivatedEmail, sendEmail } from "./email";
import { sendOwnerNewMemberAlert } from "./ownerNotifications";
import { resolveHoardDiscount, previewHoardDiscount } from "./dragonHoard";
import type { Plan } from "./entitlements";
import type { App, Env, Guards } from "./types";

type DB = D1Database;
export type Interval = "weekly" | "fortnightly" | "monthly" | "yearly";
export type Mode = "test" | "live";
type PriceInfo = { interval: Interval; price: string; amount_cents: number; label: string; every: string };

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_VERSION = "2025-03-31.basil";
const DAY_MS = 86400000;
const SIGNATURE_TOLERANCE_S = 300;

// Display order on the upgrade page. All four unlock the same Family Membership.
export const INTERVALS: Interval[] = ["weekly", "fortnightly", "monthly", "yearly"];

/** Price ids per Stripe mode. Live stays empty until live payments are approved. */
export const PRICES: Record<Mode, Partial<Record<Interval, PriceInfo>>> = {
  test: {
    weekly: { interval: "weekly", price: "price_1UQFYpISyxgEBX5FzhkFjxRL", amount_cents: 300, label: "Weekly", every: "per week" },
    fortnightly: { interval: "fortnightly", price: "price_1UQFZPISyxgEBX5FJ7sgeGGP", amount_cents: 600, label: "Fortnightly", every: "every 2 weeks" },
    monthly: { interval: "monthly", price: "price_1UQFZoISyxgEBX5FIRNQLlb3", amount_cents: 1300, label: "Monthly", every: "per month" },
    yearly: { interval: "yearly", price: "price_1UQFXwISyxgEBX5F7t6pkZRz", amount_cents: 13000, label: "Yearly", every: "per year" },
  },
  live: {
    weekly: { interval: "weekly", price: "price_1UQG5VIAnqYz3EmMwqZiCUVK", amount_cents: 300, label: "Weekly", every: "per week" },
    fortnightly: { interval: "fortnightly", price: "price_1UQG5UIAnqYz3EmMUvMor7ax", amount_cents: 600, label: "Fortnightly", every: "every 2 weeks" },
    monthly: { interval: "monthly", price: "price_1UQG5UIAnqYz3EmMa9hgvcQh", amount_cents: 1300, label: "Monthly", every: "per month" },
    yearly: { interval: "yearly", price: "price_1UQG5UIAnqYz3EmMUlcFevXz", amount_cents: 13000, label: "Yearly", every: "per year" },
  },
};

const LIVE_PRICE_VARS = {
  weekly: "STRIPE_LIVE_PRICE_WEEKLY",
  fortnightly: "STRIPE_LIVE_PRICE_FORTNIGHTLY",
  monthly: "STRIPE_LIVE_PRICE_MONTHLY",
  yearly: "STRIPE_LIVE_PRICE_YEARLY",
} as const;
const LIVE_PRICE_DETAILS: Record<Interval, Omit<PriceInfo, "interval" | "price">> = {
  weekly: { amount_cents: 300, label: "Weekly", every: "per week" },
  fortnightly: { amount_cents: 600, label: "Fortnightly", every: "every 2 weeks" },
  monthly: { amount_cents: 1300, label: "Monthly", every: "per month" },
  yearly: { amount_cents: 13000, label: "Yearly", every: "per year" },
};

export const PLAN_FOR_INTERVAL: Record<Interval, Plan> = {
  weekly: "ACTIVE_WEEKLY",
  fortnightly: "ACTIVE_FORTNIGHTLY",
  monthly: "ACTIVE_MONTHLY",
  yearly: "ACTIVE_ANNUAL",
};

// ---------------------------------------------------------------- configuration

export type BillingConfig =
  | { ok: true; mode: Mode; key: string; prices: Partial<Record<Interval, PriceInfo>> }
  | { ok: false; reason: string };

export function billingConfig(env: Pick<Env, "STRIPE_SECRET_KEY" | "STRIPE_LIVE_ENABLED" | "STRIPE_LIVE_PRICE_WEEKLY" | "STRIPE_LIVE_PRICE_FORTNIGHTLY" | "STRIPE_LIVE_PRICE_MONTHLY" | "STRIPE_LIVE_PRICE_YEARLY">): BillingConfig {
  const key = env.STRIPE_SECRET_KEY || "";
  if (!key) return { ok: false, reason: "STRIPE_SECRET_KEY is not set" };
  const mode: Mode | null = /^(sk|rk)_test_/.test(key) ? "test" : /^(sk|rk)_live_/.test(key) ? "live" : null;
  if (!mode) return { ok: false, reason: "STRIPE_SECRET_KEY is not a Stripe secret or restricted key" };
  if (mode === "live" && env.STRIPE_LIVE_ENABLED !== "true") return { ok: false, reason: "Live Stripe key present but live payments are not enabled" };
  // Live prices are configured per environment, never copied from sandbox.
  // Reject partial configurations so a customer cannot pay for an unmapped plan.
  const prices: Partial<Record<Interval, PriceInfo>> = mode === "live"
    ? Object.fromEntries(INTERVALS.map((interval) => {
        const id = env[LIVE_PRICE_VARS[interval]] || PRICES.live[interval]?.price;
        if (!id || !/^price_[A-Za-z0-9]+$/.test(id)) return [interval, null];
        return [interval, { ...LIVE_PRICE_DETAILS[interval], interval, price: id }];
      }).filter(([, value]) => value !== null)) as Partial<Record<Interval, PriceInfo>>
    : PRICES.test;
  if (mode === "live" && (INTERVALS.some((i) => !prices[i]) || new Set(INTERVALS.map((i) => prices[i]?.price)).size !== 4)) {
    return { ok: false, reason: "Live Stripe prices must be configured for all four intervals with distinct price IDs" };
  }
  if (!Object.keys(prices).length) return { ok: false, reason: `No ${mode} prices are configured` };
  return { ok: true, mode, key, prices };
}

export function intervalForPrice(prices: Partial<Record<Interval, PriceInfo>>, priceId: string | null | undefined): Interval | null {
  if (!priceId) return null;
  for (const i of INTERVALS) if (prices[i]?.price === priceId) return i;
  return null;
}

// ---------------------------------------------------------------- webhook signatures

const enc = new TextEncoder();

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Verifies a Stripe-Signature header against the raw request body (Stripe's v1 scheme). */
export async function verifyStripeSignature(rawBody: string, header: string | null | undefined, secret: string, nowS = Math.floor(Date.now() / 1000)): Promise<boolean> {
  if (!header || !secret) return false;
  let t = "";
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2).map((x) => (x || "").trim());
    if (k === "t") t = v;
    else if (k === "v1" && v) v1.push(v);
  }
  const ts = Number(t);
  if (!t || !Number.isFinite(ts) || !v1.length) return false;
  if (Math.abs(nowS - ts) > SIGNATURE_TOLERANCE_S) return false;
  const expected = await hmacHex(secret, `${t}.${rawBody}`);
  return v1.some((s) => timingSafeEqualHex(s, expected));
}

// ---------------------------------------------------------------- Stripe REST client

export type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

function formEncode(params: Record<string, unknown>, prefix = "", out: string[] = []): string[] {
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => (typeof item === "object" ? formEncode(item as any, `${key}[${i}]`, out) : out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`)));
    else if (typeof v === "object") formEncode(v as Record<string, unknown>, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

export class StripeError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export async function stripeCall(key: string, method: "GET" | "POST", path: string, params: Record<string, unknown> = {}, opts: { idempotencyKey?: string; fetchImpl?: Fetch } = {}): Promise<any> {
  const body = formEncode(params).join("&");
  const url = method === "GET" && body ? `${STRIPE_API}/${path}?${body}` : `${STRIPE_API}/${path}`;
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, "Stripe-Version": STRIPE_VERSION };
  if (method === "POST") headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
  const res = await (opts.fetchImpl || fetch)(url, { method, headers, body: method === "POST" ? body : undefined });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new StripeError(res.status, json?.error?.message || `Stripe ${method} ${path} failed (${res.status})`);
  return json;
}

// ---------------------------------------------------------------- subscription -> family state

export type FamilyBillingRow = {
  id: string;
  plan: string | null;
  plan_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export type SyncDecision =
  | { action: "ignore"; reason: string }
  | { action: "update"; fields: Record<string, string | number | null>; plan_changed: boolean };

const GRANT_STATES = new Set(["active", "trialing", "past_due"]);
// Subscriptions that are, or can still become, a paying membership.
const LIVE_SUB_STATES = new Set(["active", "trialing", "past_due", "unpaid", "paused"]);
const ENDED_STATES = new Set(["canceled", "unpaid", "incomplete_expired", "paused"]);
const secIso = (s: unknown): string | null => (typeof s === "number" && s > 0 ? new Date(s * 1000).toISOString() : null);
const idOf = (v: any): string | null => (typeof v === "string" ? v : v && typeof v.id === "string" ? v.id : null);

/** Period end works on both the older (subscription.current_period_end) and newer (item.current_period_end) API shapes. */
export function subscriptionPeriodEnd(sub: any): string | null {
  const item = sub?.items?.data?.[0];
  return secIso(item?.current_period_end) || secIso(sub?.current_period_end);
}

/**
 * Pure decision: how a family row changes for the subscription as Stripe reports it NOW.
 * Never grants access for incomplete payments or unknown prices; never lets an old, ended
 * subscription overwrite a newer one; never changes an INTERNAL (early-access) family's plan.
 */
export function decideSync(fam: FamilyBillingRow, sub: any, prices: Partial<Record<Interval, PriceInfo>>, now: Date = new Date()): SyncDecision {
  const subId = idOf(sub);
  const customer = idOf(sub?.customer);
  const status = String(sub?.status || "");
  if (!subId || !customer || !status) return { action: "ignore", reason: "malformed subscription" };
  if (fam.stripe_customer_id && fam.stripe_customer_id !== customer) return { action: "ignore", reason: "customer does not belong to this family" };
  const grants = GRANT_STATES.has(status);
  if (fam.stripe_subscription_id && fam.stripe_subscription_id !== subId && !grants) {
    return { action: "ignore", reason: "older subscription; family has a newer one" };
  }
  const priceId = idOf(sub?.items?.data?.[0]?.price);
  const interval = intervalForPrice(prices, priceId);
  const periodEnd = subscriptionPeriodEnd(sub);
  const fields: Record<string, string | number | null> = {
    stripe_customer_id: customer,
    stripe_subscription_id: subId,
    stripe_price_id: priceId,
    billing_interval: interval,
    subscription_status: status,
    cancel_at_period_end: sub?.cancel_at_period_end || sub?.cancel_at ? 1 : 0,
    billing_updated_at: now.toISOString(),
  };

  let plan: Plan | null = null;
  let planEnd: string | null = null;
  if (status === "active" || status === "trialing") {
    if (interval && periodEnd) {
      plan = PLAN_FOR_INTERVAL[interval];
      planEnd = periodEnd;
    }
  } else if (status === "past_due") {
    plan = "PAST_DUE";
    const kept = fam.plan === "PAST_DUE" && fam.stripe_subscription_id === subId ? fam.plan_period_end : null;
    planEnd = kept || new Date(now.getTime() + PAST_DUE_GRACE_DAYS * DAY_MS).toISOString();
  } else if (ENDED_STATES.has(status)) {
    plan = "CANCELLED";
    const ended = secIso(sub?.ended_at);
    planEnd = ended && ended < now.toISOString() ? ended : now.toISOString();
  }
  // "incomplete" (first payment not finished) and unknown prices record ids only; access is unchanged.

  const internal = fam.plan === "INTERNAL";
  if (plan && !internal) {
    fields.plan = plan;
    fields.plan_period_end = planEnd;
  }
  return { action: "update", fields, plan_changed: !!plan && !internal && plan !== fam.plan };
}

const FAMILY_BILLING_SELECT = "id, plan, plan_period_end, stripe_customer_id, stripe_subscription_id";

async function findFamilyForSubscription(db: DB, sub: any): Promise<FamilyBillingRow | null> {
  const metaFamily = sub?.metadata?.family_id;
  if (typeof metaFamily === "string" && metaFamily) {
    const f = await db.prepare(`SELECT ${FAMILY_BILLING_SELECT} FROM families WHERE id = ?`).bind(metaFamily).first<FamilyBillingRow>();
    if (f) return f;
  }
  const customer = idOf(sub?.customer);
  if (!customer) return null;
  return db.prepare(`SELECT ${FAMILY_BILLING_SELECT} FROM families WHERE stripe_customer_id = ?`).bind(customer).first<FamilyBillingRow>();
}

export async function applyDecision(db: DB, familyId: string, d: SyncDecision) {
  if (d.action !== "update") return;
  const keys = Object.keys(d.fields);
  await db.prepare(`UPDATE families SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).bind(...keys.map((k) => d.fields[k]), familyId).run();
}

/** Fetch the subscription's current state from Stripe and apply it. Safe to call any number of times. */
export async function syncSubscription(db: DB, cfg: Extract<BillingConfig, { ok: true }>, subscriptionId: string, fetchImpl?: Fetch, now: Date = new Date()): Promise<string> {
  const sub = await stripeCall(cfg.key, "GET", `subscriptions/${encodeURIComponent(subscriptionId)}`, {}, { fetchImpl });
  const fam = await findFamilyForSubscription(db, sub);
  if (!fam) return `no family for subscription ${subscriptionId}`;
  const d = decideSync(fam, sub, cfg.prices, now);
  if (d.action === "ignore") return `ignored ${subscriptionId}: ${d.reason}`;
  await applyDecision(db, fam.id, d);
  return `synced ${subscriptionId} -> ${d.fields.plan ?? fam.plan} (${d.fields.subscription_status})`;
}

/** Subscription id referenced by an event object (subscription, checkout session or invoice; old and new invoice shapes). */
export function subscriptionIdFromEvent(event: any): string | null {
  const o = event?.data?.object;
  if (!o) return null;
  if (o.object === "subscription") return idOf(o);
  if (o.object === "checkout.session") return o.mode === "subscription" ? idOf(o.subscription) : null;
  if (o.object === "invoice") return idOf(o.subscription) || idOf(o.parent?.subscription_details?.subscription) || idOf(o.lines?.data?.[0]?.parent?.subscription_item_details?.subscription);
  return null;
}

export const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

/** Membership notification is sent only after an authenticated checkout event activates paid access. */
export type MembershipActivatedInfo = {
  familyId: string;
  subscriptionId: string;
  interval: Interval;
  periodEnd: string;
};
export type MembershipNotifier = (details: MembershipActivatedInfo) => Promise<void>;
export type OwnerMembershipNotifier = (details: MembershipActivatedInfo) => Promise<void>;

/** Handles one verified event. Returns an outcome string; throws to make Stripe retry. */
export async function handleEvent(
  db: DB,
  cfg: Extract<BillingConfig, { ok: true }>,
  event: any,
  fetchImpl?: Fetch,
  now: Date = new Date(),
  notifyMembership?: MembershipNotifier,
  notifyOwner?: OwnerMembershipNotifier,
): Promise<string> {
  const eventId = String(event?.id || "");
  if (!eventId) return "no event id";
  if (Boolean(event.livemode) !== (cfg.mode === "live")) return `ignored: ${event.livemode ? "live" : "test"} event for ${cfg.mode} configuration`;
  if (!HANDLED_EVENTS.has(event.type)) return `unhandled type ${event.type}`;

  const seen = await db.prepare("SELECT processed_at FROM stripe_events WHERE id = ?").bind(eventId).first<{ processed_at: string | null }>();
  if (seen?.processed_at) return "duplicate";
  if (!seen) {
    await db.prepare("INSERT OR IGNORE INTO stripe_events (id, type, livemode, received_at) VALUES (?, ?, ?, ?)")
      .bind(eventId, String(event.type), event.livemode ? 1 : 0, now.toISOString()).run();
  }

  let outcome = "nothing to sync";
  const obj = event.data?.object;
  // A completed checkout links the Stripe customer to the family that started it (family id was set server-side).
  if (obj?.object === "checkout.session" && obj.mode === "subscription") {
    const familyId = obj.metadata?.family_id || obj.client_reference_id;
    const customer = idOf(obj.customer);
    if (familyId && customer) {
      await db.prepare("UPDATE families SET stripe_customer_id = ? WHERE id = ? AND stripe_customer_id IS NULL").bind(customer, familyId).run();
    }
  }
  const subId = subscriptionIdFromEvent(event);
  if (subId) outcome = await syncSubscription(db, cfg, subId, fetchImpl, now);

  // Only a genuine completed checkout (or its delayed-payment success) sends the
  // first-membership email. A redirect alone never sends it. The event is marked
  // processed AFTER delivery, so a transient email failure can be retried by Stripe.
  const isCompletedCheckout = event.type === "checkout.session.completed"
    && obj?.object === "checkout.session"
    && obj?.payment_status !== "unpaid";
  const isAsyncPaid = event.type === "checkout.session.async_payment_succeeded"
    && obj?.object === "checkout.session";
  // The owner alert is stricter than member confirmation: a verified checkout
  // must show an actual positive payment, not a card-free preview, zero-dollar
  // coupon, unpaid checkout or a subscription renewal invoice.
  const paidCheckout = (isCompletedCheckout || isAsyncPaid)
    && obj?.mode === "subscription"
    && obj?.payment_status === "paid"
    && Number(obj?.amount_total) > 0;
  if ((notifyMembership || notifyOwner) && subId && (isCompletedCheckout || isAsyncPaid) && outcome.startsWith("synced ")) {
    const row = await db.prepare(
      "SELECT id, plan, billing_interval, plan_period_end, stripe_subscription_id, subscription_status FROM families WHERE stripe_subscription_id = ?"
    ).bind(subId).first<{
      id: string; plan: string; billing_interval: string | null;
      plan_period_end: string | null; stripe_subscription_id: string;
      subscription_status: string | null;
    }>();
    if (row && ACTIVE_PLANS.includes(row.plan as Plan) && row.subscription_status === "active"
      && row.plan_period_end && INTERVALS.includes(row.billing_interval as Interval)) {
      const info: MembershipActivatedInfo = {
        familyId: row.id, subscriptionId: subId,
        interval: row.billing_interval as Interval, periodEnd: row.plan_period_end,
      };
      // Keep the existing customer confirmation independent and higher priority.
      if (notifyMembership) await notifyMembership(info);
      if (notifyOwner && cfg.mode === "live" && paidCheckout) {
        try {
          await notifyOwner(info);
        } catch (error) {
          // A celebration email must never interrupt a paid family's activation,
          // or cause duplicate customer confirmations through webhook retries.
          console.error("owner new-member alert failed", error instanceof Error ? error.message : "unknown error");
        }
      }
    }
  }

  await db.prepare("UPDATE stripe_events SET processed_at = ?, outcome = ? WHERE id = ?").bind(now.toISOString(), outcome.slice(0, 300), eventId).run();
  return outcome;
}

// ---------------------------------------------------------------- summary for the upgrade page

export async function billingSummary(db: DB, env: Env, familyId: string) {
  const cfg = billingConfig(env);
  let row: any = null;
  try {
    row = await db
      .prepare("SELECT billing_interval, subscription_status, cancel_at_period_end, stripe_customer_id FROM families WHERE id = ?")
      .bind(familyId)
      .first<any>();
  } catch {
    row = null; // migration 0053 not applied yet
  }
  return {
    enabled: cfg.ok,
    mode: cfg.ok ? cfg.mode : null,
    options: cfg.ok
      ? INTERVALS.filter((i) => cfg.prices[i]).map((i) => {
          const p = cfg.prices[i]!;
          return { interval: i, label: p.label, amount_cents: p.amount_cents, currency: "AUD", every: p.every };
        })
      : [],
    interval: row?.billing_interval ?? null,
    subscription_status: row?.subscription_status ?? null,
    cancel_at_period_end: !!row?.cancel_at_period_end,
    can_manage: cfg.ok && !!row?.stripe_customer_id,
  };
}

// ---------------------------------------------------------------- routes

function appOrigin(env: Env, reqUrl: string): string {
  const configured = (env.APP_URL || "").replace(/\/+$/, "");
  return /^https:\/\//.test(configured) ? configured : new URL(reqUrl).origin;
}

export function registerBilling(app: App, { auth, parent }: Guards, fetchImpl?: Fetch) {
  const notConfigured = (reason: string) => ({ detail: "Membership checkout is not available yet.", code: "BILLING_NOT_CONFIGURED", reason });

  // Read-only validation before checkout: never creates a payment, reserves a code,
  // or trusts a browser-calculated discount. Stripe remains final at checkout.
  app.get("/api/billing/discount-preview", auth, parent, async (c) => {
    const code = (c.req.query("code") || "").trim().toUpperCase();
    if (!code || code.length > 24) return c.json({ valid: false, message: "Enter a Dragon's Hoard code." }, 400);
    try {
      c.header("Cache-Control", "no-store");
      return c.json(await previewHoardDiscount(c.env.DB, c.env, code, fetchImpl));
    } catch {
      return c.json({ valid: false, message: "We couldn't check this code right now. Try again shortly." }, 503);
    }
  });

  // Start a subscription. Body: { interval: "weekly" | "fortnightly" | "monthly" | "yearly", promo_code?: string }.
  // Promotion IDs come exclusively from active, mode-scoped Dragon\u2019s Hoard records on the server.
  app.post("/api/billing/checkout", auth, parent, async (c) => {
    const cfg = billingConfig(c.env);
    if (!cfg.ok) return c.json(notConfigured(cfg.reason), 503);
    const body = await c.req.json().catch(() => ({}));
    const interval = String((body as any)?.interval || "") as Interval;
    const price = INTERVALS.includes(interval) ? cfg.prices[interval] : undefined;
    if (!price) return c.json({ detail: "Choose weekly, fortnightly, monthly or yearly." }, 400);
    const incomingCode = (body as any)?.promo_code;
    if (incomingCode != null && (typeof incomingCode !== "string" || incomingCode.length > 24)) {
      return c.json({ detail: "Enter a valid Dragon\u2019s Hoard code." }, 400);
    }
    const promoCode = typeof incomingCode === "string" ? incomingCode.trim().toUpperCase() : "";

    const u = c.get("user");
    const fam = await c.env.DB.prepare("SELECT id, plan, stripe_customer_id, subscription_status FROM families WHERE id = ?").bind(u.family_id).first<any>();
    if (!fam) return c.json({ detail: "Family not found" }, 404);
    if (fam.plan === "INTERNAL") {
      return c.json({ detail: "This early-access family already has full access. Use a separate test family to try checkout.", code: "INTERNAL_FAMILY" }, 409);
    }
    if (GRANT_STATES.has(String(fam.subscription_status || "")) || ACTIVE_PLANS.includes(fam.plan)) {
      return c.json({ detail: "You already have a Family Membership. Use Manage billing to change or cancel it.", code: "ALREADY_SUBSCRIBED" }, 409);
    }

    let promotionId: string | null = null;
    if (promoCode) {
      promotionId = await resolveHoardDiscount(c.env.DB, cfg.mode, promoCode);
      if (!promotionId) return c.json({ detail: "This Dragon\u2019s Hoard code is invalid, inactive or expired." }, 400);
    }

    try {
      let customer: string | null = fam.stripe_customer_id;
      if (customer && cfg.mode === "live") {
        // A production family may retain a sandbox customer id after switching Stripe modes.
        // Confirm it exists in this live account before reusing it; other Stripe errors fail closed.
        try {
          const existing = await stripeCall(cfg.key, "GET", `customers/${encodeURIComponent(customer)}`, {}, { fetchImpl });
          if (existing?.deleted || (existing?.metadata?.family_id && existing.metadata.family_id !== u.family_id)) {
            throw new Error("Stripe customer is deleted or belongs to a different family");
          }
        } catch (err) {
          if (!(err instanceof StripeError) || err.status !== 404) throw err;
          customer = null;
        }
      }
      if (!customer) {
        const parentRow = await c.env.DB.prepare("SELECT email, name FROM users WHERE id = ?").bind(u.id).first<{ email: string; name: string }>();
        const created = await stripeCall(cfg.key, "POST", "customers", {
          email: parentRow?.email,
          name: parentRow?.name,
          metadata: { family_id: u.family_id },
        }, { idempotencyKey: `sq-customer-${cfg.mode}-${u.family_id}`, fetchImpl });
        // Atomic compare-and-swap protects concurrent checkout attempts and other family records.
        // Only replace a stale id when Stripe confirmed it does not exist in live mode.
        await c.env.DB.prepare("UPDATE families SET stripe_customer_id = ? WHERE id = ? AND (stripe_customer_id IS ? OR stripe_customer_id = ?)")
          .bind(created.id, u.family_id, fam.stripe_customer_id, fam.stripe_customer_id).run();
        const again = await c.env.DB.prepare("SELECT stripe_customer_id FROM families WHERE id = ?").bind(u.family_id).first<{ stripe_customer_id: string }>();
        customer = again?.stripe_customer_id || created.id;
      }
      // Stripe is the source of truth: the webhook for an earlier purchase may not have arrived yet.
      const existingSubs = await stripeCall(cfg.key, "GET", "subscriptions", { customer, status: "all", limit: 100 }, { fetchImpl });
      if ((existingSubs?.data || []).some((s: any) => LIVE_SUB_STATES.has(String(s?.status || "")))) {
        return c.json({ detail: "You already have a Family Membership. Use Manage billing to change or cancel it.", code: "ALREADY_SUBSCRIBED" }, 409);
      }
      // Only one checkout should be payable at a time. Reuse an open page for the same choice (a double
      // click) and close the rest (another tab or plan). Best effort: a failure here never blocks checkout.
      const promoKey = promotionId ?? "none";
      try {
        const open = await stripeCall(cfg.key, "GET", "checkout/sessions", { customer, status: "open", limit: 100 }, { fetchImpl });
        for (const s of open?.data || []) {
          if (!s?.id) continue;
          if (s.url && s.metadata?.interval === interval && s.metadata?.promo === promoKey) return c.json({ url: s.url });
          await stripeCall(cfg.key, "POST", `checkout/sessions/${encodeURIComponent(s.id)}/expire`, {}, { fetchImpl });
        }
      } catch (e: any) {
        console.error("billing checkout: could not close earlier checkout pages", e?.message);
      }
      const origin = appOrigin(c.env, c.req.url);
      const session = await stripeCall(cfg.key, "POST", "checkout/sessions", {
        mode: "subscription",
        customer,
        client_reference_id: u.family_id,
        line_items: [{ price: price.price, quantity: 1 }],
        // Only owner-issued Hoard offers are eligible, while Stripe enforces actual redemption limits.
        ...(promotionId ? { discounts: [{ promotion_code: promotionId }] } : {}),
        metadata: { family_id: u.family_id, interval, promo: promoKey },
        subscription_data: { metadata: { family_id: u.family_id, interval } },
        success_url: `${origin}/parent/plan?checkout=success`,
        cancel_url: `${origin}/parent/plan?checkout=cancelled`,
      }, { idempotencyKey: `sq-checkout-${u.family_id}-${interval}-${promotionId ?? "none"}-${Math.floor(Date.now() / 60000)}`, fetchImpl });
      return c.json({ url: session.url });
    } catch (e: any) {
      console.error("billing checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  // Stripe Customer Portal: update card, view invoices, cancel (configured in Stripe to cancel at period end).
  app.post("/api/billing/portal", auth, parent, async (c) => {
    const cfg = billingConfig(c.env);
    if (!cfg.ok) return c.json(notConfigured(cfg.reason), 503);
    const fam = await c.env.DB.prepare("SELECT stripe_customer_id FROM families WHERE id = ?").bind(c.get("user").family_id).first<{ stripe_customer_id: string | null }>();
    if (!fam?.stripe_customer_id) return c.json({ detail: "There is no billing account for this family yet." }, 404);
    try {
      const session = await stripeCall(cfg.key, "POST", "billing_portal/sessions", {
        customer: fam.stripe_customer_id,
        return_url: `${appOrigin(c.env, c.req.url)}/parent/plan`,
      }, { fetchImpl });
      return c.json({ url: session.url });
    } catch (e: any) {
      console.error("billing portal failed", e?.message);
      return c.json({ detail: "Could not open billing. Please try again." }, 502);
    }
  });

  // Stripe webhook. No session auth: the signature is the authentication.
  app.post("/api/billing/webhook", async (c) => {
    const secret = c.env.STRIPE_WEBHOOK_SECRET;
    const cfg = billingConfig(c.env);
    if (!secret || !cfg.ok) return c.json({ detail: "Billing webhook not configured" }, 503);
    const raw = await c.req.text();
    if (!(await verifyStripeSignature(raw, c.req.header("stripe-signature"), secret))) {
      return c.json({ detail: "Invalid signature" }, 400);
    }
    let event: any;
    try {
      event = JSON.parse(raw);
    } catch {
      return c.json({ detail: "Invalid payload" }, 400);
    }
    try {
      const outcome = await handleEvent(c.env.DB, cfg, event, fetchImpl, new Date(), async ({ familyId, interval, periodEnd }) => {
        const owner = await c.env.DB.prepare(
          "SELECT email, name FROM users WHERE family_id = ? AND is_owner = 1 LIMIT 1"
        ).bind(familyId).first<{ email: string; name: string }>();
        if (!owner?.email) throw new Error("Membership confirmation: no parent email for family");
        const price = cfg.prices[interval];
        if (!price) throw new Error("Membership confirmation: unknown billing interval");
        const sent = await sendEmail(c.env, membershipActivatedEmail(owner.email, owner.name, {
          interval, amountCents: price.amount_cents, nextBillingAt: periodEnd,
          testMode: cfg.mode === "test",
        }));
        if (!sent) throw new Error("Membership confirmation delivery failed; Stripe will retry");
      }, async ({ familyId, subscriptionId, interval }) => {
        const price = cfg.prices[interval];
        if (!price) return;
        const result = await sendOwnerNewMemberAlert(c.env.DB, c.env, cfg.mode, {
          familyId, subscriptionId, interval, amountCents: price.amount_cents,
        });
        if (result === "failed") console.warn("owner new-member alert is pending; membership remains active");
      });
      console.log("stripe webhook", event.type, event.id, outcome);
      return c.json({ received: true });
    } catch (e: any) {
      console.error("stripe webhook failed", event?.type, event?.id, e?.message);
      return c.json({ detail: "Processing failed; Stripe will retry" }, 500);
    }
  });
}

// ---------------------------------------------------------------- account deletion guard

export type DeletionBlock = { status: 409 | 503; detail: string; code: string };

const NOT_RENEWING = new Set(["canceled", "incomplete_expired"]);
const renews = (s: any) => !NOT_RENEWING.has(String(s?.status || "")) && !(s?.cancel_at_period_end || s?.cancel_at);

/**
 * Erasing a family must never leave a Stripe subscription that keeps charging a card nobody can
 * manage any more. Asks Stripe for the customer's subscriptions; fails closed when Stripe can't answer.
 * Returns null when deletion may go ahead.
 */
export async function deletionBillingBlock(db: DB, env: Env, familyId: string, fetchImpl?: Fetch): Promise<DeletionBlock | null> {
  let row: { stripe_customer_id: string | null; subscription_status: string | null; cancel_at_period_end: number | null } | null = null;
  try {
    row = await db.prepare("SELECT stripe_customer_id, subscription_status, cancel_at_period_end FROM families WHERE id = ?")
      .bind(familyId).first<any>();
  } catch {
    return null; // billing columns (migration 0053) not applied: no Stripe customer can exist
  }
  if (!row?.stripe_customer_id) return null;
  const renewing: DeletionBlock = {
    status: 409,
    code: "SUBSCRIPTION_RENEWING",
    detail: "Your Family Membership is still set to renew. Cancel it in Manage billing first (you keep access until the paid period ends), then delete your account.",
  };
  const localRenews = () => renews({ status: row!.subscription_status || "canceled", cancel_at_period_end: row!.cancel_at_period_end });
  const cfg = billingConfig(env);
  if (!cfg.ok) return localRenews() ? renewing : null;
  try {
    const list = await stripeCall(cfg.key, "GET", "subscriptions", { customer: row.stripe_customer_id, status: "all", limit: 100 }, { fetchImpl });
    return (list?.data || []).some(renews) ? renewing : null;
  } catch (e) {
    // A customer id from the other Stripe mode doesn't exist here; fall back to what the webhook recorded.
    if (e instanceof StripeError && e.status === 404) return localRenews() ? renewing : null;
    return { status: 503, code: "BILLING_UNAVAILABLE", detail: "We couldn't check your membership with our payment provider, so nothing was deleted. Please try again shortly." };
  }
}
