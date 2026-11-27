import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {isPlatformOwner} from "./access";
import {clubNoticesEnabled} from "./clubPaymentSessionNotices";
import {inspectClubSquareInvoice,clubInvoiceSeatMatch} from "./clubSquareInvoicePublication";
import {releaseOverdueClubPlace} from "./clubSquareOverdue";
import {CLUB_BOOKING_VERSION,CLUB_SINGLE_VERSION} from "./englishClubSelfService";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
export function clubAutomaticCancellationEnabled(e:Env){
 return clubNoticesEnabled(e)&&e.SUPPORT_CLUB_CANCEL_AUTO_TEST==="true"&&idOk(e.SUPPORT_CLUB_CANCEL_APPROVED_BY)&&
 e.SUPPORT_CLUB_INVOICE_APPROVED_ROUND_VERSION===CLUB_BOOKING_VERSION&&e.SUPPORT_CLUB_INVOICE_APPROVED_SINGLE_VERSION===CLUB_SINGLE_VERSION;
}
const eligible=`SELECT i.*,o.expected_seats,o.status obligation_status FROM support_club_square_intents i
 JOIN support_club_payment_obligations o ON o.kind=i.kind AND o.obligation_id=i.obligation_id AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id AND p.service='english-club'
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email AND r.status NOT IN ('closed','resolved')
 JOIN support_club_notices n ON n.kind=i.kind AND n.obligation_id=i.obligation_id AND n.notice_type='overdue' AND n.seat_key='' AND n.status='sent'
 WHERE i.state='issued' AND o.status='issued' AND i.provider_issued_at IS NOT NULL AND julianday(i.due_at)<=julianday(?) AND julianday(n.sent_at)<=julianday(?)
 AND lower(trim(u.email))=? AND ((o.kind='single' AND o.terms_version=?) OR (o.kind='round' AND o.terms_version=?))
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=p.family_id AND a.status<>'active')
 AND NOT EXISTS(SELECT 1 FROM support_club_square_settlements s WHERE s.kind=i.kind AND s.obligation_id=i.obligation_id)
 AND NOT EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=i.kind AND v.obligation_id=i.obligation_id)
 AND NOT EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=i.kind AND s.obligation_id=i.obligation_id AND (s.status<>'invoiced' OR julianday(s.start_at)<=julianday(?)))`;
const noTender=(o:any)=>o.tenders==null||Array.isArray(o.tenders)&&o.tenders.length===0;
// One new cancellation per tick. Only an already issued invoice with a delivered overdue
// notice and a one-hour grace period is eligible. No retry of an uncertain provider write.
export async function cancelNextOverdueClubSandboxInvoice(e:Env,now=new Date(),fetchImpl?:Fetch){
 if(!clubAutomaticCancellationEnabled(e)||!await isPlatformOwner(e.DB,e.SUPPORT_CLUB_CANCEL_APPROVED_BY!))return {status:"disabled"};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {status:"disabled"};
 const owner=e.SUPPORT_CLUB_CANCEL_APPROVED_BY!,at=now.toISOString(),grace=new Date(now.getTime()-3600000).toISOString();
 const args=[at,grace,String(e.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase(),CLUB_SINGLE_VERSION,CLUB_BOOKING_VERSION,at];
 const row=await e.DB.prepare(eligible+" AND NOT EXISTS(SELECT 1 FROM support_club_cancel_attempts a WHERE a.kind=i.kind AND a.obligation_id=i.obligation_id) ORDER BY i.due_at,i.obligation_id LIMIT 1").bind(...args).first<any>();
 if(!row)return {status:"idle"};
 if(!idOk(row.provider_invoice_id)||!idOk(row.provider_order_id)||!await clubInvoiceSeatMatch(e,row))return {status:"review"};
 const check=await inspectClubSquareInvoice(e,row,fetchImpl);
 if(!check?.issued||check.completed!==0||check.version!==row.provider_invoice_version||check.link!==row.provider_public_url||!noTender(check.order))return {status:"review"};
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_club_cancel_attempts(kind,obligation_id,fingerprint,invoice_id,approved_version,approved_by,attempted_at,status) SELECT i.kind,i.obligation_id,i.fingerprint,i.provider_invoice_id,i.provider_invoice_version,?,?,'pending' FROM ("+eligible+") i WHERE i.kind=? AND i.obligation_id=? AND i.fingerprint=? AND i.provider_invoice_version=?").bind(owner,at,...args,row.kind,row.obligation_id,row.fingerprint,row.provider_invoice_version).run();
 if(!claim.meta?.changes)return {status:"busy"};
 let status="review";
 try{
  const current=await e.DB.prepare(eligible+" AND i.kind=? AND i.obligation_id=? AND i.fingerprint=? AND i.provider_invoice_version=?").bind(...args,row.kind,row.obligation_id,row.fingerprint,row.provider_invoice_version).first<any>();
  if(!current||!await clubInvoiceSeatMatch(e,current))return {status};
  const verified=await inspectClubSquareInvoice(e,current,fetchImpl);
  if(!verified?.issued||verified.version!==row.provider_invoice_version||verified.completed!==0||!noTender(verified.order)||verified.link!==row.provider_public_url)return {status};
  // Square's version check protects against changes between the read and cancellation.
  // Never cancel a separate order or repeat a write after an uncertain response.
  try{await squareCall(cfg,"POST","invoices/"+encodeURIComponent(row.provider_invoice_id)+"/cancel",{version:row.provider_invoice_version},fetchImpl);}catch{/* attempt may have succeeded; read-only verification below */}
  const released=await releaseOverdueClubPlace(e,row.kind,row.obligation_id,owner,{confirmed:true,parent_notified:true,cancelled_in_square:true,fingerprint:row.fingerprint},fetchImpl,now);
  if(!released.released)return {status};
  status="released";return {status};
 }catch{return {status};}
 finally{await e.DB.prepare("UPDATE support_club_cancel_attempts SET status=?,finished_at=? WHERE kind=? AND obligation_id=? AND attempted_at=? AND status='pending'").bind(status,new Date().toISOString(),row.kind,row.obligation_id,at).run();}
}
