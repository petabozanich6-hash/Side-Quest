import React,{useEffect,useState,useRef} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {api,apiErrorMessage} from "../../lib/api";
import {orderStatus,payableOrder} from "../../lib/familyPortalWorkflow";
const root="/family-portal",btn="inline-block rounded-xl bg-emerald-950 text-white px-4 py-3 font-semibold disabled:opacity-50";
const date=v=>v?new Date(v).toLocaleString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"medium",timeStyle:"short"}):"Not set";
const money=v=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(v/100);
const url=(r,extra={})=>root+"?"+new URLSearchParams({page:"requests",source:r.source,request:r.request_id||r.id,...extra}).toString();
const clubStatus=c=>c.status==="paid"?"Paid — place confirmed":c.status==="cancelled"?"Place released":c.status==="invoiced"?"Invoice issued — awaiting payment":"Provisional — invoice to follow";
const detailLink=(r,extra={})=>r.source==="portal"?url(r,extra):r.source==="member"?"/parent/learning-support":"/learning-support/portal?enquiry="+encodeURIComponent(r.request_id||r.id);
function appointmentRows(data){
 return [...data.orders.filter(o=>o.mode==="live"&&o.start_at).map(o=>({...o,kind:"tutoring",display_status:orderStatus(o)})),...data.clubs.map(c=>({...c,kind:"club",display_status:clubStatus(c)}))].sort((a,b)=>a.start_at.localeCompare(b.start_at));
}
export function FamilyNextSession({data}){
 const next=data&&appointmentRows(data).find(r=>r.status==="paid"&&!r.cancellation_pending&&!["closed","resolved"].includes(r.request_status)&&Date.parse(r.end_at)>Date.now());
 if(!next)return null;
 return <section className="paper-card p-5 space-y-2"><p className="text-xs uppercase tracking-widest text-stone-600">Next confirmed session</p><h2 className="font-display text-xl font-bold">{next.kind==="club"?next.topic:next.subject}</h2><p>{date(next.start_at)} · Sydney time</p><Link className="underline font-semibold" to={detailLink(next,next.kind==="club"?{}:{stage:"arrangement",order:next.id})}>View session details →</Link></section>;
}
export function useFamilyOverview(userId,page){
 const [state,setState]=useState({owner:null,data:null,error:""}),[reload,setReload]=useState(0);
 useEffect(()=>{let live=true;setState({owner:userId,data:null,error:""});if(!userId||!["home","appointments","invoices","messages"].includes(page))return;api.get("/family-portal/overview").then(r=>{if(live)setState({owner:userId,data:r.data,error:""});}).catch(e=>{if(live)setState({owner:userId,data:null,error:apiErrorMessage(e,"Could not load your family records")});});return()=>{live=false;};},[userId,page,reload]);
 return {...(state.owner===userId?state:{data:null,error:""}),refresh:()=>setReload(n=>n+1)};
}
export default function FamilyPortalOverview({page,overview}){
 const [params,setParams]=useSearchParams(),thread=params.get("thread")||"",source=params.get("source")||"portal",history=params.get("history")==="1";
 const {data,error,refresh}=overview;
 if(!data)return <section className="paper-card p-5 space-y-3">{error?<><p role="alert">{error}</p><button className="underline" onClick={refresh}>Try again</button></>:<p role="status">Loading your family records…</p>}</section>;
 const selected=data.threads.find(t=>t.id===thread&&t.source===source);
 const limit=data.limited&&<p className="text-sm text-amber-900" role="status">Showing a limited recent record history. Contact Side-Quest if an older arrangement is missing.</p>;
 if(page==="messages")return <section className="space-y-3">{limit}{thread?(selected?<FamilyThread key={source+":"+thread} thread={selected}/>:<p role="alert">This conversation is unavailable.</p>):<><h2 className="font-display text-xl font-bold">Your conversations</h2>{data.threads.length?data.threads.map(t=><Link className="paper-card p-4 block" key={t.source+":"+t.id} to={root+"?"+new URLSearchParams({page:"messages",source:t.source,thread:t.id}).toString()}><strong>{t.subject}</strong><p className="text-sm">{t.message_count} {t.message_count===1?"message":"messages"}{t.unread_count>0?" · "+t.unread_count+" unread":""}</p></Link>):<p className="paper-card p-5">No conversations yet. Start an enquiry to discuss learning support.</p>}</>}</section>;
 if(page==="appointments"){
  const rows=appointmentRows(data),future=r=>r.status!=="cancelled"&&r.status!=="completed"&&Date.parse(r.end_at)>Date.now();
  const visible=rows.filter(r=>history?!future(r):future(r));if(history)visible.reverse();
  return <section className="space-y-3">{limit}<div className="flex gap-4"><button className={!history?"font-bold underline":"underline"} onClick={()=>setParams({page:"appointments"})}>Upcoming</button><button className={history?"font-bold underline":"underline"} onClick={()=>setParams({page:"appointments",history:"1"})}>Past and cancelled</button></div>{visible.length?visible.map(r=><article className="paper-card p-4 space-y-2" key={r.kind+":"+r.id}><strong>{r.kind==="club"?r.topic:r.subject}</strong><p className="text-sm">{date(r.start_at)} · Sydney time</p><p className="font-semibold text-sm">{r.display_status}</p><Link className="text-sm font-semibold underline" to={detailLink(r,r.kind==="club"?{}:{stage:"arrangement",order:r.id})}>View arrangement →</Link></article>):<p className="paper-card p-5">{history?"No previous appointments in this view.":"No upcoming appointments."}</p>}</section>;
 }
 const invoices=[...data.orders.filter(o=>payableOrder(o)&&o.amount_cents>0&&o.status!=="awaiting_confirmation").map(o=>({...o,kind:"tutoring",display_status:orderStatus(o)})),...data.clubs.filter(c=>c.status!=="cancelled"||c.invoice_reference).map(c=>({...c,kind:"club",amount_cents:1200,display_status:clubStatus(c)}))];
 const invoiceId=params.get("invoice")||"";
 if(invoiceId){const invoice=invoices.find(r=>r.kind==="tutoring"&&r.id===invoiceId&&r.square_invoice);return invoice?<FamilySquareInvoice key={invoice.id} invoice={invoice}/>:<section className="paper-card p-5 space-y-2"><Link className="underline text-sm" to={root+"?page=invoices"}>← Invoices and payments</Link><p role="alert">This invoice is unavailable.</p></section>;}
 const open=r=>["confirmed","review","reserved","invoiced"].includes(r.status);
 const visible=invoices.filter(r=>history?!open(r):open(r));
 return <section className="space-y-3">{limit}<div className="flex gap-4"><button className={!history?"font-bold underline":"underline"} onClick={()=>setParams({page:"invoices"})}>Outstanding</button><button className={history?"font-bold underline":"underline"} onClick={()=>setParams({page:"invoices",history:"1"})}>Payment history</button></div>{visible.length?visible.map(r=><article className="paper-card p-4 space-y-2" key={r.kind+":"+r.id}><strong>{r.kind==="club"?r.topic:r.subject}</strong><p className="font-bold">{money(r.amount_cents)} AUD {r.installment?"· session instalment":r.package_sequence===1?"· package total":""}</p><p className="text-sm">{r.square_invoice&&r.status==="confirmed"?"Invoice issued — payment verification pending":r.display_status}</p>{r.invoice_reference&&<p className="text-sm">Invoice reference: {r.invoice_reference}</p>}{(r.square_invoice?.due_at||r.installment_due_at||r.payment_due_at)&&<p className="text-sm">Due {date(r.square_invoice?.due_at||r.installment_due_at||r.payment_due_at)} Sydney time</p>}<Link className="font-semibold underline text-sm" to={r.square_invoice?root+"?"+new URLSearchParams({page:"invoices",invoice:r.id}).toString():detailLink(r,r.kind==="club"?{}:{stage:"payment",order:r.id})}>View payment details →</Link></article>):<p className="paper-card p-5">{history?"No previous payments or cancelled invoices in this view.":"No outstanding payment arrangements."}</p>}<p className="text-xs text-stone-600">Payment status reflects recorded verification. If you have already paid, do not pay again. A provisional reservation is not a paid booking.</p></section>;
}
function FamilyThread({thread}){
 const [record,setRecord]=useState(null),[message,setMessage]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const sending=useRef(false);
 const path="/family-portal/enquiries/detail/"+encodeURIComponent(thread.id);
 useEffect(()=>{if(thread.source!=="portal")return;let live=true;api.get(path).then(r=>{if(live)setRecord(r.data);}).catch(e=>{if(live)setError(apiErrorMessage(e,"Could not open conversation"));});return()=>{live=false;};},[path,thread.source]);
 async function send(e){e.preventDefault();if(sending.current||message.trim().length<2)return;sending.current=true;setBusy(true);setError("");try{await api.post("/support-guest/requests/"+encodeURIComponent(thread.id)+"/messages",{message:message.trim()});setMessage("");const r=await api.get(path);setRecord(r.data);}catch(e){setError(apiErrorMessage(e,"Could not send or refresh your message"));}finally{sending.current=false;setBusy(false);}}
 return <section className="paper-card p-5 space-y-4"><Link className="text-sm underline" to={root+"?page=messages"}>← All conversations</Link><h2 className="font-display text-xl font-bold">{thread.subject}</h2>{thread.source!=="portal"?<><p>This is an existing conversation. Continue in its original secure workspace.</p><Link className={btn} to={thread.source==="member"?"/parent/feedback?thread="+encodeURIComponent(thread.id):"/learning-support/portal?enquiry="+encodeURIComponent(thread.id)}>Open correspondence</Link></>:<>{error&&<p role="alert" className="text-rose-800">{error}</p>}{record?<><p className="whitespace-pre-wrap break-words text-sm">{record.message}</p>{(record.messages||[]).map(m=><article className="border-t pt-3 space-y-1" key={m.id}><strong className="text-sm">{m.sender==="parent"?"You":"Side-Quest"}</strong><p className="text-xs text-stone-600">{date(m.created_at)} Sydney time</p><p className="whitespace-pre-wrap break-words">{m.body}</p></article>)}{!["closed","resolved"].includes(record.status)&&<form className="space-y-3" onSubmit={send}><label className="block font-semibold text-sm">Message Side-Quest<textarea required minLength={2} maxLength={2000} rows={4} className="block mt-1 w-full rounded-xl border bg-white p-3 font-normal" value={message} onChange={e=>setMessage(e.target.value)}/></label><button className={btn} disabled={busy}>{busy?"Sending…":"Send message"}</button></form>}<Link className="text-sm underline" to={url(thread)}>View enquiry and arrangements</Link></>:!error&&<p role="status">Opening conversation…</p>}</>}</section>;
}

