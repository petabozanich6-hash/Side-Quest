import test from "node:test";
import assert from "node:assert/strict";
import { sign } from "hono/jwt";
import { makeDb } from "./fakeD1.mjs";
import { createSoftAuthenticator } from "./softAuthenticator.mjs";
import worker from "../src/index.ts";
import { processAnnouncementBatch, ensureAnnouncementSchema, announcementEmail } from "../src/announcements.ts";

const BASE="http://localhost:8787";
const PW="SuperSecretPass12!";
function harness(){
  const db=makeDb(),env={DB:db,JWT_SECRET:"broadcast-test-secret"};
  const ctx={waitUntil(){},passThroughOnException(){}};
  async function call(path,{method="GET",token,body,admin=true,origin=BASE}={}){
    const headers={"content-type":"application/json"};
    if(token)headers.authorization="Bearer "+token;
    if(method!=="GET"){headers.origin=origin;if(admin)headers["x-sidequest-admin"]="1";}
    const response=await worker.fetch(new Request(BASE+"/api"+path,{
      method,headers,body:body?JSON.stringify(body):undefined
    }),env,ctx);
    let data;try{data=await response.json();}catch{data=null;}
    return {status:response.status,data};
  }
  async function register(n){
    const email=n+"@example.com";
    const r=await call("/auth/register",{method:"POST",admin:false,body:{email,password:PW,name:n,jurisdiction:"NSW"}});
    assert.equal(r.status,200,JSON.stringify(r.data));
    return {email,token:r.data.token,id:r.data.user.id,family_id:r.data.user.family_id};
  }
  async function ownerSetup(){
    const owner=await register("owner-email-test");
    db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(),owner.id);
    const auth=await createSoftAuthenticator();
    const reg=await call("/admin/security/passkeys/register/options",{token:owner.token,method:"POST",body:{password:PW}});
    assert.equal(reg.status,200);
    const verify=await call("/admin/security/passkeys/register/verify",{token:owner.token,method:"POST",body:{response:auth.register(reg.data.options,BASE),label:"Test"}});
    assert.equal(verify.status,201);
    const challenge=await call("/admin/security/step-up/options",{token:owner.token,method:"POST"});
    assert.equal(challenge.status,200);
    const done=await call("/admin/security/step-up/verify",{token:owner.token,method:"POST",body:{response:await auth.authenticate(challenge.data.options,BASE,"localhost")}});
    assert.equal(done.status,200);
    return owner;
  }
  return {db,env,ctx,call,register,ownerSetup};
}
const draft=(kind,count,id=crypto.randomUUID())=>({
  kind,subject:"Side-Quest important platform update",
  body:"Our platform is having a short planned maintenance window. No learning work will be lost.",
  idempotency_key:id,expected_recipients:count,confirmation:"SEND "+count+" PARENTS",
  non_promotional_confirmed:true,consent_confirmed:true
});

test("only an unlocked Owner can broadcast, preview + typed confirmation required",async()=>{
  const h=harness();
  const o=await h.ownerSetup(),other=await h.register("other-parent");
  let r=await h.call("/admin/announcements",{token:other.token});
  assert.equal(r.status,404);
  r=await h.call("/admin/announcements",{token:o.token});
  assert.equal(r.status,200);
  assert.equal(r.data.service_recipients,2);
  assert.equal(r.data.opted_in_recipients,0,"optional news is off by default");
  r=await h.call("/admin/announcements",{method:"POST",token:other.token,body:draft("service",2)});
  assert.equal(r.status,404);
  r=await h.call("/admin/announcements",{method:"POST",token:o.token,body:{...draft("service",2),confirmation:"SEND"}});
  assert.equal(r.status,400);
  r=await h.call("/admin/announcements",{method:"POST",token:o.token,body:{...draft("service",2),non_promotional_confirmed:false}});
  assert.equal(r.status,400);
  r=await h.call("/admin/announcements",{method:"POST",token:o.token,origin:"https://attacker.example",body:draft("service",2)});
  assert.equal(r.status,403);
  r=await h.call("/admin/announcements",{method:"POST",token:o.token,body:draft("service",2)});
  assert.equal(r.status,503,"missing Cloudflare EMAIL binding fails closed");
});

