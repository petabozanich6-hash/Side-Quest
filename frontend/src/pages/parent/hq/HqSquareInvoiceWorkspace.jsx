import React,{useCallback,useEffect,useRef,useState} from "react";
import {Link,useLocation,useParams} from "react-router-dom";
import {adminApi,errorText} from "../../../lib/adminApi";

const money=n=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(n/100);
const date=v=>v?new Date(v).toLocaleString("en-AU",{timeZone:"Australia/Sydney"}):"Not set";
const button="rounded-xl bg-emerald-950 text-white px-4 py-2 font-semibold disabled:opacity-50";
const field="block w-full rounded-lg border border-stone-300 p-2 bg-white mt-1";
const stages={
 prepared:["Prepared locally","create-order","Create Square sandbox order","This creates an unpaid Square order, not an invoice or payment request."],
 order_pending:["Square order response uncertain","create-order","Recover Square order","Retry the same operation only; the server refuses retries outside its recovery window."],
 order_created:["Square order created","create-draft","Create unpublished draft","The draft will not be sent or published."],
 invoice_pending:["Draft response uncertain","create-draft","Recover invoice draft","Retry the same draft operation only within the server recovery window."],
 draft_created:["Unpublished Square draft",null,null,"Check the saved draft in Square before approving issue."],
 publish_pending:["Publication response uncertain",null,null,"Check the same invoice before recovering or retrying publication."],
 issued:["Issued in Square sandbox",null,null,"Invoice issued and verified. Booking remains unpaid until payment is independently verified."],
 review:["Reconciliation required",null,null,"Check Square before taking any further payment or cancellation action."]
};

export default function HqSquareInvoiceWorkspace(){
 const {channel,requestId,orderId}=useParams(),location=useLocation();
 const key=[channel,requestId,orderId].map(encodeURIComponent).join("/");
 return <InvoicePage key={key} channel={channel} requestId={requestId} orderId={orderId} apiPath={"/support-invoice-workspace/"+key} from={location.state?.from}/>;
}

