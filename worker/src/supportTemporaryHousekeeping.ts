import type {Env} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
const localDate=(now:Date)=>{const p=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now).map(v=>[v.type,v.value]));return p.year+"-"+p.month+"-"+p.day;};
export const TEMPORARY_CLEANUP_LIMIT=500;
export function temporaryHousekeepingEnabled(e:Env){
 return unifiedPortalPilot(e)&&e.SUPPORT_TEMPORARY_HOUSEKEEPING_TEST==="true";
}
/** Only already-invalid guest credentials. Never deletes enquiries, payment records,
 * learning records, files, invitations, or audit history. Atomic D1 batch means the
 * daily claim, bounded deletes and aggregate counts commit together or not at all. */
export async function runTemporaryHousekeeping(e:Env,now=new Date()){
 if(!temporaryHousekeepingEnabled(e))return "disabled";
 const db=e.DB,at=now.toISOString(),day=localDate(now),id=crypto.randomUUID();
 if(!await db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_temporary_housekeeping_runs'").first())return "migration_required";
 const guard="EXISTS(SELECT 1 FROM support_temporary_housekeeping_runs WHERE local_date=? AND run_id=? AND status='running')";
 try{
  const result=await db.batch([
   db.prepare("INSERT OR IGNORE INTO support_temporary_housekeeping_runs(local_date,run_id,status,attempted_at) VALUES(?,?,'running',?)").bind(day,id,at),
   db.prepare("DELETE FROM support_guest_links WHERE expires_at<=? AND token_hash IN (SELECT token_hash FROM support_guest_links WHERE expires_at<=? ORDER BY expires_at,token_hash LIMIT ?) AND "+guard).bind(at,at,TEMPORARY_CLEANUP_LIMIT,day,id),
   db.prepare("UPDATE support_temporary_housekeeping_runs SET links_removed=changes() WHERE local_date=? AND run_id=? AND status='running'").bind(day,id),
   db.prepare("DELETE FROM support_guest_sessions WHERE expires_at<=? AND token_hash IN (SELECT token_hash FROM support_guest_sessions WHERE expires_at<=? ORDER BY expires_at,token_hash LIMIT ?) AND "+guard).bind(at,at,TEMPORARY_CLEANUP_LIMIT,day,id),
   db.prepare("UPDATE support_temporary_housekeeping_runs SET sessions_removed=changes(),status='complete',finished_at=? WHERE local_date=? AND run_id=? AND status='running'").bind(at,day,id)
  ]);
  return result[0]?.meta?.changes?"complete":"duplicate";
 }catch{
  // A response failure may conceal a committed batch. Never overwrite a committed result.
  await db.prepare("INSERT OR IGNORE INTO support_temporary_housekeeping_runs(local_date,run_id,status,attempted_at,finished_at) VALUES(?,?,'review',?,?)").bind(day,id,at,at).run();
  return "review";
 }
}
export async function temporaryHousekeepingStatus(e:Env){
 try{
  const last=await e.DB.prepare("SELECT local_date,status,attempted_at,finished_at,links_removed,sessions_removed FROM support_temporary_housekeeping_runs ORDER BY local_date DESC LIMIT 1").first();
  return {enabled:temporaryHousekeepingEnabled(e),available:true,last};
 }catch{return {enabled:temporaryHousekeepingEnabled(e),available:false,last:null};}
}
