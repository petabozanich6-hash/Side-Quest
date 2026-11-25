import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {familyOverview} from "../src/unifiedPortalOverview.ts";
import {addPortalLearner} from "../src/unifiedPortalLearners.ts";
import {submitPortalEnquiry} from "../src/unifiedPortalIntake.ts";
const stamp="2026-11-26T00:00:00.000Z";
const start="2030-01-02T00:00:00.000Z",end="2030-01-02T00:30:00.000Z";
async function fixture(t){
 const db=makeDb();t.after(()=>db.raw.close());
 const actors=[];
 for(const n of [1,2]){
  const family="f"+n,user="u"+n,email="parent"+n+"@example.com";
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run(family,family,user,stamp,"PREVIEW_EXPIRED");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run(user,family,email,user,stamp,stamp);
  const actor={id:user,family_id:family,role:"parent",name:user};actors.push(actor);
  const learner=await addPortalLearner(db,actor,{label:"Learner "+n,request_key:"profile"});
  const body={learner_id:learner.id,request_key:"tutor",kind:"tutoring",year:"Year 3",subject:"English",service:"Live online support",detail:"Practise reading comprehension.",consent:true};
  const r=await submitPortalEnquiry(db,actor,body);assert.ok(r.id);
  db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,'guest',?,?,2500,'Scope','Live','Terms','live',?,?,'confirmed',?,?)").run("o"+n,r.id,"q"+n,start,end,stamp,stamp);
  db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES(?,?,?,?,?)").run("o"+n,"INV-"+n,start,stamp,user);
  db.raw.prepare("INSERT INTO support_guest_messages(id,request_id,sender,body,created_at) VALUES(?,?,'owner','PRIVATE MESSAGE',?)").run("m"+n,r.id,stamp);
  const c=await submitPortalEnquiry(db,actor,{...body,kind:"english-club",request_key:"club"});assert.ok(c.id);
  if(n===1)db.raw.prepare("INSERT INTO support_english_classes(id,week_of,start_at,end_at,topic,preparation,created_at) VALUES('class','2029-12-31',?,?,'Stories','PRIVATE PREP',?)").run(start,end,stamp);
  db.raw.prepare("INSERT INTO support_english_enrolments(id,class_id,request_id,learner_label,status,payment_due_at,created_at) VALUES(?,'class',?,?,'paid',?,?)").run("seat"+n,c.id,"Learner "+n,start,stamp);
 }
 return {db,one:actors[0],two:actors[1]};
}
test("account summary returns only the claimant's orders, invoices, club seats and correspondence metadata",async t=>{
 const {db,one,two}=await fixture(t);
 const a=await familyOverview(db,one),b=await familyOverview(db,two);
 assert.deepEqual(a.orders.map(o=>o.id),["o1"]);
 assert.deepEqual(b.orders.map(o=>o.id),["o2"]);
 assert.deepEqual(a.clubs.map(o=>o.id),["seat1"]);
 assert.equal(a.orders[0].invoice_reference,"INV-1");assert.equal(a.orders[0].amount_cents,2500);
 assert.equal(a.threads.length,2);assert.equal(a.threads.reduce((n,r)=>n+r.message_count,0),1);
 assert.equal(JSON.stringify(a).includes("PRIVATE"),false);
 assert.equal(JSON.stringify(a).includes("INV-2"),false);
 assert.equal(a.limited,false);
 assert.equal(await familyOverview(db,{...one,role:"child"}),null);
 assert.equal(await familyOverview(db,{...one,family_id:two.family_id}),null);
});
test("member history and explicitly claimed legacy history are visible only to their own parent",async t=>{
 const {db,one,two}=await fixture(t);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('member',?,?,'other','Member support','PRIVATE','learning-support',?,?)").run(one.family_id,one.id,stamp,stamp);
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES('old','parent1@example.com','Parent','Legacy support','PRIVATE',?,?)").run(stamp,stamp);
 assert.equal((await familyOverview(db,one)).threads.some(r=>r.id==="old"),false);
 const g=db.raw.prepare("SELECT id FROM support_guest_families WHERE email='parent1@example.com'").get();
 db.raw.prepare("INSERT INTO support_family_claims(guest_family_id,family_id,parent_user_id,claimed_at) VALUES(?,?,?,?)").run(g.id,one.family_id,one.id,stamp);
 const a=await familyOverview(db,one);assert.equal(a.threads.filter(r=>r.source==="legacy").length,1);assert.equal(a.threads.filter(r=>r.source==="member").length,1);assert.equal(a.threads.filter(r=>r.source==="portal").length,2);
 assert.equal((await familyOverview(db,two)).threads.some(r=>["member","old"].includes(r.id)),false);
});
