import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";

type Intent={fingerprint:string;state:string;location_id:string;customer_id:string;amount_cents:number;
 due_at:string;payload_json:string;create_order_key:string;order_attempted_at:string|null;provider_order_id:string|null};
const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
// Conservative local retry window, not a claim about Square's retention guarantee.
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
 const started=Date.parse(i.order_attempted_at||"");
 return Number.isFinite(started)&&now.getTime()>=started&&now.getTime()-started<RETRY_MS;
}

// Internal sandbox-only helper. No invoice, publication, checkout URL or payment is created.
// A route must enforce Owner HQ permission, passkey and explicit owner confirmation.
export async function createPreparedSupportSquareOrder(
 env:Env,channel:Channel,requestId:string,orderId:string,body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!b||b.confirmed!==true||typeof b.fingerprint!=="string"||
 !/^[a-f0-9]{64}$/.test(b.fingerprint))return {error:"Approve the exact prepared sandbox invoice first."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Square sandbox only."};
 let i=await readIntent(env,channel,requestId,orderId);
 if(!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId)return {error:"The prepared arrangement no longer matches. Reconcile it first."};
 if(i.state==="order_created"&&validId(i.provider_order_id))return {order_created:true,provider_order_id:i.provider_order_id,invoice_created:false};
 if(!["prepared","order_pending"].includes(i.state)||(i.state==="order_pending"&&!retryable(i,now)))return {error:"The remote order attempt requires owner reconciliation; no new request sent."};
 // Freshly verify customer, current deadline, amount, scope and eligibility before any remote write.
 const preview=await previewSupportInvoice(env,channel,requestId,orderId,{reviewed:true,customer_id:i.customer_id,due_at:i.due_at},fetchImpl,now);
 if("error" in preview||preview.fingerprint!==i.fingerprint||
 JSON.stringify({order:preview.provider_order,invoice:preview.provider_invoice})!==i.payload_json)
 return {error:"The prepared payload or eligibility changed. Reconcile it before continuing."};
 const stamp=now.toISOString();
 if(i.state==="prepared"){
  await env.DB.prepare(`UPDATE support_square_invoice_intents SET state='order_pending',order_attempted_at=?,updated_at=?
   WHERE order_id=? AND fingerprint=? AND state='prepared' AND order_attempted_at IS NULL
   AND provider_order_id IS NULL AND provider_invoice_id IS NULL
   AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=support_square_invoice_intents.order_id
    AND s.channel=? AND s.request_id=? AND s.status='confirmed' AND s.updated_at=support_square_invoice_intents.order_updated_at
    AND s.amount_cents=support_square_invoice_intents.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=support_square_invoice_intents.order_id)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_square_invoice_intents.order_id AND c.status='pending')`)
   .bind(stamp,stamp,orderId,b.fingerprint,channel,requestId).run();
 }
 const current=await readIntent(env,channel,requestId,orderId);
 if(!current||current.fingerprint!==b.fingerprint||current.create_order_key!==i.create_order_key)
  return {error:"The preparation changed before submission; reconcile it."};
 i=current;
 if(i.state==="order_created"&&validId(i.provider_order_id))return {order_created:true,provider_order_id:i.provider_order_id,invoice_created:false};
 if(i.state!=="order_pending"||!retryable(i,now)||!validId(i.create_order_key)||i.provider_order_id)
  return {error:"No safe pending order attempt is available; reconcile it first."};
 const key=i.create_order_key;
 // A retry always uses the same persisted key and exact reviewed order payload.
 // Use the opaque operation key as the Square reference, never learner details.
 let o:any;
 try{o=(await squareCall(cfg,"POST","orders",{idempotency_key:key,order:{...preview.provider_order,reference_id:key,state:"OPEN"}},fetchImpl)).order;}
 catch{return {error:"Square order response uncertain. Retry the same preparation within the recovery window or reconcile it; no invoice issued.",pending:true};}
 if(!validId(o?.id)||o.reference_id!==key||o.location_id!==i.location_id||o.customer_id!==i.customer_id||
 o.state!=="OPEN"||o.total_money?.currency!=="AUD"||o.total_money?.amount!==i.amount_cents){
  await env.DB.prepare("UPDATE support_square_invoice_intents SET state='review',updated_at=? WHERE order_id=? AND create_order_key=? AND state='order_pending'").bind(stamp,orderId,key).run();
  return {error:"Square returned an unexpected order. Owner reconciliation is required; no invoice issued."};
 }
 try{
  await env.DB.prepare("UPDATE support_square_invoice_intents SET state='order_created',provider_order_id=?,updated_at=? WHERE order_id=? AND create_order_key=? AND fingerprint=? AND state='order_pending' AND provider_order_id IS NULL")
  .bind(o.id,stamp,orderId,key,b.fingerprint).run();
 }catch{return {error:"Square order storage is uncertain. Reconcile the same operation; no invoice issued.",pending:true};}
 const saved=await readIntent(env,channel,requestId,orderId);
 if(!saved||saved.state!=="order_created"||saved.create_order_key!==key||saved.provider_order_id!==o.id)
  return {error:"Order reconciliation is required; no invoice issued."};
 return {order_created:true,provider_order_id:o.id,invoice_created:false};
}
