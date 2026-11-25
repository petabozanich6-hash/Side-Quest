import {effectivePlan} from "./entitlements";
// Owner-only projection: grouping is by canonical IDs or an explicit legacy claim, never by name/email coincidence.
export const directory=`WITH guest_records AS (
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

export const OWNER_FAMILY_SECTIONS=["home","learners","enquiries","appointments","invoices","messages"] as const;
export type OwnerFamilySection=typeof OWNER_FAMILY_SECTIONS[number];
/** Scoped operational metadata only. No unrelated homeschool child records, lesson content or private notes. */
export async function unifiedOwnerFamily(db:D1Database,kind:string,id:string,section:OwnerFamilySection,page:number){
 const row=await db.prepare(directory+" SELECT * FROM entries WHERE kind=? AND id=?").bind(kind,id).first<any>();
 if(!row)return null;
 const family={kind:row.kind,id:row.id,parent_name:row.parent_name,email:row.email,plan:kind==="account"?effectivePlan(row):null,status:row.status,registration_intent:row.registration_intent,enquiries:row.enquiries,open_count:row.open_count,unread_count:row.unread_count,club_count:row.club_count};
 if(section==="home")return {family,section,page,items:[],has_more:false};
 const scope=directory+`, selected_requests AS (
 SELECT r.id,'guest' channel,r.guest_id,r.subject,r.status,r.seen_at,r.updated_at,p.learner_id
 FROM guest_records r LEFT JOIN support_portal_enquiries p ON p.request_id=r.id
 WHERE (?='account' AND r.canonical_id=?) OR (?='legacy' AND r.canonical_id IS NULL AND r.guest_id=?)
 UNION ALL
 SELECT id,'member',NULL,subject,status,seen_at,updated_at,NULL FROM parent_feedback
 WHERE ?='account' AND family_id=? AND page_hint='learning-support'
 )`;
 const args=[kind,id,kind,id,kind,id];
 let sql:string;
 switch(section){
 case "learners":
  sql=scope+` SELECT p.id,'portal' source,COALESCE(s.name,p.label) label,COALESCE(s.year_level,p.year_level) year_level,CASE WHEN s.id IS NULL THEN 0 ELSE 1 END existing_student,NULL guest_id
 FROM support_portal_learners p LEFT JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE ?='account' AND p.family_id=?
 UNION ALL SELECT l.id,'legacy',l.label,l.year_level,0,l.family_id FROM support_guest_learners l
 WHERE (?='legacy' AND l.family_id=?) OR (?='account' AND EXISTS(SELECT 1 FROM support_family_claims c WHERE c.guest_family_id=l.family_id AND c.family_id=?) AND NOT EXISTS(SELECT 1 FROM support_portal_legacy_learners m JOIN support_portal_learners p ON p.id=m.learner_id WHERE m.legacy_learner_id=l.id AND p.family_id=?))
 ORDER BY label,id LIMIT 51 OFFSET ?`;
  // The scope above is intentionally not referenced by the learner query: account profiles require an explicit support record.
  args.push(kind,id,kind,id,kind,id,id);break;
 case "enquiries":
  sql=scope+" SELECT id,channel,guest_id,subject,status,seen_at,updated_at,learner_id FROM selected_requests ORDER BY CASE WHEN seen_at IS NULL AND status NOT IN ('closed','resolved') THEN 0 ELSE 1 END,updated_at DESC,id LIMIT 51 OFFSET ?";break;
 case "appointments":
  sql=scope+` SELECT o.id,r.id request_id,r.channel,r.guest_id,r.subject,o.start_at,o.end_at,o.status,'tutoring' service,NULL class_id
 FROM selected_requests r JOIN support_service_orders o ON o.request_id=r.id AND o.channel=r.channel WHERE o.mode='live'
 UNION ALL SELECT e.id,r.id,r.channel,r.guest_id,c.topic,c.start_at,c.end_at,e.status,'club',c.id
 FROM selected_requests r JOIN support_english_enrolments e ON r.channel='guest' AND e.request_id=r.id JOIN support_english_classes c ON c.id=e.class_id
 ORDER BY start_at DESC,id LIMIT 51 OFFSET ?`;break;
 case "invoices":
  sql=scope+` SELECT o.id,r.id request_id,r.channel,r.guest_id,r.subject,o.amount_cents,o.status,i.reference,COALESCE(t.due_at,i.due_at) due_at,'tutoring' service,NULL class_id
 FROM selected_requests r JOIN support_service_orders o ON o.request_id=r.id AND o.channel=r.channel
 LEFT JOIN support_package_sessions p ON p.order_id=o.id LEFT JOIN support_installment_terms t ON t.order_id=o.id LEFT JOIN support_manual_invoices i ON i.order_id=o.id
 WHERE o.status<>'awaiting_confirmation' AND o.amount_cents>0 AND (p.sequence IS NULL OR p.sequence=1 OR t.order_id IS NOT NULL)
 UNION ALL SELECT e.id,r.id,r.channel,r.guest_id,c.topic,1200,e.status,e.invoice_reference,e.payment_due_at,'club',c.id
 FROM selected_requests r JOIN support_english_enrolments e ON r.channel='guest' AND e.request_id=r.id JOIN support_english_classes c ON c.id=e.class_id
 ORDER BY due_at DESC,id LIMIT 51 OFFSET ?`;break;
 default:
  sql=scope+` SELECT r.id,r.channel,r.guest_id,r.subject,r.status,r.updated_at,CASE WHEN r.channel='guest' THEN (SELECT COUNT(*) FROM support_guest_messages m WHERE m.request_id=r.id) ELSE (SELECT COUNT(*) FROM parent_feedback_replies m WHERE m.feedback_id=r.id) END message_count
 FROM selected_requests r ORDER BY updated_at DESC,id LIMIT 51 OFFSET ?`;
 }
 const rows=(await db.prepare(sql).bind(...args,(page-1)*50).all<any>()).results||[];
 return {family,section,page,items:rows.slice(0,50),has_more:rows.length>50};
}
