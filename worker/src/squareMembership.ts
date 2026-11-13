// Family Membership on Square: access granted only from Square's signed webhooks (payments, subscriptions,
// invoices), re-read from Square each time.
//
// - New members buy in the Square Online shop; squareShopMembership.ts links them to a parent account.
// - Families who joined through the app's old Square checkout are remembered in square_checkouts / square_plans
//   and keep being synced the same way.
// - families keeps the provider-neutral state the rest of the app reads (plan, plan_period_end, billing_interval,
//   subscription_status, cancel_at_period_end). The Square subscription id is kept as "sq:<id>" in
//   stripe_subscription_id so the owner new-member alert and the summary work unchanged.
import { ACTIVE_PLANS, PAST_DUE_GRACE_DAYS, type Plan } from "./entitlements";
import { INTERVALS, LIVE_PRICE_DETAILS, PLAN_FOR_INTERVAL, type Interval } from "./billing";
import { squareCall, type SquareConfig, type Fetch } from "./square";

type DB = D1Database;
type Cfg = Extract<SquareConfig, { ok: true }>;
const DAY_MS = 86400000;


const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS square_plans (key TEXT PRIMARY KEY, variation_id TEXT NOT NULL UNIQUE, interval TEXT NOT NULL, offer_id TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS square_members (family_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, subscription_id TEXT, interval TEXT, status TEXT, charged_through TEXT, canceled_date TEXT, updated_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_square_members_customer ON square_members (customer_id)`,
  `CREATE TABLE IF NOT EXISTS square_checkouts (order_id TEXT PRIMARY KEY, family_id TEXT NOT NULL, interval TEXT NOT NULL, offer_id TEXT, created_at TEXT NOT NULL, paid_at TEXT)`,
];
const ready = new WeakMap<object, Promise<void>>();
export function ensureSquareMembership(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = (async () => { for (const q of SCHEMA) await db.prepare(q).run(); })().catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

export const membershipOptions = () => INTERVALS.map((i) => ({ interval: i, label: LIVE_PRICE_DETAILS[i].label, amount_cents: LIVE_PRICE_DETAILS[i].amount_cents, currency: "AUD", every: LIVE_PRICE_DETAILS[i].every }));

// ---------------------------------------------------------------- promo codes (Dragon's Hoard)

// New memberships are bought in the Square Online shop (squareShopMembership.ts). The app no longer creates
// checkouts, plans or discounts; it only keeps existing members in step with Square.

const endOfDate = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + 2 * DAY_MS - 1000).toISOString();

export type ActivatedInfo = { familyId: string; subscriptionId: string; interval: Interval; periodEnd: string };

/** Re-reads one subscription from Square and applies it to its family. Returns an outcome string. */
/** Hooks for memberships bought in the Square Online shop, where the app did not create the checkout. */
export type ShopMembershipHooks = {
  intervalFor: (variationId: string) => Promise<Interval | null>;
  linkCustomer: (customerId: string) => Promise<{ familyId: string; created: boolean } | null>;
};

export async function syncSquareSubscription(db: DB, cfg: Cfg, subscriptionId: string, fetchImpl?: Fetch, now: Date = new Date(), onActivated?: (i: ActivatedInfo) => Promise<void>, shopHooks?: ShopMembershipHooks): Promise<string> {
  await ensureSquareMembership(db);
  const sub = (await squareCall(cfg, "GET", `subscriptions/${encodeURIComponent(subscriptionId)}`, undefined, fetchImpl))?.subscription;
  if (!sub?.id || sub.location_id !== cfg.locationId) return `subscription ${subscriptionId} not for this location`;
  const variationId = String(sub.plan_variation_id || "");
  const planRow = await db.prepare("SELECT interval FROM square_plans WHERE variation_id = ?").bind(variationId).first<{ interval: string }>();
  let interval = (planRow && INTERVALS.includes(planRow.interval as Interval) ? planRow.interval : null) as Interval | null;
  // Not one of the app's own checkout plans: it may be a Family Membership sold in the Square Online shop.
  if (!interval && shopHooks) interval = await shopHooks.intervalFor(variationId);
  if (!interval) return `unknown plan for ${subscriptionId}`;
  let member = await db.prepare("SELECT family_id FROM square_members WHERE customer_id = ?").bind(String(sub.customer_id || "")).first<{ family_id: string }>();
  if (!member && shopHooks && !planRow) {
    const linked = await shopHooks.linkCustomer(String(sub.customer_id || ""));
    if (linked) member = { family_id: linked.familyId };
  }
  if (!member) return `no family yet for customer of ${subscriptionId}`;
  const fam = await db.prepare("SELECT plan FROM families WHERE id = ?").bind(member.family_id).first<{ plan: string }>();
  if (!fam) return "family gone";
  const status = String(sub.status || "");
  const through = sub.charged_through_date ? endOfDate(sub.charged_through_date) : null;
  const ts = now.toISOString();
  await db.prepare("UPDATE square_members SET subscription_id = ?, interval = ?, status = ?, charged_through = ?, canceled_date = ?, updated_at = ? WHERE family_id = ?")
    .bind(sub.id, interval, status, sub.charged_through_date || null, sub.canceled_date || null, ts, member.family_id).run();
  let plan: Plan | null = null;
  let end: string | null = null;
  if (status === "ACTIVE") { plan = PLAN_FOR_INTERVAL[interval]; end = through || new Date(now.getTime() + 7 * DAY_MS).toISOString(); }
  else if (status === "CANCELED" || status === "DEACTIVATED") { plan = "CANCELLED"; end = through && through < ts ? through : ts; }
  else if (status === "PAUSED") { plan = "CANCELLED"; end = ts; }
  const wasActive = ACTIVE_PLANS.includes(fam.plan as Plan);
  const fields: Record<string, string | number | null> = {
    stripe_subscription_id: `sq:${sub.id}`, billing_interval: interval,
    subscription_status: status === "ACTIVE" ? "active" : status === "PENDING" ? "incomplete" : "canceled",
    cancel_at_period_end: sub.canceled_date ? 1 : 0, billing_updated_at: ts,
    ...(plan && fam.plan !== "INTERNAL" ? { plan, plan_period_end: end } : {}),
  };
  const keys = Object.keys(fields);
  await db.prepare(`UPDATE families SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).bind(...keys.map((k) => fields[k]), member.family_id).run();
  if (plan && ACTIVE_PLANS.includes(plan) && !wasActive && onActivated) await onActivated({ familyId: member.family_id, subscriptionId: `sq:${sub.id}`, interval, periodEnd: end! });
  return `synced square ${sub.id} -> ${plan ?? fam.plan} (${status})`;
}

