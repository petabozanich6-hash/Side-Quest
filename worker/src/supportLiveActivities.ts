import type {App,AuthUser,Env,Guards} from "./types";
import {hitRateLimit} from "./adminAudit";
import {validateActivityQuestion} from "./supportActivityLibrary";
import {verifiedPortalIdentity,unifiedPortalPilot} from "./unifiedPortalIdentity";
export const liveActivitiesEnabled=(env:Env)=>unifiedPortalPilot(env)&&env.SUPPORT_CLASSROOM_ENABLED==="true";
type Kind="tutoring"|"club";
// Owner context must be supplied ONLY by existing owner permission/step-up routes.
// Parent identity must come from authenticated server context, never request JSON.
type Access={kind:Kind;sessionId:string;owner:true}|{kind:Kind;sessionId:string;owner:false;actor:AuthUser;requestId:string};
const safe=(v:unknown,max:number)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=max?v.trim():null;
type Query={sql:string;args:(string|number)[]};
async function scope(db:D1Database,a:Access,now:Date):Promise<Query|null>{
 if(!safe(a.sessionId,100)||!["tutoring","club"].includes(a.kind))return null;
 const at=now.toISOString();
 if(!a.owner&&!await verifiedPortalIdentity(db,a.actor))return null;
 if(a.kind==="tutoring"){
  const base="SELECT o.id seat_id FROM support_service_orders o JOIN support_classrooms c ON c.order_id=o.id WHERE o.id=? AND o.mode='live' AND o.status='paid' AND o.checkout_started_at IS NULL AND c.is_open=1 AND julianday(o.start_at)-10.0/1440<=julianday(?) AND julianday(o.end_at)+10.0/1440>=julianday(?)";
  if(a.owner)return {sql:base,args:[a.sessionId,at,at]};
  return {sql:base+" AND o.channel='guest' AND o.request_id=? AND EXISTS(SELECT 1 FROM support_portal_enquiries p WHERE p.request_id=o.request_id AND p.family_id=? AND p.parent_user_id=?)",args:[a.sessionId,at,at,a.requestId,a.actor.family_id,a.actor.id]};
 }
 const base="SELECT c.id seat_id FROM support_english_classes c WHERE c.id=? AND julianday(c.start_at)-10.0/1440<=julianday(?) AND julianday(c.end_at)>julianday(?)";
 if(a.owner)return {sql:base,args:[a.sessionId,at,at]};
 return {sql:"SELECT e.id seat_id FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id JOIN support_portal_enquiries p ON p.request_id=e.request_id WHERE e.class_id IN (SELECT seat_id FROM ("+base+")) AND e.request_id=? AND e.status='paid' AND r.status NOT IN ('closed','resolved') AND p.family_id=? AND p.parent_user_id=?",args:[a.sessionId,at,at,a.requestId,a.actor.family_id,a.actor.id]};
}
export async function readLiveActivity(db:D1Database,a:Access,now=new Date()){
 const s=await scope(db,a,now);if(!s)return null;
 const seat=await db.prepare(s.sql).bind(...s.args).first<{seat_id:string}>();if(!seat)return null;
 const row=await db.prepare("SELECT id,question,activity_type,options_json,answer_key,state FROM support_live_activities WHERE kind=? AND session_id=? AND state<>'closed' AND EXISTS("+s.sql+")").bind(a.kind,a.sessionId,...s.args).first<any>();
 if(!row)return {activity:null};
 const responses=a.owner?(await db.prepare("SELECT seat_id,response,updated_at FROM support_live_activity_responses WHERE activity_id=? AND EXISTS("+s.sql+") ORDER BY updated_at,seat_id LIMIT 8").bind(row.id,...s.args).all()).results||[]:undefined;
 const since=new Date(now.getTime()-10*60000).toISOString();
 const eligible=a.kind==="club"?" AND EXISTS(SELECT 1 FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id WHERE e.id=v.seat_id AND e.class_id=? AND e.status='paid' AND r.status NOT IN ('closed','resolved'))":" AND v.seat_id=?";
 const signals=a.owner?(await db.prepare("SELECT v.seat_id,v.signal,v.updated_at,"+(a.kind==="club"?"(SELECT e.learner_label FROM support_english_enrolments e WHERE e.id=v.seat_id)":"(SELECT d.learner_label FROM support_tutor_diary d WHERE d.order_id=v.seat_id)")+" learner_label FROM support_live_activity_signals v WHERE v.activity_id=? AND v.signal<>'clear' AND v.updated_at>=? AND EXISTS("+s.sql+")"+eligible+" ORDER BY v.updated_at DESC LIMIT 8").bind(row.id,since,...s.args,a.sessionId).all()).results||[]:undefined;
 const ownSignal=a.owner?null:await db.prepare("SELECT signal FROM support_live_activity_signals WHERE activity_id=? AND seat_id=? AND signal<>'clear' AND updated_at>=? AND EXISTS("+s.sql+")").bind(row.id,seat.seat_id,since,...s.args).first<{signal:string}>();
 const own=a.owner?null:await db.prepare("SELECT response FROM support_live_activity_responses WHERE activity_id=? AND seat_id=? AND EXISTS("+s.sql+")").bind(row.id,seat.seat_id,...s.args).first<{response:string}>();
 return {activity:{id:row.id,question:row.question,type:row.activity_type,options:JSON.parse(row.options_json),state:row.state,answer_key:a.owner||row.state==="revealed"?row.answer_key:null},...(a.owner?{responses,signals}:{response:own?.response??null,signal:ownSignal?.signal??null})};
}
export async function launchLiveActivity(db:D1Database,a:Access,b:any,now=new Date()){
 if(!a.owner||b?.confirmed!==true)return false;
 const s=await scope(db,a,now);if(!s)return false;
 const id=crypto.randomUUID(),at=now.toISOString();
 try{
  if(b.template_id!==undefined){
   const template=safe(b.template_id,100);
   if(!template||!Number.isInteger(b.template_revision))return false;
   const r=await db.prepare("INSERT INTO support_live_activities(id,kind,session_id,question,activity_type,options_json,answer_key,created_at) SELECT ?,?,?,question,activity_type,options_json,answer_key,? FROM support_activity_templates WHERE id=? AND revision=? AND status='reviewed' AND EXISTS("+s.sql+")").bind(id,a.kind,a.sessionId,at,template,b.template_revision,...s.args).run();
   return !!r.meta?.changes;
  }
  const v=validateActivityQuestion(b);if(!v)return false;
  const r=await db.prepare("INSERT INTO support_live_activities(id,kind,session_id,question,activity_type,options_json,answer_key,created_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS("+s.sql+")").bind(id,a.kind,a.sessionId,v.question,v.type,JSON.stringify(v.options),v.answer_key,at,...s.args).run();return !!r.meta?.changes;
 }catch{return false;}
}
export async function respondLiveActivity(db:D1Database,a:Access,b:any,now=new Date()){
 if(a.owner||!safe(b?.activity_id,100))return false;
 const s=await scope(db,a,now);if(!s)return false;
 const row=await db.prepare("SELECT id,activity_type,options_json FROM support_live_activities WHERE id=? AND kind=? AND session_id=? AND state='open'").bind(b.activity_id,a.kind,a.sessionId).first<any>();
 const response=safe(b.response,500);if(!row||!response||(row.activity_type!=="short"&&!JSON.parse(row.options_json).includes(response)))return false;
 const r=await db.prepare("INSERT INTO support_live_activity_responses(activity_id,seat_id,response,updated_at) SELECT ?,seat_id,?,? FROM ("+s.sql+") WHERE EXISTS(SELECT 1 FROM support_live_activities WHERE id=? AND kind=? AND session_id=? AND state='open') ON CONFLICT(activity_id,seat_id) DO UPDATE SET response=excluded.response,updated_at=excluded.updated_at").bind(row.id,response,now.toISOString(),...s.args,row.id,a.kind,a.sessionId).run();
 return !!r.meta?.changes;
}
export async function signalLiveActivity(db:D1Database,a:Access,b:any,now=new Date()){
 if(a.owner||!safe(b?.activity_id,100)||!["question","hint","time","confused","ready","clear"].includes(b.signal))return false;
 const s=await scope(db,a,now);if(!s)return false;
 const r=await db.prepare("INSERT INTO support_live_activity_signals(activity_id,seat_id,signal,updated_at) SELECT ?,seat_id,?,? FROM ("+s.sql+") WHERE EXISTS(SELECT 1 FROM support_live_activities WHERE id=? AND kind=? AND session_id=? AND state<>'closed') ON CONFLICT(activity_id,seat_id) DO UPDATE SET signal=excluded.signal,updated_at=excluded.updated_at").bind(b.activity_id,b.signal,now.toISOString(),...s.args,b.activity_id,a.kind,a.sessionId).run();
 return !!r.meta?.changes;
}
export async function endLiveActivity(db:D1Database,a:Access,b:any,now=new Date()){
 if(!a.owner||b?.confirmed!==true||!safe(b.activity_id,100)||!["revealed","closed"].includes(b.state))return false;
 const s=await scope(db,a,now);if(!s)return false;
 const r=await db.prepare("UPDATE support_live_activities SET state=? WHERE id=? AND kind=? AND session_id=? AND state<>'closed' AND (?='closed' OR state='open') AND EXISTS("+s.sql+")").bind(b.state,b.activity_id,a.kind,a.sessionId,b.state,...s.args).run();
 return !!r.meta?.changes;
}

