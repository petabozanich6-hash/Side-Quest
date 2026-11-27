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
// Only an explicit learner link and a still-valid verified family claim qualify.
const legacyJoins=`JOIN support_guest_learner_enquiries a ON a.request_id=r.id
 JOIN support_guest_learners gl ON gl.id=a.learner_id
 JOIN support_guest_families gf ON gf.id=gl.family_id AND gf.email=r.email
 JOIN support_family_claims c ON c.guest_family_id=gf.id
 JOIN support_portal_legacy_learners m ON m.legacy_learner_id=gl.id AND m.parent_user_id=c.parent_user_id
 JOIN support_portal_learners lp ON lp.id=m.learner_id AND lp.family_id=c.family_id
 JOIN users u ON u.id=c.parent_user_id AND u.family_id=c.family_id AND u.email=gf.email
 LEFT JOIN family_admin_state fs ON fs.family_id=c.family_id`;
const legacyGuard=`u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(fs.status,'active')='active'
 AND (lp.parent_user_id=c.parent_user_id OR EXISTS(SELECT 1 FROM students st WHERE st.id=lp.student_id AND st.family_id=lp.family_id))
 AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=r.id)
 AND NOT EXISTS(SELECT 1 FROM support_portal_enquiries p WHERE p.request_id=r.id)`;
async function linkedLegacyIdentity(db:D1Database,requestId:string){
 return db.prepare(`SELECT lp.family_id,lp.id learner_id FROM support_guest_requests r ${legacyJoins} WHERE r.id=? AND ${legacyGuard}`).bind(requestId).first<{family_id:string;learner_id:string}>();
}
const memberJoins=`JOIN support_portal_member_learners m ON m.request_id=r.id AND m.parent_user_id=r.user_id
 JOIN support_portal_learners lp ON lp.id=m.learner_id AND lp.family_id=r.family_id
 JOIN users u ON u.id=r.user_id AND u.family_id=r.family_id
 LEFT JOIN family_admin_state fs ON fs.family_id=r.family_id`;
const memberGuard=`r.page_hint='learning-support' AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(fs.status,'active')='active'
 AND (lp.parent_user_id=r.user_id OR EXISTS(SELECT 1 FROM students st WHERE st.id=lp.student_id AND st.family_id=lp.family_id))`;
