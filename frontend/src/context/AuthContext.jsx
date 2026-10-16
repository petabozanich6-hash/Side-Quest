import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, FILE_TOKEN } from "../lib/api";
import { clearOffline, isNetworkError } from "../lib/offline";
import { forgetOfflineChild } from "../lib/offlineSignIn";

// The last signed-in user, so the installed app still opens (for offline lessons) when there is no signal.
// Only name/role/ids/theme: no tokens, emails or children's work.
const USER_CACHE = "sq_user_cache";
const rememberUser = (u) => { try { if (u) localStorage.setItem(USER_CACHE, JSON.stringify({ id: u.id, name: u.name, role: u.role, family_id: u.family_id, theme: u.theme, username: u.role === "child" ? u.username : undefined })); else localStorage.removeItem(USER_CACHE); } catch {} };
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
      const { data: me } = await api.get("/auth/me");
      const { file_token: fileToken, ...data } = me || {};
      try { if (fileToken) localStorage.setItem(FILE_TOKEN, fileToken); } catch {}
      setUser(data);
      rememberUser(data);
    } catch (e) {
      // No signal: keep the session (the token is still on this device) so saved lessons can be used offline.
      const cached = isNetworkError(e) && localStorage.getItem("sq_token") ? cachedUser() : null;
      if (cached) { setUser({ ...cached, offline: true }); }
      else {
        // The server turned this sign-in down (PIN changed, signed out everywhere): its offline sign-in goes too.
        const was = cachedUser();
        if (e?.response?.status === 401 && was?.role === "child" && was.username) forgetOfflineChild(was.username);
        localStorage.removeItem("sq_token"); try { localStorage.removeItem(FILE_TOKEN); } catch {} rememberUser(null); setUser(null);
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  // File links expire after 12 hours: renew them while the app stays open.
  useEffect(() => {
    if (!user || user.offline) return undefined;
    const t = setInterval(() => {
      api.get("/auth/me").then(({ data }) => { try { if (data?.file_token) localStorage.setItem(FILE_TOKEN, data.file_token); } catch {} }).catch(() => {});
    }, 4 * 3600 * 1000);
    return () => clearInterval(t);
  }, [user]);

  const setSession = (token, u) => {
    if (token) localStorage.setItem("sq_token", token);
    setUser(u);
    rememberUser(u);
    // Fetch the file-link token for this new sign-in.
    if (token) api.get("/auth/me").then(({ data }) => { try { if (data?.file_token) localStorage.setItem(FILE_TOKEN, data.file_token); } catch {} }).catch(() => {});
  };

  // keepOffline: on a child's own device (the kids' app) their saved quests and unsent work stay for next time.
  const logout = async ({ keepOffline = false } = {}) => {
    try { await api.post("/auth/logout"); } catch {}
    try { navigator.serviceWorker?.controller?.postMessage("CLEAR_CACHES"); } catch {}
    localStorage.removeItem("sq_token");
    try { localStorage.removeItem(FILE_TOKEN); } catch {}
    rememberUser(null);
    // Elsewhere, offline lessons and any unsent work on this device are deleted on sign-out.
    if (!keepOffline) await clearOffline();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
