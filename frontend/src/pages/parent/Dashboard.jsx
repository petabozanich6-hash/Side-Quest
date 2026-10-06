import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Users, BookOpen, Camera, AlertTriangle, Sparkles, Plus, GraduationCap } from "lucide-react";

const Stat = ({ icon: Icon, label, value, tone="slate", testid }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-5`} data-testid={testid}>
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <Icon size={16} className={`text-${tone}-600`} />
    </div>
    <div className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</div>
  </div>
);

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard/parent").then(r => setData(r.data)); }, []);
  if (!data) return <div className="p-10 text-slate-500">Loading dashboard…</div>;

  return (
    <div className="p-8 lg:p-10 space-y-8" data-testid="parent-dashboard">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Parent Hub</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">Planning, teaching and record-keeping support. You remain responsible for selecting an appropriate program and confirming alignment with current NESA requirements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/parent/children" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 flex items-center gap-1" data-testid="quick-add-student"><Plus size={14}/> Add student</Link>
          <Link to="/parent/ai-planner" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 flex items-center gap-1" data-testid="quick-ai-lesson"><Sparkles size={14}/> Generate lesson</Link>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Students" value={data.students.length} testid="stat-students" />
        <Stat icon={Camera} label="Pending review" value={data.pending_review} testid="stat-pending" />
        <Stat icon={AlertTriangle} label="Awaiting help" value={data.awaiting_help} testid="stat-help" tone="amber" />
        <Stat icon={BookOpen} label="Unapproved resources" value={data.unapproved_resources} testid="stat-resources" />
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">Children</h2>
        {data.students.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center" data-testid="empty-students">
            <GraduationCap className="mx-auto text-slate-400 mb-3" size={32} />
            <p className="text-sm text-slate-600 mb-4">No students yet. Add your first child to begin planning.</p>
            <Link to="/parent/children" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Add a student</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.students.map(s => (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5" data-testid={`student-card-${s.id}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-lg font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.stage_name} · @{s.username}</div>
                  </div>
                  <span className="pill pill-not-started">{s.band}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div><div className="font-mono text-xl font-bold text-slate-900">{s.total_assignments}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">Assigned</div></div>
                  <div><div className="font-mono text-xl font-bold text-emerald-700">{s.completed}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">Done</div></div>
                  <div><div className="font-mono text-xl font-bold text-rose-700">{s.awaiting_help}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">Help</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-slate-900 text-slate-100 p-6">
        <div className="flex items-start gap-3">
          <ShieldNotice />
        </div>
      </section>
    </div>
  );
}

const ShieldNotice = () => (
  <div className="text-sm leading-relaxed">
    <div className="font-display font-semibold text-base mb-1">Platform notice</div>
    <p>Side Quest Learning is a planning, teaching and record-keeping support tool. Parents remain responsible for checking current official requirements, selecting an appropriate educational program, supervising learning and confirming alignment with the relevant curriculum and syllabus requirements.</p>
  </div>
);
