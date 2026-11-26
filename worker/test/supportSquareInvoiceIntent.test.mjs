import {handleSquareEvent,squareConfig,verifySquareSignature} from "../src/square.ts";
import {familyIssuedSquareInvoice} from "../src/unifiedPortalSquareInvoices.ts";
import {resolveFullyRefundedSupportInvoice,recheckIssuedSupportInvoices} from "../src/supportSquareInvoiceResolution.ts";
import {processSquareInvoiceNotices} from "../src/supportSquareInvoiceNotices.ts";
import {ownerSquareInvoiceWorkspace} from "../src/supportSquareInvoiceWorkspace.ts";
import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {previewSupportInvoice} from "../src/supportSquareInvoicePreview.ts";
import {prepareSupportInvoiceIntent,releasePreparedSupportInvoiceIntent} from "../src/supportSquareInvoiceIntent.ts";
import {createPreparedSupportSquareOrder} from "../src/supportSquareInvoiceOrder.ts";
import {createPreparedSupportSquareDraft} from "../src/supportSquareInvoiceDraft.ts";
import {inspectPreparedSupportSquareInvoice,recoverPreparedSupportSquareRecord} from "../src/supportSquareInvoiceReconcile.ts";
import {publishPreparedSupportSquareInvoice} from "../src/supportSquareInvoicePublish.ts";
import {verifyIssuedSupportSquarePayment,flagIssuedSupportInvoiceRefund,flagIssuedSupportInvoiceDispute,reconcileSupportInvoiceEvent} from "../src/supportSquareInvoiceSettlement.ts";
import {releaseVerifiedUnpaidSquareInvoice,recordInvoiceReview} from "../src/supportSquareInvoiceReview.ts";
import {ownerToday} from "../src/unifiedOwnerToday.ts";
import {prepareSupportCheckout} from "../src/supportCheckout.ts";
import {cancelUnstartedOrder,recordManualInvoice} from "../src/supportOrders.ts";
test("approved invoice intent is durable, duplicate-safe and never issues a provider invoice",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};
 let calls=0;const provider=async(url,init)=>{calls++;assert.equal(init.method,"GET");assert.equal(url,"https://connect.squareupsandbox.com/v2/customers/CUST1");return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));};
 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 const preview=await previewSupportInvoice(env,"member","r","o",b,provider,now);assert.ok(preview.fingerprint);
 const approved={...b,confirmed:true,fingerprint:preview.fingerprint};
 const run=(body=approved,e=env)=>prepareSupportInvoiceIntent(e,"member","r","o","owner",body,provider,now);
 const rows=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents").all();
 assert.ok("error" in await run({...approved,confirmed:false}));assert.equal(rows().length,0);
 assert.ok("error" in await run({...approved,fingerprint:"0".repeat(64)}));assert.equal(rows().length,0);
 assert.ok("error" in await run(approved,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}));assert.equal(rows().length,0);
 const results=await Promise.all([run(),run()]);
 assert.ok(results.every(r=>r.prepared===true&&r.provider_created===false));assert.equal(rows().length,1);
 const first=rows()[0];assert.equal(first.state,"prepared");assert.equal(first.amount_cents,2500);assert.equal(first.created_by,"owner");
 assert.equal(new Set([first.create_order_key,first.create_invoice_key,first.publish_invoice_key]).size,3);
 assert.equal(first.payload_json.includes("PRIVATE LEARNER"),false);assert.equal(first.payload_json.includes("test@example.com"),false);
 assert.equal(first.provider_order_id,null);assert.equal(first.provider_invoice_id,null);
 assert.equal((await run()).prepared,true);assert.deepEqual(rows()[0],first);
 const newBody={...b,due_at:"2026-11-28T01:00:00.000Z"};
 const newPreview=await previewSupportInvoice(env,"member","r","o",newBody,provider,now);
 assert.ok("error" in await run({...newBody,confirmed:true,fingerprint:newPreview.fingerprint}));assert.deepEqual(rows()[0],first);
 db.raw.prepare("UPDATE support_service_orders SET amount_cents=3000 WHERE id='o'").run();
 assert.ok("error" in await run());assert.deepEqual(rows()[0],first);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_manual_invoices").get().n,0);
 const before=calls;
 assert.ok("error" in await prepareSupportCheckout({...env,SUPPORT_CHECKOUT_TEST:"true"},"member","r","o",provider));assert.equal(calls,before);
 assert.ok("error" in await recordManualInvoice(db,"member","r","o",{issued_in_square:true,reference:"INV-001",due_at:b.due_at},"owner",now));
 assert.equal(await cancelUnstartedOrder(db,"member","r","o",true),false);
 assert.throws(()=>db.raw.prepare("UPDATE support_service_orders SET checkout_started_at=? WHERE id='o'").run(stamp),/requires reconciliation/);
 assert.throws(()=>db.raw.prepare("UPDATE support_service_orders SET status='cancelled' WHERE id='o'").run(),/requires reconciliation/);
 assert.throws(()=>db.raw.prepare("UPDATE support_service_orders SET status='paid' WHERE id='o'").run(),/requires reconciliation/);
 assert.throws(()=>db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES('o','INV-001',?,?,'owner')").run(b.due_at,stamp),/requires reconciliation/);
 const release=(body=approved,requestId="r")=>releasePreparedSupportInvoiceIntent(env,"member",requestId,"o","owner",body,now);
 assert.ok("error" in await release({...approved,confirmed:false}));
 assert.ok("error" in await release({...approved,fingerprint:"0".repeat(64)}));
 assert.ok("error" in await release(approved,"another-request"));
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='order_pending' WHERE order_id='o'").run();
 assert.ok("error" in await release());assert.equal(rows().length,1);
 // Restore synthetic fixture to a never-submitted state to exercise local release.
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='prepared' WHERE order_id='o'").run();
 assert.equal((await release()).released,true);assert.equal(rows().length,0);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_square_invoice_intent_releases WHERE order_id='o' AND released_by='owner'").get().n,1);
 assert.ok("error" in await release());
 assert.equal(await cancelUnstartedOrder(db,"member","r","o",true),true);
 assert.ok(calls>0);
});

