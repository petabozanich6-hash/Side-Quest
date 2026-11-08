import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../lib/api";

// The public shop (no account). Shown only while the owner has it switched on in Owner HQ.
// Prices are always re-checked by the server at checkout; payment happens on Square's own page.
const KEY = "sq-shop-cart-v1";
const money = (c) => `$${(c / 100).toFixed(2)}`;
const readCart = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; } };
const writeCart = (ids) => { try { localStorage.setItem(KEY, JSON.stringify(ids.slice(0, 20))); } catch { /* storage off: cart lasts this visit */ } };

function Cover({ book }) {
  const [bad, setBad] = useState(false);
  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white border border-stone-200 shadow">
      {book.has_cover && !bad
        ? <img src={`${API}/shop/books/${encodeURIComponent(book.id)}/cover`} alt="" loading="lazy" onError={() => setBad(true)} className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 grid place-items-center p-3 text-center"><span className="font-display font-bold text-slate-800">{book.title}</span></div>}
    </div>
  );
}

function LookInside({ book, onClose, onAdd, inCart }) {
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Look inside ${book.title}`}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <h3 className="mr-auto font-display font-bold text-slate-900">{book.title}</h3>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm hover:bg-stone-100" aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto bg-stone-100 p-3 space-y-3 select-none" onContextMenu={(e) => e.preventDefault()}>
          {Array.from({ length: book.look_pages }, (_, i) => (
            <img key={i} src={`${API}/shop/books/${encodeURIComponent(book.id)}/look/${i + 1}`} alt={`Preview page ${i + 1}`} draggable={false} loading="lazy" className="mx-auto w-full max-w-[560px] rounded shadow pointer-events-none" />
          ))}
        </div>
        <div className="border-t px-4 py-3 flex items-center gap-2">
          <span className="mr-auto text-sm text-stone-600">{book.pages ? `${book.pages} pages · ` : ""}PDF download</span>
          <button type="button" onClick={onAdd} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: "#1F3B2D" }}>{inCart ? "In your cart" : `Add to cart · ${money(book.price_cents)}`}</button>
        </div>
      </div>
    </div>
  );
}

export default function ShopSection({ standalone = false }) {
  const [data, setData] = useState(null);
  const [cart, setCart] = useState(readCart);
  const [look, setLook] = useState(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/shop`).then((r) => r.json()).then(setData).catch(() => setData({ open: false })); }, []);
  useEffect(() => writeCart(cart), [cart]);
  if (!data?.open) return standalone ? <p className="p-8 text-center text-stone-600">The shop isn't open yet. Check back soon!</p> : null;
  const books = data.books || [];
  const inCart = (id) => cart.includes(id);
  const toggle = (id) => setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const chosen = books.filter((b) => cart.includes(b.id));
  const total = chosen.reduce((n, b) => n + b.price_cents, 0);

  const checkout = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter the email address your books should go to."); return; }
    setBusy(true);
    try {
      const r = await fetch(`${API}/shop/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ book_ids: chosen.map((b) => b.id), email: email.trim(), expected_total_cents: total }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j.detail || "Could not start checkout.");
      setCart([]);
      window.location.assign(j.url);
    } catch (e) { setError(e.message); setBusy(false); }
  };

  return (
    <section id="shop" className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 py-14" aria-labelledby="shop-heading" data-testid="public-shop">
      <div className="text-center mb-8">
        <h2 id="shop-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: "#1F3B2D" }}>The Side-Quest shop</h2>
        <p className="mt-2 text-stone-700">Beautiful printable workbooks to keep. No account needed: pay securely and download straight away.</p>
      </div>
      {!books.length ? <p className="text-center text-stone-600">New books are on their way.</p> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((b) => (
            <div key={b.id} className="flex flex-col gap-2" data-testid={`shop-book-${b.id}`}>
              <Cover book={b} />
              <div className="text-sm font-bold text-slate-900 leading-tight">{b.title}</div>
              <div className="text-xs text-stone-600">{b.year_label} · {b.subject_label}{b.pages ? ` · ${b.pages} pages` : ""}</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="font-bold text-slate-900 mr-auto">{money(b.price_cents)}</span>
                {b.look_pages > 0 && <button type="button" onClick={() => setLook(b)} className="text-xs font-semibold underline">Look inside</button>}
                <button type="button" onClick={() => toggle(b.id)} className="rounded-lg px-2.5 py-1 text-xs font-bold" style={inCart(b.id) ? { border: "1px solid #1F3B2D", color: "#1F3B2D" } : { backgroundColor: "#1F3B2D", color: "#F5EFE0" }}>{inCart(b.id) ? "✓ In cart" : "Add"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {chosen.length > 0 && (
        <div className="mt-8 paper-card p-5 space-y-3" data-testid="shop-cart">
          <h3 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Your cart</h3>
          <ul className="divide-y divide-stone-200">
            {chosen.map((b) => <li key={b.id} className="flex items-center gap-3 py-2 text-sm"><span className="mr-auto">{b.title}</span><span className="font-semibold">{money(b.price_cents)}</span><button type="button" onClick={() => toggle(b.id)} className="text-stone-500 hover:text-rose-700" aria-label={`Remove ${b.title}`}>✕</button></li>)}
          </ul>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-semibold flex-1 min-w-[220px]">Email for your download links
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-normal" />
            </label>
            <div className="text-lg font-bold" style={{ color: "#1F3B2D" }}>Total {money(total)}</div>
            <button type="button" onClick={checkout} disabled={busy || !data.can_buy} className="rounded-xl px-5 py-2.5 font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#1F3B2D" }} data-testid="shop-checkout">{busy ? "Opening checkout…" : "Checkout securely"}</button>
          </div>
          {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
          <p className="text-xs text-stone-500">You'll pay on Square's secure checkout page, then come straight back to download. For your family's own use.</p>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-stone-600">Already bought something? <Link to="/shop/downloads" className="underline font-semibold">Get my downloads</Link></p>
      {look && <LookInside book={look} onClose={() => setLook(null)} inCart={inCart(look.id)} onAdd={() => { if (!inCart(look.id)) toggle(look.id); setLook(null); }} />}
    </section>
  );
}
