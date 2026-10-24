import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { processPaymentNotices } from "../src/paymentNotices.ts";

const DAY = 86400000;
const NOW = new Date("2026-10-24T03:00:00.000Z");
const at = days => new Date(NOW.getTime() + days * DAY).toISOString();

function setup({ plan = "PAST_DUE", graceEnd = at(5), owner = "", live = true, suspended = false } = {}) {
  const db = makeDb(), sent = [];
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan,plan_period_end) VALUES (?,?,?,?,?,?)")
    .run("f1", "Test family", "u1", at(-60), plan, graceEnd);
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,created_at) VALUES(?,?,?,?,?)")
    .run("u1", "f1", "parent@example.test", "Dragon Mum", at(-60));
  if (suspended) db.raw.prepare("INSERT INTO family_admin_state(family_id,status) VALUES('f1','suspended')").run();
  const env = { DB: db, OWNER_NOTIFICATION_EMAIL: owner, STRIPE_LIVE_ENABLED: live ? "true" : undefined,
    EMAIL: { async send(mail) { sent.push(mail); } } };
  return { db, env, sent, setFamily: (p, end) => db.raw.prepare("UPDATE families SET plan=?, plan_period_end=?").run(p, end) };
}

test("a missed payment emails the parent once, with the date full access ends", async () => {
  const h = setup();
  assert.deepEqual(await processPaymentNotices(h.env, NOW), { sent: 1, failed: 0 });
  assert.deepEqual(await processPaymentNotices(h.env, NOW), { sent: 0, failed: 0 });
  assert.equal(h.sent.length, 1);
  assert.equal(h.sent[0].to, "parent@example.test");
  assert.match(h.sent[0].subject, /didn't go through/);
  assert.match(h.sent[0].text, /full access until Thursday,? 29 October/);
  assert.match(h.sent[0].text, /\/parent\/plan/);
});

test("the owner hears about each missed payment in live mode only, with no family details", async () => {
  const live = setup({ owner: "owner@example.test" });
  await processPaymentNotices(live.env, NOW);
  const mail = live.sent.find(m => m.to === "owner@example.test");
  assert.ok(mail, "owner not emailed");
  assert.match(mail.text, /Families with a payment needing attention: 1/);
  assert.doesNotMatch(mail.text + mail.html, /Dragon|parent@example|Test family/);
  const sandbox = setup({ owner: "owner@example.test", live: false });
  await processPaymentNotices(sandbox.env, NOW);
  assert.deepEqual(sandbox.sent.map(m => m.to), ["parent@example.test"]);
});

test("when grace runs out without payment, the parent is told access is paused, once", async () => {
  const h = setup();
  await processPaymentNotices(h.env, NOW);
  const later = new Date(NOW.getTime() + 6 * DAY);
  assert.deepEqual(await processPaymentNotices(h.env, later), { sent: 1, failed: 0 });
  assert.match(h.sent[1].subject, /paused/);
  assert.match(h.sent[1].text, /Nothing has been deleted/);
  assert.deepEqual(await processPaymentNotices(h.env, new Date(later.getTime() + DAY)), { sent: 0, failed: 0 });
});

test("Stripe ending the subscription early after a missed payment also sends the paused email", async () => {
  const h = setup();
  await processPaymentNotices(h.env, NOW);
  h.setFamily("CANCELLED", at(2));
  assert.deepEqual(await processPaymentNotices(h.env, new Date(NOW.getTime() + 2.5 * DAY)), { sent: 1, failed: 0 });
  assert.match(h.sent[1].subject, /paused/);
});

test("paying again before grace ends means no paused email", async () => {
  const h = setup();
  await processPaymentNotices(h.env, NOW);
  h.setFamily("ACTIVE_MONTHLY", at(30));
  assert.deepEqual(await processPaymentNotices(h.env, new Date(NOW.getTime() + 6 * DAY)), { sent: 0, failed: 0 });
});

test("no paused email without a payment email first, or for an ordinary cancellation", async () => {
  // Already ended before this feature (no payment_failed email on record).
  const h = setup({ plan: "PAST_DUE", graceEnd: at(-1) });
  assert.deepEqual(await processPaymentNotices(h.env, NOW), { sent: 0, failed: 0 });
  const c = setup({ plan: "CANCELLED", graceEnd: at(-1) });
  assert.deepEqual(await processPaymentNotices(c.env, NOW), { sent: 0, failed: 0 });
});

test("a later missed payment is a new episode and emails again", async () => {
  const h = setup();
  await processPaymentNotices(h.env, NOW);
  h.setFamily("ACTIVE_MONTHLY", at(30));
  h.setFamily("PAST_DUE", at(37));
  assert.deepEqual(await processPaymentNotices(h.env, new Date(NOW.getTime() + 30 * DAY)), { sent: 1, failed: 0 });
});

test("suspended families and paid families get nothing", async () => {
  assert.deepEqual(await processPaymentNotices(setup({ suspended: true }).env, NOW), { sent: 0, failed: 0 });
  assert.deepEqual(await processPaymentNotices(setup({ plan: "ACTIVE_MONTHLY", graceEnd: at(20) }).env, NOW), { sent: 0, failed: 0 });
});
