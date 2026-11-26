import type {Env} from "./types";
import {ensureEnglishClub} from "./englishClub";
import {listResources,downloadResource} from "./supportFiles";
export const ENGLISH_MATERIALS_SCHEMA=["CREATE TABLE IF NOT EXISTS support_english_materials (class_id TEXT PRIMARY KEY REFERENCES support_english_classes(id) ON DELETE CASCADE, prompts TEXT NOT NULL DEFAULT '', fallback_url TEXT NOT NULL DEFAULT '', fallback_open INTEGER NOT NULL DEFAULT 0 CHECK(fallback_open IN (0,1)))","CREATE TABLE IF NOT EXISTS support_english_file_grants (class_id TEXT NOT NULL REFERENCES support_english_classes(id) ON DELETE CASCADE,file_id TEXT NOT NULL REFERENCES support_files(id),PRIMARY KEY(class_id,file_id))"] as const;
async function ensure(db:D1Database){await ensureEnglishClub(db);await listResources(db,"",true);await db.batch(ENGLISH_MATERIALS_SCHEMA.map(sql=>db.prepare(sql)));}
type Parent={requestId:string;email:string};
async function paid(db:D1Database,cid:string,p:Parent){return !!await db.prepare("SELECT e.id FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id WHERE e.class_id=? AND e.request_id=? AND r.email=? AND e.status='paid' AND r.status NOT IN ('closed','resolved')").bind(cid,p.requestId,p.email).first();}
export function safeClubFallback(v:unknown){
 if(typeof v!=="string"||v.length>2048)return null;
 try{const u=new URL(v);if(u.protocol!=="https:"||u.username||u.password||u.port||u.hash)return null;const h=u.hostname.toLowerCase();if((h==="zoom.us"||h.endsWith(".zoom.us"))&&/^\/j\/\d+\/?$/.test(u.pathname))return u.href;if(["teams.microsoft.com","teams.live.com"].includes(h)&&(/^\/l\/meetup-join\//.test(u.pathname)||/^\/meet\//.test(u.pathname)))return u.href;}catch{}
 return null;
}
const fallbackEnabled=(e:Env)=>!!e.STAGING_KEY&&e.SUPPORT_ENGLISH_FALLBACK_TEST==="true";
export async function readEnglishMaterials(e:Env,cid:string,parent?:Parent,now=new Date()){
 await ensure(e.DB);
 const c=await e.DB.prepare("SELECT start_at,end_at FROM support_english_classes WHERE id=?").bind(cid).first<{start_at:string;end_at:string}>();
 if(!c||parent&&!await paid(e.DB,cid,parent))return null;
 const a=await e.DB.prepare("SELECT prompts,fallback_url,fallback_open FROM support_english_materials WHERE class_id=?").bind(cid).first<{prompts:string;fallback_url:string;fallback_open:number}>();
 const files=(await e.DB.prepare("SELECT f.id,f.title,f.filename,f.mime,f.size_bytes FROM support_english_file_grants g JOIN support_files f ON f.id=g.file_id WHERE g.class_id=? AND f.status='active' AND f.audience='learner' ORDER BY f.title LIMIT 30").bind(cid).all()).results||[];
 const resource=await e.DB.prepare("SELECT resource_json FROM support_english_workshop_resources WHERE class_id=?").bind(cid).first<{resource_json:string}>();
 const workshop=resource?JSON.parse(resource.resource_json):null;
 const inWindow=now.getTime()>=Date.parse(c.start_at)-10*60000&&now.getTime()<Date.parse(c.end_at);
 const fallback=fallbackEnabled(e)&&inWindow&&a?.fallback_open===1?safeClubFallback(a.fallback_url):null;
 return {prompts:a?.prompts||"",files,workshop,...(parent?{fallback_url:fallback}:{fallback_url:a?.fallback_url||"",fallback_open:!!a?.fallback_open,fallback_enabled:fallbackEnabled(e),can_open_fallback:fallbackEnabled(e)&&inWindow})};
}
export async function saveEnglishMaterials(e:Env,cid:string,b:any,now=new Date()){
 await ensure(e.DB);if(b?.confirmed!==true||typeof b.prompts!=="string"||b.prompts.length>6000||typeof b.fallback_url!=="string"||typeof b.fallback_open!=="boolean")return false;
 const url=b.fallback_url.trim()?safeClubFallback(b.fallback_url.trim()):"";
 if(url===null||b.fallback_open&&(!url||!fallbackEnabled(e)||b.safeguards_confirmed!==true))return false;
 const c=await e.DB.prepare("SELECT start_at,end_at FROM support_english_classes WHERE id=?").bind(cid).first<{start_at:string;end_at:string}>();if(!c)return false;
 if(b.fallback_open&&(now.getTime()<Date.parse(c.start_at)-10*60000||now.getTime()>=Date.parse(c.end_at)))return false;
 return !!(await e.DB.prepare("INSERT INTO support_english_materials(class_id,prompts,fallback_url,fallback_open) VALUES(?,?,?,?) ON CONFLICT(class_id) DO UPDATE SET prompts=excluded.prompts,fallback_url=excluded.fallback_url,fallback_open=excluded.fallback_open").bind(cid,b.prompts.trim(),url,b.fallback_open?1:0).run()).meta?.changes;
}
export async function changeEnglishFile(db:D1Database,cid:string,fid:string,grant:boolean){
 await ensure(db);
 if(!grant)return !!(await db.prepare("DELETE FROM support_english_file_grants WHERE class_id=? AND file_id=?").bind(cid,fid).run()).meta?.changes;
 return !!(await db.prepare("INSERT OR IGNORE INTO support_english_file_grants(class_id,file_id) SELECT c.id,f.id FROM support_english_classes c CROSS JOIN support_files f WHERE c.id=? AND f.id=? AND f.audience='learner' AND f.status='active' AND (SELECT COUNT(*) FROM support_english_file_grants WHERE class_id=c.id)<30").bind(cid,fid).run()).meta?.changes;
}
export async function downloadEnglishFile(e:Env,cid:string,fid:string,p:Parent){
 await ensure(e.DB);
 const permitted=async()=>!!await e.DB.prepare("SELECT f.id FROM support_english_file_grants g JOIN support_files f ON f.id=g.file_id JOIN support_english_enrolments e ON e.class_id=g.class_id JOIN support_guest_requests r ON r.id=e.request_id WHERE g.class_id=? AND g.file_id=? AND f.status='active' AND f.audience='learner' AND e.status='paid' AND e.request_id=? AND r.email=? AND r.status NOT IN ('closed','resolved')").bind(cid,fid,p.requestId,p.email).first();
 if(!await permitted())return null;const file=await downloadResource(e,fid);return file&&await permitted()?file:null;
}
