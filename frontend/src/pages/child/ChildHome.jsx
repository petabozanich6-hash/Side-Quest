import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { clearNotices, dropSavedLessons, isNetworkError, notices, onOfflineChange, saveDashboard, savedDashboard, savedLessonIds, syncSavedLessons } from "../../lib/offline";
import { forgetOfflineChild } from "../../lib/offlineSignIn";
import { useAuth } from "../../context/AuthContext";
import PetWelcome from "../../components/child/PetWelcome";
import { featuredChildQuest, groupChildQuests, isResume } from "../../lib/childDashboard";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock, Compass, RotateCcw, Sparkles, Star } from "lucide-react";

const iso = (d) => [
  d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0"),
].join("-");
const niceDate = (value) => {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
};
const colors = {
  English: { bg: "#F1ECFD", border: "#D9C9F6", ink: "#5C3C9E", icon: "📚" },
  Mathematics: { bg: "#ECF6E9", border: "#C9E7C5", ink: "#28644C", icon: "🧭" },
  Maths: { bg: "#ECF6E9", border: "#C9E7C5", ink: "#28644C", icon: "🧭" },
  Science: { bg: "#EAF6FE", border: "#C6E4F5", ink: "#215B85", icon: "🔭" },
  History: { bg: "#FFF3DE", border: "#F4DEAB", ink: "#875313", icon: "🏰" },
  Geography: { bg: "#EAF7F4", border: "#BDE5DC", ink: "#28695F", icon: "🌍" },
};
const palette = (a) => colors[a.lesson?.learning_area] || { bg: "#F9F2E5", border: "#EAD8B4", ink: "#76562A", icon: "📜" };
const labelFor = (a) => {
  if (a.status === "needs_revision" || a.status === "needs_more_practice") return "Try again";
  if (isResume(a)) return "Continue";
  if (a.status === "awaiting_help") return "Waiting for help";
  return "Start quest";
};

function QuestCard({ a, planned, ready, note }) {
  const color = palette(a);
  return (
    <Link
      to={"/child/lesson/" + a.id}
      className="block h-full rounded-3xl border-2 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:shadow-md"
      style={{ backgroundColor: color.bg, borderColor: color.border }}
      data-testid={"task-" + a.id}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/80 text-4xl">{color.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold" style={{ color: color.ink }}>{a.lesson?.learning_area || "My quest"}</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight" style={{ color: "#1F3B2D" }}>{a.lesson?.title || "Untitled quest"}</h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1"><Clock size={13} /> {a.lesson?.duration_minutes || 30} min</span>
            {planned && <span>Planned {niceDate(planned)}</span>}
            {ready && <span data-testid="ready-offline">✓ Saved offline</span>}
            {a.support_level === "red" && <span className="font-bold text-rose-800">With a grown-up</span>}
          </div>
          {note && <p className="mt-2 text-sm text-stone-700 line-clamp-2">{note}</p>}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-extrabold" style={{ color: color.ink }}>
        {labelFor(a)} <ArrowRight size={17} />
      </div>
    </Link>
  );
}

