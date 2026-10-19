import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { BookOpen, Download, FileImage, Lock, Paintbrush, Printer, Search, Scissors, Sparkles, Puzzle, Palette, Gamepad2, Route, X } from "lucide-react";

const ICONS={craft:Scissors,game:Gamepad2,maze:Route,colouring:Palette,puzzle:Puzzle};
const PALETTE={
  craft:"from-pink-50 to-rose-100",colouring:"from-purple-50 to-pink-100",
  maze:"from-sky-50 to-indigo-100",puzzle:"from-blue-50 to-violet-100",game:"from-amber-50 to-orange-100"
};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"");
const imageEndpoint=(id,page=0,variant="colour")=>"/printables/"+encodeURIComponent(id)+"/image?page="+page+"&variant="+variant;

function VaultThumbnail({item,unlocked}){
  const [url,setUrl]=useState("");
  const element=useRef(null);
  useEffect(()=>{
    if(!unlocked){setUrl("");return undefined;}
    let alive=true,objectUrl="";
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      observer.disconnect();
      api.get(imageEndpoint(item.id),{responseType:"blob"})
        .then(r=>{if(!alive)return;objectUrl=URL.createObjectURL(new Blob([r.data],{type:"image/svg+xml"}));setUrl(objectUrl);})
        .catch(()=>{});
    },{rootMargin:"200px"});
    const node=element.current;if(node)observer.observe(node);
    return()=>{alive=false;observer.disconnect();if(objectUrl)URL.revokeObjectURL(objectUrl);};
  },[item.id,unlocked]);
  const Icon=ICONS[item.kind]||FileImage;
  return <div ref={element} className={"aspect-[210/235] max-h-[245px] w-full relative overflow-hidden grid place-items-center bg-gradient-to-br "+(PALETTE[item.kind]||"from-slate-50 to-stone-100")}>
    {url?<img src={url} alt={"Illustrated printable preview for "+item.title} className="w-full h-full object-contain" loading="lazy"/>:
      <div className="grid place-items-center gap-2 text-emerald-900/70"><Icon size={52}/><span className="text-xs font-bold">{unlocked?"Opening illustration…":"Subscriber artwork"}</span></div>}
    {item.theme==="Halloween"&&<span className="absolute top-2 right-2 text-xs rounded-full bg-orange-100 text-orange-900 px-2 py-1 font-bold">🎃 Halloween</span>}
  </div>;
}

function NewPrintWindow({label,images}){
  // Called on a user-opened empty same-origin window, never with user-generated HTML.
  const stylesheet='@page{size:A4 portrait;margin:0}html,body{margin:0;background:white}figure{margin:0;page-break-after:always;break-after:page;display:block;width:210mm;height:297mm}img{width:210mm;height:297mm;object-fit:contain;display:block}@media screen{body{background:#ddd;padding:20px}figure{margin:0 auto 24px;box-shadow:0 6px 30px #aaa}}button{padding:12px 16px;font-weight:bold;margin:16px}@media print{button{display:none}body{padding:0!important}}';
  const heading=label.replace(/[<>]/g,"");
  return '<!doctype html><html><head><title>'+heading+'</title><meta charset="utf-8"><style>'+stylesheet+'</style></head><body><button onclick="window.print()">Print / Save as PDF</button>'+images.map(u=>'<figure><img src="'+u+'" alt="A4 printable image"></figure>').join("")+'</body></html>';
}

