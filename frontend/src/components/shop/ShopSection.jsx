import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../lib/api";

// The public shop (no account). Shown only while the owner has it switched on in Owner HQ.
// Prices, stock and postage are always re-checked by the server at checkout; payment happens on Square's own page.
const KEY = "sq-shop-cart-v2";
const GREEN = "#1F3B2D";
const ordinal = (n) => { const x = Number(n); const s = ["th", "st", "nd", "rd"]; const v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
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
  // With options, a buyer must pick one, so the product's own price only counts when there are none.
  const main = p.variants.length ? p.variants.map((v) => v.price_cents ?? p.price_cents) : [p.price_cents];
  const prices = [...main, p.digital_cents].filter((x) => x != null);
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

function LookInside({ book, onClose, onAdd, inCart, onPrinted }) {
  const printed = (book.printed || []).filter((o) => o.can_buy);
  return (
    <Modal label={`Look inside ${book.title}`} onClose={onClose}>
      <div className="flex-1 overflow-y-auto bg-stone-100 p-3 space-y-3 select-none" onContextMenu={(e) => e.preventDefault()}>
        {book.look_pages > 0
          ? Array.from({ length: book.look_pages }, (_, i) => (
              <img key={i} src={`${API}/shop/books/${encodeURIComponent(book.id)}/look/${i + 1}`} alt={`Preview page ${i + 1}`} draggable={false} loading="lazy" className="mx-auto w-full max-w-[560px] rounded shadow pointer-events-none" />
            ))
          : <div className="mx-auto max-w-[260px]"><Cover book={book} /></div>}
      </div>
      <div className="border-t px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="mr-auto text-sm text-stone-600">{book.year_label} · {book.subject_label}{book.pages ? ` · ${book.pages} pages` : ""}</span>
        {printed.map((o) => (
          <button key={o.variant_id} type="button" onClick={() => onPrinted(o)} className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: GREEN, color: GREEN }} data-testid={`shop-printed-${book.id}`}>{o.title} · {money(o.price_cents)}</button>
        ))}
        <button type="button" onClick={onAdd} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }}>{inCart ? "✓ In your cart" : `Add PDF to cart · ${money(book.price_cents)}`}</button>
      </div>
    </Modal>
  );
}

const field = "mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 font-normal";

// Options cheapest first; equal prices keep the owner's order. An option without its own price uses the product price.
const byPrice = (p) => [...p.variants].map((v, i) => [v, i]).sort(([a, i], [b, j]) => (a.price_cents ?? p.price_cents ?? 0) - (b.price_cents ?? p.price_cents ?? 0) || i - j).map(([v]) => v);

