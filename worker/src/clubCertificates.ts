import type {Env} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
const idOk=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=150;
const eligible="c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?)";
export async function listClubCertificateCandidates(e:Env,now=new Date()){
 if(!unifiedPortalPilot(e))return null;
 const at=now.toISOString();
 const rows=(await e.DB.prepare(`SELECT c.kind,c.booking_id,c.learner_label,c.title,c.certificate_delivery,c.expected_count,c.seat_count,c.completed_count,c.last_end_at,(SELECT r.round_id FROM support_english_round_enrolments r WHERE c.kind='round' AND r.id=c.booking_id) round_id,
 x.id certificate_id,x.status certificate_status,x.approved_at,x.template_id,
 CASE WHEN ${eligible} THEN 1 ELSE 0 END eligible
 FROM support_club_certificate_candidates c LEFT JOIN support_club_certificates x ON x.kind=c.kind AND x.booking_id=c.booking_id
 ORDER BY CASE WHEN x.id IS NULL AND c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?) THEN 0 ELSE 1 END,c.last_end_at DESC,c.booking_id LIMIT 201`).bind(at,at).all<any>()).results||[];
 return {items:rows.slice(0,200).map(r=>({...r,eligibility:r.eligible?"eligible":!r.last_end_at||Date.parse(r.last_end_at)>now.getTime()?"awaiting_completion":"attendance_or_payment_review"})),limited:rows.length>200};
}
export async function approveClubCertificate(e:Env,kind:string,id:string,owner:string,b:any,now=new Date()){
 if(!unifiedPortalPilot(e)||!["single","round"].includes(kind)||!idOk(id)||!idOk(owner)||b?.confirmed!==true||!Number.isInteger(b.expected_count)||typeof b.learner_name!=="string"||b.learner_name.length<1||b.learner_name.length>80||/[\x00-\x1f\x7f]/.test(b.learner_name)||typeof b.title!=="string"||!["pdf","post","both"].includes(b.delivery)||typeof b.completed_at!=="string")return {error:"Review the exact learner name, workshop title, attendance and delivery preference."};
 const at=now.toISOString();
 await e.DB.prepare(`INSERT OR IGNORE INTO support_club_certificates(id,kind,booking_id,request_id,family_id,parent_user_id,learner_id,learner_name,title,session_count,delivery,completed_at,approved_by,approved_at,template_id)
 SELECT ?,c.kind,c.booking_id,c.request_id,c.family_id,c.parent_user_id,c.learner_id,c.learner_label,c.title,c.expected_count,c.certificate_delivery,c.last_end_at,?,?,(SELECT template_id FROM support_club_certificate_template_active WHERE singleton=1)
 FROM support_club_certificate_candidates c WHERE c.kind=? AND c.booking_id=? AND ${eligible}
 AND c.learner_label=? AND c.title=? AND c.expected_count=? AND c.certificate_delivery=? AND c.last_end_at=?`).bind(crypto.randomUUID(),owner,at,kind,id,at,b.learner_name,b.title,b.expected_count,b.delivery,b.completed_at).run();
 const saved=await e.DB.prepare("SELECT x.id FROM support_club_certificates x JOIN support_club_certificate_candidates c ON c.kind=x.kind AND c.booking_id=x.booking_id AND c.family_id=x.family_id AND c.parent_user_id=x.parent_user_id AND c.learner_id=x.learner_id WHERE x.kind=? AND x.booking_id=? AND x.status='approved' AND x.learner_name=? AND x.title=? AND x.session_count=? AND x.delivery=? AND x.completed_at=? AND c.learner_label=x.learner_name AND c.title=x.title AND c.expected_count=x.session_count AND c.certificate_delivery=x.delivery AND c.last_end_at=x.completed_at AND "+eligible).bind(kind,id,b.learner_name,b.title,b.expected_count,b.delivery,b.completed_at,at).first<any>();
 return saved?{approved:true,id:saved.id}:{error:"Completion, learner or booking changed, or approval was withdrawn. Review before issuing."};
}
export async function withdrawClubCertificate(e:Env,kind:string,id:string,b:any,now=new Date()){
 if(!unifiedPortalPilot(e)||!["single","round"].includes(kind)||!idOk(id)||!idOk(b?.certificate_id)||b.confirmed!==true)return false;
 const r=await e.DB.prepare("UPDATE support_club_certificates SET status='withdrawn',withdrawn_at=? WHERE kind=? AND booking_id=? AND id=? AND status='approved'").bind(now.toISOString(),kind,id,b.certificate_id).run();
 return !!r.meta?.changes;
}

/** A reviewed batch is restricted to one actual round, never just a matching title.
 * Each exact snapshot is independently revalidated at approval; a changed learner
 * is reported, not silently replaced or approved. No emails or files are issued here. */
export async function approveClubCertificateBatch(e:Env,owner:string,b:any,now=new Date()){
 if(!unifiedPortalPilot(e)||!idOk(owner)||b?.confirmed!==true||!idOk(b.round_id)||!Array.isArray(b.items)||b.items.length<1||b.items.length>8)return {error:"Review a selection of up to eight learners from one English Club round."};
 const ids=b.items.map((x:any)=>x?.booking_id);
 if(ids.some((id:unknown)=>!idOk(id))||new Set(ids).size!==ids.length)return {error:"Invalid or duplicate round enrolments."};
 const membership=await e.DB.prepare("SELECT id FROM support_english_round_enrolments WHERE round_id=? AND id IN ("+ids.map(()=>"?").join(",")+")").bind(b.round_id,...ids).all<{id:string}>();
 if((membership.results||[]).length!==ids.length)return {error:"One or more selected bookings do not belong to the reviewed round."};
 const items=[];
 for(const item of b.items){
  try{
   const r=await approveClubCertificate(e,"round",item.booking_id,owner,{...item,confirmed:true},now);
   items.push("error" in r?{booking_id:item.booking_id,approved:false,detail:r.error}:{booking_id:item.booking_id,approved:true,id:r.id});
  }catch{items.push({booking_id:item.booking_id,approved:false,detail:"Approval requires review."});}
 }
 return {items,approved:items.filter(x=>x.approved).length,review:items.filter(x=>!x.approved).length};
}
