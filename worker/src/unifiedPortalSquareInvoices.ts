import type {App,AuthUser,Env,Guards} from "./types";
import {verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {inspectPreparedSupportSquareInvoice,sandboxInvoicePaymentUrl} from "./supportSquareInvoiceReconcile";
import type {Fetch} from "./square";

// Only the canonical parent or the original verified member, never a legacy email token,
// a sibling parent, a child, or a caller-supplied customer/invoice ID.
const owned=`SELECT s.id,s.channel,s.request_id,s.status,s.amount_cents,s.updated_at,
 i.fingerprint,i.state,i.due_at,i.provider_public_url,i.provider_issued_at,i.order_updated_at,
 i.amount_cents invoice_amount,i.provider_invoice_id,i.provider_invoice_version,
 CASE WHEN EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending') THEN 1 ELSE 0 END cancellation_pending,
 CASE WHEN EXISTS(SELECT 1 FROM support_square_invoice_reviews v WHERE v.order_id=s.id AND v.resolved_at IS NULL) THEN 1 ELSE 0 END financial_hold
 FROM support_square_invoice_intents i JOIN support_service_orders s ON s.id=i.order_id
 WHERE i.state='issued' AND i.provider_issued_at IS NOT NULL AND i.provider_invoice_id IS NOT NULL
 AND i.provider_public_url IS NOT NULL
 AND ((s.channel='guest' AND EXISTS(SELECT 1 FROM support_portal_enquiries p JOIN support_guest_requests r ON r.id=p.request_id
  WHERE p.request_id=s.request_id AND p.family_id=? AND p.parent_user_id=? AND r.status NOT IN ('closed','resolved') AND r.email=?))
 OR (s.channel='member' AND EXISTS(SELECT 1 FROM parent_feedback r WHERE r.id=s.request_id AND r.family_id=? AND r.user_id=? AND r.page_hint='learning-support' AND r.status NOT IN ('closed','resolved'))))`;
async function identity(env:Env,a:AuthUser){
 if(!supportInvoiceLookupAvailable(env))return null;
 const who=await verifiedPortalIdentity(env.DB,a);
 if(!who||who.email.trim().toLowerCase()!==String(env.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase())return null;
 // During a rolling deployment the payment schema may not be applied yet.
 if(!await env.DB.prepare("SELECT 1 FROM pragma_table_info('support_square_invoice_intents') WHERE name='provider_public_url'").first())return null;
 return who;
}
const bindings=(a:AuthUser,email:string)=>[a.family_id,a.id,email,a.family_id,a.id];

export async function familyIssuedSquareInvoiceSummaries(env:Env,a:AuthUser){
 const who=await identity(env,a);if(!who)return [];
 const {results}=await env.DB.prepare(owned+" ORDER BY i.provider_issued_at DESC,s.id LIMIT 201").bind(...bindings(a,who.email)).all<any>();
 // No provider IDs, payment URLs or private notes in summaries.
 return (results||[]).map(r=>({id:r.id,amount_cents:r.invoice_amount,due_at:r.due_at,issued_at:r.provider_issued_at}));
}

export async function familyIssuedSquareInvoice(env:Env,a:AuthUser,orderId:string,fetchImpl?:Fetch,now=new Date()){
 const who=await identity(env,a);if(!who)return null;
 const r=await env.DB.prepare(owned+" AND s.id=?").bind(...bindings(a,who.email),orderId).first<any>();
 if(!r)return null;
 const summary={amount_cents:r.invoice_amount,due_at:r.due_at,issued_at:r.provider_issued_at};
 const hold=(status:string)=>({...summary,status,payment_url:null});
 if(r.financial_hold||r.cancellation_pending)return hold("review");
 if(r.status==="cancelled")return hold("cancelled");
 if(["paid","completed"].includes(r.status)){
  const proof=await env.DB.prepare("SELECT review_at FROM support_square_invoice_settlements WHERE order_id=?").bind(orderId).first<{review_at:string|null}>();
  return hold(proof&&!proof.review_at?"verified":"review");
 }
 if(r.status!=="confirmed"||r.cancellation_pending||r.updated_at!==r.order_updated_at||r.amount_cents!==r.invoice_amount)
  return hold("review");
 if(!Number.isFinite(Date.parse(r.due_at))||Date.parse(r.due_at)<=now.getTime())return hold("deadline_passed");
 const checked=await inspectPreparedSupportSquareInvoice(env,r.channel,r.request_id,r.id,{confirmed:true,fingerprint:r.fingerprint},fetchImpl,now);
 if("error" in checked||!checked.invoice_checked)return hold("review");
 if(checked.status==="PAID")return hold("payment_review");
 // Never expose a payment link if already paid, partially paid, externally changed, refunded, or uncertain.
 const link=sandboxInvoicePaymentUrl(checked.public_url);
 if(!checked.issued_matches||checked.requires_review||checked.status!=="UNPAID"||checked.completed_cents!==0||
 checked.version!==r.provider_invoice_version||checked.provider_invoice_id!==r.provider_invoice_id||
 !link||link!==r.provider_public_url)return hold(checked.status==="PAID"?"payment_review":"review");
 // Re-read scoped local state and identity after network calls; cancellation or account change wins.
 const fresh=await identity(env,a);
 if(!fresh)return null;
 const current=await env.DB.prepare(owned+" AND s.id=?").bind(...bindings(a,fresh.email),orderId).first<any>();
 if(!current||current.status!=="confirmed"||current.cancellation_pending||current.financial_hold||current.updated_at!==r.updated_at||
 current.fingerprint!==r.fingerprint||current.provider_public_url!==link||current.provider_invoice_version!==r.provider_invoice_version||current.due_at!==r.due_at)
  return hold("review");
 return {...summary,status:"unpaid",payment_url:link};
}

export function registerFamilySquareInvoices(app:App,g:Guards){
 app.get("/api/family-portal/square-invoices/:order",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  if(!supportInvoiceLookupAvailable(c.env))return c.json({detail:"Not found"},404);
  const id=c.req.param("order")||"";if(!id||id.length>100)return c.json({detail:"Not found"},404);
  const result=await familyIssuedSquareInvoice(c.env,c.get("user"),id);
  return result?c.json(result):c.json({detail:"Invoice unavailable"},404);
 });
}
