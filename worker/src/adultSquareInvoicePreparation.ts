import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {ADULT_TERMS,ADULT_TERMS_VERSION} from "./adultStudioReservations";
import {validateAcademyPrice,academyObligationMatches} from "./writersAcademyPricing";
import {ADULT_STUDIO} from "./writersAcademy";
export const adultInvoiceId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const normalize=(v:unknown)=>String(v??"").trim().toLowerCase();
const date=(v:string)=>{const p=Object.fromEntries(new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(v)).map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day;};
const scope=`SELECT o.id obligation_id,o.booking_id,o.sequence,o.amount_cents,o.expected_seats,o.due_at,o.status,b.payment_mode,b.total_cents,b.terms_version,b.terms_snapshot,b.user_id,b.family_id,b.certificate_delivery,b.round_id,u.email recipient,
 (SELECT json_group_array(json_object('seat_id',z.id,'class_id',z.class_id,'sequence',z.sequence,'start_at',z.start_at,'end_at',z.end_at,'status',z.status,'due_at',z.due_at)) FROM
 (SELECT s.*,x.sequence,c.start_at,c.end_at FROM support_academy_adult_seats s JOIN support_english_round_classes x ON x.class_id=s.class_id AND x.round_id=b.round_id JOIN support_english_classes c ON c.id=s.class_id WHERE s.booking_id=b.id AND s.user_id=b.user_id AND (o.sequence=0 OR x.sequence=o.sequence) ORDER BY x.sequence) z) seats_json
 FROM support_academy_adult_obligations o JOIN support_academy_adult_bookings b ON b.id=o.booking_id
 JOIN support_academy_adult_participants p ON p.user_id=b.user_id AND p.family_id=b.family_id
 JOIN users u ON u.id=b.user_id AND u.family_id=b.family_id
 JOIN support_english_rounds r ON r.id=b.round_id AND r.curriculum_id='english-author-studio-adult-v1' AND r.published=0 AND r.price_version='academy-launch-v1' AND r.session_count=6 AND r.price_per_session_cents=4500 AND r.upfront_cents=24000
 WHERE u.email_verified_at IS NOT NULL AND u.email_verified_at<>'' AND NOT EXISTS(SELECT 1 FROM family_admin_state a WHERE a.family_id=b.family_id AND a.status<>'active')`;
