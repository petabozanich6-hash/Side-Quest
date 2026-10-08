import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";

export default function SeasonalCard() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/seasonal/halloween")
      .then(r => setCfg({ ...r.data, start_date: r.data.start_date || "", end_date: r.data.end_date || "" }))
      .catch(() => setCfg(null));
  }, []);

  if (!cfg) return null;

  const save = async (next) => {
    setSaving(true);
    try {
      const res = await api.put("/seasonal/halloween", {
        enabled: next.enabled,
        start_date: next.start_date || null,
        end_date: next.end_date || null,
      });
      setCfg({ ...res.data, start_date: res.data.start_date || "", end_date: res.data.end_date || "" });
      toast.success("Seasonal settings saved");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not save");
    } finally { setSaving(false); }
  };

  return (
    <section data-testid="seasonal-card">
      <h2 className="font-display text-xl font-bold mb-4" style={{ color: "#1F3B2D" }}>Seasonal releases</h2>
      <div className="paper-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display font-bold" style={{ color: "#1F3B2D" }}>🎃 Halloween pet room</div>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Adds a spooky-but-gentle theme to your children's pet rooms: moonlight, pumpkins, bats and friendly ghosts.
            </p>
            <p className="text-xs mt-1 font-bold" style={{ color: cfg.active ? "#047857" : "#78716C" }} data-testid="seasonal-status">
              {cfg.active ? "Showing now" : cfg.enabled ? "Switched on, waiting for its dates" : "Off"}
            </p>
          </div>
          <button
            type="button" role="switch" aria-checked={cfg.enabled} disabled={saving}
            onClick={() => save({ ...cfg, enabled: !cfg.enabled })}
            className="rounded-full px-4 py-2 text-xs font-bold shrink-0 disabled:opacity-50"
            style={{ backgroundColor: cfg.enabled ? "#1F3B2D" : "#E7E5E4", color: cfg.enabled ? "#F5EFE0" : "#44403C" }}
            data-testid="seasonal-toggle">
            {cfg.enabled ? "On" : "Off"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-bold text-stone-600">Start date (optional)
            <input type="date" value={cfg.start_date} onChange={e => setCfg({ ...cfg, start_date: e.target.value })}
              className="mt-1 block w-full rounded border px-2 py-1 text-sm" style={{ borderColor: "#D4C8A8" }} data-testid="seasonal-start" />
          </label>
          <label className="text-xs font-bold text-stone-600">End date (optional)
            <input type="date" value={cfg.end_date} onChange={e => setCfg({ ...cfg, end_date: e.target.value })}
              className="mt-1 block w-full rounded border px-2 py-1 text-sm" style={{ borderColor: "#D4C8A8" }} data-testid="seasonal-end" />
          </label>
        </div>
        <button type="button" disabled={saving} onClick={() => save(cfg)}
          className="rounded-full px-4 py-2 text-xs font-bold disabled:opacity-50"
          style={{ backgroundColor: "#C77B5B", color: "#fff" }} data-testid="seasonal-save">
          Save dates
        </button>
      </div>
    </section>
  );
}
