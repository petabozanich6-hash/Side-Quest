import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, CheckCircle2, ChevronRight, Compass, Info, ShieldAlert } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { compassRegistrationSummary } from "../../lib/compassProgress";
import { compassGuideFor } from "../../data/homeschoolCompass";

const COLOURS = {
  red: "border-rose-300 bg-rose-50 text-rose-900",
  amber: "border-amber-300 bg-amber-50 text-amber-950",
  green: "border-emerald-300 bg-emerald-50 text-emerald-950",
  neutral: "border-stone-200 bg-stone-50 text-stone-800",
};

export default function ChildRegistrationPanel({ studentId, studentName }) {
  const [record, setRecord] = useState(null);
  const [jurisdiction, setJurisdiction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    api.get("/compass").then(({ data }) => {
      if (!mounted) return;
      setJurisdiction(data.jurisdiction);
      setRecord((data.progress || []).find(p => p.student_id === studentId) || null);
      setLoading(false);
    }).catch(err => {
      if (!mounted) return;
      setError(apiErrorMessage(err, "Could not load registration details"));
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [studentId]);

  const summary = compassRegistrationSummary(record, jurisdiction);
  const guide = compassGuideFor(jurisdiction);
  const link = "/parent/homeschool-compass?child=" + encodeURIComponent(studentId);

  return (
    <section className="paper-card p-5 sm:p-6 space-y-4" aria-labelledby="registration-panel-title" data-testid="child-registration-panel">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800"><Compass size={15}/> Homeschooling Compass</div>
          <h2 id="registration-panel-title" className="font-display text-xl font-bold mt-1" style={{ color: "#1F3B2D" }}>Home education registration</h2>
          <p className="text-xs text-stone-600 mt-1">Registration details and renewal reminders for {studentName || "this child"}.</p>
        </div>
        <Link to={link} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold text-white hover:opacity-90" style={{backgroundColor:"#1F3B2D"}} data-testid="child-registration-edit">
          {record ? "View or update" : "Set up registration"} <ChevronRight size={15}/>
        </Link>
      </div>

      {loading ? <p className="text-sm text-stone-500">Checking the saved Compass details…</p> :
        error ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="alert">
          Unable to show saved registration details: {error}. <Link to={link} className="underline font-semibold">Open the Compass</Link>.
        </div> :
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500">Registration status</p>
              <p className="font-bold text-sm text-stone-900 mt-1" data-testid="child-registration-status">{summary.label}</p>
              <p className="text-xs text-stone-500 mt-1">{jurisdiction || "State not selected"}</p>
            </div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500">Approved / commenced</p>
              <p className="font-bold text-sm text-stone-900 mt-1" data-testid="child-registration-approved">{summary.approvedDate || "Not recorded"}</p>
              <p className="text-xs text-stone-500 mt-1">Parent-entered date</p>
            </div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3">
              <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500">Expiry date</p>
              <p className="font-bold text-sm text-stone-900 mt-1" data-testid="child-registration-expiry">{summary.expiryDate || "Not recorded"}</p>
              <p className="text-xs text-stone-500 mt-1">{summary.expiryDays !== null && summary.expiryDays >= 0 ? summary.expiryDays === 0 ? "Expires today" : summary.expiryDays + " days remaining" : "From your official registration notice"}</p>
            </div>
          </div>
          {summary.reminder && <div className={"flex gap-2 items-start rounded-xl border p-3 text-sm " + COLOURS[summary.tone]} role="status" data-testid="child-registration-reminder" aria-live="polite">
            {summary.tone === "red" || summary.tone === "amber" ? <ShieldAlert size={19} className="shrink-0 mt-0.5" aria-hidden="true"/> : summary.tone === "green" ? <CheckCircle2 size={19} className="shrink-0 mt-0.5" aria-hidden="true"/> : <Info size={19} className="shrink-0 mt-0.5" aria-hidden="true"/>}
            <span>{summary.reminder}</span>
          </div>}
          {summary.renewalDeadline && <div className="rounded-xl border border-stone-200 bg-white p-3 flex gap-2 text-sm text-stone-800" data-testid="child-registration-act-deadline">
            <CalendarClock size={18} className="shrink-0 text-emerald-800" aria-hidden="true"/>
            <span><strong>ACT renewal submission deadline:</strong> {summary.renewalDeadline}. Based on your recorded expiry date and the ACT's three-calendar-month rule.</span>
          </div>}
          {guide?.renewal && <div className="rounded-xl border border-stone-200 bg-white p-3 text-sm text-stone-700" data-testid="child-registration-state-guidance"><p className="font-bold text-emerald-950 text-xs uppercase tracking-wide mb-1">{guide.name}: ongoing requirements</p><p className="leading-relaxed">{guide.renewal}</p></div>}
          <p className="text-xs text-stone-500">All statuses and dates are reported by the parent and are not verified by the government. Reminders appear on-screen only. For official renewal requirements, open the <Link to={link} className="font-semibold underline text-emerald-800">Homeschooling Compass</Link>.</p>
        </>}
    </section>
  );
}
