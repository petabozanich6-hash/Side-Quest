import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { ShieldAlert, AlertTriangle, Info, Printer, FileCheck } from "lucide-react";

const sevIcon = (s) => s === "high" ? AlertTriangle : s === "medium" ? ShieldAlert : Info;
const sevCls = (s) => s === "high" ? "bg-rose-50 text-rose-900 border-rose-200" : s === "medium" ? "bg-amber-50 text-amber-900 border-amber-200" : "bg-slate-50 text-slate-700 border-slate-200";

const CORE = ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"];
const GUIDE_SAMPLES = 3;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dstr = (d) => (d ? String(d).slice(0, 10) : "");
const inRange = (d, a, b) => { const x = dstr(d); return !!x && x >= a && x <= b; };

const normArea = (a) => {
  const t = (a || "").toLowerCase();
  if (!t) return "Other";
  if (t.includes("english")) return "English";
  if (t.includes("math")) return "Mathematics";
  if (t.includes("science")) return "Science and Technology";
  if (t.includes("hsie") || t.includes("human society") || t.includes("history") || t.includes("geograph")) return "HSIE";
  if (t.includes("creative") || t.includes("visual") || t.includes("music") || t.includes("drama") || t.includes("dance")) return "Creative Arts";
  if (t.includes("pdhpe") || t.includes("personal dev") || t.includes("health")) return "PDHPE";
  if (t.includes("language")) return "Languages";
  if (t.includes("tas") || t.includes("applied")) return "TAS";
  return a;
};

const safe = (p) => p.catch(() => ({ data: [] }));