function InvoicePage({channel,requestId,orderId,apiPath,from}){
 const [data,setData]=useState(null),[customer,setCustomer]=useState(""),[due,setDue]=useState(""),[review,setReview]=useState(false),[preview,setPreview]=useState(null);
 const [approved,setApproved]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[loadError,setLoadError]=useState("");
 const [checked,setChecked]=useState(null),[candidateOrder,setCandidateOrder]=useState(""),[candidateInvoice,setCandidateInvoice]=useState("");
 const lock=useRef(false),live=useRef(false);
 const load=useCallback(async()=>{try{const result=await adminApi.get(apiPath);if(live.current){setData(result);setLoadError("");}return result;}catch(e){if(live.current){setData(null);setLoadError(errorText(e,"Could not load invoice workspace."));}return null;}},[apiPath]);
 useEffect(()=>{live.current=true;load();return()=>{live.current=false;};},[load]);
 const fallback="/parent/command-centre/"+(channel==="guest"?"learning-support":"feedback");
 const back=typeof from==="string"&&(from==="/parent/command-centre/learning-support"||from.startsWith("/parent/command-centre/learning-support?")||from==="/parent/command-centre/feedback"||from.startsWith("/parent/command-centre/feedback?"))?from:fallback;
 const context={channel,request_id:requestId,order_id:orderId};
 function changed(){setPreview(null);setReview(false);setApproved(false);setError("");}
 async function getPreview(e){
  e.preventDefault();if(lock.current||!review||!data?.eligible)return;
  lock.current=true;setBusy(true);setError("");setPreview(null);setApproved(false);
  try{const deadline=data.order.installment_due_at||new Date(due).toISOString();const p=await adminApi.post("/support-invoice-preview",{...context,customer_id:customer.trim(),due_at:deadline,reviewed:true});if(live.current)setPreview(p);}
  catch(e){if(live.current)setError(errorText(e,"Could not prepare invoice preview."));}
  finally{lock.current=false;if(live.current)setBusy(false);}
 }
 async function inspect(e){
  e.preventDefault();if(lock.current||!data?.intent)return;lock.current=true;setBusy(true);setError("");setChecked(null);setApproved(false);
  try{const r=await adminApi.post("/support-invoice-workspace/inspect",{...context,confirmed:true,fingerprint:data.intent.fingerprint,...(!data.intent.provider_order_id&&candidateOrder.trim()?{provider_order_id:candidateOrder.trim()}:{}),...(!data.intent.provider_invoice_id&&candidateInvoice.trim()?{provider_invoice_id:candidateInvoice.trim()}:{})});if(live.current)setChecked(r);}
  catch(e){if(live.current)setError(errorText(e,"Could not verify the Square record."));}
  finally{lock.current=false;if(live.current)setBusy(false);}
 }
 async function action(name,details){
  if(lock.current)return;lock.current=true;setBusy(true);setError("");setApproved(false);setChecked(null);
  try{const result=await adminApi.post("/support-invoice-workspace/"+name,{...context,...details,confirmed:true});if(live.current){setPreview(null);setReview(false);if(name==="release-unpaid")setError("Cancellation verified; reservation released.");if(name==="verify-payment")setError(result.verified?"Payment verified. Booking confirmed.":result.status==="unpaid"?"Payment is still outstanding.":"Payment needs review; booking not newly confirmed.");}}
  catch(e){if(live.current)setError(errorText(e,"Invoice action could not be confirmed. Check the saved status before retrying."));}
  finally{await load();lock.current=false;if(live.current)setBusy(false);}
 }
 const i=data?.intent,o=data?.order,stage=i?(stages[i.state]||["Reconciliation required",null,null,"No further action is enabled."]):null;
 return <section className="max-w-2xl space-y-4 min-w-0">
  <Link to={back} className="underline text-sm font-semibold">← Return to service booking</Link>
  <header><h2 className="font-display text-2xl font-bold">Invoice review</h2><p className="text-sm text-stone-600">Private Square sandbox · No live payments or automatic charges. Issuing an invoice requires separate approval.</p></header>
  {loadError&&<div role="alert" className="paper-card p-4 space-y-2"><p>{loadError}</p><button className="underline" onClick={load}>Reload saved status</button></div>}
  {!data&&!loadError&&<p role="status">Loading invoice details…</p>}
  {error&&<p role="alert" className="rounded-lg border p-3 text-rose-800">{error}</p>}
  {o&&<div className="paper-card p-4 space-y-2">
   <h3 className="font-bold">{o.mode==="written"?"Written support":o.package_total>1&&!o.installment_due_at?"Tutoring package":"Tutoring session"}</h3>
   <p className="text-sm break-words">Recipient: {data.recipient||"Not verified"}</p>
   {o.start_at&&<p className="text-sm">Appointment: {date(o.start_at)} Sydney time</p>}
   <p className="text-2xl font-bold">{money(o.amount_cents)} AUD</p>
   <p className="text-sm">Booking status: {o.status.replaceAll("_"," ")}</p>
   {!data.eligible&&<p role="alert" className="text-sm text-amber-900">This arrangement is not currently eligible. Review the recipient, booking or existing payment before continuing.</p>}
  </div>}
  {o&&data.eligible&&!i&&!preview&&<form className="paper-card p-4 space-y-3" onSubmit={getPreview}>
   <h3 className="font-bold">Prepare invoice</h3>
   <label className="block text-sm">Existing sandbox Square customer ID<input className={field} required maxLength={150} value={customer} disabled={busy} onChange={e=>{setCustomer(e.target.value);changed();}}/></label>
   {o.installment_due_at?<p className="text-sm">Agreed deadline: {date(o.installment_due_at)} Sydney time.</p>:<label className="block text-sm">Payment deadline (device time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone})<input className={field} type="datetime-local" required value={due} disabled={busy} onChange={e=>{setDue(e.target.value);changed();}}/></label>}
   <label className="flex gap-2 text-sm"><input type="checkbox" checked={review} disabled={busy} onChange={e=>setReview(e.target.checked)}/>I selected the correct sandbox customer and payment deadline.</label>
   <button className={button} disabled={busy||!review||!customer.trim()||(!o.installment_due_at&&!due)}>{busy?"Checking…":"Review invoice"}</button>
  </form>}
  {o&&data.eligible&&!i&&preview&&<div className="paper-card p-4 space-y-3">
   <h3 className="font-bold">Review exact invoice details</h3><p>{preview.description}</p><p className="break-words">Recipient: {preview.recipient}</p><p className="font-bold">{money(preview.amount_cents)} AUD</p><p>Deadline: {date(preview.due_at)} Sydney time</p><p className="text-sm">Square due date: {preview.due_date}. No automatic charge.</p>
   <label className="flex gap-2 text-sm"><input type="checkbox" checked={approved} disabled={busy} onChange={e=>setApproved(e.target.checked)}/>I approve saving these exact invoice details.</label>
   <button className={button} disabled={busy||!approved} onClick={()=>action("prepare",{fingerprint:preview.fingerprint,customer_id:preview.customer_id,due_at:preview.due_at,reviewed:true})}>{busy?"Saving…":"Save approved preparation"}</button>
   <button type="button" className="block underline text-sm" disabled={busy} onClick={changed}>Edit details</button>
  </div>}
  {i&&<div className="paper-card p-4 space-y-3" data-testid="hq-square-invoice-stage">
   <h3 className="font-bold">{stage[0]}</h3><p>{stage[3]}</p>
   <p className="text-sm">Saved amount: {money(i.amount_cents)} AUD · Deadline: {date(i.due_at)} Sydney time</p>
   {i.provider_order_id&&<p className="break-all text-xs">Square order: {i.provider_order_id}</p>}
   {i.provider_invoice_id&&<p className="break-all text-xs">Square draft: {i.provider_invoice_id} · Version {i.provider_invoice_version}</p>}
   {data.eligible&&stage[1]&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={approved} disabled={busy} onChange={e=>setApproved(e.target.checked)}/>I approve this sandbox operation for the saved details above.</label>
   <button className={button} disabled={busy||!approved} onClick={()=>action(stage[1],{fingerprint:i.fingerprint})}>{busy?"Working…":stage[2]}</button></>}
   {i.state==="prepared"&&!i.order_attempted_at&&!i.invoice_attempted_at&&<button className="block underline text-sm text-rose-800" disabled={busy} onClick={()=>{if(window.confirm("Discard this local preparation? Nothing has been submitted to Square."))action("release",{fingerprint:i.fingerprint});}}>Discard local preparation</button>}
   {["order_pending","order_created","invoice_pending","draft_created","review","publish_pending","issued"].includes(i.state)&&<div className="border-t pt-3 space-y-2">
    <h4 className="font-semibold">Check saved record in Square</h4>
    <p className="text-sm">Read-only provider check. A failed or missing lookup does not mean it is safe to create another invoice.</p>
    <form className="space-y-2" onSubmit={inspect}>
     {!i.provider_order_id&&<label className="block text-sm">Candidate Square order ID<input className={field} required maxLength={150} value={candidateOrder} disabled={busy} onChange={e=>{setCandidateOrder(e.target.value);setChecked(null);}}/></label>}
     {!i.provider_invoice_id&&["invoice_pending","review"].includes(i.state)&&<label className="block text-sm">Candidate Square invoice ID (if found)<input className={field} maxLength={150} value={candidateInvoice} disabled={busy} onChange={e=>{setCandidateInvoice(e.target.value);setChecked(null);}}/></label>}
     <button className="rounded-lg border px-3 py-2 text-sm" disabled={busy}>{busy?"Checking…":"Check Square record"}</button>
    </form>
    {checked&&<div role="status" className="rounded-lg border p-3 space-y-2 text-sm">
     <p>Order matched · {checked.order_open?"Open":"Not open"}</p>
     {checked.invoice_checked&&<><p>Invoice status: {checked.status} · version {checked.version}</p><p>Amount: {money(checked.amount_cents)} · Completed: {money(checked.completed_cents)}</p><p>{checked.issued_matches?"Issued invoice matches the approved settings.":checked.draft_matches?"Draft matches saved settings.":"Draft or payment settings require review."}</p></>}
     {checked.requires_review&&<p>Review is required; no booking or payment status has changed.</p>}
     {data.eligible&&((i.state==="draft_created"&&checked.draft_matches&&checked.version===i.provider_invoice_version)||(i.state==="publish_pending"&&(checked.issued_matches||checked.draft_matches)))&&<div className="border-t pt-2 space-y-2">
     <label className="flex gap-2"><input type="checkbox" checked={approved} disabled={busy} onChange={e=>setApproved(e.target.checked)}/>I approve issuing or recovering this exact Square sandbox invoice for the verified test recipient.</label>
     <button className={button} disabled={busy||!approved} onClick={()=>action("publish",{fingerprint:i.fingerprint,provider_invoice_id:checked.provider_invoice_id,version:i.state==="publish_pending"?i.publish_approved_version:checked.version,issue_confirmed:true})}>{i.state==="draft_created"?"Approve and issue sandbox invoice":checked.issued_matches?"Record verified issue":"Retry same issue operation"}</button>
    </div>}
     {i.state==="issued"&&o.status==="confirmed"&&checked.status==="CANCELED"&&checked.completed_cents===0&&<div className="border-t pt-2 space-y-2"><p>Square reports the invoice cancelled with no completed payment. The server will check the associated order again before releasing an overdue reservation or an agreed cancellation.</p><button className="rounded-lg border border-rose-800 text-rose-800 px-3 py-2" disabled={busy} onClick={()=>{if(window.confirm("Confirm this unpaid invoice was cancelled in Square, the parent has been notified, and you want to release the reserved time?"))action("release-unpaid",{fingerprint:i.fingerprint,cancelled_in_square:true,parent_notified:true});}}>Verify cancellation and release reservation</button></div>}
     {(checked.can_recover_order||checked.can_recover_draft)&&<button className={button} disabled={busy} onClick={()=>{if(window.confirm("Link this freshly matched sandbox record to the existing preparation? This will not issue an invoice."))action("recover",{fingerprint:i.fingerprint,recovery_confirmed:true,provider_order_id:checked.provider_order_id,...(checked.invoice_checked?{provider_invoice_id:checked.provider_invoice_id}:{})});}}>Recover matched record</button>}
    </div>}
   </div>}
   {i.state==="issued"&&o.status==="confirmed"&&<p className="text-sm">If an overdue or parent-requested cancellation is agreed, cancel the unpaid invoice in Square first, notify the parent, then check the saved record here. Do not release a partial or uncertain payment.</p>}
   {i.state==="issued"&&<button className={button} disabled={busy} onClick={()=>action("verify-payment",{fingerprint:i.fingerprint})}>Check and verify payment</button>}
   <button className="block underline text-sm" disabled={busy} onClick={()=>{setApproved(false);setChecked(null);load();}}>Reload saved status</button>
  </div>}
 </section>;
}
