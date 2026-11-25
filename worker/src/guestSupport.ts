import type {App,Env} from "./types";
import {nowIso} from "./types";
import {hitRateLimit} from "./adminAudit";
import {parseLearningSupport} from "./learningSupport";
import {SITE_URL,sendEmail,layout,p,button} from "./email";
import {loadPlatformSettings} from "./platformSettings";
import {listOrders,getOrder,confirmServiceOrder} from "./supportOrders";
import {classroomEnabled,classroomState,editClassroom,canReadClassroomImage} from "./supportClassrooms";
import {videoToken,videoEnabled} from "./supportVideo";
import {readQuotePlan} from "./supportQuotePlans";
import {grantedResources,downloadResource,readPresentedImage} from "./supportFiles";
export const GUEST_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_guest_links (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL,used_at TEXT)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_links_expiry ON support_guest_links(expires_at)",
  "CREATE TABLE IF NOT EXISTS support_guest_sessions (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_sessions_expiry ON support_guest_sessions(expires_at)",
  "CREATE TABLE IF NOT EXISTS support_guest_requests (id TEXT PRIMARY KEY,email TEXT NOT NULL,parent_name TEXT NOT NULL,subject TEXT NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','in_progress','resolved','closed')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,seen_at TEXT)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_requests_email ON support_guest_requests(email,created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_requests_updated ON support_guest_requests(updated_at DESC)",
  "CREATE TABLE IF NOT EXISTS support_guest_quotes (id TEXT PRIMARY KEY,request_id TEXT NOT NULL REFERENCES support_guest_requests(id) ON DELETE CASCADE,scope TEXT NOT NULL,delivery TEXT NOT NULL,amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000),currency TEXT NOT NULL DEFAULT 'AUD' CHECK(currency='AUD'),status TEXT NOT NULL DEFAULT 'offered' CHECK(status IN ('offered','interested','declined','withdrawn')),created_at TEXT NOT NULL,expires_at TEXT NOT NULL,responded_at TEXT,withdrawn_at TEXT)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_quotes_thread ON support_guest_quotes(request_id,created_at DESC)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_support_guest_quotes_open ON support_guest_quotes(request_id) WHERE status IN ('offered','interested')",
  "CREATE TABLE IF NOT EXISTS support_guest_messages (id TEXT PRIMARY KEY,request_id TEXT NOT NULL REFERENCES support_guest_requests(id) ON DELETE CASCADE,sender TEXT NOT NULL CHECK(sender IN ('parent','owner')),body TEXT NOT NULL,created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_support_guest_messages_thread ON support_guest_messages(request_id,created_at)"
] as const;
export async function ensureGuestSchema(db:D1Database){for(const sql of GUEST_SCHEMA)await db.prepare(sql).run();}
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");
const digest=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
const valid=(s:unknown):s is string=>typeof s==="string"&&/^[a-f0-9]{64}$/.test(s);
const emailOk=(s:string)=>s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
// Never use a caller-supplied Host header to construct a sign-in link.
export function guestOrigin(env:Env):string|null {
 if(!env.STAGING_KEY)return SITE_URL;
 const value=env.SUPPORT_GUEST_ORIGIN||"";
 try{const u=new URL(value);return u.protocol==="https:"&&/^side-quest-staging\.[a-z0-9-]+\.workers\.dev$/.test(u.hostname)&&u.origin===value?u.origin:null;}catch{return null;}
}
const enabled=(env:Env)=>env.SUPPORT_GUEST_ENABLED==="true"&&!!guestOrigin(env);
const expires=(ms:number)=>new Date(Date.now()+ms).toISOString();
export async function guestNotify(env:Env,email:string,owner=false,reference?:string){
 if(!emailOk(email))return false;
 const origin=guestOrigin(env);if(!origin)return false;
 const url=origin+(owner?"/parent/command-centre/learning-support":"/learning-support/portal");
 return sendEmail(env,{to:email,subject:owner?(reference?"Side-Quest Learning Support: new enquiry":"Side-Quest Learning Support: new activity"):"Side-Quest Learning Support: an update is available",text:(reference?"New enquiry reference: "+reference+"\n":"")+"Open the private portal to review the update: "+url,html:layout({preheader:"A private update is ready.",kicker:"Learning Support",heading:"You have an update",body:p("Open the private portal to review your update. No personal details are included in this email.")+button("Open portal",url),reason:"This is a service notification about a Learning Support request."})});
}
export async function guestQuotes(db:D1Database,id:string){
 const {results}=await db.prepare("SELECT id,scope,delivery,amount_cents,currency,status,created_at,expires_at,responded_at,withdrawn_at FROM support_guest_quotes WHERE request_id=? ORDER BY created_at DESC,id DESC LIMIT 100").bind(id).all<any>();
 const now=nowIso();return (results||[]).map(q=>({...q,status:q.status==="offered"&&q.expires_at<=now?"expired":q.status}));
}
export async function guestMessages(db:D1Database,id:string){return (await db.prepare("SELECT id,sender,body,created_at FROM support_guest_messages WHERE request_id=? ORDER BY created_at ASC,id ASC LIMIT 100").bind(id).all()).results||[];}
export function registerGuestSupport(app:App){
 const root="/api/support-guest";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(c.req.path===root+"/status")return next();if(!enabled(c.env))return c.json({detail:"Standalone Learning Support is not open yet."},503);await ensureGuestSchema(c.env.DB);await next();});
 app.get(root+"/status",c=>c.json({available:enabled(c.env)&&!!c.env.EMAIL}));
 app.post(root+"/link",async c=>{
  if(!c.env.EMAIL)return c.json({detail:"Email access is temporarily unavailable."},503);
  const b=await c.req.json().catch(()=>null),email=typeof b?.email==="string"?b.email.trim().toLowerCase():"";
  if(!emailOk(email))return c.json({detail:"Enter a valid parent email address."},400);
  const db=c.env.DB,ip=c.req.header("CF-Connecting-IP")||"unknown";
  const same={ok:true,message:"Check your email for a secure sign-in link. If it does not arrive, check spam or try again later."};
  if(!(await hitRateLimit(db,"guest-mail-global",60,3600)).ok||!(await hitRateLimit(db,"guest-mail-ip:"+await digest(ip),10,3600)).ok||!(await hitRateLimit(db,"guest-mail:"+await digest(email),3,3600)).ok)return c.json(same);
  const token=random();
  await db.prepare("DELETE FROM support_guest_links WHERE expires_at<=?").bind(nowIso()).run();
  await db.prepare("INSERT INTO support_guest_links(token_hash,email,expires_at) VALUES (?,?,?)").bind(await digest(token),email,expires(30*60000)).run();
  const url=guestOrigin(c.env)+"/learning-support/portal#token="+token;
  const sent=await sendEmail(c.env,{to:email,subject:"Your Side-Quest Learning Support access link",text:"Open this link, then confirm sign-in: "+url+"\nExpires in 30 minutes. Ignore if you did not request it.",html:layout({preheader:"Your private Learning Support access link.",kicker:"Learning Support",heading:"Open your private portal",body:p("This single-use link expires in 30 minutes. No subscription or homeschooling account is created.")+button("Open Learning Support",url)+p("If you did not request access, ignore this message."),reason:"You requested a Learning Support access link."})});
  if(!sent){await db.prepare("DELETE FROM support_guest_links WHERE token_hash=?").bind(await digest(token)).run();return c.json({detail:"Could not deliver an access link. Please try again later."},503);}
  return c.json(same);
 });
 app.post(root+"/redeem",async c=>{
  const b=await c.req.json().catch(()=>null);if(!valid(b?.token))return c.json({detail:"Invalid or expired link."},400);
  const db=c.env.DB,key=await digest(b.token),now=nowIso(),row=await db.prepare("SELECT email FROM support_guest_links WHERE token_hash=? AND used_at IS NULL AND expires_at>?").bind(key,now).first<{email:string}>();
  if(!row)return c.json({detail:"Invalid or expired link. Request another."},400);
  const claim=await db.prepare("UPDATE support_guest_links SET used_at=? WHERE token_hash=? AND used_at IS NULL AND expires_at>?").bind(now,key,now).run();
  if(!claim.meta?.changes)return c.json({detail:"Link already used. Request another."},400);
  const token=random();await db.prepare("DELETE FROM support_guest_sessions WHERE expires_at<=?").bind(now).run();
  await db.prepare("INSERT INTO support_guest_sessions(token_hash,email,expires_at) VALUES (?,?,?)").bind(await digest(token),row.email,expires(12*3600000)).run();
  return c.json({token,email:row.email});
 });
 // This credential is never interpreted as a Side-Quest parent/child JWT.
 const identity=async(c:any)=>{
  const token=c.req.header("X-SideQuest-Guest");if(!valid(token))return null;
  return c.env.DB.prepare("SELECT email FROM support_guest_sessions WHERE token_hash=? AND expires_at>?").bind(await digest(token),nowIso()).first() as Promise<{email:string}|null>;
 };
 app.post(root+"/logout",async c=>{const token=c.req.header("X-SideQuest-Guest");if(valid(token))await c.env.DB.prepare("DELETE FROM support_guest_sessions WHERE token_hash=?").bind(await digest(token)).run();return c.json({ok:true});});
 app.get(root+"/requests",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const rows=(await c.env.DB.prepare("SELECT id,parent_name,subject,message,status,created_at,updated_at FROM support_guest_requests WHERE email=? ORDER BY created_at DESC LIMIT 50").bind(who.email).all<any>()).results||[];
  const ids=rows.map(r=>r.id);const byQuote=new Map<string,any[]>(),byMessage=new Map<string,any[]>(),now=nowIso();
  if(ids.length){const placeholders=ids.map(()=>"?").join(",");
   const [qs,ms]=await Promise.all([c.env.DB.prepare("SELECT q.* FROM support_guest_quotes q JOIN support_guest_requests r ON r.id=q.request_id WHERE r.email=? AND q.request_id IN ("+placeholders+") ORDER BY q.created_at DESC LIMIT 5000").bind(who.email,...ids).all<any>(),c.env.DB.prepare("SELECT m.* FROM support_guest_messages m JOIN support_guest_requests r ON r.id=m.request_id WHERE r.email=? AND m.request_id IN ("+placeholders+") ORDER BY m.created_at ASC LIMIT 5000").bind(who.email,...ids).all<any>()]);
   for(const {request_id,...q} of qs.results||[]){const a=byQuote.get(request_id)||[];a.push({...q,status:q.status==="offered"&&q.expires_at<=now?"expired":q.status});byQuote.set(request_id,a);}
   for(const {request_id,...m} of ms.results||[]){const a=byMessage.get(request_id)||[];a.push(m);byMessage.set(request_id,a);}
  }
  return c.json({email:who.email,requests:rows.map(r=>({...r,quotes:byQuote.get(r.id)||[],messages:byMessage.get(r.id)||[]}))});
 });
 app.post(root+"/requests",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const b=await c.req.json().catch(()=>null);if(!b||typeof b!=="object"||Array.isArray(b))return c.json({detail:"Enter your enquiry."},400);
  const parsed=parseLearningSupport(b),name=typeof b.parent_name==="string"?b.parent_name.trim():"";
  if("error" in parsed)return c.json({detail:parsed.error},400);
  if(name.length<2||name.length>80)return c.json({detail:"Enter your name (2–80 characters)."},400);
  if(!(await loadPlatformSettings(c.env.DB)).features.registrationsOpen)return c.json({detail:"New enquiries are temporarily paused."},503);
  if(!(await hitRateLimit(c.env.DB,"guest-request:"+await digest(who.email),5,3600)).ok)return c.json({detail:"Too many enquiries. Try again later."},429);
  const id=crypto.randomUUID(),now=nowIso();
  await c.env.DB.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").bind(id,who.email,name,parsed.subject,parsed.message,now,now).run();
  try{if(c.env.OWNER_NOTIFICATION_EMAIL)await guestNotify(c.env,c.env.OWNER_NOTIFICATION_EMAIL,true,id);}catch{ /* The durable enquiry remains in Owner HQ even if email fails. */ }
  return c.json({id,status:"new"},201);
 });
 app.post(root+"/requests/:id/orders/:oid/video-token",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  if(!(await hitRateLimit(c.env.DB,"support-video-guest:"+await digest(who.email),8,60)).ok)return c.json({detail:"Try again shortly."},429);
  const r=await videoToken(c.env,"guest",id,(c.req.param("oid")??""),false);
  return "error" in r?c.json({detail:r.error},409):c.json(r);
 });
 app.get(root+"/requests/:id/orders/:oid/classroom-image/:fid",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"";
  if(!classroomEnabled(c.env)||!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first()||!await canReadClassroomImage(c.env.DB,"guest",id,oid,fid,false))return c.json({detail:"Image unavailable"},404);
  if(!(await hitRateLimit(c.env.DB,"support-image-guest:"+await digest(who.email),30,60)).ok)return c.json({detail:"Try again shortly."},429);
  const r=await readPresentedImage(c.env,fid);return r?c.json(r):c.json({detail:"Image unavailable"},404);
 });
 app.get(root+"/requests/:id/orders/:oid/classroom",async c=>{
  if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  const s=await classroomState(c.env.DB,"guest",id,(c.req.param("oid")??""),false);return s?c.json({...s,video_enabled:videoEnabled(c.env)}):c.json({detail:"Confirmed live booking required."},404);
 });
 app.post(root+"/requests/:id/orders/:oid/classroom-board",async c=>{
  if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  const b=await c.req.json().catch(()=>null);if(!b||typeof b!=="object")return c.json({detail:"Invalid action"},400);
  if(!(await hitRateLimit(c.env.DB,"support-board-guest:"+await digest(who.email),100,60)).ok)return c.json({detail:"Board is busy. Try again shortly."},429);
  const s=await editClassroom(c.env.DB,"guest",id,(c.req.param("oid")??""),false,b);return "error" in s?c.json({detail:s.error},409):c.json(s);
 });
 app.get(root+"/requests/:id/orders/:oid/files",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=c.req.param("id")??"",oid=c.req.param("oid")??"";
  if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  return c.json({files:await grantedResources(c.env.DB,"guest",id,oid)});
 });
 app.get(root+"/requests/:id/orders/:oid/files/:fid/download",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"";
  if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first()||!await getOrder(c.env.DB,"guest",id,oid))return c.json({detail:"Request not found"},404);
  if(!(await hitRateLimit(c.env.DB,"support-file-guest:"+await digest(who.email),30,60)).ok)return c.json({detail:"Try again shortly."},429);
  const r=await downloadResource(c.env,fid,oid);return r?c.json(r):c.json({detail:"Resource unavailable"},404);
 });
 app.get(root+"/requests/:id/orders",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  return c.json({orders:await listOrders(c.env.DB,"guest",id),classroom_enabled:classroomEnabled(c.env)});
 });
 app.post(root+"/requests/:id/orders/:oid/confirm",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??""),oid=(c.req.param("oid")??""),b=await c.req.json().catch(()=>null);
  const row=await c.env.DB.prepare("SELECT status FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first<{status:string}>();
  if(!row)return c.json({detail:"Request not found"},404);
  if(["closed","resolved"].includes(row.status)||b?.confirmed!==true)return c.json({detail:"Confirm the service terms and arrangements."},400);
  if(!await getOrder(c.env.DB,"guest",id,oid)||!await confirmServiceOrder(c.env.DB,"guest",id,oid))return c.json({detail:"Order unavailable."},409);
  await c.env.DB.prepare("UPDATE support_guest_requests SET seen_at=NULL,updated_at=? WHERE id=? AND email=?").bind(nowIso(),id,who.email).run();
  if(c.env.OWNER_NOTIFICATION_EMAIL)await guestNotify(c.env,c.env.OWNER_NOTIFICATION_EMAIL,true);
  return c.json({ok:true});
 });
 app.get(root+"/requests/:id/quotes/:qid/plan",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  return c.json({plan:await readQuotePlan(c.env.DB,"guest",id,(c.req.param("qid")??""))});
 });
 app.get(root+"/requests/:id/quotes",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??"");if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  return c.json({quotes:await guestQuotes(c.env.DB,id)});
 });
 app.post(root+"/requests/:id/quotes/:qid/respond",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??""),b=await c.req.json().catch(()=>null),now=nowIso();
  if(!b||!["interested","declined"].includes(b.response)||b.confirmed!==true)return c.json({detail:"Confirm your response."},400);
  if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=? AND email=?").bind(id,who.email).first())return c.json({detail:"Request not found"},404);
  const r=await c.env.DB.prepare("UPDATE support_guest_quotes SET status=?,responded_at=? WHERE id=? AND request_id=? AND status='offered' AND expires_at>? AND EXISTS(SELECT 1 FROM support_guest_requests WHERE id=support_guest_quotes.request_id AND email=? AND status NOT IN ('closed','resolved'))").bind(b.response,now,(c.req.param("qid")??""),id,now,who.email).run();
  if(!r.meta?.changes)return c.json({detail:"Proposal is no longer open."},409);
  await c.env.DB.prepare("UPDATE support_guest_requests SET seen_at=NULL,updated_at=? WHERE id=? AND email=?").bind(now,id,who.email).run();
  if(c.env.OWNER_NOTIFICATION_EMAIL)await guestNotify(c.env,c.env.OWNER_NOTIFICATION_EMAIL,true);
  return c.json({ok:true});
 });
 app.post(root+"/requests/:id/messages",async c=>{
  const who=await identity(c);if(!who)return c.json({detail:"Request a new email access link."},401);
  const id=(c.req.param("id")??""),b=await c.req.json().catch(()=>null),message=typeof b?.message==="string"?b.message.trim():"",now=nowIso();
  if(message.length<2||message.length>2000)return c.json({detail:"Write 2–2000 characters."},400);
  if(!(await hitRateLimit(c.env.DB,"guest-message:"+await digest(who.email),15,3600)).ok)return c.json({detail:"Too many messages."},429);
  const r=await c.env.DB.prepare("INSERT INTO support_guest_messages(id,request_id,sender,body,created_at) SELECT ?,id,'parent',?,? FROM support_guest_requests WHERE id=? AND email=? AND status NOT IN ('closed','resolved') AND (SELECT COUNT(*) FROM support_guest_messages WHERE request_id=?)<100").bind(crypto.randomUUID(),message,now,id,who.email,id).run();
  if(!r.meta?.changes)return c.json({detail:"Request unavailable or thread full."},404);
  await c.env.DB.prepare("UPDATE support_guest_requests SET seen_at=NULL,updated_at=? WHERE id=? AND email=?").bind(now,id,who.email).run();
  if(c.env.OWNER_NOTIFICATION_EMAIL)await guestNotify(c.env,c.env.OWNER_NOTIFICATION_EMAIL,true);
  return c.json({ok:true},201);
 });
}
