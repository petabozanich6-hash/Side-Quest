import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {readAdultInvoice,inspectAdultSquareInvoice,adultFinancialHold} from "./adultSquareInvoicePublication";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
async function hold(e:Env,id:string,reason:string,now:Date){await e.DB.prepare("INSERT OR IGNORE INTO support_academy_adult_financial_holds(obligation_id,reason,created_at) VALUES(?,?,?)").bind(id,reason,now.toISOString()).run();}
export async function verifyAdultSquarePayment(e:Env,id:string,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!idOk(id))return {error:"Private sandbox payment verification unavailable."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const i=await readAdultInvoice(e,id);
 if(!i||!i.issued_at||i.state!=="draft_created"||i.obligation_status!=="awaiting_invoice"||i.location_id!==cfg.locationId||i.published_invoice_id!==i.provider_invoice_id)return {status:"review",verified:false};
 if(await adultFinancialHold(e,id))return {status:"review",verified:false};
 const proof=await e.DB.prepare("SELECT payment_id FROM support_academy_adult_settlements WHERE obligation_id=?").bind(id).first();
 const check=await inspectAdultSquareInvoice(e,i,fetchImpl);
 if(!check)return {status:"retry",verified:false};
 if(["CANCELED","REFUNDED","PARTIALLY_REFUNDED"].includes(check.status)){await hold(e,id,check.status==="CANCELED"?"provider_cancellation":"refund",now);return {status:"review",verified:false};}
 if(check.status==="UNPAID"&&check.completed===0&&check.issued&&check.version===i.issued_version&&check.link===i.public_url&&!proof)return {status:"unpaid",verified:false};
 if(check.status!=="PAID"||!check.settings||check.completed!==i.amount_cents||check.version<i.issued_version)return {status:"review",verified:false};
 const order=check.order;
 if(!["OPEN","COMPLETED"].includes(order.state)||!Array.isArray(order.tenders)||order.tenders.length!==1||!money(order.tenders[0].amount_money,i.amount_cents)||!idOk(order.tenders[0].payment_id))return {status:"review",verified:false};
 let p:any;try{p=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(order.tenders[0].payment_id),undefined,fetchImpl)).payment;}catch{return {status:"retry",verified:false};}
 const captured=Date.parse(p?.card_details?.card_payment_timeline?.captured_at||""),deadline=Date.parse(i.due_at),attempt=Date.parse(i.attempted_at);
 if(p?.id!==order.tenders[0].payment_id||p.order_id!==i.provider_order_id||p.location_id!==i.location_id||p.customer_id!==i.customer_id||p.status!=="COMPLETED"||p.source_type!=="CARD"||p.card_details?.status!=="CAPTURED"||!money(p.amount_money,i.amount_cents)||!money(p.total_money,i.amount_cents)||(p.refunded_money!=null&&!money(p.refunded_money,0))||(p.refund_ids!=null&&(!Array.isArray(p.refund_ids)||p.refund_ids.length>0))||(p.tip_money!=null&&!money(p.tip_money,0))||p.risk_evaluation?.risk_level==="HIGH"||![captured,deadline,attempt].every(Number.isFinite)||captured<attempt||captured>deadline||captured>now.getTime()){if(proof)await hold(e,id,"payment_changed",now);return {status:"review",verified:false};}
 try{await e.DB.prepare("INSERT INTO support_academy_adult_settlements(obligation_id,payment_id,invoice_id,amount_cents,captured_at,verified_at) VALUES(?,?,?,?,?,?) ON CONFLICT DO NOTHING").bind(id,p.id,i.provider_invoice_id,i.amount_cents,new Date(captured).toISOString(),now.toISOString()).run();}catch{if(!proof)return {status:"review",verified:false};}
 const saved=await e.DB.prepare("SELECT payment_id FROM support_academy_adult_settlements WHERE obligation_id=?").bind(id).first<{payment_id:string}>();
 const verified=saved?.payment_id===p.id&&!await adultFinancialHold(e,id);
 return {status:verified?"verified":"review",verified};
}
