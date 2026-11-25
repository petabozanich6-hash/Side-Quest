import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {getOrder,type Channel} from "./supportOrders";
import {portalEnquiryOwner} from "./unifiedPortalRequestAccess";
// Deliberately read-only and sandbox-only. No live provider calls, publishing, payment confirmation or cancellation.
export function supportInvoiceLookupAvailable(env:Env){
 const cfg=squareConfig(env);
 return unifiedPortalPilot(env)&&env.SUPPORT_SQUARE_INVOICE_TEST==="true"&&cfg.ok&&!cfg.production&&!!String(env.SUPPORT_UNIFIED_TEST_EMAIL||"").trim();
}
async function recipient(db:D1Database,channel:Channel,id:string){
 if(channel==="member")return db.prepare("SELECT u.email FROM parent_feedback r JOIN users u ON u.id=r.user_id AND u.family_id=r.family_id WHERE r.id=? AND r.page_hint='learning-support' AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''").bind(id).first<{email:string}>();
 if(await portalEnquiryOwner(db,id))return db.prepare("SELECT u.email FROM support_portal_enquiries p JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email WHERE p.request_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''").bind(id).first<{email:string}>();
 // Do not infer ownership of historical invoices from a matching email. Legacy linking is a separate migration.
 return null;
}
const validId=(s:unknown):s is string=>typeof s==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(s);
const moneyMatches=(m:any,amount:number)=>m?.currency==="AUD"&&Number.isSafeInteger(m.amount)&&m.amount===amount;
export async function inspectSupportInvoice(env:Env,channel:Channel,id:string,oid:string,invoiceId:unknown,fetchImpl?:Fetch){
 if(!supportInvoiceLookupAvailable(env))return {error:"Square invoice lookup is not enabled in private sandbox staging."};
 if(!validId(invoiceId))return {error:"Enter the Square invoice ID."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const o=await getOrder(env.DB,channel,id,oid),who=await recipient(env.DB,channel,id);
 if(!o||!who||who.email.toLowerCase()!==String(env.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()||o.status!=="confirmed"||o.amount_cents<=0||o.checkout_started_at||o.square_order_id||o.package_sequence>1&&!o.installment_due_at)return {error:"This arrangement is not eligible for the sandbox invoice check."};
 const recorded=await env.DB.prepare("SELECT reference,due_at,verified_at,cancelled_at FROM support_manual_invoices WHERE order_id=?").bind(oid).first<any>();
 if(!recorded||recorded.verified_at||recorded.cancelled_at)return {error:"Record the issued invoice first. Only an active unverified invoice can be checked."};
 let invoice:any,order:any;
 try{
  invoice=(await squareCall(cfg,"GET","invoices/"+encodeURIComponent(invoiceId),undefined,fetchImpl)).invoice;
  if(!invoice||invoice.id!==invoiceId||invoice.location_id!==cfg.locationId||!validId(invoice.order_id))return {error:"Invoice could not be matched to this sandbox location."};
  // A subscription invoice must never be treated as a support invoice.
  if(invoice.subscription_id||invoice.invoice_number!==recorded.reference||String(invoice.primary_recipient?.email_address||"").trim().toLowerCase()!==who.email.trim().toLowerCase())return {error:"Invoice reference or recipient does not match the recorded arrangement."};
  order=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(invoice.order_id),undefined,fetchImpl)).order;
 }catch{return {error:"Square lookup failed. Check the sandbox invoice ID and credentials; no booking state changed."};}
 if(!order||order.id!==invoice.order_id||order.location_id!==cfg.locationId||!moneyMatches(order.total_money,o.amount_cents))return {error:"Invoice order amount, currency or location does not match."};
 const payments=invoice.payment_requests;
 if(!Array.isArray(payments)||payments.length!==1||payments[0].request_type!=="BALANCE"||!moneyMatches(payments[0].computed_amount_money,o.amount_cents)||!moneyMatches(payments[0].total_completed_amount_money,Number(payments[0].total_completed_amount_money?.amount)))return {error:"Invoice payment schedule does not match the single agreed instalment or full package amount."};
 const completed=payments[0].total_completed_amount_money.amount;
 const dueDate=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(recorded.due_at));
 if(payments[0].due_date!==dueDate)return {error:"Square invoice due date does not match the recorded Sydney deadline."};
 const statuses=["DRAFT","UNPAID","PARTIALLY_PAID","PAID","CANCELED","REFUNDED","PARTIALLY_REFUNDED","PAYMENT_PENDING","FAILED","SCHEDULED"];
 const status=statuses.includes(invoice.status)?invoice.status:"UNKNOWN";
 // PAID plus completed totals is still not proof of payment by the exact deadline or refund absence.
 return {matched:true,status,amount_cents:o.amount_cents,completed_cents:completed,reference:recorded.reference,due_at:recorded.due_at,checked_at:new Date().toISOString(),requires_manual_review:true};
}
