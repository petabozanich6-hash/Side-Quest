// Shop subscriptions (Dragon Post letters and Monthly Quest boxes) on Square, without a Side-Quest account.
// The buyer gives the recipient's name and postal address here (it may be a child, a grandchild or a gift),
// then pays on Square's hosted page. Access is managed with a private link (token stored only as a hash).
import { squareCall, type SquareConfig, type Fetch } from "./square";
import { hashToken } from "./shopOrders";
import { mailPaymentStatus, type ShopBillingCadence } from "./shopMailBilling";

type DB = D1Database;
type Cfg = Extract<SquareConfig, { ok: true }>;
const DAY_MS = 86400000;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS shop_subscriptions (
    id TEXT PRIMARY KEY, product_id TEXT NOT NULL, variant_id TEXT, title TEXT NOT NULL, email TEXT NOT NULL,
    recipient TEXT NOT NULL, personalisation TEXT NOT NULL DEFAULT '{}', price_cents INTEGER NOT NULL, order_id TEXT UNIQUE,
    customer_id TEXT, square_subscription_id TEXT, plan_variation_id TEXT, status TEXT NOT NULL DEFAULT 'pending',
    charged_through TEXT, token_hash TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
    billing_cadence TEXT NOT NULL DEFAULT 'monthly', monthly_price_cents INTEGER)`,
  `CREATE INDEX IF NOT EXISTS idx_shop_subs_square ON shop_subscriptions (square_subscription_id)`,
  `CREATE TABLE IF NOT EXISTS shop_square_plans (key TEXT PRIMARY KEY, catalog_id TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS shop_subscription_payments (subscription_id TEXT NOT NULL, invoice_id TEXT NOT NULL, paid_at TEXT NOT NULL, PRIMARY KEY(subscription_id,invoice_id))`,
  `CREATE TABLE IF NOT EXISTS shop_subscription_mailings (subscription_id TEXT NOT NULL, edition_month TEXT NOT NULL, mailed_at TEXT NOT NULL, tracking TEXT NOT NULL DEFAULT '', PRIMARY KEY(subscription_id,edition_month))`,
];
const ready = new WeakMap<object, Promise<void>>();
export function ensureShopSubscriptions(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = (async () => {
      for (const q of SCHEMA) await db.prepare(q).run();
      for (const column of ["billing_cadence TEXT NOT NULL DEFAULT 'monthly'", "monthly_price_cents INTEGER"]) {
        try { await db.prepare("ALTER TABLE shop_subscriptions ADD COLUMN " + column).run(); }
        catch(e:any){if(!/duplicate column name/i.test(String(e?.message||e)))throw e;}
      }
    })().catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

export type Recipient = { name: string; address_line_1: string; address_line_2?: string; locality: string; state: string; postcode: string; country: string };

export function validateRecipient(r: any): Recipient | string {
  const t = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\x00-\x1f\x7f<>]/g, " ").trim().slice(0, n) : "");
  const out = { name: t(r?.name, 80), address_line_1: t(r?.address_line_1, 120), address_line_2: t(r?.address_line_2, 120), locality: t(r?.locality, 60), state: t(r?.state, 20), postcode: t(r?.postcode, 10), country: t(r?.country, 40) || "Australia" };
  if (!out.name) return "Who are the letters or boxes for? Add the recipient's name.";
  if (!out.address_line_1 || !out.locality || !out.state || !out.postcode) return "Add the full postal address they'll be sent to.";
  return out;
}

async function catalogId(db: DB, key: string, make: () => Promise<string>): Promise<string> {
  const row = await db.prepare("SELECT catalog_id FROM shop_square_plans WHERE key = ?").bind(key).first<{ catalog_id: string }>();
  if (row) return row.catalog_id;
  const id = await make();
  await db.prepare("INSERT OR IGNORE INTO shop_square_plans (key, catalog_id, created_at) VALUES (?, ?, ?)").bind(key, id, new Date().toISOString()).run();
  return id;
}

/** A monthly Square plan variation for this product at this price (created the first time). */
export async function productPlanVariation(db: DB, cfg: Cfg, product: { id: string; title: string }, priceCents: number, cadence: ShopBillingCadence = "monthly", fetchImpl?: Fetch): Promise<string> {
  await ensureShopSubscriptions(db);
  const plan = await catalogId(db, `plan:${product.id}`, async () => {
    const r = await squareCall(cfg, "POST", "catalog/object", {
      idempotency_key: `shop-plan-${product.id}`,
      object: { type: "SUBSCRIPTION_PLAN", id: "#shop_plan", subscription_plan_data: { name: `Side-Quest: ${product.title}`.slice(0, 255) } },
    }, fetchImpl);
    if (!r?.catalog_object?.id) throw new Error("Square did not create the plan");
    return r.catalog_object.id;
  });
  return catalogId(db, `var:${product.id}:${cadence}:${priceCents}`, async () => {
    const r = await squareCall(cfg, "POST", "catalog/object", {
      idempotency_key: `shop-var-${product.id}-${cadence}-${priceCents}`,
      object: { type: "SUBSCRIPTION_PLAN_VARIATION", id: "#shop_var", subscription_plan_variation_data: {
        name: cadence === "fortnightly" ? "Fortnightly payments · monthly delivery" : "Monthly", subscription_plan_id: plan,
        phases: [{ ordinal: 0, cadence: cadence === "fortnightly" ? "EVERY_TWO_WEEKS" : "MONTHLY", pricing: { type: "STATIC", price_money: { amount: priceCents, currency: "AUD" } } }],
      } },
    }, fetchImpl);
    if (!r?.catalog_object?.id) throw new Error("Square did not create the plan variation");
    return r.catalog_object.id;
  });
}

const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

export async function startShopSubscription(db: DB, cfg: Cfg, opts: {
  product: { id: string; title: string }; variantId: string | null; variantName?: string; priceCents: number; email: string;
  recipient: Recipient; personalisation: Record<string, string>; origin: string; billingCadence: ShopBillingCadence; monthlyPriceCents: number; fetchImpl?: Fetch;
}): Promise<string> {
  await ensureShopSubscriptions(db);
  const variation = await productPlanVariation(db, cfg, opts.product, opts.priceCents, opts.billingCadence, opts.fetchImpl);
  const id = crypto.randomUUID();
  const token = hex(crypto.getRandomValues(new Uint8Array(24)));
  const title = opts.variantName ? `${opts.product.title} (${opts.variantName})` : opts.product.title;
  const r = await squareCall(cfg, "POST", "online-checkout/payment-links", {
    idempotency_key: `shop-sub-${id}`,
    quick_pay: { name: `Side-Quest: ${title}`.slice(0, 255), price_money: { amount: opts.priceCents, currency: "AUD" }, location_id: cfg.locationId },
    checkout_options: { subscription_plan_id: variation, redirect_url: `${opts.origin}/shop/subscription/${id}?t=${token}`, allow_tipping: false, ask_for_shipping_address: false },
    pre_populated_data: { buyer_email: opts.email },
  }, opts.fetchImpl);
  const url = r?.payment_link?.url;
  const orderId = r?.payment_link?.order_id;
  if (!url || !orderId) throw new Error("Square did not return a checkout link");
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO shop_subscriptions (id, product_id, variant_id, title, email, recipient, personalisation, price_cents, order_id, plan_variation_id, status, token_hash, created_at, updated_at, billing_cadence, monthly_price_cents)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`)
    .bind(id, opts.product.id, opts.variantId, title, opts.email, JSON.stringify(opts.recipient), JSON.stringify(opts.personalisation), opts.priceCents, orderId, variation, await hashToken(token), now, now, opts.billingCadence, opts.monthlyPriceCents).run();
  return url;
}

