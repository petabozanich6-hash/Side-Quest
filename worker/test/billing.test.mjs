// Targeted billing tests: signature verification, server-side price mapping, webhook idempotency,
// out-of-order events, cancellation at period end, payment failure and entitlement mapping.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as b from "../src/billing.ts";
import { effectivePlan, limitsFor, isPaidPlan } from "../src/entitlements.ts";

const NOW = new Date("2026-10-14T00:00:00Z");
const S = (d) => Math.floor(d.getTime() / 1000);
const DAY = 86400000;
const TEST_CFG = b.billingConfig({ STRIPE_SECRET_KEY: "sk_test_dummy" });
const P = b.PRICES.test;

function seedFamily(db, id, plan = "FREE_PREVIEW", extra = {}) {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at) VALUES (?,?,?,?,?,?,?)")
    .run(id, "Fam", `u${id}`, NOW.toISOString(), plan, NOW.toISOString(), new Date(NOW.getTime() + 7 * DAY).toISOString());
  for (const [k, v] of Object.entries(extra)) db.raw.prepare(`UPDATE families SET ${k} = ? WHERE id = ?`).run(v, id);
}
const fam = (db, id) => db.raw.prepare("SELECT * FROM families WHERE id = ?").get(id);

function sub({ id = "sub_1", customer = "cus_1", status = "active", price = P.monthly.price, end = new Date(NOW.getTime() + 30 * DAY), family = "f1", cancel = false, ended = null } = {}) {
  return {
    id, object: "subscription", customer, status, cancel_at_period_end: cancel, ended_at: ended ? S(ended) : null,
    metadata: { family_id: family },
    items: { data: [{ price: { id: price }, current_period_end: S(end) }] },
  };
}
// Fake Stripe: GET /subscriptions/:id returns whatever the "current" state is.
function fakeStripe(state) {
  return async (url) => {
    const m = url.match(/subscriptions\/([^?]+)/);
    const s = m && state[decodeURIComponent(m[1])];
    return new Response(JSON.stringify(s || { error: { message: "nope" } }), { status: s ? 200 : 404 });
  };
}
const ev = (id, type, object, livemode = false) => ({ id, type, livemode, data: { object } });

test("config: test key uses sandbox prices; live key is refused unless explicitly enabled and priced", () => {
  assert.equal(TEST_CFG.ok, true);
  assert.equal(TEST_CFG.mode, "test");
  assert.equal(b.billingConfig({}).ok, false);
  assert.equal(b.billingConfig({ STRIPE_SECRET_KEY: "pk_test_x" }).ok, false);
  assert.equal(b.billingConfig({ STRIPE_SECRET_KEY: "sk_live_x" }).ok, false);
  assert.equal(b.billingConfig({ STRIPE_SECRET_KEY: "sk_live_x", STRIPE_LIVE_ENABLED: "true" }).ok, true, "four configured live prices allow explicit opt-in");
  assert.deepEqual(Object.keys(P).sort(), ["fortnightly", "monthly", "weekly", "yearly"]);
  assert.equal(P.weekly.amount_cents, 300);
  assert.equal(P.fortnightly.amount_cents, 600);
  assert.equal(P.monthly.amount_cents, 1300);
  assert.equal(P.yearly.amount_cents, 13000);
  assert.equal(b.intervalForPrice(P, "price_unknown"), null);
});

