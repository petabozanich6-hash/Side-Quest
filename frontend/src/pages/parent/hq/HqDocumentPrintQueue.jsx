import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {api} from "../../../lib/api";
const statuses=[["ready","Ready to review"],["sent_to_printer","Sent to print supplier"],["printed","Printed and bound"],["dispatched","Dispatched"],["complete","Complete"]];
export default function HqDocumentPrintQueue(){
 const [jobs,setJobs]=useState([]),[busy,setBusy]=useState(""),[error,setError]=useState("");
 const load=async()=>{try{const d=await adminApi.get("/document-studio/print-jobs");setJobs(d.jobs||[])}catch(e){setError(errorText(e,"Could not load print jobs."))}};
 useEffect(()=>{load()},[]);
 const pdf=async(job)=>{
   setBusy(job.id);setError("");
   try{
     const r=await api.get("/admin/document-studio/print-jobs/"+encodeURIComponent(job.id)+"/pdf",{headers:{"X-SideQuest-Admin":"1"},responseType:"blob"});
     const url=URL.createObjectURL(new Blob([r.data],{type:"application/pdf"}));
     const a=document.createElement("a");a.href=url;a.download="sidequest-print-order-"+job.order_id.slice(0,8)+".pdf";a.click();
     setTimeout(()=>URL.revokeObjectURL(url),30000);
   }catch(e){setError(errorText(e,"Could not download the private print file."))}finally{setBusy("")}
 };
 const update=async(job,status)=>{setBusy(job.id);setError("");try{await adminApi.post("/document-studio/print-jobs/"+encodeURIComponent(job.id)+"/status",{status});await load()}catch(e){setError(errorText(e))}finally{setBusy("")}};
 const erase=async(job)=>{if(!window.confirm("Delete the completed family PDF from private storage? This cannot be undone."))return;setBusy(job.id);setError("");try{await adminApi.post("/document-studio/print-jobs/"+encodeURIComponent(job.id)+"/delete-pdf",{confirm:true});await load()}catch(e){setError(errorText(e))}finally{setBusy("")}};
 return <section className="paper-card p-5 space-y-4" data-testid="document-print-queue">
  <div><h3 className="text-lg font-bold text-[#1F3B2D]">Spiral-bound planner printing queue</h3><p className="text-sm">Paid families' finished PDF files arrive here privately after they approve their details. Download the print-ready file, arrange printing and binding, then update progress. These files contain children's personal information; share only with your chosen printer using secure transfer.</p></div>
  <button type="button" className="text-sm underline" onClick={load}>Refresh printing queue</button>
  {jobs.length===0&&<p className="text-sm text-stone-600">No submitted print jobs.</p>}
  {jobs.map(job=><article key={job.id} className="rounded-xl border p-4 space-y-3 bg-white">
   <div><strong>{job.title}</strong><p className="text-sm">Order {job.order_id.slice(0,8)} · {job.email} · {new Date(job.submitted_at).toLocaleDateString("en-AU")}</p></div>
   <p className="text-xs text-stone-600">Shipping: {job.shipping?Object.values(job.shipping).filter(x=>typeof x==="string"&&x.trim()).join(", "):"Review delivery details in Shop Orders"}</p>
   <div className="flex flex-wrap items-end gap-3">{job.pdf_available?<button disabled={busy===job.id} type="button" onClick={()=>pdf(job)} className="rounded-lg bg-[#1F3B2D] px-4 py-2 text-sm text-white font-semibold">Download private print PDF</button>:<span className="text-xs text-stone-500">Private PDF deleted</span>}
    <label className="text-sm font-semibold">Production status<select className="block border rounded-lg p-2 bg-white mt-1" disabled={busy===job.id} value={job.status} onChange={e=>update(job,e.target.value)}>{statuses.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   </div>
   {job.status==="complete"&&!!job.pdf_available&&<button type="button" disabled={busy===job.id} onClick={()=>erase(job)} className="text-xs underline text-rose-800">Delete completed private PDF</button>}
  </article>)}
  {error&&<p role="alert" className="text-red-800 text-sm">{error}</p>}
 </section>;
}
