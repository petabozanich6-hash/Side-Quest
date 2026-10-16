import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api, apiErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { COMPASS_REVIEWED_ON, compassGuideFor, COMPASS_STEP_IDS } from "../../data/homeschoolCompass";
import { BookOpen, CalendarDays, CheckCircle2, Circle, ClipboardCheck, Compass, ExternalLink, FileCheck2, Info, MapPinned, ShieldCheck, Users, AlertTriangle, Save } from "lucide-react";

const STATUSES = [
  ["not_started", "Thinking about it"],
  ["preparing", "Preparing my application"],
  ["submitted", "Application submitted"],
  ["provisional", "Provisionally registered"],
  ["approved", "Approved / registered"],
  ["renewal_due", "Renewal underway"],
];
const EMPTY = { completed_steps: [], registration_status: "not_started", submitted_on: "", approved_on: "", expires_on: "", notes: "" };
const prettyDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T00:00:00Z"));
};
const lessMonths = (iso, months) => {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const base = new Date(Date.UTC(y, m - months - 1, 1));
  const max = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0)).getUTCDate();
  base.setUTCDate(Math.min(d, max));
  return base.toISOString().slice(0, 10);
};
const RowLink = ({ to, icon: Icon, label, desc }) => (
  <Link to={to} className="rounded-xl border border-stone-200 bg-white p-4 flex items-start gap-3 hover:border-emerald-700 hover:shadow-sm transition">
    <Icon size={20} className="text-emerald-800 shrink-0 mt-0.5" aria-hidden="true"/>
    <div><div className="text-sm font-bold text-emerald-950">{label}</div><div className="text-xs text-stone-600 mt-1 leading-relaxed">{desc}</div></div>
  </Link>
);
const External = ({ item }) => (
  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4 p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-700 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-emerald-700 transition" data-testid="compass-official-link">
    <div><span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{item.category}</span><div className="text-sm font-semibold text-stone-900 mt-1">{item.label}</div><div className="text-xs text-stone-500 mt-1 break-all">{new URL(item.url).hostname}</div></div>
    <ExternalLink size={17} className="mt-2 text-stone-500 shrink-0" aria-hidden="true"/><span className="sr-only">Opens official government source in a new tab</span>
  </a>
);

