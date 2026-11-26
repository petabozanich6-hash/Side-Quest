import React,{useState} from "react";
const button="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50";
export default function HqClubTeachingGuide({preparation,live=false}){
 const [index,setIndex]=useState(0),[open,setOpen]=useState(!live);
 if(!preparation)return null;
 const sections=preparation.split(/\n\n+/),steps=sections.filter(s=>/^\d+–\d+ min \| /.test(s));
 if(!steps.length)return <details className="paper-card p-4"><summary className="font-bold">Private session ideas</summary><p className="whitespace-pre-wrap text-sm mt-3">{preparation}</p></details>;
 const current=steps[Math.min(index,steps.length-1)],separator=current.indexOf(": "),heading=current.slice(0,separator),body=current.slice(separator+2);
 return <section className="paper-card p-4 space-y-3"><p className="text-xs uppercase tracking-wide">Private · Facilitator only</p><button type="button" className="font-bold text-left" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?"Hide":"Open"} guided workshop teaching plan</button>
 {open&&<><p className="text-sm">Welcome for the first five minutes. Use each teaching step flexibly; only share the separate learner presentation.</p><div className="flex items-center justify-between gap-2"><button type="button" className={button} disabled={index===0} onClick={()=>setIndex(i=>i-1)}>Previous</button><span className="text-sm">Step {index+1} of {steps.length}</span><button type="button" className={button} disabled={index>=steps.length-1} onClick={()=>setIndex(i=>i+1)}>Next</button></div>
 <div className="border rounded-xl p-4 bg-white space-y-2"><h4 className="font-bold">{heading}</h4><p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p></div><details><summary className="text-sm font-semibold">Full facilitator plan and reading</summary>{sections.map((s,i)=><p key={i} className="text-sm whitespace-pre-wrap mt-2">{s}</p>)}</details></>}
 </section>;
}
