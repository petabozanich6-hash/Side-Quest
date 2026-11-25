import {permittedByBookingPolicy} from "./supportPublicAvailability";
import {permitsSupportStart,PREPARATION_NOTICE,earliestSupportStart} from "./supportLeadTime";
import {ensureOrderSchema,createServiceOrder,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
const iso=(x:unknown):x is string=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(x)&&Number.isFinite(Date.parse(x));
const whole=(v:unknown,min:number,max:number):v is number=>typeof v==="number"&&Number.isInteger(v)&&v>=min&&v<=max;
const tables=(channel:Channel)=>channel==="guest"?{q:"support_guest_quotes",r:"support_guest_requests",key:"request_id",tag:""}:{q:"learning_support_quotes",r:"parent_feedback",key:"feedback_id",tag:" AND r.page_hint='learning-support'"};
export async function offerSlots(db:D1Database,channel:Channel,id:string,qid:string,b:any,now=new Date()){
 await ensureOrderSchema(db);const t=tables(channel),when=now.toISOString();
 if((await readQuotePlan(db,channel,id,qid))?.lessons?.length>1)return {error:"This proposal is a multi-lesson package. Arrange the complete sequence in Owner HQ."};
 const starts=b?.starts,minutes=b?.minutes,prep=b?.prep_minutes,wrap=b?.wrap_minutes,terms=typeof b?.terms==="string"?b.terms.trim():"",label=typeof b?.learner_label==="string"?b.learner_label.trim():"";
 if(b?.confirmed!==true||!Array.isArray(starts)||starts.length<1||starts.length>12||!whole(minutes,15,180)||!whole(prep,0,120)||!whole(wrap,0,120)||terms.length<20||terms.length>2000||!label||label.length>80||!starts.every(s=>iso(s)&&Date.parse(s)-prep*60000>now.getTime()&&Date.parse(s)<=now.getTime()+90*86400000))return {error:"Choose 1–12 future times, learner label, duration, buffers and service terms."};
 const unique=[...new Set<string>(starts)].sort();
 if(!await permitsSupportStart(db,channel,id,unique))return {error:PREPARATION_NOTICE};
 const interval=(start:string)=>({start,before:new Date(Date.parse(start)-prep*60000).toISOString(),after:new Date(Date.parse(start)+(minutes+wrap)*60000).toISOString()});
 if((await Promise.all(unique.map(start=>permittedByBookingPolicy(db,interval(start))))).some(ok=>!ok))return {error:"One or more options exceed configured hours or booking limits. Choose different times."};
 const oid=crypto.randomUUID();
 const r=await db.prepare("INSERT INTO support_slot_offers(id,channel,request_id,quote_id,starts_json,minutes,prep_minutes,wrap_minutes,learner_label,terms,expires_at,created_at) SELECT ?,?,r.id,q.id,?,?,?,?,?,?,q.expires_at,? FROM "+t.q+" q JOIN "+t.r+" r ON r.id=q."+t.key+" WHERE r.id=? AND q.id=? AND q.status IN ('offered','interested') AND q.expires_at>? AND r.status NOT IN ('closed','resolved')"+t.tag+" AND NOT EXISTS(SELECT 1 FROM support_service_orders o WHERE o.channel=? AND o.quote_id=q.id AND o.status<>'cancelled') ON CONFLICT(channel,quote_id) DO UPDATE SET id=excluded.id,starts_json=excluded.starts_json,minutes=excluded.minutes,prep_minutes=excluded.prep_minutes,wrap_minutes=excluded.wrap_minutes,learner_label=excluded.learner_label,terms=excluded.terms,expires_at=excluded.expires_at,created_at=excluded.created_at").bind(oid,channel,JSON.stringify(unique),minutes,prep,wrap,label,terms,when,id,qid,when,channel).run();
 return r.meta?.changes?{id:oid}:{error:"Quote unavailable or already reserved."};
}
async function active(db:D1Database,channel:Channel,id:string,qid:string,now:Date){
 await ensureOrderSchema(db);const t=tables(channel);
 return db.prepare("SELECT s.*,q.amount_cents,q.status quote_status FROM support_slot_offers s JOIN "+t.q+" q ON q.id=s.quote_id AND q."+t.key+"=s.request_id JOIN "+t.r+" r ON r.id=s.request_id WHERE s.channel=? AND s.request_id=? AND s.quote_id=? AND s.expires_at>? AND q.expires_at>? AND q.status IN ('offered','interested') AND r.status NOT IN ('closed','resolved')"+t.tag+" AND NOT EXISTS(SELECT 1 FROM support_service_orders o WHERE o.channel=s.channel AND o.quote_id=s.quote_id AND o.status<>'cancelled')").bind(channel,id,qid,now.toISOString(),now.toISOString()).first<any>();
}
export async function readSlots(db:D1Database,channel:Channel,id:string,qid:string,now=new Date()){
 const s=await active(db,channel,id,qid,now);if(!s)return null;
 const earliest=await earliestSupportStart(db,channel,id);if(earliest===null)return null;
 const rows=(await db.prepare("SELECT j.value start_at FROM json_each(?) j WHERE julianday(j.value)-?/1440.0>julianday(?) AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(j.value)+(?+?)/1440.0 AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(j.value)-?/1440.0) AND NOT EXISTS(SELECT 1 FROM support_busy_blocks z WHERE julianday(z.start_at)<julianday(j.value)+(?+?)/1440.0 AND julianday(z.end_at)>julianday(j.value)-?/1440.0) ORDER BY j.value").bind(s.starts_json,s.prep_minutes,now.toISOString(),s.minutes,s.wrap_minutes,s.prep_minutes,s.minutes,s.wrap_minutes,s.prep_minutes).all<{start_at:string}>()).results||[];
 const possible=rows.map(r=>r.start_at).filter(s=>Date.parse(s)>=earliest);
 const allowed=await Promise.all(possible.map(start=>permittedByBookingPolicy(db,{start,before:new Date(Date.parse(start)-s.prep_minutes*60000).toISOString(),after:new Date(Date.parse(start)+(s.minutes+s.wrap_minutes)*60000).toISOString()})));
 return {id:s.id,starts:possible.filter((_,i)=>allowed[i]),minutes:s.minutes,terms:s.terms,expires_at:s.expires_at,amount_cents:s.amount_cents,can_select:s.quote_status==="interested"};
}
export async function selectSlot(db:D1Database,channel:Channel,id:string,qid:string,b:any,now=new Date()){
 const s=await active(db,channel,id,qid,now);
 if(!s||s.quote_status!=="interested"||b?.confirmed!==true||b.offer_id!==s.id||!iso(b.start_at)||!JSON.parse(s.starts_json).includes(b.start_at)||Date.parse(b.start_at)-s.prep_minutes*60000<=now.getTime())return {error:"This offer changed or the time is unavailable. Refresh and choose again."};
 return createServiceOrder(db,channel,id,{quote_id:qid,mode:"live",start_at:b.start_at,minutes:s.minutes,prep_minutes:s.prep_minutes,wrap_minutes:s.wrap_minutes,learner_label:s.learner_label,terms:s.terms,confirmed:true},now,s.id);
}
export async function removeSlots(db:D1Database,channel:Channel,id:string,qid:string){
 await ensureOrderSchema(db);return !!(await db.prepare("DELETE FROM support_slot_offers WHERE channel=? AND request_id=? AND quote_id=?").bind(channel,id,qid).run()).meta?.changes;
}