const STATUS: Record<string, string> = { ACTIVE: "active", PENDING: "pending", CANCELED: "cancelled", DEACTIVATED: "cancelled", PAUSED: "paused" };

/** Re-reads one Square subscription and applies it to the matching shop subscription (if it is one). */
export async function syncShopSubscription(db: DB, cfg: Cfg, squareSubId: string, fetchImpl?: Fetch, strictInvoiceVerification=false): Promise<string | null> {
  await ensureShopSubscriptions(db);
  const row = await db.prepare("SELECT id FROM shop_subscriptions WHERE square_subscription_id = ?").bind(squareSubId).first<{ id: string }>();
  if (!row) return null;
  const sub = (await squareCall(cfg, "GET", `subscriptions/${encodeURIComponent(squareSubId)}`, undefined, fetchImpl))?.subscription;
  if (!sub?.id) return "shop subscription not found at Square";
  const status = sub.canceled_date && sub.status === "ACTIVE" ? "cancelling" : STATUS[String(sub.status)] || "pending";
  await db.prepare("UPDATE shop_subscriptions SET status = ?, charged_through = ?, updated_at = ? WHERE id = ?").bind(status, sub.charged_through_date || null, new Date().toISOString(), row.id).run();
  // First-payment invoices can arrive before their subscription is linked.
  // Recheck Square's own PAID invoices whenever the subscription is synced;
  // this is also usable by the owner for older subscription records.
  try { await reconcileShopSubscriptionInvoices(db,cfg,row.id,sub,fetchImpl); }
  catch(e:any){if(strictInvoiceVerification)throw e;console.error("shop subscription paid invoice sync deferred",e?.message);}

  return `shop subscription ${row.id} ${status}`;
}

