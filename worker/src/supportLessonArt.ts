import type {Env,AuthUser} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {loadPlatformSettings} from "./platformSettings";
import {hitRateLimit} from "./adminAudit";
import {decodeResource} from "./supportFiles";

// Maximum planned contextual illustrations, not a requirement to use every slot.
export const lessonIllustrationAllowance=(minutes:number)=>Math.max(3,Math.min(18,Math.ceil(minutes/5)));
export const LESSON_ART_MODEL="@cf/black-forest-labs/flux-1-schnell";
export const lessonArtEnabled=(e:Env)=>unifiedPortalPilot(e)&&e.SUPPORT_RESOURCE_AI==="true"&&!!e.AI&&!!e.BUCKET;
const text=(x:unknown,max:number)=>typeof x==="string"&&x.trim().length>0&&x.trim().length<=max?x.trim():null;
export function lessonArtInput(b:any){
 const title=text(b?.title,100),subject=text(b?.subject,80),year_level=text(b?.year_level,40),brief=text(b?.brief,800);
 if(!title||!subject||!year_level||!brief||b.confirmed!==true)return null;
 const prompt="Original professional editorial educational illustration, suitable for Australian school learners at "+year_level+". Subject: "+subject+". Depict this generic learning scenario: "+brief+". Clear focal point, polished consistent colours and thoughtful composition. No text, letters, numbers, labels, watermarks, logos, real identifiable children, graphic violence or answers to the learner task. This is contextual artwork, not a factual scientific diagram, map or assessment answer.";
 return {title,subject,year_level,prompt};
}
export function decodeLessonArt(raw:any,meta:{title:string;subject:string;year_level:string}){
 if(typeof raw?.image!=="string")return null;
 for(const filename of ["lesson-illustration.jpg","lesson-illustration.png"]){
  const input={...meta,filename,base64:raw.image,audience:"learner",reviewed:true};
  const decoded=decodeResource(input);
  if(decoded)return {filename,mime:decoded.mime,base64:raw.image};
 }
 return null;
}
export async function generateLessonArt(e:Env,actor:AuthUser,b:any){
 if(!lessonArtEnabled(e)||!e.AI)return {error:"Illustration generation requires private staging AI and private file storage. No AI call was made."};
 const input=lessonArtInput(b);if(!input)return {error:"Review a generic educational image brief without identifying details and confirm one image request."};
 const settings=await loadPlatformSettings(e.DB,{fresh:true});
 if(!settings.features.aiEnabled||settings.maintenance.enabled||settings.costSafeguards.aiDailyPlatformCap<=0)return {error:"AI is paused or unavailable."};
 if(!(await hitRateLimit(e.DB,"support-art-day:"+actor.id,36,86400)).ok||!(await hitRateLimit(e.DB,"support-art-hour:"+actor.id,18,3600)).ok)return {error:"Illustration drafting limit reached. Your text lesson and completed artwork remain available."};
 const now=new Date(),usage=crypto.randomUUID(),since=new Date(now.getTime()-86400000).toISOString();
 const claim=await e.DB.prepare("INSERT INTO ai_usage(id,family_id,user_id,kind,status,created_at) SELECT ?,?,?, 'support_lesson_art','pending',? WHERE (SELECT COUNT(*) FROM ai_usage WHERE created_at>=? AND status<>'failed')<?").bind(usage,actor.family_id,actor.id,now.toISOString(),since,settings.costSafeguards.aiDailyPlatformCap).run();
 if(!claim.meta?.changes)return {error:"Platform AI request limit reached."};
 try{
  const raw=await e.AI.run(LESSON_ART_MODEL,{prompt:input.prompt,steps:8});
  await e.DB.prepare("UPDATE ai_usage SET status='completed' WHERE id=?").bind(usage).run();
  const image=decodeLessonArt(raw,input);
  return image?{image}:{error:"The provider did not return a valid JPEG or PNG. No artwork was saved or shared; no automatic retry."};
 }catch{
  await e.DB.prepare("UPDATE ai_usage SET status='attempted' WHERE id=? AND status='pending'").bind(usage).run().catch(()=>{});
  return {error:"Illustration request failed. Nothing was saved or shared; no automatic retry."};
 }
}
