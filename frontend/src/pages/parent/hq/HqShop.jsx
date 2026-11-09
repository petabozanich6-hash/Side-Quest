import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../../lib/api";
import { adminApi, errorText } from "../../../lib/adminApi";
import { Alert, Button, Card, fmtDate, GREEN, Stat } from "./ui";
import { useAdmin } from "./useAdmin";

// Owner HQ → Shop: the launch dashboard, every product (switch on/off, edit, photos, variants), orders to post,
// interest lists and subscriptions. Nothing here opens the shop: that's the "Public shop" switch in Settings.
const ordinal = (n) => { const x = Number(n); const s = ["th", "st", "nd", "rd"]; const v = x % 100; return `${x}${s[(v - 20) % 10] || s[v] || s[0]}`; };
const money = (c) => (c == null ? "—" : `$${(c / 100).toFixed(2)}`);
const toCents = (v) => (v === "" || v == null ? null : Math.round(Number(v) * 100));
const toDollars = (c) => (c == null ? "" : (c / 100).toFixed(2));
const input = "mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-normal";
const readFile = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
const STAGE_COLOURS = {
  launch_now: { bg: "#ECFDF5", fg: "#065F46", border: "#A7F3D0" },
  pro_manufacturing: { bg: "#EFF6FF", fg: "#1E40AF", border: "#BFDBFE" },
  future: { bg: "#FAF5FF", fg: "#6B21A8", border: "#E9D5FF" },
};
const VIEWS = [["dashboard", "Launch dashboard"], ["products", "Products"], ["orders", "Orders"], ["interest", "Interest lists"], ["subscriptions", "Subscriptions"]];

export default function HqShop() {
  const [view, setView] = useState("dashboard");
  return (
    <div className="space-y-5" data-testid="hq-shop">
      <header className="paper-card p-5 space-y-1">
        <h2 className="font-display text-2xl font-bold" style={{ color: GREEN }}>Shop</h2>
        <p className="text-sm text-stone-700">Products only appear when you switch them on <em>and</em> give them a status other than Draft. They only take payment with a price and a status of In Stock, Made to Order or Pre-order. The whole shop stays hidden until you turn on <Link to="/parent/command-centre/settings" className="underline">Public shop in Settings</Link>.</p>
      </header>
      <div className="flex flex-wrap gap-2" role="tablist">
        {VIEWS.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)} className="rounded-full px-3 py-1 text-sm font-semibold border" style={view === id ? { backgroundColor: GREEN, color: "white", borderColor: GREEN } : { borderColor: "#D4C8A8", color: GREEN }} data-testid={`hq-shop-view-${id}`}>{label}</button>)}
      </div>
      {view === "dashboard" && <Dashboard />}
      {view === "products" && <Products />}
      {view === "orders" && <Orders />}
      {view === "interest" && <Interest />}
      {view === "subscriptions" && <Subscriptions />}
    </div>
  );
}