test("live config: complete distinct live prices activate only with explicit opt-in", () => {
  const ids = {
    STRIPE_LIVE_PRICE_WEEKLY: "price_liveWeekly1",
    STRIPE_LIVE_PRICE_FORTNIGHTLY: "price_liveFortnight1",
    STRIPE_LIVE_PRICE_MONTHLY: "price_liveMonthly1",
    STRIPE_LIVE_PRICE_YEARLY: "price_liveYearly1",
  };
  const base = { STRIPE_SECRET_KEY: "sk_live_dummy", ...ids };
  assert.equal(b.billingConfig(base).ok, false, "not enabled by default");
  assert.equal(b.billingConfig({ ...base, STRIPE_LIVE_ENABLED: "true", STRIPE_LIVE_PRICE_YEARLY: undefined }).ok, true, "missing override uses preconfigured approved yearly ID");
  assert.equal(b.billingConfig({ ...base, STRIPE_LIVE_ENABLED: "true", STRIPE_LIVE_PRICE_YEARLY: ids.STRIPE_LIVE_PRICE_MONTHLY }).ok, false, "duplicate price IDs must fail");
  assert.equal(b.billingConfig({ ...base, STRIPE_LIVE_ENABLED: "true", STRIPE_LIVE_PRICE_YEARLY: "bad" }).ok, false, "invalid price ID must fail");
  const live = b.billingConfig({ ...base, STRIPE_LIVE_ENABLED: "true" });
  assert.equal(live.ok, true);
  assert.equal(live.mode, "live");
  assert.equal(live.prices.monthly.price, ids.STRIPE_LIVE_PRICE_MONTHLY);
  assert.equal(live.prices.monthly.amount_cents, 1300);
  assert.deepEqual(Object.keys(live.prices).sort(), [...b.INTERVALS].sort());
});

test("signature: valid accepted; tampered, wrong secret, stale or missing rejected", async () => {
  const body = JSON.stringify({ id: "evt_1" });
  const t = S(NOW);
  const sig = await b.hmacHex("whsec_abc", `${t}.${body}`);
  const header = `t=${t},v1=${sig}`;
  assert.equal(await b.verifyStripeSignature(body, header, "whsec_abc", t), true);
  assert.equal(await b.verifyStripeSignature(body + " ", header, "whsec_abc", t), false);
  assert.equal(await b.verifyStripeSignature(body, header, "whsec_other", t), false);
  assert.equal(await b.verifyStripeSignature(body, header, "whsec_abc", t + 3600), false);
  assert.equal(await b.verifyStripeSignature(body, null, "whsec_abc", t), false);
  assert.equal(await b.verifyStripeSignature(body, `t=${t},v1=${"0".repeat(64)},v1=${sig}`, "whsec_abc", t), true, "any matching v1");
});

test("all four intervals map to paid Family Membership with identical limits", async () => {
  const db = makeDb();
  for (const i of b.INTERVALS) {
    const id = `f_${i}`;
    seedFamily(db, id);
    const d = b.decideSync(fam(db, id), sub({ price: P[i].price, family: id, customer: `cus_${i}` }), P, NOW);
    assert.equal(d.action, "update");
    await b.applyDecision(db, id, d);
    const row = fam(db, id);
    assert.equal(row.plan, b.PLAN_FOR_INTERVAL[i]);
    assert.equal(row.billing_interval, i);
    const eff = effectivePlan(row, NOW);
    assert.equal(isPaidPlan(eff), true);
    assert.deepEqual(limitsFor(eff), limitsFor("ACTIVE_MONTHLY"));
  }
});

test("unknown price, incomplete payment and wrong customer never grant access", () => {
  const db = makeDb();
  seedFamily(db, "f1");
  let d = b.decideSync(fam(db, "f1"), sub({ price: "price_attacker" }), P, NOW);
  assert.equal(d.fields.plan, undefined);
  d = b.decideSync(fam(db, "f1"), sub({ status: "incomplete" }), P, NOW);
  assert.equal(d.fields.plan, undefined);
  seedFamily(db, "f2", "FREE_PREVIEW", { stripe_customer_id: "cus_real" });
  d = b.decideSync(fam(db, "f2"), sub({ customer: "cus_other", family: "f2" }), P, NOW);
  assert.equal(d.action, "ignore");
});

test("webhook: duplicate events are processed once; livemode mismatch ignored", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const state = { sub_1: sub() };
  let calls = 0;
  const f = async (u) => { calls++; return fakeStripe(state)(u); };
  const e = ev("evt_a", "customer.subscription.created", sub());
  assert.match(await b.handleEvent(db, TEST_CFG, e, f, NOW), /synced/);
  assert.equal(await b.handleEvent(db, TEST_CFG, e, f, NOW), "duplicate");
  assert.equal(calls, 1);
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
  assert.match(await b.handleEvent(db, TEST_CFG, ev("evt_live", "invoice.paid", { object: "invoice", subscription: "sub_1" }, true), f, NOW), /ignored/);
});

