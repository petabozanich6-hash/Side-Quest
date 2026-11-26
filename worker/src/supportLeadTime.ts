import type {Channel} from "./supportOrders";
export const PREPARATION_DAYS=7;
export const PREPARATION_MS=PREPARATION_DAYS*86400000;
export const PREPARATION_NOTICE="Choose a time after the original enquiry. Earlier starts are available at the tutor’s discretion.";
export async function earliestSupportStart(db:D1Database,channel:Channel,id:string):Promise<number|null>{
 const row=await db.prepare(channel==="guest"?"SELECT created_at FROM support_guest_requests WHERE id=?":"SELECT created_at FROM parent_feedback WHERE id=? AND page_hint='learning-support'").bind(id).first<{created_at:string}>();
 const start=Date.parse(row?.created_at||"");
 return Number.isFinite(start)?start:null;
}
export async function permitsSupportStart(db:D1Database,channel:Channel,id:string,starts:string[]){
 const earliest=await earliestSupportStart(db,channel,id);
 return earliest!==null&&starts.every(s=>Number.isFinite(Date.parse(s))&&Date.parse(s)>=earliest);
}
