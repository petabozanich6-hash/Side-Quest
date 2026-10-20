import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { BookOpen, Download, FileImage, Lock, Paintbrush, Printer, Search, Scissors, Sparkles, Puzzle, Palette, Gamepad2, Route, X, Trash2, AlertTriangle } from "lucide-react";

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
    if(!unlocked||!item.available){setUrl("");return undefined;}
    let alive=true,objectUrl="";
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      observer.disconnect();
      api.get(imageEndpoint(item.id),{responseType:"blob"})
        .then(r=>{if(!alive)return;objectUrl=URL.createObjectURL(new Blob([r.data],{type:"image/png"}));setUrl(objectUrl);})
        .catch(()=>{});
    },{rootMargin:"200px"});
    const node=element.current;if(node)observer.observe(node);
    return()=>{alive=false;observer.disconnect();if(objectUrl)URL.revokeObjectURL(objectUrl);};
  },[item.id,unlocked,item.available]);
  const Icon=ICONS[item.kind]||FileImage;
  return <div ref={element} className={"aspect-[210/235] max-h-[245px] w-full relative overflow-hidden grid place-items-center bg-gradient-to-br "+(PALETTE[item.kind]||"from-slate-50 to-stone-100")}>
    {url?<img src={url} alt={"Illustrated printable preview for "+item.title} className="w-full h-full object-contain" loading="lazy"/>:
      <div className="grid place-items-center gap-2 text-emerald-900/70"><Icon size={52}/><span className="text-xs font-bold">{unlocked?(item.available?"Opening illustration…":"Awaiting image import"):"Subscriber artwork"}</span></div>}
    {item.theme==="Halloween"&&<span className="absolute top-2 right-2 text-xs rounded-full bg-orange-100 text-orange-900 px-2 py-1 font-bold">🎃 Halloween</span>}
  </div>;
}

function NewPrintWindow({label,images}){
  // The already-opened same-origin window prints actual private PNG images, never ZIP files.
  // Leave a small non-printed border so ordinary home printers do not cut off the artwork.
  const stylesheet='@page{size:A4 portrait;margin:5mm}html,body{margin:0;background:white}body{font-family:system-ui,sans-serif}figure{margin:0;width:200mm;height:287mm;page-break-after:always;break-after:page}figure:last-of-type{page-break-after:auto;break-after:auto}figure img{width:100%;height:100%;object-fit:contain;display:block}button{padding:12px 16px;font-weight:bold;margin:16px;cursor:pointer}button:disabled{cursor:wait;opacity:.6}@media screen{body{background:#ddd;padding:20px}figure{background:white;margin:0 auto 24px;box-shadow:0 6px 30px #aaa}}@media print{button{display:none}body{padding:0!important}}';
  const heading=label.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  return '<!doctype html><html><head><title>'+heading+'</title><meta charset="utf-8"><style>'+stylesheet+'</style></head><body><button id="print-activities" disabled>Preparing activity pages…</button>'+images.map(u=>'<figure><img src="'+u+'" alt="A4 printable image"></figure>').join("")+'</body></html>';
}

/** Wait for the page images to render before enabling the print dialog (avoids blank PDFs). */
function waitForPrintableImage(img){
  return new Promise((resolve,reject)=>{
    if(img.complete){
      if(img.naturalWidth>0)resolve();
      else reject(new Error("An activity image could not be loaded for printing."));
      return;
    }
    img.addEventListener("load",resolve,{once:true});
    img.addEventListener("error",()=>reject(new Error("An activity image could not be loaded for printing.")),{once:true});
  });
}


