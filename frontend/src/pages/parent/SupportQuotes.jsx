import React,{useEffect,useState} from "react";
import {api,apiErrorMessage} from "../../lib/api";
import SupportOrders from "./SupportOrders";
import SupportPlanView from "./SupportPlanView";
import SupportSlotPicker from "./SupportSlotPicker";
import {saveSupportFile} from "../../lib/supportFileDownload";
const money=c=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(c/100);
export default function SupportQuotes({id,closed,initialQuotes,client=api,basePath="/learning-support/"}){
 const [ordersVersion,setOrdersVersion]=useState(0);
 const [quotes,setQuotes]=useState(initialQuotes??null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[confirm,setConfirm]=useState({});
 async function load(){try{const r=await client.get(basePath+encodeURIComponent(id)+"/quotes");setQuotes(r.data.quotes||[]);setError("");}catch(e){setError(apiErrorMessage(e,"Could not load proposals"));}}
 useEffect(()=>{if(Array.isArray(initialQuotes)){setQuotes(initialQuotes);setError("");}else{load();}},[id,initialQuotes]);
 async function respond(q,response){if(busy||!confirm[q.id])return;setBusy(true);setError("");try{await client.post(basePath+encodeURIComponent(id)+"/quotes/"+encodeURIComponent(q.id)+"/respond",{response,confirmed:true});setConfirm({});await load();}catch(e){setError(apiErrorMessage(e));}finally{setBusy(false);}}
 async function download(q,agreement=false){if(busy)return;setBusy(true);setError("");try{const r=await client.get(basePath+encodeURIComponent(id)+"/quotes/"+encodeURIComponent(q.id)+"/document");if(agreement&&!r.data.terms)throw Error("The service agreement is not yet available. Please contact Side-Quest before booking.");saveSupportFile(agreement?r.data.terms:r.data);}catch(e){setError(apiErrorMessage(e,e.message||"Could not download document"));}finally{setBusy(false);}}
 if(!quotes&&!error)return <p role="status" className="text-xs text-stone-600">Checking proposals…</p>;
 return <div className="space-y-3">
 {error&&<p role="alert" className="text-sm text-rose-800">{error} <button type="button" onClick={load} className="underline">Refresh</button></p>}
 {quotes?.length>0&&<button type="button" onClick={load} className="text-xs underline">Refresh proposals</button>}
 {(quotes||[]).map(q=><section key={q.id} className="border border-emerald-200 rounded-xl bg-emerald-50 p-4 space-y-2" aria-label="Learning support proposal">
 <div className="flex flex-wrap justify-between gap-2"><strong>Learning support proposal</strong><span className="font-bold">{money(q.amount_cents)} AUD</span></div>
 <p className="text-xs font-semibold capitalize">{q.status==="interested"?"Interest confirmed":q.status} · valid until {new Date(q.expires_at).toLocaleString("en-AU")}</p>
 <p className="text-sm whitespace-pre-wrap break-words">{q.scope}</p><p className="text-sm whitespace-pre-wrap break-words"><strong>Delivery:</strong> {q.delivery}</p><SupportPlanView load={()=>client.get(basePath+encodeURIComponent(id)+"/quotes/"+encodeURIComponent(q.id)+"/plan")}/>
 {basePath==="/requests/"&&<div className="flex flex-wrap gap-3"><button type="button" disabled={busy} className="text-sm underline" onClick={()=>download(q)}>Download printable proposal (PDF)</button><button type="button" disabled={busy} className="text-sm underline" onClick={()=>download(q,true)}>Download service agreement (PDF)</button></div>}
 {q.status==="offered"&&!closed&&<><label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={!!confirm[q.id]} onChange={e=>setConfirm(v=>({...v,[q.id]:e.target.checked}))}/> I have reviewed the proposal. Expressing interest does not charge me or confirm a booking.</label><div className="flex flex-wrap gap-2"><button type="button" disabled={busy||!confirm[q.id]} onClick={()=>respond(q,"interested")} className="rounded-full px-4 py-2 bg-emerald-950 text-white text-sm font-bold disabled:opacity-50">I'd like to proceed</button><button type="button" disabled={busy||!confirm[q.id]} onClick={()=>respond(q,"declined")} className="rounded-full border border-stone-400 px-4 py-2 text-sm disabled:opacity-50">Decline</button></div></>}
 {!closed&&["offered","interested"].includes(q.status)&&<SupportSlotPicker proposalStatus={q.status} path={basePath+encodeURIComponent(id)+"/quotes/"+encodeURIComponent(q.id)+"/slots"} client={client} onSelected={()=>setOrdersVersion(v=>v+1)}/>}
 {q.status==="interested"&&<p className="text-sm">Your interest has been recorded. Choose a time above if one is offered, then confirm the arrangements below.</p>}
 </section>)}
 {quotes?.some(q=>q.status==="interested")&&<SupportOrders key={ordersVersion} id={id} client={client} basePath={basePath} closed={closed}/>}
 </div>;
}
