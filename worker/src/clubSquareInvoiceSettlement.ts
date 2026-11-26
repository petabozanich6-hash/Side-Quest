import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {inspectClubSquareInvoice,clubInvoiceSeatMatch} from "./clubSquareInvoicePublication";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
const read=(e:Env,kind:string,id:string)=>e.DB.prepare("SELECT i.*,o.status obligation_status,o.expected_seats FROM support_club_square_intents i JOIN support_club_payment_obligations o ON o.kind=i.kind AND o.obligation_id=i.obligation_id AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at WHERE i.kind=? AND i.obligation_id=?").bind(kind,id).first<any>();
async function recordReview(e:Env,i:any,reason:string,now:Date){
 await e.DB.prepare("INSERT INTO support_club_square_reviews(kind,obligation_id,reason,updated_at) VALUES(?,?,?,?) ON CONFLICT(kind,obligation_id) DO UPDATE SET reason=CASE WHEN support_club_square_reviews.reason IN ('refund','dispute','provider_cancellation') THEN support_club_square_reviews.reason ELSE excluded.reason END,updated_at=excluded.updated_at").bind(i.kind,i.obligation_id,reason,now.toISOString()).run();
}
async function hardHold(e:Env,i:any,reason:"refund"|"dispute"|"provider_cancellation",now:Date){
 await e.DB.batch([
 e.DB.prepare("INSERT INTO support_club_square_reviews(kind,obligation_id,reason,updated_at) VALUES(?,?,?,?) ON CONFLICT(kind,obligation_id) DO UPDATE SET reason=CASE WHEN support_club_square_reviews.reason='dispute' THEN 'dispute' ELSE excluded.reason END,updated_at=excluded.updated_at").bind(i.kind,i.obligation_id,reason,now.toISOString()),
 e.DB.prepare("UPDATE support_club_square_intents SET state='review',updated_at=? WHERE kind=? AND obligation_id=? AND state IN ('issued','paid')").bind(now.toISOString(),i.kind,i.obligation_id)
 ]);
}
export async function verifyClubSquarePayment(e:Env,kind:string,id:string,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id))return {error:"Private sandbox payment verification unavailable."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const i=await read(e,kind,id);
 if(!i||i.location_id!==cfg.locationId||!idOk(i.provider_invoice_id)||!idOk(i.provider_order_id))return {error:"No matching Club invoice."};
 const proof=await e.DB.prepare("SELECT payment_id FROM support_club_square_settlements WHERE kind=? AND obligation_id=?").bind(kind,id).first();
 if(proof)return {status:i.state==="paid"&&i.obligation_status==="paid"?"verified":"review",verified:i.state==="paid"&&i.obligation_status==="paid"};
 if(i.state!=="issued"||i.obligation_status!=="issued")return {status:"review",verified:false};
 const review=async(reason="payment_uncertain")=>{await recordReview(e,i,reason,now);return {status:reason==="payment_retry"?"retry":"review",verified:false};};
 if(!await clubInvoiceSeatMatch(e,i))return review();
 const check=await inspectClubSquareInvoice(e,i,fetchImpl);
 if(!check)return review("payment_retry");
 if(check.status==="CANCELED"){await hardHold(e,i,"provider_cancellation",now);return {status:"review",verified:false};}
 if(["REFUNDED","PARTIALLY_REFUNDED"].includes(check.status)){await hardHold(e,i,"refund",now);return {status:"review",verified:false};}
 if(check.status==="UNPAID"&&check.completed===0&&check.issued&&check.version===i.provider_invoice_version&&check.link===i.provider_public_url)return {status:"unpaid",verified:false};
 if(check.status!=="PAID"||!check.settings||check.completed!==i.amount_cents||check.version<i.provider_invoice_version)return review();
 const order=check.order;
 if(!["OPEN","COMPLETED"].includes(order.state)||!Array.isArray(order.tenders)||order.tenders.length!==1||!money(order.tenders[0].amount_money,i.amount_cents)||!idOk(order.tenders[0].payment_id))return review();
 let p:any;try{p=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(order.tenders[0].payment_id),undefined,fetchImpl)).payment;}catch{return review("payment_retry");}
 const captured=Date.parse(p?.card_details?.card_payment_timeline?.captured_at||""),deadline=Date.parse(i.due_at),attempt=Date.parse(i.publish_attempted_at);
 if(p?.id!==order.tenders[0].payment_id||p.order_id!==i.provider_order_id||p.location_id!==i.location_id||p.customer_id!==i.customer_id||p.status!=="COMPLETED"||p.source_type!=="CARD"||p.card_details?.status!=="CAPTURED"||!money(p.amount_money,i.amount_cents)||!money(p.total_money,i.amount_cents)||(p.refunded_money!=null&&!money(p.refunded_money,0))||(p.refund_ids!=null&&(!Array.isArray(p.refund_ids)||p.refund_ids.length>0))||(p.tip_money!=null&&!money(p.tip_money,0))||p.risk_evaluation?.risk_level==="HIGH"||![captured,deadline,attempt].every(Number.isFinite)||captured<attempt||captured>deadline||captured>now.getTime())return review();
 // The database trigger checks the exact still-future seat mapping and financial holds atomically.
 try{await e.DB.prepare("INSERT INTO support_club_square_settlements(kind,obligation_id,payment_id,invoice_id,amount_cents,captured_at,verified_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT DO NOTHING").bind(kind,id,p.id,i.provider_invoice_id,i.amount_cents,new Date(captured).toISOString(),now.toISOString()).run();}catch{return review();}
 const saved=await e.DB.prepare("SELECT s.payment_id,i.state FROM support_club_square_settlements s JOIN support_club_square_intents i ON i.kind=s.kind AND i.obligation_id=s.obligation_id WHERE s.kind=? AND s.obligation_id=?").bind(kind,id).first<any>();
 return saved?.payment_id===p.id&&saved.state==="paid"?{status:"verified",verified:true}:review();
}
async function ready(e:Env){return supportInvoiceLookupAvailable(e)&&!!await e.DB.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_club_square_settlements'").first();}
export async function reconcileClubInvoiceEvent(e:Env,invoiceId:string|null,orderId:string|null,fetchImpl?:Fetch,now=new Date()):Promise<string|null>{
 if(!await ready(e)||!idOk(invoiceId)&&!idOk(orderId))return null;
 const row=await e.DB.prepare("SELECT kind,obligation_id FROM support_club_square_intents WHERE (? IS NOT NULL AND provider_invoice_id=?) OR (? IS NOT NULL AND provider_order_id=?) LIMIT 1").bind(invoiceId,invoiceId,orderId,orderId).first<any>();
 if(!row)return null;
 const result=await verifyClubSquarePayment(e,row.kind,row.obligation_id,fetchImpl,now);
 if(result.status==="retry")throw Error("Club payment verification temporarily unavailable");
 return result.verified?"club invoice payment verified":"club invoice payment pending or requires review";
}
export async function flagClubPaymentHold(e:Env,paymentId:unknown,reason:"refund"|"dispute",fetchImpl?:Fetch,now=new Date()):Promise<string|null>{
 if(!await ready(e)||!idOk(paymentId))return null;
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return null;
 let row=await e.DB.prepare("SELECT i.* FROM support_club_square_settlements s JOIN support_club_square_intents i ON i.kind=s.kind AND i.obligation_id=s.obligation_id WHERE s.payment_id=? AND i.location_id=?").bind(paymentId,cfg.locationId).first<any>();
 if(!row){const p=(await squareCall(cfg,"GET","payments/"+encodeURIComponent(paymentId),undefined,fetchImpl)).payment;if(p?.id!==paymentId||p.location_id!==cfg.locationId||!idOk(p.order_id))return null;
 row=await e.DB.prepare("SELECT * FROM support_club_square_intents WHERE provider_order_id=? AND location_id=?").bind(p.order_id,cfg.locationId).first<any>();}
 if(!row)return null;
 await hardHold(e,row,reason,now);return "club invoice "+reason+" requires review";
}
export async function flagClubInvoiceDispute(e:Env,id:unknown,fetchImpl?:Fetch,now=new Date()):Promise<string|null>{
 if(!await ready(e)||!idOk(id))return null;
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return null;
 const d=(await squareCall(cfg,"GET","disputes/"+encodeURIComponent(id),undefined,fetchImpl)).dispute;
 return d?.id===id&&d.location_id===cfg.locationId?flagClubPaymentHold(e,d.disputed_payment?.payment_id,"dispute",fetchImpl,now):null;
}
