import React, { useState } from "react";
import { Alert, Button, fmtDate } from "./ui";
import { useAdmin } from "./useAdmin";

const LABELS = {
  "owner.promote": "Owner role granted", "passkey.register": "Passkey added", "passkey.remove": "Passkey removed",
  "customer.suspend": "Family suspended", "customer.restore": "Family restored", "customer.sign_out_everywhere": "Family signed out everywhere",
  "settings.update": "Setting changed",
};

function describe(e) {
  const d = e.detail || {};
  if (e.action === "settings.update") return `${e.target_id}: ${JSON.stringify(d.from)} → ${JSON.stringify(d.to)}${d.high_impact?.length ? " (confirmed)" : ""}`;
  if (d.reason) return `“${d.reason}”`;
  if (d.label) return d.label;
  return "";
}

export default function HqAudit() {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdmin("/audit", { page });
  return (
    <div className="space-y-3" data-testid="hq-audit">
      <p className="text-sm text-stone-600">Every administrative change, newest first. Entries cannot be edited or deleted from Owner HQ.</p>
      {error && <Alert>{error}</Alert>}
      {loading && !data && <p role="status">Loading…</p>}
      {data && data.entries.length === 0 && <p className="text-sm text-stone-600">No changes yet.</p>}
      {data && (
        <ul className="grid gap-2">
          {data.entries.map((e) => (
            <li key={e.id} className="paper-card p-3 text-sm min-w-0" data-testid="hq-audit-entry">
              <div className="flex flex-wrap justify-between gap-2">
                <strong>{LABELS[e.action] || e.action}</strong>
                <span className="text-xs text-stone-500">{fmtDate(e.created_at)}</span>
              </div>
              <p className="text-xs text-stone-600 break-all mt-1">{describe(e)}</p>
              <p className="text-[11px] text-stone-400 break-all">{e.actor}{e.target_type ? ` · ${e.target_type} ${e.target_id}` : ""}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2 text-sm">
        <Button tone="plain" disabled={page <= 1} onClick={() => setPage(page - 1)}>Newer</Button>
        <span>Page {page}</span>
        <Button tone="plain" disabled={!data?.has_more} onClick={() => setPage(page + 1)}>Older</Button>
      </div>
    </div>
  );
}
