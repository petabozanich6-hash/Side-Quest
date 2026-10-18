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
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState({ code: "", status: "idle" });
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

  // Debounced server/Stripe check. Editing even one character invalidates the previous
  // approval; an unavailable network must never silently pass a code into checkout.
  useEffect(() => {
    if (!promoCode) { setDiscount({ code: "", status: "idle" }); return undefined; }
    if (promoCode.length < 4) { setDiscount({ code: promoCode, status: "invalid", message: "Enter at least four letters or numbers." }); return undefined; }
    const controller = new AbortController();
    setDiscount({ code: promoCode, status: "checking" });
    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/billing/discount-preview", { params: { code: promoCode }, signal: controller.signal });
        if (!controller.signal.aborted) {
          const offer = response.data;
          setDiscount({ code: promoCode, status: offer.valid ? "valid" : "invalid", ...offer });
        }
      } catch (err) {
        if (!controller.signal.aborted) setDiscount({ code: promoCode, status: "error", message: err.response?.data?.message || "Couldn't check the code. Try again shortly." });
      }
    }, 650);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [promoCode]);

  const verifiedDiscount = promoCode && discount.code === promoCode && discount.status === "valid" ? discount : null;
  const codeReady = !promoCode || !!verifiedDiscount;
  const durationLabel = (value) => ({ once: "first payment only", month1: "first month", month3: "first three months", month6: "first six months" }[value] || "limited period");
  const discountedCents = (amount) => Math.round(amount * (100 - (verifiedDiscount?.percent_off || 0)) / 100);

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

      {preview && plan.free_ai_lesson && (
        <div className="paper-card p-4 text-sm space-y-2" data-testid="plan-free-ai-lesson">
          <p className="font-bold">🐉 One complete AI lesson from Dragon HQ</p>
          <p>{plan.free_ai_lesson.used ? "Your family has used its complimentary AI lesson. You can keep it, review it and print it; membership unlocks more." : plan.free_ai_lesson.in_progress ? "Your free lesson is currently being created. Find it in My lessons when it finishes." : "You can create one full AI lesson during your seven-day preview. Failed generations do not use it, and it does not replace either of your two manual lessons."}</p>
          {plan.free_ai_lesson.available && <Link to="/parent/lessons/make" className="underline font-bold">Create my free AI lesson</Link>}
        </div>
      )}
      {preview && plan.preview_gift && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" data-testid="preview-gift-notice"><strong>🐉 A little something from the Dragon’s Hoard!</strong> You’ve been gifted {plan.preview_gift.days} extra preview day{plan.preview_gift.days === 1 ? "" : "s"}. Your free preview now runs until {day(plan.preview_gift.ends_at)}. All the usual preview limits still apply.</div>}
      {checkout === "success" && !paid && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="checkout-confirming">Thanks! We are confirming your payment with Stripe. This usually takes a few seconds.</div>}
      {checkout === "success" && paid && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" data-testid="checkout-confirmed">Your Family Membership is active. Welcome!</div>}
      {checkout === "cancelled" && <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">Checkout was cancelled. Nothing was charged.</div>}
      {eff === "PAST_DUE" && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Your last payment did not go through. Please update your card in Manage billing{plan.period_end ? ` before ${day(plan.period_end)}` : ""} to keep full access.</div>}
      {expired && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{eff === "CANCELLED" ? "Your membership has ended." : "Your free preview has ended."} Your family account and saved records are kept. Existing lessons and records remain viewable, children may finish assigned lessons and parents can review that work. New learning records, lessons and assignments need a Family Membership.</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">{error}</div>}

      {paid && (
        <div className="paper-card p-5 space-y-2" data-testid="membership-status">
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Family Membership</h2>
          {eff !== "PAST_DUE" && plan.period_end && (
            <p className="text-sm text-stone-700">{billing.cancel_at_period_end ? `Cancelled. Full access continues until ${day(plan.period_end)}.` : `Renews on ${day(plan.period_end)}.`}</p>
          )}
          {billing.can_manage && <button type="button" className={BTN} style={BTN_STYLE} disabled={!!busy} onClick={() => go("/billing/portal", {}, "portal")} data-testid="manage-billing">{busy === "portal" ? "Opening…" : "Manage billing"}</button>}
          <p className="text-xs text-stone-500">Update your card, see invoices or cancel. Cancelling keeps access until the end of the period you have paid for.</p>
        </div>
      )}

      {canBuy && (
        <section data-testid="billing-options">
          <h2 className="font-display text-lg font-bold mb-1" style={{color:"#1F3B2D"}}>Choose how often to pay</h2>
          <p className="text-sm text-stone-600 mb-4">Every option includes the same Family Membership, with no per-child or per-subject charges. Membership renews at the selected interval until you cancel.</p>
          <div className="paper-card p-4 mb-4 space-y-2" data-testid="plan-promo-scroll">
            <label htmlFor="sidequest-promo-code" className="block text-sm font-bold" style={{color:"#1F3B2D"}}>🐉 Have a Dragon’s Hoard discount scroll?</label>
            <input id="sidequest-promo-code" maxLength={24} autoComplete="off" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="Enter your code (optional)" className="block w-full rounded-xl border border-stone-300 bg-white p-3 text-sm" data-testid="plan-promo-code" />
            <p className="text-xs text-stone-600">We'll check your code here before you choose a membership. Stripe confirms the final amount before payment.</p>
            {promoCode && (
              <div role="status" aria-live="polite" data-testid="plan-promo-status" className={`rounded-lg px-3 py-2 text-sm ${verifiedDiscount ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : discount.code === promoCode && (discount.status === "invalid" || discount.status === "error") ? "bg-rose-50 text-rose-900 border border-rose-200" : "bg-stone-50 text-stone-700"}`}>
                {verifiedDiscount ? <><strong>✓ Discount confirmed: {verifiedDiscount.percent_off}% off!</strong> Valid for the {durationLabel(verifiedDiscount.duration_type)}. Your estimated first payment is shown below. Stripe makes the final eligibility and price decision.</>
                  : discount.code === promoCode && (discount.status === "invalid" || discount.status === "error") ? <><strong>Code not applied.</strong> {discount.message || "Please check your code."}</>
                  : "Checking this scroll with the Dragon…"}
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {billing.options.map((o) => (
              <div key={o.interval} className="paper-card p-4 flex flex-col gap-2" data-testid={`plan-${o.interval}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">{o.label}</div>
                <div>{verifiedDiscount ? <>
                  <span className="text-sm line-through text-stone-500">{money(o.amount_cents)} {o.currency}</span>{" "}
                  <span className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}} data-testid={`promo-price-${o.interval}`}>{money(discountedCents(o.amount_cents))}</span>
                  <span className="text-sm text-stone-600"> {o.currency} estimated first payment</span>
                </> : <><span className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>{money(o.amount_cents)}</span> <span className="text-sm text-stone-600">{o.currency} {o.every}</span></>}</div>
                <p className="text-xs text-stone-500">{verifiedDiscount ? `Your ${verifiedDiscount.percent_off}% discount applies for the ${durationLabel(verifiedDiscount.duration_type)}. After the offer ends, the regular ${money(o.amount_cents)} ${o.currency} ${o.every} resumes. Monthly-duration offers can discount more than one weekly or fortnightly invoice.` : `Billed ${money(o.amount_cents)} ${o.every} until you cancel. Same Family Membership on every option.`}</p>
                <button type="button" className={`${BTN} mt-auto`} style={BTN_STYLE} disabled={!!busy || !codeReady} onClick={() => go("/billing/checkout", { interval: o.interval, ...(verifiedDiscount ? { promo_code: promoCode } : {}) }, o.interval)} data-testid={`choose-${o.interval}`}>
                  {busy === o.interval ? "Opening checkout…" : `Choose ${o.label.toLowerCase()}`}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2">Payments are handled securely by Stripe. You can only redeem active SideQuest discount scrolls. No additional trial is added at checkout; the seven-day preview needs no card.</p>
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
            {row("AI lesson drafting", ["1 complete lesson per family", "10 drafts/day, 60/month"])}
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
