import type {App,AuthUser,Guards} from "./types";
import {newId,nowIso} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {parseLearningSupport} from "./learningSupport";
import {ENGLISH_CLUB_PREFIX,ENGLISH_CLUB_SERVICE} from "./englishClub";
import {guestNotify,guestQuotes,guestMessages} from "./guestSupport";
import {hitRateLimit} from "./adminAudit";
import {loadPlatformSettings} from "./platformSettings";
import {ownsPortalEnquiry} from "./unifiedPortalRequestAccess";
import {readAvailability,suggestSupportStarts} from "./supportPublicAvailability";
const idOk=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
// Fixed-price pilot catalogue: never trust a client-defined price or scope.
export const STANDARD_LIVE_RATES={live30:{minutes:30,cents:2500},live45:{minutes:45,cents:3500},live60:{minutes:60,cents:4500}} as const;
export function standardSelection(b:any){
 if(!b||typeof b.standard_service!=="string"||!Object.prototype.hasOwnProperty.call(STANDARD_LIVE_RATES,b.standard_service))return null;
 const rate=STANDARD_LIVE_RATES[b.standard_service as keyof typeof STANDARD_LIVE_RATES],count=b.session_count;
 if(!Number.isInteger(count)||count<1||count>4||!["upfront","installments"].includes(b.payment_mode)||b.expected_total_cents!==rate.cents*count)return null;
 return {...rate,count,total:rate.cents*count,payment_mode:count===1?"upfront":b.payment_mode as "upfront"|"installments"};
}
export async function submitPortalEnquiry(db:D1Database,a:AuthUser,b:any,allowStandard=false){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||!b||!idOk(b.learner_id)||!idOk(b.request_key)||!["tutoring","english-club"].includes(b.kind))return {error:"Select a learner and service."};
 const club=b.kind==="english-club",requestedStandard=b.standard_service!==undefined;
 const standard=requestedStandard?standardSelection(b):null;
 if(requestedStandard&&(!allowStandard||club||!standard))return {error:"Select an available standard service and confirm its current price."};
 const parsed=parseLearningSupport(club?{...b,subject:"English",service:"Live online support"}:standard?{...b,service:"Live online support",detail:typeof b.detail==="string"&&b.detail.trim()?b.detail:"Standard tutoring session; parent may provide additional learning details later."}:b);
 if("error" in parsed)return {error:parsed.error};
 const learner=await db.prepare("SELECT p.id,COALESCE(s.name,p.label) label FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.id=? AND p.family_id=? AND (p.parent_user_id=? OR s.id IS NOT NULL)").bind(b.learner_id,a.family_id,a.id).first<{id:string;label:string}>();
 if(!learner)return {error:"Select a learner belonging to your account."};
 const subject=club?ENGLISH_CLUB_PREFIX+b.year:parsed.subject;
 const details=club?parsed.message.replace("Preferred support: Live online support","Preferred support: "+ENGLISH_CLUB_SERVICE):parsed.message;
 const message="Learner: "+learner.label+"\n"+details;
 const digest=await hash(JSON.stringify([learner.id,b.kind,subject,details,...(standard?[standard]:[])]));
 const find=()=>db.prepare("SELECT request_id,payload_hash FROM support_portal_enquiries WHERE family_id=? AND parent_user_id=? AND request_key=?").bind(a.family_id,a.id,b.request_key).first<{request_id:string;payload_hash:string}>();
 const prior=await find();
 if(prior)return prior.payload_hash===digest?{id:prior.request_id,created:false}:{error:"This submission key was already used. Start a new enquiry."};
 const id=newId(),now=nowIso();
 const qid="standard-"+id,expires=new Date(Date.parse(now)+7*86400000).toISOString();
 const additional:D1PreparedStatement[]=[];
 if(standard){
  const availability=await readAvailability(db);
  if(!availability.enabled||!availability.policy.enforced)return {error:"Standard online bookings are paused. Please check back or request personalised support."};
  const starts=(await suggestSupportStarts(db,standard.minutes,10,10,new Date(now))||[]).filter(v=>Date.parse(v)>Date.parse(now)+24*3600000).slice(0,12);
  if(starts.length<standard.count)return {error:"Not enough suitable appointment times are currently available. No request or booking was made."};
  const scope=standard.count+" × "+standard.minutes+"-minute online tutoring session"+(standard.count===1?"":"s")+" for one learner. Includes tailored preparation, guided practice and a brief parent update after each session.";
  const delivery="Online tutoring; "+standard.count+" × "+standard.minutes+" minutes. "+(standard.payment_mode==="installments"?"Pay separately before each session.":"One invoice for the selected service.");
  const terms="Payment is due by the agreed invoice deadline. Booking is confirmed after verified payment. Changes and cancellations are handled under the Learning Support Service Agreement.";
  additional.push(db.prepare("INSERT INTO support_guest_quotes(id,request_id,scope,delivery,amount_cents,currency,status,created_at,expires_at) VALUES(?,?,?,?,?,'AUD','offered',?,?)").bind(qid,id,scope,delivery,standard.total,now,expires));
  additional.push(db.prepare("INSERT INTO support_quote_schedules(channel,quote_id,request_id,minutes_json) VALUES('guest',?,?,?)").bind(qid,id,JSON.stringify(Array(standard.count).fill(standard.minutes))));
  if(standard.count===1)additional.push(db.prepare("INSERT INTO support_slot_offers(id,channel,request_id,quote_id,starts_json,minutes,prep_minutes,wrap_minutes,learner_label,terms,expires_at,created_at) VALUES(?,'guest',?,?,?,?,10,10,?,?,?,?)").bind(newId(),id,qid,JSON.stringify(starts),standard.minutes,learner.label.slice(0,80),terms,expires,now));
  else additional.push(db.prepare("INSERT INTO support_package_offers(id,channel,request_id,quote_id,learner_label,terms,payment_mode,deadline_hours,expires_at) VALUES(?,'guest',?,?,?,?,?,24,?)").bind(newId(),id,qid,learner.label.slice(0,80),terms,standard.payment_mode,expires));
 }
 // D1 batch is atomic: neither an unowned request nor a duplicate mapping can survive a failed write.
 try{await db.batch([
 db.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,identity.email,identity.name,subject,message,now,now),
 db.prepare("INSERT INTO support_portal_enquiries(request_id,family_id,parent_user_id,learner_id,service,request_key,payload_hash,created_at) VALUES(?,?,?,?,?,?,?,?)").bind(id,a.family_id,a.id,learner.id,b.kind,b.request_key,digest,now),...additional
 ]);}catch(e){const r=await find();if(r)return r.payload_hash===digest?{id:r.request_id,created:false}:{error:"This submission key was already used. Start a new enquiry."};throw e;}
 return {id,created:true};
}
export function registerPortalIntake(app:App,g:Guards){
 const root="/api/family-portal/enquiries";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.post(root+"/submit",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent access required."},403);
  if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"New enquiries are temporarily paused."},503);
  if(!(await hitRateLimit(c.env.DB,"portal-enquiry:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
  const r=await submitPortalEnquiry(c.env.DB,a,await c.req.json().catch(()=>null),true);
  if("error" in r)return c.json({detail:r.error},400);
  if(r.created&&c.env.OWNER_NOTIFICATION_EMAIL)try{await guestNotify(c.env,c.env.OWNER_NOTIFICATION_EMAIL,true,r.id);}catch{}
  return c.json({id:r.id,status:"new"},r.created?201:200);
 });
 app.get(root+"/list",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent access required."},403);
  const rows=await c.env.DB.prepare("SELECT r.id,r.subject,r.status,r.created_at,r.updated_at,p.learner_id,p.service FROM support_portal_enquiries p JOIN support_guest_requests r ON r.id=p.request_id WHERE p.family_id=? AND p.parent_user_id=? ORDER BY r.created_at DESC,r.id DESC LIMIT 100").bind(a.family_id,a.id).all();
  return c.json({requests:rows.results||[]});
 });
 app.get(root+"/detail/:id",g.auth,g.parent,async c=>{
  const a=c.get("user"),id=c.req.param("id");if(!id||!await ownsPortalEnquiry(c.env.DB,a,id))return c.json({detail:"Enquiry not found"},404);
  const row=await c.env.DB.prepare("SELECT r.id,r.subject,r.message,r.status,r.created_at,r.updated_at,p.learner_id,p.service FROM support_portal_enquiries p JOIN support_guest_requests r ON r.id=p.request_id WHERE r.id=? AND p.family_id=? AND p.parent_user_id=?").bind(id,a.family_id,a.id).first();
  if(!row)return c.json({detail:"Enquiry not found"},404);
  return c.json({...row,quotes:await guestQuotes(c.env.DB,id),messages:await guestMessages(c.env.DB,id)});
 });
}
