import type {Env} from "./types";
import type {Fetch} from "./square";
import {isPlatformOwner} from "./access";
import {SERVICE_TERMS_VERSION} from "./supportServiceTerms";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";
import {prepareSupportInvoiceIntent} from "./supportSquareInvoiceIntent";
import {createPreparedSupportSquareOrder} from "./supportSquareInvoiceOrder";
import {createPreparedSupportSquareDraft} from "./supportSquareInvoiceDraft";
import {publishPreparedSupportSquareInvoice} from "./supportSquareInvoicePublish";

const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
export function standardInvoiceAutomationEnabled(e:Env){
 return supportInvoiceLookupAvailable(e)&&e.SUPPORT_STANDARD_INVOICE_AUTO_TEST==="true"&&
 e.SUPPORT_TERMS_REQUIRED==="true"&&e.SUPPORT_TERMS_APPROVED_VERSION===SERVICE_TERMS_VERSION&&
 idOk(e.SUPPORT_STANDARD_INVOICE_CUSTOMER_ID)&&idOk(e.SUPPORT_STANDARD_INVOICE_APPROVED_BY);
}
export function standardInvoiceDueAt(start:string,installment:string|null,now:Date){
 const first=Date.parse(start),due=installment?Date.parse(installment):first-24*3600000;
 return Number.isFinite(first)&&Number.isFinite(due)&&due>now.getTime()&&due<=first-24*3600000?new Date(due).toISOString():null;
}
export function standardReceiptMatches(row:any){
 try{
 const arrangements=JSON.parse(row.arrangements_json);
 if(!Array.isArray(arrangements)||arrangements.length<1||arrangements.length>4)return false;
 const a=arrangements.find((x:any)=>x.id===row.id);
 return !!a&&a.amount_cents===row.amount_cents&&a.start_at===row.start_at&&a.end_at===row.end_at&&
 a.scope===row.scope&&a.delivery===row.delivery&&a.terms===row.terms&&(a.due_at??null)===(row.installment_due_at??null);
 }catch{return false;}
}
/** One new invoice per tick. No automatic retry on uncertain or partial provider responses.
 * The environment must explicitly nominate a single verified sandbox customer and an active
 * owner who approved automation. This does not authorise live invoices or custom proposals.
 */
export async function issueNextStandardSandboxInvoice(e:Env,now=new Date(),fetchImpl?:Fetch){
 if(!standardInvoiceAutomationEnabled(e))return {status:"disabled"};
 const owner=e.SUPPORT_STANDARD_INVOICE_APPROVED_BY!,customer=e.SUPPORT_STANDARD_INVOICE_CUSTOMER_ID!;
 if(!await isPlatformOwner(e.DB,owner))return {status:"disabled"};
 const at=now.toISOString();
 const row=await e.DB.prepare(`SELECT o.id,o.request_id,o.amount_cents,o.start_at,o.end_at,o.scope,o.delivery,o.terms,t.due_at installment_due_at,a.arrangements_json
 FROM support_service_orders o JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.service='tutoring'
 JOIN support_guest_requests r ON r.id=p.request_id AND r.status NOT IN ('closed','resolved')
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email=r.email AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 LEFT JOIN support_package_sessions ps ON ps.order_id=o.id
 JOIN support_guest_quotes q ON q.id=COALESCE(ps.quote_id,o.quote_id) AND q.request_id=r.id AND q.id='standard-'||r.id
 JOIN support_terms_acceptances a ON a.order_id=COALESCE(ps.root_id,o.id) AND a.channel='guest' AND a.request_id=r.id AND a.accepted_by=u.email AND a.agreement_version=?
 LEFT JOIN support_installment_terms t ON t.order_id=o.id
 WHERE o.channel='guest' AND o.status='confirmed' AND o.mode='live' AND o.amount_cents>0 AND o.start_at>?
 AND lower(u.email)=? AND o.checkout_started_at IS NULL AND o.square_order_id IS NULL
 AND (ps.sequence IS NULL OR ps.sequence=1 OR t.order_id IS NOT NULL)
 AND NOT EXISTS(SELECT 1 FROM family_admin_state f WHERE f.family_id=u.family_id AND f.status<>'active')
 AND NOT EXISTS(SELECT 1 FROM support_standard_invoice_attempts x WHERE x.order_id=o.id)
 AND NOT EXISTS(SELECT 1 FROM support_square_invoice_intents i WHERE i.order_id=o.id)
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=o.id)
 AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')
 ORDER BY COALESCE(t.due_at,o.start_at),o.id LIMIT 1`).bind(SERVICE_TERMS_VERSION,at,String(e.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()).first<any>();
 if(!row)return {status:"idle"};
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_standard_invoice_attempts(order_id,approved_by,attempted_at,status) VALUES(?,?,?,'running')").bind(row.id,owner,at).run();
 if(!claim.meta?.changes)return {status:"busy"};
 let status="review";
 try{
  const due=standardInvoiceDueAt(row.start_at,row.installment_due_at,now);
  if(!due||!standardReceiptMatches(row))return {status:"review"};
  const args={reviewed:true,customer_id:customer,due_at:due};
  const p=await previewSupportInvoice(e,"guest",row.request_id,row.id,args,fetchImpl,now);
  if("error" in p)return {status:"review"};
  const approved={...args,confirmed:true,fingerprint:p.fingerprint};
  const i=await prepareSupportInvoiceIntent(e,"guest",row.request_id,row.id,owner,approved,fetchImpl,now);
  if("error" in i)return {status:"review"};
  const o=await createPreparedSupportSquareOrder(e,"guest",row.request_id,row.id,approved,fetchImpl,now);
  if("error" in o)return {status:"review"};
  const d=await createPreparedSupportSquareDraft(e,"guest",row.request_id,row.id,approved,fetchImpl,now);
  if("error" in d)return {status:"review"};
  const published=await publishPreparedSupportSquareInvoice(e,"guest",row.request_id,row.id,owner,{...approved,issue_confirmed:true,provider_invoice_id:d.provider_invoice_id,version:d.version},fetchImpl,now);
  if("error" in published)return {status:"review"};
  status="issued";return {status};
 }catch{return {status:"review"};}
 finally{await e.DB.prepare("UPDATE support_standard_invoice_attempts SET status=?,finished_at=? WHERE order_id=? AND status='running' AND attempted_at=?").bind(status,new Date().toISOString(),row.id,at).run();}
}
