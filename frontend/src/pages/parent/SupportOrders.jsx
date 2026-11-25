import React,{useEffect,useState} from "react";
import {apiErrorMessage} from "../../lib/api";
const fmt=c=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(c/100);
export default function SupportOrders({id,client,basePath,closed}){
 const path=basePath+encodeURIComponent(id)+"/orders";
 const [orders,setOrders]=useState([]),[checked,setChecked]=useState({}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function load(){try{const r=await client.get(path);setOrders(r.data.orders||[]);setError("");}catch(e){setError(apiErrorMessage(e,"Could not load arrangements"));}}
 useEffect(()=>{load();},[path,client]);
 async function confirm(o){if(busy||!checked[o.id])return;setBusy(true);try{await client.post(path+"/"+o.id+"/confirm",{confirmed:true});await load();}catch(e){setError(apiErrorMessage(e));}finally{setBusy(false);}}
 return <div className="space-y-2">{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}<button type="button" onClick={load} className="underline text-xs">Check service arrangements</button>
 {orders.map(o=><section key={o.id} className="rounded-xl border p-4 space-y-2"><h3 className="font-bold">Service arrangements · {fmt(o.amount_cents)} AUD</h3><p className="text-sm capitalize">{o.status.replaceAll("_"," ")}</p><p className="text-sm whitespace-pre-wrap">{o.scope}</p><p className="text-sm">{o.start_at?new Date(o.start_at).toLocaleString("en-AU")+" – "+new Date(o.end_at).toLocaleTimeString("en-AU")+" (your device time zone)":o.delivery}</p><p className="text-sm whitespace-pre-wrap">{o.terms}</p>
 {o.status==="awaiting_confirmation"&&!closed&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={!!checked[o.id]} onChange={e=>setChecked(v=>({...v,[o.id]:e.target.checked}))}/> I agree to these service arrangements and terms.</label><button disabled={busy||!checked[o.id]} onClick={()=>confirm(o)} className="rounded-full bg-emerald-950 text-white px-4 py-2 disabled:opacity-50">Confirm arrangements</button></>}
 {o.status==="confirmed"&&(o.checkout_url?<a href={o.checkout_url} target="_blank" rel="noopener noreferrer" className="underline font-bold">Open Square test checkout</a>:<p className="text-sm">Awaiting payment instructions. Your session is not yet confirmed as paid.</p>)}
 {o.status==="paid"&&<p className="text-sm">Payment confirmed (or no charge). Classroom access will be provided separately.</p>}{o.status==="review"&&<p className="text-sm">Payment needs review. Please contact Side-Quest before making another payment.</p>}
 </section>)}</div>;
}