test("checkout success alone (no webhook) grants nothing; checkout.session.completed links customer and activates", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  assert.equal(effectivePlan(fam(db, "f1"), new Date(NOW.getTime() + 8 * DAY)), "PREVIEW_EXPIRED");
  const state = { sub_1: sub({ price: P.yearly.price, end: new Date(NOW.getTime() + 365 * DAY) }) };
  const session = { object: "checkout.session", mode: "subscription", customer: "cus_1", subscription: "sub_1", client_reference_id: "f1", metadata: { family_id: "f1" } };
  await b.handleEvent(db, TEST_CFG, ev("evt_cs", "checkout.session.completed", session), fakeStripe(state), NOW);
  const row = fam(db, "f1");
  assert.equal(row.stripe_customer_id, "cus_1");
  assert.equal(row.plan, "ACTIVE_ANNUAL");
});

test("checkout confirmation runs after paid membership activation, only once per event", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const state = { sub_1: sub({ price: P.weekly.price, end: new Date(NOW.getTime() + 7 * DAY) }) };
  const session = {
    object: "checkout.session", mode: "subscription", customer: "cus_1", subscription: "sub_1",
    client_reference_id: "f1", metadata: { family_id: "f1" }, payment_status: "paid",
  };
  const confirmed = [];
  const notify = async (info) => confirmed.push(info);
  const first = ev("evt_confirmed", "checkout.session.completed", session);
  await b.handleEvent(db, TEST_CFG, first, fakeStripe(state), NOW, notify);
  assert.equal(fam(db, "f1").plan, "ACTIVE_WEEKLY");
  assert.equal(confirmed.length, 1);
  assert.equal(confirmed[0].familyId, "f1");
  assert.equal(confirmed[0].interval, "weekly");
  await b.handleEvent(db, TEST_CFG, first, fakeStripe(state), NOW, notify);
  assert.equal(confirmed.length, 1, "duplicate Stripe event must not send another email");

  await b.handleEvent(db, TEST_CFG, ev("evt_unpaid", "checkout.session.completed",
    { ...session, payment_status: "unpaid" }), fakeStripe(state), NOW, notify);
  assert.equal(confirmed.length, 1, "unpaid checkout must not notify");

  await b.handleEvent(db, TEST_CFG, ev("evt_invoice", "invoice.paid",
    { object: "invoice", subscription: "sub_1" }), fakeStripe(state), NOW, notify);
  assert.equal(confirmed.length, 1, "renewal invoice must not send a welcome email");
});

test("temporary membership email failure leaves the event retryable without removing access", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const state = { sub_1: sub() };
  const session = {
    object: "checkout.session", mode: "subscription", customer: "cus_1", subscription: "sub_1",
    client_reference_id: "f1", metadata: { family_id: "f1" }, payment_status: "paid",
  };
  const event = ev("evt_retry_email", "checkout.session.completed", session);
  await assert.rejects(() => b.handleEvent(db, TEST_CFG, event, fakeStripe(state), NOW,
    async () => { throw new Error("email provider unavailable"); }));
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY", "membership remains active");
  assert.equal(db.raw.prepare("SELECT processed_at FROM stripe_events WHERE id = ?").get(event.id).processed_at, null);
  let delivered = 0;
  await b.handleEvent(db, TEST_CFG, event, fakeStripe(state), NOW, async () => { delivered += 1; });
  assert.equal(delivered, 1);
  assert.ok(db.raw.prepare("SELECT processed_at FROM stripe_events WHERE id = ?").get(event.id).processed_at);
});

