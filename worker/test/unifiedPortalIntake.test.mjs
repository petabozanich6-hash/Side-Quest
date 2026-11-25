import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import worker from "../src/index.ts";
import {submitPortalEnquiry} from "../src/unifiedPortalIntake.ts";
import {addPortalLearner} from "../src/unifiedPortalLearners.ts";
import {portalEnquiryOwner,ownsPortalEnquiry} from "../src/unifiedPortalRequestAccess.ts";
import {linkedLegacyRequests,linkedLegacyRequest} from "../src/unifiedPortalLegacy.ts";
const stamp="2026-11-26T00:00:00.000Z",origin="https://side-quest-staging.test.workers.dev";
const digest=async(s)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
async function fixture(t){
 const DB=makeDb();t.after(()=>DB.raw.close());
 const env={DB,JWT_SECRET:"test-only",STAGING_KEY:"test-gate",STAGING_PRIVATE:"true",SUPPORT_GUEST_ORIGIN:origin,SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_GUEST_ENABLED:"true"};
 const ctx={waitUntil(){},passThroughOnException(){}};
 const call=async(path,body,token,guest)=>{const r=await worker.fetch(new Request(origin+"/api"+path,{method:body===undefined?"GET":"POST",headers:{cookie:"sq_staging=test-gate","content-type":"application/json",...(token?{authorization:"Bearer "+token}:{}),...(guest?{"X-SideQuest-Guest":guest}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),env,ctx);return {status:r.status,data:await r.json()};};
 const accounts=[];
 for(let n=1;n<=2;n++){
  const email="family"+n+"@example.com";
  const r=await call("/auth/register",{name:"Parent "+n,email,password:"ExamplePassword123",jurisdiction:"NSW"});
  assert.equal(r.status,200);
  const user=r.data.user;
  DB.raw.prepare("UPDATE users SET email_verified_at=? WHERE id=?").run(stamp,user.id);
  const l=await addPortalLearner(DB,user,{label:"Learner "+n,year_level:"Year 3",request_key:"first"});
  assert.ok(l?.id);
  accounts.push({actor:user,token:r.data.token,learner:l.id,email});
 }
 return {DB,call,one:accounts[0],two:accounts[1]};
}
const form=(learner_id,key="enquiry-one")=>({learner_id,request_key:key,kind:"tutoring",year:"Year 3",subject:"Mathematics",service:"Live online support",detail:"Help with division and confidence.",interests:"Animals",consent:true});
test("new intake preserves existing service channel, derives identity, rejects other learners and retries safely",async t=>{
 const {DB,one,two,call}=await fixture(t);
 assert.ok("error" in await submitPortalEnquiry(DB,one.actor,form(two.learner)));
 assert.ok("error" in await submitPortalEnquiry(DB,one.actor,{...form(one.learner),consent:false}));
 const body={...form(one.learner),email:two.email,parent_name:"Forged parent",family_id:two.actor.family_id};
 const first=await call("/family-portal/enquiries/submit",body,one.token);assert.equal(first.status,201);
 const id=first.data.id;
 const retry=await call("/family-portal/enquiries/submit",body,one.token);assert.equal(retry.status,200);assert.equal(retry.data.id,id);
 assert.equal((await call("/family-portal/enquiries/submit",{...body,detail:"Different request details."},one.token)).status,400);
 const row=DB.raw.prepare("SELECT email,parent_name,message,subject FROM support_guest_requests WHERE id=?").get(id);
 assert.equal(row.email,one.email);assert.equal(row.parent_name,"Parent 1");assert.match(row.message,/Learner: Learner 1/);assert.match(row.message,/Animals/);
 const club=await call("/family-portal/enquiries/submit",{...form(one.learner,"club"),kind:"english-club"},one.token);assert.equal(club.status,201);
 assert.match(DB.raw.prepare("SELECT subject FROM support_guest_requests WHERE id=?").get(club.data.id).subject,/^English Club: /);
 assert.equal((await call("/family-portal/enquiries/list",undefined,one.token)).data.requests.length,2);
 assert.equal((await call("/family-portal/enquiries/list",undefined,two.token)).data.requests.length,0);
 assert.equal((await call("/family-portal/enquiries/detail/"+id,undefined,two.token)).status,404);
 assert.equal((await call("/family-portal/enquiries/detail/"+id,undefined,one.token)).status,200);
 assert.equal(DB.raw.prepare("SELECT COUNT(*) n FROM support_guest_requests").get().n,2);
});
test("canonical enquiries cannot fall back to guest-only identity, including after mapping deletion",async t=>{
 const {DB,one,two,call}=await fixture(t);
 const r=await submitPortalEnquiry(DB,one.actor,form(one.learner));assert.ok(r.id);
 const id=r.id,guest="a".repeat(64);
 DB.raw.prepare("INSERT INTO support_guest_sessions(token_hash,email,expires_at) VALUES(?,?,?)").run(await digest(guest),one.email,new Date(Date.now()+3600000).toISOString());
 const oldId="legacy-example";
 DB.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run(oldId,one.email,"Parent 1","Legacy request","Old request",stamp,stamp);
 const g=DB.raw.prepare("SELECT id FROM support_guest_families WHERE email=?").get(one.email).id;
 DB.raw.prepare("INSERT INTO support_family_claims(guest_family_id,family_id,parent_user_id,claimed_at) VALUES(?,?,?,?)").run(g,one.actor.family_id,one.actor.id,stamp);
 const list=await call("/support-guest/requests",undefined,undefined,guest);assert.equal(list.status,200);assert.deepEqual(list.data.requests.map(x=>x.id),[oldId]);
 assert.equal((await call("/support-guest/requests/"+id+"/orders",undefined,undefined,guest)).status,401);
 assert.equal((await call("/support-guest/requests/"+id+"/orders",undefined,two.token,guest)).status,401);
 assert.equal((await call("/support-guest/requests/"+id+"/orders",undefined,one.token)).status,200);
 assert.deepEqual((await linkedLegacyRequests(DB,one.actor)).map(x=>x.id),[oldId]);
 assert.equal(await linkedLegacyRequest(DB,one.actor,id),null);
 DB.raw.prepare("DELETE FROM support_portal_enquiries WHERE request_id=?").run(id);
 assert.ok(await portalEnquiryOwner(DB,id));assert.equal(await ownsPortalEnquiry(DB,one.actor,id),false);
 assert.equal((await call("/support-guest/requests/"+id+"/orders",undefined,undefined,guest)).status,401);
 assert.equal((await call("/support-guest/requests",undefined,undefined,guest)).data.requests.length,1);
});
