import type {Env,AuthUser,App,Guards} from "./types";
import {squareConfig,squareCall,type Fetch} from "./square";
import {supportInvoiceLookupAvailable,supportInvoiceRecipient} from "./supportSquareInvoiceLookup";
import {sandboxInvoicePaymentUrl} from "./supportSquareInvoiceReconcile";
import {previewClubInvoice} from "./clubSquareInvoicePreparation";
import {verifiedPortalIdentity} from "./unifiedPortalIdentity";
const idOk=(v:unknown):v is string=>typeof v==="string"&&/^[A-Za-z0-9:_-]{1,150}$/.test(v);
const norm=(v:unknown)=>String(v??"").trim().toLowerCase();
const money=(v:any,n:number)=>v?.currency==="AUD"&&Number.isSafeInteger(v.amount)&&v.amount===n;
const read=(e:Env,kind:string,id:string)=>e.DB.prepare("SELECT * FROM support_club_square_intents WHERE kind=? AND obligation_id=?").bind(kind,id).first<any>();
const retryable=(v:string|null,now:Date)=>!!v&&Number.isFinite(Date.parse(v))&&now.getTime()>=Date.parse(v)&&now.getTime()-Date.parse(v)<15*60000;
async function fresh(e:Env,i:any,fetchImpl:Fetch|undefined,now:Date){
 const p=await previewClubInvoice(e,i.kind,i.obligation_id,{reviewed:true,customer_id:i.customer_id},fetchImpl,now);
 return !("error" in p)&&p.fingerprint===i.fingerprint&&JSON.stringify({snapshot:p.snapshot,order:p.provider_order,invoice:p.provider_invoice})===i.snapshot_json;
}
async function inspect(e:Env,i:any,fetchImpl?:Fetch){
 const cfg=squareConfig(e);
 if(!supportInvoiceLookupAvailable(e)||!cfg.ok||cfg.production||cfg.locationId!==i.location_id||!idOk(i.provider_order_id)||!idOk(i.provider_invoice_id))return null;
 const who=await supportInvoiceRecipient(e.DB,"guest",i.request_id);
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
  const safe=order.state==="OPEN"&&money(p[0].total_completed_amount_money,0)&&inv.delivery_method==="EMAIL"&&!inv.scheduled_at&&!inv.store_payment_method_enabled&&!inv.custom_fields?.length&&!inv.attachments?.length&&p[0].automatic_payment_source==="NONE"&&!p[0].card_id&&!p[0].bank_account_id&&!p[0].tipping_enabled&&!p[0].reminders?.length&&!!inv.accepted_payment_methods&&Object.keys(methods).every(k=>inv.accepted_payment_methods[k]===methods[k]);
  const link=sandboxInvoicePaymentUrl(inv.public_url);
  return {status:inv.status,version:inv.version,completed:p[0].total_completed_amount_money.amount,draft:safe&&inv.status==="DRAFT"&&!inv.public_url,issued:safe&&inv.status==="UNPAID"&&!!link,link};
 }catch{return null;}
}
export async function publishClubSquareInvoice(e:Env,kind:string,id:string,owner:string,b:any,fetchImpl?:Fetch,now=new Date()){
 if(!supportInvoiceLookupAvailable(e)||!["single","round"].includes(kind)||!idOk(id)||!idOk(owner)||b?.confirmed!==true||b.issue_confirmed!==true||!idOk(b.provider_invoice_id)||!Number.isSafeInteger(b.version)||b.version<0)return {error:"Approve the exact saved sandbox draft version."};
 const cfg=squareConfig(e);if(!cfg.ok||cfg.production)return {error:"Sandbox only."};
 let i=await read(e,kind,id);
 if(!i||i.location_id!==cfg.locationId||i.fingerprint!==b.fingerprint||i.provider_invoice_id!==b.provider_invoice_id||!["draft_created","publish_pending","issued"].includes(i.state))return {error:"Draft or approval changed."};
 if(i.state==="issued")return i.publish_approved_version===b.version?{issued:true,paid:false}:{error:"Issued version differs."};
 if((i.state==="draft_created"?i.provider_invoice_version:i.publish_approved_version)!==b.version)return {error:"Draft version changed."};
 const finish=async()=>{
  const current=await read(e,kind,id);
  if(!current||current.fingerprint!==b.fingerprint||current.provider_invoice_id!==b.provider_invoice_id||current.publish_approved_version!==b.version)return {error:"Publication needs reconciliation."};
  if(current.state==="issued")return {issued:true,paid:false};
  const check=await inspect(e,current,fetchImpl);
  if(!check?.issued||!check.link||![b.version,b.version+1].includes(check.version)||!await fresh(e,current,fetchImpl,now))return {error:"Publication cannot be verified. Check the existing invoice; do not create another.",pending:true};
  try{await e.DB.prepare("UPDATE support_club_square_intents SET state='issued',provider_invoice_version=?,provider_issued_at=?,provider_public_url=?,updated_at=? WHERE kind=? AND obligation_id=? AND state='publish_pending' AND fingerprint=? AND provider_invoice_id=? AND publish_approved_version=?").bind(check.version,now.toISOString(),check.link,now.toISOString(),kind,id,b.fingerprint,b.provider_invoice_id,b.version).run();}catch{return {error:"Issued invoice requires local reconciliation.",pending:true};}
  const saved=await read(e,kind,id);return saved?.state==="issued"&&saved.provider_public_url===check.link?{issued:true,paid:false}:{error:"Publication requires reconciliation.",pending:true};
 };
 const check=await inspect(e,i,fetchImpl);
 if(i.state==="publish_pending"&&check?.issued)return finish();
 if(!check?.draft||check.version!==b.version||!await fresh(e,i,fetchImpl,now))return {error:"Draft, recipient or reservation no longer matches."};
 if(i.state==="draft_created")await e.DB.prepare("UPDATE support_club_square_intents SET state='publish_pending',publish_attempted_at=?,publish_approved_version=?,publish_approved_by=?,updated_at=? WHERE kind=? AND obligation_id=? AND state='draft_created' AND fingerprint=? AND provider_invoice_id=? AND provider_invoice_version=? AND publish_attempted_at IS NULL").bind(now.toISOString(),b.version,owner,now.toISOString(),kind,id,b.fingerprint,b.provider_invoice_id,b.version).run();
 i=await read(e,kind,id);
 if(i?.state==="issued"&&i.fingerprint===b.fingerprint&&i.publish_approved_version===b.version)return {issued:true,paid:false};
 if(!i||i.state!=="publish_pending"||i.fingerprint!==b.fingerprint||i.provider_invoice_id!==b.provider_invoice_id||i.publish_approved_version!==b.version||!retryable(i.publish_attempted_at,now)||!idOk(i.publish_key)||!await fresh(e,i,fetchImpl,now))return {error:"No safe pending publication; reconcile the existing invoice."};
 try{await squareCall(cfg,"POST","invoices/"+encodeURIComponent(i.provider_invoice_id)+"/publish",{version:b.version,idempotency_key:i.publish_key},fetchImpl);}catch{return {error:"Publication response uncertain. Check the existing invoice before retrying.",pending:true};}
 return finish();
}
async function parentIdentity(e:Env,a:AuthUser){
 if(!supportInvoiceLookupAvailable(e))return null;
 const who=await verifiedPortalIdentity(e.DB,a);
 return who&&norm(who.email)===norm(e.SUPPORT_UNIFIED_TEST_EMAIL)?who:null;
}
const owned=`SELECT i.*,o.status obligation_status,o.payment_mode,o.learner_id,o.expected_seats
 FROM support_club_square_intents i JOIN support_club_payment_obligations o ON o.kind=i.kind AND o.obligation_id=i.obligation_id AND o.request_id=i.request_id AND o.amount_cents=i.amount_cents AND o.due_at=i.due_at
 JOIN support_portal_enquiries p ON p.request_id=o.request_id AND p.learner_id=o.learner_id
 JOIN support_guest_requests r ON r.id=p.request_id
 WHERE p.parent_user_id=? AND p.family_id=? AND r.email=? AND r.status NOT IN ('closed','resolved') AND i.provider_issued_at IS NOT NULL`;