test("sandbox order creation preserves the operation key across a lost response and never issues an invoice",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 const posts=[];let lose=true,mismatch=false;
 const provider=async(url,init)=>{
  if(init.method==="GET"){assert.equal(url,"https://connect.squareupsandbox.com/v2/customers/CUST1");return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));}
  assert.equal(init.method,"POST");assert.equal(url,"https://connect.squareupsandbox.com/v2/orders");
  const payload=JSON.parse(init.body);posts.push(payload);
  const row=db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
  assert.equal(row.state,"order_pending");assert.equal(row.create_order_key,payload.idempotency_key);
  assert.equal(payload.order.reference_id,payload.idempotency_key);assert.equal(payload.order.state,"OPEN");
  assert.equal(payload.order.line_items[0].base_price_money.amount,2500);
  assert.equal(JSON.stringify(payload).includes("PRIVATE LEARNER"),false);
  if(lose){lose=false;throw Error("Synthetic lost response");}
  return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:payload.idempotency_key,location_id:"LOCATION123",customer_id:"CUST1",state:"OPEN",total_money:{currency:"AUD",amount:mismatch?1:2500}}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 const approved={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",approved,provider,now)).prepared,true);
 const run=(body=approved,e=env,at=now)=>createPreparedSupportSquareOrder(e,"member","r","o",body,provider,at);
 assert.ok("error" in await run({...approved,confirmed:false}));assert.equal(posts.length,0);
 assert.ok("error" in await run(approved,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}));assert.equal(posts.length,0);
 assert.ok("error" in await run({...approved,fingerprint:"0".repeat(64)}));assert.equal(posts.length,0);
 assert.equal((await run()).pending,true);assert.equal(posts.length,1);
 assert.ok("error" in await releasePreparedSupportInvoiceIntent(env,"member","r","o","owner",approved,now));
 assert.ok("error" in await run(approved,env,new Date(now.getTime()+16*60000)));assert.equal(posts.length,1);
 assert.equal((await run(approved,env,new Date(now.getTime()+60000))).provider_order_id,"REMOTE1");
 assert.deepEqual(posts[0],posts[1]);assert.equal(posts.length,2);
 assert.equal((await run()).order_created,true);assert.equal(posts.length,2);
 const saved=db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 assert.equal(saved.order_attempted_at,stamp);assert.equal(saved.state,"order_created");assert.equal(saved.provider_invoice_id,null);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 // Reset only synthetic state to exercise the mismatched provider-response guard.
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='order_pending',provider_order_id=NULL WHERE order_id='o'").run();
 mismatch=true;assert.ok("error" in await run());assert.equal(db.raw.prepare("SELECT state FROM support_square_invoice_intents WHERE order_id='o'").get().state,"review");
 const count=posts.length;assert.ok("error" in await run());assert.equal(posts.length,count);
});

