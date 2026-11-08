import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";

const Row = ({ pack, onSaved }) => {
  const [f, setF] = useState(pack);
  const [saving, setSaving] = useState(false);
  const set = (patch) => setF(prev => ({ ...prev, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.put(`/seasonal/${pack.pack}`, {
        enabled: f.enabled, start_date: f.start_date || "", end_date: f.end_date || "",
        decorations: f.decorations, prize: f.prize_enabled,
      });
      setF(r.data); onSaved(r.data);
      toast.success(`${pack.label} saved`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not save");
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-3" data-testid={`seasonal-${pack.pack}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-display font-semibold text-slate-900">{pack.month ? "📅" : pack.prize.emoji} {pack.label}</div>
          <div className="text-xs text-slate-500">{pack.month ? `Every ${pack.month_name}` : null}{pack.month && pack.blurb ? ` · ${pack.blurb}` : null}</div>
          <div className="text-xs text-slate-500">{f.active ? "Showing now" : f.enabled ? (pack.month ? `On, starts in ${pack.month_name}` : "On, waiting for its dates") : "Off"} · Prize: {pack.prize.name}</div>
        </div>
        <button onClick={() => set({ enabled: !f.enabled })} role="switch" aria-checked={f.enabled}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border ${f.enabled ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`}
          data-testid={`toggle-${pack.pack}`}>{f.enabled ? "On" : "Off"}</button>
      </div>
      {!pack.month && <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start
          <input type="date" value={f.start_date || ""} onChange={e => set({ start_date: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm normal-case" />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">End
          <input type="date" value={f.end_date || ""} onChange={e => set({ end_date: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm normal-case" />
        </label>
      </div>}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.decorations} onChange={e => set({ decorations: e.target.checked })} /> Pet room decorations</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.prize_enabled} onChange={e => set({ prize_enabled: e.target.checked })} /> Pet prize</label>
        <button onClick={save} disabled={saving} className="ml-auto rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50" data-testid={`save-${pack.pack}`}>{saving ? "Saving…" : "Save"}</button>
      </div>
    </div>
  );
};

export default function SeasonalCard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [version, setVersion] = useState(0);
  const load = () => api.get("/seasonal").then(r => { setData(r.data); setVersion((v) => v + 1); }).catch(() => setError(true));
  useEffect(() => { load(); }, []);
  const holidays = data?.packs.filter((p) => !p.month) || [];
  const monthly = data?.packs.filter((p) => p.month) || [];
  const allOn = monthly.length > 0 && monthly.every((p) => p.enabled);
  // Switches every monthly theme on (or off) in one go, keeping each one's decoration and prize choices.
  const setAllMonthly = async (on) => {
    setBulk(true);
    try {
      for (const p of monthly) {
        await api.put(`/seasonal/${p.pack}`, { enabled: on, start_date: "", end_date: "", decorations: p.decorations, prize: p.prize_enabled });
      }
      toast.success(on ? "Monthly themes are on. Each one appears in its month." : "Monthly themes are off.");
      await load();
    } catch (e) { toast.error(e?.response?.data?.detail || "Could not save"); }
    finally { setBulk(false); }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4" data-testid="seasonal-card">
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900">Seasonal releases</h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">Switch on a holiday pack to decorate your children's pet rooms and give their pets a themed prize. Everything is off until you choose. Leave a date empty for no limit.</p>
      </div>
      {error && <div className="text-sm text-rose-700">Could not load seasonal packs.</div>}
      {!data && !error && <div className="text-sm text-slate-500">Loading…</div>}
      {data && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {holidays.map(p => <Row key={`${p.pack}-${version}`} pack={p} onSaved={() => {}} />)}
          </div>
          <div className="pt-2 flex flex-wrap items-end gap-3">
            <div className="mr-auto">
              <h3 className="font-display text-lg font-bold text-slate-900">Monthly themes</h3>
              <p className="text-sm text-slate-600 max-w-2xl">A new theme every month, with room decorations and a prize to collect. Each one shows for its whole month, every year. If a holiday pack is on in the same month, the holiday decorates the room and both prizes can be opened.</p>
            </div>
            <button type="button" onClick={() => setAllMonthly(!allOn)} disabled={bulk} data-testid="seasonal-monthly-all"
              className={`rounded-full px-4 py-2 text-sm font-semibold border disabled:opacity-50 ${allOn ? "bg-white border-slate-300" : "bg-slate-900 text-white border-slate-900"}`}>
              {bulk ? "Saving…" : allOn ? "Turn all monthly themes off" : "Turn on all 12 monthly themes"}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {monthly.map(p => <Row key={`${p.pack}-${version}`} pack={p} onSaved={() => {}} />)}
          </div>
        </>
      )}
    </section>
  );
}
