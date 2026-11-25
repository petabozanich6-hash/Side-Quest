import type {App,AuthUser,Guards} from "./types";
import {nowIso} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {hitRateLimit} from "./adminAudit";
import {guestQuotes,guestMessages} from "./guestSupport";
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
type Claim={guest_family_id:string;family_id:string;parent_user_id:string;email:string;claimed_at:string};
/** Scope stays with the specific verified parent; never expand to other parents in the family implicitly. */
export async function readFamilyClaim(db:D1Database,actor:AuthUser):Promise<Claim|null>{
 if(actor.role!=="parent")return null;
 return db.prepare("SELECT c.guest_family_id,c.family_id,c.parent_user_id,g.email,c.claimed_at FROM support_family_claims c JOIN support_guest_families g ON g.id=c.guest_family_id JOIN users u ON u.id=c.parent_user_id AND u.family_id=c.family_id AND u.email=g.email JOIN families f ON f.id=c.family_id LEFT JOIN family_admin_state s ON s.family_id=f.id WHERE c.family_id=? AND c.parent_user_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(s.status,'active')='active'").bind(actor.family_id,actor.id).first<Claim>();
}
/** Requires a separately verified, still-valid guest session and explicit confirmation.
 * No request IDs or emails are accepted from the browser as evidence of ownership.
 * Keep original guest access during the reversible pilot; revocation/cutover is a separate gate.
 */
export async function claimLegacyFamily(db:D1Database,actor:AuthUser,guestToken:unknown,confirmed:unknown){
 if(confirmed!==true||typeof guestToken!=="string"||!/^[a-f0-9]{64}$/.test(guestToken)||!await verifiedPortalIdentity(db,actor))return false;
 const tokenHash=await hash(guestToken),now=nowIso();
 const result=await db.prepare(`INSERT OR IGNORE INTO support_family_claims(guest_family_id,family_id,parent_user_id,claimed_at)
 SELECT g.id,u.family_id,u.id,? FROM users u
 JOIN families f ON f.id=u.family_id
 JOIN support_guest_sessions gs ON gs.email=u.email AND gs.token_hash=? AND gs.expires_at>?
 JOIN support_guest_families g ON g.email=gs.email
 LEFT JOIN family_admin_state s ON s.family_id=f.id
 WHERE u.id=? AND u.family_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(s.status,'active')='active'
 AND EXISTS(SELECT 1 FROM support_guest_requests r WHERE r.email=g.email AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=r.id))
 AND (SELECT COUNT(*) FROM users ux WHERE lower(ux.email)=lower(u.email))=1
 AND (SELECT COUNT(*) FROM support_guest_families gx WHERE lower(gx.email)=lower(g.email))=1`).bind(now,tokenHash,now,actor.id,actor.family_id).run();
 if(result.meta?.changes)return true;
 // Idempotent retry only with the same currently valid proof and existing mapping.
 const existing=await readFamilyClaim(db,actor);
 if(!existing)return false;
 return !!await db.prepare("SELECT 1 FROM support_guest_sessions WHERE token_hash=? AND email=? AND expires_at>?").bind(tokenHash,existing.email,now).first();
}
export async function linkedLegacyRequests(db:D1Database,actor:AuthUser){
 const claim=await readFamilyClaim(db,actor);if(!claim)return [];
 const rows=await db.prepare("SELECT id,subject,status,created_at,updated_at FROM support_guest_requests WHERE email=? AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=support_guest_requests.id) ORDER BY created_at DESC,id DESC LIMIT 50").bind(claim.email).all<any>();
 return rows.results||[];
}
export async function linkedLegacyRequest(db:D1Database,actor:AuthUser,id:string){
 const claim=await readFamilyClaim(db,actor);if(!claim)return null;
 const row=await db.prepare("SELECT id,subject,message,status,created_at,updated_at FROM support_guest_requests WHERE id=? AND email=? AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=support_guest_requests.id)").bind(id,claim.email).first<any>();
 if(!row)return null;
 const [quotes,messages]=await Promise.all([guestQuotes(db,id),guestMessages(db,id)]);
 // Do not return tutor notes, internal plans, other learners, credentials or storage keys.
 return {...row,quotes,messages};
}
export function registerUnifiedLegacy(app:App,g:Guards){
 const root="/api/family-portal/legacy";
 app.use(root+"/*",async(c,next)=>{c.header("Cache-Control","no-store");if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);await next();});
 app.get(root+"/status",g.auth,g.parent,async c=>{
  const actor=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,actor))return c.json({detail:"Verified parent access required."},403);
  return c.json({linked:!!await readFamilyClaim(c.env.DB,actor)});
 });
 app.post(root+"/claim",g.auth,g.parent,async c=>{
  const actor=c.get("user"),b=await c.req.json().catch(()=>null);
  if(!await verifiedPortalIdentity(c.env.DB,actor))return c.json({detail:"Verified parent access required."},403);
  if(!(await hitRateLimit(c.env.DB,"unified-claim:"+actor.id,6,3600)).ok)return c.json({detail:"Try again later."},429);
  if(!await claimLegacyFamily(c.env.DB,actor,c.req.header("X-SideQuest-Guest"),b?.confirmed))return c.json({detail:"Could not safely link those records. Sign in to the previous portal with the same verified email, or contact Side-Quest for help."},409);
  return c.json({linked:true});
 });
 app.get(root+"/requests",g.auth,g.parent,async c=>{
  const actor=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,actor))return c.json({detail:"Verified parent access required."},403);
  return c.json({requests:await linkedLegacyRequests(c.env.DB,actor)});
 });
 app.get(root+"/requests/:id",g.auth,g.parent,async c=>{
  const actor=c.get("user");if(!await verifiedPortalIdentity(c.env.DB,actor))return c.json({detail:"Verified parent access required."},403);
  const row=await linkedLegacyRequest(c.env.DB,actor,c.req.param("id"));return row?c.json(row):c.json({detail:"Request not found"},404);
 });
}