/** Read the PNG artwork from individual files or the approved uncompressed batch ZIP. */
async function unpackImportFiles(files){
 const records=[];
 for(const file of Array.from(files||[])){
  if(file.name.toLowerCase().endsWith(".zip")){
   if(file.size>55_000_000)throw new Error("The import ZIP exceeds the 55 MB limit.");
   const buffer=await file.arrayBuffer(),view=new DataView(buffer),bytes=new Uint8Array(buffer);
   let offset=0;
   while(offset+30<=buffer.byteLength&&view.getUint32(offset,true)===0x04034b50){
    const flag=view.getUint16(offset+6,true),compression=view.getUint16(offset+8,true);
    if(flag&8||compression!==0)throw new Error("This ZIP uses compression the Vault importer cannot read. Please extract it and select the PNG images, or use an uncompressed ZIP.");
    const length=view.getUint32(offset+18,true),nameLen=view.getUint16(offset+26,true),extraLen=view.getUint16(offset+28,true);
    const start=offset+30+nameLen+extraLen;
    if(start+length>buffer.byteLength)throw new Error("Invalid ZIP file.");
    const name=new TextDecoder().decode(bytes.subarray(offset+30,offset+30+nameLen));
    if(name.toLowerCase().endsWith(".png")&&!name.split("/").pop().startsWith("._")){
     records.push({name,blob:new Blob([bytes.slice(start,start+length)],{type:"image/png"})});
    }
    offset=start+length;
   }
  }else if(file.name.toLowerCase().endsWith(".png")){
   records.push({name:file.name,blob:file});
  }else throw new Error("Only Side-Quest ZIPs or PNG images are supported.");
 }
 if(!records.length)throw new Error("No printable PNG images were found.");
 if(records.length>100)throw new Error("Import a maximum of 100 images at a time.");
 const valid=[],seen=new Set();
 for(const r of records){
  const base=r.name.replace(/\\/g,"/").split("/").pop();
  const stem=base.replace(/\.png$/i,"");
  const variant=/-ink$/i.test(stem)?"ink":"colour";
  const id=slug(stem.replace(/-ink$/i,"")).slice(0,80).replace(/-$/,"");
  if(!id||id.length<2||!(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(id)))
   throw new Error("Invalid printable file name: "+base);
  const key=id+"/"+variant;
  if(seen.has(key))throw new Error("Duplicate printable filename in this batch: "+base);
  seen.add(key);
  const title=id.replace(/^sidequest-/,"").split("-").map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(" ");
  valid.push({id,variant,blob:r.blob,title});
 }
 return valid;
}

