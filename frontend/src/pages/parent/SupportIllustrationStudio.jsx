import React,{useEffect,useRef,useState} from "react";
import {adminApi,errorText} from "../../lib/adminApi";
const btn="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50";
export default function SupportIllustrationStudio({pack,onAttach,disabled=false}){
 const [status,setStatus]=useState(null),[statusError,setStatusError]=useState(""),[items,setItems]=useState({}),[busy,setBusy]=useState(null),[library,setLibrary]=useState(null),[search,setSearch]=useState("");
 const live=useRef(true);
 useEffect(()=>{live.current=true;adminApi.get("/support-illustrations/status").then(r=>{if(live.current)setStatus(r);}).catch(e=>{if(live.current)setStatusError(errorText(e));});return()=>{live.current=false;};},[]);
 const plan=pack.illustrations||[];
 const item=(index,patch)=>{if(live.current)setItems(s=>({...s,[index]:{...s[index],...patch}}));};
 async function findImages(){try{const r=await adminApi.get("/support-files",{q:search,learner:1});if(live.current)setLibrary(r.files.filter(f=>["image/png","image/jpeg"].includes(f.mime)));}catch(e){if(live.current)setStatusError(errorText(e));}}
 async function generate(p){
  if(busy!==null)return;setBusy(p.slide_index);item(p.slide_index,{error:"",image:null,reviewed:false,saved:false});
  try{const r=await adminApi.post("/support-illustrations/draft",{brief:p.brief,title:p.title,subject:pack.subject,year_level:pack.year_level,confirmed:true});item(p.slide_index,{image:r.image});}
  catch(e){item(p.slide_index,{error:errorText(e)});}finally{if(live.current)setBusy(null);}
 }
 async function save(p,state){
  if(busy!==null||!state.reviewed||!state.image||state.saved)return;setBusy(p.slide_index);item(p.slide_index,{error:""});
  try{const image=state.image;const r=await adminApi.post("/support-files",{filename:image.filename,title:image.title,subject:image.subject,year_level:image.year_level,base64:image.base64,audience:"learner",reviewed:true});if(!r.id)throw Error("Resource save returned no reference.");if(live.current){onAttach?.(p.slide_index,r.id);item(p.slide_index,{saved:true,image:null});}}
  catch(e){item(p.slide_index,{error:errorText(e)});}finally{if(live.current)setBusy(null);}
 }
 if(!plan.length)return null;
 return <section className="rounded-xl border p-4 space-y-3"><h3 className="font-bold text-lg">Illustrated teaching resources</h3>
 <p className="text-sm">{plan.length} planned illustration{plan.length===1?"":"s"} for this lesson. Each is optional and complements the accurate interactive model. Generate one at a time; each click uses one AI request. Attach a reviewed image to its slide, then save the lesson. Nothing is shared automatically.</p>
 {statusError&&<p role="alert" className="text-sm">{statusError}</p>}
 {status&&!status.enabled&&<p className="text-sm">Image generation is not enabled in this environment. The storyboard remains available for preparation.</p>}
 {status?.enabled&&!status.storage_available&&<p className="text-sm">Private storage is unavailable. You can preview images but cannot save them to the resource library.</p>}
 {onAttach&&<details><summary className="text-sm font-semibold cursor-pointer">Reuse an approved image instead of generating</summary><div className="flex gap-2 mt-2"><input className="min-w-0 flex-1 rounded border p-2" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search reviewed illustrations" placeholder="Search image library"/><button type="button" className={btn} disabled={disabled||busy!==null} onClick={findImages}>Find</button></div>{library?.length===0&&<p className="text-sm">No matching images.</p>}</details>}
 {plan.map(p=>{const state=items[p.slide_index]||{};return <article className="border rounded-xl p-3 space-y-2" key={p.slide_index}>
 <h4 className="font-semibold">Slide {p.slide_index+1} · {p.title}</h4><p className="text-sm">{p.purpose}</p><details><summary className="text-sm cursor-pointer">Review generic image brief</summary><p className="text-sm whitespace-pre-wrap break-words">{p.brief}</p></details>
 {state.error&&<p role="alert" className="text-sm text-rose-800">{state.error}</p>}
 {p.file_id&&<><p className="text-sm font-semibold">Reviewed image attached to this slide.</p>{onAttach&&<button type="button" className={btn} disabled={disabled||busy!==null} onClick={()=>{onAttach(p.slide_index,null);item(p.slide_index,{saved:false,image:null,confirmed:false});}}>Remove attachment</button>}</>}
 {onAttach&&!p.file_id&&library?.length>0&&<label className="block text-sm">Choose reviewed image for this slide<select className="block w-full rounded border p-2" value="" disabled={disabled||busy!==null} onChange={e=>{if(e.target.value&&window.confirm("Confirm this reviewed image is suitable for the selected slide."))onAttach(p.slide_index,e.target.value);}}><option value="">Select image…</option>{library.map(f=><option key={f.id} value={f.id}>{f.title} · {f.year_level}</option>)}</select></label>}
 {onAttach&&!p.file_id&&!state.saved&&!state.image&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={!!state.confirmed} onChange={e=>item(p.slide_index,{confirmed:e.target.checked})}/> I checked the brief for age suitability and removed identifying information.</label><button type="button" className={btn} disabled={disabled||!status?.enabled||!state.confirmed||busy!==null} onClick={()=>generate(p)}>{busy===p.slide_index?"Generating preview…":"Generate illustration"}</button></>}
 {state.image&&<><img className="w-full max-h-[420px] object-contain rounded-lg" alt={p.title+" — unreviewed illustration preview"} src={"data:image/jpeg;base64,"+state.image.base64}/><label className="flex gap-2 text-sm"><input type="checkbox" checked={!!state.reviewed} onChange={e=>item(p.slide_index,{reviewed:e.target.checked})}/> I checked the image for accuracy, suitability and privacy. It is safe to use with learners.</label><div className="flex flex-wrap gap-2"><button type="button" className={btn} disabled={disabled||!status?.storage_available||!state.reviewed||busy!==null} onClick={()=>save(p,state)}>Save and attach reviewed image</button><button type="button" className={btn} disabled={busy!==null} onClick={()=>item(p.slide_index,{image:null,reviewed:false,confirmed:false})}>Discard preview</button></div></>}
 {state.saved&&<p role="status" className="text-sm font-medium">Saved to the resource library and attached. Save or approve the lesson to retain the attachment.</p>}
 </article>;})}</section>;
}
