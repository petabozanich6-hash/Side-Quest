import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";

const money = (c) => `$${(c / 100).toFixed(2)}`;
const LABEL = { pending: "Starting…", active: "Active", cancelling: "Cancelled (finishes at the end of the paid month)", cancelled: "Cancelled", past_due: "Payment needs attention", paused: "Paused" };

// A Dragon Post or Monthly Quest subscription bought in the shop: status and cancel, from its private link.
export default function ShopSubscription() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const t = params.get("t") || "";
  const [sub, setSub] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const url = `${API}/shop/subscriptions/${encodeURIComponent(id)}`;
  const load = async () => {
    const r = await fetch(`${url}?t=${encodeURIComponent(t)}`);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setError(j.detail || "This link isn't valid."); else setSub(j);
    return j;
  };
  useEffect(() => {
    let tries = 0, live = true;
    const tick = async () => { const j = await load().catch(() => null); if (live && j?.status === "pending" && ++tries < 30) setTimeout(tick, 3000); };
    tick();
    return () => { live = false; };
  }, [id, t]); // eslint-disable-line react-hooks/exhaustive-deps
  const cancel = async () => {
    if (!window.confirm("Cancel this subscription? Nothing more will be charged.")) return;
    setBusy(true); setError("");
    const r = await fetch(`${url}/cancel?t=${encodeURIComponent(t)}`, { method: "POST" });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setMsg(j.detail); await load(); } else setError(j.detail || "Could not cancel.");
    setBusy(false);
  };
  return (
    <div className="min-h-screen bg-[#F5EFE0] px-5 py-12">
      <div className="mx-auto max-w-xl paper-card p-6 space-y-4" data-testid="shop-subscription">
        <Link to="/" className="text-sm font-semibold underline">← Side-Quest</Link>
        <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Your subscription</h1>
        {error && <p className="text-rose-700" role="alert">{error}</p>}
        {!error && !sub && <p>Loading…</p>}
        {sub && (
          <>
            <p className="text-lg font-semibold">{sub.title}</p>
            <p className="text-stone-700">For {sub.recipient_name} · {money(sub.price_cents)} a month</p>
            <p className="text-stone-700">Status: <span className="font-semibold">{LABEL[sub.status] || sub.status}</span></p>
            {sub.charged_through && <p className="text-sm text-stone-600">Paid up to {new Date(`${sub.charged_through}T00:00:00`).toLocaleDateString("en-AU", { dateStyle: "medium" })}</p>}
            {sub.status === "pending" && <p className="text-sm text-stone-600">We're confirming your payment with Square…</p>}
            {msg && <p className="text-emerald-800" role="status">{msg}</p>}
            {sub.can_cancel && <button type="button" onClick={cancel} disabled={busy} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 disabled:opacity-60">Cancel subscription</button>}
            <p className="text-xs text-stone-500">Keep this page's link: it's how you manage this subscription.</p>
          </>
        )}
      </div>
    </div>
  );
}
