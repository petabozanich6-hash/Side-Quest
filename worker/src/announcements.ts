/**
 * Manual Owner HQ announcements. Optional news is opt-in only; service notices
 * are non-promotional account/service information for participating families.
 * Never sends child emails or accepts imported recipient lists.
 */
import type { App, Guards, Env } from "./types";
import { esc, layout, p, button, sendEmail, SITE_URL, SUPPORT_EMAIL } from "./email";

export type AnnouncementKind = "service" | "optional";
const active = "COALESCE(fs.status,'active')='active' AND f.plan NOT IN ('CANCELLED','PREVIEW_EXPIRED') AND (f.plan!='FREE_PREVIEW' OR f.trial_ends_at IS NULL OR f.trial_ends_at>?) AND u.email LIKE '%@%.%' AND u.email NOT LIKE '% %' AND (u.email_verification_required_at IS NULL OR u.email_verified_at IS NOT NULL)";
const source = " FROM users u JOIN families f ON f.id=u.family_id LEFT JOIN family_admin_state fs ON fs.family_id=f.id LEFT JOIN announcement_email_preferences ap ON ap.user_id=u.id WHERE "+active;
const ddl = [
  "CREATE TABLE IF NOT EXISTS announcement_email_preferences (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,opted_in INTEGER NOT NULL DEFAULT 0,opted_in_at TEXT,consent_source TEXT,unsubscribe_token TEXT NOT NULL UNIQUE,updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS announcement_broadcasts (id TEXT PRIMARY KEY,idempotency_key TEXT NOT NULL UNIQUE,kind TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,owner_id TEXT NOT NULL,created_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'queued',finished_at TEXT)",
  "CREATE TABLE IF NOT EXISTS announcement_recipients (broadcast_id TEXT NOT NULL REFERENCES announcement_broadcasts(id) ON DELETE CASCADE,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,email TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'queued',claimed_at TEXT,sent_at TEXT,PRIMARY KEY(broadcast_id,user_id))",
  "CREATE INDEX IF NOT EXISTS idx_ann_queued ON announcement_recipients(status,broadcast_id)",
  "CREATE INDEX IF NOT EXISTS idx_ann_recent ON announcement_broadcasts(created_at DESC)"
];
export async function ensureAnnouncementSchema(db:D1Database) {
  for (const sql of ddl) await db.prepare(sql).run();
}
export async function audienceCount(db:D1Database,kind:AnnouncementKind,now=new Date()) {
  const opt=kind==="optional"?" AND ap.opted_in=1":"";
  const r=await db.prepare("SELECT COUNT(*) n"+source+opt).bind(now.toISOString()).first<{n:number}>();
  return Number(r?.n||0);
}
export function validateAnnouncement(b:Record<string,unknown>) {
  const kind=b.kind,subject=typeof b.subject==="string"?b.subject.trim():"",body=typeof b.body==="string"?b.body.trim():"";
  if(kind!=="service"&&kind!=="optional")return {ok:false as const,detail:"Choose a service notice or an optional announcement."};
  if(subject.length<6||subject.length>140)return {ok:false as const,detail:"The subject must be 6–140 characters."};
  if(body.length<20||body.length>6000)return {ok:false as const,detail:"The message must be 20–6000 characters."};
  return {ok:true as const,kind:kind as AnnouncementKind,subject,body};
}
export function announcementEmail(kind:AnnouncementKind,subject:string,body:string,unsubscribeUrl:string) {
  const reason=kind==="optional"
    ?"You explicitly opted in to occasional Side-Quest news. You may unsubscribe at any time."
    :"This non-promotional service notice concerns your existing Side-Quest account. Optional news is managed separately.";
  return {
    subject,
    text:body+"\n\nSide-Quest Learning | "+SUPPORT_EMAIL+"\n"+reason+"\nStop optional news: "+unsubscribeUrl,
    html:layout({preheader:subject,kicker:"News from the quest board.",heading:subject,
      body:p(esc(body).replace(/\r\n?/g,"\n").replace(/\n/g,"<br/>"))+
        button("Visit your Parent Hub",SITE_URL+"/parent")+
        p("<strong>Side-Quest Learning</strong> · "+SUPPORT_EMAIL)+
        p(reason)+p('<a href="'+esc(unsubscribeUrl)+'">Unsubscribe from optional announcements</a>'),
      reason:"Sent by Side-Quest Learning to eligible parent accounts."}),
  };
}
/** Atomic recipient snapshot plus unique idempotency key: browser retries cannot resend. */
export async function queueAnnouncement(db:D1Database,ownerId:string,input:{
  kind:AnnouncementKind;subject:string;body:string;idempotency_key:string;expected_recipients:number
},now=new Date()) {
  const existing=await db.prepare("SELECT id FROM announcement_broadcasts WHERE idempotency_key=?")
    .bind(input.idempotency_key).first<{id:string}>();
  if(existing)return {id:existing.id,existing:true};
  const count=await audienceCount(db,input.kind,now);
  if(count===0)return {error:"There are no eligible parent email recipients."};
  if(count!==input.expected_recipients)return {error:"The number of recipients has changed. Preview the audience again."};
  if(count>10000)return {error:"Recipient count exceeds the safety limit of 10,000."};
  const recent=await db.prepare("SELECT COUNT(*) n FROM announcement_broadcasts WHERE created_at>?")
    .bind(new Date(now.getTime()-24*3600000).toISOString()).first<{n:number}>();
  if(Number(recent?.n||0)>=3)return {error:"Up to three special broadcasts may be queued per 24 hours."};
  const id=crypto.randomUUID(),stamp=now.toISOString();
  const audienceBase=" FROM users u JOIN families f ON f.id=u.family_id LEFT JOIN family_admin_state fs ON fs.family_id=f.id WHERE "+active;
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO announcement_email_preferences(user_id,opted_in,opted_in_at,consent_source,unsubscribe_token,updated_at) SELECT u.id,0,NULL,NULL,lower(hex(randomblob(16))),?"+audienceBase).bind(stamp,stamp),
    db.prepare("INSERT INTO announcement_broadcasts(id,idempotency_key,kind,subject,body,owner_id,created_at,status) VALUES(?,?,?,?,?,?,?,'queued')")
      .bind(id,input.idempotency_key,input.kind,input.subject,input.body,ownerId,stamp),
    db.prepare("INSERT INTO announcement_recipients(broadcast_id,user_id,email,status) SELECT ?,u.id,lower(u.email),'queued'"+source+(input.kind==="optional"?" AND ap.opted_in=1":""))
      .bind(id,stamp),
  ]);
  return {id,existing:false,count};
}
export async function listAnnouncements(db:D1Database) {
  const {results}=await db.prepare(
    "SELECT b.id,b.kind,b.subject,b.status,b.created_at,b.finished_at,COUNT(r.user_id) recipients,"+
    "SUM(CASE WHEN r.status='sent' THEN 1 ELSE 0 END) sent,"+
    "SUM(CASE WHEN r.status='queued' THEN 1 ELSE 0 END) queued,"+
    "SUM(CASE WHEN r.status='sending' THEN 1 ELSE 0 END) sending,"+
    "SUM(CASE WHEN r.status='failed' THEN 1 ELSE 0 END) failed,"+
    "SUM(CASE WHEN r.status='skipped' THEN 1 ELSE 0 END) skipped "+
    "FROM announcement_broadcasts b LEFT JOIN announcement_recipients r ON r.broadcast_id=b.id "+
    "GROUP BY b.id ORDER BY b.created_at DESC LIMIT 30"
  ).all();
  return results??[];
}
export async function cancelAnnouncement(db:D1Database,id:string) {
  const row=await db.prepare("SELECT status FROM announcement_broadcasts WHERE id=?").bind(id).first<{status:string}>();
  if(!row||row.status==="completed"||row.status==="cancelled")return false;
  await db.batch([
    db.prepare("UPDATE announcement_broadcasts SET status='cancelled',finished_at=? WHERE id=? AND status IN ('queued','sending')").bind(new Date().toISOString(),id),
    db.prepare("UPDATE announcement_recipients SET status='skipped' WHERE broadcast_id=? AND status='queued'").bind(id),
  ]);
  return true;
}
/** A maximum of 12 attempts per five-minute scheduled run. No automatic retries of ambiguous deliveries. */
export async function processAnnouncementBatch(env:Env,max=12,now=new Date()) {
  if(!env.DB||!env.EMAIL)return {processed:0,unconfigured:!env.EMAIL};
  await ensureAnnouncementSchema(env.DB);
  const {results}=await env.DB.prepare(
    "SELECT r.broadcast_id,r.user_id,r.email,b.subject,b.body,b.kind FROM announcement_recipients r "+
    "JOIN announcement_broadcasts b ON b.id=r.broadcast_id WHERE r.status='queued' "+
    "AND b.status IN ('queued','sending') ORDER BY b.created_at,r.user_id LIMIT ?"
  ).bind(Math.max(1,Math.min(12,max))).all<any>();
  let processed=0;
  for(const r of results??[]){
    const claim=await env.DB.prepare(
      "UPDATE announcement_recipients SET status='sending',claimed_at=? WHERE broadcast_id=? AND user_id=? AND status='queued' "+
      "AND EXISTS(SELECT 1 FROM announcement_broadcasts WHERE id=? AND status IN ('queued','sending'))"
    ).bind(now.toISOString(),r.broadcast_id,r.user_id,r.broadcast_id).run();
    if(!claim.meta?.changes)continue;
    await env.DB.prepare("UPDATE announcement_broadcasts SET status='sending' WHERE id=? AND status='queued'").bind(r.broadcast_id).run();
    try{
      const pref=await env.DB.prepare(
        "SELECT p.opted_in,p.unsubscribe_token,COALESCE(fs.status,'active') family_status,f.plan,f.trial_ends_at,u.email_verification_required_at,u.email_verified_at "+
        "FROM users u JOIN families f ON f.id=u.family_id "+
        "LEFT JOIN family_admin_state fs ON fs.family_id=f.id "+
        "LEFT JOIN announcement_email_preferences p ON p.user_id=u.id WHERE u.id=? AND lower(u.email)=?"
      ).bind(r.user_id,r.email).first<any>();
      if(!pref || pref.family_status!=="active" || (pref.email_verification_required_at && !pref.email_verified_at) || pref.plan==="CANCELLED" || pref.plan==="PREVIEW_EXPIRED" ||
        (pref.plan==="FREE_PREVIEW" && pref.trial_ends_at && pref.trial_ends_at<=new Date().toISOString()) ||
        (r.kind==="optional"&&Number(pref.opted_in)!==1)) {
        await env.DB.prepare("UPDATE announcement_recipients SET status='skipped' WHERE broadcast_id=? AND user_id=?")
          .bind(r.broadcast_id,r.user_id).run();
      }else {
        const unsubscribe=SITE_URL+"/api/announcements/unsubscribe?token="+encodeURIComponent(pref.unsubscribe_token);
        const result=await sendEmail(env,{to:r.email,...announcementEmail(r.kind,r.subject,r.body,unsubscribe)});
        await env.DB.prepare("UPDATE announcement_recipients SET status=?,sent_at=? WHERE broadcast_id=? AND user_id=?")
          .bind(result?"sent":"failed",result?new Date().toISOString():null,r.broadcast_id,r.user_id).run();
      }
    }catch{
      await env.DB.prepare("UPDATE announcement_recipients SET status='failed' WHERE broadcast_id=? AND user_id=?")
        .bind(r.broadcast_id,r.user_id).run();
    }
    processed++;
  }
  await env.DB.prepare(
    "UPDATE announcement_broadcasts SET status='completed',finished_at=? WHERE status IN ('queued','sending') "+
    "AND NOT EXISTS(SELECT 1 FROM announcement_recipients r WHERE r.broadcast_id=announcement_broadcasts.id AND r.status IN ('queued','sending'))"
  ).bind(new Date().toISOString()).run();
  return {processed,unconfigured:false};
}
function page(msg:string,token?:string) {
  const form=token?'<form method="post" action="/api/announcements/unsubscribe"><input type="hidden" name="token" value="'+esc(token)+'"/><button style="background:#1F3B2D;color:white;border:0;border-radius:24px;padding:12px 20px">Unsubscribe</button></form>':"";
  return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Side-Quest email preferences</title><main style="max-width:530px;margin:10vh auto;padding:24px;font:16px Arial,sans-serif;color:#1F3B2D"><img src="'+SITE_URL+'/icons/icon-192.png" width="64" height="64" alt="Side-Quest logo"><h1>Email preferences</h1><p>'+esc(msg)+'</p>'+form+'</main></html>';
}
export function registerAnnouncementPreferences(app:App,guards:Guards) {
  app.get("/api/announcements/preferences",guards.auth,guards.parent,async c=>{
    await ensureAnnouncementSchema(c.env.DB);
    const r=await c.env.DB.prepare("SELECT opted_in,opted_in_at FROM announcement_email_preferences WHERE user_id=?")
      .bind(c.get("user").id).first<any>();
    c.header("Cache-Control","no-store");
    return c.json({optional_announcements:!!r?.opted_in,consented_at:r?.opted_in_at??null});
  });
  app.post("/api/announcements/preferences",guards.auth,guards.parent,async c=>{
    const b=await c.req.json().catch(()=>null);
    if(typeof b?.optional_announcements!=="boolean")return c.json({detail:"Specify an optional announcements preference."},400);
    await ensureAnnouncementSchema(c.env.DB);
    const stamp=new Date().toISOString(),opt=b.optional_announcements?1:0;
    await c.env.DB.prepare(
      "INSERT INTO announcement_email_preferences(user_id,opted_in,opted_in_at,consent_source,unsubscribe_token,updated_at) VALUES(?,?,?,?,lower(hex(randomblob(16))),?) "+
      "ON CONFLICT(user_id) DO UPDATE SET opted_in=excluded.opted_in,opted_in_at=excluded.opted_in_at,consent_source=excluded.consent_source,updated_at=excluded.updated_at"
    ).bind(c.get("user").id,opt,opt?stamp:null,opt?"parent_hub_express":null,stamp).run();
    return c.json({ok:true,optional_announcements:!!opt});
  });
  app.get("/api/announcements/unsubscribe",async c=>{
    await ensureAnnouncementSchema(c.env.DB);
    const token=c.req.query("token")||"";
    c.header("Cache-Control","no-store");c.header("Referrer-Policy","no-referrer");
    const exists=/^[a-f0-9]{32}$/.test(token)
      ? await c.env.DB.prepare("SELECT user_id FROM announcement_email_preferences WHERE unsubscribe_token=?").bind(token).first()
      : null;
    return c.html(page(exists?"Confirm that you no longer wish to receive optional Side-Quest announcements. Essential service notices are separate.":"This link is invalid.",exists?token:undefined));
  });
  // An email scanner can prefetch GETs: only a form POST changes consent.
  app.post("/api/announcements/unsubscribe",async c=>{
    await ensureAnnouncementSchema(c.env.DB);
    const token=new URLSearchParams(await c.req.text()).get("token")||"";
    c.header("Cache-Control","no-store");c.header("Referrer-Policy","no-referrer");
    if(!/^[a-f0-9]{32}$/.test(token))return c.html(page("Invalid unsubscribe link."),400);
    await c.env.DB.prepare("UPDATE announcement_email_preferences SET opted_in=0,opted_in_at=NULL,consent_source=NULL,updated_at=? WHERE unsubscribe_token=?")
      .bind(new Date().toISOString(),token).run();
    return c.html(page("You've been unsubscribed from optional announcements. Essential account notices are unaffected."));
  });
}
