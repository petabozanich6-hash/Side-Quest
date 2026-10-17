import React from "react";
import { Alert, Button, Card, fmtBytes, fmtDate, GREEN, NotConfigured, PLAN_LABELS, Row, Stat } from "./ui";
import { useAdmin } from "./useAdmin";

const usd = (n) => {
  const v = Number(n || 0);
  return v > 0 && v < 0.0001 ? "< $0.0001" : "$" + v.toFixed(4);
};

const KIND_LABELS = { lesson_draft: "Lesson drafts", lesson_refine: "Lesson changes", series_plan: "Lesson series plans", outcome_match: "Outcome matching", help: "Child help hints", life_map: "Life-learning mapping", yt_search: "Video searches", plan: "Learning plans" };

/** 14 days of new families as plain bars (no chart library). */
function Registrations({ days }) {
  const max = Math.max(1, ...days.map((d) => d.families));
  return (
    <div className="flex items-end gap-1 h-28" role="img" aria-label={`New families per day for 14 days: ${days.map((d) => d.families).join(", ")}`}>
      {days.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center justify-end min-w-0" title={`${d.day}: ${d.families}`}>
          <span className="text-[10px] text-stone-600">{d.families || ""}</span>
          <div className="w-full rounded-t" style={{ height: `${(d.families / max) * 80 + 2}px`, backgroundColor: d.families ? "#6B8A5B" : "#E7E0CC" }} />
          <span className="text-[9px] text-stone-500 mt-1 hidden sm:block">{d.day.slice(8)}</span>
        </div>
      ))}
    </div>
  );
}

