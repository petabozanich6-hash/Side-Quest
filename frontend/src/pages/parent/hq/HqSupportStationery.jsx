import React,{useState,useRef,useEffect} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {saveSupportFile} from "../../../lib/supportFileDownload";
import HqCorrespondenceAttachments from "./HqCorrespondenceAttachments";
const templates={
 letter:["Parent correspondence",["Message"]],
 proposal:["Learning support proposal",["What we understand","Suggested support","Proposed arrangements and fees","Next steps"]],
 progress:["Learning progress report",["Learning focus","Progress and strengths","Areas to practise","Recommended next steps"]],
 summary:["Session summary",["What we worked on","What went well","Follow-up activities"]],
 plan:["Personalised learning plan",["Learning goals","Learning approach","Activities and resources","Review and next steps"]],
 activity:["Home practice sheet",["Instructions","Activities","Helpful hints"]],
 recommendations:["Learning recommendations",["Observations","Suggested strategies","Resources and next steps"]],
};
const btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",field="block w-full border rounded-lg p-2 text-sm bg-white";
const stateLabel={saved:"Saved, not emailed",sending:"Delivery in progress / check",sent:"Accepted for delivery",review:"Delivery uncertain — check before resending"};
export default function HqSupportStationery({path,orderId,initialOpen=false}){
 const [fromBooking,setFromBooking]=useState(false),[fromDiary,setFromDiary]=useState(false),[composeId,setComposeId]=useState(null);
 const [open,setOpen]=useState(initialOpen),[kind,setKind]=useState("letter"),[learner,setLearner]=useState(""),[sections,setSections]=useState([""]),[doc,setDoc]=useState(null),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState(""),[error,setError]=useState(""),[history,setHistory]=useState(null);
 const locked=useRef(false),base=path+"/stationery";
 const reset=()=>{setDoc(null);setReviewed(false);setNotice("");};
 const draft={kind,learner,sections,confirmed:true,order_id:orderId||null,from_session_diary:fromDiary,from_booking:fromBooking};
 async function load(){setHistory(await adminApi.get(base));}
 async function run(fn){
  if(locked.current)return;locked.current=true;setBusy(true);setError("");setNotice("");
  try{await fn();}catch(e){setError(errorText(e));}finally{locked.current=false;setBusy(false);}
 }
 useEffect(()=>{if(initialOpen)run(load);},[path]);
 return <section className="border rounded-lg p-3 space-y-2">
 <button className={btn} type="button" disabled={busy} onClick={()=>{if(open){if(sections.some(s=>s.trim())&&!window.confirm("Discard unsaved draft?"))return;setLearner("");setKind("letter");setSections([""]);setFromDiary(false);setFromBooking(false);reset();setError("");setHistory(null);}else run(load);setOpen(v=>!v);}}>{open?"Close stationery":"Branded parent documents & stationery"}</button>
 {open&&<><p className="text-sm">Create private Side-Quest A4 documents for this enquiry, including before a booking. Enter parent-facing information only. Private tutor notes are never copied into these documents.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}
 <form className="space-y-2" onSubmit={e=>{e.preventDefault();setFromDiary(false);setFromBooking(false);run(async()=>{setDoc(await adminApi.post(base+"/preview",{...draft,from_session_diary:false,from_booking:false}));setReviewed(false);});}}>
 <label className="block text-sm">Document type<select disabled={busy} className={field} value={kind} onChange={e=>{setKind(e.target.value);setSections(templates[e.target.value][1].map(()=>""));reset();}}>{Object.entries(templates).map(([k,[label]])=><option key={k} value={k}>{label}</option>)}</select></label>
 <label className="block text-sm">Learner name or agreed nickname (optional)<input className={field} disabled={busy} maxLength={80} value={learner} onChange={e=>{setLearner(e.target.value);reset();}}/></label>
 {templates[kind][1].map((label,i)=><label key={label} className="block text-sm">{label}<textarea className={field} rows={kind==="letter"?7:4} disabled={busy} maxLength={4000} value={sections[i]||""} onChange={e=>{setSections(s=>s.map((v,j)=>j===i?e.target.value:v));reset();}}/></label>)}
 <button className="rounded-lg bg-emerald-950 text-white px-4 py-2 text-sm disabled:opacity-50" disabled={busy||!sections.some(s=>s.trim())||sections.join("").length>10000}>Prepare PDF</button>
 </form>
 {orderId&&<button type="button" className={btn} disabled={busy} onClick={()=>run(async()=>{setFromBooking(false);setFromDiary(true);setReviewed(false);setDoc(null);setDoc(await adminApi.post(base+"/preview",{...draft,from_session_diary:true,from_booking:false}));})}>Prepare learning update from saved lesson progress</button>}
 {orderId&&<button type="button" className={btn} disabled={busy} onClick={()=>run(async()=>{setFromBooking(true);setFromDiary(false);setReviewed(false);setDoc(null);setDoc(await adminApi.post(base+"/preview",{...draft,from_booking:true,from_session_diary:false}));})}>Prepare reserved appointment + payment request</button>}
 {doc&&<div className="border-t pt-3 space-y-2"><p className="text-sm font-semibold">{doc.pages} page(s) · Parent: {doc.recipient}</p><button type="button" className={btn} onClick={()=>saveSupportFile(doc)}>Download preview PDF</button>
 {doc.terms&&<div className="rounded-lg border p-2 text-sm"><strong>Included service agreement</strong><p>{doc.terms.version} · {doc.terms.pages} page(s)</p><button type="button" className={btn} onClick={()=>saveSupportFile(doc.terms)}>Review companion terms PDF</button>{!history?.terms_approved&&<p className="text-amber-900">Draft terms require owner approval before customer delivery.</p>}</div>}
 <label className="flex gap-2 text-sm"><input type="checkbox" checked={reviewed} disabled={busy} onChange={e=>setReviewed(e.target.checked)}/> I reviewed the document and any companion agreement, checked parent-facing content and verified the intended recipient.</label>
 <button type="button" className={btn} disabled={busy||!reviewed} onClick={()=>run(async()=>{const saved=await adminApi.post(base+"/save",{...draft,reviewed:true,recipient_confirmed:doc.recipient,fingerprint:doc.fingerprint});setDoc(null);setReviewed(false);setFromDiary(false);setFromBooking(false);setLearner("");setSections(templates[kind][1].map(()=>""));await load();setComposeId(saved.document.id);setNotice("Reviewed PDF saved. Add invoice, payment link or other PDFs below.");})}>Save reviewed PDF</button>
 </div>}
 <div className="border-t pt-3 space-y-2"><h4 className="font-bold text-sm">Private document history</h4><button type="button" className={btn} disabled={busy} onClick={()=>run(load)}>Refresh history</button>
 {history&&<><p className="text-xs break-all">Parent: {history.recipient||"No recipient found"}</p>{!history.email_enabled&&<p className="text-xs">Direct email is disabled until verified. Download and send privately through established correspondence.</p>}
 {!history.documents.length&&<p className="text-sm">No saved documents yet.</p>}
 {history.documents.map(d=><article key={d.id} className="border rounded-lg p-2 space-y-1"><strong className="text-sm">{d.title}</strong><p className="text-xs">{new Date(d.created_at).toLocaleString("en-AU")} · {d.pages} page(s) · {stateLabel[d.status]||d.status}{d.order_id?" · Booking document":""}</p><div className="flex flex-wrap gap-2"><button type="button" className={btn} disabled={busy} onClick={()=>run(async()=>saveSupportFile(await adminApi.get(base+"/"+encodeURIComponent(d.id)+"/download")))}>Download saved PDF</button>{d.terms_version&&<button type="button" className={btn} disabled={busy} onClick={()=>run(async()=>{const pack=await adminApi.get(base+"/"+encodeURIComponent(d.id)+"/download");if(pack.terms)saveSupportFile(pack.terms);})}>Download agreement</button>}{<button type="button" className={btn} disabled={busy} onClick={()=>setComposeId(composeId===d.id?null:d.id)}>{composeId===d.id?"Close email details":d.status==="saved"?"Add attachments / send email":"View correspondence attachments"}</button>}</div>{composeId===d.id&&<HqCorrespondenceAttachments key={d.id} base={base} document={d} recipient={history.recipient} emailEnabled={history.email_enabled&&(!d.terms_version||history.terms_approved)} onSent={load}/>}</article>)}
 <p className="text-xs">Up to 100 reviewed documents per enquiry. Keep only necessary information; saved documents remain private to authorised Owner HQ staff. No automatic resend or public links.</p></>}
 </div>
 </>}</section>;
}
