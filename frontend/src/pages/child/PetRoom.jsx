import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Pet, Fern, Flower, Branch } from "../../components/shared/Botanical";
import HalloweenOverlay from "../../components/shared/HalloweenOverlay";
import SeasonalWorn from "../../components/shared/SeasonalWorn";
import SeasonalWardrobeItems from "../../components/shared/SeasonalWardrobeItems";
import { toast } from "sonner";
import { ArrowLeft, Apple, Gamepad2, Palette, Sparkles, Loader2, Droplets } from "lucide-react";

const BG_OPTIONS = [
  { id: "meadow", label: "Meadow", bg: "linear-gradient(180deg, #F0FDF4 0%, #D1FAE5 100%)" },
  { id: "sunset", label: "Sunset", bg: "linear-gradient(180deg, #FEF3C7 0%, #FED7AA 100%)" },
  { id: "woodland", label: "Woodland", bg: "linear-gradient(180deg, #ECFCCB 0%, #BBF7D0 100%)" },
  { id: "rose", label: "Rose", bg: "linear-gradient(180deg, #FFE4E6 0%, #FBCFE8 100%)" },
  { id: "sky", label: "Sky", bg: "linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)" },
];

const ACC_EMOJI = {
  scarf: "🧣", bow: "🎀", flower_crown: "🌸", party_hat: "🎉", bookworm_specs: "👓",
  backpack: "🎒", cape: "🧥", star_badge: "⭐", crown: "👑",
};

const EGG_FALLBACK = { base: "#E9C8A0", accent: "#FFFFFF", pattern: "spots", glow: "#FFF0DC" };

// ---------- Egg art: one look per species pattern ----------
const EggPattern = ({ kind, accent }) => {
  const xs = [50, 80, 110, 140];
  switch (kind) {
    case "zigzag":
      return [70, 100, 130].map(y => (
        <polyline key={y} points={`35,${y} 55,${y - 12} 75,${y} 95,${y - 12} 115,${y} 135,${y - 12} 155,${y}`}
          fill="none" stroke={accent} strokeWidth="6" strokeLinejoin="round"/>));
    case "feathers":
      return [[70, 70], [115, 80], [90, 115], [130, 125], [60, 130]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y} q10,-14 20,0 q-10,14 -20,0z`} fill={accent} opacity="0.85"/>));
    case "hexagons":
      return [[70, 80], [105, 80], [88, 110], [123, 110], [70, 140], [105, 140]].map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 14} ${x + 13},${y - 7} ${x + 13},${y + 7} ${x},${y + 14} ${x - 13},${y + 7} ${x - 13},${y - 7}`}
          fill="none" stroke={accent} strokeWidth="4"/>));
    case "spikes":
      return xs.flatMap(x => [75, 110, 145].map(y => (
        <polygon key={`${x}-${y}`} points={`${x - 8},${y} ${x},${y - 18} ${x + 8},${y}`} fill={accent} opacity="0.8"/>)));
    case "stripes":
      return [65, 90, 115, 140].map(y => (
        <rect key={y} x="20" y={y} width="150" height="9" rx="4" fill={accent} opacity="0.8"/>));
    case "hearts":
      return [[70, 80], [118, 95], [88, 130], [128, 140]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y + 6} c-14,-10 -8,-22 0,-14 c8,-8 14,4 0,14z`} fill={accent}/>));
    case "scales":
      return [[60, 80], [95, 80], [130, 80], [78, 105], [113, 105], [60, 130], [95, 130], [130, 130]].map(([x, y], i) => (
        <path key={i} d={`M${x - 15},${y} a15,15 0 0 1 30,0`} fill="none" stroke={accent} strokeWidth="4"/>));
    case "spots":
    default:
      return [[70, 75, 8], [118, 90, 10], [90, 125, 9], [130, 135, 7], [62, 140, 6]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={accent} opacity="0.9"/>));
  }
};

// children are drawn on top of the egg inside its 190x230 drawing (used for worn prizes).
const SpeciesEgg = ({ style, size = 200, reaction, cold, children }) => {
  const s = style || EGG_FALLBACK;
  const id = `egg-${s.pattern}`;
  return (
    <svg viewBox="0 0 190 230" width={size} height={size * 1.2}
      className={`egg ${reaction ? `egg-${reaction}` : "egg-idle"}`}
      style={{ filter: cold ? "grayscale(0.6) brightness(0.9)" : `drop-shadow(0 0 ${reaction === "glow" ? 22 : 8}px ${s.glow})` }}>
      <defs>
        <clipPath id={id}><path d="M95,12 C150,12 175,95 175,140 C175,190 140,218 95,218 C50,218 15,190 15,140 C15,95 40,12 95,12z"/></clipPath>
        <radialGradient id={`${id}-shine`} cx="35%" cy="28%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <path d="M95,12 C150,12 175,95 175,140 C175,190 140,218 95,218 C50,218 15,190 15,140 C15,95 40,12 95,12z" fill={s.base}/>
      <g clipPath={`url(#${id})`}><EggPattern kind={s.pattern} accent={s.accent}/></g>
      <path d="M95,12 C150,12 175,95 175,140 C175,190 140,218 95,218 C50,218 15,190 15,140 C15,95 40,12 95,12z" fill={`url(#${id}-shine)`}/>
      {children}
    </svg>
  );
};

