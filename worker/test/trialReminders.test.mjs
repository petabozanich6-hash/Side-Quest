import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { isDue, processTrialReminders, trialReminderEmail } from "../src/trialReminders.ts";

const DAY = 86400000;
const NOW = new Date("2026-10-16T03:00:00.000Z");

function setup({ endOffset = 1.5, plan = "FREE_PREVIEW", sendingFails = false } = {}) {
  const db = makeDb(), sent = [];
  const end = new Date(NOW.getTime() + endOffset * DAY).toISOString();
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at) VALUES (?,?,?,?,?,?,?)")
    .run("f1","Test family","u1",new Date(NOW.getTime()-5*DAY).toISOString(),plan,new Date(NOW.getTime()-5*DAY).toISOString(),end);
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,created_at) VALUES(?,?,?,?,?)")
    .run("u1","f1","parent@example.test","Dragon Mum",NOW.toISOString());
  const env = { DB: db, EMAIL: { async send(mail) { sent.push(mail); if (sendingFails) throw Error("Email unavailable"); } } };
  return { db, env, sent };
}

test("due windows: two days left and first 24 hours after expiry only", () => {
  assert.equal(isDue("two_days_left",new Date(NOW.getTime()+1.5*DAY).toISOString(),NOW),true);
  assert.equal(isDue("two_days_left",new Date(NOW.getTime()+0.5*DAY).toISOString(),NOW),false);
  assert.equal(isDue("preview_ended",new Date(NOW.getTime()-0.1*DAY).toISOString(),NOW),true);
  assert.equal(isDue("preview_ended",new Date(NOW.getTime()-3*DAY).toISOString(),NOW),false);
});

test("Day 5 email uses the Side-Quest logo and is sent once even on repeat cron", async () => {
  const h=setup();
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:1,failed:0});
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:0});
  assert.equal(h.sent.length,1);
  assert.match(h.sent[0].subject,/Two days left/);
  assert.match(h.sent[0].html,/\/icons\/icon-192.png/);
  assert.match(h.sent[0].text,/not be charged automatically/);
  assert.equal(h.db.raw.prepare("SELECT status FROM trial_reminder_deliveries").get().status,"sent");
});

test("Day 7 expiry email preserves existing data and cannot resend", async () => {
  const h=setup({endOffset:-0.1});
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:1,failed:0});
  assert.equal(h.sent.length,1);
  assert.match(h.sent[0].subject,/has ended/);
  assert.match(h.sent[0].text,/saved work/);
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:0});
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM users").get().n,1);
});

test("paid or suspended families never receive preview reminders", async () => {
  const h=setup({plan:"ACTIVE_MONTHLY"});
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:0});
  h.db.raw.prepare("UPDATE families SET plan='FREE_PREVIEW'").run();
  h.db.raw.prepare("INSERT INTO family_admin_state(family_id,status) VALUES('f1','suspended')").run();
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:0});
  assert.equal(h.sent.length,0);
});

test("a failed delivery cannot be retried automatically and cause duplicates", async () => {
  const h=setup({sendingFails:true});
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:1});
  assert.deepEqual(await processTrialReminders(h.env,NOW),{sent:0,failed:0});
  assert.equal(h.sent.length,1);
  assert.equal(h.db.raw.prepare("SELECT status FROM trial_reminder_deliveries").get().status,"failed");
});

test("email copy never describes a mandatory subscription", () => {
  for(const kind of ["two_days_left","preview_ended"]) {
    const message=trialReminderEmail(kind,"parent@example.test","Dragon Mum",NOW.toISOString());
    assert.match(message.text,/optional Family Membership|membership is optional/i);
    assert.match(message.text,/will not be charged automatically/i);
    assert.ok(!message.text.includes("credit card required"));
  }
});
