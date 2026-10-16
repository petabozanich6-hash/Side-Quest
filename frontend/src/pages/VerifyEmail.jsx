import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

/** Verification tokens live in the email link fragment, never in server request logs. */
export default function VerifyEmail() {
  const [state, setState] = useState("checking");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    // Clear the fragment immediately: avoid tokens persisting in history/screenshots.
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    if (!token) { setState("invalid"); return; }
    api.post("/auth/verify-email", { token })
      .then(() => setState("verified"))
      .catch(() => setState("invalid"));
  }, []);
  return <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#F5EFE0"}}>
    <div className="paper-card max-w-md p-8 text-center space-y-4" data-testid="verify-email-page">
      <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>🐉 {state === "verified" ? "Quest complete!" : state === "invalid" ? "That link didn't work" : "Checking your invitation…"}</h1>
      {state === "verified" ? <><p>Your email is confirmed! Your seven-day free preview starts now.</p><Link className="inline-block underline font-bold" to="/login">Sign in and begin your adventure</Link></>
        : state === "invalid" ? <><p>The link may have expired or already been used. If you've confirmed previously, try signing in. Otherwise, request another link from the registration page.</p><Link to="/login" className="underline font-bold">Go to sign in</Link></>
        : <p role="status">Confirming your email securely…</p>}
    </div>
  </div>;
}
