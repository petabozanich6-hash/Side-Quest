import React,{useEffect,useMemo,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {squareProductZip} from "./squareProductZip";

const input="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const primary="rounded-xl bg-[#1F3B2D] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50";
const secondary="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50";
const firstYears={
 NSW:["K","Kindergarten"],VIC:["F","Foundation"],QLD:["Prep","Prep"],
 WA:["K","Pre-primary"],SA:["K","Reception"],TAS:["Prep","Prep"],
 ACT:["K","Kindergarten"],NT:["K","Transition"]
};
const years=Array.from({length:12},(_,i)=>String(i+1));
const electives=["PDHPE","Creative Arts","Languages","Technology"];
const defaultKinds=["blank","guided","printed","planner_blank","planner_personalised","planner_printed"];
const money=n=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD"}).format(Number(n||0)/100);

function uriBytes(uri){
 const data=String(uri||"").split(",")[1];
 if(!data)throw Error("PDF proof missing.");
 const raw=atob(data),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return bytes;
}
function downloadFile(name,blob){
 const url=URL.createObjectURL(blob);
 const a=window.document.createElement("a");a.href=url;a.download=name;
 window.document.body.appendChild(a);a.click();a.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),2500);
}
function storedQueue(){
 try{return JSON.parse(localStorage.getItem("sidequest:home-document-production-queue-v1")||"{}")||{}}
 catch{return {}}
}
const textCopy=async(value)=>{
 if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);
 else throw Error("Clipboard unavailable. Select and copy the text manually.");
};

