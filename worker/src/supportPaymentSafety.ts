import {bookingDetails} from "./supportBookingNotifications";
import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {sendEmail,layout,p,esc,SUPPORT_EMAIL} from "./email";
const DAY=86400000;
export async function requestAppointmentCancellation(db:D1Database,channel:Channel,id:string,oid:string,now=new Date()){
 const at=now.toISOString();
 const r=await db.prepare("INSERT INTO support_cancellation_requests(order_id,requested_at,status) SELECT id,?,'pending' FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND mode='live' AND status IN ('awaiting_confirmation','confirmed','paid','review') AND start_at>? ON CONFLICT(order_id) DO UPDATE SET status='pending',requested_at=excluded.requested_at,resolved_at=NULL WHERE support_cancellation_requests.status='withdrawn'").bind(at,oid,channel,id,at).run();
 if(r.meta?.changes)return true;
 return !!await db.prepare("SELECT c.order_id FROM support_cancellation_requests c JOIN support_service_orders o ON o.id=c.order_id WHERE o.id=? AND o.channel=? AND o.request_id=? AND c.status='pending' AND o.status IN ('awaiting_confirmation','confirmed','paid','review')").bind(oid,channel,id).first();
}
export async function dismissCancellation(db:D1Database,channel:Channel,id:string,oid:string,now=new Date()){
 const r=await db.prepare("UPDATE support_cancellation_requests SET status='withdrawn',resolved_at=? WHERE order_id=? AND status='pending' AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_cancellation_requests.order_id AND o.channel=? AND o.request_id=? AND o.status NOT IN ('cancelled','completed'))").bind(now.toISOString(),oid,channel,id).run();
 return !!r.meta?.changes;
}
// Owner explicitly records an agreed cancellation of one paid appointment only.
// No payment/refund is initiated here; the provider outcome must be checked first.
export async function cancelPaidAppointment(db:D1Database,channel:Channel,id:string,oid:string,b:any,now=new Date()){
 if(b?.confirmed!==true||b?.financial_resolution_checked!==true||b?.parent_notified!==true)return false;
 const at=now.toISOString();
 const result=await db.batch([
  db.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE id=? AND channel=? AND request_id=? AND mode='live' AND status='paid' AND start_at>? AND checkout_started_at IS NULL AND NOT EXISTS(SELECT 1 FROM support_package_sessions p JOIN support_service_orders s ON s.id=p.order_id WHERE p.root_id=support_service_orders.id AND p.order_id<>p.root_id AND s.status IN ('awaiting_confirmation','confirmed'))").bind(at,oid,channel,id,at),
  db.prepare("UPDATE support_cancellation_requests SET status='resolved',resolved_at=? WHERE order_id=? AND status='pending' AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_cancellation_requests.order_id AND o.channel=? AND o.request_id=? AND o.status='cancelled' AND o.updated_at=?)").bind(at,oid,channel,id,at)
 ]);
 return !!result[0]?.meta?.changes;
}
export async function pendingCancellations(db:D1Database){
 return (await db.prepare("SELECT o.id,o.channel,o.request_id,o.status,o.start_at,c.requested_at FROM support_cancellation_requests c JOIN support_service_orders o ON o.id=c.order_id WHERE c.status='pending' AND o.status NOT IN ('cancelled','completed') ORDER BY c.requested_at LIMIT 100").all()).results||[];
}
type NoticeRow={id:string;channel:Channel;request_id:string;due_at:string;reference:string};
export async function processSupportInvoiceNotices(e:Env,now=new Date(),sender=sendEmail){
 if(e.SUPPORT_PAYMENT_NOTICES!=="true"||!e.EMAIL||e.STAGING_KEY||e.STAGING_PRIVATE==="true")return {sent:0,review:0};
 const at=now.toISOString(),ahead=new Date(now.getTime()+DAY).toISOString(),since=new Date(now.getTime()-DAY).toISOString();
 const db=e.DB;
 const rows=(await db.prepare("SELECT o.id,o.channel,o.request_id,i.due_at,i.reference FROM support_service_orders o JOIN support_manual_invoices i ON i.order_id=o.id WHERE o.status='confirmed' AND o.mode='live' AND o.amount_cents>0 AND o.start_at>? AND i.verified_at IS NULL AND i.cancelled_at IS NULL AND i.due_at>=? AND i.due_at<=? AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending') AND NOT EXISTS(SELECT 1 FROM support_invoice_notices n WHERE n.order_id=o.id AND n.due_at=i.due_at AND n.kind=CASE WHEN i.due_at<=? THEN 'overdue' ELSE 'reminder' END) ORDER BY i.due_at LIMIT 10").bind(at,since,ahead,at).all<NoticeRow>()).results||[];
 let sent=0,review=0;
 for(const row of rows){
  const recipient=await db.prepare(row.channel==="guest"?"SELECT email FROM support_guest_requests WHERE id=?":"SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(row.request_id).first<{email:string}>();
  if(!recipient?.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.email))continue;
  const kind=row.due_at<=at?"overdue":"reminder";
  const claimed=await db.prepare("INSERT OR IGNORE INTO support_invoice_notices(order_id,due_at,kind,status,attempted_at) SELECT o.id,i.due_at,?,'sending',? FROM support_service_orders o JOIN support_manual_invoices i ON i.order_id=o.id WHERE o.id=? AND o.status='confirmed' AND o.start_at>? AND i.due_at=? AND i.verified_at IS NULL AND i.cancelled_at IS NULL AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')").bind(kind,at,row.id,at,row.due_at).run();
  if(!claimed.meta?.changes)continue;
  const due=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"long",timeStyle:"short"}).format(new Date(row.due_at));
  const subject=kind==="reminder"?"Side-Quest Learning Support: payment reminder":"Side-Quest Learning Support: payment review needed";
  const message=(kind==="reminder"?"A payment deadline is approaching.":"The recorded payment deadline has passed and payment has not yet been verified by Side-Quest.")+" Invoice "+row.reference+"; agreed deadline "+due+" (Sydney time). Your appointment is provisional until payment is verified. If you have already paid, please do not pay again. Reply to "+SUPPORT_EMAIL+" so we can check your payment or discuss arrangements. Unpaid reservations may be released after verification.";
  let ok=false;try{ok=await sender(e,{to:recipient.email,subject,text:message,html:layout({preheader:"A reminder about your agreed learning support arrangements.",kicker:"Learning Support",heading:subject.split(": ")[1],body:p(esc(message)),reason:"This is a service notification about an agreed appointment."})});}catch{}
  await db.prepare("UPDATE support_invoice_notices SET status=?,sent_at=? WHERE order_id=? AND due_at=? AND kind=? AND status='sending'").bind(ok?"sent":"review",ok?at:null,row.id,row.due_at,kind).run();
  if(ok)sent++;else review++;
 }
 return {sent,review};
}

