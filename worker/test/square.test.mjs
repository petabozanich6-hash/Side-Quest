import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { squareConfig, verifySquareSignature, handleSquareEvent } from "../src/square.ts";

const ENV = { SQUARE_ACCESS_TOKEN: "EAAA-test", SQUARE_APPLICATION_ID: "sandbox-sq0idb-abc", SQUARE_LOCATION_ID: "LTEST123456", SQUARE_WEBHOOK_SIGNATURE_KEY: "sig-key" };
const URL_ = "https://sidequestlearning.app/api/billing/square-webhook";

async function sign(body, key = "sig-key", url = URL_) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(url + body)));
  return btoa(String.fromCharCode(...mac));
}

test("Square stays off until every setting (including the webhook key) is present; sandbox is detected", () => {
  assert.equal(squareConfig({}).ok, false);
  assert.equal(squareConfig({ ...ENV, SQUARE_WEBHOOK_SIGNATURE_KEY: "" }).ok, false);
  const cfg = squareConfig(ENV);
  assert.equal(cfg.ok, true);
  assert.equal(cfg.production, false);
  assert.equal(squareConfig({ ...ENV, SQUARE_APPLICATION_ID: "sq0idp-xyz" }).production, true);
});

test("webhook signatures: only Square's exact HMAC over URL + body passes", async () => {
  const body = JSON.stringify({ event_id: "e1" });
  const good = await sign(body);
  assert.equal(await verifySquareSignature(body, good, "sig-key", URL_), true);
  assert.equal(await verifySquareSignature(body + " ", good, "sig-key", URL_), false);
  assert.equal(await verifySquareSignature(body, good, "other-key", URL_), false);
  assert.equal(await verifySquareSignature(body, good, "sig-key", URL_ + "x"), false);
  assert.equal(await verifySquareSignature(body, undefined, "sig-key", URL_), false);
});


import { ensureSquareMembership, cancelMembership } from "../src/squareMembership.ts";

