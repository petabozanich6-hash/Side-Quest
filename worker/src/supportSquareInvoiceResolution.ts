import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {inspectPreparedSupportSquareInvoice} from "./supportSquareInvoiceReconcile";
import {verifyIssuedSupportSquarePayment} from "./supportSquareInvoiceSettlement";
import {getOrder} from "./supportOrders";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(m:any,n:number)=>m?.currency==="AUD"&&m.amount===n;

// Record an already-completed full refund, never initiate one. Package-wide,
// partial, multiple-payment and disputed arrangements remain explicitly held.
export async function resolveFullyRefundedSupportInvoice(env:Env,channel:Channel,requestId:string,orderId:string,ownerId:string,body:unknown,fetchImpl?:Fetch,now=new Date()){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!ownerId||!b||b.confirmed!==true||b.parent_notified!==true||b.dispute_checked!==true||typeof b.fingerprint!=="string")return {error:"Confirm the full refund, no unresolved dispute, and parent notification."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const o=await getOrder(env.DB,channel,requestId,orderId);
 const i=await env.DB.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id=?").bind(orderId).first<any>();
 if(!o||!i||i.state!=="issued"||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId)return {error:"No matching issued invoice."};
 if(o.status==="cancelled"&&await env.DB.prepare("SELECT 1 FROM support_square_invoice_refund_resolutions WHERE order_id=? AND invoice_id=?").bind(orderId,i.provider_invoice_id).first())return {released:true};
 const p=await env.DB.prepare("SELECT * FROM support_square_invoice_settlements WHERE order_id=?").bind(orderId).first<any>();
 const hold=await env.DB.prepare("SELECT * FROM support_square_invoice_reviews WHERE order_id=? AND resolved_at IS NULL").bind(orderId).first<any>();
 if(o.status!=="review"||!p?.review_at||hold?.reason!=="refund"||p.invoice_id!==i.provider_invoice_id||p.amount_cents!==i.amount_cents||o.amount_cents!==i.amount_cents||
 !idOk(p.payment_id)||!idOk(i.provider_order_id)||(o.package_root_id&&!o.installment_due_at)||(o.start_at&&Date.parse(o.start_at)<=now.getTime()))
 return {error:"Only a future or undelivered, single fully refunded arrangement is eligible. Keep other financial holds for review."};
 const checked=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
 if("error" in checked||!checked.invoice_checked||checked.status!=="REFUNDED"||checked.provider_invoice_id!==i.provider_invoice_id)return {error:"Square invoice does not show a completed full refund."};
 let payment:any,refund:any;
 try{
 payment=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(p.payment_id),undefined,fetchImpl)).payment;
 if(payment?.id!==p.payment_id||payment.order_id!==i.provider_order_id||payment.location_id!==cfg.locationId||payment.customer_id!==i.customer_id||
 payment.status!=="COMPLETED"||!money(payment.amount_money,i.amount_cents)||!money(payment.total_money,i.amount_cents)||!money(payment.refunded_money,i.amount_cents)||
 !Array.isArray(payment.refund_ids)||payment.refund_ids.length!==1||!idOk(payment.refund_ids[0]))return {error:"Payment is not conclusively fully refunded in a single transaction."};
 refund=(await squareCall(cfg,"GET","refunds/"+encodeURIComponent(payment.refund_ids[0]),undefined,fetchImpl)).refund;
 }catch{return {error:"Unable to verify the Square refund; keep the reservation."};}
 if(refund?.id!==payment.refund_ids[0]||refund.payment_id!==p.payment_id||refund.location_id!==cfg.locationId||refund.status!=="COMPLETED"||!money(refund.amount_money,i.amount_cents))return {error:"The original payment refund is not confirmed complete."};
 const at=now.toISOString();
 try{
 const r=await env.DB.batch([
 env.DB.prepare(`INSERT INTO support_square_invoice_refund_resolutions(order_id,invoice_id,payment_id,refund_id,amount_cents,verified_by,verified_at)
 SELECT s.id,i.provider_invoice_id,p.payment_id,?,i.amount_cents,?,? FROM support_service_orders s
 JOIN support_square_invoice_intents i ON i.order_id=s.id JOIN support_square_invoice_settlements p ON p.order_id=s.id
 JOIN support_square_invoice_reviews v ON v.order_id=s.id
 WHERE s.id=? AND s.channel=? AND s.request_id=? AND s.status='review' AND s.updated_at=? AND i.fingerprint=? AND i.state='issued'
 AND i.provider_invoice_id=? AND p.payment_id=? AND p.review_at IS NOT NULL AND p.amount_cents=i.amount_cents AND s.amount_cents=i.amount_cents
 AND v.reason='refund' AND v.resolved_at IS NULL AND v.last_at=?
 AND (s.start_at IS NULL OR s.start_at>?)
 AND NOT EXISTS(SELECT 1 FROM support_package_sessions x WHERE x.order_id=s.id AND NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=s.id))
 ON CONFLICT DO NOTHING`).bind(refund.id,ownerId,at,orderId,channel,requestId,o.updated_at,i.fingerprint,i.provider_invoice_id,p.payment_id,hold.last_at,at),
 env.DB.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE id=? AND status='review' AND changes()=1 AND EXISTS(SELECT 1 FROM support_square_invoice_refund_resolutions r WHERE r.order_id=support_service_orders.id AND r.verified_at=?)").bind(at,orderId,at),
 env.DB.prepare("UPDATE support_square_invoice_reviews SET resolved_at=? WHERE order_id=? AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=? AND s.status='cancelled' AND s.updated_at=?)").bind(at,orderId,orderId,at),
 env.DB.prepare("UPDATE support_cancellation_requests SET status='resolved',resolved_at=? WHERE order_id=? AND status='pending' AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=? AND s.status='cancelled' AND s.updated_at=?)").bind(at,orderId,orderId,at)
 ]);
 return r[0]?.meta?.changes===1&&r[1]?.meta?.changes===1?{released:true}:{error:"Financial or booking state changed; review before release."};
 }catch{return {error:"Unable to record full refund resolution safely."};}
}

