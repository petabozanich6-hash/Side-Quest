import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { SHOP_URL } from "../../lib/shop";
import { useAuth } from "../../context/AuthContext";

const LABEL = {
  FREE_PREVIEW: "Free preview", PREVIEW_EXPIRED: "Free preview ended",
  ACTIVE_WEEKLY: "Family Membership (weekly)", ACTIVE_FORTNIGHTLY: "Family Membership (fortnightly)",
  ACTIVE_MONTHLY: "Family Membership (monthly)", ACTIVE_ANNUAL: "Family Membership (yearly)",
  PAST_DUE: "Family Membership (payment needed)", CANCELLED: "Membership ended", INTERNAL: "Owner account",
};
const PAID = ["ACTIVE_WEEKLY", "ACTIVE_FORTNIGHTLY", "ACTIVE_MONTHLY", "ACTIVE_ANNUAL", "PAST_DUE"];
const BTN = "rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60";
const BTN_STYLE = { background: "#4A5D3A" };
const day = (iso) => (iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "");

export default function UpgradePage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = () => api.get("/account/plan").then((r) => { setPlan(r.data); return r.data; }).catch(() => null);
  useEffect(() => {
    load();
    api.get("/ai/status").then(r => setAiStatus(r.data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  // Square memberships are managed here (Square has no hosted billing page).
  const memberAction = async (action) => {
    setBusy(action); setError("");
    try { await api.post(`/billing/membership/${action}`, {}); await load(); }
    catch (e) { setError(e?.response?.data?.detail || "Something went wrong. Please try again."); }
    finally { setBusy(""); }
  };

  if (!plan) return <div className="p-8 text-stone-500">Loading…</div>;
  const eff = plan.effective_plan;
  const billing = plan.billing || { enabled: false, options: [] };
  const paid = PAID.includes(eff);
  const preview = eff === "FREE_PREVIEW";
  const expired = eff === "PREVIEW_EXPIRED" || eff === "CANCELLED";
  const canJoin = !paid && eff !== "INTERNAL";
  const usage = plan.usage || {};
  const row = (a, b) => <tr className="border-t border-stone-200"><td className="p-3">{a}</td><td className="p-3 text-center">{b[0]}</td><td className="p-3 text-center">{b[1]}</td></tr>;

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-3xl space-y-6" data-testid="upgrade-page">
      <header>
        <h1 data-tour="tour-plan" className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Your plan</h1>
        <p className="text-sm text-stone-600 mt-1">Current plan: <strong data-testid="plan-name">{LABEL[eff] || eff}</strong>{preview && plan.trial_ends_at ? ` · preview ends ${day(plan.trial_ends_at)}` : ""}</p>
        {billing.mode === "test" && <p className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900" data-testid="billing-test-mode">Test mode: no real payments are taken</p>}
      </header>

      {preview && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-sm text-violet-950 space-y-2" data-testid="plan-free-ai-lesson">
          <h2 className="font-display text-xl font-bold">🐉 One free AI lesson for your family</h2>
          <p>Your seven-day preview includes one complete AI-created lesson <strong>in addition to two manual lessons</strong>. It is a one-time family allowance, not one per child. A successful draft uses it permanently; an AI generation failure does not.</p>
          {aiStatus?.usage?.preview && (
            <p className="font-semibold" data-testid="plan-ai-sample-status">{aiStatus.usage.preview.in_progress
              ? "Your free lesson is being written."
              : aiStatus.usage.preview.remaining > 0
                ? "Your free AI lesson is still available."
                : "Your family has already used its free AI lesson."}</p>
          )}
          <Link className="inline-flex rounded-full bg-violet-700 text-white px-4 py-2 font-semibold" to="/parent/lessons/make">
            {aiStatus?.usage?.preview?.remaining > 0 ? "Create my free AI lesson" : "Explore the AI lesson builder"}
          </Link>
          <p className="text-xs text-violet-900">AI lesson sets, AI rewrites, extra drafts and other advanced planning tools remain part of Family Membership.</p>
        </section>
      )}
      {preview && plan.preview_gift && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" data-testid="preview-gift-notice"><strong>🐉 A little gift from Side-Quest!</strong> You’ve been gifted {plan.preview_gift.days} extra preview day{plan.preview_gift.days === 1 ? "" : "s"}. Your free preview now runs until {day(plan.preview_gift.ends_at)}. All the usual preview limits still apply.</div>}
      {eff === "PAST_DUE" && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Your last payment did not go through. {billing.provider === "square" ? "Square has emailed you an invoice you can pay with another card" : "Please update your card in Manage billing"}{plan.period_end ? ` before ${day(plan.period_end)}` : ""} to keep full access.</div>}
      {expired && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{eff === "CANCELLED" ? "Your membership has ended." : "Your free preview has ended."} Your family account and saved records are kept. Existing lessons and records remain viewable, children may finish assigned lessons and parents can review that work. New learning records, lessons and assignments need a Family Membership.</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">{error}</div>}

      {paid && (
        <div className="paper-card p-5 space-y-2" data-testid="membership-status">
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Family Membership</h2>
          {eff !== "PAST_DUE" && plan.period_end && (
            <p className="text-sm text-stone-700">{billing.cancel_at_period_end ? `Cancelled. Full access continues until ${day(plan.period_end)}.` : `Renews on ${day(plan.period_end)}.`}</p>
          )}
          {billing.provider === "square" ? (billing.can_manage && (
            <>
              <div className="flex flex-wrap gap-2">
                {billing.cancel_at_period_end
                  ? <button type="button" className={BTN} style={BTN_STYLE} disabled={!!busy} onClick={() => memberAction("keep")} data-testid="keep-membership">{busy === "keep" ? "Saving…" : "Keep my membership"}</button>
                  : <button type="button" className="rounded-xl px-4 py-2 text-sm font-bold border border-stone-400 text-stone-800 disabled:opacity-60" disabled={!!busy} onClick={() => { if (window.confirm("Cancel your Family Membership? You keep full access until the end of the period you've paid for.")) memberAction("cancel"); }} data-testid="cancel-membership">{busy === "cancel" ? "Cancelling…" : "Cancel membership"}</button>}
              </div>
              <p className="text-xs text-stone-500">Payments are handled securely by Square. Cancelling keeps access until the end of the period you've paid for. Receipts come from Square by email. To change how often you pay, cancel and choose a new option once this one ends.</p>
            </>
          )) : (
            <>
              {billing.can_manage && <button type="button" className={BTN} style={BTN_STYLE} disabled={!!busy} onClick={() => go("/billing/portal", {}, "portal")} data-testid="manage-billing">{busy === "portal" ? "Opening…" : "Manage billing"}</button>}
              <p className="text-xs text-stone-500">Update your card, see invoices or cancel. Cancelling keeps access until the end of the period you have paid for.</p>
            </>
          )}
        </div>
      )}

      {canJoin && (
        <section className="paper-card p-5 space-y-3" data-testid="join-in-shop">
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Become a Family Member</h2>
          <p className="text-sm text-stone-700">Family Membership is bought in the Side-Quest shop. Use <strong>the same email address as your Side-Quest account</strong> at checkout{user?.email ? <> ({user.email})</> : null}, and your account unlocks automatically within a few minutes.</p>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className={`${BTN} inline-flex`} style={BTN_STYLE} data-testid="join-shop-link">Go to the shop</a>
          <p className="text-xs text-stone-500">Payments are handled securely by Square. Every option includes the same Family Membership, with no per-child or per-subject charges.</p>
        </section>
      )}
      {eff === "INTERNAL" && <p className="text-sm text-stone-600">Your owner account includes complimentary access to all Side-Quest features.</p>}

      <div className="paper-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-stone-500"><th className="p-3"></th><th className="p-3 text-center">Free preview (7 days)</th><th className="p-3 text-center">Family Membership</th></tr></thead>
          <tbody>
            {row("Family child profiles", ["1", "Up to 20 (no extra fee)"])}
            {row("Manually created lessons", ["2", "Up to 5,000*"])}
            {row("Active assignments", ["2", "Up to 5,000*"])}
            {row("Children complete lessons; parents review work", ["Yes", "Yes"])}
            {row("Pocket pets, XP and achievements", ["Yes", "Yes"])}
            {row("Homeschooling Compass, registration checklist and official links", ["Yes", "Yes"])}
            {row("Basic learning plan templates", ["1", "As many as needed*"])}
            {row("Reading log entries", ["During the 7 days", "Yes"])}
            {row("Evidence Backpack", ["Summary + 1 detailed sample", "Full portfolio and exports"])}
            {row("Curriculum and outcome reference", ["View reference and automatic progress", "Advanced outcome evidence and confirmations"])}
            {row("Manual calendar, timetable, Auto-Quest planning", ["No", "Yes"])}
            {row("Life learning records and detailed evidence notes", ["No", "Yes"])}
            {row("Resource library, video suggestions and Word Hoard authoring", ["No", "Yes"])}
            {row("File uploads and attachments", ["No", "Up to 250 MB per family*"])}
            {row("AI lesson drafting", ["1 full lesson per family, once during the preview", "10 drafts/day, 60/month"])}
            {row("AI lesson changes", ["No", "20/day, 120/month"])}
            {row("AI learning plans, outcome help and child AI assistance", ["No", "Fair-use limits apply"])}
            {row("Offline lessons in SQ Kids", ["No", "Yes"])}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 space-y-2" data-testid="after-preview-explained">
          <h2 className="font-display text-lg font-bold">When your seven days are up</h2>
          <p>There is no automatic charge and no card required to begin. Your family account and learning records stay yours. You can still see saved work, finish lessons already assigned and review submitted work, but you cannot create new lessons, reading entries or learning records without Family Membership.</p>
          <p>Registration guidance, Homeschooling Compass, account management and the feedback form remain accessible.</p>
        </div>
        <p className="text-xs text-stone-500">*Paid family-wide caps are fair-use safeguards, not extra fees. Uploaded files have a 50 MB per-file cap and 250 MB total active storage per family. AI requests have separate fair-use limits. Prices are in AUD.</p>

      <div className="text-sm text-stone-600">
        Used so far: {usage.children} of {plan.limits.maxChildren} children · {usage.lessons} lessons · {usage.active_assignments ?? usage.activeAssignments} active assignments.
        <div className="mt-3"><Link to="/parent" className="font-bold underline" style={{color:"#4A5D3A"}}>Back to the dashboard</Link></div>
      </div>
    </div>
  );
}
