import React, { useCallback, useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, Crown, KeyRound, Lock } from "lucide-react";
import { adminApi, enrolPasskey, errorCode, errorText, stepUpWithPasskey } from "../../../lib/adminApi";
import { Alert, Button, GREEN } from "./ui";

const TABS = [
  { to: "/parent/command-centre", label: "Overview", end: true, testid: "hq-tab-overview" },
  { to: "/parent/command-centre/customers", label: "Customers", testid: "hq-tab-customers" },
  { to: "/parent/command-centre/feedback", label: "Feedback inbox", testid: "hq-tab-feedback" },
  { to: "/parent/command-centre/settings", label: "Settings", testid: "hq-tab-settings" },
  { to: "/parent/command-centre/audit", label: "Audit log", testid: "hq-tab-audit" },
  { to: "/parent/command-centre/security", label: "Security", testid: "hq-tab-security" },
];

/**
 * Owner HQ gate. What the browser shows is only a convenience: every /api/admin call is checked on the server
 * (owner role, CSRF, rate limit, passkey step-up), and anyone else gets 404 there.
 */
export default function HqShell() {
  const [state, setState] = useState({ phase: "loading" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("This device");
  const [unreadFeedback, setUnreadFeedback] = useState(0);
  const location = useLocation();

  const check = useCallback(async () => {
    setError("");
    try {
      const s = await adminApi.get("/security/status");
      setState({ phase: s.elevated ? "open" : s.passkey_count ? "locked" : "enrol", status: s });
    } catch (e) {
      if (e?.response?.status === 404) setState({ phase: "absent" });
      else if (errorCode(e) === "fresh_sign_in_required") setState({ phase: "fresh" });
      else setState({ phase: "error", message: errorText(e, "Owner HQ could not load. Please retry.") });
    }
  }, []);
  useEffect(() => { check(); }, [check]);

  // The owner sees a new-message indicator without revealing the contents before passkey step-up.
  useEffect(() => {
    if (state.phase !== "open") { setUnreadFeedback(0); return undefined; }
    let current = true;
    const refresh = () => adminApi.get("/feedback/unread-count").then(r => { if (current) setUnreadFeedback(r.unread || 0); }).catch(() => {});
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => { current = false; clearInterval(timer); };
  }, [state.phase, location.pathname]);

  // Re-check when the 15-minute step-up runs out.
  useEffect(() => {
    if (state.phase !== "open" || !state.status?.elevated_until) return undefined;
    const ms = new Date(state.status.elevated_until).getTime() - Date.now();
    const t = setTimeout(check, Math.max(1000, ms + 500));
    return () => clearTimeout(t);
  }, [state, check]);

  const run = async (fn) => {
    setBusy(true); setError("");
    try { await fn(); await check(); } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  };

  if (state.phase === "loading") return <p className="p-6 text-stone-600" role="status">Opening Owner HQ…</p>;
  if (state.phase === "absent") return <Navigate to="/parent" replace />;

  const header = (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2" style={{ color: GREEN }}><Crown size={26} /> Owner HQ</h1>
        <p className="text-stone-600 mt-1 text-sm">The Side-Quest command centre. Only the Owner can open it.</p>
      </div>
      {state.phase === "open" && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
          <span data-testid="hq-elevated">Unlocked until {new Date(state.status.elevated_until).toLocaleTimeString("en-AU", { timeStyle: "short" })}</span>
          <Button tone="plain" onClick={() => run(() => adminApi.post("/security/step-up/end"))} data-testid="hq-lock"><Lock size={14} className="inline mr-1" />Lock</Button>
        </div>
      )}
    </header>
  );

  if (state.phase !== "open") {
    return (
      <div className="p-4 sm:p-8 max-w-xl space-y-5" data-testid="owner-hq-gate">
        {header}
        {state.phase === "fresh" && <Alert tone="warning">For your security, please sign out and sign in again, then open Owner HQ.</Alert>}
        {state.phase === "error" && <><Alert>{state.message}</Alert><Button onClick={check}>Retry</Button></>}
        {state.phase === "enrol" && (
          <form className="paper-card p-5 space-y-3" onSubmit={(e) => { e.preventDefault(); run(() => enrolPasskey({ password, label })); }} data-testid="hq-enrol">
            <h2 className="font-display text-lg font-bold flex items-center gap-2" style={{ color: GREEN }}><KeyRound size={18} /> Add a passkey</h2>
            <p className="text-sm text-stone-700">Owner HQ is protected by a passkey (Face ID, Touch ID, Windows Hello or a security key). Enter your Side-Quest password once to add one.</p>
            <label className="block text-sm font-semibold">Password
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="mt-1 w-full rounded-xl border border-stone-300 p-2 font-normal" data-testid="hq-password" />
            </label>
            <label className="block text-sm font-semibold">Name for this passkey
              <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} className="mt-1 w-full rounded-xl border border-stone-300 p-2 font-normal" />
            </label>
            <button type="submit" disabled={busy || !password} className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "#4A5D3A" }} data-testid="hq-add-passkey">
              {busy ? "Waiting for your passkey…" : "Add passkey"}
            </button>
          </form>
        )}
        {state.phase === "locked" && (
          <div className="paper-card p-5 space-y-3" data-testid="hq-locked">
            <h2 className="font-display text-lg font-bold flex items-center gap-2" style={{ color: GREEN }}><Lock size={18} /> Confirm it's you</h2>
            <p className="text-sm text-stone-700">Use your passkey to unlock Owner HQ for {state.status?.step_up_minutes ?? 15} minutes on this sign-in.</p>
            <Button onClick={() => run(stepUpWithPasskey)} disabled={busy} data-testid="hq-step-up">{busy ? "Waiting for your passkey…" : "Unlock with passkey"}</Button>
          </div>
        )}
        {error && <Alert>{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-6xl space-y-5 min-w-0" data-testid="owner-command-centre">
      {header}
      <nav className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Owner HQ sections">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} data-testid={t.testid}
            className={({ isActive }) => `whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "text-white" : "text-stone-700 bg-white/70"}`}
            style={({ isActive }) => (isActive ? { backgroundColor: GREEN } : { border: "1px solid #D4C8A8" })}>
            {t.label}{t.testid === "hq-tab-feedback" && unreadFeedback > 0 && <span aria-label={`${unreadFeedback} unread feedback submissions`} className="inline-flex items-center gap-1 ml-2 bg-amber-100 text-amber-950 rounded-full px-2 py-0.5 text-xs font-bold"><Bell size={11}/>{unreadFeedback}</span>}
          </NavLink>
        ))}
      </nav>
      {error && <Alert>{error}</Alert>}
      <Outlet context={{ relock: check }} />
    </div>
  );
}
