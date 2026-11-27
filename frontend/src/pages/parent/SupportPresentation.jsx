import React,{useState,useEffect} from "react";
import SupportSlideVisual from "./SupportSlideVisual";
import {PresentedImage} from "./SupportImagePresentation";
import {adminApi,errorText} from "../../lib/adminApi";
const btn="rounded-lg border px-3 py-2 text-sm disabled:opacity-50";
const activityLabels={"create-quest":"Create and explain","steps":"Explore the idea","compare":"Compare and explain","sequence":"Follow the reasoning","fraction-split":"Watch the model change","fraction-bars":"Read the model","fraction-quest":"Solve the challenge","fraction-build":"Build your answer","evidence-quest":"Investigate the evidence","sort-quest":"Classify and justify","data-quest":"Investigate the data","select":"Choose and explain","order":"Put the ideas in order"};
function PrivateIllustration({id}){
 const [image,setImage]=useState(null),[error,setError]=useState(false);
 useEffect(()=>{let active=true;setImage(null);setError(false);adminApi.get("/support-files/"+encodeURIComponent(id)+"/download").then(r=>{if(active&&["image/png","image/jpeg"].includes(r.mime))setImage(r);else if(active)setError(true);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[id]);
 return image?<img className="w-full max-h-80 object-contain rounded-xl" alt={image.filename||"Reviewed lesson illustration"} src={"data:"+image.mime+";base64,"+image.base64}/>:<p className="text-sm">{error?"Reviewed illustration unavailable.":"Loading illustration…"}</p>;
}
export function SlideDisplay({slide,send,owner,busy,preview=false,path,client}){
 if(!slide)return null;
 return <article className="overflow-hidden rounded-2xl border border-emerald-900 bg-stone-50 shadow-sm" aria-label={preview?"Learner presentation preview":"Presented slide"}>
 <header className="bg-emerald-950 text-white p-5 sm:p-7 space-y-3"><div className="flex flex-wrap justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200"><span>Side-Quest · {activityLabels[slide.visual?.type]||"Explore and discover"}</span><span>{slide.number} / {slide.total}</span></div><div className="flex gap-1" aria-label={"Lesson step "+slide.number+" of "+slide.total}>{Array.from({length:Math.max(0,Math.min(20,slide.total||0))},(_,i)=><span key={i} className={"h-1.5 flex-1 rounded-full "+(i<slide.number?"bg-amber-300":"bg-emerald-800")}/>)}</div><p className="text-sm text-emerald-200 break-words">{slide.title}</p><h4 className="text-2xl sm:text-3xl font-bold leading-tight break-words">{slide.heading}</h4></header>
 <div className="p-4 sm:p-6 space-y-4">{preview&&slide.illustration_id?<PrivateIllustration key={slide.illustration_id} id={slide.illustration_id}/>:!preview&&slide.illustration&&path&&client?<PresentedImage image={slide.illustration} path={path} client={client}/>:null}<div className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words text-emerald-950">{slide.body}</div>{slide.visual&&<SupportSlideVisual key={slide.interaction?.id||slide.title+":"+slide.number} visual={slide.visual} interaction={slide.interaction} send={send} owner={owner} busy={busy} live={!preview}/>}</div>
 </article>;
}
export default function SupportPresentation({send,busy}){
 const [items,setItems]=useState(null),[q,setQ]=useState(""),[deck,setDeck]=useState(null),[i,setI]=useState(0),[error,setError]=useState("");
 async function run(fn){try{await fn();setError("");}catch(e){setError(errorText(e));}}
 const show=n=>{setI(n);send({action:"present",deck_id:deck.id,deck_revision:deck.revision,index:n});};
 return <section className="border rounded-xl p-3 space-y-2"><h4 className="font-bold">Present a teaching resource</h4>{error&&<p role="alert" className="text-rose-800 text-sm">{error}</p>}<form className="flex gap-2" onSubmit={e=>{e.preventDefault();run(async()=>setItems((await adminApi.get("/support-decks",{q,reviewed:1})).decks));}}><input aria-label="Find reviewed teaching slides" placeholder="Topic, subject, year level" className="min-w-0 flex-1 border rounded-lg p-2" value={q} onChange={e=>setQ(e.target.value)}/><button className={btn}>Find</button></form>
 {items?.map(d=><button type="button" className="block w-full text-left underline text-sm" key={d.id} onClick={()=>run(async()=>{setDeck((await adminApi.get("/support-decks/"+d.id)).deck);setI(0);})}>{d.title} · {d.year_level}</button>)}
 {deck&&<><p className="text-sm font-bold">{deck.title} · {i+1}/{deck.slides.length}</p><div className="bg-stone-100 p-3 rounded-lg whitespace-pre-wrap text-sm"><strong>Private tutor notes (not shared)</strong><p>{deck.slides[i].notes}</p></div><div className="flex flex-wrap gap-2"><button type="button" className={btn} disabled={busy||i===0} onClick={()=>show(i-1)}>Previous</button><button type="button" className={btn} disabled={busy} onClick={()=>show(i)}>Present slide</button><button type="button" className={btn} disabled={busy||i===deck.slides.length-1} onClick={()=>show(i+1)}>Next</button><button type="button" className={btn} disabled={busy} onClick={()=>send({action:"hide-slide"})}>Stop presenting</button></div></>}
 </section>;
}
