import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

/** Verification tokens live in the email-link fragment, never server request logs. */
export default function VerifyEmail() {
  const [state, setState] = useState("checking");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    if (!token) { setState("invalid"); return; }
    api.post("/auth/verify-email", { token })
      .then(() => setState("verified"))
      .catch(() => setState("invalid"));
  }, []);

  const resend = async (event) => {
    event.preventDefault();
    setError("");
    setResending(true);
    try {
      await api.post("/auth/verify-email/resend", { email });
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.detail || "We couldn't send a new link. Please try again.");
    } finally { setResending(false); }
  };

  return <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#F5EFE0"}}>
    <div className="paper-card max-w-md p-8 text-center space-y-4" data-testid="verify-email-page">
      <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>🐉 {state === "verified" ? "Quest complete!" : state === "invalid" ? "That link didn't work" : "Checking your invitation…"}</h1>
      {state === "verified" ? <>
        <p>Your email is confirmed! Your seven-day free preview starts now.</p>
        <Link className="inline-block underline font-bold" to="/login">Sign in and begin your adventure</Link>
      </> : state === "invalid" ? <>
        <p>This link may have expired or already been used. Already confirmed? <Link to="/login" className="underline font-bold">Sign in</Link>. Otherwise request another link below.</p>
        <form onSubmit={resend} className="space-y-3 text-left" data-testid="verify-email-resend">
          <label htmlFor="verify-email-address" className="text-sm font-bold">Your email address</label>
          <input id="verify-email-address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
          <button disabled={resending} type="submit" className="rounded-full px-5 py-2 font-bold text-white disabled:opacity-50" style={{background:"#1F3B2D"}}>{resending ? "Sending…" : "Send another confirmation link"}</button>
          {resent && <p role="status" className="text-sm">If that address needs confirmation, another link is on its way. Check your inbox and spam folder.</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </form>
      </> : <p role="status">Confirming your email securely…</p>}
    </div>
  </div>;
}
