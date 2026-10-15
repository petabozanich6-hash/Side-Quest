import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { clearOffline, isNetworkError } from "../lib/offline";

// The last signed-in user, so the installed app still opens (for offline lessons) when there is no signal.
// Only name/role/ids/theme: no tokens, emails or children's work.
const USER_CACHE = "sq_user_cache";
const rememberUser = (u) => { try { if (u) localStorage.setItem(USER_CACHE, JSON.stringify({ id: u.id, name: u.name, role: u.role, family_id: u.family_id, theme: u.theme })); else localStorage.removeItem(USER_CACHE); } catch {} };
const cachedUser = () => { try { return JSON.parse(localStorage.getItem(USER_CACHE) || "null"); } catch { return null; } };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Skip /me check if coming back from OAuth (session_id in URL fragment)
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false); return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      rememberUser(data);
    } catch (e) {
      // No signal: keep the session (the token is still on this device) so saved lessons can be used offline.
      const cached = isNetworkError(e) && localStorage.getItem("sq_token") ? cachedUser() : null;
      if (cached) { setUser({ ...cached, offline: true }); }
      else { localStorage.removeItem("sq_token"); rememberUser(null); setUser(null); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const setSession = (token, u) => {
    if (token) localStorage.setItem("sq_token", token);
    setUser(u);
    rememberUser(u);
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    try { navigator.serviceWorker?.controller?.postMessage("CLEAR_CACHES"); } catch {}
    localStorage.removeItem("sq_token");
    rememberUser(null);
    // Offline lessons and any unsent work on this device are deleted on sign-out.
    await clearOffline();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