function FamilySquareInvoice({invoice}){
 const [record,setRecord]=useState(null),[error,setError]=useState(""),[reload,setReload]=useState(0);
 useEffect(()=>{let live=true;setRecord(null);setError("");api.get("/family-portal/square-invoices/"+encodeURIComponent(invoice.id)).then(r=>{if(live)setRecord(r.data);}).catch(e=>{if(live)setError(apiErrorMessage(e,"Could not verify invoice status."));});return()=>{live=false;};},[invoice.id,reload]);
 return <section className="space-y-3 max-w-2xl">
  <Link className="underline text-sm font-semibold" to={root+"?page=invoices"}>← Invoices and payments</Link>
  <div className="paper-card p-5 space-y-3"><h2 className="font-display text-xl font-bold">{invoice.subject}</h2>
   <p className="text-2xl font-bold">{money(invoice.square_invoice.amount_cents)} AUD</p>
   <p>Payment due {date(invoice.square_invoice.due_at)} Sydney time.</p>
   <p className="text-sm">Private sandbox test invoice. Do not enter real payment information.</p>
   {error?<p role="alert">{error}</p>:!record?<p role="status">Checking current invoice status with Square…</p>:record.status==="unpaid"&&record.payment_url?<><p role="status">Invoice is awaiting payment.</p><a className={btn} href={record.payment_url} target="_blank" rel="noopener noreferrer">Open Square sandbox payment page ↗</a><p className="text-xs">If you have already paid, do not pay again. Return here and refresh to check the latest status.</p></>:<p role="status">{record.status==="deadline_passed"?"The payment deadline has passed. Contact Side-Quest before paying.":record.status==="payment_review"?"Square reports payment; Side-Quest needs to verify it before confirming the booking.":"This invoice needs review. Contact Side-Quest before attempting payment."}</p>}
   <button className="block underline text-sm" onClick={()=>{setRecord(null);setError("");setReload(n=>n+1);}}>Refresh invoice status</button>
  </div>
 </section>;
}
