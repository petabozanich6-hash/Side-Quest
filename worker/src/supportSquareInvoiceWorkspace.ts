import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";

export async function ownerSquareInvoiceWorkspace(env:Env,channel:Channel,requestId:string,orderId:string){
 if(!supportInvoiceLookupAvailable(env))return null;
 const o=await getOrder(env.DB,channel,requestId,orderId);
 if(!o)return null;
 const who=await supportInvoiceRecipient(env.DB,channel,requestId);
 const intent=await env.DB.prepare(`SELECT fingerprint,state,customer_id,amount_cents,due_at,
 provider_order_id,provider_invoice_id,provider_invoice_version,order_attempted_at,invoice_attempted_at,
 publish_attempted_at,publish_approved_version,provider_issued_at,order_updated_at,updated_at FROM support_square_invoice_intents WHERE order_id=?`).bind(orderId).first<any>();
 const conflict=await env.DB.prepare("SELECT 1 FROM support_manual_invoices WHERE order_id=? UNION ALL SELECT 1 FROM support_cancellation_requests WHERE order_id=? AND status='pending' LIMIT 1").bind(orderId,orderId).first();
 const eligible=!!who&&who.email.trim().toLowerCase()===String(env.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()&&
 o.status==="confirmed"&&Number.isSafeInteger(o.amount_cents)&&o.amount_cents>0&&!o.checkout_started_at&&!o.square_order_id&&!conflict&&
 !(o.package_sequence>1&&!o.installment_due_at)&&(!intent||(intent.order_updated_at===o.updated_at&&intent.amount_cents===o.amount_cents));
 // Owner-only metadata; never return stored operation keys or raw provider payloads.
 return {sandbox:true,eligible,recipient:who?.email??null,order:{id:o.id,amount_cents:o.amount_cents,mode:o.mode,start_at:o.start_at,end_at:o.end_at,installment_due_at:o.installment_due_at??null,package_total:o.package_total??null,status:o.status},
 intent:intent?{fingerprint:intent.fingerprint,state:intent.state,customer_id:intent.customer_id,amount_cents:intent.amount_cents,due_at:intent.due_at,provider_order_id:intent.provider_order_id,provider_invoice_id:intent.provider_invoice_id,provider_invoice_version:intent.provider_invoice_version,order_attempted_at:intent.order_attempted_at,invoice_attempted_at:intent.invoice_attempted_at,publish_attempted_at:intent.publish_attempted_at,publish_approved_version:intent.publish_approved_version,provider_issued_at:intent.provider_issued_at}:null};
}
