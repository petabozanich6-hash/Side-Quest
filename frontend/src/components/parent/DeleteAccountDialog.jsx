import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function DeleteAccountDialog({ onClose }) {
  const { logout, user } = useAuth();
  const google = user && user.has_password === false; // Google-only: a fresh sign-in replaces the password
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needsCancel, setNeedsCancel] = useState(false);

  const ready = (google || password.length > 0) && confirm.trim() === "DELETE" && !busy;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/delete-account", { password: google ? undefined : password, confirm: confirm.trim() });
      await logout();
      navigate("/");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setNeedsCancel(err?.response?.data?.code === "SUBSCRIPTION_RENEWING");
      setError(typeof detail === "string" ? detail : "Something went wrong. Nothing was deleted.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{backgroundColor:"rgba(31,59,45,0.55)"}} data-testid="delete-account-dialog">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl p-6 relative" style={{backgroundColor:"#FBF7EC", border:"1px solid #D4C8A8"}}>
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-stone-500 hover:text-stone-800" aria-label="Close"><X size={18}/></button>
        <div className="flex items-center gap-2 mb-3" style={{color:"#9B2C2C"}}>
          <AlertTriangle size={20}/>
          <h2 className="font-display text-lg font-bold">Delete your account</h2>
        </div>
        <p className="text-sm text-stone-700 mb-2">
          This permanently erases your account and everything connected to it:
        </p>
        <ul className="text-sm text-stone-700 list-disc pl-5 mb-3 space-y-0.5">
          <li>Every child profile and their pets</li>
          <li>Lessons, assignments, submissions and feedback</li>
          <li>Reading logs, life learning and evidence</li>
          <li>All uploaded files and calendar events</li>
        </ul>
        <p className="text-sm font-bold mb-2" style={{color:"#9B2C2C"}}>This cannot be undone. Your children will no longer be able to sign in.</p>
        <p className="text-sm text-stone-700 mb-4">If you have a Family Membership that will renew, cancel it in Manage billing first. A membership already set to end doesn&apos;t stop you deleting.</p>

        {google ? (
          <p className="text-sm text-stone-700 mb-3" data-testid="delete-account-google">You sign in with Google, so there&apos;s no password to check. If you signed in more than 15 minutes ago, sign out and sign in with Google again first.</p>
        ) : (
          <>
            <label className="block text-xs font-bold text-stone-600 mb-1">Your password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
              className="w-full rounded-xl border px-3 py-2 text-sm mb-3" style={{borderColor:"#D4C8A8"}} data-testid="delete-account-password"/>
          </>
        )}

        <label className="block text-xs font-bold text-stone-600 mb-1">Type DELETE to confirm</label>
        <input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off"
          className="w-full rounded-xl border px-3 py-2 text-sm mb-3" style={{borderColor:"#D4C8A8"}} data-testid="delete-account-confirm"/>

        {error && (
          <div className="text-sm mb-3" style={{color:"#9B2C2C"}} data-testid="delete-account-error">
            {error}
            {needsCancel && (
              <button type="button" onClick={() => { onClose(); navigate("/parent/plan"); }} className="block mt-1 font-bold underline" data-testid="delete-account-manage-billing">
                Go to Manage billing
              </button>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white">Cancel</button>
          <button type="submit" disabled={!ready} className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            style={{backgroundColor:"#9B2C2C"}} data-testid="delete-account-submit">
            {busy ? "Deleting..." : "Delete everything"}
          </button>
        </div>
      </form>
    </div>
  );
}
