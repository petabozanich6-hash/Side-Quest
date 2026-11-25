import type {Env} from "./types";
import {classroomEnabled,classroomState} from "./supportClassrooms";
import type {Channel} from "./supportOrders";
type Fetch=typeof fetch;
const SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_video_rooms (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, meeting_id TEXT UNIQUE, status TEXT NOT NULL CHECK(status IN ('creating','ready','closing','closed','review')), expires_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS support_video_participants (order_id TEXT NOT NULL REFERENCES support_video_rooms(order_id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role IN ('tutor','family')), participant_id TEXT, status TEXT NOT NULL CHECK(status IN ('creating','ready','review')), PRIMARY KEY(order_id,role))",
  "CREATE INDEX IF NOT EXISTS idx_support_video_cleanup ON support_video_rooms(status,expires_at)"
] as const;
async function ensure(db:D1Database){for(const s of SCHEMA)await db.prepare(s).run();}
const validId=(s:unknown):s is string=>typeof s==="string"&&/^[a-zA-Z0-9_-]{1,100}$/.test(s);
function configured(e:Env){return validId(e.SUPPORT_VIDEO_ACCOUNT)&&validId(e.SUPPORT_VIDEO_APP)&&!!e.SUPPORT_VIDEO_TOKEN&&!!e.SUPPORT_VIDEO_TUTOR_PRESET&&!!e.SUPPORT_VIDEO_FAMILY_PRESET&&e.SUPPORT_VIDEO_TUTOR_PRESET!==e.SUPPORT_VIDEO_FAMILY_PRESET;}
/** Intentionally staging-only. No production activation until browser, presets and lifecycle have been verified. */
export function videoEnabled(e:Env){return classroomEnabled(e)&&e.SUPPORT_VIDEO_TEST==="true"&&!!e.STAGING_KEY&&configured(e);}
async function call(e:Env,path:string,method:string,body:unknown,fetcher:Fetch){
 if(!configured(e))throw Error("Video not configured");
 const url="https://api.cloudflare.com/client/v4/accounts/"+e.SUPPORT_VIDEO_ACCOUNT+"/realtime/kit/"+e.SUPPORT_VIDEO_APP+"/"+path;
 const r=await fetcher(url,{method,headers:{Authorization:"Bearer "+e.SUPPORT_VIDEO_TOKEN,"Content-Type":"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000)});
 const j:any=await r.json();if(!r.ok||j.success!==true)throw Error("Video provider request failed");return j.data;
}
export async function prepareVideo(e:Env,channel:Channel,id:string,oid:string,fetcher:Fetch=fetch,now=new Date()){
 if(!videoEnabled(e))return {error:"Video pilot is disabled."};
 const s=await classroomState(e.DB,channel,id,oid,true,now);
 if(!s?.open)return {error:"Open the confirmed classroom first."};
 await ensure(e.DB);
 const existing=await e.DB.prepare("SELECT status FROM support_video_rooms WHERE order_id=?").bind(oid).first<{status:string}>();
 if(existing)return existing.status==="ready"?{ok:true}:{error:"Video room already attempted or ended; review it before creating another."};
 const until=new Date(Date.parse(s.end_at)+10*60000).toISOString(),when=now.toISOString();
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_video_rooms(order_id,status,expires_at,updated_at) VALUES(?,'creating',?,?)").bind(oid,until,when).run();
 if(!claim.meta?.changes)return {error:"Video room creation already in progress."};
 try{
  const meeting=await call(e,"meetings","POST",{title:"Side-Quest private session "+oid,record_on_start:false,live_stream_on_start:false,persist_chat:false,transcribe_on_end:false,summarize_on_end:false,enable_sip:false},fetcher);
  if(!validId(meeting?.id))throw Error("Invalid provider meeting");
  await e.DB.prepare("UPDATE support_video_rooms SET meeting_id=?,status='ready',updated_at=? WHERE order_id=? AND status='creating'").bind(meeting.id,when,oid).run();
  return {ok:true};
 }catch{
  await e.DB.prepare("UPDATE support_video_rooms SET status='review',updated_at=? WHERE order_id=? AND status='creating'").bind(when,oid).run();
  return {error:"Video creation could not be confirmed. Check the provider dashboard; no automatic retry."};
 }
}
export async function videoToken(e:Env,channel:Channel,id:string,oid:string,owner:boolean,fetcher:Fetch=fetch,now=new Date()){
 if(!videoEnabled(e))return {error:"Video pilot is disabled."};
 const state=await classroomState(e.DB,channel,id,oid,owner,now);
 if(!state?.open)return {error:"Classroom is not open."};
 await ensure(e.DB);
 const room=await e.DB.prepare("SELECT * FROM support_video_rooms WHERE order_id=? AND status='ready' AND expires_at>?").bind(oid,now.toISOString()).first<any>();
 if(!room||!validId(room.meeting_id))return {error:"The tutor has not prepared video."};
 const role=owner?"tutor":"family",preset=owner?e.SUPPORT_VIDEO_TUTOR_PRESET:e.SUPPORT_VIDEO_FAMILY_PRESET;
 const p=await e.DB.prepare("SELECT * FROM support_video_participants WHERE order_id=? AND role=?").bind(oid,role).first<any>();
 const token={not_before:now.toISOString(),expires_on:room.expires_at};
 const root="meetings/"+room.meeting_id+"/participants";
 try{
  let data:any;
  if(p?.status==="ready"&&validId(p.participant_id)){
   data=await call(e,root+"/"+p.participant_id+"/token","POST",token,fetcher);
  }else{
   if(p)return {error:"Participant setup requires review."};
   const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_video_participants(order_id,role,status) VALUES(?,?,'creating')").bind(oid,role).run();
   if(!claim.meta?.changes)return {error:"Participant creation already in progress."};
   data=await call(e,root,"POST",{custom_participant_id:oid+"-"+role,preset_name:preset,name:owner?"Tutor":"Parent and learner",token},fetcher);
   if(!validId(data?.id))throw Error("Invalid participant");
   await e.DB.prepare("UPDATE support_video_participants SET participant_id=?,status='ready' WHERE order_id=? AND role=? AND status='creating'").bind(data.id,oid,role).run();
  }
  if(typeof data?.token!=="string"||!data.token)throw Error("Missing participant token");
  // Recheck access after provider calls. Do not issue a token if closure raced the request.
  const s=await classroomState(e.DB,channel,id,oid,owner,now);
  const stillReady=await e.DB.prepare("SELECT order_id FROM support_video_rooms WHERE order_id=? AND status='ready'").bind(oid).first();
  if(!s?.open||!stillReady)return {error:"Classroom closed."};
  return {token:data.token,expires_at:room.expires_at};
 }catch{
  await e.DB.prepare("UPDATE support_video_participants SET status='review' WHERE order_id=? AND role=? AND status='creating'").bind(oid,role).run();
  return {error:"Video access could not be confirmed. Ask the tutor to review it."};
 }
}
/** Deactivate first to prevent rejoining, then end the active call. Retry cleanup on maintenance ticks. */
export async function closeVideo(e:Env,oid:string,fetcher:Fetch=fetch){
 if(!configured(e))return false;
 await ensure(e.DB);
 const r=await e.DB.prepare("SELECT meeting_id,status FROM support_video_rooms WHERE order_id=?").bind(oid).first<any>();
 if(!r||r.status==="closed")return true;
 if(!validId(r.meeting_id))return false;
 await e.DB.prepare("UPDATE support_video_rooms SET status='closing',updated_at=? WHERE order_id=?").bind(new Date().toISOString(),oid).run();
 try{
  const root="meetings/"+r.meeting_id;
  await call(e,root,"PATCH",{status:"INACTIVE"},fetcher);
  await call(e,root+"/active-session/kick-all","POST",{},fetcher);
  await e.DB.prepare("UPDATE support_video_rooms SET status='closed',updated_at=? WHERE order_id=?").bind(new Date().toISOString(),oid).run();
  return true;
 }catch{return false;}
}
export async function cleanupVideo(e:Env,fetcher:Fetch=fetch,now=new Date()){
 // Cleanup remains available when the pilot flag is switched off.
 if(!configured(e))return;
 await ensure(e.DB);
 const {results}=await e.DB.prepare("SELECT v.order_id FROM support_video_rooms v JOIN support_service_orders o ON o.id=v.order_id LEFT JOIN support_classrooms c ON c.order_id=o.id WHERE v.meeting_id IS NOT NULL AND v.status<>'closed' AND (v.expires_at<=? OR v.status='closing' OR o.status<>'paid' OR COALESCE(c.is_open,0)=0 OR ?=0) LIMIT 10").bind(now.toISOString(),videoEnabled(e)?1:0).all<{order_id:string}>();
 for(const r of results||[])await closeVideo(e,r.order_id,fetcher);
}
