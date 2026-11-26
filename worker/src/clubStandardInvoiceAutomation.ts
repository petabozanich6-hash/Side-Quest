import type {Env} from "./types";
import type {Fetch} from "./square";
import {isPlatformOwner} from "./access";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {CLUB_BOOKING_VERSION,CLUB_SINGLE_VERSION} from "./englishClubSelfService";
import {previewClubInvoice,prepareClubInvoice} from "./clubSquareInvoicePreparation";
import {createClubSquareOrder,createClubSquareDraft} from "./clubSquareInvoiceDraft";
import {publishClubSquareInvoice} from "./clubSquareInvoicePublication";

const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
export function clubInvoiceAutomationEnabled(e:Env){
 return supportInvoiceLookupAvailable(e)&&e.SUPPORT_CLUB_INVOICE_AUTO_TEST==="true"&&
 e.SUPPORT_CLUB_INVOICE_APPROVED_ROUND_VERSION===CLUB_BOOKING_VERSION&&
 e.SUPPORT_CLUB_INVOICE_APPROVED_SINGLE_VERSION===CLUB_SINGLE_VERSION&&
 idOk(e.SUPPORT_CLUB_INVOICE_CUSTOMER_ID)&&idOk(e.SUPPORT_CLUB_INVOICE_APPROVED_BY);
}
// Single and upfront invoices are eligible immediately; weekly instalments are
// issued no earlier than seven days before their individual payment deadline.
export function clubInvoiceIssuanceWindow(mode:string,dueAt:string,now:Date){
 const due=Date.parse(dueAt),t=now.getTime();
 return Number.isFinite(due)&&due>t&&(["single","upfront"].includes(mode)||(mode==="weekly"&&due<=t+7*86400000));
}
// One new obligation per scheduled tick. Unknown provider responses are not
// automatically retried: leave the durable intent and claim for reconciliation.
export async function issueNextClubSandboxInvoice(e:Env,now=new Date(),fetchImpl?:Fetch){
 if(!clubInvoiceAutomationEnabled(e))return {status:"disabled"};
 const owner=e.SUPPORT_CLUB_INVOICE_APPROVED_BY!,customer=e.SUPPORT_CLUB_INVOICE_CUSTOMER_ID!;
 if(!await isPlatformOwner(e.DB,owner))return {status:"disabled"};
 const at=now.toISOString(),weeklyLimit=new Date(now.getTime()+7*86400000).toISOString();
 const row=await e.DB.prepare(`SELECT o.kind,o.obligation_id,o.payment_mode,o.due_at
 FROM support_club_payment_obligations o
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id AND p.service='english-club'
 JOIN support_guest_requests r ON r.id=p.request_id AND r.status NOT IN ('closed','resolved')
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email=r.email AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 WHERE o.status='awaiting_invoice' AND julianday(o.due_at)>julianday(?)
 AND (o.payment_mode IN ('single','upfront') OR (o.payment_mode='weekly' AND julianday(o.due_at)<=julianday(?)))
 AND ((o.kind='single' AND o.terms_version=?) OR (o.kind='round' AND o.terms_version=?))
 AND lower(trim(u.email))=?
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=p.family_id AND a.status<>'active')
 AND NOT EXISTS(SELECT 1 FROM support_club_square_intents i WHERE i.kind=o.kind AND i.obligation_id=o.obligation_id)
 AND NOT EXISTS(SELECT 1 FROM support_club_invoice_auto_attempts a WHERE a.kind=o.kind AND a.obligation_id=o.obligation_id)
 ORDER BY o.due_at,o.obligation_id LIMIT 1`).bind(at,weeklyLimit,CLUB_SINGLE_VERSION,CLUB_BOOKING_VERSION,String(e.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()).first<any>();
 if(!row)return {status:"idle"};
 if(!clubInvoiceIssuanceWindow(row.payment_mode,row.due_at,now))return {status:"review"};
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_club_invoice_auto_attempts(kind,obligation_id,approved_by,attempted_at,status) VALUES(?,?,?,?,'running')").bind(row.kind,row.obligation_id,owner,at).run();
 if(!claim.meta?.changes)return {status:"busy"};
 let status="review";
 try{
  const args={reviewed:true,customer_id:customer};
  const p=await previewClubInvoice(e,row.kind,row.obligation_id,args,fetchImpl,now);
  if("error" in p)return {status};
  const approved={...args,confirmed:true,fingerprint:p.fingerprint};
  const i=await prepareClubInvoice(e,row.kind,row.obligation_id,owner,approved,fetchImpl,now);
  if("error" in i)return {status};
  const o=await createClubSquareOrder(e,row.kind,row.obligation_id,approved,fetchImpl,now);
  if("error" in o)return {status};
  const d=await createClubSquareDraft(e,row.kind,row.obligation_id,approved,fetchImpl,now);
  if("error" in d)return {status};
  const published=await publishClubSquareInvoice(e,row.kind,row.obligation_id,owner,{...approved,issue_confirmed:true,provider_invoice_id:d.provider_invoice_id,version:d.version},fetchImpl,now);
  if("error" in published)return {status};
  status="issued";return {status};
 }catch{return {status};}
 finally{await e.DB.prepare("UPDATE support_club_invoice_auto_attempts SET status=?,finished_at=? WHERE kind=? AND obligation_id=? AND attempted_at=? AND status='running'").bind(status,new Date().toISOString(),row.kind,row.obligation_id,at).run();}
}