const historyScope=`WITH learner_requests AS (
 SELECT r.id,r.subject,r.status,r.updated_at,g.id guest_id,'guest' channel FROM support_portal_enquiries p
 JOIN support_guest_requests r ON r.id=p.request_id LEFT JOIN support_guest_families g ON g.email=r.email
 WHERE p.family_id=? AND p.learner_id=?
 UNION ALL
 SELECT r.id,r.subject,r.status,r.updated_at,gf.id,'guest' FROM support_guest_requests r
 ${legacyJoins}
 WHERE lp.family_id=? AND lp.id=? AND ${legacyGuard}
 UNION ALL
 SELECT r.id,r.subject,r.status,r.updated_at,NULL,'member' FROM parent_feedback r ${memberJoins}
 WHERE lp.family_id=? AND lp.id=? AND ${memberGuard}
)`;
export async function ownerLearner(db:D1Database,family:string,id:string,page=1){
 const learner=await db.prepare(identitySql).bind(family,id).first<any>();if(!learner)return null;
 const args=[family,id,family,id,family,id];
 const [requests,orders,club]=await Promise.all([
 db.prepare(historyScope+" SELECT id,subject,status,updated_at,guest_id,channel FROM learner_requests ORDER BY updated_at DESC,id LIMIT 51 OFFSET ?").bind(...args,(page-1)*50).all<any>(),
 db.prepare(historyScope+` SELECT o.id,r.id request_id,r.guest_id,r.channel,r.subject,o.start_at,o.end_at,o.status,o.mode FROM learner_requests r JOIN support_service_orders o ON o.channel=r.channel AND o.request_id=r.id ORDER BY COALESCE(o.start_at,o.created_at) DESC,o.id LIMIT 51 OFFSET ?`).bind(...args,(page-1)*50).all<any>(),
 db.prepare(historyScope+` SELECT e.id,r.id request_id,r.guest_id,c.id class_id,c.topic,c.start_at,c.end_at,e.status,e.attendance FROM learner_requests r JOIN support_english_enrolments e ON e.request_id=r.id AND r.channel='guest' JOIN support_english_classes c ON c.id=e.class_id ORDER BY c.start_at DESC,e.id LIMIT 51 OFFSET ?`).bind(...args,(page-1)*50).all<any>()
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

/** Reviewed reports only, scoped to their exact canonical learner, family and request.
 * A report draft or another learner's record must never enter the continuity summary. */
export async function ownerLearnerReports(db:D1Database,family:string,id:string,before=new Date(),excludeOrder=""){
 const rows=(await db.prepare(`SELECT r.id,r.kind,r.session_id,r.seat_id,r.published_sections_json,r.published_at,q.subject,
 CASE WHEN r.kind='tutoring' THEN o.end_at ELSE c.end_at END end_at
 FROM support_family_progress_reports r
 JOIN support_portal_enquiries p ON p.request_id=r.request_id AND p.family_id=r.family_id AND p.parent_user_id=r.parent_user_id AND p.learner_id=r.learner_id
 JOIN support_guest_requests q ON q.id=p.request_id
 LEFT JOIN support_service_orders o ON r.kind='tutoring' AND o.id=r.session_id AND o.id=r.seat_id AND o.channel='guest' AND o.request_id=p.request_id
 LEFT JOIN support_english_enrolments e ON r.kind='club' AND e.id=r.seat_id AND e.class_id=r.session_id AND e.request_id=p.request_id
 LEFT JOIN support_english_classes c ON c.id=e.class_id
 WHERE r.family_id=? AND r.learner_id=? AND r.published_at IS NOT NULL AND r.published_sections_json IS NOT NULL
 AND ((r.kind='tutoring' AND o.mode='live' AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND o.id<>? AND julianday(o.end_at)<=julianday(?))
 OR (r.kind='club' AND e.status='paid' AND julianday(c.end_at)<=julianday(?)))
 ORDER BY end_at DESC,r.id LIMIT 6`).bind(family,id,excludeOrder,before.toISOString(),before.toISOString()).all<any>()).results||[];
 return rows.slice(0,5).map(({published_sections_json,...r})=>({...r,sections:JSON.parse(published_sections_json)}));
}
/** Resolve identity from the booked request, never from the tutor-entered label or a client learner ID. */
export async function appointmentLearnerContext(db:D1Database,channel:string,requestId:string,orderId:string,now=new Date()){
 if(channel!=="guest"&&channel!=="member")return null;
 const table=channel==="member"?"parent_feedback":"support_guest_requests";
 const booked=await db.prepare(`SELECT o.start_at,r.message FROM support_service_orders o JOIN ${table} r ON r.id=o.request_id
 WHERE o.channel=? AND o.request_id=? AND o.id=? AND o.mode='live'`).bind(channel,requestId,orderId).first<{start_at:string;message:string}>();
 if(!booked||!Number.isFinite(Date.parse(booked.start_at)))return null;
 const identity=channel==="member"?await db.prepare(`SELECT lp.family_id,lp.id learner_id FROM parent_feedback r ${memberJoins} WHERE r.id=? AND ${memberGuard}`).bind(requestId).first<{family_id:string;learner_id:string}>():await db.prepare(`SELECT p.family_id,p.learner_id FROM support_portal_enquiries p JOIN support_portal_learners l ON l.id=p.learner_id AND l.family_id=p.family_id WHERE p.request_id=? AND p.service='tutoring'`).bind(requestId).first<{family_id:string;learner_id:string}>()||await linkedLegacyIdentity(db,requestId);
 if(!identity)return null;
 const o={...booked,...identity};
 const l=await db.prepare(identitySql).bind(o.family_id,o.learner_id).first<any>();if(!l)return null;
 const cutoff=new Date(Math.min(Date.parse(o.start_at),now.getTime()));
 const [reports,prior]=await Promise.all([
  ownerLearnerReports(db,o.family_id,o.learner_id,cutoff,orderId),
  db.prepare(historyScope+` SELECT o.id,r.subject,o.end_at,o.status
  FROM learner_requests r JOIN support_service_orders o ON o.request_id=r.id AND o.channel=r.channel
  WHERE o.id<>? AND o.mode='live' AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND julianday(o.end_at)<=julianday(?)
  ORDER BY o.end_at DESC,o.id LIMIT 5`).bind(o.family_id,o.learner_id,o.family_id,o.learner_id,o.family_id,o.learner_id,orderId,cutoff.toISOString()).all()
 ]);
 return {learner:l,current_enquiry:o.message,reports,previous_appointments:prior.results||[]};
}

/** Owner-only group preparation: derive each learner from the exact paid seat.
 * Unlinked historical seats remain visible by their booked label, never matched by name.
 * No private notes are copied to shared class materials or activity prompts. */
export async function clubPreparationContext(db:D1Database,classId:string,now=new Date()){
 if(!classId||classId.length>100)return null;
 const session=await db.prepare("SELECT id,topic,start_at,end_at FROM support_english_classes WHERE id=?").bind(classId).first<{id:string;topic:string;start_at:string;end_at:string}>();
 if(!session||!Number.isFinite(Date.parse(session.start_at)))return null;
 const rows=(await db.prepare(`SELECT e.id seat_id,e.learner_label,e.request_id,p.family_id,p.learner_id,r.message
 FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id
 LEFT JOIN support_portal_enquiries p ON p.request_id=e.request_id AND p.service='english-club'
 WHERE e.class_id=? AND e.status='paid' AND r.status NOT IN ('closed','resolved')
 ORDER BY e.created_at,e.id LIMIT 9`).bind(classId).all<any>()).results||[];
 const cutoff=new Date(Math.min(Date.parse(session.start_at),now.getTime()));
 const learners=[];
 for(const seat of rows.slice(0,8)){
  const identity=seat.family_id&&seat.learner_id?seat:await linkedLegacyIdentity(db,seat.request_id);
  const l=identity?await db.prepare(identitySql).bind(identity.family_id,identity.learner_id).first<any>():null;
  learners.push({seat_id:seat.seat_id,booked_label:seat.learner_label,learner:l,current_enquiry:l?seat.message:null,reports:l?await ownerLearnerReports(db,l.family_id,l.id,cutoff):[]});
 }
 return {session,learners,limited:rows.length>8};
}