function Dashboard() {
  const { data, error, loading } = useAdmin("/shop/dashboard");
  if (loading && !data) return <p>Loading…</p>;
  if (error) return <Alert>{error}</Alert>;
  const s = data.by_status;
  const toFulfil = (data.orders.to_fulfil?.count || 0) + (data.orders.packing?.count || 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Public shop" value={data.shop_open ? "Open" : "Off"} note={data.can_take_payments ? "Square connected" : "Square not configured"} />
        <Stat label="Products" value={data.total} note={`${data.visible} switched on · ${data.on_sale} on sale`} />
        <Stat label="Drafts" value={s.draft} note={`${s.coming_soon} coming soon · ${s.register_interest} register interest`} />
        <Stat label="Interest sign-ups" value={data.interest.signups} note={`${data.interest.people} people`} />
        <Stat label="Pre-orders" value={s.pre_order} note={`${data.preorders.filter((p) => p.reached).length} reached target`} />
        <Stat label="Orders to post" value={toFulfil} note={data.orders.address_review?.count ? `${data.orders.address_review.count} need address review` : undefined} />
        <Stat label="Ready to launch" value={data.ready_to_launch.length} note="Complete but switched off" />
        <Stat label="Subscriptions" value={(data.subscriptions.active || 0) + (data.subscriptions.past_due || 0)} note={data.subscriptions.past_due ? `${data.subscriptions.past_due} need attention` : "active"} />
      </div>
      {data.by_stage && (
        <Card title="Development stages">
          <div className="grid sm:grid-cols-3 gap-3">
            {data.by_stage.map((st) => (
              <div key={st.id} className="rounded-xl border p-3" style={{ borderColor: STAGE_COLOURS[st.id].border, backgroundColor: STAGE_COLOURS[st.id].bg }}>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: STAGE_COLOURS[st.id].fg }}>{st.label}</p>
                <p className="text-2xl font-bold text-slate-900">{st.total}</p>
                <p className="text-xs text-stone-600">{st.visible} switched on{st.id === "launch_now" ? ` · ${st.ready} ready` : ""}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2">Only Launch Now products can sell as In Stock or Made to Order. The others can collect interest or pre-orders while they wait.</p>
        </Card>
      )}
      {data.low_stock.length > 0 && <Card title="Low stock"><ul className="text-sm space-y-1">{data.low_stock.map((x, i) => <li key={i}>{x.title}: <strong>{x.stock}</strong> left</li>)}</ul></Card>}
      <Card title="Ready to launch">
        {data.ready_to_launch.length ? <ul className="text-sm space-y-1">{data.ready_to_launch.map((p) => <li key={p.id}>{p.title} <span className="text-stone-500">· {data.status_labels[p.status]}</span></li>)}</ul>
          : <p className="text-sm text-stone-600">Nothing yet. Physical products need a price, photo, description, supplier, unit cost, packed parcel measurements and a status that isn't Draft.</p>}
      </Card>
      {data.nearly_ready.length > 0 && <Card title="Nearly ready"><ul className="text-sm space-y-1">{data.nearly_ready.map((p) => <li key={p.id}>{p.title} <span className="text-stone-500">· needs {p.missing.join(", ")}</span></li>)}</ul></Card>}
      {data.preorders.length > 0 && <Card title="Pre-orders"><ul className="text-sm space-y-1">{data.preorders.map((p) => <li key={p.id}>{p.title}: {p.sold}{p.target ? ` / ${p.target}` : ""} {p.reached && <strong className="text-emerald-800">· target reached</strong>}{p.closes_at && <span className="text-stone-500"> · closes {fmtDate(p.closes_at)}</span>}</li>)}</ul></Card>}
      {data.interest.top.length > 0 && <Card title="Most wanted"><ul className="text-sm space-y-1">{data.interest.top.map((p) => <li key={p.id}>{p.title}: <strong>{p.interest}</strong></li>)}</ul></Card>}
      <Card title="By department">
        <ul className="text-sm grid sm:grid-cols-2 gap-1">{data.by_department.map((d) => <li key={d.id}>{d.label}: {d.visible} of {d.total} on</li>)}</ul>
      </Card>
    </div>
  );
}

/** An on/off switch: on shows the product in the shop, off takes it out (nothing is deleted). */
export function Switch({ on, onChange, disabled, label, testid }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} aria-label={`${label}: ${on ? "in the shop" : "hidden"}`} disabled={disabled} onClick={onChange} data-testid={testid}
      className="inline-flex items-center gap-2 disabled:opacity-50">
      <span className={`relative inline-block h-6 w-11 rounded-full transition-colors ${on ? "bg-emerald-700" : "bg-stone-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
      <span className={`text-xs font-semibold w-10 ${on ? "text-emerald-800" : "text-stone-500"}`}>{on ? "On" : "Off"}</span>
    </button>
  );
}

function Products() {
  const { data, error, loading, reload } = useAdmin("/shop/products");
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const [onOff, setOnOff] = useState("");
  const [stage, setStage] = useState("");
  const [picked, setPicked] = useState([]);
  const [editing, setEditing] = useState(null);
  const [walk, setWalk] = useState(null); // { ids, index } when working through a list one by one
  const [busy, setBusy] = useState(false);
  const products = useMemo(() => data?.products || [], [data]);
  const shown = useMemo(() => products.filter((p) => (!stage || p.stage === stage) && (!dept || p.department === dept) && (!status || p.status === status) && (!onOff || (onOff === "on") === p.visible)
    && (!q || `${p.title} ${p.collection} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()))), [products, q, dept, status, onOff, stage]);
  if (loading && !data) return <p>Loading…</p>;
  if (error) return <Alert>{error}</Alert>;
  const bulk = async (change, ids = picked) => {
    setBusy(true);
    try { await adminApi.post("/shop/products/bulk", { ids, ...change }); await reload(); toast.success("Saved"); }
    catch (e) { toast.error(errorText(e)); } finally { setBusy(false); }
  };
  const dLabel = Object.fromEntries(data.departments.map((d) => [d.id, d.label]));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Development stage">
        {[["", "All stages", products.length], ...data.stages.map((st) => [st, data.stage_labels[st], products.filter((p) => p.stage === st).length])].map(([id, label, n]) => {
          const on = stage === id;
          const c = STAGE_COLOURS[id] || { bg: "#F5F5F4", fg: "#1C1917", border: "#D6D3D1" };
          return <button key={id || "all"} type="button" role="tab" aria-selected={on} onClick={() => setStage(id)} data-testid={`hq-shop-stage-${id || "all"}`}
            className="rounded-full border px-3 py-1.5 text-xs font-bold" style={on ? { backgroundColor: c.fg, borderColor: c.fg, color: "white" } : { backgroundColor: c.bg, borderColor: c.border, color: c.fg }}>{label} · {n}</button>;
        })}
      </div>
      <div className="paper-card p-3 flex flex-wrap gap-2 items-end">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className="rounded-xl border border-stone-300 px-3 py-2 text-sm flex-1 min-w-[160px]" />
        <select value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department" className="rounded-xl border border-stone-300 px-2 py-2 text-sm"><option value="">All departments</option>{data.departments.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className="rounded-xl border border-stone-300 px-2 py-2 text-sm"><option value="">All statuses</option>{data.statuses.map((s) => <option key={s} value={s}>{data.status_labels[s]}</option>)}</select>
        <select value={onOff} onChange={(e) => setOnOff(e.target.value)} aria-label="On or off" className="rounded-xl border border-stone-300 px-2 py-2 text-sm"><option value="">On and off</option><option value="on">Switched on</option><option value="off">Switched off</option></select>
        <Button tone="plain" onClick={() => setEditing({})}>New product</Button>
        <Button disabled={!shown.length} onClick={() => setWalk({ ids: shown.map((p) => p.id), index: 0 })} data-testid="hq-shop-work-through">Work through these one by one ({shown.length})</Button>
      </div>
      {picked.length > 0 && (
        <div className="paper-card p-3 flex flex-wrap gap-2 items-center text-sm">
          <strong>{picked.length} selected</strong>
          <Button tone="plain" disabled={busy} onClick={() => bulk({ visible: true })}>Put in shop</Button>
          <Button tone="plain" disabled={busy} onClick={() => bulk({ visible: false })}>Take out of shop</Button>
          <select disabled={busy} defaultValue="" onChange={(e) => e.target.value && bulk({ status: e.target.value })} aria-label="Set status" className="rounded-xl border border-stone-300 px-2 py-2 text-sm"><option value="">Set status…</option>{data.statuses.map((s) => <option key={s} value={s}>{data.status_labels[s]}</option>)}</select>
          <select disabled={busy} value="" onChange={(e) => e.target.value && bulk({ fulfilment: e.target.value })} aria-label="Set how it's sold" className="rounded-xl border border-stone-300 px-2 py-2 text-sm" data-testid="hq-shop-bulk-format"><option value="">How it's sold…</option><option value="digital">Digital only</option><option value="physical">Physical</option></select>
          <select disabled={busy} defaultValue="" onChange={(e) => e.target.value && bulk({ stage: e.target.value })} aria-label="Set development stage" className="rounded-xl border border-stone-300 px-2 py-2 text-sm" data-testid="hq-shop-bulk-stage"><option value="">Set stage…</option>{data.stages.map((st) => <option key={st} value={st}>{data.stage_labels[st]}</option>)}</select>
          <Button tone="plain" onClick={() => setPicked([])}>Clear</Button>
        </div>
      )}
      <p className="text-xs text-stone-600">Tip: pick a department first, then "Work through these" to fill each product in turn. {shown.length} of {products.length} products · <button type="button" className="underline" onClick={() => setPicked(shown.map((p) => p.id))}>select all shown</button></p>
      <div className="paper-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-stone-600 border-b"><th className="p-2"></th><th className="p-2">In shop</th><th className="p-2">Product</th><th className="p-2">Stage</th><th className="p-2">Status</th><th className="p-2">Price</th><th className="p-2">Profit</th><th className="p-2">Interest</th></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id} className="border-b border-stone-100 align-top" data-testid={`hq-shop-row-${p.slug}`}>
                <td className="p-2"><input type="checkbox" aria-label={`Select ${p.title}`} checked={picked.includes(p.id)} onChange={() => setPicked((x) => (x.includes(p.id) ? x.filter((y) => y !== p.id) : [...x, p.id]))} /></td>
                <td className="p-2"><Switch on={p.visible} disabled={busy} label={p.title} onChange={() => bulk({ visible: !p.visible }, [p.id])} testid={`hq-shop-toggle-${p.slug}`} /></td>
                <td className="p-2 min-w-[220px]">
                  <button type="button" onClick={() => setEditing(p)} className="font-semibold text-left underline-offset-2 hover:underline" style={{ color: GREEN }}>{p.title}</button>
                  <div className="text-xs text-stone-500">{dLabel[p.department]}{p.collection ? ` · ${p.collection}` : ""}{p.variants.length ? ` · ${p.variants.length} options` : ""}</div>
                  {p.missing.length > 0 && <div className="text-xs text-amber-800">Needs {p.missing.join(", ")}</div>}
                </td>
                <td className="p-2 whitespace-nowrap"><span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: (STAGE_COLOURS[p.stage] || {}).bg, color: (STAGE_COLOURS[p.stage] || {}).fg }}>{data.stage_labels[p.stage] || "—"}</span></td>
                <td className="p-2 whitespace-nowrap">{data.status_labels[p.status]}</td>
                <td className="p-2 whitespace-nowrap">{money(p.price_cents)}</td>
                <td className="p-2 whitespace-nowrap">{p.profit ? `${money(p.profit.profit_cents)}${p.profit.cost_known ? "" : "*"}` : "—"}</td>
                <td className="p-2">{p.interest || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500">Profit = price − Square's 2.2% fee − your unit cost. * no unit cost entered yet.</p>
      {editing && <Editor product={editing} meta={data} all={products} onClose={() => setEditing(null)} onSaved={reload} />}
      {walk && (() => {
        const current = products.find((p) => p.id === walk.ids[walk.index]);
        if (!current) return null;
        const next = (removed) => {
          const ids = removed ? walk.ids.filter((x) => x !== current.id) : walk.ids;
          const index = removed ? walk.index : walk.index + 1;
          if (index >= ids.length) { setWalk(null); toast.success("That's the lot!"); } else setWalk({ ids, index });
        };
        return <Editor key={current.id} product={current} meta={data} all={products} onClose={() => setWalk(null)} onSaved={reload} queue={{ index: walk.index, total: walk.ids.length, next }} />;
      })()}
    </div>
  );
}

