import type {App,AuthUser,Guards} from "./types";
import {newId,nowIso} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {parseLearningSupport} from "./learningSupport";
import {ENGLISH_CLUB_PREFIX,ENGLISH_CLUB_SERVICE} from "./englishClub";
import {guestNotify,guestQuotes,guestMessages} from "./guestSupport";
import {hitRateLimit} from "./adminAudit";
import {loadPlatformSettings} from "./platformSettings";
import {ownsPortalEnquiry} from "./unifiedPortalRequestAccess";
const idOk=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
export async function submitPortalEnquiry(db:D1Database,a:AuthUser,b:any){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||!b||!idOk(b.learner_id)||!idOk(b.request_key)||!["tutoring","english-club"].includes(b.kind))return {error:"Select a learner and service."};
 const club=b.kind==="english-club";
 const parsed=parseLearningSupport(club?{...b,subject:"English",service:"Live online support"}:b);
 if("error" in parsed)return {error:parsed.error};
 const learner=await db.prepare("SELECT p.id,COALESCE(s.name,p.label) label FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.id=? AND p.family_id=? AND (p.parent_user_id=? OR s.id IS NOT NULL)").bind(b.learner_id,a.family_id,a.id).first<{id:string;label:string}>();
 if(!learner)return {error:"Select a learner belonging to your account."};
 const subject=club?ENGLISH_CLUB_PREFIX+b.year:parsed.subject;
 const details=club?parsed.message.replace("Preferred support: Live online support","Preferred support: "+ENGLISH_CLUB_SERVICE):parsed.message;
 const message="Learner: "+learner.label+"\n"+details;
 const digest=await hash(JSON.stringify([learner.id,b.kind,subject,details]));
 const find=()=>db.prepare("SELECT request_id,payload_hash FROM support_portal_enquiries WHERE family_id=? AND parent_user_id=? AND request_key=?").bind(a.family_id,a.id,b.request_key).first<{request_id:string;payload_hash:string}>();
 const prior=await find();
 if(prior)return prior.payload_hash===digest?{id:prior.request_id,created:false}:{error:"This submission key was already used. Start a new enquiry."};
 const id=newId(),now=nowIso();
 // D1 batch is atomic: neither an unowned request nor a duplicate mapping can survive a failed write.
 try{await db.batch([
 db.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,identity.email,identity.name,subject,message,now,now),
 db.prepare("INSERT INTO support_portal_enquiries(request_id,family_id,parent_user_id,learner_id,service,request_key,payload_hash,created_at) VALUES(?,?,?,?,?,?,?,?)").bind(id,a.family_id,a.id,learner.id,b.kind,b.request_key,digest,now)
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
  const r=await submitPortalEnquiry(c.env.DB,a,await c.req.json().catch(()=>null));
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
  const a=c.get("user"),id=c.req.param("id");if(!await ownsPortalEnquiry(c.env.DB,a,id))return c.json({detail:"Enquiry not found"},404);
  const row=await c.env.DB.prepare("SELECT r.id,r.subject,r.message,r.status,r.created_at,r.updated_at,p.learner_id,p.service FROM support_portal_enquiries p JOIN support_guest_requests r ON r.id=p.request_id WHERE r.id=? AND p.family_id=? AND p.parent_user_id=?").bind(id,a.family_id,a.id).first();
  if(!row)return c.json({detail:"Enquiry not found"},404);
  return c.json({...row,quotes:await guestQuotes(c.env.DB,id),messages:await guestMessages(c.env.DB,id)});
 });
}
