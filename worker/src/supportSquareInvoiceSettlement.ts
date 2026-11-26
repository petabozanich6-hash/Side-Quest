import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {inspectPreparedSupportSquareInvoice} from "./supportSquareInvoiceReconcile";
import {getOrder,type Channel} from "./supportOrders";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(m:any,n:number)=>m?.currency==="AUD"&&Number.isSafeInteger(m.amount)&&m.amount===n;

// Only exact, full, captured card payments can automatically settle this pilot.
// Multi-tender, late, partial, disputed, refunded and externally modified records stay in review.
export async function verifyIssuedSupportSquarePayment(env:Env,channel:Channel,requestId:string,orderId:string,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(env))return {error:"Sandbox payment verification unavailable."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const o=await getOrder(env.DB,channel,requestId,orderId);
 const i=await env.DB.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id=?").bind(orderId).first<any>();
 if(!o||!i||i.state!=="issued"||!idOk(i.provider_order_id)||!idOk(i.provider_invoice_id)||i.location_id!==cfg.locationId)
  return {error:"No matching issued invoice."};
 const proof=await env.DB.prepare("SELECT * FROM support_square_invoice_settlements WHERE order_id=?").bind(orderId).first<any>();
 if(proof)return {status:proof.review_at||!["paid","completed"].includes(o.status)?"review":"verified",verified:!proof.review_at&&["paid","completed"].includes(o.status)};
 const review=()=>({status:"review",verified:false});
 if(o.status!=="confirmed"||o.updated_at!==i.order_updated_at||o.amount_cents!==i.amount_cents||o.checkout_started_at||o.square_order_id)return review();
 const checked=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,{confirmed:true,fingerprint:i.fingerprint},fetchImpl,now);
 if("error" in checked||!checked.invoice_checked)return review();
 if(checked.status==="UNPAID"&&checked.completed_cents===0)return {status:"unpaid",verified:false};
 if(checked.status!=="PAID"||!checked.settlement_settings_match||checked.completed_cents!==i.amount_cents||checked.provider_invoice_id!==i.provider_invoice_id)return review();
 let order:any,payment:any;
 try{
  order=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(i.provider_order_id),undefined,fetchImpl)).order;
  if(order?.id!==i.provider_order_id||order.reference_id!==i.create_order_key||order.location_id!==i.location_id||order.customer_id!==i.customer_id||
   !["OPEN","COMPLETED"].includes(order.state)||!money(order.total_money,i.amount_cents)||!Array.isArray(order.tenders)||order.tenders.length!==1||
   !money(order.tenders[0].amount_money,i.amount_cents)||!idOk(order.tenders[0].payment_id))return review();
  payment=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(order.tenders[0].payment_id),undefined,fetchImpl)).payment;
 }catch{return {status:"retry",verified:false};}
 const capture=payment?.card_details?.card_payment_timeline?.captured_at;
 const captured=typeof capture==="string"?Date.parse(capture):NaN;
 const deadline=Date.parse(i.due_at),attempt=Date.parse(i.publish_attempted_at);
 if(payment?.id!==order.tenders[0].payment_id||payment.order_id!==i.provider_order_id||payment.location_id!==i.location_id||
 payment.customer_id!==i.customer_id||payment.status!=="COMPLETED"||payment.source_type!=="CARD"||payment.card_details?.status!=="CAPTURED"||
 !money(payment.amount_money,i.amount_cents)||!money(payment.total_money,i.amount_cents)||
 (payment.refunded_money!=null&&!money(payment.refunded_money,0))||(payment.refund_ids!=null&&(!Array.isArray(payment.refund_ids)||payment.refund_ids.length>0))||
 (payment.tip_money!=null&&!money(payment.tip_money,0))||payment.risk_evaluation?.risk_level==="HIGH"||
 !Number.isFinite(captured)||!Number.isFinite(deadline)||!Number.isFinite(attempt)||captured<attempt||captured>deadline||captured>now.getTime()||
 (o.start_at&&Date.parse(o.start_at)<=now.getTime()))return review();
 // Full-price packages propagate only if every child booking is still confirmed and future.
 const stamp=now.toISOString(),paidAt=new Date(captured).toISOString();
 try{
 const res=await env.DB.batch([
  env.DB.prepare(`INSERT INTO support_square_invoice_settlements(order_id,payment_id,invoice_id,amount_cents,captured_at,verified_at)
   SELECT s.id,?,?,?,?,? FROM support_service_orders s JOIN support_square_invoice_intents i ON i.order_id=s.id
   WHERE s.id=? AND s.channel=? AND s.request_id=? AND i.state='issued' AND i.fingerprint=? AND i.provider_invoice_id=?
   AND s.status='confirmed' AND s.updated_at=i.order_updated_at AND s.amount_cents=i.amount_cents
   AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL AND (s.start_at IS NULL OR s.start_at>?)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=s.id)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending')
   AND NOT EXISTS(SELECT 1 FROM support_package_sessions p JOIN support_service_orders x ON x.id=p.order_id
    WHERE p.root_id=s.id AND x.id<>s.id AND NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=s.id)
    AND (x.status<>'confirmed' OR x.start_at<=? OR EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=x.id AND c.status='pending')))
   ON CONFLICT DO NOTHING`)
   .bind(payment.id,i.provider_invoice_id,i.amount_cents,paidAt,stamp,orderId,channel,requestId,i.fingerprint,i.provider_invoice_id,stamp,stamp),
  env.DB.prepare(`UPDATE support_service_orders SET status='paid',paid_at=?,updated_at=?
   WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND changes()=1
   AND EXISTS(SELECT 1 FROM support_square_invoice_settlements p WHERE p.order_id=support_service_orders.id AND p.payment_id=? AND p.review_at IS NULL)`)
   .bind(paidAt,stamp,orderId,channel,requestId,payment.id)
 ]);
 if(res[0]?.meta?.changes===1&&res[1]?.meta?.changes===1)return {status:"verified",verified:true};
 }catch{return review();}
 const saved=await env.DB.prepare("SELECT p.payment_id,p.review_at,s.status FROM support_square_invoice_settlements p JOIN support_service_orders s ON s.id=p.order_id WHERE p.order_id=?").bind(orderId).first<any>();
 return saved?.payment_id===payment.id&&!saved.review_at&&["paid","completed"].includes(saved.status)?{status:"verified",verified:true}:review();
}