test("sandbox draft creation rechecks the remote order, recovers with the same key and never publishes",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 const posts=[];let lose=true,badOrder=false,badInvoice=false;
 const remoteOrder=()=>({id:"REMOTE1",reference_id:db.raw.prepare("SELECT create_order_key FROM support_square_invoice_intents WHERE order_id='o'").get().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"OPEN",total_money:{currency:"AUD",amount:badOrder?1:2500}});
 const provider=async(url,init)=>{
  if(init.method==="GET"&&url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(init.method==="GET"&&url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:remoteOrder()}));
  assert.equal(init.method,"POST");
  if(url.endsWith("/v2/orders"))return new Response(JSON.stringify({order:remoteOrder()}));
  assert.equal(url,"https://connect.squareupsandbox.com/v2/invoices");
  const payload=JSON.parse(init.body);posts.push(payload);
  const row=db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
  assert.equal(row.state,"invoice_pending");assert.equal(payload.idempotency_key,row.create_invoice_key);assert.equal(payload.invoice.order_id,"REMOTE1");
  assert.equal(payload.invoice.payment_requests[0].automatic_payment_source,"NONE");
  assert.equal(JSON.stringify(payload).includes("PRIVATE LEARNER"),false);
  if(lose){lose=false;throw Error("Synthetic lost response");}
  return new Response(JSON.stringify({invoice:{id:"inv:REMOTE2",version:0,location_id:"LOCATION123",order_id:"REMOTE1",status:"DRAFT",delivery_method:"EMAIL",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{amount:badInvoice?1:2500,currency:"AUD"},total_completed_amount_money:{amount:0,currency:"AUD"}}]}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 const approved={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",approved,provider,now)).prepared,true);
 const run=(body=approved,e=env,at=now)=>createPreparedSupportSquareDraft(e,"member","r","o",body,provider,at);
 assert.ok("error" in await run());assert.equal(posts.length,0);
 assert.equal((await createPreparedSupportSquareOrder(env,"member","r","o",approved,provider,now)).order_created,true);
 assert.ok("error" in await run({...approved,confirmed:false}));
 assert.ok("error" in await run(approved,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}));assert.equal(posts.length,0);
 assert.equal((await run()).pending,true);assert.equal(posts.length,1);
 assert.ok("error" in await run(approved,env,new Date(now.getTime()+16*60000)));assert.equal(posts.length,1);
 const result=await run(approved,env,new Date(now.getTime()+60000));assert.equal(result.draft_created,true);assert.equal(result.published,false);assert.equal(result.version,0);
 assert.deepEqual(posts[0],posts[1]);assert.equal((await run()).draft_created,true);assert.equal(posts.length,2);
 const row=db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 assert.equal(row.state,"draft_created");assert.equal(row.provider_invoice_id,"inv:REMOTE2");assert.equal(row.invoice_attempted_at,stamp);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_manual_invoices").get().n,0);
 // Synthetic reset only: exercise independent mismatch guards.
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='invoice_pending',provider_invoice_id=NULL,provider_invoice_version=NULL WHERE order_id='o'").run();
 badOrder=true;assert.ok("error" in await run());assert.equal(posts.length,2);assert.equal(db.raw.prepare("SELECT state FROM support_square_invoice_intents WHERE order_id='o'").get().state,"review");
 badOrder=false;badInvoice=true;db.raw.prepare("UPDATE support_square_invoice_intents SET state='invoice_pending' WHERE order_id='o'").run();
 assert.ok("error" in await run());assert.equal(db.raw.prepare("SELECT state FROM support_square_invoice_intents WHERE order_id='o'").get().state,"review");
 assert.equal(posts.length,3);
});

test("read-only reconciliation validates candidate records and safely links a lost response without publishing",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 let wrongOrder=false,wrongInvoice=false,version=0,scheduled=false;const calls=[];
 const provider=async(url,init)=>{
  assert.equal(init.method,"GET");calls.push(url);
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  const row=db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:wrongOrder?"OTHER":row.create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"OPEN",total_money:{currency:"AUD",amount:2500}}}));
  if(url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:{id:"INV1",version,location_id:"LOCATION123",order_id:wrongInvoice?"OTHER":"REMOTE1",status:"DRAFT",delivery_method:"EMAIL",scheduled_at:scheduled?"2026-11-27T00:00:00Z":undefined,primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row.payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:0}}]}}));
  return new Response("{}",{status:404});
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now),approved={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",approved,provider,now)).prepared,true);
 const inspect=(x=approved,e=env,request="r")=>inspectPreparedSupportSquareInvoice(e,"member",request,"o",x,provider,now);
 const recover=(x=approved)=>recoverPreparedSupportSquareRecord(env,"member","r","o",x,provider,now);
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 assert.ok("error" in await inspect());assert.equal(row().state,"prepared");
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='order_pending',order_attempted_at=? WHERE order_id='o'").run(stamp);
 const orderBody={...approved,provider_order_id:"REMOTE1"};
 wrongOrder=true;assert.ok("error" in await inspect(orderBody));wrongOrder=false;
 assert.ok("error" in await inspect(orderBody,env,"other"));
 const before=row();assert.equal((await inspect(orderBody)).can_recover_order,true);assert.deepEqual(row(),before);
 assert.ok("error" in await recover(orderBody));assert.equal((await recover({...orderBody,recovery_confirmed:true})).state,"order_created");
 assert.equal(row().provider_order_id,"REMOTE1");
 assert.ok("error" in await inspect({...orderBody,provider_order_id:"OTHER"}));
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='invoice_pending',invoice_attempted_at=? WHERE order_id='o'").run(stamp);
 const invoiceBody={...approved,provider_invoice_id:"INV1"};
 wrongInvoice=true;assert.ok("error" in await inspect(invoiceBody));wrongInvoice=false;
 version=1;assert.equal((await inspect(invoiceBody)).can_recover_draft,false);version=0;
 scheduled=true;assert.equal((await inspect(invoiceBody)).draft_matches,false);scheduled=false;
 assert.equal((await inspect(invoiceBody)).can_recover_draft,true);
 assert.equal((await recover({...invoiceBody,recovery_confirmed:true})).state,"draft_created");
 assert.equal(row().provider_invoice_id,"INV1");assert.equal(row().provider_invoice_version,0);
 assert.equal((await inspect()).draft_matches,true);
 version=1;assert.equal((await inspect()).draft_matches,false);
 assert.ok("error" in await inspect(approved,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}));
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_manual_invoices").get().n,0);
 assert.ok(calls.length>0);
});

