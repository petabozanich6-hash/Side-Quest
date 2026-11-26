import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {previewClubInvoice} from "./clubSquareInvoicePreparation";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
const retryable=(v:string|null,now:Date)=>!!v&&Number.isFinite(Date.parse(v))&&now.getTime()>=Date.parse(v)&&now.getTime()-Date.parse(v)<15*60000;
const normalize=(v:unknown)=>String(v??"").trim().toLowerCase();
const read=(e:Env,kind:string,id:string)=>e.DB.prepare("SELECT * FROM support_club_square_intents WHERE kind=? AND obligation_id=?").bind(kind,id).first<any>();
export async function clubInvoiceWorkspace(e:Env,kind:string,id:string){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id))return null;
 const i=await read(e,kind,id);if(!i)return null;
 return {state:i.state,fingerprint:i.fingerprint,amount_cents:i.amount_cents,due_at:i.due_at,provider_order_id:i.provider_order_id,provider_invoice_id:i.provider_invoice_id,provider_invoice_version:i.provider_invoice_version,publish_approved_version:i.publish_approved_version,provider_issued_at:i.provider_issued_at};
}
async function fresh(e:Env,i:any,fetchImpl:Fetch|undefined,now:Date){
 const p=await previewClubInvoice(e,i.kind,i.obligation_id,{reviewed:true,customer_id:i.customer_id},fetchImpl,now);
 if("error" in p||p.fingerprint!==i.fingerprint||JSON.stringify({snapshot:p.snapshot,order:p.provider_order,invoice:p.provider_invoice})!==i.snapshot_json)return null;
 return p;
}
function orderMatches(o:any,i:any){return idOk(o?.id)&&o.reference_id===i.order_key&&o.location_id===i.location_id&&o.customer_id===i.customer_id&&o.state==="OPEN"&&money(o.total_money,i.amount_cents);}
async function review(e:Env,i:any,now:Date){await e.DB.prepare("UPDATE support_club_square_intents SET state='review',updated_at=? WHERE kind=? AND obligation_id=? AND fingerprint=? AND state=?").bind(now.toISOString(),i.kind,i.obligation_id,i.fingerprint,i.state).run();}
async function claim(e:Env,i:any,from:string,to:string,column:"order_attempted_at"|"invoice_attempted_at",now:Date){
 const at=now.toISOString();
 await e.DB.prepare("UPDATE support_club_square_intents SET state=?, "+column+"=?,updated_at=? WHERE kind=? AND obligation_id=? AND fingerprint=? AND state=? AND "+column+" IS NULL AND EXISTS(SELECT 1 FROM support_club_payment_obligations o WHERE o.kind=support_club_square_intents.kind AND o.obligation_id=support_club_square_intents.obligation_id AND o.status='awaiting_invoice' AND o.amount_cents=support_club_square_intents.amount_cents AND o.due_at=support_club_square_intents.due_at AND julianday(o.due_at)>julianday(?))").bind(to,at,at,i.kind,i.obligation_id,i.fingerprint,from,at).run();
 return read(e,i.kind,i.obligation_id);
}
// Separate Club obligations never write to tutoring orders, grant access, or publish invoices.
export async function createClubSquareOrder(e:Env,kind:string,id:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id)||b?.confirmed!==true||typeof b.fingerprint!=="string")return {error:"Approve the saved sandbox preparation."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 let i=await read(e,kind,id);
 if(!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId)return {error:"Preparation changed."};
 if(i.state==="order_created"&&idOk(i.provider_order_id))return {order_created:true,provider_order_id:i.provider_order_id};
 if(!["prepared","order_pending"].includes(i.state)||i.state==="order_pending"&&!retryable(i.order_attempted_at,now))return {error:"Existing attempt requires reconciliation."};
 if(!await fresh(e,i,fetchImpl,now))return {error:"Current reservation no longer matches the reviewed preparation."};
 const original=i;
 if(i.state==="prepared")i=await claim(e,i,"prepared","order_pending","order_attempted_at",now);
 if(!i||i.fingerprint!==original.fingerprint||i.order_key!==original.order_key)return {error:"Preparation changed."};
 if(i.state==="order_created"&&idOk(i.provider_order_id))return {order_created:true,provider_order_id:i.provider_order_id};
 if(i.state!=="order_pending"||i.provider_order_id||!retryable(i.order_attempted_at,now)||!idOk(i.order_key))return {error:"No safe pending order attempt."};
 const p=await fresh(e,i,fetchImpl,now);if(!p)return {error:"Reservation changed before provider submission."};
 let order:any;try{order=(await squareCall(cfg,"POST","orders",{idempotency_key:i.order_key,order:{...p.provider_order,reference_id:i.order_key,state:"OPEN"}},fetchImpl)).order;}catch{return {error:"Order response uncertain. Retry the same saved operation within 15 minutes; otherwise reconcile.",pending:true};}
 if(!orderMatches(order,i)){await review(e,i,now);return {error:"Unexpected Square order; reconciliation required."};}
 try{await e.DB.prepare("UPDATE support_club_square_intents SET state='order_created',provider_order_id=?,updated_at=? WHERE kind=? AND obligation_id=? AND state='order_pending' AND fingerprint=? AND order_key=? AND provider_order_id IS NULL").bind(order.id,now.toISOString(),kind,id,i.fingerprint,i.order_key).run();}catch{return {error:"Order storage uncertain; reconcile the existing operation.",pending:true};}
 const saved=await read(e,kind,id);
 return saved?.state==="order_created"&&saved.provider_order_id===order.id?{order_created:true,provider_order_id:order.id}:{error:"Order reconciliation required."};
}
export async function createClubSquareDraft(e:Env,kind:string,id:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id)||b?.confirmed!==true||typeof b.fingerprint!=="string")return {error:"Approve the saved sandbox preparation."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 let i=await read(e,kind,id);
 if(!i||i.fingerprint!==b.fingerprint||i.location_id!==cfg.locationId||!idOk(i.provider_order_id))return {error:"Order preparation changed."};
 if(i.state==="draft_created"&&idOk(i.provider_invoice_id)&&Number.isSafeInteger(i.provider_invoice_version))return {draft_created:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,published:false};
 if(!["order_created","invoice_pending"].includes(i.state)||i.state==="invoice_pending"&&!retryable(i.invoice_attempted_at,now))return {error:"Existing draft attempt requires reconciliation."};
 if(!await fresh(e,i,fetchImpl,now))return {error:"Reservation changed before draft preparation."};
 let remote:any;try{remote=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(i.provider_order_id),undefined,fetchImpl)).order;}catch{return {error:"Unable to verify the saved Square order."};}
 if(!orderMatches(remote,i)||remote.id!==i.provider_order_id){await review(e,i,now);return {error:"Square order changed; reconcile before continuing."};}
 const original=i;
 if(i.state==="order_created")i=await claim(e,i,"order_created","invoice_pending","invoice_attempted_at",now);
 if(!i||i.fingerprint!==original.fingerprint||i.invoice_key!==original.invoice_key||i.provider_order_id!==original.provider_order_id)return {error:"Preparation changed."};
 if(i.state==="draft_created"&&idOk(i.provider_invoice_id)&&Number.isSafeInteger(i.provider_invoice_version))return {draft_created:true,provider_invoice_id:i.provider_invoice_id,version:i.provider_invoice_version,published:false};
 if(i.state!=="invoice_pending"||i.provider_invoice_id||!retryable(i.invoice_attempted_at,now)||!idOk(i.invoice_key))return {error:"No safe pending draft attempt."};
 const p=await fresh(e,i,fetchImpl,now);if(!p)return {error:"Reservation changed before provider submission."};
 let invoice:any;try{invoice=(await squareCall(cfg,"POST","invoices",{idempotency_key:i.invoice_key,invoice:{...p.provider_invoice,order_id:i.provider_order_id}},fetchImpl)).invoice;}catch{return {error:"Draft response uncertain. Retry the same saved operation within 15 minutes; otherwise reconcile.",pending:true};}
 const r=invoice?.payment_requests;
 if(!idOk(invoice?.id)||!Number.isSafeInteger(invoice.version)||invoice.version<0||invoice.status!=="DRAFT"||invoice.location_id!==i.location_id||invoice.order_id!==i.provider_order_id||invoice.primary_recipient?.customer_id!==i.customer_id||normalize(invoice.primary_recipient?.email_address)!==normalize(p.snapshot.recipient)||invoice.delivery_method!=="EMAIL"||invoice.subscription_id||invoice.public_url||!Array.isArray(r)||r.length!==1||r[0].request_type!=="BALANCE"||r[0].due_date!==p.snapshot.due_date||r[0].automatic_payment_source!=="NONE"||r[0].card_id||r[0].bank_account_id||r[0].tipping_enabled===true||!money(r[0].computed_amount_money,i.amount_cents)||!money(r[0].total_completed_amount_money,0)){await review(e,i,now);return {error:"Unexpected Square draft; reconcile before publication."};}
 try{await e.DB.prepare("UPDATE support_club_square_intents SET state='draft_created',provider_invoice_id=?,provider_invoice_version=?,updated_at=? WHERE kind=? AND obligation_id=? AND state='invoice_pending' AND fingerprint=? AND invoice_key=? AND provider_invoice_id IS NULL").bind(invoice.id,invoice.version,now.toISOString(),kind,id,i.fingerprint,i.invoice_key).run();}catch{return {error:"Draft storage uncertain; reconcile the existing operation.",pending:true};}
 const saved=await read(e,kind,id);
 return saved?.state==="draft_created"&&saved.provider_invoice_id===invoice.id&&saved.provider_invoice_version===invoice.version?{draft_created:true,provider_invoice_id:invoice.id,version:invoice.version,published:false}:{error:"Draft reconciliation required."};
}
