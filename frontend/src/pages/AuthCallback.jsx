import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { googleErrorMessage } from "../lib/googleErrors";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { setSession } = useAuth();
  const done = useRef(false);
  const [link, setLink] = useState(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const code = params.get("error");
    if (code) {
      toast.error(googleErrorMessage(code));
      nav("/login", { replace: true });
      return;
    }
    const ticket = params.get("ticket");
    if (!ticket) {
      toast.error("Google sign-in did not return a sign-in ticket. Please try again.");
      nav("/login", { replace: true });
      return;
    }
    window.history.replaceState(null, "", "/auth/callback");
    (async () => {
      try {
        const { data } = await api.post("/auth/google/exchange", { ticket });
        if (data.status === "link_required") {
          setLink({ token: data.link_token, email: data.email });
          return;
        }
        setSession(data.token, { ...data.user, role: "parent" });
        toast.success(data.is_new ? `Welcome, ${data.user.name}` : `Welcome back, ${data.user.name}`);
        nav("/parent", { replace: true });
      } catch (err) {
        toast.error(err.response?.data?.detail || "Google sign-in failed. Please try again.");
        nav("/login", { replace: true });
      }
    })();
  }, [params, nav, setSession]);

  const submitLink = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/google/link", { link_token: link.token, password });
      setSession(data.token, { ...data.user, role: "parent" });
      toast.success("Google is linked. Your family and progress are unchanged.");
      nav("/parent", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Google could not be linked.");
    } finally {
      setBusy(false);
    }
  };

  if (link) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#FBF7EC" }}>
        <form onSubmit={submitLink} className="w-full max-w-md paper-card p-8" data-testid="google-link-form">
          <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Link Google</h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            A Side Quest account already uses <strong>{link.email}</strong>. Enter that account's password to connect Google.
            This keeps the same family, children and learning progress. It does not create a second account.
          </p>
          <label className="mt-5 block text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white"
            data-testid="google-link-password"
          />
          {error && <p className="mt-3 text-sm" style={{ color: "#9B2C2C" }} data-testid="google-link-error">{error}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="google-link-submit">
            {busy ? "Linking…" : "Link and sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-stone-500">
            <Link to="/forgot-password" className="font-bold" style={{ color: "#4A5D3A" }}>Forgot password?</Link>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBF7EC" }}>
      <div className="flex items-center gap-3 text-stone-700"><Loader2 className="animate-spin" /> Signing you in…</div>
    </div>
  );
}
