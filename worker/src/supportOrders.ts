import {bookingPolicyGuard} from "./supportPublicAvailability";
import {permitsSupportStart,PREPARATION_NOTICE} from "./supportLeadTime";
import type {Env} from "./types";
import {nowIso} from "./types";
import {readQuoteSchedule} from "./supportQuotePlans";
export type Channel="member"|"guest";
export const ORDER_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_service_orders (id TEXT PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL, quote_id TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000), scope TEXT NOT NULL, delivery TEXT NOT NULL, terms TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('live','written')), start_at TEXT, end_at TEXT, status TEXT NOT NULL DEFAULT 'awaiting_confirmation' CHECK(status IN ('awaiting_confirmation','confirmed','paid','review','cancelled','completed')), confirmed_at TEXT, square_order_id TEXT UNIQUE, square_link_id TEXT UNIQUE, checkout_url TEXT, square_payment_id TEXT UNIQUE, checkout_started_at TEXT, paid_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_support_order_quote ON support_service_orders(channel,quote_id) WHERE status<>'cancelled'",
  "CREATE INDEX IF NOT EXISTS idx_support_order_slot ON support_service_orders(start_at,end_at,status)",
  "CREATE INDEX IF NOT EXISTS idx_support_order_request ON support_service_orders(channel,request_id,created_at DESC)"
] as const;
export const INVOICE_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_manual_invoices (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, reference TEXT NOT NULL COLLATE NOCASE UNIQUE, due_at TEXT NOT NULL, issued_at TEXT NOT NULL, issued_by TEXT NOT NULL, verified_at TEXT, verified_by TEXT, cancelled_at TEXT)",
  "CREATE INDEX IF NOT EXISTS idx_support_invoice_due ON support_manual_invoices(due_at)"
] as const;
export const DIARY_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_tutor_diary (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, learner_label TEXT NOT NULL DEFAULT '', prep_minutes INTEGER NOT NULL DEFAULT 0 CHECK(prep_minutes BETWEEN 0 AND 120), wrap_minutes INTEGER NOT NULL DEFAULT 0 CHECK(wrap_minutes BETWEEN 0 AND 120), details_json TEXT NOT NULL DEFAULT '{}', ready INTEGER NOT NULL DEFAULT 0 CHECK(ready IN (0,1)), revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS support_busy_blocks (id TEXT PRIMARY KEY,label TEXT NOT NULL,start_at TEXT NOT NULL,end_at TEXT NOT NULL,created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_support_busy_blocks_time ON support_busy_blocks(start_at,end_at)"
] as const;
export const SLOT_SCHEMA="CREATE TABLE IF NOT EXISTS support_slot_offers (id TEXT PRIMARY KEY,channel TEXT NOT NULL CHECK(channel IN ('member','guest')),request_id TEXT NOT NULL,quote_id TEXT NOT NULL,starts_json TEXT NOT NULL,minutes INTEGER NOT NULL CHECK(minutes BETWEEN 15 AND 180),prep_minutes INTEGER NOT NULL CHECK(prep_minutes BETWEEN 0 AND 120),wrap_minutes INTEGER NOT NULL CHECK(wrap_minutes BETWEEN 0 AND 120),learner_label TEXT NOT NULL,terms TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(channel,quote_id))";
export const PACKAGE_SCHEMA=["CREATE TABLE IF NOT EXISTS support_package_sessions (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, root_id TEXT NOT NULL REFERENCES support_service_orders(id), quote_id TEXT NOT NULL, sequence INTEGER NOT NULL CHECK(sequence BETWEEN 1 AND 4), total INTEGER NOT NULL CHECK(total BETWEEN 2 AND 4), UNIQUE(root_id,sequence))","CREATE INDEX IF NOT EXISTS idx_support_package_root ON support_package_sessions(root_id)","CREATE TABLE IF NOT EXISTS support_installment_terms (order_id TEXT PRIMARY KEY REFERENCES support_service_orders(id) ON DELETE CASCADE, due_at TEXT NOT NULL)","CREATE TRIGGER IF NOT EXISTS support_package_payment_status AFTER UPDATE OF status ON support_service_orders WHEN OLD.status<>NEW.status AND NEW.status IN ('confirmed','paid','cancelled','review') AND EXISTS(SELECT 1 FROM support_package_sessions p WHERE p.order_id=NEW.id AND p.root_id=NEW.id) AND (NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=NEW.id) OR (OLD.status='awaiting_confirmation' AND NEW.status IN ('confirmed','cancelled'))) BEGIN UPDATE support_service_orders SET status=NEW.status,confirmed_at=NEW.confirmed_at,paid_at=NEW.paid_at,updated_at=NEW.updated_at WHERE id IN (SELECT order_id FROM support_package_sessions WHERE root_id=NEW.id AND order_id<>NEW.id) AND ((NEW.status='confirmed' AND status='awaiting_confirmation') OR (NEW.status='paid' AND status IN ('awaiting_confirmation','confirmed')) OR (NEW.status='cancelled' AND status IN ('awaiting_confirmation','confirmed')) OR (NEW.status='review' AND status IN ('paid','confirmed','awaiting_confirmation'))); END","CREATE TRIGGER IF NOT EXISTS support_package_duplicate_guard BEFORE INSERT ON support_service_orders WHEN EXISTS(SELECT 1 FROM support_package_sessions p JOIN support_service_orders s ON s.id=p.order_id WHERE s.channel=NEW.channel AND p.quote_id=NEW.quote_id AND s.status<>'cancelled') BEGIN SELECT RAISE(IGNORE); END"] as const;
export async function ensureOrderSchema(db:D1Database){for(const sql of [...ORDER_SCHEMA,...INVOICE_SCHEMA,...DIARY_SCHEMA,SLOT_SCHEMA,...PACKAGE_SCHEMA])await db.prepare(sql).run();}
export const orderPublic=(r:any)=>({id:r.id,quote_id:r.original_quote_id??r.quote_id,package_root_id:r.package_root_id??null,package_sequence:r.package_sequence??null,package_total:r.package_total??null,installment:!!r.installment_due_at,installment_due_at:r.installment_due_at??null,amount_cents:r.amount_cents,scope:r.scope,delivery:r.delivery,terms:r.terms,mode:r.mode,start_at:r.start_at,end_at:r.end_at,status:r.status,confirmed_at:r.confirmed_at,paid_at:r.paid_at,legacy_checkout:!!r.checkout_started_at,cancellation_pending:r.cancellation_pending===1,invoice_reference:r.invoice_reference??null,payment_due_at:r.payment_due_at??null,invoice_verified_at:r.invoice_verified_at??null,invoice_overdue:r.status==="confirmed"&&!!(r.installment_due_at??r.payment_due_at)&&(r.installment_due_at??r.payment_due_at)<=nowIso()});
export async function listOrders(db:D1Database,channel:Channel,id:string){await ensureOrderSchema(db);const {results}=await db.prepare("SELECT o.*,p.root_id package_root_id,p.sequence package_sequence,p.total package_total,p.quote_id original_quote_id,t.due_at installment_due_at,i.reference invoice_reference,i.due_at payment_due_at,i.verified_at invoice_verified_at, CASE WHEN o.status NOT IN ('cancelled','completed') AND EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending') THEN 1 ELSE 0 END cancellation_pending FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id LEFT JOIN support_installment_terms t ON t.order_id=o.id LEFT JOIN support_manual_invoices i ON i.order_id=CASE WHEN t.order_id IS NOT NULL THEN o.id ELSE COALESCE(p.root_id,o.id) END WHERE o.channel=? AND o.request_id=? ORDER BY o.created_at DESC,COALESCE(p.sequence,1),o.id LIMIT 100").bind(channel,id).all<any>();return (results||[]).map(orderPublic);}
export async function getOrder(db:D1Database,channel:Channel,id:string,oid:string){await ensureOrderSchema(db);return db.prepare("SELECT o.*,p.root_id package_root_id,p.sequence package_sequence,p.total package_total,p.quote_id original_quote_id,t.due_at installment_due_at FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id LEFT JOIN support_installment_terms t ON t.order_id=o.id WHERE o.channel=? AND o.request_id=? AND o.id=?").bind(channel,id,oid).first<any>();}
export async function hasOrder(db:D1Database,channel:Channel,qid:string){await ensureOrderSchema(db);return !!await db.prepare("SELECT o.id FROM support_service_orders o LEFT JOIN support_package_sessions p ON p.order_id=o.id WHERE o.channel=? AND COALESCE(p.quote_id,o.quote_id)=? AND o.status<>'cancelled'").bind(channel,qid).first();}
export async function createServiceOrder(db:D1Database,channel:Channel,id:string,b:Record<string,unknown>,now=new Date(),slotOfferId?:string){
 await ensureOrderSchema(db);
 const qid=typeof b.quote_id==="string"?b.quote_id:"",mode=b.mode,terms=typeof b.terms==="string"?b.terms.trim():"";
 if(!qid||!["live","written"].includes(String(mode))||terms.length<20||terms.length>2000||b.confirmed!==true)return {error:"Choose the service, confirm arrangements, and enter the service and cancellation terms (20–2000 characters)."};
 const schedule=await readQuoteSchedule(db,channel,id,qid);
 if(schedule&&schedule.length>1)return {error:"This quote has multiple lessons. Reserve the whole package instead."};
 if(schedule&&(mode!=="live"||b.minutes!==schedule[0]))return {error:"The delivery mode and duration must match the quoted live session."};
 const prep=b.prep_minutes??0,wrap=b.wrap_minutes??0,label=typeof b.learner_label==="string"?b.learner_label.trim():"";
 if(typeof prep!=="number"||!Number.isInteger(prep)||prep<0||prep>120||typeof wrap!=="number"||!Number.isInteger(wrap)||wrap<0||wrap>120||label.length>80)return {error:"Use a learner nickname or initials and buffers of 0–120 minutes."};
 let start:string|null=null,end:string|null=null;
 if(mode==="live"){
  if(typeof b.start_at!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(b.start_at)||!Number.isFinite(Date.parse(b.start_at))||Date.parse(b.start_at)<=now.getTime()||typeof b.minutes!=="number"||!Number.isInteger(b.minutes)||b.minutes<15||b.minutes>180)return {error:"Choose a future start time and a duration of 15–180 minutes."};
  start=new Date(b.start_at).toISOString();end=new Date(Date.parse(start)+b.minutes*60000).toISOString();
  if(!await permitsSupportStart(db,channel,id,[start]))return {error:PREPARATION_NOTICE};
 }
 const qtable=channel==="guest"?"support_guest_quotes":"learning_support_quotes",key=channel==="guest"?"request_id":"feedback_id",rtable=channel==="guest"?"support_guest_requests":"parent_feedback",tag=channel==="member"?" AND r.page_hint='learning-support'":"";
 const oid=crypto.randomUUID(),when=now.toISOString();
 // Atomic availability check across both channels; no second live booking overlaps even under concurrent requests.
 const occupiedStart=start?new Date(Date.parse(start)-prep*60000).toISOString():null,occupiedEnd=end?new Date(Date.parse(end)+wrap*60000).toISOString():null;
 const sql="INSERT OR IGNORE INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,?,r.id,q.id,q.amount_cents,q.scope,q.delivery,?,?,?,?,?,? FROM "+qtable+" q JOIN "+rtable+" r ON r.id=q."+key+" WHERE r.id=? AND q.id=? AND q.status='interested' AND q.expires_at>? AND r.status NOT IN ('closed','resolved')"+tag+" AND (? IS NULL OR (NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?)) AND NOT EXISTS(SELECT 1 FROM support_busy_blocks z WHERE z.start_at<? AND z.end_at>?)))";
 const capacity=start&&occupiedStart&&occupiedEnd?await bookingPolicyGuard(db,[{start,before:occupiedStart,after:occupiedEnd}]):{sql:"",args:[]};
 if(!capacity)return {error:"This appointment is outside configured hours or booking capacity."};
 const guard=slotOfferId?" AND EXISTS(SELECT 1 FROM support_slot_offers s JOIN json_each(s.starts_json) j WHERE s.id=? AND s.channel=? AND s.request_id=? AND s.quote_id=? AND s.expires_at>? AND j.value=? AND s.minutes=? AND s.prep_minutes=? AND s.wrap_minutes=? AND s.terms=? AND s.learner_label=?)":"";
 const args=slotOfferId?[slotOfferId,channel,id,qid,when,start,b.minutes,prep,wrap,terms,label]:[];
 const results=await db.batch([db.prepare(sql+guard+capacity.sql).bind(oid,channel,terms,mode,start,end,when,when,id,qid,when,start,occupiedEnd,occupiedStart,occupiedEnd,occupiedStart,...args,...capacity.args),db.prepare("INSERT INTO support_tutor_diary(order_id,learner_label,prep_minutes,wrap_minutes,updated_at) SELECT id,?,?,?,? FROM support_service_orders WHERE id=?").bind(label,mode==="live"?prep:0,mode==="live"?wrap:0,when,oid)]);
 const changed=results[0];
 if(!changed.meta?.changes)return {error:"Proposal expired, already has an order, or the appointment including preparation and wrap-up overlaps a reservation, blocked time or booking capacity."};
 return {id:oid};
}
export async function confirmServiceOrder(db:D1Database,channel:Channel,id:string,oid:string,now=new Date()){
 const when=now.toISOString();
 const result=await db.prepare("UPDATE support_service_orders SET status=CASE WHEN amount_cents=0 THEN 'paid' ELSE 'confirmed' END,confirmed_at=?,paid_at=CASE WHEN amount_cents=0 THEN ? ELSE NULL END,updated_at=? WHERE channel=? AND request_id=? AND id=? AND status='awaiting_confirmation' AND NOT EXISTS(SELECT 1 FROM support_package_sessions p WHERE p.order_id=support_service_orders.id AND p.root_id<>p.order_id) AND (start_at IS NULL OR start_at>?)").bind(when,when,when,channel,id,oid,when).run();
 return !!result.meta?.changes;
}
export async function cancelUnstartedOrder(db:D1Database,channel:Channel,id:string,oid:string,checkedSquare=false){
 const r=await db.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE channel=? AND request_id=? AND id=? AND status IN ('awaiting_confirmation','confirmed') AND (NOT EXISTS(SELECT 1 FROM support_package_sessions p WHERE p.order_id=support_service_orders.id AND p.root_id<>p.order_id) OR (status='confirmed' AND EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=support_service_orders.id))) AND checkout_started_at IS NULL AND square_order_id IS NULL AND NOT EXISTS (SELECT 1 FROM support_manual_invoices i WHERE i.order_id=support_service_orders.id) AND (?=1 OR status='awaiting_confirmation' OR NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=support_service_orders.id))").bind(nowIso(),channel,id,oid,checkedSquare?1:0).run();return !!r.meta?.changes;
}
export async function completeOrder(db:D1Database,channel:Channel,id:string,oid:string){
 const now=nowIso();const r=await db.prepare("UPDATE support_service_orders SET status='completed',updated_at=? WHERE channel=? AND request_id=? AND id=? AND status='paid' AND (end_at IS NULL OR end_at<=?)").bind(now,channel,id,oid,now).run();return !!r.meta?.changes;
}
/** Only called with a freshly retrieved Square payment after signature verification. Returns null for non-tutoring orders. */
export async function applySupportPayment(db:D1Database,payment:any,locationId:string,now=new Date()):Promise<string|null>{
 await ensureOrderSchema(db);
 const row=await db.prepare("SELECT * FROM support_service_orders WHERE square_order_id=?").bind(String(payment.order_id||"")).first<any>();if(!row)return null;
 if(payment.location_id!==locationId||payment.status!=="COMPLETED"||payment.amount_money?.currency!=="AUD"||payment.amount_money?.amount!==row.amount_cents||!payment.id){
  await db.prepare("UPDATE support_service_orders SET status='review',updated_at=? WHERE id=? AND status<>'cancelled'").bind(now.toISOString(),row.id).run();return "support payment requires review";
 }
 if(Number(payment.refunded_money?.amount||0)>0||row.status==="cancelled"||(row.square_payment_id&&row.square_payment_id!==payment.id)||(row.start_at&&row.start_at<=now.toISOString()&&row.status==="confirmed")){
  await db.prepare("UPDATE support_service_orders SET status='review',updated_at=? WHERE id=?").bind(now.toISOString(),row.id).run();return "support payment requires review";
 }
 const when=now.toISOString();
 await db.prepare("UPDATE support_service_orders SET status='paid',square_payment_id=?,paid_at=?,updated_at=? WHERE id=? AND status='confirmed' AND (square_payment_id IS NULL OR square_payment_id=?)").bind(payment.id,when,when,row.id,payment.id).run();
 return "support payment recorded";
}
export function supportPaymentsEnabled(env:Env){return env.SUPPORT_CHECKOUT_TEST==="true"&&/^sandbox-/.test(env.SQUARE_APPLICATION_ID||"");}