export function registerLiveActivityRoutes(app:App,g:Guards){
 const root="/api/family-portal/activities";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","private, no-store");if(!liveActivitiesEnabled(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/:kind/:session/:request",g.auth,g.parent,async c=>{
  const kind=c.req.param("kind");if(kind!=="club"&&kind!=="tutoring")return c.json({detail:"Not found"},404);
  const a:Access={kind,sessionId:c.req.param("session")??"",requestId:c.req.param("request")??"",owner:false as const,actor:c.get("user")};
  if(!(await hitRateLimit(c.env.DB,"live-activity-read:"+a.actor.id,120,300)).ok)return c.json({detail:"Try again shortly."},429);
  const result=await readLiveActivity(c.env.DB,a);return result?c.json(result):c.json({detail:"An open, paid classroom and verified parent are required."},404);
 });
 app.post(root+"/:kind/:session/:request",g.auth,g.parent,async c=>{
  const kind=c.req.param("kind");if(kind!=="club"&&kind!=="tutoring")return c.json({detail:"Not found"},404);
  const a:Access={kind,sessionId:c.req.param("session")??"",requestId:c.req.param("request")??"",owner:false as const,actor:c.get("user")};
  if(!(await hitRateLimit(c.env.DB,"live-activity-write:"+a.actor.id,30,300)).ok)return c.json({detail:"Try again shortly."},429);
  const b=await c.req.json().catch(()=>null);
  return await (b?.action==="signal"?signalLiveActivity(c.env.DB,a,b):respondLiveActivity(c.env.DB,a,b))?c.json({ok:true}):c.json({detail:"This response could not be accepted. Refresh the activity."},409);
 });
}
