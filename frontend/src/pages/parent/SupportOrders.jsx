import React,{useEffect,useState} from "react";
import {apiErrorMessage} from "../../lib/api";
import SupportClassroom from "./SupportClassroom";
import SupportSharedFiles from "./SupportSharedFiles";
const fmt=c=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(c/100);
export default function SupportOrders({id,client,basePath,closed}){
 const path=basePath+encodeURIComponent(id)+"/orders";
 const [classroomEnabled,setClassroomEnabled]=useState(false),[room,setRoom]=useState(null);
 const [orders,setOrders]=useState([]),[checked,setChecked]=useState({}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function load(){try{const r=await client.get(path);setOrders(r.data.orders||[]);setClassroomEnabled(r.data.classroom_enabled===true);setError("");}catch(e){setError(apiErrorMessage(e,"Could not load arrangements"));}}
 useEffect(()=>{load();},[path,client]);
 async function confirm(o){if(busy||!checked[o.id])return;setBusy(true);try{await client.post(path+"/"+o.id+"/confirm",{confirmed:true});await load();}catch(e){setError(apiErrorMessage(e));}finally{setBusy(false);}}
 return <div className="space-y-2">{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}<button type="button" onClick={load} className="underline text-xs">Check service arrangements</button>
 {orders.map(o=><section key={o.id} className="rounded-xl border p-4 space-y-2"><h3 className="font-bold">Service arrangements · {fmt(o.amount_cents)} AUD</h3><p className="text-sm font-semibold">{o.status==="confirmed"?(o.invoice_overdue?"Payment deadline passed — contact Side-Quest":"Provisional — awaiting payment"):o.status==="paid"?"Booking confirmed":o.status.replaceAll("_"," ")}</p><p className="text-sm whitespace-pre-wrap">{o.scope}</p><p className="text-sm">{o.start_at?new Date(o.start_at).toLocaleString("en-AU")+" – "+new Date(o.end_at).toLocaleTimeString("en-AU")+" (your device time zone)":o.delivery}</p><p className="text-sm whitespace-pre-wrap">{o.terms}</p>
 {o.status==="awaiting_confirmation"&&!closed&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={!!checked[o.id]} onChange={e=>setChecked(v=>({...v,[o.id]:e.target.checked}))}/> I agree to these service arrangements and terms.</label><button disabled={busy||!checked[o.id]} onClick={()=>confirm(o)} className="rounded-full bg-emerald-950 text-white px-4 py-2 disabled:opacity-50">Confirm arrangements</button></>}
 {o.status==="confirmed"&&<p className="text-sm">{o.invoice_reference?<>Square invoice {o.invoice_reference} has been sent separately by email. Payment due {new Date(o.payment_due_at).toLocaleString("en-AU")}. Your booking is provisional until Side-Quest checks payment.</>:o.legacy_checkout?"Contact Side-Quest to reconcile the previous checkout. Do not pay twice.":"Your arrangements are provisional. Side-Quest will send a Square invoice separately."}</p>}
 {o.status==="paid"&&<p className="text-sm">Booking confirmed. Payment has been checked (or no charge applies).</p>}{o.status==="review"&&<p className="text-sm">Payment needs review. Please contact Side-Quest before making another payment.</p>}
 {["paid","completed"].includes(o.status)&&!o.legacy_checkout&&<SupportSharedFiles path={path+"/"+o.id} client={client}/>}
 {classroomEnabled&&o.mode==="live"&&o.status==="paid"&&<button type="button" className="rounded-full bg-emerald-950 text-white px-4 py-2" onClick={()=>setRoom(o.id)}>Open teaching workspace</button>}
 {room===o.id&&<SupportClassroom path={path+"/"+o.id} client={client} onExit={()=>setRoom(null)}/>}
 </section>)}</div>;
}
