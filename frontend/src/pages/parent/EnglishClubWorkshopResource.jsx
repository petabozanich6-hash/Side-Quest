import React,{useState} from "react";
const btn="rounded-lg border px-3 py-2 text-sm font-semibold";
function openDocument(resource,mode){
 const win=window.open("","_blank");
 if(!win)return false;
 win.opener=null;
 const d=win.document;
 d.title=resource.title+" — "+(mode==="print"?"Worksheet":"Presentation");
 d.documentElement.lang="en-AU";
 const style=d.createElement("style");
 style.textContent="@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:16px/1.5 system-ui,sans-serif;color:#202522;margin:0;background:#fff}main{max-width:880px;margin:24px auto;padding:24px}h1{font-size:28px;line-height:1.2}h2{font-size:19px;margin:1.1em 0 .4em}p{white-space:pre-wrap;margin:.5em 0}small{letter-spacing:.08em;text-transform:uppercase}button{font:inherit;padding:8px 16px;margin:4px;border:1px solid #66736a;background:#fff;border-radius:6px;cursor:pointer}.reading{border-left:3px solid #536c58;padding-left:14px}.task{break-inside:avoid}.line{height:26px;border-bottom:1px solid #aeb4af}.slide{min-height:65vh;display:flex;flex-direction:column;justify-content:center}.slide h1{font-size:clamp(30px,5vw,64px)}.slide p{font-size:clamp(20px,3vw,36px);line-height:1.45}nav{display:flex;align-items:center;gap:12px}@media print{main{margin:0;padding:0;max-width:none}nav{display:none}body{font-size:11pt}h1{font-size:22pt}h2{font-size:13pt}.line{height:20px}}";
 d.head.appendChild(style);
 const add=(parent,tag,value,cls)=>{const el=d.createElement(tag);if(value!==undefined)el.textContent=value;if(cls)el.className=cls;parent.appendChild(el);return el;};
 const main=add(d.body,"main");add(main,"small","Side-Quest Learning · English Club");
 if(mode==="print"){
  add(main,"h1",resource.title);add(main,"p","Name: __________________________    Date: ______________");
  add(main,"h2","Read closely");add(main,"p",resource.reading,"reading");
  resource.tasks.forEach((t,i)=>{const block=add(main,"section",undefined,"task");add(block,"h2","Task "+(i+1));add(block,"p",t);for(let j=0;j<4;j++)add(block,"div",undefined,"line");});
  const stretch=add(main,"section",undefined,"task");add(stretch,"h2","Extension (optional)");add(stretch,"p",resource.stretch);for(let j=0;j<3;j++)add(stretch,"div",undefined,"line");
  const nav=add(main,"nav");const print=add(nav,"button","Print / save as PDF");print.addEventListener("click",()=>win.print());return true;
 }
 const slide=add(main,"section",undefined,"slide"),title=add(slide,"h1"),body=add(slide,"p"),nav=add(main,"nav"),prev=add(nav,"button","Previous"),counter=add(nav,"span"),next=add(nav,"button","Next");let index=0;
 function show(){const s=resource.slides[index];title.textContent=s.title;body.textContent=s.body;counter.textContent=(index+1)+" / "+resource.slides.length;prev.disabled=index===0;next.disabled=index===resource.slides.length-1;}
 function move(n){index=Math.max(0,Math.min(resource.slides.length-1,index+n));show();}
 prev.addEventListener("click",()=>move(-1));next.addEventListener("click",()=>move(1));d.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);});show();return true;
}
export default function EnglishClubWorkshopResource({resource,owner=false}){
 const [error,setError]=useState("");
 if(!resource)return null;
 function open(mode){setError("");if(!openDocument(resource,mode))setError("Your browser blocked the new tab. Allow pop-ups for Side-Quest or use the reading and tasks below.");}
 return <section className="rounded-lg border p-3 space-y-3" aria-label="Workshop teaching resources"><h4 className="font-bold">{resource.title} · workshop resources</h4><p className="text-sm">{resource.objective}</p><div className="flex flex-wrap gap-2"><button type="button" className={btn} onClick={()=>open("print")}>Printable worksheet / PDF</button>{owner&&<button type="button" className={btn} onClick={()=>open("slides")}>Open teaching presentation</button>}</div>{owner&&<p className="text-xs">Present in the separate learner-only tab. If using video screen share, select that tab only, not the Owner HQ or entire desktop.</p>}{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}<details><summary className="font-semibold text-sm">Reading and writing tasks</summary><p className="whitespace-pre-wrap text-sm mt-2">{resource.reading}</p><ol className="list-decimal pl-5 space-y-2 text-sm mt-3">{resource.tasks.map((t,i)=><li key={i}>{t}</li>)}</ol><p className="text-sm mt-3"><strong>Optional extension:</strong> {resource.stretch}</p></details></section>;
}