const PET_CSS = `
@keyframes eggIdle { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
@keyframes eggWobble { 0%{transform:rotate(0)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-7deg)} 80%{transform:rotate(4deg)} 100%{transform:rotate(0)} }
@keyframes eggHop { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-22px) scale(1.03)} 70%{transform:translateY(0) scale(0.98,1.03)} }
@keyframes eggGlow { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
@keyframes floatZ { 0%{opacity:0;transform:translate(0,0)} 40%{opacity:1} 100%{opacity:0;transform:translate(14px,-30px)} }
.egg{transform-origin:50% 90%}
.egg-idle{animation:eggIdle 3.2s ease-in-out infinite}
.egg-wobble{animation:eggWobble .7s ease-in-out}
.egg-hop{animation:eggHop .6s ease-out}
.egg-glow{animation:eggGlow .9s ease-in-out}
.zzz{animation:floatZ 2.6s ease-out infinite}
@media (prefers-reduced-motion: reduce){.egg,.zzz{animation:none!important}}
`;

export default function PetRoom() {
  const nav = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState("meadow");
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [reaction, setReaction] = useState(null);

  const apply = (data) => {
    if (!data || data.needs_pet) return;
    setPet(data);
    if (data.background) setBg(data.background);
    setNewName(data.name || "");
  };

  const load = async () => {
    try { apply((await api.get("/pet/state")).data); }
    catch { apply((await api.get("/pet")).data); } // falls back to old endpoint
  };
  useEffect(() => { load(); }, []);

  const react = (kind) => { setReaction(kind); setTimeout(() => setReaction(null), 1000); };

  const act = async (path, legacy, success, kind) => {
    setLoading(true);
    try {
      let res;
      try { res = await api.post(path); }
      catch (e) {
        if (e?.response?.status === 404 && legacy) res = await api.post(legacy);
        else throw e;
      }
      toast.success(res?.data?.revived ? `${pet.name} woke up! Take good care of them.` : success);
      react(kind);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Try again shortly");
    } finally { setLoading(false); }
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

  const toggleAcc = async (id) => {
    const worn = pet.accessories || [];
    const next = worn.includes(id) ? worn.filter(a => a !== id) : [...worn, id];
    setPet({ ...pet, accessories: next });
    try { await api.put("/pet/care/wear", { accessories: next }); }
    catch { toast.error("Could not change accessories"); load(); }
  };

  if (!pet) return <div className="text-stone-500">Loading your room…</div>;

  const bgStyle = BG_OPTIONS.find(b => b.id === bg)?.bg || BG_OPTIONS[0].bg;
  const hatched = pet.hatched !== undefined ? pet.hatched : pet.level_name !== "Egg";
  const status = pet.care_status || "ok";
  const asleep = status === "asleep";
  const sick = status === "sick";
  const sad = status === "sad" || sick || asleep;
  const pct = pet.next_xp ? Math.min(100, Math.round((pet.xp / pet.next_xp) * 100)) : 100;
  const care = pet.care || {};
  const hatch = pet.hatch;
  const worn = pet.accessories || [];
  const catalog = pet.accessory_catalog || [];

  const statusText = {
    ok: null,
    chilly: `${pet.name}'s egg is getting chilly. Warm it up!`,
    cold: `${pet.name}'s egg is cold. Please warm it up soon.`,
    sad: `${pet.name} is feeling sad and hungry.`,
    sick: `${pet.name} is sick! Feed and clean up to help.`,
    asleep: `${pet.name} has fallen asleep. Feed them to wake them up.`,
  }[status];

  return (
    <div className="space-y-5 animate-in" data-testid="pet-room">
      <style>{PET_CSS}</style>
      <button onClick={() => nav("/child")} className="text-sm font-bold flex items-center gap-1" style={{ color: "#4A5D3A" }} data-testid="back-home"><ArrowLeft size={14} /> Back</button>

      <header>
        <div className="font-script text-2xl" style={{ color: "#C77B5B" }}>Welcome to</div>
        <h1 className="font-display text-4xl font-bold" style={{ color: "#1F3B2D" }}>{pet.name}'s room</h1>
      </header>

      {statusText && (
        <div className="paper-card p-3 text-sm font-bold" style={{ color: "#9A3412" }} data-testid="pet-status">{statusText}</div>
      )}
      {care.paused && (
        <div className="paper-card p-3 text-sm" style={{ color: "#1F3B2D" }}>Your parent has paused pet care. Enjoy the break!</div>
      )}

      <div className="paper-card overflow-hidden relative" data-testid="pet-stage">
        <div className="relative h-80 flex items-end justify-center" style={{ background: bgStyle }}>
          <HalloweenOverlay />
          <Fern className="absolute left-4 bottom-0" size={160} color="#4A5D3A" />
          <Fern className="absolute right-4 bottom-0" size={140} color="#6B8A5B" />
          <Flower className="absolute left-28 bottom-6" size={28} color="#D4857A" />
          <Flower className="absolute right-32 bottom-10" size={24} color="#C77B5B" />
          <Branch className="absolute right-10 top-4" size={120} color="#4A5D3A" />
          <div className="relative z-10 mb-2 flex flex-col items-center">
            <div className="relative" onClick={() => react(hatched ? "hop" : "wobble")}
              style={{ filter: sick ? "grayscale(0.7)" : asleep ? "brightness(0.75)" : "none", cursor: "pointer" }}>
              {hatched
                ? <Pet species={pet.species} size={200} happy={!sad && pet.happiness > 40}><SeasonalWorn /></Pet>
                : <SpeciesEgg style={pet.egg_style} size={150} reaction={reaction} cold={status === "cold" || status === "chilly"}><SeasonalWorn layout="egg" /></SpeciesEgg>}
              {hatched && worn.length > 0 && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 text-2xl" data-testid="worn-accessories">
                  {worn.map(a => <span key={a}>{ACC_EMOJI[a] || "✨"}</span>)}
                </div>
              )}
              {asleep && <div className="zzz absolute -top-4 right-0 text-3xl font-bold" style={{ color: "#4A5D3A" }}>Zzz</div>}
              {sick && <div className="absolute top-0 right-0 text-3xl">🤒</div>}
              {care.needs_cleaning && hatched && (
                <button onClick={(e) => { e.stopPropagation(); act("/pet/care/clean", null, "All clean!", "hop"); }}
                  className="absolute bottom-0 -right-10 text-4xl hover:scale-110 transition" aria-label="Clean up" data-testid="poop">💩</button>
              )}
            </div>
            <div className="mt-3 paper-card px-4 py-2 flex items-center gap-2">
              {!renaming ? (
                <>
                  <span className="font-script text-2xl" style={{ color: "#C77B5B" }}>{pet.name}</span>
                  <button onClick={() => setRenaming(true)} className="text-[10px] font-bold uppercase tracking-widest text-stone-500" data-testid="rename-btn">rename</button>
                </>
              ) : (
                <>
                  <input value={newName} onChange={e => setNewName(e.target.value)} className="font-script text-xl text-center rounded border px-2 py-0.5 w-32 bg-paper" style={{ borderColor: "#D4C8A8" }} data-testid="rename-input" />
                  <button onClick={saveName} className="text-[10px] font-bold uppercase text-emerald-700" data-testid="save-name">save</button>
                  <button onClick={() => { setRenaming(false); setNewName(pet.name); }} className="text-[10px] text-stone-400">x</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4 bg-white">
          <StatBar label="Level" value={pet.level_name} badge={pet.level_icon} />
          <ProgressBar label="XP" value={pet.xp} max={pet.next_xp || pet.xp} pct={pct} color="#059669" />
          <ProgressBar label="Happiness" value={pet.happiness} max={100} pct={pet.happiness} color="#D4857A" />
        </div>
        {!hatched && hatch && (
          <div className="px-5 pb-5 bg-white text-xs text-stone-600" data-testid="hatch-progress">
            To hatch: reach {hatch.xp_needed} XP and care for your egg on {hatch.care_days_needed} different days ({hatch.care_days_done}/{hatch.care_days_needed} so far).
          </div>
        )}
      </div>

      <section className="grid md:grid-cols-4 gap-4">
        <ActionCard title={hatched ? "Feed" : "Warm up"} subtitle={hatched ? "Keep tummies full each day" : "Keep your egg snug"} icon={Apple} tint="#C77B5B"
          onClick={() => act("/pet/care/feed", "/pet/feed", hatched ? `${pet.name} loved that!` : "The egg feels warm and cosy", hatched ? "hop" : "glow")} loading={loading} testid="feed-btn" />
        <ActionCard title={hatched ? "Play" : "Cuddle"} subtitle="A quick game, a happier friend" icon={Gamepad2} tint="#6B8A5B"
          onClick={() => act("/pet/care/play", "/pet/play", hatched ? `${pet.name} is giggling!` : "The egg wiggles happily", hatched ? "hop" : "wobble")} loading={loading} testid="play-btn" />
        {hatched && (
          <ActionCard title="Clean up" subtitle={care.needs_cleaning ? "There's a mess to clear!" : "All tidy for now"} icon={Droplets} tint="#3B82F6"
            onClick={() => act("/pet/care/clean", null, "All clean!", "hop")} loading={loading || !care.needs_cleaning} testid="clean-btn" />
        )}
        <div className="paper-card p-5" data-testid="customize-card">
          <div className="h-11 w-11 rounded-xl grid place-items-center mb-3" style={{ backgroundColor: "#D4A57422", color: "#C8893B" }}><Palette size={20} /></div>
          <div className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>Decorate the room</div>
          <p className="text-xs text-stone-600 mt-1 mb-3">Pick a scene — it's saved automatically.</p>
          <div className="flex flex-wrap gap-2">
            {BG_OPTIONS.map(b => (
              <button key={b.id} onClick={() => chooseBg(b.id)}
                className={`h-10 w-10 rounded-xl border-2 overflow-hidden ${bg === b.id ? "ring-2" : ""}`}
                style={{ background: b.bg, borderColor: bg === b.id ? "#1F3B2D" : "#D4C8A8" }}
                aria-label={b.label} data-testid={`bg-${b.id}`} />
            ))}
          </div>
        </div>
      </section>

      {catalog.length > 0 && (
        <section className="paper-card p-5" data-testid="wardrobe">
          <h2 className="font-display text-lg font-bold mb-1" style={{ color: "#1F3B2D" }}>Wardrobe</h2>
          <p className="text-xs text-stone-600 mb-3">Earn accessories as you grow. Wear them whenever you like.</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {catalog.map(a => {
              const on = worn.includes(a.id);
              return (
                <button key={a.id} disabled={!a.unlocked || !hatched} onClick={() => toggleAcc(a.id)}
                  className="rounded-xl border-2 p-3 text-center disabled:opacity-40"
                  style={{ borderColor: on ? "#1F3B2D" : "#D4C8A8", background: on ? "#ECFCCB" : "#fff" }}
                  data-testid={`acc-${a.id}`}>
                  <div className="text-3xl">{a.unlocked ? (ACC_EMOJI[a.id] || "✨") : "🔒"}</div>
                  <div className="text-[11px] font-bold mt-1" style={{ color: "#1F3B2D" }}>{a.label}</div>
                  {!a.unlocked && <div className="text-[10px] text-stone-500 mt-0.5">{ruleText(a.rule)}</div>}
                </button>
              );
            })}
            <SeasonalWardrobeItems hatched />
          </div>
        </section>
      )}

      <section className="paper-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: "#4A5D3A" }} />
          <h2 className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>How to grow {pet.name}</h2>
        </div>
        <ul className="text-sm text-stone-700 space-y-1.5">
          <li>· Submit a lesson for review (+15 XP)</li>
          <li>· Earn <strong>accepted</strong> from your parent (+25 XP)</li>
          <li>· Earn <strong>demonstrated</strong> from your parent (+50 XP)</li>
          <li>· Log a book you read (+3 XP)</li>
          <li>· Feed {pet.name} and clean up their mess every day</li>
          <li>· Play for a little XP (up to 5 times a day)</li>
        </ul>
        <div className="mt-4 text-xs text-stone-500">Levels: Egg → Hatchling → Youngling → Companion → Hero → Legend</div>
      </section>
    </div>
  );
}

const ruleText = (rule = "") => {
  const [k, v] = rule.split(":");
  if (k === "stage") return `Reach ${v}`;
  if (k === "streak") return `${v}-day care streak`;
  if (k === "cleans") return `Clean up ${v} times`;
  if (k === "reading") return `Log ${v} books`;
  return "Keep growing";
};

const ActionCard = ({ title, subtitle, icon: Icon, tint, onClick, loading, testid }) => (
  <button onClick={onClick} disabled={loading} className="paper-card p-5 text-left hover:translate-y-[-2px] transition disabled:opacity-50" data-testid={testid}>
    <div className="h-11 w-11 rounded-xl grid place-items-center mb-3" style={{ backgroundColor: tint + "22", color: tint }}>
      {loading ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
    </div>
    <div className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>{title}</div>
    <p className="text-xs text-stone-600 mt-1">{subtitle}</p>
  </button>
);
const StatBar = ({ label, value, badge }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div>
    <div className="font-display text-lg font-bold flex items-center gap-1" style={{ color: "#1F3B2D" }}>{value} {badge && <span className="text-[10px] font-mono text-stone-500">· {badge}</span>}</div>
  </div>
);
const ProgressBar = ({ label, value, max, pct, color }) => (
  <div>
    <div className="flex items-baseline justify-between"><div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div><div className="text-[10px] font-mono text-stone-500">{value}{max ? ` / ${max}` : ""}</div></div>
    <div className="mt-1 h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }}></div></div>
  </div>
);
