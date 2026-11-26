import React,{useEffect,useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {api,apiErrorMessage} from "../../lib/api";
const labels=["What we covered","Strengths and progress","Areas to practise","Optional home learning"],root="/family-portal?page=reports";
export default function FamilyProgressReports(){
 const [params]=useSearchParams(),id=params.get("report")||"";
 const [data,setData]=useState(null),[error,setError]=useState(""),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setData(null);setError("");api.get("/family-portal/progress-reports").then(r=>{if(active)setData(r.data);}).catch(e=>{if(active)setError(apiErrorMessage(e,"Could not load progress reports."));});return()=>{active=false;};},[retry,id]);
 const report=data?.reports.find(v=>v.id===id);
 const date=v=>new Date(v).toLocaleDateString("en-AU",{timeZone:"Australia/Sydney",dateStyle:"long"});
 return <section className="space-y-3">{error?<p role="alert">{error} <button className="underline" onClick={()=>setRetry(v=>v+1)}>Try again</button></p>:!data?<p role="status">Loading your reviewed learning reports…</p>:id?<><Link className="underline text-sm" to={root}>← All progress reports</Link>{report?<article className="paper-card p-5 space-y-4"><h2 className="font-display text-xl font-bold">{report.learner_label} · {report.kind==="club"?"English Club":"Tutoring"}</h2><p className="text-xs">Published {date(report.published_at)}</p>{labels.map((label,i)=>report.sections[i]?.trim()&&<div key={label}><h3 className="font-semibold">{label}</h3><p className="whitespace-pre-wrap break-words text-sm">{report.sections[i]}</p></div>)}</article>:<p>This report is not available.</p>}</>:<><p className="text-sm">Your tutor's reviewed learning updates, kept privately in your family account.</p>{data.reports.length?data.reports.map(v=><Link className="block paper-card p-4" key={v.id} to={root+"&report="+encodeURIComponent(v.id)}><strong>{v.learner_label} · {v.kind==="club"?"English Club":"Tutoring"}</strong><p className="text-sm">Published {date(v.published_at)}</p><span className="underline text-sm">Read report →</span></Link>):<p>No reviewed reports have been published yet.</p>}{data.limited&&<p className="text-xs">Showing the latest 100 reports.</p>}</>}</section>;
}
