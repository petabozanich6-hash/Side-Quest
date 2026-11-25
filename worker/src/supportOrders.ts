import type {Env} from "./types";
import {nowIso} from "./types";
export type Channel="member"|"guest";
export const ORDER_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS support_service_orders (id TEXT PRIMARY KEY, channel TEXT NOT NULL CHECK(channel IN ('member','guest')), request_id TEXT NOT NULL, quote_id TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000), scope TEXT NOT NULL, delivery TEXT NOT NULL, terms TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('live','written')), start_at TEXT, end_at TEXT, status TEXT NOT NULL DEFAULT 'awaiting_confirmation' CHECK(status IN ('awaiting_confirmation','confirmed','paid','review','cancelled','completed')), confirmed_at TEXT, square_order_id TEXT UNIQUE, square_link_id TEXT UNIQUE, checkout_url TEXT, square_payment_id TEXT UNIQUE, checkout_started_at TEXT, paid_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_support_order_quote ON support_service_orders(channel,quote_id) WHERE status<>'cancelled'",
  "CREATE INDEX IF NOT EXISTS idx_support_order_slot ON support_service_orders(start_at,end_at,status)",
  "CREATE INDEX IF NOT EXISTS idx_support_order_request ON support_service_orders(channel,request_id,created_at DESC)"
] as const;
export async function ensureOrderSchema(db:D1Database){for(const sql of ORDER_SCHEMA)await db.prepare(sql).run();}
export const orderPublic=(r:any)=>({id:r.id,quote_id:r.quote_id,amount_cents:r.amount_cents,scope:r.scope,delivery:r.delivery,terms:r.terms,mode:r.mode,start_at:r.start_at,end_at:r.end_at,status:r.status,confirmed_at:r.confirmed_at,paid_at:r.paid_at,checkout_url:r.status==="confirmed"?r.checkout_url:null});
export async function listOrders(db:D1Database,channel:Channel,id:string){await ensureOrderSchema(db);const {results}=await db.prepare("SELECT * FROM support_service_orders WHERE channel=? AND request_id=? ORDER BY created_at DESC LIMIT 100").bind(channel,id).all<any>();return (results||[]).map(orderPublic);}
export async function getOrder(db:D1Database,channel:Channel,id:string,oid:string){await ensureOrderSchema(db);return db.prepare("SELECT * FROM support_service_orders WHERE channel=? AND request_id=? AND id=?").bind(channel,id,oid).first<any>();}
export async function hasOrder(db:D1Database,channel:Channel,qid:string){await ensureOrderSchema(db);return !!await db.prepare("SELECT id FROM support_service_orders WHERE channel=? AND quote_id=? AND status<>'cancelled'").bind(channel,qid).first();}
export async function createServiceOrder(db:D1Database,channel:Channel,id:string,b:Record<string,unknown>,now=new Date()){
 await ensureOrderSchema(db);
 const qid=typeof b.quote_id==="string"?b.quote_id:"",mode=b.mode,terms=typeof b.terms==="string"?b.terms.trim():"";
 if(!qid||!["live","written"].includes(String(mode))||terms.length<20||terms.length>2000||b.confirmed!==true)return {error:"Choose the service, confirm arrangements, and enter the service and cancellation terms (20–2000 characters)."};
 let start:string|null=null,end:string|null=null;
 if(mode==="live"){
  if(typeof b.start_at!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(b.start_at)||!Number.isFinite(Date.parse(b.start_at))||Date.parse(b.start_at)<=now.getTime()||typeof b.minutes!=="number"||!Number.isInteger(b.minutes)||b.minutes<15||b.minutes>180)return {error:"Choose a future start time and a duration of 15–180 minutes."};
  start=new Date(b.start_at).toISOString();end=new Date(Date.parse(start)+b.minutes*60000).toISOString();
 }
 const qtable=channel==="guest"?"support_guest_quotes":"learning_support_quotes",key=channel==="guest"?"request_id":"feedback_id",rtable=channel==="guest"?"support_guest_requests":"parent_feedback",tag=channel==="member"?" AND r.page_hint='learning-support'":"";
 const oid=crypto.randomUUID(),when=now.toISOString();
 // Atomic availability check across both channels; no second live booking overlaps even under concurrent requests.
 const sql="INSERT OR IGNORE INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,created_at,updated_at) SELECT ?,?,r.id,q.id,q.amount_cents,q.scope,q.delivery,?,?,?,?,?,? FROM "+qtable+" q JOIN "+rtable+" r ON r.id=q."+key+" WHERE r.id=? AND q.id=? AND q.status='interested' AND q.expires_at>? AND r.status NOT IN ('closed','resolved')"+tag+" AND (? IS NULL OR NOT EXISTS(SELECT 1 FROM support_service_orders o WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND o.start_at<? AND o.end_at>?))";
 const changed=await db.prepare(sql).bind(oid,channel,terms,mode,start,end,when,when,id,qid,when,start,end,start).run();
 if(!changed.meta?.changes)return {error:"Proposal expired, already has an order, or the appointment overlaps an existing reservation."};
 return {id:oid};
}
export async function confirmServiceOrder(db:D1Database,channel:Channel,id:string,oid:string,now=new Date()){
 const when=now.toISOString();
 const result=await db.prepare("UPDATE support_service_orders SET status=CASE WHEN amount_cents=0 THEN 'paid' ELSE 'confirmed' END,confirmed_at=?,paid_at=CASE WHEN amount_cents=0 THEN ? ELSE NULL END,updated_at=? WHERE channel=? AND request_id=? AND id=? AND status='awaiting_confirmation' AND (start_at IS NULL OR start_at>?)").bind(when,when,when,channel,id,oid,when).run();
 return !!result.meta?.changes;
}
export async function cancelUnstartedOrder(db:D1Database,channel:Channel,id:string,oid:string){
 const r=await db.prepare("UPDATE support_service_orders SET status='cancelled',updated_at=? WHERE channel=? AND request_id=? AND id=? AND status IN ('awaiting_confirmation','confirmed') AND checkout_started_at IS NULL AND square_order_id IS NULL").bind(nowIso(),channel,id,oid).run();return !!r.meta?.changes;
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
