import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {unifiedPortalPilot,verifiedPortalIdentity} from "../src/unifiedPortalIdentity.ts";
test("canonical portal identity is verified parent only and independent of homeschool plan",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const stamp="2026-11-26T00:00:00.000Z";
 for(const [family,user,email,plan,verified] of [["f1","u1","one@example.com","PREVIEW_EXPIRED",stamp],["f2","u2","two@example.com","INTERNAL",stamp],["f3","u3","three@example.com","FREE_PREVIEW",null]]){
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run(family,family,user,stamp,plan);
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run(user,family,email,user,stamp,verified);
 }
 db.raw.prepare("INSERT INTO support_account_intents(family_id,registration_intent,created_at) VALUES(?,'support_only',?)").run("f1",stamp);
 const actor=(id,family_id,role="parent")=>({id,family_id,role,name:"irrelevant"});
 const support=await verifiedPortalIdentity(db,actor("u1","f1"));
 assert.equal(support.family_id,"f1");assert.equal(support.registration_intent,"support_only");assert.equal(support.homeschool.plan,"PREVIEW_EXPIRED");assert.equal(support.homeschool.limits.canCreate,false);
 const subscriber=await verifiedPortalIdentity(db,actor("u2","f2"));assert.equal(subscriber.registration_intent,"homeschool");assert.equal(subscriber.homeschool.limits.canCreate,true);
 assert.equal(await verifiedPortalIdentity(db,actor("u1","f2")),null);
 assert.equal(await verifiedPortalIdentity(db,actor("u1","f1","child")),null);
 assert.equal(await verifiedPortalIdentity(db,actor("u3","f3")),null);
 db.raw.prepare("INSERT INTO family_admin_state(family_id,status,auth_version,updated_at) VALUES(?,'suspended',1,?)").run("f1",stamp);
 assert.equal(await verifiedPortalIdentity(db,actor("u1","f1")),null);
});
test("unified portal fails closed outside explicitly enabled private staging",()=>{
 assert.equal(unifiedPortalPilot({SUPPORT_UNIFIED_PORTAL_TEST:"true"}),false);
 assert.equal(unifiedPortalPilot({STAGING_KEY:"test",STAGING_PRIVATE:"true"}),false);
 assert.equal(unifiedPortalPilot({STAGING_KEY:"test",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true"}),true);
});
