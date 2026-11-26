import React,{useEffect,useRef,useState} from "react";
import {Link} from "react-router-dom";
import {adminApi,errorText} from "../../../lib/adminApi";
const date=v=>new Date(v).toLocaleDateString("en-AU",{timeZone:"Australia/Sydney"});
export default function HqClubPreparationContext({classId}){
 const [data,setData]=useState(null),[error,setError]=useState(""),[loading,setLoading]=useState(false);
 const generation=useRef(0);
 async function load(){
  const g=++generation.current;setLoading(true);setError("");setData(null);
  try{const r=await adminApi.get("/english-club/classes/"+encodeURIComponent(classId)+"/preparation-context");if(g===generation.current)setData(r);}
  catch(e){if(g===generation.current)setError(errorText(e));}
  finally{if(g===generation.current)setLoading(false);}
 }
 useEffect(()=>{load();return()=>{generation.current++;};},[classId]);
 return <section className="paper-card p-4 space-y-3"><div className="flex items-center justify-between gap-2"><h4 className="font-bold">Private group preparation</h4><button type="button" className="underline text-sm" disabled={loading} onClick={load}>Refresh booked learners</button></div><p className="text-sm">Review each confirmed learner before planning the workshop. Nothing here is automatically shared with the group or copied into prompts.</p>{error&&<p role="alert">{error}</p>}{loading&&<p role="status">Checking current paid places…</p>}{data&&<><p className="text-sm font-semibold">{data.learners.length} confirmed learners{data.limited?" — roster limit exceeded, review participants":""}</p>{!data.learners.length&&<p>No confirmed paid learners yet.</p>}{data.learners.map(s=>{const l=s.learner;return <details key={s.seat_id} className="border rounded-lg p-3 space-y-2"><summary className="font-semibold cursor-pointer">{s.booked_label}{l?.year_level?" · "+l.year_level:""}</summary>{!l?<p className="text-sm">Historical or unlinked place. Review its original enquiry; no profile has been inferred.</p>:<><Link className="underline text-sm" to={"/parent/command-centre/customers?"+new URLSearchParams({directory:"unified",kind:"account",family:l.family_id,section:"learners",learner:l.id})}>Open private learner profile →</Link>{[["Parent request",s.current_enquiry],["Learning goals",l.goals],["Interests and strengths",l.interests],["Helpful teaching approaches",l.approach],["Private notes",l.private_notes]].map(([label,v])=><p key={label} className="text-sm whitespace-pre-wrap break-words"><strong>{label}:</strong> {v||"Not recorded"}</p>)}<details><summary className="font-semibold text-sm">Recent reviewed reports</summary>{s.reports.length?s.reports.map(r=><article key={r.id} className="border-t pt-2 space-y-1"><strong className="text-sm">{date(r.end_at)} · {r.subject}</strong>{r.sections.map((v,i)=>v&&<p key={i} className="text-sm whitespace-pre-wrap break-words"><strong>{["Covered","Strengths","Practice","Home learning"][i]}:</strong> {v}</p>)}</article>):<p className="text-sm">No previous published reports.</p>}</details></>}</details>;})}</>}</section>;
}
