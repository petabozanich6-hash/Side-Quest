import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import worker from "../src/index.ts";
import {authEmailOrigin} from "../src/authEmailOrigin.ts";
const email="portal-test@example.com",origin="https://side-quest-staging.test.workers.dev",password="PortalTestPassword42";
function fixture(){
 const DB=makeDb(),mails=[],env={DB,JWT_SECRET:"integration-test-only",STAGING_KEY:"test-gate",STAGING_PRIVATE:"true",SUPPORT_GUEST_ORIGIN:origin,SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:email,EMAIL:{send:async m=>{mails.push(m);return {messageId:"test"};}}};
 const ctx={waitUntil(){},passThroughOnException(){}};
 async function call(route,body,token){
  const response=await worker.fetch(new Request(origin+"/api"+route,{method:body===undefined?"GET":"POST",headers:{"content-type":"application/json",cookie:"sq_staging=test-gate",...(token?{authorization:"Bearer "+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),env,ctx);
  return {status:response.status,json:await response.json()};
 }
 return {DB,mails,env,call};
}
test("support-only signup creates an uncredentialed family; inbox owner sets password and keeps independent entitlements",async t=>{
 const h=fixture();t.after(()=>h.DB.raw.close());
 const input={email,name:"Test Parent",jurisdiction:"NSW",password:"IgnoredAttackerPassword123",plan:"INTERNAL"};
 const result=await h.call("/auth/support-register",input);
 assert.equal(result.status,200);assert.equal(result.json.token,undefined);
 const family=h.DB.raw.prepare("SELECT id,plan,trial_started_at,trial_ends_at FROM families").get();
 assert.equal(family.plan,"PREVIEW_EXPIRED");assert.equal(family.trial_started_at,null);assert.equal(family.trial_ends_at,null);
 const user=h.DB.raw.prepare("SELECT password_hash,email_verified_at FROM users").get();assert.equal(user.password_hash,null);assert.equal(user.email_verified_at,null);
 assert.equal(h.mails.length,1);assert.ok(h.mails[0].text.includes(origin+"/reset-password?token="));
 const token=h.mails[0].text.match(/token=([A-Za-z0-9_-]+)/)?.[1];assert.ok(token);
 assert.equal((await h.call("/auth/login",{email,password:input.password})).status,401);
 const duplicate=await h.call("/auth/support-register",input);assert.deepEqual(duplicate.json,result.json);
 assert.equal(h.DB.raw.prepare("SELECT COUNT(*) n FROM families").get().n,1);assert.equal(h.mails.length,1);
 assert.equal((await h.call("/auth/reset-password",{token,password})).status,200);
 assert.equal((await h.call("/auth/reset-password",{token,password:input.password})).status,400);
 const login=await h.call("/auth/login",{email,password});assert.equal(login.status,200);assert.ok(login.json.token);
 const portal=await h.call("/family-portal/identity",undefined,login.json.token);
 assert.equal(portal.status,200);assert.equal(portal.json.family_id,family.id);assert.equal(portal.json.registration_intent,"support_only");assert.equal(portal.json.homeschool.plan,"PREVIEW_EXPIRED");assert.equal(portal.json.homeschool.limits.canCreate,false);
 assert.equal((await h.call("/students",{name:"Test learner",username:"test-learner",stage:"S2",pin:"1234"},login.json.token)).status,402);
 assert.equal((await h.call("/family-portal/identity")).status,401);
 assert.equal(h.DB.raw.prepare("SELECT trial_started_at FROM families WHERE id=?").get(family.id).trial_started_at,null);
});
test("private signup is closed without pilot and for any unapproved recipient",async t=>{
 const h=fixture();t.after(()=>h.DB.raw.close());
 const b={name:"Test Parent",jurisdiction:"NSW",email};
 h.env.SUPPORT_UNIFIED_PORTAL_TEST="false";assert.equal((await h.call("/auth/support-register",b)).status,404);
 h.env.SUPPORT_UNIFIED_PORTAL_TEST="true";assert.equal((await h.call("/auth/support-register",{...b,email:"unapproved@example.com"})).status,403);
 h.env.SUPPORT_GUEST_ORIGIN="https://sidequestlearning.app";assert.equal((await h.call("/auth/support-register",b)).status,503);
 assert.equal(h.DB.raw.prepare("SELECT COUNT(*) n FROM families").get().n,0);
 assert.equal(h.mails.length,0);
});
test("account email origin fails closed in misconfigured staging",()=>{
 assert.equal(authEmailOrigin({STAGING_KEY:"test",STAGING_PRIVATE:"true",SUPPORT_GUEST_ORIGIN:origin}),origin);
 assert.equal(authEmailOrigin({STAGING_PRIVATE:"true"}),null);
 assert.equal(authEmailOrigin({STAGING_KEY:"test",SUPPORT_GUEST_ORIGIN:"https://sidequestlearning.app"}),null);
 assert.equal(authEmailOrigin({STAGING_KEY:"test",SUPPORT_GUEST_ORIGIN:origin+"/evil"}),null);
});