/** The first payment of a shop subscription checkout: link the customer and find the new Square subscription. */
export async function linkShopSubscriptionPayment(db: DB, cfg: Cfg, payment: any, fetchImpl?: Fetch): Promise<string | null> {
  await ensureShopSubscriptions(db);
  const row = await db.prepare("SELECT id, plan_variation_id FROM shop_subscriptions WHERE order_id = ?").bind(String(payment.order_id || "")).first<{ id: string; plan_variation_id: string }>();
  if (!row) return null;
  const customer = String(payment.customer_id || "");
  await db.prepare("UPDATE shop_subscriptions SET customer_id = COALESCE(customer_id, ?), status = CASE WHEN status = 'pending' THEN 'active' ELSE status END, updated_at = ? WHERE id = ?")
    .bind(customer || null, new Date().toISOString(), row.id).run();
  if (!customer) return `shop subscription ${row.id} paid`;
  const found = await squareCall(cfg, "POST", "subscriptions/search", { query: { filter: { customer_ids: [customer], location_ids: [cfg.locationId] } } }, fetchImpl);
  const taken = new Set(((await db.prepare("SELECT square_subscription_id s FROM shop_subscriptions WHERE square_subscription_id IS NOT NULL").all<{ s: string }>()).results || []).map((r) => r.s));
  const sub = (found?.subscriptions || []).find((s: any) => s.plan_variation_id === row.plan_variation_id && !taken.has(s.id));
  if (!sub) return `shop subscription ${row.id} paid; waiting for Square`;
  await db.prepare("UPDATE shop_subscriptions SET square_subscription_id = ? WHERE id = ?").bind(sub.id, row.id).run();
  return syncShopSubscription(db, cfg, sub.id, fetchImpl);
}

/** A subscription created at Square before the payment event arrived: attach it by customer + plan. */
export async function attachShopSubscription(db: DB, cfg: Cfg, sub: any): Promise<string | null> {
  await ensureShopSubscriptions(db);
  if (!sub?.id || !sub?.customer_id) return null;
  const row = await db.prepare("SELECT id FROM shop_subscriptions WHERE customer_id = ? AND plan_variation_id = ? AND square_subscription_id IS NULL ORDER BY created_at DESC LIMIT 1")
    .bind(sub.customer_id, sub.plan_variation_id).first<{ id: string }>();
  if (!row) return null;
  await db.prepare("UPDATE shop_subscriptions SET square_subscription_id = ? WHERE id = ?").bind(sub.id, row.id).run();
  return `attached ${sub.id} to shop subscription ${row.id}`;
}

