import React,{useState,useRef} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",field="rounded-lg border p-2 text-sm bg-white";
const times=Array.from({length:48},(_,i)=>String(Math.floor(i/2)).padStart(2,"0")+":"+(i%2?"30":"00"));
export default function HqPublicAvailability(){
 const [open,setOpen]=useState(false),[draft,setDraft]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const lock=useRef(false);
 async function run(fn){if(lock.current)return;lock.current=true;setBusy(true);setNotice("");setError("");try{await fn();}catch(e){setError(errorText(e));}finally{lock.current=false;setBusy(false);}}
 async function load(){setDraft(await adminApi.get("/support-public-availability"));}
 function update(index,key,value){setDraft(d=>({...d,windows:d.windows.map((w,i)=>i===index?{...w,[key]:value}:w)}));}
 function add(day){setDraft(d=>({...d,windows:[...d.windows,{day,start:"09:00",end:"12:00"}]}));}
 function remove(index){setDraft(d=>({...d,windows:d.windows.filter((w,i)=>i!==index)}));}
 return <section className="border rounded-xl p-3 space-y-3">
 <div className="flex flex-wrap justify-between gap-2 items-center"><h4 className="font-bold">Public availability settings</h4><button className={btn} type="button" disabled={busy} onClick={()=>{if(open&&draft&&!window.confirm("Close and discard unsaved changes?"))return;setOpen(!open);if(!open)run(load);else setDraft(null);}}>{open?"Close settings":"Manage public hours"}</button></div>
 <p className="text-sm">Publish indicative tutoring hours without allowing direct bookings. Confirmed and provisional appointments, prep and wrap-up buffers and private blocked times are excluded automatically.</p>
 {open&&<>{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}
 {!draft?<button type="button" className={btn} disabled={busy} onClick={()=>run(load)}>Load settings</button>:<form className="space-y-3" onSubmit={e=>{e.preventDefault();run(async()=>{setDraft(await adminApi.put("/support-public-availability",{...draft,confirmed:true}));setNotice("Public availability settings saved.");});}}>
 <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" disabled={busy} checked={draft.enabled} onChange={e=>setDraft(d=>({...d,enabled:e.target.checked}))}/> Publish indicative availability on Learning Support</label>
 <p className="text-xs">Set your usual weekly working windows in Sydney time. Add a separate window for a split day; use the existing private calendar blocks for holidays, appointments or personal commitments. No time is guaranteed or bookable from the public view.</p>
 {days.map((day,i)=><div key={day} className="border-t pt-2 space-y-2"><div className="flex justify-between items-center"><strong className="text-sm">{day}</strong><button type="button" className={btn} disabled={busy||draft.windows.length>=21||draft.windows.filter(w=>w.day===i).length>=3} onClick={()=>add(i)}>Add hours</button></div>
 {!draft.windows.some(w=>w.day===i)&&<p className="text-xs text-stone-500">Not available</p>}
 {draft.windows.map((w,j)=>w.day===i&&<div key={j} className="flex flex-wrap items-end gap-2"><label className="text-xs">From<select className={"block "+field} disabled={busy} value={w.start} onChange={e=>update(j,"start",e.target.value)}>{times.map(t=><option key={t}>{t}</option>)}</select></label><label className="text-xs">Until<select className={"block "+field} disabled={busy} value={w.end} onChange={e=>update(j,"end",e.target.value)}>{times.map(t=><option key={t}>{t}</option>)}</select></label><button type="button" className={btn} disabled={busy} onClick={()=>remove(j)}>Remove</button></div>)}
 </div>)}
 <div className="flex flex-wrap gap-2"><button type="submit" className="rounded-lg bg-emerald-950 text-white px-4 py-2 text-sm disabled:opacity-50" disabled={busy||draft.enabled&&!draft.windows.length}>Save availability settings</button><button type="button" className={btn} disabled={busy} onClick={()=>{if(window.confirm("Discard edits and reload saved hours?"))run(load);}}>Reload saved hours</button></div>
 <a href="/learning-support" target="_blank" rel="noopener noreferrer" className="block underline text-sm text-emerald-900">Preview public Learning Support page</a>
 </form>}</>}
 </section>;
}