test("optional announcements need consent; individual emails, unsubscribe, idempotency and history",async()=>{
  const h=harness(),owner=await h.ownerSetup();
  const alice=await h.register("ann-alice"),bob=await h.register("ann-bob");
  const sent=[];
  h.env.EMAIL={send:async msg=>{sent.push(msg);return {messageId:"sent"}}};
  let r=await h.call("/announcements/preferences",{token:alice.token,admin:false});
  assert.equal(r.status,200);assert.equal(r.data.optional_announcements,false);
  r=await h.call("/announcements/preferences",{token:alice.token,admin:false,method:"POST",body:{optional_announcements:true}});
  assert.equal(r.status,200);assert.equal(r.data.optional_announcements,true);
  r=await h.call("/admin/announcements",{token:owner.token});
  assert.equal(r.data.opted_in_recipients,1);
  assert.equal(r.data.service_recipients,3);
  const d=draft("optional",1);
  r=await h.call("/admin/announcements/preview",{token:owner.token,method:"POST",body:d});
  assert.equal(r.status,200);assert.equal(r.data.recipients,1);
  r=await h.call("/admin/announcements",{token:owner.token,method:"POST",body:d});
  assert.equal(r.status,201,JSON.stringify(r.data));
  const id=r.data.id;
  r=await h.call("/admin/announcements",{token:owner.token,method:"POST",body:d});
  assert.equal(r.status,200);assert.equal(r.data.id,id);assert.equal(r.data.already_queued,true);
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) n FROM announcement_recipients").get().n,1);
  assert.equal(sent.length,0,"queueing itself does not send emails");
  const batch=await processAnnouncementBatch(h.env);
  assert.equal(batch.processed,1);
  assert.equal(sent.length,1);
  assert.equal(sent[0].to,alice.email);
  assert.ok(sent[0].html.includes("Side-Quest Learning logo"));
  assert.ok(sent[0].html.includes("/icons/icon-192.png"));
  assert.ok(sent[0].html.includes("Unsubscribe from optional announcements"));
  assert.ok(!JSON.stringify(sent).includes(bob.email));
  const token=h.db.raw.prepare("SELECT unsubscribe_token FROM announcement_email_preferences WHERE user_id=?").get(alice.id).unsubscribe_token;
  const confirmPage=await worker.fetch(new Request(BASE+"/api/announcements/unsubscribe?token="+token),h.env,h.ctx);
  assert.equal(confirmPage.status,200);
  assert.equal(h.db.raw.prepare("SELECT opted_in FROM announcement_email_preferences WHERE user_id=?").get(alice.id).opted_in,1,"GET does not unsubscribe");
  const unsub=await worker.fetch(new Request(BASE+"/api/announcements/unsubscribe",{
    method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({token}).toString()
  }),h.env,h.ctx);
  assert.equal(unsub.status,200);
  assert.equal(h.db.raw.prepare("SELECT opted_in FROM announcement_email_preferences WHERE user_id=?").get(alice.id).opted_in,0);
  r=await h.call("/admin/announcements",{token:owner.token});
  assert.equal(r.data.opted_in_recipients,0);
  assert.equal(r.data.broadcasts[0].sent,1);
  assert.equal(r.data.broadcasts[0].status,"completed");
  assert.equal((await processAnnouncementBatch(h.env)).processed,0,"no duplicate sends");
});

test("service broadcast is limited to participating parents; opt-outs block queued optional email; cancelling is safe",async()=>{
  const h=harness(),owner=await h.ownerSetup(),alice=await h.register("active-parent");
  const former=await h.register("cancelled-parent"),suspended=await h.register("suspended-parent");
  const sent=[];
  h.env.EMAIL={send:async m=>{sent.push(m);}};
  h.db.raw.prepare("UPDATE families SET plan='CANCELLED' WHERE id=?").run(former.family_id);
  h.db.raw.prepare("INSERT INTO family_admin_state(family_id,status,updated_at) VALUES(?,'suspended',?)").run(suspended.family_id,new Date().toISOString());
  let r=await h.call("/admin/announcements",{token:owner.token});
  assert.equal(r.data.service_recipients,2);
  const d=draft("service",2);
  r=await h.call("/admin/announcements",{token:owner.token,method:"POST",body:d});
  assert.equal(r.status,201,JSON.stringify(r.data));
  const cancel=await h.call("/admin/announcements/"+r.data.id+"/cancel",{method:"POST",token:owner.token});
  assert.equal(cancel.status,200);
  assert.equal((await processAnnouncementBatch(h.env)).processed,0);
  assert.equal(sent.length,0);
  await h.call("/announcements/preferences",{token:alice.token,admin:false,method:"POST",body:{optional_announcements:true}});
  const opt=draft("optional",1);
  r=await h.call("/admin/announcements",{token:owner.token,method:"POST",body:opt});
  assert.equal(r.status,201,JSON.stringify(r.data));
  await h.call("/announcements/preferences",{token:alice.token,admin:false,method:"POST",body:{optional_announcements:false}});
  await processAnnouncementBatch(h.env);
  assert.equal(sent.length,0,"unsubscribe after queuing but before sending must be honoured");
  assert.equal(h.db.raw.prepare("SELECT status FROM announcement_recipients WHERE broadcast_id=?").get(r.data.id).status,"skipped");
});

test("announcement HTML escapes owner-entered markup and preserves lines",()=>{
  const email=announcementEmail("optional","Important <update>","Safe message\n<script>alert(1)</script>","https://sidequestlearning.app/api/announcements/unsubscribe?token=abc");
  assert.ok(!email.html.includes("<script>"));
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(email.html.includes("Safe message<br/>"));
  assert.ok(!email.html.includes("onerror="));
});
