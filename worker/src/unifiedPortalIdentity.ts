import type {AuthUser,Env} from "./types";
import {effectivePlan,limitsFor} from "./entitlements";
export function unifiedPortalPilot(e:Partial<Env>){
 return !!e.STAGING_KEY&&e.STAGING_PRIVATE==="true"&&e.SUPPORT_UNIFIED_PORTAL_TEST==="true";
}
/** Invoke only after database-backed session authentication. Never accept a browser-supplied actor. */
export async function verifiedPortalIdentity(db:D1Database,actor:AuthUser){
 if(actor.role!=="parent")return null;
 const row=await db.prepare("SELECT u.id user_id,u.family_id,u.name,u.email,u.email_verified_at,f.plan,f.created_at,f.trial_started_at,f.trial_ends_at,f.plan_period_end,i.registration_intent FROM users u JOIN families f ON f.id=u.family_id LEFT JOIN family_admin_state s ON s.family_id=f.id LEFT JOIN support_account_intents i ON i.family_id=f.id WHERE u.id=? AND u.family_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND COALESCE(s.status,'active')='active'").bind(actor.id,actor.family_id).first<{user_id:string;family_id:string;name:string;email:string;email_verified_at:string;plan:string;created_at:string;trial_started_at:string|null;trial_ends_at:string|null;plan_period_end:string|null;registration_intent:string|null}>();
 if(!row)return null;
 const plan=effectivePlan(row);
 return {user_id:row.user_id,family_id:row.family_id,name:row.name,email:row.email,registration_intent:row.registration_intent==="support_only"?"support_only":"homeschool",homeschool:{plan,limits:limitsFor(plan)}};
}
