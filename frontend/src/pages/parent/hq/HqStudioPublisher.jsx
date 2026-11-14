import React,{useEffect,useState} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import {downloadSquareProductZip} from "./squareProductZip";

const STORAGE="sidequest.documentStudio.squarePublisher.v1";
const styles={input:"w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900",button:"rounded-xl bg-[#1F3B2D] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50",secondary:"rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700"};
const page=(title,instructions,kind,prompts)=>({title,instructions,kind,prompts});
const templates={
 worksheet:{title:"My Learning Worksheet",subtitle:"A practical activity to explore, practise and reflect",audience:"Primary learners",pages:[
  page("Explore the idea","Read the prompt and explain what you already know. Use the writing space to show your thinking.","writing",["What do you already know about this topic?","What would you like to discover?"]),
  page("Try it yourself","Complete these activities. Show your working or explain your answers.","writing",["My first activity","My second activity","Something I learned"]),
  page("Reflection checklist","Tick each statement after completing the activity.","checklist",["I read the instructions carefully.","I completed the activities.","I checked my work.","I know what I want to practise next."])
 ]},
 planner:{title:"Our Learning Planner",subtitle:"A flexible plan for everyday learning",audience:"Home education families",pages:[
  page("Our priorities","Write your learning priorities for this planning period. Include meaningful and manageable goals.","writing",["Our biggest goal","What we are excited to learn","Resources and support we need"]),
  page("Learning record","Record completed learning experiences and evidence over time.","log",["Learning experience","Practical activity","Reading or research","Creative project","Review and reflection"]),
  page("Review and adjust","Think about what worked and what you would change in your next plan.","writing",["What went well?","What needs more support?","Our next steps"])
 ]},
 reading:{title:"Reading Journal",subtitle:"Record books, notice details and share ideas",audience:"Young readers",pages:[
  page("Book details","Record the book you are currently reading.","writing",["Book title and author","What is this book about?","My first impressions"]),
  page("Reading log","Record your reading sessions. Use the notes column for reflections or new words.","log",["Chapter or page range","Favourite moment","New vocabulary","Question for next time"]),
  page("Let's think","Explain your ideas using details from the text.","writing",["Which character interested you most and why?","What surprised you?","Would you recommend this book? Why?"])
 ]},
 evidence:{title:"Learning Evidence Tracker",subtitle:"Collect, organise and reflect on learning",audience:"Home education families",pages:[
  page("Our evidence goals","Choose the kinds of learning evidence you intend to keep.","checklist",["Dated work samples","Project photographs","Reading records","Practical activity notes","Assessment or progress notes","Child reflections"]),
  page("Evidence record","Keep a dated record of activities and the evidence you have collected.","log",["Work sample","Project or experiment","Reading activity","Community learning","Reflection"]),
  page("Progress reflection","Describe what the evidence demonstrates and what you plan next.","writing",["What has been learned?","How do the samples show progress?","What will we work on next?"])
 ]},
 checklist:{title:"Our Project Checklist",subtitle:"A simple way to plan and track important steps",audience:"Families and learners",pages:[
  page("Project preparation","Check the items as you prepare your project.","checklist",["We know what we want to achieve.","We have gathered the necessary resources.","We have a plan for getting started.","We have decided how to record our progress."]),
  page("What we did","Document the completed project and your reflections.","writing",["Our project and main goal","What we did","What we learned","What we would do differently"])
 ]}
};
const starter=()=>JSON.parse(JSON.stringify(templates.worksheet));
const slug=v=>(v||"side-quest-document").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);
function restored(){
 try{
  const saved=JSON.parse(window.localStorage.getItem(STORAGE));
  if(saved && typeof saved.title==="string" && Array.isArray(saved.pages))return saved;
 }catch{}
 return starter();
}
export default function HqStudioPublisher(){
 const [document,setDocument]=useState(restored);
 const [selected,setSelected]=useState(0);
 const [proof,setProof]=useState(null);
 const [edition,setEdition]=useState("fillable");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [template,setTemplate]=useState("worksheet");
 const [showPreview,setShowPreview]=useState(false);
 useEffect(()=>{try{window.localStorage.setItem(STORAGE,JSON.stringify(document))}catch{}},[document]);
 const update=(f)=>{setDocument(d=>f(d));setProof(null);setError("");setNotice("");setShowPreview(false)};
 const updateMetadata=(key,value)=>update(d=>({...d,[key]:value}));
 const updatePage=(index,key,value)=>update(d=>({...d,pages:d.pages.map((p,i)=>i===index?{...p,[key]:value}:p)}));
 const newPage=()=>{update(d=>({...d,pages:[...d.pages,page("New activity","Explain what the learner should do here.","writing",["My response"])]}));setSelected(document.pages.length)};
 const removePage=index=>{if(document.pages.length===1)return;update(d=>({...d,pages:d.pages.filter((_,i)=>i!==index)}));setSelected(Math.max(0,selected>index?selected-1:Math.min(index,document.pages.length-2)))};
 const movePage=(index,dir)=>{
  const target=index+dir;if(target<0||target>=document.pages.length)return;
  update(d=>{const pages=[...d.pages];[pages[index],pages[target]]=[pages[target],pages[index]];return {...d,pages}});
  setSelected(target);
 };
 const applyTemplate=key=>{
  if(!templates[key])return;
  if(!window.confirm("Replace the current document draft with this starter template? Your current pages will be overwritten."))return;
  update(()=>JSON.parse(JSON.stringify(templates[key])));
  setSelected(0);setTemplate(key);
 };
 const build=async()=>{
  setBusy(true);setError("");setNotice("");setProof(null);
  try{
   const product={...document,pages:document.pages.map(p=>({...p,prompts:p.prompts.map(x=>x.trim()).filter(Boolean)}))};
   const [print,fillable]=await Promise.all(["print","fillable"].map(mode=>adminApi.post("/document-studio/export",{mode,product})));
   setProof({print,fillable});
   setShowPreview(true);setEdition("fillable");
   setNotice("Both PDF editions created. Open the previews, check every page, and test typing, ticking, saving and reopening before selling.");
  }catch(e){setError(errorText(e,"Could not generate the PDFs. Check all page content."))}
  finally{setBusy(false)}
 };
 const copyListing=async()=>{
  const kinds={writing:"write and reflect",checklist:"track progress",log:"keep dated records"};
  const description=document.subtitle+". A practical Side-Quest resource for "+(document.audience||"learners and families")+". Includes "+document.pages.length+" structured activities to "+[...new Set(document.pages.map(p=>kinds[p.kind]))].join(", ")+". Includes both A4 printable and digitally fillable PDF editions. Digital download; no physical product.";
  try{await navigator.clipboard.writeText(document.title+"\n\n"+description);setNotice("Square product title and description copied.")}catch{setError("Your browser could not copy the description. Select and copy the text manually.")}
 };
 const current=document.pages[selected]||document.pages[0];
 const preview=proof?.[edition];
 return <div className="space-y-6" data-testid="hq-studio-publisher">
  <section className="paper-card p-5 space-y-3">
   <p className="text-xs font-bold tracking-widest text-[#4A5D3A]">DOCUMENT STUDIO / SQUARE EXPORT</p>
   <h3 className="text-2xl font-bold text-[#1F3B2D]">Make the product. Download it. Sell it in Square.</h3>
   <p className="text-sm text-stone-700">Build a complete, functional Side-Quest PDF set here, then manually upload it to your Square shop. This workshop does not create a Side-Quest shop listing or take payments.</p>
   <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
    Every export includes a <strong>printable A4 edition</strong> with generous handwriting space and a matching <strong>digitally fillable edition</strong> with real PDF form fields. Exported files are proofs until you have checked them.
   </div>
  </section>
  <section className="paper-card p-5 space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h3 className="text-lg font-bold text-[#1F3B2D]">1. Product details</h3>
    <label className="text-sm font-semibold">Start with a design
     <select className={styles.input} value={template} onChange={e=>applyTemplate(e.target.value)}>
      <option value="worksheet">Worksheet or activity pack</option><option value="planner">Family planner</option>
      <option value="reading">Reading journal</option><option value="evidence">Evidence tracker</option>
      <option value="checklist">Project checklist</option>
     </select>
    </label>
   </div>
   <div className="grid gap-4 md:grid-cols-2">
    <label className="text-sm font-semibold">Product name<input className={styles.input} value={document.title} maxLength={110} onChange={e=>updateMetadata("title",e.target.value)}/></label>
    <label className="text-sm font-semibold">Intended audience<input className={styles.input} value={document.audience} maxLength={90} onChange={e=>updateMetadata("audience",e.target.value)}/></label>
   </div>
   <label className="block text-sm font-semibold">Subtitle or description<input className={styles.input} value={document.subtitle} maxLength={180} onChange={e=>updateMetadata("subtitle",e.target.value)}/></label>
   <p className="text-xs text-stone-600">Your draft saves in this browser automatically. The generated PDFs are not sent to customers or published anywhere.</p>
  </section>
  <section className="paper-card p-5 space-y-4">
   <h3 className="text-lg font-bold text-[#1F3B2D]">2. Build the activity pages</h3>
   <div className="grid lg:grid-cols-[210px_minmax(0,1fr)] gap-5">
    <nav className="space-y-2" aria-label="Document activity pages">
     {document.pages.map((p,i)=><button key={i} type="button" onClick={()=>setSelected(i)}
      className={"w-full rounded-xl border p-3 text-left text-sm "+(selected===i?"border-[#1F3B2D] bg-[#EDF2E9] text-[#1F3B2D]":"border-stone-200 bg-white text-stone-700")}>
      <span className="text-xs font-bold block mb-1">ACTIVITY {i+1}</span><span className="font-semibold break-words">{p.title||"Untitled"}</span>
     </button>)}
     <button type="button" onClick={newPage} disabled={document.pages.length>=40} className={styles.secondary+" w-full"}>+ Add activity page</button>
    </nav>
    {current&&<div className="rounded-xl border border-stone-200 p-4 space-y-4 min-w-0">
     <div className="flex flex-wrap justify-between gap-2">
      <h4 className="font-bold text-[#1F3B2D]">Edit activity {selected+1}</h4>
      <div className="flex flex-wrap gap-2">
       <button type="button" className={styles.secondary} disabled={selected===0} onClick={()=>movePage(selected,-1)}>Move up</button>
       <button type="button" className={styles.secondary} disabled={selected===document.pages.length-1} onClick={()=>movePage(selected,1)}>Move down</button>
       <button type="button" className={styles.secondary} disabled={document.pages.length===1} onClick={()=>removePage(selected)}>Remove</button>
      </div>
     </div>
     <label className="block text-sm font-semibold">Activity heading<input className={styles.input} maxLength={85} value={current.title} onChange={e=>updatePage(selected,"title",e.target.value)}/></label>
     <label className="block text-sm font-semibold">Layout and interaction<select className={styles.input} value={current.kind} onChange={e=>updatePage(selected,"kind",e.target.value)}>
      <option value="writing">Writing / reflection with generous answer boxes</option>
      <option value="checklist">Interactive tick checklist</option>
      <option value="log">Dated activity / evidence log table</option>
     </select></label>
     <label className="block text-sm font-semibold">Instructions for the learner<textarea className={styles.input} rows={3} maxLength={350} value={current.instructions} onChange={e=>updatePage(selected,"instructions",e.target.value)}/></label>
     <label className="block text-sm font-semibold">{current.kind==="log"?"Suggested log entries (one per line)":"Prompts / checklist items (one per line)"}
      <textarea className={styles.input+" min-h-48 font-mono leading-relaxed"} value={current.prompts.join("\n")}
       onChange={e=>updatePage(selected,"prompts",e.target.value.split("\n"))}
       placeholder="Type each prompt on a new line" />
     </label>
     <p className="text-xs text-stone-600">Each prompt gets real space to complete it. Content automatically continues onto extra A4 sheets rather than shrinking to fit. For digital products, use writing, tickboxes and logs instead of pen-only drawings.</p>
    </div>}
   </div>
  </section>
  <section className="paper-card p-5 space-y-4">
   <h3 className="text-lg font-bold text-[#1F3B2D]">3. Generate and inspect</h3>
   <p className="text-sm text-stone-700">Export both editions from one master. The print version contains handwriting guides; the digital version adds interactive typing and tick-box fields without changing the activities.</p>
   <button type="button" className={styles.button} onClick={build} disabled={busy}>{busy?"Generating PDFs…":"Create print + fillable PDF set"}</button>
   {error&&<p role="alert" className="text-sm text-red-800">{error}</p>}
   {notice&&<p role="status" className="text-sm text-[#1F3B2D]">{notice}</p>}
   {proof&&<div className="space-y-4">
    <div className="rounded-xl border border-[#A3B49D] bg-[#F0F5EC] p-4 space-y-3">
     <h4 className="font-bold text-[#1F3B2D]">One complete Square product package</h4>
     <p className="text-sm">Includes both PDF editions and a separate owner-only product description and quality checklist. Keep these files private for delivery after payment (manually or via a connected digital-delivery service). Do not publish them in a public PDF section.</p>
     <button type="button" className={styles.button} onClick={()=>{try{downloadSquareProductZip(document,proof);setNotice("Square product ZIP downloaded. Review all contents before offering it for sale.")}catch(e){setError(e?.message||"Could not package your PDFs.")}}}>Download Square product ZIP</button>
    </div>
    <div className="grid md:grid-cols-2 gap-3">
     {["print","fillable"].map(mode=><div key={mode} className="rounded-xl border border-stone-300 p-4 space-y-2">
      <h4 className="font-semibold">{mode==="print"?"A4 printable PDF":"Digitally fillable PDF"}</h4>
      <p className="text-xs text-stone-600">{proof[mode].quality.pages} pages{mode==="fillable"?" · "+proof[mode].quality.form_fields+" form fields":""}</p>
      <a href={proof[mode].data_url} download={slug(document.title)+"-"+mode+".pdf"} className="inline-block rounded-lg bg-[#1F3B2D] px-3 py-2 text-sm font-semibold text-white">
       Download {mode==="print"?"print":"fillable"} edition
      </a>
      <button type="button" className={styles.secondary+" ml-2"} onClick={()=>{setEdition(mode);setShowPreview(true)}}>Preview</button>
     </div>)}
    </div>
    {showPreview&&<div>
     <p className="font-semibold text-sm mb-2">Inspecting: {edition==="print"?"Printable":"Fillable"} edition</p>
     <iframe title={"Side-Quest "+edition+" proof"} src={preview?.data_url} className="w-full rounded-xl border border-stone-300 bg-white" style={{height:"min(74vh,750px)"}}/>
     <p className="text-xs text-stone-600 mt-2">The preview is a proof, not automatic quality approval. Test the fillable version in a PDF reader by typing, ticking, saving, closing and reopening it.</p>
    </div>}
    <div className="rounded-xl border border-stone-200 p-4 text-sm space-y-2">
     <h4 className="font-semibold">What the export checks</h4>
     <ul className="list-disc pl-5 space-y-1">{proof.fillable.quality.checks.map((c,i)=><li key={i}>{c}</li>)}</ul>
    </div>
   </div>}
  </section>
  <section className="paper-card p-5 space-y-3">
   <h3 className="text-lg font-bold text-[#1F3B2D]">4. List in Square and deliver securely</h3>
   <p className="text-sm text-stone-700">After reviewing both PDFs, create a Digital item in Square, add the product description and cover, and set your price. Square Australia does not natively attach a private downloadable PDF to this product for automatic customer delivery. Email the files yourself after payment, or set up a service such as SendOwl for secure automated delivery.</p>
   <button type="button" className={styles.secondary} onClick={copyListing}>Copy Square listing description</button>
   <p className="text-xs text-stone-600">Square handles your product listing and payments. Document Studio creates the private master files, and you or a separate integration handle delivery. Keep both PDF editions together so buyers can choose print or digital use.</p>
  </section>
 </div>;
}