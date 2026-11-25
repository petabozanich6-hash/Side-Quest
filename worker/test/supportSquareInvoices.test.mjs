import test from "node:test";
import assert from "node:assert/strict";
import {invoicePilotConfig,prepareSandboxInvoice,publishSandboxInvoice,invoicePayload,sandboxInvoiceUrl,inspectSandboxInvoice} from "../src/supportSquareInvoices.ts";
const env={SUPPORT_SQUARE_INVOICES_TEST:"true",STAGING_KEY:"synthetic",STAGING_PRIVATE:"true",SQUARE_ACCESS_TOKEN:"fake",SQUARE_APPLICATION_ID:"sandbox-sq0idb-test",SQUARE_LOCATION_ID:"TEST123456",SQUARE_WEBHOOK_SIGNATURE_KEY:"fake"};
const v={orderId:"booking-1",customerId:"parent-1",amountCents:3500,dueDate:"2026-12-01",locationId:env.SQUARE_LOCATION_ID,email:"parent@example.test"};
const draft={id:"inv:sample",version:0,location_id:v.locationId,order_id:"square-order",primary_recipient:{customer_id:v.customerId,email_address:v.email},delivery_method:"SHARE_MANUALLY",payment_requests:[{request_type:"BALANCE",due_date:v.dueDate,automatic_payment_source:"NONE",computed_amount_money:{amount:3500,currency:"AUD"}}],status:"DRAFT"};
const published={...draft,status:"UNPAID",version:1,public_url:"https://squareupsandbox.com/pay-invoice/sample"};
function fake(overrides={}){
 const calls=[];
 const fetch=async(url,init)=>{
  const path=new URL(url).pathname;
  const body=init.body?JSON.parse(init.body):null;calls.push({path,method:init.method,body});
  const data=path.includes("/customers/")?{customer:{id:v.customerId,email_address:v.email}}:path==="/v2/orders"?{order:{id:"square-order",location_id:v.locationId,customer_id:v.customerId,total_money:{amount:3500,currency:"AUD"},...overrides.order}}:path.endsWith("/publish")?{invoice:{...published,...overrides.publish}}:{invoice:{...draft,...overrides.invoice}};
  return new Response(JSON.stringify(data));
 };
 return {calls,fetch};
}
test("pilot rejects production credentials and ordinary environments before requests",async()=>{
 const {calls,fetch}=fake();
 for(const e of [{...env,SQUARE_APPLICATION_ID:"sq0idp-live"},{...env,STAGING_KEY:undefined},{...env,STAGING_PRIVATE:undefined},{...env,SUPPORT_SQUARE_INVOICES_TEST:"false"}]){
  assert.equal(invoicePilotConfig(e),null);
  await assert.rejects(prepareSandboxInvoice(e,v,fetch));
 }
 assert.equal(calls.length,0);
});
test("sandbox draft and publish use manual sharing, AUD and stable keys",async()=>{
 const {calls,fetch}=fake();
 const d=await prepareSandboxInvoice(env,v,fetch);
 await prepareSandboxInvoice(env,v,fetch);
 assert.equal(d.invoiceId,draft.id);assert.deepEqual(calls[1].body,calls[4].body);assert.deepEqual(calls[2].body,calls[5].body);
 assert.equal(calls[2].body.invoice.delivery_method,"SHARE_MANUALLY");
 assert.equal(calls[2].body.invoice.payment_requests[0].automatic_payment_source,"NONE");
 assert.equal(calls[2].body.invoice.store_payment_method_enabled,false);
 const result=await publishSandboxInvoice(env,v,d,fetch);
 assert.equal(result.url,published.public_url);
 assert.equal(calls.at(-1).body.version,0);
});
test("amount mismatch, wrong recipient and unexpected link fail closed",async()=>{
 const a=fake({order:{total_money:{amount:10,currency:"AUD"}}});
 await assert.rejects(prepareSandboxInvoice(env,v,a.fetch),/quoted service/);
 assert.equal(a.calls.length,2);
 const b=fake({invoice:{primary_recipient:{customer_id:v.customerId,email_address:"other@example.test"}}});
 await assert.rejects(prepareSandboxInvoice(env,v,b.fetch),/reconciliation/);
 const c=fake({publish:{public_url:"https://squareupsandbox.com.evil.test/pay-invoice/x"}});
 await assert.rejects(publishSandboxInvoice(env,v,{invoiceId:draft.id,squareOrderId:draft.order_id},c.fetch),/reconciliation/);
 assert.equal(sandboxInvoiceUrl("https://squareupsandbox.com@evil.test/pay-invoice/x"),null);
 assert.equal(sandboxInvoiceUrl("https://squareupsandbox.com:443/pay-invoice/x"),"https://squareupsandbox.com/pay-invoice/x");
 await assert.rejects(prepareSandboxInvoice(env,{...v,email:"real@example.com"},a.fetch),/synthetic/);
});
test("invalid amount and invalid due date cannot build invoice",()=>{
 for(const patch of [{amountCents:0},{amountCents:1.5},{dueDate:"2026-02-31"}])assert.throws(()=>invoicePayload({...v,...patch},"sq-order","key"));
});

