import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export default function HelpAlertBar() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();
  const { pathname } = useLocation();

  const load = () => api.get("/help-requests").then(r => setItems(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    const onFocus = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  if (!items.length || pathname.startsWith("/parent/children")) return null;

  const dismissAll = async () => {
    try {
      await Promise.all(items.map(v => api.post(`/help-requests/${v.id}/resolve`)));
      setItems([]);
      toast.success("Marked as sorted");
    } catch { toast.error("Couldn't update that"); }
  };

  const names = items.map(v => v.name);
  const who = names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-3 px-6 py-3" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} role="alert" data-testid="help-alert-bar">
      <Compass size={22} className="shrink-0"/>
      <div className="flex-1 min-w-[220px]">
        <div className="font-display text-base font-bold">{who} {names.length === 1 ? "has" : "have"} lost the key to their quest</div>
        <div className="text-xs opacity-90">Asking for help signing in. Open the Children page to see their login or set a new PIN.</div>
      </div>
      <button onClick={() => nav("/parent/children")} className="rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="help-bar-go">Go to Children</button>
      <button onClick={dismissAll} className="rounded-full px-4 py-2 text-xs font-bold border" style={{borderColor:"#FBF7EC", color:"#FBF7EC"}} data-testid="help-bar-dismiss">Dismiss</button>
    </div>
  );
}