function AdminImage({ id, n }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let url = "";
    api.get(`/admin/shop/products/${id}/images/${n}`, { responseType: "blob", headers: { "X-SideQuest-Admin": "1" } })
      .then((r) => { url = URL.createObjectURL(r.data); setSrc(url); }).catch(() => setSrc(""));
    return () => url && URL.revokeObjectURL(url);
  }, [id, n]);
  return src ? <img src={src} alt="" className="h-20 w-20 rounded-lg object-cover border" /> : <div className="h-20 w-20 rounded-lg bg-stone-100 border" />;
}

const blank = { title: "", department: "books", collection: "", description: "", tags: [], status: "draft", fulfilment: "physical", personalisation: [], variants: [], bundle_items: [], addons: [], gift_months: [] };

// What each kind of product needs. Everything else is tucked under "More settings".
const KIND = {
  physical: { posted: true, stock: true, supplier: true },
  pre_order: { posted: true, supplier: true, timing: true },
  made_to_order: { posted: true, supplier: true, timing: true, personal: true },
  personalised: { posted: true, supplier: true, timing: true, personal: true },
  digital: { file: true },
  postal_subscription: { monthly: true, personal: true, supplier: true },
  subscription_box: { monthly: true, personal: true, supplier: true },
};

function Section({ title, hint, children }) {
  return (
    <section className="border-t pt-3 space-y-2 text-sm">
      <h4 className="font-display font-bold" style={{ color: GREEN }}>{title}</h4>
      {hint && <p className="text-xs text-stone-500 -mt-1">{hint}</p>}
      {children}
    </section>
  );
}

