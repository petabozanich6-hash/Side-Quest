import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";
import { Lightbulb, MessageSquare, Send, ShieldCheck, Bug, ClipboardList, ChevronDown, Mail } from "lucide-react";

const CATEGORIES = [
  { id: "problem", title: "Report a problem", desc: "Something isn't working as expected.", Icon: Bug },
  { id: "idea", title: "Suggest an idea", desc: "Something you'd love Side-Quest to do.", Icon: Lightbulb },
  { id: "feedback", title: "Give feedback", desc: "Tell us what's great or needs changing.", Icon: MessageSquare },
  { id: "other", title: "Something else", desc: "Anything else you'd like us to know.", Icon: ClipboardList },
];
const STATUS = { new: "Received", reviewing: "Under review", in_progress: "Being worked on", resolved: "Resolved", closed: "Closed" };

export default function ParentFeedback() {
  const [params, setParams] = useSearchParams();
  const [expandedId,setExpandedId] = useState("");
  const [category, setCategory] = useState("problem");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pageHint, setPageHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(null);
  const load = () => api.get("/feedback").then(({data}) => setReports(data.reports || [])).catch((e) => setError(apiErrorMessage(e, "Could not load your submissions")));
  const openThread = async (id) => {
    if (expandedId===id) { setExpandedId(""); return; }
    setExpandedId(id);
    if (params.get("thread")!==id) setParams(prev=>{const next=new URLSearchParams(prev);next.set("thread",id);return next;},{replace:true});
    try {
      await api.post("/feedback/"+encodeURIComponent(id)+"/replies/read",{});
      setReports(prev=>prev.map(r=>r.id===id?{...r,unread_replies:0,replies:(r.replies||[]).map(m=>({...m,read_at:m.read_at||new Date().toISOString()}))}:r));
      window.dispatchEvent(new Event("sidequest-feedback-replies-updated"));
    } catch (e) { setError(apiErrorMessage(e,"Could not mark the reply read")); }
  };
  useEffect(() => { load(); }, []);
  // Opening a reply from the dashboard/email should land on the actual
  // response, not at the long feedback submission form above the history.
  useEffect(() => {
    if (!expandedId) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById("feedback-thread-" + expandedId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [expandedId]);
  useEffect(() => { const thread=params.get("thread"); if(thread && reports.some(r=>r.id===thread) && expandedId!==thread) openThread(thread); },[reports.length,params.get("thread")]);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const { data } = await api.post("/feedback", { category, subject: subject.trim(), message: message.trim(), page_hint: pageHint.trim() });
      setSent(data.id); setSubject(""); setMessage(""); setPageHint("");setExpandedId(data.id);
      toast.success("Sent to the Side-Quest team");
      await load();
    } catch (err) {
      const text = apiErrorMessage(err, "Could not send your message");
      setError(text); toast.error(text);
    } finally { setBusy(false); }
  };
  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-5xl space-y-6" data-testid="parent-feedback">
      <header>
        <span className="text-xs uppercase tracking-widest font-bold text-emerald-800 flex items-center gap-2"><MessageSquare size={15}/> Parent Hub · Your voice matters</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2" style={{color:"#1F3B2D"}}>Ideas, feedback & problems</h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
          Found a bug? Have a brilliant idea? Or just something you'd like to tell us? Send it straight to the Side-Quest team — no need to hunt for an email address.
        </p>
      </header>
      <section className="paper-card p-5 sm:p-7 space-y-5">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2 text-sm text-emerald-950">
          <ShieldCheck size={18} className="shrink-0 mt-0.5" aria-hidden="true"/>
          <p>Your signed-in account and family identifiers are attached automatically, so we can investigate without asking you to find an account number. Please don't include passwords, PINs, payment details or children's private documents.</p>
        </div>
        <form onSubmit={submit} className="space-y-5" data-testid="parent-feedback-form">
          <fieldset>
            <legend className="font-bold text-sm text-stone-800 mb-3">What would you like to send?</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map(({id,title,desc,Icon})=><label key={id} className={"flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition "+(category===id?"border-emerald-800 bg-emerald-50":"border-stone-200 hover:border-stone-400 bg-white")}>
                <input type="radio" value={id} name="feedback-category" className="sr-only" checked={category===id} onChange={()=>setCategory(id)} data-testid={"feedback-category-"+id}/>
                <Icon size={19} className="shrink-0 mt-0.5 text-emerald-800" aria-hidden="true"/>
                <span className="flex-1"><span className="font-bold block text-sm text-stone-900">{title}</span><span className="text-xs text-stone-600 block mt-1">{desc}</span></span>
                <span aria-hidden="true" className={"h-4 w-4 shrink-0 rounded-full border-2 "+(category===id?"border-emerald-800 bg-emerald-800":"border-stone-400")}/>
              </label>)}
            </div>
          </fieldset>
          <label className="block text-sm font-bold text-stone-800">Short title <span className="text-rose-700">*</span>
            <input required minLength={4} maxLength={120} value={subject} onChange={e=>setSubject(e.target.value)} className="mt-1 block w-full rounded-xl border border-stone-300 p-3 text-sm font-normal bg-white focus:outline-emerald-700" placeholder="e.g. My lesson won't save" data-testid="feedback-subject"/>
          </label>
          <label className="block text-sm font-bold text-stone-800">Tell us a bit more <span className="text-rose-700">*</span>
            <textarea required minLength={10} maxLength={4000} rows={6} value={message} onChange={e=>setMessage(e.target.value)} className="mt-1 block w-full rounded-xl border border-stone-300 p-3 text-sm font-normal bg-white focus:outline-emerald-700" placeholder="What happened, what did you expect, or how would your idea help? You're welcome to just tell us in your own words." data-testid="feedback-message"/>
            <span className="block mt-1 text-right text-xs text-stone-500 font-normal">{message.length}/4000</span>
          </label>
          <label className="block text-sm font-bold text-stone-800">Which page or feature? <span className="font-normal text-stone-500">(optional)</span>
            <input maxLength={160} value={pageHint} onChange={e=>setPageHint(e.target.value)} className="mt-1 block w-full rounded-xl border border-stone-300 p-3 text-sm font-normal bg-white focus:outline-emerald-700" placeholder="e.g. lesson builder, child's room, timetable" data-testid="feedback-page"/>
          </label>
          {error && <p className="rounded-lg p-3 text-sm bg-rose-50 text-rose-900" role="alert">{error}</p>}
          {sent && <p className="rounded-lg p-3 text-sm bg-emerald-50 text-emerald-950" role="status" data-testid="feedback-success">Your message is in the Owner HQ inbox. Reference: <code>{sent}</code></p>}
          <button type="submit" disabled={busy || subject.trim().length < 4 || message.trim().length < 10} className="rounded-full bg-emerald-950 text-white font-bold text-sm px-6 py-3 inline-flex items-center gap-2 disabled:opacity-50" data-testid="feedback-submit"><Send size={16}/>{busy?"Sending…":"Send to Side-Quest"}</button>
        </form>
      </section>
      <section className="paper-card p-5 sm:p-6 space-y-3" data-testid="parent-feedback-history">
        <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Messages you've sent</h2>
        <p className="text-xs text-stone-500">Only messages sent from your parent account appear here. I can reply to your messages here. Replies are private to the parent account that sent them; you can come back and read them any time.</p>
        {reports.length===0?<p className="text-sm text-stone-600 py-3">Nothing here yet. Your first idea could be a good one!</p>:
          <div className="space-y-2">{reports.map(r=><div key={r.id} className={"rounded-xl border bg-white p-4 "+(r.unread_replies>0?"border-amber-400":"border-stone-200")} data-testid={"parent-feedback-"+r.id}>
            <div className="flex flex-wrap gap-2 items-center justify-between"><h3 className="text-sm font-bold text-stone-900">{r.subject}</h3><div className="flex items-center gap-2">{r.unread_replies>0&&<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950" data-testid={"parent-feedback-unread-"+r.id}>{r.unread_replies} new {r.unread_replies===1?"reply":"replies"}</span>}<span className="text-xs rounded-full bg-stone-100 px-3 py-1 font-semibold text-stone-700">{STATUS[r.status]||"Received"}</span></div></div>
            <p className="text-xs text-stone-500 capitalize mt-1">{r.category} · {new Date(r.created_at).toLocaleDateString("en-AU")}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap break-words text-stone-700">{r.message}</p>
            <button type="button" onClick={()=>openThread(r.id)} className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-900 underline underline-offset-2" aria-expanded={expandedId===r.id} data-testid={"parent-feedback-toggle-"+r.id}><Mail size={15}/>{r.replies?.length?("Side-Quest replies ("+r.replies.length+")"):"Reply updates"}<ChevronDown size={14} className={expandedId===r.id?"rotate-180":""}/></button>
            {expandedId===r.id&&<div id={"feedback-thread-"+r.id} className="mt-3 space-y-3 border-t border-stone-200 pt-3 scroll-mt-24" role="region" aria-label={"Side-Quest replies about "+r.subject} data-testid={"parent-feedback-thread-"+r.id}>{!r.replies?.length?<p className="text-xs text-stone-500">No replies yet. You'll see my Side-Quest HQ replies here.</p>:(r.replies||[]).map(m=><div key={m.id} className="rounded-xl bg-emerald-50 border border-emerald-200 p-4"><div className="text-xs font-bold text-emerald-950">Side-Quest HQ · {new Date(m.created_at).toLocaleString("en-AU")}</div><p className="text-sm mt-2 whitespace-pre-wrap break-words text-stone-800">{m.body}</p></div>)}</div>}
          </div>)}</div>}
        <p className="text-xs text-stone-500">For account and privacy policies, visit <Link to="/parent/trust" className="underline font-semibold">Trust & Support</Link>.</p>
      </section>
    </div>
  );
}
