import {ensureOrderSchema,getOrder,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
import {nowIso} from "./types";
const FIELDS={subject:80,year_level:40,objective:600,interests:600,approach:1000,agenda:2500,materials:1500,preparation:1000,follow_up:1500,reflection:1500,report_covered:1000,report_strengths:1000,report_practice:1000,report_home_activity:1500} as const;
export async function readDiary(db:D1Database,channel:Channel,id:string,oid:string){
 const order=await getOrder(db,channel,id,oid);if(!order)return null;
 const d=await db.prepare("SELECT * FROM support_tutor_diary WHERE order_id=?").bind(oid).first<any>();
 const plan=await readQuotePlan(db,channel,id,order.original_quote_id??order.quote_id,true);
 return {diary:d?{learner_label:d.learner_label,prep_minutes:d.prep_minutes,wrap_minutes:d.wrap_minutes,ready:!!d.ready,revision:d.revision,details:JSON.parse(d.details_json)}:{learner_label:"",prep_minutes:0,wrap_minutes:0,ready:false,revision:0,details:{}},proposal:plan,order:{package_sequence:order.package_sequence,package_total:order.package_total,scope:order.scope,mode:order.mode,start_at:order.start_at,end_at:order.end_at,status:order.status}};
}
export async function saveDiary(db:D1Database,channel:Channel,id:string,oid:string,b:any){
 if(!await getOrder(db,channel,id,oid))return false;
 const label=typeof b?.learner_label==="string"?b.learner_label.trim():"";
 if(!label||label.length>80||!Number.isInteger(b.revision)||b.revision<0||!b.details||typeof b.details!=="object")return false;
 const details:Record<string,string>={};
 for(const [k,max] of Object.entries(FIELDS)){
  const v=b.details[k]??"";if(typeof v!=="string"||v.trim().length>max)return false;details[k]=v.trim();
 }
 const ready=b.ready===true;
 if(ready&&(!details.objective||!details.agenda||!details.materials))return false;
 const now=nowIso();
 const r=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_tutor_diary(order_id,learner_label,details_json,ready,updated_at) SELECT id,?,?,?,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=?").bind(label,JSON.stringify(details),ready?1:0,now,oid,channel,id).run():await db.prepare("UPDATE support_tutor_diary SET learner_label=?,details_json=?,ready=?,revision=revision+1,updated_at=? WHERE order_id=? AND revision=?").bind(label,JSON.stringify(details),ready?1:0,now,oid,b.revision).run();
 return !!r.meta?.changes;
}
export async function createBusyBlock(db:D1Database,b:any,now=new Date()){
 await ensureOrderSchema(db);
 const label=typeof b?.label==="string"?b.label.trim():"",start=b?.start_at,end=b?.end_at;
 const iso=(v:unknown):v is string=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v));
 if(!label||label.length>80||!iso(start)||!iso(end)||Date.parse(start)<now.getTime()||Date.parse(end)<=Date.parse(start)||Date.parse(end)-Date.parse(start)>31*86400000)return {error:"Choose a future blocked time of no more than 31 days."};
 const id=crypto.randomUUID();
 const r=await db.prepare("INSERT INTO support_busy_blocks(id,label,start_at,end_at,created_at) SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM support_busy_blocks WHERE start_at<? AND end_at>?) AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?))").bind(id,label,start,end,now.toISOString(),end,start,end,start).run();
 return r.meta?.changes?{id}:{error:"Blocked time overlaps an existing reservation, preparation, wrap-up or another block."};
}
