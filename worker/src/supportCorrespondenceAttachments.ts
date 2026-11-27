import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {stationeryBase64} from "./supportStationery";
const MAX=5*1024*1024, LIMIT=3;
const hash=async(bytes:Uint8Array)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new Uint8Array(bytes))),x=>x.toString(16).padStart(2,"0")).join("");
export function decodeCorrespondencePdf(b:any){
 const filename=typeof b?.filename==="string"?b.filename.trim():"";
 if(b?.reviewed!==true||!filename||filename.length>150||/[\x00-\x1f/\\]/.test(filename)||!/\.pdf$/i.test(filename)||typeof b.base64!=="string"||b.base64.length>Math.ceil(MAX/3)*4||!/^[A-Za-z0-9+/]+={0,2}$/.test(b.base64))return null;
 try{
 const bytes=Uint8Array.from(atob(b.base64),c=>c.charCodeAt(0));
 if(bytes.length<10||bytes.length>MAX||![37,80,68,70,45].every((v,i)=>bytes[i]===v)||!new TextDecoder().decode(bytes.subarray(Math.max(0,bytes.length-2048))).includes("%%EOF"))return null;
 return {filename,bytes};
 }catch{return null;}
}
export async function correspondenceAttachments(db:D1Database,channel:Channel,id:string,did:string){
 return (await db.prepare("SELECT a.id,a.filename,a.mime,a.size_bytes,a.created_at FROM support_correspondence_attachments a JOIN support_stationery_documents d ON d.id=a.document_id WHERE d.channel=? AND d.request_id=? AND d.id=? ORDER BY a.created_at,a.id").bind(channel,id,did).all<any>()).results||[];
}
export async function uploadCorrespondenceAttachment(e:Env,channel:Channel,id:string,did:string,b:any){
 const v=decodeCorrespondencePdf(b);
 if(!e.BUCKET||!v)return {error:"Choose a reviewed PDF up to 5 MB."};
 const d=await e.DB.prepare("SELECT id FROM support_stationery_documents WHERE channel=? AND request_id=? AND id=? AND status='saved'").bind(channel,id,did).first();
 if(!d)return {error:"Only an unsent saved document can receive attachments."};
 const aid=crypto.randomUUID(),key="support-private/correspondence/"+aid,sha=await hash(v.bytes);
 await e.BUCKET.put(key,v.bytes,{httpMetadata:{contentType:"application/pdf"}});
 try{
 const result=await e.DB.prepare("INSERT INTO support_correspondence_attachments(id,document_id,filename,mime,size_bytes,storage_key,sha256,created_at) SELECT ?,d.id,?,'application/pdf',?,?,?,? FROM support_stationery_documents d WHERE d.id=? AND d.channel=? AND d.request_id=? AND d.status='saved' AND (SELECT COUNT(*) FROM support_correspondence_attachments a WHERE a.document_id=d.id)<? AND NOT EXISTS(SELECT 1 FROM support_correspondence_attachments a WHERE a.document_id=d.id AND (a.sha256=? OR a.filename=?))").bind(aid,v.filename,v.bytes.length,key,sha,new Date().toISOString(),did,channel,id,LIMIT,sha,v.filename).run();
 if(result.meta?.changes)return {ok:true,attachments:await correspondenceAttachments(e.DB,channel,id,did)};
 }catch{try{await e.BUCKET.delete(key);}catch{}throw Error("Attachment save failed.");}
 try{await e.BUCKET.delete(key);}catch{}
 return {error:"Document changed, attachment already exists, or three-file limit reached."};
}
async function attachmentBytes(e:Env,r:any){
 if(!e.BUCKET||r.storage_key!=="support-private/correspondence/"+r.id||r.size_bytes>MAX)return null;
 const obj=await e.BUCKET.get(r.storage_key);if(!obj||obj.size!==r.size_bytes)return null;
 const bytes=new Uint8Array(await obj.arrayBuffer());
 if(await hash(bytes)!==r.sha256)return null;
 return bytes;
}
export async function downloadCorrespondenceAttachment(e:Env,channel:Channel,id:string,did:string,aid:string){
 const r=await e.DB.prepare("SELECT a.* FROM support_correspondence_attachments a JOIN support_stationery_documents d ON d.id=a.document_id WHERE d.channel=? AND d.request_id=? AND d.id=? AND a.id=?").bind(channel,id,did,aid).first<any>();
 if(!r)return null;const bytes=await attachmentBytes(e,r);
 return bytes?{filename:r.filename,mime:"application/pdf",base64:stationeryBase64(bytes)}:null;
}
export async function removeCorrespondenceAttachment(e:Env,channel:Channel,id:string,did:string,aid:string){
 const r=await e.DB.prepare("SELECT a.storage_key FROM support_correspondence_attachments a JOIN support_stationery_documents d ON d.id=a.document_id WHERE d.channel=? AND d.request_id=? AND d.id=? AND a.id=? AND d.status='saved'").bind(channel,id,did,aid).first<any>();
 if(!r||r.storage_key!=="support-private/correspondence/"+aid)return false;
 const result=await e.DB.prepare("DELETE FROM support_correspondence_attachments WHERE id=? AND document_id=? AND EXISTS(SELECT 1 FROM support_stationery_documents d WHERE d.id=? AND d.channel=? AND d.request_id=? AND d.status='saved')").bind(aid,did,did,channel,id).run();
 if(!result.meta?.changes)return false;
 try{await e.BUCKET?.delete(r.storage_key);}catch{/* orphan remains private; housekeeping review */}
 return true;
}
export async function loadCorrespondenceFiles(e:Env,channel:Channel,id:string,did:string,ids:string[]){
 const rows=(await e.DB.prepare("SELECT a.* FROM support_correspondence_attachments a JOIN support_stationery_documents d ON d.id=a.document_id WHERE d.channel=? AND d.request_id=? AND d.id=? ORDER BY a.created_at,a.id").bind(channel,id,did).all<any>()).results||[];
 if(rows.length>LIMIT||rows.length!==ids.length||rows.some(r=>!ids.includes(r.id)))return null;
 const files=[];
 for(const r of rows){const bytes=await attachmentBytes(e,r);if(!bytes)return null;files.push({filename:r.filename,type:"application/pdf",content:bytes,disposition:"attachment" as const});}
 return files;
}

