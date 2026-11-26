import type {Env} from "./types";
import {lessonReportQueue} from "./supportStationeryHistory";
type Bounds={from:string;tomorrow:string;next:string};
export async function unifiedBriefingSections(e:Env,day:Bounds,now=new Date()){
 const db=e.DB,at=now.toISOString();
 // Missing migrations and failed reads are explicitly unknown, never zero.
 const count=async(label:string,sql:string,...args:string[])=>{
  try{const r=await db.prepare(sql).bind(...args).first<{n:number}>();return label+": "+Number(r?.n??0);}
  catch{return label+": unavailable — review Owner HQ";}
 };
 const q=(label:string,sql:string,...args:string[])=>count(label,"SELECT COUNT(*) n FROM "+sql,...args);
 const [schedule,payments,certificates,automation,reports]=await Promise.all([
 Promise.all([
 q("Club workshops today","support_english_classes WHERE start_at<? AND end_at>?",day.tomorrow,day.from),
 q("Confirmed paid Club places today","support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id JOIN support_guest_requests r ON r.id=e.request_id WHERE e.status='paid' AND r.status NOT IN ('closed','resolved') AND c.start_at<? AND c.end_at>?",day.tomorrow,day.from),
 q("Club workshops tomorrow","support_english_classes WHERE start_at>=? AND start_at<?",day.tomorrow,day.next),
 q("Past paid Club places awaiting attendance","support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id WHERE e.status='paid' AND e.attendance IS NULL AND c.end_at<=?",at)
 ]),
 Promise.all([
 q("New Club payment obligations overdue (not individual seats)","support_club_payment_obligations WHERE status IN ('reserved','issued') AND due_at<=?",at),
 q("New Club payment obligations due today or tomorrow","support_club_payment_obligations WHERE status IN ('reserved','issued') AND due_at>? AND due_at<?",at,day.next),
 q("Club Square payment exceptions","support_club_square_reviews"),
 q("Tutoring Square payment exceptions","support_square_invoice_reviews WHERE resolved_at IS NULL"),
 q("Tutoring integrated invoices awaiting payment","support_square_invoice_intents i JOIN support_service_orders o ON o.id=i.order_id WHERE i.state='issued' AND o.status='confirmed'"),
 q("Club invoice processing exceptions","support_club_invoice_auto_attempts WHERE status IN ('running','review')"),
 q("Club cancellation processing exceptions","support_club_cancel_attempts WHERE status IN ('pending','review')")
 ]),
 Promise.all([
 q("Eligible certificates awaiting approval","support_club_certificate_candidates c WHERE c.seat_count=c.expected_count AND c.completed_count=c.expected_count AND julianday(c.last_end_at)<=julianday(?) AND NOT EXISTS(SELECT 1 FROM support_club_certificates x WHERE x.kind=c.kind AND x.booking_id=c.booking_id)",at),
 q("Approved certificates missing signed artwork","support_club_certificates WHERE status='approved' AND template_id IS NULL"),
 q("Digital certificates awaiting first email attempt","support_club_certificates c WHERE c.status='approved' AND c.template_id IS NOT NULL AND c.delivery IN ('pdf','both') AND NOT EXISTS(SELECT 1 FROM support_club_certificate_email d WHERE d.certificate_id=c.id)"),
 q("Certificate email attempts needing review","support_club_certificate_email WHERE status IN ('sending','review','suppressed')"),
 q("Replacement email attempts needing review","support_club_certificate_reissues WHERE status IN ('sending','review','suppressed')"),
 q("Printed certificates awaiting address","support_club_certificates c WHERE c.status='approved' AND c.template_id IS NOT NULL AND c.delivery IN ('post','both') AND NOT EXISTS(SELECT 1 FROM support_club_certificate_postal p WHERE p.certificate_id=c.id)"),
 q("Printed certificates ready to print","support_club_certificate_postal p JOIN support_club_certificates c ON c.id=p.certificate_id WHERE c.status='approved' AND p.status='ready'"),
 q("Printed certificates awaiting dispatch","support_club_certificate_postal p JOIN support_club_certificates c ON c.id=p.certificate_id WHERE c.status='approved' AND p.status='printed'")
 ]),
 Promise.all([
 q("Club invoice automation accepted since Sydney midnight","support_club_invoice_auto_attempts WHERE status='issued' AND finished_at>=? AND finished_at<=?",day.from,at),
 q("Club payment/session notices accepted since midnight","support_club_notices WHERE status='sent' AND sent_at>=? AND sent_at<=?",day.from,at),
 q("Club notices needing review","support_club_notices WHERE status IN ('sending','review')"),
 q("Club overdue obligations released since midnight","support_club_cancel_attempts WHERE status='released' AND finished_at>=? AND finished_at<=?",day.from,at),
 q("Certificate emails accepted since midnight","support_club_certificate_email WHERE status='sent' AND sent_at>=? AND sent_at<=?",day.from,at),
 q("Certificates recorded as posted since midnight","support_club_certificate_postal WHERE status='posted' AND posted_at>=? AND posted_at<=?",day.from,at)
 ]),
 (async()=>{try{const r=await lessonReportQueue(db,now);return ["Ended tutoring lessons awaiting reviewed report or correspondence: "+r.items.filter(x=>x.report_status!=="sent").length+(r.truncated?" (latest 200 only)":""),"Lessons without recorded observations: "+r.items.filter(x=>x.report_status==="no_progress").length];}catch{return ["Tutoring report queue unavailable — review Owner HQ."];}})()
 ]);
 return [
 {heading:"English Club schedule",lines:schedule},
 {heading:"Integrated payment exceptions",lines:[...payments,"Obligations are not seat counts. These are recorded states, not live Square balances."]},
 {heading:"Learning reports and certificates",lines:[...reports,...certificates,"Review current eligibility in HQ before approving or posting."]},
 {heading:"Automation activity — recorded outcomes",lines:[...automation,"Accepted email means provider acceptance, not inbox delivery. Sandbox records are not real customer deliveries."]}
 ];
}
