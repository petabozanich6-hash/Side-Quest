import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {squareProductZip} from "./squareProductZip";

const input="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const primary="rounded-xl bg-[#1F3B2D] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50";
const secondary="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50";
const foundationYears={
 NSW:["K","Kindergarten"],VIC:["F","Foundation"],QLD:["Prep","Prep"],
 WA:["K","Pre-primary"],SA:["K","Reception"],TAS:["Prep","Prep"],
 ACT:["K","Kindergarten"],NT:["K","Transition"],
};
const years=Array.from({length:12},(_,i)=>String(i+1));
const NSW_OPTIONAL_AREAS=["PDHPE","Creative Arts","Languages","Technology"];
const editions={
 standard:{label:"Home Education Planning Workbook",summary:"A state-specific learning plan with learner goals, detailed teaching plans for each learning area, curriculum references, resources, evidence recording, review pages and authority preparation notes."},
 complete:{label:"Complete Home Education Planner & Diary",summary:"Everything in the planning workbook, plus four planning periods, learning diaries, dated evidence and reading logs, goal/outcome trackers, project records and family progress reviews."}
};
function bytes(uri){
 const binary=atob(String(uri||"").split(",")[1]||""),out=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);
 return out;
}
function downloadPack(result,filename){
 const files=[
  {name:result.print.filename,bytes:bytes(result.print.data_url)},
  {name:result.fillable.filename,bytes:bytes(result.fillable.data_url)}
 ];
 const blob=squareProductZip(files),url=URL.createObjectURL(blob);
 const a=window.document.createElement("a");a.href=url;a.download=filename;
 window.document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
export default function HqHomeEducationPublisher({jurisdiction,checkedOn}){
 const [year,setYear]=useState("3");
 const [edition,setEdition]=useState("standard");
 const [electives,setElectives]=useState(["",""]);
 const [proof,setProof]=useState(null);
 const [selected,setSelected]=useState("fillable");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [review,setReview]=useState(false);
 useEffect(()=>{
  const schoolFirst=(foundationYears[jurisdiction?.code]||["K"])[0];
  if(["K","F","Prep"].includes(year) && year!==schoolFirst)setYear(schoolFirst);
 },[jurisdiction?.code,year]);
 useEffect(()=>{setProof(null);setReview(false);setError("");setNotice("")},[jurisdiction?.code,year,edition,electives[0],electives[1]]);
 const needsElectives=jurisdiction?.code==="NSW"&&["7","8","9","10"].includes(year);
 const validElectives=!needsElectives||(electives.every(Boolean)&&electives[0]!==electives[1]);
 const setElective=(index,value)=>setElectives(v=>v.map((item,i)=>i===index?value:item));
 const generate=async()=>{
  if(!jurisdiction)return;
  setBusy(true);setError("");setNotice("");setProof(null);setReview(false);
  try{
   const req={state:jurisdiction.code,year_level:year,edition,secondary_electives:needsElectives?electives:[]};
   const [print,fillable]=await Promise.all(["print","fillable"].map(mode=>adminApi.post("/document-studio/export-home-education",{...req,mode})));
   setProof({print,fillable});setSelected("fillable");
   setNotice("Both editions generated from the same master. Inspect the full documents and test the interactive fields before offering them for sale.");
  }catch(e){setError(errorText(e,"Could not generate the document."))}
  finally{setBusy(false)}
 };
 const download=()=>{
  if(!proof||!jurisdiction)return;
  try{
   downloadPack(proof,"sidequest-"+jurisdiction.code.toLowerCase()+"-"+year.toLowerCase()+"-"+edition+"-square-package.zip");
   setNotice("Customer PDF package downloaded. No product was published or sold.");
  }catch(e){setError(e?.message||"Could not package these PDFs.")}
 };
 return <section className="paper-card p-5 space-y-5" data-testid="hq-existing-education-publisher">
  <div className="space-y-2">
   <p className="text-xs font-bold tracking-widest text-[#4A5D3A]">EXISTING SIDE-QUEST DOCUMENT COLLECTION</p>
   <h3 className="text-xl font-bold text-[#1F3B2D]">Create your home education documents for Square</h3>
   <p className="text-sm text-stone-700">These are the planning and recordkeeping products Document Studio already created, redesigned with larger working areas and purpose-specific pages. This generates files only. You handle the Square listing and your existing automatic delivery.</p>
  </div>
  <div className="grid gap-4 md:grid-cols-2">
   <label className="text-sm font-semibold">Document to create
    <select className={input+" mt-1"} value={edition} onChange={e=>setEdition(e.target.value)}>
     {Object.entries(editions).map(([key,e])=><option value={key} key={key}>{e.label}</option>)}
    </select>
   </label>
   <label className="text-sm font-semibold">Learner year or stage
    <select className={input+" mt-1"} value={year} onChange={e=>setYear(e.target.value)}>
     {[foundationYears[jurisdiction?.code]||["K","First year"],...years.map(y=>[y,"Year "+y])].map(([value,label])=><option value={value} key={value}>{label}</option>)}
    </select>
   </label>
  </div>
  {needsElectives&&<div className="rounded-xl border border-[#C8A66A] bg-amber-50 p-4 space-y-3">
   <p className="font-semibold text-[#1F3B2D]">NSW Years 7–10: choose the two additional learning areas</p>
   <p className="text-sm text-stone-700">English, Mathematics, Science and HSIE are already included. Choose two further, <strong>different</strong> key learning areas. Families still need to identify the actual syllabus or subject within each area.</p>
   <div className="grid md:grid-cols-2 gap-3">
    {[0,1].map(index=><label key={index} className="text-sm font-semibold">Additional learning area {index+1}
     <select className={input+" mt-1"} value={electives[index]} onChange={e=>setElective(index,e.target.value)}>
      <option value="">Select an area</option>
      {NSW_OPTIONAL_AREAS.map(area=><option key={area} value={area} disabled={electives[1-index]===area}>{area}</option>)}
     </select>
    </label>)}
   </div>
   {!validElectives&&<p className="text-sm text-amber-900">Choose two different learning areas before generating the product.</p>}
  </div>}
  {jurisdiction?.code==="NT"&&<p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">Northern Territory: the government requires the applicable official self-developed plan template. These downloadable planning workbooks are preparation companions, not replacements for that form.</p>}
  {["11","12"].includes(year)&&<p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">Senior secondary planning can require specific course and study patterns. Review the relevant authority's senior secondary rules and syllabus versions before distributing this product.</p>}
  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm space-y-2">
   <p className="font-bold text-[#1F3B2D]">{editions[edition].label}</p>
   <p>{editions[edition].summary}</p>
   <p className="text-stone-600">State/territory: <strong>{jurisdiction?.name||"Select a state above"}</strong> · Format: A4, print and fillable PDF editions</p>
  </div>
  <div className="space-y-2">
   <button type="button" className={primary} onClick={generate} disabled={busy||!jurisdiction||!validElectives}>{busy?"Generating the document set…":"Generate complete print + fillable PDF editions"}</button>
   <p className="text-xs text-stone-600">Neither PDF is connected to a Side-Quest shop listing or payment. Files are generated privately for you to review and download.</p>
  </div>
  {error&&<p role="alert" className="text-sm text-red-800">{error}</p>}
  {notice&&<p role="status" className="text-sm text-[#1F3B2D]">{notice}</p>}
  {proof&&<div className="border-t border-stone-200 pt-4 space-y-4">
   <h4 className="font-bold text-[#1F3B2D]">Review the actual document</h4>
   <div className="flex flex-wrap gap-2">
    <button type="button" className={selected==="fillable"?primary:secondary} onClick={()=>setSelected("fillable")}>Fillable PDF proof</button>
    <button type="button" className={selected==="print"?primary:secondary} onClick={()=>setSelected("print")}>Printable PDF proof</button>
   </div>
   <iframe className="w-full border rounded-xl bg-white" style={{height:"min(75vh,780px)"}} title={selected+" home education PDF proof"} src={proof[selected].data_url}/>
   <div className="grid gap-3 md:grid-cols-2">
    {["print","fillable"].map(mode=><a key={mode} className={secondary+" text-center"} href={proof[mode].data_url} download={proof[mode].filename}>
     Download {mode==="print"?"A4 printable":"digitally fillable"} PDF
    </a>)}
   </div>
   <div className="rounded-xl border border-stone-200 p-4 space-y-3">
    <p className="font-semibold text-sm">Manual publication quality check</p>
    <p className="text-xs text-stone-700">Print an A4 sample, check every page for clipped content and accurate instructions, then type into the digital fields, tick the boxes, save, close and reopen the file. Test long responses too. Export generation is not independent editorial or regulatory approval.</p>
    <label className="flex gap-2 items-start text-sm">
     <input type="checkbox" checked={review} onChange={e=>setReview(e.target.checked)}/>
     <span>I have inspected both files and tested their printed and digitally fillable function, and I understand that official requirements require independent verification before sale.</span>
    </label>
    <button type="button" className={primary} disabled={!review} onClick={download}>Download both PDFs as one customer ZIP</button>
   </div>
  </div>}
  <p className="text-xs text-amber-900">The current jurisdiction source catalogue was last checked {checkedOn||"on an earlier date"}. Don't market these materials as approved for registration unless the required independent state-specific content review is complete.</p>
 </section>;
}