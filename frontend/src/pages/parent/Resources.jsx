import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, ExternalLink, Check, X, ShieldAlert, Bookmark, Search, Calculator, BookOpen, FlaskConical, Globe, Palette, HeartPulse, Laptop, Languages, ChevronDown, Sparkles } from "lucide-react";
import { FREE_RESOURCES, FREE_SUBJECTS } from "../../data/freeResources";

const LICENCES = [
  { v: "cc_by", l: "CC BY", cls: "badge-cc-by" },
  { v: "cc_by_sa", l: "CC BY-SA", cls: "badge-cc-by-sa" },
  { v: "public_domain", l: "Public Domain", cls: "badge-public-domain" },
  { v: "government", l: "Government", cls: "badge-government" },
  { v: "link_only", l: "Link only", cls: "badge-link-only" },
  { v: "unknown", l: "Unknown", cls: "badge-unknown" },
];
const licenceCls = (v) => LICENCES.find(x=>x.v===v)?.cls || "badge-unknown";
const licenceLabel = (v) => LICENCES.find(x=>x.v===v)?.l || v;

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", provider: "", licence: "unknown", learning_area: "", stage: "", purpose: "", response_task: "", offline_alternative: "", attribution: "" });

  const load = () => api.get("/resources").then(r => setResources(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/resources", form); toast.success("Resource added"); setOpen(false); setForm({ title: "", url: "", provider: "", licence: "unknown", learning_area: "", stage: "", purpose: "", response_task: "", offline_alternative: "", attribution: "" }); load(); }
    catch (err) { toast.error("Failed"); }
  };

  const approve = async (id) => { await api.put(`/resources/${id}/approve`); toast.success("Approved"); load(); };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="resources-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Resource Library</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">Keep useful websites, videos and other learning links in one place, ready for future lessons. Check licences and attribution before copying, adapting or republishing someone else’s work.</p>
        </div>
        <button onClick={()=>setOpen(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="add-resource-btn"><Plus size={14}/> Add resource</button>
      </div>

      <FreeResources saved={resources} onSaved={load} />

      <h2 className="font-display text-xl font-bold text-slate-900 pt-2">Your saved resources</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(r => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5" data-testid={`resource-${r.id}`}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-slate-900 leading-tight">{r.title}</h3>
              <span className={`pill ${licenceCls(r.licence)}`}>{licenceLabel(r.licence)}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{r.provider || "—"} · {r.stage || "any stage"} · {r.learning_area || "general"}</div>
            {r.purpose && <p className="mt-3 text-sm text-slate-700">{r.purpose}</p>}
            {r.licence === "unknown" && <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 flex items-start gap-1.5"><ShieldAlert size={12} className="mt-0.5"/>Treat as link-only — do not copy, adapt or redistribute.</div>}
            <div className="mt-4 flex items-center gap-2">
              <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-teal-700 flex items-center gap-1" data-testid={`open-${r.id}`}><ExternalLink size={12}/> Open</a>
              {!r.approved && <button onClick={()=>approve(r.id)} className="ml-auto rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-semibold flex items-center gap-1" data-testid={`approve-${r.id}`}><Check size={12}/> Approve</button>}
              {r.approved && <span className="ml-auto pill pill-accepted">Approved</span>}
            </div>
          </div>
        ))}
        {resources.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-6 sm:p-10 text-center text-sm text-slate-600" data-testid="empty-resources"><h2 className="font-display text-lg font-semibold text-slate-900">Your saved resources will appear here</h2><p className="mt-2">Found a useful website or video? Select Add resource to save its link for later. For official state and territory resources, visit the <Link to="/parent/curriculum" className="underline font-semibold">Curriculum hub</Link>.</p><button onClick={() => setOpen(true)} type="button" className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white" data-testid="resources-empty-add">Add your first resource</button></div>}
      </div>

      {open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-xl rounded-2xl bg-white p-6 my-8" data-testid="resource-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl font-bold">Add resource</h2><button type="button" onClick={()=>setOpen(false)}><X size={18}/></button></div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Title *" col={2}><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="input" data-testid="r-title"/></F>
              <F label="URL *" col={2}><input required value={form.url} onChange={e=>setForm({...form, url: e.target.value})} className="input" data-testid="r-url"/></F>
              <F label="Provider"><input value={form.provider} onChange={e=>setForm({...form, provider: e.target.value})} className="input" data-testid="r-provider"/></F>
              <F label="Licence">
                <select value={form.licence} onChange={e=>setForm({...form, licence: e.target.value})} className="input" data-testid="r-licence">
                  {LICENCES.map(l=><option key={l.v} value={l.v}>{l.l}</option>)}
                </select>
              </F>
              <F label="Stage"><input value={form.stage} onChange={e=>setForm({...form, stage: e.target.value})} className="input" placeholder="S2" data-testid="r-stage"/></F>
              <F label="Learning area"><input value={form.learning_area} onChange={e=>setForm({...form, learning_area: e.target.value})} className="input" data-testid="r-area"/></F>
              <F label="Purpose" col={2}><textarea rows={2} value={form.purpose} onChange={e=>setForm({...form, purpose: e.target.value})} className="input" data-testid="r-purpose"/></F>
              <F label="Response task" col={2}><input value={form.response_task} onChange={e=>setForm({...form, response_task: e.target.value})} className="input" data-testid="r-task"/></F>
              <F label="Offline alternative" col={2}><input value={form.offline_alternative} onChange={e=>setForm({...form, offline_alternative: e.target.value})} className="input" data-testid="r-offline"/></F>
              <F label="Attribution text (for CC/openly licensed)" col={2}><input value={form.attribution} onChange={e=>setForm({...form, attribution: e.target.value})} className="input" placeholder="Title by Creator, source URL, licence" data-testid="r-attr"/></F>
            </div>
            <button className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white" data-testid="submit-resource">Add</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.5rem; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; font-size:0.875rem; } .input:focus { outline:none; border-color:#0d9488; }`}</style>
    </div>
  );
}
const F = ({ label, children, col=1 }) => (<div className={col===2?"col-span-2":""}><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><div className="mt-1">{children}</div></div>);

/** Each subject's colour and icon, so the free resources are easy to scan. */
const SUBJECT_STYLE = {
  "Maths": { icon: Calculator, bg: "#E0ECFF", fg: "#1E40AF", band: "#3B82F6" },
  "English": { icon: BookOpen, bg: "#FFE4EA", fg: "#9F1239", band: "#F43F5E" },
  "Science": { icon: FlaskConical, bg: "#DCFCE7", fg: "#166534", band: "#22C55E" },
  "History & Geography": { icon: Globe, bg: "#FEF3C7", fg: "#92400E", band: "#F59E0B" },
  "Creative Arts": { icon: Palette, bg: "#F3E8FF", fg: "#6B21A8", band: "#A855F7" },
  "PDHPE": { icon: HeartPulse, bg: "#CCFBF1", fg: "#115E59", band: "#14B8A6" },
  "Technology": { icon: Laptop, bg: "#E0E7FF", fg: "#3730A3", band: "#6366F1" },
  "Languages": { icon: Languages, bg: "#FFEDD5", fg: "#9A3412", band: "#F97316" },
};
const styleFor = (subject) => SUBJECT_STYLE[subject] || SUBJECT_STYLE.English;
const domainOf = (url) => url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

function SubjectChip({ subject, small }) {
  const st = styleFor(subject);
  const Icon = st.icon;
  return <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${small ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}`} style={{ backgroundColor: st.bg, color: st.fg }}><Icon size={small ? 11 : 13} />{subject}</span>;
}

function FreeCard({ r, saved, busy, onSave }) {
  const [tips, setTips] = useState(false);
  const st = styleFor(r.subjects[0]);
  const Icon = st.icon;
  const free = r.note.startsWith("Free");
  return (
    <article className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col" data-testid={`free-resource-${r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div className="h-1.5" style={{ backgroundColor: st.band }} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl grid place-items-center" style={{ backgroundColor: st.bg, color: st.fg }}><Icon size={22} /></div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-slate-900 leading-snug">{r.title}</h3>
            <p className="text-xs text-slate-500 truncate">{r.provider}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${free ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"}`}>{free ? "Free" : r.note}</span>
          <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold">Ages {r.ages}</span>
          {r.subjects.slice(0, 2).map((x) => <SubjectChip key={x} subject={x} small />)}
        </div>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed line-clamp-3">{r.purpose}</p>
        {free && r.note !== "Free" && <p className="mt-1 text-[11px] text-slate-500">{r.note.replace(/^Free\s*/, "").replace(/^\(|\)$/g, "")}</p>}
        {r.how && (
          <div className="mt-2">
            <button type="button" onClick={() => setTips((x) => !x)} aria-expanded={tips} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: st.fg }}>
              <Sparkles size={12} /> How to use it <ChevronDown size={13} className={`transition-transform ${tips ? "rotate-180" : ""}`} />
            </button>
            {tips && <p className="mt-1.5 rounded-xl p-2.5 text-xs leading-relaxed" style={{ backgroundColor: st.bg, color: st.fg }}>{r.how}</p>}
          </div>
        )}
        <div className="mt-auto pt-4 flex items-center gap-2">
          <a href={r.url} target="_blank" rel="noreferrer noopener" className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: st.band }} title={r.url}>
            <span className="truncate">Visit {domainOf(r.url)}</span> <ExternalLink size={13} className="shrink-0" />
          </a>
          {saved
            ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 px-3 py-2 text-xs font-semibold" title="In your library"><Check size={13} /> Saved</span>
            : <button type="button" onClick={onSave} disabled={busy} aria-label={`Save ${r.title} to your library`} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"><Bookmark size={13} /> {busy ? "…" : "Save"}</button>}
        </div>
      </div>
    </article>
  );
}

