import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../lib/api";

// The public shop (no account). Shown only while the owner has it switched on in Owner HQ.
// Prices, stock and postage are always re-checked by the server at checkout; payment happens on Square's own page.
const KEY = "sq-shop-cart-v2";
const GREEN = "#1F3B2D";
const money = (c) => `$${(c / 100).toFixed(2)}`;
const readCart = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    if (v && Array.isArray(v.books) && Array.isArray(v.items)) return { books: v.books.filter((x) => typeof x === "string"), items: v.items.filter((x) => x && typeof x.product_id === "string") };
    const old = JSON.parse(localStorage.getItem("sq-shop-cart-v1") || "[]");
    return { books: Array.isArray(old) ? old.filter((x) => typeof x === "string") : [], items: [] };
  } catch { return { books: [], items: [] }; }
};
const writeCart = (c) => { try { localStorage.setItem(KEY, JSON.stringify({ books: c.books.slice(0, 20), items: c.items.slice(0, 30) })); } catch { /* storage off: cart lasts this visit */ } };

const BADGE = {
  coming_soon: "bg-stone-200 text-stone-800", register_interest: "bg-sky-100 text-sky-900", pre_order: "bg-violet-100 text-violet-900",
  in_stock: "bg-emerald-100 text-emerald-900", made_to_order: "bg-amber-100 text-amber-900", sold_out: "bg-rose-100 text-rose-900",
};
const fromPrice = (p) => {
  const prices = [p.price_cents, ...p.variants.map((v) => v.price_cents)].filter((x) => x != null);
  if (!prices.length) return null;
  const lo = Math.min(...prices);
  return prices.some((x) => x !== lo) ? `From ${money(lo)}` : money(lo);
};

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

function ProductImage({ p, n = 1, className = "" }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative w-full aspect-square rounded-xl overflow-hidden bg-[#EFE7D2] border border-stone-200 ${className}`}>
      {p.images >= n && !bad
        ? <img src={`${API}/shop/products/${p.id}/images/${n}`} alt="" loading="lazy" onError={() => setBad(true)} className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 grid place-items-center p-3 text-center"><span className="font-display font-bold text-sm" style={{ color: GREEN }}>{p.title}</span></div>}
    </div>
  );
}

function Modal({ label, onClose, children }) {
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <h3 className="mr-auto font-display font-bold text-slate-900">{label}</h3>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm hover:bg-stone-100" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LookInside({ book, onClose, onAdd, inCart }) {
  return (
    <Modal label={`Look inside ${book.title}`} onClose={onClose}>
      <div className="flex-1 overflow-y-auto bg-stone-100 p-3 space-y-3 select-none" onContextMenu={(e) => e.preventDefault()}>
        {Array.from({ length: book.look_pages }, (_, i) => (
          <img key={i} src={`${API}/shop/books/${encodeURIComponent(book.id)}/look/${i + 1}`} alt={`Preview page ${i + 1}`} draggable={false} loading="lazy" className="mx-auto w-full max-w-[560px] rounded shadow pointer-events-none" />
        ))}
      </div>
      <div className="border-t px-4 py-3 flex items-center gap-2">
        <span className="mr-auto text-sm text-stone-600">{book.pages ? `${book.pages} pages · ` : ""}PDF download</span>
        <button type="button" onClick={onAdd} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }}>{inCart ? "In your cart" : `Add to cart · ${money(book.price_cents)}`}</button>
      </div>
    </Modal>
  );
}

const field = "mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-normal";

