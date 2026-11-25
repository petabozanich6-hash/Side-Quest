import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {nowIso} from "./types";
const SCHEMA=["CREATE TABLE IF NOT EXISTS support_files (id TEXT PRIMARY KEY,title TEXT NOT NULL,subject TEXT NOT NULL,year_level TEXT NOT NULL,filename TEXT NOT NULL,mime TEXT NOT NULL,size_bytes INTEGER NOT NULL,storage_key TEXT NOT NULL UNIQUE,audience TEXT NOT NULL CHECK(audience IN ('tutor','learner')),status TEXT NOT NULL CHECK(status IN ('active','archived')),created_at TEXT NOT NULL)","CREATE INDEX IF NOT EXISTS idx_support_files_search ON support_files(status,audience,created_at)","CREATE TABLE IF NOT EXISTS support_file_grants (order_id TEXT NOT NULL REFERENCES support_service_orders(id) ON DELETE CASCADE,file_id TEXT NOT NULL REFERENCES support_files(id),created_at TEXT NOT NULL,revoked_at TEXT,PRIMARY KEY(order_id,file_id))"] as const;
const MAX=5*1024*1024;
async function ensure(db:D1Database){for(const s of SCHEMA)await db.prepare(s).run();}
const str=(v:unknown,n:number)=>typeof v==="string"&&v.trim().length<=n?v.trim():"";
const meta="id,title,subject,year_level,filename,mime,size_bytes,audience,status,created_at";
export function decodeResource(b:any){
 const filename=str(b?.filename,160),title=str(b?.title,120),subject=str(b?.subject,80),year_level=str(b?.year_level,40),audience=b?.audience;
 if(!filename||!title||!subject||!year_level||!["tutor","learner"].includes(audience)||b.reviewed!==true||typeof b?.base64!=="string"||b.base64.length>Math.ceil(MAX/3)*4||!/^[A-Za-z0-9+/]+={0,2}$/.test(b.base64)||/[\x00-\x1f/\\]/.test(filename))return null;
 let bytes:Uint8Array;try{bytes=Uint8Array.from(atob(b.base64),c=>c.charCodeAt(0));}catch{return null;}
 if(!bytes.length||bytes.length>MAX)return null;
 const pdf=/\.pdf$/i.test(filename)&&[37,80,68,70,45].every((v,i)=>bytes[i]===v);
 const png=/\.png$/i.test(filename)&&[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
 const jpg=/\.jpe?g$/i.test(filename)&&[255,216,255].every((v,i)=>bytes[i]===v);
 if(!pdf&&!png&&!jpg)return null;
 return {filename,title,subject,year_level,audience,mime:pdf?"application/pdf":png?"image/png":"image/jpeg",bytes};
}
export async function uploadResource(e:Env,b:any){
 if(!e.BUCKET)return {error:"Private storage unavailable."};
 const v=decodeResource(b);if(!v)return {error:"Choose a reviewed PDF, PNG or JPEG up to 5 MB and enter title, subject and year."};
 await ensure(e.DB);const id=crypto.randomUUID(),key="support-private/"+id;
 await e.BUCKET.put(key,v.bytes,{httpMetadata:{contentType:v.mime}});
 try{await e.DB.prepare("INSERT INTO support_files(id,title,subject,year_level,filename,mime,size_bytes,storage_key,audience,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)").bind(id,v.title,v.subject,v.year_level,v.filename,v.mime,v.bytes.length,key,v.audience,nowIso()).run();}
 catch(err){try{await e.BUCKET.delete(key);}catch{}throw err;}return {id};
}
export async function listResources(db:D1Database,q:string,learnerOnly=false){
 await ensure(db);const t="%"+q.slice(0,100).replace(/[%_]/g,"")+"%";
 return (await db.prepare("SELECT "+meta+" FROM support_files WHERE status='active'"+(learnerOnly?" AND audience='learner'":"")+" AND (title LIKE ? OR subject LIKE ? OR year_level LIKE ?) ORDER BY created_at DESC LIMIT 100").bind(t,t,t).all()).results||[];
}
export async function archiveResource(db:D1Database,id:string){
 await ensure(db);return !!(await db.prepare("UPDATE support_files SET status='archived' WHERE id=? AND status='active'").bind(id).run()).meta?.changes;
}
export async function downloadResource(e:Env,id:string,oid?:string){
 await ensure(e.DB);if(!e.BUCKET)return null;
 const r=await e.DB.prepare("SELECT f.* FROM support_files f WHERE f.id=? AND f.status='active'"+(oid?" AND f.audience='learner' AND EXISTS(SELECT 1 FROM support_file_grants g JOIN support_service_orders o ON o.id=g.order_id WHERE g.file_id=f.id AND g.order_id=? AND g.revoked_at IS NULL AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL)":"")).bind(...(oid?[id,oid]:[id])).first<any>();
 if(!r||!String(r.storage_key).startsWith("support-private/")||r.size_bytes>MAX)return null;
 const obj=await e.BUCKET.get(r.storage_key);if(!obj||obj.size>MAX)return null;
 const bytes=new Uint8Array(await obj.arrayBuffer());let raw="";for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return {filename:r.filename,mime:r.mime,base64:btoa(raw)};
}
export async function grantResource(db:D1Database,channel:Channel,id:string,oid:string,fid:string){
 if(!await getOrder(db,channel,id,oid))return false;await ensure(db);
 return !!(await db.prepare("INSERT INTO support_file_grants(order_id,file_id,created_at) SELECT o.id,f.id,? FROM support_service_orders o CROSS JOIN support_files f WHERE o.id=? AND o.channel=? AND o.request_id=? AND o.status IN ('paid','completed') AND o.checkout_started_at IS NULL AND f.id=? AND f.status='active' AND f.audience='learner' ON CONFLICT(order_id,file_id) DO UPDATE SET revoked_at=NULL,created_at=excluded.created_at").bind(nowIso(),oid,channel,id,fid).run()).meta?.changes;
}
export async function revokeResource(db:D1Database,channel:Channel,id:string,oid:string,fid:string){
 if(!await getOrder(db,channel,id,oid))return false;await ensure(db);
 return !!(await db.prepare("UPDATE support_file_grants SET revoked_at=? WHERE order_id=? AND file_id=? AND revoked_at IS NULL").bind(nowIso(),oid,fid).run()).meta?.changes;
}
export async function grantedResources(db:D1Database,channel:Channel,id:string,oid:string){
 const o=await getOrder(db,channel,id,oid);if(!o||!["paid","completed"].includes(o.status)||o.checkout_started_at)return [];
 await ensure(db);return (await db.prepare("SELECT "+meta.split(",").map(x=>"f."+x).join(",")+" FROM support_file_grants g JOIN support_files f ON f.id=g.file_id WHERE g.order_id=? AND g.revoked_at IS NULL AND f.status='active' AND f.audience='learner' ORDER BY g.created_at DESC LIMIT 100").bind(oid).all()).results||[];
}

/** Presentable learner images are distinct from persistent family downloads. */
export async function presentationImage(db:D1Database,id:string){
 await ensure(db);
 return db.prepare("SELECT id,title,mime FROM support_files WHERE id=? AND status='active' AND audience='learner' AND mime IN ('image/png','image/jpeg')").bind(id).first<{id:string;title:string;mime:string}>();
}
export async function readPresentedImage(e:Env,id:string){
 if(!await presentationImage(e.DB,id))return null;
 const r=await downloadResource(e,id);
 return r&&["image/png","image/jpeg"].includes(r.mime)?r:null;
}