export default function HqOverview() {
  const { data: o, error, loading, reload } = useAdmin("/overview");
  if (loading && !o) return <p role="status" className="text-stone-600">Loading live figures…</p>;
  if (error && !o) return <><Alert>{error}</Alert><Button onClick={reload}>Retry</Button></>;
  const plans = Object.entries(o.plans.by_effective_plan || {}).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-5" data-testid="hq-overview">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-stone-500">Measured {fmtDate(o.generated_at)}</p>
        <Button tone="plain" onClick={reload} disabled={loading}>Refresh</Button>
      </div>

      {o.health.warnings.length > 0 && (
        <Card title="Needs attention" testid="hq-warnings">
          <ul className="space-y-2">
            {o.health.warnings.map((w, i) => (
              <li key={i} className={`text-sm rounded-lg px-3 py-2 ${w.level === "warning" ? "bg-amber-50 text-amber-900" : "bg-stone-100 text-stone-700"}`}>{w.message}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Families" value={o.customers.families} testid="stat-families" />
        <Stat label="Paying families" value={o.plans.paying_families} note="From plan records; Stripe is the billing authority" testid="stat-paying" />
        <Stat label="New families · 7 days" value={o.customers.new_families_7d} note={`${o.customers.new_families_30d} in 30 days`} />
        <Stat label="Child profiles" value={o.customers.child_profiles} note={`${o.customers.parent_accounts} parent accounts`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="New families, last 14 days"><Registrations days={o.customers.registrations_14d} /></Card>
        <Card title="Plans">
          <dl>{plans.map(([p, n]) => <Row key={p} label={PLAN_LABELS[p] || p}>{n}</Row>)}</dl>
          {o.customers.suspended_families > 0 && <p className="text-sm mt-2 text-rose-800">{o.customers.suspended_families} suspended</p>}
          <div className="mt-3 space-y-2">
            {o.plans.stripe.configured
              ? <p className="text-sm text-stone-700">Stripe: {o.plans.stripe.live ? "live payments" : "test mode"} · {o.plans.stripe.cancelling_at_period_end} cancelling at period end</p>
              : <NotConfigured note={o.plans.stripe.note} />}
            <NotConfigured note={o.plans.revenue.note} />
            <NotConfigured note={`Active users: ${o.customers.active_users.note}`} />
          </div>
        </Card>

        <Card title="AI usage" testid="hq-ai">
          {o.ai.configured === false && o.ai.requests_7d === undefined ? <NotConfigured note={o.ai.note} /> : (
            <>
              {!o.ai.configured && <NotConfigured note="Workers AI is not bound to this Worker; figures below are past usage." />}
              <dl>
                <Row label="Requests · 24 hours">{o.ai.requests_24h} of {o.ai.platform_cap_24h} allowed</Row>
                <Row label="Requests · 7 days">{o.ai.requests_7d}</Row>
                <Row label="Failed · 24 hours">{o.ai.failed_24h}</Row>
                <Row label="Families using AI · 7 days">{o.ai.families_using_7d}</Row>
                <Row label="AI switch">{o.ai.enabled ? "On" : "Off"}</Row>
                {Object.entries(o.ai.by_kind_30d || {}).map(([k, v]) => <Row key={k} label={`${KIND_LABELS[k] || k} · 30 days`}>{v.requests}{v.failed ? ` (${v.failed} failed)` : ""}</Row>)}
              </dl>
              <div className="mt-4 pt-4 border-t border-stone-200 space-y-2" data-testid="hq-ai-costs">
                <h3 className="text-sm font-bold" style={{color:GREEN}}>Estimated Workers AI inference cost</h3>
                {o.ai.cost?.configured ? <>
                  <dl>
                    <Row label="Gross estimate · 24 hours">{usd(o.ai.cost.estimated_gross_24h_usd)} USD</Row>
                    <Row label="Gross estimate · 30 days">{usd(o.ai.cost.estimated_gross_30d_usd)} USD</Row>
                    <Row label="Gross estimate · since tracking began">{usd(o.ai.cost.estimated_gross_all_time_usd)} USD</Row>
                    <Row label="AI model calls · 30 days">{o.ai.cost.tracked_calls_30d}</Row>
                    {o.ai.cost.mean_call_ms_30d != null && <Row label="Average model call · 30 days">{(o.ai.cost.mean_call_ms_30d / 1000).toFixed(2)} seconds</Row>}
                    {o.ai.cost.models_30d?.map((model) => <Row key={model.model} label={`Model: ${model.model} · ${model.timed_calls} timed calls`}>{model.mean_call_ms == null ? "Timing pending migration" : `${(model.mean_call_ms / 1000).toFixed(2)} s average`} · {model.calls} calls</Row>)}
                    <Row label="Provider token counts · 30 days">{o.ai.cost.reported_tokens_30d}</Row>
                    <Row label="Approximate token counts · 30 days">{o.ai.cost.approximate_tokens_30d}</Row>
                    {(o.ai.cost.unpriced_calls_30d > 0) && <Row label="Calls without a price · 30 days">{o.ai.cost.unpriced_calls_30d}</Row>}
                  </dl>
                  <p className="text-xs text-stone-600">{o.ai.cost.tracking_started_at ? "Tracking began " + fmtDate(o.ai.cost.tracking_started_at) + "." : "Tracking starts with the next AI model call after deployment."} {o.ai.cost.note}</p>
                  <a href={o.ai.cost.pricing_source} target="_blank" rel="noopener noreferrer" className="inline-block text-xs underline font-bold text-emerald-900">Cloudflare model pricing (checked {o.ai.cost.model_price_updated}) ↗</a>
                </> : <NotConfigured note={o.ai.cost?.note || "AI cost metering not available."} />}
              </div>
            </>
          )}
        </Card>

        <Card title="Storage and health" testid="hq-health">
          {o.storage.configured ? <dl><Row label="Files">{o.storage.files}</Row><Row label="Stored">{fmtBytes(o.storage.bytes)}</Row><Row label="R2 binding">BUCKET connected</Row></dl> : <NotConfigured note={o.storage.note} />}
          <dl className="mt-3">
            <Row label="Server errors · 24 hours">{o.health.errors_24h}</Row>
            <Row label="Server errors · 7 days">{o.health.errors_7d}</Row>
            <Row label="Unprocessed Stripe events">{o.health.stripe_events_unprocessed ?? "—"}</Row>
            <Row label="Outgoing email">{o.health.email.configured ? "Configured" : "Not configured"}</Row>
          </dl>
          {o.health.top_error_routes_7d.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-bold" style={{ color: GREEN }}>Where errors happened (7 days)</h3>
              <ul className="text-xs text-stone-700 mt-1 space-y-1">
                {o.health.top_error_routes_7d.map((r) => <li key={r.method + r.route} className="break-all"><code>{r.method} {r.route}</code> · {r.n} · last {fmtDate(r.last)}</li>)}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
