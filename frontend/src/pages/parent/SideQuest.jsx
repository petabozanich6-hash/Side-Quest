import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Wand2, Loader2, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const THEMES = [
  "Halloween", "Christmas", "Easter", "Lunar New Year", "Diwali", "Ramadan",
  "NAIDOC Week", "Earth Day", "Science Week", "Book Week",
  "Winter Olympics", "Space Launch", "Backyard Birds", "Family Travel",
];

const STAGES = ["ES1","S1","S2","S3","S4","S5","S6"];
const AREAS = ["English","Mathematics","Science","HSIE","PDHPE","Creative Arts","TAS"];

function SeasonalEvents() {
  const [events, setEvents] = useState([]);
  const [kids, setKids] = useState([]);
  const [edit, setEdit] = useState({});
  const [busy, setBusy] = useState("");

  const load = async () => {
    try {
      setEvents((await api.get("/seasonal/events")).data);
      setKids((await api.get("/students")).data);
    } catch { toast.error("Could not load seasonal events"); }
  };
  useEffect(() => { load(); }, []);

  const set = (id, patch) => setEdit(e => ({ ...e, [id]: { ...e[id], ...patch } }));
  const kidName = (id) => kids.find(k => k.id === id)?.name || "a child";

  const launch = async (ev) => {
    const e = edit[ev.id] || {};
    const student_id = ev.needs_child ? (e.student_id || kids[0]?.id) : undefined;
    if (ev.needs_child && !student_id) { toast.error("Add a child first"); return; }
    setBusy(ev.id);
    try {
      await api.post(`/seasonal/${ev.id}/launch`, { ends_on: e.ends_on || null, student_id });
      toast.success(`${ev.label} is live in the pet room`);
      await load();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setBusy(""); }
  };

  const end = async (ev) => {
    setBusy(ev.id);
    try {
      await api.post(`/seasonal/${ev.id}/end`);
      toast.success(`${ev.label} has ended. Gifts already claimed are kept.`);
      await load();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setBusy(""); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6" data-testid="seasonal-events">
      <div className="flex items-center gap-2">
        <PartyPopper size={18} className="text-amber-600" />
        <h2 className="font-display text-xl font-bold text-slate-900">Seasonal pet room events</h2>
      </div>
      <p className="text-sm text-slate-600 mt-1 max-w-2xl">
        Launch an event when the time is right. Your children's pet rooms get themed decorations and a free gift for their pet.
        Nothing goes live until you launch it, and gifts already claimed are kept after an event ends.
      </p>
      <div className="mt-4 divide-y divide-slate-100">
        {events.map(ev => {
          const e = edit[ev.id] || {};
          return (
            <div key={ev.id} className="py-3 flex flex-wrap items-center gap-3" data-testid={`season-${ev.id}`}>
              <div className="min-w-[11rem]">
                <div className="text-sm font-semibold text-slate-900">{ev.label}</div>
                <div className="text-xs text-slate-500">Gift: {ev.gift.emoji} {ev.gift.label}</div>
              </div>
              {ev.live ? (
                <>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1">
                    Live{ev.needs_child && ev.student_id ? ` for ${kidName(ev.student_id)}` : ""}{ev.ends_on ? ` until ${ev.ends_on}` : ""}
                  </span>
                  <button disabled={busy === ev.id} onClick={() => end(ev)}
                    className="ml-auto rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold hover:border-slate-500 disabled:opacity-50" data-testid={`end-${ev.id}`}>End now</button>
                </>
              ) : (
                <>
                  {ev.needs_child && (
                    <select value={e.student_id || kids[0]?.id || ""} onChange={x => set(ev.id, { student_id: x.target.value })}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs">
                      {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  )}
                  <label className="text-xs text-slate-500 flex items-center gap-1">Ends
                    <input type="date" value={e.ends_on || ""} onChange={x => set(ev.id, { ends_on: x.target.value })}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs" />
                    <span className="text-slate-400">(optional)</span>
                  </label>
                  <button disabled={busy === ev.id} onClick={() => launch(ev)}
                    className="ml-auto rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50" data-testid={`launch-${ev.id}`}>
                    {busy === ev.id ? "Launching…" : "Launch"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SideQuestPage() {
  const [theme, setTheme] = useState("Halloween");
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState({ stage: "S2", learning_area: "English", topic: "", duration_minutes: 45 });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const generate = async () => {
    const useTheme = custom.trim() || theme;
    if (!form.topic.trim()) { toast.error("Add a curriculum focus too"); return; }
    setLoading(true);
    try {
      await api.post("/ai/generate-lesson", {
        stage: form.stage, learning_area: form.learning_area,
        topic: form.topic, duration_minutes: Number(form.duration_minutes),
        support_level: "green", is_side_quest: true, theme: useTheme
      });
      toast.success("Side Quest generated — review in Lessons");
      nav("/parent/lessons");
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="sidequest-page">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900">Side Quest</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">Seasonal fun for your children. Launch festive pet room events, or create a themed lesson mapped to genuine curriculum outcomes.</p>
      </header>

      <SeasonalEvents />

      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Create a Side Quest lesson</h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">The theme is a context for learning, not a replacement for it.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Theme</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEMES.map(t => (
                <button key={t} onClick={()=>{setTheme(t); setCustom("");}} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${theme===t&&!custom ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:border-slate-500"}`} data-testid={`theme-${t.replace(/\s+/g,'-')}`}>{t}</button>
              ))}
            </div>
            <input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Or type your own (e.g. 'My favourite game')" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="theme-custom"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stage</label><select value={form.stage} onChange={e=>setForm({...form, stage: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sq-stage">{STAGES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Learning area</label><select value={form.learning_area} onChange={e=>setForm({...form, learning_area: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sq-area">{AREAS.map(a=><option key={a} value={a}>{a}</option>)}</select></div>
          </div>

          <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Curriculum focus</label><input value={form.topic} onChange={e=>setForm({...form, topic: e.target.value})} placeholder="e.g. Suspense writing, Probability, Light and shadows" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sq-topic"/></div>
          <div><label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration (min)</label><input type="number" value={form.duration_minutes} onChange={e=>setForm({...form, duration_minutes: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="sq-duration"/></div>

          <button disabled={loading} onClick={generate} className="w-full rounded-full bg-amber-600 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="sq-generate">
            {loading ? <><Loader2 size={16} className="animate-spin"/> Weaving the quest…</> : <><Wand2 size={16}/> Generate Side Quest</>}
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-display font-semibold text-amber-900 mb-2">Rule of thumb</h3>
            <p className="text-sm text-amber-900 leading-relaxed">Themes are the <em>context</em> for genuine curriculum learning. Side Quests still include explicit teaching, success criteria, response and evidence.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 leading-relaxed">
            <strong className="font-semibold text-slate-800">Inclusive:</strong> Religious or cultural observances are only included when you select them. No family is assumed to participate in any particular event.
          </div>
        </aside>
      </div>
    </div>
  );
}
