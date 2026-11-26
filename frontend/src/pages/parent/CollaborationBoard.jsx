import React,{useState} from "react";
const button="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50",primary=button+" bg-emerald-950 text-white";
export default function CollaborationBoard({activity,entries,owner,busy,send,responses=[]}){
 const [draft,setDraft]=useState(""),[checked,setChecked]=useState(false);
 const [entryId,setEntryId]=useState(()=>crypto.randomUUID());
 function update(value){setDraft(value);setChecked(false);setEntryId(crypto.randomUUID());}
 async function publish(){if(!checked||!draft.trim()||busy)return;
  const ok=await send({action:"share",activity_id:activity.id,entry_id:entryId,body:draft.trim(),confirmed:true});
  if(ok)update("");
 }
 return <section className="rounded-xl border p-3 space-y-3" aria-label="Shared story or solution board">
 <h4 className="font-semibold">Our shared ideas</h4>
 <p className="text-xs">{owner?"Only share reviewed, de-identified learning content. Private answers remain private unless you deliberately prepare and publish a safe excerpt.":"Your tutor chooses what to add here. Your own suggestion is sent privately to your tutor, not directly to other learners."}</p>
 <div role="log" aria-live="polite" className="space-y-2">{entries.length?entries.map((e,i)=><article key={e.id} className="rounded-lg bg-stone-50 border p-3 space-y-2"><span className="text-xs font-semibold">Idea {i+1}</span><p className="whitespace-pre-wrap break-words">{e.body}</p>{owner&&<button type="button" className={button} disabled={busy} onClick={()=>send({action:"retract",activity_id:activity.id,entry_id:e.id,confirmed:true})}>Remove from shared board</button>}</article>):<p className="text-sm">No shared ideas yet.</p>}</div>
 {owner&&<div className="space-y-2 border-t pt-3"><h5 className="font-semibold">Add a reviewed idea</h5><p className="text-xs">Write a connecting sentence, a story development or the next step of a solution. Keep names and identifying details out.</p>{responses.length>0&&<label className="block text-sm">Use a private suggestion as an editable draft<select className="block w-full border rounded-lg p-2 bg-white" value="" disabled={busy} onChange={e=>{const v=responses[Number(e.target.value)];if(v)update(v.response);}}><option value="">Choose a suggestion to edit</option>{responses.map((r,i)=><option key={r.seat_id} value={i}>Suggestion {i+1}</option>)}</select></label>}
 <label className="block text-sm font-semibold">Text to share<textarea className="block w-full rounded-lg border p-2 bg-white font-normal" rows={3} maxLength={500} value={draft} onChange={e=>update(e.target.value)}/></label>
 <label className="flex gap-2 text-sm"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/> I reviewed this text, removed personal information and confirm it is appropriate to share with the session.</label>
 <button type="button" className={primary} disabled={busy||!checked||!draft.trim()||entries.length>=20} onClick={publish}>Share reviewed idea</button><p className="text-xs">Up to 20 board entries. No direct learner-to-learner messaging.</p></div>}
 </section>;
}
