import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Pet, Fern } from "../../components/shared/Botanical";
import { toast } from "sonner";

export default function PetPicker({ onDone }) {
  const [species, setSpecies] = useState([]);
  const [selected, setSelected] = useState("fox");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/pet/species").then(r => setSpecies(r.data)); }, []);

  const create = async () => {
    if (!name.trim()) { toast.error("Give your pet a name"); return; }
    setSaving(true);
    try {
      await api.post("/pet", { name, species: selected });
      toast.success(`${name} is here! 🌱`);
      onDone?.();
    } catch (e) { toast.error("Couldn't create pet"); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <Fern className="absolute -left-10 top-10" size={200} color="#6B8A5B"/>
      <Fern className="absolute -right-10 bottom-10 rotate-180" size={200} color="#6B8A5B"/>
      <div className="paper-card p-8 w-full max-w-2xl relative z-10 animate-sprout" data-testid="pet-picker">
        <h1 className="font-display text-4xl font-bold text-center" style={{color:"#1F3B2D"}}>Choose your learning companion</h1>
        <p className="text-center text-sm text-stone-600 mt-2">They'll grow as you learn. Submit work, earn XP, and watch them sprout.</p>

        <div className="grid grid-cols-4 gap-3 mt-8" data-testid="pet-species-grid">
          {species.map(s => (
            <button key={s.id} onClick={()=>setSelected(s.id)}
              className={`rounded-2xl p-3 border-2 transition hover:translate-y-[-2px] ${selected === s.id ? "border-moss bg-emerald-50" : "border-stone-200 bg-white"}`}
              style={selected === s.id ? {borderColor:"#4A5D3A", backgroundColor:"#F0F4E8"} : {}}
              data-testid={`pet-${s.id}`}>
              <div className="flex justify-center"><Pet species={s.id} size={72}/></div>
              <div className="text-center text-sm font-display font-bold mt-1" style={{color:"#2A2822"}}>{s.label}</div>
              <div className="text-center text-[10px] text-stone-500 italic">{s.voice.split(",")[0]}</div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Name your companion</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Clover, Ash, Pip" maxLength={30}
            className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-3 text-lg font-display bg-paper" style={{backgroundColor:"#FBF7EC"}}
            data-testid="pet-name"/>
        </div>

        <button onClick={create} disabled={saving || !name.trim()}
          className="mt-6 w-full rounded-full py-3 text-base font-bold text-cream hover:translate-y-[-1px] transition disabled:opacity-50"
          style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="create-pet">
          {saving ? "Welcoming them…" : "Welcome my companion"}
        </button>
      </div>
    </div>
  );
}
