import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {inspectPreparedSupportSquareInvoice} from "./supportSquareInvoiceReconcile";
import {getOrder} from "./supportOrders";

export async function recordInvoiceReview(db:D1Database,orderId:string,reason:"payment_uncertain"|"payment_retry"|"refund"|"provider_cancellation"|"dispute",now=new Date()){
 const at=now.toISOString();
 await db.prepare("INSERT INTO support_square_invoice_reviews(order_id,reason,first_at,last_at) VALUES(?,?,?,?) ON CONFLICT(order_id) DO UPDATE SET reason=excluded.reason,last_at=excluded.last_at,resolved_at=NULL").bind(orderId,reason,at,at).run();
}
export async function clearInvoiceReview(db:D1Database,orderId:string,now=new Date()){
 await db.prepare("UPDATE support_square_invoice_reviews SET resolved_at=? WHERE order_id=? AND resolved_at IS NULL AND reason IN ('payment_uncertain','payment_retry')").bind(now.toISOString(),orderId).run();
}

// The owner cancels the unpaid invoice in Square first. We never initiate a refund,
// infer cancellation from an overdue date, or accept a missing remote record as proof.
export async function releaseVerifiedUnpaidSquareInvoice(env:Env,channel:Channel,requestId:string,orderId:string,ownerId:string,body:unknown,fetchImpl?:Fetch,now=new Date()){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!ownerId||!b||b.confirmed!==true||b.cancelled_in_square!==true||b.parent_notified!==true||typeof b.fingerprint!=="string")return {error:"Confirm the unpaid invoice was cancelled in Square and the parent notified."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const o=await getOrder(env.DB,channel,requestId,orderId);
 const i=await env.DB.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id=?").bind(orderId).first<any>();
 if(!o||!i||i.state!=="issued"||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId||!i.provider_invoice_id||!i.provider_order_id)return {error:"No matching issued invoice."};
 if(o.status==="cancelled"&&await env.DB.prepare("SELECT 1 FROM support_square_invoice_cancellations WHERE order_id=? AND invoice_id=?").bind(orderId,i.provider_invoice_id).first())return {released:true};
 if(o.status!=="confirmed"||o.updated_at!==i.order_updated_at||o.amount_cents!==i.amount_cents||o.checkout_started_at||o.square_order_id||await env.DB.prepare("SELECT 1 FROM support_square_invoice_settlements WHERE order_id=?").bind(orderId).first())return {error:"Booking or payment state requires review."};
 const stamp=now.toISOString();
 const pending=await env.DB.prepare("SELECT 1 FROM support_cancellation_requests WHERE order_id=? AND status='pending'").bind(orderId).first();
 if(i.due_at>stamp&&!pending)return {error:"This reservation is not overdue and has no pending cancellation request."};
 const checked=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
 if("error" in checked||!checked.invoice_checked||checked.status!=="CANCELED"||checked.completed_cents!==0||checked.provider_invoice_id!==i.provider_invoice_id||!Number.isSafeInteger(checked.version)||checked.version<i.provider_invoice_version)return {error:"Square has not confirmed a matching cancelled, unpaid invoice."};
 let remote:any;
 try{remote=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(i.provider_order_id),undefined,fetchImpl)).order;}catch{return {error:"Unable to verify the cancelled Square order."};}
 if(remote?.id!==i.provider_order_id||remote.state!=="CANCELED"||remote.reference_id!==i.create_order_key||remote.location_id!==i.location_id||remote.customer_id!==i.customer_id||remote.total_money?.currency!=="AUD"||remote.total_money?.amount!==i.amount_cents||(remote.tenders!=null&&(!Array.isArray(remote.tenders)||remote.tenders.length!==0)))return {error:"Square order is not conclusively cancelled without payment. Keep the reservation."};
 try{
 const res=await env.DB.batch([
 env.DB.prepare(`INSERT INTO support_square_invoice_cancellations(order_id,invoice_id,provider_version,verified_at,verified_by)
 SELECT s.id,i.provider_invoice_id,?,?,? FROM support_service_orders s JOIN support_square_invoice_intents i ON i.order_id=s.id
 WHERE s.id=? AND s.channel=? AND s.request_id=? AND i.state='issued' AND i.fingerprint=? AND i.provider_invoice_id=?
 AND s.status='confirmed' AND s.updated_at=i.order_updated_at AND s.amount_cents=i.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL
 AND (i.due_at<=? OR EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending'))
 AND NOT EXISTS(SELECT 1 FROM support_square_invoice_settlements p WHERE p.order_id=s.id)
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=s.id)
 AND NOT EXISTS(SELECT 1 FROM support_package_sessions p JOIN support_service_orders x ON x.id=p.order_id WHERE p.root_id=s.id AND x.id<>s.id AND NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=s.id) AND x.status<>'confirmed')
 ON CONFLICT DO NOTHING`).bind(checked.version,stamp,ownerId,orderId,channel,requestId,i.fingerprint,i.provider_invoice_id,stamp),
 env.DB.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND changes()=1 AND EXISTS(SELECT 1 FROM support_square_invoice_cancellations c WHERE c.order_id=support_service_orders.id AND c.verified_at=?)").bind(stamp,orderId,channel,requestId,stamp),
 env.DB.prepare("UPDATE support_cancellation_requests SET status='resolved',resolved_at=? WHERE status='pending' AND order_id IN (SELECT id FROM support_service_orders WHERE channel=? AND request_id=? AND status='cancelled' AND updated_at=? AND (id=? OR id IN(SELECT order_id FROM support_package_sessions WHERE root_id=?))) AND EXISTS(SELECT 1 FROM support_square_invoice_cancellations WHERE order_id=? AND verified_at=?)").bind(stamp,channel,requestId,stamp,orderId,orderId,orderId,stamp),
 env.DB.prepare("UPDATE support_square_invoice_reviews SET resolved_at=? WHERE order_id=? AND EXISTS(SELECT 1 FROM support_service_orders WHERE id=? AND status='cancelled' AND updated_at=?)").bind(stamp,orderId,orderId,stamp)
 ]);
 return res[0]?.meta?.changes===1&&res[1]?.meta?.changes===1?{released:true}:{error:"Reservation changed; review before release."};
 }catch{return {error:"Unable to safely release this reservation. Review the booking and invoice."};}
}
