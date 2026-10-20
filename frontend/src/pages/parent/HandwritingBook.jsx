import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, ChevronRight, Lock, Printer, List, X } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

const LETTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SAVED_PAGE="sidequest-little-letter-quest-page";
const leafName=n=>n===0?"Front cover":n===1?"How to use this book":
 n===54?"Little Letter Hero certificate":n===55?"Back cover":
 "Letter "+LETTERS[Math.floor((n-2)/2)]+((n-2)%2?" • capitals":" • lowercase");

async function getPageUrl(page) {
 const response=await api.get("/handwriting-book/pages/"+page,{responseType:"blob"});
 return URL.createObjectURL(new Blob([response.data],{type:"image/svg+xml"}));
}
function printDocument(label,urls) {
 const title=label.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
 const css='@page{size:A4 portrait;margin:5mm}html,body{margin:0;background:white;font-family:Arial,sans-serif}'
 +'figure{width:200mm;height:287mm;margin:0;break-after:page;page-break-after:always}'
 +'figure:last-of-type{break-after:auto;page-break-after:auto}'
 +'img{width:100%;height:100%;display:block;object-fit:contain}'
 +'button{padding:12px 18px;margin:15px;border:0;border-radius:8px;background:#143d2d;color:white;font-weight:bold;cursor:pointer}'
 +'button:disabled{opacity:.5;cursor:wait}'
 +'@media screen{body{background:#e5e7eb;padding:16px}figure{background:white;box-shadow:0 4px 25px #bbb;margin:0 auto 20px}}'
 +'@media print{button{display:none}body{padding:0!important;background:white}}';
 return '<!doctype html><html><head><meta charset="utf-8"><title>'+title+'</title><style>'+css+'</style></head>'
 +'<body><button id="print-book" disabled>Preparing handwriting pages...</button>'
 +urls.map(u=>'<figure><img src="'+u+'" alt="A4 handwriting practice page"></figure>').join("")
 +'</body></html>';
}
async function imageReady(img) {
 if(img.complete&&img.naturalWidth>0)return;
 if(img.decode)await img.decode();
 else await new Promise((resolve,reject)=>{
  img.addEventListener("load",resolve,{once:true});
  img.addEventListener("error",reject,{once:true});
 });
 if(!img.naturalWidth)throw new Error("A page did not load for printing.");
}

