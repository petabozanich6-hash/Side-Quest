import type {Env} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable} from "./supportSquareInvoiceLookup";
import {sandboxInvoicePaymentUrl} from "./supportSquareInvoiceReconcile";
import {previewAdultInvoice} from "./adultSquareInvoicePreparation";

const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
export const readAdultInvoice=(e:Env,id:string)=>e.DB.prepare("SELECT i.*,p.approved_version,p.publish_key,p.attempted_at,p.issued_at,p.issued_version,p.public_url,p.invoice_id published_invoice_id,o.status obligation_status,o.expected_seats,b.user_id,b.family_id,u.email recipient FROM support_academy_adult_invoice_intents i JOIN support_academy_adult_obligations o ON o.id=i.obligation_id JOIN support_academy_adult_bookings b ON b.id=o.booking_id JOIN users u ON u.id=b.user_id AND u.family_id=b.family_id JOIN support_academy_adult_participants a ON a.user_id=b.user_id AND a.family_id=b.family_id LEFT JOIN support_academy_adult_publications p ON p.obligation_id=i.obligation_id WHERE i.obligation_id=? AND u.email_verified_at IS NOT NULL AND u.email_verified_at<>\'\' AND NOT EXISTS(SELECT 1 FROM family_admin_state s WHERE s.family_id=b.family_id AND s.status<>\'active\')").bind(id).first<any>();
const retryable=(v:string|null,now:Date)=>!!v&&Number.isFinite(Date.parse(v))&&now.getTime()>=Date.parse(v)&&now.getTime()-Date.parse(v)<15*60000;
async function fresh(e:Env,i:any,fetchImpl:Fetch|undefined,now:Date){
 const p=await previewAdultInvoice(e,i.obligation_id,{reviewed:true,customer_id:i.customer_id},fetchImpl,now);
 return !("error" in p)&&p.fingerprint===i.fingerprint&&JSON.stringify({snapshot:p.snapshot,order:p.provider_order,invoice:p.provider_invoice})===i.snapshot_json;
}
export async function inspectAdultSquareInvoice(e:Env,i:any,fetchImpl?:Fetch){
 const cfg=squareConfig(e);
 if(!supportInvoiceLookupAvailable(e)||!cfg.ok||cfg.production||cfg.locationId!==i.location_id||!idOk(i.provider_order_id)||!idOk(i.provider_invoice_id))return null;
 const current=await readAdultInvoice(e,i.obligation_id);const who=current?{email:current.recipient}:null;
 if(!who||norm(who.email)!==norm(e.SUPPORT_UNIFIED_TEST_EMAIL))return null;
 try{
  const saved=JSON.parse(i.snapshot_json);
  if(norm(saved.snapshot.recipient)!==norm(who.email))return null;
  const customer=(await squareCall(cfg,"GET","customers/"+encodeURIComponent(i.customer_id),undefined,fetchImpl)).customer;
  const order=(await squareCall(cfg,"GET","orders/"+encodeURIComponent(i.provider_order_id),undefined,fetchImpl)).order;
  const inv=(await squareCall(cfg,"GET","invoices/"+encodeURIComponent(i.provider_invoice_id),undefined,fetchImpl)).invoice;
  const p=inv?.payment_requests;
  if(customer?.id!==i.customer_id||norm(customer.email_address)!==norm(who.email)||order?.id!==i.provider_order_id||order.reference_id!==i.order_key||order.customer_id!==i.customer_id||order.location_id!==i.location_id||!money(order.total_money,i.amount_cents)||inv?.id!==i.provider_invoice_id||inv.order_id!==order.id||inv.location_id!==i.location_id||inv.primary_recipient?.customer_id!==i.customer_id||norm(inv.primary_recipient?.email_address)!==norm(who.email)||inv.subscription_id||!Number.isSafeInteger(inv.version)||inv.version<0||!Array.isArray(p)||p.length!==1||p[0].request_type!=="BALANCE"||p[0].due_date!==saved.snapshot.due_date||!money(p[0].computed_amount_money,i.amount_cents)||p[0].total_completed_amount_money?.currency!=="AUD"||!Number.isSafeInteger(p[0].total_completed_amount_money.amount)||p[0].total_completed_amount_money.amount<0)return null;
  const methods=saved.invoice.accepted_payment_methods;
  const settings=inv.delivery_method==="EMAIL"&&!inv.scheduled_at&&!inv.store_payment_method_enabled&&!inv.custom_fields?.length&&!inv.attachments?.length&&p[0].automatic_payment_source==="NONE"&&!p[0].card_id&&!p[0].bank_account_id&&!p[0].tipping_enabled&&!p[0].reminders?.length&&!!inv.accepted_payment_methods&&Object.keys(methods).every(k=>inv.accepted_payment_methods[k]===methods[k]);
  const safe=order.state==="OPEN"&&money(p[0].total_completed_amount_money,0)&&settings;
  const link=sandboxInvoicePaymentUrl(inv.public_url);
  return {settings,order,status:inv.status,version:inv.version,completed:p[0].total_completed_amount_money.amount,draft:safe&&inv.status==="DRAFT"&&!inv.public_url,issued:safe&&inv.status==="UNPAID"&&!!link,link};
 }catch{return null;}
}
export async function adultFinancialHold(e:Env,id:string){return !!await e.DB.prepare("SELECT 1 FROM support_academy_adult_financial_holds WHERE obligation_id=?").bind(id).first();}
export async function publishAdultSquareInvoice(e:Env,id:string,owner:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!idOk(id)||!idOk(owner)||b?.confirmed!==true||b.issue_confirmed!==true||!idOk(b.provider_invoice_id)||!Number.isSafeInteger(b.version)||b.version<0)return {error:"Approve the exact saved sandbox draft version."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 let i=await readAdultInvoice(e,id);
 if(!i||i.state!=="draft_created"||i.obligation_status!=="awaiting_invoice"||i.location_id!==cfg.locationId||i.fingerprint!==b.fingerprint||i.provider_invoice_id!==b.provider_invoice_id||await adultFinancialHold(e,id))return {error:"Draft or approval changed."};
 if(i.issued_at)return i.approved_version===b.version?{issued:true,paid:false}:{error:"Issued version differs."};
 if((i.attempted_at?i.approved_version:i.provider_invoice_version)!==b.version)return {error:"Draft version changed."};
 const finish=async()=>{
  const current=await readAdultInvoice(e,id);
  if(!current||current.fingerprint!==b.fingerprint||current.provider_invoice_id!==b.provider_invoice_id||current.approved_version!==b.version||await adultFinancialHold(e,id))return {error:"Publication needs reconciliation."};
  if(current.issued_at)return {issued:true,paid:false};
  const check=await inspectAdultSquareInvoice(e,current,fetchImpl);
  if(!check?.issued||!check.link||![b.version,b.version+1].includes(check.version)||!await fresh(e,current,fetchImpl,now))return {error:"Publication cannot be verified. Reconcile the existing invoice; do not create another.",pending:true};
  await e.DB.prepare("UPDATE support_academy_adult_publications SET issued_at=?,issued_version=?,public_url=? WHERE obligation_id=? AND fingerprint=? AND invoice_id=? AND approved_version=? AND issued_at IS NULL AND NOT EXISTS(SELECT 1 FROM support_academy_adult_financial_holds h WHERE h.obligation_id=?)").bind(now.toISOString(),check.version,check.link,id,b.fingerprint,b.provider_invoice_id,b.version,id).run();
  const saved=await readAdultInvoice(e,id);return saved?.issued_at&&saved.public_url===check.link?{issued:true,paid:false}:{error:"Publication requires reconciliation.",pending:true};
 };
 const check=await inspectAdultSquareInvoice(e,i,fetchImpl);
 if(i.attempted_at&&check?.issued)return finish();
 if(!check?.draft||check.version!==b.version||!await fresh(e,i,fetchImpl,now))return {error:"Draft, recipient or reservation no longer matches."};
 if(!i.attempted_at)await e.DB.prepare("INSERT OR IGNORE INTO support_academy_adult_publications(obligation_id,fingerprint,invoice_id,approved_version,publish_key,approved_by,attempted_at) VALUES(?,?,?,?,?,?,?)").bind(id,b.fingerprint,b.provider_invoice_id,b.version,crypto.randomUUID(),owner,now.toISOString()).run();
 i=await readAdultInvoice(e,id);
 if(i?.issued_at&&i.fingerprint===b.fingerprint&&i.approved_version===b.version)return {issued:true,paid:false};
 if(!i||i.fingerprint!==b.fingerprint||i.provider_invoice_id!==b.provider_invoice_id||i.approved_version!==b.version||!retryable(i.attempted_at,now)||!idOk(i.publish_key)||await adultFinancialHold(e,id)||!await fresh(e,i,fetchImpl,now))return {error:"No safe pending publication; reconcile the existing invoice."};
 try{await squareCall(cfg,"POST","invoices/"+encodeURIComponent(i.provider_invoice_id)+"/publish",{version:b.version,idempotency_key:i.publish_key},fetchImpl);}catch{return {error:"Publication response uncertain. Check the existing invoice before retrying.",pending:true};}
 return finish();
}
