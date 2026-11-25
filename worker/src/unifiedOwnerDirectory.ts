import {effectivePlan} from "./entitlements";
// Owner-only projection: grouping is by canonical IDs or an explicit legacy claim, never by name/email coincidence.
const directory=`WITH guest_records AS (
 SELECT r.id,r.email,r.parent_name,r.subject,r.status,r.seen_at,r.updated_at,g.id guest_id,
 CASE WHEN p.request_id IS NOT NULL THEN p.family_id WHEN o.request_id IS NULL THEN c.family_id ELSE NULL END canonical_id
 FROM support_guest_requests r
 LEFT JOIN support_guest_families g ON g.email=r.email
 LEFT JOIN support_portal_enquiries p ON p.request_id=r.id
 LEFT JOIN support_portal_enquiry_origins o ON o.request_id=r.id
 LEFT JOIN support_family_claims c ON c.guest_family_id=g.id
 WHERE o.request_id IS NULL OR p.request_id IS NOT NULL
), support_records AS (
 SELECT canonical_id,guest_id,id,subject,status,seen_at,updated_at FROM guest_records
 UNION ALL SELECT family_id,NULL,id,subject,status,seen_at,updated_at FROM parent_feedback WHERE page_hint='learning-support'
), counts AS (
 SELECT canonical_id,CASE WHEN canonical_id IS NULL THEN guest_id ELSE NULL END guest_id,
 COUNT(*) enquiries,SUM(CASE WHEN status NOT IN ('closed','resolved') THEN 1 ELSE 0 END) open_count,
 SUM(CASE WHEN seen_at IS NULL AND status NOT IN ('closed','resolved') THEN 1 ELSE 0 END) unread_count,
 SUM(CASE WHEN subject LIKE 'English Club: %' THEN 1 ELSE 0 END) club_count,MAX(updated_at) updated_at
 FROM support_records GROUP BY canonical_id,CASE WHEN canonical_id IS NULL THEN guest_id ELSE NULL END
), entries AS (
 SELECT 'account' kind,f.id,u.name parent_name,u.email,u.email_verified_at verified_at,
 f.plan,f.created_at,f.trial_started_at,f.trial_ends_at,f.plan_period_end,
 COALESCE(a.status,'active') status,COALESCE(i.registration_intent,'homeschool') registration_intent,
 COALESCE(c.enquiries,0) enquiries,COALESCE(c.open_count,0) open_count,COALESCE(c.unread_count,0) unread_count,COALESCE(c.club_count,0) club_count,
 COALESCE(c.updated_at,f.created_at) updated_at
 FROM families f LEFT JOIN users u ON u.id=f.owner_id AND u.family_id=f.id
 LEFT JOIN family_admin_state a ON a.family_id=f.id
 LEFT JOIN support_account_intents i ON i.family_id=f.id
 LEFT JOIN counts c ON c.canonical_id=f.id
 UNION ALL
 SELECT 'legacy',g.id,(SELECT r.parent_name FROM guest_records r WHERE r.guest_id=g.id AND r.canonical_id IS NULL ORDER BY r.updated_at DESC,r.id DESC LIMIT 1),
 g.email,NULL,NULL,g.created_at,NULL,NULL,NULL,'legacy','legacy',
 c.enquiries,c.open_count,c.unread_count,c.club_count,c.updated_at
 FROM support_guest_families g JOIN counts c ON c.guest_id=g.id AND c.canonical_id IS NULL
)`;
export async function unifiedOwnerDirectory(db:D1Database,search:string,page:number,filter:string){
 const rows=(await db.prepare(directory+` SELECT * FROM entries WHERE
 (?='' OR instr(lower(COALESCE(email,'')),?)>0 OR instr(lower(COALESCE(parent_name,'')),?)>0 OR instr(lower(id),?)>0)
 AND (?='all' OR (?='support' AND enquiries>0) OR (?='legacy' AND kind='legacy') OR (?='unread' AND unread_count>0))
 ORDER BY unread_count DESC,updated_at DESC,kind,id LIMIT 51 OFFSET ?`).bind(search,search,search,search,filter,filter,filter,filter,(page-1)*50).all<any>()).results||[];
 return {items:rows.slice(0,50).map(r=>({kind:r.kind,id:r.id,parent_name:r.parent_name,email:r.email,verified:r.kind==="account"?!!r.verified_at:null,plan:r.kind==="account"?effectivePlan(r):null,status:r.status,registration_intent:r.registration_intent,enquiries:r.enquiries,open_count:r.open_count,unread_count:r.unread_count,club_count:r.club_count,updated_at:r.updated_at})),has_more:rows.length>50};
}
