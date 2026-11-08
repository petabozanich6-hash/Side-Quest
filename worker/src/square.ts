// Square payments: hosted checkout (Payment Links) and signed webhooks.
//
// Security model (same as Stripe's):
// - The browser never sends prices. Carts are priced on the server, saved, and only their id goes to Square.
// - Buyers pay on Square's own hosted page; card details never touch Side-Quest.
// - Purchases are granted ONLY when Square's signed webhook says a payment COMPLETED, and the paid amount is
//   checked against the saved cart. The redirect back to the site grants nothing.
//
// Configuration (Cloudflare):
//   SQUARE_ACCESS_TOKEN           secret  (Production or Sandbox access token)
//   SQUARE_WEBHOOK_SIGNATURE_KEY  secret  (from the webhook subscription in the Square Developer Console)
//   SQUARE_APPLICATION_ID         var     (sq0idp-... production, sandbox-sq0idb-... sandbox)
//   SQUARE_LOCATION_ID            var
//   SQUARE_WEBHOOK_URL            var, optional (the exact URL registered with Square; defaults to the request URL)
import { recordPaidCart } from "./questBookPurchases";
import { linkMembershipPayment, syncSquareSubscription, markPastDue, type ActivatedInfo } from "./squareMembership";
import type { App, Env } from "./types";
import { LIVE_PRICE_DETAILS } from "./billing";
import { membershipActivatedEmail, sendEmail } from "./email";
import { sendOwnerNewMemberAlert } from "./ownerNotifications";

type DB = D1Database;
export type Fetch = (input: any, init?: any) => Promise<Response>;
export const SQUARE_VERSION = "2024-10-17";

export type SquareConfig =
  | { ok: true; token: string; locationId: string; applicationId: string; production: boolean; base: string }
  | { ok: false; reason: string };

export function squareConfig(env: Partial<Env>): SquareConfig {
  const token = (env as any).SQUARE_ACCESS_TOKEN || "";
  const locationId = (env as any).SQUARE_LOCATION_ID || "";
  const applicationId = (env as any).SQUARE_APPLICATION_ID || "";
  if (!token) return { ok: false, reason: "SQUARE_ACCESS_TOKEN is not set" };
  if (!/^[A-Z0-9]{8,32}$/.test(locationId)) return { ok: false, reason: "SQUARE_LOCATION_ID is not set" };
  const sandbox = /^sandbox-/.test(applicationId);
  if (!sandbox && !/^sq0idp-/.test(applicationId)) return { ok: false, reason: "SQUARE_APPLICATION_ID is not set" };
  // Without the signature key a paid order could never be confirmed, so Square stays off until both are set.
  if (!(env as any).SQUARE_WEBHOOK_SIGNATURE_KEY) return { ok: false, reason: "SQUARE_WEBHOOK_SIGNATURE_KEY is not set" };
  return { ok: true, token, locationId, applicationId, production: !sandbox, base: sandbox ? "https://connect.squareupsandbox.com/v2" : "https://connect.squareup.com/v2" };
}