// Revisit issued confirmed records even when an early webhook preceded publication.
// Never auto-retry publication, and never clear a refund/dispute hold.
export async function recheckIssuedSupportInvoices(env:Env,now=new Date(),fetchImpl?:Fetch){
 if(!supportInvoiceLookupAvailable(env))return {checked:0,verified:0};
 if(!await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_square_invoice_recheck'").first())return {checked:0,verified:0};
 const at=now.toISOString(),cutoff=new Date(now.getTime()-15*60000).toISOString();
 const rows=(await env.DB.prepare(`SELECT s.id,s.channel,s.request_id FROM support_service_orders s JOIN support_square_invoice_intents i ON i.order_id=s.id
 LEFT JOIN support_square_invoice_recheck r ON r.order_id=s.id
 WHERE i.state='issued' AND s.status='confirmed' AND (r.checked_at IS NULL OR r.checked_at<=?)
 AND NOT EXISTS(SELECT 1 FROM support_square_invoice_reviews v WHERE v.order_id=s.id AND v.resolved_at IS NULL AND v.reason IN ('refund','dispute','provider_cancellation'))
 AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending')
 ORDER BY COALESCE(r.checked_at,'') ASC,s.id LIMIT 5`).bind(cutoff).all<{id:string;channel:Channel;request_id:string}>()).results||[];
 let checked=0,verified=0;
 for(const r of rows){
 const claim=await env.DB.prepare("INSERT INTO support_square_invoice_recheck(order_id,checked_at,outcome) VALUES(?,?,'checking') ON CONFLICT(order_id) DO UPDATE SET checked_at=excluded.checked_at,outcome='checking' WHERE support_square_invoice_recheck.checked_at<=?").bind(r.id,at,cutoff).run();
 if(!claim.meta?.changes)continue;
 checked++;let outcome="retry";
 try{const result=await verifyIssuedSupportSquarePayment(env,r.channel,r.request_id,r.id,fetchImpl,now);outcome=result.status||"review";if(result.verified)verified++;}catch{}
 await env.DB.prepare("UPDATE support_square_invoice_recheck SET outcome=? WHERE order_id=? AND checked_at=?").bind(outcome,r.id,at).run();
 }
 return {checked,verified};
}