export function squarePaymentLink(value:unknown):string|null{
 if(typeof value!=="string"||value.length>2048)return null;
 try{const u=new URL(value.trim());if(u.protocol!=="https:"||u.username||u.password||u.port||u.hash)return null;
 if((u.hostname==="squareup.com"||u.hostname==="app.squareup.com")&&u.pathname.startsWith("/pay-invoice/")&&u.pathname.length>13)return u.href;
 if(u.hostname==="square.link"&&/^\/u\/[A-Za-z0-9_-]+\/?$/.test(u.pathname))return u.href;
 return null;}catch{return null;}
}
export async function correspondencePaymentLink(db:D1Database,channel:Channel,id:string,did:string){
 const r=await db.prepare("SELECT l.url FROM support_correspondence_payment_links l JOIN support_stationery_documents d ON d.id=l.document_id WHERE d.channel=? AND d.request_id=? AND d.id=?").bind(channel,id,did).first<{url:string}>();
 return r?.url??null;
}
export async function saveCorrespondencePaymentLink(db:D1Database,channel:Channel,id:string,did:string,b:any){
 if(b?.reviewed!==true)return false;
 if(b.url===""){
 const r=await db.prepare("DELETE FROM support_correspondence_payment_links WHERE document_id=? AND EXISTS(SELECT 1 FROM support_stationery_documents d WHERE d.id=? AND d.channel=? AND d.request_id=? AND d.status='saved')").bind(did,did,channel,id).run();return !!r.meta?.changes;
 }
 const url=squarePaymentLink(b.url);if(!url)return false;
 const r=await db.prepare("INSERT INTO support_correspondence_payment_links(document_id,url,updated_at) SELECT id,?,? FROM support_stationery_documents WHERE id=? AND channel=? AND request_id=? AND status='saved' ON CONFLICT(document_id) DO UPDATE SET url=excluded.url,updated_at=excluded.updated_at").bind(url,new Date().toISOString(),did,channel,id).run();
 return !!r.meta?.changes;
}