test("subscription and account emails contain current terms and no obsolete personal-project copy", async () => {
  const { membershipActivatedEmail, welcomeEmail } = await import("../src/email.ts");
  const confirmation = membershipActivatedEmail("test@example.org", "Sam", {
    interval: "fortnightly", amountCents: 600,
    nextBillingAt: "2026-10-28T00:00:00Z", testMode: true,
  });
  assert.match(confirmation.subject, /\[TEST\]/);
  assert.match(confirmation.text, /A\$6\.00 every two weeks/);
  assert.match(confirmation.text, /28 October 2026/);
  assert.match(confirmation.text, /renew.*automatically/i);
  assert.match(confirmation.text, /Manage billing/i);
  const welcome = welcomeEmail("new@example.org", "Taylor");
  assert.match(welcome.text, /seven-day free preview/i);
  assert.match(welcome.text, /no payment card required/i);
  assert.doesNotMatch(welcome.html, /small personal project/i);
});


test("owner paid-family email celebrates the membership without personal information", async () => {
  const { newPaidFamilyOwnerEmail } = await import("../src/email.ts");
  const email = newPaidFamilyOwnerEmail("owner@example.test", {
    interval: "monthly", amountCents: 1300, activeFamilies: 27,
  });
  assert.match(email.subject, /ACHIEVEMENT UNLOCKED/i);
  assert.match(email.text, /A\$13\.00 per month/);
  assert.match(email.text, /27/);
  assert.match(email.text, /goblins/i);
  assert.match(email.html, /Your kingdom is growing/);
  assert.doesNotMatch(email.html, /test@example\.org|credit card number|full card/i);
});

test("owner alert is delivered once per family, not again for another purchase or a renewal", async () => {
  const { sendOwnerNewMemberAlert } = await import("../src/ownerNotifications.ts");
  const db = makeDb();
  seedFamily(db, "f1", "ACTIVE_MONTHLY", {
    stripe_subscription_id: "sub_1", subscription_status: "active",
    billing_interval: "monthly", plan_period_end: new Date(NOW.getTime() + 30 * DAY).toISOString(),
  });
  seedFamily(db, "f2", "ACTIVE_ANNUAL", {
    stripe_subscription_id: "sub_other", subscription_status: "active",
    plan_period_end: new Date(NOW.getTime() + 200 * DAY).toISOString(),
  });
  const emails = [];
  const env = {
    OWNER_NOTIFICATION_EMAIL: "owner@example.test",
    EMAIL: { send: async (message) => { emails.push(message); return { messageId: "msg_owner" }; } },
  };
  const info = { familyId: "f1", subscriptionId: "sub_1", interval: "monthly", amountCents: 1300 };
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", info, NOW), "sent");
  assert.equal(emails.length, 1);
  assert.match(emails[0].text, /Active paying families: 2/);
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", info, NOW), "duplicate");
  // Re-subscribing later must not generate another "first paid family" celebration.
  db.raw.prepare("UPDATE families SET stripe_subscription_id='sub_2' WHERE id='f1'").run();
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live",
    { ...info, subscriptionId: "sub_2" }, NOW), "duplicate");
  assert.equal(emails.length, 1);
  const row = db.raw.prepare("SELECT sent_at FROM owner_new_member_alerts WHERE family_id = ?").get("f1");
  assert.ok(row.sent_at);
});

test("owner alert skips test mode, unconfigured recipients and unpaid or stale subscriptions", async () => {
  const { sendOwnerNewMemberAlert } = await import("../src/ownerNotifications.ts");
  const db = makeDb();
  seedFamily(db, "f1", "ACTIVE_WEEKLY", {
    stripe_subscription_id: "sub_1", subscription_status: "active",
    plan_period_end: new Date(NOW.getTime() + 7 * DAY).toISOString(),
  });
  const emails = [];
  const env = {
    OWNER_NOTIFICATION_EMAIL: "owner@example.test",
    EMAIL: { send: async (message) => { emails.push(message); return { messageId: "msg" }; } },
  };
  const info = { familyId: "f1", subscriptionId: "sub_1", interval: "weekly", amountCents: 300 };
  assert.equal(await sendOwnerNewMemberAlert(db, env, "test", info, NOW), "disabled");
  assert.equal(await sendOwnerNewMemberAlert(db, { ...env, OWNER_NOTIFICATION_EMAIL: "" }, "live", info, NOW), "disabled");
  assert.equal(await sendOwnerNewMemberAlert(db, { ...env, EMAIL: undefined }, "live", info, NOW), "disabled");
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", { ...info, subscriptionId: "sub_unknown" }, NOW), "disabled");
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", { ...info, amountCents: 0 }, NOW), "disabled");
  db.raw.prepare("UPDATE families SET subscription_status='past_due' WHERE id='f1'").run();
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", info, NOW), "disabled");
  assert.equal(db.raw.prepare("SELECT COUNT(*) AS n FROM owner_new_member_alerts").get().n, 0);
  assert.equal(emails.length, 0);
});

