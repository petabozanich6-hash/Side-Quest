import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Users, BookOpen, Camera, AlertTriangle, Plus, GraduationCap, Trees, FileCheck, Wand2 } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";
import ReviewModal from "../../components/parent/ReviewModal";

const Stat = ({ icon: Icon, label, value, testid, accent="#4A5D3A", href, to }) => {
  const body = (
    <div className="paper-card p-5" data-testid={testid}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</div>
        <Icon size={16} style={{color: accent}}/>
      </div>
      <div className="mt-2 font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{value}</div>
    </div>
  );
  if (to) return <Link to={to} className="block hover:translate-y-[-2px] transition" aria-label={`${label}: ${value}. Open ${label.toLowerCase()} page`}>{body}</Link>;
  return href ? <a href={href} className="block hover:translate-y-[-2px] transition">{body}</a> : body;
};

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
  const [waiting, setWaiting] = useState([]);
  const [readingPending, setReadingPending] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [plan, setPlan] = useState(null);

  const load = () => {
    api.get("/dashboard/parent").then(r => setData(r.data));
    api.get("/submissions").then(r => setWaiting((r.data || []).filter(s => ["submitted", "awaiting_help"].includes(s.status))));
    api.get("/reading-submissions/pending").then(r => setReadingPending(r.data || [])).catch(() => setReadingPending([]));
  };
  useEffect(() => { load(); api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }, []);
  if (!data) return <div className="p-10 text-stone-500">Loading dashboard…</div>;

  const pendingTotal = waiting.length + readingPending.length;

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-8 relative" data-testid="parent-dashboard">
      <Leaf className="absolute right-10 top-8 opacity-50" size={70} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-10 opacity-20" size={200} color="#4A5D3A"/>

      <header className="flex items-start justify-between gap-6 relative z-10">
        <div>
          <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Good to see you</div>
          <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Parent Hub</h1>
          <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
            Welcome to your family’s home base. Plan lessons, see what your children are working on, and keep the learning journey organised in one place.
          </p>
        </div>
      </header>

      {(() => {
        const kids = data.students.length;
        const lessons = plan?.usage?.lessons ?? 0;
        const assigned = data.students.reduce((n, s) => n + (s.total_assignments || 0), 0);
        const steps = [
          { done: kids > 0, label: "Add your child", to: "/parent/children", cta: "Add a child" },
          { done: lessons > 0, label: "Create a lesson", to: "/parent/lessons/new", cta: "Build your first lesson" },
          { done: assigned > 0, label: "Assign it to your child", to: "/parent/lessons", cta: "Choose a lesson" },
          { done: data.students.some(s => s.completed > 0), label: "Review their work", to: "#waiting", cta: "See what is waiting" },
        ];
        if (steps.every(x => x.done)) return null;
        const next = steps.find(x => !x.done);
        return (
          <section className="paper-card p-6 relative z-10" data-testid="get-started">
            <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Get started in four steps</h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {steps.map((x, i) => <li key={i} className={x.done ? "text-emerald-800" : "text-stone-700"}>{x.done ? "✓" : `${i + 1}.`} {x.label}</li>)}
            </ol>
            {next.to.startsWith("#") ? <a href={next.to} className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>{next.cta}</a>
              : <Link to={next.to} className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="get-started-next">{next.cta}</Link>}
            {kids > 0 && lessons === 0 && <Link to="/parent/lessons/new?example=1" className="mt-4 ml-3 inline-block text-sm font-bold underline" style={{color:"#4A5D3A"}} data-testid="try-example">Or start from an example lesson</Link>}
          </section>
        );
      })()}

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={Users} label="Students" value={data.students.length} testid="stat-students" to="/parent/children"/>
        <Stat icon={Camera} label="Pending review" value={pendingTotal} testid="stat-pending" accent="#D4A574" href="#waiting"/>
        <Stat icon={AlertTriangle} label="Awaiting help" value={data.awaiting_help} testid="stat-help" accent="#E11D48" href="#waiting"/>
      </section>

      <section id="waiting" data-testid="waiting-list">
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Waiting for you</h2>
        {pendingTotal === 0 ? (
          <div className="paper-card p-6 text-sm text-stone-600">All caught up! When your child submits work, you’ll be able to review it here. <Link to="/parent/assignments" className="font-semibold underline">View assignments</Link></div>
        ) : (
          <div className="space-y-3">
            {readingPending.map(r => (
              <div key={r.id} className="paper-card p-4 flex items-center justify-between gap-4" data-testid={`waiting-reading-${r.id}`}>
                <div>
                  <div className="font-display font-bold" style={{color:"#1F3B2D"}}>Reading: {r.title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{r.duration_minutes} min · {r.read_date} · waiting for your approval</div>
                </div>
                <Link to="/parent/reading-log" className="rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`open-reading-${r.id}`}>Review</Link>
              </div>
            ))}
            {waiting.map(s => (
              <div key={s.id} className="paper-card p-4 flex items-center justify-between gap-4" data-testid={`waiting-${s.id}`}>
                <div>
                  <div className="font-display font-bold" style={{color:"#1F3B2D"}}>{s.lesson?.title || "Lesson"}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{s.student?.name} · {new Date(s.submitted_at).toLocaleString()}{s.needs_help ? " · asked for help" : ""}</div>
                </div>
                <button onClick={() => setOpenId(s.id)} className="rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`open-${s.id}`}>Open</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Jump in</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Quick to="/parent/lessons/make" icon={BookOpen} label="Make a lesson" desc="Describe what to teach and Side-Quest writes it, or build one yourself" tint="#C77B5B" testid="quick-create-lesson"/>
          <Quick to="/parent/children" icon={Plus} label="Add a student" desc="Set up a child with username and PIN" tint="#4A5D3A" testid="quick-add-student"/>
          <Quick to="/parent/side-quest" icon={Wand2} label="Seasonal surprises" desc="Choose the optional seasonal touches your family wants in your children’s pet rooms" tint="#D4A574" testid="quick-sidequest"/>
          <Quick to="/parent/life-learning" icon={Trees} label="Log life learning" desc="Baking, bushwalks, projects — map them to outcomes" tint="#6B8A5B" testid="quick-life"/>
          <Quick to="/parent/learning-plans" icon={FileCheck} label="Build a learning plan" desc="Organise what you plan to teach and keep it alongside your records" tint="#1F3B2D" testid="quick-plan"/>
          <Quick to="/parent/reading-log" icon={BookOpen} label="Add to reading log" desc="Track every book, chapter and audiobook for records" tint="#C8893B" testid="quick-reading"/>
          <Quick to="/parent/evidence" icon={Camera} label="Evidence Backpack" desc="See reviewed work, life learning and portfolio records for each child" tint="#4A5D3A" testid="quick-evidence"/>
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
          <p>Side-Quest Learning supports homeschool planning, teaching and record-keeping. A limited seven-day preview is available without a card, followed by an optional paid Family Membership. Parents remain responsible for their children’s education and their state or territory requirements. Visit Curriculum for official state and territory resources; check which outcome tools apply to your jurisdiction.</p>
        </div>
      </section>

      {openId && <ReviewModal submissionId={openId} onClose={() => setOpenId(null)} onDone={load} />}
    </div>
  );
}
