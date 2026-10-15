import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, fmtDay, GREEN, PLAN_LABELS } from "./ui";
import { useAdmin } from "./useAdmin";

export default function HqCustomers() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const status = params.get("status") || "";
  const plan = params.get("plan") || "";
  const page = Number(params.get("page") || "1");
  const [text, setText] = useState(q);
  const query = { ...(q && { q }), ...(status && { status }), ...(plan && { plan }), page };
  const { data, error, loading } = useAdmin("/customers", query);
  const set = (patch) => {
    const next = { q, status, plan, page: "1", ...patch };
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));
  };
  const pages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;
  return (
    <div className="space-y-4" data-testid="hq-customers">
      <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim() }); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Parent email or family id" aria-label="Search customers"
          className="flex-1 min-w-[12rem] rounded-xl border border-stone-300 px-3 py-2 text-sm" data-testid="hq-customer-search" />
        <select value={status} onChange={(e) => set({ status: e.target.value })} aria-label="Status" className="rounded-xl border border-stone-300 px-2 py-2 text-sm">
          <option value="">Any status</option><option value="active">Active</option><option value="suspended">Suspended</option>
        </select>
        <select value={plan} onChange={(e) => set({ plan: e.target.value })} aria-label="Plan" className="rounded-xl border border-stone-300 px-2 py-2 text-sm">
          <option value="">Any plan</option>
          {Object.entries(PLAN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Button type="submit">Search</Button>
      </form>
      <p className="text-xs text-stone-500">Families are shown with account details and counts only. Children's names and families' lessons, work and evidence are never shown here.</p>
      {error && <Alert>{error}</Alert>}
      {loading && !data && <p role="status" className="text-stone-600">Loading…</p>}
      {data && (
        <>
          <p className="text-sm text-stone-600">{data.total} {data.total === 1 ? "family" : "families"}</p>
          <ul className="grid gap-2">
            {data.customers.map((c) => (
              <li key={c.id}>
                <Link to={`/parent/command-centre/customers/${encodeURIComponent(c.id)}`} data-testid="hq-customer-row"
                  className="paper-card p-3 flex flex-wrap items-center justify-between gap-2 hover:shadow-sm">
                  <span className="min-w-0">
                    <span className="block font-semibold text-sm break-all" style={{ color: GREEN }}>{c.owner_email || "(no primary parent)"}</span>
                    <span className="block text-xs text-stone-500">Joined {fmtDay(c.created_at)} · {c.parents} parent{c.parents === 1 ? "" : "s"} · {c.children} child{c.children === 1 ? "" : "ren"}{c.jurisdiction ? ` · ${c.jurisdiction}` : ""}</span>
                  </span>
                  <span className="flex flex-wrap gap-1 text-xs">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5">{PLAN_LABELS[c.plan] || c.plan}</span>
                    {c.status === "suspended" && <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 font-bold">Suspended</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <Button tone="plain" disabled={page <= 1} onClick={() => set({ page: String(page - 1) })}>Previous</Button>
              <span>Page {page} of {pages}</span>
              <Button tone="plain" disabled={page >= pages} onClick={() => set({ page: String(page + 1) })}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
