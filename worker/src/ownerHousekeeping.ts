import {temporaryHousekeepingStatus} from "./supportTemporaryHousekeeping";
import type {Env} from "./types";
import {loadPlatformSettings,aiRequestsLast24h} from "./platformSettings";
import {aiCostSummary} from "./aiCost";
const SQL="CREATE TABLE IF NOT EXISTS owner_housekeeping_checks (kind TEXT PRIMARY KEY CHECK(kind IN ('d1_restore','r2_restore','cloudflare_billing')), checked_at TEXT NOT NULL)";
const checks=["d1_restore","r2_restore","cloudflare_billing"] as const;
const names={d1_restore:"Independent D1 backup and restore check",r2_restore:"Independent R2 backup and restore check",cloudflare_billing:"Cloudflare dashboard billing review"};
async function ensure(db:D1Database){await db.prepare(SQL).run();}
export async function recordHousekeepingCheck(db:D1Database,b:any,now=new Date()){
 if(b?.confirmed!==true||!checks.includes(b.kind))return false;
 await ensure(db);await db.prepare("INSERT INTO owner_housekeeping_checks(kind,checked_at) VALUES(?,?) ON CONFLICT(kind) DO UPDATE SET checked_at=excluded.checked_at").bind(b.kind,now.toISOString()).run();return true;
}
export async function housekeepingChecks(db:D1Database){
 await ensure(db);return (await db.prepare("SELECT kind,checked_at FROM owner_housekeeping_checks").all<{kind:string;checked_at:string}>()).results||[];
}
export async function housekeepingSections(e:Env,now=new Date()){
 const db=e.DB,when=now.toISOString(),yesterday=new Date(now.getTime()-86400000).toISOString(),week=new Date(now.getTime()-7*86400000).toISOString(),stale=new Date(now.getTime()-20*60000).toISOString();
 // A missing migration or failed query is unknown, not a falsely reassuring zero.
 const count=async(sql:string,...args:string[])=>{try{return Number((await db.prepare(sql).bind(...args).first<{n:number}>())?.n??0);}catch{return null;}};
 const metric=(n:number|null,label:string)=>n===null?label+": unavailable — check HQ":label+": "+n;
 const [errors,failed,stuck,expiredLinks,expiredSessions,expiredQuotes,expiredOffers,oldClosed,archived,bytes,rooms,missed,manual]=await Promise.all([
  count("SELECT COUNT(*) n FROM app_errors WHERE created_at>=? AND status>=500",yesterday),
  count("SELECT COUNT(*) n FROM lesson_batch_items i JOIN lesson_batches b ON b.id=i.batch_id AND b.family_id=i.family_id WHERE b.dismissed_at IS NULL AND i.status='failed'"),
  count("SELECT COUNT(*) n FROM lesson_batch_items i JOIN lesson_batches b ON b.id=i.batch_id AND b.family_id=i.family_id WHERE b.dismissed_at IS NULL AND i.status='generating' AND i.updated_at<?",stale),
  count("SELECT COUNT(*) n FROM support_guest_links WHERE expires_at<=?",when),
  count("SELECT COUNT(*) n FROM support_guest_sessions WHERE expires_at<=?",when),
  count("SELECT (SELECT COUNT(*) FROM learning_support_quotes WHERE status IN ('offered','interested') AND expires_at<=?)+(SELECT COUNT(*) FROM support_guest_quotes WHERE status IN ('offered','interested') AND expires_at<=?) n",when,when),
  count("SELECT COUNT(*) n FROM support_slot_offers WHERE expires_at<=?",when),
  count("SELECT (SELECT COUNT(*) FROM parent_feedback WHERE page_hint='learning-support' AND status IN ('closed','resolved') AND updated_at<?)+(SELECT COUNT(*) FROM support_guest_requests WHERE status IN ('closed','resolved') AND updated_at<?) n",week,week),
  count("SELECT COUNT(*) n FROM support_files WHERE status='archived'"),
  count("SELECT COALESCE(SUM(size_bytes),0) n FROM support_files WHERE status IN ('active','archived')"),
  count("SELECT COUNT(*) n FROM support_video_rooms WHERE status IN ('review','closing') OR (status<>'closed' AND expires_at<=?)",when),
  count("SELECT COUNT(*) n FROM support_briefing_delivery WHERE status<>'sent' AND attempted_at<? AND attempted_at>=?",stale,week),
  housekeepingChecks(db).catch(()=>null)
 ]);
 let aiLines=["AI usage information unavailable — check Owner HQ."];
 try{
  const settings=await loadPlatformSettings(db,{fresh:true});
  const usage=await aiRequestsLast24h(db,now);
  const cost=await aiCostSummary(db,now);
  aiLines=["AI lesson requests in last 24 hours: "+usage+" / "+settings.costSafeguards.aiDailyPlatformCap+" configured cap (resource drafts have separate limits).",cost.tracking_started_at?"Recorded AI inference estimate, last 24 hours: US$"+cost.estimated_gross_24h_usd.toFixed(4)+" before allowances; not the Cloudflare invoice.":"No AI inference tracking records yet.", "Unpriced tracked calls in last 30 days: "+cost.unpriced_calls_30d, "Maintenance notice: "+(settings.maintenance.enabled?"ON":"off")];
 }catch{}
 const cleanup=await temporaryHousekeepingStatus(e);
 const last=cleanup.last as {local_date:string;status:string;links_removed:number;sessions_removed:number}|null;
 const cleanupLines=[cleanup.enabled?"Expired credential cleanup: private staging test enabled.":"Expired credential cleanup: automatic pilot disabled.",!cleanup.available?"Cleanup history unavailable — check migrations.":last?"Last recorded cleanup: "+last.local_date+" · "+last.status+" · "+last.links_removed+" expired links and "+last.sessions_removed+" expired sessions removed.":"No cleanup runs recorded."];
 const manualLines=checks.map(kind=>{
  const r=manual?.find(x=>x.kind===kind);if(!r)return names[kind]+": no owner-verified check recorded";
  const age=Math.max(0,Math.floor((now.getTime()-Date.parse(r.checked_at))/86400000));
  return names[kind]+": owner recorded "+r.checked_at.slice(0,10)+" ("+age+" day(s) ago). This is an attestation, not automated verification.";
 });
 return [
  {heading:"Platform health and running costs",lines:[metric(errors,"Recorded server errors in last 24 hours"),metric(failed,"Open lesson draft items failed"),metric(stuck,"Open draft items generating over 20 minutes"),metric(rooms,"Video rooms needing cleanup/review"),metric(missed,"Earlier briefing deliveries needing review (last 7 days)"),...aiLines,"Review errors and failed jobs in Owner HQ before retrying. Cloudflare-wide outages and actual invoices are not monitored by this email."]},
  {heading:"Housekeeping and storage",lines:[...cleanupLines,metric(expiredLinks,"Expired guest access links retained"),metric(expiredSessions,"Expired guest sessions retained"),metric(expiredQuotes,"Expired open-status quotes retained"),metric(expiredOffers,"Expired appointment invitations retained"),metric(oldClosed,"Closed/resolved support enquiries older than 7 days (review only)"),metric(archived,"Archived teaching files retained"),bytes===null?"Teaching file size unavailable": "Recorded teaching file size (active and archived): "+(bytes/1048576).toFixed(2)+" MiB; not total R2 usage.","These are review counts, not deletion instructions. Keep educational, financial and customer records according to retention requirements."]},
  {heading:"Backups and external checks",lines:[...manualLines,"Only mark a backup checked after an independent copy has passed a restore test. Check actual Cloudflare storage, billing and service health in its dashboard."]}
 ];
}