function ProductDialog({ p, all, initialVariant, onClose, onAdd, defaultEmail = "" }) {
  const options = byPrice(p);
  const [variant, setVariant] = useState(initialVariant || (p.variants.length === 1 ? p.variants[0].id : ""));
  const [qty, setQty] = useState(1);
  const [childCount, setChildCount] = useState(1);
  const [pers, setPers] = useState({});
  const [img, setImg] = useState(1);
  const [addons, setAddons] = useState([]);
  const [email, setEmail] = useState(defaultEmail);
  const [recipient, setRecipient] = useState({ name: "", address_line_1: "", address_line_2: "", locality: "", state: "", postcode: "" });
  const [billingCadence, setBillingCadence] = useState("monthly");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);
  const hasDocumentSample = (p.tags || []).includes("home-education-document");
  const personalisedPlanner = (p.tags || []).some(t => t === "premium-planner-personalised" || t === "premium-planner-printed");
  const sampleUrl = `${API}/shop/products/${encodeURIComponent(p.id)}/document-sample`;
  const v = p.variants.find((x) => x.id === variant);
  const price = v ? v.price_cents : p.price_cents;
  const fortnightlyPrice = Number.isInteger(price) ? Math.round(price * 12 / 26) : null;
  const extras = (p.addons || []).map((id) => all.find((x) => x.id === id)).filter((x) => x && x.can_buy && !x.variants.length && !x.personalisation.length && !x.subscription);
  const max = Math.min(p.max_per_order || 20, 20);
  const missing = p.personalisation.find((f) => f.required && !(pers[f.key] || "").trim());
  const needVariant = p.variants.length > 0 && !v;
  const familyKind = (p.tags || []).includes("home-education-document") ? (p.tags || []).includes("premium-planner-personalised") ? "guided" : (p.tags || []).includes("premium-planner-printed") ? "printed" : (p.tags || []).includes("premium-planner-blank") ? "blank" : (p.tags || []).includes("guided-document") ? "guided" : (p.tags || []).includes("print-and-post") ? "printed" : (p.tags || []).includes("fillable-pdf") ? "blank" : null : null;
  const familyPrice = familyKind && Number.isInteger(price) ? price + (childCount - 1) * (familyKind === "blank" ? 100 : 200) : price;

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
    onAdd([{ product_id: p.id, variant_id: v?.id || null, qty: familyKind ? 1 : qty, child_count: familyKind ? childCount : undefined, personalisation: pers, title: `${p.title}${v ? ` (${v.name})` : ""}${familyKind ? ` (${childCount} children)` : ""}`, unit_cents: familyKind ? familyPrice : price, postage_cents: p.postage_cents || 0, physical: p.fulfilment !== "digital", included_postage: !!p.postage_included || (p.tags || []).some(t => ["premium-planner-printed","print-and-post"].includes(t)) },
      ...extras.filter((x) => addons.includes(x.id)).map((x) => ({ product_id: x.id, variant_id: null, qty: 1, personalisation: {}, title: x.title, unit_cents: x.price_cents, postage_cents: x.postage_cents || 0, physical: x.fulfilment !== "digital" }))]);
  };
  const subscribe = async () => {
    if (needVariant) { setError("Choose an option first."); return; }
    const j = await post("/shop/subscribe", { product_id: p.id, variant_id: v?.id || null, email: email.trim(), recipient, personalisation: pers, billing_cadence: billingCadence });
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
            {p.fulfilment !== "digital" && <p className="text-xs text-stone-500" data-testid="shop-image-disclaimer">Actual product may vary from image.</p>}
          </div>
          <div className="space-y-2 text-sm">
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${BADGE[p.status] || "bg-stone-200"}`}>{p.status_label}</span>
            {(v ? price != null : fromPrice(p)) && <p className="text-2xl font-bold" style={{ color: GREEN }} data-testid="shop-dialog-price">{v ? money(price) : fromPrice(p)}{p.subscription ? <span className="text-sm font-normal"> / month</span> : null}</p>}
            {p.subscription && p.one_off_cents != null && price != null && p.one_off_cents > price && <p className="text-sm text-stone-700">Or {money(p.one_off_cents)} for a single box. Subscribers save {Math.round((1 - price / p.one_off_cents) * 100)}%.</p>}
            {p.subscription && p.cutoff_day && p.dispatch_day && <p className="text-sm text-stone-600">📦 Order by the {ordinal(p.cutoff_day)} of the month and your box ships around the {ordinal(p.dispatch_day)}{p.dispatch_day <= p.cutoff_day ? " of the following month" : ""}.</p>}
            {p.description && <p className="text-stone-700 whitespace-pre-line">{p.description}</p>}
            {personalisedPlanner && p.can_buy && <Link to={"/shop/configure-planner/"+encodeURIComponent(p.id)} className="inline-block rounded-xl bg-[#1F3B2D] px-3 py-2 text-white text-sm font-semibold" data-testid="shop-configure-planner">Personalise before checkout</Link>}
            {hasDocumentSample && <button type="button" onClick={() => setSampleOpen((old) => !old)} className="rounded-xl border border-[#1F3B2D] px-3 py-2 text-sm font-semibold text-[#1F3B2D]" data-testid="shop-document-sample-toggle">{sampleOpen ? "Hide sample pages" : "Look inside — free sample"}</button>}
            {p.postage_included && <p className="font-semibold text-emerald-800" data-testid="shop-postage-included">Postage included</p>}
            {p.dispatch_estimate && <p className="text-stone-600">Dispatch: {p.dispatch_estimate}</p>}
            {p.preorder_closes_at && <p className="text-stone-600">Pre-orders close {new Date(p.preorder_closes_at).toLocaleDateString("en-AU", { dateStyle: "medium" })}</p>}
            {p.preorder_progress && <p className="text-stone-600">{p.preorder_progress.ordered} of {p.preorder_progress.target} pre-ordered</p>}
            {p.low_stock && <p className="font-semibold text-amber-800">Only a few left</p>}
          </div>
        </div>
        {hasDocumentSample && sampleOpen && <section className="space-y-3 rounded-xl border border-stone-300 bg-[#F9F8F0] p-3" data-testid="shop-document-sample">
          <p className="font-semibold text-[#1F3B2D]">Preview sample pages</p>
          <p className="text-xs text-stone-700">A sample from the flexible-year document. Complete only the sections that apply to your child. Self-guided workbooks are PDF downloads, not online planning sessions; personalised and printed products require separate fulfilment.</p>
          <iframe title={`Flexible-year sample PDF for ${p.title}`} src={sampleUrl} className="w-full h-[380px] rounded-lg border border-stone-200 bg-white"/>
          <a href={sampleUrl} target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold underline text-[#1F3B2D]">Open sample PDF in a new tab</a>
          <p className="text-xs text-stone-600">Sample only. Not a full download or government-issued form.</p>
        </section>}
        {(p.can_buy || p.subscription) && (
          <div className="space-y-3">
            {p.variants.some((x) => x.details) ? (
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold mb-1">Choose your option</legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {options.map((x) => (
                    <label key={x.id} className={`rounded-xl border-2 p-3 cursor-pointer ${variant === x.id ? "border-emerald-700 bg-emerald-50" : "border-stone-200"} ${x.available ? "" : "opacity-50"}`}>
                      <input type="radio" name={`opt-${p.id}`} className="sr-only" disabled={!x.available} checked={variant === x.id} onChange={() => setVariant(x.id)} />
                      <span className="flex items-baseline justify-between gap-2"><span className="font-bold text-slate-900">{x.name}</span>{x.price_cents != null && <span className="font-bold" style={{ color: GREEN }}>{money(x.price_cents)}</span>}</span>
                      {x.details && <ul className="mt-2 space-y-0.5 text-xs text-stone-700">{x.details.split(/\n+/).filter(Boolean).map((line, k) => <li key={k} className="flex gap-1.5"><span style={{ color: GREEN }}>✓</span>{line.replace(/^[-•*]\s*/, "")}</li>)}</ul>}
                      {!x.available && <span className="text-xs text-rose-700">Sold out</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : p.variants.length > 0 && (
              <label className="block text-sm font-semibold">{p.prints_books ? "Which book?" : "Option"}
                <select value={variant} onChange={(e) => setVariant(e.target.value)} className={field}>
                  <option value="">Choose…</option>
                  {options.map((x) => <option key={x.id} value={x.id} disabled={!x.available}>{x.name}{x.price_cents != null && x.price_cents !== p.price_cents ? ` · ${money(x.price_cents)}` : ""}{x.available ? "" : " (sold out)"}</option>)}
                </select>
              </label>
            )}
            {p.personalisation.map((f) => (
              <label key={f.key} className="block text-sm font-semibold">{f.label}{f.required ? " *" : ""}
                <input value={pers[f.key] || ""} maxLength={f.max} onChange={(e) => setPers({ ...pers, [f.key]: e.target.value })} className={field} />
              </label>
            ))}
            {familyKind && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-2">
              <label className="block text-sm font-semibold">Number of children in your household
                <select className={field} value={childCount} onChange={(e) => setChildCount(Number(e.target.value))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? "child" : "children"}</option>)}
                </select>
              </label>
              <p className="font-bold" style={{color: GREEN}}>{familyPrice == null ? "Price pending" : `${money(familyPrice)} total`}</p>
              <p className="text-xs text-stone-700">First child included. Each additional child: {familyKind === "blank" ? "$1" : "$2"}. Each learner receives an individual document.</p>
            </div>}
            {!familyKind && !p.subscription && max > 1 && (
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
                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold">How would you like to pay?</legend>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name={`billing-${p.id}`} checked={billingCadence==="monthly"} onChange={()=>setBillingCadence("monthly")}/>Monthly · {money(price)} per month</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name={`billing-${p.id}`} checked={billingCadence==="fortnightly"} onChange={()=>setBillingCadence("fortnightly")}/>Fortnightly · {money(fortnightlyPrice)} every 2 weeks</label>
                  <p className="text-xs text-stone-600">One delivery each month, not fortnightly. Both instalments must clear before the next mail is sent. Some months have an extra fortnightly payment; those credits carry forward to later editions.</p>
                </fieldset>
                <p className="text-sm font-semibold">Who is it for? (they can be a child, grandchild or anyone you're gifting to)</p>
                {[["name", "Their name"], ["address_line_1", "Street address"], ["address_line_2", "Unit, building (optional)"], ["locality", "Suburb or town"], ["state", "State"], ["postcode", "Postcode"]].map(([k, l]) => (
                  <input key={k} placeholder={l} aria-label={l} value={recipient[k]} onChange={(e) => setRecipient({ ...recipient, [k]: e.target.value })} className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                ))}
                <input type="email" placeholder="Your email (for receipts and managing it)" aria-label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" />
                <p className="text-xs text-stone-500">Billed {billingCadence==="fortnightly"?"every two weeks":"monthly"} by Square. Cancel any time from the private link we email you. Monthly mail dispatch is unchanged.</p>
                {p.one_off_cents != null && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">Just want one box?</p>
                    <button type="button" onClick={() => { if (needVariant) { setError("Choose an option first."); return; } onAdd([{ product_id: p.id, variant_id: v?.id || null, qty: 1, one_off: true, personalisation: pers, title: `${p.title}${v ? ` (${v.name})` : ""} – one-off box`, unit_cents: p.one_off_cents, postage_cents: 0, physical: true }]); }}
                      className="mt-1 rounded-lg border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: GREEN, color: GREEN }} data-testid="shop-one-off">Add one box to cart · {money(p.one_off_cents)}</button>
                    <p className="text-xs text-stone-500 mt-1">One payment, no subscription. Postage is added at checkout.</p>
                  </div>
                )}
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
        {p.digital_cents != null && (
          <div className="rounded-xl border border-stone-300 p-3 flex flex-wrap items-center gap-3" data-testid="shop-digital-option">
            <div className="flex-1 min-w-[200px] text-sm">
              <p className="font-semibold">Digital version · {money(p.digital_cents)}</p>
              <p className="text-stone-600">A download (PDF) so you can make it with your own materials. No postage.</p>
            </div>
            <button type="button" onClick={() => onAdd([{ product_id: p.id, variant_id: null, qty: 1, digital: true, personalisation: {}, title: `${p.title} – digital version`, unit_cents: p.digital_cents, postage_cents: 0, physical: false }])}
              className="rounded-xl border px-3 py-2 text-sm font-bold" style={{ borderColor: GREEN, color: GREEN }} data-testid="shop-add-digital">Add digital version</button>
          </div>
        )}
        {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
        {msg && <p className="text-sm text-emerald-800" role="status">{msg}</p>}
      </div>
      <div className="border-t px-4 py-3 flex justify-end gap-2">
        {p.can_buy && !p.subscription && <button type="button" onClick={add} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }} data-testid="shop-product-add">Add to cart{price != null ? ` · ${money(price * qty)}` : ""}</button>}
        {p.can_buy && p.subscription && <button type="button" onClick={subscribe} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }}>{busy ? "Opening checkout…" : `Subscribe · ${money(billingCadence==="fortnightly"?fortnightlyPrice:price)} ${billingCadence==="fortnightly"?"/ fortnight":"/ month"}`}</button>}
        {!p.can_buy && p.can_register_interest && !msg && <button type="button" onClick={interest} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }} data-testid="shop-register-interest">Register interest</button>}
      </div>
    </Modal>
  );
}

function BookCard({ b, inCart, onToggle, onLook }) {
  const printed = (b.printed || []).some((o) => o.can_buy);
  return (
    <div className="flex flex-col gap-1.5" data-testid={`shop-book-${b.id}`}>
      <button type="button" onClick={onLook} className="block text-left" aria-label={`Look inside ${b.title}`}><Cover book={b} /></button>
      <div className="text-sm font-bold text-slate-900 leading-tight">{b.title}</div>
      <div className="text-xs text-stone-600">{b.year_label} · {b.subject_label}{printed ? " · printed copy too" : ""}</div>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <span className="font-bold text-slate-900 mr-auto">{money(b.price_cents)} <span className="text-xs font-normal text-stone-500">PDF</span></span>
        <button type="button" onClick={onToggle} className="rounded-lg px-3 py-1 text-xs font-bold" style={inCart ? { border: `1px solid ${GREEN}`, color: GREEN } : { backgroundColor: GREEN, color: "#F5EFE0" }}>{inCart ? "✓ In cart" : "Add"}</button>
      </div>
    </div>
  );
}

function ProductCard({ p, onOpen }) {
  // "In stock" is the normal case; only unusual states get a badge.
  const badge = p.status !== "in_stock" || p.low_stock;
  return (
    <button type="button" onClick={onOpen} className="flex flex-col gap-1.5 text-left" data-testid={`shop-product-${p.slug}`}>
      <ProductImage p={p} />
      <span className="text-sm font-bold text-slate-900 leading-tight">{p.title}</span>
      <span className="flex items-center gap-2">
        {fromPrice(p) && <span className="text-sm font-bold" style={{ color: GREEN }}>{fromPrice(p)}{p.subscription ? " / month" : ""}</span>}
        {p.fulfilment === "digital" && <span className="rounded-full px-2 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-900">Download</span>}
        {badge && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${p.low_stock && p.status === "in_stock" ? "bg-amber-100 text-amber-900" : BADGE[p.status] || "bg-stone-200"}`}>{p.low_stock && p.status === "in_stock" ? "Only a few left" : p.status_label}</span>}
      </span>
    </button>
  );
}

