import type {AuthUser,Env} from "./types";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {academyPrice,ACADEMY_PRICE_VERSION} from "./writersAcademyPricing";
import {ADULT_STUDIO} from "./writersAcademy";
export const ADULT_TERMS_VERSION="adult-studio-reservation-v1";
export const ADULT_TERMS="I am aged 18 or over and booking for myself. I have reviewed the dates and payment arrangement. My reservation is provisional until verified payment. Sharing writing is optional; I will respect other participants' privacy and intellectual property, and will not record or redistribute their work without permission. No automatic renewal, cancellation fee or certificate charge applies. Contact Side-Quest about illness, changes, cancellations or refunds. Consumer rights are unaffected. This is a creative workshop, not a qualification or promise of publication.";
const validId=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(v);
export async function adultPilotActor(e:Env,a:AuthUser){
 if(!unifiedPortalPilot(e)||!e.SUPPORT_UNIFIED_TEST_EMAIL)return false;
 const identity=await verifiedPortalIdentity(e.DB,a);
 return !!identity&&identity.email.trim().toLowerCase()===e.SUPPORT_UNIFIED_TEST_EMAIL.trim().toLowerCase();
}
export async function setAdultPilotRound(db:D1Database,owner:string,id:string,b:any,now=new Date()){
 if(!validId(id)||b?.confirmed!==true||typeof b.enabled!=="boolean")return false;
 const r=await db.prepare(`INSERT INTO support_academy_adult_pilot_rounds(round_id,enabled,approved_by,updated_at)
 SELECT r.id,?,?,? FROM support_english_rounds r WHERE r.id=? AND r.curriculum_id=? AND r.published=0 AND r.price_version=? AND r.session_count=6 AND r.price_per_session_cents=4500 AND r.upfront_cents=24000
 AND (?=0 OR (SELECT COUNT(*) FROM support_english_round_classes x JOIN support_english_classes c ON c.id=x.class_id WHERE x.round_id=r.id AND julianday(c.start_at)>julianday(?)+1 AND julianday(c.end_at)-julianday(c.start_at) BETWEEN 89.99/1440 AND 90.01/1440)=6)
 ON CONFLICT(round_id) DO UPDATE SET enabled=excluded.enabled,approved_by=excluded.approved_by,updated_at=excluded.updated_at`).bind(b.enabled?1:0,owner,now.toISOString(),id,ADULT_STUDIO.id,ACADEMY_PRICE_VERSION,b.enabled?1:0,now.toISOString()).run();
 return !!r.meta?.changes;
}
export async function adultPilotRounds(db:D1Database,now=new Date()){
 const rows=(await db.prepare(`SELECT r.id,r.title,x.sequence,c.id class_id,c.topic,c.start_at,c.end_at,
 8-(SELECT COUNT(*) FROM support_academy_adult_seats s WHERE s.class_id=c.id AND s.status<>'cancelled') remaining
 FROM support_academy_adult_pilot_rounds a JOIN support_english_rounds r ON r.id=a.round_id
 JOIN support_english_round_classes x ON x.round_id=r.id JOIN support_english_classes c ON c.id=x.class_id
 WHERE a.enabled=1 AND r.curriculum_id=? AND r.published=0 AND r.price_version=? AND r.session_count=6 AND r.price_per_session_cents=4500 AND r.upfront_cents=24000
 ORDER BY c.start_at,x.sequence`).bind(ADULT_STUDIO.id,ACADEMY_PRICE_VERSION).all<any>()).results||[];
 const map=new Map<string,any>();
 for(const r of rows){if(!map.has(r.id))map.set(r.id,{id:r.id,title:r.title,classes:[]});map.get(r.id).classes.push({id:r.class_id,sequence:r.sequence,topic:r.topic,start_at:r.start_at,end_at:r.end_at,remaining:r.remaining,available:r.remaining>0&&Date.parse(r.start_at)>now.getTime()+86400000});}
 return [...map.values()].map(r=>({...r,full_round_available:r.classes.length===6&&r.classes.every((c:any)=>c.available)})).filter(r=>r.classes.some((c:any)=>c.available));
}
export async function reserveAdultStudio(db:D1Database,a:AuthUser,b:any,now=new Date()){
 const identity=await verifiedPortalIdentity(db,a);
 const participant=identity?await db.prepare("SELECT display_name FROM support_academy_adult_participants WHERE user_id=? AND family_id=?").bind(a.id,a.family_id).first():null;
 const q=academyPrice(ADULT_STUDIO.id,b?.payment_mode);
 if(!participant||!q||!validId(b?.round_id)||!validId(b?.request_key)||b?.terms_version!==ADULT_TERMS_VERSION||b?.confirmed!==true||!["pdf","post","both"].includes(b?.certificate_delivery)||b.expected_total_cents!==q.total_cents||b.learner_id!==undefined||b.user_id!==undefined||b.family_id!==undefined||(q.payment_mode==="single"?!validId(b.class_id):b.class_id!=null))return {error:"Choose your own adult profile, current price, dates and participation terms."};
 const digest=JSON.stringify([b.round_id,b.class_id??null,q.payment_mode,q.total_cents,b.certificate_delivery,ADULT_TERMS_VERSION]);
 const find=()=>db.prepare("SELECT id,payload_hash FROM support_academy_adult_bookings WHERE user_id=? AND family_id=? AND request_key=?").bind(a.id,a.family_id,b.request_key).first<{id:string;payload_hash:string}>();
 const prior=await find();if(prior)return prior.payload_hash===digest?{id:prior.id,created:false}:{error:"This reservation key has already been used."};
 const round=(await adultPilotRounds(db,now)).find(r=>r.id===b.round_id);
 const classes=round?.classes.filter((c:any)=>q.payment_mode==="single"?c.id===b.class_id:true)||[];
 if(classes.length!==q.session_count||classes.some((c:any)=>!c.available))return {error:"The selected workshop or round is no longer available."};
 const id=crypto.randomUUID(),at=now.toISOString(),due=(c:any)=>new Date(Date.parse(c.start_at)-86400000).toISOString();
 const snapshot=JSON.stringify({terms:ADULT_TERMS,quote:q,classes:classes.map((c:any)=>({id:c.id,sequence:c.sequence,topic:c.topic,start_at:c.start_at,end_at:c.end_at})),certificate_delivery:b.certificate_delivery});
 const statements=[db.prepare("INSERT INTO support_academy_adult_bookings(id,user_id,family_id,round_id,single_class_id,request_key,payload_hash,payment_mode,total_cents,terms_version,terms_snapshot,certificate_delivery,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,a.id,a.family_id,b.round_id,b.class_id??null,b.request_key,digest,q.payment_mode,q.total_cents,ADULT_TERMS_VERSION,snapshot,b.certificate_delivery,at)];
 for(const c of classes)statements.push(db.prepare("INSERT INTO support_academy_adult_seats(id,booking_id,class_id,user_id,due_at) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),id,c.id,a.id,due(c)));
 for(const o of q.obligations){const c=o.sequence===0?classes[0]:classes.find((c:any)=>c.sequence===o.sequence);if(!c)return {error:"Invalid workshop sequence."};statements.push(db.prepare("INSERT INTO support_academy_adult_obligations(id,booking_id,sequence,amount_cents,expected_seats,due_at) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(),id,o.sequence,o.amount_cents,o.expected_seats,due(c)));}
 try{await db.batch(statements);return {id,created:true};}catch{const retry=await find();if(retry?.payload_hash===digest)return {id:retry.id,created:false};return {error:"The workshop is full, already reserved, or unavailable. No partial reservation was made."};}
}
export async function adultReservations(db:D1Database,a:AuthUser){
 if(!await verifiedPortalIdentity(db,a))return [];
 return (await db.prepare("SELECT b.id,b.payment_mode,b.total_cents,b.certificate_delivery,b.created_at,r.title,(SELECT COUNT(*) FROM support_academy_adult_seats s WHERE s.booking_id=b.id AND s.status='provisional') provisional_places FROM support_academy_adult_bookings b JOIN support_english_rounds r ON r.id=b.round_id WHERE b.user_id=? AND b.family_id=? ORDER BY b.created_at DESC LIMIT 100").bind(a.id,a.family_id).all()).results||[];
}
