import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Pet } from "./Botanical";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function PetCompanion({ lessonId, onNeedPet }) {
  const [pet, setPet] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [situation, setSituation] = useState("");

  const load = () => api.get("/pet").then(r => {
    if (r.data.needs_pet) { onNeedPet?.(); setPet(null); }
    else setPet(r.data);
  }).catch(()=>{});

  useEffect(() => { load(); }, []);

  const askHelp = async () => {
    setLoading(true); setMessage("");
    try {
      const { data } = await api.post("/pet/help", { lesson_id: lessonId, situation });
      setMessage(data.message);
    } catch (e) { toast.error("My pet is napping — try again shortly"); }
    finally { setLoading(false); }
  };

  if (!pet) return null;

  const pct = pet.next_xp ? Math.min(100, Math.round(((pet.xp - (pet.next_xp === 10 ? 0 : (pet.xp - (pet.xp % 10)))) / (pet.next_xp - 0)) * 100)) : 100;

  return (
    <>
      <button onClick={()=>setOpen(true)} className="fixed bottom-5 right-5 z-40 group" data-testid="pet-button" aria-label="Open my pet">
        <div className="paper-card p-3 flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
          <Pet species={pet.species} size={56}/>
          <div className="text-left pr-2">
            <div className="font-display text-sm font-bold text-stone-800 leading-tight">{pet.name}</div>
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">{pet.level_name} · {pet.xp} XP</div>
          </div>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={()=>setOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-md paper-card p-6 animate-sprout" data-testid="pet-modal">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-script text-2xl text-moss" style={{color:"#4A5D3A"}}>{pet.name}</div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">{pet.level_name} {pet.level_icon}</div>
              </div>
              <button onClick={()=>setOpen(false)} className="text-stone-400 hover:text-stone-700" data-testid="pet-close"><X size={18}/></button>
            </div>
            <div className="flex justify-center my-2">
              <Pet species={pet.species} size={120} happy={pet.happiness > 40}/>
            </div>
            <div className="space-y-2 mb-4">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1"><span>XP</span><span>{pet.xp}{pet.next_xp ? ` / ${pet.next_xp}` : ""}</span></div>
                <div className="h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{width: `${pct}%`}}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1"><span>Happiness</span><span>{pet.happiness}%</span></div>
                <div className="h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-rose-300 to-rose-500" style={{width: `${pet.happiness}%`}}></div></div>
              </div>
            </div>

            {message ? (
              <div className="speech-bubble mb-4 text-sm leading-relaxed" data-testid="pet-message">{message}</div>
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 mb-3">
                Grow {pet.name} by submitting work. Earn more XP when your parent accepts your work.
              </div>
            )}

            {lessonId && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">What's tricky?</label>
                <textarea rows={2} value={situation} onChange={e=>setSituation(e.target.value)} placeholder={`Tell ${pet.name} what you're stuck on…`} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-paper" data-testid="pet-situation" style={{backgroundColor:"#FBF7EC"}}/>
                <button onClick={askHelp} disabled={loading} className="w-full rounded-full bg-forest text-cream py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="pet-help">
                  {loading ? <><Loader2 size={14} className="animate-spin"/> Thinking…</> : <><Sparkles size={14}/> Ask {pet.name} for a nudge</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
