import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {hitRateLimit} from "./adminAudit";
const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(v);
const str=(v:unknown,max:number):v is string=>typeof v==="string"&&v.length<=max&&!v.includes("\u0000");
const scope="user_id=? AND family_id=? AND audience=? AND participant_id=? AND round_id=?";
const args=(a:AuthUser,b:any)=>[a.id,a.family_id,b.audience,b.participant_id,b.round_id];
const valid=(b:any)=>b&&(b.audience==="minor"||b.audience==="adult")&&validId(b.participant_id)&&validId(b.round_id);
const accessSql="SELECT 1 FROM support_academy_journal_access WHERE "+scope+" AND (audience='minor' OR ?=1)";
export async function listAcademyShowcases(db:D1Database,a:AuthUser,adult:boolean){
 if(!await verifiedPortalIdentity(db,a))return null;
 return (await db.prepare("SELECT s.audience,s.participant_id,s.round_id,s.title,s.byline,s.blurb,s.body,s.reflection,s.cover,s.revision,s.updated_at FROM support_academy_showcases s WHERE s.user_id=? AND s.family_id=? AND (s.audience='minor' OR ?=1) AND EXISTS(SELECT 1 FROM support_academy_journal_access j WHERE j.user_id=s.user_id AND j.family_id=s.family_id AND j.audience=s.audience AND j.participant_id=s.participant_id AND j.round_id=s.round_id) ORDER BY s.updated_at DESC LIMIT 100").bind(a.id,a.family_id,adult?1:0).all()).results||[];
}
export async function saveAcademyShowcase(db:D1Database,a:AuthUser,b:any,adult:boolean,now=new Date()){
 if(!await verifiedPortalIdentity(db,a)||!valid(b)||b.audience==="adult"&&!adult||!Number.isSafeInteger(b.revision)||b.revision<0||!str(b.title,120)||!str(b.byline,80)||!str(b.blurb,1800)||!str(b.body,36000)||!str(b.reflection,2000)||!["portal","moon","manuscript"].includes(b.cover))return {error:"Invalid showcase draft."};
 const identity=args(a,b),fields=[b.title,b.byline,b.blurb,b.body,b.reflection,b.cover],at=now.toISOString(),allowed=[...identity,adult?1:0];
 const result=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_academy_showcases(user_id,family_id,audience,participant_id,round_id,title,byline,blurb,body,reflection,cover,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS("+accessSql+")").bind(...identity,...fields,at,...allowed).run():await db.prepare("UPDATE support_academy_showcases SET title=?,byline=?,blurb=?,body=?,reflection=?,cover=?,updated_at=?,revision=revision+1 WHERE "+scope+" AND revision=? AND EXISTS("+accessSql+")").bind(...fields,at,...identity,b.revision,...allowed).run();
 return result.meta?.changes?{saved:true,revision:b.revision+1,updated_at:at}:{error:"Your showcase changed or workshop access ended. Keep a copy before reloading."};
}
export async function deleteAcademyShowcase(db:D1Database,a:AuthUser,b:any){
 if(!await verifiedPortalIdentity(db,a)||!valid(b)||b.confirmed!==true||!Number.isSafeInteger(b.revision)||b.revision<1)return false;
 return !!(await db.prepare("DELETE FROM support_academy_showcases WHERE "+scope+" AND revision=?").bind(...args(a,b),b.revision).run()).meta?.changes;
}
export function registerAcademyShowcase(app:App,g:Guards){
 const root="/api/family-portal/academy-showcase";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","private, no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/drafts",g.auth,g.parent,async c=>{
  const a=c.get("user"),who=await verifiedPortalIdentity(c.env.DB,a);if(!who)return c.json({detail:"Verified account required."},403);
  const adult=!!c.env.SUPPORT_UNIFIED_TEST_EMAIL&&who.email.trim().toLowerCase()===c.env.SUPPORT_UNIFIED_TEST_EMAIL.trim().toLowerCase();
  return c.json({drafts:await listAcademyShowcases(c.env.DB,a,adult)});
 });
 app.post(root+"/save",g.auth,g.parent,async c=>{
  const a=c.get("user"),who=await verifiedPortalIdentity(c.env.DB,a);if(!who)return c.json({detail:"Verified account required."},403);
  if(!(await hitRateLimit(c.env.DB,"academy-showcase:"+a.id,60,3600)).ok)return c.json({detail:"Try again later."},429);
  const adult=!!c.env.SUPPORT_UNIFIED_TEST_EMAIL&&who.email.trim().toLowerCase()===c.env.SUPPORT_UNIFIED_TEST_EMAIL.trim().toLowerCase();
  const r=await saveAcademyShowcase(c.env.DB,a,await c.req.json().catch(()=>null),adult);
  return "error" in r?c.json({detail:r.error},409):c.json(r);
 });
 app.post(root+"/delete",g.auth,g.parent,async c=>{
  const a=c.get("user");if(!(await hitRateLimit(c.env.DB,"academy-showcase-delete:"+a.id,30,3600)).ok)return c.json({detail:"Try again later."},429);
  return await deleteAcademyShowcase(c.env.DB,a,await c.req.json().catch(()=>null))?c.json({deleted:true}):c.json({detail:"Draft unavailable or changed."},409);
 });
}
