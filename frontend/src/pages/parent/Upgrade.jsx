import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";

const LABEL = {
  FREE_PREVIEW: "Free preview", PREVIEW_EXPIRED: "Free preview ended",
  ACTIVE_WEEKLY: "Family Membership (weekly)", ACTIVE_FORTNIGHTLY: "Family Membership (fortnightly)",
  ACTIVE_MONTHLY: "Family Membership (monthly)", ACTIVE_ANNUAL: "Family Membership (yearly)",
  PAST_DUE: "Family Membership (payment needed)", CANCELLED: "Membership ended", INTERNAL: "Owner account",
};
const PAID = ["ACTIVE_WEEKLY", "ACTIVE_FORTNIGHTLY", "ACTIVE_MONTHLY", "ACTIVE_ANNUAL", "PAST_DUE"];
const money = (cents) => `${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
const BTN = "rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60";
const BTN_STYLE = { background: "#4A5D3A" };
const day = (iso) => (iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function UpgradePage() {
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const checkout = params.get("checkout");

  const load = () => api.get("/account/plan").then((r) => { setPlan(r.data); return r.data; }).catch(() => null);
  useEffect(() => {
    load();
    // Returning from Stripe: access is granted only by the verified webhook, so wait for the server to confirm.
    if (checkout !== "success") return undefined;
    let n = 0;
    const t = setInterval(async () => {
      n += 1;
      const p = await load();
      if ((p && PAID.includes(p.effective_plan)) || n >= 15) clearInterval(t);
    }, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const go = async (path, body, key) => {
    setBusy(key); setError("");
    try {
      const r = await api.post(path, body);
      if (r.data?.url) window.location.assign(r.data.url);
      else setBusy("");
    } catch (e) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
      setBusy("");
    }
  };

  if (!plan) return <div className="p-8 text-stone-500">Loading…</div>;
  const eff = plan.effective_plan;
  const billing = plan.billing || { enabled: false, options: [] };
  const paid = PAID.includes(eff);
  const preview = eff === "FREE_PREVIEW";
  const expired = eff === "PREVIEW_EXPIRED" || eff === "CANCELLED";
  const canBuy = billing.enabled && !paid && eff !== "INTERNAL";
  const usage = plan.usage || {};
  const row = (a, b) => <tr className="border-t border-stone-200"><td className="p-3">{a}</td><td className="p-3 text-center">{b[0]}</td><td className="p-3 text-center">{b[1]}</td></tr>;

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-3xl space-y-6" data-testid="upgrade-page">
      <header>
        <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Your plan</h1>
        <p className="text-sm text-stone-600 mt-1">Current plan: <strong data-testid="plan-name">{LABEL[eff] || eff}</strong>{preview && plan.trial_ends_at ? ` · preview ends ${day(plan.trial_ends_at)}` : ""}</p>
        {billing.mode === "test" && <p className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900" data-testid="billing-test-mode">Test mode: no real payments are taken</p>}
      </header>

      {checkout === "success" && !paid && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="checkout-confirming">Thanks! We are confirming your payment with Stripe. This usually takes a few seconds.</div>}
      {checkout === "success" && paid && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="checkout-confirmed">Your Family Membership is active. Welcome!</div>}
      {checkout === "cancelled" && <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">Checkout was cancelled. Nothing was charged.</div>}
      {eff === "PAST_DUE" && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Your last payment did not go through. Please update your card in Manage billing{plan.period_end ? ` before ${day(plan.period_end)}` : ""} to keep full access.</div>}
      {expired && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{eff === "CANCELLED" ? "Your membership has ended." : "Your free preview has ended."} Everything you made is kept and your children's progress is safe. Creating and assigning lessons needs a Family Membership.</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">{error}</div>}

      {paid && (
        <div className="paper-card p-5 space-y-2" data-testid="membership-status">
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Family Membership</h2>
          {eff !== "PAST_DUE" && plan.period_end && (
            <p className="text-sm text-stone-700">{billing.cancel_at_period_end ? `Cancelled. Full access continues until ${day(plan.period_end)}.` : `Renews on ${day(plan.period_end)}.`}</p>
          )}
          {billing.can_manage && <button type="button" className={BTN} style={BTN_STYLE} disabled={!!busy} onClick={() => go("/billing/portal", {}, "portal")} data-testid="manage-billing">{busy === "portal" ? "Opening…" : "Manage billing"}</button>}
          <p className="text-xs text-stone-500">Update your card, see invoices or cancel. Cancelling keeps access until the end of the period you have paid for. <Link to="/parent/trust/refunds" className="underline font-semibold">Refunds &amp; Consumer Rights</Link>.</p>
        </div>
      )}

      {canBuy && (
        <section data-testid="billing-options">
          <h2 className="font-display text-lg font-bold mb-1" style={{color:"#1F3B2D"}}>Choose how often to pay</h2>
          <p className="text-sm text-stone-600 mb-4">Every option includes the same Family Membership. There are no per-child or per-subject charges.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {billing.options.map((o) => (
              <div key={o.interval} className="paper-card p-4 flex flex-col gap-2" data-testid={`plan-${o.interval}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">{o.label}</div>
                <div><span className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{money(o.amount_cents)}</span> <span className="text-sm text-stone-600">{o.currency} {o.every}</span></div>
                <p className="text-xs text-stone-500">Billed {money(o.amount_cents)} {o.every} until you cancel. Same Family Membership on every option.</p>
                <button type="button" className={`${BTN} mt-auto`} style={BTN_STYLE} disabled={!!busy} onClick={() => go("/billing/checkout", { interval: o.interval }, o.interval)} data-testid={`choose-${o.interval}`}>
                  {busy === o.interval ? "Opening checkout…" : `Choose ${o.label.toLowerCase()}`}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2">Payments are handled securely by Stripe. No trial is added at checkout; the 7-day free preview needs no card. <Link to="/parent/trust/refunds" className="underline font-semibold">Refunds &amp; Consumer Rights</Link>.</p>
        </section>
      )}

      {!billing.enabled && !paid && eff !== "INTERNAL" && (
        <div className="paper-card p-5" data-testid="billing-status">
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Membership checkout is not open yet</h2>
          <p className="text-sm text-stone-700 mt-1">Paid checkout is not available right now. You can keep exploring the free preview while subscriptions are being prepared.</p>
        </div>
      )}
      {eff === "INTERNAL" && <p className="text-sm text-stone-600">Your owner account includes complimentary access to all Side-Quest features.</p>}

      <div className="paper-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-stone-500"><th className="p-3"></th><th className="p-3 text-center">Free preview (7 days)</th><th className="p-3 text-center">Family Membership</th></tr></thead>
          <tbody>
            {row("Children", ["1", "Up to 20 (no extra fee)"])}
            {row("Lessons you create", ["2", "Up to 5,000*"])}
            {row("Active assignments", ["2", "Up to 5,000*"])}
            {row("Child dashboard, XP and pet", ["Yes", "Yes"])}
            {row("Parent review and Evidence Backpack", ["Yes", "Yes"])}
            {row("Full portfolio export", ["1 sample entry", "Full"])}
            {row("AI lesson drafting", ["No", "10 drafts/day, 60/month"])}
            {row("AI lesson changes", ["No", "20/day, 120/month"])}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500">*These are generous family-wide limits. AI drafting and changes have the allowances listed above. Prices are in AUD; all payment options include the same features.</p>

      <div className="text-sm text-stone-600">
        Used so far: {usage.children} of {plan.limits.maxChildren} children · {usage.lessons} lessons · {usage.active_assignments ?? usage.activeAssignments} active assignments.
        <div className="mt-3"><Link to="/parent" className="font-bold underline" style={{color:"#4A5D3A"}}>Back to the dashboard</Link></div>
      </div>
    </div>
  );
}
