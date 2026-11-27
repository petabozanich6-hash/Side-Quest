import React,{useState} from "react";
export default function SupportCreationQuest({visual,state,act,canAnswer,disabled,live,owner}){
 const [draft,setDraft]=useState("");
 return <section className="overflow-hidden rounded-xl border border-amber-300 bg-amber-50 text-stone-950">
 <header className="bg-emerald-950 text-white p-4"><p className="text-xs uppercase tracking-wider text-emerald-200">Your original challenge</p><h5 className="text-xl font-bold mt-1">{visual.title}</h5></header>
 <div className="p-4 space-y-4"><div className="border-l-4 border-amber-500 pl-3 whitespace-pre-wrap break-words leading-relaxed">{visual.context}</div>
 <p className="font-semibold text-lg whitespace-pre-wrap break-words">{visual.prompt}</p>
 <div className="rounded-lg border bg-white p-3"><h6 className="font-bold">Your creation should...</h6><ul className="list-disc pl-5 mt-2 space-y-1">{visual.criteria.map(c=><li key={c}>{c}</li>)}</ul></div>
 {canAnswer&&<><label className="block text-sm font-semibold">Optional private scratchpad<textarea className="block w-full rounded-lg border bg-white p-3 mt-2 min-h-32" value={draft} maxLength={2000} disabled={disabled} onChange={e=>setDraft(e.target.value)} placeholder="Plan or write your own answer here…"/></label><p className="text-xs">This scratchpad stays on this screen. It is not shared or saved and is lost when you leave the activity. You can also speak, use paper or the classroom whiteboard. Show or read your response to your tutor when ready.</p><button type="button" disabled={disabled||state.checked} className="w-full rounded-lg bg-emerald-950 text-white py-3 font-semibold disabled:opacity-50" onClick={()=>act("check")}>Ready to discuss my creation</button></>}
 {state.checked&&<p role="status" className="rounded-lg bg-emerald-100 p-3 font-semibold">{live&&owner?"Learner is ready. Ask them to show or explain their creation; scratchpad text is not shared.":"Ready to discuss. Explain how your creation meets the criteria."}</p>}
 {live&&owner&&!state.checked&&<p className="text-sm">Allow the learner to attempt this independently. Their private scratchpad is not visible to you.</p>}
 </div></section>;
}
