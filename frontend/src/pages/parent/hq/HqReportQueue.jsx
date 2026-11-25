import React,{useState,useEffect} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import HqSupportStationery from "./HqSupportStationery";
const labels={no_progress:"No recorded observations",needs_review:"Ready to prepare report",saved:"Saved, awaiting email",sending:"Delivery unconfirmed — check",review:"Delivery requires review",sent:"Accepted for delivery"};
const date=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",weekday:"short",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
export default function HqReportQueue(){
 const [data,setData]=useState(null),[error,setError]=useState(""),[selected,setSelected]=useState(null),[showSent,setShowSent]=useState(false),[loading,setLoading]=useState(false);
 async function load(){setLoading(true);try{setData(await adminApi.get("/support-report-queue"));setError("");}catch(e){setError(errorText(e));}finally{setLoading(false);}}
 useEffect(()=>{load();},[]);
 const items=data?.items||[],pending=items.filter(x=>x.report_status!=="sent");
 const parentPath=o=>(o.channel==="guest"?"/support-guests/":"/feedback/")+encodeURIComponent(o.request_id);
 return <section className="border rounded-xl p-3 space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold">End-of-day learning reports</h4><button type="button" disabled={loading} className="underline text-sm" onClick={load}>Refresh queue</button></div>
 <p className="text-sm">Finished lessons appear here. Prepare a report from the saved progress, review it and send it to the verified parent. No automatic sending or sales recommendations.</p>
 {error&&<p role="alert" className="text-rose-800 text-sm">{error}</p>}{data&&<><p className="text-sm font-semibold">{pending.length} awaiting follow-up in the latest {items.length} ended lessons{data.truncated?" (list capped at 200; older lessons remain in their records)":""}.</p><label className="flex gap-2 text-sm"><input type="checkbox" checked={showSent} onChange={e=>setShowSent(e.target.checked)}/> Include sent reports</label>
 {(showSent?items:pending).map(o=><article key={o.id} className="border rounded-lg p-2 space-y-2"><strong className="text-sm">{o.learner_label||"Learner"} · {date.format(new Date(o.start_at))}</strong><p className="text-sm">{labels[o.report_status]||"Review status"}</p>{o.report_status!=="no_progress"&&<button type="button" className="underline text-sm font-bold" onClick={()=>setSelected(selected===o.id?null:o.id)}>{selected===o.id?"Close document tools":"Review report / correspondence"}</button>}{o.report_status==="no_progress"&&<p className="text-xs">Open the lesson diary to record only observations you actually made.</p>}{selected===o.id&&<HqSupportStationery key={o.id} path={parentPath(o)} orderId={o.id} initialOpen/>}</article>)}
 {!pending.length&&!showSent&&<p className="text-sm">No outstanding report follow-up in this list.</p>}</>}
 </section>;
}