function QuestGroup({ title, subtitle, items, planned, ready, feedback, tone = "plain", testid }) {
  if (!items.length) return null;
  const highlighted = tone === "returned" || tone === "catchup";
  return (
    <section className={highlighted ? "rounded-3xl border p-4 sm:p-5" : ""} style={tone === "returned" ? { background: "#FFF0EF", borderColor: "#F2CFC8" } : tone === "catchup" ? { background: "#EEF5FC", borderColor: "#CCE5F6" } : {}} data-testid={testid}>
      <div className="mb-3">
        <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>{title} <span className="text-sm font-bold text-stone-500">({items.length})</span></h2>
        {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
      </div>
      <div className={highlighted ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 md:grid-cols-2 xl:grid-cols-3"}>
        {items.map((a) => <QuestCard key={a.id} a={a} planned={planned[a.id]} ready={ready.has(a.id)} note={feedback?.[a.id]} />)}
      </div>
    </section>
  );
}

function FeaturedQuest({ quest, ready, feedback, senior }) {
  if (!quest) return null;
  const resumed = isResume(quest);
  const returned = ["needs_revision", "needs_more_practice"].includes(quest.status);
  const color = palette(quest);
  const journey = quest.resume;
  const showProgress = journey && Number.isFinite(journey.step) && Number.isFinite(journey.total) && journey.total > 1;
  const pct = showProgress ? Math.round(Math.min(100, Math.max(0, journey.step / (journey.total - 1) * 100))) : 0;
  return (
    <section className="overflow-hidden rounded-[2rem] border-2 border-[#D4C8A8] bg-[#FFFCF5] shadow-md" data-testid="continue-quest">
      <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-3xl" style={{ background: "radial-gradient(circle at 50% 25%, white, " + color.bg + " 65%, " + color.border + ")" }}>
          <div aria-hidden="true" className={senior ? "text-7xl" : "text-8xl sm:text-9xl"}>{color.icon}</div>
          <span aria-hidden="true" className="absolute right-5 top-4 text-3xl text-amber-500">✦</span>
          <span aria-hidden="true" className="absolute bottom-4 left-6 text-xl text-emerald-600">✧</span>
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold" style={{ color: color.ink }}>{quest.lesson?.learning_area || "Adventure"}</span>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 font-extrabold uppercase tracking-wide text-sm" style={{ color: "#4A5D3A" }}>
            {returned ? <RotateCcw size={18} /> : <Compass size={18} />}
            {returned ? "Back for another go" : resumed ? "Pick up where you left off" : "Your next quest"}
          </div>
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: "#1F3B2D" }}>{quest.lesson?.title || "Your quest"}</h2>
          {feedback && returned ? (
            <p className="mt-2 text-sm text-stone-700"><strong>Your grown-up says:</strong> {feedback}</p>
          ) : (
            <p className="mt-2 text-base text-stone-700">{resumed ? "Your adventure is right where you left it. Ready for the next bit?" : "A new adventure is ready whenever you are."}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
            <span className="inline-flex items-center gap-1"><Clock size={15} /> About {quest.lesson?.duration_minutes || 30} min</span>
            <span className="font-semibold">{resumed ? "Already started" : returned ? "Feedback ready" : "Ready to begin"}</span>
            {ready && <span data-testid="ready-offline">✓ Ready offline</span>}
            {quest.support_level === "red" && <strong className="text-rose-800">Do this with your grown-up</strong>}
          </div>
          {showProgress && (
            <div className="mt-4" data-testid="continue-progress">
              <div className="mb-1 flex justify-between text-xs font-bold text-stone-600">
                <span>Where you left off</span><span>Step {journey.step + 1} of {journey.total}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-label="Steps reached in this lesson" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-[#318D64]" style={{ width: pct + "%" }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <Link to={"/child/lesson/" + quest.id} className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#2B8A61] px-5 py-4 text-center font-display text-xl font-bold text-white transition hover:bg-[#206E4D] focus-visible:bg-[#206E4D]" data-testid={"task-" + quest.id}>
          <span aria-hidden="true">▶</span> {returned ? "Review and Continue" : resumed ? "Continue My Quest" : "Start My Quest"} <ArrowRight size={22} />
        </Link>
      </div>
    </section>
  );
}

export default function ChildHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsReady, setEventsReady] = useState(false);
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(new Set());
  const [news, setNews] = useState([]);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    if (!user?.id) return undefined;
    const refresh = () => { savedLessonIds(user.id).then(setReady); notices(user.id).then(setNews); };
    refresh();
    return onOfflineChange(refresh);
  }, [user?.id]);
  useEffect(() => {
    const again = () => setReloads((n) => n + 1);
    window.addEventListener("sq-offline-sent", again);
    return () => window.removeEventListener("sq-offline-sent", again);
  }, []);
  useEffect(() => {
    let active = true;
    api.get("/dashboard/child").then((r) => {
      if (!active) return;
      setData(r.data); setOffline(false);
      if (r.data.offline_allowed) {
        saveDashboard(user?.id, r.data);
        syncSavedLessons(user?.id, r.data.all_pending || r.data.today || []);
      } else {
        dropSavedLessons(user?.id);
        if (user?.username) forgetOfflineChild(user.username);
      }
    }).catch(async (e) => {
      const saved = isNetworkError(e) ? await savedDashboard(user?.id) : null;
      if (!active) return;
      setOffline(isNetworkError(e));
      setData(saved || { today: [], completed: [], waiting: [], xp: 0 });
    });
    setEventsReady(false);
    api.get("/calendar", { params: user?.id ? { student_id: user.id } : {} })
      .then((r) => { if (active) setEvents((r.data || []).filter((e) =>
        (e.linked_lesson_id || e.linked_assignment_id) && !(e.student_id && user?.id && e.student_id !== user.id)
      )); })
      .catch(() => {})
      .finally(() => { if (active) setEventsReady(true); });
    return () => { active = false; };
  }, [user?.id, user?.username, reloads]);

  if (!data) return <div role="status" className="paper-card p-8 text-center text-stone-600">Gathering your quests…</div>;
  const visible = (list) => offline ? (list || []).filter((a) => ready.has(a.id)) : list || [];
  const tasks = visible(data.all_pending || data.today);
  const today = iso(new Date());
  const groups = groupChildQuests(tasks, events, today);
  const featured = featuredChildQuest(groups);
  const excludeFeatured = (items) => items.filter((a) => a.id !== featured?.id);
  const feedback = Object.fromEntries((data.feedback || [])
    .filter((f) => f.assignment_id && f.parent_feedback)
    .map((f) => [f.assignment_id, f.parent_feedback]));
  const kid = user?.theme === "early" || user?.theme === "primary";
  const senior = user?.theme === "secondary" || user?.theme === "senior";
  const dateLabel = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
  const remainingToday = excludeFeatured(groups.today);

  return (
    <div className="space-y-7 animate-in" data-testid="child-home">
      {offline && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900" data-testid="offline-home"><strong>📶 You're offline.</strong> Your saved quests are ready on this device. Your work will send when you're back online.</div>}
      {news.length > 0 && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 space-y-2" data-testid="offline-news">
        {news.map((n, i) => <p key={i}>{n.kind === "handed_in" ? "✅ " : "⚠️ "}{n.text}</p>)}
        <button type="button" className="font-bold underline" onClick={async () => { setNews([]); await clearNotices(user?.id); }}>Got it</button>
      </div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#527259]" data-testid="today-label">{dateLabel}</p>
          <h1 className={"mt-1 font-display font-extrabold text-[#1F3B2D] " + (kid ? "text-4xl" : "text-3xl")}>
            {senior ? "Welcome back" : "Ready for an adventure"}, {user?.name || "explorer"}!
          </h1>
          <p className="mt-1 text-sm text-stone-600">{senior ? "Your work, your pace. Pick up where you left off." : "Your next adventure is just one click away."}</p>
        </div>
        <Link to="/child/calendar" className="inline-flex items-center gap-2 rounded-full border-2 border-[#D4C8A8] bg-white px-4 py-2.5 text-sm font-bold text-[#1F3B2D]" data-testid="view-calendar-link"><CalendarDays size={18} /> View my week</Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,1fr)]">
        <div>{featured ? <FeaturedQuest quest={featured} ready={ready.has(featured.id)} feedback={feedback[featured.id]} senior={senior} /> :
          <section className="flex h-full min-h-64 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#B5C9AF] bg-white/80 p-8 text-center" data-testid="no-work">
            <Sparkles size={40} className="mb-3 text-[#4A5D3A]" />
            <h2 className="font-display text-2xl font-bold text-[#1F3B2D]">{groups.awaitingHelp.length ? "Your grown-up has the next move" : "All caught up!"}</h2>
            <p className="mt-2 text-sm text-stone-600">{groups.awaitingHelp.length ? "Your saved work is waiting for help. You can explore your pet or reading while you wait." : "No quests waiting right now. Visit your pet, add some reading or look back at your adventures."}</p>
            <Link className="mt-4 rounded-full bg-[#1F3B2D] px-5 py-3 text-sm font-bold text-white" to="/child/stuff">Explore My Stuff</Link>
          </section>}
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2" data-testid="quest-stats">
            <Link to="/child/room" className="rounded-2xl border border-[#D4C8A8] bg-white p-3 text-center">
              <div className="font-display text-xl font-extrabold text-[#1F3B2D]" data-testid="stat-xp">{data.xp ?? 0}</div><div className="text-xs text-stone-600">Pet XP</div>
            </Link>
            <Link to="/child/portfolio" className="rounded-2xl border border-[#D4C8A8] bg-white p-3 text-center" data-testid="stat-done-link">
              <div className="font-display text-xl font-extrabold text-[#1F3B2D]" data-testid="stat-done">{(data.completed || []).length}</div><div className="text-xs text-stone-600">Recent wins</div>
            </Link>
            <div className="rounded-2xl border border-[#D4C8A8] bg-white p-3 text-center">
              <div className="font-display text-xl font-extrabold text-[#1F3B2D]" data-testid="stat-waiting">{(data.waiting || []).length}</div><div className="text-xs text-stone-600">In review</div>
            </div>
          </div>
          {eventsReady && <PetWelcome childId={user?.id} name={user?.name} today={groups.today.length} overdue={groups.catchUp.length} ahead={groups.workAhead.length} total={tasks.length} />}
          <Link to="/child/reading" className="flex items-center justify-between gap-3 rounded-2xl border border-[#D4C8A8] bg-white p-4 text-sm font-bold text-[#1F3B2D]"><BookOpen size={19} /> Add to my reading log <ArrowRight size={18} /></Link>
        </div>
      </div>

      {groups.returned.length > 0 && (
        <QuestGroup title="A little more adventuring" subtitle="Your grown-up has left some feedback. Your answers are saved, so you can pick up from there." items={excludeFeatured(groups.returned)} planned={groups.planned} ready={ready} feedback={feedback} tone="returned" testid="returned-section" />
      )}
      <QuestGroup title="Other quests for today" subtitle="Pick whichever adventure you feel ready for." items={remainingToday} planned={groups.planned} ready={ready} testid="today-section" />
      <QuestGroup title="Catch up" subtitle="From earlier days — take them one at a time." items={excludeFeatured(groups.catchUp)} planned={groups.planned} ready={ready} tone="catchup" testid="catchup-section" />
      <QuestGroup title="Ready whenever you are" subtitle="No set day, so choose one when it suits." items={excludeFeatured(groups.anytime)} planned={groups.planned} ready={ready} testid="anytime-section" />
      <QuestGroup title="Work ahead" subtitle="These are planned for later, but you can start early." items={excludeFeatured(groups.workAhead)} planned={groups.planned} ready={ready} testid="ahead-section" />
      {groups.awaitingHelp.length > 0 && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4" data-testid="help-section">
          <h2 className="font-display text-lg font-bold text-amber-900">Waiting for a grown-up</h2>
          <div className="mt-2 space-y-2">{groups.awaitingHelp.map((a) =>
            <div key={a.id} className="rounded-xl bg-white px-4 py-3 text-sm text-stone-700">{a.lesson?.title || "Your quest"} — your request for help is with your grown-up.</div>)}</div>
        </section>
      )}
      {(data.waiting || []).length > 0 && (
        <section className="rounded-3xl border border-[#D4C8A8] bg-white/80 p-5" data-testid="waiting-section">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#1F3B2D]"><Clock size={19} /> Handed in — waiting for review</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">{data.waiting.map((a) =>
            <div key={a.id} className="flex items-center gap-2 rounded-xl bg-[#F5F1E8] px-4 py-3 text-sm"><CheckCircle2 size={16} className="shrink-0 text-[#4A5D3A]" /> {a.lesson?.title || "Your quest"}</div>)}</div>
        </section>
      )}
      {(data.completed || []).length > 0 && (
        <Link to="/child/archive" className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 hover:bg-emerald-100" data-testid="completed-portfolio-link">
          <span className="flex items-center gap-3 font-bold"><Star size={20} /> Your finished quests are safe in your Archive</span><ArrowRight size={20} />
        </Link>
      )}
    </div>
  );
}