export default function PrintableVault(){
  const [data,setData]=useState(null);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("");
  const [kind,setKind]=useState("");
  const [busy,setBusy]=useState("");
  const [importProgress,setImportProgress]=useState("");
  const [importCategory,setImportCategory]=useState("Learning & Discovery");
  const [replaceExisting,setReplaceExisting]=useState(false);
  const [galleryRevision,setGalleryRevision]=useState(0);
  const [preview,setPreview]=useState(null);
  const [deleteTarget,setDeleteTarget]=useState(null);
  useEffect(()=>{let live=true;api.get("/printables").then(({data:d})=>{if(live)setData(d);}).catch(e=>{if(live)setError(apiErrorMessage(e,"Could not open the Vault"));});return()=>{live=false;};},[]);
  useEffect(()=>()=>{preview?.urls.forEach(u=>URL.revokeObjectURL(u));},[preview]);

  const items=data?.items||[];
  const categories=useMemo(()=>[...new Set(items.map(i=>i.category))].sort(),[items]);
  const filtered=useMemo(()=>items.filter(i=>(!category||i.category===category)&&(!kind||i.kind===kind)&&(!search||[i.title,i.description,i.theme,i.category].join(" ").toLowerCase().includes(search.toLowerCase()))),[items,search,category,kind]);

  const fetchImages=async(chosen,variant)=>{
    const pages=chosen.flatMap(i=>Array.from({length:i.pages},(_,p)=>({id:i.id,page:p})));
    const urls=[];
    try{
      for(const part of pages){
        const r=await api.get(imageEndpoint(part.id,part.page,variant),{responseType:"blob"});
        urls.push(URL.createObjectURL(new Blob([r.data],{type:"image/png"})));
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
      const images=Array.from(win.document.querySelectorAll("figure img"));
      if(images.length!==urls.length)throw new Error("Some printable pages did not open.");
      await Promise.all(images.map(waitForPrintableImage));
      if(!win.closed){
        const button=win.document.getElementById("print-activities");
        if(!button)throw new Error("The print button could not be opened.");
        button.disabled=false;
        button.textContent="Print / Save as PDF";
        button.addEventListener("click",()=>win.print());
      }
    }catch(e){urls.forEach(u=>URL.revokeObjectURL(u));win.close();toast.error(apiErrorMessage(e,"Could not open print mode"));}
    finally{setBusy("");}
  };
  const download=async(item,variant="colour")=>{
    if(!data?.unlocked)return;
    setBusy("download-"+item.id);
    try{
      const urls=await fetchImages([item],variant);
      urls.forEach((url,index)=>{
        const a=document.createElement("a");a.href=url;a.download="sidequest-"+slug(item.title)+(urls.length>1?"-page-"+(index+1):"")+"-"+variant+".png";
        document.body.appendChild(a);a.click();a.remove();
      });
      window.setTimeout(()=>urls.forEach(u=>URL.revokeObjectURL(u)),60000);
      toast.success("Printable image"+(urls.length>1?"s":"")+" ready to save");
    }catch(e){toast.error(apiErrorMessage(e,"Could not download image"));}
    finally{setBusy("");}
  };
  const bundleItems=(id,variant="colour")=>items.filter(i=>i.collection===id && (variant==="ink"?i.ink_available:i.available));

  const importFiles=async input=>{
    if(!data?.owner)return;
    setBusy("import");
    let uploaded=0;
    try{
      const records=await unpackImportFiles(input);
      const previous=new Set(items.filter(i=>i.available).map(i=>i.id));
      const conflicts=[...new Set(records.filter(r=>r.variant==="colour"&&previous.has(r.id)).map(r=>r.title))];
      if(conflicts.length&&!replaceExisting)throw new Error("These names already exist: "+conflicts.join(", ")+". Rename the new image files, or tick Replace existing artwork if you intend to overwrite them.");
      for(let j=0;j<records.length;j++){
        const item=records[j];
        setImportProgress("Uploading "+(j+1)+" of "+records.length+": "+item.title+(item.variant==="ink"?" (ink)":""));
        const params=new URLSearchParams({variant:item.variant,title:item.title,
          category:importCategory,kind:importCategory==="Mazes & Puzzles"?"puzzle":
          importCategory==="Colouring & Creativity"?"colouring":
          importCategory==="Colour, Cut & Create"?"craft":
          importCategory==="Print & Play Games"?"game":"activity"});
        const result=await api.post("/printables/admin/assets/"+encodeURIComponent(item.id)+"?"+params,item.blob,{
          headers:{"Content-Type":"image/png"},timeout:120000
        });
        if(!result.data?.ok||result.data?.id!==item.id)throw new Error("The Vault did not confirm "+item.title+".");
        uploaded++;
      }
      setImportProgress("Checking the saved files in the Vault…");
      const response=await api.get("/printables",{params:{_refresh:Date.now()}});
      const expected=records.filter(r=>r.variant==="colour");
      const missing=expected.filter(r=>!response.data?.items?.some(i=>i.id===r.id&&i.available));
      if(missing.length)throw new Error("Upload finished, but "+missing.map(r=>r.title).join(", ")+" did not appear in the Vault. Please refresh and retry.");
      setData(response.data);
      setGalleryRevision(v=>v+1);
      setSearch("");setCategory("");setKind("");
      const added=new Set(expected.filter(r=>!previous.has(r.id)).map(r=>r.id)).size;
      const replaced=new Set(expected.filter(r=>previous.has(r.id)).map(r=>r.id)).size;
      toast.success(added+" new activities added"+(replaced?", "+replaced+" existing updated":"")+". Verified in the Printable Vault.");
    }catch(e){
      toast.error((uploaded?uploaded+" files uploaded before the error. ":"")+(e?.response?apiErrorMessage(e):e?.message||"Import stopped. Retry to finish."),{duration:9000});
    }finally{setBusy("");setImportProgress("");}
  };


  const deleteUploadedPrintable=async()=>{
    if(!data?.owner||!deleteTarget)return;
    const target=deleteTarget;
    setBusy("delete-"+target.id);
    try{
      const result=await api.delete("/printables/admin/assets/"+encodeURIComponent(target.id),{timeout:120000});
      if(!result.data?.ok||result.data.id!==target.id)throw new Error("The Vault did not confirm the removal.");
      const response=await api.get("/printables",{params:{_refresh:Date.now()}});
      const stillStored=response.data?.owner_uploads?.some(i=>i.id===target.id);
      if(stillStored)throw new Error("The artwork was deleted but the Vault still lists it. Refresh the page and check before retrying.");
      setData(response.data);
      setGalleryRevision(v=>v+1);
      setPreview(prev=>prev?.title===target.title?null:prev);
      setDeleteTarget(null);
      toast.success("Deleted "+target.title+" from the Printable Vault.");
    }catch(e){toast.error(e?.response?apiErrorMessage(e):e?.message||"Could not delete this printable.",{duration:8000});}
    finally{setBusy("");}
  };

  return <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="printable-vault">
    <header className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white p-6 sm:p-9 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-xs font-bold tracking-widest uppercase text-emerald-200">Side-Quest · Print, Play & Create</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">The Printable Vault</h1>
        <p className="mt-3 max-w-xl text-emerald-50">Real activities with original printable artwork: mazes, colouring, cut-out crafts, games and Halloween adventures. Every page is an A4 image you can print or save as a PDF.</p>
        <div className="flex flex-wrap gap-2 mt-5 text-xs font-semibold"><span className="rounded-full bg-white/15 px-3 py-2">{items.length} original activities</span><span className="rounded-full bg-white/15 px-3 py-2">Original illustrated artwork</span><span className="rounded-full bg-white/15 px-3 py-2">Ink-saving option</span></div>
      </div>
      <Paintbrush className="absolute right-[-24px] bottom-[-31px] text-white/10 rotate-[-18deg]" size={160}/>
    </header>

    {!data&&!error&&<p role="status">Opening the Vault…</p>}
    {error&&<div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
    {data&&<>

      <section className="rounded-2xl border border-stone-300 bg-white p-5 sm:p-6 flex flex-wrap items-center gap-5" data-testid="vault-handwriting-book">
        <div className="rounded-2xl border-2 border-black p-4 w-28 h-36 shrink-0 bg-white text-black flex flex-col justify-center items-center gap-2">
          <BookOpen size={27}/>
          <strong className="text-sm text-center leading-tight">The Little Letter Quest</strong>
          <span className="text-xs font-bold">Aa • Bb • Cc</span>
        </div>
        <div className="flex-1 min-w-[210px] space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">New · Early learner handwriting book</p>
          <h2 className="text-xl font-display font-bold text-slate-950">The Little Letter Quest</h2>
          <p className="text-sm text-stone-700">Learn to write A–Z with 56 black-and-white A4 pages, dotted letter formation, writing lines and real page turning. Print one page, a two-page letter pair, or the whole book. Saves colour ink.</p>
          <Link to="/parent/handwriting-book" className="inline-flex items-center rounded-xl bg-emerald-900 text-white px-4 py-2.5 text-sm font-bold">
            {data.unlocked?"Open the handwriting book":"Explore the handwriting book"} →
          </Link>
        </div>
      </section>

      {data.owner&&<section className="rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 space-y-3" data-testid="vault-owner-import">
        <h2 className="font-bold text-emerald-950">Owner HQ · Printable Vault artwork importer</h2>
        <p className="text-sm text-emerald-900">Stored in private Cloudflare storage: <strong>{data.ready_count||0} images</strong>. Add as many new activities as you like; each PNG filename becomes a new activity, unless its name matches an existing one (which replaces its artwork).</p>
        <label className="block text-sm text-emerald-950 font-semibold">Category for new activities
          <select value={importCategory} onChange={e=>setImportCategory(e.target.value)} disabled={!!busy} className="block mt-1 rounded-xl border border-emerald-500 bg-white px-3 py-2 text-sm">
            {["Learning & Discovery","Mazes & Puzzles","Colouring & Creativity","Colour, Cut & Create","Print & Play Games"].map(v=><option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="inline-flex rounded-full bg-emerald-900 text-white px-4 py-2 text-sm font-bold cursor-pointer">{busy==="import"?"Importing…":"Add printable images"}
          <input type="file" accept=".zip,.png,image/png" multiple disabled={!!busy} className="sr-only" onChange={e=>{const selected=e.target.files;if(selected?.length)void importFiles(selected);e.target.value="";}}/>
        </label>
        <label className="flex gap-2 items-center text-sm text-emerald-900"><input type="checkbox" checked={replaceExisting} onChange={e=>setReplaceExisting(e.target.checked)} disabled={!!busy}/> Replace existing artwork when a filename matches (otherwise duplicates are blocked)</label>

        <div className="rounded-xl border border-emerald-300 bg-white p-3 space-y-2" data-testid="vault-owner-manage-uploads">
          <h3 className="font-bold text-emerald-950">Manage uploaded printables ({data.owner_uploads?.length||0})</h3>
          <p className="text-xs text-stone-600">Delete removes the selected image and any ink-saving version from private storage. Newly added activities disappear; original catalogue activities remain as awaiting import. Nothing is removed until you confirm.</p>
          {!data.owner_uploads?.length?<p className="text-sm text-stone-600">No uploaded artwork found.</p>:
            <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
              {data.owner_uploads.map(item=><div key={item.id} className="flex flex-wrap gap-2 items-center justify-between py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 break-words">{item.title}</p>
                  <p className="text-xs text-stone-500">{item.colour?"Main image stored":"Main image missing"}{item.ink?" · Ink-saving stored":""}</p>
                </div>
                <button type="button" data-testid={"vault-delete-"+item.id} disabled={!!busy} className="inline-flex gap-1 items-center rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50" onClick={()=>setDeleteTarget(item)}>
                  <Trash2 size={15}/> Delete
                </button>
              </div>)}
            </div>}
        </div>
        {importProgress&&<p role="status" className="text-sm font-semibold text-emerald-900">{importProgress}</p>}
        <p className="text-xs text-emerald-800">Use portrait PNGs (at least 768×1000 pixels), or an uncompressed ZIP. New artwork appears to paying families once its storage and catalogue entry are confirmed. Only your owner account can import or replace images.</p>
      </section>}

      {!data.unlocked&&<div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex flex-wrap gap-3" data-testid="vault-membership-locked">
        <Lock className="text-amber-800"/><div className="flex-1">
          <p className="font-bold text-amber-950">{data.art_review_only?"Illustration review in progress":"Family Membership unlocks every activity image."}</p>
          <p className="text-sm text-amber-900 mt-1">{data.art_review_only?"The new illustrated activities are being checked before release. Only the verified platform owner can view and print the drafts for now.":"You can browse the collection. Images, print mode and parent guides unlock with a paid Family Membership."}</p>
        </div>
        {!data.art_review_only&&<Link to="/parent/plan" className="text-sm font-bold text-amber-900 underline">See plans</Link>}
      </div>}
      <section>
        <h2 className="font-display text-xl font-bold mb-3 text-slate-900">Print a whole activity pack</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {data.bundles.map(b=><div key={b.id} className="rounded-2xl p-5 border border-stone-200 bg-white flex flex-col gap-2" data-testid={"vault-bundle-"+b.id}>
            <h3 className="font-bold text-emerald-950">{b.title}</h3><p className="text-sm text-stone-600 flex-1">{b.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="rounded-full px-3 py-2 bg-emerald-900 text-white text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!bundleItems(b.id).length} onClick={()=>print(bundleItems(b.id),"colour",b.title)}><Printer size={13} className="inline mr-1"/> Print / PDF</button>
              <button className="rounded-full px-3 py-2 border border-emerald-800 text-emerald-900 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!bundleItems(b.id,"ink").length} onClick={()=>print(bundleItems(b.id,"ink"),"ink",b.title)}>Ink-saving</button>
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
            <VaultThumbnail key={item.id+"-"+galleryRevision} item={item} unlocked={data.unlocked}/>
            <div className="p-5 flex-1 flex flex-col gap-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">{item.category}</p>
              <h3 className="font-display text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 flex-1">{item.description}</p>
              <p className="text-xs text-slate-500">{item.pages} A4 image{item.pages>1?"s":""} · Ages {item.ages} · {item.minutes} mins{!item.available?" · Import pending":""}</p>
              <p className="text-xs text-stone-500">Materials: {item.materials}</p>
              <div className="flex flex-wrap gap-2 border-t pt-3">
                <button className="rounded-full bg-emerald-900 text-white px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!item.available} onClick={()=>openPreview(item)}><FileImage size={13} className="inline mr-1"/> View</button>
                <button className="rounded-full border border-emerald-800 text-emerald-900 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!item.available} onClick={()=>print([item],"colour",item.title)}><Printer size={13} className="inline mr-1"/> Print / PDF</button>
                <button className="rounded-full border border-stone-300 text-stone-700 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!item.available} onClick={()=>download(item)}><Download size={13} className="inline mr-1"/> Images</button>
                <button className="rounded-full border border-stone-300 text-stone-700 px-3 py-2 text-xs font-bold disabled:opacity-50" disabled={!data.unlocked||!!busy||!item.ink_available} onClick={()=>print([item],"ink",item.title)}>Ink-saving</button>

              </div>
            </div>
          </article>)}
        </div>
        {!filtered.length&&<p className="p-8 border rounded-2xl text-center text-slate-600">No matching quests. Try a different filter.</p>}
      </section>
      <p className="text-xs text-stone-500">Side-Quest originals; not official curriculum publications. Print at A4/100%. Craft activities involving scissors or split pins may need adult help.</p>
    </>}
    {deleteTarget&&<div role="dialog" aria-modal="true" aria-label={"Delete "+deleteTarget.title} className="fixed inset-0 z-[70] bg-slate-950/70 p-4 grid place-items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2"><AlertTriangle size={21} className="text-red-700"/> Delete printable artwork?</h2>
        <p className="text-sm text-slate-700">Permanently remove <strong>{deleteTarget.title}</strong> and its ink-saving version (if uploaded) from Cloudflare storage? Paid families will no longer be able to view or print this activity.</p>
        <p className="text-xs text-red-800">This cannot be undone. You can re-upload the original PNG later.</p>
        <div className="flex flex-wrap gap-3 justify-end">
          <button type="button" disabled={!!busy} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 disabled:opacity-50" onClick={()=>setDeleteTarget(null)}>Cancel</button>
          <button type="button" data-testid="vault-confirm-delete" disabled={!!busy} className="rounded-lg bg-red-800 text-white px-4 py-2 font-bold disabled:opacity-50" onClick={deleteUploadedPrintable}>{busy.startsWith("delete-")?"Deleting…":"Yes, delete artwork"}</button>
        </div>
      </div>
    </div>}
    {preview&&<div role="dialog" aria-modal="true" aria-label={"Preview "+preview.title} className="fixed inset-0 z-50 bg-slate-950/80 p-3 sm:p-7 flex flex-col">
      <div className="rounded-t-xl bg-white px-4 py-3 flex gap-3 items-center justify-between">
        <h2 className="font-bold text-sm truncate">{preview.title}</h2>
        <div className="flex items-center gap-2"><button className="rounded-full border px-3 py-2 text-sm font-semibold" onClick={()=>{const item=items.find(i=>i.title===preview.title);if(item)print([item],preview.variant,preview.title);}}><Printer size={15} className="inline mr-1"/> Print / PDF</button><button onClick={()=>setPreview(null)} aria-label="Close preview" className="rounded-lg p-2"><X size={20}/></button></div>
      </div>
      <div className="bg-stone-200 overflow-auto rounded-b-xl flex-1 p-3"><div className="max-w-[700px] mx-auto space-y-4">{preview.urls.map((url,index)=><img key={url} src={url} alt={"Printable sheet "+(index+1)} className="w-full bg-white shadow-sm"/>)}</div></div>
    </div>}
  </div>;
}