export default function HandwritingBook(){
 const [book,setBook]=useState(null);
 const [error,setError]=useState("");
 const [page,setPage]=useState(()=>{
  try{return Math.min(55,Math.max(0,Number.parseInt(localStorage.getItem(SAVED_PAGE)||"0",10)||0));}
  catch{return 0;}
 });
 const [pageImage,setPageImage]=useState(null);
 const [pageError,setPageError]=useState("");
 const [contentsOpen,setContentsOpen]=useState(false);
 const [printing,setPrinting]=useState(false);
 const unlocked=!!book?.unlocked;
 const pages=book?.pages||56;
 useEffect(()=>{
  let active=true;
  api.get("/handwriting-book").then(r=>{if(active)setBook(r.data);})
   .catch(e=>{if(active)setError(apiErrorMessage(e,"Could not open handwriting book"));});
  return()=>{active=false;};
 },[]);
 useEffect(()=>{
  try{localStorage.setItem(SAVED_PAGE,String(page));}catch{}
 },[page]);
 useEffect(()=>{
  if(!unlocked)return undefined;
  let active=true,url="";
  setPageImage(null);setPageError("");
  getPageUrl(page).then(u=>{
   if(active){url=u;setPageImage(u);}else URL.revokeObjectURL(u);
  }).catch(e=>{if(active)setPageError(apiErrorMessage(e,"Could not load this page"));});
  return()=>{active=false;if(url)URL.revokeObjectURL(url);};
 },[page,unlocked]);
 useEffect(()=>{
  const turn=e=>{
   if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;
   if(e.key==="ArrowRight")setPage(n=>Math.min(pages-1,n+1));
   else if(e.key==="ArrowLeft")setPage(n=>Math.max(0,n-1));
  };
  window.addEventListener("keydown",turn);
  return()=>window.removeEventListener("keydown",turn);
 },[pages]);
 const letterIndex=page>=2&&page<=53?Math.floor((page-2)/2):0;
 const printableLetter=useMemo(()=>[2+letterIndex*2,3+letterIndex*2],[letterIndex]);
 const openPrint=async(which)=>{
  if(!unlocked||printing)return;
  const chosen=which==="whole"?Array.from({length:pages},(_,i)=>i):
   which==="letter"?printableLetter:[page];
  // Open on the original click, before any async requests, to avoid popup blockers.
  const win=window.open("","_blank");
  if(!win){toast.error("Allow pop-ups to open print mode.");return;}
  win.document.write("<!doctype html><html><body><p>Preparing your handwriting pages…</p></body></html>");
  setPrinting(true);
  const urls=new Array(chosen.length);
  let next=0;
  try{
   await Promise.all(Array.from({length:Math.min(5,chosen.length)},async()=>{
    while(next<chosen.length){
     const index=next++;
     urls[index]=await getPageUrl(chosen[index]);
    }
   }));
   if(win.closed)throw new Error("The print window was closed.");
   const label=which==="whole"?"The Little Letter Quest • Complete book":
    which==="letter"?"The Little Letter Quest • Letter "+LETTERS[letterIndex]:
    "The Little Letter Quest • Page "+(page+1);
   win.document.open();
   win.document.write(printDocument(label,urls));
   win.document.close();
   const images=Array.from(win.document.querySelectorAll("figure img"));
   if(images.length!==chosen.length)throw new Error("Some book pages could not be prepared.");
   await Promise.all(images.map(imageReady));
   if(win.closed)throw new Error("The print window was closed.");
   const btn=win.document.getElementById("print-book");
   if(!btn)throw new Error("Print button not available.");
   btn.disabled=false;
   btn.textContent="Print / Save as PDF";
   btn.addEventListener("click",()=>win.print());
   win.addEventListener("beforeunload",()=>urls.filter(Boolean).forEach(u=>URL.revokeObjectURL(u)),{once:true});
  }catch(e){
   urls.filter(Boolean).forEach(u=>URL.revokeObjectURL(u));
   if(!win.closed){
    win.document.open();
    win.document.write('<p style="font:18px Arial,sans-serif;padding:24px">The book could not be prepared. Return to Side-Quest and try again.</p>');
    win.document.close();
   }
   toast.error(e?.message||"Could not prepare the handwriting book.");
  }finally{setPrinting(false);}
 };
 const button="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-40";
 return <div className="p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-5" data-testid="handwriting-book">
  <nav aria-label="Breadcrumb" className="text-sm text-stone-600"><Link className="underline" to="/parent/printable-vault">Printable Vault</Link> / The Little Letter Quest</nav>
  <header className="rounded-2xl bg-emerald-950 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-5">
   <div><p className="text-emerald-200 text-xs font-bold tracking-widest uppercase">Side-Quest · Early learners</p>
    <h1 className="font-display text-3xl font-bold mt-2">The Little Letter Quest</h1>
    <p className="mt-2 max-w-2xl text-emerald-50">A real A–Z handwriting book, with gentle tracing, separate capital and lowercase pages, and room to write independently. Black-and-white A4 sheets save ink.</p>
    <p className="text-sm text-emerald-200 mt-2">{pages} pages · 26 letters · Print one page, a letter pair, or the complete book</p></div>
   <BookOpen size={58} className="text-white/60"/>
  </header>
  {!book&&!error&&<p role="status">Opening the book…</p>}
  {error&&<p role="alert" className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-900">{error}</p>}
  {book&&!unlocked&&<section data-testid="handwriting-book-locked" className="rounded-2xl bg-white border border-stone-300 p-8 text-center space-y-4">
    <Lock className="mx-auto text-emerald-950" size={32}/>
    <h2 className="font-display text-xl font-bold">A book for Family Membership</h2>
    <p className="max-w-lg mx-auto text-stone-700">Paid families can turn every page and print the whole workbook or just the letters they need. Your free preview can see what is included.</p>
    <Link to="/parent/plan" className="inline-flex rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold">See membership options</Link>
   </section>}
  {unlocked&&<>
    <div className="flex gap-2 flex-wrap items-center justify-between">
     <button type="button" className={button+" bg-white text-emerald-950 border-stone-300"} onClick={()=>setContentsOpen(v=>!v)} aria-expanded={contentsOpen} aria-controls="letter-contents"><List size={17}/> Choose a letter</button>
     <div className="flex gap-2 flex-wrap">
      <button data-testid="print-current-page" type="button" disabled={printing} className={button+" bg-white text-emerald-950 border-stone-300"} onClick={()=>openPrint("page")}><Printer size={17}/> This page</button>
      <button data-testid="print-letter" type="button" disabled={printing} className={button+" bg-white text-emerald-950 border-stone-300"} onClick={()=>openPrint("letter")}><Printer size={17}/> Letter {LETTERS[letterIndex]} (2 pages)</button>
      <button data-testid="print-whole-book" type="button" disabled={printing} className={button+" bg-emerald-900 text-white border-emerald-900"} onClick={()=>openPrint("whole")}><Printer size={17}/> Whole book / PDF</button>
     </div>
    </div>
    {contentsOpen&&<section id="letter-contents" className="rounded-2xl border border-stone-300 bg-white p-4" aria-label="Table of contents">
      <div className="flex items-center justify-between mb-3"><h2 className="font-bold">Jump to a letter</h2><button type="button" aria-label="Close contents" onClick={()=>setContentsOpen(false)}><X size={18}/></button></div>
      <div className="grid grid-cols-7 sm:grid-cols-13 gap-2">
       {LETTERS.split("").map((letter,i)=><button key={letter} type="button" onClick={()=>{setPage(2+i*2);setContentsOpen(false);}}
        aria-label={"Go to letter "+letter} className="aspect-square min-h-10 rounded-lg border border-stone-300 bg-stone-50 text-emerald-950 font-bold hover:bg-emerald-100">{letter}</button>)}
      </div>
      <div className="flex gap-4 mt-4 text-sm font-semibold">
       <button className="underline" onClick={()=>{setPage(0);setContentsOpen(false);}}>Cover</button>
       <button className="underline" onClick={()=>{setPage(1);setContentsOpen(false);}}>Parent guide</button>
       <button className="underline" onClick={()=>{setPage(54);setContentsOpen(false);}}>Certificate</button>
      </div>
     </section>}
    <section className="rounded-3xl border border-stone-300 bg-stone-100 p-3 sm:p-6 shadow-inner" aria-label="Book reader">
      <div className="flex justify-between gap-3 items-center mb-4 px-1 text-sm font-bold text-stone-700">
       <span>{leafName(page)}</span><span>Page {page+1} of {pages}</span>
      </div>
      <div className="flex justify-center">
       <div className="w-full max-w-[650px] aspect-[210/297] bg-white border border-stone-300 shadow-[10px_9px_0px_#d4d4d4,12px_10px_18px_#a3a3a3] overflow-hidden" data-testid="handwriting-page">
        {pageImage?<img key={page} src={pageImage} alt={leafName(page)+", page "+(page+1)} className="h-full w-full object-contain"/>:
        <div role="status" className="h-full grid place-items-center text-stone-600">{pageError||"Turning the page…"}</div>}
       </div>
      </div>
      <div className="flex justify-center gap-5 mt-7 items-center">
       <button data-testid="previous-page" type="button" className={button+" bg-white border-stone-300 text-emerald-950"} onClick={()=>setPage(n=>Math.max(0,n-1))} disabled={page===0}><ChevronLeft size={19}/> Previous</button>
       <span className="font-semibold text-stone-600 tabular-nums">{page+1} / {pages}</span>
       <button data-testid="next-page" type="button" className={button+" bg-emerald-900 border-emerald-900 text-white"} onClick={()=>setPage(n=>Math.min(pages-1,n+1))} disabled={page===pages-1}>Next <ChevronRight size={19}/></button>
      </div>
    </section>
    <p className="text-sm text-stone-600">Printing tip: choose A4, portrait and actual size (100%). Use black-and-white or greyscale. You can also choose “Save as PDF” in your printer dialogue. For young writers, printing one letter at a time is often plenty.</p>
  </>}
 </div>;
}
