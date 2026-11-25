import React,{useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {saveSupportFile} from "../../../lib/supportFileDownload";
const templates={
 letter:["Parent correspondence",["Message"]],
 progress:["Learning progress report",["Learning focus","Progress and strengths","Areas to practise","Recommended next steps"]],
 summary:["Session summary",["What we worked on","What went well","Follow-up activities"]],
 plan:["Personalised learning plan",["Learning goals","Learning approach","Activities and resources","Review and next steps"]],
 activity:["Home practice sheet",["Instructions","Activities","Helpful hints"]],
 recommendations:["Learning recommendations",["Observations","Suggested strategies","Resources and next steps"]],
};
const btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",field="block w-full border rounded-lg p-2 text-sm bg-white";
export default function HqSupportStationery({path}){
 const [open,setOpen]=useState(false),[kind,setKind]=useState("letter"),[learner,setLearner]=useState(""),[sections,setSections]=useState([""]),[doc,setDoc]=useState(null),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState(""),[error,setError]=useState("");
 const reset=()=>{setDoc(null);setReviewed(false);setNotice("");};
 const draft={kind,learner,sections,confirmed:true};
 async function run(send=false){
  if(busy)return;setBusy(true);setError("");setNotice("");
  try{
   if(send){
    const r=await adminApi.post(path+"/stationery-email",{...draft,reviewed:true,recipient_confirmed:doc.recipient});
    setReviewed(false);setNotice(r.email_notification_sent?"Email accepted for delivery. Keep a copy and confirm receipt if needed.":"Delivery could not be confirmed. Check existing correspondence before attempting again.");
   }else{setDoc(await adminApi.post(path+"/stationery-preview",draft));setReviewed(false);}
  }catch(e){setError(errorText(e));}finally{setBusy(false);}
 }
 return <section className="border rounded-lg p-3 space-y-2">
 <button className={btn} type="button" disabled={busy} onClick={()=>{if(open){setLearner("");setKind("letter");setSections([""]);reset();setError("");}setOpen(v=>!v);}}>{open?"Close stationery (discard draft)":"Branded parent documents & stationery"}</button>
 {open&&<><p className="text-sm">Create a private, print-ready Side-Quest A4 document for this family. Enter only material intended for the parent; your private diary is never copied into this document. Drafts are not saved automatically.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}
 <form className="space-y-2" onSubmit={e=>{e.preventDefault();run();}}>
 <label className="block text-sm">Document type<select disabled={busy} className={field} value={kind} onChange={e=>{setKind(e.target.value);setSections(templates[e.target.value][1].map(()=>""));reset();}}>{Object.entries(templates).map(([k,[label]])=><option key={k} value={k}>{label}</option>)}</select></label>
 <label className="block text-sm">Learner name or agreed nickname (optional)<input className={field} disabled={busy} maxLength={80} value={learner} onChange={e=>{setLearner(e.target.value);reset();}}/></label>
 {templates[kind][1].map((label,i)=><label key={label} className="block text-sm">{label}<textarea className={field} rows={kind==="letter"?7:4} disabled={busy} maxLength={4000} value={sections[i]||""} onChange={e=>{setSections(s=>s.map((v,j)=>j===i?e.target.value:v));reset();}}/></label>)}
 <button className="rounded-lg bg-emerald-950 text-white px-4 py-2 text-sm disabled:opacity-50" disabled={busy||!sections.some(s=>s.trim())||sections.join("").length>10000}>Prepare PDF</button>
 </form>
 {doc&&<div className="border-t pt-3 space-y-2"><p className="text-sm font-semibold">{doc.pages} page(s) · Parent: {doc.recipient}</p><button type="button" className={btn} onClick={()=>saveSupportFile(doc)}>Download PDF to review or send privately</button>
 {doc.email_enabled?<><label className="flex gap-2 text-sm"><input type="checkbox" checked={reviewed} disabled={busy} onChange={e=>setReviewed(e.target.checked)}/> I opened and reviewed this PDF, checked that it contains only parent-facing content, and verified this email against established parent correspondence.</label><button type="button" className={btn} disabled={busy||!reviewed} onClick={()=>{if(window.confirm("Send this reviewed PDF to the verified parent address?"))run(true);}}>Email reviewed PDF</button></>:<p className="text-xs">Direct email is not enabled. Download the reviewed PDF and send it through existing verified parent correspondence.</p>}
 <p className="text-xs">Keep your own copy in secure storage. This does not add documents to the general resource library or create a parent portal history.</p></div>}
 </>}</section>;
}
