import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {CLUB_BOOKING_VERSION,CLUB_SINGLE_VERSION,CLUB_ROUND_TERMS,CLUB_SINGLE_TERMS} from "./englishClubSelfService";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const kindOk=(v:unknown)=>v==="single"||v==="round";
const normalize=(v:unknown)=>String(v??"").trim().toLowerCase();
const sydneyDate=(v:string)=>{const p=Object.fromEntries(new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(v)).map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day;};
const scope=`SELECT o.*,u.email recipient,
 (SELECT json_group_array(json_object('seat_id',z.seat_id,'class_id',z.class_id,'start_at',z.start_at,'end_at',z.end_at,'status',z.status,'payment_due_at',z.payment_due_at)) FROM
 (SELECT s.* FROM support_club_obligation_seats s WHERE s.kind=o.kind AND s.obligation_id=o.obligation_id ORDER BY s.start_at,s.seat_id) z) seats_json
 FROM support_club_payment_obligations o
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id AND p.service='english-club'
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id
 JOIN support_guest_requests r ON r.id=p.request_id AND r.email=u.email
 JOIN support_portal_learners l ON l.id=p.learner_id AND l.family_id=p.family_id
 WHERE u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND r.status NOT IN ('closed','resolved')
 AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=p.family_id AND a.status<>'active')`;
