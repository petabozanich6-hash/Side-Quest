import {bookingPolicyGuard,suggestSupportStarts} from "./supportPublicAvailability";
import {permitsSupportStart,PREPARATION_NOTICE} from "./supportLeadTime";
import {ensureOrderSchema,type Channel} from "./supportOrders";
import {readQuotePlan,readQuoteSchedule} from "./supportQuotePlans";
const iso=(s:unknown):s is string=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(s)&&Number.isFinite(Date.parse(s));
const bounded=(n:unknown):n is number=>typeof n==="number"&&Number.isInteger(n)&&n>=0&&n<=120;
export const PACKAGE_OFFER_SCHEMA="CREATE TABLE IF NOT EXISTS support_package_offers (id TEXT PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL, quote_id TEXT NOT NULL, learner_label TEXT NOT NULL, terms TEXT NOT NULL, payment_mode TEXT NOT NULL CHECK(payment_mode IN ('installments','upfront')), deadline_hours INTEGER NOT NULL CHECK(deadline_hours BETWEEN 1 AND 168), expires_at TEXT NOT NULL, UNIQUE(channel,quote_id))";
async function ensurePackageOffers(db:D1Database){await db.prepare(PACKAGE_OFFER_SCHEMA).run();}
// One calculation for parent preview and committed booking charges.
export function packageCharges(total:number,minutes:number[],installments:boolean):number[]{
 if(!installments)return minutes.map((_,i)=>i===0?total:0);
 const rates:Record<number,number>={30:2500,45:3500,60:4500};
 const standard=minutes.map(m=>rates[m]||0);
 if(standard.every(n=>n>0)&&standard.reduce((a,b)=>a+b,0)===total)return standard;
 const base=Math.floor(total/minutes.length),remainder=total%minutes.length;
 return minutes.map((_,i)=>base+(i<remainder?1:0));
}
export async function createPackage(db:D1Database,channel:Channel,id:string,b:any,now=new Date(),offerId?:string){
 await ensureOrderSchema(db);
 const qid=typeof b?.quote_id==="string"?b.quote_id:"",label=typeof b?.learner_label==="string"?b.learner_label.trim():"",terms=typeof b?.terms==="string"?b.terms.trim():"",prep=b?.prep_minutes,wrap=b?.wrap_minutes;
 if(b?.confirmed!==true||!qid||!label||label.length>80||terms.length<20||terms.length>2000||!bounded(prep)||!bounded(wrap)||!Array.isArray(b.starts))return {error:"Enter the learner label, service terms, buffers and all lesson dates."};
 const plan=await readQuotePlan(db,channel,id,qid,true);
 const minutes=await readQuoteSchedule(db,channel,id,qid);
 if(!minutes||minutes.length<2||minutes.length>4||b.starts.length!==minutes.length)return {error:"A quote with 2–4 agreed session durations is required. Schedule every lesson."};
 const lessons=minutes.map((m,i)=>plan?.lessons?.[i]??{title:"Session "+(i+1),minutes:m,objective:"",activities:"",check:"",home_practice:""});
 const sessions:{id:string;start:string;end:string;before:string;after:string;title:string}[]=[];
 for(let i=0;i<lessons.length;i++){
  const start=b.starts[i],l=lessons[i];
  if(!iso(start)||Date.parse(start)-prep*60000<=now.getTime()||Date.parse(start)>now.getTime()+180*86400000||!Number.isInteger(l.minutes)||l.minutes<15||l.minutes>180)return {error:"Choose future lesson times within 180 days."};
  const end=new Date(Date.parse(start)+l.minutes*60000).toISOString(),before=new Date(Date.parse(start)-prep*60000).toISOString(),after=new Date(Date.parse(end)+wrap*60000).toISOString();
  if(i&&sessions[i-1].after>before)return {error:"Lessons must be in chronological order without overlapping preparation or wrap-up."};
  sessions.push({id:crypto.randomUUID(),start,end,before,after,title:l.title});
 }
 if(!await permitsSupportStart(db,channel,id,sessions.map(s=>s.start)))return {error:PREPARATION_NOTICE};
 const root=sessions[0],when=now.toISOString(),qt=channel==="guest"?"support_guest_quotes":"learning_support_quotes",rt=channel==="guest"?"support_guest_requests":"parent_feedback",key=channel==="guest"?"request_id":"feedback_id",tag=channel==="member"?" AND r.page_hint='learning-support'":"";
 const installments=b.payment_mode==="installments",lead=b.deadline_hours??24;
 if(b.payment_mode!==undefined&&!["upfront","installments"].includes(b.payment_mode))return {error:"Choose upfront or per-lesson payment."};
 const q=await db.prepare("SELECT amount_cents FROM "+qt+" WHERE id=? AND "+key+"=?").bind(qid,id).first<{amount_cents:number}>();
 if(!q)return {error:"Quote unavailable."};
 if(installments&&(!Number.isInteger(lead)||lead<1||lead>168||q.amount_cents<sessions.length||sessions.some(s=>Date.parse(s.start)-lead*3600000<=now.getTime()||Date.parse(s.start)-lead*3600000>Date.parse(s.before))))return {error:"Choose a payment deadline 1–168 hours before each lesson, before preparation and in the future. Each lesson must have a positive price."};
 const charges=packageCharges(q.amount_cents,minutes,installments);
 const charge=(i:number)=>charges[i];
 // One root insert checks every requested interval. All child sessions, diary records and mappings are inserted in the same transaction.
 const sql="INSERT OR IGNORE INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,?,r.id,q.id,?,q.scope,q.delivery,?,'live',?,?,?,? FROM "+qt+" q JOIN "+rt+" r ON r.id=q."+key+" WHERE r.id=? AND q.id=? AND q.status='interested' AND q.expires_at>? AND q.amount_cents=? AND r.status NOT IN ('closed','resolved')"+tag+" AND NOT EXISTS(SELECT 1 FROM json_each(?) j WHERE EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(json_extract(j.value,'$.after')) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(json_extract(j.value,'$.before'))) OR EXISTS(SELECT 1 FROM support_busy_blocks z WHERE z.start_at<json_extract(j.value,'$.after') AND z.end_at>json_extract(j.value,'$.before')))";
 const capacity=await bookingPolicyGuard(db,sessions);if(!capacity)return {error:"One or more lessons are outside configured hours or booking capacity."};
 const offerGuard=offerId?" AND EXISTS(SELECT 1 FROM support_package_offers a WHERE a.id=? AND a.channel=? AND a.request_id=? AND a.quote_id=? AND a.expires_at>? AND a.learner_label=? AND a.terms=? AND a.payment_mode=? AND a.deadline_hours=?)":"";
 const offerArgs=offerId?[offerId,channel,id,qid,when,label,terms,installments?"installments":"upfront",lead]:[];
 const stmts=[db.prepare(sql+capacity.sql+offerGuard).bind(root.id,channel,charge(0),terms,root.start,root.end,when,when,id,qid,when,q.amount_cents,JSON.stringify(sessions),...capacity.args,...offerArgs)];
 for(const [i,s] of sessions.entries()){
  if(i>0)stmts.push(db.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,channel,request_id,?,?,?,delivery,terms,'live',?,?,?,? FROM support_service_orders WHERE id=?").bind(s.id,"package-session:"+s.id,charge(i),s.title,s.start,s.end,when,when,root.id));
  stmts.push(db.prepare("INSERT INTO support_package_sessions(order_id,root_id,quote_id,sequence,total) SELECT id,?,?,?,? FROM support_service_orders WHERE id=?").bind(root.id,qid,i+1,sessions.length,s.id));
  if(installments)stmts.push(db.prepare("INSERT INTO support_installment_terms(order_id,due_at) SELECT id,? FROM support_service_orders WHERE id=?").bind(new Date(Date.parse(s.start)-lead*3600000).toISOString(),s.id));
  const l=lessons[i],g=plan?.tutor_guides?.[i];
  const details={subject:plan?.subject||"",year_level:plan?.year_level||"",objective:l.objective,agenda:[l.title,l.activities,g?.guide].filter(Boolean).join("\n").slice(0,2500),approach:[l.check,g?.answers].filter(Boolean).join("\n").slice(0,1000),follow_up:l.home_practice};
  stmts.push(db.prepare("INSERT INTO support_tutor_diary(order_id,learner_label,prep_minutes,wrap_minutes,details_json,updated_at) SELECT id,?,?,?,?,? FROM support_service_orders WHERE id=?").bind(label,prep,wrap,JSON.stringify(details),when,s.id));
 }
 const results=await db.batch(stmts);
 if(!results[0]?.meta?.changes)return {error:"A proposed time is no longer available, or the quotation already has an order. No sessions were reserved."};
 return {id:root.id,count:sessions.length};
}

const packageTables=(channel:Channel)=>channel==="guest"?{q:"support_guest_quotes",r:"support_guest_requests",key:"request_id",tag:""}:{q:"learning_support_quotes",r:"parent_feedback",key:"feedback_id",tag:" AND r.page_hint='learning-support'"};
const standardTerms="Payment is due by the agreed invoice deadline. Booking is confirmed after verified payment. Changes and cancellations are handled under the Learning Support Service Agreement.";
async function activePackageOffer(db:D1Database,channel:Channel,id:string,qid:string,now:Date){
 await ensurePackageOffers(db);
 const t=packageTables(channel),when=now.toISOString();
 return db.prepare("SELECT a.*,q.amount_cents,q.status quote_status FROM support_package_offers a JOIN "+t.q+" q ON q.id=a.quote_id AND q."+t.key+"=a.request_id JOIN "+t.r+" r ON r.id=a.request_id WHERE a.channel=? AND a.request_id=? AND a.quote_id=? AND a.expires_at>? AND q.expires_at>? AND q.status IN ('offered','interested') AND r.status NOT IN ('closed','resolved')"+t.tag+" AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id WHERE o.channel=a.channel AND COALESCE(p.quote_id,o.quote_id)=a.quote_id AND o.status<>'cancelled')").bind(channel,id,qid,when,when).first<any>();
}
async function packageStarts(db:D1Database,minutes:number[],paymentMode:string,lead:number,now:Date){
 const starts=await suggestSupportStarts(db,Math.max(...minutes),10,10,now)||[];
 return starts.filter(s=>Date.parse(s)>now.getTime()+(paymentMode==="installments"?lead*3600000:0));
}
export async function offerPackageTimes(db:D1Database,channel:Channel,id:string,qid:string,minutes:number[],label:string,paymentMode:"installments"|"upfront",lead:number,now=new Date()):Promise<"ready"|"no_times"|"unavailable">{
 try{
  await ensureOrderSchema(db);await ensurePackageOffers(db);
  if(minutes.length<2||minutes.length>4||!label||label.length>80||!["installments","upfront"].includes(paymentMode)||!Number.isInteger(lead)||lead<1||lead>168)return "unavailable";
  const t=packageTables(channel),when=now.toISOString();
  const r=await db.prepare("INSERT OR IGNORE INTO support_package_offers(id,channel,request_id,quote_id,learner_label,terms,payment_mode,deadline_hours,expires_at) SELECT ?,?,r.id,q.id,?,?,?,?,q.expires_at FROM "+t.q+" q JOIN "+t.r+" r ON r.id=q."+t.key+" WHERE r.id=? AND q.id=? AND q.status IN ('offered','interested') AND q.expires_at>? AND r.status NOT IN ('closed','resolved')"+t.tag+" AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id WHERE o.channel=? AND COALESCE(p.quote_id,o.quote_id)=q.id AND o.status<>'cancelled')").bind(crypto.randomUUID(),channel,label,standardTerms,paymentMode,lead,id,qid,when,channel).run();
  if(!r.meta?.changes)return "unavailable";
  return (await packageStarts(db,minutes,paymentMode,lead,now)).length>=minutes.length?"ready":"no_times";
 }catch{return "unavailable";}
}
export async function readPackageOffer(db:D1Database,channel:Channel,id:string,qid:string,now=new Date()){
 const a=await activePackageOffer(db,channel,id,qid,now);if(!a)return null;
 const minutes=await readQuoteSchedule(db,channel,id,qid);if(!minutes||minutes.length<2||minutes.length>4)return null;
 return {id:a.id,starts:await packageStarts(db,minutes,a.payment_mode,a.deadline_hours,now),minutes:Math.max(...minutes),package_minutes:minutes,session_amounts_cents:packageCharges(a.amount_cents,minutes,a.payment_mode==="installments"),payment_mode:a.payment_mode,deadline_hours:a.deadline_hours,terms:a.terms,expires_at:a.expires_at,amount_cents:a.amount_cents,can_select:a.quote_status==="interested"};
}
export async function selectPackageOffer(db:D1Database,channel:Channel,id:string,qid:string,b:any,now=new Date()){
 const a=await activePackageOffer(db,channel,id,qid,now);
 if(!a||a.quote_status!=="interested"||b?.confirmed!==true||b.offer_id!==a.id||!Array.isArray(b.starts))return {error:"This package invitation changed or is unavailable. Refresh and choose again."};
 const minutes=await readQuoteSchedule(db,channel,id,qid);
 if(!minutes||minutes.length<2||b.starts.length!==minutes.length||new Set(b.starts).size!==minutes.length)return {error:"Choose a different available time for every session."};
 const starts=await packageStarts(db,minutes,a.payment_mode,a.deadline_hours,now);
 if(!b.starts.every((s:unknown)=>typeof s==="string"&&starts.includes(s)))return {error:"One or more times changed. Refresh and choose again; no appointments were reserved."};
 return createPackage(db,channel,id,{quote_id:qid,starts:b.starts,learner_label:a.learner_label,prep_minutes:10,wrap_minutes:10,payment_mode:a.payment_mode,deadline_hours:a.deadline_hours,terms:a.terms,confirmed:true},now,a.id);
}
export async function removePackageOffer(db:D1Database,channel:Channel,id:string,qid:string){
 await ensurePackageOffers(db);
 return !!(await db.prepare("DELETE FROM support_package_offers WHERE channel=? AND request_id=? AND quote_id=?").bind(channel,id,qid).run()).meta?.changes;
}