function ProductDialog({ p, all, initialVariant, onClose, onAdd }) {
  const [variant, setVariant] = useState(initialVariant || (p.variants.length === 1 ? p.variants[0].id : ""));
  const [qty, setQty] = useState(1);
  const [pers, setPers] = useState({});
  const [img, setImg] = useState(1);
  const [addons, setAddons] = useState([]);
  const [email, setEmail] = useState("");
  const [recipient, setRecipient] = useState({ name: "", address_line_1: "", address_line_2: "", locality: "", state: "", postcode: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const v = p.variants.find((x) => x.id === variant);
  const price = v ? v.price_cents : p.price_cents;
  const extras = (p.addons || []).map((id) => all.find((x) => x.id === id)).filter((x) => x && x.can_buy && !x.variants.length && !x.personalisation.length && !x.subscription);
  const max = Math.min(p.max_per_order || 20, 20);
  const missing = p.personalisation.find((f) => f.required && !(pers[f.key] || "").trim());
  const needVariant = p.variants.length > 0 && !v;

  const post = async (path, body) => {
    setBusy(true); setError(""); setMsg("");
    try {
      const r = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.detail || "That didn't work. Please try again.");
      return j;
    } catch (e) { setError(e.message); return null; } finally { setBusy(false); }
  };
  const add = () => {
    if (needVariant) { setError("Choose an option first."); return; }
    if (missing) { setError(`Fill in "${missing.label}".`); return; }
    onAdd([{ product_id: p.id, variant_id: v?.id || null, qty, personalisation: pers, title: `${p.title}${v ? ` (${v.name})` : ""}`, unit_cents: price, postage_cents: p.postage_cents || 0, physical: p.fulfilment !== "digital" },
      ...extras.filter((x) => addons.includes(x.id)).map((x) => ({ product_id: x.id, variant_id: null, qty: 1, personalisation: {}, title: x.title, unit_cents: x.price_cents, postage_cents: x.postage_cents || 0, physical: x.fulfilment !== "digital" }))]);
  };
  const subscribe = async () => {
    if (needVariant) { setError("Choose an option first."); return; }
    const j = await post("/shop/subscribe", { product_id: p.id, variant_id: v?.id || null, email: email.trim(), recipient, personalisation: pers });
    if (j?.url) window.location.assign(j.url);
  };
  const interest = async () => {
    const j = await post("/shop/interest", { product_id: p.id, email: email.trim() });
    if (j) setMsg(j.detail);
  };

  return (
    <Modal label={p.title} onClose={onClose}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="shop-product-dialog">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <ProductImage p={p} n={img} />
            {p.images > 1 && <div className="flex gap-1">{Array.from({ length: p.images }, (_, i) => <button key={i} type="button" onClick={() => setImg(i + 1)} className={`h-2 flex-1 rounded ${img === i + 1 ? "bg-stone-700" : "bg-stone-300"}`} aria-label={`Photo ${i + 1}`} />)}</div>}
          </div>
          <div className="space-y-2 text-sm">
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[p.status] || "bg-stone-200"}`}>{p.status_label}</span>
            {price != null && <p className="text-2xl font-bold" style={{ color: GREEN }}>{money(price)}{p.subscription ? <span className="text-sm font-normal"> / month</span> : null}</p>}
            {p.description && <p className="text-stone-700 whitespace-pre-line">{p.description}</p>}
            {p.dispatch_estimate && <p className="text-stone-600">Dispatch: {p.dispatch_estimate}</p>}
            {p.preorder_closes_at && <p className="text-stone-600">Pre-orders close {new Date(p.preorder_closes_at).toLocaleDateString("en-AU", { dateStyle: "medium" })}</p>}
            {p.preorder_progress && <p className="text-stone-600">{p.preorder_progress.ordered} of {p.preorder_progress.target} pre-ordered</p>}
            {p.low_stock && <p className="font-semibold text-amber-800">Only a few left</p>}
          </div>
        </div>
        {(p.can_buy || p.subscription) && (
          <div className="space-y-3">
            {p.variants.length > 0 && (
              <label className="block text-sm font-semibold">{p.prints_books ? "Which book?" : "Option"}
                <select value={variant} onChange={(e) => setVariant(e.target.value)} className={field}>
                  <option value="">Choose…</option>
                  {p.variants.map((x) => <option key={x.id} value={x.id} disabled={!x.available}>{x.name}{x.price_cents != null && x.price_cents !== p.price_cents ? ` · ${money(x.price_cents)}` : ""}{x.available ? "" : " (sold out)"}</option>)}
                </select>
              </label>
            )}
            {p.personalisation.map((f) => (
              <label key={f.key} className="block text-sm font-semibold">{f.label}{f.required ? " *" : ""}
                <input value={pers[f.key] || ""} maxLength={f.max} onChange={(e) => setPers({ ...pers, [f.key]: e.target.value })} className={field} />
              </label>
            ))}
            {!p.subscription && max > 1 && (
              <label className="block text-sm font-semibold w-32">Quantity
                <input type="number" min={1} max={max} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))} className={field} />
              </label>
            )}
            {!p.subscription && extras.length > 0 && (
              <fieldset className="text-sm"><legend className="font-semibold">Add-ons</legend>
                {extras.map((x) => <label key={x.id} className="flex items-center gap-2 py-1"><input type="checkbox" checked={addons.includes(x.id)} onChange={() => setAddons((a) => (a.includes(x.id) ? a.filter((y) => y !== x.id) : [...a, x.id]))} />{x.title} · {money(x.price_cents)}</label>)}
              </fieldset>
            )}
            {p.subscription && p.can_buy && (
              <div className="space-y-2 rounded-xl bg-stone-50 p-3">
                <p className="text-sm font-semibold">Who is it for? (they can be a child, grandchild or anyone you're gifting to)</p>
                {[["name", "Their name"], ["address_line_1", "Street address"], ["address_line_2", "Unit, building (optional)"], ["locality", "Suburb or town"], ["state", "State"], ["postcode", "Postcode"]].map(([k, l]) => (
                  <input key={k} placeholder={l} aria-label={l} value={recipient[k]} onChange={(e) => setRecipient({ ...recipient, [k]: e.target.value })} className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                ))}
                <input type="email" placeholder="Your email (for receipts and managing it)" aria-label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                <p className="text-xs text-stone-500">Billed monthly on Square. Cancel any time from the link we email you.</p>
                {p.gift_months.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">Or give it as a prepaid gift (one payment, no renewal):</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.gift_months.map((m) => <button key={m} type="button" disabled={price == null} onClick={() => { if (needVariant) { setError("Choose an option first."); return; } onAdd([{ product_id: p.id, variant_id: v?.id || null, qty: 1, gift_months: m, personalisation: pers, title: `${p.title}${v ? ` (${v.name})` : ""} – ${m}-month gift`, unit_cents: price * m, postage_cents: 0, physical: true }]); }} className="rounded-lg border px-3 py-1 text-sm font-semibold" style={{ borderColor: GREEN, color: GREEN }}>{m} month{m > 1 ? "s" : ""} · {money(price * m)}</button>)}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">You'll add the recipient's postal address on Square's checkout page.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!p.can_buy && p.can_register_interest && (
          <div className="space-y-2 rounded-xl bg-stone-50 p-3">
            <p className="text-sm font-semibold">{p.status === "sold_out" ? "Want to know when it's back?" : "Want to know when it's ready?"} No payment needed.</p>
            <input type="email" placeholder="you@example.com" aria-label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          </div>
        )}
        {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
        {msg && <p className="text-sm text-emerald-800" role="status">{msg}</p>}
      </div>
      <div className="border-t px-4 py-3 flex justify-end gap-2">
        {p.can_buy && !p.subscription && <button type="button" onClick={add} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }} data-testid="shop-product-add">Add to cart{price != null ? ` · ${money(price * qty)}` : ""}</button>}
        {p.can_buy && p.subscription && <button type="button" onClick={subscribe} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }}>{busy ? "Opening checkout…" : "Subscribe securely"}</button>}
        {!p.can_buy && p.can_register_interest && !msg && <button type="button" onClick={interest} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }} data-testid="shop-register-interest">Register interest</button>}
      </div>
    </Modal>
  );
}

export default function ShopSection({ standalone = false }) {
  const [data, setData] = useState(null);
  const [cart, setCart] = useState(readCart);
  const [look, setLook] = useState(null);
  const [open, setOpen] = useState(null);
  const [dept, setDept] = useState("all");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/shop`).then((r) => r.json()).then(setData).catch(() => setData({ open: false })); }, []);
  useEffect(() => writeCart(cart), [cart]);
  const products = useMemo(() => data?.products || [], [data]);
  if (!data?.open) return standalone ? <p className="p-8 text-center text-stone-600">The shop isn't open yet. Check back soon!</p> : null;
  const books = data.books || [];
  const hasSeasonal = products.some((p) => p.tags.includes("seasonal"));
  const shown = dept === "all" ? products : dept === "seasonal" ? products.filter((p) => p.tags.includes("seasonal")) : products.filter((p) => p.department === dept);
  const showBooks = books.length > 0 && (dept === "all" || dept === "quest-books");

  const inCart = (id) => cart.books.includes(id);
  const toggle = (id) => setCart((c) => ({ ...c, books: c.books.includes(id) ? c.books.filter((x) => x !== id) : [...c.books, id] }));
  const addItems = (items) => { setCart((c) => ({ ...c, items: [...c.items, ...items].slice(0, 30) })); setOpen(null); };
  const removeItem = (i) => setCart((c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }));
  const chosen = books.filter((b) => cart.books.includes(b.id));
  const postage = Math.max(0, ...cart.items.filter((x) => x.physical).map((x) => x.postage_cents || 0));
  const total = chosen.reduce((n, b) => n + b.price_cents, 0) + cart.items.reduce((n, x) => n + x.unit_cents * x.qty, 0) + postage;
  const posted = cart.items.some((x) => x.physical);
  const empty = !chosen.length && !cart.items.length;

  const checkout = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter your email address for the receipt and download links."); return; }
    setBusy(true);
    try {
      const r = await fetch(`${API}/shop/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        book_ids: chosen.map((b) => b.id), email: email.trim(), expected_total_cents: total,
        items: cart.items.map(({ product_id, variant_id, qty, personalisation, gift_months }) => ({ product_id, variant_id, qty, personalisation, gift_months: gift_months || null })),
      }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j.detail || "Could not start checkout.");
      setCart({ books: [], items: [] });
      window.location.assign(j.url);
    } catch (e) { setError(e.message); setBusy(false); }
  };
  const openPrinted = (opt) => { const p = products.find((x) => x.id === opt.product_id); if (p) setOpen({ p, variant: opt.variant_id }); };
  const chips = [["all", "Everything"], ...(books.length ? [["quest-books", "Quest Books (PDF)"]] : []), ...(hasSeasonal ? [["seasonal", "Seasonal"]] : []), ...(data.departments || []).map((d) => [d.id, d.label])];

  return (
    <section id="shop" className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 py-14" aria-labelledby="shop-heading" data-testid="public-shop">
      <div className="text-center mb-6">
        <h2 id="shop-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: GREEN }}>The Side-Quest shop</h2>
        <p className="mt-2 text-stone-700">Printable workbooks, printed books and Side-Quest goodies. No account needed: pay securely on Square.</p>
      </div>
      {chips.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6" role="tablist" aria-label="Shop departments">
          {chips.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={dept === id} onClick={() => setDept(id)} className="rounded-full px-3 py-1 text-sm font-semibold border" style={dept === id ? { backgroundColor: GREEN, color: "#F5EFE0", borderColor: GREEN } : { borderColor: "#D4C8A8", color: GREEN }}>{label}</button>)}
        </div>
      )}
      {showBooks && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {books.map((b) => {
            const printed = (b.printed || []).filter((o) => o.can_buy);
            return (
              <div key={b.id} className="flex flex-col gap-2" data-testid={`shop-book-${b.id}`}>
                <Cover book={b} />
                <div className="text-sm font-bold text-slate-900 leading-tight">{b.title}</div>
                <div className="text-xs text-stone-600">{b.year_label} · {b.subject_label}{b.pages ? ` · ${b.pages} pages` : ""}</div>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="font-bold text-slate-900 mr-auto">{money(b.price_cents)} <span className="text-xs font-normal text-stone-500">PDF</span></span>
                  {b.look_pages > 0 && <button type="button" onClick={() => setLook(b)} className="text-xs font-semibold underline">Look inside</button>}
                  <button type="button" onClick={() => toggle(b.id)} className="rounded-lg px-2.5 py-1 text-xs font-bold" style={inCart(b.id) ? { border: `1px solid ${GREEN}`, color: GREEN } : { backgroundColor: GREEN, color: "#F5EFE0" }}>{inCart(b.id) ? "✓ In cart" : "Add"}</button>
                </div>
                {printed.map((o) => (
                  <button key={o.variant_id} type="button" onClick={() => openPrinted(o)} className="text-left text-xs font-semibold underline" style={{ color: GREEN }} data-testid={`shop-printed-${b.id}`}>{o.title} · {money(o.price_cents)}</button>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {dept !== "quest-books" && shown.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {shown.map((p) => (
            <button key={p.id} type="button" onClick={() => setOpen({ p })} className="flex flex-col gap-2 text-left" data-testid={`shop-product-${p.slug}`}>
              <ProductImage p={p} />
              <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-bold ${BADGE[p.status] || "bg-stone-200"}`}>{p.status_label}</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{p.title}</span>
              {fromPrice(p) && <span className="text-sm font-bold" style={{ color: GREEN }}>{fromPrice(p)}{p.subscription ? " / month" : ""}</span>}
            </button>
          ))}
        </div>
      )}
      {!showBooks && !shown.length && <p className="text-center text-stone-600">New things are on their way.</p>}
      {!empty && (
        <div className="mt-8 paper-card p-5 space-y-3" data-testid="shop-cart">
          <h3 className="font-display text-xl font-bold" style={{ color: GREEN }}>Your cart</h3>
          <ul className="divide-y divide-stone-200">
            {chosen.map((b) => <li key={b.id} className="flex items-center gap-3 py-2 text-sm"><span className="mr-auto">{b.title} (PDF)</span><span className="font-semibold">{money(b.price_cents)}</span><button type="button" onClick={() => toggle(b.id)} className="text-stone-500 hover:text-rose-700" aria-label={`Remove ${b.title}`}>✕</button></li>)}
            {cart.items.map((x, i) => (
              <li key={i} className="flex items-center gap-3 py-2 text-sm">
                <span className="mr-auto">{x.qty > 1 ? `${x.qty} × ` : ""}{x.title}{Object.values(x.personalisation || {}).filter(Boolean).length ? <span className="text-stone-500"> · {Object.values(x.personalisation).filter(Boolean).join(", ")}</span> : null}</span>
                <span className="font-semibold">{money(x.unit_cents * x.qty)}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-stone-500 hover:text-rose-700" aria-label={`Remove ${x.title}`}>✕</button>
              </li>
            ))}
            {posted && <li className="flex items-center gap-3 py-2 text-sm"><span className="mr-auto">Postage (one parcel)</span><span className="font-semibold">{postage ? money(postage) : "Free"}</span></li>}
          </ul>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-semibold flex-1 min-w-[220px]">Your email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
            </label>
            <div className="text-lg font-bold" style={{ color: GREEN }}>Total {money(total)}</div>
            <button type="button" onClick={checkout} disabled={busy || !data.can_buy} className="rounded-xl px-5 py-2.5 font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }} data-testid="shop-checkout">{busy ? "Opening checkout…" : "Checkout securely"}</button>
          </div>
          {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
          <p className="text-xs text-stone-500">You'll pay on Square's secure checkout page{posted ? " and add your postal address there" : ""}, then come straight back here. Downloads are for your family's own use.</p>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-stone-600">Already bought something? <Link to="/shop/downloads" className="underline font-semibold">Get my downloads</Link></p>
      {look && <LookInside book={look} onClose={() => setLook(null)} inCart={inCart(look.id)} onAdd={() => { if (!inCart(look.id)) toggle(look.id); setLook(null); }} />}
      {open && <ProductDialog p={open.p} all={products} initialVariant={open.variant} onClose={() => setOpen(null)} onAdd={addItems} />}
    </section>
  );
}