export class SquareError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function squareCall(cfg: Extract<SquareConfig, { ok: true }>, method: "GET" | "POST", path: string, body?: unknown, fetchImpl?: Fetch): Promise<any> {
  const res = await (fetchImpl || fetch)(`${cfg.base}/${path}`, {
    method,
    headers: { Authorization: `Bearer ${cfg.token}`, "Square-Version": SQUARE_VERSION, "Content-Type": "application/json", Accept: "application/json" },
    body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new SquareError(res.status, json?.errors?.[0]?.detail || `Square ${method} ${path} failed (${res.status})`);
  return json;
}

// ---------------------------------------------------------------- webhook signature

const enc = new TextEncoder();
/** Square signs base64(HMAC-SHA256(signatureKey, notificationUrl + rawBody)). Constant-time compare. */
export async function verifySquareSignature(rawBody: string, header: string | undefined | null, signatureKey: string, notificationUrl: string): Promise<boolean> {
  if (!header || !signatureKey) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(signatureKey), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(notificationUrl + rawBody)));
  let bin = "";
  for (const b of mac) bin += String.fromCharCode(b);
  const expected = btoa(bin);
  if (expected.length !== header.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ header.charCodeAt(i);
  return diff === 0;
}

// ---------------------------------------------------------------- checkout

export type SquareLine = { name: string; amount_cents: number; note?: string };

/** One hosted Square checkout for a saved, server-priced cart. Returns the URL to send the parent to. */
export async function createCartPaymentLink(cfg: Extract<SquareConfig, { ok: true }>, opts: {
  cartId: string; familyId: string; lines: SquareLine[]; redirectUrl: string; email?: string | null; fetchImpl?: Fetch;
}): Promise<string> {
  const r = await squareCall(cfg, "POST", "online-checkout/payment-links", {
    idempotency_key: `cart-${opts.cartId}`,
    order: {
      location_id: cfg.locationId,
      reference_id: opts.cartId,
      metadata: { kind: "quest_cart", family_id: opts.familyId, cart_id: opts.cartId },
      line_items: opts.lines.map((l) => ({
        name: l.name.slice(0, 500), quantity: "1",
        base_price_money: { amount: Math.round(l.amount_cents), currency: "AUD" },
        ...(l.note ? { note: l.note.slice(0, 500) } : {}),
      })),
    },
    checkout_options: { redirect_url: opts.redirectUrl, ask_for_shipping_address: false, allow_tipping: false },
    ...(opts.email ? { pre_populated_data: { buyer_email: opts.email } } : {}),
  }, opts.fetchImpl);
  const url = r?.payment_link?.url;
  if (!url) throw new SquareError(502, "Square did not return a checkout link");
  return url;
}

// ---------------------------------------------------------------- webhook handling

const CREATE_EVENTS = `CREATE TABLE IF NOT EXISTS square_events (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, received_at TEXT NOT NULL, processed_at TEXT, outcome TEXT)`;
const ensured = new WeakMap<object, Promise<void>>();
function ensureEvents(db: DB) {
  let p = ensured.get(db);
  if (!p) {
    const made: Promise<void> = db.prepare(CREATE_EVENTS).run().then(() => undefined).catch((e) => { ensured.delete(db); throw e; });
    ensured.set(db, made);
    p = made;
  }
  return p;
}

/**
 * Applies one verified Square event. A completed payment is matched to its order; the order (created by us) carries
 * the cart id and family id. The amount actually paid must equal the saved cart total.
 */
export async function handleSquareEvent(db: DB, cfg: Extract<SquareConfig, { ok: true }>, event: any, fetchImpl?: Fetch, now: Date = new Date(), onActivated?: (i: ActivatedInfo) => Promise<void>): Promise<string> {
  const type = String(event?.type || "");
  const obj = event?.data?.object || {};
  if (type === "subscription.created" || type === "subscription.updated") {
    const id = String(obj.subscription?.id || event?.data?.id || "");
    return id ? syncSquareSubscription(db, cfg, id, fetchImpl, now, onActivated) : "subscription event without id";
  }
  if (type === "invoice.payment_made") {
    const id = String(obj.invoice?.subscription_id || "");
    return id ? syncSquareSubscription(db, cfg, id, fetchImpl, now, onActivated) : "invoice without subscription";
  }
  if (type === "invoice.scheduled_charge_failed") {
    const id = String(obj.invoice?.subscription_id || "");
    return id ? markPastDue(db, id, now) : "invoice without subscription";
  }
  if (type !== "payment.created" && type !== "payment.updated") return `ignored ${type}`;
  const payment = event?.data?.object?.payment;
  if (!payment?.id || !payment?.order_id) return "payment without order";
  if (payment.location_id && payment.location_id !== cfg.locationId) return "payment for another location";
  if (payment.status !== "COMPLETED") return `payment ${payment.status || "unknown"}`;
  // Re-read both from Square rather than trusting the event body alone.
  const fresh = (await squareCall(cfg, "GET", `payments/${encodeURIComponent(payment.id)}`, undefined, fetchImpl))?.payment;
  if (!fresh || fresh.status !== "COMPLETED") return "payment not completed";
  const order = (await squareCall(cfg, "GET", `orders/${encodeURIComponent(fresh.order_id)}`, undefined, fetchImpl))?.order;
  if (!order || order.location_id !== cfg.locationId) return "order not found for this location";
  const meta = order.metadata || {};
  if (meta.kind !== "quest_cart") {
    // A membership checkout's first payment (orders we remember by id in square_checkouts).
    return (await linkMembershipPayment(db, cfg, fresh, fetchImpl, now, onActivated)) ?? `ignored order ${order.id}`;
  }
  const cartId = String(order.reference_id || meta.cart_id || "");
  const familyId = String(meta.family_id || "");
  if (!cartId || !familyId) return "order missing cart";
  const paid = Number(fresh.amount_money?.amount);
  if (String(fresh.amount_money?.currency || "AUD") !== "AUD") return "unexpected currency";
  return recordPaidCart(db, familyId, cartId, `sq_${fresh.id}`, "aud", cfg.production, now, paid);
}

/** New member: confirmation email to the parent and (live only) the owner alert. Never blocks activation. */
async function notifyActivated(env: Env, info: ActivatedInfo, live: boolean) {
  try {
    const owner = await env.DB.prepare("SELECT email, name FROM users WHERE family_id = ? AND is_owner = 1 LIMIT 1").bind(info.familyId).first<{ email: string; name: string }>();
    const price = LIVE_PRICE_DETAILS[info.interval];
    if (owner?.email) await sendEmail(env, membershipActivatedEmail(owner.email, owner.name, { interval: info.interval, amountCents: price.amount_cents, nextBillingAt: info.periodEnd, testMode: !live }));
    await sendOwnerNewMemberAlert(env.DB, env, live ? "live" : "test", { familyId: info.familyId, subscriptionId: info.subscriptionId, interval: info.interval, amountCents: price.amount_cents });
  } catch (e: any) {
    console.error("square membership notification failed", e?.message);
  }
}

export function registerSquare(app: App) {
  app.post("/api/billing/square-webhook", async (c) => {
    const cfg = squareConfig(c.env);
    const key = (c.env as any).SQUARE_WEBHOOK_SIGNATURE_KEY || "";
    if (!cfg.ok || !key) return c.json({ detail: "Square webhook not configured" }, 503);
    const raw = await c.req.text();
    const url = (c.env as any).SQUARE_WEBHOOK_URL || c.req.url;
    if (!(await verifySquareSignature(raw, c.req.header("x-square-hmacsha256-signature"), key, url))) {
      return c.json({ detail: "Invalid signature" }, 400);
    }
    let event: any;
    try { event = JSON.parse(raw); } catch { return c.json({ detail: "Invalid payload" }, 400); }
    const id = String(event?.event_id || "");
    if (!id) return c.json({ detail: "Missing event id" }, 400);
    await ensureEvents(c.env.DB);
    const seen = await c.env.DB.prepare("SELECT processed_at FROM square_events WHERE id = ?").bind(id).first<{ processed_at: string | null }>();
    if (seen?.processed_at) return c.json({ received: true, duplicate: true });
    await c.env.DB.prepare("INSERT OR IGNORE INTO square_events (id, type, received_at) VALUES (?, ?, ?)").bind(id, String(event.type || ""), new Date().toISOString()).run();
    try {
      const outcome = await handleSquareEvent(c.env.DB, cfg, event, undefined, new Date(), (info) => notifyActivated(c.env, info, cfg.production));
      await c.env.DB.prepare("UPDATE square_events SET processed_at = ?, outcome = ? WHERE id = ?").bind(new Date().toISOString(), outcome.slice(0, 300), id).run();
      console.log("square webhook", event.type, id, outcome);
      return c.json({ received: true });
    } catch (e: any) {
      console.error("square webhook failed", event?.type, id, e?.message);
      return c.json({ detail: "Processing failed; Square will retry" }, 500);
    }
  });
}
