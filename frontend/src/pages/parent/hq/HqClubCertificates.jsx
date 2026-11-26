import HqClubCertificatePostal from "./HqClubCertificatePostal";
import React,{useEffect,useRef,useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {downloadCertificate} from "../FamilyClubCertificates";
import {adminApi,errorText} from "../../../lib/adminApi";
const root="?view=English+Club&club=certificates",btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50";
const delivery={pdf:"Email PDF",post:"Printed and posted",both:"Email PDF and post"};
const status=r=>r.certificate_status==="withdrawn"?"Withdrawn":r.certificate_status==="approved"?(r.eligible?"Approved for fulfilment":"Approved record needs review"):r.eligible?"Ready for review":r.eligibility==="awaiting_completion"?"Awaiting workshop completion":"Attendance or payment needs review";
function SignedTemplateSetup({onReady}){
 const [info,setInfo]=useState(null),[file,setFile]=useState(null),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[preview,setPreview]=useState("");
 const lock=useRef(false);
 useEffect(()=>{let active=true;adminApi.get("/english-club/certificate-template").then(r=>{if(active){setInfo(r);onReady(r.active?.id||"");}}).catch(e=>{if(active)setError(errorText(e));});return()=>{active=false;};},[]);
 useEffect(()=>{if(!file){setPreview("");return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
 async function save(){if(lock.current||!file||!confirmed)return;lock.current=true;setBusy(true);setError("");
 try{
  if(file.size>1500000||file.type!=="image/jpeg")throw Error("Choose the prepared signed JPEG (maximum 1.5 MB).");
  const bytes=new Uint8Array(await file.arrayBuffer());let raw="";for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));
  await adminApi.post("/english-club/certificate-template",{confirmed:true,base64:btoa(raw)});
  const r=await adminApi.get("/english-club/certificate-template");setInfo(r);onReady(r.active?.id||"");setFile(null);setConfirmed(false);
 }catch(e){setError(errorText(e,e.message||"Private upload failed."));}finally{lock.current=false;setBusy(false);}
 }
 return <article className="paper-card p-5 space-y-3"><h4 className="font-bold">Signed Ignis certificate artwork</h4><p className="text-sm">{info?.active?"An approved private artwork version is active. Previously approved certificates retain their pinned version.":"Upload the prepared signed artwork once before approving certificates."}</p>{error&&<p role="alert">{error}</p>}{info&&!info.storage_available&&<p>Private storage is unavailable.</p>}<label className="block text-sm">Prepared signed JPEG<input type="file" accept="image/jpeg" disabled={busy||!info?.storage_available} className="block w-full" onChange={e=>{setFile(e.target.files?.[0]||null);setConfirmed(false);}}/></label>{preview&&<><img src={preview} alt="Private signed certificate artwork preview" className="w-full rounded border"/><label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/> I approve this artwork and signature for English Club certificates.</label><button type="button" className={btn} disabled={busy||!confirmed} onClick={save}>Save approved private artwork</button></>}</article>;
}
export default function HqClubCertificates(){
 const [params]=useSearchParams(),chosen=params.get("certificate_booking")||"";
 const [data,setData]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[confirmed,setConfirmed]=useState(false),[batchRound,setBatchRound]=useState(""),[batchIds,setBatchIds]=useState([]),[batchConfirmed,setBatchConfirmed]=useState(false),[batchResult,setBatchResult]=useState(null),[templateReady,setTemplateReady]=useState(""),[previews,setPreviews]=useState({});
 const lock=useRef(false),generation=useRef(0);
 async function load(){setData(await adminApi.get("/english-club/certificates"));}
 useEffect(()=>{load().catch(e=>setError(errorText(e)));},[]);
 useEffect(()=>{generation.current++;setConfirmed(false);setError("");setNotice("");},[chosen]);
 const r=data?.items.find(v=>v.kind+":"+v.booking_id===chosen);
 const ready=(data?.items||[]).filter(v=>v.kind==="round"&&v.round_id&&v.eligible&&!v.certificate_status);
 const groups=Array.from(new Map(ready.map(v=>[v.round_id,{id:v.round_id,title:v.title,end:v.last_end_at}])).values());
 const group=ready.filter(v=>v.round_id===batchRound);
 const selected=group.filter(v=>batchIds.includes(v.booking_id));
 const previewed=v=>previews[v.kind+":"+v.booking_id]===JSON.stringify([templateReady,v.learner_label,v.title,v.expected_count,v.last_end_at,v.certificate_delivery]);
 async function preview(v){
  if(lock.current||!templateReady)return;lock.current=true;setBusy(true);setError("");
  try{const doc=await adminApi.get("/english-club/certificates/"+encodeURIComponent(v.kind)+"/"+encodeURIComponent(v.booking_id)+"/preview");
   if(doc.template_id!==templateReady||doc.learner_name!==v.learner_label||doc.title!==v.title||doc.session_count!==v.expected_count||doc.completed_at!==v.last_end_at||doc.delivery!==v.certificate_delivery)throw Error("Certificate changed. Refresh and review again.");
   downloadCertificate(doc);setPreviews(p=>({...p,[v.kind+":"+v.booking_id]:JSON.stringify([doc.template_id,doc.learner_name,doc.title,doc.session_count,doc.completed_at,doc.delivery])}));
  }catch(e){setError(errorText(e));}finally{lock.current=false;setBusy(false);}
 }
 function chooseRound(id){setBatchRound(id);setBatchIds([]);setBatchConfirmed(false);setBatchResult(null);}
 async function approveBatch(){
  if(lock.current||!templateReady||!batchConfirmed||!batchRound||!selected.length||selected.length>8||!selected.every(previewed))return;
  lock.current=true;setBusy(true);setError("");setNotice("");setBatchResult(null);
  try{
   const result=await adminApi.post("/english-club/certificates/batch",{confirmed:true,round_id:batchRound,items:selected.map(v=>({booking_id:v.booking_id,template_id:templateReady,learner_name:v.learner_label,title:v.title,expected_count:v.expected_count,delivery:v.certificate_delivery,completed_at:v.last_end_at}))});
   setBatchResult({approved:result.approved,review:result.review,items:result.items.map(x=>({...x,name:selected.find(v=>v.booking_id===x.booking_id)?.learner_label||"Selected learner"}))});
   setBatchIds([]);setBatchConfirmed(false);await load();
  }catch(e){setError(errorText(e));}finally{lock.current=false;setBusy(false);}
 }
 async function run(action){
  if(lock.current||!r)return;lock.current=true;setBusy(true);setError("");setNotice("");const g=generation.current;
  try{const path="/english-club/certificates/"+encodeURIComponent(r.kind)+"/"+encodeURIComponent(r.booking_id);
   if(action==="pdf"){const doc=await adminApi.get("/english-club/certificates/"+encodeURIComponent(r.certificate_id)+"/pdf");if(g===generation.current)downloadCertificate(doc);return;}
   if(action==="reissue"){const result=await adminApi.post("/english-club/certificates/"+encodeURIComponent(r.certificate_id)+"/reissue",{confirmed:true,template_id:r.template_id});await load();if(g===generation.current)setNotice(result.status==="sent"?"Replacement accepted by email provider.":"Replacement requires review; no automatic repeat.");return;}
   if(action==="approve")await adminApi.post(path+"/approve",{confirmed,template_id:templateReady,learner_name:r.learner_label,title:r.title,expected_count:r.expected_count,delivery:r.certificate_delivery,completed_at:r.last_end_at});
   else await adminApi.post(path+"/withdraw",{confirmed:true,certificate_id:r.certificate_id});
   await load();if(g===generation.current){setConfirmed(false);setNotice(action==="approve"?"Certificate approved with the active signed Ignis artwork.":"Certificate approval withdrawn.");}
  }catch(e){if(g===generation.current)setError(errorText(e));}finally{lock.current=false;setBusy(false);}
 }
 if(params.get("postal")==="queue")return <HqClubCertificatePostal/>;
 return <section className="space-y-4"><Link className={btn} to={root+"&postal=queue"}>Postal fulfilment queue →</Link><SignedTemplateSetup onReady={setTemplateReady}/><p className="text-sm">Free certificates acknowledge English Club participation. A single workshop requires verified payment and recorded attendance; a round requires every booked workshop to be completed and attended. Attendance or payment exceptions require review; the pilot does not automatically grant completion for missed sessions.</p>{error&&<p role="alert" className="text-rose-800">{error}</p>}{notice&&<p role="status">{notice}</p>}
 {!data?<p>Loading certificate records…</p>:chosen?<><Link className="underline text-sm" to={root}>← All certificates</Link>{!r?<p>Booking unavailable.</p>:<article className="paper-card p-5 space-y-3"><h4 className="font-bold">{r.learner_label} · {r.title}</h4><p>{r.completed_count} of {r.expected_count} workshops verified and attended.</p><p>Delivery: {delivery[r.certificate_delivery]} · No charge</p><p>Status: {status(r)}</p>{r.certificate_status==="approved"&&r.certificate_delivery!=="post"&&<p className="text-sm">Digital delivery: {r.email_status==="sent"?"Accepted by email provider":r.email_status==="sending"?"Attempt recorded; delivery not yet confirmed":r.email_status==="review"||r.email_status==="suppressed"?"Needs review; no automatic repeat":"Awaiting eligible scheduled delivery"}{r.email_sent_at?" · "+new Date(r.email_sent_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney"}):""}</p>}{r.last_end_at&&<p className="text-sm">Final workshop ends {new Date(r.last_end_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"medium",timeStyle:"short"})} Sydney time.</p>}
 {r.eligible&&!r.certificate_status&&<><button type="button" className={btn} disabled={!templateReady||busy} onClick={()=>preview(r)}>{previewed(r)?"Download preview again":"Preview personalised certificate"}</button><label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/> I reviewed the recorded attendance, certificate name, workshop title and delivery preference.</label><button className={btn+" bg-emerald-950 text-white"} disabled={!templateReady||!previewed(r)||!confirmed||busy} onClick={()=>run("approve")}>Approve free certificate</button></>}
 {r.certificate_status==="approved"&&r.eligible&&r.template_id&&<button className={btn} disabled={busy} onClick={()=>run("pdf")}>Download personalised signed PDF</button>}
 {r.certificate_status==="approved"&&r.eligible&&r.template_id&&r.email_status==="sent"&&!r.reissue_status&&<button className={btn} disabled={busy} onClick={()=>{if(window.confirm("Send one free replacement copy of this original signed certificate to the verified test mailbox?"))run("reissue");}}>Email replacement certificate (test)</button>}{r.reissue_status&&<p className="text-sm">Replacement email: {r.reissue_status==="sent"?"Accepted by provider":r.reissue_status==="sending"?"Attempt recorded":"Requires review"}</p>}
 {r.certificate_status==="approved"&&<button className={btn} disabled={busy} onClick={()=>{if(window.confirm("Withdraw this certificate approval? This does not recall any previously delivered document."))run("withdraw");}}>Withdraw approval</button>}
 <p className="text-xs">Approved signed certificates are available for printing and private digital download. Automatic email delivery is restricted to the approved synthetic test mailbox. Use the postal fulfilment queue for printed certificates.</p></article>}</>:<>{groups.length>0&&<article className="paper-card p-5 space-y-3"><h4 className="font-bold">End-of-round certificate review</h4><p className="text-sm">Review a completed round together. Only currently eligible learners are selectable. No emails are sent from this approval action.</p><label className="block text-sm font-semibold">Completed round<select className="block w-full rounded border p-2" value={batchRound} disabled={busy} onChange={e=>chooseRound(e.target.value)}><option value="">Choose a round</option>{groups.map(g=><option key={g.id} value={g.id}>{g.title} · {new Date(g.end).toLocaleDateString("en-AU",{timeZone:"Australia/Sydney"})}</option>)}</select></label>{group.length>0&&<><button type="button" className={btn} disabled={busy||group.length>8} onClick={()=>{setBatchIds(group.map(v=>v.booking_id));setBatchConfirmed(false);}}>Select all eligible learners</button>{group.map(v=><div key={v.booking_id} className="rounded border p-3 space-y-2"><label className="flex gap-3 items-start"><input type="checkbox" checked={batchIds.includes(v.booking_id)} disabled={busy} onChange={e=>{setBatchIds(ids=>e.target.checked?[...ids,v.booking_id]:ids.filter(id=>id!==v.booking_id));setBatchConfirmed(false);}}/><span><strong>{v.learner_label}</strong><span className="block text-sm">{v.completed_count}/{v.expected_count} workshops · {delivery[v.certificate_delivery]}</span></span></label><button type="button" className={btn} disabled={busy||!templateReady} onClick={()=>preview(v)}>{previewed(v)?"Preview downloaded":"Preview personalised certificate"}</button></div>)}<label className="flex gap-2 text-sm"><input type="checkbox" checked={batchConfirmed} disabled={busy||!selected.length} onChange={e=>setBatchConfirmed(e.target.checked)}/> I reviewed the selected names, attendance, completed round and delivery preferences.</label><button type="button" className={btn+" bg-emerald-950 text-white"} disabled={!templateReady||busy||!batchConfirmed||!selected.length||selected.length>8||!selected.every(previewed)} onClick={approveBatch}>Approve {selected.length} free certificate{selected.length===1?"":"s"}</button></>}</article>}{batchResult&&<article className="paper-card p-4 space-y-2" role="status"><strong>{batchResult.approved} approved · {batchResult.review} need review</strong>{batchResult.items.map(x=><p key={x.booking_id} className="text-sm">{x.name}: {x.approved?"Approved":x.detail}</p>)}</article>}{data.limited&&<p className="text-xs">Showing up to 200 bookings.</p>}{data.items.length?data.items.map(v=><Link className="block paper-card p-4" key={v.kind+":"+v.booking_id} to={root+"&certificate_booking="+encodeURIComponent(v.kind+":"+v.booking_id)}><strong>{v.learner_label} · {v.title}</strong><p className="text-sm">{v.completed_count}/{v.expected_count} completed · {status(v)} · {delivery[v.certificate_delivery]}</p></Link>):<p>No new English Club bookings yet.</p>}</>}
 </section>;
}