export default function HomeschoolCompass() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [jurisdiction, setJurisdiction] = useState(user?.jurisdiction || "");
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState({});
  const [studentId, setStudentId] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.all([api.get("/students"), api.get("/compass")]).then(([kids, tracker]) => {
      if (!live) return;
      const list = Array.isArray(kids.data) ? kids.data : [];
      const map = Object.fromEntries((tracker.data.progress || []).map(p => [p.student_id, p]));
      setStudents(list);
      setProgress(map);
      setJurisdiction(tracker.data.jurisdiction);
      const first = list[0]?.id || "";
      setStudentId(first);
      setForm(map[first] ? { ...map[first], submitted_on: map[first].submitted_on || "", approved_on: map[first].approved_on || "", expires_on: map[first].expires_on || "" } : { ...EMPTY });
      setDirty(false);
      setLoading(false);
    }).catch((err) => {
      if (!live) return;
      setLoadError(apiErrorMessage(err, "Could not load the Homeschooling Compass"));
      setLoading(false);
    });
    return () => { live = false; };
  }, [user?.jurisdiction]);

  const guide = compassGuideFor(jurisdiction);
  const currentStudent = students.find(s => s.id === studentId);
  const completed = form.completed_steps || [];
  const percentage = Math.round(completed.length / COMPASS_STEP_IDS.length * 100);
  const deadline = useMemo(() => jurisdiction === "ACT" && form.expires_on ? lessMonths(form.expires_on, 3) : null, [jurisdiction, form.expires_on]);
  const daysUntil = (iso) => iso ? Math.ceil((new Date(iso + "T00:00:00Z").getTime() - Date.now()) / 86400000) : null;
  const daysToExpiry = daysUntil(form.expires_on);
  const daysToActRenewal = daysUntil(deadline);

  const changeStudent = (id) => {
    if (dirty && !window.confirm("You have unsaved changes. Switch children without saving?")) return;
    setStudentId(id);
    const p = progress[id];
    setForm(p ? { ...p, submitted_on: p.submitted_on || "", approved_on: p.approved_on || "", expires_on: p.expires_on || "" } : { ...EMPTY });
    setDirty(false);
  };
  const patch = (newValues) => { setForm(v => ({ ...v, ...newValues })); setDirty(true); };
  const toggle = (id) => patch({ completed_steps: completed.includes(id) ? completed.filter(x => x !== id) : [...completed, id] });
  const save = async () => {
    if (!studentId || saving) return;
    setSaving(true);
    try {
      const { data } = await api.put("/compass/" + encodeURIComponent(studentId), {
        completed_steps: completed,
        registration_status: form.registration_status,
        submitted_on: form.submitted_on || null,
        approved_on: form.approved_on || null,
        expires_on: form.expires_on || null,
        notes: form.notes,
      });
      setProgress(prev => ({ ...prev, [studentId]: data }));
      setForm({ ...data, submitted_on: data.submitted_on || "", approved_on: data.approved_on || "", expires_on: data.expires_on || "" });
      setDirty(false);
      toast.success("Registration tracker saved for " + currentStudent.name);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save registration tracker"));
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-stone-600" data-testid="compass-loading">Loading your Homeschooling Compass…</div>;
  if (loadError) return <div className="p-4 sm:p-8"><div className="paper-card p-6"><h1 className="font-display text-2xl font-bold text-stone-900">Homeschooling Compass</h1><p role="alert" className="mt-3 text-sm text-rose-800">{loadError}</p><Link to="/parent/curriculum" className="mt-4 inline-block font-semibold underline text-emerald-800">Choose your state or territory in Curriculum</Link></div></div>;
  if (!guide) return <div className="p-4 sm:p-8"><h1 className="font-display text-3xl font-bold">Homeschooling Compass</h1><p className="mt-3 text-stone-700">Choose your state or territory to get the right registration guide.</p><Link to="/parent/curriculum" className="mt-4 inline-block underline font-semibold text-emerald-800">Set your state or territory</Link></div>;

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="homeschool-compass">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800"><Compass size={16}/> Side-Quest · parent hub</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold" style={{color:"#1F3B2D"}}>Homeschooling Compass</h1>
        <p className="text-sm sm:text-base leading-relaxed text-stone-700 max-w-3xl">A clearer route through registration, educational plans and ongoing requirements. The guidance and links below are tailored to your family's state or territory.</p>
      </header>

      <section className="paper-card p-5 sm:p-6 space-y-3" aria-label="State-specific guide">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex gap-2 items-center font-bold text-emerald-900 text-sm"><MapPinned size={17}/> Your state or territory · {jurisdiction}</span>
          <Link to="/parent/curriculum" className="text-xs font-semibold text-emerald-800 underline">Moved interstate? Change it in Curriculum</Link>
        </div>
        <h2 className="font-display text-2xl font-bold text-emerald-950">{guide.name}</h2>
        <p className="text-xs font-semibold text-stone-600">Registration authority: {guide.authority}</p>
        <p className="text-sm text-stone-700 leading-relaxed">{guide.summary}</p>
        <div className="flex items-start gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-950" data-testid="compass-attendance-warning"><AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true"/><span><strong>Before withdrawing from school:</strong> {guide.beforeLeavingSchool}</span></div>
        <div className="text-xs text-stone-500"><ShieldCheck size={13} className="inline mr-1"/> Official sources checked {prettyDate(COMPASS_REVIEWED_ON)}. Requirements can change; confirm with the authority before applying.</div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <section className="paper-card p-5 sm:p-6 space-y-5" aria-labelledby="compass-progress-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 id="compass-progress-heading" className="font-display text-xl sm:text-2xl font-bold text-emerald-950">Your registration journey</h2><p className="mt-1 text-xs text-stone-600">This checklist is private to your family, and progress is tracked separately for each child.</p></div>
              {students.length > 0 && <label className="text-xs font-bold text-stone-700">Child
                <select value={studentId} onChange={e => changeStudent(e.target.value)} className="mt-1 block rounded-xl border border-stone-300 p-2.5 bg-white text-sm text-stone-900 w-48 max-w-full" data-testid="compass-select-child">
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>}
            </div>
            {students.length === 0 ? <div className="rounded-xl border-2 border-dashed border-stone-200 p-6 text-center"><Users size={25} className="mx-auto text-stone-400"/><p className="mt-2 text-sm text-stone-700">Add a child to save their registration progress.</p><Link to="/parent/children" className="mt-3 inline-block rounded-full bg-emerald-950 text-white text-sm font-bold px-5 py-2.5">Add a child</Link></div> : <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold"><span>{completed.length} of {COMPASS_STEP_IDS.length} steps checked off for {currentStudent?.name}</span><span>{percentage}%</span></div>
                <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden" role="progressbar" aria-label="Registration checklist progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><div className="h-full bg-emerald-700 rounded-full transition-all" style={{width: percentage+"%"}}/></div>
              </div>
              <ol className="space-y-3">
                {guide.steps.map((step, i) => <li key={step.id} className="rounded-xl border border-stone-200 bg-white p-4">
                  <label className="flex gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-800" checked={completed.includes(step.id)} onChange={() => toggle(step.id)} data-testid={"compass-step-"+step.id} aria-label={"Mark "+step.title+" complete"}/>
                    <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-semibold text-stone-900 text-sm">{completed.includes(step.id) ? <CheckCircle2 size={16} className="text-emerald-700"/> : <Circle size={16} className="text-stone-400"/>}{i+1}. {step.title}</span><span className="block mt-2 text-sm leading-relaxed text-stone-600">{step.detail}</span></span>
                  </label>
                  {(step.id === "program" || step.id === "apply" || step.id === "maintain") && <div className="mt-3 ml-7 text-xs">
                    {step.id === "program" ? <Link to="/parent/learning-plans" className="font-semibold text-emerald-800 underline">Open Side-Quest learning plans</Link> : step.id === "apply" ? <a href={(guide.links.find(l=>l.category==="Apply") || guide.links[0]).url} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-800 underline">Open official application <ExternalLink size={12} className="inline"/></a> : <Link to="/parent/evidence" className="font-semibold text-emerald-800 underline">Open Evidence Backpack</Link>}
                  </div>}
                </li>)}
              </ol>
              <div className="border-t border-stone-200 pt-4 space-y-4">
                <h3 className="font-display text-lg font-bold text-emerald-950">Track your registration</h3>
                <label className="block text-sm font-bold text-stone-700">Current status
                  <select value={form.registration_status} onChange={e => patch({registration_status: e.target.value})} className="block mt-1 w-full border border-stone-300 rounded-xl bg-white px-3 py-2 text-sm" data-testid="compass-status">
                    {STATUSES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                  </select>
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[["submitted_on", "Application sent"], ["approved_on", "Approval / registration"], ["expires_on", "Registration expires"]].map(([key, title]) => <label key={key} className="block text-xs font-bold text-stone-700">{title}
                    <input type="date" value={form[key]} onChange={e => patch({[key]: e.target.value})} className="mt-1 block w-full text-sm p-2.5 border border-stone-300 rounded-xl bg-white" data-testid={"compass-"+key}/>
                  </label>)}
                </div>
                <label className="block text-xs font-bold text-stone-700">Personal planning notes (optional)
                  <textarea value={form.notes || ""} maxLength={1000} rows={2} onChange={e => patch({notes: e.target.value})} placeholder="e.g. follow up with the home education office next week" className="block mt-1 p-3 border border-stone-300 rounded-xl text-sm w-full resize-y" data-testid="compass-notes"/>
                </label>
                <p className="text-xs text-stone-500">Don't enter birth certificates, addresses, court details or other sensitive government documents here. These dates and statuses are your own records, not government verification.</p>
                <button type="button" onClick={save} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-full bg-emerald-950 text-white px-5 py-2.5 text-sm font-bold disabled:opacity-50" data-testid="compass-save"><Save size={16}/>{saving ? "Saving…" : dirty ? "Save changes" : "All changes saved"}</button>
              </div>
            </>}
          </section>
          <section className="paper-card p-5 sm:p-6 space-y-3">
            <h2 className="font-display text-xl font-bold text-emerald-950">Official {guide.name} links</h2>
            <p className="text-sm text-stone-600">Open the actual registration pages, forms and planning requirements. Side-Quest never submits an application for you.</p>
            <div className="grid sm:grid-cols-2 gap-3">{guide.links.map(l => <External key={l.url} item={l}/>)}</div>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="paper-card p-5 space-y-3">
            <h2 className="font-display text-lg font-bold text-emerald-950">Have these ready</h2>
            <ul className="space-y-3">{guide.whatToPrepare.map(item => <li key={item} className="text-sm text-stone-700 flex gap-2 items-start"><ClipboardCheck size={17} className="text-emerald-700 shrink-0 mt-0.5"/>{item}</li>)}</ul>
            <p className="text-xs text-stone-500">Check the linked application guide for exact forms and acceptable documents.</p>
          </section>
          <section className="paper-card p-5 space-y-3" data-testid="compass-renewals">
            <div className="flex items-center gap-2"><CalendarDays size={19} className="text-emerald-800"/><h2 className="font-display text-lg font-bold text-emerald-950">Renewals & follow-ups</h2></div>
            <p className="text-sm text-stone-700 leading-relaxed">{guide.renewal}</p>
            {form.expires_on && <div className={"rounded-xl p-3 text-sm "+(daysToExpiry !== null && daysToExpiry < 91 ? "border border-amber-200 bg-amber-50 text-amber-950" : "border border-stone-200 bg-stone-50 text-stone-800")}>
              <strong>Entered expiry:</strong> {prettyDate(form.expires_on)}
              {daysToExpiry !== null && daysToExpiry < 0 ? <p className="mt-1 font-bold">This date has passed. Check your registration status now.</p> : daysToExpiry !== null && daysToExpiry <= 90 ? <p className="mt-1">Expiry is {daysToExpiry} days away. Check your state's renewal guidance.</p> : null}
            </div>}
            {deadline && <div className={"rounded-xl p-3 text-sm "+(daysToActRenewal !== null && daysToActRenewal <= 30 ? "bg-amber-50 border border-amber-200 text-amber-950" : "bg-stone-50 border border-stone-200 text-stone-800")}>
              <strong>ACT renewal deadline:</strong> {prettyDate(deadline)} (three months before your entered expiry).
              {daysToActRenewal !== null && daysToActRenewal < 0 && <p className="mt-1 font-bold">This deadline has passed. Contact the ACT Home Education team.</p>}
            </div>}
            <p className="text-xs text-stone-500 flex gap-1.5"><Info size={14} className="shrink-0 mt-0.5"/>These are on-screen reminders calculated from your entered dates, not automatic emails or official deadline confirmations.</p>
          </section>
          <section className="paper-card p-5 space-y-3">
            <h2 className="font-display text-lg font-bold text-emerald-950">Your Side-Quest toolkit</h2>
            <div className="space-y-2">
              <RowLink to="/parent/learning-plans" icon={BookOpen} label="Learning plans" desc="Draft and organise your child's program for your state's framework."/>
              <RowLink to="/parent/evidence" icon={FileCheck2} label="Evidence Backpack" desc="Find work samples, reviewed lessons and other evidence."/>
              <RowLink to="/parent/reading-log" icon={BookOpen} label="Reading log" desc="Keep track of reading and learning over time."/>
              <RowLink to="/parent/calendar" icon={CalendarDays} label="Family calendar" desc="Record important dates and preparation tasks."/>
            </div>
          </section>
        </aside>
      </div>
      <p className="text-xs text-stone-500 leading-relaxed flex items-start gap-2"><ShieldCheck size={16} className="shrink-0"/>Side-Quest provides organisational guidance, not a legal determination or government registration service. Always follow your regulator's current instructions, especially before withdrawing a child from school.</p>
    </div>
  );
}
