import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {stationeryRecipient,stationeryBase64,stationeryFingerprint,stationeryEmailEnabled,sendStationery,needsServiceTerms,termsDeliveryApproved,type PreparedStationery} from "./supportStationery";
const columns="id,order_id,kind,title,filename,pages,created_at,status,attempted_at,sent_at,terms_version,terms_pages";
export async function listStationery(db:D1Database,channel:Channel,id:string){
 return (await db.prepare("SELECT "+columns+" FROM support_stationery_documents WHERE channel=? AND request_id=? ORDER BY created_at DESC,id DESC LIMIT 100").bind(channel,id).all()).results||[];
}
export async function saveStationery(db:D1Database,channel:Channel,id:string,oid:string|null,doc:PreparedStationery,b:any){
 const fingerprint=await stationeryFingerprint(doc),pdf=stationeryBase64(doc.pdf);
 if(b.reviewed!==true||b.recipient_confirmed!==doc.recipient||b.fingerprint!==fingerprint||pdf.length>500000||(doc.terms&&stationeryBase64(doc.terms.pdf).length>500000))return null;
 const key=crypto.randomUUID();
 await db.prepare("INSERT INTO support_stationery_documents(id,channel,request_id,order_id,kind,title,filename,pdf_base64,recipient,pages,terms_version,terms_pdf_base64,terms_pages,fingerprint,created_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM support_stationery_documents WHERE channel=? AND request_id=?)<100 ON CONFLICT(channel,request_id,fingerprint) DO NOTHING").bind(key,channel,id,oid,doc.kind,doc.title,doc.filename,pdf,doc.recipient,doc.pages,doc.terms?.version??null,doc.terms?stationeryBase64(doc.terms.pdf):null,doc.terms?.pages??null,fingerprint,new Date().toISOString(),channel,id).run();
 return db.prepare("SELECT "+columns+" FROM support_stationery_documents WHERE channel=? AND request_id=? AND fingerprint=?").bind(channel,id,fingerprint).first<any>();
}
async function record(db:D1Database,channel:Channel,id:string,did:string){
 return db.prepare("SELECT * FROM support_stationery_documents WHERE channel=? AND request_id=? AND id=?").bind(channel,id,did).first<any>();
}
export async function downloadStationery(db:D1Database,channel:Channel,id:string,did:string){
 const d=await record(db,channel,id,did);return d?{filename:d.filename,mime:"application/pdf",base64:d.pdf_base64,terms:d.terms_pdf_base64?{filename:"sidequest-learning-support-service-terms.pdf",mime:"application/pdf",base64:d.terms_pdf_base64,version:d.terms_version,pages:d.terms_pages}:null}:null;
}
export async function deliverSavedStationery(e:Env,channel:Channel,id:string,did:string,b:any){
 if(!stationeryEmailEnabled(e)||b.reviewed!==true)return {error:"Email is disabled or review not confirmed."};
 const d=await record(e.DB,channel,id,did),recipient=await stationeryRecipient(e.DB,channel,id);
 if(!d||d.status!=="saved"||!recipient?.email||recipient.email!==d.recipient||b.recipient_confirmed!==recipient.email)return {error:"Document, delivery state or parent address changed. Review before sending."};
 if(needsServiceTerms(d.kind)&&(!d.terms_pdf_base64||!termsDeliveryApproved(e,d.terms_version)))return {error:"The companion service agreement must be approved before sending this document."};
 const now=new Date().toISOString();
 const claim=await e.DB.prepare("UPDATE support_stationery_documents SET status='sending',attempted_at=? WHERE channel=? AND request_id=? AND id=? AND status='saved'").bind(now,channel,id,did).run();
 if(!claim.meta?.changes)return {error:"Delivery already attempted."};
 // An uncertain provider response is never automatically retried.
 const sent=await sendStationery(e,{pdf:Uint8Array.from(atob(d.pdf_base64),c=>c.charCodeAt(0)),pages:d.pages,filename:d.filename,title:d.title,kind:d.kind,recipient:d.recipient,email_enabled:true,terms:d.terms_pdf_base64?{filename:"sidequest-learning-support-service-terms.pdf",pdf:Uint8Array.from(atob(d.terms_pdf_base64),c=>c.charCodeAt(0)),version:d.terms_version,pages:d.terms_pages}:undefined},b);
 await e.DB.prepare("UPDATE support_stationery_documents SET status=?,sent_at=? WHERE channel=? AND request_id=? AND id=? AND status='sending'").bind(sent?"sent":"review",sent?new Date().toISOString():null,channel,id,did).run();
 return {ok:sent,email_notification_sent:sent};
}

/** Owner-only report queue. Never return PDF bodies or private observations in this list. */
export async function lessonReportQueue(db:D1Database,now=new Date()){
 const at=now.toISOString();
 const rows=await db.prepare("SELECT o.id,o.channel,o.request_id,o.start_at,o.end_at,COALESCE(d.learner_label,'') learner_label,CASE WHEN EXISTS(SELECT 1 FROM json_each(p.checkpoints_json) j WHERE json_extract(j.value,'$.status') IN ('covered','independent','supported','practise')) THEN 1 ELSE 0 END has_observations,p.updated_at progress_updated_at,(SELECT s.status FROM support_stationery_documents s WHERE s.channel=o.channel AND s.request_id=o.request_id AND s.order_id=o.id AND s.kind='session_report' AND s.created_at>=p.updated_at ORDER BY s.created_at DESC,s.id DESC LIMIT 1) report_status FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id LEFT JOIN support_lesson_progress p ON p.order_id=o.id WHERE o.mode='live' AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND o.end_at<=? ORDER BY o.end_at DESC,o.id LIMIT 201").bind(at).all<any>();
 const all=rows.results||[];
 return {items:all.slice(0,200).map(r=>({id:r.id,channel:r.channel,request_id:r.request_id,start_at:r.start_at,end_at:r.end_at,learner_label:r.learner_label,report_status:r.report_status??(r.has_observations?"needs_review":"no_progress")})),truncated:all.length>200};
}