export function Editor({ product, meta, all, onClose, onSaved, queue }) {
  const isNew = !product.id;
  const init = (prod) => {
    const p = { ...blank, ...prod };
    return {
      ...p, tags: (p.tags || []).join(", "),
      price: toDollars(p.price_cents), wholesale: toDollars(p.wholesale_cents), postage: toDollars(p.postage_cents), one_off: toDollars(p.one_off_cents),
      digital: toDollars(p.digital_cents), digitalOn: p.digital_cents != null,
      preorder_closes_at: p.preorder_closes_at ? p.preorder_closes_at.slice(0, 10) : "",
      variants: (p.variants || []).map((v) => ({ ...v, price: toDollars(v.price_cents) })),
    };
  };
  const [f, setF] = useState(() => init(product));
  const [images, setImages] = useState(product.images || 0);
  const [more, setMore] = useState(isNew);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  // Physical only, physical with a digital version, or digital only. Switching to digital only remembers the
  // physical kind (stock, made to order, personalised…) so switching back restores it.
  const format = f.fulfilment === "digital" ? "digital" : f.digitalOn ? "both" : "physical";
  const setFormat = (mode) => setF((x) => {
    const physicalKind = x.fulfilment === "digital" ? x.lastPhysical || "physical" : x.fulfilment;
    if (mode === "digital") return { ...x, fulfilment: "digital", lastPhysical: physicalKind, digitalOn: false };
    return { ...x, fulfilment: physicalKind, digitalOn: mode === "both" };
  });
  const setVar = (i, k, v) => setF((x) => ({ ...x, variants: x.variants.map((y, j) => (j === i ? { ...y, [k]: v } : y)) }));
  const setField = (i, k, v) => setF((x) => ({ ...x, personalisation: x.personalisation.map((y, j) => (j === i ? { ...y, [k]: v } : y)) }));
  const others = all.filter((p) => p.id !== product.id);
  const kind = KIND[f.fulfilment] || KIND.physical;
  const dLabel = meta.departments.find((d) => d.id === f.department)?.label;
  const priceCents = toCents(f.price);
  const fee = priceCents != null ? Math.round(priceCents * 0.022) : null;

  const body = () => ({
    ...f, tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    price_cents: priceCents, wholesale_cents: toCents(f.wholesale), postage_cents: toCents(f.postage), one_off_cents: toCents(f.one_off),
    digital_cents: f.fulfilment !== "digital" && f.digitalOn ? toCents(f.digital) : null,
    preorder_closes_at: f.preorder_closes_at ? new Date(`${f.preorder_closes_at}T23:59:00`).toISOString() : null,
    variants: f.variants.map((v) => ({ id: v.id, name: v.name, sku: v.sku, price_cents: toCents(v.price), stock: v.stock === "" ? null : v.stock, active: v.active !== false, book_id: v.book_id, details: v.details || "" })),
  });
  const save = async (thenNext) => {
    setBusy(true); setErr("");
    try {
      if (isNew) await adminApi.post("/shop/products", body()); else await adminApi.put(`/shop/products/${product.id}`, body());
      toast.success("Saved"); await onSaved();
      if (thenNext && queue?.next) queue.next(); else onClose();
    } catch (e) { setErr(errorText(e)); } finally { setBusy(false); }
  };
  const addImage = async (file) => {
    if (!file) return;
    setBusy(true); setErr("");
    try { const r = await adminApi.post(`/shop/products/${product.id}/images`, { image: await readFile(file) }); setImages(r.images); }
    catch (e) { setErr(errorText(e)); } finally { setBusy(false); }
  };
  const removeImage = async (n) => {
    setBusy(true);
    try { const r = await adminApi.del(`/shop/products/${product.id}/images/${n}`); setImages(r.images); }
    catch (e) { setErr(errorText(e)); } finally { setBusy(false); }
  };
  const uploadFile = async (file) => {
    if (!file) return;
    setBusy(true); setErr("");
    try { await adminApi.post(`/shop/products/${product.id}/file`, { file: await readFile(file), name: file.name }); toast.success("File uploaded"); }
    catch (e) { setErr(errorText(e)); } finally { setBusy(false); }
  };
  const addBooks = async () => {
    setBusy(true); setErr("");
    try { const r = await adminApi.post(`/shop/products/${product.id}/book-variants`); toast.success(`Added ${r.added} Quest Books`); await onSaved(); onClose(); }
    catch (e) { setErr(errorText(e)); } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    setBusy(true);
    try { await adminApi.del(`/shop/products/${product.id}`); await onSaved(); if (queue?.next) queue.next(true); else onClose(); } catch (e) { setErr(errorText(e)); setBusy(false); }
  };
  const pick = (k, id) => set(k, f[k].includes(id) ? f[k].filter((x) => x !== id) : [...f[k], id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-3 overflow-y-auto" role="dialog" aria-modal="true" aria-label={isNew ? "New product" : `Edit ${product.title}`}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 space-y-4 my-6" data-testid="hq-shop-editor">
        <div className="flex items-start gap-2">
          <div className="mr-auto min-w-0">
            {queue && <p className="text-xs font-semibold text-stone-500">{queue.index + 1} of {queue.total}</p>}
            <h3 className="font-display text-xl font-bold" style={{ color: GREEN }}>{isNew ? "New product" : product.title}</h3>
            {!isNew && <p className="text-xs text-stone-500">{dLabel}{f.collection ? ` · ${f.collection}` : ""} · {meta.fulfilment_labels[f.fulfilment]}</p>}
          </div>
          <Button tone="plain" onClick={onClose}>Close</Button>
        </div>
        {product.missing?.length > 0 && <p className="rounded-xl bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900">Still needed before launch: {product.missing.join(", ")}</p>}

        <Section title="The basics">
          {isNew && <label className="block font-semibold">Title<input value={f.title} onChange={(e) => set("title", e.target.value)} className={input} /></label>}
          <label className="block font-semibold">Description customers see<textarea rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} className={input} /></label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block font-semibold">Status
              <select value={f.status} onChange={(e) => set("status", e.target.value)} className={input}>{meta.statuses.map((s) => <option key={s} value={s}>{meta.status_labels[s]}</option>)}</select>
            </label>
            <label className="block font-semibold">Development stage
              <select value={f.stage || ""} onChange={(e) => set("stage", e.target.value)} className={input} data-testid="hq-shop-stage">{!f.stage && <option value="">Choose…</option>}{meta.stages.map((st) => <option key={st} value={st}>{meta.stage_labels[st]}</option>)}</select>
            </label>
          </div>
          <fieldset>
            <legend className="font-semibold">How it's sold</legend>
            <div className="mt-1 grid sm:grid-cols-3 gap-2" data-testid="hq-shop-format">
              {[["physical", "Physical only", "Posted or delivered."], ["both", "Physical + digital", "Also sells a download, e.g. instructions or printables."], ["digital", "Digital only", "A download only, e.g. an instructional PDF or activity book."]].map(([mode, label, help]) => (
                <label key={mode} className={`rounded-xl border-2 p-2 cursor-pointer text-sm ${format === mode ? "border-emerald-700 bg-emerald-50" : "border-stone-200"}`}>
                  <input type="radio" name="format" className="sr-only" checked={format === mode} onChange={() => setFormat(mode)} data-testid={`hq-shop-format-${mode}`} />
                  <span className="block font-semibold">{label}</span><span className="block text-xs text-stone-600">{help}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {f.stage && f.stage !== "launch_now" && ["in_stock", "made_to_order"].includes(f.status) && <p className="text-xs text-amber-800">This product is marked {meta.stage_labels[f.stage]}, so it can't sell as {meta.status_labels[f.status]} yet. Use Coming Soon, Register Interest or Pre-order, or move it to Launch Now when it's ready to make.</p>}
        </Section>

        <Section title={kind.monthly ? "Monthly price" : "Price"} hint={kind.monthly ? "What subscribers pay each month, including postage." : null}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="font-semibold">{kind.monthly ? "Per month ($)" : "Sale price ($)"}<input inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} className={input} data-testid="hq-shop-price" /></label>
            {f.fulfilment !== "digital" && <label className="font-semibold">Your cost ($)<input inputMode="decimal" value={f.wholesale} onChange={(e) => set("wholesale", e.target.value)} className={input} /></label>}
            {kind.posted && <div className="text-xs text-stone-600 self-end pb-2">Postage is calculated at checkout using Australia Post Parcel Post, not entered here.</div>}
          </div>
          {priceCents != null && <p className="text-xs text-stone-600">Square fee {money(fee)} · you keep {money(priceCents - fee - (toCents(f.wholesale) || 0))}{f.fulfilment !== "digital" && f.wholesale === "" ? " before your cost" : ""}</p>}
          {!f.variants.some((v) => /basic|full/i.test(v.name)) && (
            <button type="button" onClick={() => set("variants", [...f.variants, { name: "Basics", price: f.price, stock: "", active: true, details: "" }, { name: "Full package", price: "", stock: "", active: true, details: "" }])}
              className="text-xs font-semibold underline" style={{ color: GREEN }} data-testid="hq-shop-add-tiers">+ Offer two tiers (Basics and Full package)</button>
          )}
        </Section>

        {kind.posted && (
          <Section title="Postage measurements" hint="One finished product, including its protective packaging. Enter actual packed dimensions before selling. Standard Parcel Post only, dispatched from postcode 2340. Leave blank while sourcing supplies.">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[["parcel_weight_g", "Packed weight (g)"], ["parcel_length_cm", "Length (cm)"], ["parcel_width_cm", "Width (cm)"], ["parcel_height_cm", "Height (cm)"]].map(([key, label]) => (
                <label key={key} className="font-semibold">{label}
                  <input type="number" min="1" step="1" value={f[key] ?? ""} onChange={(e) => set(key, e.target.value)} className={input} />
                </label>
              ))}
            </div>
            <p className="text-xs text-stone-600">For combined orders, Side-Quest estimates a single parcel by stacking products. Large orders requiring more than one parcel need a manual quote. Packaging and preparation time are separate from delivery.</p>
          </Section>
        )}

        {!isNew && (
          <Section title="Photos" hint="Up to 6. The first is the one shown in the shop.">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: images }, (_, i) => <div key={i} className="relative"><AdminImage id={product.id} n={i + 1} /><button type="button" onClick={() => removeImage(i + 1)} className="absolute -top-2 -right-2 rounded-full bg-white border px-1.5 text-xs text-rose-700" aria-label={`Remove photo ${i + 1}`}>✕</button></div>)}
              {images < 6 && <label className="h-20 w-20 rounded-lg border-2 border-dashed border-stone-300 grid place-items-center text-xs text-stone-500 cursor-pointer text-center">+ Photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => addImage(e.target.files?.[0])} className="hidden" /></label>}
            </div>
          </Section>
        )}

        {kind.file && (
          <Section title="The download" hint="The PDF or ZIP buyers get after paying (up to 25 MB).">
            {isNew
              ? <p className="text-xs text-stone-600">Save the product first, then upload its PDF or ZIP here.</p>
              : <>
                  <p>{product.has_file ? "✓ A file is uploaded. Choose another to replace it." : "No file yet."}</p>
                  <input type="file" accept="application/pdf,application/zip" disabled={busy} onChange={(e) => uploadFile(e.target.files?.[0])} data-testid="hq-shop-file" />
                </>}
          </Section>
        )}

        {format === "both" && (
          <Section title="Digital version" hint="Sold alongside the physical product, for example the instructions or printables so families can source the materials themselves. One download at its own price, with no postage or stock.">
            {(
              <>
                <label className="block font-semibold w-48">Digital price ($)<input inputMode="decimal" value={f.digital ?? ""} onChange={(e) => set("digital", e.target.value)} className={input} data-testid="hq-shop-digital-price" /></label>
                {isNew
                  ? <p className="text-xs text-stone-600">Save the product first, then upload its PDF or ZIP here.</p>
                  : <>
                      <p>{product.has_file ? "✓ The digital file is uploaded. Choose another to replace it." : "No file yet. Families can't buy the digital version until it's uploaded."}</p>
                      <input type="file" accept="application/pdf,application/zip" disabled={busy} onChange={(e) => uploadFile(e.target.files?.[0])} data-testid="hq-shop-digital-file" />
                    </>}
              </>
            )}
          </Section>
        )}

        {(f.variants.length > 0 || product.prints_books) && (
          <Section title={product.prints_books ? "Which books" : "Options and tiers"} hint="Each option can have its own price and its own list of what's included. Leave a price blank to use the main price.">
            {f.variants.map((v, i) => (
              <div key={v.id || i} className="flex flex-wrap gap-2 items-center">
                <input value={v.name} onChange={(e) => setVar(i, "name", e.target.value)} aria-label="Option name" className="rounded-xl border border-stone-300 px-2 py-1 flex-1 min-w-[140px]" />
                <input value={v.price ?? ""} onChange={(e) => setVar(i, "price", e.target.value)} placeholder="$" aria-label="Option price" className="rounded-xl border border-stone-300 px-2 py-1 w-20" />
                {kind.stock && <input type="number" min={0} value={v.stock ?? ""} onChange={(e) => setVar(i, "stock", e.target.value)} placeholder="Stock" aria-label="Option stock" className="rounded-xl border border-stone-300 px-2 py-1 w-20" />}
                <label className="flex items-center gap-1"><input type="checkbox" checked={v.active !== false} onChange={(e) => setVar(i, "active", e.target.checked)} />On</label>
                <button type="button" className="text-rose-700" aria-label="Remove option" onClick={() => set("variants", f.variants.filter((_, j) => j !== i))}>✕</button>
                {!product.prints_books && <textarea rows={2} value={v.details || ""} onChange={(e) => setVar(i, "details", e.target.value)} placeholder="What's included in this option (optional, one item per line)" aria-label={`What's included in ${v.name || "this option"}`} className="w-full rounded-xl border border-stone-300 px-2 py-1 text-xs" />}
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button tone="plain" onClick={() => set("variants", [...f.variants, { name: "", price: "", stock: "", active: true, details: "" }])}>Add option</Button>
              {product.prints_books && !isNew && <Button tone="plain" disabled={busy} onClick={addBooks}>Add every Quest Book</Button>}
            </div>
          </Section>
        )}

        {kind.stock && f.status === "in_stock" && f.variants.length === 0 && (
          <Section title="Stock">
            <div className="grid grid-cols-2 gap-3">
              <label className="font-semibold">In stock<input type="number" min={0} value={f.stock ?? ""} onChange={(e) => set("stock", e.target.value)} className={input} /></label>
              <label className="font-semibold">Email me when it gets to<input type="number" min={0} value={f.low_stock_at ?? ""} onChange={(e) => set("low_stock_at", e.target.value)} className={input} /></label>
            </div>
          </Section>
        )}

        {(kind.timing || f.status === "pre_order") && (
          <Section title="Timing">
            <div className="grid grid-cols-2 gap-3">
              <label className="font-semibold">Dispatch estimate<input value={f.dispatch_estimate || ""} placeholder="e.g. Posted within 2 weeks" onChange={(e) => set("dispatch_estimate", e.target.value)} className={input} /></label>
              <label className="font-semibold">Lead time (days)<input type="number" min={0} value={f.lead_time_days ?? ""} onChange={(e) => set("lead_time_days", e.target.value)} className={input} /></label>
              {f.status === "pre_order" && <>
                <label className="font-semibold">Pre-orders close<input type="date" value={f.preorder_closes_at} onChange={(e) => set("preorder_closes_at", e.target.value)} className={input} /></label>
                <label className="font-semibold">Pre-order target<input type="number" min={0} value={f.preorder_target ?? ""} onChange={(e) => set("preorder_target", e.target.value)} className={input} /></label>
              </>}
            </div>
          </Section>
        )}

        {kind.supplier && (
          <Section title="Supplier (private)">
            <label className="block font-semibold">Who makes or supplies it<input value={f.supplier || ""} onChange={(e) => set("supplier", e.target.value)} className={input} /></label>
          </Section>
        )}

        {(kind.personal || f.personalisation.length > 0) && (
          <Section title="Personalisation" hint="Things the customer types in, like a child's name.">
            {f.personalisation.map((x, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-center">
                <input value={x.label} onChange={(e) => setField(i, "label", e.target.value)} placeholder="e.g. Child's name" aria-label="Field label" className="rounded-xl border border-stone-300 px-2 py-1 flex-1" />
                <input type="number" min={1} max={200} value={x.max} onChange={(e) => setField(i, "max", Number(e.target.value))} aria-label="Max characters" title="Max characters" className="rounded-xl border border-stone-300 px-2 py-1 w-16" />
                <label className="flex items-center gap-1"><input type="checkbox" checked={!!x.required} onChange={(e) => setField(i, "required", e.target.checked)} />Required</label>
                <button type="button" className="text-rose-700" aria-label="Remove field" onClick={() => set("personalisation", f.personalisation.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
            <Button tone="plain" onClick={() => set("personalisation", [...f.personalisation, { label: "", max: 30, required: true }])}>Add field</Button>
          </Section>
        )}

        {kind.monthly && (
          <Section title="One-off box and monthly schedule" hint="Customers can buy one box at the one-off price, or subscribe at the lower monthly price. Every box goes out once a month.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="font-semibold">One-off price ($)<input inputMode="decimal" value={f.one_off} onChange={(e) => set("one_off", e.target.value)} className={input} data-testid="hq-shop-one-off" /></label>
              <label className="font-semibold">Orders close on day<input type="number" min={1} max={28} value={f.cutoff_day ?? ""} onChange={(e) => set("cutoff_day", e.target.value)} placeholder="e.g. 20" className={input} /></label>
              <label className="font-semibold">Boxes ship on day<input type="number" min={1} max={28} value={f.dispatch_day ?? ""} onChange={(e) => set("dispatch_day", e.target.value)} placeholder="e.g. 1" className={input} /></label>
            </div>
            {toCents(f.one_off) != null && priceCents != null && (toCents(f.one_off) > priceCents
              ? <p className="text-xs text-stone-600">Subscribers save {Math.round((1 - priceCents / toCents(f.one_off)) * 100)}% compared with buying one box.</p>
              : <p className="text-xs text-amber-800">Make the one-off price higher than the monthly price, so subscribing is the better deal.</p>)}
            {f.cutoff_day && f.dispatch_day && <p className="text-xs text-stone-600">Customers will see: "Order by the {ordinal(f.cutoff_day)} of the month and your box ships around the {ordinal(f.dispatch_day)}{Number(f.dispatch_day) <= Number(f.cutoff_day) ? " of the following month" : ""}."</p>}
            {toCents(f.one_off) != null && <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[["parcel_weight_g", "Packed weight (g)"], ["parcel_length_cm", "Length (cm)"], ["parcel_width_cm", "Width (cm)"], ["parcel_height_cm", "Height (cm)"]].map(([key, label]) => (
                <label key={key} className="font-semibold text-xs">{label}<input type="number" min={1} value={f[key] ?? ""} onChange={(e) => set(key, e.target.value)} className={input} /></label>
              ))}
              <p className="col-span-full text-xs text-stone-500">Needed for one-off postage, which Australia Post calculates at checkout.</p>
            </div>}
          </Section>
        )}

        {kind.monthly && (
          <Section title="Gift versions" hint="Sell it as a one-off prepaid gift as well as a monthly subscription.">
            <div className="flex flex-wrap gap-3">{[1, 3, 6, 12].map((m) => <label key={m} className="flex items-center gap-1"><input type="checkbox" checked={f.gift_months.includes(m)} onChange={() => set("gift_months", f.gift_months.includes(m) ? f.gift_months.filter((x) => x !== m) : [...f.gift_months, m])} />{m} month{m > 1 ? "s" : ""}</label>)}</div>
          </Section>
        )}

        <div className="border-t pt-3">
          <button type="button" onClick={() => setMore((x) => !x)} className="text-sm font-semibold underline" style={{ color: GREEN }}>{more ? "Hide more settings" : "More settings"}</button>
          {more && (
            <div className="space-y-3 mt-3 text-sm">
              {!isNew && <label className="block font-semibold">Title<input value={f.title} onChange={(e) => set("title", e.target.value)} className={input} /></label>}
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="font-semibold">Department<select value={f.department} onChange={(e) => set("department", e.target.value)} className={input}>{meta.departments.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}</select></label>
                <label className="font-semibold">Collection<input value={f.collection} onChange={(e) => set("collection", e.target.value)} className={input} /></label>
                <label className="font-semibold">Kind of product<select value={f.fulfilment} onChange={(e) => set("fulfilment", e.target.value)} className={input}>{Object.entries(meta.fulfilment_labels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
                <label className="font-semibold">Max per order<input type="number" min={1} value={f.max_per_order ?? ""} onChange={(e) => set("max_per_order", e.target.value)} className={input} /></label>
              </div>
              <label className="block font-semibold">Tags (comma separated; "seasonal" puts it in the Seasonal filter)<input value={f.tags} onChange={(e) => set("tags", e.target.value)} className={input} /></label>
              {f.variants.length === 0 && !product.prints_books && <Button tone="plain" onClick={() => set("variants", [{ name: "", price: "", stock: "", active: true }])}>Add options (sizes, colours…)</Button>}
              {!kind.personal && f.personalisation.length === 0 && <Button tone="plain" className="ml-2" onClick={() => set("personalisation", [{ label: "", max: 30, required: true }])}>Add personalisation</Button>}
              <label className="block font-semibold">Supplier notes (private)<textarea rows={2} value={f.supplier_notes || ""} onChange={(e) => set("supplier_notes", e.target.value)} className={input} /></label>
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={!!f.safety_checked} onChange={(e) => set("safety_checked", e.target.checked)} />Safety checked</label>
              <PickList label="Bundle contains" ids={f.bundle_items} others={others} onPick={(id) => pick("bundle_items", id)} />
              <PickList label="Suggested add-ons" ids={f.addons} others={others} onPick={(id) => pick("addons", id)} />
              {!isNew && <Button tone="danger" disabled={busy} onClick={remove}>Delete this product</Button>}
            </div>
          )}
        </div>

        {isNew && <p className="text-xs text-stone-500">Save first, then add photos.</p>}
        {err && <Alert>{err}</Alert>}
        <div className="flex flex-wrap gap-2 justify-end border-t pt-3">
          {queue && <Button tone="plain" disabled={busy} onClick={() => queue.next()}>Skip</Button>}
          <Button tone={queue ? "plain" : "primary"} disabled={busy} onClick={() => save(false)} data-testid="hq-shop-save">{busy ? "Saving…" : queue ? "Save & stop" : "Save"}</Button>
          {queue && <Button disabled={busy} onClick={() => save(true)} data-testid="hq-shop-save-next">{busy ? "Saving…" : "Save & next"}</Button>}
        </div>
      </div>
    </div>
  );
}

function PickList({ label, ids, others, onPick }) {
  const [q, setQ] = useState("");
  const chosen = others.filter((p) => ids.includes(p.id));
  const matches = q.length > 1 ? others.filter((p) => !ids.includes(p.id) && p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <div className="flex flex-wrap gap-1 my-1">{chosen.map((p) => <button key={p.id} type="button" onClick={() => onPick(p.id)} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs">{p.title} ✕</button>)}</div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products to add" aria-label={`${label}: search`} className="rounded-xl border border-stone-300 px-2 py-1 w-full" />
      {matches.map((p) => <button key={p.id} type="button" onClick={() => { onPick(p.id); setQ(""); }} className="block text-left text-xs underline py-0.5">{p.title}</button>)}
    </div>
  );
}

const ORDER_LABELS = { address_review: "Check shipping address", to_fulfil: "To post", packing: "Packing", shipped: "Posted", complete: "Complete", cancelled: "Cancelled" };
function Orders() {
  const [status, setStatus] = useState("");
  const { data, error, loading, reload } = useAdmin("/shop/orders", status ? { status } : undefined);
  const [tracking, setTracking] = useState({});
  const update = async (o, next) => {
    try { const r = await adminApi.put(`/shop/orders/${o.id}`, { status: next, tracking: tracking[o.id] ?? undefined }); toast.success(r.emailed ? "Saved and customer emailed" : "Saved"); await reload(); }
    catch (e) { toast.error(errorText(e)); }
  };
  return (
    <div className="space-y-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Order status" className="rounded-xl border border-stone-300 px-2 py-2 text-sm"><option value="">All paid orders</option>{Object.entries(ORDER_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      {loading && !data ? <p>Loading…</p> : error ? <Alert>{error}</Alert> : !data.orders.length ? <p className="text-sm text-stone-600">No orders here.</p> : data.orders.map((o) => (
        <Card key={o.id}>
          <div className="flex flex-wrap gap-2 text-sm"><strong className="mr-auto">{o.email}</strong><span>{fmtDate(o.paid_at)}</span><span className="font-semibold">{money(o.total_cents)}</span><span className="rounded-full bg-stone-100 px-2">{ORDER_LABELS[o.status] || o.status}</span></div>
          <ul className="text-sm mt-2 list-disc pl-5">{o.lines.map((l, i) => <li key={i}>{l.qty > 1 ? `${l.qty} × ` : ""}{l.title}{l.book_id ? " (PDF)" : ""}{Object.entries(l.personalisation || {}).length ? <span className="text-stone-600"> · {Object.entries(l.personalisation).map(([k, v]) => `${k}: ${v}`).join("; ")}</span> : null}</li>)}</ul>
          {o.quoted_postcode && <p className="text-xs text-stone-600 mt-2">Quoted for {o.shipping_service || "Parcel Post"} to postcode {o.quoted_postcode}.</p>}
          {o.status === "address_review" && <p className="text-sm mt-2 p-2 border rounded-lg text-rose-800 border-rose-300 bg-rose-50">The address entered at Square does not match the postage postcode quoted before payment (or is missing). Verify the address and any extra postage before fulfilling this order.</p>}
          {o.shipping && <p className="text-sm mt-2 whitespace-pre-line text-stone-700">{[o.shipping.name, [o.shipping.first_name, o.shipping.last_name].filter(Boolean).join(" "), o.shipping.address_line_1, o.shipping.address_line_2, [o.shipping.locality, o.shipping.administrative_district_level_1, o.shipping.postal_code].filter(Boolean).join(" ")].filter(Boolean).join("\n")}</p>}
          {o.lines.some((l) => l.physical) && o.status !== "cancelled" && (
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              <input value={tracking[o.id] ?? o.tracking ?? ""} onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })} placeholder="Tracking number" aria-label="Tracking number" className="rounded-xl border border-stone-300 px-2 py-1 text-sm" />
              {o.status === "address_review" && <Button tone="plain" onClick={() => update(o, "to_fulfil")}>Address checked, release for packing</Button>}
              {o.status === "to_fulfil" && <Button tone="plain" onClick={() => update(o, "packing")}>Mark packing</Button>}
              {o.status !== "address_review" && o.status !== "shipped" && o.status !== "complete" && <Button onClick={() => update(o, "shipped")}>Mark posted &amp; email customer</Button>}
              {o.status === "shipped" && <Button tone="plain" onClick={() => update(o, "complete")}>Mark complete</Button>}
            </div>
          )}
        </Card>
      ))}
      <p className="text-xs text-stone-500">Refunds are done in your Square dashboard; then mark the order cancelled here.</p>
    </div>
  );
}

function Interest() {
  const { data, error, loading } = useAdmin("/shop/interest");
  if (loading && !data) return <p>Loading…</p>;
  if (error) return <Alert>{error}</Alert>;
  const csv = () => {
    const rows = [["product", "email", "date"], ...data.interest.map((r) => [r.title, r.email, r.created_at])];
    const blob = new Blob([rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "shop-interest.csv"; a.click();
  };
  return (
    <Card title={`Interest sign-ups (${data.interest.length})`}>
      {data.interest.length ? <><Button tone="plain" onClick={csv}>Download CSV</Button>
        <ul className="text-sm mt-3 divide-y">{data.interest.map((r, i) => <li key={i} className="py-1 flex flex-wrap gap-2"><span className="mr-auto">{r.title}</span><span>{r.email}</span><span className="text-stone-500">{fmtDate(r.created_at)}</span></li>)}</ul></>
        : <p className="text-sm text-stone-600">No sign-ups yet. Set a product to Coming Soon or Register Interest and switch it on to start collecting emails.</p>}
    </Card>
  );
}

function Subscriptions() {
  const { data, error, loading, reload } = useAdmin("/shop/subscriptions");
  const cancel = async (s) => {
    if (!window.confirm(`Cancel ${s.title} for ${s.recipient?.name}?`)) return;
    try { await adminApi.post(`/shop/subscriptions/${s.id}/cancel`); toast.success("Cancelled"); await reload(); } catch (e) { toast.error(errorText(e)); }
  };
  if (loading && !data) return <p>Loading…</p>;
  if (error) return <Alert>{error}</Alert>;
  return (
    <div className="space-y-3">
      {!data.subscriptions.length && <p className="text-sm text-stone-600">No subscriptions yet.</p>}
      {data.subscriptions.map((s) => (
        <Card key={s.id}>
          <div className="flex flex-wrap gap-2 text-sm"><strong className="mr-auto">{s.title}</strong><span>{money(s.price_cents)}/month</span><span className="rounded-full bg-stone-100 px-2">{s.status}</span></div>
          <p className="text-sm mt-1">For <strong>{s.recipient?.name}</strong> · {[s.recipient?.address_line_1, s.recipient?.address_line_2, s.recipient?.locality, s.recipient?.state, s.recipient?.postcode].filter(Boolean).join(", ")}</p>
          <p className="text-xs text-stone-600">Buyer {s.email} · started {fmtDate(s.created_at)}{s.charged_through ? ` · paid to ${s.charged_through}` : ""}</p>
          {Object.keys(s.personalisation || {}).length > 0 && <p className="text-xs text-stone-600">{Object.entries(s.personalisation).map(([k, v]) => `${k}: ${v}`).join("; ")}</p>}
          {["active", "past_due"].includes(s.status) && <Button tone="plain" className="mt-2" onClick={() => cancel(s)}>Cancel</Button>}
        </Card>
      ))}
    </div>
  );
}
