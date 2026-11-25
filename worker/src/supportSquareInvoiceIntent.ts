import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import type {Fetch} from "./square";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";

// Local preparation only. Do not add provider writes until all competing payment
// paths are guarded and uncertain provider responses can be reconciled safely.
export async function prepareSupportInvoiceIntent(
 env:Env,channel:Channel,requestId:string,orderId:string,ownerId:string,
 body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!b||b.confirmed!==true||typeof b.fingerprint!=="string"||!(/^[a-f0-9]{64}$/).test(b.fingerprint)||!ownerId)
  return {error:"Explicitly approve the exact reviewed sandbox preview."};
 const p=await previewSupportInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
 if("error" in p)return {error:p.error};
 if(p.fingerprint!==b.fingerprint)return {error:"The arrangement changed. Review a fresh preview."};
 const stamp=now.toISOString();
 // Never persist the parent's email or learner details in the provider payload.
 const payload=JSON.stringify({order:p.provider_order,invoice:p.provider_invoice});
 // Atomic insert: no stale order, active cancellation, checkout, or manual invoice.
 // The order primary key prevents concurrent reservations, including conflicting previews.
 await env.DB.prepare(`
 INSERT INTO support_square_invoice_intents
 (order_id,fingerprint,location_id,customer_id,amount_cents,due_at,order_updated_at,payload_json,
 create_order_key,create_invoice_key,publish_invoice_key,created_by,created_at,updated_at)
 SELECT s.id,?,?,?,?,?,?,?,?,?,?,?,?,?
 FROM support_service_orders s
 WHERE s.id=? AND s.channel=? AND s.request_id=? AND s.updated_at=? AND s.amount_cents=?
 AND s.status='confirmed' AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=s.id)
 AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending')
 ON CONFLICT(order_id) DO NOTHING`)
 .bind(p.fingerprint,p.location_id,p.customer_id,p.amount_cents,p.due_at,p.updated_at,payload,
 crypto.randomUUID(),crypto.randomUUID(),crypto.randomUUID(),ownerId,stamp,stamp,
 orderId,channel,requestId,p.updated_at,p.amount_cents).run();
 const row=await env.DB.prepare("SELECT fingerprint,state FROM support_square_invoice_intents WHERE order_id=?")
 .bind(orderId).first<{fingerprint:string;state:string}>();
 if(!row||row.fingerprint!==p.fingerprint||row.state!=="prepared")
  return {error:"A changed or existing invoice intent requires owner review; nothing was issued."};
 return {prepared:true,order_id:orderId,fingerprint:p.fingerprint,state:row.state,provider_created:false};
}
