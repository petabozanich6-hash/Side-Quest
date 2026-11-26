import React,{useEffect,useRef,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {GameResult} from "../ActivityGame";
const btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",field="block w-full border rounded-lg p-2 bg-white";
const choices=[["covered","Covered"],["independent","Demonstrated independently"],["supported","Demonstrated with guidance"],["practise","Needs further practice"]];
function Review({item,busy,onSave,onRemove}){
 const [note,setNote]=useState(item.observation||""),[achievement,setAchievement]=useState(item.achievement||"covered"),[confirmed,setConfirmed]=useState(false);
 return <article className="rounded-lg border p-3 space-y-3">
 <p className="font-semibold whitespace-pre-wrap break-words">{item.question}</p>
 <div className="rounded-lg bg-stone-50 p-2"><p className="text-xs font-semibold">Learner's submitted work</p>{item.game?<GameResult game={item.game} value={item.response}/>:<p className="text-sm whitespace-pre-wrap break-words">{item.response}</p>}</div>
 <label className="block text-sm">Observed learning<select className={field} value={achievement} onChange={e=>{setAchievement(e.target.value);setConfirmed(false);}}>{choices.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
 <label className="block text-sm">Private observation<textarea rows={3} maxLength={600} className={field} value={note} onChange={e=>{setNote(e.target.value);setConfirmed(false);}} placeholder="What did the learner demonstrate? What support was needed?"/></label>
 <label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I reviewed this response and recorded only learning I actually observed.</label>
 <div className="flex flex-wrap gap-2"><button type="button" disabled={busy||!confirmed||!note.trim()} className={btn+" bg-emerald-950 text-white"} onClick={()=>onSave({action:"save",activity_id:item.activity_id,response_updated_at:item.response_updated_at,revision:item.revision||0,observation:note,achievement,confirmed:true})}>{item.revision?"Update private evidence":"Keep as private evidence"}</button>{item.revision&&<button type="button" className={btn} disabled={busy} onClick={()=>{if(window.confirm("Remove this selected evidence record? The original submitted response is not changed."))onRemove({action:"remove",activity_id:item.activity_id,revision:item.revision,confirmed:true});}}>Remove evidence</button>}</div>
 {item.revision&&<p className="text-xs">Saved privately · revision {item.revision}</p>}
 </article>;
}
export default function HqActivityEvidence({kind,sessionId,seatId}){
 const path="/activity-evidence/"+kind+"/"+encodeURIComponent(sessionId)+"/"+encodeURIComponent(seatId);
 const [open,setOpen]=useState(false),[data,setData]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const generation=useRef(0),lock=useRef(false);
 useEffect(()=>{setData(null);setOpen(false);setError("");setNotice("");return()=>{generation.current++;};},[path]);
 async function run(body){
  if(lock.current)return;lock.current=true;setBusy(true);setError("");setNotice("");const g=++generation.current;
  try{const result=body?await adminApi.post(path,body):await adminApi.get(path);if(g!==generation.current)return;setData(result);if(body)setNotice(body.action==="remove"?"Selected evidence removed.":"Evidence saved privately.");}catch(e){if(g===generation.current)setError(errorText(e));}finally{lock.current=false;if(g===generation.current)setBusy(false);}
 }
 return <section className="rounded-lg border p-3 space-y-3"><h4 className="font-bold">Interactive learning evidence</h4><p className="text-sm">Review submitted work from finished activities and keep only meaningful examples. These records are private; nothing is automatically shared with parents.</p><button type="button" className={btn} disabled={busy} onClick={()=>{if(open){setOpen(false);setData(null);}else{setOpen(true);run();}}}>{open?"Close evidence review":"Review completed activities"}</button>
 {open&&<>{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{notice&&<p role="status" className="text-sm">{notice}</p>}<button type="button" className={btn} disabled={busy} onClick={()=>run()}>Refresh submissions</button>{data&&<><p className="text-xs">{data.activities.filter(v=>v.revision).length} selected evidence records</p>{data.activities.length?data.activities.map(v=><Review key={v.activity_id+":"+(v.revision||0)+":"+v.response_updated_at} item={v} busy={busy} onSave={run} onRemove={run}/>):<p className="text-sm">No submitted work from finished activities yet.</p>}</>}</>}
 </section>;
}
