import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {familyIssuedSquareInvoice,familyIssuedSquareInvoiceSummaries} from "../src/unifiedPortalSquareInvoices.ts";
import {previewSupportInvoice} from "../src/supportSquareInvoicePreview.ts";
import {prepareSupportInvoiceIntent} from "../src/supportSquareInvoiceIntent.ts";
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

test("issued sandbox invoice link is scoped to the exact verified parent and rechecked before exposure",async t=>{
 const {db,one,two}=await fixture(t);
 const now=new Date(stamp),due="2026-11-27T01:00:00.000Z",link="https://squareupsandbox.com/pay-invoice/invtmp:INV1";
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"parent1@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};
 db.raw.prepare("DELETE FROM support_manual_invoices WHERE order_id='o1'").run();
 const order=db.raw.prepare("SELECT request_id FROM support_service_orders WHERE id='o1'").get();
 let remoteStatus="UNPAID",completed=0,version=1,remoteLink=link,calls=0;
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o1'").get();
 const provider=async(url,init)=>{
  calls++;assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"parent1@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"OPEN",total_money:{currency:"AUD",amount:2500}}}));
  assert.ok(url.endsWith("/invoices/INV1"));
  return new Response(JSON.stringify({invoice:{id:"INV1",version,location_id:"LOCATION123",order_id:"REMOTE1",status:remoteStatus,delivery_method:"EMAIL",public_url:remoteLink,primary_recipient:{customer_id:"CUST1",email_address:"parent1@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
 };
 const b={reviewed:true,customer_id:"CUST1",due_at:due};
 const p=await previewSupportInvoice(env,"guest",order.request_id,"o1",b,provider,now);
 assert.ok(p.fingerprint);
 assert.equal((await prepareSupportInvoiceIntent(env,"guest",order.request_id,"o1","owner",{...b,confirmed:true,fingerprint:p.fingerprint},provider,now)).prepared,true);
 assert.deepEqual(await familyIssuedSquareInvoiceSummaries(env,one),[]);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url=? WHERE order_id='o1'").run(stamp,stamp,link);
 const summary=await familyIssuedSquareInvoiceSummaries(env,one);
 assert.deepEqual(summary,[{id:"o1",amount_cents:2500,due_at:due,issued_at:stamp}]);
 assert.deepEqual(await familyIssuedSquareInvoiceSummaries(env,two),[]);
 const run=(actor=one,at=now,e=env)=>familyIssuedSquareInvoice(e,actor,"o1",provider,at);
 const before=calls;assert.equal(await run(two),null);assert.equal(await run({...one,role:"child"}),null);assert.equal(await run({...one,family_id:two.family_id}),null);assert.equal(calls,before);
 const opened=await run();assert.equal(opened.payment_url,link);assert.equal(opened.status,"unpaid");assert.equal(JSON.stringify(opened).includes("INV1"),true);assert.equal("provider_invoice_id" in opened,false);
 remoteStatus="PAID";completed=2500;assert.equal((await run()).payment_url,null);assert.equal((await run()).status,"payment_review");
 remoteStatus="PARTIALLY_PAID";completed=1000;assert.equal((await run()).payment_url,null);
 remoteStatus="UNPAID";completed=0;version=2;assert.equal((await run()).payment_url,null);version=1;
 remoteLink="https://evil.example/pay-invoice/INV1";assert.equal((await run()).payment_url,null);remoteLink=link;
 assert.equal((await run(one,new Date(due))).status,"deadline_passed");
 assert.equal(await run(one,now,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}),null);
 db.raw.prepare("UPDATE users SET email_verified_at=NULL WHERE id=?").run(one.id);assert.equal(await run(),null);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o1'").get().status,"confirmed");
});
