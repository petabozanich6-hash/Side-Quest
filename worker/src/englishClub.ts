import {ensureOrderSchema} from "./supportOrders";
export const ENGLISH_CLUB_SERVICE="English Club — weekly group workshop";
export const ENGLISH_CLUB_PREFIX="English Club: ";
export const ENGLISH_CLUB_PRICE_CENTS=1200;
export const ENGLISH_CLUB_CAPACITY=8;
export const ENGLISH_CLUB_SCHEMA=["CREATE TABLE IF NOT EXISTS support_english_classes (id TEXT PRIMARY KEY, week_of TEXT NOT NULL UNIQUE, start_at TEXT NOT NULL, end_at TEXT NOT NULL, topic TEXT NOT NULL, preparation TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)","CREATE TABLE IF NOT EXISTS support_english_enrolments (id TEXT PRIMARY KEY, class_id TEXT NOT NULL REFERENCES support_english_classes(id), request_id TEXT NOT NULL REFERENCES support_guest_requests(id) ON DELETE CASCADE, learner_label TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'reserved' CHECK(status IN ('reserved','invoiced','paid','cancelled')), invoice_reference TEXT, payment_due_at TEXT NOT NULL, attendance TEXT CHECK(attendance IN ('present','absent')), created_at TEXT NOT NULL, UNIQUE(class_id,request_id))","CREATE INDEX IF NOT EXISTS idx_support_english_class_roster ON support_english_enrolments(class_id,status)"] as const;
export async function ensureEnglishClub(db:D1Database){await db.batch(ENGLISH_CLUB_SCHEMA.map(sql=>db.prepare(sql)));}
const iso=(v:unknown):v is string=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v));
const text=(v:unknown,max:number)=>typeof v==="string"&&v.trim().length<=max?v.trim():"";
export function sydneyWeek(start:string){
 const parts=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(start)).map(p=>[p.type,p.value]));
 const d=new Date(parts.year+"-"+parts.month+"-"+parts.day+"T00:00:00Z");d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);
}
export async function createEnglishClass(db:D1Database,b:any,now=new Date()){
 const start=b?.start_at,topic=text(b?.topic,120),preparation=text(b?.preparation,4000);
 if(b?.confirmed!==true||!iso(start)||!topic||Date.parse(start)-24*3600000<=now.getTime()||Date.parse(start)>now.getTime()+180*86400000)return {error:"Choose a topic and class start more than 24 hours ahead, within six months."};
 await ensureOrderSchema(db);await ensureEnglishClub(db);
 const id="english-club-"+crypto.randomUUID(),end=new Date(Date.parse(start)+60*60000).toISOString(),before=new Date(Date.parse(start)-15*60000).toISOString(),after=new Date(Date.parse(end)+10*60000).toISOString(),week=sydneyWeek(start),when=now.toISOString();
 const result=await db.batch([
 db.prepare("INSERT INTO support_busy_blocks(id,label,start_at,end_at,created_at) SELECT ?,'English Club (including preparation)',?,?,? WHERE NOT EXISTS(SELECT 1 FROM support_english_classes WHERE week_of=?) AND NOT EXISTS(SELECT 1 FROM support_busy_blocks WHERE start_at<? AND end_at>?) AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?))").bind(id,before,after,when,week,after,before,after,before),
 db.prepare("INSERT INTO support_english_classes(id,week_of,start_at,end_at,topic,preparation,created_at) SELECT id,?,?,?,?,?,? FROM support_busy_blocks WHERE id=?").bind(week,start,end,topic,preparation,when,id)
 ]);
 return result[0]?.meta?.changes&&result[1]?.meta?.changes?{id}:{error:"A class already exists for that Sydney week, or this time overlaps a booking or blocked time."};
}
export async function listEnglishClub(db:D1Database){
 await ensureEnglishClub(db);
 const [classes,enquiries,roster]=await Promise.all([
 db.prepare("SELECT c.*,COALESCE(p.enabled,0) self_service_published,x.round_id,COALESCE(rr.price_per_session_cents,1200) price_cents FROM support_english_classes c LEFT JOIN support_english_publications p ON p.class_id=c.id LEFT JOIN support_english_round_classes x ON x.class_id=c.id LEFT JOIN support_english_rounds rr ON rr.id=x.round_id ORDER BY c.start_at DESC LIMIT 100").all<any>(),
 db.prepare("SELECT r.id,r.parent_name,r.email,r.subject,r.message,f.id family_id,l.label learner_label FROM support_guest_requests r JOIN support_guest_families f ON f.email=r.email LEFT JOIN support_guest_learner_enquiries a ON a.request_id=r.id LEFT JOIN support_guest_learners l ON l.id=a.learner_id WHERE r.subject LIKE 'English Club: %' AND r.status NOT IN ('closed','resolved') ORDER BY r.updated_at DESC LIMIT 200").all<any>(),
 db.prepare("SELECT e.*,r.parent_name,r.email FROM support_english_enrolments e JOIN support_guest_requests r ON r.id=e.request_id WHERE e.class_id IN (SELECT id FROM support_english_classes ORDER BY start_at DESC LIMIT 100) ORDER BY e.created_at").all<any>()
 ]);
 return {classes:classes.results||[],enquiries:enquiries.results||[],roster:roster.results||[],price_cents:ENGLISH_CLUB_PRICE_CENTS,capacity:ENGLISH_CLUB_CAPACITY};
}
export async function enrolEnglishLearner(db:D1Database,classId:string,b:any,now=new Date()){
 await ensureEnglishClub(db);
 const request=text(b?.request_id,100),label=text(b?.learner_label,80),when=now.toISOString();
 if(b?.confirmed!==true||!request||!label)return {error:"Confirm parent agreement and suitability for this group class, and enter the learner nickname."};
 const id=crypto.randomUUID();
 let r;try{r=await db.prepare("INSERT INTO support_english_enrolments(id,class_id,request_id,learner_label,payment_due_at,created_at) SELECT ?,c.id,r.id,?,strftime('%Y-%m-%dT%H:%M:%fZ',julianday(c.start_at)-1),? FROM support_english_classes c JOIN support_guest_requests r ON r.id=? WHERE c.id=? AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=c.id) AND r.subject LIKE 'English Club: %' AND r.status NOT IN ('closed','resolved') AND julianday(c.start_at)-1>julianday(?) AND (SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled')<8 ON CONFLICT(class_id,request_id) DO NOTHING").bind(id,label,when,request,classId,when).run();}catch{return {error:"Class unavailable or this learner already has a place."};}
 return r.meta?.changes?{id}:{error:"Class full, already enrolled, enquiry unavailable or payment deadline passed."};
}
export async function updateEnglishEnrolment(db:D1Database,classId:string,id:string,b:any,now=new Date()){
 await ensureEnglishClub(db);if(b?.confirmed!==true)return false;
 const when=now.toISOString();
 if(b.action==="invoice"){
 const ref=text(b.invoice_reference,80);if(!ref||b.issued_in_square!==true)return false;
 return !!(await db.prepare("UPDATE support_english_enrolments SET status='invoiced',invoice_reference=? WHERE id=? AND class_id=? AND status='reserved' AND payment_due_at>? AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=support_english_enrolments.class_id) AND NOT EXISTS(SELECT 1 FROM support_english_enrolments WHERE invoice_reference=?)").bind(ref,id,classId,when,ref).run()).meta?.changes;
 }
 if(b.action==="paid"&&b.paid_in_square===true&&b.amount_cents===1200&&b.paid_by_deadline===true)return !!(await db.prepare("UPDATE support_english_enrolments SET status='paid' WHERE id=? AND class_id=? AND status='invoiced' AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=support_english_enrolments.class_id)").bind(id,classId).run()).meta?.changes;
 if(b.action==="cancel"&&b.checked_square===true)return !!(await db.prepare("UPDATE support_english_enrolments SET status='cancelled' WHERE id=? AND class_id=? AND status IN ('reserved','invoiced') AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=support_english_enrolments.class_id)").bind(id,classId).run()).meta?.changes;
 if(b.action==="attendance"&&["present","absent"].includes(b.attendance))return !!(await db.prepare("UPDATE support_english_enrolments SET attendance=? WHERE id=? AND class_id=? AND status='paid' AND EXISTS(SELECT 1 FROM support_english_classes WHERE id=? AND start_at<=?)").bind(b.attendance,id,classId,classId,when).run()).meta?.changes;
 return false;
}
export async function parentEnglishClasses(db:D1Database,requestId:string,email:string){
 await ensureEnglishClub(db);
 return (await db.prepare("SELECT c.id,c.topic,c.start_at,c.end_at,e.status,e.payment_due_at,e.invoice_reference,e.attendance FROM support_english_enrolments e JOIN support_english_classes c ON c.id=e.class_id JOIN support_guest_requests r ON r.id=e.request_id WHERE r.id=? AND r.email=? ORDER BY c.start_at DESC LIMIT 100").bind(requestId,email).all()).results||[];
}

export async function removeEmptyEnglishClass(db:D1Database,id:string,now=new Date()){
 await ensureEnglishClub(db);
 const results=await db.batch([
 db.prepare("DELETE FROM support_busy_blocks WHERE id=? AND EXISTS(SELECT 1 FROM support_english_classes c WHERE c.id=? AND c.start_at>?) AND NOT EXISTS(SELECT 1 FROM support_english_enrolments WHERE class_id=?) AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=support_busy_blocks.id)").bind(id,id,now.toISOString(),id),
 db.prepare("DELETE FROM support_english_classes WHERE id=? AND start_at>? AND NOT EXISTS(SELECT 1 FROM support_english_enrolments WHERE class_id=?) AND NOT EXISTS(SELECT 1 FROM support_busy_blocks WHERE id=?) AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x WHERE x.class_id=support_english_classes.id)").bind(id,now.toISOString(),id,id)
 ]);
 return !!results[1]?.meta?.changes;
}
