import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {ownerSquareInvoiceWorkspace} from "./supportSquareInvoiceWorkspace";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";
import {inspectPreparedSupportSquareInvoice} from "./supportSquareInvoiceReconcile";

const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const RETRY_MS=15*60*1000;
const read=(env:Env,id:string)=>env.DB.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id=?").bind(id).first<any>();

// Only explicit, version-bound sandbox publication. Never mark the booking paid.
// If the response is lost, retrieve the same invoice before any retry.
export async function publishPreparedSupportSquareInvoice(
 env:Env,channel:Channel,requestId:string,orderId:string,ownerId:string,body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!ownerId||!b||b.confirmed!==true||b.issue_confirmed!==true||
 typeof b.fingerprint!=="string"||!/^[a-f0-9]{64}$/.test(b.fingerprint)||
 typeof b.version!=="number"||!Number.isSafeInteger(b.version)||b.version<0||!validId(b.provider_invoice_id))
  return {error:"Explicitly approve issuing the exact reviewed sandbox invoice version."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Square sandbox only."};
 const workspace=await ownerSquareInvoiceWorkspace(env,channel,requestId,orderId);
 let i=await read(env,orderId);
 if(!workspace?.eligible||!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId||
 i.provider_invoice_id!==b.provider_invoice_id||!["draft_created","publish_pending","issued"].includes(i.state))
  return {error:"The saved invoice is not eligible for publication. Review the arrangement first."};
 if(i.state==="issued"){
  if(i.publish_approved_version!==b.version)return {error:"The issued invoice version differs from this approval."};
  return {issued:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,paid:false};
 }
 if(i.state==="draft_created"&&i.provider_invoice_version!==b.version||i.state==="publish_pending"&&i.publish_approved_version!==b.version)
  return {error:"The invoice version changed. Review the current Square record."};
 const stamp=now.toISOString();
 const finish=async()=>{
  const verified=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
  if("error" in verified||!verified.issued_matches||!verified.public_url)return {error:"Publication could not be verified. Check the same Square record; do not issue another invoice.",pending:true};
  const r=await env.DB.prepare(`UPDATE support_square_invoice_intents SET state='issued',provider_invoice_version=?,provider_issued_at=?,provider_public_url=?,updated_at=?
   WHERE order_id=? AND fingerprint=? AND state='publish_pending' AND publish_approved_version=? AND provider_invoice_id=? AND publish_attempted_at IS NOT NULL
   AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=support_square_invoice_intents.order_id AND s.channel=? AND s.request_id=? AND s.status='confirmed'
    AND s.updated_at=support_square_invoice_intents.order_updated_at AND s.amount_cents=support_square_invoice_intents.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=support_square_invoice_intents.order_id)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_square_invoice_intents.order_id AND c.status='pending')`)
   .bind(verified.version,stamp,verified.public_url,stamp,orderId,b.fingerprint,b.version,b.provider_invoice_id,channel,requestId).run();
  const saved=await read(env,orderId);
  if(!saved||saved.state!=="issued"||saved.fingerprint!==b.fingerprint||saved.publish_approved_version!==b.version||saved.provider_invoice_id!==b.provider_invoice_id||saved.provider_public_url!==verified.public_url)
   return {error:"Remote publication needs local reconciliation. No booking payment state changed.",pending:true};
  return {issued:true,provider_invoice_id:saved.provider_invoice_id,version:saved.provider_invoice_version,paid:false};
 };
 const check=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
 if("error" in check)return {error:check.error};
 if(i.state==="publish_pending"&&check.issued_matches)return finish();
 if(!check.draft_matches||check.version!==b.version)return {error:"Square draft differs from the approved version or settings. No publication attempted."};
 const preview=await previewSupportInvoice(env,channel,requestId,orderId,{reviewed:true,customer_id:i.customer_id,due_at:i.due_at},fetchImpl,now);
 if("error" in preview||preview.fingerprint!==i.fingerprint||JSON.stringify({order:preview.provider_order,invoice:preview.provider_invoice})!==i.payload_json)
  return {error:"The original arrangement or deadline changed; do not publish."};
 if(i.state==="draft_created"){
  await env.DB.prepare(`UPDATE support_square_invoice_intents SET state='publish_pending',publish_attempted_at=?,publish_approved_version=?,publish_approved_by=?,updated_at=?
   WHERE order_id=? AND fingerprint=? AND state='draft_created' AND publish_attempted_at IS NULL AND provider_invoice_id=? AND provider_invoice_version=?
   AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=support_square_invoice_intents.order_id AND s.channel=? AND s.request_id=? AND s.status='confirmed'
    AND s.updated_at=support_square_invoice_intents.order_updated_at AND s.amount_cents=support_square_invoice_intents.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=support_square_invoice_intents.order_id)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_square_invoice_intents.order_id AND c.status='pending')`)
   .bind(stamp,b.version,ownerId,stamp,orderId,b.fingerprint,b.provider_invoice_id,b.version,channel,requestId).run();
 }
 const current=await read(env,orderId),fresh=await ownerSquareInvoiceWorkspace(env,channel,requestId,orderId);
 if(!fresh?.eligible||!current||current.fingerprint!==b.fingerprint||current.publish_invoice_key!==i.publish_invoice_key||current.provider_invoice_id!==b.provider_invoice_id||current.publish_approved_version!==b.version)
  return {error:"The saved preparation changed; reconcile before continuing."};
 i=current;
 if(i.state==="issued")return {issued:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,paid:false};
 const started=Date.parse(i.publish_attempted_at||"");
 if(i.state!=="publish_pending"||!validId(i.publish_invoice_key)||!Number.isFinite(started)||now.getTime()<started||now.getTime()-started>=RETRY_MS)
  return {error:"The publication retry window has closed. Inspect the existing record; no new request sent."};
 try{await squareCall(cfg,"POST","invoices/"+encodeURIComponent(b.provider_invoice_id)+"/publish",{version:b.version,idempotency_key:i.publish_invoice_key},fetchImpl);}
 catch{return {error:"Publication response uncertain. Check the existing invoice or retry the same operation within its recovery window.",pending:true};}
 return finish();
}
