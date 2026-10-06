import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const nav = useNavigate();
  const location = useLocation();
  const { setSession, refresh } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const hash = location.hash || window.location.hash;
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) { nav("/login"); return; }
    const session_id = decodeURIComponent(match[1]);
    (async () => {
      try {
        const { data } = await api.post("/auth/session", { session_id });
        setSession(null, { ...data.user, role: "parent" });
        await refresh();
        window.history.replaceState(null, "", "/parent");
        toast.success(`Welcome, ${data.user.name}`);
        nav("/parent", { replace: true });
      } catch (e) {
        toast.error("Google sign-in failed. Try again.");
        nav("/login", { replace: true });
      }
    })();
  }, [location, nav, setSession, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor:"#FBF7EC"}}>
      <div className="flex items-center gap-3 text-stone-700"><Loader2 className="animate-spin"/> Signing you in…</div>
    </div>
  );
}
