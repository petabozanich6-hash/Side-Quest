import React from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {useEffect,useState} from "react";
const number=n=>Number(n||0).toLocaleString("en-AU");
export default function HqTraffic(){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const load=async()=>{setBusy(true);setError("");try{setData(await adminApi.get("/traffic"))}catch(e){setError(errorText(e,"Could not load site views"))}finally{setBusy(false)}};
 useEffect(()=>{load()},[]);
 const max=Math.max(1,...(data?.trend||[]).map(x=>x.views));
 return <section className="space-y-5" data-testid="hq-site-views">
  <header className="flex justify-between gap-3 items-start"><div><h2 className="text-2xl font-bold text-[#1F3B2D]">Site Views</h2><p className="text-sm text-stone-600">Anonymous public-site traffic over the last 30 days.</p></div><button type="button" disabled={busy} onClick={load} className="rounded-xl border px-3 py-2 text-sm font-semibold">Refresh</button></header>
  {error&&<p role="alert" className="text-rose-700">{error}</p>}
  {!data&&!error&&<p>Loading site views…</p>}
  {data&&<><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[["Views today",data.today_views],["Visits today",data.today_estimated_visits],["Views · 30 days",data.views],["Visits · 30 days",data.estimated_visits]].map(([title,value])=><div key={title} className="paper-card p-4"><p className="text-xs text-stone-600">{title}</p><p className="text-2xl font-bold text-[#1F3B2D]">{number(value)}</p></div>)}</div>
   <section className="paper-card p-4 space-y-3"><h3 className="text-lg font-bold">Daily page views</h3><div className="flex items-end gap-1 h-36" role="img" aria-label="Page views by day">{data.trend.map(x=><div key={x.day} className="flex-1 min-w-1 h-full flex flex-col justify-end" title={x.day+": "+x.views+" views"}><div style={{height:Math.max(2,x.views/max*100)+"%",backgroundColor:"#4A5D3A"}} className="rounded-t-sm"/></div>)}</div><p className="text-xs text-stone-500">Days with no recorded views are not shown as bars. Dates are recorded in UTC.</p></section>
   <section className="paper-card p-4 space-y-3"><h3 className="text-lg font-bold">Most visited pages</h3>{data.top_pages.length===0?<p className="text-sm">No visits recorded yet.</p>:<table className="w-full text-sm"><thead><tr className="text-left border-b"><th className="py-2">Page</th><th className="text-right">Views</th></tr></thead><tbody>{data.top_pages.map(p=><tr className="border-b" key={p.path}><td className="py-2 break-all">{p.path}</td><td className="text-right font-semibold">{number(p.views)}</td></tr>)}</tbody></table>}</section>
   <p className="text-xs text-stone-600">{data.note} Sessions may be counted again on a new tab or after a browser restart. No page analytics are collected for private parent, child or Owner HQ screens.</p>
  </>}
 </section>;
}