test("sandbox issue approval is version-bound, survives a lost response, and never marks payment complete",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 let remoteStatus="DRAFT",version=0,lose=true,wrongUrl=false;const posts=[];
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 const invoice=()=>({id:"INV1",version,location_id:"LOCATION123",order_id:"REMOTE1",status:remoteStatus,delivery_method:"EMAIL",
  public_url:remoteStatus==="UNPAID"?(wrongUrl?"https://evil.example/pay-invoice/INV1":"https://squareupsandbox.com/pay-invoice/invtmp:INV1"):undefined,
  primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},
  accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,
  payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:0}}]});
 const provider=async(url,init)=>{
  if(init.method==="GET"&&url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(init.method==="GET"&&url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"OPEN",total_money:{currency:"AUD",amount:2500}}}));
  if(init.method==="GET"&&url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:invoice()}));
  assert.equal(init.method,"POST");assert.equal(url,"https://connect.squareupsandbox.com/v2/invoices/INV1/publish");
  const payload=JSON.parse(init.body);posts.push(payload);
  assert.equal(row().state,"publish_pending");assert.equal(row().publish_approved_version,0);assert.equal(row().publish_approved_by,"owner");
  assert.equal(payload.idempotency_key,row().publish_invoice_key);assert.equal(payload.version,0);
  remoteStatus="UNPAID";version=1;if(lose){lose=false;throw Error("Lost publish response");}
  return new Response(JSON.stringify({invoice:invoice()}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now),approved={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",approved,provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='draft_created',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=0,order_attempted_at=?,invoice_attempted_at=? WHERE order_id='o'").run(stamp,stamp);
 const issue={...approved,issue_confirmed:true,provider_invoice_id:"INV1",version:0};
 const run=(body=issue,e=env,at=now)=>publishPreparedSupportSquareInvoice(e,"member","r","o","owner",body,provider,at);
 assert.ok("error" in await run({...issue,issue_confirmed:false}));assert.equal(posts.length,0);
 assert.ok("error" in await run({...issue,version:1}));assert.equal(posts.length,0);
 assert.ok("error" in await run(issue,{...env,SQUARE_APPLICATION_ID:"sq0idp-live"}));assert.equal(posts.length,0);
 version=1;assert.ok("error" in await run());assert.equal(posts.length,0);version=0;
 assert.equal((await run()).pending,true);assert.equal(row().state,"publish_pending");assert.equal(posts.length,1);
 wrongUrl=true;assert.ok("error" in await run());assert.equal(posts.length,1);assert.equal(row().state,"publish_pending");
 wrongUrl=false;
 const recovered=await run(issue,env,new Date(now.getTime()+16*60000));
 assert.equal(recovered.issued,true);assert.equal(recovered.paid,false);assert.equal(posts.length,1);
 assert.equal(row().state,"issued");assert.equal(row().provider_invoice_version,1);
 assert.equal(row().provider_public_url,"https://squareupsandbox.com/pay-invoice/invtmp:INV1");
 assert.equal((await run()).issued,true);assert.equal(posts.length,1);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_manual_invoices").get().n,0);
});

