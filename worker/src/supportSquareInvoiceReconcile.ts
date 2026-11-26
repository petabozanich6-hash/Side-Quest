import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";
import {ownerSquareInvoiceWorkspace} from "./supportSquareInvoiceWorkspace";

const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
const norm=(v:unknown)=>typeof v==="string"?v.trim().toLowerCase():"";
// Only Square's documented sandbox payment page, never a production or arbitrary URL.
export function sandboxInvoicePaymentUrl(value:unknown):string|null{
 if(typeof value!=="string"||value.length>2048)return null;
 try{const u=new URL(value);return u.protocol==="https:"&&u.hostname==="squareupsandbox.com"&&!u.port&&!u.username&&!u.password&&!u.hash&&!u.search&&/^\/pay-invoice\/[A-Za-z0-9:_-]+$/.test(u.pathname)?u.href:null;}catch{return null;}
}
const statuses=["DRAFT","UNPAID","PARTIALLY_PAID","PAID","CANCELED","REFUNDED","PARTIALLY_REFUNDED","PAYMENT_PENDING","FAILED","SCHEDULED"];

// Provider read-only. Candidate identifiers are untrusted until linked to the
// exact persisted order reference, customer, location and approved amount.
// A failed lookup is never evidence that a provider write did not happen.
export async function inspectPreparedSupportSquareInvoice(
 env:Env,channel:Channel,requestId:string,orderId:string,body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!supportInvoiceLookupAvailable(env)||!b||b.confirmed!==true||typeof b.fingerprint!=="string"||!/^[a-f0-9]{64}$/.test(b.fingerprint))
  return {error:"Review the exact sandbox preparation before checking Square."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Square sandbox only."};
 const workspace=await ownerSquareInvoiceWorkspace(env,channel,requestId,orderId);
 const who=await supportInvoiceRecipient(env.DB,channel,requestId);
 if(!workspace?.intent||!who||norm(who.email)!==norm(env.SUPPORT_UNIFIED_TEST_EMAIL))
  return {error:"No eligible verified sandbox recipient or preparation."};
 const i=await env.DB.prepare("SELECT * FROM support_square_invoice_intents WHERE order_id=?").bind(orderId).first<any>();
 if(!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId||
 !["order_pending","order_created","invoice_pending","draft_created","publish_pending","issued","review"].includes(i.state))
  return {error:"No matching remote invoice attempt is available."};
 // Never substitute a caller-supplied identifier for an already recorded one.
 if((b.provider_order_id!==undefined&&(!validId(b.provider_order_id)||(i.provider_order_id&&b.provider_order_id!==i.provider_order_id)))||
 (b.provider_invoice_id!==undefined&&(!validId(b.provider_invoice_id)||(i.provider_invoice_id&&b.provider_invoice_id!==i.provider_invoice_id))))
  return {error:"The supplied identifier conflicts with the stored preparation."};
 const order=i.provider_order_id||b.provider_order_id;
 const invoice=i.provider_invoice_id||b.provider_invoice_id;
 if(!validId(order))return {error:"Enter the candidate Square order ID from the sandbox dashboard. A missing ID cannot be treated as an absent order."};
 if(invoice!==undefined&&invoice!==null&&!validId(invoice))return {error:"Invalid candidate invoice ID."};
 let saved:any;
 try{saved=JSON.parse(i.payload_json);}catch{return {error:"Stored invoice payload requires review."};}
 const due=saved?.invoice?.payment_requests?.[0]?.due_date;
 if(typeof due!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(due))return {error:"Stored invoice deadline requires review."};
 let remoteOrder:any,remoteInvoice:any;
 try{
  const customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(i.customer_id),undefined,fetchImpl)).customer;
  if(customer?.id!==i.customer_id||norm(customer.email_address)!==norm(who.email))return {error:"The Square customer no longer matches the verified recipient."};
  remoteOrder=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(order),undefined,fetchImpl)).order;
  if(remoteOrder?.id!==order||remoteOrder.reference_id!==i.create_order_key||remoteOrder.location_id!==i.location_id||
   remoteOrder.customer_id!==i.customer_id||!money(remoteOrder.total_money,i.amount_cents))
   return {error:"Square order does not match the saved preparation. No changes made."};
  if(validId(invoice))remoteInvoice=(await squareCall(cfg,"GET","invoices/"+encodeURIComponent(invoice),undefined,fetchImpl)).invoice;
 }catch{return {error:"Square lookup could not be confirmed. Do not assume the remote record is absent or retry with a new key."};}
 const orderOpen=remoteOrder.state==="OPEN";
 if(!validId(invoice)){
  return {matched:true,provider_order_id:order,order_open:orderOpen,invoice_checked:false,
   can_recover_order:workspace.eligible&&i.state==="order_pending"&&!i.provider_order_id&&orderOpen,
   requires_review:true,checked_at:now.toISOString()};
 }
 const p=remoteInvoice?.payment_requests;
 if(remoteInvoice?.id!==invoice||remoteInvoice.location_id!==i.location_id||remoteInvoice.order_id!==order||
 remoteInvoice.primary_recipient?.customer_id!==i.customer_id||norm(remoteInvoice.primary_recipient?.email_address)!==norm(who.email)||
 remoteInvoice.subscription_id||!Number.isSafeInteger(remoteInvoice.version)||remoteInvoice.version<0||
 !Array.isArray(p)||p.length!==1||p[0].request_type!=="BALANCE"||p[0].due_date!==due||
 !money(p[0].computed_amount_money,i.amount_cents)||p[0].total_completed_amount_money?.currency!=="AUD"||
 !Number.isSafeInteger(p[0].total_completed_amount_money?.amount)||p[0].total_completed_amount_money.amount<0)
  return {error:"Square invoice does not match the saved preparation. No changes made."};
 const status=statuses.includes(remoteInvoice.status)?remoteInvoice.status:"UNKNOWN";
 const completed=p[0].total_completed_amount_money.amount;
 const expected=saved?.invoice?.accepted_payment_methods;
 const actual=remoteInvoice.accepted_payment_methods;
 const methodsMatch=!!expected&&!!actual&&Object.keys(expected).every(k=>actual[k]===expected[k]);
 const safeSettings=orderOpen&&completed===0&&remoteInvoice.delivery_method==="EMAIL"&&
 !remoteInvoice.scheduled_at&&!remoteInvoice.store_payment_method_enabled&&!remoteInvoice.custom_fields?.length&&!remoteInvoice.attachments?.length&&
 p[0].automatic_payment_source==="NONE"&&!p[0].card_id&&!p[0].bank_account_id&&!p[0].tipping_enabled&&!p[0].reminders?.length&&methodsMatch;
 const draftSafe=status==="DRAFT"&&!remoteInvoice.public_url&&safeSettings;
 const versionMatches=i.provider_invoice_version===null||remoteInvoice.version===i.provider_invoice_version;
 const url=sandboxInvoicePaymentUrl(remoteInvoice.public_url);
 const approvedVersion=i.publish_approved_version;
 const issuedMatches=status==="UNPAID"&&safeSettings&&!!url&&Number.isSafeInteger(approvedVersion)&&
  (remoteInvoice.version===approvedVersion||remoteInvoice.version===approvedVersion+1)&&
  !!i.publish_attempted_at&&["publish_pending","issued"].includes(i.state);
 return {matched:true,provider_order_id:order,order_open:orderOpen,invoice_checked:true,provider_invoice_id:invoice,
  version:remoteInvoice.version,status,amount_cents:i.amount_cents,completed_cents:completed,due_at:i.due_at,
  draft_matches:draftSafe&&versionMatches,issued_matches:issuedMatches,public_url:issuedMatches?url:null,can_recover_draft:workspace.eligible&&i.state==="invoice_pending"&&i.provider_order_id===order&&!i.provider_invoice_id&&draftSafe&&remoteInvoice.version===0,
  requires_review:(!draftSafe||!versionMatches)&&!issuedMatches||!workspace.eligible,checked_at:now.toISOString()};
}

