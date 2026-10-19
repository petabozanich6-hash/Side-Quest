import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { BookOpen, Download, FileText, Lock, Paintbrush, Printer, Search, Scissors, Sparkles, X } from "lucide-react";

const ICONS = { craft: Scissors, worksheet: BookOpen, game: Sparkles };
const COLOURS = {
  "Maths": "from-amber-50 to-orange-100 border-amber-200",
  "English": "from-sky-50 to-blue-100 border-sky-200",
  "Science": "from-emerald-50 to-teal-100 border-emerald-200",
  "Geography": "from-lime-50 to-green-100 border-lime-200",
  "Logic & Puzzles": "from-purple-50 to-violet-100 border-purple-200",
  "Colour, Cut & Create": "from-pink-50 to-rose-100 border-pink-200"
};

export default function PrintableVault() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [kind, setKind] = useState("");
  const [busy, setBusy] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let live = true;
    api.get("/printables").then(({data:incoming}) => { if(live)setData(incoming); })
      .catch(e => { if(live)setError(apiErrorMessage(e,"Could not load printables")); });
    return () => {live = false;};
  }, []);
  useEffect(() => () => { if(preview?.url)URL.revokeObjectURL(preview.url); }, [preview]);

  const items = data?.items || [];
  const categories = useMemo(() => Array.from(new Set(items.map(x => x.category))).sort(), [items]);
  const filtered = useMemo(() => items.filter(x =>
    (!category || x.category === category) &&
    (!kind || x.kind === kind) &&
    (!search || [x.title,x.description,x.category,x.theme,x.ages].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [items,search,category,kind]);

  const pdf = async (path, title, mode) => {
    if (!data?.unlocked) { toast.error("Family Membership is required to download printables."); return; }
    setBusy(path + mode);
    try {
      const response = await api.get(path, { responseType:"blob" });
      const blob = new Blob([response.data], { type:"application/pdf" });
      const url = URL.createObjectURL(blob);
      if(mode === "preview") {
        setPreview(previous => {
          if(previous?.url) URL.revokeObjectURL(previous.url);
          return { url, title };
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = "sidequest-" + title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"") + ".pdf";
        document.body.appendChild(a);a.click();a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
        toast.success("Printable ready to save");
      }
    } catch(e) {
      toast.error(e.response?.status === 402 ? "A Family Membership is needed to unlock the vault." : apiErrorMessage(e,"Could not open PDF"));
    } finally {setBusy("");}
  };
  const all = (id,variant="colour") => pdf("/printables/bundles/"+encodeURIComponent(id)+"/pdf?variant="+variant,id,"download");
  const one = (id,title,variant="colour",mode="download") => pdf("/printables/"+encodeURIComponent(id)+"/pdf?variant="+variant,title,mode);

  return <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="printable-vault">
    <header className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white p-6 sm:p-9 overflow-hidden relative">
      <div className="relative z-10">
        <div className="text-xs font-bold tracking-[.22em] uppercase text-emerald-200">Side-Quest Original Collection</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">The Printable Vault</h1>
        <p className="max-w-xl text-emerald-50 mt-3 leading-relaxed">Little paper quests. Big adventures. Colour, cut, build, investigate and discover — with original A4 activities ready when your family is.</p>
        <div className="flex flex-wrap items-center gap-2 mt-5 text-xs font-semibold">
          <span className="rounded-full bg-white/15 px-3 py-1.5">{items.length} printable quests</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Ink-saving versions</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Parent guides</span>
        </div>
      </div>
      <Paintbrush size={145} className="absolute right-[-26px] bottom-[-32px] rotate-[-22deg] text-white/10" aria-hidden="true" />
    </header>

    {!data && !error && <p className="text-stone-600" role="status">Opening the vault…</p>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">{error}</div>}

    {data && <>
      {!data.unlocked && <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 flex flex-wrap items-start gap-3" data-testid="vault-membership-locked">
        <Lock className="text-amber-700 shrink-0"/>
        <div className="flex-1 min-w-[210px]"><p className="font-bold text-amber-950">The Vault is included with Family Membership.</p>
          <p className="text-sm mt-1 text-amber-900">Feel free to browse the collection. Downloads, print templates and parent guides unlock with an active subscription.</p></div>
        <Link className="rounded-full bg-amber-900 text-white px-4 py-2 text-sm font-semibold" to="/parent/plan">View membership</Link>
      </div>}

      <section aria-label="Printable bundles">
        <div className="flex items-center gap-2 mb-3"><Sparkles size={19} className="text-emerald-800"/><h2 className="font-display text-xl font-bold text-slate-900">Grab a whole pack</h2></div>
        <div className="grid md:grid-cols-3 gap-3">
          {(data.bundles || []).map(bundle=><div key={bundle.id} className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col gap-2" data-testid={"vault-bundle-"+bundle.id}>
            <h3 className="font-bold text-emerald-950">{bundle.title}</h3>
            <p className="text-sm text-slate-600 flex-1">{bundle.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <button disabled={!data.unlocked || !!busy} onClick={() => all(bundle.id)} className="rounded-full bg-emerald-900 px-3 py-2 text-white text-xs font-semibold disabled:opacity-50"><Download size={13} className="inline mr-1"/> Download pack</button>
              <button disabled={!data.unlocked || !!busy} onClick={() => all(bundle.id,"ink")} className="rounded-full border border-emerald-700 text-emerald-900 px-3 py-2 text-xs font-semibold disabled:opacity-50">Ink-saver</button>
            </div>
          </div>)}
        </div>
      </section>

      <section aria-label="Browse printable activities">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-3">
          <h2 className="font-display text-xl font-bold text-slate-900">Explore individual quests</h2>
          <p className="text-xs text-slate-500">{filtered.length} of {items.length} activities</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          <label className="flex items-center gap-2 rounded-xl bg-white border border-stone-300 px-3 min-w-[195px] flex-1 max-w-sm">
            <Search size={17} className="text-stone-500" /><span className="sr-only">Find a printable</span>
            <input className="w-full py-2.5 outline-none bg-transparent text-sm" placeholder="Find a quest…" value={search} onChange={e=>setSearch(e.target.value)} data-testid="vault-search" />
          </label>
          <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm" value={category} onChange={e=>setCategory(e.target.value)} aria-label="Filter by subject" data-testid="vault-category"><option value="">All subjects</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm" value={kind} onChange={e=>setKind(e.target.value)} aria-label="Filter by format" data-testid="vault-kind"><option value="">All formats</option><option value="worksheet">Worksheets</option><option value="craft">Colour, cut & create</option></select>
          {(search||category||kind) && <button type="button" onClick={() => {setSearch("");setCategory("");setKind("");}} className="text-emerald-800 text-xs font-bold px-2">Clear filters</button>}
        </div>
        {filtered.length===0 && <div className="p-8 border border-dashed rounded-2xl text-center text-stone-600">No quests match your search. Try clearing the filters.</div>}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item=>{
            const Icon=ICONS[item.kind] || FileText;
            return <article key={item.id} className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden flex flex-col" data-testid={"vault-item-"+item.id}>
              <div className={"bg-gradient-to-br border-b p-5 "+(COLOURS[item.category] || "from-stone-50 to-stone-100")}>
                <div className="w-12 h-12 bg-white/80 rounded-2xl grid place-items-center text-emerald-900"><Icon size={26}/></div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-slate-600 mt-4">{item.category}</p>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                <p className="text-sm text-slate-600 flex-1">{item.description}</p>
                <p className="text-xs text-stone-600">Ages {item.ages} · {item.minutes} min · {item.kind==="craft"?"Make and create":"Paper quest"}</p>
                <p className="text-xs text-stone-500">You need: {item.materials}</p>
                <div className="flex flex-wrap gap-2 border-t pt-3">
                  <button className="rounded-full bg-emerald-900 px-3 py-2 text-white text-xs font-bold disabled:opacity-50" onClick={()=>one(item.id,item.title,"colour","preview")} disabled={!data.unlocked || !!busy} aria-label={"Preview "+item.title}><FileText size={14} className="inline mr-1"/> Preview</button>
                  <button className="rounded-full border border-emerald-800 text-emerald-900 px-3 py-2 text-xs font-bold disabled:opacity-50" onClick={()=>one(item.id,item.title)} disabled={!data.unlocked || !!busy}><Download size={14} className="inline mr-1"/> PDF</button>
                  <button className="rounded-full border border-stone-300 text-stone-700 px-3 py-2 text-xs font-bold disabled:opacity-50" onClick={()=>one(item.id,item.title,"ink")} disabled={!data.unlocked || !!busy}>Ink-saver</button>
                  <button className="rounded-full text-emerald-900 underline px-2 py-2 text-xs font-bold disabled:opacity-50" onClick={()=>one(item.id,item.title,"guide")} disabled={!data.unlocked || !!busy}>Parent guide</button>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>
      <p className="text-xs text-stone-500">These are original Side-Quest activities, not official curriculum documents. Parents can use them independently or photograph completed work for the Evidence Backpack. Exact curriculum outcomes must be verified before being attached to resources.</p>
    </>}
    {preview && <div className="fixed inset-0 z-50 bg-slate-950/80 p-3 sm:p-8 flex flex-col" role="dialog" aria-modal="true" aria-label={"Preview "+preview.title}>
      <div className="flex items-center justify-between gap-3 bg-white rounded-t-xl px-4 py-3"><h2 className="font-bold text-sm truncate">{preview.title}</h2><div className="flex items-center gap-3"><span className="text-xs text-stone-500 hidden sm:inline"><Printer size={13} className="inline"/> Use your PDF viewer's print button</span><button onClick={()=>setPreview(null)} className="rounded-lg p-2 hover:bg-stone-100" aria-label="Close preview"><X size={20}/></button></div></div>
      <iframe title={"Printable preview: "+preview.title} src={preview.url} className="bg-white w-full flex-1 rounded-b-xl"/>
    </div>}
  </div>;
}
