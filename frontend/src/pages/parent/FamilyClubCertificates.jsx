import React,{useEffect,useRef,useState} from "react";
import {api,apiErrorMessage} from "../../lib/api";
export function downloadCertificate(doc){
 if(doc?.mime!=="application/pdf"||typeof doc.base64!=="string"||doc.base64.length>200000||doc.filename!=="sidequest-english-club-certificate.pdf")throw Error("Unexpected certificate file.");
 const bytes=Uint8Array.from(atob(doc.base64),c=>c.charCodeAt(0));
 const url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
 const a=document.createElement("a");a.href=url;a.download=doc.filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const delivery={pdf:"Digital PDF",post:"Printed and posted",both:"Digital PDF and post"};
export default function FamilyClubCertificates(){
 const [data,setData]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(""),[retry,setRetry]=useState(0);
 const lock=useRef(false),active=useRef(true);
 useEffect(()=>{active.current=true;return()=>{active.current=false;};},[]);
 useEffect(()=>{let live=true;setData(null);setError("");api.get("/family-portal/certificates").then(r=>{if(live)setData(r.data);}).catch(e=>{if(live)setError(apiErrorMessage(e,"Could not load certificates."));});return()=>{live=false;};},[retry]);
 async function get(id){
  if(lock.current)return;lock.current=true;setBusy(id);setError("");
  try{const r=await api.get("/family-portal/certificates/"+encodeURIComponent(id)+"/pdf");if(active.current)downloadCertificate(r.data);}
  catch(e){if(active.current)setError(apiErrorMessage(e,"This certificate could not be downloaded."));}finally{lock.current=false;if(active.current)setBusy("");}
 }
 return <section className="space-y-3"><p className="text-sm">Your family's approved English Club completion certificates. All certificates are free.</p>{error&&<p role="alert">{error} <button type="button" className="underline" onClick={()=>setRetry(v=>v+1)}>Refresh</button></p>}{!data?!error&&<p role="status">Loading certificates…</p>:<>{data.items.length?data.items.map(r=><article key={r.id} className="paper-card p-5 space-y-2"><h2 className="font-bold">{r.learner_name} · {r.title}</h2><p className="text-sm">{r.session_count} completed {r.session_count===1?"workshop":"workshops"} · {new Date(r.completed_at).toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"long"})}</p><p className="text-sm">{delivery[r.delivery]}</p>{r.pdf_available?<button type="button" className="rounded-lg bg-emerald-950 text-white px-4 py-2 disabled:opacity-50" disabled={!!busy} onClick={()=>get(r.id)}>{busy===r.id?"Preparing PDF…":"Download certificate PDF"}</button>:<p className="text-sm">Printed certificate requested. Postal fulfilment is not yet available in this pilot.</p>}</article>):<p>No approved certificates are available yet.</p>}{data.limited&&<p className="text-xs">Showing the latest 100 certificates.</p>}</>}</section>;
}
