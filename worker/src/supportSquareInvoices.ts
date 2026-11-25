import type {Env} from "./types";
import {squareCall,squareConfig,type Fetch} from "./square";
type Config=Extract<ReturnType<typeof squareConfig>,{ok:true}>;
type InvoiceInput={orderId:string;customerId:string;amountCents:number;dueDate:string;locationId:string;email:string};
const validId=(s:string)=>typeof s==="string"&&/^[A-Za-z0-9:_-]{1,100}$/.test(s);
const validMoney=(m:any,cents:number)=>m?.currency==="AUD"&&m?.amount===cents;
export function invoicePilotConfig(e:Partial<Env>){
 const cfg=squareConfig(e);
 return e.SUPPORT_SQUARE_INVOICES_TEST==="true"&&!!e.STAGING_KEY&&e.STAGING_PRIVATE==="true"&&cfg.ok&&!cfg.production?cfg:null;
}
async function key(value:string){
 const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
 return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,"0")).join("").slice(0,40);
}
export function validateInvoiceInput(v:InvoiceInput){
 if(!validId(v.orderId)||!validId(v.customerId)||!validId(v.locationId)||!Number.isSafeInteger(v.amountCents)||v.amountCents<1||v.amountCents>1000000||!(/^\d{4}-\d{2}-\d{2}$/).test(v.dueDate)||!Number.isFinite(Date.parse(v.dueDate))||new Date(v.dueDate).toISOString().slice(0,10)!==v.dueDate||typeof v.email!=="string"||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(v.email))throw Error("Invalid invoice details.");
}
export function orderPayload(v:InvoiceInput,idempotency:string){
 validateInvoiceInput(v);
 return {idempotency_key:idempotency,order:{location_id:v.locationId,customer_id:v.customerId,reference_id:v.orderId.slice(0,40),line_items:[{name:"Side-Quest Learning Support",quantity:"1",base_price_money:{amount:v.amountCents,currency:"AUD"}}]}};
}
export function invoicePayload(v:InvoiceInput,squareOrderId:string,idempotency:string){
 validateInvoiceInput(v);if(!validId(squareOrderId))throw Error("Unexpected Square order.");
 return {idempotency_key:idempotency,invoice:{location_id:v.locationId,order_id:squareOrderId,primary_recipient:{customer_id:v.customerId},title:"Side-Quest Learning Support",delivery_method:"SHARE_MANUALLY",payment_requests:[{request_type:"BALANCE",due_date:v.dueDate,automatic_payment_source:"NONE"}],accepted_payment_methods:{card:true},store_payment_method_enabled:false}};
}
export function invoiceMatches(invoice:any,v:InvoiceInput,squareOrderId:string){
 const p=invoice?.payment_requests;
 return !!(validId(invoice?.id)&&invoice.location_id===v.locationId&&invoice.order_id===squareOrderId&&invoice.primary_recipient?.customer_id===v.customerId&&String(invoice.primary_recipient?.email_address||"").toLowerCase()===v.email.toLowerCase()&&invoice.delivery_method==="SHARE_MANUALLY"&&Array.isArray(p)&&p.length===1&&p[0].request_type==="BALANCE"&&p[0].due_date===v.dueDate&&p[0].automatic_payment_source==="NONE"&&validMoney(p[0].computed_amount_money,v.amountCents));
}
export function sandboxInvoiceUrl(value:unknown){
 if(typeof value!=="string")return null;
 try{const u=new URL(value);return u.protocol==="https:"&&u.hostname==="squareupsandbox.com"&&!u.port&&!u.username&&!u.password&&u.pathname.startsWith("/pay-invoice/")?u.href:null;}catch{return null;}
}
// Deliberately sandbox only. No email, booking update, webhook mutation or live payment.
// Caller must persist the input/IDs and handle reconciliation before exposing this to real users.
export async function prepareSandboxInvoice(e:Partial<Env>,v:InvoiceInput,fetchImpl?:Fetch){
 const cfg=invoicePilotConfig(e);
 if(!cfg||v.locationId!==cfg.locationId)throw Error("Isolated Square sandbox is required.");
 validateInvoiceInput(v);
 if(!v.email.toLowerCase().endsWith("@example.test"))throw Error("Use a synthetic parent address in the invoice pilot.");
 const customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(v.customerId),undefined,fetchImpl))?.customer;
 if(customer?.id!==v.customerId||String(customer.email_address||"").toLowerCase()!==v.email.toLowerCase())throw Error("Square customer does not match the selected test parent.");
 const order=(await squareCall(cfg,"POST","orders",orderPayload(v,await key("sq-support-order:"+v.orderId)),fetchImpl))?.order;
 if(!validId(order?.id)||order.location_id!==v.locationId||order.customer_id!==v.customerId||!validMoney(order.total_money,v.amountCents))throw Error("Square order did not match the quoted service.");
 const invoice=(await squareCall(cfg,"POST","invoices",invoicePayload(v,order.id,await key("sq-support-invoice:"+v.orderId)),fetchImpl))?.invoice;
 if(!invoiceMatches(invoice,v,order.id)||invoice.status!=="DRAFT"||!Number.isInteger(invoice.version))throw Error("Square invoice requires reconciliation.");
 return {invoiceId:invoice.id,version:invoice.version,squareOrderId:order.id,status:invoice.status};
}
export async function publishSandboxInvoice(e:Partial<Env>,v:InvoiceInput,ids:{invoiceId:string;squareOrderId:string},fetchImpl?:Fetch){
 const cfg=invoicePilotConfig(e);if(!cfg||v.locationId!==cfg.locationId||!v.email.toLowerCase().endsWith("@example.test"))throw Error("Isolated Square sandbox is required.");
 validateInvoiceInput(v);if(!validId(ids.invoiceId)||!validId(ids.squareOrderId))throw Error("Invalid invoice identifiers.");
 const path="invoices/"+encodeURIComponent(ids.invoiceId);
 const draft=(await squareCall(cfg,"GET",path,undefined,fetchImpl))?.invoice;
 if(draft?.id!==ids.invoiceId||!invoiceMatches(draft,v,ids.squareOrderId))throw Error("Invoice changed; review it in Square.");
 let invoice=draft;
 if(draft.status==="DRAFT"){
  if(!Number.isInteger(draft.version))throw Error("Invalid invoice version.");
  invoice=(await squareCall(cfg,"POST",path+"/publish",{version:draft.version,idempotency_key:await key("sq-support-publish:"+v.orderId)},fetchImpl))?.invoice;
 }
 const url=sandboxInvoiceUrl(invoice?.public_url);
 if(invoice?.id!==ids.invoiceId||!invoiceMatches(invoice,v,ids.squareOrderId)||invoice.status!=="UNPAID"||!url)throw Error("Invoice publication requires reconciliation.");
 return {invoiceId:invoice.id,status:invoice.status,url};
}

