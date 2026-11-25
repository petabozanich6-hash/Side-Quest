import type {Env} from "./types";
import type {Channel} from "./supportOrders";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {previewSupportInvoice} from "./supportSquareInvoicePreview";
export const draftEnabled=(e:Env)=>supportInvoiceLookupAvailable(e)&&e.SUPPORT_SQUARE_DRAFT_TEST==="true";
const safeId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const view=(r:any)=>({state:r.provider_invoice_id?"draft_created":r.provider_order_id?"order_created":"recovery_required",customer_id:r.customer_id,due_at:r.due_at,fingerprint:r.fingerprint,invoice_id:r.provider_invoice_id??null});
export async function readSquareDraft(db:D1Database,channel:Channel,id:string,oid:string){
 const r=await db.prepare("SELECT * FROM support_square_draft_intents WHERE order_id=? AND channel=? AND request_id=?").bind(oid,channel,id).first<any>();return r?view(r):null;
}
export async function hasSquareDraft(db:D1Database,oid:string){
 if(!await db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_square_draft_intents'").first())return false;
 return !!await db.prepare("SELECT 1 FROM support_square_draft_intents WHERE order_id=?").bind(oid).first();
}
export async function createSquareDraft(env:Env,channel:Channel,id:string,oid:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!draftEnabled(env))return {error:"Private sandbox draft creation is disabled."};
 if(b?.confirmed!==true||typeof b.fingerprint!=="string"||!(/^[a-f0-9]{64}$/).test(b.fingerprint))return {error:"Review and explicitly approve the draft preview first."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const db=env.DB,at=now.toISOString(),load=()=>db.prepare("SELECT * FROM support_square_draft_intents WHERE order_id=? AND channel=? AND request_id=?").bind(oid,channel,id).first<any>();
 let row=await load();
 const same=(r:any)=>r&&r.fingerprint===b.fingerprint&&r.customer_id===b.customer_id&&r.due_at===b.due_at&&r.location_id===cfg.locationId&&r.application_id===cfg.applicationId;
 if(row&&!same(row))return {error:"Existing draft attempt uses different details. Reconcile the original in Square."};
 if(row?.provider_invoice_id)return {draft:view(row),created:true};
 if(row&&now.getTime()-Date.parse(row.created_at)>3600000)return {error:"Recovery window expired. Review the original attempt in Square; do not create a second invoice."};
 const p=await previewSupportInvoice(env,channel,id,oid,{customer_id:b.customer_id,due_at:b.due_at,reviewed:true},fetchImpl,now);
 if("error" in p)return {error:p.error};
 if(p.fingerprint!==b.fingerprint)return {error:"The arrangement changed. Review the original draft or prepare a fresh preview if none exists."};
 if(!row){
 await db.prepare(`INSERT OR IGNORE INTO support_square_draft_intents(order_id,channel,request_id,fingerprint,customer_id,location_id,application_id,due_at,order_key,invoice_key,created_at,updated_at)
 SELECT o.id,o.channel,o.request_id,?,?,?,?,?,?,?,?,? FROM support_service_orders o WHERE o.id=? AND o.channel=? AND o.request_id=? AND o.status='confirmed' AND o.updated_at=? AND o.amount_cents=? AND o.checkout_started_at IS NULL AND o.square_order_id IS NULL AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=o.id) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')`).bind(p.fingerprint,p.customer_id,cfg.locationId,cfg.applicationId,p.due_at,crypto.randomUUID(),crypto.randomUUID(),at,at,oid,channel,id,p.updated_at,p.amount_cents).run();
 row=await load();if(!same(row))return {error:"Another attempt exists or the arrangement changed."};
 }
 if(row.provider_invoice_id)return {draft:view(row),created:true};
 const valid=()=>db.prepare("SELECT o.id FROM support_service_orders o WHERE o.id=? AND o.channel=? AND o.request_id=? AND o.status='confirmed' AND o.updated_at=? AND o.amount_cents=? AND o.checkout_started_at IS NULL AND o.square_order_id IS NULL AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=o.id) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=o.id AND c.status='pending')").bind(oid,channel,id,p.updated_at,p.amount_cents).first();
 try{
 if(!await valid())return {error:"Arrangement changed; reconcile the draft attempt."};
 let remoteOrder=row.provider_order_id;
 if(!remoteOrder){
 const o=(await squareCall(cfg,"POST","orders",{idempotency_key:row.order_key,order:p.provider_order},fetchImpl)).order;
 if(!safeId(o?.id)||o.location_id!==cfg.locationId||o.customer_id!==p.customer_id||o.total_money?.amount!==p.amount_cents||o.total_money.currency!=="AUD")return {error:"Square order did not match preview. Reconcile original attempt."};
 await db.prepare("UPDATE support_square_draft_intents SET provider_order_id=?,updated_at=? WHERE order_id=? AND fingerprint=? AND provider_order_id IS NULL").bind(o.id,at,oid,p.fingerprint).run();
 row=await load();if(row?.provider_order_id!==o.id)return {error:"Order response requires reconciliation."};remoteOrder=o.id;
 }
 if(!await valid())return {error:"Arrangement changed after order creation. Do not publish."};
 const i=(await squareCall(cfg,"POST","invoices",{idempotency_key:row.invoice_key,invoice:{...p.provider_invoice,order_id:remoteOrder}},fetchImpl)).invoice;
 if(!safeId(i?.id)||i.order_id!==remoteOrder||i.location_id!==cfg.locationId||i.status!=="DRAFT"||i.primary_recipient?.customer_id!==p.customer_id||!Number.isSafeInteger(i.version)||!Array.isArray(i.payment_requests)||i.payment_requests.length!==1||i.payment_requests[0].request_type!=="BALANCE"||i.payment_requests[0].due_date!==p.due_date)return {error:"Invoice response requires reconciliation; do not publish or create another invoice."};
 await db.prepare("UPDATE support_square_draft_intents SET provider_invoice_id=?,provider_invoice_version=?,updated_at=? WHERE order_id=? AND fingerprint=? AND provider_invoice_id IS NULL").bind(i.id,i.version,at,oid,p.fingerprint).run();
 row=await load();if(row?.provider_invoice_id!==i.id)return {error:"Draft requires reconciliation."};
 return {draft:view(row),created:true};
 }catch{return {error:"Draft response unconfirmed. Original attempt retained. Retry the same reviewed details or reconcile in Square; do not issue another invoice."};}
}
