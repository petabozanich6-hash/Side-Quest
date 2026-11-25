import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../lib/adminApi";
const btn="rounded-lg border px-3 py-2 text-sm disabled:opacity-50";
export function PresentedImage({image,path,client}){
 const [display,setDisplay]=useState(null),[error,setError]=useState(""),[retry,setRetry]=useState(0);
 const id=image?.id;
 useEffect(()=>{setDisplay(null);setError("");if(!id)return;let active=true,url;
  client.get(path+"/classroom-image/"+encodeURIComponent(id)).then(r=>{
   if(!active)return;const d=r.data??r;if(!["image/png","image/jpeg"].includes(d.mime))throw Error("Unexpected image type");
   url=URL.createObjectURL(new Blob([Uint8Array.from(atob(d.base64),c=>c.charCodeAt(0))],{type:d.mime}));setDisplay({id,url});
  }).catch(()=>{if(active)setError("Could not load the presented image.");});
  return()=>{active=false;if(url)URL.revokeObjectURL(url);};
 },[id,path,client,retry]);
 if(!image)return null;
 return <section className="border rounded-xl p-3 space-y-2"><h4 className="font-bold">{image.title}</h4>{display?.id===id?<img src={display.url} alt={image.title} className="max-h-[65vh] w-full object-contain"/>:error?<p role="alert">{error} <button type="button" className="underline" onClick={()=>setRetry(n=>n+1)}>Retry</button></p>:<p role="status">Loading image…</p>}</section>;
}
export default function SupportImagePresentation({send,busy}){
 const [q,setQ]=useState(""),[items,setItems]=useState(null),[error,setError]=useState(""),[loading,setLoading]=useState(false);
 async function search(e){e.preventDefault();setLoading(true);try{const r=await adminApi.get("/support-files",{q,learner:1});setItems(r.files.filter(f=>["image/png","image/jpeg"].includes(f.mime)));setError("");}catch(e){setError(errorText(e));}finally{setLoading(false);}}
 return <section className="border rounded-xl p-3 space-y-2"><h4 className="font-bold">Present uploaded visual material</h4><p className="text-sm">Use a reviewed learner image, including exported presentation slides, diagrams or worksheet pages. This displays the current image to the family without granting ongoing portal downloads.</p><form className="flex gap-2" onSubmit={search}><input className="min-w-0 flex-1 border rounded-lg p-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Find an image" aria-label="Find uploaded learner images"/><button className={btn} disabled={loading}>Find</button></form>{error&&<p role="alert">{error}</p>}{items?.length===0&&<p className="text-sm">No matching learner images.</p>}{items?.map(f=><button type="button" className="block text-left underline text-sm" key={f.id} disabled={busy} onClick={()=>send({action:"present-image",file_id:f.id})}>{f.title} · {f.year_level}</button>)}<button type="button" className={btn} disabled={busy} onClick={()=>send({action:"hide-image"})}>Stop showing image</button></section>;
}
