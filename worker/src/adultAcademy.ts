import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {hitRateLimit} from "./adminAudit";
import {loadPlatformSettings} from "./platformSettings";
import {ADULT_STUDIO} from "./writersAcademy";
import {academyPrice} from "./writersAcademyPricing";
import {adultPilotActor,adultPilotRounds,adultReservations,reserveAdultStudio,ADULT_TERMS,ADULT_TERMS_VERSION} from "./adultStudioReservations";
export const ADULT_ATTESTATION_VERSION="adult-self-v1";
export const ADULT_ATTESTATION="I confirm that I am aged 18 or over and registering for myself. I will not use this profile to enrol a child. I understand this is a self-declaration, not an age verification service.";
export async function adultParticipant(db:D1Database,a:AuthUser){
 if(!await verifiedPortalIdentity(db,a))return null;
 return db.prepare("SELECT display_name,age_attestation_version,attested_at FROM support_academy_adult_participants WHERE user_id=? AND family_id=?").bind(a.id,a.family_id).first<{display_name:string;age_attestation_version:string;attested_at:string}>();
}
export async function registerAdultParticipant(db:D1Database,a:AuthUser,b:any,now=new Date()){
 const identity=await verifiedPortalIdentity(db,a);
 if(!identity||b?.confirmed!==true||b?.attestation_version!==ADULT_ATTESTATION_VERSION)return {error:"Verify your account and confirm that you are registering yourself as an adult."};
 const name=typeof b.display_name==="string"?b.display_name.trim():"";
 if(!name||name.length>80||/[\r\n\u0000-\u001f]/.test(name)||b.learner_id!==undefined||b.user_id!==undefined||b.family_id!==undefined)return {error:"Enter your own preferred name. Do not select another participant."};
 const existing=await adultParticipant(db,a);
 if(existing)return existing.display_name===name?{participant:existing,created:false}:{error:"Your adult profile is already registered. Contact Side-Quest to correct the name."};
 const at=now.toISOString();
 try{await db.prepare("INSERT OR IGNORE INTO support_academy_adult_participants(user_id,family_id,display_name,age_attestation_version,attested_at,created_at) VALUES(?,?,?,?,?,?)").bind(a.id,a.family_id,name,ADULT_ATTESTATION_VERSION,at,at).run();}catch{return {error:"Adult registration could not be saved securely."};}
 const participant=await adultParticipant(db,a);
 return participant&&participant.display_name===name?{participant,created:true}:{error:"The participant profile changed. Reload your account."};
}
export function registerAdultAcademy(app:App,g:Guards){
 const root="/api/family-portal/adult-studio";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","private, no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/profile",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified account required."},403);
  return c.json({participant:await adultParticipant(c.env.DB,a),attestation:ADULT_ATTESTATION,attestation_version:ADULT_ATTESTATION_VERSION,registration_available:(await loadPlatformSettings(c.env.DB)).features.registrationsOpen,booking_available:await adultPilotActor(c.env,a)&&(await loadPlatformSettings(c.env.DB)).features.registrationsOpen,programme:{title:ADULT_STUDIO.title,description:ADULT_STUDIO.description,minutes:ADULT_STUDIO.minutes,sessions:ADULT_STUDIO.sessions.map(s=>({title:s.title,objective:s.objective})),quotes:{single:academyPrice(ADULT_STUDIO.id,"single"),weekly:academyPrice(ADULT_STUDIO.id,"weekly"),upfront:academyPrice(ADULT_STUDIO.id,"upfront")}}});
 });
 app.get(root+"/reservations",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await adultPilotActor(c.env,a)||!await adultParticipant(c.env.DB,a))return c.json({detail:"Verified adult test account required."},403);
  return c.json({rounds:await adultPilotRounds(c.env.DB),reservations:await adultReservations(c.env.DB,a),terms:ADULT_TERMS,terms_version:ADULT_TERMS_VERSION});
 });
 app.post(root+"/reserve",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await adultPilotActor(c.env,a))return c.json({detail:"Verified adult test account required."},403);
  if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"Reservations are paused."},503);
  if(!(await hitRateLimit(c.env.DB,"adult-studio-reserve:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
  const r=await reserveAdultStudio(c.env.DB,a,await c.req.json().catch(()=>null));
  return "error" in r?c.json({detail:r.error},409):c.json({...r,status:"provisional",payment_available:false},r.created?201:200);
 });
 app.post(root+"/register",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified account required."},403);
  if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"Registration is paused."},503);
  if(!(await hitRateLimit(c.env.DB,"academy-adult:"+a.id,10,3600)).ok)return c.json({detail:"Try again later."},429);
  const r=await registerAdultParticipant(c.env.DB,a,await c.req.json().catch(()=>null));
  return "error" in r?c.json({detail:r.error},409):c.json(r,r.created?201:200);
 });
}
