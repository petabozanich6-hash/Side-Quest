import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Heart, MessageCircle, RotateCcw } from "lucide-react";

const KEY = "sq_child_inbox_snoozed";
const readSnoozed = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch { return []; }
};

const heading = (i) => i.kind === "cheer" ? `${i.from_name || "Your parent"} sent you a cheer`
  : i.kind === "revision" ? `Time to try "${i.title}" again`
  : `Feedback on "${i.title}"`;
const buttonText = (i) => i.kind === "revision" ? "Let's go" : "Got it!";
const Icon = ({ kind }) => kind === "cheer" ? <Heart size={20} style={{color:"#C77B5B"}}/> : kind === "revision" ? <RotateCcw size={20} style={{color:"#C77B5B"}}/> : <MessageCircle size={20} style={{color:"#4A5D3A"}}/>;

export default function ChildInbox() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [snoozed, setSnoozed] = useState(readSnoozed);
  const big = user?.theme === "early";

  const load = () => api.get("/child/inbox").then(r => setItems(Array.isArray(r.data) ? r.data : [])).catch(() => {});
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

  const fresh = items.filter(i => !snoozed.includes(i.key));
  useEffect(() => {
    if (fresh.length && !pathname.includes("/lesson/")) setOpen(true);
  }, [fresh.length, pathname]);

  if (!items.length) return null;

  const later = () => {
    const next = [...snoozed, ...items.map(i => i.key)];
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setSnoozed(next);
    setOpen(false);
  };

  const respond = async (item) => {
    setItems(cur => cur.filter(i => i.key !== item.key));
    if (items.length <= 1) setOpen(false);
    try { await api.post("/child/inbox/seen", { kind: item.kind, id: item.id }); } catch { /* keep going */ }
    if (item.kind === "revision" && item.assignment_id) nav(`/child/lesson/${item.assignment_id}`);
  };

  const n = items.length;
  const hasRevision = items.some(i => i.kind === "revision");
  const barText = hasRevision ? "Your parent sent some work back to try again" : n === 1 ? "You have a new message from your parent" : `You have ${n} new messages from your parent`;

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-4">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl px-5 py-3" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} role="alert" data-testid="child-inbox-bar">
          <Heart size={big ? 28 : 22} className="shrink-0"/>
          <div className={`flex-1 min-w-[200px] font-display font-bold ${big ? "text-xl" : "text-base"}`}>{barText}</div>
          <button onClick={() => setOpen(true)} className="rounded-full px-5 py-2 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="child-inbox-open">Read it</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="child-inbox-popup">
          <div className="w-full max-w-md paper-card p-6" style={{borderTop:"4px solid #C77B5B"}}>
            <h2 className={`font-display font-bold text-center ${big ? "text-3xl" : "text-2xl"}`} style={{color:"#1F3B2D"}}>You have news!</h2>
            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {items.slice(0, 3).map(i => (
                <div key={i.key} className="rounded-xl bg-white border p-4" style={{borderColor:"#E4DAC0"}} data-testid={`inbox-${i.key}`}>
                  <div className="flex items-center gap-2"><Icon kind={i.kind}/><div className={`font-display font-bold ${big ? "text-lg" : "text-sm"}`} style={{color:"#1F3B2D"}}>{heading(i)}</div></div>
                  {i.kind === "cheer" && <p className={`mt-2 ${big ? "text-lg" : "text-sm"}`}><span className="text-2xl mr-1">{i.emoji}</span>{i.message}</p>}
                  {i.kind !== "cheer" && (
                    <>
                      {i.message ? <p className={`mt-2 ${big ? "text-lg" : "text-sm"}`}>{i.message}</p> : <p className={`mt-2 ${big ? "text-lg" : "text-sm"}`}>{i.kind === "revision" ? "Have another go when you're ready." : "Your parent looked at this and is happy with it."}</p>}
                      {i.next_step && <p className={`mt-2 opacity-80 ${big ? "text-base" : "text-xs"}`}><strong>Next:</strong> {i.next_step}</p>}
                    </>
                  )}
                  <button onClick={() => respond(i)} className={`mt-3 w-full rounded-full py-2.5 font-bold ${big ? "text-base" : "text-sm"}`} style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`inbox-ack-${i.key}`}>{buttonText(i)}</button>
                </div>
              ))}
            </div>
            {n > 3 && <p className="mt-3 text-center text-xs text-stone-500">And {n - 3} more waiting after these.</p>}
            <button onClick={later} className="mt-4 w-full text-xs font-bold text-stone-500" data-testid="child-inbox-later">Later</button>
          </div>
        </div>
      )}
    </>
  );
}
