import React,{useEffect,useRef,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
const labels=["What we covered","Strengths and progress","Areas to practise","Optional home learning"],btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50";
export default function HqFamilyProgressReport({kind,sessionId,seatId}){
 const path="/activity-reports/"+kind+"/"+encodeURIComponent(sessionId)+"/"+encodeURIComponent(seatId);
 const [open,setOpen]=useState(false),[report,setReport]=useState(null),[sections,setSections]=useState([]),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const lock=useRef(false),generation=useRef(0);
 useEffect(()=>()=>{generation.current++;},[path]);
 const dirty=report&&JSON.stringify(sections)!==JSON.stringify(report.sections);
 async function run(action){
  if(lock.current)return;lock.current=true;setBusy(true);setError("");setNotice("");const n=++generation.current;
  try{const r=action?await adminApi.post(path,{action,revision:report.revision,sections,confirmed}):await adminApi.get(path);
   if(n!==generation.current)return;setReport(r);setSections(r.sections);setConfirmed(false);
   if(action)setNotice(action==="save"?"Private report draft saved.":action==="publish"?"Reviewed report published to the family portal.":"Report withdrawn from the family portal.");
  }catch(e){if(n===generation.current)setError(errorText(e));}finally{lock.current=false;if(n===generation.current)setBusy(false);}
 }
 return <section className="rounded-lg border p-3 space-y-3"><h4 className="font-bold">Parent progress report</h4><p className="text-sm">Create a parent-facing update after the session. Suggested text uses selected activity prompts and observed achievement only, not private responses or notes.</p>
 <button type="button" className={btn} disabled={busy} onClick={()=>{if(open){if(dirty&&!window.confirm("Discard unsaved report changes?"))return;setOpen(false);setReport(null);setConfirmed(false);}else{setOpen(true);run();}}}>{open?"Close report editor":"Prepare parent report"}</button>
 {open&&<>{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}{report&&<>
 <p className="text-xs">{report.evidence_count} selected activity evidence records. {report.published_at?"Published version available to parent.":"Not published."}{report.has_unpublished_changes?" Saved draft differs from the published version.":""}</p>
 <button type="button" className={btn} disabled={busy} onClick={()=>{if(window.confirm("Replace editor text with the latest suggested activity summary?")){setSections(report.suggested);setConfirmed(false);}}}>Use suggested evidence summary</button>
 {labels.map((label,i)=><label key={label} className="block text-sm font-semibold">{label}<textarea className="block w-full rounded-lg border p-2 font-normal" maxLength={3000} rows={4} value={sections[i]||""} onChange={e=>{setSections(v=>v.map((x,j)=>j===i?e.target.value:x));setConfirmed(false);}}/></label>)}
 <button type="button" className={btn} disabled={busy||!sections.some(v=>v.trim())||(!dirty&&report.revision>0)} onClick={()=>run("save")}>Save private draft</button>
 <label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I reviewed the saved report, removed private or identifying details about other learners, and approve this exact text for the family.</label>
 <div className="flex flex-wrap gap-2"><button type="button" className={btn+" bg-emerald-950 text-white"} disabled={busy||dirty||!report.revision||!confirmed} onClick={()=>run("publish")}>Publish reviewed report</button>{report.published_at&&<button type="button" className={btn} disabled={busy} onClick={()=>{if(window.confirm("Withdraw this report from the family portal?")){setConfirmed(true);adminApi.post(path,{action:"withdraw",revision:report.revision,confirmed:true}).then(()=>run()).catch(e=>setError(errorText(e)));}}}>Withdraw published report</button>}</div>
 </>}<button type="button" disabled={busy} className={btn} onClick={()=>{if(!dirty||window.confirm("Discard unsaved changes and reload?"))run();}}>Refresh report</button></>}
 </section>;
}
