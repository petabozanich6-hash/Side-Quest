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