export default function HqHomeEducationPublisher({jurisdiction,checkedOn}){
 const [year,setYear]=useState("3");
 const [kind,setKind]=useState("blank");
 const [electiveChoices,setElectiveChoices]=useState(["",""]);
 const [catalogue,setCatalogue]=useState(null);
 const [catalogueError,setCatalogueError]=useState("");
 const [loading,setLoading]=useState(false);
 const [busy,setBusy]=useState(false);
 const [proof,setProof]=useState(null);
 const [selected,setSelected]=useState("fillable");
 const [confirmed,setConfirmed]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const [prepared,setPrepared]=useState(storedQueue);
 const offers=useMemo(()=>((catalogue?.offers)||[]).filter(x=>x.state===jurisdiction?.code),[catalogue,jurisdiction?.code]);
 const offer=offers.find(x=>x.kind===kind);
 const output=offer?.production?.output;
 const modes=offer?.production?.customer_modes||[];
 const needsElectives=jurisdiction?.code==="NSW"&&["7","8","9","10"].includes(year);
 const choicesValid=!needsElectives||(electiveChoices.every(Boolean)&&electiveChoices[0]!==electiveChoices[1]);
 const electiveSuffix=needsElectives&&choicesValid?" ("+electiveChoices.join(" + ")+")":"";
 const listingTitle=offer?.listing?.title?offer.listing.title+electiveSuffix:"";
 const listingDescription=offer?.listing?.description?
  offer.listing.description+(needsElectives&&choicesValid?"\n\nThis specific edition includes the NSW additional learning areas: "+electiveChoices.join(" and ")+". Families must verify their chosen actual syllabus.":""):"";
 const preparedKey=offer?.listing?.key+(needsElectives?":"+electiveChoices.join("-"):"");
 const queueEntry=preparedKey?prepared[preparedKey]:null;

 useEffect(()=>{
  const expected=(firstYears[jurisdiction?.code]||["K"])[0];
  if(["K","F","Prep"].includes(year)&&year!==expected)setYear(expected);
 },[jurisdiction?.code,year]);
 useEffect(()=>{setProof(null);setConfirmed(false);setError("");setNotice("")},[
  jurisdiction?.code,year,kind,electiveChoices[0],electiveChoices[1]
 ]);
 useEffect(()=>{
  let mounted=true;setLoading(true);setCatalogueError("");
  adminApi.get("/document-studio/square-production",{year}).then(data=>{
   if(mounted)setCatalogue(data);
  }).catch(e=>{if(mounted){setCatalogue(null);setCatalogueError(errorText(e,"Could not load the real Side-Quest catalogue."))}})
    .finally(()=>{if(mounted)setLoading(false)});
  return()=>{mounted=false};
 },[year]);

 const generate=async()=>{
  if(!offer||!jurisdiction||!choicesValid)return;
  setBusy(true);setProof(null);setConfirmed(false);setError("");setNotice("");
  try{
   const request={state:jurisdiction.code,year_level:year,edition:offer.production.edition,
    product_kind:kind,secondary_electives:needsElectives?electiveChoices:[]};
   const responses=await Promise.all(modes.map(mode=>adminApi.post("/document-studio/export-home-education",{...request,mode})));
   const byMode=Object.fromEntries(responses.map(p=>[p.mode,p]));
   setProof(byMode);setSelected(byMode.fillable?"fillable":"print");
   setNotice(output==="customer"?
    "This is the exact PDF set for this blank product. Inspect it before packaging for Square.":
    "These are OWNER PRODUCTION MASTERS, not an individually completed order. They are not suitable for automatic digital customer delivery.");
  }catch(e){setError(errorText(e,"Could not generate your document."))}
  finally{setBusy(false)}
 };
 const save=()=>{
  if(!proof||!confirmed||!offer)return;
  try{
   const files=modes.map(mode=>({name:proof[mode].filename,bytes:uriBytes(proof[mode].data_url)}));
   const filename=offer.listing.slug+(needsElectives?"-"+electiveChoices.join("-").toLowerCase().replaceAll(" ","-"):"")+(output==="customer"?"-square-customer-files.zip":"-OWNER-PRODUCTION-MASTER.zip");
   const zip=squareProductZip(files);
   downloadFile(filename,zip);
   const next={...prepared,[preparedKey]:{date:new Date().toISOString(),status:output==="customer"?"customer_files_downloaded":"owner_master_downloaded",year,kind}};
   setPrepared(next);
   try{localStorage.setItem("sidequest:home-document-production-queue-v1",JSON.stringify(next))}catch{}
   setNotice(output==="customer"?
     "Customer files downloaded. Attach these to the corresponding Square listing after completing the independent quality and source review. Square delivery is unchanged.":
     "Owner masters downloaded. Do NOT attach these as a final personalised PDF or an instant physical purchase. The individual fulfilment workflow is still required.");
  }catch(e){setError(e?.message||"Could not package the document files.")}
 };
 const choose=(value)=>{setKind(value);setConfirmed(false)};
 const copy=async(value)=>{
  try{await textCopy(value);setNotice("Copied. Check the details against your actual Square product before saving.");}
  catch(e){setError(e?.message||"Could not copy the text.")}
 };
 return <section className="paper-card p-5 space-y-5" data-testid="hq-existing-education-publisher">
  <div className="space-y-2">
   <p className="text-xs font-bold tracking-widest text-[#4A5D3A]">THE ORIGINAL 48 SIDE-QUEST DOCUMENT OFFERS</p>
   <h3 className="text-xl font-bold text-[#1F3B2D]">Create each product for your Square shop</h3>
   <p className="text-sm text-stone-700">Choose one of the six existing products in your selected state or territory. Make its PDF, check it, download it, then create the corresponding Square listing yourself. Your Square order and automatic file-delivery settings are not changed.</p>
   <p className="text-xs text-stone-600">The 48 catalogue families cover eight jurisdictions times six product types. Each generated PDF is for the particular year and any NSW elective choices shown in its Square listing. Create additional listings or correctly named variants for other year levels. Extra-child pricing in your original Side-Quest shop is not automatically copied to Square.</p>
  </div>
  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
   <strong>Catalogue source:</strong> {catalogue?.source||"Checking Side-Quest database"}.
   <p className="mt-1 text-stone-600">Square Dashboard is separate. This shows exactly which listings Side-Quest is configured to recognise, not which products are currently live in Square.</p>
   {loading&&<p role="status" className="mt-1">Checking the existing catalogue…</p>}
   {catalogueError&&<p role="alert" className="mt-1 text-red-800">{catalogueError}</p>}
  </div>
  <div className="grid sm:grid-cols-2 gap-4">
   <label className="text-sm font-semibold">Year or stage for this product
    <select className={input+" mt-1"} value={year} onChange={e=>setYear(e.target.value)}>
     {[firstYears[jurisdiction?.code]||["K","First school year"],...years.map(y=>[y,"Year "+y])].map(([v,label])=><option key={v} value={v}>{label}</option>)}
    </select>
   </label>
   <label className="text-sm font-semibold">Existing product you want to prepare
    <select className={input+" mt-1"} value={kind} onChange={e=>choose(e.target.value)}>
     {defaultKinds.map(k=>{const o=offers.find(x=>x.kind===k);return <option key={k} value={k}>{o?o.label+" — "+money(o.current_sidequest_price_cents??o.default_price_cents):k}</option>})}
    </select>
   </label>
  </div>
  {offers.length>0&&<div className="space-y-2">
   <h4 className="font-semibold">All six products configured for {jurisdiction.name}</h4>
   <div className="grid sm:grid-cols-2 gap-2">
    {offers.map(o=><button key={o.key} type="button" onClick={()=>choose(o.kind)}
      className={"rounded-xl border p-3 text-left text-sm "+(o.kind===kind?"border-[#1F3B2D] bg-[#F2F5F0]":"border-stone-200 bg-white")}>
      <span className="font-semibold">{o.label}</span>
      <span className="block text-stone-600">{money(o.current_sidequest_price_cents??o.default_price_cents)} · {o.production.output==="customer"?"Digital customer file":"Owner production master"}</span>
      <span className="block text-xs mt-1 text-stone-500">
       {o.sidequest_listings.length?o.sidequest_listings.length+" Side-Quest record(s), "+o.sidequest_listings.map(p=>p.status).join(", "):"Not found in Side-Quest's current database"}
      </span>
      {prepared[o.state+":"+o.kind+":"+year+(needsElectives?":"+electiveChoices.join("-"):"")]&&<span className="block text-xs mt-1 font-semibold text-[#1F3B2D]">Files downloaded on this device</span>}
    </button>)}
   </div>
  </div>}
  {needsElectives&&<div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-3">
   <p className="font-semibold text-[#1F3B2D]">NSW Years 7–10: two additional learning areas</p>
   <p className="text-sm">Select two different areas. This creates a specific version, so include those choices in your Square listing. The family must still identify the actual syllabuses.</p>
   <div className="grid sm:grid-cols-2 gap-2">
    {[0,1].map(i=><label key={i} className="text-sm font-semibold">Additional area {i+1}
     <select className={input+" mt-1"} value={electiveChoices[i]} onChange={e=>setElectiveChoices(old=>old.map((v,n)=>n===i?e.target.value:v))}>
      <option value="">Select an area</option>
      {electives.map(o=><option key={o} value={o} disabled={electiveChoices[1-i]===o}>{o}</option>)}
     </select>
    </label>)}
   </div>
  </div>}
  {offer&&<div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
   <div className="flex flex-wrap items-center gap-3 justify-between">
    <h4 className="font-semibold text-lg">{offer.label}</h4>
    <strong>{money(offer.current_sidequest_price_cents??offer.default_price_cents)}</strong>
   </div>
   <p className="text-sm">{offer.production.purpose}</p>
   <p className="text-xs text-stone-600">Current Side-Quest record: {offer.current_sidequest_title||"No unique matching product"}.
    {offer.current_sidequest_price_cents!=null&&offer.current_sidequest_price_cents!==offer.default_price_cents&&
      <strong> Its saved price differs from the original {money(offer.default_price_cents)} default; your saved value is shown above.</strong>}
    {offer.catalogue_warning&&<strong className="block text-amber-900">{offer.catalogue_warning}</strong>}
   </p>
   <div className="rounded-lg bg-stone-50 p-3 text-sm space-y-2">
    <strong>Correct Square listing title</strong>
    <p>{listingTitle}</p>
    <button className={secondary} type="button" onClick={()=>copy(listingTitle)}>Copy title</button>
    <strong className="block pt-2">Suggested customer-facing description</strong>
    <p className="whitespace-pre-line">{listingDescription}</p>
    <button className={secondary} type="button" onClick={()=>copy(listingDescription)}>Copy description</button>
    <p className="text-amber-900 font-semibold pt-2">{offer.listing.note}</p>
   </div>
   {["NT"].includes(jurisdiction?.code)&&<p className="text-sm text-amber-900">NT preparation documents do not replace the official government plan template.</p>}
   {["11","12"].includes(year)&&<p className="text-sm text-amber-900">Senior secondary course and study requirements need specific curriculum review before publication.</p>}
   {queueEntry&&<p className="text-xs text-stone-600">Local workflow note: {queueEntry.status.replaceAll("_"," ")} on {new Date(queueEntry.date).toLocaleDateString("en-AU")}. This does NOT mean listed, approved or active in Square.</p>}
   <button className={primary} type="button" disabled={busy||loading||!jurisdiction||!choicesValid}
    onClick={generate}>{busy?"Building PDF masters…":output==="customer"?"Generate customer print + fillable PDFs":"Generate OWNER production master PDFs"}</button>
  </div>}
  {error&&<p role="alert" className="text-sm text-red-800">{error}</p>}
  {notice&&<p role="status" className="text-sm text-[#1F3B2D]">{notice}</p>}
  {proof&&offer&&<div className="border-t border-stone-200 pt-4 space-y-4">
   <h4 className="font-bold text-[#1F3B2D]">Inspect the {output==="customer"?"actual customer documents":"owner production master"}</h4>
   <div className="flex flex-wrap gap-2">
    {modes.map(mode=><button key={mode} type="button" className={selected===mode?primary:secondary} onClick={()=>setSelected(mode)}>
     {mode==="print"?"A4 print proof":"Fillable PDF proof"}
    </button>)}
   </div>
   <iframe className="w-full border rounded-xl bg-white" style={{height:"min(75vh,780px)"}}
    title={selected+" document proof"} src={proof[selected]?.data_url}/>
   <div className="flex flex-wrap gap-2">
    {modes.map(mode=><a key={mode} className={secondary} href={proof[mode].data_url} download={proof[mode].filename}>Download {mode==="print"?"print":"fillable"} proof</a>)}
   </div>
   <div className="rounded-xl border border-stone-200 p-4 space-y-3">
    <strong>Release review</strong>
    <p className="text-sm">Inspect every page, print an A4 sample and verify official state rules. For interactive fields, enter meaningful long answers, save, close and reopen the PDF. Independent editorial/regulatory review is still required before describing any product as registration-ready.</p>
    {output!=="customer"&&<p className="text-sm text-amber-900 font-semibold">These files are production proofs ONLY. Square cannot automatically turn this master into an individually personalised PDF or a posted book. A separate, tested customer intake and fulfilment process is required.</p>}
    <label className="flex gap-2 items-start text-sm">
     <input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>
     <span>I have inspected the file outputs and understand the outstanding review/fulfilment requirements. Downloading does not independently approve them for sale.</span>
    </label>
    <button className={primary} type="button" onClick={save} disabled={!confirmed}>
     {output==="customer"?"Download customer PDF ZIP for Square":"Download OWNER production-master ZIP"}
    </button>
   </div>
  </div>}
  <p className="text-xs text-amber-900">Jurisdiction guidance last reviewed {checkedOn||"on an earlier date"}. Verify requirements again before sale. Upload only the reviewed, correct product files. No Square listing, payment or delivery settings are changed by this screen.</p>
 </section>;
}
