import React, { useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Wand2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeasonalCard from "../../components/parent/SeasonalCard";

const THEMES = [
  "Halloween", "Christmas", "Easter", "Lunar New Year", "Diwali", "Ramadan",
  "NAIDOC Week", "Earth Day", "Science Week", "Book Week",
  "Winter Olympics", "Space Launch", "Backyard Birds", "Family Travel",
];

const STAGES = ["ES1","S1","S2","S3","S4","S5","S6"];
const AREAS = ["English","Mathematics","Science","HSIE","PDHPE","Creative Arts","TAS"];

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
        <h1 className="font-display text-3xl font-bold text-slate-900">Create a Side Quest</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">Seasonal and interest-based themes mapped to genuine curriculum outcomes. The theme is a context for learning, not a replacement for it.</p>
      </header>

      <SeasonalCard />

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