test("owner alert releases an unsuccessful claim without interrupting customer access", async () => {
  const { sendOwnerNewMemberAlert } = await import("../src/ownerNotifications.ts");
  const db = makeDb();
  seedFamily(db, "f1", "ACTIVE_MONTHLY", {
    stripe_subscription_id: "sub_1", subscription_status: "active",
    plan_period_end: new Date(NOW.getTime() + 30 * DAY).toISOString(),
  });
  const info = { familyId: "f1", subscriptionId: "sub_1", interval: "monthly", amountCents: 1300 };
  let attempted = 0;
  const env = {
    OWNER_NOTIFICATION_EMAIL: "owner@example.test",
    EMAIL: { send: async () => { attempted++; if (attempted === 1) throw new Error("temporary outage"); return { messageId: "ok" }; } },
  };
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", info, NOW), "failed");
  assert.equal(db.raw.prepare("SELECT sent_at FROM owner_new_member_alerts WHERE family_id = 'f1'").get().sent_at, null);
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
  assert.equal(await sendOwnerNewMemberAlert(db, env, "live", info, NOW), "sent");
  assert.equal(attempted, 2);
});

test("simultaneous owner-alert webhook deliveries claim the same family only once", async () => {
  const { sendOwnerNewMemberAlert } = await import("../src/ownerNotifications.ts");
  const db = makeDb();
  seedFamily(db, "f1", "ACTIVE_ANNUAL", {
    stripe_subscription_id: "sub_1", subscription_status: "active",
    plan_period_end: new Date(NOW.getTime() + 365 * DAY).toISOString(),
  });
  let sent = 0;
  const env = {
    OWNER_NOTIFICATION_EMAIL: "owner@example.test",
    EMAIL: { send: async () => { await new Promise(r => setTimeout(r, 20)); sent++; return { messageId: "sent" }; } },
  };
  const info = { familyId: "f1", subscriptionId: "sub_1", interval: "yearly", amountCents: 13000 };
  const results = await Promise.all([
    sendOwnerNewMemberAlert(db, env, "live", info, NOW),
    sendOwnerNewMemberAlert(db, env, "live", info, NOW),
  ]);
  assert.deepEqual(results.sort(), ["duplicate", "sent"]);
  assert.equal(sent, 1);
});

