import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Users, BookOpen, Camera, AlertTriangle, Plus, GraduationCap, Trees, FileCheck, Wand2 } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";

const Stat = ({ icon: Icon, label, value, testid, accent="#4A5D3A" }) => (
  <div className="paper-card p-5" data-testid={testid}>
    <div className="flex items-center justify-between">
      <div className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</div>
      <Icon size={16} style={{color: accent}}/>
    </div>
    <div className="mt-2 font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{value}</div>
  </div>
);

const Quick = ({ to, icon: Icon, label, desc, tint = "#4A5D3A", testid }) => (
  <Link to={to} className="paper-card p-5 hover:translate-y-[-2px] transition flex items-start gap-3" data-testid={testid}>
    <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0" style={{backgroundColor: tint + "22", color: tint}}><Icon size={18}/></div>
    <div>
      <div className="font-display font-bold" style={{color:"#1F3B2D"}}>{label}</div>
      <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">{desc}</div>
    </div>
  </Link>
);

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard/parent").then(r => setData(r.data)); }, []);
  if (!data) return <div className="p-10 text-stone-500">Loading dashboard…</div>;

  return (
    <div className="p-8 lg:p-10 space-y-8 relative" data-testid="parent-dashboard">
      <Leaf className="absolute right-10 top-8 opacity-50" size={70} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-10 opacity-20" size={200} color="#4A5D3A"/>

      <header className="flex items-start justify-between gap-6 relative z-10">
        <div>
          <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Good to see you</div>
          <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Parent Hub</h1>
          <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
            Your one-stop homeschool studio. Plan, teach, assign, record, and prepare for inspection — all in one calm place.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Students" value={data.students.length} testid="stat-students"/>
        <Stat icon={Camera} label="Pending review" value={data.pending_review} testid="stat-pending" accent="#D4A574"/>
        <Stat icon={AlertTriangle} label="Awaiting help" value={data.awaiting_help} testid="stat-help" accent="#E11D48"/>
        <Stat icon={BookOpen} label="Resources to approve" value={data.unapproved_resources} testid="stat-resources" accent="#C77B5B"/>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Jump in</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Quick to="/parent/children" icon={Plus} label="Add a student" desc="Set up a child with username and PIN" tint="#4A5D3A" testid="quick-add-student"/>
          <Quick to="/parent/side-quest" icon={Wand2} label="Create a Side Quest" desc="Seasonal or interest-themed lessons mapped to outcomes" tint="#D4A574" testid="quick-sidequest"/>
          <Quick to="/parent/life-learning" icon={Trees} label="Log life learning" desc="Baking, bushwalks, projects — map them to outcomes" tint="#6B8A5B" testid="quick-life"/>
          <Quick to="/parent/learning-plans" icon={FileCheck} label="Build a learning plan" desc="AP-ready learning plan built around your child's interests" tint="#1F3B2D" testid="quick-plan"/>
          <Quick to="/parent/reading-log" icon={BookOpen} label="Add to reading log" desc="Track every book, chapter and audiobook for records" tint="#C8893B" testid="quick-reading"/>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Children</h2>
        {data.students.length === 0 ? (
          <div className="paper-card p-10 text-center" data-testid="empty-students">
            <GraduationCap className="mx-auto mb-3" size={32} style={{color:"#4A5D3A"}}/>
            <p className="font-display text-lg" style={{color:"#1F3B2D"}}>No students yet</p>
            <p className="text-sm text-stone-500 mt-2 mb-4">Add your first child to begin planning.</p>
            <Link to="/parent/children" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>Add a student</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.students.map(s => (
              <div key={s.id} className="paper-card p-5" data-testid={`student-card-${s.id}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>{s.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{s.stage_name} · @{s.username}</div>
                  </div>
                  <span className="pill pill-not-started">{s.band}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div><div className="font-mono text-xl font-bold" style={{color:"#1F3B2D"}}>{s.total_assignments}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Assigned</div></div>
                  <div><div className="font-mono text-xl font-bold text-emerald-700">{s.completed}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Done</div></div>
                  <div><div className="font-mono text-xl font-bold text-rose-700">{s.awaiting_help}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Help</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="paper-card-dark p-6 relative overflow-hidden" style={{backgroundColor:"#1F3B2D"}}>
        <div className="relative z-10 text-sm leading-relaxed" style={{color:"#E8E2D1"}}>
          <div className="font-display font-bold text-base mb-1" style={{color:"#F5EFE0"}}>Platform notice</div>
          <p>Side Quest Learning is a planning, teaching and record-keeping support tool. Parents remain responsible for checking current official requirements, selecting an appropriate educational program, supervising learning and confirming alignment with the relevant curriculum and syllabus requirements. This platform is free. Paid resource options may be added by parents at their discretion.</p>
        </div>
      </section>
    </div>
  );
}