// Use only after signed webhook routing; the event carries an identifier, not proof.
export async function reconcileSupportInvoiceEvent(env:Env,invoiceId:string|null,providerOrderId:string|null,fetchImpl?:Fetch,now=new Date()):Promise<string|null>{
 if(!supportInvoiceLookupAvailable(env)||(!idOk(invoiceId)&&!idOk(providerOrderId)))return null;
 if(!await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_square_invoice_settlements'").first())return null;
 const row=await env.DB.prepare(`SELECT s.id,s.channel,s.request_id FROM support_square_invoice_intents i JOIN support_service_orders s ON s.id=i.order_id
 WHERE (? IS NOT NULL AND i.provider_invoice_id=?) OR (? IS NOT NULL AND i.provider_order_id=?) LIMIT 1`).bind(invoiceId,invoiceId,providerOrderId,providerOrderId).first<any>();
 if(!row)return null;
 const result=await verifyIssuedSupportSquarePayment(env,row.channel,row.request_id,row.id,fetchImpl,now);
 if(result.status==="retry")throw Error("Invoice payment verification temporarily unavailable");
 return result.verified?"support invoice payment verified":"support invoice payment requires review";
}

// Refund events are already retrieved from Square by the signed webhook handler.
// A refund never releases a lesson automatically; it flags the proof and booking for review.
export async function flagIssuedSupportInvoiceRefund(env:Env,refund:any,now=new Date()):Promise<string|null>{
 if(!supportInvoiceLookupAvailable(env)||!idOk(refund?.payment_id))return null;
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production||refund.location_id!==cfg.locationId)return null;
 if(!await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_square_invoice_settlements'").first())return null;
 const row=await env.DB.prepare("SELECT p.order_id FROM support_square_invoice_settlements p JOIN support_square_invoice_intents i ON i.order_id=p.order_id WHERE p.payment_id=? AND i.location_id=?").bind(refund.payment_id,cfg.locationId).first<any>();
 if(!row)return null;
 if(!["PENDING","COMPLETED","REJECTED","FAILED"].includes(refund.status))return "support invoice refund requires review";
 const stamp=now.toISOString();
 await env.DB.batch([
  env.DB.prepare("UPDATE support_square_invoice_settlements SET review_at=COALESCE(review_at,?) WHERE order_id=?").bind(stamp,row.order_id),
  env.DB.prepare("UPDATE support_service_orders SET status='review',updated_at=? WHERE id=? AND status IN ('paid','completed','confirmed')").bind(stamp,row.order_id)
 ]);
 return "support invoice refund requires review";
}
