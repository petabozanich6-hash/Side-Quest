import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {createSquareDraft,readSquareDraft} from "../src/supportSquareDraft.ts";
import {previewSupportInvoice} from "../src/supportSquareInvoicePreview.ts";
test("recover lost invoice response using same persistent key and never publish",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const stamp="2026-11-26T00:00:00.000Z",now=new Date(stamp);
 db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES('f','Family','u',?,'PREVIEW_EXPIRED')").run(stamp);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES('u','f','test@example.com','Parent',1,?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO parent_feedback(id,family_id,user_id,category,subject,message,page_hint,created_at,updated_at) VALUES('r','f','u','other','English','Help','learning-support',?,?)").run(stamp,stamp);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,status,created_at,updated_at) VALUES('o','member','r','q',2500,'Scope','Written','Terms','written','confirmed',?,?)").run(stamp,stamp);
 const env={DB:db,STAGING_KEY:"private",STAGING_PRIVATE:"true",SUPPORT_UNIFIED_PORTAL_TEST:"true",SUPPORT_SQUARE_INVOICE_TEST:"true",SUPPORT_SQUARE_DRAFT_TEST:"true",SUPPORT_UNIFIED_TEST_EMAIL:"test@example.com",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-test",SQUARE_LOCATION_ID:"LOCATION123",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};
 let orders=0,invoices=0,key=null;
 const provider=async(url,init)=>{
 assert.ok(url.startsWith("https://connect.squareupsandbox.com/v2/"));assert.ok(!url.includes("publish"));
 if(init.method==="GET")return new Response(JSON.stringify({customer:{id:"CUST1",email_address:"test@example.com"}}));
 const b=JSON.parse(init.body);assert.ok(b.idempotency_key);
 if(url.endsWith("/orders")){orders++;return new Response(JSON.stringify({order:{id:"REMOTE1",location_id:"LOCATION123",customer_id:"CUST1",total_money:{amount:2500,currency:"AUD"}}}));}
 assert.ok(url.endsWith("/invoices"));invoices++;assert.equal(b.invoice.order_id,"REMOTE1");
 if(!key){key=b.idempotency_key;throw Error("lost response");}
 assert.equal(b.idempotency_key,key);
 return new Response(JSON.stringify({invoice:{id:"INV1",version:0,order_id:"REMOTE1",location_id:"LOCATION123",status:"DRAFT",primary_recipient:{customer_id:"CUST1"},payment_requests:[{request_type:"BALANCE",due_date:"2026-11-27"}]}}));
 };
 const input={customer_id:"CUST1",due_at:"2026-11-27T01:00:00.000Z",reviewed:true};
 const p=await previewSupportInvoice(env,"member","r","o",input,provider,now);assert.ok(p.fingerprint);
 const b={...input,fingerprint:p.fingerprint,confirmed:true};
 const create=(e=env,body=b)=>createSquareDraft(e,"member","r","o",body,provider,now);
 assert.ok("error" in await create({...env,SUPPORT_SQUARE_DRAFT_TEST:"false"}));assert.equal(orders,0);
 assert.ok("error" in await create());assert.equal((await readSquareDraft(db,"member","r","o")).state,"order_created");assert.equal(orders,1);assert.equal(invoices,1);
 assert.ok("error" in await create(env,{...b,due_at:"2026-11-28T01:00:00.000Z"}));
 assert.equal((await create()).draft.invoice_id,"INV1");assert.equal(orders,1);assert.equal(invoices,2);
 assert.equal((await create()).draft.invoice_id,"INV1");assert.equal(invoices,2);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='o'").get().status,"confirmed");
 assert.throws(()=>db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES('o','OTHER',?,?,'u')").run(input.due_at,stamp),/Managed Square draft/);
});
