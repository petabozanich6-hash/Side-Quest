import {ensureOrderSchema,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
const iso=(s:unknown):s is string=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(s)&&Number.isFinite(Date.parse(s));
const bounded=(n:unknown):n is number=>typeof n==="number"&&Number.isInteger(n)&&n>=0&&n<=120;
export async function createPackage(db:D1Database,channel:Channel,id:string,b:any,now=new Date()){
 await ensureOrderSchema(db);
 const qid=typeof b?.quote_id==="string"?b.quote_id:"",label=typeof b?.learner_label==="string"?b.learner_label.trim():"",terms=typeof b?.terms==="string"?b.terms.trim():"",prep=b?.prep_minutes,wrap=b?.wrap_minutes;
 if(b?.confirmed!==true||!qid||!label||label.length>80||terms.length<20||terms.length>2000||!bounded(prep)||!bounded(wrap)||!Array.isArray(b.starts))return {error:"Enter the learner label, service terms, buffers and all lesson dates."};
 const plan=await readQuotePlan(db,channel,id,qid,true);
 if(!plan||plan.lessons.length<2||plan.lessons.length>4||b.starts.length!==plan.lessons.length)return {error:"A reviewed quote with 2–4 lessons is required. Schedule every lesson."};
 const sessions:{id:string;start:string;end:string;before:string;after:string;title:string}[]=[];
 for(let i=0;i<plan.lessons.length;i++){
  const start=b.starts[i],l=plan.lessons[i];
  if(!iso(start)||Date.parse(start)-prep*60000<=now.getTime()||Date.parse(start)>now.getTime()+180*86400000||!Number.isInteger(l.minutes)||l.minutes<15||l.minutes>180)return {error:"Choose future lesson times within 180 days."};
  const end=new Date(Date.parse(start)+l.minutes*60000).toISOString(),before=new Date(Date.parse(start)-prep*60000).toISOString(),after=new Date(Date.parse(end)+wrap*60000).toISOString();
  if(i&&sessions[i-1].after>before)return {error:"Lessons must be in chronological order without overlapping preparation or wrap-up."};
  sessions.push({id:crypto.randomUUID(),start,end,before,after,title:l.title});
 }
 const root=sessions[0],when=now.toISOString(),qt=channel==="guest"?"support_guest_quotes":"learning_support_quotes",rt=channel==="guest"?"support_guest_requests":"parent_feedback",key=channel==="guest"?"request_id":"feedback_id",tag=channel==="member"?" AND r.page_hint='learning-support'":"";
 // One root insert checks every requested interval. All child sessions, diary records and mappings are inserted in the same transaction.
 const sql="INSERT OR IGNORE INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,?,r.id,q.id,q.amount_cents,q.scope,q.delivery,?,'live',?,?,?,? FROM "+qt+" q JOIN "+rt+" r ON r.id=q."+key+" WHERE r.id=? AND q.id=? AND q.status='interested' AND q.expires_at>? AND r.status NOT IN ('closed','resolved')"+tag+" AND NOT EXISTS(SELECT 1 FROM json_each(?) j WHERE EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(json_extract(j.value,'$.after')) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(json_extract(j.value,'$.before'))) OR EXISTS(SELECT 1 FROM support_busy_blocks z WHERE z.start_at<json_extract(j.value,'$.after') AND z.end_at>json_extract(j.value,'$.before')))";
 const stmts=[db.prepare(sql).bind(root.id,channel,terms,root.start,root.end,when,when,id,qid,when,JSON.stringify(sessions))];
 for(const [i,s] of sessions.entries()){
  if(i>0)stmts.push(db.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,channel,request_id,?,0,?,delivery,terms,'live',?,?,?,? FROM support_service_orders WHERE id=?").bind(s.id,"package-session:"+s.id,s.title,s.start,s.end,when,when,root.id));
  stmts.push(db.prepare("INSERT INTO support_package_sessions(order_id,root_id,quote_id,sequence,total) SELECT id,?,?,?,? FROM support_service_orders WHERE id=?").bind(root.id,qid,i+1,sessions.length,s.id));
  const l=plan.lessons[i],g=plan.tutor_guides?.[i];
  const details={subject:plan.subject,year_level:plan.year_level,objective:l.objective,agenda:[l.title,l.activities,g?.guide].filter(Boolean).join("\n").slice(0,2500),approach:[l.check,g?.answers].filter(Boolean).join("\n").slice(0,1000),follow_up:l.home_practice};
  stmts.push(db.prepare("INSERT INTO support_tutor_diary(order_id,learner_label,prep_minutes,wrap_minutes,details_json,updated_at) SELECT id,?,?,?,?,? FROM support_service_orders WHERE id=?").bind(label,prep,wrap,JSON.stringify(details),when,s.id));
 }
 const results=await db.batch(stmts);
 if(!results[0]?.meta?.changes)return {error:"A proposed time is no longer available, or the quotation already has an order. No sessions were reserved."};
 return {id:root.id,count:sessions.length};
}