function fakeSquareMembership() {
  const calls = [];
  const state = { sub: null, payment: null, order: { id: "o-member", location_id: "LTEST123456" } };
  let n = 0;
  const json = (o, status = 200) => new Response(JSON.stringify(o), { status });
  const fetchImpl = async (url, init) => {
    const path = url.replace(/^https:\/\/[^/]+\/v2\//, "");
    const body = init?.body ? JSON.parse(init.body) : null;
    calls.push({ path, method: init?.method, body });
    if (path === "catalog/object") return json({ catalog_object: { id: body.object.type === "SUBSCRIPTION_PLAN" ? "PLAN1" : `VAR${++n}` } });
    if (path === "online-checkout/payment-links") return json({ payment_link: { url: "https://square.link/u/member", order_id: "o-member" } });
    if (path.startsWith("payments/")) return json({ payment: state.payment });
    if (path.startsWith("orders/")) return json({ order: state.order });
    if (path === "subscriptions/search") return json({ subscriptions: state.sub ? [state.sub] : [] });
    if (/^subscriptions\/[^/]+\/cancel$/.test(path)) { state.sub = { ...state.sub, canceled_date: state.sub.charged_through_date }; return json({ subscription: state.sub }); }
    if (path.startsWith("subscriptions/")) return json({ subscription: state.sub });
    return json({}, 404);
  };
  return { fetchImpl, calls, state };
}

test("Square membership from the old app checkout: the first payment links the family, and the subscription grants the plan", async () => {
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES ('fam-m','F','u','2026-01-01','FREE_PREVIEW')").run();
  const cfg = squareConfig(ENV);
  const sq = fakeSquareMembership();
  // A family that joined through the app's old Square checkout (before memberships moved to the Square shop).
  await ensureSquareMembership(db);
  db.raw.prepare("INSERT INTO square_plans (key, variation_id, interval, offer_id, created_at) VALUES ('monthly', 'VAR-OLD-M', 'monthly', NULL, '2026-01-01')").run();
  db.raw.prepare("INSERT INTO square_checkouts (order_id, family_id, interval, offer_id, created_at) VALUES ('o-member', 'fam-m', 'monthly', NULL, '2026-11-08')").run();
  const link = { checkout_options: { subscription_plan_id: "VAR-OLD-M" } };

  // Square creates the subscription and the first payment completes.
  sq.state.sub = { id: "SUB1", customer_id: "CUST1", location_id: "LTEST123456", plan_variation_id: link.checkout_options.subscription_plan_id, status: "ACTIVE", charged_through_date: "2026-12-08" };
  sq.state.payment = { id: "PAY1", order_id: "o-member", customer_id: "CUST1", status: "COMPLETED", amount_money: { amount: 1300, currency: "AUD" } };
  const activated = [];
  const out = await handleSquareEvent(db, cfg, { type: "payment.updated", data: { object: { payment: sq.state.payment } } }, sq.fetchImpl, new Date("2026-11-08T00:00:00Z"), async (i) => { activated.push(i); });
  assert.match(out, /synced square SUB1 -> ACTIVE_MONTHLY/);
  const fam = db.raw.prepare("SELECT plan, plan_period_end, billing_interval, subscription_status, stripe_subscription_id FROM families WHERE id='fam-m'").get();
  assert.equal(fam.plan, "ACTIVE_MONTHLY");
  assert.equal(fam.billing_interval, "monthly");
  assert.equal(fam.stripe_subscription_id, "sq:SUB1");
  assert.ok(fam.plan_period_end > "2026-12-08");
  assert.equal(activated.length, 1);

  // Cancel: access stays until the period ends, flagged as cancelling.
  await cancelMembership(db, cfg, "fam-m", sq.fetchImpl);
  assert.equal(db.raw.prepare("SELECT cancel_at_period_end, plan FROM families WHERE id='fam-m'").get().cancel_at_period_end, 1);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='fam-m'").get().plan, "ACTIVE_MONTHLY");

  // A failed renewal: past due with grace; the subscription ending: cancelled.
  await handleSquareEvent(db, cfg, { type: "invoice.scheduled_charge_failed", data: { object: { invoice: { subscription_id: "SUB1" } } } }, sq.fetchImpl);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='fam-m'").get().plan, "PAST_DUE");
  sq.state.sub = { ...sq.state.sub, status: "CANCELED" };
  await handleSquareEvent(db, cfg, { type: "subscription.updated", data: { object: { subscription: { id: "SUB1" } } } }, sq.fetchImpl);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='fam-m'").get().plan, "CANCELLED");
});

function fakeShopMembershipSquare() {
  const calls = [];
  const state = { sub: null, customers: { CUSTNEW: { id: "CUSTNEW", email_address: "New.Parent@Example.com", given_name: "Nina", family_name: "Parent" }, CUSTOLD: { id: "CUSTOLD", email_address: "old@example.com" } } };
  const json = (o, status = 200) => new Response(JSON.stringify(o), { status });
  const objects = {
    MVAR_M: { id: "MVAR_M", type: "SUBSCRIPTION_PLAN_VARIATION", subscription_plan_variation_data: { name: "Monthly", subscription_plan_id: "MPLAN", phases: [{ cadence: "MONTHLY" }] } },
    MVAR_Y: { id: "MVAR_Y", type: "SUBSCRIPTION_PLAN_VARIATION", subscription_plan_variation_data: { name: "Yearly", subscription_plan_id: "MPLAN", phases: [{ cadence: "MONTHLY", periods: 1 }, { cadence: "ANNUAL" }] } },
    MPLAN: { id: "MPLAN", type: "SUBSCRIPTION_PLAN", subscription_plan_data: { name: "Side-Quest Family Membership" } },
    BVAR: { id: "BVAR", type: "SUBSCRIPTION_PLAN_VARIATION", subscription_plan_variation_data: { name: "Monthly box", subscription_plan_id: "BPLAN", phases: [{ cadence: "MONTHLY" }] } },
    BPLAN: { id: "BPLAN", type: "SUBSCRIPTION_PLAN", subscription_plan_data: { name: "Monthly Quest Box" } },
  };
  const fetchImpl = async (url, init) => {
    const path = url.replace(/^https:\/\/[^/]+\/v2\//, "");
    calls.push({ path, method: init?.method });
    if (path.startsWith("catalog/object/")) { const o = objects[decodeURIComponent(path.slice(15))]; return o ? json({ object: o }) : json({}, 404); }
    if (path.startsWith("customers/")) { const c = state.customers[decodeURIComponent(path.slice(10))]; return c ? json({ customer: c }) : json({}, 404); }
    if (path.startsWith("subscriptions/")) return json({ subscription: state.sub });
    return json({}, 404);
  };
  return { fetchImpl, calls, state };
}

test("Square shop membership: a new buyer gets an account, is unlocked through the paid period, and renewals keep it unlocked", async () => {
  const db = makeDb();
  const cfg = squareConfig(ENV);
  const sq = fakeShopMembershipSquare();
  const sent = [];
  const env = { EMAIL: { send: async (m) => { sent.push(m); } } };
  sq.state.sub = { id: "SSUB1", customer_id: "CUSTNEW", location_id: "LTEST123456", plan_variation_id: "MVAR_M", status: "ACTIVE", charged_through_date: "2026-12-12" };
  const out = await handleSquareEvent(db, cfg, { type: "subscription.created", data: { object: { subscription: { id: "SSUB1", customer_id: "CUSTNEW", plan_variation_id: "MVAR_M" } } } }, sq.fetchImpl, new Date("2026-11-12T00:00:00Z"), undefined, { env, origin: "https://sidequestlearning.app" });
  assert.match(out, /synced square SSUB1 -> ACTIVE_MONTHLY/);
  const user = db.raw.prepare("SELECT id, family_id, name FROM users WHERE email = 'new.parent@example.com'").get();
  assert.ok(user, "parent account created from the Square customer");
  assert.equal(user.name, "Nina Parent");
  const fam = db.raw.prepare("SELECT plan, plan_period_end, billing_interval FROM families WHERE id = ?").get(user.family_id);
  assert.equal(fam.plan, "ACTIVE_MONTHLY");
  assert.ok(fam.plan_period_end > "2026-12-12");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM password_resets WHERE user_id = ? AND used_at IS NULL").get(user.id).n, 1);

  // Renewal paid: Square moves charged_through on; the account stays unlocked for the new period.
  sq.state.sub = { ...sq.state.sub, charged_through_date: "2027-01-12" };
  await handleSquareEvent(db, cfg, { type: "invoice.payment_made", data: { object: { invoice: { id: "INV2", subscription_id: "SSUB1" } } } }, sq.fetchImpl, new Date("2026-12-12T00:00:00Z"), undefined, { env, origin: "https://sidequestlearning.app" });
  assert.ok(db.raw.prepare("SELECT plan_period_end FROM families WHERE id = ?").get(user.family_id).plan_period_end > "2027-01-12");
  // Only one account, even after repeated events.
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM users WHERE email = 'new.parent@example.com'").get().n, 1);

  // Failed renewal: grace; subscription ends: locked.
  await handleSquareEvent(db, cfg, { type: "invoice.scheduled_charge_failed", data: { object: { invoice: { subscription_id: "SSUB1" } } } }, sq.fetchImpl);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id = ?").get(user.family_id).plan, "PAST_DUE");
  sq.state.sub = { ...sq.state.sub, status: "CANCELED" };
  await handleSquareEvent(db, cfg, { type: "subscription.updated", data: { object: { subscription: { id: "SSUB1" } } } }, sq.fetchImpl);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id = ?").get(user.family_id).plan, "CANCELLED");
});

test("Square shop membership: an existing parent is matched by email; non-membership shop subscriptions are left alone", async () => {
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES ('fam-old','F','u-old','2026-01-01','FREE_PREVIEW')").run();
  db.raw.prepare("INSERT INTO users (id,family_id,email,password_hash,name,is_owner,created_at) VALUES ('u-old','fam-old','old@example.com','x','Old',1,'2026-01-01')").run();
  const cfg = squareConfig(ENV);
  const sq = fakeShopMembershipSquare();
  sq.state.sub = { id: "SSUB2", customer_id: "CUSTOLD", location_id: "LTEST123456", plan_variation_id: "MVAR_Y", status: "ACTIVE", charged_through_date: "2027-11-12" };
  const out = await handleSquareEvent(db, cfg, { type: "subscription.created", data: { object: { subscription: { id: "SSUB2" } } } }, sq.fetchImpl, new Date("2026-11-12T00:00:00Z"));
  assert.match(out, /ACTIVE_ANNUAL/);
  assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='fam-old'").get().plan, "ACTIVE_ANNUAL");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM users").get().n, 1);

  sq.state.sub = { id: "SSUB3", customer_id: "CUSTNEW", location_id: "LTEST123456", plan_variation_id: "BVAR", status: "ACTIVE", charged_through_date: "2026-12-12" };
  const box = await handleSquareEvent(db, cfg, { type: "subscription.created", data: { object: { subscription: { id: "SSUB3" } } } }, sq.fetchImpl);
  assert.match(box, /unknown plan/);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM users WHERE email='new.parent@example.com'").get().n, 0);
});