async function eligible(e:Env,id:string,now:Date){
 const row=await e.DB.prepare(scope+" AND o.id=? AND o.status='awaiting_invoice' AND julianday(o.due_at)>julianday(?)").bind(id,now.toISOString()).first<any>();
 if(!row||normalize(row.recipient)!==normalize(e.SUPPORT_UNIFIED_TEST_EMAIL))return null;
 try{
  const terms=JSON.parse(row.terms_snapshot),seats=JSON.parse(row.seats_json),q=validateAcademyPrice(terms.quote);
  if(row.terms_version!==ADULT_TERMS_VERSION||terms.terms!==ADULT_TERMS||!q||q.programme_id!==ADULT_STUDIO.id||q.audience!=="adult"||q.payment_mode!==row.payment_mode||q.total_cents!==row.total_cents||terms.certificate_delivery!==row.certificate_delivery||!academyObligationMatches(q,row.sequence,row.amount_cents,row.expected_seats)||!Array.isArray(terms.classes)||terms.classes.length!==q.session_count||!Array.isArray(seats)||seats.length!==row.expected_seats)return null;
  if(seats.some((s:any)=>s.status!=="provisional"||Date.parse(s.start_at)<=now.getTime()||Date.parse(s.end_at)-Date.parse(s.start_at)!==90*60000||Date.parse(s.due_at)!==Date.parse(s.start_at)-86400000||!terms.classes.some((c:any)=>c.id===s.class_id&&c.sequence===s.sequence&&c.start_at===s.start_at&&c.end_at===s.end_at))||row.due_at!==seats[0].due_at)return null;
  return {row,seats};
 }catch{return null;}
}
export async function previewAdultInvoice(e:Env,id:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!adultInvoiceId(id)||b?.reviewed!==true||!adultInvoiceId(b.customer_id))return {error:"Private Square sandbox and reviewed test customer required."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 const v=await eligible(e,id,now);if(!v)return {error:"Adult reservation, dates, recipient or amount no longer match."};
 const {row,seats}=v;
 let customer:any;try{customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(b.customer_id),undefined,fetchImpl)).customer;}catch{return {error:"Sandbox customer lookup failed."};}
 if(customer?.id!==b.customer_id||normalize(customer.email_address)!==normalize(row.recipient))return {error:"Square customer must match the verified adult test account."};
 const description=row.payment_mode==="upfront"?"The Author's Studio - six-workshop round":row.payment_mode==="weekly"?"The Author's Studio - weekly workshop":"The Author's Studio - individual workshop";
 const snapshot={...row,due_date:date(row.due_at),customer_id:customer.id,location_id:cfg.locationId,description};
 const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(snapshot)))),x=>x.toString(16).padStart(2,"0")).join("");
 return {fingerprint,snapshot,seat_count:seats.length,provider_order:{location_id:cfg.locationId,customer_id:customer.id,line_items:[{name:description,quantity:"1",base_price_money:{amount:row.amount_cents,currency:"AUD"}}]},provider_invoice:{location_id:cfg.locationId,primary_recipient:{customer_id:customer.id},delivery_method:"EMAIL",payment_requests:[{request_type:"BALANCE",due_date:snapshot.due_date,automatic_payment_source:"NONE"}],accepted_payment_methods:{card:true,square_gift_card:false,bank_account:false,buy_now_pay_later:false,cash_app_pay:false}},created:false};
}
export async function prepareAdultInvoice(e:Env,id:string,owner:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!adultInvoiceId(owner)||b?.confirmed!==true||typeof b.fingerprint!=="string"||!/^[a-f0-9]{64}$/.test(b.fingerprint))return {error:"Approve the exact reviewed preview."};
 const p=await previewAdultInvoice(e,id,b,fetchImpl,now);
 if("error" in p||p.fingerprint!==b.fingerprint)return {error:"The reviewed preview changed."};
 const s=p.snapshot,at=now.toISOString(),json=JSON.stringify({snapshot:s,order:p.provider_order,invoice:p.provider_invoice});
 await e.DB.prepare("INSERT OR IGNORE INTO support_academy_adult_invoice_intents(obligation_id,fingerprint,snapshot_json,customer_id,location_id,amount_cents,due_at,order_key,invoice_key,approved_by,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? FROM ("+scope+") v WHERE obligation_id=? AND booking_id=? AND user_id=? AND family_id=? AND amount_cents=? AND expected_seats=? AND due_at=? AND status='awaiting_invoice' AND terms_snapshot=? AND seats_json=? AND recipient=? AND payment_mode=? AND total_cents=? AND sequence=? AND terms_version=? AND certificate_delivery=? AND round_id=? AND julianday(due_at)>julianday(?)").bind(id,p.fingerprint,json,s.customer_id,s.location_id,s.amount_cents,s.due_at,crypto.randomUUID(),crypto.randomUUID(),owner,at,at,id,s.booking_id,s.user_id,s.family_id,s.amount_cents,s.expected_seats,s.due_at,s.terms_snapshot,s.seats_json,s.recipient,s.payment_mode,s.total_cents,s.sequence,s.terms_version,s.certificate_delivery,s.round_id,at).run();
 const saved=await e.DB.prepare("SELECT fingerprint,state FROM support_academy_adult_invoice_intents WHERE obligation_id=?").bind(id).first<any>();
 return saved?.fingerprint===p.fingerprint&&saved.state==="prepared"?{prepared:true,state:"prepared",fingerprint:saved.fingerprint}:{error:"Existing or changed invoice preparation requires reconciliation."};
}
export async function listAdultInvoiceObligations(db:D1Database){
 return (await db.prepare(`SELECT o.id,o.sequence,o.amount_cents,o.expected_seats,o.due_at,o.status,b.payment_mode,p.display_name,r.title,i.state invoice_state,i.fingerprint
 FROM support_academy_adult_obligations o JOIN support_academy_adult_bookings b ON b.id=o.booking_id JOIN support_academy_adult_participants p ON p.user_id=b.user_id AND p.family_id=b.family_id JOIN support_english_rounds r ON r.id=b.round_id LEFT JOIN support_academy_adult_invoice_intents i ON i.obligation_id=o.id ORDER BY o.due_at,o.id LIMIT 200`).all()).results||[];
}
