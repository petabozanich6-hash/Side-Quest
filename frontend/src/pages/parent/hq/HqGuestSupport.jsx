import React,{useEffect,useState,useRef} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {adminApi,errorText} from "../../../lib/adminApi";
import HqSupportQuotes from "./HqSupportQuotes";
import HqSupportStationery from "./HqSupportStationery";
import HqSupportCalendar from "./HqSupportCalendar";
import HqSupportPriceGuide from "./HqSupportPriceGuide";
import HqTutorResources from "./HqTutorResources";
import HqDailyBriefing from "./HqDailyBriefing";
const statuses=["new","reviewing","in_progress","resolved","closed"];
const label=s=>s.replaceAll("_"," ");
const field="w-full border rounded-lg p-2 bg-white";
const primary="rounded-lg bg-emerald-950 text-white px-4 py-2 disabled:opacity-50";
export default function HqGuestSupport(){
 const [params,setParams]=useSearchParams();
 const familyId=params.get("family")||"",requestId=params.get("enquiry")||"";
 const view=familyId?"Families":params.get("view")||"Families";
 const [items,setItems]=useState([]),[page,setPage]=useState(1),[more,setMore]=useState(false),[search,setSearch]=useState(""),[query,setQuery]=useState("");
 const [family,setFamily]=useState(null),[familyPage,setFamilyPage]=useState(1),[selected,setSelected]=useState(null),[message,setMessage]=useState(""),[status,setStatus]=useState("new"),[busy,setBusy]=useState(false),[error,setError]=useState(""),[panel,setPanel]=useState("Enquiry"),[notice,setNotice]=useState("");
 const revision=useRef(0);
 function navigate(next,request=""){setError("");setNotice("");setFamilyPage(1);setPanel("Enquiry");setSelected(null);setFamily(null);setParams(next?{family:next,...(request?{enquiry:request}:{})}:{});}
 function switchView(v){setError("");setNotice("");setSelected(null);setFamily(null);setParams(v==="Families"?{}:{view:v});}
 useEffect(()=>{if(view!=="Families"||familyId)return;let active=true;setItems([]);setMore(false);setError("");adminApi.get("/support-families",{page,search:query}).then(r=>{if(active){setItems(r.items);setMore(r.has_more);}}).catch(e=>{if(active)setError(errorText(e));});return()=>{active=false;};},[view,familyId,page,query]);
 async function fetchFamily(id,p=1){return adminApi.get("/support-families/"+encodeURIComponent(id),{page:p});}
 useEffect(()=>{if(!familyId)return;let active=true;setFamily(null);setError("");fetchFamily(familyId,familyPage).then(r=>{if(active)setFamily(r);}).catch(e=>{if(active)setError(errorText(e));});return()=>{active=false;};},[familyId,familyPage]);
 async function fetchEnquiry(id){return adminApi.get("/support-guests/"+encodeURIComponent(id));}
 useEffect(()=>{let active=true;setSelected(null);setPanel("Enquiry");setMessage("");if(!family||!requestId)return;
 // Only open an enquiry belonging to the displayed verified family; don't trust query parameters.
 if(!family.items.some(x=>x.id===requestId)){setError("Choose an enquiry from this family page.");return;}
 fetchEnquiry(requestId).then(r=>{if(active&&r.request.email===family.family.email){setSelected(r);setStatus(r.request.status);}}).catch(e=>{if(active)setError(errorText(e));});return()=>{active=false;};},[family,requestId]);
 useEffect(()=>{revision.current++;},[familyId,requestId,view]);
 async function run(fn){if(busy)return;const current=revision.current;setBusy(true);setError("");setNotice("");try{await fn(current);}catch(e){if(current===revision.current)setError(errorText(e));}finally{setBusy(false);}}
 async function refresh(){if(familyId){const r=await fetchFamily(familyId,familyPage);setFamily(r);}else{const r=await adminApi.get("/support-families",{page,search:query});setItems(r.items);setMore(r.has_more);}}
 const id=selected?.request?.id,path="/support-guests/"+encodeURIComponent(id||"");
 const tabs=["Families","Calendar","Resources","Daily briefing","Pricing"];
 return <section className="space-y-4"><header><h2 className="font-display text-2xl font-bold">Learning Support</h2><p className="text-sm">Family workspaces, lesson delivery and practice management.</p></header>
 <nav aria-label="Learning Support sections" className="flex flex-wrap gap-2 border-b pb-3">{tabs.map(t=><button key={t} type="button" disabled={busy} aria-pressed={view===t} className={view===t?primary:"border rounded-lg px-4 py-2"} onClick={()=>switchView(t)}>{t}</button>)}</nav>
 {error&&<p role="alert" className="text-rose-800">{error}</p>}{notice&&<p role="status">{notice}</p>}
 {view==="Calendar"&&<HqSupportCalendar/>}{view==="Resources"&&<HqTutorResources/>}{view==="Daily briefing"&&<HqDailyBriefing/>}{view==="Pricing"&&<HqSupportPriceGuide/>}
 {view==="Families"&&!familyId&&<><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-lg">My families</h3><button type="button" className="underline" onClick={()=>run(refresh)}>Refresh</button></div>
 <p className="text-sm">A family workspace appears when a parent submits an enquiry from their verified email. Subsequent enquiries from that email are kept together. Homeschool member enquiries remain in the <Link className="underline" to="/parent/command-centre/feedback">member inbox</Link>.</p>
 <form className="flex gap-2" onSubmit={e=>{e.preventDefault();setPage(1);setQuery(search.trim());}}><input aria-label="Find a family" placeholder="Search parent name or email" value={search} maxLength={254} onChange={e=>setSearch(e.target.value)} className={field}/><button className={primary}>Search</button></form>
 <div className="grid gap-3 md:grid-cols-2">{items.map(f=><button key={f.id} disabled={busy} type="button" onClick={()=>navigate(f.id)} className="paper-card p-4 text-left space-y-2"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{f.parent_name}</strong><span className="text-xs rounded-full bg-stone-100 px-2 py-1">{f.unread_count?f.unread_count+" need review":f.active_count?"Open enquiries":"Inactive enquiries"}</span></div><p className="text-sm break-all">{f.email}</p><p className="text-sm">{f.enquiry_count} {f.enquiry_count===1?"enquiry":"enquiries"}</p><span className="text-sm font-semibold">Open family workspace →</span></button>)}</div>
 {!items.length&&<p className="text-sm">No families to display.</p>}<div className="flex justify-between"><button disabled={page===1||busy} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button disabled={!more||busy} onClick={()=>setPage(p=>p+1)}>Next</button></div></>}
 {view==="Families"&&familyId&&<><button type="button" disabled={busy} className="underline" onClick={()=>navigate("")}>← My families</button>{!family?<p role="status">Loading family workspace…</p>:<>
 <div className="paper-card p-4 space-y-2"><h3 className="font-display text-xl font-bold">{family.family.parent_name}</h3><p className="break-all text-sm">{family.family.email}</p><p className="text-xs">Family since {new Date(family.family.created_at).toLocaleDateString("en-AU")}</p></div>
 {!requestId?<div className="paper-card p-4 space-y-3"><div className="flex justify-between"><h3 className="font-bold">Family enquiries & support</h3><button className="underline" onClick={()=>run(refresh)}>Refresh</button></div>{family.items.map(r=><button key={r.id} disabled={busy} className="block w-full text-left border rounded-xl p-3" onClick={()=>{setParams({family:familyId,enquiry:r.id});}}><strong>{r.subject}</strong><p className="text-sm capitalize">{label(r.status)}{!r.seen_at?" · New activity":""}</p><span className="text-xs underline">Open enquiry and support history →</span></button>)}<div className="flex justify-between"><button disabled={familyPage===1||busy} onClick={()=>setFamilyPage(p=>p-1)}>Previous</button><span>Page {familyPage}</span><button disabled={!family.has_more||busy} onClick={()=>setFamilyPage(p=>p+1)}>Next</button></div></div>:<><button type="button" disabled={busy} className="underline" onClick={()=>setParams({family:familyId})}>← Family enquiries</button>
 {selected&&<article className="paper-card p-4 space-y-4" key={id}><header><h3 className="text-lg font-bold">{selected.request.subject}</h3><p className="text-sm capitalize">{label(selected.request.status)}</p></header>
 <nav aria-label="Enquiry workspace" className="flex flex-wrap gap-2">{["Enquiry","Proposals & bookings","Documents","Messages"].map(t=><button type="button" key={t} disabled={busy} aria-pressed={panel===t} className={panel===t?primary:"border rounded-lg px-3 py-2"} onClick={()=>setPanel(t)}>{t}</button>)}</nav>
 <div hidden={panel!=="Enquiry"} className="space-y-3"><h4 className="font-bold">Parent's request</h4><p className="text-sm whitespace-pre-wrap break-words">{selected.request.message}</p><label className="block text-sm">Enquiry status<select className={field} value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{label(s)}</option>)}</select></label><button className={primary} disabled={busy} onClick={()=>run(async current=>{await adminApi.put(path,{status});const r=await fetchEnquiry(id);if(current===revision.current){setSelected(r);setNotice("Status saved.");}})}>Save status / mark read</button><button className="border rounded-lg px-3 py-2 ml-2" onClick={()=>setPanel("Proposals & bookings")}>Review support and proposal →</button></div>
 <div hidden={panel!=="Proposals & bookings"}><HqSupportQuotes guest id={id} closed={["closed","resolved"].includes(selected.request.status)}/></div>
 <div hidden={panel!=="Documents"}><HqSupportStationery key={id} path={path}/></div>
 <div hidden={panel!=="Messages"} className="space-y-3"><h4 className="font-bold">Private messages</h4>{selected.messages.map(m=><div className="rounded-lg bg-stone-100 p-3" key={m.id}><strong className="text-xs">{m.sender}</strong><p className="text-sm whitespace-pre-wrap break-words">{m.body}</p></div>)}<form onSubmit={e=>{e.preventDefault();run(async current=>{const result=await adminApi.post(path+"/messages",{message});const r=await fetchEnquiry(id);if(current===revision.current){setSelected(r);setMessage("");setNotice(result.email_notification_sent?"Reply saved and notification sent.":"Reply saved; email notification not confirmed.");}});}}><label className="block text-sm">Reply<textarea className={field} required minLength={2} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)}/></label><button disabled={busy} className={primary}>Send reply</button></form></div>
 </article>}</>}</>}</>}
 </section>;
}
