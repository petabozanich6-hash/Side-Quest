import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Gift, ScrollText, Sparkles, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { adminApi, errorText } from "../../../lib/adminApi";
import { Alert, Button, Card, ConfirmDialog, fmtDay, GREEN } from "./ui";
import { useAdmin } from "./useAdmin";

const inputClass = "mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const futureDate = () => {
  const date = new Date(Date.now() + 30 * 86400000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function HqHoard() {
  const { data, error, loading, reload } = useAdmin("/hoard");
  const [form, setForm] = useState({ code: "", label: "", percent_off: 20, duration_months: 1, duration_type: "once", max_redemptions: 25, expires_at: futureDate() });
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [retiring, setRetiring] = useState(null);
  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const create = async (e) => {
    e.preventDefault();
    if (!approved || busy) return;
    setBusy(true); setActionError("");
    try {
      await adminApi.post("/hoard", {
        ...form,
        code: form.code.trim().toUpperCase(),
        expires_at: new Date(form.expires_at).toISOString(),
        confirm: "CREATE",
      });
      toast.success("Your discount scroll has been created in Stripe.");
      setForm({ code: "", label: "", percent_off: 20, duration_months: 1, duration_type: "once", max_redemptions: 25, expires_at: futureDate() });
      setApproved(false);
      await reload();
    } catch (e) {
      setActionError(errorText(e, "Could not create the discount."));
    } finally {
      setBusy(false);
    }
  };

  const retire = async ({ reason, confirm }) => {
    await adminApi.post("/hoard/" + encodeURIComponent(retiring.id) + "/retire", { reason, confirm });
    toast.success("Scroll retired. Existing subscription discounts are not removed.");
    await reload();
  };

  const offers = data?.offers || [];
  const active = offers.filter((o) => o.active && Date.parse(o.expires_at) > Date.now()).length;
  const currentMode = data?.mode;
  return (
    <div className="space-y-5" data-testid="hq-dragon-hoard">
      <header className="paper-card p-5 space-y-2" style={{ background: "linear-gradient(135deg,#F4EAD1,#E7EFD8)" }}>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: GREEN }}>
          <Sparkles size={22} /> The Dragon's Hoard
        </h2>
        <p className="text-sm text-stone-700">A little generosity, a few shiny offers and just the right amount of dragon mischief. Only you can create, retire or gift from this hoard.</p>
        <p className="text-xs font-semibold text-stone-600">Discount scrolls apply in Stripe Checkout to eligible first-time transactions. Preview gifts extend the limited free preview, not a paid membership.</p>
      </header>

      {error && <Alert>{error}</Alert>}
      {actionError && <Alert>{actionError}</Alert>}
      {loading && !data && <p role="status">Checking the treasure chest…</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="paper-card p-4"><div className="text-2xl font-bold" style={{ color: GREEN }}>{active}</div><div className="text-xs text-stone-600">Unexpired active scrolls</div></div>
            <div className="paper-card p-4"><div className="text-2xl font-bold" style={{ color: GREEN }}>{offers.length}</div><div className="text-xs text-stone-600">Scrolls in the catalogue</div></div>
            <div className="paper-card p-4 col-span-2 sm:col-span-1">
              <div className="text-lg font-bold" style={{ color: GREEN }}>{currentMode === "test" ? "Sandbox" : currentMode === "live" ? "Live" : "Unavailable"}</div>
              <div className="text-xs text-stone-600">Current Stripe environment</div>
            </div>
          </div>
          {currentMode === "test" && <Alert tone="warning">These are test-mode promotions. They cannot discount real payments. Make new live-mode scrolls after live Stripe is independently approved and configured.</Alert>}
          {!data.billing_configured && <Alert tone="warning">{data.note}</Alert>}

          <Card title="Create a discount scroll" testid="hoard-create">
            <div className="flex items-center gap-2 text-sm text-stone-700 mb-3"><TicketPercent size={18} /><span>Choose exactly what families receive and when this scroll stops working.</span></div>
            <form onSubmit={create} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">Campaign name
                  <input required minLength={3} maxLength={80} placeholder="Founding Dragon offer" value={form.label} onChange={(e) => patch("label", e.target.value)} className={inputClass}/>
                </label>
                <label className="text-sm font-semibold">Redeemable code
                  <input required minLength={4} maxLength={24} pattern="[A-Za-z0-9]{4,24}" placeholder="FOUNDINGDRAGON" autoCapitalize="characters" value={form.code} onChange={(e) => patch("code", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} className={inputClass} data-testid="hoard-code"/>
                </label>
                <label className="text-sm font-semibold">Discount
                  <select value={form.percent_off} onChange={(e) => patch("percent_off", Number(e.target.value))} className={inputClass}>
                    {[5,10,15,20,25,30,40,50].map((n) => <option key={n} value={n}>{n}% off</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold">Duration
                  <select value={form.duration_type} onChange={(e) => patch("duration_type", e.target.value)} className={inputClass} data-testid="hoard-duration">
                    <option value="once">First invoice only</option>
                    <option value="month1">First month (all invoices billed in that month)</option>
                    <option value="month3">First 3 months</option>
                    <option value="month6">First 6 months</option>
                  </select>
                </label>
                <label className="text-sm font-semibold">Maximum redemptions
                  <input type="number" min={1} max={500} required value={form.max_redemptions} onChange={(e) => patch("max_redemptions", Number(e.target.value))} className={inputClass}/>
                </label>
                <label className="text-sm font-semibold">Expires on (your local time)
                  <input type="datetime-local" required value={form.expires_at} onChange={(e) => patch("expires_at", e.target.value)} className={inputClass}/>
                </label>
              </div>
              <p className="text-xs text-stone-600">Offers are for first-time Stripe transactions and cannot stack. Monthly-duration offers may discount several weekly or fortnightly renewals; yearly billing will usually receive only one discounted invoice during a 1–6 month offer. Choose an affordable redemption cap and expiry.</p>
              <label className="flex gap-2 items-start text-sm text-stone-700">
                <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="mt-1" />
                <span>I have checked the amount, end date and redemption limit. Create this campaign in <strong>{currentMode === "test" ? "Stripe test mode" : "Stripe live mode"}</strong>.</span>
              </label>
              <Button type="submit" disabled={!data.billing_configured || !approved || busy} data-testid="hoard-create-submit">{busy ? "Creating scroll…" : "Create discount scroll"}</Button>
            </form>
          </Card>

          <Card title="Your discount scrolls" testid="hoard-offers">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-stone-600">The Stripe promotion is the source of truth for redemption totals, cancellations and invoices.</p>
              <Button tone="plain" onClick={reload} disabled={loading}>Refresh</Button>
            </div>
            {!offers.length && <p className="text-sm text-stone-600">No scrolls in the treasure chest yet.</p>}
            <div className="space-y-3">
              {offers.map((o) => {
                const expired = Date.parse(o.expires_at) <= Date.now();
                const status = !o.active ? "Retired" : expired ? "Expired" : o.mode !== currentMode ? "Other environment" : "Active";
                return (
                  <div key={o.id} className="border border-stone-200 rounded-xl p-3 space-y-2" data-testid="hoard-offer">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div className="flex items-center gap-2"><ScrollText size={18}/><strong className="text-sm">{o.label}</strong></div>
                      <span className="text-xs font-bold rounded-full bg-stone-100 px-2 py-1 text-stone-700">{status} · {o.mode}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 font-bold text-stone-900">{o.code}</code>
                      <Button tone="plain" onClick={() => navigator.clipboard?.writeText(o.code)}>Copy code</Button>
                    </div>
                    <p className="text-sm text-stone-700">{o.percent_off}% off · {({ once: "first invoice", month1: "first month", month3: "first 3 months", month6: "first 6 months" })[o.duration_type] || "first invoice"} · maximum {o.max_redemptions} redemptions · expires {fmtDay(o.expires_at)}</p>
                    {o.active && !expired && o.mode === currentMode && <Button tone="plain" onClick={() => setRetiring(o)}>Retire scroll</Button>}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="The Dragon's Helping Hand" testid="hoard-gifts">
            <div className="flex items-start gap-3">
              <Gift size={25} className="shrink-0" style={{ color: GREEN }}/>
              <div className="space-y-2">
                <p className="text-sm text-stone-700">Gift a family 1, 7 or 14 extra preview days, up to 35 days total from registration. No payment method, paid subscription or child's work is changed. Every gift requires your passkey, confirmation and a reason kept in the audit log.</p>
                <Link to="/parent/command-centre/customers" className="inline-block rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: "#4A5D3A" }}>Choose a family →</Link>
              </div>
            </div>
          </Card>
          <p className="text-xs text-stone-500">Future hoard additions: opt-in referral rewards, full membership sponsorships and new child-room surprises. These are not enabled here yet.</p>
        </>
      )}
      {retiring && (
        <ConfirmDialog title={"Retire " + retiring.code + "?"} body="Stripe will stop accepting new uses of this code. Existing subscription discounts keep their original terms; no paid invoices are changed." typed="RETIRE" confirmLabel="Retire scroll" onConfirm={retire} onClose={() => setRetiring(null)}/>
      )}
    </div>
  );
}
