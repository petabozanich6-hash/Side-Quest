import type {Env} from "./types";
import {getOrder,type Channel} from "./supportOrders";
import {invoicePilotConfig,prepareSandboxInvoice,publishSandboxInvoice} from "./supportSquareInvoices";
import {stationeryRecipient} from "./supportStationery";
import type {Fetch} from "./square";
const day=(d:Date)=>{const p=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d).map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day;};
const view=(r:any)=>r?{state:r.state,invoice_id:r.invoice_id,due_at:r.due_at,amount_cents:r.amount_cents,payment_url:r.payment_url}:null;
export async function readInvoiceAttempt(e:Env,channel:Channel,id:string,oid:string){
 if(!invoicePilotConfig(e))return {enabled:false,attempt:null};
 return {enabled:true,attempt:view(await e.DB.prepare("SELECT * FROM support_square_invoice_attempts WHERE order_id=? AND channel=? AND request_id=?").bind(oid,channel,id).first())};
}
export async function createInvoiceAttempt(e:Env,channel:Channel,id:string,oid:string,b:any,now=new Date(),fetchImpl?:Fetch){
 const cfg=invoicePilotConfig(e);
 if(!cfg||b?.confirmed!==true)return {error:"Private Square sandbox required."};
 const o=await getOrder(e.DB,channel,id,oid),r=await stationeryRecipient(e.DB,channel,id);
 if(!o||o.status!=="confirmed"||o.checkout_started_at||o.square_order_id||o.amount_cents<=0||o.package_sequence>1&&!o.installment_due_at||!r?.email?.toLowerCase().endsWith("@example.test"))return {error:"Choose an eligible synthetic confirmed order."};
 const due=o.installment_due_at||b.due_at;
 if(typeof due!=="string"||!Number.isFinite(Date.parse(due))||new Date(due).toISOString()!==due||Date.parse(due)<=now.getTime()||Date.parse(due)>now.getTime()+90*86400000||o.start_at&&Date.parse(due)>=Date.parse(o.start_at)||typeof b.customer_id!=="string"||!/^[A-Za-z0-9:_-]{1,100}$/.test(b.customer_id))return {error:"Enter a valid sandbox customer ID and agreed deadline."};
 const at=now.toISOString(),dueDate=day(new Date(due));
 const q=await e.DB.prepare("INSERT OR IGNORE INTO support_square_invoice_attempts(order_id,channel,request_id,customer_id,recipient,location_id,amount_cents,due_at,due_date,state,created_at,updated_at) SELECT id,channel,request_id,?,?,?,?,?,?,'creating',?,? FROM support_service_orders WHERE id=? AND channel=? AND request_id=? AND status='confirmed' AND checkout_started_at IS NULL AND square_order_id IS NULL AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=support_service_orders.id) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=support_service_orders.id AND c.status='pending')").bind(b.customer_id,r.email,cfg.locationId,o.amount_cents,due,dueDate,at,at,oid,channel,id).run();
 if(!q.meta?.changes)return {error:"Existing invoice, cancellation or unresolved attempt. Review the record; do not create another."};
 try{
  const result=await prepareSandboxInvoice(e,{orderId:oid,customerId:b.customer_id,amountCents:o.amount_cents,dueDate,locationId:cfg.locationId,email:r.email},fetchImpl);
  await e.DB.prepare("UPDATE support_square_invoice_attempts SET state='draft',square_order_id=?,invoice_id=?,updated_at=? WHERE order_id=? AND state='creating'").bind(result.squareOrderId,result.invoiceId,new Date().toISOString(),oid).run();
  return {ok:true,...await readInvoiceAttempt(e,channel,id,oid)};
 }catch{await e.DB.prepare("UPDATE support_square_invoice_attempts SET state='review',updated_at=? WHERE order_id=? AND state='creating'").bind(new Date().toISOString(),oid).run();return {error:"Invoice creation outcome requires review in Square; do not retry."};}
}
export async function publishInvoiceAttempt(e:Env,channel:Channel,id:string,oid:string,b:any,fetchImpl?:Fetch){
 const cfg=invoicePilotConfig(e);
 if(!cfg||b?.confirmed!==true)return {error:"Private Square sandbox required."};
 const row=await e.DB.prepare("SELECT * FROM support_square_invoice_attempts WHERE order_id=? AND channel=? AND request_id=?").bind(oid,channel,id).first<any>();
 const r=await stationeryRecipient(e.DB,channel,id);
 if(!row||row.state!=="draft"||row.recipient!==r?.email||row.location_id!==cfg.locationId)return {error:"Draft or recipient changed. Reconcile in Square."};
 const q=await e.DB.prepare("UPDATE support_square_invoice_attempts SET state='publishing',updated_at=? WHERE order_id=? AND state='draft' AND EXISTS(SELECT 1 FROM support_service_orders o WHERE o.id=? AND o.channel=? AND o.request_id=? AND o.status='confirmed' AND o.amount_cents=? AND o.checkout_started_at IS NULL AND o.square_order_id IS NULL) AND NOT EXISTS(SELECT 1 FROM support_manual_invoices i WHERE i.order_id=?) AND NOT EXISTS(SELECT 1 FROM support_cancellation_requests c WHERE c.order_id=? AND c.status='pending')").bind(new Date().toISOString(),oid,oid,channel,id,row.amount_cents,oid,oid).run();
 if(!q.meta?.changes)return {error:"Order changed or publication already attempted."};
 try{
  const result=await publishSandboxInvoice(e,{orderId:oid,customerId:row.customer_id,amountCents:row.amount_cents,dueDate:row.due_date,locationId:row.location_id,email:row.recipient},{invoiceId:row.invoice_id,squareOrderId:row.square_order_id},fetchImpl);
  await e.DB.prepare("UPDATE support_square_invoice_attempts SET state='published',payment_url=?,updated_at=? WHERE order_id=? AND state='publishing'").bind(result.url,new Date().toISOString(),oid).run();
  return {ok:true,...await readInvoiceAttempt(e,channel,id,oid)};
 }catch{await e.DB.prepare("UPDATE support_square_invoice_attempts SET state='review',updated_at=? WHERE order_id=? AND state='publishing'").bind(new Date().toISOString(),oid).run();return {error:"Publication outcome requires review in Square; do not retry."};}
}
