import type {Env} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {isPlatformOwner} from "./access";
import {loadSignedTemplate,buildSignedClubCertificate} from "./clubSignedCertificate";
import {stationeryBase64} from "./supportStationery";
const valid=(v:unknown)=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,150}$/.test(v);
export async function previewClubCertificate(e:Env,owner:string,kind:string,id:string,now=new Date()){
 if(!unifiedPortalPilot(e)||!await isPlatformOwner(e.DB,owner)||!["single","round"].includes(kind)||!valid(id))return null;
 const get=()=>e.DB.prepare(`SELECT c.learner_label learner_name,c.title,c.expected_count session_count,c.last_end_at completed_at,c.kind,c.certificate_delivery delivery,a.template_id
 FROM support_club_certificate_candidates c CROSS JOIN support_club_certificate_template_active a
 WHERE a.singleton=1 AND c.kind=? AND c.booking_id=? AND c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?)
 AND NOT EXISTS(SELECT 1 FROM support_club_certificates x WHERE x.kind=c.kind AND x.booking_id=c.booking_id)`).bind(kind,id,now.toISOString()).first<any>();
 const row=await get();if(!row)return null;
 try{
  const art=await loadSignedTemplate(e,row.template_id);if(!art)return null;
  const doc=buildSignedClubCertificate({...row,id:"preview"},art,true);
  if(JSON.stringify(await get())!==JSON.stringify(row))return null;
  return {filename:doc.filename,mime:"application/pdf",base64:stationeryBase64(doc.pdf),template_id:row.template_id,learner_name:row.learner_name,title:row.title,session_count:row.session_count,completed_at:row.completed_at,delivery:row.delivery};
 }catch{return null;}
}
