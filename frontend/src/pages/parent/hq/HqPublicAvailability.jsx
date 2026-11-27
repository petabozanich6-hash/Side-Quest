import React,{useState,useRef,useEffect} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",field="rounded-lg border p-2 text-sm bg-white";
const times=Array.from({length:48},(_,i)=>String(Math.floor(i/2)).padStart(2,"0")+":"+(i%2?"30":"00"));
export default function HqPublicAvailability({onSaved,focused=false}={}){
 const [open,setOpen]=useState(focused),[draft,setDraft]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const lock=useRef(false);
 const [overrideDate,setOverrideDate]=useState(""),[weekDate,setWeekDate]=useState("");
 const policyUpdate=patch=>setDraft(d=>({...d,policy:{...d.policy,...patch}}));
 const updateDate=(i,patch)=>setDraft(d=>({...d,policy:{...d.policy,date_overrides:d.policy.date_overrides.map((v,j)=>i===j?{...v,...patch}:v)}}));
 async function run(fn){if(lock.current)return;lock.current=true;setBusy(true);setNotice("");setError("");try{await fn();}catch(e){setError(errorText(e));}finally{lock.current=false;setBusy(false);}}
 async function load(){setDraft(await adminApi.get("/support-public-availability"));}
 useEffect(()=>{if(focused)run(load);},[focused]);
 function update(index,key,value){setDraft(d=>({...d,windows:d.windows.map((w,i)=>i===index?{...w,[key]:value}:w)}));}
 function add(day){setDraft(d=>({...d,windows:[...d.windows,{day,start:"09:00",end:"12:00"}]}));}
 function remove(index){setDraft(d=>({...d,windows:d.windows.filter((w,i)=>i!==index)}));}
 return <section className="border rounded-xl p-3 space-y-3">
 <div className="flex flex-wrap justify-between gap-2 items-center"><h4 className="font-bold">Public availability settings</h4>{!focused&&<button className={btn} type="button" disabled={busy} onClick={()=>{if(open&&draft&&!window.confirm("Close and discard unsaved changes?"))return;setOpen(!open);if(!open)run(load);else setDraft(null);}}>{open?"Close settings":"Manage public hours"}</button>}</div>
 <p className="text-sm">Manage available tutoring hours and booking capacity. Confirmed and provisional appointments, prep and wrap-up buffers and private blocked times are excluded automatically.</p>
 {open&&<>{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}
 {!draft?<button type="button" className={btn} disabled={busy} onClick={()=>run(load)}>Load settings</button>:<form className="space-y-3" onSubmit={e=>{e.preventDefault();run(async()=>{setDraft(await adminApi.put("/support-public-availability",{...draft,confirmed:true}));setNotice("Public availability settings saved.");onSaved?.();});}}>
 <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" disabled={busy} checked={draft.enabled} onChange={e=>setDraft(d=>({...d,enabled:e.target.checked}))}/> Publish indicative availability on Learning Support</label>
 <p className="text-xs">Set your regular Sydney hours around your timetable. Preparation and wrap-up must fit inside the hours. Individual date overrides replace the regular hours, and weekly overrides adjust capacity. Existing reservations are never cancelled by changing settings.</p>
 {days.map((day,i)=><div key={day} className="border-t pt-2 space-y-2"><div className="flex justify-between items-center"><strong className="text-sm">{day}</strong><button type="button" className={btn} disabled={busy||draft.windows.length>=21||draft.windows.filter(w=>w.day===i).length>=3} onClick={()=>add(i)}>Add hours</button></div>
 {!draft.windows.some(w=>w.day===i)&&<p className="text-xs text-stone-500">Not available</p>}
 {draft.windows.map((w,j)=>w.day===i&&<div key={j} className="flex flex-wrap items-end gap-2"><label className="text-xs">From<select className={"block "+field} disabled={busy} value={w.start} onChange={e=>update(j,"start",e.target.value)}>{times.map(t=><option key={t}>{t}</option>)}</select></label><label className="text-xs">Until<select className={"block "+field} disabled={busy} value={w.end} onChange={e=>update(j,"end",e.target.value)}>{times.map(t=><option key={t}>{t}</option>)}</select></label><button type="button" className={btn} disabled={busy} onClick={()=>remove(j)}>Remove</button></div>)}
 </div>)}
 <div className="border-t pt-3 space-y-3"><h5 className="font-bold">Workload limits</h5>
 <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.policy.enforced} onChange={e=>policyUpdate({enforced:e.target.checked})}/> Enforce hours and limits even when public availability is unpublished</label>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{[["weekly_limit","Weekly maximum",30],["daily_limit","Daily maximum",12],["evening_limit","Evening maximum per day (5 pm onwards)",12]].map(([k,label,max])=><label key={k} className="text-xs">{label}<input className={"block w-full "+field} type="number" min={0} max={max} required value={draft.policy[k]} onChange={e=>policyUpdate({[k]:Number(e.target.value)})}/></label>)}</div>
 <p className="text-xs">Non-cancelled live sessions count, including provisional reservations and completed lessons in that Monday–Sunday week. Written work is quoted separately.</p>
 <h5 className="font-bold">Individual dates — replace regular hours</h5><p className="text-xs">Use no hours or a maximum of zero to close a day, or add a one-off evening.</p>
 <div className="flex flex-wrap gap-2"><input aria-label="Override date" className={field} type="date" value={overrideDate} onChange={e=>setOverrideDate(e.target.value)}/><button type="button" className={btn} disabled={busy||!overrideDate||draft.policy.date_overrides.some(d=>d.date===overrideDate)} onClick={()=>policyUpdate({date_overrides:[...draft.policy.date_overrides,{date:overrideDate,windows:[{start:"18:00",end:"19:30"}],limit:1}]})}>Add date override</button></div>
 {draft.policy.date_overrides.map((d,i)=><div key={d.date} className="border rounded p-2 space-y-2"><div className="flex flex-wrap gap-2 items-center"><strong>{d.date}</strong><label className="text-xs">Maximum <input className={field+" w-16"} type="number" min={0} max={12} value={d.limit} onChange={e=>updateDate(i,{limit:Number(e.target.value)})}/></label><button type="button" className={btn} onClick={()=>policyUpdate({date_overrides:draft.policy.date_overrides.filter((_,j)=>j!==i)})}>Use regular hours</button></div>
 {d.windows.map((w,j)=><div className="flex flex-wrap items-center gap-2" key={j}>{["start","end"].map(k=><label key={k} className="text-xs">{k==="start"?"From":"Until"}<select className={"block "+field} value={w[k]} onChange={e=>updateDate(i,{windows:d.windows.map((x,l)=>j===l?{...x,[k]:e.target.value}:x)})}>{times.map(x=><option key={x}>{x}</option>)}</select></label>)}<button type="button" className={btn} onClick={()=>updateDate(i,{windows:d.windows.filter((_,l)=>l!==j)})}>Remove hours</button></div>)}
 <button type="button" className={btn} disabled={d.windows.length>=3} onClick={()=>updateDate(i,{windows:[...d.windows,{start:"09:00",end:"13:00"}]})}>Add hours</button></div>)}
 <h5 className="font-bold">Assessment, placement and holiday weeks</h5><p className="text-xs">Choose a Monday. Set 0 to close a week, 2 for heavy assessments or up to 6 during a break. This changes capacity, not regular hours.</p>
 <div className="flex flex-wrap gap-2"><input aria-label="Week starting Monday" type="date" className={field} value={weekDate} onChange={e=>setWeekDate(e.target.value)}/><button type="button" className={btn} disabled={!weekDate||new Date(weekDate+"T00:00:00Z").getUTCDay()!==1||draft.policy.week_overrides.some(w=>w.monday===weekDate)} onClick={()=>policyUpdate({week_overrides:[...draft.policy.week_overrides,{monday:weekDate,limit:2}]})}>Add week override</button></div>
 {draft.policy.week_overrides.map((w,i)=><div className="flex flex-wrap items-center gap-2" key={w.monday}><strong>{w.monday}</strong><label className="text-xs">Weekly maximum <input type="number" min={0} max={30} className={field+" w-20"} value={w.limit} onChange={e=>policyUpdate({week_overrides:draft.policy.week_overrides.map((x,j)=>j===i?{...x,limit:Number(e.target.value)}:x)})}/></label><button type="button" className={btn} onClick={()=>policyUpdate({week_overrides:draft.policy.week_overrides.filter((_,j)=>j!==i)})}>Use regular limit</button></div>)}
 </div>
 <div className="flex flex-wrap gap-2"><button type="submit" className="rounded-lg bg-emerald-950 text-white px-4 py-2 text-sm disabled:opacity-50" disabled={busy||draft.enabled&&!draft.windows.length&&!draft.policy.date_overrides.some(d=>d.windows.length)}>Save availability settings</button><button type="button" className={btn} disabled={busy} onClick={()=>{if(window.confirm("Discard edits and reload saved hours?"))run(load);}}>Reload saved hours</button></div>
 <a href="/learning-support" target="_blank" rel="noopener noreferrer" className="block underline text-sm text-emerald-900">Preview public Learning Support page</a>
 </form>}</>}
 </section>;
}
