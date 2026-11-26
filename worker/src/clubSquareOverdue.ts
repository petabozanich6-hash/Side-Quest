import type {Env} from "./types";
import type {Fetch} from "./square";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";
import {inspectClubSquareInvoice} from "./clubSquareInvoicePublication";
import {verifyClubSquarePayment} from "./clubSquareInvoiceSettlement";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
const read=(e:Env,kind:string,id:string)=>e.DB.prepare("SELECT o.*,i.state invoice_state,i.fingerprint,i.provider_invoice_id,i.provider_order_id,i.provider_invoice_version,i.provider_issued_at,i.order_attempted_at,i.invoice_attempted_at,i.publish_attempted_at,i.snapshot_json,i.customer_id,i.location_id,i.order_key FROM support_club_payment_obligations o LEFT JOIN support_club_square_intents i ON i.kind=o.kind AND i.obligation_id=o.obligation_id WHERE o.kind=? AND o.obligation_id=?").bind(kind,id).first<any>();
export async function releaseOverdueClubPlace(e:Env,kind:string,id:string,owner:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id)||!idOk(owner)||b?.confirmed!==true||b.parent_notified!==true)return {error:"Private sandbox only. Confirm the parent has been notified and approve the exact release."};
 const o=await read(e,kind,id);if(!o)return {error:"Obligation unavailable."};
 const who=await supportInvoiceRecipient(e.DB,"guest",o.request_id);
 if(!who||norm(who.email)!==norm(e.SUPPORT_UNIFIED_TEST_EMAIL))return {error:"Only the verified synthetic parent is eligible."};
 if(o.status==="cancelled"&&await e.DB.prepare("SELECT 1 FROM support_club_square_releases WHERE kind=? AND obligation_id=?").bind(kind,id).first())return {released:true};
 if(!Number.isFinite(Date.parse(o.due_at))||Date.parse(o.due_at)>now.getTime())return {error:"Payment deadline has not passed."};
 const neverAttempted=o.status==="awaiting_invoice"&&(!o.invoice_state||o.invoice_state==="prepared"&&!o.order_attempted_at&&!o.invoice_attempted_at&&!o.publish_attempted_at&&!o.provider_order_id&&!o.provider_invoice_id);
 let reason="never_attempted",invoice:string|null=null,version:number|null=null;
 if(!neverAttempted){
  if(!["issued","review"].includes(o.status)||!["issued","review"].includes(o.invoice_state)||!o.provider_issued_at||b.cancelled_in_square!==true||b.fingerprint!==o.fingerprint)return {error:"An existing or uncertain provider attempt requires reconciliation. Do not release the place."};
  if(await e.DB.prepare("SELECT 1 FROM support_club_square_settlements WHERE kind=? AND obligation_id=?").bind(kind,id).first())return {error:"A recorded payment requires financial review."};
  const check=await inspectClubSquareInvoice(e,o,fetchImpl);
  if(!check||check.status!=="CANCELED"||check.completed!==0||check.version<o.provider_invoice_version||check.order.state!=="CANCELED"||(check.order.tenders!=null&&(!Array.isArray(check.order.tenders)||check.order.tenders.length)))return {error:"Square has not conclusively confirmed a cancelled, unpaid invoice AND order. Keep the reservation."};
  reason="provider_cancelled";invoice=o.provider_invoice_id;version=check.version;
 }
 const at=now.toISOString();
 try{await e.DB.prepare("INSERT INTO support_club_square_releases(kind,obligation_id,reason,provider_invoice_id,provider_version,released_by,notified_at,released_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING").bind(kind,id,reason,invoice,version,owner,at,at).run();}
 catch{return {error:"The obligation, payment or seats changed. Keep the reservation for review."};}
 const saved=await read(e,kind,id);return saved?.status==="cancelled"&&await e.DB.prepare("SELECT 1 FROM support_club_square_releases WHERE kind=? AND obligation_id=?").bind(kind,id).first()?{released:true}:{error:"Release could not be verified."};
}
// Bounded read/reconciliation sweep; it never cancels a Square record or releases a seat.
// A paid invoice may settle after a delayed webhook, only with the existing capture proof.
export async function recheckClubInvoices(e:Env,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!await e.DB.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='support_club_recheck_claims'").first())return {checked:0,verified:0};
 const cutoff=new Date(now.getTime()-15*60000).toISOString(),stamp=now.toISOString();
 const rows=(await e.DB.prepare("SELECT i.kind,i.obligation_id FROM support_club_square_intents i LEFT JOIN support_club_recheck_claims c ON c.kind=i.kind AND c.obligation_id=i.obligation_id WHERE i.state='issued' AND (c.checked_at IS NULL OR c.checked_at<=?) ORDER BY CASE WHEN i.due_at<=? THEN 0 ELSE 1 END,COALESCE(c.checked_at,''),i.due_at LIMIT 5").bind(cutoff,stamp).all<any>()).results||[];
 let checked=0,verified=0;
 for(const r of rows){
  const claim=await e.DB.prepare("INSERT INTO support_club_recheck_claims(kind,obligation_id,checked_at) VALUES(?,?,?) ON CONFLICT(kind,obligation_id) DO UPDATE SET checked_at=excluded.checked_at WHERE support_club_recheck_claims.checked_at<=?").bind(r.kind,r.obligation_id,stamp,cutoff).run();
  if(!claim.meta?.changes)continue;
  checked++;
  try{const result=await verifyClubSquarePayment(e,r.kind,r.obligation_id,fetchImpl,now);if(result.verified)verified++;}catch{/* durable claim prevents tight retry loops */}
 }
 return {checked,verified};
}