export async function shopSubscriptionFor(db: DB, id: string, token: string) {
  await ensureShopSubscriptions(db);
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]{48}$/.test(token)) return null;
  const row = await db.prepare("SELECT * FROM shop_subscriptions WHERE id = ?").bind(id).first<any>();
  if (!row || row.token_hash !== (await hashToken(token))) return null;
  return row;
}

export async function cancelShopSubscription(db: DB, cfg: Cfg, row: any, fetchImpl?: Fetch): Promise<string> {
  if (!row.square_subscription_id) throw new Error("This subscription hasn't started yet.");
  await squareCall(cfg, "POST", `subscriptions/${encodeURIComponent(row.square_subscription_id)}/cancel`, {}, fetchImpl);
  return (await syncShopSubscription(db, cfg, row.square_subscription_id, fetchImpl)) || "cancelled";
}

export const nextShipDays = (chargedThrough: string | null) => (chargedThrough ? Math.max(0, Math.round((Date.parse(`${chargedThrough}T00:00:00Z`) - Date.now()) / DAY_MS)) : null);

export async function markShopSubscriptionPastDue(db: DB, squareSubId: string): Promise<string | null> {
  await ensureShopSubscriptions(db);
  const r = await db.prepare("UPDATE shop_subscriptions SET status = 'past_due', updated_at = ? WHERE square_subscription_id = ?").bind(new Date().toISOString(), squareSubId).run();
  return (r as any)?.meta?.changes ? `shop subscription ${squareSubId} past due` : null;
}

/** Reconcile existing and out-of-order Square invoices, never treating an
 * active subscription as payment evidence. Invoice status MUST be PAID.
 * No invented/manual credits; a failed Square lookup leaves the mail held.
 */
export async function reconcileShopSubscriptionInvoices(db:DB,cfg:Cfg,localId:string,subscription:any,fetchImpl?:Fetch):Promise<number>{
  await ensureShopSubscriptions(db);
  const invoices=Array.isArray(subscription?.invoice_ids)?subscription.invoice_ids.slice(0,100):[];
  let total=0;
  for(const rawId of invoices){
    const invoiceId=String(rawId||"");
    if(!invoiceId)continue;
    const existing=await db.prepare("SELECT 1 FROM shop_subscription_payments WHERE subscription_id=? AND invoice_id=?").bind(localId,invoiceId).first();
    if(existing)continue;
    const response=await squareCall(cfg,"GET","invoices/"+encodeURIComponent(invoiceId),undefined,fetchImpl);
    const invoice=response?.invoice;
    if(invoice?.id===invoiceId&&invoice?.subscription_id===subscription.id&&invoice?.status==="PAID"){
      await db.prepare("INSERT OR IGNORE INTO shop_subscription_payments(subscription_id,invoice_id,paid_at) VALUES(?,?,?)")
        .bind(localId,invoiceId,invoice.paid_at||new Date().toISOString()).run();
      total++;
    }
  }
  return total;
}

/** The signed Square invoice.payment_made event is the payment source of truth.
 * Store only invoice IDs (idempotent), never treat "active" as proof of two
 * fortnightly payments. Both first and recurring invoices go through this path.
 */
export async function recordShopSubscriptionInvoice(db: DB, squareSubscriptionId: string, invoiceId: string, paidAt = new Date().toISOString()): Promise<boolean> {
  if (!invoiceId || !squareSubscriptionId) return false;
  await ensureShopSubscriptions(db);
  const row = await db.prepare("SELECT id FROM shop_subscriptions WHERE square_subscription_id=?").bind(squareSubscriptionId).first<{id:string}>();
  if (!row) return false;
  await db.prepare("INSERT OR IGNORE INTO shop_subscription_payments(subscription_id,invoice_id,paid_at) VALUES(?,?,?)").bind(row.id,invoiceId,paidAt).run();
  return true;
}

