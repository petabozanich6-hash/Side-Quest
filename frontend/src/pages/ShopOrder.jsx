import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";

// After paying on Square (or from the emailed link): waits for the verified payment, then shows the downloads.
export default function ShopOrder() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const t = params.get("t") || "";
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true, tries = 0;
    const tick = async () => {
      try {
        const r = await fetch(`${API}/shop/orders/${encodeURIComponent(id)}?t=${encodeURIComponent(t)}`);
        const j = await r.json().catch(() => ({}));
        if (!live) return;
        if (!r.ok) { setError(j.detail || "This order link isn't valid."); return; }
        setOrder(j);
        if (!j.paid && ++tries < 40) setTimeout(tick, 2500);
      } catch { if (live) setError("Couldn't load your order. Refresh to try again."); }
    };
    tick();
    return () => { live = false; };
  }, [id, t]);
  return (
    <div className="min-h-screen bg-[#F5EFE0] px-5 py-12">
      <div className="mx-auto max-w-xl paper-card p-6 space-y-4" data-testid="shop-order">
        <Link to="/" className="text-sm font-semibold underline">← Side-Quest</Link>
        <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Your books</h1>
        {error && <p className="text-rose-700" role="alert">{error} <Link to="/shop/downloads" className="underline">Get my downloads</Link></p>}
        {!error && !order && <p>Loading your order…</p>}
        {order && !order.paid && <p className="text-stone-700">Thanks! We're confirming your payment with Square. This usually takes a few seconds…</p>}
        {order?.paid && (
          <>
            <p className="text-stone-700">Payment received. Download your books below. We've also emailed you a receipt. Keep this page's link if you'd like to download again later.</p>
            <ul className="space-y-2">
              {order.items.map((it) => (
                <li key={it.book_id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
                  <span className="mr-auto font-semibold">{it.title}</span>
                  <a href={`${API}/shop/orders/${encodeURIComponent(id)}/download/${encodeURIComponent(it.book_id)}?t=${encodeURIComponent(t)}`} className="rounded-lg px-3 py-1.5 text-sm font-bold text-white" style={{ backgroundColor: "#1F3B2D" }} data-testid={`shop-download-${it.book_id}`}>Download PDF</a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-500">For your family's own use. Please don't share the files.</p>
          </>
        )}
      </div>
    </div>
  );
}
