import type {App,AuthUser,Env,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {signedCertificateExport} from "./clubSignedCertificate";
const validId=(v:unknown):v is string=>typeof v==="string"&&/^[a-zA-Z0-9_-]{1,150}$/.test(v);
// Revalidate the immutable approved snapshot against current completion and identity before every export.
const scope=`SELECT x.* FROM support_club_certificates x JOIN support_club_certificate_candidates c
 ON c.kind=x.kind AND c.booking_id=x.booking_id AND c.request_id=x.request_id AND c.family_id=x.family_id
 AND c.parent_user_id=x.parent_user_id AND c.learner_id=x.learner_id AND c.learner_label=x.learner_name
 AND c.title=x.title AND c.expected_count=x.session_count AND c.certificate_delivery=x.delivery AND c.last_end_at=x.completed_at
 WHERE x.status='approved' AND c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?)`;
export async function approvedClubCertificate(e:Env,id:string,now=new Date()){
 if(!unifiedPortalPilot(e)||!validId(id))return null;
 return e.DB.prepare(scope+" AND x.id=?").bind(now.toISOString(),id).first<any>();
}
export async function ownerClubCertificatePdf(e:Env,id:string,now=new Date()){
 const row=await approvedClubCertificate(e,id,now);if(!row)return null;
 try{return await signedCertificateExport(e,row);}
 catch{return {error:"Certificate name or workshop title requires review before PDF export."};}
}
export async function listFamilyClubCertificates(e:Env,a:AuthUser,now=new Date()){
 if(!unifiedPortalPilot(e)||!await verifiedPortalIdentity(e.DB,a))return null;
 const rows=(await e.DB.prepare(scope+" AND x.family_id=? AND x.parent_user_id=? ORDER BY x.completed_at DESC,x.id LIMIT 101").bind(now.toISOString(),a.family_id,a.id).all<any>()).results||[];
 return {items:rows.slice(0,100).map(r=>({id:r.id,learner_name:r.learner_name,title:r.title,session_count:r.session_count,completed_at:r.completed_at,delivery:r.delivery,pdf_available:!!r.template_id&&r.delivery!=="post",template_ready:!!r.template_id})),limited:rows.length>100};
}
export async function familyClubCertificatePdf(e:Env,a:AuthUser,id:string,now=new Date()){
 if(!unifiedPortalPilot(e)||!validId(id)||!await verifiedPortalIdentity(e.DB,a))return null;
 const row=await e.DB.prepare(scope+" AND x.id=? AND x.family_id=? AND x.parent_user_id=? AND x.delivery IN ('pdf','both')").bind(now.toISOString(),id,a.family_id,a.id).first<any>();
 if(!row)return null;
 try{return await signedCertificateExport(e,row);}
 catch{return {error:"This certificate needs review before PDF export."};}
}
export function registerFamilyClubCertificates(app:App,g:Guards){
 app.get("/api/family-portal/certificates",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const r=await listFamilyClubCertificates(c.env,c.get("user"));return r?c.json(r):c.json({detail:"Not found"},404);
 });
 app.get("/api/family-portal/certificates/:id/pdf",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const r=await familyClubCertificatePdf(c.env,c.get("user"),c.req.param("id")||"");
  return !r?c.json({detail:"Certificate unavailable"},404):"error" in r?c.json({detail:r.error},409):c.json(r);
 });
}
