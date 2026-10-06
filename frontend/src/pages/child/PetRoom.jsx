import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Pet, Fern, Flower, Leaf, Branch } from "../../components/shared/Botanical";
import { toast } from "sonner";
import { ArrowLeft, Apple, Gamepad2, Palette, Sparkles, Loader2 } from "lucide-react";

const BG_OPTIONS = [
  { id: "meadow", label: "Meadow", bg: "linear-gradient(180deg, #F0FDF4 0%, #D1FAE5 100%)" },
  { id: "sunset", label: "Sunset", bg: "linear-gradient(180deg, #FEF3C7 0%, #FED7AA 100%)" },
  { id: "woodland", label: "Woodland", bg: "linear-gradient(180deg, #ECFCCB 0%, #BBF7D0 100%)" },
  { id: "rose", label: "Rose", bg: "linear-gradient(180deg, #FFE4E6 0%, #FBCFE8 100%)" },
  { id: "sky", label: "Sky", bg: "linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)" },
];

export default function PetRoom() {
  const nav = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState("meadow");
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const load = () => api.get("/pet").then(r => {
    if (!r.data?.needs_pet) {
      setPet(r.data);
      if (r.data.background) setBg(r.data.background);
      setNewName(r.data.name || "");
    }
  });
  useEffect(() => { load(); }, []);

  const act = async (endpoint, success) => {
    setLoading(true);
    try {
      await api.post(endpoint);
      toast.success(success);
      await load();
    } catch { toast.error("Try again shortly"); }
    finally { setLoading(false); }
  };

  const chooseBg = async (id) => {
    setBg(id);
    try { await api.put("/pet/customize", { background: id }); toast.success("Room decorated"); } catch {}
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    try {
      await api.put("/pet/customize", { name: newName });
      toast.success("Name saved"); setRenaming(false); load();
    } catch { toast.error("Failed"); }
  };

  if (!pet) return <div className="text-stone-500">Loading your room…</div>;

  const bgStyle = BG_OPTIONS.find(b => b.id === bg)?.bg || BG_OPTIONS[0].bg;
  const pct = pet.next_xp ? Math.min(100, Math.round((pet.xp / pet.next_xp) * 100)) : 100;

  return (
    <div className="space-y-5 animate-in" data-testid="pet-room">
      <button onClick={()=>nav("/child")} className="text-sm font-bold flex items-center gap-1" style={{color:"#4A5D3A"}} data-testid="back-home"><ArrowLeft size={14}/> Back</button>

      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Welcome to</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>{pet.name}'s room</h1>
      </header>

      <div className="paper-card overflow-hidden relative" data-testid="pet-stage">
        <div className="relative h-80 flex items-end justify-center" style={{background: bgStyle}}>
          <Fern className="absolute left-4 bottom-0" size={160} color="#4A5D3A"/>
          <Fern className="absolute right-4 bottom-0" size={140} color="#6B8A5B"/>
          <Flower className="absolute left-28 bottom-6" size={28} color="#D4857A"/>
          <Flower className="absolute right-32 bottom-10" size={24} color="#C77B5B"/>
          <Branch className="absolute right-10 top-4" size={120} color="#4A5D3A"/>
          <div className="relative z-10 mb-2 flex flex-col items-center">
            <Pet species={pet.species} size={200} happy={pet.happiness > 40}/>
            <div className="mt-3 paper-card px-4 py-2 flex items-center gap-2">
              {!renaming ? (
                <>
                  <span className="font-script text-2xl" style={{color:"#C77B5B"}}>{pet.name}</span>
                  <button onClick={()=>setRenaming(true)} className="text-[10px] font-bold uppercase tracking-widest text-stone-500" data-testid="rename-btn">rename</button>
                </>
              ) : (
                <>
                  <input value={newName} onChange={e=>setNewName(e.target.value)} className="font-script text-xl text-center rounded border px-2 py-0.5 w-32 bg-paper" style={{borderColor:"#D4C8A8"}} data-testid="rename-input"/>
                  <button onClick={saveName} className="text-[10px] font-bold uppercase text-emerald-700" data-testid="save-name">save</button>
                  <button onClick={()=>{setRenaming(false); setNewName(pet.name);}} className="text-[10px] text-stone-400">x</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4 bg-white">
          <StatBar label="Level" value={pet.level_name} badge={pet.level_icon}/>
          <ProgressBar label="XP" value={pet.xp} max={pet.next_xp || pet.xp} pct={pct} color="#059669"/>
          <ProgressBar label="Happiness" value={pet.happiness} max={100} pct={pet.happiness} color="#D4857A"/>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <ActionCard title="Feed" subtitle="A little snack keeps spirits up" icon={Apple} tint="#C77B5B" onClick={()=>act("/pet/feed", `${pet.name} loved that!`)} loading={loading} testid="feed-btn"/>
        <ActionCard title="Play" subtitle="A quick game, a happier friend" icon={Gamepad2} tint="#6B8A5B" onClick={()=>act("/pet/play", `${pet.name} is giggling!`)} loading={loading} testid="play-btn"/>
        <div className="paper-card p-5" data-testid="customize-card">
          <div className="h-11 w-11 rounded-xl grid place-items-center mb-3" style={{backgroundColor:"#D4A57422", color:"#C8893B"}}><Palette size={20}/></div>
          <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>Decorate the room</div>
          <p className="text-xs text-stone-600 mt-1 mb-3">Pick a scene — it's saved automatically.</p>
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.map(b => (
              <button key={b.id} onClick={()=>chooseBg(b.id)}
                className={`h-10 w-10 rounded-xl border-2 overflow-hidden ${bg === b.id ? "ring-2" : ""}`}
                style={{background: b.bg, borderColor: bg === b.id ? "#1F3B2D" : "#D4C8A8"}}
                aria-label={b.label}
                data-testid={`bg-${b.id}`}/>
            ))}
          </div>
        </div>
      </section>

      <section className="paper-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{color:"#4A5D3A"}}/>
          <h2 className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>How to grow {pet.name}</h2>
        </div>
        <ul className="text-sm text-stone-700 space-y-1.5">
          <li>· Submit a lesson for review (+15 XP)</li>
          <li>· Earn <strong>accepted</strong> from your parent (+25 XP)</li>
          <li>· Earn <strong>demonstrated</strong> from your parent (+50 XP)</li>
          <li>· Log a book you read (+3 XP)</li>
          <li>· Visit this room to feed and play (keeps happiness up)</li>
        </ul>
        <div className="mt-4 text-xs text-stone-500">Levels: Egg → Hatchling → Youngling → Companion → Hero → Legend</div>
      </section>
    </div>
  );
}

const ActionCard = ({ title, subtitle, icon: Icon, tint, onClick, loading, testid }) => (
  <button onClick={onClick} disabled={loading} className="paper-card p-5 text-left hover:translate-y-[-2px] transition disabled:opacity-50" data-testid={testid}>
    <div className="h-11 w-11 rounded-xl grid place-items-center mb-3" style={{backgroundColor: tint + "22", color: tint}}>
      {loading ? <Loader2 size={20} className="animate-spin"/> : <Icon size={20}/>}
    </div>
    <div className="font-display text-lg font-bold" style={{color:"#1F3B2D"}}>{title}</div>
    <p className="text-xs text-stone-600 mt-1">{subtitle}</p>
  </button>
);
const StatBar = ({ label, value, badge }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div>
    <div className="font-display text-lg font-bold flex items-center gap-1" style={{color:"#1F3B2D"}}>{value} {badge && <span className="text-[10px] font-mono text-stone-500">· {badge}</span>}</div>
  </div>
);
const ProgressBar = ({ label, value, max, pct, color }) => (
  <div>
    <div className="flex items-baseline justify-between"><div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div><div className="text-[10px] font-mono text-stone-500">{value}{max ? ` / ${max}` : ""}</div></div>
    <div className="mt-1 h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="h-full" style={{width: `${pct}%`, backgroundColor: color}}></div></div>
  </div>
);
