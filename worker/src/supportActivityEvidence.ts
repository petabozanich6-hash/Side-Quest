type Kind="tutoring"|"club";
const validId=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
const achievements=["covered","independent","supported","practise"];
function scope(kind:Kind){
 return kind==="tutoring"?
 "SELECT o.id AS seat_id,COALESCE(d.learner_label,'Learner') AS learner_label FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.id=? AND o.mode='live' AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND julianday(o.start_at)<=julianday(?)":
 "SELECT e.id AS seat_id,e.learner_label FROM support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id WHERE c.id=? AND e.status='paid' AND julianday(c.start_at)<=julianday(?)";
}
export async function readActivityEvidence(db:D1Database,kind:Kind,sessionId:string,seatId:string,now=new Date()){
 if(!validId(sessionId)||!validId(seatId)||!["tutoring","club"].includes(kind))return null;
 const at=now.toISOString(),query=scope(kind);
 const seat=await db.prepare("SELECT * FROM ("+query+") WHERE seat_id=?").bind(sessionId,at,seatId).first();
 if(!seat)return null;
 const rows=(await db.prepare("SELECT a.id activity_id,a.question,a.game_json,a.collaborative,a.activity_type,r.response,r.updated_at response_updated_at,e.observation,e.achievement,e.revision,e.saved_at FROM support_live_activities a JOIN support_live_activity_responses r ON r.activity_id=a.id LEFT JOIN support_activity_evidence e ON e.activity_id=a.id AND e.seat_id=r.seat_id WHERE a.kind=? AND a.session_id=? AND r.seat_id=? AND a.state IN ('revealed','closed') ORDER BY a.created_at DESC,a.id LIMIT 100").bind(kind,sessionId,seatId).all<any>()).results||[];
 return {seat,activities:rows.map(({game_json,...r})=>({...r,game:game_json?JSON.parse(game_json):null}))};
}
export async function saveActivityEvidence(db:D1Database,kind:Kind,sessionId:string,seatId:string,b:any,now=new Date()){
 if(!validId(sessionId)||!validId(seatId)||!validId(b?.activity_id)||!["tutoring","club"].includes(kind)||!Number.isInteger(b.revision)||b.revision<0||b.confirmed!==true)return false;
 const observation=typeof b.observation==="string"?b.observation.trim():"";
 if(!observation||observation.length>600||!achievements.includes(b.achievement)||typeof b.response_updated_at!=="string")return false;
 const at=now.toISOString(),guard="EXISTS(SELECT 1 FROM ("+scope(kind)+") WHERE seat_id=?)",args=[sessionId,at,seatId];
 // Copy the exact immutable submission from the server. Never trust client-supplied learner text.
 const source=" FROM support_live_activities a JOIN support_live_activity_responses r ON r.activity_id=a.id WHERE a.id=? AND a.kind=? AND a.session_id=? AND r.seat_id=? AND a.state IN ('revealed','closed') AND r.updated_at=? AND "+guard;
 const sourceArgs=[b.activity_id,kind,sessionId,seatId,b.response_updated_at,...args];
 const r=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_activity_evidence(activity_id,seat_id,kind,session_id,question,response,game_json,observation,achievement,response_updated_at,saved_at) SELECT a.id,r.seat_id,a.kind,a.session_id,a.question,r.response,a.game_json,?,?,r.updated_at,?"+source).bind(observation,b.achievement,at,...sourceArgs).run():await db.prepare("UPDATE support_activity_evidence SET observation=?,achievement=?,revision=revision+1,saved_at=? WHERE activity_id=? AND seat_id=? AND kind=? AND session_id=? AND revision=? AND response_updated_at=? AND EXISTS(SELECT 1"+source+")").bind(observation,b.achievement,at,b.activity_id,seatId,kind,sessionId,b.revision,b.response_updated_at,...sourceArgs).run();
 return !!r.meta?.changes;
}
export async function removeActivityEvidence(db:D1Database,kind:Kind,sessionId:string,seatId:string,b:any,now=new Date()){
 if(!validId(sessionId)||!validId(seatId)||!validId(b?.activity_id)||!["tutoring","club"].includes(kind)||!Number.isInteger(b.revision)||b.revision<1||b.confirmed!==true)return false;
 const r=await db.prepare("DELETE FROM support_activity_evidence WHERE kind=? AND session_id=? AND seat_id=? AND activity_id=? AND revision=? AND EXISTS(SELECT 1 FROM ("+scope(kind)+") WHERE seat_id=?)").bind(kind,sessionId,seatId,b.activity_id,b.revision,sessionId,now.toISOString(),seatId).run();
 return !!r.meta?.changes;
}
