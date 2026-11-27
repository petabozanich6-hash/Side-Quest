import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {loadPlatformSettings} from "./platformSettings";
import {hitRateLimit} from "./adminAudit";
import {academyPrice,ACADEMY_PRICE_VERSION} from "./writersAcademyPricing";
import {creativeCamp} from "./englishClubCreativeCamps";
import {listEnglishRounds,ROUND_PRICE_CENTS} from "./englishClubRounds";

export const CLUB_BOOKING_VERSION="club-round-staging-v1";
export const CLUB_ROUND_TERMS="I am the authorised parent or guardian. My learner is aged 8–16 and can participate in a supervised small online group. I will remain available to assist. This is supplementary educational support, not therapy or formal schooling. I have reviewed the round dates and selected payment arrangement. Each class is provisional until its payment is verified. A missed payment does not forfeit separately paid classes. No automatic renewal, cancellation fee or certificate charge applies. I will contact Side-Quest regarding changes, illness, cancellations or refunds. Sessions must not be recorded without appropriate consent. Consumer rights are unaffected.";
const idOk=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
// Historical standalone classes remain private; new individual places use published rounds.
export async function reserveEnglishRound(db:D1Database,a:AuthUser,b:any,now=new Date()){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||!b||!idOk(b.learner_id)||!idOk(b.round_id)||!idOk(b.request_key)||!["weekly","upfront"].includes(b.payment_mode)||!["pdf","post","both"].includes(b.certificate_delivery)||b.terms_version!==CLUB_BOOKING_VERSION||b.confirmed!==true)return {error:"Review the round, payment arrangement and group terms."};
 const learner=await db.prepare("SELECT p.id,COALESCE(s.name,p.label) label,COALESCE(s.year_level,p.year_level) year_level FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.id=? AND p.family_id=? AND (p.parent_user_id=? OR s.id IS NOT NULL)").bind(b.learner_id,a.family_id,a.id).first<{id:string;label:string;year_level:string}>();
 if(!learner)return {error:"Choose your own learner."};
 const digest=JSON.stringify([b.round_id,learner.id,b.payment_mode,b.expected_total_cents,b.certificate_delivery,CLUB_BOOKING_VERSION]);
 const find=()=>db.prepare("SELECT p.request_id,p.payload_hash,e.id enrolment_id FROM support_portal_enquiries p LEFT JOIN support_english_round_enrolments e ON e.request_id=p.request_id WHERE p.parent_user_id=? AND p.family_id=? AND p.request_key=?").bind(a.id,a.family_id,b.request_key).first<any>();
 const prior=await find();
 if(prior)return prior.payload_hash===digest&&prior.enrolment_id?{id:prior.request_id,enrolment_id:prior.enrolment_id,created:false}:{error:"This booking key is already used."};
 const round=(await listEnglishRounds(db,true,now)).find(r=>r.id===b.round_id);
 const quote=round?.price_version===ACADEMY_PRICE_VERSION?academyPrice(round.programme_id,b.payment_mode):null;
 const total=quote?.total_cents??round?.price_cents;
 if(!round||round.price_version===ACADEMY_PRICE_VERSION&&(!quote||quote.audience!=="minor"||quote.session_cents!==round.price_per_session_cents||quote.session_count!==round.session_count||total!==(b.payment_mode==="weekly"?round.weekly_total_cents:round.price_cents))||!quote&&round.price_per_session_cents!==ROUND_PRICE_CENTS||b.expected_total_cents!==total)return {error:"The round is unavailable or its price changed."};
 const id=crypto.randomUUID(),enrolment=crypto.randomUUID(),at=now.toISOString();
 const snapshot=JSON.stringify({terms:CLUB_ROUND_TERMS,title:round.title,classes:round.classes,price_per_session_cents:round.price_per_session_cents,total_cents:total,...(quote?{academy_price:quote}:{}),payment_mode:b.payment_mode,certificate_delivery:b.certificate_delivery});
 const stmts=[
 db.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,identity.email,identity.name,"English Club: "+round.title,"Learner: "+learner.label+"\nRound reservation: "+round.title+"\n"+round.session_count+" sessions · AU$"+(total/100)+" total · Certificate included. Payment must be verified before class access.",at,at),
 db.prepare("INSERT INTO support_portal_enquiries(request_id,family_id,parent_user_id,learner_id,service,request_key,payload_hash,created_at) VALUES(?,?,?,?,'english-club',?,?,?)").bind(id,a.family_id,a.id,learner.id,b.request_key,digest,at),
 db.prepare("INSERT INTO support_english_round_enrolments(id,round_id,request_id,learner_id,payment_mode,total_cents,terms_version,terms_snapshot,certificate_delivery,created_at) VALUES(?,(SELECT id FROM support_english_rounds WHERE id=? AND published=1 AND session_count=? AND price_per_session_cents=? AND price_version=? AND COALESCE(upfront_cents,session_count*price_per_session_cents)=?),?,?,?,?,?,?,?,?)").bind(enrolment,round.id,round.session_count,round.price_per_session_cents,round.price_version,round.price_cents,id,learner.id,b.payment_mode,total,CLUB_BOOKING_VERSION,snapshot,b.certificate_delivery,at)
 ];
 for(const c of round.classes){
 const due=new Date(Date.parse(c.start_at)-86400000).toISOString();
 stmts.push(db.prepare("INSERT INTO support_english_enrolments(id,class_id,request_id,learner_label,payment_due_at,created_at) VALUES(?,(SELECT c.id FROM support_english_classes c JOIN support_english_round_classes x ON x.class_id=c.id WHERE c.id=? AND x.round_id=? AND x.sequence=? AND c.start_at=? AND c.end_at=? AND c.topic=? AND julianday(c.start_at)>julianday(?)+1 AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8),?,?,?,?)").bind(crypto.randomUUID(),c.id,round.id,c.sequence,c.start_at,c.end_at,c.topic,at,id,learner.label.slice(0,80),due,at));
 if(b.payment_mode==="weekly"||c.sequence===1)stmts.push(db.prepare("INSERT INTO support_english_round_payments(id,round_enrolment_id,sequence,amount_cents,due_at) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),enrolment,b.payment_mode==="weekly"?c.sequence:0,b.payment_mode==="weekly"?round.price_per_session_cents:total,due));
 }
 try{await db.batch(stmts);return {id,enrolment_id:enrolment,created:true};}catch{const retry=await find();if(retry?.payload_hash===digest&&retry.enrolment_id)return {id:retry.request_id,enrolment_id:retry.enrolment_id,created:false};return {error:"The round is full, unavailable or the learner is already enrolled. No partial booking was made."};}
}
export const CLUB_SINGLE_VERSION="club-single-staging-v1";
export const CLUB_SINGLE_TERMS=CLUB_ROUND_TERMS.replace("the round dates and selected payment arrangement","the selected workshop date and AU$15 single-session price");
export const ACADEMY_SINGLE_TERMS=CLUB_SINGLE_TERMS.replace("AU$15 single-session price","displayed single-session price");
const singleListSql=`SELECT c.id,c.topic,c.public_description description,c.start_at,c.end_at,r.id round_id,r.title round_title,r.curriculum_id,r.price_version,x.sequence,r.price_per_session_cents amount_cents,
 8-(SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled') remaining
 FROM support_english_round_classes x JOIN support_english_rounds r ON r.id=x.round_id JOIN support_english_classes c ON c.id=x.class_id
 WHERE r.published=1 AND julianday(c.start_at)>julianday(?)+1
 AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8`;
export async function listEnglishSingleClasses(db:D1Database,now=new Date()){
 return (await db.prepare(singleListSql+" ORDER BY c.start_at,c.id LIMIT 100").bind(now.toISOString()).all<any>()).results||[];
}
export async function reserveEnglishSingle(db:D1Database,a:AuthUser,b:any,now=new Date()){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||!b||!idOk(b.learner_id)||!idOk(b.class_id)||!idOk(b.request_key)||!Number.isSafeInteger(b.expected_total_cents)||!["pdf","post","both"].includes(b.certificate_delivery)||b.terms_version!==CLUB_SINGLE_VERSION||b.confirmed!==true)return {error:"Review the workshop price and group terms."};
 const learner=await db.prepare("SELECT p.id,COALESCE(s.name,p.label) label FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.id=? AND p.family_id=? AND (p.parent_user_id=? OR s.id IS NOT NULL)").bind(b.learner_id,a.family_id,a.id).first<{id:string;label:string}>();
 if(!learner)return {error:"Choose your own learner."};
 const digest=JSON.stringify(["single",b.class_id,learner.id,b.expected_total_cents,b.certificate_delivery,CLUB_SINGLE_VERSION]);
 const find=()=>db.prepare("SELECT p.request_id,p.payload_hash,s.id booking_id FROM support_portal_enquiries p LEFT JOIN support_english_single_bookings s ON s.request_id=p.request_id WHERE p.parent_user_id=? AND p.family_id=? AND p.request_key=?").bind(a.id,a.family_id,b.request_key).first<any>();
 const prior=await find();
 if(prior)return prior.payload_hash===digest&&prior.booking_id?{id:prior.request_id,booking_id:prior.booking_id,created:false}:{error:"This booking key is already used."};
 const at=now.toISOString(),c=await db.prepare(singleListSql+" AND c.id=?").bind(at,b.class_id).first<any>();
 const quote=c?.price_version===ACADEMY_PRICE_VERSION?academyPrice(c.curriculum_id,"single"):null;
 if(!c||c.amount_cents!==b.expected_total_cents||c.price_version===ACADEMY_PRICE_VERSION&&(!quote||quote.audience!=="minor"||quote.total_cents!==c.amount_cents)||!quote&&c.amount_cents!==ROUND_PRICE_CENTS)return {error:"This workshop is full, unavailable or its price changed."};
 const id=crypto.randomUUID(),seat=crypto.randomUUID(),booking=crypto.randomUUID(),due=new Date(Date.parse(c.start_at)-86400000).toISOString();
 const snapshot=JSON.stringify({terms:quote?ACADEMY_SINGLE_TERMS:CLUB_SINGLE_TERMS,round_title:c.round_title,class_id:c.id,topic:c.topic,start_at:c.start_at,end_at:c.end_at,amount_cents:c.amount_cents,...(quote?{academy_price:quote}:{}),certificate_delivery:b.certificate_delivery});
 try{
 await db.batch([
 db.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,identity.email,identity.name,"English Club: "+c.topic,"Learner: "+learner.label+"\nSingle workshop · AU$"+(c.amount_cents/100)+". Payment must be verified before class access.",at,at),
 db.prepare("INSERT INTO support_portal_enquiries(request_id,family_id,parent_user_id,learner_id,service,request_key,payload_hash,created_at) VALUES(?,?,?,?,'english-club',?,?,?)").bind(id,a.family_id,a.id,learner.id,b.request_key,digest,at),
 db.prepare("INSERT INTO support_english_enrolments(id,class_id,request_id,learner_label,payment_due_at,created_at) VALUES(?,(SELECT c.id FROM support_english_classes c JOIN support_english_round_classes x ON x.class_id=c.id JOIN support_english_rounds r ON r.id=x.round_id WHERE c.id=? AND r.id=? AND r.published=1 AND r.price_per_session_cents=? AND r.price_version=? AND c.start_at=? AND c.end_at=? AND c.topic=? AND r.title=? AND julianday(c.start_at)>julianday(?)+1 AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8),?,?,?,?)").bind(seat,c.id,c.round_id,c.amount_cents,c.price_version,c.start_at,c.end_at,c.topic,c.round_title,at,id,learner.label.slice(0,80),due,at),
 db.prepare("INSERT INTO support_english_single_bookings(id,enrolment_id,request_id,learner_id,amount_cents,due_at,terms_version,terms_snapshot,certificate_delivery,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)").bind(booking,seat,id,learner.id,c.amount_cents,due,CLUB_SINGLE_VERSION,snapshot,b.certificate_delivery,at)
 ]);
 return {id,booking_id:booking,created:true};
 }catch{const retry=await find();if(retry?.payload_hash===digest&&retry.booking_id)return {id:retry.request_id,booking_id:retry.booking_id,created:false};return {error:"The workshop is full, unavailable or the learner already has a place. No partial booking was made."};}
}
export function registerEnglishClubSelfService(app:App,g:Guards){
 const root="/api/family-portal/club";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/rounds",g.auth,g.parent,async c=>{if(!await verifiedPortalIdentity(c.env.DB,c.get("user")))return c.json({detail:"Verified parent required."},403);return c.json({rounds:(await listEnglishRounds(c.env.DB,true)).filter(r=>r.age_group),terms_version:CLUB_BOOKING_VERSION,terms:CLUB_ROUND_TERMS});});
 app.post(root+"/reserve-round",g.auth,g.parent,async c=>{
 const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent required."},403);
 if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"New bookings are paused."},503);
 if(!(await hitRateLimit(c.env.DB,"club-self:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
 const b=await c.req.json().catch(()=>null);const selected=typeof b?.round_id==="string"?await c.env.DB.prepare("SELECT curriculum_id FROM support_english_rounds WHERE id=?").bind(b.round_id).first<{curriculum_id:string}>():null;if(!creativeCamp(selected?.curriculum_id))return c.json({detail:"Choose an available creative camp."},409);
 const r=await reserveEnglishRound(c.env.DB,a,b);return "error" in r?c.json({detail:r.error},409):c.json(r,r.created?201:200);
 });
 app.get(root+"/classes",g.auth,g.parent,async c=>{if(!await verifiedPortalIdentity(c.env.DB,c.get("user")))return c.json({detail:"Verified parent required."},403);return c.json({classes:(await listEnglishSingleClasses(c.env.DB)).filter(r=>creativeCamp(r.curriculum_id)),terms_version:CLUB_SINGLE_VERSION,terms:ACADEMY_SINGLE_TERMS});});
 app.post(root+"/reserve-class",g.auth,g.parent,async c=>{
 const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent required."},403);
 if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"New bookings are paused."},503);
 if(!(await hitRateLimit(c.env.DB,"club-self:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
 const b=await c.req.json().catch(()=>null);const selected=typeof b?.class_id==="string"?await c.env.DB.prepare("SELECT r.curriculum_id FROM support_english_round_classes x JOIN support_english_rounds r ON r.id=x.round_id WHERE x.class_id=?").bind(b.class_id).first<{curriculum_id:string}>():null;if(!creativeCamp(selected?.curriculum_id))return c.json({detail:"Choose an available creative camp session."},409);
 const r=await reserveEnglishSingle(c.env.DB,a,b);return "error" in r?c.json({detail:r.error},409):c.json(r,r.created?201:200);
 });

}
