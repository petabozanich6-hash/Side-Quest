import type {Env} from "./types";
import {ensureEnglishClub} from "./englishClub";
const SCHEMA=["CREATE TABLE IF NOT EXISTS support_english_video_rooms (class_id TEXT PRIMARY KEY REFERENCES support_english_classes(id) ON DELETE CASCADE, meeting_id TEXT UNIQUE, status TEXT NOT NULL CHECK(status IN ('creating','ready','closing','closed','review')), expires_at TEXT NOT NULL)","CREATE TABLE IF NOT EXISTS support_english_video_participants (class_id TEXT NOT NULL REFERENCES support_english_video_rooms(class_id) ON DELETE CASCADE, seat_id TEXT NOT NULL, participant_id TEXT, status TEXT NOT NULL CHECK(status IN ('creating','ready','review')), PRIMARY KEY(class_id,seat_id))"] as const;
async function ensure(db:D1Database){await ensureEnglishClub(db);await db.batch(SCHEMA.map(sql=>db.prepare(sql)));}
const valid=(v:unknown):v is string=>typeof v==="string"&&/^[a-zA-Z0-9_-]{1,100}$/.test(v);
function configured(e:Env){return valid(e.SUPPORT_VIDEO_ACCOUNT)&&valid(e.SUPPORT_VIDEO_APP)&&!!e.SUPPORT_VIDEO_TOKEN&&!!e.SUPPORT_ENGLISH_VIDEO_HOST_PRESET&&!!e.SUPPORT_ENGLISH_VIDEO_LEARNER_PRESET&&e.SUPPORT_ENGLISH_VIDEO_HOST_PRESET!==e.SUPPORT_ENGLISH_VIDEO_LEARNER_PRESET;}
export function englishVideoEnabled(e:Env){return configured(e)&&!!e.STAGING_KEY&&e.SUPPORT_CLASSROOM_ENABLED==="true"&&e.SUPPORT_ENGLISH_VIDEO_TEST==="true";}
async function call(e:Env,path:string,method:string,body:unknown,f:typeof fetch){
 if(!configured(e))throw Error("Group video not configured");
 const r=await f("https://api.cloudflare.com/client/v4/accounts/"+e.SUPPORT_VIDEO_ACCOUNT+"/realtime/kit/"+e.SUPPORT_VIDEO_APP+"/"+path,{method,headers:{Authorization:"Bearer "+e.SUPPORT_VIDEO_TOKEN,"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const j:any=await r.json();if(!r.ok||j.success!==true)throw Error("Group video provider request failed");return j.data;
}
async function session(e:Env,cid:string,now:Date){return e.DB.prepare("SELECT id,start_at,end_at FROM support_english_classes WHERE id=? AND julianday(start_at)-10.0/1440<=julianday(?) AND end_at>?").bind(cid,now.toISOString(),now.toISOString()).first<{id:string;start_at:string;end_at:string}>();}
async function seat(e:Env,cid:string,rid:string,email:string){return e.DB.prepare("SELECT e.id FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id WHERE e.class_id=? AND e.request_id=? AND r.email=? AND e.status='paid' AND r.status NOT IN ('closed','resolved')").bind(cid,rid,email).first<{id:string}>();}
export async function englishVideoState(e:Env,cid:string,parent?:{requestId:string;email:string},now=new Date()){
 if(!englishVideoEnabled(e))return {enabled:false,open:false};
 await ensure(e.DB);const c=await session(e,cid,now);if(!c||parent&&!await seat(e,cid,parent.requestId,parent.email))return {enabled:true,open:false};
 const r=await e.DB.prepare("SELECT status FROM support_english_video_rooms WHERE class_id=? AND expires_at>?").bind(cid,now.toISOString()).first<{status:string}>();
 return {enabled:true,open:parent?r?.status==="ready":!r||r.status==="ready",status:r?.status??"not_opened"};
}
export async function prepareEnglishVideo(e:Env,cid:string,f:typeof fetch=fetch,now=new Date()){
 if(!englishVideoEnabled(e))return {error:"English Club video pilot disabled."};
 await ensure(e.DB);const c=await session(e,cid,now);if(!c)return {error:"Open the club room within ten minutes of the scheduled start."};
 const prior=await e.DB.prepare("SELECT status FROM support_english_video_rooms WHERE class_id=?").bind(cid).first<{status:string}>();
 if(prior)return prior.status==="ready"?{ok:true}:{error:"Room already closed or requires provider review."};
 const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_english_video_rooms(class_id,status,expires_at) VALUES(?,'creating',?)").bind(cid,c.end_at).run();
 if(!claim.meta?.changes)return {error:"Room creation already in progress."};
 try{const m=await call(e,"meetings","POST",{title:"Side-Quest English Club "+cid,record_on_start:false,live_stream_on_start:false,persist_chat:false,transcribe_on_end:false,summarize_on_end:false,enable_sip:false},f);
 if(!valid(m?.id))throw Error("Invalid meeting");await e.DB.prepare("UPDATE support_english_video_rooms SET meeting_id=?,status='ready' WHERE class_id=? AND status='creating'").bind(m.id,cid).run();return {ok:true};
 }catch{await e.DB.prepare("UPDATE support_english_video_rooms SET status='review' WHERE class_id=? AND status='creating'").bind(cid).run();return {error:"Room creation needs provider review; do not retry automatically."};}
}
export async function englishVideoToken(e:Env,cid:string,parent?:{requestId:string;email:string},f:typeof fetch=fetch,now=new Date()){
 if(!englishVideoEnabled(e))return {error:"English Club video pilot disabled."};
 await ensure(e.DB);if(!await session(e,cid,now))return {error:"Club session is not open."};
 const s=parent?await seat(e,cid,parent.requestId,parent.email):{id:"host"};if(!s)return {error:"Confirmed paid place required."};
 const r=await e.DB.prepare("SELECT meeting_id,expires_at FROM support_english_video_rooms WHERE class_id=? AND status='ready' AND expires_at>?").bind(cid,now.toISOString()).first<{meeting_id:string;expires_at:string}>();
 if(!r||!valid(r.meeting_id))return {error:"Waiting for the host to open the room."};
 const root="meetings/"+r.meeting_id+"/participants",token={not_before:now.toISOString(),expires_on:r.expires_at};
 const p=await e.DB.prepare("SELECT participant_id,status FROM support_english_video_participants WHERE class_id=? AND seat_id=?").bind(cid,s.id).first<{participant_id:string;status:string}>();
 try{let d:any;if(p?.status==="ready"&&valid(p.participant_id)){d=await call(e,root+"/"+p.participant_id+"/token","POST",token,f);}
 else{if(p)return {error:"Participant setup requires review."};const claim=await e.DB.prepare("INSERT OR IGNORE INTO support_english_video_participants(class_id,seat_id,status) VALUES(?,?,'creating')").bind(cid,s.id).run();if(!claim.meta?.changes)return {error:"Participant setup in progress."};
 d=await call(e,root,"POST",{custom_participant_id:cid+"-"+s.id,preset_name:parent?e.SUPPORT_ENGLISH_VIDEO_LEARNER_PRESET:e.SUPPORT_ENGLISH_VIDEO_HOST_PRESET,name:parent?"Club participant":"Host",token},f);
 if(!valid(d?.id))throw Error("Invalid participant");await e.DB.prepare("UPDATE support_english_video_participants SET participant_id=?,status='ready' WHERE class_id=? AND seat_id=? AND status='creating'").bind(d.id,cid,s.id).run();}
 const state=await englishVideoState(e,cid,parent,new Date(Math.max(now.getTime(),Date.now())));if(!state.open||state.status!=="ready"||typeof d?.token!=="string"||!d.token)return {error:"Club access expired or changed."};
 return {token:d.token,expires_at:r.expires_at};
 }catch{await e.DB.prepare("UPDATE support_english_video_participants SET status='review' WHERE class_id=? AND seat_id=? AND status='creating'").bind(cid,s.id).run();return {error:"Participant access needs review."};}
}
export async function closeEnglishVideo(e:Env,cid:string,f:typeof fetch=fetch){
 if(!configured(e))return false;await ensure(e.DB);
 const r=await e.DB.prepare("SELECT meeting_id,status FROM support_english_video_rooms WHERE class_id=?").bind(cid).first<{meeting_id:string;status:string}>();
 if(!r||r.status==="closed")return true;if(!valid(r.meeting_id))return false;
 await e.DB.prepare("UPDATE support_english_video_rooms SET status='closing' WHERE class_id=?").bind(cid).run();
 try{const path="meetings/"+r.meeting_id;await call(e,path,"PATCH",{status:"INACTIVE"},f);await call(e,path+"/active-session/kick-all","POST",{},f);await e.DB.prepare("UPDATE support_english_video_rooms SET status='closed' WHERE class_id=?").bind(cid).run();return true;}catch{return false;}
}
export async function cleanupEnglishVideo(e:Env,f:typeof fetch=fetch,now=new Date()){
 if(!configured(e))return;await ensure(e.DB);const rows=await e.DB.prepare("SELECT class_id FROM support_english_video_rooms WHERE meeting_id IS NOT NULL AND status<>'closed' AND (expires_at<=? OR status='closing' OR ?=0) LIMIT 10").bind(now.toISOString(),englishVideoEnabled(e)?1:0).all<{class_id:string}>();for(const r of rows.results||[])await closeEnglishVideo(e,r.class_id,f);
}
