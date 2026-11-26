import {sydneyDay} from "./supportBriefing";
import {lessonReportQueue} from "./supportStationeryHistory";
const categories=["schedule","attention","preparation","enquiries","proposals","invoice","payment","followup","waiting"] as const;
/** Read-only operational tasks. No sending, releasing reservations or changing payment state. */
export async function ownerToday(db:D1Database,now=new Date()){
 const day=sydneyDay(now),at=now.toISOString();
 const integrated=!!await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='support_square_invoice_reviews'").first();
 const result=await db.prepare(`WITH bounds AS (SELECT ? now_at,? day_start,? tomorrow,? next_day),
 requests AS (
 SELECT 'guest' channel,r.id request_id,g.id guest_id,r.subject,r.status,r.seen_at,r.updated_at FROM support_guest_requests r LEFT JOIN support_guest_families g ON g.email=r.email
 UNION ALL SELECT 'member',id,NULL,subject,status,seen_at,updated_at FROM parent_feedback WHERE page_hint='learning-support'
 ), orders AS (
 SELECT o.id,o.request_id,o.channel,r.guest_id,r.subject,o.status,o.mode,o.start_at,o.end_at,o.amount_cents,o.checkout_started_at,o.updated_at,
 COALESCE(d.ready,0) ready,p.sequence,p.root_id,t.due_at installment_due_at,${integrated?"COALESCE(i.reference,CASE WHEN si.state='issued' THEN 'Square invoice' END)":"i.reference"} reference,i.verified_at,i.cancelled_at,COALESCE(t.due_at,i.due_at${integrated?",si.due_at":""}) due_at,c.requested_at cancellation_at,${integrated?"si.state square_state,sr.reason square_review,sr.last_at square_review_at":"NULL square_state,NULL square_review,NULL square_review_at"}
 FROM support_service_orders o JOIN requests r ON r.request_id=o.request_id AND r.channel=o.channel
 LEFT JOIN support_tutor_diary d ON d.order_id=o.id LEFT JOIN support_package_sessions p ON p.order_id=o.id
 LEFT JOIN support_installment_terms t ON t.order_id=o.id LEFT JOIN support_manual_invoices i ON i.order_id=CASE WHEN t.order_id IS NOT NULL THEN o.id ELSE COALESCE(p.root_id,o.id) END
 LEFT JOIN support_cancellation_requests c ON c.order_id=o.id AND c.status='pending'
 ${integrated?"LEFT JOIN support_square_invoice_intents si ON si.order_id=o.id LEFT JOIN support_square_invoice_reviews sr ON sr.order_id=o.id AND sr.resolved_at IS NULL":""}
 ), quotes AS (
 SELECT 'guest' channel,id,request_id,status,expires_at FROM support_guest_quotes
 UNION ALL SELECT 'member',id,feedback_id,status,expires_at FROM learning_support_quotes
 ), seats AS (
 SELECT e.id,e.request_id,r.guest_id,c.id class_id,c.topic,c.start_at,c.end_at,e.status,e.payment_due_at,e.attendance
 FROM support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id JOIN requests r ON r.channel='guest' AND r.request_id=e.request_id
 ), tasks AS (
 SELECT 'schedule' category,'tutor_session' action,o.id,o.channel,o.request_id,o.guest_id,NULL class_id,o.subject title,o.start_at when_at,o.status FROM orders o,bounds b WHERE o.mode='live' AND o.status='paid' AND o.cancellation_at IS NULL AND o.start_at<b.tomorrow AND o.end_at>b.day_start
 UNION ALL SELECT 'schedule','club_session',c.id,'club',NULL,NULL,c.id,c.topic,c.start_at,'scheduled' FROM support_english_classes c,bounds b WHERE c.start_at<b.tomorrow AND c.end_at>b.day_start
 UNION ALL SELECT 'attention','cancellation',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.cancellation_at,o.status FROM orders o WHERE o.cancellation_at IS NOT NULL AND o.status NOT IN ('cancelled','completed')
 UNION ALL SELECT 'attention','payment_review',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.updated_at,o.status FROM orders o WHERE o.status='review' AND o.cancellation_at IS NULL AND (o.sequence IS NULL OR o.sequence=1 OR o.installment_due_at IS NOT NULL)
 UNION ALL SELECT 'attention','square_review',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.square_review_at,o.status FROM orders o WHERE o.square_review IS NOT NULL AND o.status NOT IN ('cancelled','completed') AND o.cancellation_at IS NULL AND o.status<>'review'
 UNION ALL SELECT 'attention','square_overdue',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o,bounds b WHERE o.square_state='issued' AND o.status='confirmed' AND o.cancellation_at IS NULL AND o.square_review IS NULL AND o.due_at<=b.now_at
 UNION ALL SELECT 'payment','square_verify',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o,bounds b WHERE o.square_state='issued' AND o.status='confirmed' AND o.cancellation_at IS NULL AND o.square_review IS NULL AND o.due_at>b.now_at
 UNION ALL SELECT 'invoice','square_continue',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o WHERE o.square_state IN ('prepared','order_pending','order_created','invoice_pending','draft_created','publish_pending','review') AND o.status='confirmed' AND o.cancellation_at IS NULL
 UNION ALL SELECT 'attention','overdue_invoice',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o,bounds b WHERE o.status='confirmed' AND o.square_state IS NULL AND o.cancellation_at IS NULL AND o.verified_at IS NULL AND o.cancelled_at IS NULL AND o.due_at<=b.now_at AND (o.sequence IS NULL OR o.sequence=1 OR o.installment_due_at IS NOT NULL)
 UNION ALL SELECT 'preparation','prepare_lesson',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.start_at,o.status FROM orders o,bounds b WHERE o.mode='live' AND o.status='paid' AND o.cancellation_at IS NULL AND o.ready=0 AND o.end_at>b.now_at AND o.start_at<b.next_day
 UNION ALL SELECT 'enquiries','review_enquiry',r.request_id,r.channel,r.request_id,r.guest_id,NULL,r.subject,r.updated_at,r.status FROM requests r WHERE r.status NOT IN ('closed','resolved') AND (r.status='new' OR r.seen_at IS NULL)
 UNION ALL SELECT 'proposals','arrange_proposal',q.id,q.channel,q.request_id,r.guest_id,NULL,r.subject,q.expires_at,q.status FROM quotes q JOIN requests r ON r.channel=q.channel AND r.request_id=q.request_id,bounds b WHERE q.status='interested' AND q.expires_at>b.now_at AND r.status NOT IN ('closed','resolved') AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id WHERE o.channel=q.channel AND COALESCE(p.quote_id,o.quote_id)=q.id AND o.status<>'cancelled')
 UNION ALL SELECT 'invoice','issue_invoice',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o,bounds b WHERE o.status='confirmed' AND o.square_state IS NULL AND o.amount_cents>0 AND o.reference IS NULL AND o.checkout_started_at IS NULL AND o.cancellation_at IS NULL AND (o.sequence IS NULL OR o.sequence=1 OR o.installment_due_at IS NOT NULL) AND (o.due_at IS NULL OR o.due_at>b.now_at)
 UNION ALL SELECT 'payment','verify_invoice',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.due_at,o.status FROM orders o,bounds b WHERE o.status='confirmed' AND o.square_state IS NULL AND o.reference IS NOT NULL AND o.verified_at IS NULL AND o.cancelled_at IS NULL AND o.cancellation_at IS NULL AND o.due_at>b.now_at AND (o.sequence IS NULL OR o.sequence=1 OR o.installment_due_at IS NOT NULL)
 UNION ALL SELECT 'followup','finish_lesson',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.end_at,o.status FROM orders o,bounds b WHERE o.mode='live' AND o.status='paid' AND o.end_at<=b.now_at AND o.cancellation_at IS NULL
 UNION ALL SELECT 'waiting','parent_agreement',o.id,o.channel,o.request_id,o.guest_id,NULL,o.subject,o.start_at,o.status FROM orders o WHERE o.status='awaiting_confirmation' AND o.cancellation_at IS NULL AND (o.sequence IS NULL OR o.sequence=1)
 UNION ALL SELECT 'waiting','parent_proposal',q.id,q.channel,q.request_id,r.guest_id,NULL,r.subject,q.expires_at,q.status FROM quotes q JOIN requests r ON r.channel=q.channel AND r.request_id=q.request_id,bounds b WHERE q.status='offered' AND q.expires_at>b.now_at AND r.status NOT IN ('closed','resolved')
 UNION ALL SELECT CASE WHEN s.payment_due_at<=b.now_at THEN 'attention' WHEN s.status='reserved' THEN 'invoice' ELSE 'payment' END,CASE WHEN s.payment_due_at<=b.now_at THEN 'club_overdue' WHEN s.status='reserved' THEN 'club_invoice' ELSE 'club_verify' END,s.id,'club',s.request_id,s.guest_id,s.class_id,s.topic,s.payment_due_at,s.status FROM seats s,bounds b WHERE s.status IN ('reserved','invoiced')
 UNION ALL SELECT 'followup','club_attendance',s.id,'club',s.request_id,s.guest_id,s.class_id,s.topic,s.end_at,s.status FROM seats s,bounds b WHERE s.status='paid' AND s.attendance IS NULL AND s.end_at<=b.now_at
 ), ranked AS (SELECT *,COUNT(*) OVER(PARTITION BY category) total,ROW_NUMBER() OVER(PARTITION BY category ORDER BY when_at IS NULL,when_at,id,action) rn FROM tasks)
 SELECT category,action,id,channel,request_id,guest_id,class_id,title,when_at,status,total FROM ranked WHERE rn<=30 ORDER BY category,rn`).bind(at,day.from,day.tomorrow,day.next).all<any>();
 const rows=result.results||[];
 const groups=categories.map(category=>{const items=rows.filter(r=>r.category===category);return {category,total:items[0]?.total??0,items:items.map(({total,...r})=>r)};});
 const reports=await lessonReportQueue(db,now);
 const pending=reports.items.filter(r=>r.report_status!=="sent"&&r.report_status!=="no_progress");
 return {date:day.date,generated_at:at,groups,reports:{items:pending.slice(0,30),known_count:pending.length,truncated:reports.truncated||pending.length>30}};
}
