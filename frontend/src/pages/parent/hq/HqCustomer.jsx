import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { adminApi } from "../../../lib/adminApi";
import { Alert, Button, Card, ConfirmDialog, fmtBytes, fmtDate, fmtDay, PLAN_LABELS, Row } from "./ui";
import { useAdmin } from "./useAdmin";

const EVENT_LABELS = { family_suspended: "Suspended", family_restored: "Restored", signed_out_everywhere: "Signed out everywhere", step_up_success: "Passkey confirmed", step_up_failed: "Passkey failed", reauth_failed: "Password re-check failed", passkey_registered: "Passkey added", passkey_removed: "Passkey removed" };
const ACTION_LABELS = { "customer.suspend": "Suspended", "customer.restore": "Restored", "customer.sign_out_everywhere": "Signed out everywhere" };

export default function HqCustomer() {
  const { id } = useParams();
  const { data: c, error, loading, reload } = useAdmin(`/customers/${encodeURIComponent(id)}`);
  const [dialog, setDialog] = useState(null);
  if (loading && !c) return <p role="status" className="text-stone-600">Loading…</p>;
  if (error && !c) return <><Alert>{error}</Alert><Link to="/parent/command-centre/customers" className="underline text-sm">Back to customers</Link></>;
  const isAdminFamily = c.parents.some((p) => p.admin);
  const act = (path, body, message) => adminApi.post(`/customers/${encodeURIComponent(c.id)}/${path}`, body).then(() => { toast.success(message); reload(); });

  const dialogs = {
    suspend: { title: "Suspend this family?", typed: "SUSPEND", confirmLabel: "Suspend family",
      body: "Every parent and child in this family is signed out and cannot sign in until you restore the family. Their data is kept and billing is not changed in Stripe.",
      onConfirm: ({ reason, confirm }) => act("suspend", { reason, confirm }, "Family suspended") },
    restore: { title: "Restore this family?", tone: "primary", confirmLabel: "Restore family",
      body: "The family can sign in again. Devices signed out by the suspension stay signed out.",
      onConfirm: ({ reason }) => act("restore", { reason }, "Family restored") },
    signout: { title: "Sign this family out everywhere?", tone: "primary", confirmLabel: "Sign out everywhere",
      body: "Every parent and child of this family is signed out on every device. They can sign straight back in.",
      onConfirm: ({ reason }) => act("sign-out-everywhere", { reason }, "Signed out on every device") },
  };

  return (
    <div className="space-y-4" data-testid="hq-customer">
      <Link to="/parent/command-centre/customers" className="text-sm font-semibold underline" style={{ color: "#4A5D3A" }}>← All customers</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold break-all" style={{ color: "#1F3B2D" }}>{c.parents.find((p) => p.primary)?.email || "Family"}</h2>
          <p className="text-xs text-stone-500 break-all">Family id {c.id} · joined {fmtDay(c.created_at)}{c.jurisdiction ? ` · ${c.jurisdiction}` : ""}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.status === "suspended" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`} data-testid="hq-customer-status">
          {c.status === "suspended" ? "Suspended" : "Active"}
        </span>
      </div>
      {c.status === "suspended" && <Alert tone="warning">Suspended {fmtDate(c.suspended_at)}: {c.suspended_reason}</Alert>}

      <div className="flex flex-wrap gap-2">
        {isAdminFamily ? <p className="text-sm text-stone-600">This family includes an administrator, so it can't be changed here.</p> : (
          <>
            {c.status === "suspended"
              ? <Button onClick={() => setDialog("restore")} data-testid="hq-restore">Restore</Button>
              : <Button tone="danger" onClick={() => setDialog("suspend")} data-testid="hq-suspend">Suspend</Button>}
            <Button tone="plain" onClick={() => setDialog("signout")} data-testid="hq-signout">Sign out everywhere</Button>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Membership">
          <dl>
            <Row label="Plan now">{PLAN_LABELS[c.billing.effective_plan] || c.billing.effective_plan}</Row>
            {c.billing.plan !== c.billing.effective_plan && <Row label="Stored plan">{PLAN_LABELS[c.billing.plan] || c.billing.plan}</Row>}
            {c.billing.trial_ends_at && <Row label="Preview ends">{fmtDay(c.billing.trial_ends_at)}</Row>}
            <Row label="Billing interval">{c.billing.billing_interval || "—"}</Row>
            <Row label="Stripe status">{c.billing.subscription_status || "—"}</Row>
            <Row label="Paid until">{fmtDay(c.billing.plan_period_end)}</Row>
            <Row label="Cancels at period end">{c.billing.cancel_at_period_end ? "Yes" : "No"}</Row>
            <Row label="Stripe customer">{c.billing.stripe_customer_id || "—"}</Row>
          </dl>
        </Card>
        <Card title="Parents">
          <ul className="space-y-2">
            {c.parents.map((p) => (
              <li key={p.id} className="text-sm">
                <span className="font-semibold break-all">{p.email}</span>{p.primary && " · primary"}{p.admin && " · administrator"}
                <span className="block text-xs text-stone-500">Signs in with {p.sign_in} · since {fmtDay(p.created_at)}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-sm font-bold mt-4" style={{ color: "#1F3B2D" }}>Children</h3>
          <p className="text-sm">{c.children.total} profile{c.children.total === 1 ? "" : "s"}{c.children.total > 0 && ` · ${Object.entries(c.children.by_stage).map(([s, n]) => `${s}: ${n}`).join(", ")}`}</p>
        </Card>
        <Card title="Activity (counts only)">
          <dl>
            <Row label="Lessons">{c.counts.lessons ?? "—"}</Row>
            <Row label="Assignments">{c.counts.assignments ?? "—"}</Row>
            <Row label="Hand-ins">{c.counts.submissions ?? "—"}</Row>
            <Row label="Evidence items">{c.counts.evidence_items ?? "—"}</Row>
            <Row label="Files">{c.counts.files ?? "—"} ({fmtBytes(c.counts.file_bytes)})</Row>
            <Row label="Help requests">{c.counts.help_requests ?? "—"}</Row>
            {Object.entries(c.ai_requests_30d).map(([k, n]) => <Row key={k} label={`AI ${k.replace(/_/g, " ")} · 30 days`}>{n}</Row>)}
          </dl>
        </Card>
        <Card title="Security and admin history">
          {c.admin_history.length === 0 && c.security_events.length === 0 && <p className="text-sm text-stone-600">Nothing recorded.</p>}
          <ul className="space-y-1 text-sm">
            {c.admin_history.map((a, i) => <li key={`a${i}`}><strong>{ACTION_LABELS[a.action] || a.action}</strong> · {fmtDate(a.created_at)}{a.detail?.reason ? ` · “${a.detail.reason}”` : ""}</li>)}
            {c.security_events.map((e, i) => <li key={`e${i}`} className="text-stone-600">{EVENT_LABELS[e.event_type] || e.event_type} · {fmtDate(e.created_at)}</li>)}
          </ul>
        </Card>
      </div>
      {dialog && <ConfirmDialog {...dialogs[dialog]} onClose={() => setDialog(null)} />}
    </div>
  );
}
