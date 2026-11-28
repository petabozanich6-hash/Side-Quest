import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../lib/adminApi";
const labels={independent:"Demonstrated independently",supported:"Demonstrated with guidance",practise:"Needs further practice",covered:"Covered — mastery not established"};
const priorities={practise:0,supported:1,covered:2,independent:3};
const date=v=>new Date(v).toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",day:"numeric",month:"short",year:"numeric"});
export default function LessonContinuity({path,onFocus}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[reload,setReload]=useState(0),[focus,setFocus]=useState("");
 useEffect(()=>{let alive=true;setData(null);setError("");setFocus("");adminApi.get(path+"/lesson-continuity").then(r=>{if(alive)setData(r.data??r);}).catch(e=>{if(alive)setError(errorText(e));});return()=>{alive=false;};},[path,reload]);
 return <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3" aria-label="Private previous learning">
 <div className="flex flex-wrap justify-between gap-2"><h4 className="font-bold text-emerald-950">Build on previous learning</h4><button type="button" className="text-sm underline" onClick={()=>setReload(n=>n+1)}>Refresh history</button></div>
 <p className="text-sm">Private tutor preparation. Actual recorded observations, not inferred ability or automatic grades. No history is sent to AI.</p>
 {error?<p role="alert" className="text-sm">History unavailable: {error}</p>:!data?<p role="status" className="text-sm">Checking previous observations…</p>:!data.lessons.length?<p className="text-sm">{data.scope==="unlinked"?"No verified learner link or shared booking package. History cannot be safely matched by name or email.":"No earlier observed learning has been recorded for this learner."}</p>:<>
 <p className="text-xs">{data.scope==="verified_learner"?"Matched to the same verified portal learner and parent.":"Matched to the same reserved lesson package."} · Up to six most recent eligible sessions.</p>
 {data.lessons.map((lesson,i)=><details key={lesson.start_at+":"+i} className="rounded-lg bg-white border p-3"><summary className="font-semibold cursor-pointer">{date(lesson.start_at)} · {lesson.title||"Tutoring session"}{lesson.subject?" · "+lesson.subject:""}</summary>{lesson.objective&&<p className="text-sm my-2">{lesson.objective}</p>}<ul className="space-y-2 mt-2">{[...lesson.observations].sort((a,b)=>priorities[a.status]-priorities[b.status]).map((p,j)=><li key={j} className="border-l-2 border-emerald-300 pl-3"><p className="text-xs font-semibold">{labels[p.status]}</p><p className="text-sm whitespace-pre-wrap break-words">{p.label}</p></li>)}</ul></details>)}
 <label className="block text-sm font-semibold">Write a generic next learning objective<textarea rows={3} maxLength={350} className="w-full border rounded-lg p-2 bg-white" value={focus} onChange={e=>setFocus(e.target.value)} placeholder="E.g. Revisit comparing equivalent fractions with visual models, then apply the method independently."/></label>
 <p className="text-xs">Use your judgement: revisit needs-practice skills, reduce scaffolding for supported skills, and extend independently demonstrated skills. Do not include names, diagnoses, family details or copied private notes.</p>
 <button type="button" disabled={!focus.trim()} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50" onClick={()=>onFocus(focus.trim())}>Use this learning objective</button>
 </>}
 </section>;
}