function PackTab() {
  const today = new Date().toISOString().slice(0, 10);
  const ninety = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const [students, setStudents] = useState([]);
  const [sid, setSid] = useState("");
  const [start, setStart] = useState(ninety);
  const [end, setEnd] = useState(today);
  const [notes, setNotes] = useState("");
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/students").then((r) => { setStudents(r.data); if (r.data[0]) setSid(r.data[0].id); });
  }, []);

  useEffect(() => {
    if (!sid) return;
    setLoading(true);
    Promise.all([
      safe(api.get("/submissions")),
      safe(api.get("/life-evidence")),
      safe(api.get(`/reading-log?student_id=${sid}`)),
      safe(api.get(`/learning-plans?student_id=${sid}`)),
    ]).then(([sub, life, read, plans]) => setRaw({ sub: sub.data || [], life: life.data || [], read: read.data || [], plans: plans.data || [] }))
      .finally(() => setLoading(false));
  }, [sid]);

  const student = students.find((s) => s.id === sid);

  const pack = useMemo(() => {
    if (!raw) return null;
    const mine = (x) => (x.student_id || x.student?.id) === sid;
    const samples = [];
    raw.sub.filter((s) => mine(s) && ["accepted", "demonstrated"].includes(s.status) && inRange(s.reviewed_at, start, end)).forEach((s) => {
      const codes = (s.outcome_mappings || []).filter((m) => m.accepted).map((m) => m.code).filter(Boolean);
      samples.push({ date: dstr(s.reviewed_at), kind: "Lesson", title: s.lesson?.title || "Lesson", areas: [normArea(s.lesson?.learning_area)], codes, minutes: 0 });
    });
    raw.life.filter((i) => mine(i) && ["accepted", "demonstrated"].includes(i.status) && inRange(i.date, start, end)).forEach((i) => {
      const maps = i.accepted_mappings || [];
      const areas = [...new Set(maps.map((m) => normArea(m.learning_area)))];
      samples.push({ date: dstr(i.date), kind: "Life learning", title: i.title, areas: areas.length ? areas : ["Other"], codes: maps.map((m) => m.code).filter(Boolean), minutes: Number(i.duration_minutes) || 0, location: i.location, files: (i.file_ids || i.files || []).length });
    });
    samples.sort((a, b) => a.date.localeCompare(b.date));

    const reading = raw.read.filter((r) => inRange(r.read_date, start, end)).sort((a, b) => a.read_date.localeCompare(b.read_date));
    const readMinutes = reading.reduce((n, r) => n + (Number(r.duration_minutes) || 0), 0);
    const lifeMinutes = samples.reduce((n, s) => n + s.minutes, 0);

    const plan = raw.plans.filter((p) => p.period_start <= end && p.period_end >= start && p.ai_content)[0] || null;
    const plannedByArea = {};
    (plan?.ai_content?.learning_areas || []).forEach((la) => { plannedByArea[normArea(la.area)] = la.indicative_outcome_codes || []; });

    const extra = [...new Set(samples.flatMap((s) => s.areas))].filter((a) => !CORE.includes(a));
    const areas = [...CORE, ...Object.keys(plannedByArea).filter((a) => !CORE.includes(a) && !extra.includes(a)), ...extra];
    const coverage = areas.map((area) => {
      const own = samples.filter((s) => s.areas.includes(area));
      const lessons = own.filter((s) => s.kind === "Lesson").length;
      const life = own.length - lessons;
      const evidenced = [...new Set(own.flatMap((s) => s.codes))];
      const planned = plannedByArea[area] || [];
      const missing = planned.filter((c) => !evidenced.includes(c));
      const n = own.length + (area === "English" && reading.length ? 1 : 0);
      const status = own.length >= GUIDE_SAMPLES ? "Good" : own.length > 0 ? "Thin" : "None";
      return { area, lessons, life, samples: own.length, evidenced, planned, missing, status, n };
    });

    const lessonTitles = [...new Set(samples.filter((s) => s.kind === "Lesson").map((s) => s.title))];
    return { samples, reading, readMinutes, lifeMinutes, plan, coverage, lessonTitles };
  }, [raw, sid, start, end]);

  const printPack = () => {
    if (!pack || !student) return;
    const w = window.open("", "_blank");
    const css = `body{font-family:Georgia,serif;max-width:860px;margin:36px auto;padding:0 24px;color:#222;line-height:1.5;font-size:13px}h1{font-size:26px;margin-bottom:2px}h2{font-size:16px;margin-top:26px;border-bottom:1px solid #bbb;padding-bottom:3px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #ccc;padding:5px 7px;text-align:left;font-size:11.5px;vertical-align:top}th{background:#f5efe0}.meta{color:#555}.sig{margin-top:40px;display:flex;gap:40px}.sig div{flex:1;border-top:1px solid #222;padding-top:4px;font-size:11px}.pb{page-break-before:always}`;
    const covRows = pack.coverage.map((c) => `<tr><td><strong>${esc(c.area)}</strong></td><td>${c.lessons}</td><td>${c.life}</td><td>${esc(c.planned.join(", ") || "-")}</td><td>${esc(c.evidenced.join(", ") || "-")}</td><td>${esc(c.missing.join(", ") || (c.planned.length ? "All evidenced" : "-"))}</td></tr>`).join("");
    const logRows = pack.samples.map((s) => `<tr><td>${esc(s.date)}</td><td>${esc(s.kind)}</td><td>${esc(s.title)}${s.location ? ` (${esc(s.location)})` : ""}</td><td>${esc(s.areas.join(", "))}</td><td>${esc(s.codes.join(", ") || "-")}</td></tr>`).join("");
    const readRows = pack.reading.map((r) => `<tr><td>${esc(r.read_date)}</td><td>${esc(r.title)}${r.author ? ` - ${esc(r.author)}` : ""}${r.verified_by_parent ? " (verified by parent)" : ""}</td><td>${esc(r.book_type)}</td><td>${esc((r.reading_mode || "").replace(/_/g, " "))}</td><td>${esc(r.duration_minutes || "")}</td></tr>`).join("");
    const reflection = pack.coverage.map((c) => `<p><strong>${esc(c.area)}:</strong> ${c.samples} dated sample${c.samples === 1 ? "" : "s"} (${c.lessons} lesson${c.lessons === 1 ? "" : "s"}, ${c.life} life-learning). ${c.evidenced.length ? `Outcomes evidenced: ${esc(c.evidenced.join(", "))}.` : "No outcomes evidenced in this period."} ${c.status !== "Good" ? "More evidence is planned for the next period." : ""}</p>`).join("");
    const planLine = pack.plan ? `${esc(pack.plan.title)} (${esc(pack.plan.period_start)} to ${esc(pack.plan.period_end)})` : "No learning plan recorded for this period";
    const html = `<html><head><title>AP Visit Pack - ${esc(student.name)}</title><style>${css}</style></head><body>
<h1>Home Schooling Evidence Pack</h1><p class="meta">Prepared for the Authorised Person visit</p>
<table><tr><th>Student</th><td>${esc(student.name)}</td><th>Stage</th><td>${esc(student.stage || "")}</td></tr><tr><th>Period covered</th><td>${esc(start)} to ${esc(end)}</td><th>Learning plan</th><td>${planLine}</td></tr></table>
<h2>1. Summary</h2><p>${pack.samples.length} dated work samples and activities, ${pack.reading.length} reading entries (${pack.readMinutes} minutes) and ${pack.lifeMinutes} minutes of recorded life learning in this period.</p>
<h2>2. Planned versus evidenced by learning area</h2><table><tr><th>Learning area</th><th>Lessons</th><th>Life learning</th><th>Planned outcomes</th><th>Outcomes evidenced</th><th>Not yet evidenced</th></tr>${covRows}</table>
<h2>3. Learning log</h2><table><tr><th>Date</th><th>Type</th><th>Activity</th><th>Learning area</th><th>Outcomes</th></tr>${logRows || "<tr><td colspan=5>No entries in this period.</td></tr>"}</table>
<h2 class="pb">4. Reading log</h2><table><tr><th>Date</th><th>Book</th><th>Type</th><th>Mode</th><th>Minutes</th></tr>${readRows || "<tr><td colspan=5>No reading entries in this period.</td></tr>"}</table>
<h2>5. Resources used</h2><p>${pack.lessonTitles.length ? `Platform lessons completed: ${esc(pack.lessonTitles.join("; "))}. ` : ""}${pack.plan?.ai_content?.resources_overview ? esc(pack.plan.ai_content.resources_overview) : ""}</p>
<h2>6. Period reflection</h2>${reflection}${notes ? `<p><strong>Parent notes:</strong> ${esc(notes).replace(/\n/g, "<br/>")}</p>` : ""}
<h2>7. Parent declaration</h2><p>I declare that this pack is a true record of the educational program provided to ${esc(student.name)} during the period above.</p>
<div class="sig"><div>Parent / guardian signature</div><div>Date</div></div>
<p style="margin-top:30px;font-size:10px;color:#666">Generated from records kept in Side Quest. Work samples and files are stored in the platform and can be shown on request.</p>
</body></html>`;
    w.document.write(html); w.document.close(); w.print();
  };

  const flagCls = (s) => s === "Good" ? "text-emerald-700" : s === "Thin" ? "text-amber-700" : "text-rose-700";

  return (
    <div className="space-y-5" data-testid="ap-pack">
      <p className="text-sm text-slate-600 max-w-3xl">
        Pulls together approved work, life learning, reading and your learning plan for a chosen period, and prints it as an evidence pack for the Authorised Person. Nothing here needs retyping.
      </p>
      <div className="grid md:grid-cols-4 gap-3 items-end">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student
          <select value={sid} onChange={(e) => setSid(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm bg-white normal-case" data-testid="pack-student">
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.stage})</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm bg-white" data-testid="pack-start"/>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm bg-white" data-testid="pack-end"/>
        </label>
        <button onClick={printPack} disabled={!pack || loading} className="rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50" data-testid="pack-print"><Printer size={14}/> Print evidence pack</button>
      </div>

      {loading || !pack ? <div className="text-slate-500 text-sm">Loading…</div> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Dated samples" value={pack.samples.length}/>
            <Stat label="Reading entries" value={pack.reading.length}/>
            <Stat label="Reading minutes" value={pack.readMinutes}/>
            <Stat label="Plan found" value={pack.plan ? "Yes" : "No"}/>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr><th className="p-3">Learning area</th><th className="p-3">Lessons</th><th className="p-3">Life learning</th><th className="p-3">Outcomes evidenced</th><th className="p-3">Not yet evidenced</th><th className="p-3">Evidence</th></tr>
              </thead>
              <tbody>
                {pack.coverage.map((c) => (
                  <tr key={c.area} className="border-t border-slate-100" data-testid={`pack-area-${c.area.replace(/\s+/g, "-")}`}>
                    <td className="p-3 font-medium">{c.area}</td><td className="p-3">{c.lessons}</td><td className="p-3">{c.life}</td>
                    <td className="p-3 text-xs font-mono">{c.evidenced.join(", ") || "—"}</td>
                    <td className="p-3 text-xs font-mono">{c.missing.join(", ") || "—"}</td>
                    <td className={`p-3 font-semibold ${flagCls(c.status)}`}>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">"Good" means {GUIDE_SAMPLES} or more dated samples in the period. This is a rule of thumb used by many home educators, not a NESA rule. Fix "Thin" and "None" areas before the visit. Reading counts as English evidence in the printed log, not in this table.</p>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Parent notes for the reflection (optional)
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm normal-case bg-white" data-testid="pack-notes"/>
          </label>
        </>
      )}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div><div className="font-display text-3xl font-bold text-slate-900 mt-1">{value}</div></div>
);

export default function AuditPage() {
  const [tab, setTab] = useState("pack");
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/audit").then(r => setData(r.data)).catch(() => setData({ issues: [], coverage: [], notice: "" })); }, []);

  const tabBtn = (id, label, Icon) => (
    <button onClick={() => setTab(id)} className={`rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 border ${tab === id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`} data-testid={`tab-${id}`}><Icon size={14}/> {label}</button>
  );

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="audit-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Audit and AP Visit Pack</h1>
        <div className="mt-3 flex gap-2">{tabBtn("pack", "AP Visit Pack", FileCheck)}{tabBtn("audit", "Curriculum audit", ShieldAlert)}</div>
      </header>

      {tab === "pack" && <PackTab />}
      {tab === "audit" && (!data ? <div className="text-slate-500">Loading…</div> : <AuditBody data={data} />)}
    </div>
  );
}

function AuditBody({ data }) {
  const grouped = data.issues.reduce((m, i) => { (m[i.type] = m[i.type] || []).push(i); return m; }, {});
  return (
    <>
      <p className="text-sm text-slate-600 max-w-3xl">{data.notice}</p>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><div className="text-xs font-semibold uppercase tracking-wider text-rose-700">High severity</div><div className="font-display text-4xl font-bold text-rose-900 mt-1">{data.issues.filter(i=>i.severity==="high").length}</div></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Medium</div><div className="font-display text-4xl font-bold text-amber-900 mt-1">{data.issues.filter(i=>i.severity==="medium").length}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Low</div><div className="font-display text-4xl font-bold text-slate-900 mt-1">{data.issues.filter(i=>i.severity==="low").length}</div></div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold mb-3">Issues</h2>
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-4" data-testid={`audit-${type}`}>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{type.replace(/_/g, " ")} ({items.length})</div>
            <div className="space-y-2">
              {items.slice(0, 10).map((i, idx) => {
                const Icon = sevIcon(i.severity);
                return (
                  <div key={idx} className={`rounded-lg border p-3 flex items-start gap-2 ${sevCls(i.severity)}`}>
                    <Icon size={14} className="mt-0.5"/>
                    <div className="text-sm"><strong>{i.title}:</strong> {i.message}</div>
                  </div>
                );
              })}
              {items.length > 10 && <div className="text-xs text-slate-500">+{items.length - 10} more</div>}
            </div>
          </div>
        ))}
        {data.issues.length === 0 && <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No issues detected yet.</div>}
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold mb-3">Coverage</h2>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="p-3">Stage</th><th className="p-3">Learning area</th><th className="p-3">Assignments</th><th className="p-3">Demonstrated</th></tr>
            </thead>
            <tbody>
              {data.coverage.map((c,i) => (
                <tr key={i} className="border-t border-slate-100"><td className="p-3 font-mono text-xs">{c.stage}</td><td className="p-3">{c.learning_area}</td><td className="p-3">{c.count}</td><td className="p-3 text-emerald-700 font-semibold">{c.demonstrated}</td></tr>
              ))}
              {data.coverage.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500 text-sm">No assignments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