export async function sendFinalPaymentWarning(e:Env,channel:Channel,id:string,oid:string,b:any,now=new Date(),sender=sendEmail){
 if(e.SUPPORT_PAYMENT_NOTICES!=="true"||!e.EMAIL||e.STAGING_KEY||e.STAGING_PRIVATE==="true"||b?.confirmed!==true||b?.checked_unpaid_in_square!==true)return {error:"Confirm Square has no completed, partial or pending payment; payment emails must be enabled."};
 const d=await bookingDetails(e.DB,channel,id,oid),at=now.toISOString();
 if(!d||d.order.status!=="confirmed"||!d.invoice||d.invoice.verified_at||d.invoice.due_at>at||d.order.mode!=="live"||!d.order.start_at||d.order.start_at<=at||d.order.package_sequence>1&&!d.order.installment_due_at||d.appointments.some(a=>a.status!=="confirmed"))return {error:"Only a future provisional appointment with an overdue, unverified invoice can receive this warning."};
 const recipient=await e.DB.prepare(channel==="guest"?"SELECT email FROM support_guest_requests WHERE id=?":"SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
 if(!recipient?.email)return {error:"Parent email unavailable."};
 const due=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"full",timeStyle:"short"}).format(new Date(d.invoice.due_at));
 const subject="Side-Quest Learning Support: a reminder about your reserved time";
 const message="Hi there,\n\nJust a friendly follow-up about your provisional Learning Support booking.\n\n"+d.lines.join("\n")+"\n\nPayment for Square invoice "+d.invoice.reference+" was due "+due+" (Sydney time). If payment remains outstanding, we will need to cancel the reservation so the time can be offered to another family. If you need a little more time or would like to discuss your payment arrangements, please get in touch as soon as possible. If you have already paid, please let us know rather than paying again.\n\nThank you,\nSide-Quest Learning";
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_payment_warnings(order_id,due_at,reference,recipient,body_text,status,attempted_at) SELECT o.id,i.due_at,i.reference,?,?,'sending',? FROM support_service_orders o JOIN support_manual_invoices i ON i.order_id=o.id WHERE o.id=? AND o.channel=? AND o.request_id=? AND o.status='confirmed' AND o.start_at>? AND i.reference=? AND i.due_at=? AND i.due_at<=? AND i.verified_at IS NULL AND i.cancelled_at IS NULL AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')").bind(recipient.email,message,at,oid,channel,id,at,d.invoice.reference,d.invoice.due_at,at).run();
 if(!claim.meta?.changes)return {error:"Warning already attempted or reservation changed. Review correspondence before further action."};
 let sent=false;try{sent=await sender(e,{to:recipient.email,subject,text:message,html:layout({preheader:"A friendly reminder about your provisional booking.",kicker:"Learning Support",heading:"A reminder about your reserved time",body:message.split("\n\n").map(s=>p(esc(s).replaceAll("\n","<br>"))).join(""),reason:"This is a service notification about your agreed appointment."})});}catch{}
 await e.DB.prepare("UPDATE support_payment_warnings SET status=?,sent_at=? WHERE order_id=? AND status='sending'").bind(sent?"sent":"review",sent?new Date().toISOString():null,oid).run();
 return {ok:sent,warning_email_sent:sent};
}