/** Signed refund notifications are re-read from Square before flagging a tutoring order for manual review. */
export async function flagSupportRefund(db:D1Database,refund:any,locationId:string,now=new Date()):Promise<string|null>{
 if(!refund?.payment_id||refund.location_id!==locationId||!["PENDING","COMPLETED"].includes(refund.status))return null;
 await ensureOrderSchema(db);
 const r=await db.prepare("UPDATE support_service_orders SET status='review',updated_at=? WHERE square_payment_id=? AND status IN ('paid','completed','review')").bind(now.toISOString(),refund.payment_id).run();
 return r.meta?.changes?"support refund requires review":null;
}

/** The owner sends the invoice in Square; Side-Quest records the reference only. */
export async function recordManualInvoice(db:D1Database,channel:Channel,id:string,oid:string,b:Record<string,unknown>,actorId:string,now=new Date()){
 await ensureOrderSchema(db);
 const ref=typeof b.reference==="string"?b.reference.trim():"",due=typeof b.due_at==="string"?b.due_at:"",when=now.toISOString();
 if((b.issued_in_square!==true&&b.sent_in_square!==true)||!(/^[A-Za-z0-9][A-Za-z0-9._ /-]{1,79}$/).test(ref)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(due)||!Number.isFinite(Date.parse(due))||due<=when||Date.parse(due)>now.getTime()+90*86400000)return {error:"Enter the actual Square invoice reference and a future payment deadline within 90 days."};
 const r=await db.prepare("INSERT OR IGNORE INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) SELECT id,?,?,?,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND amount_cents>0 AND checkout_started_at IS NULL AND square_order_id IS NULL AND (start_at IS NULL OR (start_at>? AND julianday(?)+COALESCE((SELECT prep_minutes FROM support_tutor_diary d WHERE d.order_id=support_service_orders.id),0)/1440.0<julianday(start_at))) AND NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=support_service_orders.id AND t.due_at<>?)").bind(ref,due,when,actorId,oid,channel,id,due,due).run();
 return r.meta?.changes?{ok:true}:{error:"Invoice already recorded, reference already used, checkout previously started, or deadline is after the appointment."};
}
export async function verifyManualInvoice(db:D1Database,channel:Channel,id:string,oid:string,b:Record<string,unknown>,actorId:string,now=new Date()){
 await ensureOrderSchema(db);
 const ref=typeof b.reference==="string"?b.reference.trim():"",amount=b.amount_cents,when=now.toISOString();
 if(b.paid_in_square!==true||!ref||typeof amount!=="number"||!Number.isInteger(amount)||amount<=0)return false;
 const result=await db.batch([
 db.prepare("UPDATE support_service_orders SET status='paid',paid_at=?,updated_at=? WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND amount_cents=? AND checkout_started_at IS NULL AND square_order_id IS NULL AND (start_at IS NULL OR start_at>?) AND EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=support_service_orders.id AND i.reference=? AND i.cancelled_at IS NULL AND i.verified_at IS NULL) AND (NOT EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=support_service_orders.id AND t.due_at<=?) OR ?=1)").bind(when,when,oid,channel,id,amount,when,ref,when,b.paid_by_deadline===true?1:0),
 db.prepare("UPDATE support_manual_invoices SET verified_at=?,verified_by=? WHERE order_id=? AND reference=? AND verified_at IS NULL AND cancelled_at IS NULL AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_manual_invoices.order_id AND o.channel=? AND o.request_id=? AND o.status='paid' AND o.paid_at=? AND o.amount_cents=?)").bind(when,actorId,oid,ref,channel,id,when,amount)
 ]);
 return !!result[0]?.meta?.changes;
}
/** Never automatically free an invoiced slot: an overdue invoice may have been paid outside Side-Quest. */
export async function cancelManualInvoiceOrder(db:D1Database,channel:Channel,id:string,oid:string,b:Record<string,unknown>,now=new Date()){
 await ensureOrderSchema(db);
 if(b.cancelled_unpaid_in_square!==true)return false;
 const when=now.toISOString();
 const result=await db.batch([
 db.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND (NOT EXISTS(SELECT 1 FROM support_package_sessions p WHERE p.order_id=support_service_orders.id AND p.root_id<>p.order_id) OR (status='confirmed' AND EXISTS(SELECT 1 FROM support_installment_terms t WHERE t.order_id=support_service_orders.id))) AND checkout_started_at IS NULL AND square_order_id IS NULL AND EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=support_service_orders.id AND i.verified_at IS NULL AND i.cancelled_at IS NULL)").bind(when,oid,channel,id),
 db.prepare("UPDATE support_manual_invoices SET cancelled_at=? WHERE order_id=? AND verified_at IS NULL AND cancelled_at IS NULL AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=support_manual_invoices.order_id AND o.channel=? AND o.request_id=? AND o.status='cancelled' AND o.updated_at=?)").bind(when,oid,channel,id,when)
 ]);
 return !!result[0]?.meta?.changes;
}