test("verified live paid checkout invokes owner notifier; sandbox, renewals, zero amounts and unpaid do not", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const current = { sub_1: sub() };
  const cfg = { ...TEST_CFG, mode: "live" }; // Isolated stub; no live Stripe credentials.
  const session = {
    object: "checkout.session", mode: "subscription", customer: "cus_1", subscription: "sub_1",
    client_reference_id: "f1", metadata: { family_id: "f1" }, payment_status: "paid", amount_total: 1300,
  };
  let customerEmails = 0;
  let ownerEmails = 0;
  const notifyCustomer = async () => { customerEmails++; };
  const notifyOwner = async (info) => { assert.equal(info.familyId, "f1"); ownerEmails++; };
  const notify = (event) => b.handleEvent(db, cfg, event, fakeStripe(current), NOW, notifyCustomer, notifyOwner);
  const first = ev("new_family_paid", "checkout.session.completed", session, true);
  await notify(first);
  await notify(first);
  assert.equal(ownerEmails, 1, "Stripe duplicate event ignored");
  assert.equal(customerEmails, 1);
  await notify(ev("renewed", "invoice.paid", { object: "invoice", subscription: "sub_1" }, true));
  await notify(ev("unpaid", "checkout.session.completed", { ...session, payment_status: "unpaid" }, true));
  await notify(ev("free_coupon", "checkout.session.completed", { ...session, amount_total: 0 }, true));
  await b.handleEvent(db, TEST_CFG, ev("sandbox_checkout", "checkout.session.completed", session), fakeStripe(current), NOW, notifyCustomer, notifyOwner);
  assert.equal(ownerEmails, 1, "No owner alert for invoice renewal, unpaid or sandbox");
  assert.equal(customerEmails, 3, "Customer confirmations retain existing behavior, including sandbox and zero-dollar sessions");

  // An owner email crash must not cause another confirmation or roll back paid access.
  await notify(ev("another_checkout", "checkout.session.completed", session, true));
  assert.equal(ownerEmails, 2, "A separate paid checkout invokes the ledger-backed notifier, which de-duplicates by family");
});

test("out-of-order: a stale 'created/incomplete' event arriving after activation does not revoke access", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const state = { sub_1: sub() };
  await b.handleEvent(db, TEST_CFG, ev("evt_paid", "invoice.paid", { object: "invoice", parent: { subscription_details: { subscription: "sub_1" } } }), fakeStripe(state), NOW);
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
  // Older event with an incomplete payload arrives late; we re-fetch and Stripe says active.
  await b.handleEvent(db, TEST_CFG, ev("evt_old", "customer.subscription.created", sub({ status: "incomplete" })), fakeStripe(state), NOW);
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
  // A late 'deleted' for an OLD subscription cannot cancel the family's newer one.
  const state2 = { sub_0: sub({ id: "sub_0", status: "canceled", ended: NOW }) };
  await b.handleEvent(db, TEST_CFG, ev("evt_oldsub", "customer.subscription.deleted", state2.sub_0), fakeStripe(state2), NOW);
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
  assert.equal(fam(db, "f1").stripe_subscription_id, "sub_1");
});

test("cancellation keeps paid access until period end, then ends; data is untouched", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,created_at) VALUES ('s1','f1','Kid','kid1','x','S2',?)").run(NOW.toISOString());
  const end = new Date(NOW.getTime() + 10 * DAY);
  const state = { sub_1: sub({ cancel: true, end }) };
  await b.handleEvent(db, TEST_CFG, ev("evt_u", "customer.subscription.updated", state.sub_1), fakeStripe(state), NOW);
  let row = fam(db, "f1");
  assert.equal(row.cancel_at_period_end, 1);
  assert.equal(isPaidPlan(effectivePlan(row, new Date(NOW.getTime() + 9 * DAY))), true);
  // Period ends: Stripe sends deleted.
  const later = new Date(end.getTime() + 60000);
  state.sub_1 = sub({ status: "canceled", end, ended: end });
  await b.handleEvent(db, TEST_CFG, ev("evt_d", "customer.subscription.deleted", state.sub_1), fakeStripe(state), later);
  row = fam(db, "f1");
  assert.equal(row.plan, "CANCELLED");
  assert.equal(isPaidPlan(effectivePlan(row, later)), false);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM students WHERE family_id='f1'").get().n, 1);
});

