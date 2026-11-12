import React,{useEffect,useState} from "react";
import {api} from "../../../lib/api";
import HqDocumentProducts from "./HqDocumentProducts";
import HqStudioPublisher from "./HqStudioPublisher";
const input="w-full rounded-xl border border-stone-300 bg-white p-2 text-sm";
export default function HqDocumentStudio(){
 const [data,setData]=useState(null),[selected,setSelected]=useState("NSW"),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;api.get("/home-education/document-requirements").then(({data})=>{if(active)setData(data)}).catch(()=>{if(active)setError("Could not load the existing jurisdiction requirements.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const jur=data?.jurisdictions?.find(j=>j.code===selected);
 return <div className="space-y-5" data-testid="hq-document-studio">
  <header className="paper-card p-5 space-y-3">
   <p className="text-xs font-semibold tracking-widest text-[#4A5D3A]">SIDE-QUEST · OWNER HQ</p>
   <h2 className="text-2xl font-bold text-[#1F3B2D]">Document Studio</h2>
   <p className="text-sm">Create beautiful, usable PDF products in Owner HQ, download the printable and digitally fillable editions, then upload them manually to Square. Square manages sales and payments.</p>
   {loading&&<p role="status" className="text-sm">Loading state requirements…</p>}
   {error&&<p role="alert" className="text-red-800">{error}</p>}
   {data&&<label className="block max-w-md text-sm font-semibold">Choose the state or territory
    <select className={input} value={selected} onChange={e=>setSelected(e.target.value)}>
     {data.jurisdictions.filter(j=>j.code!=="OTHER").map(j=><option key={j.code} value={j.code}>{j.name}</option>)}
    </select></label>}
  </header>
  <HqStudioPublisher/>
  <details className="paper-card p-5 space-y-3">
   <summary className="font-semibold text-lg cursor-pointer">Legacy Side-Quest document listings and release controls</summary>
   <p className="text-sm text-stone-700 pt-3">These older shop controls are retained for existing products, but they are not needed when creating files for Square.</p>
   <section className="space-y-2">
   <h3 className="text-lg font-bold text-[#1F3B2D]">Previous document prices</h3>
   <p className="text-sm">Basic: blank fillable $4.99 (+$1 per extra child); guided personalised $9.99 (+$2 per extra child); basic printed $14.99 delivered (+$2 per extra child).</p>
   <p className="text-sm">Complete Planner & Diary: blank family PDF $29.95; personalised family PDF $39.95; personalised spiral-bound printed family edition $69.95, delivery included.</p>
   <p className="text-xs text-stone-600">These are agreed standard prices for new drafts. The actual price and activation state of every existing product appears below. Prices aren't changed without an explicit action.</p>
   </section>
   <HqDocumentProducts jurisdiction={jur}/>
  </details>
  <details className="paper-card p-5 space-y-3">
   <summary className="font-semibold text-lg cursor-pointer">Official state requirements and learning areas</summary>
   {jur&&<div className="space-y-4 pt-4 text-sm">
    <p className="text-amber-900 font-semibold">Existing Side-Quest requirements last checked: {data.checked_on}. Reconfirm directly with the authority before release.</p>
    <p><strong>Education authority:</strong> {jur.authority}</p>
    <p><strong>Document terminology:</strong> {jur.plan_name}</p>
    <p>{jur.curriculum}</p>
    <div className="grid md:grid-cols-2 gap-4">
     <div><h4 className="font-semibold">Requirements checklist</h4><ul className="list-disc pl-5 space-y-1">{jur.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
     <div><h4 className="font-semibold">Learning areas</h4><ul className="list-disc pl-5 space-y-1">{jur.areas.map((a,i)=><li key={i}>{a}</li>)}</ul>{jur.secondary&&<p>{jur.secondary.note}</p>}</div>
    </div>
    <h4 className="font-semibold">Official source references</h4>
    <ul className="space-y-1">{jur.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline text-[#4A5D3A]">{s.title}</a></li>)}</ul>
   </div>}
  </details>
  <section className="paper-card p-5 text-sm space-y-2">
   <h3 className="font-semibold text-lg">Product quality standard</h3>
   <p>Families should never pay for incomplete or misleading documents. Verify jurisdiction rules, syllabus requirements, educational substance, practical usefulness and full PDF layout independently before activation. Official government forms remain available free from their issuing authorities.</p>
   <p className="text-amber-900">Printed products remain held until actual proofs, binding, secure printing, packaging and fulfilment are tested. Activating a product in the shop is not a claim of government endorsement.</p>
  </section>
 </div>;
}
