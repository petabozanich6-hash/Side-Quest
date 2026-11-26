type Kind="tutoring"|"club";
type Item={template_id:string;revision:number};
const validId=(v:unknown):v is string=>typeof v==="string"&&v.length>0&&v.length<=100;
function sessionSql(kind:Kind,editable=false){
 if(kind==="tutoring")return "SELECT id FROM support_service_orders WHERE id=? AND mode='live' AND start_at IS NOT NULL"+(editable?" AND status IN ('awaiting_confirmation','confirmed','paid')":"");
 return "SELECT id FROM support_english_classes WHERE id=?"+(editable?" AND julianday(end_at)>julianday(?)":"");
}
export async function readActivityPlan(db:D1Database,kind:Kind,id:string){
 if(!validId(id)||!["tutoring","club"].includes(kind)||!await db.prepare(sessionSql(kind)).bind(id).first())return null;
 const row=await db.prepare("SELECT revision,items_json FROM support_session_activity_plans WHERE kind=? AND session_id=?").bind(kind,id).first<{revision:number;items_json:string}>();
 const refs:Item[]=row?JSON.parse(row.items_json):[];
 const items=[];
 for(const ref of refs){
  const item=await db.prepare("SELECT title,subject,year_level,revision,status FROM support_activity_templates WHERE id=?").bind(ref.template_id).first<any>();
  items.push({...ref,title:item?.title||"Unavailable activity",subject:item?.subject||"",year_level:item?.year_level||"",ready:item?.status==="reviewed"&&item.revision===ref.revision});
 }
 return {revision:row?.revision||0,items};
}
export async function saveActivityPlan(db:D1Database,kind:Kind,id:string,b:any,now=new Date()){
 if(!validId(id)||!["tutoring","club"].includes(kind)||b?.confirmed!==true||!Number.isInteger(b.revision)||b.revision<0||!Array.isArray(b.items)||b.items.length>20)return false;
 const items:Item[]=[];
 for(const v of b.items){if(!validId(v?.template_id)||!Number.isInteger(v.revision)||v.revision<1||items.some(i=>i.template_id===v.template_id))return false;items.push({template_id:v.template_id,revision:v.revision});}
 const at=now.toISOString(),session=sessionSql(kind,true),args=kind==="club"?[id,at]:[id];
 // Atomic validation against the exact reviewed revisions, and optimistic plan revision.
 const guard="EXISTS("+session+") AND NOT EXISTS(SELECT 1 FROM json_each(?) j WHERE NOT EXISTS(SELECT 1 FROM support_activity_templates t WHERE t.id=json_extract(j.value,'$.template_id') AND t.revision=json_extract(j.value,'$.revision') AND t.status='reviewed'))";
 const json=JSON.stringify(items);
 const result=b.revision===0?await db.prepare("INSERT OR IGNORE INTO support_session_activity_plans(kind,session_id,items_json,updated_at) SELECT ?,?,?,? WHERE "+guard).bind(kind,id,json,at,...args,json).run():await db.prepare("UPDATE support_session_activity_plans SET items_json=?,updated_at=?,revision=revision+1 WHERE kind=? AND session_id=? AND revision=? AND "+guard).bind(json,at,kind,id,b.revision,...args,json).run();
 return !!result.meta?.changes;
}
