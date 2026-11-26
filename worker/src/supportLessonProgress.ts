import {getOrder,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
const statuses=["not_started","covered","independent","supported","practise","not_attempted"] as const;
type Status=typeof statuses[number];
type Checkpoint={id:string;label:string;home:string;status:Status;observed_at:string|null};
const eligible=(o:any)=>o?.mode==="live"&&["paid","completed"].includes(o.status)&&!o.checkout_started_at;
export async function lessonProgress(db:D1Database,channel:Channel,id:string,oid:string){
 const o=await getOrder(db,channel,id,oid);if(!eligible(o))return null;
 const row=await db.prepare("SELECT checkpoints_json,revision,updated_at FROM support_lesson_progress WHERE order_id=?").bind(oid).first<any>();
 if(row)return {checkpoints:JSON.parse(row.checkpoints_json) as Checkpoint[],revision:row.revision,updated_at:row.updated_at,start_at:o.start_at,end_at:o.end_at,status:o.status};
 const plan=await readQuotePlan(db,channel,id,o.original_quote_id??o.quote_id,false);
 const l=plan?.lessons?.[(o.package_sequence??1)-1];
 const base=l?[["objective",l.objective,l.home_practice],["activity",l.activities,l.home_practice],["check",l.check,l.home_practice]]:[];
 return {checkpoints:base.filter(x=>x[1]).map(([id,label,home])=>({id,label,home:home||"",status:"not_started" as Status,observed_at:null})),revision:0,updated_at:null,start_at:o.start_at,end_at:o.end_at,status:o.status};
}
export async function saveLessonCheckpoint(db:D1Database,channel:Channel,id:string,oid:string,b:any,now=new Date()){
 const data=await lessonProgress(db,channel,id,oid);
 if(!data||b?.revision!==data.revision||!Number.isInteger(b.revision)||!data.start_at||!data.end_at)return {error:"Lesson or revision unavailable. Reload progress."};
 const points=data.checkpoints.slice(),at=now.toISOString();
 if(b.action==="add"){
  const label=typeof b.label==="string"?b.label.trim():"",home=typeof b.home==="string"?b.home.trim():"";
  if(!label||label.length>900||home.length>500||points.length>=12)return {error:"Enter a short activity and optional home practice (maximum 12)."};
  points.push({id:crypto.randomUUID(),label,home,status:"not_started",observed_at:null});
 }else if(b.action==="mark"){
  if(now.getTime()<Date.parse(data.start_at)-10*60000||data.status!=="paid"&&data.status!=="completed")return {error:"Record observations during or after the lesson."};
  const i=points.findIndex(p=>p.id===b.checkpoint_id);
  if(i<0||!statuses.includes(b.status))return {error:"Choose a valid progress checkpoint."};
  points[i]={...points[i],status:b.status,observed_at:b.status==="not_started"?null:at};
 }else return {error:"Unknown progress action."};
 const json=JSON.stringify(points);
 const r=data.revision===0?await db.prepare("INSERT OR IGNORE INTO support_lesson_progress(order_id,checkpoints_json,revision,updated_at) SELECT id,?,1,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status IN ('paid','completed') AND mode='live' AND checkout_started_at IS NULL").bind(json,at,oid,channel,id).run():await db.prepare("UPDATE support_lesson_progress SET checkpoints_json=?,revision=revision+1,updated_at=? WHERE order_id=? AND revision=? AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_lesson_progress.order_id AND o.channel=? AND o.request_id=? AND o.status IN ('paid','completed') AND o.mode='live' AND o.checkout_started_at IS NULL)").bind(json,at,oid,data.revision,channel,id).run();
 if(!r.meta?.changes)return {error:"Progress changed. Reload before recording again."};
 return {checkpoints:points,revision:data.revision+1,updated_at:at,start_at:data.start_at,end_at:data.end_at,status:data.status};
}
export function reportFromCheckpoints(points:Checkpoint[]){
 const observed=points.filter(p=>["covered","independent","supported","practise"].includes(p.status));
 if(!observed.length)return null;
 const strengths=observed.filter(p=>p.status==="independent"||p.status==="supported").map(p=>p.label+(p.status==="independent"?" — demonstrated independently.":" — demonstrated with guidance."));
 const practice=observed.filter(p=>p.status==="practise"||p.status==="supported");
 const home=[...new Set(observed.map(p=>p.home).filter(Boolean))];
 return [observed.map(p=>p.label).join("\n"),strengths.join("\n")||"No independent or supported achievement was recorded for these checkpoints.",practice.map(p=>p.label).join("\n")||"No specific difficulty was recorded; continue practising the covered skills.",home.join("\n")||"No home activity was recorded; ask the tutor for an appropriate independent practice activity."];
}
