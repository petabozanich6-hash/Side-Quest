import type {App,AuthUser,Guards} from "./types";
import {nowIso,newId} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {readFamilyClaim} from "./unifiedPortalLegacy";
import {hitRateLimit} from "./adminAudit";
const validId=(s:unknown):s is string=>typeof s==="string"&&s.length>0&&s.length<=100;
const text=(s:unknown,max:number)=>typeof s==="string"&&s.trim().length<=max?s.trim():null;
const ownedSql="p.family_id=? AND (p.parent_user_id=? OR EXISTS(SELECT 1 FROM students st WHERE st.id=p.student_id AND st.family_id=p.family_id))";
export async function portalLearners(db:D1Database,a:AuthUser){
 if(!await verifiedPortalIdentity(db,a))return null;
 const learners=(await db.prepare("SELECT p.id,p.student_id,COALESCE(s.name,p.label) label,COALESCE(s.year_level,p.year_level) year_level FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE "+ownedSql+" ORDER BY label,p.id LIMIT 100").bind(a.family_id,a.id).all<any>()).results||[];
 const students=(await db.prepare("SELECT s.id,s.name label,COALESCE(s.year_level,'') year_level FROM students s WHERE s.family_id=? AND NOT EXISTS(SELECT 1 FROM support_portal_learners p WHERE p.student_id=s.id) ORDER BY s.name,s.id LIMIT 100").bind(a.family_id).all<any>()).results||[];
 const claim=await readFamilyClaim(db,a);
 const legacy=claim?(await db.prepare("SELECT g.id,g.label,g.year_level,l.learner_id FROM support_guest_learners g LEFT JOIN support_portal_legacy_learners l ON l.legacy_learner_id=g.id AND l.parent_user_id=? WHERE g.family_id=? ORDER BY g.label,g.id LIMIT 100").bind(a.id,claim.guest_family_id).all<any>()).results||[]:[];
 return {learners,students,legacy};
}
export async function addPortalLearner(db:D1Database,a:AuthUser,b:any){
 if(!await verifiedPortalIdentity(db,a)||!b||!validId(b.request_key))return null;
 const key=b.request_key;
 const prior=await db.prepare("SELECT id,student_id,label,year_level FROM support_portal_learners WHERE parent_user_id=? AND family_id=? AND request_key=?").bind(a.id,a.family_id,key).first<any>();
 const student=validId(b.student_id)?b.student_id:null;
 if(b.student_id!=null&&!student)return null;
 const label=text(b.label,100),year=text(b.year_level??"",80);
 if(!student&&(!label||year===null))return null;
 if(prior)return (student?prior.student_id===student:prior.student_id===null&&prior.label===label&&prior.year_level===year)?{id:prior.id}:null;
 const id=newId(),now=nowIso();
 if(student){
  await db.prepare(`INSERT OR IGNORE INTO support_portal_learners(id,family_id,parent_user_id,student_id,label,year_level,request_key,created_at)
 SELECT ?,s.family_id,?,s.id,s.name,COALESCE(s.year_level,''),?,? FROM students s WHERE s.id=? AND s.family_id=? AND (SELECT COUNT(*) FROM support_portal_learners WHERE family_id=s.family_id)<100`).bind(id,a.id,key,now,student,a.family_id).run();
  return db.prepare("SELECT id FROM support_portal_learners WHERE student_id=? AND family_id=?").bind(student,a.family_id).first<{id:string}>();
 }
 const inserted=await db.prepare(`INSERT OR IGNORE INTO support_portal_learners(id,family_id,parent_user_id,label,year_level,request_key,created_at)
 SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM support_portal_learners WHERE family_id=?)<100`).bind(id,a.family_id,a.id,label,year,key,now,a.family_id).run();
 if(inserted.meta?.changes)return {id};
 const retry=await db.prepare("SELECT id,label,year_level,student_id FROM support_portal_learners WHERE family_id=? AND parent_user_id=? AND request_key=?").bind(a.family_id,a.id,key).first<any>();
 return retry&&retry.student_id===null&&retry.label===label&&retry.year_level===year?{id:retry.id}:null;
}
export async function linkPortalLegacyLearner(db:D1Database,a:AuthUser,b:any){
 if(!await verifiedPortalIdentity(db,a)||b?.confirmed!==true||!validId(b.legacy_id)||!validId(b.learner_id))return false;
 const claim=await readFamilyClaim(db,a);if(!claim)return false;
 const result=await db.prepare(`INSERT OR IGNORE INTO support_portal_legacy_learners(legacy_learner_id,learner_id,parent_user_id,linked_at)
 SELECT g.id,p.id,?,? FROM support_guest_learners g JOIN support_portal_learners p ON p.id=?
 JOIN support_family_claims c ON c.guest_family_id=g.family_id AND c.family_id=p.family_id AND c.parent_user_id=?
 WHERE g.id=? AND g.family_id=? AND `+ownedSql).bind(a.id,nowIso(),b.learner_id,a.id,b.legacy_id,claim.guest_family_id,a.family_id,a.id).run();
 if(result.meta?.changes)return true;
 return !!await db.prepare("SELECT 1 FROM support_portal_legacy_learners WHERE legacy_learner_id=? AND learner_id=? AND parent_user_id=?").bind(b.legacy_id,b.learner_id,a.id).first();
}
export function registerPortalLearners(app:App,g:Guards){
 const root="/api/family-portal/learners";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/list",g.auth,g.parent,async c=>{const r=await portalLearners(c.env.DB,c.get("user"));return r?c.json(r):c.json({detail:"Verified parent access required."},403);});
 app.post(root+"/add",g.auth,g.parent,async c=>{const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent access required."},403);if(!(await hitRateLimit(c.env.DB,"portal-learner:"+a.id,30,3600)).ok)return c.json({detail:"Try again later."},429);const r=await addPortalLearner(c.env.DB,a,await c.req.json().catch(()=>null));return r?c.json(r):c.json({detail:"Unable to add that learner. Check your details or select an existing learner."},409);});
 app.post(root+"/link",g.auth,g.parent,async c=>{const a=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,a))return c.json({detail:"Verified parent access required."},403);if(!(await hitRateLimit(c.env.DB,"portal-learner-link:"+a.id,20,3600)).ok)return c.json({detail:"Try again later."},429);return await linkPortalLegacyLearner(c.env.DB,a,await c.req.json().catch(()=>null))?c.json({linked:true}):c.json({detail:"Unable to link those learners safely. Contact Side-Quest if a previous link needs correction."},409);});
}