test("payment failure: short grace, then locked; successful retry restores", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  const state = { sub_1: sub() };
  await b.handleEvent(db, TEST_CFG, ev("e1", "invoice.paid", { object: "invoice", subscription: "sub_1" }), fakeStripe(state), NOW);
  state.sub_1 = sub({ status: "past_due" });
  await b.handleEvent(db, TEST_CFG, ev("e2", "invoice.payment_failed", { object: "invoice", subscription: "sub_1" }), fakeStripe(state), NOW);
  const row = fam(db, "f1");
  assert.equal(row.plan, "PAST_DUE");
  assert.equal(isPaidPlan(effectivePlan(row, new Date(NOW.getTime() + 6 * DAY))), true);
  assert.equal(isPaidPlan(effectivePlan(row, new Date(NOW.getTime() + 8 * DAY))), false);
  // A second failure does not extend the grace window.
  await b.handleEvent(db, TEST_CFG, ev("e3", "invoice.payment_failed", { object: "invoice", subscription: "sub_1" }), fakeStripe(state), new Date(NOW.getTime() + 5 * DAY));
  assert.equal(fam(db, "f1").plan_period_end, row.plan_period_end);
  state.sub_1 = sub({ end: new Date(NOW.getTime() + 40 * DAY) });
  await b.handleEvent(db, TEST_CFG, ev("e4", "invoice.paid", { object: "invoice", subscription: "sub_1" }), fakeStripe(state), new Date(NOW.getTime() + 9 * DAY));
  assert.equal(fam(db, "f1").plan, "ACTIVE_MONTHLY");
});

test("renewal moves the period forward; missed renewals stop access after grace", () => {
  const row = { plan: "ACTIVE_WEEKLY", plan_period_end: new Date(NOW.getTime() + 7 * DAY).toISOString() };
  assert.equal(effectivePlan(row, new Date(NOW.getTime() + 9 * DAY)), "ACTIVE_WEEKLY");
  assert.equal(effectivePlan(row, new Date(NOW.getTime() + 11 * DAY)), "CANCELLED");
  assert.equal(effectivePlan({ plan: "ACTIVE_FORTNIGHTLY" }, NOW), "ACTIVE_FORTNIGHTLY");
});

test("INTERNAL early-access families keep their plan whatever Stripe says", async () => {
  const db = makeDb();
  seedFamily(db, "fi", "INTERNAL");
  const d = b.decideSync(fam(db, "fi"), sub({ family: "fi", status: "canceled", ended: NOW }), P, NOW);
  await b.applyDecision(db, "fi", d);
  assert.equal(fam(db, "fi").plan, "INTERNAL");
});

test("invoice subscription id is found on old and new API shapes", () => {
  assert.equal(b.subscriptionIdFromEvent(ev("x", "invoice.paid", { object: "invoice", subscription: "sub_a" })), "sub_a");
  assert.equal(b.subscriptionIdFromEvent(ev("x", "invoice.paid", { object: "invoice", parent: { subscription_details: { subscription: "sub_b" } } })), "sub_b");
  assert.equal(b.subscriptionIdFromEvent(ev("x", "checkout.session.completed", { object: "checkout.session", mode: "payment", subscription: null })), null);
});

// Route test without the Worker runtime: capture handlers and call them with a minimal context.
function routes(fetchImpl) {
  const h = {};
  const app = { post: (path, ...fns) => { h[path] = fns[fns.length - 1]; } };
  b.registerBilling(app, { auth: null, parent: null }, fetchImpl);
  return h;
}
function ctx(db, body, env = {}) {
  return {
    env: { DB: db, STRIPE_SECRET_KEY: "sk_test_dummy", ...env },
    req: { json: async () => body, url: "https://sidequestlearning.app/api/billing/checkout", text: async () => "", header: () => null },
    get: () => ({ id: "u1", family_id: "f1", role: "parent", name: "P" }),
    json: (data, status = 200) => ({ data, status }),
  };
}

