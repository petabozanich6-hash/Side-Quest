import type {App,AuthUser,Env,Guards} from "./types";
import {verifiedPortalIdentity,unifiedPortalPilot} from "./unifiedPortalIdentity";
import {claimedGuestRequestGuard} from "./unifiedPortalRequestAccess";
import {hitRateLimit} from "./adminAudit";
export async function familyClubClassroomAccess(e:Env,a:AuthUser,requestId:string,classId:string,now=new Date()){
 if(!unifiedPortalPilot(e)||e.SUPPORT_CLASSROOM_ENABLED!=="true"||!await verifiedPortalIdentity(e.DB,a)||!requestId||!classId||requestId.length>100||classId.length>100)return null;
 const r=await e.DB.prepare(`SELECT s.id seat_id,c.start_at,c.end_at,c.topic,x.sequence,rr.curriculum_id FROM support_english_enrolments s
 JOIN support_english_classes c ON c.id=s.class_id
 JOIN support_guest_requests r ON r.id=s.request_id
 LEFT JOIN support_english_round_classes x ON x.class_id=c.id
 LEFT JOIN support_english_rounds rr ON rr.id=x.round_id
 WHERE s.request_id=? AND s.class_id=? AND (EXISTS(SELECT 1 FROM support_portal_enquiries p WHERE p.request_id=r.id AND p.family_id=? AND p.parent_user_id=? AND p.service='english-club') OR (${claimedGuestRequestGuard}))
 AND COALESCE(rr.curriculum_id,'')<>'english-author-studio-adult-v1' AND s.status='paid' AND r.status NOT IN ('closed','resolved')`).bind(requestId,classId,a.family_id,a.id,a.family_id,a.id).first<{seat_id:string;start_at:string;end_at:string;topic:string;sequence:number|null;curriculum_id:string|null}>();
 if(!r)return null;
 const start=Date.parse(r.start_at),end=Date.parse(r.end_at),t=now.getTime();
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;
 return {seat_id:r.seat_id,in_window:t>=start-600000&&t<end,start_at:r.start_at,end_at:r.end_at,...(["english-creative-camp-junior-v1","english-creative-camp-senior-v1"].includes(r.curriculum_id||"")?{programme_id:r.curriculum_id,topic:r.topic,sequence:r.sequence}:{})};
}
export function registerFamilyClubClassroomAccess(app:App,g:Guards){
 app.get("/api/family-portal/club-classroom/:request/:session",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const a=c.get("user");
  if(!(await hitRateLimit(c.env.DB,"club-classroom:"+a.id,120,300)).ok)return c.json({detail:"Try again shortly."},429);
  const r=await familyClubClassroomAccess(c.env,a,c.req.param("request")||"",c.req.param("session")||"");
  return r?c.json(r):c.json({detail:"A confirmed paid workshop is required."},404);
 });
}