// Recover a lost response by linking only a freshly verified candidate.
// This writes local metadata only; it does not create, publish or settle anything.
export async function recoverPreparedSupportSquareRecord(
 env:Env,channel:Channel,requestId:string,orderId:string,body:unknown,fetchImpl?:Fetch,now=new Date()
){
 const b=body as Record<string,unknown>|null;
 if(!b||b.recovery_confirmed!==true)return {error:"Explicitly approve linking the verified remote record."};
 const result=await inspectPreparedSupportSquareInvoice(env,channel,requestId,orderId,b,fetchImpl,now);
 if("error" in result)return {error:result.error};
 const orderRecovery=result.can_recover_order===true,draftRecovery=result.can_recover_draft===true;
 if(!orderRecovery&&!draftRecovery)return {error:"The remote record is not safe to recover automatically."};
 const state=orderRecovery?"order_pending":"invoice_pending",next=orderRecovery?"order_created":"draft_created";
 // Do not change a record once another action has changed the booking or ledger.
 const r=await env.DB.prepare(`UPDATE support_square_invoice_intents SET state=?,provider_order_id=?,
 provider_invoice_id=?,provider_invoice_version=?,updated_at=?
 WHERE order_id=? AND fingerprint=? AND state=? AND provider_invoice_id IS NULL
 AND provider_invoice_version IS NULL AND (
  (?='order_pending' AND provider_order_id IS NULL AND order_attempted_at IS NOT NULL)
  OR (?='invoice_pending' AND provider_order_id=? AND invoice_attempted_at IS NOT NULL))
 AND EXISTS(SELECT 1 FROM support_service_orders s WHERE s.id=support_square_invoice_intents.order_id
  AND s.channel=? AND s.request_id=? AND s.status='confirmed' AND s.updated_at=support_square_invoice_intents.order_updated_at
  AND s.amount_cents=support_square_invoice_intents.amount_cents AND s.checkout_started_at IS NULL AND s.square_order_id IS NULL)
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=support_square_invoice_intents.order_id)
 AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_square_invoice_intents.order_id AND c.status='pending')`)
 .bind(next,result.provider_order_id,draftRecovery?result.provider_invoice_id:null,draftRecovery?result.version:null,now.toISOString(),
 orderId,b.fingerprint,state,state,state,result.provider_order_id,channel,requestId).run();
 return r.meta?.changes===1?{recovered:true,state:next,published:false}:{error:"The saved arrangement changed. Reload and reconcile before continuing."};
}
