import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const EVT = "sq-inbox-changed";
const RECENT_MS = 14 * 86400000;
const FALLBACK = "your parent";
const storeKey = (id) => `sq-inbox-seen-${id || "child"}`;
const readSeen = (id) => {
  try { return JSON.parse(localStorage.getItem(storeKey(id)) || "[]"); } catch { return []; }
};

export function buildItems(data, seen, labels = {}) {
  const returned = new Set((data.all_pending || []).filter(a => a.status === "needs_revision").map(a => a.id));
  const items = [];
  for (const f of data.feedback || []) {
    const isRevision = f.status === "needs_revision";
    if (isRevision && !returned.has(f.assignment_id)) continue;
    const when = f.reviewed_at ? Date.parse(f.reviewed_at) : 0;
    if (!isRevision && (!when || Date.now() - when > RECENT_MS)) continue;
    const kind = isRevision ? "revision" : "feedback";
    items.push({
      key: `${kind}:${f.id}`,
      kind,
      id: f.id,
      assignment_id: f.assignment_id,
      who: labels[f.reviewed_by] || FALLBACK,
      title: f.lesson?.title || "your work",
      message: f.parent_feedback || "",
      next_step: f.next_step || "",
      created_at: f.reviewed_at,
    });
  }
  for (const c of data.cheers || []) {
    items.push({ key: `cheer:${c.id}`, kind: "cheer", id: c.id, who: labels[c.from_user_id] || FALLBACK, message: c.message, emoji: c.emoji, created_at: c.created_at });
  }
  const rank = (k) => (k === "revision" ? 0 : k === "feedback" ? 1 : 2);
  return items
    .filter(i => !seen.includes(i.key))
    .sort((a, b) => rank(a.kind) - rank(b.kind) || String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

export function useChildInbox() {
  const { user } = useAuth();
  const uid = user?.id;
  const [items, setItems] = useState([]);

  const load = useCallback(() => (
    Promise.all([
      api.get("/dashboard/child"),
      api.get("/child/parent-labels").then(r => r.data || {}).catch(() => ({})),
    ]).then(([d, labels]) => setItems(buildItems(d.data || {}, readSeen(uid), labels))).catch(() => {})
  ), [uid]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    const onFocus = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener(EVT, load);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener(EVT, load);
    };
  }, [load]);

  const ack = useCallback(async (item) => {
    const seen = readSeen(uid);
    try { localStorage.setItem(storeKey(uid), JSON.stringify([...seen, item.key].slice(-200))); } catch { /* ignore */ }
    setItems(cur => cur.filter(i => i.key !== item.key));
    window.dispatchEvent(new Event(EVT));
    if (item.kind === "cheer") {
      try { await api.post(`/cheers/${item.id}/seen`); } catch { /* local record already saved */ }
    }
  }, [uid]);

  return { items, ack };
}
