import {familyClubInvoiceSummaries} from "./clubSquareInvoicePublication";
import {familyIssuedSquareInvoiceSummaries} from "./unifiedPortalSquareInvoices";
import type {App,AuthUser,Guards} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {orderPublic} from "./supportOrders";

// Single server-side scope for canonical, explicitly claimed legacy, and existing member requests.
// Preserve the original channel for order joins; never use a name or bare email as canonical proof.
const scope=`WITH own_requests AS (
 SELECT r.id,'guest' channel,'portal' source,r.subject,r.status,r.updated_at,p.learner_id,r.email
 FROM support_portal_enquiries p JOIN support_guest_requests r ON r.id=p.request_id
 WHERE p.family_id=? AND p.parent_user_id=?
 UNION ALL
 SELECT r.id,'guest','legacy',r.subject,r.status,r.updated_at,NULL,r.email
 FROM support_family_claims c JOIN support_guest_families f ON f.id=c.guest_family_id
 JOIN users u ON u.id=c.parent_user_id AND u.family_id=c.family_id AND u.email=f.email
 JOIN support_guest_requests r ON r.email=f.email
 WHERE c.family_id=? AND c.parent_user_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>''
 AND NOT EXISTS(SELECT 1 FROM support_portal_enquiry_origins x WHERE x.request_id=r.id)
 UNION ALL
 SELECT r.id,'member','member',r.subject,r.status,r.updated_at,NULL,NULL FROM parent_feedback r
 WHERE r.family_id=? AND r.user_id=? AND r.page_hint='learning-support'
)`;
const binds=(a:AuthUser)=>[a.family_id,a.id,a.family_id,a.id,a.family_id,a.id];
export async function familyOverview(db:D1Database,a:AuthUser){
 if(!await verifiedPortalIdentity(db,a))return null;
 const [orderRows,clubRows,threadRows]=await Promise.all([
 db.prepare(scope+` SELECT o.*,r.source,r.subject,r.status request_status,r.learner_id,
 p.root_id package_root_id,p.sequence package_sequence,p.total package_total,p.quote_id original_quote_id,
 t.due_at installment_due_at,i.reference invoice_reference,i.due_at payment_due_at,i.verified_at invoice_verified_at,i.cancelled_at invoice_cancelled_at,
 CASE WHEN o.status NOT IN ('cancelled','completed') AND EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending') THEN 1 ELSE 0 END cancellation_pending
 FROM own_requests r JOIN support_service_orders o ON o.request_id=r.id AND o.channel=r.channel
 LEFT JOIN support_package_sessions p ON p.order_id=o.id
 LEFT JOIN support_installment_terms t ON t.order_id=o.id
 LEFT JOIN support_manual_invoices i ON i.order_id=CASE WHEN t.order_id IS NOT NULL THEN o.id ELSE COALESCE(p.root_id,o.id) END
 ORDER BY CASE WHEN o.status NOT IN ('cancelled','completed') AND (o.start_at IS NULL OR o.end_at>=?) THEN 0 ELSE 1 END,COALESCE(o.start_at,o.created_at) DESC,o.id LIMIT 201`).bind(...binds(a),new Date().toISOString()).all(),
 db.prepare(scope+` SELECT e.id,c.id class_id,e.request_id,r.source,r.subject,r.status request_status,r.learner_id,c.topic,c.start_at,c.end_at,e.status,e.payment_due_at,e.invoice_reference,e.attendance,EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=c.id) round_managed
 FROM own_requests r JOIN support_english_enrolments e ON e.request_id=r.id AND r.channel='guest'
 JOIN support_english_classes c ON c.id=e.class_id
 ORDER BY CASE WHEN e.status<>'cancelled' AND c.end_at>=? THEN 0 ELSE 1 END,c.start_at DESC,e.id LIMIT 201`).bind(...binds(a),new Date().toISOString()).all(),
 db.prepare(scope+` SELECT r.id,r.source,r.subject,r.status,r.updated_at,r.learner_id,
 CASE WHEN r.channel='guest' THEN (SELECT COUNT(*) FROM support_guest_messages m WHERE m.request_id=r.id) ELSE (SELECT COUNT(*) FROM parent_feedback_replies m WHERE m.feedback_id=r.id) END message_count,
 CASE WHEN r.channel='member' THEN (SELECT COUNT(*) FROM parent_feedback_replies m WHERE m.feedback_id=r.id AND m.parent_read_at IS NULL) ELSE NULL END unread_count
 FROM own_requests r ORDER BY r.updated_at DESC,r.id LIMIT 201`).bind(...binds(a)).all()
 ]);
 const orders=(orderRows.results||[]) as any[],clubs=(clubRows.results||[]) as any[],threads=(threadRows.results||[]) as any[];
 // Strict projection: no private tutor notes, provider IDs, email addresses or payment links in overview.
 return {orders:orders.slice(0,200).map(r=>{const o=orderPublic(r);return {id:o.id,request_id:r.request_id,source:r.source,subject:r.subject,learner_id:r.learner_id,request_status:r.request_status,mode:o.mode,start_at:o.start_at,end_at:o.end_at,status:o.status,package_root_id:o.package_root_id,package_sequence:o.package_sequence,package_total:o.package_total,installment:o.installment,installment_due_at:o.installment_due_at,amount_cents:o.amount_cents,cancellation_pending:o.cancellation_pending,invoice_reference:o.invoice_reference,payment_due_at:o.payment_due_at,invoice_verified_at:o.invoice_verified_at,invoice_overdue:o.invoice_overdue,legacy_checkout:o.legacy_checkout};}),
 clubs:clubs.slice(0,200),threads:threads.slice(0,200),limited:orders.length>200||clubs.length>200||threads.length>200};
}
export function registerFamilyOverview(app:App,g:Guards){
 app.get("/api/family-portal/overview",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);
  const r=await familyOverview(c.env.DB,c.get("user"));if(!r)return c.json({detail:"Verified parent access required."},403);
  const issued=await familyIssuedSquareInvoiceSummaries(c.env,c.get("user"));
  const byOrder=new Map(issued.map(i=>[i.id,i]));
  const clubInvoices=await familyClubInvoiceSummaries(c.env,c.get("user"));
  return c.json({...r,club_invoices:clubInvoices.slice(0,200),limited:r.limited||issued.length>200||clubInvoices.length>200,orders:r.orders.map(o=>({...o,square_invoice:byOrder.get(o.id)||null}))});
 });
}
