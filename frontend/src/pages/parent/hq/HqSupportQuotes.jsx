import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import HqSupportOrders from "./HqSupportOrders";
import HqQuotePlanEditor from "./HqQuotePlanEditor";
import SupportPlanView from "../SupportPlanView";
const initial={scope:"",delivery:"",price:"",days:"7",confirmed:false};
const money=c=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(c/100);
export default function HqSupportQuotes({id,closed,guest=false}){
 const [form,setForm]=useState(initial),[quotes,setQuotes]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [plan,setPlan]=useState(null),[review,setReview]=useState(false),[ai,setAi]=useState(false);
 const path=(guest?"/support-guests/":"/feedback/")+encodeURIComponent(id)+"/quotes";
 async function load(){try{const r=await adminApi.get(path);setQuotes(r.quotes||[]);setAi(r.ai_enabled===true);setError("");}catch(e){setError(errorText(e,"Could not load proposals"));}}
 useEffect(()=>{load();},[id]);
 const change=(key,val)=>setForm(f=>({...f,[key]:val}));
 async function send(e){e.preventDefault();if(busy||!form.confirmed||!/^\d+(\.\d{1,2})?$/.test(form.price))return;setBusy(true);setError("");try{await adminApi.post(path,{scope:form.scope,delivery:form.delivery,amount_cents:Math.round(Number(form.price)*100),valid_days:Number(form.days),confirmed:true,plan,plan_reviewed:review});setForm(initial);setPlan(null);setReview(false);await load();}catch(e){setError(errorText(e));}finally{setBusy(false);}}
 async function withdraw(q){if(busy||!window.confirm("Withdraw this proposal? No payment or booking will be cancelled."))return;setBusy(true);try{await adminApi.post(path+"/"+encodeURIComponent(q.id)+"/withdraw",{confirmed:true});await load();}catch(e){setError(errorText(e));}finally{setBusy(false);}}
 const open=(quotes||[]).some(q=>["offered","interested","expired"].includes(q.status));
 const field="w-full border border-stone-300 rounded-lg bg-white p-2 text-sm";
 return <section className="border-t border-stone-200 pt-4 space-y-3" aria-label="Learning support proposals">
 <div className="flex justify-between items-center"><h4 className="font-bold">Learning support proposals</h4><button type="button" onClick={load} className="text-xs underline">Refresh</button></div>
 <p className="text-xs text-stone-600">Scope and total price in AUD. These are non-binding proposals; no automatic payment or booking is created. Confirm safeguarding and service terms before arranging paid work.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}
 {!quotes&&!error&&<p role="status">Loading proposals…</p>}
 {(quotes||[]).map(q=><div key={q.id} className="border rounded-lg p-3 space-y-2 bg-stone-50"><div className="flex flex-wrap justify-between"><strong>{money(q.amount_cents)} AUD</strong><span className="text-sm capitalize">{q.status}</span></div><p className="text-sm whitespace-pre-wrap break-words">{q.scope}</p><p className="text-sm whitespace-pre-wrap break-words">{q.delivery}</p><p className="text-xs">Valid until {new Date(q.expires_at).toLocaleString("en-AU")}</p><SupportPlanView owner load={()=>adminApi.get(path+"/"+q.id+"/plan")}/>{["offered","interested","expired"].includes(q.status)&&<button type="button" disabled={busy} onClick={()=>withdraw(q)} className="text-sm underline text-rose-800">Withdraw proposal</button>}</div>)}
 {quotes&&!open&&!closed&&<form onSubmit={send} className="space-y-3"><HqQuotePlanEditor plan={plan} setPlan={setPlan} review={review} setReview={setReview} ai={ai}/><label className="block text-sm font-semibold">Scope<textarea required minLength={10} maxLength={1500} rows={3} value={form.scope} onChange={e=>change("scope",e.target.value)} className={field}/></label><label className="block text-sm font-semibold">Delivery / proposed timing<textarea required minLength={3} maxLength={500} rows={2} value={form.delivery} onChange={e=>change("delivery",e.target.value)} className={field}/></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Total (AUD)<input required type="number" min="0" max="10000" step="0.01" value={form.price} onChange={e=>change("price",e.target.value)} className={field}/></label><label className="text-sm font-semibold">Valid for (days)<input required type="number" min="1" max="30" step="1" value={form.days} onChange={e=>change("days",e.target.value)} className={field}/></label></div><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.confirmed} onChange={e=>change("confirmed",e.target.checked)} required/> This is a non-binding proposal, not a charge or confirmed appointment.</label><button type="submit" disabled={busy||!form.confirmed||!!plan&&!review} className="rounded-full bg-emerald-950 text-white font-bold text-sm px-4 py-2 disabled:opacity-50">Send proposal</button></form>}
 {quotes&&<HqSupportOrders id={id} guest={guest} quotes={quotes} closed={closed}/>}
 </section>;
}
