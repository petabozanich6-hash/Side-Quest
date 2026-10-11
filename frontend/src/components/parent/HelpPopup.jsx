import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Compass } from "lucide-react";

const KEY = "sq_help_snoozed";
const readSnoozed = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export default function HelpPopup() {
  const [items, setItems] = useState([]);
  const [snoozed, setSnoozed] = useState(readSnoozed);
  const nav = useNavigate();
  const { pathname } = useLocation();

  const load = () => api.get("/help-requests").then(r => setItems(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const visible = items.filter(i => !snoozed.includes(i.id));
  if (!visible.length || pathname.startsWith("/parent/children")) return null;

  const snooze = () => {
    const next = [...snoozed, ...visible.map(v => v.id)];
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setSnoozed(next);
  };
  const goChildren = () => { snooze(); nav("/parent/children"); };
  const dismissAll = async () => {
    try {
      await Promise.all(visible.map(v => api.post(`/help-requests/${v.id}/resolve`)));
      setItems(cur => cur.filter(i => !visible.some(v => v.id === i.id)));
      toast.success("Marked as sorted");
    } catch { toast.error("Couldn't update that"); }
  };

  const names = visible.map(v => v.name);
  const who = names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="help-popup">
      <div className="w-full max-w-md paper-card p-6 text-center" style={{borderTop:"4px solid #C77B5B"}}>
        <div className="mx-auto h-12 w-12 rounded-full grid place-items-center" style={{backgroundColor:"#F5EFE0"}}><Compass size={24} style={{color:"#C77B5B"}}/></div>
        <h2 className="mt-3 font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>{who} {names.length === 1 ? "has" : "have"} lost the key to their quest</h2>
        <p className="mt-2 text-sm text-stone-600">{names.length === 1 ? "They're" : "They're"} asking for help signing in. Open the Children page to see their login, or set a new PIN.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button onClick={goChildren} className="w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="help-popup-go">Go to Children</button>
          <button onClick={dismissAll} className="w-full rounded-full py-3 text-sm font-bold border" style={{borderColor:"#D4C8A8", color:"#1F3B2D"}} data-testid="help-popup-dismiss">Already sorted, dismiss</button>
          <button onClick={snooze} className="text-xs font-bold text-stone-500 mt-1" data-testid="help-popup-later">Remind me later</button>
        </div>
      </div>
    </div>
  );
}
