import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { api } from "../../lib/api";
import { Users, BookOpen, Camera, AlertTriangle, Plus, GraduationCap, Trees, FileCheck, Compass, MailCheck, ArrowRight, ScrollText, BookMarked } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";
import ReviewModal from "../../components/parent/ReviewModal";
import OutcomeSummaryCard from "../../components/parent/OutcomeSummaryCard";

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
  const { unreadFeedbackReplies: parentUnread = 0, latestUnreadFeedbackReply: parentLatest = null } = useOutletContext() || {};
  // Independently refresh when this page opens: a stale sidebar badge must not
  // hide a fresh Owner reply on the actual dashboard.
  const [feedbackNotice,setFeedbackNotice] = useState(null);
  const unreadFeedbackReplies = feedbackNotice?.unread ?? parentUnread;
  const latestUnreadFeedbackReply = feedbackNotice?.latest ?? parentLatest;
  const [data, setData] = useState(null);
  const [waiting, setWaiting] = useState([]);
  const [readingPending, setReadingPending] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [plan, setPlan] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [drafts, setDrafts] = useState(null);
  useEffect(() => {
    let live=true;
    const refresh=()=>api.get("/feedback/unread-count").then(({data})=>{
      if(live) setFeedbackNotice({unread:Number(data?.unread||0),latest:data?.latest||null});
    }).catch(()=>{});
    refresh();
    const onFocus=()=>refresh();
    window.addEventListener("focus",onFocus);
    window.addEventListener("sidequest-feedback-replies-updated",onFocus);
    const timer=window.setInterval(refresh,60000);
    return ()=>{live=false;window.removeEventListener("focus",onFocus);window.removeEventListener("sidequest-feedback-replies-updated",onFocus);window.clearInterval(timer);};
  },[]);

  const load = () => {
    api.get("/dashboard/parent").then(r => setData(r.data));
    api.get("/submissions").then(r => setWaiting((r.data || []).filter(s => ["submitted", "awaiting_help"].includes(s.status)))).catch(() => {});
    api.get("/reading-submissions/pending").then(r => setReadingPending(r.data || [])).catch(() => setReadingPending([]));
  };
  useEffect(() => {
    load();
    api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {});
    api.get("/ai/status").then(r => setAiStatus(r.data)).catch(() => {});
    api.get("/ai/batches?open=1").then(r => setDrafts(r.data)).catch(() => setDrafts(null));
  }, []);
  useEffect(() => {
    // Refresh when returning to the parent dashboard after a child submits work
    // from another device. Do not poll the full submissions list constantly.
    const onFocus = () => load();
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  if (!data) return <div className="p-10 text-stone-500">Loading dashboard…</div>;

  const pendingTotal = waiting.length + readingPending.length;
  const nextSubmitted = waiting[0] || null;
  const nextReading = readingPending[0] || null;
  const nextReadingStudent = nextReading ? data.students.find(s => s.id === nextReading.student_id) : null;

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-8 relative" data-testid="parent-dashboard">
      <Leaf className="absolute right-10 top-8 opacity-50" size={70} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-10 opacity-20" size={200} color="#4A5D3A"/>

      <header data-tour="tour-dashboard" className="flex items-start justify-between gap-6 relative z-10">
        <div>
          <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Good to see you</div>
          <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Parent Hub</h1>
          <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
            Welcome to your family’s home base. Plan lessons, see what your children are working on, and keep the learning journey organised in one place.
          </p>
        </div>
      </header>


      {plan?.effective_plan === "FREE_PREVIEW" && (
        <section className="relative z-10 rounded-2xl border border-violet-200 bg-violet-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid="dashboard-free-ai-sample">
          <div>
            <h2 className="font-display text-xl font-bold text-violet-950">🐉 Your family's one free AI lesson</h2>
            <p className="mt-1 text-sm text-stone-700">Try a complete AI-written lesson during your seven-day preview, in addition to two lessons you build yourself. One successful draft per family; failed generations don't use your chance.</p>
            {aiStatus?.usage?.preview && <p className="text-sm font-bold text-violet-900 mt-2" data-testid="dashboard-ai-sample-status">{aiStatus.usage.preview.in_progress
              ? "Your lesson is being written."
              : aiStatus.usage.preview.remaining > 0
                ? "Your free AI lesson is ready to try."
                : "You've already used your family's free AI lesson."}</p>}
          </div>
          <Link to="/parent/lessons/make" className="shrink-0 inline-flex justify-center rounded-full bg-violet-700 text-white px-5 py-3 text-sm font-bold">
            {aiStatus?.usage?.preview?.remaining > 0 ? "Create my free AI lesson" : "Open lesson builder"}
          </Link>
        </section>
      )}
      {/* Only while a free preview has less than 24 hours left. Not persistent for members. */}
      {plan?.effective_plan === "FREE_PREVIEW" && (() => {
        const left = Date.parse(plan.trial_ends_at) - Date.now();
        if (!Number.isFinite(left) || left <= 0 || left > 24 * 60 * 60 * 1000) return null;
        return (
          <section className="relative z-10 rounded-2xl border border-amber-300 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid="dashboard-trial-ending" role="status">
            <div>
              <h2 className="font-display text-xl font-bold text-emerald-950">Your free preview is nearly over 🐉</h2>
              <p className="mt-1 text-sm text-stone-700">Less than 24 hours left to create new learning in your preview. Your saved lessons and records stay safe, and there is no automatic payment.</p>
            </div>
            <Link to="/parent/plan" className="shrink-0 inline-flex justify-center rounded-full bg-emerald-950 text-white px-5 py-3 text-sm font-bold">See your plan</Link>
          </section>
        );
      })()}

      {/* Only present when the authenticated parent has an unread owner reply.
          The server records it as read when the parent opens the matching thread. */}
      {unreadFeedbackReplies > 0 && (
        <section className="relative z-10 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-7 shadow-lg" role="status" aria-live="polite" data-testid="dashboard-feedback-reply-alert">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 grid place-items-center rounded-2xl bg-emerald-950 p-3 text-amber-100" aria-hidden="true"><MailCheck size={30}/></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">New message from the Side-Quest team</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-emerald-950">Side-Quest has reported back!</h2>
              <p className="mt-2 text-sm sm:text-base text-stone-800 leading-relaxed">
                {latestUnreadFeedbackReply?.subject
                  ? <>We've replied to your feedback about <strong className="break-words">{latestUnreadFeedbackReply.subject}</strong>.</>
                  : "We've replied to your feedback."}
                {unreadFeedbackReplies > 1 && <> You have <strong>{unreadFeedbackReplies} unread replies</strong> to catch up on.</>}
              </p>
            </div>
            <Link to={latestUnreadFeedbackReply?.feedback_id ? "/parent/feedback?thread=" + encodeURIComponent(latestUnreadFeedbackReply.feedback_id) : "/parent/feedback"}
              className="shrink-0 inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-950"
              data-testid="dashboard-feedback-open-reply">Read your message <ArrowRight size={17}/></Link>
          </div>
          <p className="mt-3 text-xs text-stone-600">This notice disappears automatically after you've read your reply.</p>
        </section>
      )}

      {/* Show only while a child actually has work awaiting review.
          Opening the review without making a decision does not dismiss it. */}
      {pendingTotal > 0 && (
        <section className="relative z-10 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-7 shadow-lg"
          role="status" aria-live="polite" data-testid="dashboard-child-work-alert">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 grid place-items-center rounded-2xl bg-emerald-950 p-3 text-amber-100" aria-hidden="true"><ScrollText size={30}/></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">New work from your adventurer</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-emerald-950">Your adventurer has reported back!</h2>
              <p className="mt-2 text-sm sm:text-base text-stone-800 leading-relaxed">
                {nextSubmitted
                  ? <><strong>{nextSubmitted.student?.name || "Your child"}</strong> has sent <strong>{nextSubmitted.lesson?.title || "a lesson"}</strong> for your review.</>
                  : <><strong>{nextReadingStudent?.name || "Your child"}</strong> has submitted a reading entry{nextReading?.title ? <> for <strong>{nextReading.title}</strong></> : null}.</>}
                {pendingTotal > 1 && <> There are <strong>{pendingTotal} items</strong> waiting for your review.</>}
              </p>
            </div>
            {nextSubmitted
              ? <button type="button" onClick={() => setOpenId(nextSubmitted.id)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-950"
                  data-testid="dashboard-child-work-review">Review their work <ArrowRight size={17}/></button>
              : <Link to="/parent/reading-log"
                  className="shrink-0 inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-950"
                  data-testid="dashboard-child-reading-review">Review reading <BookMarked size={17}/></Link>}
          </div>
          <p className="mt-3 text-xs text-stone-600">This notice clears when the work is approved or returned, and reappears if more work needs your attention.</p>
        </section>
      )}

      {(() => {
        const kids = data.students.length;
        const lessons = plan?.usage?.lessons ?? 0;
        const assigned = data.students.reduce((n, s) => n + (s.total_assignments || 0), 0);
        const steps = [
          { done: kids > 0, label: "Add your child", to: "/parent/children", cta: "Add a child" },
          { done: lessons > 0, label: "Create a lesson", to: "/parent/lessons/make", cta: "Make your first lesson" },
          { done: assigned > 0, label: "Assign it to your child", to: "/parent/lessons", cta: "Choose a lesson" },
          { done: data.students.some(s => s.completed > 0), label: "Review their work after a lesson", to: pendingTotal ? "#waiting" : "/parent/assignments", cta: pendingTotal ? "Review submitted work" : "View assigned lessons" },
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
            {assigned > 0 && pendingTotal === 0 && !steps[3].done && <p className="mt-3 text-xs text-stone-600">Next, ask your child to sign in using the username and PIN you set. When they finish their lesson, you can review it here.</p>}
          </section>
        );
      })()}

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={Users} label="Students" value={data.students.length} testid="stat-students" to="/parent/children"/>
        <Stat icon={Camera} label="Pending review" value={pendingTotal} testid="stat-pending" accent="#D4A574" href="#waiting"/>
        <Stat icon={AlertTriangle} label="Awaiting help" value={data.awaiting_help} testid="stat-help" accent="#E11D48" href="#waiting"/>
      </section>

      {drafts && drafts.batches.length > 0 && (() => {
        const awaiting = drafts.totals.awaiting_review;
        const one = drafts.batches.length === 1 ? drafts.batches[0] : null;
        const failed = drafts.batches.reduce((n, b) => n + b.counts.failed, 0);
        const writing = drafts.batches.reduce((n, b) => n + b.counts.pending + b.counts.generating, 0);
        return (
          <section className="relative z-10" data-testid="drafts-awaiting">
            <Link to={one ? `/parent/lessons/drafts/${one.id}` : "/parent/lessons/drafts"} className="paper-card p-5 flex items-center justify-between gap-4 hover:translate-y-[-2px] transition" data-testid="drafts-awaiting-link">
              <div>
                <div className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}><span aria-hidden="true">📚</span> Lesson Drafts Awaiting Review — <span data-testid="drafts-awaiting-count">{awaiting}</span></div>
                <div className="text-xs text-stone-600 mt-1">
                  {one ? one.title : `${drafts.batches.length} sets of AI lessons`}
                  {writing > 0 && ` · ${writing} still being written`}
                  {failed > 0 && ` · ${failed} could not be written (you can try again)`}
                </div>
              </div>
              <span className="rounded-full px-4 py-2 text-xs font-bold shrink-0" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>Open drafts</span>
            </Link>
          </section>
        );
      })()}

      <section id="waiting" data-testid="waiting-list">
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Waiting for you</h2>
        {pendingTotal === 0 ? (
          <div className="paper-card p-6 text-sm text-stone-600">{data.students.length === 0 ? <>You’ll review completed work here once your children start learning. <Link to="/parent/children" className="font-semibold underline">Add your first child</Link> to begin.</> : <>Nothing needs your review right now. Your child can sign in with their username and PIN to work on assigned lessons. <Link to="/parent/assignments" className="font-semibold underline">View assignments</Link>.</>}</div>
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

      {data.students.length > 0 && <OutcomeSummaryCard />}

      <section>
        <h2 className="font-display text-xl font-bold mb-4" style={{color:"#1F3B2D"}}>Jump in</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Quick to="/parent/lessons/make" icon={BookOpen} label="Make a lesson" desc={plan?.effective_plan === "FREE_PREVIEW" ? "Try your family’s one free AI-generated lesson, or build a lesson yourself" : "Let AI draft a lesson, or build one yourself"} tint="#C77B5B" testid="quick-create-lesson"/>
          <Quick to="/parent/children" icon={Plus} label="Add a student" desc="Set up a child with username and PIN" tint="#4A5D3A" testid="quick-add-student"/>
          <Quick to="/parent/life-learning" icon={Trees} label="Log life learning" desc="Baking, bushwalks, projects — map them to outcomes" tint="#6B8A5B" testid="quick-life"/>
          <Quick to="/parent/homeschool-compass" icon={Compass} label="Homeschooling Compass" desc="Australian state and territory registration guidance, official resources and renewal planning" tint="#1F3B2D" testid="quick-homeschool-compass"/>
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
