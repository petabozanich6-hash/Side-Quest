import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

/** A single calendar slot's Auto-Quest controls. Planning costs no AI and
 * creates no assignment; generation saves a draft; approval fills this exact slot. */
export default function CalendarSlotQuest({ event, onAssigned }) {
  const [proposal, setProposal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [stale, setStale] = useState(false);
  const [topic, setTopic] = useState("");

  const load = async () => {
    const [result, ls] = await Promise.all([
      api.get("/auto-quest/proposals", { params: { student_id: event.student_id, from: event.date, to: event.date } }),
      api.get("/lessons")
    ]);
    const current = (result.data?.proposals || []).find(p => p.calendar_event_id === event.id) || null;
    setProposal(current);
    setChoices((ls.data || []).filter(l => l.status === "ready"));
    setSelected(current?.lesson?.id || "");
    setReviewed(false);
    setStale(false);
  };
  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.all([
      api.get("/auto-quest/proposals", { params: { student_id: event.student_id, from: event.date, to: event.date } }),
      api.get("/lessons")
    ]).then(([r, ls]) => {
      if (!live) return;
      const p = (r.data?.proposals || []).find(x => x.calendar_event_id === event.id) || null;
      setProposal(p); setSelected(p?.lesson?.id || "");
      setChoices((ls.data || []).filter(l => l.status === "ready"));
    }).catch(() => { if (live) setStale(true); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [event.id, event.student_id, event.date]);

  const run = async (action) => {
    if (busy) return;
    setBusy(true);
    try {
      if (action === "plan") {
        const { data } = await api.post("/auto-quest/plan", {
          student_id: event.student_id, from: event.date, to: event.date
        });
        const p = (data.proposals || []).find(x => x.calendar_event_id === event.id);
        if (!p) throw new Error("This slot could not be planned. Check that it is a free timetable lesson slot.");
        setProposal(p); setSelected(p.lesson?.id || ""); setReviewed(false);
      } else if (action === "choose") {
        if (!selected) return;
        const { data } = await api.put(`/auto-quest/proposals/${proposal.id}/lesson`, { lesson_id: selected });
        setProposal(data); setReviewed(false);
      } else if (action === "generate") {
        const { data } = await api.post(`/auto-quest/proposals/${proposal.id}/generate`, topic ? { topic: topic.trim() } : {});
        setProposal(data); setSelected(data.lesson?.id || ""); setReviewed(false);
        toast.success("Draft created. Review it before assigning.");
      } else if (action === "reopen") {
        const { data } = await api.post(`/auto-quest/proposals/${proposal.id}/reopen`);
        setProposal(data); setSelected(data.lesson?.id || ""); setReviewed(false);
        toast.success("This timetable slot is ready for another quest.");
      } else if (action === "approve") {
        const draft = proposal.lesson?.status !== "ready";
        if (draft && !reviewed) { toast.error("Review the draft first."); return; }
        const { data } = await api.post(`/auto-quest/proposals/${proposal.id}/approve`,
          draft ? { confirm_reviewed: true } : {});
        if (data.status !== "assigned" || !data.assignment_id)
          throw new Error("The assignment was not confirmed. Refresh this slot before trying again.");
        toast.success("Lesson assigned to this timetable slot.");
        onAssigned();
      }
      setStale(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, err?.message || "Couldn't update this slot"));
      setStale(true);
    } finally { setBusy(false); }
  };
  const draft = proposal?.lesson && proposal.lesson.status !== "ready";
  const noCodes = proposal?.outcome_codes?.length === 0;
  const needsLanguage = noCodes && /^languages?\b/i.test(proposal?.learning_area || event.title);
  return <section className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 space-y-3" data-testid="slot-quest">
    <div>
      <h3 className="text-sm font-bold text-teal-950">⚔️ Turn this slot into a quest</h3>
      <p className="text-xs text-slate-600 mt-1">Plan a task for this child, subject and date. Nothing is assigned or generated until you choose. AI drafts use your normal allowance.</p>
    </div>
    {loading && <p className="text-sm">Checking this slot…</p>}
    {stale && <button type="button" onClick={() => { setBusy(true); load().catch(e=>toast.error(apiErrorMessage(e))).finally(()=>setBusy(false)); }}
      disabled={busy} className="text-sm underline" data-testid="slot-refresh">Refresh lesson options</button>}
    {!loading && !proposal && <button type="button" disabled={busy} onClick={() => run("plan")}
      className="rounded-full bg-teal-800 px-4 py-2 text-white text-sm disabled:opacity-50" data-testid="slot-plan">Plan a task for this slot</button>}
    {proposal && <div className="space-y-3 text-sm" data-testid="slot-proposal">
      <p><strong>{proposal.learning_area || event.title}</strong> · {event.date} {event.start_time || ""}</p>
      <p className="text-slate-700">{proposal.reason}</p>
      {proposal.outcome_codes?.length > 0 && <p className="text-xs text-slate-600">Learning outcomes: {proposal.outcome_codes.join(", ")}</p>}
      {proposal.status === "proposed" && !proposal.lesson && <button type="button" disabled={busy}
        onClick={() => run("plan")} className="text-xs underline disabled:opacity-50" data-testid="slot-replan">
        Replan this lesson idea
      </button>}
      {proposal.status !== "proposed" ? <div className="space-y-2">
        <p className="font-semibold text-teal-900">Status: {proposal.status}.</p>
        {(proposal.status === "rejected" || proposal.status === "assigned") &&
          <button type="button" disabled={busy} onClick={() => run("reopen")} className="rounded-full border border-teal-700 px-3 py-2 disabled:opacity-50" data-testid="slot-reopen">Plan another quest in this free slot</button>}
      </div> : <>
        {proposal.lesson && <p>Selected: <Link target="_blank" rel="noopener noreferrer" className="underline font-semibold" to={`/parent/lessons/${proposal.lesson.id}/edit`}>{proposal.lesson.title}</Link>{draft && <span className="ml-1 text-amber-800">(Draft)</span>}</p>}
        <label className="block font-semibold text-xs">Or choose a ready lesson from your library
          <select className="input mt-1" value={selected} onChange={e=>setSelected(e.target.value)} data-testid="slot-lesson">
            <option value="">Select a saved lesson…</option>
            {choices.map(l=><option key={l.id} value={l.id}>{l.title} · {l.learning_area}</option>)}
            {proposal.lesson && !choices.some(l=>l.id===proposal.lesson.id) && <option value={proposal.lesson.id}>{proposal.lesson.title} (draft)</option>}
          </select>
        </label>
        {selected && selected !== (proposal.lesson?.id || "") && <button type="button" disabled={busy} onClick={() => run("choose")}
          className="rounded-full border border-teal-700 px-3 py-2 disabled:opacity-50" data-testid="slot-choose">Use selected lesson</button>}
        {noCodes && !proposal.lesson && <label className="block text-xs font-semibold" data-testid="slot-uncoded">
          {needsLanguage ? "Which language and topic? (required — e.g. Latin greetings)" : "Optional lesson topic or focus"}
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} maxLength={140}
            placeholder={needsLanguage ? "Latin: greetings and introductions" : "What should this lesson focus on?"}
            className="input mt-1" data-testid="slot-topic" />
          <span className="block mt-1 font-normal text-slate-600">Subject-based draft only. No unverified outcome codes or coverage claims.</span>
        </label>}
        <div className="flex flex-wrap gap-2">
          {!proposal.lesson && proposal.action === "needs_generation" &&
            <button type="button" disabled={busy || (needsLanguage && !topic.trim())} onClick={() => run("generate")} className="rounded-full bg-teal-800 px-3 py-2 text-white disabled:opacity-50" data-testid="slot-generate">Generate an AI lesson draft</button>}
          <Link className="rounded-full border border-slate-400 px-3 py-2" target="_blank" rel="noopener noreferrer"
            to={`/parent/lessons/new?outcome=${encodeURIComponent(proposal.outcome_codes?.[0] || "")}`}>Build a lesson myself</Link>
        </div>
        {draft && <label className="flex gap-2 items-start text-xs">
          <input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} data-testid="slot-reviewed" />
          I've opened and reviewed this draft, including teaching content and answers.
        </label>}
        {proposal.lesson && <button type="button" disabled={busy || !!(selected && selected !== proposal.lesson.id) || (draft && !reviewed)}
          onClick={() => run("approve")} className="rounded-full bg-emerald-800 px-4 py-2 text-white disabled:opacity-50" data-testid="slot-approve">
          {busy ? "Working…" : "Approve and assign to this slot"}</button>}
        <p className="text-xs text-slate-600">Built a new lesson in another tab? Refresh lesson options, select it above and assign it here.</p>
        <button type="button" disabled={busy} onClick={()=>{ setBusy(true); load().catch(e=>toast.error(apiErrorMessage(e))).finally(()=>setBusy(false)); }}
          className="text-xs underline" data-testid="slot-reload">Refresh lesson options</button>
      </>}
    </div>}
  </section>;
}
