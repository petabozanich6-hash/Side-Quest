import type {AuthUser,Env} from "./types";
import {authenticateToken} from "./session";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
export async function portalEnquirySchemaExists(db:D1Database){
 return !!await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_portal_enquiry_origins'").first();
}
export async function portalEnquiryOwner(db:D1Database,id:string){
 if(!await portalEnquirySchemaExists(db))return null;
 return db.prepare("SELECT request_id FROM support_portal_enquiry_origins WHERE request_id=?").bind(id).first<{request_id:string}>();
}
export async function ownsPortalEnquiry(db:D1Database,a:AuthUser,id:string){
 if(!await verifiedPortalIdentity(db,a))return false;
 return !!await db.prepare("SELECT 1 FROM support_portal_enquiries WHERE request_id=? AND family_id=? AND parent_user_id=?").bind(id,a.family_id,a.id).first();
}
/** New enquiries must use the canonical parent JWT; legacy email tokens cannot grant access. */
export async function portalRequestIdentity(env:Env,id:string,header:string){
 if(!unifiedPortalPilot(env)||!header.startsWith("Bearer "))return null;
 const auth=await authenticateToken(env,header.slice(7));
 if(!auth.ok||!await ownsPortalEnquiry(env.DB,auth.user,id))return null;
 const r=await env.DB.prepare("SELECT r.email FROM support_guest_requests r JOIN support_portal_enquiries p ON p.request_id=r.id WHERE r.id=? AND p.family_id=? AND p.parent_user_id=?").bind(id,auth.user.family_id,auth.user.id).first<{email:string}>();
 return r;
}

// Exact historical request ownership; requires a previously explicit verified claim.
// Call with the authenticated parent's family/user, never browser-supplied identity.
// The outer request alias is r. A canonical origin can never use this fallback.
export const claimedGuestRequestGuard=`NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins o WHERE o.request_id=r.id)
 AND NOT EXISTS(SELECT 1 FROM support_portal_enquiries p WHERE p.request_id=r.id)
 AND EXISTS(SELECT 1 FROM support_family_claims c JOIN support_guest_families f ON f.id=c.guest_family_id
 JOIN users u ON u.id=c.parent_user_id AND u.family_id=c.family_id AND u.email=f.email
 LEFT JOIN family_admin_state fs ON fs.family_id=c.family_id
 WHERE f.email=r.email AND c.family_id=? AND c.parent_user_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(fs.status,'active')='active')`;
export async function claimedRequestIdentity(env:Env,id:string,header:string){
 if(!unifiedPortalPilot(env)||!header.startsWith("Bearer ")||!id||id.length>100)return null;
 const auth=await authenticateToken(env,header.slice(7));
 if(!auth.ok||!await verifiedPortalIdentity(env.DB,auth.user))return null;
 return env.DB.prepare("SELECT r.email FROM support_guest_requests r WHERE r.id=? AND "+claimedGuestRequestGuard).bind(id,auth.user.family_id,auth.user.id).first<{email:string}>();
}
