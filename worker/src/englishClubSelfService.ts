import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {loadPlatformSettings} from "./platformSettings";
import {hitRateLimit} from "./adminAudit";
export const CLUB_BOOKING_VERSION="club-staging-v1";
const idOk=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
export async function publishedClubClasses(db:D1Database,now=new Date()){
 return (await db.prepare(`SELECT c.id,c.topic,c.start_at,c.end_at,8-(SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled') places_remaining FROM support_english_classes c JOIN support_english_publications p ON p.class_id=c.id AND p.enabled=1 WHERE julianday(c.start_at)>julianday(?)+1 AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8 ORDER BY c.start_at LIMIT 30`).bind(now.toISOString()).all()).results||[];
}
export async function publishClubClass(db:D1Database,id:string,owner:string,b:any,now=new Date()){
 if(b?.confirmed!==true||typeof b.enabled!=="boolean")return false;
 const r=await db.prepare(`INSERT INTO support_english_publications(class_id,enabled,approved_by,updated_at) SELECT id,?,?,? FROM support_english_classes WHERE id=? AND (?=0 OR julianday(start_at)>julianday(?)+1) ON CONFLICT(class_id) DO UPDATE SET enabled=excluded.enabled,approved_by=excluded.approved_by,updated_at=excluded.updated_at`).bind(b.enabled?1:0,owner,now.toISOString(),id,b.enabled?1:0,now.toISOString()).run();
 return !!r.meta?.changes;
}
export async function reserveClubSeat(db:D1Database,a:AuthUser,b:any,now=new Date()){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||!b||!idOk(b.learner_id)||!idOk(b.class_id)||!idOk(b.request_key)||b.amount_cents!==1200||b.terms_version!==CLUB_BOOKING_VERSION||b.confirmed!==true||b.age_confirmed!==true||b.supervision_confirmed!==true)return {error:"Review the session price, age range and group supervision requirements."};
 const learner=await db.prepare("SELECT p.id,COALESCE(s.name,p.label) label,COALESCE(s.year_level,p.year_level) year_level FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.id=? AND p.family_id=? AND (p.parent_user_id=? OR s.id IS NOT NULL)").bind(b.learner_id,a.family_id,a.id).first<{id:string;label:string;year_level:string}>();
 if(!learner)return {error:"Choose your own learner."};
 const digest="club:"+b.class_id+":"+learner.id+":"+CLUB_BOOKING_VERSION;
 const find=()=>db.prepare("SELECT p.request_id,p.payload_hash,e.id seat_id FROM support_portal_enquiries p LEFT JOIN support_english_enrolments e ON e.request_id=p.request_id WHERE p.parent_user_id=? AND p.family_id=? AND p.request_key=?").bind(a.id,a.family_id,b.request_key).first<any>();
 const existing=await find();
 if(existing)return existing.payload_hash===digest&&existing.seat_id?{id:existing.request_id,seat_id:existing.seat_id,created:false}:{error:"This booking key is already used."};
 const id=crypto.randomUUID(),seat=crypto.randomUUID(),at=now.toISOString();
 try{
 await db.batch([
 db.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,identity.email,identity.name,"English Club: "+(learner.year_level||"Mixed age group"),"Learner: "+learner.label+"\nSelf-service club reservation. Parent confirmed age range 8–16 and adult supervision. AU$12 per session; place provisional until verified payment.",at,at),
 db.prepare("INSERT INTO support_portal_enquiries(request_id,family_id,parent_user_id,learner_id,service,request_key,payload_hash,created_at) VALUES(?,?,?,?,'english-club',?,?,?)").bind(id,a.family_id,a.id,learner.id,b.request_key,digest,at),
 // A missing/full/closed class returns NULL for a NOT NULL column: the entire batch rolls back.
 db.prepare(`INSERT INTO support_english_enrolments(id,class_id,request_id,learner_label,payment_due_at,created_at) VALUES(?,(SELECT c.id FROM support_english_classes c JOIN support_english_publications p ON p.class_id=c.id AND p.enabled=1 WHERE c.id=? AND julianday(c.start_at)>julianday(?)+1 AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8),?,?,(SELECT strftime('%Y-%m-%dT%H:%M:%fZ',julianday(start_at)-1) FROM support_english_classes WHERE id=?),?)`).bind(seat,b.class_id,at,id,learner.label.slice(0,80),b.class_id,at),
 db.prepare("INSERT INTO support_english_booking_receipts(enrolment_id,parent_user_id,learner_id,terms_version,amount_cents,accepted_at) VALUES(?,?,?,?,1200,?)").bind(seat,a.id,learner.id,CLUB_BOOKING_VERSION,at)
 ]);
 }catch{const retry=await find();if(retry?.payload_hash===digest&&retry.seat_id)return {id:retry.request_id,seat_id:retry.seat_id,created:false};return {error:"This class is full, unavailable, or the learner already has a place. No new reservation was made."};}
 return {id,seat_id:seat,created:true};
}
export function registerEnglishClubSelfService(app:App,g:Guards){
 const root="/api/family-portal/club";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/classes",g.auth,g.parent,async c=>{if(!await verifiedPortalIdentity(c.env.DB,c.get("user")))return c.json({detail:"Verified parent required."},403);return c.json({classes:await publishedClubClasses(c.env.DB),price_cents:1200,terms_version:CLUB_BOOKING_VERSION});});
 app.post(root+"/reserve",g.auth,g.parent,async c=>{
 const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent required."},403);
 if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"New bookings are paused."},503);
 if(!(await hitRateLimit(c.env.DB,"club-self:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
 const r=await reserveClubSeat(c.env.DB,a,await c.req.json().catch(()=>null));return "error" in r?c.json({detail:r.error},409):c.json(r,r.created?201:200);
 });
}
