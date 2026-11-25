import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
import {sendEmail,layout,p,esc,SUPPORT_EMAIL} from "./email";
export function validBackupMeeting(value:unknown){
 if(value===undefined||value==="")return "";
 if(typeof value!=="string"||!/^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(value))return null;
 return value;
}
export function planText(plan:any,privateNotes=false){
 if(!plan)return "No separate learning plan was attached.";
 const lines=[plan.title,plan.subject+" · "+plan.year_level,"Goal: "+plan.goal];
 for(const [i,l] of plan.lessons.entries()){
  lines.push("","Lesson "+(i+1)+": "+l.title+" ("+l.minutes+" min)","Objective: "+l.objective,"Activities: "+l.activities,"Progress check: "+l.check,"Follow-up practice: "+l.home_practice);
  if(privateNotes&&plan.tutor_guides?.[i])lines.push("PRIVATE teaching guide: "+plan.tutor_guides[i].guide,"PRIVATE answers: "+plan.tutor_guides[i].answers);
 }
 return lines.join("\n");
}
export async function buildContinuity(e:Env,channel:Channel,id:string,oid:string,b:any){
 const order=await getOrder(e.DB,channel,id,oid);
 if(!order||!["paid","completed"].includes(order.status)||order.checkout_started_at)return {error:"A confirmed service is required."};
 const link=validBackupMeeting(b?.backup_url);
 if(link===null)return {error:"Enter a private Google Meet link in the format https://meet.google.com/abc-defg-hij, without extra parameters."};
 if(link&&(order.mode!=="live"||b.guardian_agreed!==true||b.restricted_access!==true))return {error:"Confirm the guardian agreed to this alternate service and restricted host admission is configured."};
 const recipient=channel==="guest"?await e.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>():await e.DB.prepare("SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
 if(!recipient?.email)return {error:"Customer email not found."};
 const plan=await readQuotePlan(e.DB,channel,id,order.quote_id,true);
 const format=(s:string)=>new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"full",timeStyle:"short"}).format(new Date(s));
 const when=order.start_at?format(order.start_at)+" to "+format(order.end_at)+" (Sydney time)":order.delivery;
 const fallback=link?"If the Side-Quest classroom is unavailable, use this backup Google Meet link at the agreed appointment time: "+link+"\nThe tutor will admit only the expected parent/guardian and learner. A guardian must remain present. Do not forward this link or record the session.":"If the classroom or resource portal is unavailable, reply to the existing booking correspondence to arrange an alternative.";
 const text=["Side-Quest Learning Support — confirmed arrangements","Appointment / delivery: "+when,"Agreed service: "+order.scope,"Amount: AUD "+(order.amount_cents/100).toFixed(2),"","KEEP THIS EMAIL OR SAVE THE ATTACHED PLAN BEFORE YOUR APPOINTMENT.",fallback,"If neither option works, contact Side-Quest to arrange completion, rescheduling at no additional charge for the undelivered service, or an appropriate refund under your agreed terms and applicable consumer rights. Do not make a second payment.","Contact: "+SUPPORT_EMAIL+"; if unavailable, use your existing Square invoice correspondence.","",planText(plan)].join("\n");
 const tutor=["PRIVATE — keep on your own secured device","Customer email: "+recipient.email,"Order: "+oid,"",text,"","TUTOR NOTES — never forward to parent",planText(plan,true)].join("\n");
 return {recipient:recipient.email,parent_text:text,tutor_text:tutor};
}
export async function emailContinuity(e:Env,pack:{recipient:string;parent_text:string}){
 return sendEmail(e,{to:pack.recipient,subject:"Side-Quest Learning Support — save your appointment backup",text:pack.parent_text,html:layout({preheader:"Save your booking arrangements before the appointment.",kicker:"Learning Support",heading:"Your appointment backup",body:p(esc(pack.parent_text).replace(/\n/g,"<br>")),reason:"This is a service notification for your confirmed arrangements."}),attachments:[{filename:"sidequest-learning-plan.txt",type:"text/plain",content:pack.parent_text,disposition:"attachment"}]});
}
