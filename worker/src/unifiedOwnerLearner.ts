import {newId,nowIso} from "./types";
import type {AuditEntry} from "./adminAudit";
const fields=["goals","interests","approach","private_notes"] as const;
const caps={goals:1000,interests:1000,approach:1000,private_notes:2000};
const identitySql=`SELECT p.id,p.family_id,COALESCE(s.name,p.label) label,COALESCE(s.year_level,p.year_level) year_level,
 CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END existing_student,
 COALESCE(n.goals,'') goals,COALESCE(n.interests,'') interests,COALESCE(n.approach,'') approach,COALESCE(n.private_notes,'') private_notes,
 COALESCE(n.revision,0) revision,n.updated_at
 FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id
 LEFT JOIN support_portal_learner_notes n ON n.learner_id=p.id WHERE p.family_id=? AND p.id=?`;
const historyScope=`WITH learner_requests AS (
 SELECT r.id,r.subject,r.status,r.updated_at,g.id guest_id FROM support_portal_enquiries p
 JOIN support_guest_requests r ON r.id=p.request_id LEFT JOIN support_guest_families g ON g.email=r.email
 WHERE p.family_id=? AND p.learner_id=?
 UNION ALL
 SELECT r.id,r.subject,r.status,r.updated_at,g.id FROM support_portal_legacy_learners m
 JOIN support_portal_learners p ON p.id=m.learner_id
 JOIN support_guest_learners l ON l.id=m.legacy_learner_id
 JOIN support_family_claims c ON c.guest_family_id=l.family_id AND c.family_id=p.family_id AND c.parent_user_id=m.parent_user_id
 JOIN support_guest_learner_enquiries a ON a.learner_id=l.id
 JOIN support_guest_requests r ON r.id=a.request_id
 JOIN support_guest_families g ON g.id=l.family_id AND g.email=r.email
 WHERE p.family_id=? AND p.id=? AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=r.id)
)`;
export async function ownerLearner(db:D1Database,family:string,id:string,page=1){
 const learner=await db.prepare(identitySql).bind(family,id).first<any>();if(!learner)return null;
 const args=[family,id,family,id];
 const [requests,orders,club]=await Promise.all([
 db.prepare(historyScope+" SELECT id,subject,status,updated_at,guest_id FROM learner_requests ORDER BY updated_at DESC,id LIMIT 51 OFFSET ?").bind(...args,(page-1)*50).all<any>(),
 db.prepare(historyScope+` SELECT o.id,r.id request_id,r.guest_id,r.subject,o.start_at,o.end_at,o.status,o.mode FROM learner_requests r JOIN support_service_orders o ON o.channel='guest' AND o.request_id=r.id ORDER BY COALESCE(o.start_at,o.created_at) DESC,o.id LIMIT 51 OFFSET ?`).bind(...args,(page-1)*50).all<any>(),
 db.prepare(historyScope+` SELECT e.id,r.id request_id,r.guest_id,c.id class_id,c.topic,c.start_at,c.end_at,e.status,e.attendance FROM learner_requests r JOIN support_english_enrolments e ON e.request_id=r.id JOIN support_english_classes c ON c.id=e.class_id ORDER BY c.start_at DESC,e.id LIMIT 51 OFFSET ?`).bind(...args,(page-1)*50).all<any>()
 ]);
 const groups=[requests.results||[],orders.results||[],club.results||[]];
 return {learner,page,enquiries:groups[0].slice(0,50),appointments:groups[1].slice(0,50),club:groups[2].slice(0,50),has_more:groups.some(x=>x.length>50)};
}
export async function saveOwnerLearnerNotes(db:D1Database,family:string,id:string,input:any,actor:Pick<AuditEntry,"actorUserId"|"actorLabel">){
 if(!input||!Number.isSafeInteger(input.revision)||input.revision<0||input.confirmed!==true)return {error:"Review the notes before saving."};
 const values:string[]=[];
 for(const k of fields){if(typeof input[k]!=="string"||input[k].trim().length>caps[k])return {error:"Check the length of the preparation notes."};values.push(input[k].trim());}
 const old=await db.prepare(identitySql).bind(family,id).first<any>();
 if(!old)return {error:"Learner not found."};
 if(old.revision!==input.revision)return {error:"These notes have changed. Reload before editing."};
 const now=nowIso(),revision=input.revision+1;
 const write=input.revision===0?db.prepare(`INSERT OR IGNORE INTO support_portal_learner_notes(learner_id,goals,interests,approach,private_notes,revision,updated_at)
 SELECT p.id,?,?,?,?,1,? FROM support_portal_learners p WHERE p.id=? AND p.family_id=?`).bind(...values,now,id,family):db.prepare(`UPDATE support_portal_learner_notes SET goals=?,interests=?,approach=?,private_notes=?,revision=revision+1,updated_at=? WHERE learner_id=? AND revision=? AND EXISTS(SELECT 1 FROM support_portal_learners p WHERE p.id=learner_id AND p.family_id=?)`).bind(...values,now,id,input.revision,family);
 // Audit only metadata, atomically alongside a successful revision change.
 const results=await db.batch([write,db.prepare("INSERT INTO admin_audit_log(id,actor_user_id,actor_label,action,target_type,target_id,detail_json,created_at) SELECT ?,?,?,'support.learner_notes_saved','support_portal_learner',?,?,? WHERE changes()=1").bind(newId(),actor.actorUserId,actor.actorLabel,id,JSON.stringify({revision}),now)]);
 return results[0].meta?.changes?{revision,updated_at:now}:{error:"These notes have changed. Reload before editing."};
}
