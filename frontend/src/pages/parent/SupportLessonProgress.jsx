import React,{useState,useEffect,useRef} from "react";
const choices=[["covered","Covered"],["independent","Independent"],["supported","With guidance"],["practise","Needs practice"],["not_attempted","Not attempted"],["not_started","Reset"]];
const btn="rounded-lg border px-3 py-2 text-xs disabled:opacity-50";
export default function SupportLessonProgress({path,client}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[label,setLabel]=useState(""),[home,setHome]=useState("");
 const lock=useRef(false);
 const endpoint=path+"/lesson-progress";
 async function load(){try{const r=await client.get(endpoint);setData(r.data??r);setError("");}catch(e){setError(e.response?.data?.detail||e.message||"Could not load progress.");}}
 useEffect(()=>{load();},[path]);
 async function save(body){if(lock.current||!data)return;lock.current=true;setBusy(true);setError("");try{const r=await client.post(endpoint,{...body,revision:data.revision});setData(r.data??r);if(body.action==="add"){setLabel("");setHome("");}}catch(e){setError((e.response?.data?.detail||e.message||"Save failed.")+" Your change is not confirmed. Refresh and retry.");}finally{lock.current=false;setBusy(false);}}
 return <section className="rounded-xl border p-3 space-y-3" aria-label="Private live progress tracker"><h4 className="font-bold">Live lesson progress</h4><p className="text-xs">Planned checkpoints are loaded automatically. Tap an observation as you teach; each successful tap is saved immediately. Only mark achievement you actually observed. No recording or transcription.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}<button type="button" className={btn} disabled={busy} onClick={load}>Refresh saved progress</button>
 {data&&<><p role="status" className="text-xs">{busy?"Saving…":data.updated_at?"Saved to lesson record":"Not recorded yet"}</p>{data.checkpoints.map(p=><div key={p.id} className="border rounded-lg p-2 space-y-2"><p className="text-sm font-semibold whitespace-pre-wrap">{p.label}</p><div className="flex flex-wrap gap-1">{choices.map(([v,label])=><button key={v} type="button" aria-pressed={p.status===v} className={btn+(p.status===v?" bg-emerald-950 text-white":"")} disabled={busy} onClick={()=>save({action:"mark",checkpoint_id:p.id,status:v})}>{label}</button>)}</div></div>)}
 {data.checkpoints.length<12&&<details><summary className="text-sm font-semibold">Add a checkpoint</summary><div className="space-y-2 pt-2"><label className="block text-xs">Skill or activity<input maxLength={240} className="block w-full border p-2 rounded" value={label} onChange={e=>setLabel(e.target.value)}/></label><label className="block text-xs">Independent home practice (optional)<textarea maxLength={240} className="block w-full border p-2 rounded" value={home} onChange={e=>setHome(e.target.value)}/></label><button type="button" className={btn} disabled={busy||!label.trim()} onClick={()=>save({action:"add",label,home})}>Save checkpoint</button></div></details>}
 <p className="text-xs">Only these saved observations and planned home activities feed the reviewed parent report. Unattempted items are excluded.</p></>}
 </section>;
}
