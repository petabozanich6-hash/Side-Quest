import React, { useState } from "react";

export const GREEN = "#1F3B2D";
export const MOSS = "#4A5D3A";

export const PLAN_LABELS = {
  FREE_PREVIEW: "Free preview", PREVIEW_EXPIRED: "Preview ended",
  ACTIVE_WEEKLY: "Weekly member", ACTIVE_FORTNIGHTLY: "Fortnightly member",
  ACTIVE_MONTHLY: "Monthly member", ACTIVE_ANNUAL: "Annual member",
  PAST_DUE: "Payment needs attention", CANCELLED: "Membership ended", INTERNAL: "Complimentary (internal)",
};

export const fmtDate = (v) => (v ? new Date(v).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "—");
export const fmtDay = (v) => (v ? new Date(v).toLocaleDateString("en-AU", { dateStyle: "medium" }) : "—");
export const fmtBytes = (n) => {
  if (n == null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
};

export function Card({ title, children, className = "", testid }) {
  return (
    <section className={`paper-card p-4 sm:p-5 min-w-0 ${className}`} data-testid={testid}>
      {title && <h2 className="font-display text-lg font-bold mb-3" style={{ color: GREEN }}>{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, note, testid }) {
  return (
    <div className="paper-card p-4 min-w-0" data-testid={testid}>
      <p className="text-xs sm:text-sm text-stone-600">{label}</p>
      <p className="font-display text-2xl sm:text-3xl font-bold mt-1 break-words" style={{ color: GREEN }}>{value}</p>
      {note && <p className="text-xs text-stone-500 mt-1">{note}</p>}
    </div>
  );
}

/** Shown wherever something is not measured or not set up: never a made-up number. */
export function NotConfigured({ note }) {
  return (
    <p className="text-sm text-stone-600" data-testid="not-configured">
      <span className="inline-block rounded-full bg-stone-200 px-2 py-0.5 text-xs font-bold text-stone-700 mr-2">Not configured</span>
      {note}
    </p>
  );
}

export function Row({ label, children }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 text-sm border-b border-stone-200 last:border-0">
      <dt className="text-stone-600">{label}</dt>
      <dd className="font-semibold text-right break-all">{children}</dd>
    </div>
  );
}

export function Button({ children, tone = "primary", className = "", ...props }) {
  const styles = {
    primary: { backgroundColor: MOSS, color: "white" },
    danger: { backgroundColor: "#9B2C2C", color: "white" },
    plain: { backgroundColor: "white", color: GREEN, border: "1px solid #D4C8A8" },
  };
  return (
    <button type="button" {...props} className={`rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60 ${className}`} style={styles[tone]}>
      {children}
    </button>
  );
}

export function Alert({ children, tone = "error" }) {
  const cls = tone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900";
  return <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border p-3 text-sm ${cls}`}>{children}</p>;
}

/**
 * Confirmation for customer actions: a reason (5–500 characters) and, when `typed` is set, a word to type.
 */
export function ConfirmDialog({ title, body, typed, confirmLabel, tone = "danger", onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = reason.trim().length >= 5 && (!typed || word === typed);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await onConfirm({ reason: reason.trim(), confirm: typed }); onClose(); }
    catch (err) { setError(err?.response?.data?.detail || "That didn't work. Please try again."); }
    finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-5 space-y-3 shadow-xl">
        <h3 className="font-display text-xl font-bold" style={{ color: GREEN }}>{title}</h3>
        <p className="text-sm text-stone-700">{body}</p>
        <label className="block text-sm font-semibold">Reason (kept in the audit log)
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={3} required
            className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-sm font-normal" data-testid="confirm-reason" />
        </label>
        {typed && (
          <label className="block text-sm font-semibold">Type <code>{typed}</code> to confirm
            <input value={word} onChange={(e) => setWord(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-sm font-normal" data-testid="confirm-word" autoComplete="off" />
          </label>
        )}
        {error && <Alert>{error}</Alert>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button tone="plain" onClick={onClose}>Cancel</Button>
          <button type="submit" disabled={!ready || busy} data-testid="confirm-submit"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: tone === "danger" ? "#9B2C2C" : MOSS }}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
