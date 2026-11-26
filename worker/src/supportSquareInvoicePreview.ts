import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {getOrder,type Channel} from "./supportOrders";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const iso=(v:unknown):v is string=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v));
function sydneyDate(v:string){
 const p=Object.fromEntries(new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(v)).map(x=>[x.type,x.value]));
 return p.year+"-"+p.month+"-"+p.day;
}
export async function previewSupportInvoice(env:Env,channel:Channel,requestId:string,orderId:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(env))return {error:"Private Square sandbox pilot is not available."};
 if(b?.reviewed!==true||!idOk(b.customer_id)||!iso(b.due_at))return {error:"Review the exact Square customer and payment deadline."};
 const cfg=squareConfig(env);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const o=await getOrder(env.DB,channel,requestId,orderId),who=await supportInvoiceRecipient(env.DB,channel,requestId);
 if(!o||!who||who.email.trim().toLowerCase()!==String(env.SUPPORT_UNIFIED_TEST_EMAIL).trim().toLowerCase()||o.status!=="confirmed"||!Number.isSafeInteger(o.amount_cents)||o.amount_cents<=0||o.checkout_started_at||o.square_order_id||(o.package_sequence>1&&!o.installment_due_at))return {error:"This arrangement is not eligible for a sandbox invoice preview."};
 const due=b.due_at;
 if(o.installment_due_at&&due!==o.installment_due_at)return {error:"Use the agreed instalment deadline."};
 const diary=await env.DB.prepare("SELECT prep_minutes FROM support_tutor_diary WHERE order_id=?").bind(orderId).first<{prep_minutes:number}>();
 const until=Date.parse(due);
 if(until<=now.getTime()||until>now.getTime()+90*86400000||(o.start_at&&until+(diary?.prep_minutes||0)*60000>=Date.parse(o.start_at)))return {error:"Choose a future deadline within 90 days and before lesson preparation begins."};
 if(await env.DB.prepare("SELECT 1 FROM support_manual_invoices WHERE order_id=? UNION ALL SELECT 1 FROM support_cancellation_requests WHERE order_id=? AND status='pending' LIMIT 1").bind(orderId,orderId).first())return {error:"An existing invoice or cancellation request requires review first."};
 let customer:any;
 try{customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(b.customer_id),undefined,fetchImpl)).customer;}catch{return {error:"Square customer lookup failed. No invoice was created."};}
 if(!customer||customer.id!==b.customer_id||String(customer.email_address||"").trim().toLowerCase()!==who.email.trim().toLowerCase())return {error:"The selected sandbox customer does not match the verified parent."};
 // Keep learner names, goals, diagnoses and private notes out of Square. Use a generic service line.
 const description=o.installment_due_at?"Learning Support — session instalment":o.package_total>1?"Learning Support — "+o.package_total+"-session package":o.mode==="written"?"Learning Support — written service":"Learning Support — tutoring session";
 const dueDate=sydneyDate(due);
 const snapshot={channel,request_id:requestId,order_id:orderId,updated_at:o.updated_at,customer_id:customer.id,location_id:cfg.locationId,amount_cents:o.amount_cents,currency:"AUD",description,due_at:due,due_date:dueDate};
 const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(snapshot)));
 const fingerprint=Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,"0")).join("");
 // A preview only. The payload is generated server-side and returned to the owner, not submitted.
 return {...snapshot,recipient:who.email,fingerprint,provider_order:{location_id:cfg.locationId,customer_id:customer.id,line_items:[{name:description,quantity:"1",base_price_money:{amount:o.amount_cents,currency:"AUD"}}]},provider_invoice:{location_id:cfg.locationId,primary_recipient:{customer_id:customer.id},delivery_method:"EMAIL",payment_requests:[{request_type:"BALANCE",due_date:dueDate,automatic_payment_source:"NONE"}],accepted_payment_methods:{card:true,square_gift_card:false,bank_account:false,buy_now_pay_later:false,cash_app_pay:false}},created:false};
}
