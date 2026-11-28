import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {hitRateLimit} from "./adminAudit";
import {academyProgramme} from "./writersAcademy";
import {academyExperience} from "./academyExperiences";
const id=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(v);
const audience=(v:unknown)=>v==="minor"||v==="adult";
const text=(v:unknown,max:number):v is string=>typeof v==="string"&&v.length<=max&&!v.includes("\u0000");
const scope="user_id=? AND family_id=? AND audience=? AND participant_id=? AND class_id=?";
const adultScope="(audience='minor' OR ?=1)";
const actorArgs=(a:AuthUser,b:any)=>[a.id,a.family_id,b.audience,b.participant_id,b.class_id];
export async function listAcademyJournal(db:D1Database,a:AuthUser,allowAdult:boolean){
 if(!await verifiedPortalIdentity(db,a))return null;
 const rows=(await db.prepare("SELECT j.audience,j.participant_id,j.participant_name,j.round_id,j.programme_id,j.programme_title,j.class_id,j.sequence,j.topic,j.start_at,e.title,e.body,e.reflection,e.revision,e.updated_at FROM support_academy_journal_access j LEFT JOIN support_academy_journal_entries e ON e.user_id=j.user_id AND e.family_id=j.family_id AND e.audience=j.audience AND e.participant_id=j.participant_id AND e.class_id=j.class_id WHERE j.user_id=? AND j.family_id=? AND (j.audience='minor' OR ?=1) ORDER BY j.start_at,j.participant_id LIMIT 200").bind(a.id,a.family_id,allowAdult?1:0).all<any>()).results||[];
 return rows.map(r=>({...r,programme_label:academyProgramme(r.programme_id)?.title||r.programme_title,prompt:academyExperience(r.programme_id,r.topic)?.question||"What will you try in your own story?",revision:r.revision??0}));
}
export async function saveAcademyJournal(db:D1Database,a:AuthUser,b:any,allowAdult:boolean,now=new Date()){
 if(!await verifiedPortalIdentity(db,a)||!b||!audience(b.audience)||!id(b.participant_id)||!id(b.class_id)||!Number.isSafeInteger(b.revision)||b.revision<0||!text(b.title,120)||!text(b.body,12000)||!text(b.reflection,2000)||b.audience==="adult"&&!allowAdult)return {error:"Invalid journal entry."};
 const args=actorArgs(a,b),at=now.toISOString();
 const access=()=>db.prepare("SELECT 1 FROM support_academy_journal_access WHERE "+scope+" AND "+adultScope).bind(...args,allowAdult?1:0).first();
 if(!await access())return {error:"This workshop journal is unavailable."};
 const result=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_academy_journal_entries(user_id,family_id,audience,participant_id,class_id,title,body,reflection,updated_at) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM support_academy_journal_access WHERE "+scope+" AND "+adultScope+")").bind(...args,b.title,b.body,b.reflection,at,...args,allowAdult?1:0).run():await db.prepare("UPDATE support_academy_journal_entries SET title=?,body=?,reflection=?,revision=revision+1,updated_at=? WHERE "+scope+" AND revision=? AND EXISTS(SELECT 1 FROM support_academy_journal_access WHERE "+scope+" AND "+adultScope+")").bind(b.title,b.body,b.reflection,at,...args,b.revision,...args,allowAdult?1:0).run();
 if(!result.meta?.changes)return {error:"This entry changed or access ended. Reload before saving; keep a copy of your draft."};
 return {saved:true,revision:b.revision+1,updated_at:at};
}
export async function deleteAcademyJournal(db:D1Database,a:AuthUser,b:any){
 if(!await verifiedPortalIdentity(db,a)||!b||b.confirmed!==true||!audience(b.audience)||!id(b.participant_id)||!id(b.class_id)||!Number.isSafeInteger(b.revision)||b.revision<1)return false;
 return !!(await db.prepare("DELETE FROM support_academy_journal_entries WHERE "+scope+" AND revision=?").bind(...actorArgs(a,b),b.revision).run()).meta?.changes;
}
export function registerAcademyJournal(app:App,g:Guards){
 const root="/api/family-portal/academy-journal";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","private, no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/entries",g.auth,g.parent,async c=>{
  const a=c.get("user"),who=await verifiedPortalIdentity(c.env.DB,a);
  if(!who)return c.json({detail:"Verified account required."},403);
  const adult=!!c.env.SUPPORT_UNIFIED_TEST_EMAIL&&who.email.trim().toLowerCase()===c.env.SUPPORT_UNIFIED_TEST_EMAIL.trim().toLowerCase();
  return c.json({entries:await listAcademyJournal(c.env.DB,a,adult)});
 });
 app.post(root+"/save",g.auth,g.parent,async c=>{
  const a=c.get("user"),who=await verifiedPortalIdentity(c.env.DB,a);
  if(!who)return c.json({detail:"Verified account required."},403);
  if(!(await hitRateLimit(c.env.DB,"academy-journal:"+a.id,120,3600)).ok)return c.json({detail:"Try again later."},429);
  const adult=!!c.env.SUPPORT_UNIFIED_TEST_EMAIL&&who.email.trim().toLowerCase()===c.env.SUPPORT_UNIFIED_TEST_EMAIL.trim().toLowerCase();
  const r=await saveAcademyJournal(c.env.DB,a,await c.req.json().catch(()=>null),adult);
  return "error" in r?c.json({detail:r.error},409):c.json(r);
 });
 app.post(root+"/delete",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!(await hitRateLimit(c.env.DB,"academy-journal-delete:"+a.id,30,3600)).ok)return c.json({detail:"Try again later."},429);
  return await deleteAcademyJournal(c.env.DB,a,await c.req.json().catch(()=>null))?c.json({deleted:true}):c.json({detail:"Entry unavailable or changed."},409);
 });
}
