import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminApi, errorCode, errorText } from "../../../lib/adminApi";
import { Alert, Button, Card, fmtDate, GREEN } from "./ui";
import { useAdmin } from "./useAdmin";

function Toggle({ label, hint, checked, onChange, testid }) {
  return (
    <label className="flex items-start justify-between gap-3 py-2 border-b border-stone-200 last:border-0 cursor-pointer">
      <span className="min-w-0"><span className="block text-sm font-semibold">{label}</span>{hint && <span className="block text-xs text-stone-500">{hint}</span>}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0" data-testid={testid} />
    </label>
  );
}

/** One settings section with its own Save; high-impact changes ask for a second, explicit confirmation. */
function Section({ title, settingKey, value, updatedAt, children, onSaved }) {
  const [draft, setDraft] = useState(value);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setDraft(value), [value]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(value);
  const save = async (confirmHighImpact = false) => {
    setBusy(true); setError("");
    try {
      await adminApi.put(`/settings/${settingKey}`, { value: draft, ...(confirmHighImpact ? { confirm_high_impact: true } : {}) });
      setPending(null); toast.success(`${title} saved`); onSaved();
    } catch (e) {
      if (errorCode(e) === "confirmation_required") setPending(e.response.data.reasons);
      else setError(errorText(e));
    } finally { setBusy(false); }
  };
  return (
    <Card title={title} testid={`hq-setting-${settingKey}`}>
      {children(draft, setDraft)}
      {error && <div className="mt-3"><Alert>{error}</Alert></div>}
      {pending && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 space-y-2" role="alertdialog" aria-label="Confirm high-impact change">
          <p className="text-sm font-bold text-amber-900">Please confirm this change:</p>
          <ul className="list-disc pl-5 text-sm text-amber-900">{pending.map((r) => <li key={r}>{r}</li>)}</ul>
          <div className="flex flex-wrap gap-2">
            <Button tone="danger" onClick={() => save(true)} disabled={busy} data-testid="hq-confirm-high-impact">Yes, make this change</Button>
            <Button tone="plain" onClick={() => setPending(null)}>Cancel</Button>
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-stone-500">{updatedAt ? `Last changed ${fmtDate(updatedAt)}` : "Using the default"}</span>
        <Button onClick={() => save(false)} disabled={!dirty || busy || !!pending} data-testid={`hq-save-${settingKey}`}>{busy ? "Saving…" : "Save"}</Button>
      </div>
    </Card>
  );
}

const Message = ({ value, onChange, testid, label }) => (
  <label className="block text-sm font-semibold mt-2">{label}
    <textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={280} rows={2} className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-sm font-normal" data-testid={testid} />
    <span className="block text-xs font-normal text-stone-500">{value.length}/280 · plain text</span>
  </label>
);

export default function HqSettings() {
  const { data, error, loading, reload } = useAdmin("/settings");
  if (loading && !data) return <p role="status" className="text-stone-600">Loading…</p>;
  if (error && !data) return <Alert>{error}</Alert>;
  const s = data.settings;
  const u = data.updated_at || {};
  return (
    <div className="grid gap-4 lg:grid-cols-2" data-testid="hq-settings">
      <Section title="Announcement" settingKey="announcement" value={s.announcement} updatedAt={u.announcement} onSaved={reload}>
        {(d, set) => (
          <>
            <Toggle label="Show an announcement banner" hint="Shown at the top of every page, for parents and children." checked={d.enabled} onChange={(v) => set({ ...d, enabled: v })} testid="hq-announcement-enabled" />
            <Message label="Message" value={d.message} onChange={(v) => set({ ...d, message: v })} testid="hq-announcement-message" />
            <label className="block text-sm font-semibold mt-2">Style
              <select value={d.tone} onChange={(e) => set({ ...d, tone: e.target.value })} className="ml-2 rounded-lg border border-stone-300 px-2 py-1 text-sm font-normal">
                <option value="info">Information</option><option value="warning">Warning</option>
              </select>
            </label>
          </>
        )}
      </Section>

      <Section title="Maintenance notice" settingKey="maintenance" value={s.maintenance} updatedAt={u.maintenance} onSaved={reload}>
        {(d, set) => (
          <>
            <Toggle label="Show a maintenance notice" hint="A notice only; Side-Quest keeps working." checked={d.enabled} onChange={(v) => set({ ...d, enabled: v })} testid="hq-maintenance-enabled" />
            <Message label="Message" value={d.message} onChange={(v) => set({ ...d, message: v })} testid="hq-maintenance-message" />
          </>
        )}
      </Section>

      <Section title="Feature switches" settingKey="features" value={s.features} updatedAt={u.features} onSaved={reload}>
        {(d, set) => (
          <>
            <Toggle label="New family sign-ups" hint="Existing families can always sign in." checked={d.registrationsOpen} onChange={(v) => set({ ...d, registrationsOpen: v })} testid="hq-feature-registrations" />
            <Toggle label="AI features" hint="Lesson drafting, help hints, planning. Off = templates only, no AI cost." checked={d.aiEnabled} onChange={(v) => set({ ...d, aiEnabled: v })} testid="hq-feature-ai" />
            <Toggle label="YouTube video suggestions" hint="Uses the YouTube API quota." checked={d.videoSearch} onChange={(v) => set({ ...d, videoSearch: v })} testid="hq-feature-video" />
          </>
        )}
      </Section>

      <Section title="Cost safeguards" settingKey="costSafeguards" value={s.costSafeguards} updatedAt={u.costSafeguards} onSaved={reload}>
        {(d, set) => (
          <label className="block text-sm font-semibold">Most AI requests for the whole platform in any 24 hours
            <input type="number" min={0} max={data.limits.aiDailyPlatformCapMax} step={1} value={d.aiDailyPlatformCap}
              onChange={(e) => set({ ...d, aiDailyPlatformCap: e.target.value === "" ? 0 : Math.floor(Number(e.target.value)) })}
              className="mt-1 w-40 block rounded-xl border border-stone-300 p-2 text-sm font-normal" data-testid="hq-ai-cap" />
            <span className="block text-xs font-normal text-stone-500 mt-1">When reached, AI pauses for everyone until usage falls. Each family's own fair-use limits still apply. Raising it above {data.limits.aiDailyPlatformCapHighImpact} needs confirmation. Default {data.defaults.costSafeguards.aiDailyPlatformCap}.</span>
          </label>
        )}
      </Section>
      <p className="text-xs text-stone-500 lg:col-span-2" style={{ color: GREEN }}>Changes take effect within 30 seconds everywhere and are recorded in the audit log. Secrets (payment keys, sign-in keys) are never shown or changed here.</p>
    </div>
  );
}
