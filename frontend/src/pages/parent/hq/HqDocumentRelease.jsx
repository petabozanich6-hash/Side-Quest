import React,{useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";

const checks=[
 ["official_sources_checked","Official education authority sources checked against the current published guidance"],
 ["requirements_mapped","All mandatory requirements mapped to document sections"],
 ["curriculum_stages_checked","Learning areas, stages, syllabuses and outcomes checked"],
 ["example_reviewed","Full completed fictional example independently checked"],
 ["layout_tested","Entire PDF tested for printing, margins, overflow and form fields"],
 ["accessibility_checked","PDF reading, legibility and accessibility reviewed"],
 ["independent_review_completed","A separate qualified reviewer has examined this specific document"],
 ["no_government_endorsement_claim","Product accurately describes its purpose without claiming government approval"]
];
const price={blank:499,guided:999,printed:1499,planner_blank:2995,planner_personalised:3995,planner_printed:6995};
const kindFor=(p)=>{
 const tags=p.tags||[];
 if(tags.includes("premium-planner-blank"))return "planner_blank";
 if(tags.includes("premium-planner-personalised"))return "planner_personalised";
 if(tags.includes("premium-planner-printed"))return "planner_printed";
 if(tags.includes("guided-document"))return "guided";
 if(tags.includes("print-and-post"))return "printed";
 if(tags.includes("fillable-pdf"))return "blank";
 return null;
};
const money=n=>n==null?"Price not set":new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(n/100);
const field="w-full rounded-lg border border-stone-300 p-2 text-sm";
export default function HqDocumentRelease({products,onRefresh}){
 const [selected,setSelected]=useState(""),[review,setReview]=useState({}),[reviewer,setReviewer]=useState(""),[notes,setNotes]=useState(""),[date,setDate]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState("");
 const current=products.find(p=>p.id===selected);
 const run=async(fn)=>{setBusy(true);setError("");setMessage("");try{await fn();await onRefresh()}catch(e){setError(errorText(e))}finally{setBusy(false)}};
 const activate=()=>run(async()=>{
   await adminApi.post("/document-studio/products/"+encodeURIComponent(selected)+"/release",{
     ...review,reviewer,review_notes:notes,source_checked_on:date
   });
   setMessage("Reviewed version activated in the shop. Families can follow its paid steps.");
 });
 const deactivate=()=>run(async()=>{await adminApi.post("/document-studio/products/"+encodeURIComponent(selected)+"/release",{action:"deactivate"});setMessage("Product deactivated.")});
 const setStandard=()=>run(async()=>{const r=await adminApi.post("/document-studio/products/"+encodeURIComponent(selected)+"/price");setMessage("Base price set to "+money(r.price_cents)+". Existing products aren't automatically changed without this action.")});
 return <section className="paper-card p-5 space-y-4" data-testid="document-release-workspace">
   <div><h3 className="text-lg font-bold text-[#1F3B2D]">Review, price and activate products</h3><p className="text-sm text-stone-700">Every state and edition has its own independent review. Preview the complete document above, then activate the exact product only after educational and print checks are finished.</p></div>
   {products.length===0?<p className="text-sm">Create a document draft above to begin its release checklist.</p>:<label className="block text-sm font-semibold">Choose document product<select className={field} value={selected} onChange={e=>{setSelected(e.target.value);setError("");setMessage("");setReview({})}}><option value="">Select a product</option>{products.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>}
   {current&&<div className="border rounded-xl p-4 space-y-4 bg-white">
     <div><h4 className="font-semibold">{current.title}</h4><p className="text-sm">Current price: <strong>{money(current.price_cents)}</strong> · {current.visible?"Visible":"Hidden"} · {current.status} · {current.has_file?"PDF stored":"No static PDF"}</p></div>
     <button disabled={busy} type="button" onClick={setStandard} className="rounded-lg border border-[#1F3B2D] px-4 py-2 text-sm font-semibold">Set agreed standard price ({money(price[kindFor(current)])})</button>
     <h5 className="font-semibold">Document-specific quality review</h5>
     <p className="text-xs text-amber-900">A checkbox alone cannot substitute for actual independent assessment. Record truthful evidence and do not approve untested documents. Printed editions remain held until print proof and fulfilment tests pass.</p>
     <div className="space-y-2">{checks.map(([key,label])=><label className="flex items-start gap-2 text-sm" key={key}><input type="checkbox" checked={!!review[key]} onChange={e=>setReview(x=>({...x,[key]:e.target.checked}))}/><span>{label}</span></label>)}</div>
     <div className="grid sm:grid-cols-2 gap-3">
       <label className="block text-sm font-semibold">Independent reviewer<input className={field} value={reviewer} maxLength={120} onChange={e=>setReviewer(e.target.value)}/></label>
       <label className="block text-sm font-semibold">Date you verified official state guidance<input type="date" className={field} value={date} onChange={e=>setDate(e.target.value)}/></label>
     </div>
     <label className="block text-sm font-semibold">Review evidence and findings (40+ characters)<textarea className={field} rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Document-specific requirements reviewed, sample output checked, issues fixed, source URLs and review outcomes."/></label>
     <div className="flex flex-wrap gap-2">
       <button type="button" disabled={busy||checks.some(([key])=>!review[key])||reviewer.trim().length<3||notes.trim().length<40||!date} onClick={activate} className="rounded-lg bg-[#1F3B2D] text-white px-4 py-2 text-sm font-semibold disabled:opacity-40">Approve reviewed version and activate</button>
       <button type="button" disabled={busy} onClick={deactivate} className="rounded-lg border border-rose-500 text-rose-800 px-4 py-2 text-sm">Deactivate / return to draft</button>
     </div>
   </div>}
   {error&&<p role="alert" className="text-sm text-red-800">{error}</p>}
   {message&&<p role="status" className="text-sm text-emerald-800">{message}</p>}
 </section>;
}
