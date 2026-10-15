import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";

const LABELS = {
  FREE_PREVIEW: "Free previews", PREVIEW_EXPIRED: "Expired previews",
  ACTIVE_WEEKLY: "Weekly members", ACTIVE_FORTNIGHTLY: "Fortnightly members",
  ACTIVE_MONTHLY: "Monthly members", ACTIVE_ANNUAL: "Annual members",
  PAST_DUE: "Payment needs attention", CANCELLED: "Ended memberships",
  INTERNAL: "Owner accounts",
};
function Stat({ title, value, note }) {
  return <article className="paper-card p-5" aria-label={title}>
    <p className="text-sm text-stone-600">{title}</p>
    <p className="font-display text-4xl font-bold mt-2" style={{ color: "#1F3B2D" }}>{value}</p>
    {note && <p className="text-xs text-stone-500 mt-2">{note}</p>}
  </article>;
}
export default function CommandCentre() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const result = await api.get("/owner/command-centre"); setData(result.data); }
    catch (e) { setData(null); setError(e?.response?.status === 403 ? "Owner access is required." : "Could not load live statistics. Please retry."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  return <div className="p-4 sm:p-8 lg:p-10 max-w-5xl space-y-6" data-testid="owner-command-centre">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>🐉 Command Centre</h1>
        <p className="text-stone-600 mt-1">A bird's-eye view of the Side-Quest kingdom. Only the Owner can see this.</p></div>
      <button type="button" onClick={load} disabled={loading} className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{backgroundColor:"#4A5D3A"}}>Refresh figures</button>
    </header>
    {loading && <p role="status">Loading live figures…</p>}
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">{error}</p>}
    {!loading && data && <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Stat title="Registered families" value={data.families}/>
        <Stat title="Free preview" value={data.free_previews}/>
        <Stat title="Paid family memberships" value={data.paid_families} note="Current plan records; Stripe remains the billing authority"/>
        <Stat title="Owner families" value={data.owner_families}/>
        <Stat title="New families — 7 days" value={data.new_families_7d}/>
        <Stat title="New families — 30 days" value={data.new_families_30d}/>
      </div>
      <section className="paper-card p-5 space-y-3">
        <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Membership breakdown</h2>
        <dl className="divide-y divide-stone-200">
          {Object.entries(data.by_plan || {}).map(([plan, count]) =>
            <div key={plan} className="flex justify-between gap-3 py-3 text-sm">
              <dt>{LABELS[plan] || plan.replaceAll("_", " ")}</dt><dd className="font-bold">{count}</dd>
            </div>)}
        </dl>
      </section>
      <section className="paper-card p-5 space-y-2">
        <h2 className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>Other activity</h2>
        <p className="text-sm">Registered parent users: <strong>{data.parent_users}</strong></p>
        <p className="text-sm">Child profiles: <strong>{data.children}</strong></p>
        <p className="text-sm text-stone-600">Revenue: Not connected to Stripe reporting yet. We won't estimate revenue from member counts.</p>
        <p className="text-xs text-stone-500">Updated {new Date(data.measured_at).toLocaleString("en-AU")}</p>
      </section>
    </>}
    <Link to="/parent" className="inline-block text-sm font-semibold underline" style={{color:"#4A5D3A"}}>Back to parent dashboard</Link>
  </div>;
}