const PREVIEW = 4; // items per department on the "Everything" page

export default function ShopSection({ standalone = false, defaultEmail = "", inAccount = false, closedNote = null }) {
  const [data, setData] = useState(null);
  const [cart, setCart] = useState(readCart);
  const [look, setLook] = useState(null);
  const [open, setOpen] = useState(null);
  const [dept, setDept] = useState("all");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [postcode, setPostcode] = useState("");
  const [shippingQuote, setShippingQuote] = useState(null);
  const [shippingBusy, setShippingBusy] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const posted = cart.items.some((x) => x.physical && !x.gift_months && !x.included_postage);
  const itemsKey = JSON.stringify(cart.items.map(({ product_id, variant_id, qty, child_count, personalisation, gift_months, digital }) => ({ product_id, variant_id, qty, child_count, personalisation, gift_months: gift_months || null, digital: digital === true })));
  const validQuote = posted && shippingQuote?.postcode === postcode && shippingQuote?.itemsKey === itemsKey ? shippingQuote : null;

  useEffect(() => {
    if (!posted || !/^[0-9]{4}$/.test(postcode)) {
      setShippingQuote(null); setShippingBusy(false); setShippingError(""); return;
    }
    const controller = new AbortController();
    setShippingBusy(true); setShippingQuote(null); setShippingError("");
    const delay = setTimeout(async () => {
      try {
        const response = await fetch(`${API}/shop/postage/quote`, {
          method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
          body: JSON.stringify({ postcode, items: JSON.parse(itemsKey) }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !Number.isInteger(result.postage_cents) || result.postage_cents <= 0)
          throw new Error(result.detail || "Couldn't calculate postage. Please check your postcode.");
        if (!controller.signal.aborted) setShippingQuote({ ...result, postcode, itemsKey });
      } catch (e) {
        if (!controller.signal.aborted) setShippingError(e.message || "Postage is temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setShippingBusy(false);
      }
    }, 350);
    return () => { clearTimeout(delay); controller.abort(); };
  }, [posted, postcode, itemsKey]);

  useEffect(() => { fetch(`${API}/shop`).then((r) => r.json()).then(setData).catch(() => setData({ open: false })); }, []);
  useEffect(() => writeCart(cart), [cart]);
  useEffect(() => { if (!added) return undefined; const t = setTimeout(() => setAdded(""), 3500); return () => clearTimeout(t); }, [added]);
  const products = useMemo(() => data?.products || [], [data]);
  if (!data) return standalone ? <p className="p-8 text-center text-stone-600">Loading the shop…</p> : null;
  if (!data.open) return standalone ? <p className="p-8 text-center text-stone-600">{closedNote || "The shop isn't open yet. Check back soon!"}</p> : null;
  const books = data.books || [];
  const term = query.trim().toLowerCase();
  const matches = (...fields) => !term || fields.some((f) => String(f || "").toLowerCase().includes(term));
  const shownBooks = books.filter((b) => matches(b.title, b.year_label, b.subject_label));
  const shownProducts = products.filter((p) => matches(p.title, p.description, p.collection));
  const hasSeasonal = products.some((p) => p.tags.includes("seasonal"));
  const departments = data.departments || [];

  const inCart = (id) => cart.books.includes(id);
  const toggle = (id) => {
    const adding = !cart.books.includes(id);
    setCart((c) => ({ ...c, books: adding ? [...c.books, id] : c.books.filter((x) => x !== id) }));
    if (adding) setAdded(books.find((b) => b.id === id)?.title || "Book");
  };
  const addItems = (items) => {
    setCart((c) => {
      const fresh = items.filter((x) => !x.digital || !c.items.some((y) => y.digital && y.product_id === x.product_id));
      return { ...c, items: [...c.items, ...fresh].slice(0, 30) };
    });
    setOpen(null); setAdded(items[0]?.title || "Item");
  };
  const removeItem = (i) => setCart((c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }));
  const chosen = books.filter((b) => cart.books.includes(b.id));
  const postage = validQuote?.postage_cents || 0;
  const subtotal = chosen.reduce((n, b) => n + b.price_cents, 0) + cart.items.reduce((n, x) => n + x.unit_cents * x.qty, 0);
  const total = subtotal + postage;
  const count = chosen.length + cart.items.reduce((n, x) => n + x.qty, 0);
  const empty = count === 0;

  const checkout = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter your email address for the receipt and download links."); return; }
    if (posted && !validQuote) { setError("Enter your delivery postcode and obtain a Parcel Post quote before paying."); return; }
    setBusy(true);
    try {
      const r = await fetch(`${API}/shop/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        book_ids: chosen.map((b) => b.id), email: email.trim(), expected_total_cents: total, destination_postcode: posted ? postcode : null,
        items: cart.items.map(({ product_id, variant_id, qty, child_count, personalisation, gift_months, one_off, digital }) => ({ product_id, variant_id, qty, child_count, personalisation, gift_months: gift_months || null, one_off: one_off === true, digital: digital === true })),
      }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j.detail || "Could not start checkout.");
      setCart({ books: [], items: [] });
      window.location.assign(j.url);
    } catch (e) { setError(e.message); setBusy(false); }
  };
  const openPrinted = (opt) => { const p = products.find((x) => x.id === opt.product_id); if (p) { setLook(null); setOpen({ p, variant: opt.variant_id }); } };
  const hasHomeDocuments = shownProducts.some((p) => (p.tags || []).includes("home-education-document"));
  const chips = [["all", "Everything"], ...(hasHomeDocuments ? [["home-education", "Home Education Documents"]] : []), ...(books.length ? [["quest-books", "Quest Books"]] : []), ...(hasSeasonal ? [["seasonal", "Seasonal"]] : []), ...departments.filter((d) => d.id !== "home-education").map((d) => [d.id, d.label])];

  // What to show: one department, or on "Everything" a short row from each, with "See all".
  const groups = [];
  const inDept = (id) => id === "home-education"
    ? shownProducts.filter((p) => (p.tags || []).includes("home-education-document"))
    : id === "seasonal"
      ? shownProducts.filter((p) => p.tags.includes("seasonal") && !(p.tags || []).includes("home-education-document"))
      : shownProducts.filter((p) => p.department === id && !(p.tags || []).includes("home-education-document"));
  if (dept === "all") {
    const documents = inDept("home-education");
    if (documents.length) groups.push({ id:"home-education", label:"Home Education Documents", products:documents });
    if (shownBooks.length) groups.push({ id: "quest-books", label: "Quest Books (PDF)", books: shownBooks });
    for (const d of departments.filter((d) => d.id !== "home-education")) { const items = inDept(d.id); if (items.length) groups.push({ id: d.id, label: d.label, products: items }); }
  } else if (dept === "quest-books") {
    groups.push({ id: "quest-books", label: "Quest Books (PDF)", books: shownBooks, full: true });
  } else {
    groups.push({ id: dept, label: chips.find(([id]) => id === dept)?.[1], products: inDept(dept), full: true });
  }
  const grid = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7";

  return (
    <section id="shop" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10" aria-labelledby="shop-heading" data-testid="public-shop">
      <div className="mb-4">
        <h2 id="shop-heading" className="font-display text-3xl md:text-4xl font-bold" style={{ color: GREEN }}>The Side-Quest shop</h2>
        <p className="mt-1 text-stone-700">{inAccount ? "Workbooks, printed books and Side-Quest goodies." : "Workbooks, printed books and Side-Quest goodies. No account needed."}</p>
      </div>

      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#F5EFE0]/95 backdrop-blur border-b border-stone-200 space-y-2">
        <div className="flex items-center gap-2">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the shop" aria-label="Search the shop"
            className="flex-1 min-w-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm" />
          <button type="button" onClick={() => setCartOpen(true)} className="relative shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }} data-testid="shop-cart-button" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            🛒 Cart{count ? ` · ${money(subtotal)}` : ""}
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-[11px] text-white" data-testid="shop-cart-count">{count}</span>}
          </button>
        </div>
        {chips.length > 2 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Shop departments">
            {chips.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={dept === id} onClick={() => setDept(id)} className="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold border" style={dept === id ? { backgroundColor: GREEN, color: "#F5EFE0", borderColor: GREEN } : { borderColor: "#D4C8A8", color: GREEN, backgroundColor: "white" }}>{label}</button>)}
          </div>
        )}
      </div>

      {added && (
        <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-lg" data-testid="shop-added">
          <span>Added to cart: <b>{added.length > 40 ? `${added.slice(0, 40)}…` : added}</b></span>
          <button type="button" onClick={() => { setAdded(""); setCartOpen(true); }} className="font-bold underline">View cart</button>
        </div>
      )}

      <div className="mt-6 space-y-10">
        {groups.map((g) => {
          const list = g.books || g.products || [];
          const visible = g.full ? list : list.slice(0, PREVIEW);
          return (
            <div key={g.id} data-testid={`shop-group-${g.id}`}>
              {(!g.full || groups.length > 1) && (
                <div className="flex items-baseline justify-between gap-3 mb-3 border-b border-stone-300 pb-1">
                  <h3 className="font-display text-xl font-bold" style={{ color: GREEN }}>{g.label}</h3>
                  {!g.full && list.length > PREVIEW && <button type="button" onClick={() => setDept(g.id)} className="text-sm font-semibold underline shrink-0" style={{ color: GREEN }}>See all {list.length}</button>}
                </div>
              )}
              {visible.length ? (
                <div className={grid}>
                  {g.books
                    ? visible.map((b) => <BookCard key={b.id} b={b} inCart={inCart(b.id)} onToggle={() => toggle(b.id)} onLook={() => setLook(b)} />)
                    : visible.map((p) => <ProductCard key={p.id} p={p} onOpen={() => setOpen({ p })} />)}
                </div>
              ) : <p className="text-stone-600">{term ? "Nothing matches your search here." : "New things are on their way."}</p>}
            </div>
          );
        })}
        {!groups.length && <p className="text-center text-stone-600">{term ? `Nothing matches "${query}".` : "New things are on their way."}</p>}
      </div>

      <p className="mt-10 text-center text-sm text-stone-600">Already bought something? <Link to="/shop/downloads" className="underline font-semibold">Get my downloads</Link></p>
      <p className="mt-2 text-center text-xs text-stone-500">Photos are for illustration. Actual products may vary from images in colour, size or design.</p>

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={() => setCartOpen(false)} role="dialog" aria-modal="true" aria-label="Your cart">
          <div className="w-full max-w-md h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()} data-testid="shop-cart">
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <h3 className="mr-auto font-display text-xl font-bold" style={{ color: GREEN }}>Your cart{count ? ` (${count})` : ""}</h3>
              <button type="button" onClick={() => setCartOpen(false)} className="rounded-full px-3 py-1 text-sm hover:bg-stone-100" aria-label="Close cart">✕</button>
            </div>
            {empty ? (
              <div className="flex-1 grid place-items-center p-6 text-center text-stone-600">
                <div><p>Your cart is empty.</p><button type="button" onClick={() => setCartOpen(false)} className="mt-3 underline font-semibold" style={{ color: GREEN }}>Keep shopping</button></div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  <ul className="divide-y divide-stone-200">
                    {chosen.map((b) => <li key={b.id} className="flex items-center gap-3 py-2 text-sm"><span className="mr-auto">{b.title} <span className="text-stone-500">(PDF)</span></span><span className="font-semibold">{money(b.price_cents)}</span><button type="button" onClick={() => toggle(b.id)} className="text-stone-500 hover:text-rose-700" aria-label={`Remove ${b.title}`}>✕</button></li>)}
                    {cart.items.map((x, i) => (
                      <li key={i} className="flex items-center gap-3 py-2 text-sm">
                        <span className="mr-auto">{x.qty > 1 ? `${x.qty} × ` : ""}{x.title}{x.included_postage ? <span className="text-emerald-800"> · postage included</span> : null}{Object.values(x.personalisation || {}).filter(Boolean).length ? <span className="text-stone-500"> · {Object.values(x.personalisation).filter(Boolean).join(", ")}</span> : null}</span>
                        <span className="font-semibold">{money(x.unit_cents * x.qty)}</span>
                        <button type="button" onClick={() => removeItem(i)} className="text-stone-500 hover:text-rose-700" aria-label={`Remove ${x.title}`}>✕</button>
                      </li>
                    ))}
                    {posted && <li className="flex items-center gap-3 py-2 text-sm"><span className="mr-auto">Standard Parcel Post (one parcel)</span><span className="font-semibold">{validQuote ? money(postage) : "Enter postcode"}</span></li>}
                  </ul>
                  {posted && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">Australian delivery postcode
                        <input inputMode="numeric" autoComplete="postal-code" maxLength={4} value={postcode} onChange={(e) => setPostcode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))} placeholder="e.g. 2340" className={field} aria-label="Delivery postcode" />
                      </label>
                      <p className="text-xs text-stone-600">Tracked Parcel Post. Enter the same postcode on Square's payment page. Orders go out in the weekly dispatch.</p>
                      {shippingBusy && <p className="text-sm text-stone-600">Calculating postage…</p>}
                      {validQuote && <p className="text-sm font-semibold text-emerald-800">Parcel Post to {postcode}: {money(validQuote.postage_cents)}</p>}
                      {shippingError && <p className="text-sm text-rose-700" role="alert">{shippingError}</p>}
                    </div>
                  )}
                  <label className="block text-sm font-semibold">Your email (for the receipt{chosen.length || cart.items.some((x) => !x.physical) ? " and downloads" : ""})
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
                  </label>
                </div>
                <div className="border-t px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-lg font-bold" style={{ color: GREEN }}><span>Total</span><span>{money(total)}</span></div>
                  <button type="button" onClick={checkout} disabled={busy || !data.can_buy || (posted && !validQuote)} className="w-full rounded-xl px-5 py-3 font-bold text-white disabled:opacity-60" style={{ backgroundColor: GREEN }} data-testid="shop-checkout">{busy ? "Opening checkout…" : "Checkout securely"}</button>
                  {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
                  <p className="text-xs text-stone-500">You'll pay on Square's secure page{posted ? " and add your postal address there" : ""}, then come straight back. Downloads are for your family's own use.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {look && <LookInside book={look} onClose={() => setLook(null)} inCart={inCart(look.id)} onPrinted={openPrinted} onAdd={() => { if (!inCart(look.id)) toggle(look.id); setLook(null); }} />}
      {open && <ProductDialog p={open.p} all={products} initialVariant={open.variant} onClose={() => setOpen(null)} onAdd={addItems} defaultEmail={defaultEmail} />}
    </section>
  );
}
