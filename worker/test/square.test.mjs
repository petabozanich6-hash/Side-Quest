import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { squareConfig, verifySquareSignature, handleSquareEvent, createCartPaymentLink } from "../src/square.ts";
import { saveCart, ownedTiers, cartPaid } from "../src/questBookPurchases.ts";

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

function fakeSquare(state) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const path = url.replace(/^https:\/\/[^/]+\/v2\//, "");
    if (path === "online-checkout/payment-links") return new Response(JSON.stringify({ payment_link: { url: "https://square.link/u/abc", order_id: "o1" } }), { status: 200 });
    if (path.startsWith("payments/")) return new Response(JSON.stringify({ payment: state.payment }), { status: 200 });
    if (path.startsWith("orders/")) return new Response(JSON.stringify({ order: state.order }), { status: 200 });
    return new Response("{}", { status: 404 });
  };
  return { fetchImpl, calls };
}

test("a cart checkout sends the server's lines and cart id to Square, never browser prices", async () => {
  const cfg = squareConfig(ENV);
  const sq = fakeSquare({});
  const url = await createCartPaymentLink(cfg, { cartId: "cart-1", familyId: "fam-1", redirectUrl: "https://x/cart", lines: [{ name: "Quest Book: A", amount_cents: 399 }], fetchImpl: sq.fetchImpl });
  assert.equal(url, "https://square.link/u/abc");
  const sent = JSON.parse(sq.calls[0].init.body);
  assert.equal(sent.order.reference_id, "cart-1");
  assert.equal(sent.order.metadata.family_id, "fam-1");
  assert.equal(sent.order.line_items[0].base_price_money.amount, 399);
  assert.equal(sq.calls[0].init.headers.Authorization, "Bearer EAAA-test");
});

test("a completed Square payment unlocks the cart once; wrong amounts and other locations unlock nothing", async () => {
  const db = makeDb();
  const cfg = squareConfig(ENV);
  const cartId = await saveCart(db, "fam-1", [{ book_id: "book-a", tier: "book", amount_cents: 399, title: "A" }], 399);
  const order = { id: "o1", location_id: "LTEST123456", reference_id: cartId, metadata: { kind: "quest_cart", family_id: "fam-1", cart_id: cartId } };
  const event = (status) => ({ type: "payment.updated", event_id: "e", data: { object: { payment: { id: "p1", order_id: "o1", status, location_id: "LTEST123456" } } } });
  // Not completed yet.
  let sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "APPROVED", amount_money: { amount: 399, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("APPROVED"), sq.fetchImpl), /APPROVED/);
  // Paid the wrong amount.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 1, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /does not match/);
  assert.equal((await ownedTiers(db, "fam-1")).size, 0);
  // Another location's order.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 399, currency: "AUD" } }, order: { ...order, location_id: "OTHER" } });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /location/);
  // The real thing, twice (Square retries): one purchase.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 399, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /purchased/);
  await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl);
  assert.equal((await ownedTiers(db, "fam-1")).get("book-a"), "book");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM quest_book_purchases").get().n, 1);
  assert.equal(await cartPaid(db, "fam-1", cartId), true);
});

import { startMembershipCheckout, findSquareOffer, discountPeriods, discounted, cancelMembership } from "../src/squareMembership.ts";
import { ensureHoardSchema } from "../src/dragonHoard.ts";

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

test("Square membership: checkout creates the plan once, the first payment links the family, and the subscription grants the plan", async () => {
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES ('fam-m','F','u','2026-01-01','FREE_PREVIEW')").run();
  const cfg = squareConfig(ENV);
  const sq = fakeSquareMembership();
  const url = await startMembershipCheckout(db, cfg, { familyId: "fam-m", interval: "monthly", offer: null, redirectUrl: "https://x/plan", fetchImpl: sq.fetchImpl });
  assert.equal(url, "https://square.link/u/member");
  const link = sq.calls.find((c) => c.path === "online-checkout/payment-links").body;
  assert.equal(link.quick_pay.price_money.amount, 1300);
  assert.ok(link.checkout_options.subscription_plan_id);
  // Second checkout reuses the stored plan variation (no new catalog objects).
  const before = sq.calls.filter((c) => c.path === "catalog/object").length;
  await startMembershipCheckout(db, cfg, { familyId: "fam-m", interval: "monthly", offer: null, redirectUrl: "https://x/plan", fetchImpl: sq.fetchImpl });
  assert.equal(sq.calls.filter((c) => c.path === "catalog/object").length, before);

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

test("Square promo codes: a discounted first phase on its own plan variation, and redemption limits are enforced", async () => {
  assert.equal(discounted(1300, 20), 1040);
  assert.equal(discountPeriods("monthly", "month3"), 3);
  assert.equal(discountPeriods("weekly", "month1"), 4);
  assert.equal(discountPeriods("yearly", "month6"), 1);
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES ('fam-p','F','u','2026-01-01','FREE_PREVIEW')").run();
  await ensureHoardSchema(db);
  db.raw.prepare("INSERT INTO dragon_hoard_offers (id, mode, code, label, percent_off, duration_months, max_redemptions, expires_at, stripe_coupon_id, stripe_promotion_id, active, created_at) VALUES ('off1','test','DRAGON20','Launch',20,1,1,'2099-01-01T00:00:00Z','square','square:DRAGON20',1,'2026-01-01')").run();
  db.raw.prepare("INSERT INTO dragon_hoard_terms (offer_id, duration_type) VALUES ('off1','once')").run();
  const cfg = squareConfig(ENV);
  const offer = await findSquareOffer(db, cfg, "dragon20");
  assert.equal(offer.percent_off, 20);
  const sq = fakeSquareMembership();
  await startMembershipCheckout(db, cfg, { familyId: "fam-p", interval: "monthly", offer, redirectUrl: "https://x/plan", fetchImpl: sq.fetchImpl });
  const variation = sq.calls.filter((c) => c.path === "catalog/object").at(-1).body.object.subscription_plan_variation_data;
  assert.deepEqual(variation.phases.map((p) => [p.periods ?? null, p.pricing.price_money.amount]), [[1, 1040], [null, 1300]]);
  assert.equal(sq.calls.find((c) => c.path === "online-checkout/payment-links").body.quick_pay.price_money.amount, 1040);
  // Once used (paid), a one-use code is gone.
  db.raw.prepare("UPDATE square_checkouts SET paid_at = '2026-11-08' WHERE offer_id = 'off1'").run();
  assert.equal(await findSquareOffer(db, cfg, "DRAGON20"), null);
});
