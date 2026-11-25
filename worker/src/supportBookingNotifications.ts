import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {sendEmail,layout,p,esc,button} from "./email";
const date=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit"});
const clock=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",hour:"numeric",minute:"2-digit"});
const money=(n:number)=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(n);
export async function bookingDetails(db:D1Database,channel:Channel,id:string,oid:string){
 const order=await getOrder(db,channel,id,oid);
 if(!order)return null;
 // A single package invoice covers all package sessions. An instalment covers only its own appointment.
 const appointments=order.package_root_id&&!order.installment_due_at?(await db.prepare("SELECT o.id,o.start_at,o.end_at,o.status,o.mode FROM support_package_sessions p JOIN support_service_orders o ON o.id=p.order_id WHERE p.root_id=? AND o.channel=? AND o.request_id=? ORDER BY p.sequence").bind(order.package_root_id,channel,id).all<any>()).results||[]:[order];
 const invoice=await db.prepare("SELECT reference,due_at,verified_at FROM support_manual_invoices WHERE order_id=? AND cancelled_at IS NULL").bind(order.package_root_id&&!order.installment_due_at?order.package_root_id:oid).first<any>();
 const lines=appointments.filter(a=>a.mode==="live"&&a.start_at&&a.end_at&&a.status!=="cancelled").map(a=>date.format(new Date(a.start_at))+" – "+clock.format(new Date(a.end_at))+" (Sydney time)");
 return {order,appointments,invoice,lines};
}
export async function sendBookingConfirmation(e:Env,channel:Channel,id:string,oid:string,portal:string|null,now=new Date()){
 const details=await bookingDetails(e.DB,channel,id,oid),recipient=await e.DB.prepare(channel==="guest"?"SELECT email FROM support_guest_requests WHERE id=?":"SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
 if(!details||!recipient?.email||!portal||details.order.status!=="paid"||!details.invoice?.verified_at||details.order.package_sequence>1&&!details.order.installment_due_at||details.appointments.some(a=>a.status!=="paid"))return false;
 const subject="Side-Quest Learning Support: booking confirmed";
 const lines=details.lines.length?details.lines:["Your agreed written learning support is confirmed."];
 const body="Thank you. Your payment has been verified and your booking is confirmed.\n\n"+lines.join("\n")+"\n\nInvoice: "+details.invoice.reference+"\nAmount verified: "+money(details.order.amount_cents/100)+" AUD\n\nReview your arrangements in your private portal: "+portal+"\nIf you need to change an appointment, please contact Side-Quest.";
 const at=now.toISOString();
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_booking_notifications(order_id,channel,request_id,recipient,subject,body_text,status,attempted_at) SELECT id,channel,request_id,?,?,?,'sending',? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status='paid' AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_service_orders.id AND c.status='pending')").bind(recipient.email,subject,body,at,oid,channel,id).run();
 if(!claim.meta?.changes)return false;
 let sent=false;
 try{sent=await sendEmail(e,{to:recipient.email,subject,text:body,html:layout({preheader:"Your learning support booking is confirmed.",kicker:"Learning Support",heading:"Your booking is confirmed",body:p("Thank you. Your payment has been verified.")+lines.map(line=>p(esc(line))).join("")+p(esc("Invoice: "+details.invoice.reference+" | Amount verified: "+money(details.order.amount_cents)+" AUD"))+button("View your arrangements",portal)+p("If you need to change an appointment, please contact Side-Quest."),reason:"This is a service notification for your agreed learning support."})});}catch{}
 await e.DB.prepare("UPDATE support_booking_notifications SET status=?,sent_at=? WHERE order_id=? AND channel=? AND request_id=? AND status='sending'").bind(sent?"sent":"review",sent?new Date().toISOString():null,oid,channel,id).run();
 return sent;
}
export async function bookingNotificationStatus(db:D1Database,channel:Channel,id:string,oid:string){
 return db.prepare("SELECT status,attempted_at,sent_at FROM support_booking_notifications WHERE order_id=? AND channel=? AND request_id=?").bind(oid,channel,id).first();
}
