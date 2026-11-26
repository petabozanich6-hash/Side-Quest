import React,{useEffect,useRef,useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {downloadCertificate} from "../FamilyClubCertificates";
import {adminApi,errorText} from "../../../lib/adminApi";
const root="?view=English+Club&club=certificates",btn="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50";
const delivery={pdf:"Email PDF",post:"Printed and posted",both:"Email PDF and post"};
const status=r=>r.certificate_status==="withdrawn"?"Withdrawn":r.certificate_status==="approved"?(r.eligible?"Approved for fulfilment":"Approved record needs review"):r.eligible?"Ready for review":r.eligibility==="awaiting_completion"?"Awaiting workshop completion":"Attendance or payment needs review";
export default function HqClubCertificates(){
 const [params]=useSearchParams(),chosen=params.get("certificate_booking")||"";
 const [data,setData]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[confirmed,setConfirmed]=useState(false);
 const lock=useRef(false),generation=useRef(0);
 async function load(){setData(await adminApi.get("/english-club/certificates"));}
 useEffect(()=>{load().catch(e=>setError(errorText(e)));},[]);
 useEffect(()=>{generation.current++;setConfirmed(false);setError("");setNotice("");},[chosen]);
 const r=data?.items.find(v=>v.kind+":"+v.booking_id===chosen);
 async function run(action){
  if(lock.current||!r)return;lock.current=true;setBusy(true);setError("");setNotice("");const g=generation.current;
  try{const path="/english-club/certificates/"+encodeURIComponent(r.kind)+"/"+encodeURIComponent(r.booking_id);
   if(action==="pdf"){const doc=await adminApi.get("/english-club/certificates/"+encodeURIComponent(r.certificate_id)+"/pdf");if(g===generation.current)downloadCertificate(doc);return;}
   if(action==="approve")await adminApi.post(path+"/approve",{confirmed,learner_name:r.learner_label,title:r.title,expected_count:r.expected_count,delivery:r.certificate_delivery,completed_at:r.last_end_at});
   else await adminApi.post(path+"/withdraw",{confirmed:true,certificate_id:r.certificate_id});
   await load();if(g===generation.current){setConfirmed(false);setNotice(action==="approve"?"Certificate approved. A private PDF is now available.":"Certificate approval withdrawn.");}
  }catch(e){if(g===generation.current)setError(errorText(e));}finally{lock.current=false;setBusy(false);}
 }
 return <section className="space-y-4"><p className="text-sm">Free certificates acknowledge English Club participation. A single workshop requires verified payment and recorded attendance; a round requires every booked workshop to be completed and attended. Attendance or payment exceptions require review; the pilot does not automatically grant completion for missed sessions.</p>{error&&<p role="alert" className="text-rose-800">{error}</p>}{notice&&<p role="status">{notice}</p>}
 {!data?<p>Loading certificate records…</p>:chosen?<><Link className="underline text-sm" to={root}>← All certificates</Link>{!r?<p>Booking unavailable.</p>:<article className="paper-card p-5 space-y-3"><h4 className="font-bold">{r.learner_label} · {r.title}</h4><p>{r.completed_count} of {r.expected_count} workshops verified and attended.</p><p>Delivery: {delivery[r.certificate_delivery]} · No charge</p><p>Status: {status(r)}</p>{r.last_end_at&&<p className="text-sm">Final workshop ends {new Date(r.last_end_at).toLocaleString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"medium",timeStyle:"short"})} Sydney time.</p>}
 {r.eligible&&!r.certificate_status&&<><label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/> I reviewed the recorded attendance, certificate name, workshop title and delivery preference.</label><button className={btn+" bg-emerald-950 text-white"} disabled={!confirmed||busy} onClick={()=>run("approve")}>Approve free certificate</button></>}
 {r.certificate_status==="approved"&&r.eligible&&<button className={btn} disabled={busy} onClick={()=>run("pdf")}>Download print-ready certificate PDF</button>}
 {r.certificate_status==="approved"&&<button className={btn} disabled={busy} onClick={()=>{if(window.confirm("Withdraw this certificate approval? This does not recall any previously delivered document."))run("withdraw");}}>Withdraw approval</button>}
 <p className="text-xs">The PDF is available for eligible approved records. Automatic email delivery and private postal fulfilment are not yet enabled.</p></article>}</>:<>{data.limited&&<p className="text-xs">Showing up to 200 bookings.</p>}{data.items.length?data.items.map(v=><Link className="block paper-card p-4" key={v.kind+":"+v.booking_id} to={root+"&certificate_booking="+encodeURIComponent(v.kind+":"+v.booking_id)}><strong>{v.learner_label} · {v.title}</strong><p className="text-sm">{v.completed_count}/{v.expected_count} completed · {status(v)} · {delivery[v.certificate_delivery]}</p></Link>):<p>No new English Club bookings yet.</p>}</>}
 </section>;
}
