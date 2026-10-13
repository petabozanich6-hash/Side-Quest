import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

const LABEL = {
  FREE_PREVIEW: "Free preview", PREVIEW_EXPIRED: "Free preview ended", ACTIVE_MONTHLY: "Family Membership (monthly)",
  ACTIVE_ANNUAL: "Family Membership (annual)", PAST_DUE: "Family Membership (payment needed)", CANCELLED: "Cancelled", INTERNAL: "Early-access family",
};

export default function UpgradePage() {
  const [plan, setPlan] = useState(null);
  useEffect(() => { api.get("/account/plan").then(r => setPlan(r.data)).catch(() => {}); }, []);
  if (!plan) return <div className="p-8 text-stone-500">Loading…</div>;
  const preview = plan.effective_plan === "FREE_PREVIEW";
  const expired = plan.effective_plan === "PREVIEW_EXPIRED";
  const row = (a, b) => <tr className="border-t border-stone-200"><td className="p-3">{a}</td><td className="p-3 text-center">{b[0]}</td><td className="p-3 text-center">{b[1]}</td></tr>;
  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-3xl space-y-6" data-testid="upgrade-page">
      <header>
        <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Your plan</h1>
        <p className="text-sm text-stone-600 mt-1">Current plan: <strong data-testid="plan-name">{LABEL[plan.effective_plan] || plan.effective_plan}</strong>{preview && plan.trial_ends_at ? ` · preview ends ${new Date(plan.trial_ends_at).toLocaleDateString("en-AU")}` : ""}</p>
      </header>

      {expired && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Your free preview has ended. Everything you made is kept and your children's progress is safe. Creating and assigning lessons needs a Family Membership.</div>}

      <div className="paper-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-stone-500"><th className="p-3"></th><th className="p-3 text-center">Free preview (7 days)</th><th className="p-3 text-center">Family Membership</th></tr></thead>
          <tbody>
            {row("Children", ["1", "All your children"])}
            {row("Lessons you create", ["2", "Unlimited*"])}
            {row("Active assignments", ["2", "Unlimited*"])}
            {row("Child dashboard, XP and pet", ["Yes", "Yes"])}
            {row("Parent review and evidence", ["Yes", "Yes"])}
            {row("Full portfolio export", ["1 sample entry", "Full"])}
            {row("AI lesson drafting", ["No", "Yes (fair-use limits)"])}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500">*Subject to fair-use limits. Planned price: AUD $12.95 per month or $129 per year per family.</p>

      <div className="paper-card p-5" data-testid="billing-status">
        <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Membership checkout is not open yet</h2>
        <p className="text-sm text-stone-700 mt-1">We are in early access and are not taking payments. Nothing will be charged. When membership opens we will tell you first, and your lessons and progress will be waiting.</p>
      </div>

      <div className="text-sm text-stone-600">
        Used so far: {plan.usage.children} of {plan.limits.maxChildren} children · {plan.usage.lessons} lessons · {plan.usage.activeAssignments} active assignments.
        <div className="mt-3"><Link to="/parent" className="font-bold underline" style={{color:"#4A5D3A"}}>Back to the dashboard</Link></div>
      </div>
    </div>
  );
}