/** Read-only sandbox reconciliation. A provider status by itself is never proof of settlement. */
export async function inspectSandboxInvoice(e:Partial<Env>,v:InvoiceInput,ids:{invoiceId:string;squareOrderId:string},deadline:string,fetchImpl?:Fetch){
 const cfg=invoicePilotConfig(e);
 if(!cfg||v.locationId!==cfg.locationId||!v.email.toLowerCase().endsWith("@example.test"))throw Error("Isolated Square sandbox required.");
 validateInvoiceInput(v);
 if(!validId(ids.invoiceId)||!validId(ids.squareOrderId)||!Number.isFinite(Date.parse(deadline)))throw Error("Invalid reconciliation inputs.");
 const invoice=(await squareCall(cfg,"GET","invoices/"+encodeURIComponent(ids.invoiceId),undefined,fetchImpl))?.invoice;
 if(invoice?.id!==ids.invoiceId||!invoiceMatches(invoice,v,ids.squareOrderId))throw Error("Invoice details differ from the agreed record.");
 const order=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(ids.squareOrderId),undefined,fetchImpl))?.order;
 if(order?.id!==ids.squareOrderId||order.location_id!==v.locationId||!validMoney(order.total_money,v.amountCents))throw Error("Underlying order differs from the agreed record.");
 const review={state:"review" as const,reason:"Payment, cancellation or refund requires review."};
 if((order.refunds?.length||0)>0||(order.returns?.length||0)>0)return review;
 const tenders=order.tenders??[];
 if(!Array.isArray(tenders)||tenders.length>10)return review;
 const completed=invoice.payment_requests[0].total_completed_amount_money;
 if(invoice.status==="UNPAID"&&validMoney(completed,0)&&!tenders.length){
  const url=sandboxInvoiceUrl(invoice.public_url);
  return url?{state:"unpaid" as const,reason:"No completed payments recorded; do not cancel without a fresh provider check.",url}:review;
 }
 if(invoice.status==="CANCELED"&&validMoney(completed,0)&&!tenders.length)return {state:"cancelled_unpaid" as const,reason:"Provider reports cancelled with no recorded payments. Review before releasing."};
 if(invoice.status!=="PAID"||!validMoney(completed,v.amountCents)||!tenders.length)return review;
 const seen=new Set<string>();let total=0;let late=false;
 for(const t of tenders){
  const pid=t.payment_id;
  if(!validId(pid)||seen.has(pid))return review;
  seen.add(pid);
  const p=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(pid),undefined,fetchImpl))?.payment;
  if(p?.id!==pid||p.order_id!==ids.squareOrderId||p.location_id!==v.locationId||p.status!=="COMPLETED"||p.amount_money?.currency!=="AUD"||!Number.isSafeInteger(p.amount_money.amount)||p.amount_money.amount<=0||!validMoney(p.total_money,p.amount_money.amount)||!validMoney(p.refunded_money??{currency:"AUD",amount:0},0)||(p.refund_ids?.length||0)>0||!Number.isFinite(Date.parse(p.updated_at)))return review;
  total+=p.amount_money.amount;
  if(Date.parse(p.updated_at)>Date.parse(deadline))late=true;
 }
 if(total!==v.amountCents||late)return {state:"review" as const,reason:late?"Payment timestamp is after the agreed deadline; review with the parent.":"Completed payment total does not match the service."};
 return {state:"paid_verified" as const,reason:"Full matching completed payments verified in sandbox. No booking status changed."};
}
