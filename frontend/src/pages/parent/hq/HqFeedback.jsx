import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bell, CheckCircle, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { adminApi, errorText } from "../../../lib/adminApi";
import { Alert, Button, GREEN } from "./ui";

const STATUS = [
  ["new","New"],["reviewing","Under review"],["in_progress","In progress"],["resolved","Resolved"],["closed","Closed"],
];
const LABEL = { problem:"Problem",idea:"Idea",feedback:"Feedback",other:"Other" };
const F = ({ label, children }) => <label className="text-xs font-semibold text-stone-700 block">{label}<div className="mt-1">{children}</div></label>;

export default function HqFeedback() {
  const [items,setItems] = useState([]);
  const [status,setStatus] = useState("");
  const [category,setCategory] = useState("");
  const [page,setPage] = useState(1);
  const [more,setMore] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [selected,setSelected] = useState(null);
  const [draftStatus,setDraftStatus] = useState("new");
  const [ownerNote,setOwnerNote] = useState("");
  const [saving,setSaving] = useState(false);
  const [unread,setUnread] = useState(0);

  async function load() {
    setLoading(true);setError("");
    try {
      const [results,counts]=await Promise.all([
        adminApi.get("/feedback",{status:status||undefined,category:category||undefined,page}),
        adminApi.get("/feedback/unread-count"),
      ]);
      setItems(results.items||[]);setMore(results.has_more===true);setUnread(counts.unread||0);
      setSelected(prev=> prev ? (results.items||[]).find(x=>x.id===prev.id)||null : null);
    } catch(e) {setError(errorText(e,"Could not load submitted feedback."));}
    finally {setLoading(false);}
  }
  useEffect(()=>{load();},[status,category,page]);

  async function openItem(item) {
    setSelected(item);setDraftStatus(item.status);setOwnerNote(item.owner_note||"");
    if(item.seen_at) return;
    try {
      await adminApi.put("/feedback/"+encodeURIComponent(item.id),{status:item.status});
      setItems(rows=>rows.map(row=>row.id===item.id?{...row,seen_at:new Date().toISOString()}:row));
      setUnread(n=>Math.max(0,n-1));
      setSelected(prev=>prev?.id===item.id?{...prev,seen_at:new Date().toISOString()}:prev);
    } catch(e) {setError(errorText(e,"Could not mark this item read."));}
  }
  async function save() {
    if(!selected||saving)return;
    setSaving(true);setError("");
    try {
      await adminApi.put("/feedback/"+encodeURIComponent(selected.id),{status:draftStatus,owner_note:ownerNote});
      setSelected({...selected,status:draftStatus,owner_note:ownerNote,seen_at:selected.seen_at||new Date().toISOString()});
      await load();
    } catch(e) {setError(errorText(e,"Could not save changes."));}
    finally {setSaving(false);}
  }
  return <div className="space-y-4" data-testid="hq-feedback">
    <header className="flex flex-wrap justify-between gap-3 items-center">
      <div>
        <h2 className="font-display text-2xl font-bold" style={{color:GREEN}}>Feedback inbox</h2>
        <p className="text-sm text-stone-600 mt-1">Parent problems, ideas, suggestions and other feedback. Account details come from signed-in records.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-950" data-testid="hq-feedback-unread"><Bell size={14} className="inline mr-1"/>{unread} unread</span>
        <Button tone="plain" onClick={load} disabled={loading}><RefreshCw size={14} className="inline mr-1"/>Refresh</Button>
      </div>
    </header>
    <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-stone-200 p-4">
      <F label="Status"><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}} className="rounded-lg border border-stone-300 p-2 bg-white text-sm" data-testid="hq-feedback-status-filter">
        <option value="">All statuses</option>{STATUS.map(([id,label])=><option key={id} value={id}>{label}</option>)}
      </select></F>
      <F label="Category"><select value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}} className="rounded-lg border border-stone-300 p-2 bg-white text-sm" data-testid="hq-feedback-category-filter">
        <option value="">All categories</option>{Object.entries(LABEL).map(([id,label])=><option key={id} value={id}>{label}</option>)}
      </select></F>
    </div>
    {error&&<Alert>{error}</Alert>}
    <div className="grid lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.35fr)] gap-4 items-start">
      <section className="paper-card p-3 sm:p-4 space-y-2" aria-label="Feedback submissions">
        {loading&&items.length===0?<p className="text-sm p-4 text-stone-500">Loading inbox…</p>:null}
        {items.length===0&&!loading?<p className="text-sm p-4 text-stone-600">No submissions match these filters.</p>:null}
        {items.map(item=><button type="button" onClick={()=>openItem(item)} key={item.id} data-testid={"hq-feedback-item-"+item.id}
          className={"block w-full rounded-xl p-4 text-left border hover:border-emerald-600 transition "+(selected?.id===item.id?"border-emerald-800 bg-emerald-50":"border-stone-200 bg-white")}>
          <div className="flex gap-2 items-center justify-between"><span className="text-[11px] uppercase tracking-wider font-bold text-stone-600">{LABEL[item.category]||"Other"} · {item.status.replaceAll("_"," ")}</span>{!item.seen_at&&<span className="w-2.5 h-2.5 rounded-full bg-amber-600" aria-label="Unread"/>}</div>
          <div className="font-bold mt-1 text-sm text-stone-900 break-words">{item.subject}</div>
          <div className="text-xs text-stone-600 mt-1 truncate">{item.parent_name} · {item.parent_email}</div>
          <div className="text-xs text-stone-500 mt-1">{new Date(item.created_at).toLocaleString("en-AU")}</div>
        </button>)}
        <div className="flex justify-between items-center pt-2">
          <Button tone="plain" disabled={page===1||loading} onClick={()=>setPage(p=>p-1)}>Previous</Button>
          <span className="text-xs text-stone-500">Page {page}</span>
          <Button tone="plain" disabled={!more||loading} onClick={()=>setPage(p=>p+1)}>Next</Button>
        </div>
      </section>
      <section className="paper-card p-5 space-y-4" aria-label="Feedback details" data-testid="hq-feedback-detail">
        {!selected?<div className="py-12 text-sm text-stone-600 text-center"><Search size={24} className="mx-auto text-stone-400 mb-2"/>Choose a submission to see the details and account reference.</div>:
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><div className="text-xs font-bold uppercase tracking-wide text-emerald-800">{LABEL[selected.category]}</div><h3 className="font-display text-xl font-bold text-stone-900 mt-1 break-words">{selected.subject}</h3></div>
              <span className="text-xs rounded-full bg-stone-100 px-3 py-1 font-semibold">{selected.status.replaceAll("_"," ")}</span>
            </div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 space-y-2 text-xs">
              <p><strong>Parent:</strong> {selected.parent_name} ({selected.parent_email})</p>
              <p className="break-all"><strong>Parent account ID:</strong> <code>{selected.user_id}</code></p>
              <p className="break-all"><strong>Family/account ID:</strong> <code>{selected.family_id}</code></p>
              <p><strong>Jurisdiction:</strong> {selected.family_jurisdiction||"Not selected"}</p>
              <p><strong>Submitted:</strong> {new Date(selected.created_at).toLocaleString("en-AU")}</p>
              {selected.page_hint&&<p><strong>Page/feature:</strong> {selected.page_hint}</p>}
              <Link to={"/parent/command-centre/customers/"+encodeURIComponent(selected.family_id)} className="font-bold text-emerald-800 underline inline-flex gap-1 items-center" data-testid="hq-feedback-customer">Open family record <ArrowUpRight size={12}/></Link>
            </div>
            <div className="rounded-xl border border-stone-200 p-4 bg-white">
              <h4 className="text-xs font-bold text-stone-600 mb-2">Parent's message</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-stone-900">{selected.message}</p>
            </div>
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-950"><ShieldCheck size={16}/> Owner follow-up</h4>
              <F label="Progress"><select value={draftStatus} onChange={e=>setDraftStatus(e.target.value)} data-testid="hq-feedback-edit-status" className="border border-stone-300 rounded-lg bg-white p-2 text-sm w-full">
                {STATUS.map(([id,label])=><option key={id} value={id}>{label}</option>)}
              </select></F>
              <F label="Internal notes (only you can see these)"><textarea rows={4} maxLength={2000} value={ownerNote} onChange={e=>setOwnerNote(e.target.value)} data-testid="hq-feedback-owner-note" className="w-full rounded-xl border border-stone-300 p-3 text-sm" placeholder="Investigated, reproduction steps, fix PR, follow-up…"/></F>
              <p className="text-xs text-stone-500">The parent sees their submission and current status, never these internal notes. Updating a status does not send an email or direct reply.</p>
              <Button onClick={save} disabled={saving} data-testid="hq-feedback-save">{saving?"Saving…":"Save status and notes"}</Button>
            </div>
          </>}
      </section>
    </div>
  </div>;
}