/** Free websites for families: browse by subject, open, or save into this family's library. */
function FreeResources({ saved, onSaved }) {
  const [subject, setSubject] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState("");
  const have = new Set(saved.map((r) => (r.url || "").replace(/\/+$/, "")));
  const isSaved = (r) => have.has(r.url.replace(/\/+$/, ""));
  const matches = (r) => !q || `${r.title} ${r.provider} ${r.purpose} ${r.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase());
  const save = async (r) => {
    setBusy(r.url);
    try {
      await api.post("/resources", { title: r.title, url: r.url, provider: r.provider, licence: r.licence, learning_area: r.subjects.join(", "), purpose: r.purpose, age_suitability: r.ages });
      toast.success(`${r.title} saved to your library`);
      await onSaved();
    } catch { toast.error("Couldn't save that. Please try again."); } finally { setBusy(""); }
  };
  const card = (r) => <FreeCard key={r.url} r={r} saved={isSaved(r)} busy={busy === r.url} onSave={() => save(r)} />;
  const grid = "grid sm:grid-cols-2 xl:grid-cols-3 gap-4";
  // "All" without a search shows a short shelf per subject; picking a subject (or searching) shows everything that matches.
  const shelves = !subject && !q;
  const list = FREE_RESOURCES.filter((r) => (!subject || r.subjects.includes(subject)) && matches(r));

  return (
    <section className="rounded-3xl p-4 sm:p-6 space-y-5" style={{ background: "linear-gradient(135deg,#F0FDF4 0%,#EFF6FF 50%,#FDF4FF 100%)" }} data-testid="free-resources">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{FREE_RESOURCES.length} trusted sites · all free to use</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Free resources for families</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">Hand-picked websites and apps by subject. Tap <strong>How to use it</strong> for an idea, visit the site, or save it to your library.</p>
        </div>
        <label className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search free resources" aria-label="Search free resources" className="w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm shadow-sm" />
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Subjects">
        <button type="button" role="tab" aria-selected={!subject} onClick={() => setSubject("")} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold border ${!subject ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"}`}>All subjects</button>
        {FREE_SUBJECTS.map((sub) => {
          const st = styleFor(sub); const Icon = st.icon; const on = subject === sub;
          return (
            <button key={sub} type="button" role="tab" aria-selected={on} onClick={() => setSubject(on ? "" : sub)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border"
              style={on ? { backgroundColor: st.band, borderColor: st.band, color: "white" } : { backgroundColor: "white", borderColor: "#E2E8F0", color: st.fg }}>
              <Icon size={13} />{sub}
            </button>
          );
        })}
      </div>
      {shelves ? FREE_SUBJECTS.map((sub) => {
        const items = FREE_RESOURCES.filter((r) => r.subjects[0] === sub);
        if (!items.length) return null;
        const all = FREE_RESOURCES.filter((r) => r.subjects.includes(sub)).length;
        return (
          <div key={sub} className="space-y-3">
            <div className="flex items-center gap-2">
              <SubjectChip subject={sub} />
              <span className="text-xs text-slate-500">{all} resources</span>
              {all > 3 && <button type="button" onClick={() => setSubject(sub)} className="ml-auto text-xs font-semibold underline" style={{ color: styleFor(sub).fg }}>See all {sub}</button>}
            </div>
            <div className={grid}>{items.slice(0, 3).map(card)}</div>
          </div>
        );
      }) : (
        <div className={grid}>
          {list.map(card)}
          {!list.length && <p className="text-sm text-slate-600 col-span-full">No free resources match that yet.</p>}
        </div>
      )}
      <p className="text-xs text-slate-500">These link to other organisations' websites. Side-Quest isn't affiliated with them. Check each site's terms before copying or sharing its content.</p>
    </section>
  );
}