async function eligible(e:Env,kind:string,id:string,now:Date){
 const row=await e.DB.prepare(scope+" AND o.kind=? AND o.obligation_id=? AND o.status='awaiting_invoice' AND julianday(o.due_at)>julianday(?)").bind(kind,id,now.toISOString()).first<any>();
 if(!row||normalize(row.recipient)!==normalize(e.SUPPORT_UNIFIED_TEST_EMAIL)||!Number.isSafeInteger(row.amount_cents)||row.amount_cents!==1500*row.expected_seats||row.expected_seats<1||row.expected_seats>12)return null;
 try{
  const seats=JSON.parse(row.seats_json),terms=JSON.parse(row.terms_snapshot);
  if(seats.length!==row.expected_seats||seats.some((s:any)=>s.status!=="reserved"||Date.parse(s.start_at)<=now.getTime()||Date.parse(s.payment_due_at)!==Date.parse(s.start_at)-86400000))return null;
  if(row.due_at!==seats[0].payment_due_at)return null;
  if(kind==="single"){
   if(row.terms_version!==CLUB_SINGLE_VERSION||terms.terms!==CLUB_SINGLE_TERMS||terms.amount_cents!==row.amount_cents||terms.class_id!==seats[0].class_id||terms.start_at!==seats[0].start_at||terms.end_at!==seats[0].end_at)return null;
  }else if(row.terms_version!==CLUB_BOOKING_VERSION||terms.terms!==CLUB_ROUND_TERMS||terms.payment_mode!==row.payment_mode||terms.price_per_session_cents!==1500||!Array.isArray(terms.classes)||terms.total_cents!==terms.classes.length*1500||seats.some((s:any)=>!terms.classes.some((c:any)=>c.id===s.class_id&&c.start_at===s.start_at&&c.end_at===s.end_at))||(row.payment_mode==="upfront"&&terms.total_cents!==row.amount_cents))return null;
  return {row,seats};
 }catch{return null;}
}
export async function listClubObligations(db:D1Database){
 const rows=(await db.prepare(`SELECT o.kind,o.obligation_id,o.request_id,o.amount_cents,o.due_at,o.status,o.payment_mode,o.expected_seats,l.label learner_label,r.parent_name,(SELECT MIN(s.start_at) FROM support_club_obligation_seats s WHERE s.kind=o.kind AND s.obligation_id=o.obligation_id) first_start_at,i.state invoice_state
 FROM support_club_payment_obligations o JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id JOIN support_portal_learners l ON l.id=p.learner_id AND l.family_id=p.family_id JOIN support_guest_requests r ON r.id=p.request_id LEFT JOIN support_club_square_intents i ON i.kind=o.kind AND i.obligation_id=o.obligation_id
 ORDER BY o.due_at,o.obligation_id LIMIT 201`).all<any>()).results||[];
 return {items:rows.slice(0,200),limited:rows.length>200};
}
export async function previewClubInvoice(e:Env,kind:string,id:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!kindOk(kind)||!idOk(id)||b?.reviewed!==true||!idOk(b.customer_id))return {error:"Private sandbox and explicit customer review required."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const v=await eligible(e,kind,id,now);if(!v)return {error:"The obligation, verified recipient, dates or reserved places are not eligible."};
 const {row,seats}=v;
 let customer:any;try{customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(b.customer_id),undefined,fetchImpl)).customer;}catch{return {error:"Sandbox customer lookup failed."};}
 if(customer?.id!==b.customer_id||normalize(customer.email_address)!==normalize(row.recipient))return {error:"The Square customer does not match the verified test parent."};
 const description=row.payment_mode==="upfront"?"English Club — "+row.expected_seats+"-workshop round":row.payment_mode==="weekly"?"English Club — weekly workshop":"English Club — individual workshop";
 const snapshot={kind,obligation_id:id,request_id:row.request_id,learner_id:row.learner_id,amount_cents:row.amount_cents,due_at:row.due_at,due_date:sydneyDate(row.due_at),payment_mode:row.payment_mode,terms_version:row.terms_version,terms_snapshot:row.terms_snapshot,seats_json:row.seats_json,recipient:row.recipient,customer_id:customer.id,location_id:cfg.locationId,description};
 const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(snapshot)))),x=>x.toString(16).padStart(2,"0")).join("");
 return {fingerprint,snapshot,seat_count:seats.length,provider_order:{location_id:cfg.locationId,customer_id:customer.id,line_items:[{name:description,quantity:"1",base_price_money:{amount:row.amount_cents,currency:"AUD"}}]},provider_invoice:{location_id:cfg.locationId,primary_recipient:{customer_id:customer.id},delivery_method:"EMAIL",payment_requests:[{request_type:"BALANCE",due_date:snapshot.due_date,automatic_payment_source:"NONE"}],accepted_payment_methods:{card:true,square_gift_card:false,bank_account:false,buy_now_pay_later:false,cash_app_pay:false}},created:false};
}
export async function prepareClubInvoice(e:Env,kind:string,id:string,owner:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!idOk(owner)||b?.confirmed!==true||typeof b.fingerprint!=="string"||!/^[a-f0-9]{64}$/.test(b.fingerprint))return {error:"Approve the exact reviewed preview."};
 const preview=await previewClubInvoice(e,kind,id,b,fetchImpl,now);
 if("error" in preview||preview.fingerprint!==b.fingerprint)return {error:"The preview or booking changed; review again."};
 const s=preview.snapshot;
 const json=JSON.stringify({snapshot:s,order:preview.provider_order,invoice:preview.provider_invoice});
 // Atomic compare of all mutable local inputs after the provider customer read.
 await e.DB.prepare("INSERT OR IGNORE INTO support_club_square_intents(kind,obligation_id,request_id,fingerprint,snapshot_json,customer_id,location_id,amount_cents,due_at,order_key,invoice_key,publish_key,approved_by,created_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? FROM ("+scope+") v WHERE kind=? AND obligation_id=? AND status='awaiting_invoice' AND request_id=? AND learner_id=? AND amount_cents=? AND due_at=? AND payment_mode=? AND terms_version=? AND terms_snapshot=? AND seats_json=? AND recipient=?").bind(kind,id,s.request_id,preview.fingerprint,json,s.customer_id,s.location_id,s.amount_cents,s.due_at,crypto.randomUUID(),crypto.randomUUID(),crypto.randomUUID(),owner,now.toISOString(),kind,id,s.request_id,s.learner_id,s.amount_cents,s.due_at,s.payment_mode,s.terms_version,s.terms_snapshot,s.seats_json,s.recipient).run();
 const saved=await e.DB.prepare("SELECT fingerprint,state FROM support_club_square_intents WHERE kind=? AND obligation_id=?").bind(kind,id).first<any>();
 return saved?.fingerprint===preview.fingerprint&&saved.state==="prepared"?{prepared:true,state:"prepared",fingerprint:saved.fingerprint,created:false}:{error:"An existing or changed invoice preparation requires reconciliation."};
}