test("checkout: server picks price, family and redirect; client values are ignored; no trial; no double subscriptions", async () => {
  const db = makeDb();
  seedFamily(db, "f1");
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES ('u1','f1','p@example.com','P',?)").run(NOW.toISOString());
  const sent = [];
  const f = async (url, init) => {
    sent.push({ url, body: decodeURIComponent(init.body || "") });
    if (url.endsWith("/customers")) return new Response(JSON.stringify({ id: "cus_new" }));
    return new Response(JSON.stringify({ id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" }));
  };
  const h = routes(f);
  const r = await h["/api/billing/checkout"](ctx(db, { interval: "fortnightly", price: "price_evil", family_id: "f2", success_url: "https://evil.example" }));
  assert.equal(r.status, 200);
  assert.equal(r.data.url, "https://checkout.stripe.com/c/pay/cs_1");
  const cs = sent.find((s) => s.url.endsWith("/checkout/sessions")).body;
  assert.match(cs, new RegExp(`line_items\\[0\\]\\[price\\]=${P.fortnightly.price}`));
  assert.match(cs, /client_reference_id=f1/);
  assert.match(cs, /customer=cus_new/);
  assert.match(cs, /success_url=https:\/\/sidequestlearning.app\/parent\/plan\?checkout=success/);
  assert.ok(!cs.includes("evil") && !cs.includes("f2") && !cs.includes("trial"));
  assert.equal(fam(db, "f1").stripe_customer_id, "cus_new");
  assert.equal(effectivePlan(fam(db, "f1"), NOW), "FREE_PREVIEW", "checkout grants nothing");

  assert.equal((await h["/api/billing/checkout"](ctx(db, { interval: "lifetime" }))).status, 400);
  db.raw.prepare("UPDATE families SET plan='ACTIVE_MONTHLY', subscription_status='active' WHERE id='f1'").run();
  assert.equal((await h["/api/billing/checkout"](ctx(db, { interval: "weekly" }))).status, 409);
  assert.equal((await h["/api/billing/checkout"](ctx(db, { interval: "weekly" }, { STRIPE_SECRET_KEY: "" }))).status, 503);
});

test("live checkout replaces a confirmed stale sandbox customer, preserving family data", async () => {
  const db = makeDb();
  seedFamily(db, "f1", "FREE_PREVIEW", { stripe_customer_id: "cus_sandbox_old" });
  db.raw.prepare("INSERT INTO users (id,family_id,email,name,created_at) VALUES ('u1','f1','p@example.com','P',?)").run(NOW.toISOString());
  const calls = [];
  const fetchStripe = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith("/customers/cus_sandbox_old")) return new Response(JSON.stringify({ error: { message: "No such customer" } }), { status: 404 });
    if (url.endsWith("/customers")) return new Response(JSON.stringify({ id: "cus_live_new" }));
    if (url.endsWith("/checkout/sessions")) return new Response(JSON.stringify({ id: "cs_live_1", url: "https://checkout.stripe.com/c/pay/cs_live_1" }));
    throw Error("unexpected Stripe request " + url);
  };
  const h = routes(fetchStripe);
  const result = await h["/api/billing/checkout"](ctx(db, { interval: "weekly" }, { STRIPE_SECRET_KEY: "sk_live_dummy", STRIPE_LIVE_ENABLED: "true" }));
  assert.equal(result.status, 200);
  assert.equal(fam(db, "f1").stripe_customer_id, "cus_live_new");
  assert.equal(fam(db, "f1").plan, "FREE_PREVIEW");
  assert.match(calls.find((c) => c.url.endsWith("/checkout/sessions")).init.body, /customer=cus_live_new/);
});

test("live checkout fails closed on Stripe permission/server errors without replacing customer", async () => {
  const db = makeDb();
  seedFamily(db, "f1", "FREE_PREVIEW", { stripe_customer_id: "cus_existing" });
  const h = routes(async () => new Response(JSON.stringify({ error: { message: "Service unavailable" } }), { status: 503 }));
  const res = await h["/api/billing/checkout"](ctx(db, { interval: "monthly" }, { STRIPE_SECRET_KEY: "sk_live_dummy", STRIPE_LIVE_ENABLED: "true" }));
  assert.equal(res.status, 502);
  assert.equal(fam(db, "f1").stripe_customer_id, "cus_existing");
});

test("webhook route rejects unsigned requests", async () => {
  const db = makeDb();
  const h = routes(async () => new Response("{}"));
  const c = ctx(db, {}, { STRIPE_WEBHOOK_SECRET: "whsec_abc" });
  c.req.text = async () => JSON.stringify({ id: "evt_forged", type: "invoice.paid", livemode: false, data: { object: {} } });
  assert.equal((await h["/api/billing/webhook"](c)).status, 400);
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM stripe_events").get().n, 0);
});
