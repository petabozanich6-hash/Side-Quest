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