/** A completed first payment for a membership checkout: link the Square customer to the family, then sync. */
export async function linkMembershipPayment(db: DB, cfg: Cfg, payment: any, fetchImpl?: Fetch, now: Date = new Date(), onActivated?: (i: ActivatedInfo) => Promise<void>): Promise<string | null> {
  await ensureSquareMembership(db);
  const co = await db.prepare("SELECT family_id, interval FROM square_checkouts WHERE order_id = ?").bind(String(payment.order_id || "")).first<{ family_id: string; interval: string }>();
  if (!co) return null; // not a membership checkout
  const customer = String(payment.customer_id || "");
  if (!customer) return "membership payment without a customer";
  const ts = now.toISOString();
  await db.prepare(`INSERT INTO square_members (family_id, customer_id, updated_at) VALUES (?, ?, ?)
    ON CONFLICT(family_id) DO UPDATE SET customer_id = excluded.customer_id, updated_at = excluded.updated_at`).bind(co.family_id, customer, ts).run();
  await db.prepare("UPDATE square_checkouts SET paid_at = COALESCE(paid_at, ?) WHERE order_id = ?").bind(ts, String(payment.order_id)).run();
  const found = await squareCall(cfg, "POST", "subscriptions/search", { query: { filter: { customer_ids: [customer], location_ids: [cfg.locationId] } } }, fetchImpl);
  const subs: any[] = found?.subscriptions || [];
  if (!subs.length) return `membership paid for ${co.family_id}; waiting for Square to create the subscription`;
  const out: string[] = [];
  for (const s of subs) out.push(await syncSquareSubscription(db, cfg, s.id, fetchImpl, now, onActivated));
  return out.join("; ");
}

