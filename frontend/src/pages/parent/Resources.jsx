import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, ExternalLink, Check, X, ShieldAlert } from "lucide-react";

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
    <div className="p-8 lg:p-10 space-y-6" data-testid="resources-page">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Resource Library</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">Free to access does not mean free to copy. Check licence and attribution before downloading, adapting or republishing.</p>
        </div>
        <button onClick={()=>setOpen(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white flex items-center gap-1.5" data-testid="add-resource-btn"><Plus size={14}/> Add resource</button>
      </div>

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
        {resources.length === 0 && <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No resources yet.</div>}
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