test("read-only invoice reconciliation verifies underlying completed payments, not invoice status alone",async()=>{
 const ids={invoiceId:draft.id,squareOrderId:draft.order_id},deadline="2026-12-01T01:00:00.000Z";
 const full={currency:"AUD",amount:3500},zero={currency:"AUD",amount:0};
 function provider(status,completed,tenders,payment,orderExtra={}){
  const calls=[];
  return {calls,fetch:async(url,init)=>{
   assert.equal(init.method,"GET");const path=new URL(url).pathname;calls.push(path);
   const data=path.includes("/invoices/")?{invoice:{...published,status,payment_requests:[{...draft.payment_requests[0],total_completed_amount_money:completed}]}}:path.includes("/orders/")?{order:{id:ids.squareOrderId,location_id:v.locationId,total_money:full,tenders,...orderExtra}}:{payment};
   return new Response(JSON.stringify(data));
  }};
 }
 const payment={id:"pay1",order_id:ids.squareOrderId,location_id:v.locationId,status:"COMPLETED",amount_money:full,total_money:full,refunded_money:zero,updated_at:"2026-11-30T00:00:00Z"};
 const check=async p=>inspectSandboxInvoice(env,v,ids,deadline,p.fetch);
 assert.equal((await check(provider("UNPAID",zero,[],null))).state,"unpaid");
 assert.equal((await check(provider("CANCELED",zero,[],null))).state,"cancelled_unpaid");
 assert.equal((await check(provider("PAID",full,[],null))).state,"review");
 assert.equal((await check(provider("PARTIALLY_PAID",{currency:"AUD",amount:1000},[{payment_id:"pay1"}],payment))).state,"review");
 assert.equal((await check(provider("PAID",full,[{payment_id:"pay1"}],payment))).state,"paid_verified");
 for(const patch of [{status:"APPROVED"},{order_id:"other"},{refunded_money:{currency:"AUD",amount:500}},{refund_ids:["refund1"]},{updated_at:"2026-12-02T00:00:00Z"},{amount_money:{currency:"AUD",amount:3499}}])assert.equal((await check(provider("PAID",full,[{payment_id:"pay1"}],{...payment,...patch}))).state,"review");
 assert.equal((await check(provider("PAID",full,[{payment_id:"pay1"}],payment,{refunds:[{}]}))).state,"review");
 assert.equal((await check(provider("PAID",full,[{payment_id:"pay1"},{payment_id:"pay1"}],payment))).state,"review");
 await assert.rejects(check(provider("PAID",full,[{payment_id:"pay1"}],payment,{total_money:{currency:"AUD",amount:1}})),/Underlying order/);
});