export default function PrintableVault(){
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("");
  const [kind,setKind]=useState("");
  const [busy,setBusy]=useState("");
  const [preview,setPreview]=useState(null);
  useEffect(()=>{let live=true;api.get("/printables").then(({data:d})=>{if(live)setData(d);}).catch(e=>{if(live)setError(apiErrorMessage(e,"Could not open the Vault"));});return()=>{live=false;};},[]);
  useEffect(()=>()=>{preview?.urls.forEach(u=>URL.revokeObjectURL(u));},[preview]);

  const items=data?.items||[];
  const categories=useMemo(()=>[...new Set(items.map(i=>i.category))].sort(),[items]);
  const filtered=useMemo(()=>items.filter(i=>(!category||i.category===category)&&(!kind||i.kind===kind)&&(!search||[i.title,i.description,i.theme,i.category].join(" ").toLowerCase().includes(search.toLowerCase()))),[items,search,category,kind]);

  const fetchImages=async(chosen,variant)=>{
    const pages=chosen.flatMap(i=>Array.from({length:variant==="guide"?1:i.pages},(_,p)=>({id:i.id,page:p})));
    const urls=[];
    try{
      for(const part of pages){
        const r=await api.get(imageEndpoint(part.id,part.page,variant),{responseType:"blob"});
        urls.push(URL.createObjectURL(new Blob([r.data],{type:"image/svg+xml"})));
      }
      return urls;
    }catch(e){urls.forEach(u=>URL.revokeObjectURL(u));throw e;}
  };

  const openPreview=async(item,variant="colour")=>{
    if(!data?.unlocked)return;
    setBusy("preview-"+item.id);
    try{
      const urls=await fetchImages([item],variant);
      setPreview(prev=>{prev?.urls.forEach(u=>URL.revokeObjectURL(u));return{urls,title:item.title,variant};});
    }catch(e){toast.error(apiErrorMessage(e,"Could not preview images"));}
    finally{setBusy("");}
  };
  const print=async(chosen,variant="colour",label="Printable Quests")=>{
    if(!data?.unlocked)return;
    // Open synchronously on the click so mobile browsers do not block the print window.
    const win=window.open("","_blank");
    if(!win){toast.error("Allow pop-ups for Side-Quest to open print mode.");return;}
    win.document.write("<!doctype html><html><body><p>Preparing printable images…</p></body></html>");
    setBusy("print");
    let urls=[];
    try{
      urls=await fetchImages(chosen,variant);
      win.document.open();
      win.document.write(NewPrintWindow({label,images:urls}));
      win.document.close();
      win.addEventListener("beforeunload",()=>urls.forEach(u=>URL.revokeObjectURL(u)),{once:true});
    }catch(e){urls.forEach(u=>URL.revokeObjectURL(u));win.close();toast.error(apiErrorMessage(e,"Could not open print mode"));}
    finally{setBusy("");}
  };
  const download=async(item,variant="colour")=>{
    if(!data?.unlocked)return;
    setBusy("download-"+item.id);
    try{
      const urls=await fetchImages([item],variant);
      urls.forEach((url,index)=>{
        const a=document.createElement("a");a.href=url;a.download="sidequest-"+slug(item.title)+(urls.length>1?"-page-"+(index+1):"")+"-"+variant+".svg";
        document.body.appendChild(a);a.click();a.remove();
      });
      window.setTimeout(()=>urls.forEach(u=>URL.revokeObjectURL(u)),60000);
      toast.success("Printable image"+(urls.length>1?"s":"")+" ready to save");
    }catch(e){toast.error(apiErrorMessage(e,"Could not download image"));}
    finally{setBusy("");}
  };
  const bundleItems=id=>items.filter(i=>i.collection===id);

  return <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="printable-vault">
    <header className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white p-6 sm:p-9 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-xs font-bold tracking-widest uppercase text-emerald-200">Side-Quest · Print, Play & Create</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">The Printable Vault</h1>
        <p className="mt-3 max-w-xl text-emerald-50">Real activities with original printable artwork: mazes, colouring, cut-out crafts, games and Halloween adventures. Every page is an A4 image you can print or save as a PDF.</p>
        <div className="flex flex-wrap gap-2 mt-5 text-xs font-semibold"><span className="rounded-full bg-white/15 px-3 py-2">{items.length} original activities</span><span className="rounded-full bg-white/15 px-3 py-2">Scalable image artwork</span><span className="rounded-full bg-white/15 px-3 py-2">Ink-saving option</span></div>
      </div>
      <Paintbrush className="absolute right-[-24px] bottom-[-31px] text-white/10 rotate-[-18deg]" size={160}/>
    </header>

    {!data&&!error&&<p role="status">Opening the Vault…</p>}
    {error&&<div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
    {data&&<>
      {!data.unlocked&&<div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex flex-wrap gap-3" data-testid="vault-membership-locked">
        <Lock className="text-amber-800"/><div className="flex-1"><p className="font-bold text-amber-950">Family Membership unlocks every activity image.</p><p className="text-sm text-amber-900 mt-1">You can browse the titles and themes. Images, print mode and parent guides are accessible to subscribers and the verified platform owner.</p></div>
        <Link to="/parent/plan" className="text-sm font-bold text-amber-900 underline">See plans</Link>
      </div>}
      <section>
        <h2 className="font-display text-xl font-bold mb-3 text-slate-900">Print a whole activity pack</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {data.bundles.map(b=><div key={b.id} className="rounded-2xl p-5 border border-stone-200 bg-white flex flex-col gap-2" data-testid={"vault-bundle-"+b.id}>
            <h3 className="font-bold text-emerald-950">{b.title}</h3><p className="text-sm text-stone-600 flex-1">{b.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="rounded-full px-3 py-2 bg-emerald-900 text-white text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>print(bundleItems(b.id),"colour",b.title)}><Printer size={13} className="inline mr-1"/> Print / PDF</button>
              <button className="rounded-full px-3 py-2 border border-emerald-800 text-emerald-900 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>print(bundleItems(b.id),"ink",b.title)}>Ink-saving</button>
            </div>
          </div>)}
        </div>
      </section>
      <section aria-label="Find an illustrated activity">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-3"><h2 className="font-display text-xl font-bold text-slate-900">Find your next little adventure</h2><span className="text-xs text-slate-500">{filtered.length} activities</span></div>
        <div className="flex flex-wrap gap-2 mb-5">
          <label className="flex gap-2 items-center bg-white border border-stone-300 rounded-xl px-3 flex-1 max-w-sm min-w-[160px]"><Search size={17}/><span className="sr-only">Find an activity</span><input data-testid="vault-search" className="py-2.5 bg-transparent w-full outline-none text-sm" placeholder="Search activities…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
          <select data-testid="vault-category" value={category} onChange={e=>setCategory(e.target.value)} aria-label="Activity category" className="rounded-xl border border-stone-300 bg-white px-3 text-sm"><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
          <select data-testid="vault-kind" value={kind} onChange={e=>setKind(e.target.value)} aria-label="Activity format" className="rounded-xl border border-stone-300 bg-white px-3 text-sm"><option value="">All formats</option><option value="maze">Mazes</option><option value="colouring">Colouring</option><option value="craft">Crafts</option><option value="puzzle">Puzzles</option><option value="game">Games</option></select>
          {(search||category||kind)&&<button className="text-xs text-emerald-900 underline" onClick={()=>{setSearch("");setCategory("");setKind("");}}>Clear filters</button>}
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item=><article key={item.id} data-testid={"vault-item-"+item.id} className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm flex flex-col">
            <VaultThumbnail item={item} unlocked={data.unlocked}/>
            <div className="p-5 flex-1 flex flex-col gap-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">{item.category}</p>
              <h3 className="font-display text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 flex-1">{item.description}</p>
              <p className="text-xs text-slate-500">{item.pages} A4 image{item.pages>1?"s":""} · Ages {item.ages} · {item.minutes} mins</p>
              <p className="text-xs text-stone-500">Materials: {item.materials}</p>
              <div className="flex flex-wrap gap-2 border-t pt-3">
                <button className="rounded-full bg-emerald-900 text-white px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>openPreview(item)}><FileImage size={13} className="inline mr-1"/> View</button>
                <button className="rounded-full border border-emerald-800 text-emerald-900 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>print([item],"colour",item.title)}><Printer size={13} className="inline mr-1"/> Print / PDF</button>
                <button className="rounded-full border border-stone-300 text-stone-700 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>download(item)}><Download size={13} className="inline mr-1"/> Images</button>
                <button className="rounded-full border border-stone-300 text-stone-700 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>print([item],"ink",item.title)}>Ink-saving</button>
                <button className="text-xs text-emerald-900 underline px-2 py-2 disabled:opacity-50" disabled={!data.unlocked||!!busy} onClick={()=>openPreview(item,"guide")}>Parent guide</button>
              </div>
            </div>
          </article>)}
        </div>
        {!filtered.length&&<p className="p-8 border rounded-2xl text-center text-slate-600">No matching quests. Try a different filter.</p>}
      </section>
      <p className="text-xs text-stone-500">Side-Quest originals; not official curriculum publications. Print at A4/100%. Craft activities involving scissors or split pins may need adult help.</p>
    </>}
    {preview&&<div role="dialog" aria-modal="true" aria-label={"Preview "+preview.title} className="fixed inset-0 z-50 bg-slate-950/80 p-3 sm:p-7 flex flex-col">
      <div className="rounded-t-xl bg-white px-4 py-3 flex gap-3 items-center justify-between">
        <h2 className="font-bold text-sm truncate">{preview.title}</h2>
        <div className="flex items-center gap-2"><button className="rounded-full border px-3 py-2 text-sm font-semibold" onClick={()=>{const item=items.find(i=>i.title===preview.title);if(item)print([item],preview.variant,preview.title);}}><Printer size={15} className="inline mr-1"/> Print / PDF</button><button onClick={()=>setPreview(null)} aria-label="Close preview" className="rounded-lg p-2"><X size={20}/></button></div>
      </div>
      <div className="bg-stone-200 overflow-auto rounded-b-xl flex-1 p-3"><div className="max-w-[700px] mx-auto space-y-4">{preview.urls.map((url,index)=><img key={url} src={url} alt={"Printable sheet "+(index+1)} className="w-full bg-white shadow-sm"/>)}</div></div>
    </div>}
  </div>;
}