export async function familyClubInvoiceSummaries(e:Env,a:AuthUser){
 const who=await parentIdentity(e,a);if(!who)return [];
 const rows=(await e.DB.prepare(owned+" ORDER BY i.due_at,i.obligation_id LIMIT 201").bind(a.id,a.family_id,who.email).all<any>()).results||[];
 return rows.map(r=>({kind:r.kind,id:r.obligation_id,request_id:r.request_id,learner_id:r.learner_id,amount_cents:r.amount_cents,due_at:r.due_at,payment_mode:r.payment_mode,status:r.obligation_status}));
}
async function seatMatch(e:Env,r:any){
 try{
  const expected=JSON.parse(JSON.parse(r.snapshot_json).snapshot.seats_json);
  const seats=(await e.DB.prepare("SELECT seat_id,class_id,start_at,end_at,status,payment_due_at FROM support_club_obligation_seats WHERE kind=? AND obligation_id=?").bind(r.kind,r.obligation_id).all<any>()).results||[];
  return seats.length===expected.length&&seats.length===r.expected_seats&&seats.every(s=>s.status==="invoiced"&&expected.some((x:any)=>x.seat_id===s.seat_id&&x.class_id===s.class_id&&x.start_at===s.start_at&&x.end_at===s.end_at&&x.payment_due_at===s.payment_due_at));
 }catch{return false;}
}
export async function familyClubInvoice(e:Env,a:AuthUser,kind:string,id:string,fetchImpl?:Fetch,now=new Date()){
 const who=await parentIdentity(e,a);if(!who||!["single","round"].includes(kind)||!idOk(id))return null;
 const get=()=>e.DB.prepare(owned+" AND i.kind=? AND i.obligation_id=?").bind(a.id,a.family_id,who.email,kind,id).first<any>();
 const r=await get();if(!r)return null;
 const summary={amount_cents:r.amount_cents,due_at:r.due_at,payment_mode:r.payment_mode};
 const hold=(status:string)=>({...summary,status,payment_url:null});
 if(r.obligation_status==="cancelled")return hold("cancelled");
 if(r.obligation_status==="paid")return hold("payment_review");
 if(r.state!=="issued"||r.obligation_status!=="issued"||!await seatMatch(e,r))return hold("review");
 if(!Number.isFinite(Date.parse(r.due_at))||Date.parse(r.due_at)<=now.getTime())return hold("deadline_passed");
 const check=await inspect(e,r,fetchImpl);
 if(check?.status==="PAID")return hold("payment_review");
 if(!check?.issued||check.version!==r.provider_invoice_version||check.link!==r.provider_public_url)return hold("review");
 const current=await get();
 if(!await parentIdentity(e,a)||!current||current.state!=="issued"||current.obligation_status!=="issued"||current.fingerprint!==r.fingerprint||current.provider_public_url!==r.provider_public_url||current.provider_invoice_version!==r.provider_invoice_version||!await seatMatch(e,current))return hold("review");
 return {...summary,status:"unpaid",payment_url:check.link};
}
export function registerFamilyClubInvoices(app:App,g:Guards){
 app.get("/api/family-portal/club-invoices",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  if(!await parentIdentity(c.env,c.get("user")))return c.json({detail:"Not found"},404);
  return c.json({items:await familyClubInvoiceSummaries(c.env,c.get("user"))});
 });
 app.get("/api/family-portal/club-invoices/:kind/:id",g.auth,g.parent,async c=>{
  c.header("Cache-Control","private, no-store");
  const r=await familyClubInvoice(c.env,c.get("user"),c.req.param("kind")||"",c.req.param("id")||"");
  return r?c.json(r):c.json({detail:"Invoice unavailable"},404);
 });
}
