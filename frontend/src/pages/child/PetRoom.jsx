import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import SeasonalWorn from "../../components/shared/SeasonalWorn";
import SeasonalWardrobeItems from "../../components/shared/SeasonalWardrobeItems";
import { toast } from "sonner";
import { ArrowLeft, Apple, Gamepad2, Palette, Sparkles, Loader2 } from "lucide-react";
import RoomScene from "../../components/petroom/RoomScene";
import NestShop from "../../components/petroom/NestShop";
import { ITEMS, placeAt, readRoom, rewardWorthShowing } from "../../components/petroom/roomLogic";
import { RewardBanner, takeRewardDiff } from "../../components/petroom/RewardPulse";
import { usePrefersReducedMotion } from "../../components/petroom/usePetDirector";
import "../../components/petroom/room.css";

const EGG_FALLBACK = { base: "#E9C8A0", accent: "#FFFFFF", pattern: "spots", glow: "#FFF0DC" };

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

const SpeciesEgg = ({ style, size = 200, reaction, children }) => {
  const s = style || EGG_FALLBACK;
  const id = `egg-${s.pattern}`;
  return (
    <svg viewBox="0 0 190 230" width={size} height={size * 1.2}
      className={`egg ${reaction ? `egg-${reaction}` : "egg-idle"}`}>
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
.egg{transform-origin:50% 90%; filter: drop-shadow(0 8px 0 rgba(31,59,45,0.08))}
.egg-idle{animation:eggIdle 3.2s ease-in-out infinite}
.egg-wobble{animation:eggWobble .7s ease-in-out}
.egg-hop{animation:eggHop .6s ease-out}
.egg-glow{animation:eggGlow .9s ease-in-out}
@media (prefers-reduced-motion: reduce){.egg{animation:none!important}}
`;

const ACC_EMOJI = {
  scarf: "🧣", bow: "🎀", flower_crown: "🌸", party_hat: "🎉", bookworm_specs: "👓",
  backpack: "🎒", cape: "🧥", star_badge: "⭐", crown: "👑",
};

const XP_SOURCES = [
  ["Hand in a lesson for review", "+15 XP"],
  ["Your parent marks it demonstrated", "+50 XP"],
  ["Your parent marks it accepted", "+25 XP"],
  ["Your parent says it needs more practice", "+10 XP"],
  ["Your parent sends it back to try again", "+5 XP"],
  ["Log a book you read", "+3 XP"],
  ["Play together (up to 5 times a day)", "+2 XP"],
];

const GROWTH_STAGES = [
  ["Hatchling", "60 XP"],
  ["Youngling", "200 XP"],
  ["Companion", "500 XP"],
  ["Hero", "1,000 XP"],
  ["Legend", "2,000 XP"],
];

export default function PetRoom() {
  const nav = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [reaction, setReaction] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [command, setCommand] = useState(null);
  const [reward, setReward] = useState(null);
  const [justBought, setJustBought] = useState(null);
  const rewarded = useRef(false);

  const apply = (data) => {
    if (!data || data.needs_pet) return;
    const room = data.room || readRoom({}, data.background);
    setPet({ ...data, room });
    setNewName(data.name || "");
  };

  const load = async () => {
    try { apply((await api.get("/pet/state")).data); }
    catch { apply((await api.get("/pet")).data); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!pet?.student_id || rewarded.current) return;
    rewarded.current = true;
    const diff = takeRewardDiff(pet.student_id, {
      xp: pet.xp,
      acorns: pet.economy?.acorns || 0,
      level: pet.level_name,
    });
    if (rewardWorthShowing(diff)) {
      setReward(diff);
      if (pet.hatched) setCommand({ id: Date.now(), type: "celebrate" });
    }
  }, [pet]);

  useEffect(() => {
    if (!reward) return undefined;
    const timer = setTimeout(() => setReward(null), 4200);
    return () => clearTimeout(timer);
  }, [reward]);

  const ask = (type, item) => setCommand({ id: `${type}-${Date.now()}`, type, item });
  const react = (kind) => { setReaction(kind); setTimeout(() => setReaction(null), 1000); };

  const saveRoom = async (partial) => {
    const room = { ...pet.room, ...partial };
    const previous = pet;
    setPet({ ...pet, room });
    try {
      const { data } = await api.put("/pet/room", {
        theme: room.theme,
        floor: room.floor,
        lampOn: room.lampOn,
        placements: room.placements,
      });
      apply(data);
    } catch (error) {
      setPet(previous);
      toast.error(error?.response?.data?.detail || "Could not save the room");
    }
  };

  const care = async (path, success, kind) => {
    setLoading(true);
    try {
      const res = await api.post(path);
      toast.success(success);
      if (kind) react(kind);
      apply(res.data?.name ? res.data : pet);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      if (detail) toast(detail);
      else toast.error("Try again shortly");
    } finally { setLoading(false); }
  };

  const buy = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.post("/pet/shop/buy", { item_id: itemId });
      apply(data);
      setJustBought(itemId);
      toast.success("Added to your cupboard");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not add that");
    } finally { setLoading(false); }
  };

  const putInRoom = (itemId) => {
    const spec = ITEMS[itemId];
    const result = placeAt(pet.room, itemId, spec?.wall ? 0.72 : 0.68, spec?.wall ? 0.22 : 0.66);
    if (result.error) toast.error(result.error);
    else saveRoom({ placements: result.placements });
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    try {
      await api.put("/pet/customize", { name: newName });
      toast.success("Name saved");
      setRenaming(false);
      load();
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

  const room = pet.room;
  const hatched = pet.hatched !== undefined ? pet.hatched : pet.level_name !== "Egg";
  const pct = pet.next_xp ? Math.min(100, Math.round((pet.xp / pet.next_xp) * 100)) : 100;
  const hatch = pet.hatch;
  const worn = pet.accessories || [];
  const catalog = pet.accessory_catalog || [];
  const cupboard = (room.owned || []).filter((id) => ITEMS[id] && !room.placements.some((placement) => placement.item === id));

  return (
    <div className="space-y-5 animate-in" data-testid="pet-room">
      <style>{PET_CSS}</style>
      <RewardBanner diff={reward} />
      <button onClick={() => nav("/child")} className="text-sm font-bold flex items-center gap-1" style={{ color: "#4A5D3A" }} data-testid="back-home"><ArrowLeft size={14} /> Back</button>

      <header className="flex items-end justify-between gap-3">
        <div>
          <div className="font-script text-2xl" style={{ color: "#C77B5B" }}>Welcome to</div>
          <h1 className="font-display text-4xl font-bold" style={{ color: "#1F3B2D" }}>{pet.name}'s room</h1>
        </div>
      </header>

      {pet.care?.paused && (
        <div className="paper-card p-3 text-sm" style={{ color: "#1F3B2D" }}>Your parent has paused pet care. Enjoy the break!</div>
      )}

      <div className="paper-card overflow-hidden" data-testid="pet-stage">
        <RoomScene
          room={room}
          species={pet.species}
          hatched={hatched}
          editing={editing}
          reduced={reduced}
          command={hatched ? command : null}
          selectedItem={selectedItem}
          onCommand={ask}
          onPlacements={(placements) => saveRoom({ placements })}
          onLamp={(lampOn) => saveRoom({ lampOn })}
          companion={hatched ? <SeasonalWorn /> : (
            <span onClick={() => react("wobble")} role="presentation">
              <SpeciesEgg style={pet.egg_style} size={150} reaction={reaction}><SeasonalWorn layout="egg" /></SpeciesEgg>
            </span>
          )}
        />
        <div className="px-4 py-3 flex flex-wrap items-center gap-2 border-t" style={{ borderColor: "#E8E2D1" }}>
          {!renaming ? (
            <>
              <span className="font-script text-2xl" style={{ color: "#C77B5B" }}>{pet.name}</span>
              <button onClick={() => setRenaming(true)} className="text-[10px] font-bold uppercase tracking-widest text-stone-500" data-testid="rename-btn">rename</button>
            </>
          ) : (
            <>
              <input value={newName} onChange={e => setNewName(e.target.value)} className="font-script text-xl rounded border px-2 py-0.5 w-32 bg-paper" style={{ borderColor: "#D4C8A8" }} data-testid="rename-input" />
              <button onClick={saveName} className="text-[10px] font-bold uppercase text-emerald-700" data-testid="save-name">save</button>
              <button onClick={() => { setRenaming(false); setNewName(pet.name); }} className="text-[10px] text-stone-400">x</button>
            </>
          )}
          {hatched && worn.length > 0 && (
            <span className="flex gap-1 text-xl" data-testid="worn-accessories">{worn.map(a => <span key={a}>{ACC_EMOJI[a] || "✨"}</span>)}</span>
          )}
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
        <ActionCard title={hatched ? "Share a snack" : "Warm the egg"} subtitle={hatched ? "Optional. They will still come over." : "A warm glow, whenever you like"} icon={Apple} tint="#C77B5B"
          onClick={() => { if (hatched) ask("bowl"); care("/pet/care/feed", hatched ? `${pet.name} enjoyed that` : "The egg feels warm and cosy", hatched ? null : "glow"); }} loading={loading} testid="feed-btn" />
        <ActionCard title={hatched ? "Play" : "Cuddle"} subtitle="A quick game, just for fun" icon={Gamepad2} tint="#6B8A5B"
          onClick={() => { if (hatched) ask("toy"); else react("wobble"); care("/pet/care/play", hatched ? `${pet.name} is playing` : "The egg wiggles happily", hatched ? null : "wobble"); }} loading={loading} testid="play-btn" />
        <ActionCard title="Call over" subtitle={hatched ? `${pet.name} will come to the front` : "Give the egg a little wobble"} icon={Sparkles} tint="#4A5D3A"
          onClick={() => { if (hatched) ask("call"); else react("wobble"); }} testid="call-btn" />
        <div className="paper-card p-5" data-testid="customize-card">
          <div className="h-11 w-11 rounded-xl grid place-items-center mb-3" style={{ backgroundColor: "#D4A57422", color: "#C8893B" }}><Palette size={20} /></div>
          <div className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>Move the room</div>
          <p className="text-xs text-stone-600 mt-1 mb-3">{editing ? "Drag furniture. Arrow keys nudge it. Tap the floor to place a cupboard item." : "Arrange furniture, then it stays where you left it."}</p>
          <button type="button" className="tool-btn" aria-pressed={editing} onClick={() => setEditing((value) => !value)} data-testid="edit-room">{editing ? "Done" : "Arrange"}</button>
        </div>
      </section>

      {editing && (
        <div className="paper-card p-4" data-testid="cupboard">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Cupboard</div>
          <div className="cupboard">
            {cupboard.length === 0 && <p className="text-sm text-stone-600">Everything you own is already in the room.</p>}
            {cupboard.map((id) => (
              <button key={id} type="button" className={`room-chip ${selectedItem === id ? "is-on" : ""}`} onClick={() => setSelectedItem(id)} data-testid={`cupboard-${id}`}>
                {ITEMS[id].name}
              </button>
            ))}
          </div>
        </div>
      )}

      <NestShop
        shop={pet.shop || []}
        acorns={pet.economy?.acorns || 0}
        busy={loading}
        justBought={justBought}
        onBuy={buy}
        onUse={putInRoom}
        onTheme={(theme) => saveRoom({ theme })}
        onFloor={(floor) => saveRoom({ floor })}
      />

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

      <section className="paper-card p-5" data-testid="grow-guide">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: "#4A5D3A" }} />
          <h2 className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>How to grow {pet.name}</h2>
        </div>
        <p className="text-sm text-stone-700 mb-3">{pet.name} has <strong>{pet.xp} XP</strong>{pet.next_xp ? <> and needs {Math.max(0, pet.next_xp - pet.xp)} more to become a {pet.next_level}.</> : <> and has reached the top level!</>}</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Ways to earn XP</div>
            <ul className="text-sm text-stone-700 space-y-1">
              {XP_SOURCES.map(([what, xp]) => (
                <li key={what} className="flex justify-between gap-3"><span>{what}</span><strong className="whitespace-nowrap">{xp}</strong></li>
              ))}
            </ul>
            <p className="text-xs text-stone-500 mt-2">Snacks and play are optional. The same finished learning also adds a few acorns, counted once, for the nest shop.</p>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">XP needed for each level</div>
            <ul className="text-sm text-stone-700 space-y-1">
              {GROWTH_STAGES.map(([name, xp]) => (
                <li key={name} className="flex justify-between gap-3"><span>{name}</span><strong className="whitespace-nowrap">{xp}</strong></li>
              ))}
            </ul>
            <p className="text-xs text-stone-500 mt-2">To hatch from the egg you need 60 XP and care on 3 different days. Time away does not hurt your companion.</p>
          </div>
        </div>
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
    <div className="mt-1 h-2.5 rounded-full bg-stone-200 overflow-hidden"><div className="reward-meter h-full" style={{ width: `${pct}%`, backgroundColor: color }}></div></div>
  </div>
);
