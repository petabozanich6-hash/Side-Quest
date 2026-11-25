import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {adminApi,errorText} from "../../../lib/adminApi";
import HqSupportQuotes from "./HqSupportQuotes";
const statuses=["new","reviewing","in_progress","resolved","closed"];
export default function HqGuestSupport(){
 const [items,setItems]=useState([]),[page,setPage]=useState(1),[more,setMore]=useState(false),[selected,setSelected]=useState(null),[message,setMessage]=useState(""),[status,setStatus]=useState("new"),[busy,setBusy]=useState(false),[error,setError]=useState("");
 async function list(){try{const r=await adminApi.get("/support-guests",{page});setItems(r.items);setMore(r.has_more);}catch(e){setError(errorText(e));}}
 async function open(id){try{const r=await adminApi.get("/support-guests/"+encodeURIComponent(id));setSelected(r);setStatus(r.request.status);setMessage("");}catch(e){setError(errorText(e));}}
 useEffect(()=>{list();},[page]);
 async function run(fn){if(busy)return;setBusy(true);setError("");try{await fn();}catch(e){setError(errorText(e));}finally{setBusy(false);}}
 const id=selected?.request?.id,path="/support-guests/"+encodeURIComponent(id||"");
 return <section className="space-y-4"><h2 className="font-display text-2xl font-bold">Learning Support</h2><p>Standalone customer enquiries. Existing homeschool members are managed in the <Link className="underline" to="/parent/command-centre/feedback">member feedback inbox</Link>.</p>{error&&<p role="alert" className="text-rose-800">{error}</p>}<button className="underline" onClick={list}>Refresh enquiries</button>
 <div className="grid lg:grid-cols-[minmax(240px,1fr)_minmax(0,1.5fr)] gap-4"><div className="paper-card p-3 space-y-2">{!items.length&&<p>No standalone enquiries.</p>}{items.map(r=><button key={r.id} onClick={()=>open(r.id)} className="block w-full text-left border rounded-xl p-3 bg-white"><strong>{r.subject}</strong><p className="text-xs break-all">{r.parent_name} · {r.email}</p><p className="text-xs capitalize">{r.status.replaceAll("_"," ")} {!r.seen_at?"· New activity":""}</p></button>)}<div className="flex justify-between"><button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button><span>{page}</span><button disabled={!more} onClick={()=>setPage(p=>p+1)}>Next</button></div></div>
 {selected&&<article className="paper-card p-4 space-y-3" key={id}><h3 className="font-bold">{selected.request.subject}</h3><p className="text-sm break-all">{selected.request.parent_name} · {selected.request.email}</p><p className="text-sm whitespace-pre-wrap break-words">{selected.request.message}</p>
 <label className="block text-sm">Status<select className="block border rounded-lg p-2" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></label><button className="underline" disabled={busy} onClick={()=>run(async()=>{await adminApi.put(path,{status});await open(id);await list();})}>Save status / mark read</button>
 <HqSupportQuotes guest id={id} closed={["closed","resolved"].includes(selected.request.status)}/>
 <h4 className="font-bold">Private messages</h4>{selected.messages.map(m=><div className="rounded-lg bg-stone-100 p-3" key={m.id}><strong className="text-xs">{m.sender}</strong><p className="text-sm whitespace-pre-wrap break-words">{m.body}</p></div>)}
 <form onSubmit={e=>{e.preventDefault();run(async()=>{await adminApi.post(path+"/messages",{message});await open(id);});}}><label className="block text-sm">Reply<textarea className="block w-full border rounded-lg p-3" required minLength={2} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)}/></label><button disabled={busy} className="rounded-full bg-emerald-950 text-white px-4 py-2 mt-2">Send reply</button></form>
 </article>}</div></section>;
}
