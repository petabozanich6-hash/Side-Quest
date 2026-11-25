import type {Env} from "./types";
import {ensureOrderSchema} from "./supportOrders";
import {ensureFeedbackSchema} from "./feedback";
import {ensureGuestSchema,guestOrigin} from "./guestSupport";
import {sendEmail,layout,p,h2,ul,esc,button,type OutgoingEmail} from "./email";
import {housekeepingSections} from "./ownerHousekeeping";
const SCHEMA=["CREATE TABLE IF NOT EXISTS support_briefing_settings (id INTEGER PRIMARY KEY CHECK(id=1), enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)), hour INTEGER NOT NULL DEFAULT 7 CHECK(hour BETWEEN 0 AND 23), updated_at TEXT NOT NULL)","CREATE TABLE IF NOT EXISTS support_briefing_delivery (local_date TEXT PRIMARY KEY, status TEXT NOT NULL CHECK(status IN ('sending','sent','review')), attempted_at TEXT NOT NULL, sent_at TEXT)"] as const;
const ZONE="Australia/Sydney";
async function ensure(db:D1Database){for(const sql of SCHEMA)await db.prepare(sql).run();}
function parts(now:Date){
 const values=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:ZONE,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(now).map(p=>[p.type,p.value]));
 return {year:+values.year,month:+values.month,day:+values.day,hour:+values.hour,key:values.year+"-"+values.month+"-"+values.day};
}
export function sydneyDay(now:Date){
 const d=parts(now);
 const midnight=(offset:number)=>{const target=Date.UTC(d.year,d.month-1,d.day+offset);let t=target;for(let i=0;i<3;i++){const a=parts(new Date(t));const minute=Number(new Intl.DateTimeFormat("en-AU",{timeZone:ZONE,minute:"2-digit"}).format(new Date(t)));t+=target-Date.UTC(a.year,a.month-1,a.day,a.hour,minute);}return new Date(t).toISOString();};
 return {date:d.key,hour:d.hour,from:midnight(0),tomorrow:midnight(1),next:midnight(2)};
}
export function briefingConfigured(e:Env){return !e.STAGING_KEY&&!!e.EMAIL&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e.OWNER_NOTIFICATION_EMAIL||"").trim());}
export async function briefingSettings(db:D1Database){
 await ensure(db);const r=await db.prepare("SELECT enabled,hour FROM support_briefing_settings WHERE id=1").first<{enabled:number;hour:number}>();
 const last=await db.prepare("SELECT local_date,status,attempted_at,sent_at FROM support_briefing_delivery ORDER BY local_date DESC LIMIT 1").first();
 return {enabled:r?.enabled===1,hour:r?.hour??7,last};
}
export async function saveBriefingSettings(e:Env,b:any){
 if(typeof b?.enabled!=="boolean"||!Number.isInteger(b.hour)||b.hour<0||b.hour>23||b.confirmed!==true)return false;
 if(b.enabled&&!briefingConfigured(e))return false;
 await ensure(e.DB);await e.DB.prepare("INSERT INTO support_briefing_settings(id,enabled,hour,updated_at) VALUES(1,?,?,?) ON CONFLICT(id) DO UPDATE SET enabled=excluded.enabled,hour=excluded.hour,updated_at=excluded.updated_at").bind(b.enabled?1:0,b.hour,new Date().toISOString()).run();return true;
}
type Appointment={start_at:string;end_at:string;status:string;ready:number;prep_minutes:number;wrap_minutes:number};
type Due={due_at:string;amount_cents:number;reference:string|null};
export async function buildBriefing(e:Env,now=new Date()){
 const db=e.DB;await ensureOrderSchema(db);await ensureFeedbackSchema(db);await ensureGuestSchema(db);
 const day=sydneyDay(now),when=now.toISOString();
 const count=async(sql:string,...args:string[])=>Number((await db.prepare(sql).bind(...args).first<{n:number}>())?.n??0);
 const [today,next,due,newMembers,newGuests,unreadMembers,unreadGuests,interestedMembers,interestedGuests,uninvoiced,unconfirmed,finished,review,blocks]=await Promise.all([
  db.prepare("SELECT o.start_at,o.end_at,o.status,COALESCE(d.ready,0) ready,COALESCE(d.prep_minutes,0) prep_minutes,COALESCE(d.wrap_minutes,0) wrap_minutes FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND o.start_at>=? AND o.start_at<? ORDER BY o.start_at LIMIT 101").bind(day.from,day.tomorrow).all<Appointment>(),
  count("SELECT COUNT(*) n FROM support_service_orders WHERE mode='live' AND status NOT IN ('cancelled','completed') AND start_at>=? AND start_at<?",day.tomorrow,day.next),
  db.prepare("SELECT COALESCE(t.due_at,i.due_at) due_at,o.amount_cents,i.reference FROM support_service_orders o LEFT JOIN support_installment_terms t ON t.order_id=o.id LEFT JOIN support_manual_invoices i ON i.order_id=o.id WHERE o.status='confirmed' AND i.cancelled_at IS NULL AND COALESCE(t.due_at,i.due_at)<? ORDER BY COALESCE(t.due_at,i.due_at) LIMIT 101").bind(day.next).all<Due>(),
  count("SELECT COUNT(*) n FROM parent_feedback WHERE page_hint='learning-support' AND status='new'"),
  count("SELECT COUNT(*) n FROM support_guest_requests WHERE status='new'"),
  count("SELECT COUNT(*) n FROM parent_feedback WHERE page_hint='learning-support' AND seen_at IS NULL AND status NOT IN ('closed','resolved')"),
  count("SELECT COUNT(*) n FROM support_guest_requests WHERE seen_at IS NULL AND status NOT IN ('closed','resolved')"),
  count("SELECT COUNT(*) n FROM learning_support_quotes q JOIN parent_feedback f ON f.id=q.feedback_id WHERE q.status='interested' AND q.expires_at>? AND f.status NOT IN ('closed','resolved') AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_package_sessions ps ON ps.order_id=o.id WHERE o.channel='member' AND COALESCE(ps.quote_id,o.quote_id)=q.id AND o.status<>'cancelled')",when),
  count("SELECT COUNT(*) n FROM support_guest_quotes q JOIN support_guest_requests r ON r.id=q.request_id WHERE q.status='interested' AND q.expires_at>? AND r.status NOT IN ('closed','resolved') AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_package_sessions ps ON ps.order_id=o.id WHERE o.channel='guest' AND COALESCE(ps.quote_id,o.quote_id)=q.id AND o.status<>'cancelled')",when),
  count("SELECT COUNT(*) n FROM support_service_orders o WHERE o.status='confirmed' AND o.amount_cents>0 AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=o.id) AND o.checkout_started_at IS NULL"),
  count("SELECT COUNT(*) n FROM support_service_orders o WHERE o.status='awaiting_confirmation' AND NOT EXISTS(SELECT 1 FROM support_package_sessions ps WHERE ps.order_id=o.id AND ps.root_id<>ps.order_id)"),
  count("SELECT COUNT(*) n FROM support_service_orders WHERE status='paid' AND mode='live' AND end_at<=?",when),
  count("SELECT COUNT(*) n FROM support_service_orders WHERE status='review'"),
  count("SELECT COUNT(*) n FROM support_busy_blocks WHERE start_at<? AND end_at>?",day.tomorrow,day.from)
 ]);
 const appointments=today.results||[],payments=due.results||[];
 const overdue=payments.filter(x=>x.due_at<=when),todayDue=payments.filter(x=>x.due_at>when&&x.due_at<day.tomorrow),tomorrowDue=payments.filter(x=>x.due_at>=day.tomorrow);
 const money=(c:number)=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(c/100);
 const paymentLine=(label:string,items:Due[])=>label+": "+items.length+" · "+money(items.reduce((a,x)=>a+x.amount_cents,0))+" scheduled total (verify Square; not a live balance)";
 const clock=(s:string)=>new Intl.DateTimeFormat("en-AU",{timeZone:ZONE,hour:"numeric",minute:"2-digit"}).format(new Date(s));
 const whenLabel=new Intl.DateTimeFormat("en-AU",{timeZone:ZONE,dateStyle:"full",timeStyle:"short"}).format(now);
 const housekeeping=await housekeepingSections(e,now).catch(()=>[{heading:"Platform housekeeping",lines:["Housekeeping checks unavailable — review Owner HQ."]}]);
 const cancellationCount=await count("SELECT COUNT(*) n FROM support_cancellation_requests c JOIN support_service_orders o ON o.id=c.order_id WHERE c.status='pending' AND o.status NOT IN ('cancelled','completed')");
 const noticeReviewCount=await count("SELECT COUNT(*) n FROM support_invoice_notices WHERE status IN ('sending','review')")+await count("SELECT COUNT(*) n FROM support_payment_warnings WHERE status IN ('sending','review')")+await count("SELECT COUNT(*) n FROM support_booking_notifications WHERE status IN ('sending','review')");
 const sections=[
  {heading:"Today's diary",lines:[appointments.length+" appointment(s)"+(appointments.length>100?" (display capped; open HQ for full diary)":""),appointments.filter(o=>o.status==="paid"&&!o.ready).length+" confirmed lesson(s) need preparation",blocks+" unavailable time block(s)",...appointments.slice(0,30).map(o=>clock(o.start_at)+"–"+clock(o.end_at)+" · "+(o.status==="paid"?"Confirmed":o.status==="confirmed"?"Awaiting payment":o.status==="review"?"Payment review":"Awaiting parent confirmation")+" · "+(o.ready?"Prepared":"Preparation needed")+" · "+o.prep_minutes+" min prep / "+o.wrap_minutes+" min wrap-up"),...(appointments.length>30?["More appointments in HQ."]:[]),next+" appointment(s) tomorrow"]},
  {heading:"Payments and reservations",lines:[paymentLine("Overdue — check Square before release",overdue),paymentLine("Due later today",todayDue),paymentLine("Due tomorrow",tomorrowDue),uninvoiced+" positive-value confirmed order(s) without recorded invoice",unconfirmed+" arrangement(s) awaiting parent confirmation",review+" payment record(s) requiring review",cancellationCount+" cancellation request(s) awaiting review",noticeReviewCount+" payment reminder delivery attempt(s) requiring review",...(payments.length>100?["Payment summary capped; open HQ for all records."]:[]),"Check for full or partial payment in Square, then cancel the unpaid invoice and release the reservation if appropriate. Never cancel from this email."]},
  {heading:"Enquiries and follow-ups",lines:[newMembers+newGuests+" new-status enquiries ("+newMembers+" member / "+newGuests+" standalone)",unreadMembers+unreadGuests+" open enquiries with unseen activity",interestedMembers+interestedGuests+" interested proposal(s) awaiting arrangements",finished+" paid live session(s) ended but not marked complete"]},...housekeeping
 ];
 const origin=guestOrigin(e),hq=origin?origin+"/parent/command-centre/learning-support":"",member=origin?origin+"/parent/command-centre/feedback":"";
 const subject="Side-Quest daily briefing — "+day.date;
 const intro="Snapshot generated "+whenLabel+" (Sydney time). Counts reflect Side-Quest records, not live Square balances. Private learner details, notes and customer contact information remain in Owner HQ.";
 const text=[subject,intro,...sections.flatMap(s=>["",s.heading,...s.lines]),"",hq?"Tutor diary and standalone enquiries: "+hq:"Open Owner HQ",member?"Member feedback inbox: "+member:""].join("\n");
 const html=layout({preheader:"Today’s schedule, payments, enquiries and platform housekeeping.",kicker:"Owner HQ",heading:"Your daily briefing",body:p(esc(intro))+sections.map(s=>h2(s.heading)+ul(s.lines.map(esc))).join("")+(hq?button("Open tutor diary",hq)+button("Member feedback inbox",member)+button("Platform overview",origin+"/parent/command-centre"):""),reason:"Private owner briefing, enabled in Owner HQ."});
 return {date:day.date,subject,text,html};
}
export async function runDailyBriefing(e:Env,now=new Date(),sender:typeof sendEmail=sendEmail){
 if(!briefingConfigured(e))return "disabled";
 const {enabled,hour}=await briefingSettings(e.DB),day=sydneyDay(now);
 if(!enabled||day.hour!==hour)return "not_due";
 // Unique claim prevents concurrent cron ticks or an email response timeout causing duplicate sends.
 // An uncertain or failed delivery is marked for review, not automatically retried.
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_briefing_delivery(local_date,status,attempted_at) VALUES(?,'sending',?)").bind(day.date,now.toISOString()).run();
 if(!claim.meta?.changes)return "duplicate";
 try{
  const digest=await buildBriefing(e,now);
  const mail:OutgoingEmail={to:String(e.OWNER_NOTIFICATION_EMAIL).trim(),subject:digest.subject,text:digest.text,html:digest.html};
  if(!await sender(e,mail))throw Error("Delivery not confirmed");
  await e.DB.prepare("UPDATE support_briefing_delivery SET status='sent',sent_at=? WHERE local_date=? AND status='sending'").bind(new Date().toISOString(),day.date).run();
  return "sent";
 }catch{
  await e.DB.prepare("UPDATE support_briefing_delivery SET status='review' WHERE local_date=? AND status='sending'").bind(day.date).run();
  return "review";
 }
}
