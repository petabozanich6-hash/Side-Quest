import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";

const origin = "http://localhost:8787";
const password = "Definitely8Chars";
function fixture(required = true, mailEnabled = true) {
  const DB = makeDb();
  const mails = [];
  const env = {
    DB, JWT_SECRET: "only-for-integration-tests",
    ...(required ? { EMAIL_VERIFICATION_REQUIRED: "true" } : {}),
    ...(mailEnabled ? { EMAIL: { send: async (m) => { mails.push(m); return {messageId:"test"}; } } } : {}),
  };
  const ctx = {waitUntil() {}, passThroughOnException() {}};
  async function call(route, body) {
    const response = await worker.fetch(new Request(origin + "/api" + route, {
      method: "POST", headers: {"content-type": "application/json"},
      body: JSON.stringify(body),
    }), env, ctx);
    return { status: response.status, json: await response.json() };
  }
  return { DB, env, mails, call };
}
const register = { email:"new-quest@example.com", name:"Parent", password, jurisdiction:"NSW" };

test("gated family cannot sign in until mailed, single-use verification; 7-day preview begins on confirmation", async () => {
  const h=fixture();
  const created=await h.call("/auth/register",register);
  assert.equal(created.status,200);
  assert.equal(created.json.verification_required,true);
  assert.equal(created.json.token,undefined);
  assert.equal(h.mails.length,1);
  let login=await h.call("/auth/login",{email:register.email,password});
  assert.equal(login.status,403);
  assert.equal(login.json.code,"EMAIL_VERIFICATION_REQUIRED");
  const token=h.mails[0].text.match(/#token=([A-Za-z0-9_-]+)/)?.[1];
  assert.ok(token,"email contains a single-use link fragment");
  const before=h.DB.raw.prepare("SELECT trial_started_at, trial_ends_at FROM families LIMIT 1").get();
  const confirmed=await h.call("/auth/verify-email",{token});
  assert.equal(confirmed.status,200);
  assert.equal((await h.call("/auth/verify-email",{token})).status,400,"token cannot be replayed");
  login=await h.call("/auth/login",{email:register.email,password});
  assert.equal(login.status,200);
  assert.ok(login.json.token);
  const after=h.DB.raw.prepare("SELECT trial_started_at, trial_ends_at FROM families LIMIT 1").get();
  assert.ok(Date.parse(after.trial_started_at)>=Date.parse(before.trial_started_at));
  assert.equal(Date.parse(after.trial_ends_at)-Date.parse(after.trial_started_at),7*86400000);
  assert.equal(h.DB.raw.prepare("SELECT email_verified_at FROM users LIMIT 1").get().email_verified_at!=null,true);
});

test("new signups fail closed without an email sender and create no family", async () => {
  const h=fixture(true,false);
  const res=await h.call("/auth/register",register);
  assert.equal(res.status,503);
  assert.equal(h.DB.raw.prepare("SELECT COUNT(*) n FROM families").get().n,0);
});

test("legacy family can still sign in with verification enabled; pending user can resend without logging in", async () => {
  const h=fixture(false);
  const legacy=await h.call("/auth/register",{...register,email:"older@example.com"});
  assert.equal(legacy.status,200);
  h.env.EMAIL_VERIFICATION_REQUIRED="true";
  const login=await h.call("/auth/login",{email:"older@example.com",password});
  assert.equal(login.status,200);
  await h.call("/auth/register",register);
  const before=h.mails.length;
  const resent=await h.call("/auth/verify-email/resend",{email:register.email});
  assert.equal(resent.status,200);
  assert.equal(h.mails.length,before+1);
  const unknown=await h.call("/auth/verify-email/resend",{email:"no-such-person@example.com"});
  assert.equal(unknown.status,200);
  assert.deepEqual(unknown.json,resent.json,"avoid email-account enumeration");
});
