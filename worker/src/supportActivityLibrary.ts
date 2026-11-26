const str=(v:unknown,max:number)=>typeof v==="string"&&v.trim().length>0&&v.trim().length<=max?v.trim():null;
export function validateActivityQuestion(b:any){
 const question=str(b?.question,500),type=b?.type;
 if(!question||!["choice","poll","short"].includes(type))return null;
 const raw=type==="short"?[]:Array.isArray(b.options)?b.options.map((v:unknown)=>str(v,160)):[];
 if(type!=="short"&&(raw.length<2||raw.length>6||raw.some((v:unknown)=>!v)||new Set(raw).size!==raw.length))return null;
 const options=raw as string[],answer_key=type==="choice"?str(b.answer_key,160):null;
 if(type==="choice"&&(!answer_key||!options.includes(answer_key)))return null;
 return {question,type:type as "choice"|"poll"|"short",options,answer_key};
}
export function validateActivityTemplate(b:any){
 const activity=validateActivityQuestion(b),title=str(b?.title,120),subject=str(b?.subject,80),year_level=str(b?.year_level,40);
 return activity&&title&&subject&&year_level?{...activity,title,subject,year_level}:null;
}
export async function getActivityTemplate(db:D1Database,id:string){
 const row=await db.prepare("SELECT * FROM support_activity_templates WHERE id=? AND status<>'archived'").bind(id).first<any>();
 if(!row)return null;
 const {options_json,activity_type,...rest}=row;
 return {...rest,type:activity_type,options:JSON.parse(options_json)};
}
export async function listActivityTemplates(db:D1Database,q="",reviewed=false){
 const query="%"+q.slice(0,100).replace(/[%_]/g,"")+"%";
 return (await db.prepare("SELECT id,title,subject,year_level,activity_type type,status,revision FROM support_activity_templates WHERE status "+(reviewed?"='reviewed'":"<>'archived'")+" AND (title LIKE ? OR subject LIKE ? OR year_level LIKE ?) ORDER BY updated_at DESC,id LIMIT 100").bind(query,query,query).all()).results||[];
}
export async function saveActivityTemplate(db:D1Database,b:any,id?:string){
 const v=validateActivityTemplate(b);if(!v)return {error:"Enter a title, subject, level and valid activity."};
 const status=b.reviewed===true?"reviewed":"draft",at=new Date().toISOString();
 const values=[v.title,v.subject,v.year_level,v.question,v.type,JSON.stringify(v.options),v.answer_key,status];
 if(id){
  if(!Number.isInteger(b.revision))return {error:"Reload before editing."};
  const r=await db.prepare("UPDATE support_activity_templates SET title=?,subject=?,year_level=?,question=?,activity_type=?,options_json=?,answer_key=?,status=?,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND status<>'archived'").bind(...values,at,id,b.revision).run();
  return r.meta?.changes?{id}:{error:"The activity changed. Reload before editing."};
 }
 const key=crypto.randomUUID();
 await db.prepare("INSERT INTO support_activity_templates(id,title,subject,year_level,question,activity_type,options_json,answer_key,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)").bind(key,...values,at,at).run();
 return {id:key};
}
export async function archiveActivityTemplate(db:D1Database,id:string,revision:unknown){
 if(!Number.isInteger(revision))return false;
 const r=await db.prepare("UPDATE support_activity_templates SET status='archived',revision=revision+1,updated_at=? WHERE id=? AND revision=? AND status<>'archived'").bind(new Date().toISOString(),id,revision).run();
 return !!r.meta?.changes;
}