test("issued invoice settlement requires a single captured card payment by the deadline and refunds return it to review",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const due="2026-11-27T01:00:00.000Z",capture="2026-11-26T01:00:00.000Z",checkTime=new Date("2026-11-26T02:00:00.000Z");
 const b={reviewed:true,customer_id:"CUST1",due_at:due};
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 const orderStatus=()=>db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status;
 const proofs=()=>db.raw.prepare("SELECT * FROM support_square_invoice_settlements").all();
 let status="PAID",completed=2500,capturedAt=capture,refunds=[],amount=2500,tenderCount=1;
 const provider=async(url,init)=>{
  assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"COMPLETED",total_money:{currency:"AUD",amount:2500},tenders:Array.from({length:tenderCount},()=>({payment_id:"PAY1",amount_money:{currency:"AUD",amount:2500}}))}}));
  if(url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:{id:"INV1",version:2,location_id:"LOCATION123",order_id:"REMOTE1",status,delivery_method:"EMAIL",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
  assert.ok(url.endsWith("/payments/PAY1"));
  return new Response(JSON.stringify({payment:{id:"PAY1",order_id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",status:"COMPLETED",source_type:"CARD",amount_money:{currency:"AUD",amount},total_money:{currency:"AUD",amount},card_details:{status:"CAPTURED",card_payment_timeline:{captured_at:capturedAt}},refund_ids:refunds}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",{...b,confirmed:true,fingerprint:p.fingerprint},provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url='https://squareupsandbox.com/pay-invoice/INV1' WHERE order_id='o'").run(stamp,stamp);
 const run=(at=checkTime)=>verifyIssuedSupportSquarePayment(env,"member","r","o",provider,at);
 assert.throws(()=>db.raw.prepare("UPDATE support_service_orders SET status='paid' WHERE id='o'").run(),/requires reconciliation/);
 status="PARTIALLY_PAID";completed=1000;assert.equal((await run()).verified,false);
 status="PAID";completed=2500;amount=1000;assert.equal((await run()).verified,false);amount=2500;
 tenderCount=2;assert.equal((await run()).verified,false);tenderCount=1;
 capturedAt="2026-11-27T02:00:00.000Z";assert.equal((await run(new Date("2026-11-27T03:00:00Z"))).verified,false);capturedAt=capture;
 refunds=["REF1"];assert.equal((await run()).verified,false);refunds=[];
 assert.equal(orderStatus(),"confirmed");assert.equal(proofs().length,0);
 assert.equal(await reconcileSupportInvoiceEvent(env,"INV1",null,provider,checkTime),"support invoice payment verified");
 assert.equal(orderStatus(),"paid");assert.equal(proofs().length,1);assert.equal(proofs()[0].captured_at,capture);
 const paidWorkspace=await ownerSquareInvoiceWorkspace(env,"member","r","o");assert.ok(paidWorkspace.confirmation_preview.body.includes("payment has been verified"));assert.equal(paidWorkspace.financial_review,null);
 assert.equal((await run()).verified,true);assert.equal(proofs().length,1);
 assert.equal(await flagIssuedSupportInvoiceRefund(env,{payment_id:"PAY1",location_id:"LOCATION123",status:"PENDING"},checkTime),"support invoice refund requires review");
 assert.equal(orderStatus(),"review");assert.ok(proofs()[0].review_at);assert.equal((await run()).verified,false);
 const heldWorkspace=await ownerSquareInvoiceWorkspace(env,"member","r","o");assert.equal(heldWorkspace.confirmation_preview,null);assert.equal(heldWorkspace.financial_review.reason,"refund");
});

test("overdue invoice release requires explicit approval and verified cancelled order with zero payment",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const b={reviewed:true,customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z"};
 const later=new Date("2026-11-28T00:00:00.000Z"),row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 let status="UNPAID",orderState="OPEN",completed=0,tenders=[];
 const provider=async(url,init)=>{
  assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:orderState,total_money:{currency:"AUD",amount:2500},tenders}}));
  assert.ok(url.endsWith("/invoices/INV1"));
  return new Response(JSON.stringify({invoice:{id:"INV1",version:2,location_id:"LOCATION123",order_id:"REMOTE1",status,delivery_method:"EMAIL",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now),approved={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",approved,provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url='https://squareupsandbox.com/pay-invoice/INV1' WHERE order_id='o'").run(stamp,stamp);
 const body={...approved,cancelled_in_square:true,parent_notified:true};
 const run=(x=body,at=later)=>releaseVerifiedUnpaidSquareInvoice(env,"member","r","o","owner",x,provider,at);
 const state=()=>db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status;
 assert.ok("error" in await run({...body,parent_notified:false}));assert.ok("error" in await run(body,now));
 assert.ok("error" in await run());assert.equal(state(),"confirmed");
 const overdue=await ownerToday(db,later);assert.ok(overdue.groups.find(g=>g.category==="attention").items.some(x=>x.id==="o"&&x.action==="square_overdue"));
 await recordInvoiceReview(db,"o","payment_uncertain",later);
 const review=await ownerToday(db,later);assert.ok(review.groups.find(g=>g.category==="attention").items.some(x=>x.id==="o"&&x.action==="square_review"));
 status="CANCELED";completed=1000;orderState="COMPLETED";assert.ok("error" in await run());
 completed=0;orderState="CANCELED";tenders=[{payment_id:"PAY1"}];assert.ok("error" in await run());
 tenders=[];assert.throws(()=>db.raw.prepare("UPDATE support_service_orders SET status='cancelled' WHERE id='o'").run(),/requires reconciliation/);
 assert.equal((await run()).released,true);assert.equal(state(),"cancelled");
 assert.equal((await run()).released,true);assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_square_invoice_cancellations").get().n,1);
 assert.ok(db.raw.prepare("SELECT resolved_at FROM support_square_invoice_reviews WHERE order_id='o'").get().resolved_at);
});

test("dispute before settlement blocks payment confirmation and preserves the financial hold",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const due="2026-11-27T01:00:00.000Z",capture="2026-11-26T01:00:00.000Z",checkTime=new Date("2026-11-26T02:00:00.000Z");
 const b={reviewed:true,customer_id:"CUST1",due_at:due};
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 const orderStatus=()=>db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status;
 const proofs=()=>db.raw.prepare("SELECT * FROM support_square_invoice_settlements").all();
 let status="PAID",completed=2500,capturedAt=capture,refunds=[],amount=2500,tenderCount=1;
 const provider=async(url,init)=>{
  assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"COMPLETED",total_money:{currency:"AUD",amount:2500},tenders:Array.from({length:tenderCount},()=>({payment_id:"PAY1",amount_money:{currency:"AUD",amount:2500}}))}}));
  if(url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:{id:"INV1",version:2,location_id:"LOCATION123",order_id:"REMOTE1",status,delivery_method:"EMAIL",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
  if(url.endsWith("/disputes/DISP1"))return new Response(JSON.stringify({dispute:{id:"DISP1",location_id:"LOCATION123",disputed_payment:{payment_id:"PAY1"},state:"EVIDENCE_REQUIRED"}}));
  assert.ok(url.endsWith("/payments/PAY1"));
  return new Response(JSON.stringify({payment:{id:"PAY1",order_id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",status:"COMPLETED",source_type:"CARD",amount_money:{currency:"AUD",amount},total_money:{currency:"AUD",amount},card_details:{status:"CAPTURED",card_payment_timeline:{captured_at:capturedAt}},refund_ids:refunds}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",{...b,confirmed:true,fingerprint:p.fingerprint},provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url='https://squareupsandbox.com/pay-invoice/INV1' WHERE order_id='o'").run(stamp,stamp);
 const run=(at=checkTime)=>verifyIssuedSupportSquarePayment(env,"member","r","o",provider,at);
 assert.equal(await flagIssuedSupportInvoiceDispute(env,"DISP1",provider,checkTime),"support invoice dispute requires review");
 assert.equal(orderStatus(),"review");assert.equal(proofs().length,0);
 assert.equal((await run()).verified,false);assert.equal(proofs().length,0);
 const hold=db.raw.prepare("SELECT reason,resolved_at FROM support_square_invoice_reviews WHERE order_id='o'").get();
 assert.equal(hold.reason,"dispute");assert.equal(hold.resolved_at,null);
 assert.equal(await reconcileSupportInvoiceEvent(env,"INV1",null,provider,checkTime),"support invoice payment requires review");
 assert.equal(orderStatus(),"review");
 assert.equal(await flagIssuedSupportInvoiceRefund(env,{payment_id:"PAY1",location_id:"LOCATION123",status:"PENDING"},checkTime,provider),"support invoice refund requires review");
 assert.equal(orderStatus(),"review");assert.equal(proofs().length,0);
});

test("sandbox notices require opt-in and verified recipient, deduplicate reminders and confirmation, suppress holds",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const due="2026-11-27T01:00:00.000Z",capture="2026-11-26T01:00:00.000Z",checkTime=new Date("2026-11-26T02:00:00.000Z");
 const b={reviewed:true,customer_id:"CUST1",due_at:due};
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 const orderStatus=()=>db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status;
 const proofs=()=>db.raw.prepare("SELECT * FROM support_square_invoice_settlements").all();
 let status="UNPAID",completed=0,capturedAt=capture,refunds=[],amount=2500,tenderCount=1;
 const provider=async(url,init)=>{
  assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:status==="UNPAID"?"OPEN":"COMPLETED",total_money:{currency:"AUD",amount:2500},tenders:Array.from({length:tenderCount},()=>({payment_id:"PAY1",amount_money:{currency:"AUD",amount:2500}}))}}));
  if(url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:{id:"INV1",version:status==="UNPAID"?1:2,location_id:"LOCATION123",order_id:"REMOTE1",status,delivery_method:"EMAIL",public_url:"https://squareupsandbox.com/pay-invoice/INV1",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
  assert.ok(url.endsWith("/payments/PAY1"));
  return new Response(JSON.stringify({payment:{id:"PAY1",order_id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",status:"COMPLETED",source_type:"CARD",amount_money:{currency:"AUD",amount},total_money:{currency:"AUD",amount},card_details:{status:"CAPTURED",card_payment_timeline:{captured_at:capturedAt}},refund_ids:refunds}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",{...b,confirmed:true,fingerprint:p.fingerprint},provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url='https://squareupsandbox.com/pay-invoice/INV1' WHERE order_id='o'").run(stamp,stamp);

 const messages=[];
 const sender=async(e,m)=>{messages.push(m);return true;};
 const enabled={...env,EMAIL:{},SUPPORT_SQUARE_INVOICE_NOTICE_TEST:"true"};
 assert.equal((await processSquareInvoiceNotices({...enabled,SUPPORT_SQUARE_INVOICE_NOTICE_TEST:"false"},checkTime,sender,provider)).sent,0);
 assert.equal((await processSquareInvoiceNotices({...enabled,SUPPORT_UNIFIED_TEST_EMAIL:"other@example.com"},checkTime,sender,provider)).sent,0);
 assert.equal((await processSquareInvoiceNotices(enabled,checkTime,sender,provider)).sent,1);
 assert.equal(messages[0].to,"test@example.com");assert.match(messages[0].subject,/Sandbox test.*payment reminder/);
 assert.equal((await processSquareInvoiceNotices(enabled,checkTime,sender,provider)).sent,0);
 status="PAID";completed=2500;
 assert.equal((await verifyIssuedSupportSquarePayment(enabled,"member","r","o",provider,checkTime)).verified,true);
 assert.equal((await processSquareInvoiceNotices(enabled,checkTime,sender,provider)).sent,1);
 assert.match(messages[1].subject,/booking confirmed/);assert.equal((await processSquareInvoiceNotices(enabled,checkTime,sender,provider)).sent,0);
 assert.equal(messages.length,2);assert.ok(messages.every(m=>!m.text.includes("PRIVATE LEARNER DETAILS")));
 assert.equal(await flagIssuedSupportInvoiceRefund(enabled,{payment_id:"PAY1",location_id:"LOCATION123",status:"PENDING"},checkTime),"support invoice refund requires review");
 assert.equal((await processSquareInvoiceNotices(enabled,new Date("2026-11-28T00:00:00Z"),sender,provider)).sent,0);
});

test("scheduled recheck recovers delayed payment and full-refund release requires matching completed refund",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const due="2026-11-27T01:00:00.000Z",capture="2026-11-26T01:00:00.000Z",checkTime=new Date("2026-11-26T02:00:00.000Z");
 const b={reviewed:true,customer_id:"CUST1",due_at:due};
 const row=()=>db.raw.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id='o'").get();
 const orderStatus=()=>db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status;
 const proofs=()=>db.raw.prepare("SELECT * FROM support_square_invoice_settlements").all();
 let status="PAID",completed=2500,capturedAt=capture,refunds=[],amount=2500,tenderCount=1,refunded=0,refundStatus="PENDING",providerCalls=0;
 const provider=async(url,init)=>{
  providerCalls++;assert.equal(init.method,"GET");
  if(url.endsWith("/customers/CUST1"))return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
  if(url.endsWith("/orders/REMOTE1"))return new Response(JSON.stringify({order:{id:"REMOTE1",reference_id:row().create_order_key,location_id:"LOCATION123",customer_id:"CUST1",state:"COMPLETED",total_money:{currency:"AUD",amount:2500},tenders:Array.from({length:tenderCount},()=>({payment_id:"PAY1",amount_money:{currency:"AUD",amount:2500}}))}}));
  if(url.endsWith("/invoices/INV1"))return new Response(JSON.stringify({invoice:{id:"INV1",version:2,location_id:"LOCATION123",order_id:"REMOTE1",status,delivery_method:"EMAIL",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},accepted_payment_methods:JSON.parse(row().payload_json).invoice.accepted_payment_methods,payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27",automatic_payment_source:"NONE",computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:completed}}]}}));
  if(url.endsWith("/refunds/REF1"))return new Response(JSON.stringify({refund:{id:"REF1",payment_id:"PAY1",location_id:"LOCATION123",status:refundStatus,amount_money:{currency:"AUD",amount:refunded}}}));
  assert.ok(url.endsWith("/payments/PAY1"));
  return new Response(JSON.stringify({payment:{id:"PAY1",order_id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",status:"COMPLETED",source_type:"CARD",amount_money:{currency:"AUD",amount},total_money:{currency:"AUD",amount},card_details:{status:"CAPTURED",card_payment_timeline:{captured_at:capturedAt}},refund_ids:refunds,refunded_money:{currency:"AUD",amount:refunded}}}));
 };
 const p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",{...b,confirmed:true,fingerprint:p.fingerprint},provider,now)).prepared,true);
 db.raw.prepare("UPDATE support_square_invoice_intents SET state='issued',provider_order_id='REMOTE1',provider_invoice_id='INV1',provider_invoice_version=1,publish_approved_version=0,publish_attempted_at=?,provider_issued_at=?,provider_public_url='https://squareupsandbox.com/pay-invoice/INV1' WHERE order_id='o'").run(stamp,stamp);

 const run=()=>recheckIssuedSupportInvoices(env,checkTime,provider);
 // No webhook arrives after publication; the scheduled check finds the capture.
 assert.deepEqual(await run(),{checked:1,verified:1});
 assert.equal(orderStatus(),"paid");assert.equal(proofs().length,1);
 const calls=providerCalls;assert.deepEqual(await run(),{checked:0,verified:0});assert.equal(providerCalls,calls);
 await flagIssuedSupportInvoiceRefund(env,{payment_id:"PAY1",location_id:"LOCATION123",status:"PENDING"},checkTime,provider);
 assert.equal(orderStatus(),"review");
 const body={confirmed:true,parent_notified:true,dispute_checked:true,fingerprint:p.fingerprint};
 const close=(b=body)=>resolveFullyRefundedSupportInvoice(env,"member","r","o","owner",b,provider,checkTime);
 assert.ok("error" in await close({...body,parent_notified:false}));assert.ok("error" in await close());
 status="REFUNDED";refunds=["REF1"];refunded=1000;assert.ok("error" in await close());
 refunded=2500;assert.ok("error" in await close());assert.equal(orderStatus(),"review");
 refundStatus="COMPLETED";assert.equal((await close()).released,true);assert.equal(orderStatus(),"cancelled");
 assert.equal((await close()).released,true);assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_square_invoice_refund_resolutions").get().n,1);
 assert.ok(db.raw.prepare("SELECT resolved_at FROM support_square_invoice_reviews WHERE order_id='o'").get().resolved_at);
 assert.equal(proofs().length,1);
});

test("integrated synthetic lifecycle: owner preparation to family payment, webhook and correspondence without legacy settlement",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'PRIVATE LEARNER DETAILS','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};

 const parent={id:"u",family_id:"f",role:"parent",name:"Parent"},due="2026-11-27T01:00:00.000Z";
 const payAt="2026-11-26T01:00:00.000Z",checkAt=new Date("2026-11-26T02:00:00.000Z");
 const link="https://squareupsandbox.com/pay-invoice/INV1",writes=[];
 let order=null,invoice=null,payment=null;
 const provider=async(url,init)=>{
  assert.ok(url.startsWith("https://connect.squareupsandbox.com/v2/"));
  const path=url.split("/v2/")[1],body=init.body?JSON.parse(init.body):null;
  if(init.method==="POST")writes.push({path,body});
  if(path==="customers/CUST1"&&init.method==="GET")return Response.json({customer:{id:"CUST1",email_address:"test@example.com"}});
  if(path==="orders"&&init.method==="POST"){
   assert.equal(order,null);order={...body.order,id:"REMOTE1",total_money:{currency:"AUD",amount:2500}};return Response.json({order});
  }
  if(path==="orders/REMOTE1"&&init.method==="GET")return Response.json({order});
  if(path==="invoices"&&init.method==="POST"){
   assert.equal(invoice,null);invoice={...body.invoice,id:"INV1",version:0,status:"DRAFT",primary_recipient:{customer_id:"CUST1",email_address:"test@example.com"},payment_requests:body.invoice.payment_requests.map(p=>({...p,computed_amount_money:{currency:"AUD",amount:2500},total_completed_amount_money:{currency:"AUD",amount:0}}))};
   return Response.json({invoice});
  }
  if(path==="invoices/INV1/publish"&&init.method==="POST"){
   assert.equal(invoice.status,"DRAFT");assert.equal(body.version,0);invoice={...invoice,version:1,status:"UNPAID",public_url:link};return Response.json({invoice});
  }
  if(path==="invoices/INV1"&&init.method==="GET")return Response.json({invoice});
  if(path==="payments/PAY1"&&init.method==="GET")return Response.json({payment});
  throw Error("Unexpected provider request "+path);
 };
 const b={reviewed:true,customer_id:"CUST1",due_at:due},p=await previewSupportInvoice(env,"member","r","o",b,provider,now);
 assert.ok(p.fingerprint);const a={...b,confirmed:true,fingerprint:p.fingerprint};
 assert.equal((await prepareSupportInvoiceIntent(env,"member","r","o","owner",a,provider,now)).prepared,true);
 assert.equal(await familyIssuedSquareInvoice(env,parent,"o",provider,now),null);
 assert.equal((await createPreparedSupportSquareOrder(env,"member","r","o",a,provider,now)).order_created,true);
 assert.equal((await createPreparedSupportSquareDraft(env,"member","r","o",a,provider,now)).draft_created,true);
 assert.equal(await familyIssuedSquareInvoice(env,parent,"o",provider,now),null);
 assert.equal((await publishPreparedSupportSquareInvoice(env,"member","r","o","owner",{...a,issue_confirmed:true,provider_invoice_id:"INV1",version:0},provider,now)).issued,true);
 assert.deepEqual(writes.map(w=>w.path),["orders","invoices","invoices/INV1/publish"]);
 assert.equal((await familyIssuedSquareInvoice(env,parent,"o",provider,now)).payment_url,link);
 assert.equal(await familyIssuedSquareInvoice(env,{...parent,role:"child"},"o",provider,now),null);
 assert.equal(await familyIssuedSquareInvoice(env,{...parent,id:"not-owner"},"o",provider,now),null);
 const cfg=squareConfig(env),event={event_id:"synthetic-event",type:"invoice.payment_made",data:{object:{invoice:{id:"INV1"}}}};
 const raw=JSON.stringify(event),hookUrl="https://side-quest-staging.example.workers.dev/api/billing/square-webhook";
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(env.SQUARE_WEBHOOK_SIGNATURE_KEY),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const mac=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(hookUrl+raw)));
 const signature=btoa(String.fromCharCode(...mac));
 assert.equal(await verifySquareSignature(raw,signature,env.SQUARE_WEBHOOK_SIGNATURE_KEY,hookUrl),true);
 assert.equal(await verifySquareSignature(raw+" ",signature,env.SQUARE_WEBHOOK_SIGNATURE_KEY,hookUrl),false);
 // Provider state, not the event alone, is authoritative.
 await handleSquareEvent(db,cfg,event,provider,checkAt,undefined,{env});
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 order={...order,state:"COMPLETED",tenders:[{payment_id:"PAY1",amount_money:{currency:"AUD",amount:2500}}]};
 invoice={...invoice,status:"PAID",version:2,payment_requests:invoice.payment_requests.map(p=>({...p,total_completed_amount_money:{currency:"AUD",amount:2500}}))};
 payment={id:"PAY1",order_id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",status:"COMPLETED",source_type:"CARD",amount_money:{currency:"AUD",amount:2500},total_money:{currency:"AUD",amount:2500},card_details:{status:"CAPTURED",card_payment_timeline:{captured_at:payAt}}};
 assert.equal(await handleSquareEvent(db,cfg,event,provider,checkAt,undefined,{env}),"support invoice payment verified");
 assert.equal(await handleSquareEvent(db,cfg,event,provider,checkAt,undefined,{env}),"support invoice payment verified");
 assert.equal((await familyIssuedSquareInvoice(env,parent,"o",provider,checkAt)).status,"verified");
 const mail=[],enabled={...env,EMAIL:{},SUPPORT_SQUARE_INVOICE_NOTICE_TEST:"true"};
 const sender=async(e,m)=>{mail.push(m);return true;};
 assert.equal((await processSquareInvoiceNotices(enabled,checkAt,sender,provider)).sent,1);
 assert.equal((await processSquareInvoiceNotices(enabled,checkAt,sender,provider)).sent,0);
 assert.equal(mail.length,1);assert.equal(mail[0].to,"test@example.com");assert.match(mail[0].subject,/booking confirmed/);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_square_invoice_settlements").get().n,1);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_manual_invoices").get().n,0);
 assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='f'").get().plan,"PREVIEW_EXPIRED");
 assert.equal(writes.length,3);
});
