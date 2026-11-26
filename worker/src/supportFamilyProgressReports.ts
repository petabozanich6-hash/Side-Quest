import type {App,AuthUser,Guards} from "./types";
import {verifiedPortalIdentity,unifiedPortalPilot} from "./unifiedPortalIdentity";
type Kind="tutoring"|"club";
const valid=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
function scope(kind:Kind){
 const source=kind==="tutoring"?"support_service_orders o JOIN support_portal_enquiries p ON p.request_id=o.request_id WHERE o.channel='guest' AND o.id=? AND o.id=? AND o.mode='live' AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND julianday(o.end_at)<=julianday(?)":"support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id JOIN support_portal_enquiries p ON p.request_id=e.request_id WHERE c.id=? AND e.id=? AND e.status='paid' AND julianday(c.end_at)<=julianday(?)";
 return "SELECT p.request_id,p.family_id,p.parent_user_id,p.learner_id FROM "+source+" AND p.learner_id IS NOT NULL";
}
export async function readProgressReport(db:D1Database,kind:Kind,session:string,seat:string,now=new Date()){
 if(!valid(session)||!valid(seat)||!["tutoring","club"].includes(kind))return null;
 const who=await db.prepare(scope(kind)).bind(session,seat,now.toISOString()).first<any>();if(!who)return null;
 const row=await db.prepare("SELECT id,sections_json,revision,published_at,published_sections_json FROM support_family_progress_reports WHERE kind=? AND session_id=? AND seat_id=? AND request_id=? AND family_id=? AND parent_user_id=? AND learner_id=?").bind(kind,session,seat,who.request_id,who.family_id,who.parent_user_id,who.learner_id).first<any>();
 const items=(await db.prepare("SELECT question,achievement FROM support_activity_evidence WHERE kind=? AND session_id=? AND seat_id=? ORDER BY saved_at,activity_id LIMIT 20").bind(kind,session,seat).all<{question:string;achievement:string}>()).results||[];
 const lines=(s:string[])=>s.join("\n").slice(0,3000);
 const suggested=[lines(items.map(v=>v.question)),lines(items.filter(v=>["independent","supported"].includes(v.achievement)).map(v=>v.question+(v.achievement==="independent"?" — demonstrated independently.":" — demonstrated with guidance."))),lines(items.filter(v=>["supported","practise"].includes(v.achievement)).map(v=>v.question)),""];
 return {id:row?.id??null,revision:row?.revision??0,sections:row?JSON.parse(row.sections_json):suggested,suggested,evidence_count:items.length,published_at:row?.published_at??null,has_unpublished_changes:!!row&&row.sections_json!==row.published_sections_json};
}
export async function changeProgressReport(db:D1Database,kind:Kind,session:string,seat:string,b:any,now=new Date()){
 if(!valid(session)||!valid(seat)||!["tutoring","club"].includes(kind)||!Number.isInteger(b?.revision)||b.revision<0)return false;
 const at=now.toISOString(),guard="EXISTS(SELECT 1 FROM ("+scope(kind)+") p WHERE p.request_id=support_family_progress_reports.request_id AND p.family_id=support_family_progress_reports.family_id AND p.parent_user_id=support_family_progress_reports.parent_user_id AND p.learner_id=support_family_progress_reports.learner_id)";
 const where=" WHERE kind=? AND session_id=? AND seat_id=? AND revision=? AND "+guard;
 const args=[kind,session,seat,b.revision,session,seat,at];
 if(b.action==="save"){
  if(!Array.isArray(b.sections)||b.sections.length!==4||b.sections.some((v:unknown)=>typeof v!=="string"||v.trim().length>3000)||!b.sections.some((v:string)=>v.trim()))return false;
  const json=JSON.stringify(b.sections.map((v:string)=>v.trim()));
  const r=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_family_progress_reports(id,kind,session_id,seat_id,request_id,family_id,parent_user_id,learner_id,sections_json,updated_at) SELECT ?,?,?,?,request_id,family_id,parent_user_id,learner_id,?,? FROM ("+scope(kind)+")").bind(crypto.randomUUID(),kind,session,seat,json,at,session,seat,at).run():await db.prepare("UPDATE support_family_progress_reports SET sections_json=?,revision=revision+1,updated_at=?"+where).bind(json,at,...args).run();
  return !!r.meta?.changes;
 }
 if(b.confirmed!==true||b.revision<1)return false;
 if(b.action==="publish"){
  // Only the exact previously saved and reviewed draft is published.
  const r=await db.prepare("UPDATE support_family_progress_reports SET published_sections_json=sections_json,published_at=?,revision=revision+1,updated_at=?"+where).bind(at,at,...args).run();return !!r.meta?.changes;
 }
 if(b.action==="withdraw"){
  const r=await db.prepare("UPDATE support_family_progress_reports SET published_sections_json=NULL,published_at=NULL,revision=revision+1,updated_at=?"+where).bind(at,...args).run();return !!r.meta?.changes;
 }
 return false;
}
export async function familyProgressReports(db:D1Database,a:AuthUser){
 if(!await verifiedPortalIdentity(db,a))return null;
 const rows=(await db.prepare("SELECT r.id,r.kind,r.learner_id,r.published_sections_json,r.published_at FROM support_family_progress_reports r JOIN support_portal_enquiries p ON p.request_id=r.request_id AND p.family_id=r.family_id AND p.parent_user_id=r.parent_user_id AND p.learner_id=r.learner_id WHERE r.family_id=? AND r.parent_user_id=? AND r.published_at IS NOT NULL AND r.published_sections_json IS NOT NULL ORDER BY r.published_at DESC,r.id LIMIT 101").bind(a.family_id,a.id).all<any>()).results||[];
 return {reports:rows.slice(0,100).map(r=>({id:r.id,kind:r.kind,learner_id:r.learner_id,sections:JSON.parse(r.published_sections_json),published_at:r.published_at})),limited:rows.length>100};
}
export function registerFamilyProgressReports(app:App,g:Guards){
 app.get("/api/family-portal/progress-reports",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);
  const r=await familyProgressReports(c.env.DB,c.get("user"));return r?c.json(r):c.json({detail:"Verified parent required."},403);
 });
}