/** A renewal charge failed: keep access for the grace period, flagged as past due. */
export async function markPastDue(db: DB, subscriptionId: string, now: Date = new Date()): Promise<string> {
  await ensureSquareMembership(db);
  const m = await db.prepare("SELECT family_id FROM square_members WHERE subscription_id = ?").bind(subscriptionId).first<{ family_id: string }>();
  if (!m) return "no family for failed charge";
  await db.prepare("UPDATE families SET plan = 'PAST_DUE', plan_period_end = ?, subscription_status = 'past_due', billing_updated_at = ? WHERE id = ? AND plan != 'INTERNAL'")
    .bind(new Date(now.getTime() + PAST_DUE_GRACE_DAYS * DAY_MS).toISOString(), now.toISOString(), m.family_id).run();
  return `past due ${m.family_id}`;
}

// ---------------------------------------------------------------- manage

export async function membershipFor(db: DB, familyId: string) {
  await ensureSquareMembership(db);
  return db.prepare("SELECT customer_id, subscription_id, interval, status, charged_through, canceled_date FROM square_members WHERE family_id = ?").bind(familyId).first<any>();
}

/** Cancels at the end of the paid period (Square keeps it active until then). */
export async function cancelMembership(db: DB, cfg: Cfg, familyId: string, fetchImpl?: Fetch): Promise<string> {
  const m = await membershipFor(db, familyId);
  if (!m?.subscription_id) throw new Error("No membership to cancel");
  await squareCall(cfg, "POST", `subscriptions/${encodeURIComponent(m.subscription_id)}/cancel`, {}, fetchImpl);
  return syncSquareSubscription(db, cfg, m.subscription_id, fetchImpl);
}

/** Undoes a scheduled cancel by deleting Square's pending CANCEL action. */
export async function keepMembership(db: DB, cfg: Cfg, familyId: string, fetchImpl?: Fetch): Promise<string> {
  const m = await membershipFor(db, familyId);
  if (!m?.subscription_id) throw new Error("No membership to keep");
  const r = await squareCall(cfg, "GET", `subscriptions/${encodeURIComponent(m.subscription_id)}?include=actions`, undefined, fetchImpl);
  const action = (r?.actions || []).find((a: any) => a?.type === "CANCEL");
  if (action?.id) await squareCall(cfg, "POST", `subscriptions/${encodeURIComponent(m.subscription_id)}/actions/${encodeURIComponent(action.id)}/delete`, {}, fetchImpl).catch(async () => {
    // Older API shape: DELETE /subscriptions/{id}/actions/{action_id}
    const res = await (fetchImpl || fetch)(`${cfg.base}/subscriptions/${encodeURIComponent(m.subscription_id)}/actions/${encodeURIComponent(action.id)}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${cfg.token}`, "Square-Version": "2024-10-17", Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Square could not undo the cancellation");
  });
  return syncSquareSubscription(db, cfg, m.subscription_id, fetchImpl);
}

/** Erasing a family must not leave a Square subscription charging a card. */
export async function squareRenewing(db: DB, familyId: string): Promise<boolean> {
  try {
    const m = await membershipFor(db, familyId);
    return !!m?.subscription_id && m.status === "ACTIVE" && !m.canceled_date;
  } catch { return false; }
}
