import React,{useState} from "react";
import {adminApi,errorText} from "../../lib/adminApi";
const btn="rounded-lg border px-3 py-2 text-sm disabled:opacity-50";
export function SlideDisplay({slide}){if(!slide)return null;return <article className="rounded-xl bg-emerald-950 text-white p-5 sm:p-8 space-y-3" aria-label="Presented slide"><p className="text-xs uppercase tracking-wider">{slide.title} · {slide.number}/{slide.total}</p><h4 className="text-xl sm:text-3xl font-bold">{slide.heading}</h4><div className="text-base sm:text-xl whitespace-pre-wrap break-words">{slide.body}</div></article>;}
export default function SupportPresentation({send,busy}){
 const [items,setItems]=useState(null),[q,setQ]=useState(""),[deck,setDeck]=useState(null),[i,setI]=useState(0),[error,setError]=useState("");
 async function run(fn){try{await fn();setError("");}catch(e){setError(errorText(e));}}
 const show=n=>{setI(n);send({action:"present",deck_id:deck.id,deck_revision:deck.revision,index:n});};
 return <section className="border rounded-xl p-3 space-y-2"><h4 className="font-bold">Present a teaching resource</h4>{error&&<p role="alert" className="text-rose-800 text-sm">{error}</p>}<form className="flex gap-2" onSubmit={e=>{e.preventDefault();run(async()=>setItems((await adminApi.get("/support-decks",{q,reviewed:1})).decks));}}><input aria-label="Find reviewed teaching slides" placeholder="Topic, subject, year level" className="min-w-0 flex-1 border rounded-lg p-2" value={q} onChange={e=>setQ(e.target.value)}/><button className={btn}>Find</button></form>
 {items?.map(d=><button type="button" className="block w-full text-left underline text-sm" key={d.id} onClick={()=>run(async()=>{setDeck((await adminApi.get("/support-decks/"+d.id)).deck);setI(0);})}>{d.title} · {d.year_level}</button>)}
 {deck&&<><p className="text-sm font-bold">{deck.title} · {i+1}/{deck.slides.length}</p><div className="bg-stone-100 p-3 rounded-lg whitespace-pre-wrap text-sm"><strong>Private tutor notes (not shared)</strong><p>{deck.slides[i].notes}</p></div><div className="flex flex-wrap gap-2"><button type="button" className={btn} disabled={busy||i===0} onClick={()=>show(i-1)}>Previous</button><button type="button" className={btn} disabled={busy} onClick={()=>show(i)}>Present slide</button><button type="button" className={btn} disabled={busy||i===deck.slides.length-1} onClick={()=>show(i+1)}>Next</button><button type="button" className={btn} disabled={busy} onClick={()=>send({action:"hide-slide"})}>Stop presenting</button></div></>}
 </section>;
}
