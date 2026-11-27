import type {Env,AuthUser} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {loadPlatformSettings} from "./platformSettings";
import {hitRateLimit} from "./adminAudit";
import {decodeResource} from "./supportFiles";

const text=(v:unknown,n:number)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=n?v.trim():null;
export const ILLUSTRATION_MODEL="@cf/black-forest-labs/flux-1-schnell";
// A duration-dependent planning allowance, not a requirement to spend.
export function illustrationAllowance(minutes:number){return minutes<30?2:minutes<45?4:minutes<60?5:minutes<90?6:8;}
export function validateIllustrationPlan(raw:any,minutes:number,slideCount:number){
 if(!Array.isArray(raw)||raw.length>Math.min(illustrationAllowance(minutes),slideCount))return null;
 const plan:{slide_index:number;title:string;brief:string;purpose:string}[]=[];
 for(const item of raw){
  const slide_index=item?.slide_index,title=text(item?.title,100),brief=text(item?.brief,900),purpose=text(item?.purpose,300);
  if(!Number.isInteger(slide_index)||slide_index<0||slide_index>=slideCount||!title||!brief||brief.length<40||!purpose||plan.some(p=>p.slide_index===slide_index||p.brief===brief))return null;
  plan.push({slide_index,title,brief,purpose});
 }
 return plan.sort((a,b)=>a.slide_index-b.slide_index);
}
export const illustrationEnabled=(e:Env)=>unifiedPortalPilot(e)&&e.SUPPORT_RESOURCE_AI==="true"&&e.SUPPORT_ILLUSTRATION_AI==="true"&&!!e.AI;
export async function draftLessonIllustration(e:Env,actor:AuthUser,b:any){
 if(!illustrationEnabled(e)||!e.AI)return {error:"Illustration generation is disabled in this environment."};
 const brief=text(b?.brief,900),title=text(b?.title,100),subject=text(b?.subject,80),year_level=text(b?.year_level,40);
 if(!brief||brief.length<40||!title||!subject||!year_level||b.confirmed!==true)return {error:"Review the generic illustration brief and confirm it contains no private information."};
 const settings=await loadPlatformSettings(e.DB,{fresh:true});
 if(!settings.features.aiEnabled||settings.maintenance.enabled||settings.costSafeguards.aiDailyPlatformCap<=0)return {error:"AI is paused or unavailable."};
 if(!(await hitRateLimit(e.DB,"support-illustration-day:"+actor.id,40,86400)).ok||!(await hitRateLimit(e.DB,"support-illustration-hour:"+actor.id,16,3600)).ok)return {error:"Illustration request limit reached."};
 const now=new Date(),usage=crypto.randomUUID(),since=new Date(now.getTime()-86400000).toISOString();
 const claim=await e.DB.prepare("INSERT INTO ai_usage(id,family_id,user_id,kind,status,created_at) SELECT ?,?,?, 'support_illustration','pending',? WHERE (SELECT COUNT(*) FROM ai_usage WHERE created_at>=? AND status<>'failed')<?").bind(usage,actor.family_id,actor.id,now.toISOString(),since,settings.costSafeguards.aiDailyPlatformCap).run();
 if(!claim.meta?.changes)return {error:"Platform AI request limit reached."};
 try{
  const prompt="Create a polished original, age-appropriate educational illustration for an Australian lesson. Use a clear composition, purposeful details and readable shapes. No lettering, logos, copyrighted characters, personal likenesses, answer keys or embedded instructions. Do not represent exact measurements, counts or scientific facts that require a precise diagram. Illustration brief: "+brief;
  const result=await e.AI.run(ILLUSTRATION_MODEL,{prompt,steps:4});
  const image=result?.image;
  const resource={filename:"lesson-illustration.jpg",title,subject,year_level,audience:"learner",reviewed:true,base64:image};
  // Reuse bounded file validation but do not store or mark the generated image reviewed.
  const validated=decodeResource(resource);
  await e.DB.prepare("UPDATE ai_usage SET status='completed' WHERE id=?").bind(usage).run();
  if(!validated||validated.mime!=="image/jpeg")return {error:"Image provider returned an invalid or oversized JPEG. No file was saved."};
  return {image:{filename:resource.filename,title,subject,year_level,mime:validated.mime,base64:image}};
 }catch{
  await e.DB.prepare("UPDATE ai_usage SET status='attempted' WHERE id=? AND status='pending'").bind(usage).run().catch(()=>{});
  return {error:"Illustration request failed. No file was saved and no automatic retry was sent."};
 }
}