export async function shopMailRoster(db: DB, editionMonth: string) {
  if (!/^\\d{4}-(0[1-9]|1[0-2])$/.test(editionMonth)) throw Error("Choose a valid edition month.");
  await ensureShopSubscriptions(db);
  const {results} = await db.prepare(`SELECT s.id,s.title,s.email,s.recipient,s.status,s.price_cents,s.monthly_price_cents,s.billing_cadence,s.created_at,
    (SELECT COUNT(*) FROM shop_subscription_payments pay WHERE pay.subscription_id=s.id) paid_count,
    (SELECT COUNT(*) FROM shop_subscription_mailings mail WHERE mail.subscription_id=s.id) mailed_count,
    (SELECT mailed_at FROM shop_subscription_mailings mail WHERE mail.subscription_id=s.id AND mail.edition_month=?) mailed_this_month
    FROM shop_subscriptions s WHERE s.status != 'pending' ORDER BY s.created_at ASC`).bind(editionMonth).all<any>();
  return (results||[]).map(row=>{
    const cadence: ShopBillingCadence=row.billing_cadence==="fortnightly"?"fortnightly":"monthly";
    const paid=mailPaymentStatus(cadence,Number(row.paid_count||0),Number(row.mailed_count||0),row.status);
    let recipient=null;try{recipient=JSON.parse(row.recipient);}catch{}
    const monthAlreadySent=!!row.mailed_this_month;
    const beforeSignup=editionMonth<String(row.created_at||"").slice(0,7);
    return {id:row.id,title:row.title,email:row.email,recipient,status:row.status,
      billing_cadence:cadence,price_cents:row.price_cents,monthly_price_cents:row.monthly_price_cents??row.price_cents,
      paid_count:Number(row.paid_count||0),mailed_count:Number(row.mailed_count||0),
      ...paid,eligible:paid.eligible&&!monthAlreadySent&&!beforeSignup,
      label:monthAlreadySent?"Already mailed for this edition":beforeSignup?"Not subscribed for this edition":paid.label,mailed_this_month:monthAlreadySent};
  });
}

export async function recordShopMailing(db:DB, subscriptionId:string, editionMonth:string, tracking:string) {
  const rows=await shopMailRoster(db,editionMonth);
  const row=rows.find(x=>x.id===subscriptionId);
  if(!row) return {ok:false,detail:"Subscription not found."};
  if(!row.eligible) return {ok:false,detail:"This subscriber has not fully paid for this mailing or has already been sent this edition."};
  // An owner may have multiple roster tabs; the unique constraint prevents
  // duplicate editions. Never consume two payments twice on the same edition.
  // Apply eligibility inside the INSERT statement, not only in the earlier
  // read. Concurrent clicks across two editions cannot spend the same credit.
  const result=await db.prepare(`INSERT OR IGNORE INTO shop_subscription_mailings(subscription_id,edition_month,mailed_at,tracking)
    SELECT s.id,?,?,? FROM shop_subscriptions s WHERE s.id=? AND s.status='active' AND substr(s.created_at,1,7)<=?
      AND NOT EXISTS (SELECT 1 FROM shop_subscription_mailings m WHERE m.subscription_id=s.id AND m.edition_month=?)
      AND (SELECT COUNT(*) FROM shop_subscription_payments pay WHERE pay.subscription_id=s.id)
        >= ((SELECT COUNT(*) FROM shop_subscription_mailings used WHERE used.subscription_id=s.id)+1)
          * CASE WHEN s.billing_cadence='fortnightly' THEN 2 ELSE 1 END`)
    .bind(editionMonth,new Date().toISOString(),tracking.trim().slice(0,80),subscriptionId,editionMonth,editionMonth).run();
  return (result as any)?.meta?.changes?{ok:true}:{ok:false,detail:"This edition was already marked mailed."};
}
