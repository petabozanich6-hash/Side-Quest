import type {Env} from "./types";
import {sendEmail,layout,p,esc} from "./email";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {ownerSquareInvoiceWorkspace} from "./supportSquareInvoiceWorkspace";
import {inspectPreparedSupportSquareInvoice} from "./supportSquareInvoiceReconcile";
import type {Fetch} from "./square";

type Kind="confirmation"|"reminder"|"overdue";
type Candidate={id:string;channel:"guest"|"member";request_id:string;fingerprint:string;provider_invoice_id:string;due_at:string;kind:Kind};
const DAY=86400000;
export function squareInvoiceNoticesEnabled(e:Env){
 return supportInvoiceLookupAvailable(e)&&e.SUPPORT_SQUARE_INVOICE_NOTICE_TEST==="true"&&!!e.EMAIL&&
 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e.SUPPORT_UNIFIED_TEST_EMAIL||"").trim());
}
// Bounded, isolated sandbox mail processing; no real customer emails or automatic release.
export async function processSquareInvoiceNotices(e:Env,now=new Date(),sender:typeof sendEmail=sendEmail,fetchImpl?:Fetch){
 if(!squareInvoiceNoticesEnabled(e))return {sent:0,review:0,suppressed:0};
 const db=e.DB,at=now.toISOString(),ahead=new Date(now.getTime()+DAY).toISOString();
 if(!await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_square_invoice_notices'").first())return {sent:0,review:0,suppressed:0};
 const candidates=(await db.prepare(`WITH candidates AS (
 SELECT s.id,s.channel,s.request_id,i.fingerprint,i.provider_invoice_id,i.due_at,
 CASE WHEN s.status='paid' THEN 'confirmation' WHEN i.due_at<=? THEN 'overdue' ELSE 'reminder' END kind
 FROM support_service_orders s JOIN support_square_invoice_intents i ON i.order_id=s.id
 WHERE i.state='issued' AND i.provider_invoice_id IS NOT NULL AND s.amount_cents=i.amount_cents
 AND (s.status='paid' OR (s.status='confirmed' AND s.updated_at=i.order_updated_at AND i.due_at<=?))
 AND (s.start_at IS NULL OR s.start_at>?) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=s.id AND c.status='pending')
 AND NOT EXISTS(SELECT 1 FROM support_square_invoice_reviews v WHERE v.order_id=s.id AND v.resolved_at IS NULL)
 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=s.id)
 )
 SELECT * FROM candidates c WHERE NOT EXISTS(SELECT 1 FROM support_square_invoice_notices n WHERE n.order_id=c.id AND n.kind=c.kind)
 ORDER BY CASE WHEN kind='confirmation' THEN 0 ELSE 1 END,due_at,id LIMIT 10`).bind(at,ahead,at).all<Candidate>()).results||[];
 let sent=0,review=0,suppressed=0;
 for(const c of candidates){
  const w=await ownerSquareInvoiceWorkspace(e,c.channel,c.request_id,c.id);
  const recipient=w?.recipient?.trim();
  if(!w||!recipient||recipient.toLowerCase()!==String(e.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()||
   w.intent?.fingerprint!==c.fingerprint||w.financial_review)continue;
  if(c.kind==="confirmation"?!w.confirmation_preview:!w.eligible)continue;
  const checked=await inspectPreparedSupportSquareInvoice(e,c.channel,c.request_id,c.id,{confirmed:true,fingerprint:c.fingerprint},fetchImpl,now);
  if("error" in checked||!checked.invoice_checked||checked.provider_invoice_id!==c.provider_invoice_id)continue;
  if(c.kind==="confirmation"){
   if(checked.status!=="PAID"||!checked.settlement_settings_match||checked.completed_cents!==w.order.amount_cents)continue;
  }else if(!checked.issued_matches||checked.requires_review||checked.status!=="UNPAID"||checked.completed_cents!==0)continue;
  const subject=c.kind==="confirmation"?w.confirmation_preview!.subject:c.kind==="reminder"?"Side-Quest Learning Support: payment reminder":"Side-Quest Learning Support: payment review needed";
  const due=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"full",timeStyle:"short"}).format(new Date(c.due_at));
  const amount=new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(w.order.amount_cents/100);
  const body=c.kind==="confirmation"?w.confirmation_preview!.body:[
   "Hi there,",
   c.kind==="reminder"?"A friendly reminder that your agreed payment deadline is approaching.":"Your agreed payment deadline has passed. We need to review your provisional booking.",
   "Amount: "+amount+" AUD. Agreed deadline: "+due+" (Sydney time).",
   "Please check your private family portal. If you have already paid, do not pay again. If you need more time or wish to discuss your arrangements, please reply to this email.",
   "Your reservation remains provisional until payment is verified. An unpaid reservation may be released after review.",
   "Thank you, Side-Quest Learning"
  ].join("\n\n");
  const claim=await db.prepare(`INSERT OR IGNORE INTO support_square_invoice_notices(order_id,invoice_id,kind,status,attempted_at)
   SELECT s.id,i.provider_invoice_id,?,'sending',? FROM support_service_orders s JOIN support_square_invoice_intents i ON i.order_id=s.id
   WHERE s.id=? AND s.channel=? AND s.request_id=? AND i.state='issued' AND i.fingerprint=? AND i.provider_invoice_id=? AND i.due_at=?
   AND s.status=? AND s.amount_cents=i.amount_cents AND (s.start_at IS NULL OR s.start_at>?)
   AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests x WHERE x.order_id=s.id AND x.status='pending')
   AND NOT EXISTS(SELECT 1 FROM support_square_invoice_reviews v WHERE v.order_id=s.id AND v.resolved_at IS NULL)
   AND NOT EXISTS(SELECT 1 FROM support_manual_invoices m WHERE m.order_id=s.id)
   AND ((?='confirmation' AND EXISTS(SELECT 1 FROM support_square_invoice_settlements x WHERE x.order_id=s.id AND x.review_at IS NULL AND x.invoice_id=i.provider_invoice_id))
    OR (?<>'confirmation' AND s.updated_at=i.order_updated_at AND NOT EXISTS(SELECT 1 FROM support_square_invoice_settlements x WHERE x.order_id=s.id)))`)
   .bind(c.kind,at,c.id,c.channel,c.request_id,c.fingerprint,c.provider_invoice_id,c.due_at,c.kind==="confirmation"?"paid":"confirmed",at,c.kind,c.kind).run();
  if(!claim.meta?.changes)continue;
  // Recheck recipient, package status, cancellation and holds immediately before mail.
  const fresh=await ownerSquareInvoiceWorkspace(e,c.channel,c.request_id,c.id);
  const safe=fresh?.recipient?.trim()===recipient&&fresh.intent?.fingerprint===c.fingerprint&&!fresh.financial_review&&
   (c.kind==="confirmation"?fresh.confirmation_preview?.body===body:fresh.eligible);
  let ok=false;
  if(safe){
   try{ok=await sender(e,{to:recipient,subject:"[Sandbox test] "+subject,text:"Private sandbox test — no real payment required.\n\n"+body,html:layout({preheader:"Private sandbox test",kicker:"Learning Support sandbox",heading:subject,body:p("Private sandbox test — no real payment required.")+body.split("\n\n").map(v=>p(esc(v))).join(""),reason:"Private test of agreed learning support correspondence."})});}catch{}
  }
  const result=!safe?"suppressed":ok?"sent":"review";
  await db.prepare("UPDATE support_square_invoice_notices SET status=?,sent_at=? WHERE order_id=? AND kind=? AND status='sending'").bind(result,ok?at:null,c.id,c.kind).run();
  if(result==="sent")sent++;else if(result==="review")review++;else suppressed++;
 }
 return {sent,review,suppressed};
}
