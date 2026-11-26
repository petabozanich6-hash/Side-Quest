import type {Env} from "./types";
import type {Fetch} from "./square";
import {sendEmail,layout,p,esc} from "./email";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";
import {inspectClubSquareInvoice} from "./clubSquareInvoicePublication";
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
const DAY=86400000;
export function clubNoticesEnabled(e:Env){
 return supportInvoiceLookupAvailable(e)&&e.SUPPORT_CLUB_NOTICE_TEST==="true"&&!!e.EMAIL&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(e.SUPPORT_UNIFIED_TEST_EMAIL));
}
const core=`SELECT i.*,o.status obligation_status,o.expected_seats,o.payment_mode FROM support_club_square_intents i
 JOIN support_club_payment_obligations o ON o.kind=i.kind AND o.obligation_id=i.obligation_id AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id AND p.service='english-club'
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email AND r.status NOT IN ('closed','resolved')
 WHERE lower(trim(u.email))=? AND i.provider_issued_at IS NOT NULL
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=u.family_id AND a.status<>'active')
 AND NOT EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=i.kind AND v.obligation_id=i.obligation_id)`;
const paid="i.state='paid' AND i.obligation_status='paid' AND EXISTS(SELECT 1 FROM support_club_square_settlements p WHERE p.kind=i.kind AND p.obligation_id=i.obligation_id AND p.invoice_id=i.provider_invoice_id AND p.amount_cents=i.amount_cents)";
const issued="i.state='issued' AND i.obligation_status='issued' AND NOT EXISTS(SELECT 1 FROM support_club_square_settlements p WHERE p.kind=i.kind AND p.obligation_id=i.obligation_id)";
const date=(v:string)=>new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"full",timeStyle:"short"}).format(new Date(v));
async function snapshot(e:Env,c:any,now:Date){
 const row=await e.DB.prepare(core+" AND i.kind=? AND i.obligation_id=?").bind(norm(e.SUPPORT_UNIFIED_TEST_EMAIL),c.kind,c.obligation_id).first<any>();
 if(!row||row.fingerprint!==c.fingerprint||row.provider_invoice_id!==c.provider_invoice_id)return null;
 const recipient=await supportInvoiceRecipient(e.DB,"guest",row.request_id);
 if(!recipient||norm(recipient.email)!==norm(e.SUPPORT_UNIFIED_TEST_EMAIL))return null;
 try{
 const expected=JSON.parse(JSON.parse(row.snapshot_json).snapshot.seats_json);
 const seats=(await e.DB.prepare("SELECT seat_id,class_id,start_at,end_at,status,payment_due_at FROM support_club_obligation_seats WHERE kind=? AND obligation_id=? ORDER BY start_at,seat_id").bind(c.kind,c.obligation_id).all<any>()).results||[];
 const isPaid=c.notice_type==="confirmation"||c.notice_type==="session_reminder";
 if(row.state!==(isPaid?"paid":"issued")||row.obligation_status!==row.state||seats.length!==row.expected_seats||expected.length!==seats.length||
 seats.some(s=>s.status!==(isPaid?"paid":"invoiced")||!expected.some((x:any)=>x.seat_id===s.seat_id&&x.class_id===s.class_id&&x.start_at===s.start_at&&x.end_at===s.end_at&&x.payment_due_at===s.payment_due_at)))return null;
 const proof=await e.DB.prepare("SELECT invoice_id,amount_cents FROM support_club_square_settlements WHERE kind=? AND obligation_id=?").bind(c.kind,c.obligation_id).first<any>();
 if(isPaid?(!proof||proof.invoice_id!==row.provider_invoice_id||proof.amount_cents!==row.amount_cents):!!proof)return null;
 const t=now.getTime(),due=Date.parse(row.due_at),future=seats.filter(s=>Date.parse(s.start_at)>t);
 if(!future.length)return null;
 const session=future.find(s=>s.seat_id===c.seat_key);
 if(c.notice_type==="session_reminder"&&(!session||Date.parse(session.start_at)>t+DAY))return null;
 if(c.notice_type==="payment_reminder"&&!(due>t&&due<=t+DAY)||c.notice_type==="overdue"&&due>t)return null;
 return {row,recipient:recipient.email,dates:(session?[session]:future).map(s=>date(s.start_at)+" (Sydney time)")};
 }catch{return null;}
}
export async function processClubNotices(e:Env,now=new Date(),sender:typeof sendEmail=sendEmail,fetchImpl?:Fetch){
 if(!clubNoticesEnabled(e)||!await e.DB.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_club_notices'").first())return {sent:0,review:0,suppressed:0};
 const at=now.toISOString(),ahead=new Date(now.getTime()+DAY).toISOString();
 const candidates=(await e.DB.prepare(`WITH eligible AS (${core}), candidates AS (
 SELECT i.kind,i.obligation_id,i.fingerprint,i.provider_invoice_id,i.due_at,'confirmation' notice_type,'' seat_key,0 priority FROM eligible i WHERE ${paid}
 UNION ALL SELECT i.kind,i.obligation_id,i.fingerprint,i.provider_invoice_id,i.due_at,CASE WHEN i.due_at<=? THEN 'overdue' ELSE 'payment_reminder' END,'',2 FROM eligible i WHERE ${issued} AND i.due_at<=?
 UNION ALL SELECT i.kind,i.obligation_id,i.fingerprint,i.provider_invoice_id,i.due_at,'session_reminder',s.seat_id,1 FROM eligible i JOIN support_club_obligation_seats s ON s.kind=i.kind AND s.obligation_id=i.obligation_id WHERE ${paid} AND s.status='paid' AND s.start_at>? AND s.start_at<=?
 ) SELECT c.* FROM candidates c WHERE NOT EXISTS(SELECT 1 FROM support_club_notices n WHERE n.kind=c.kind AND n.obligation_id=c.obligation_id AND n.notice_type=c.notice_type AND n.seat_key=c.seat_key)
 AND EXISTS(SELECT 1 FROM support_club_obligation_seats s WHERE s.kind=c.kind AND s.obligation_id=c.obligation_id AND s.start_at>?)
 ORDER BY priority,due_at,obligation_id,seat_key LIMIT 5`).bind(norm(e.SUPPORT_UNIFIED_TEST_EMAIL),at,ahead,at,ahead,at).all<any>()).results||[];
 let sent=0,review=0,suppressed=0;
 for(const c of candidates){
  const initial=await snapshot(e,c,now);if(!initial)continue;
  const check=await inspectClubSquareInvoice(e,initial.row,fetchImpl);
  const isPaid=c.notice_type==="confirmation"||c.notice_type==="session_reminder";
  if(!check||(isPaid?check.status!=="PAID"||!check.settings||check.completed!==initial.row.amount_cents:!check.issued||check.completed!==0||check.version!==initial.row.provider_invoice_version||check.link!==initial.row.provider_public_url))continue;
  const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_club_notices(kind,obligation_id,notice_type,seat_key,status,attempted_at) SELECT ?,?,?,?,'sending',? WHERE EXISTS(SELECT 1 FROM support_club_square_intents i WHERE i.kind=? AND i.obligation_id=? AND i.fingerprint=? AND i.state=? AND NOT EXISTS(SELECT 1 FROM support_club_square_reviews v WHERE v.kind=i.kind AND v.obligation_id=i.obligation_id))").bind(c.kind,c.obligation_id,c.notice_type,c.seat_key,at,c.kind,c.obligation_id,c.fingerprint,isPaid?"paid":"issued").run();
  if(!claim.meta?.changes)continue;
  const current=await snapshot(e,c,now);
  const safe=!!current&&current.recipient===initial.recipient&&JSON.stringify(current.dates)===JSON.stringify(initial.dates);
  let ok=false;
  if(safe){
   const subject=c.notice_type==="confirmation"?"Your English Club places are confirmed":c.notice_type==="session_reminder"?"Your English Club workshop is coming up":c.notice_type==="overdue"?"English Club: payment needs review":"English Club: payment reminder";
   const amount=new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(initial.row.amount_cents/100);
   const body=["Hi there,",c.notice_type==="confirmation"?"Your payment has been verified. Your paid workshops are confirmed.":c.notice_type==="session_reminder"?"Your paid workshop is coming up. Please open your private family portal before the session.":c.notice_type==="overdue"?"Your payment deadline has passed. Your provisional reservation needs review.":"A friendly reminder that your payment deadline is approaching.",
   ...(isPaid?initial.dates:["Amount: "+amount+" AUD. Deadline: "+date(initial.row.due_at)+" (Sydney time).","If you have already paid, do not pay again. Check your private family portal or contact support."]),
   "Visit your private family portal for booking details. No classroom links, learner names or payment details are sent by email.","Thank you, Side-Quest Learning"];
   try{ok=await sender(e,{to:initial.recipient,subject:"[Sandbox test] "+subject,text:"Private sandbox test — no real payment required.\n\n"+body.join("\n\n"),html:layout({preheader:"Private sandbox test",kicker:"English Club sandbox",heading:subject,body:p("Private sandbox test — no real payment required.")+body.map(v=>p(esc(v))).join(""),reason:"Private test of agreed English Club correspondence."})});}catch{}
  }
  const status=!safe?"suppressed":ok?"sent":"review";
  await e.DB.prepare("UPDATE support_club_notices SET status=?,sent_at=? WHERE kind=? AND obligation_id=? AND notice_type=? AND seat_key=? AND status='sending'").bind(status,ok?at:null,c.kind,c.obligation_id,c.notice_type,c.seat_key).run();
  if(status==="sent")sent++;else if(status==="review")review++;else suppressed++;
 }
 return {sent,review,suppressed};
}
