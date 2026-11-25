import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {stationeryRecipient,stationeryBase64,stationeryFingerprint,stationeryEmailEnabled,sendStationery,type PreparedStationery} from "./supportStationery";
const columns="id,order_id,kind,title,filename,pages,created_at,status,attempted_at,sent_at";
export async function listStationery(db:D1Database,channel:Channel,id:string){
 return (await db.prepare("SELECT "+columns+" FROM support_stationery_documents WHERE channel=? AND request_id=? ORDER BY created_at DESC,id DESC LIMIT 100").bind(channel,id).all()).results||[];
}
export async function saveStationery(db:D1Database,channel:Channel,id:string,oid:string|null,doc:PreparedStationery,b:any){
 const fingerprint=await stationeryFingerprint(doc),pdf=stationeryBase64(doc.pdf);
 if(b.reviewed!==true||b.recipient_confirmed!==doc.recipient||b.fingerprint!==fingerprint||pdf.length>500000)return null;
 const key=crypto.randomUUID();
 await db.prepare("INSERT INTO support_stationery_documents(id,channel,request_id,order_id,kind,title,filename,pdf_base64,recipient,pages,fingerprint,created_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM support_stationery_documents WHERE channel=? AND request_id=?)<100 ON CONFLICT(channel,request_id,fingerprint) DO NOTHING").bind(key,channel,id,oid,doc.kind,doc.title,doc.filename,pdf,doc.recipient,doc.pages,fingerprint,new Date().toISOString(),channel,id).run();
 return db.prepare("SELECT "+columns+" FROM support_stationery_documents WHERE channel=? AND request_id=? AND fingerprint=?").bind(channel,id,fingerprint).first<any>();
}
async function record(db:D1Database,channel:Channel,id:string,did:string){
 return db.prepare("SELECT * FROM support_stationery_documents WHERE channel=? AND request_id=? AND id=?").bind(channel,id,did).first<any>();
}
export async function downloadStationery(db:D1Database,channel:Channel,id:string,did:string){
 const d=await record(db,channel,id,did);return d?{filename:d.filename,mime:"application/pdf",base64:d.pdf_base64}:null;
}
export async function deliverSavedStationery(e:Env,channel:Channel,id:string,did:string,b:any){
 if(!stationeryEmailEnabled(e)||b.reviewed!==true)return {error:"Email is disabled or review not confirmed."};
 const d=await record(e.DB,channel,id,did),recipient=await stationeryRecipient(e.DB,channel,id);
 if(!d||d.status!=="saved"||!recipient?.email||recipient.email!==d.recipient||b.recipient_confirmed!==recipient.email)return {error:"Document, delivery state or parent address changed. Review before sending."};
 const now=new Date().toISOString();
 const claim=await e.DB.prepare("UPDATE support_stationery_documents SET status='sending',attempted_at=? WHERE channel=? AND request_id=? AND id=? AND status='saved'").bind(now,channel,id,did).run();
 if(!claim.meta?.changes)return {error:"Delivery already attempted."};
 // An uncertain provider response is never automatically retried.
 const sent=await sendStationery(e,{pdf:Uint8Array.from(atob(d.pdf_base64),c=>c.charCodeAt(0)),pages:d.pages,filename:d.filename,title:d.title,kind:d.kind,recipient:d.recipient,email_enabled:true},b);
 await e.DB.prepare("UPDATE support_stationery_documents SET status=?,sent_at=? WHERE channel=? AND request_id=? AND id=? AND status='sending'").bind(sent?"sent":"review",sent?new Date().toISOString():null,channel,id,did).run();
 return {ok:sent,email_notification_sent:sent};
}
