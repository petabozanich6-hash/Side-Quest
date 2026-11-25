import type {Env} from "./types";
import {getOrder,confirmServiceOrder,type Channel} from "./supportOrders";
import {serviceTermsAttachment,stationeryBase64,termsDeliveryApproved} from "./supportStationery";
export async function termsReview(e:Env,channel:Channel,id:string,oid:string){
 const order=await getOrder(e.DB,channel,id,oid);
 if(!order||order.status!=="awaiting_confirmation"||order.package_sequence>1)return null;
 const agreement=serviceTermsAttachment();
 const approved=termsDeliveryApproved(e,agreement.version);
 const rows=order.package_root_id? (await e.DB.prepare("SELECT o.id,o.scope,o.delivery,o.terms,o.amount_cents,o.start_at,o.end_at,t.due_at FROM support_package_sessions p JOIN support_service_orders o ON o.id=p.order_id LEFT JOIN support_installment_terms t ON t.order_id=o.id WHERE p.root_id=? AND o.channel=? AND o.request_id=? ORDER BY p.sequence").bind(oid,channel,id).all()).results: [{id:oid,scope:order.scope,delivery:order.delivery,terms:order.terms,amount_cents:order.amount_cents,start_at:order.start_at,end_at:order.end_at,due_at:order.installment_due_at??null}];
 if(!rows?.length)return null;
 const arrangements=JSON.stringify(rows);
 const base64=stationeryBase64(agreement.pdf);
 const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify([channel,id,oid,agreement.version,base64,arrangements])));
 const fingerprint=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,"0")).join("");
 return {approved,version:agreement.version,filename:agreement.filename,mime:"application/pdf",base64,arrangements,fingerprint};
}
// Gate remains explicitly disabled on the existing production service until approved terms are published.
// Activation of the new tutoring release requires SUPPORT_TERMS_REQUIRED=true.
export async function confirmReviewedTerms(e:Env,channel:Channel,id:string,oid:string,actor:string,b:any,now=new Date()){
 if(b?.confirmed!==true)return false;
 if(e.SUPPORT_TERMS_REQUIRED!=="true")return confirmServiceOrder(e.DB,channel,id,oid,now);
 const review=await termsReview(e,channel,id,oid);
 if(!review?.approved||b.terms_version!==review.version||b.terms_fingerprint!==review.fingerprint||b.terms_accepted!==true)return false;
 const when=now.toISOString();
 // The insert and confirmation are one D1 batch. Only an awaiting root, with
 // no pending cancellation, can be accepted. A trigger-free predicate ties
 // the state transition to the exact newly inserted acceptance.
 const db=e.DB;
 const statements=[
 db.prepare("INSERT OR IGNORE INTO support_terms_acceptances(order_id,channel,request_id,accepted_by,agreement_version,agreement_pdf_base64,arrangements_json,fingerprint,accepted_at) SELECT id,channel,request_id,?,?,?,?,?,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status='awaiting_confirmation' AND (start_at IS NULL OR start_at>?) AND NOT EXISTS(SELECT 1 FROM support_package_sessions p WHERE p.order_id=support_service_orders.id AND p.root_id<>p.order_id) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_service_orders.id AND c.status='pending')").bind(actor,review.version,review.base64,review.arrangements,review.fingerprint,when,oid,channel,id,when),
 db.prepare("UPDATE support_service_orders SET status=CASE WHEN amount_cents=0 THEN 'paid' ELSE 'confirmed' END,confirmed_at=?,paid_at=CASE WHEN amount_cents=0 THEN ? ELSE NULL END,updated_at=? WHERE id=? AND channel=? AND request_id=? AND status='awaiting_confirmation' AND EXISTS(SELECT 1 FROM support_terms_acceptances a WHERE a.order_id=support_service_orders.id AND a.accepted_at=? AND a.fingerprint=? AND a.accepted_by=?)").bind(when,when,when,oid,channel,id,when,review.fingerprint,actor)
 ];
 const results=await db.batch(statements);
 return !!results[0]?.meta?.changes&&!!results[1]?.meta?.changes;
}
export async function acceptanceReceipt(db:D1Database,channel:Channel,id:string,oid:string){
 const a=await db.prepare("SELECT order_id,agreement_version,accepted_at,fingerprint,agreement_pdf_base64,arrangements_json FROM support_terms_acceptances WHERE channel=? AND request_id=? AND order_id=?").bind(channel,id,oid).first<any>();
 return a?{...a,filename:"sidequest-learning-support-service-terms.pdf",mime:"application/pdf",base64:a.agreement_pdf_base64}:null;
}
