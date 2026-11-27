import React,{useState} from "react";
const btn="rounded-lg border px-3 py-2 text-sm font-semibold";
function openDocument(resource,mode,illustrations=[],client){
 const win=window.open("","_blank");
 if(!win)return false;
 win.opener=null;
 const d=win.document;
 d.title=resource.title+" — "+(mode==="print"?(resource.creative_camp?"Creative studio page":"Worksheet"):"Presentation");
 d.documentElement.lang="en-AU";
 const style=d.createElement("style");
 style.textContent="@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:16px/1.5 system-ui,sans-serif;color:#202522;margin:0;background:#fff}main{max-width:880px;margin:24px auto;padding:24px}h1{font-size:28px;line-height:1.2}h2{font-size:19px;margin:1.1em 0 .4em}p{white-space:pre-wrap;margin:.5em 0}small{letter-spacing:.08em;text-transform:uppercase}button{font:inherit;padding:8px 16px;margin:4px;border:1px solid #66736a;background:#fff;border-radius:6px;cursor:pointer}.reading{border-left:3px solid #536c58;padding-left:14px}.task{break-inside:avoid}.line{height:26px;border-bottom:1px solid #aeb4af}.slide{min-height:65vh;display:flex;flex-direction:column;justify-content:center}.slide h1{font-size:clamp(30px,5vw,64px)}.slide-art{max-height:36vh;max-width:100%;width:100%;object-fit:contain;border-radius:12px;margin:12px auto}.slide-art[hidden]{display:none}.slide p{font-size:clamp(20px,3vw,36px);line-height:1.45}.model-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:16px}.model-card{border:1px solid #aeb4af;border-radius:12px;padding:16px;background:#f2f6f3}.model-card h2{margin:0;color:#22533c}.model-card p{font-size:clamp(17px,2.4vw,28px)}nav{display:flex;align-items:center;gap:12px}@media print{main{margin:0;padding:0;max-width:none}nav{display:none}body{font-size:11pt}h1{font-size:22pt}h2{font-size:13pt}.line{height:20px}}";
 d.head.appendChild(style);
 const add=(parent,tag,value,cls)=>{const el=d.createElement(tag);if(value!==undefined)el.textContent=value;if(cls)el.className=cls;parent.appendChild(el);return el;};
 const main=add(d.body,"main");add(main,"small","Side-Quest Learning · English Club");
 if(mode==="print"){
  add(main,"h1",resource.title);add(main,"p","Name: __________________________    Date: ______________");
  add(main,"h2",resource.creative_camp?"Story spark":"Read closely");add(main,"p",resource.reading,"reading");
  resource.tasks.forEach((t,i)=>{const block=add(main,"section",undefined,"task");add(block,"h2",(resource.creative_camp?"Creative idea ":"Task ")+(i+1));add(block,"p",t);for(let j=0;j<4;j++)add(block,"div",undefined,"line");});
  const stretch=add(main,"section",undefined,"task");add(stretch,"h2","Extension (optional)");add(stretch,"p",resource.stretch);for(let j=0;j<3;j++)add(stretch,"div",undefined,"line");
  const nav=add(main,"nav");const print=add(nav,"button","Print / save as PDF");print.addEventListener("click",()=>win.print());return true;
 }
 const slide=add(main,"section",undefined,"slide"),title=add(slide,"h1"),art=add(slide,"img",undefined,"slide-art"),body=add(slide,"p"),cards=add(slide,"div",undefined,"model-cards"),nav=add(main,"nav"),prev=add(nav,"button","Previous"),counter=add(nav,"span"),next=add(nav,"button","Next");let index=0;const images=new Map();let request=0;let closed=false;
 win.addEventListener("pagehide",()=>{closed=true;for(const url of images.values())URL.revokeObjectURL(url);images.clear();});
 async function showArt(){const token=++request,p=illustrations.find(x=>x.slide_index===index&&x.file_id);art.hidden=true;art.removeAttribute("src");if(!p||!client)return;try{let url=images.get(p.file_id);if(!url){const response=await client.get("/support-files/"+encodeURIComponent(p.file_id)+"/download"),r=response.data??response;if(!["image/png","image/jpeg"].includes(r.mime)||closed)return;url=images.get(p.file_id)||URL.createObjectURL(new Blob([Uint8Array.from(atob(r.base64),x=>x.charCodeAt(0))],{type:r.mime}));images.set(p.file_id,url);}if(closed||token!==request)return;art.alt=p.title;art.src=url;art.hidden=false;}catch{/* Keep the text and discussion usable even if storage is unavailable. */}}
 function show(){showArt();const s=resource.slides[index];title.textContent=s.title;body.textContent=s.body;cards.replaceChildren();for(const c of s.cards||[]){const box=add(cards,"div",undefined,"model-card");add(box,"h2",c.label);add(box,"p",c.body);}counter.textContent=(index+1)+" / "+resource.slides.length;prev.disabled=index===0;next.disabled=index===resource.slides.length-1;}
 function move(n){index=Math.max(0,Math.min(resource.slides.length-1,index+n));show();}
 prev.addEventListener("click",()=>move(-1));next.addEventListener("click",()=>move(1));d.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);});show();return true;
}
export default function EnglishClubWorkshopResource({resource,owner=false,illustrations=[],client}){
 const [error,setError]=useState("");
 if(!resource)return null;
 function open(mode){setError("");if(!openDocument(resource,mode,owner?illustrations:[],owner?client:undefined))setError("Your browser blocked the new tab. Allow pop-ups for Side-Quest or use the reading and tasks below.");}
 return <section className="rounded-lg border p-3 space-y-3" aria-label="Workshop teaching resources"><h4 className="font-bold">{resource.title} · workshop resources</h4><p className="text-sm">{resource.objective}</p><div className="flex flex-wrap gap-2"><button type="button" className={btn} onClick={()=>open("print")}>{resource.creative_camp?"Optional creative studio page / PDF":"Printable worksheet / PDF"}</button>{owner&&<button type="button" className={btn} onClick={()=>open("slides")}>{resource.creative_camp?"Open camp presentation":"Open teaching presentation"}</button>}</div>{owner&&<p className="text-xs">Present in the separate learner-only tab. If using video screen share, select that tab only, not the Owner HQ or entire desktop.</p>}{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}<details><summary className="font-semibold text-sm">{resource.creative_camp?"Story spark and creative ideas":"Reading and writing tasks"}</summary><p className="whitespace-pre-wrap text-sm mt-2">{resource.reading}</p><ol className="list-decimal pl-5 space-y-2 text-sm mt-3">{resource.tasks.map((t,i)=><li key={i}>{t}</li>)}</ol><p className="text-sm mt-3"><strong>Optional extension:</strong> {resource.stretch}</p></details></section>;
}
