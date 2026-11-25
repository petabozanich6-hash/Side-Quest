import React,{useState,useEffect,useCallback} from "react";
const zone="Australia/Sydney";
const dayFmt=new Intl.DateTimeFormat("en-AU",{timeZone:"UTC",weekday:"long",day:"numeric",month:"short"});
const timeFmt=new Intl.DateTimeFormat("en-AU",{timeZone:zone,hour:"numeric",minute:"2-digit"});
export default function SupportPublicAvailability(){
 const [data,setData]=useState(null),[failed,setFailed]=useState(false),[busy,setBusy]=useState(false);
 const load=useCallback(async(signal)=>{
  setBusy(true);
  try{
   const r=await fetch("/api/support-availability",{cache:"no-store",signal});
   if(!r.ok)throw Error("Unavailable");
   const d=await r.json();if(!Array.isArray(d.days))throw Error("Invalid response");
   if(!signal.aborted){setData(d);setFailed(false);}
  }catch(e){if(!signal.aborted){setData(null);setFailed(true);}}
  finally{if(!signal.aborted)setBusy(false);}
 },[]);
 useEffect(()=>{
  let controller=new AbortController();
  const refresh=()=>{if(document.visibilityState!=="visible")return;controller.abort();controller=new AbortController();load(controller.signal);};
  refresh();const interval=setInterval(refresh,60000);document.addEventListener("visibilitychange",refresh);
  return()=>{clearInterval(interval);document.removeEventListener("visibilitychange",refresh);controller.abort();};
 },[load]);
 const available=data?.days?.some(d=>d.windows.length>0);
 return <section className="paper-card p-5 space-y-3" aria-label="Indicative tutoring availability">
  <div className="flex flex-wrap justify-between gap-2 items-center"><h2 className="font-display text-xl font-bold text-emerald-950">Indicative availability</h2>{busy&&<span className="text-xs text-stone-600">Checking availability…</span>}</div>
  <p className="text-sm">See potential times over the next four weeks (Sydney time). Daytime and limited evening availability may vary. This is a guide only, not a booking calendar. I will discuss your learner's needs, lesson length, price and suitable times with you before confirming any arrangements.</p>
  {failed?<p role="status" className="text-sm">Availability is temporarily unavailable. Please enquire about a suitable time.</p>:!data?<p className="text-sm">Checking available times…</p>:!data.published?<p className="text-sm">Online availability is not currently published. Please enquire about suitable times.</p>:<>
  {!available&&<p className="text-sm">No indicative windows are currently listed. You can still enquire about future availability or written support.</p>}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">{data.days.map(d=><div key={d.date} className={"rounded-lg border p-3 "+(d.windows.length?"border-stone-200 bg-white":"border-stone-300 bg-stone-200")}><h3 className="font-semibold text-sm">{dayFmt.format(new Date(d.date+"T12:00:00Z"))}</h3>{d.windows.length?<ul className="mt-2 space-y-1">{d.windows.map((w,i)=><React.Fragment key={w.start}>{i>0&&d.windows[i-1].end<w.start&&<li className="rounded bg-stone-200 px-2 py-1 text-xs text-stone-700">{timeFmt.format(new Date(d.windows[i-1].end))} – {timeFmt.format(new Date(w.start))} · Unavailable</li>}<li className="rounded bg-emerald-50 px-2 py-1 text-sm text-emerald-950">{timeFmt.format(new Date(w.start))} – {timeFmt.format(new Date(w.end))} · Indicative</li></React.Fragment>)}</ul>:<p className="mt-1 text-sm text-stone-700">Unavailable</p>}</div>)}</div>
  <p className="text-xs text-stone-600">Updates automatically while this page is open. Times may change and are not reserved by viewing them. Around seven days of preparation is preferred, but earlier times may be offered. Include preferred times in your enquiry.</p></>}
 </section>;
}
