import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";

type Intent={fingerprint:string;state:string;location_id:string;customer_id:string;amount_cents:number;
 due_at:string;payload_json:string;create_order_key:string;create_invoice_key:string;
 provider_order_id:string|null;provider_invoice_id:string|null;provider_invoice_version:number|null;
 invoice_attempted_at:string|null};
const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
const RETRY_MS=15*60*1000;
async function readIntent(env:Env,channel:Channel,requestId:string,orderId:string){
 return env.DB.prepare(`SELECT i.* FROM support_square_invoice_intents i
 JOIN support_service_orders s ON s.id=i.order_id
 WHERE i.order_id=? AND s.channel=? AND s.request_id=?
 AND s.status='confirmed' AND s.updated_at=i.order_updated_at AND s.amount_cents=i.amount_cents
 AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=s.id)
 AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending')`)
 .bind(orderId,channel,requestId).first<Intent>();
}
function retryable(i:Intent,now:Date){
 const started=Date.parse(i.invoice_attempted_at||"");
 return Number.isFinite(started)&&now.getTime()>=started&&now.getTime()-started<RETRY_MS;
}

// Creates only an unpublished draft. Never returns a payment URL or grants access.
// Keep this internal until a step-up protected Owner HQ workflow is implemented.
export async function createPreparedSupportSquareDraft(
 env:Env,channel:Channel,requestId:string,orderId:string,body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!b||b.confirmed!==true||typeof b.fingerprint!=="string"||
 !/^[a-f0-9]{64}$/.test(b.fingerprint))return {error:"Approve the exact prepared sandbox invoice first."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Square sandbox only."};
 let i=await readIntent(env,channel,requestId,orderId);
 if(!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId||!validId(i.provider_order_id))
  return {error:"The prepared order no longer matches. Reconcile it first."};
 if(i.state==="draft_created"&&validId(i.provider_invoice_id)&&Number.isSafeInteger(i.provider_invoice_version))
  return {draft_created:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,published:false};
 if(!["order_created","invoice_pending"].includes(i.state)||(i.state==="invoice_pending"&&!retryable(i,now)))
  return {error:"The draft attempt requires owner reconciliation; no new request sent."};
 const preview=await previewSupportInvoice(env,channel,requestId,orderId,{reviewed:true,customer_id:i.customer_id,due_at:i.due_at},fetchImpl,now);
 if("error" in preview||preview.fingerprint!==i.fingerprint||
 JSON.stringify({order:preview.provider_order,invoice:preview.provider_invoice})!==i.payload_json)
  return {error:"The prepared payload or eligibility changed. Reconcile it before continuing."};
 const stamp=now.toISOString(),providerOrderId=i.provider_order_id;
 let remoteOrder:any;
 try{remoteOrder=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(providerOrderId),undefined,fetchImpl)).order;}
 catch{return {error:"Unable to verify the existing Square order; no invoice request sent."};}
 if(remoteOrder?.id!==providerOrderId||remoteOrder.reference_id!==i.create_order_key||
 remoteOrder.location_id!==i.location_id||remoteOrder.customer_id!==i.customer_id||
 remoteOrder.state!=="OPEN"||!money(remoteOrder.total_money,i.amount_cents)){
  await env.DB.prepare("UPDATE support_square_invoice_intents SET state='review',updated_at=? WHERE order_id=? AND fingerprint=? AND state IN ('order_created','invoice_pending')").bind(stamp,orderId,b.fingerprint).run();
  return {error:"Square order no longer matches the reviewed arrangement."};
 }
 if(i.state==="order_created"){
  await env.DB.prepare(`UPDATE support_square_invoice_intents SET state='invoice_pending',invoice_attempted_at=?,updated_at=?
   WHERE order_id=? AND fingerprint=? AND state='order_created' AND invoice_attempted_at IS NULL
   AND provider_order_id=? AND provider_invoice_id IS NULL
   AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=support_square_invoice_intents.order_id
    AND s.channel=? AND s.request_id=? AND s.status='confirmed' AND s.updated_at=support_square_invoice_intents.order_updated_at
    AND s.amount_cents=support_square_invoice_intents.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=support_square_invoice_intents.order_id)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_square_invoice_intents.order_id AND c.status='pending')`)
   .bind(stamp,stamp,orderId,b.fingerprint,providerOrderId,channel,requestId).run();
 }
 const current=await readIntent(env,channel,requestId,orderId);
 if(!current||current.fingerprint!==b.fingerprint||current.create_invoice_key!==i.create_invoice_key||current.provider_order_id!==providerOrderId)
  return {error:"The preparation changed before submission; reconcile it."};
 i=current;
 if(i.state==="draft_created"&&validId(i.provider_invoice_id)&&Number.isSafeInteger(i.provider_invoice_version))
  return {draft_created:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,published:false};
 if(i.state!=="invoice_pending"||!retryable(i,now)||!validId(i.create_invoice_key)||i.provider_invoice_id)
  return {error:"No safe pending draft attempt is available; reconcile it first."};
 const key=i.create_invoice_key;
 let invoice:any;
 try{invoice=(await squareCall(cfg,"POST","invoices",{idempotency_key:key,invoice:{...preview.provider_invoice,order_id:providerOrderId}},fetchImpl)).invoice;}
 catch{return {error:"Square draft response uncertain. Retry the same preparation within the recovery window or reconcile it; nothing was published by Side-Quest.",pending:true};}
 const p=invoice?.payment_requests;
 if(!validId(invoice?.id)||!Number.isSafeInteger(invoice.version)||invoice.version<0||
 invoice.location_id!==i.location_id||invoice.order_id!==providerOrderId||
 invoice.primary_recipient?.customer_id!==i.customer_id||
 String(invoice.primary_recipient?.email_address||"").trim().toLowerCase()!==preview.recipient.trim().toLowerCase()||
 invoice.status!=="DRAFT"||invoice.delivery_method!=="EMAIL"||invoice.subscription_id||invoice.public_url||
 !Array.isArray(p)||p.length!==1||p[0].request_type!=="BALANCE"||p[0].due_date!==preview.due_date||
 p[0].automatic_payment_source!=="NONE"||p[0].card_id||p[0].bank_account_id||p[0].tipping_enabled===true||
 !money(p[0].computed_amount_money,i.amount_cents)||!money(p[0].total_completed_amount_money,0)){
  await env.DB.prepare("UPDATE support_square_invoice_intents SET state='review',updated_at=? WHERE order_id=? AND create_invoice_key=? AND state='invoice_pending'").bind(stamp,orderId,key).run();
  return {error:"Square returned an unexpected invoice. Owner reconciliation is required; no publication attempted."};
 }
 try{
  await env.DB.prepare("UPDATE support_square_invoice_intents SET state='draft_created',provider_invoice_id=?,provider_invoice_version=?,updated_at=? WHERE order_id=? AND create_invoice_key=? AND fingerprint=? AND state='invoice_pending' AND provider_invoice_id IS NULL")
  .bind(invoice.id,invoice.version,stamp,orderId,key,b.fingerprint).run();
 }catch{return {error:"Square draft storage is uncertain. Reconcile the same operation; no publication attempted.",pending:true};}
 const saved=await readIntent(env,channel,requestId,orderId);
 if(!saved||saved.state!=="draft_created"||saved.create_invoice_key!==key||saved.provider_invoice_id!==invoice.id||saved.provider_invoice_version!==invoice.version)
  return {error:"Draft reconciliation is required; no publication attempted."};
 return {draft_created:true,provider_invoice_id:invoice.id,version:invoice.version,published:false};
}
