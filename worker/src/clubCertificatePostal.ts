import type {App,AuthUser,Env,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {isPlatformOwner} from "./access";
import {approvedClubCertificateScope} from "./clubCertificateDelivery";
import {loadSignedTemplate,buildSignedClubCertificate} from "./clubSignedCertificate";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,80}$/.test(v);
const scope=approvedClubCertificateScope+" AND x.template_id IS NOT NULL AND x.delivery IN ('post','both')";
const states=["NSW","VIC","QLD","SA","WA","TAS","NT","ACT"];
function field(v:unknown,max:number,required=true){return typeof v==="string"&&v.trim().length<=max&&(!required||v.trim().length>0)&&!/[\x00-\x1f\x7f]/.test(v)?v.trim():null;}
export function validateCertificateAddress(b:any){
 const recipient=field(b?.recipient,100),line1=field(b?.line1,120),line2=field(b?.line2??"",120,false),suburb=field(b?.suburb,80),state=b?.state,postcode=b?.postcode;
 if(!recipient||!line1||line2===null||!suburb||!states.includes(state)||typeof postcode!=="string"||!/^[0-9]{4}$/.test(postcode)||b?.country!=="Australia")return null;
 return {recipient,line1,line2,suburb,state,postcode,country:"Australia"};
}
async function parentAllowed(e:Env,a:AuthUser){return unifiedPortalPilot(e)&&!!await verifiedPortalIdentity(e.DB,a);}
async function owned(e:Env,a:AuthUser,id:string,now:Date){
 return e.DB.prepare(scope+" AND x.id=? AND x.family_id=? AND x.parent_user_id=?").bind(now.toISOString(),id,a.family_id,a.id).first<any>();
}
export async function familyPostalCertificate(e:Env,a:AuthUser,id:string,now=new Date()){
 if(!idOk(id)||!await parentAllowed(e,a)||!await owned(e,a,id,now))return null;
 const r=await e.DB.prepare("SELECT status,address_json,revision,posted_at FROM support_club_certificate_postal WHERE certificate_id=?").bind(id).first<any>();
 return {status:r?.status||"address_required",revision:r?.revision||0,address:r?.address_json?JSON.parse(r.address_json):null,posted_at:r?.posted_at||null};
}
export async function saveFamilyPostalAddress(e:Env,a:AuthUser,id:string,b:any,now=new Date()){
 if(!idOk(id)||!await parentAllowed(e,a)||b?.confirmed!==true||!Number.isSafeInteger(b.revision)||b.revision<0)return false;
 const address=validateCertificateAddress(b.address);if(!address)return false;
 const at=now.toISOString(),json=JSON.stringify(address);
 const guard="SELECT x.id FROM ("+scope+") x WHERE x.id=? AND x.family_id=? AND x.parent_user_id=?";
 const r=b.revision===0?await e.DB.prepare("INSERT OR IGNORE INTO support_club_certificate_postal(certificate_id,status,address_json,confirmed_at,updated_at) SELECT id,'ready',?,?,? FROM ("+guard+")").bind(json,at,at,at,id,a.family_id,a.id).run():
 await e.DB.prepare("UPDATE support_club_certificate_postal SET status='ready',address_json=?,confirmed_at=?,updated_at=?,printed_at=NULL,revision=revision+1 WHERE certificate_id=? AND revision=? AND status IN ('ready','printed') AND certificate_id IN ("+guard+")").bind(json,at,at,id,b.revision,at,id,a.family_id,a.id).run();
 return !!r.meta?.changes;
}
export async function listPostalCertificates(e:Env,owner:string,now=new Date()){
 if(!unifiedPortalPilot(e)||!await isPlatformOwner(e.DB,owner))return null;
 const rows=(await e.DB.prepare("SELECT x.id,x.learner_name,x.title,x.delivery,x.completed_at,COALESCE(p.status,'address_required') status,p.revision,p.posted_at FROM ("+scope+") x LEFT JOIN support_club_certificate_postal p ON p.certificate_id=x.id ORDER BY CASE COALESCE(p.status,'address_required') WHEN 'ready' THEN 0 WHEN 'printed' THEN 1 WHEN 'address_required' THEN 2 ELSE 3 END,x.completed_at DESC,x.id LIMIT 201").bind(now.toISOString()).all<any>()).results||[];
 return {items:rows.slice(0,200),limited:rows.length>200};
}
export async function ownerPostalCertificate(e:Env,owner:string,id:string,now=new Date()){
 if(!unifiedPortalPilot(e)||!idOk(id)||!await isPlatformOwner(e.DB,owner))return null;
 const x=await e.DB.prepare(scope+" AND x.id=?").bind(now.toISOString(),id).first<any>();if(!x)return null;
 const r=await e.DB.prepare("SELECT status,address_json,revision,printed_at,posted_at FROM support_club_certificate_postal WHERE certificate_id=?").bind(id).first<any>();
 return {id:x.id,learner_name:x.learner_name,title:x.title,status:r?.status||"address_required",revision:r?.revision||0,address:r?.address_json?JSON.parse(r.address_json):null,printed_at:r?.printed_at||null,posted_at:r?.posted_at||null};
}
export async function advancePostalCertificate(e:Env,owner:string,id:string,b:any,now=new Date()){
 if(!unifiedPortalPilot(e)||!idOk(id)||!await isPlatformOwner(e.DB,owner)||b?.confirmed!==true||!Number.isSafeInteger(b.revision)||b.revision<1||!["printed","posted"].includes(b.action))return false;
 const at=now.toISOString();
 // Confirm the pinned PDF remains renderable before recording physical fulfilment.
 const x=await e.DB.prepare(scope+" AND x.id=?").bind(at,id).first<any>();if(!x)return false;
 try{const art=await loadSignedTemplate(e,x.template_id);if(!art)return false;buildSignedClubCertificate(x,art);}catch{return false;}
 const guard=" AND certificate_id IN (SELECT id FROM ("+scope+") WHERE id=? AND template_id=?)";
 const r=b.action==="printed"?await e.DB.prepare("UPDATE support_club_certificate_postal SET status='printed',printed_at=?,updated_at=?,revision=revision+1 WHERE certificate_id=? AND revision=? AND status='ready'"+guard).bind(at,at,id,b.revision,at,id,x.template_id).run():
 await e.DB.prepare("UPDATE support_club_certificate_postal SET status='posted',posted_at=?,posted_by=?,updated_at=?,address_json=NULL,revision=revision+1 WHERE certificate_id=? AND revision=? AND status='printed'"+guard).bind(at,owner,at,id,b.revision,at,id,x.template_id).run();
 return !!r.meta?.changes;
}
export function registerFamilyClubPostal(app:App,g:Guards){
 app.get("/api/family-portal/certificates/:id/postal",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const r=await familyPostalCertificate(c.env,c.get("user"),c.req.param("id")||"");
  return r?c.json(r):c.json({detail:"Postal certificate unavailable"},404);
 });
 app.post("/api/family-portal/certificates/:id/postal",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const b=await c.req.json().catch(()=>null);
  return await saveFamilyPostalAddress(c.env,c.get("user"),c.req.param("id")||"",b)?c.json({saved:true}):c.json({detail:"Address or certificate changed. Refresh and confirm your Australian postal address."},409);
 });
}
