import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { playSfx } from "../../lib/sfx";

const INK = { color: "#1F3B2D" };
const BTN = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };
const OUT = { borderColor: "#1F3B2D", color: "#1F3B2D" };
const BORDER = { borderColor: "#D4C8A8" };
const RARE_EMOJI = { top_hat: "🎩", rainbow: "🌈", magic_wand: "🪄", headphones: "🎧", shades: "🕶️", butterfly: "🦋" };

// Daily goals, weekly chest, spelling trophies, the shop, and extra pets. Everything is earned by learning and gentle care.
export default function PetQuests({ pet, quests, onChange, onFx }) {
  const [busy, setBusy] = useState("");
  const [adopt, setAdopt] = useState({ species: "", name: "" });
  if (!quests) return null;
  const q = quests;

  const call = async (key, fn, okMsg, sound, fx) => {
    setBusy(key);
    try { const { data } = await fn(); onChange(data); if (okMsg) toast.success(typeof okMsg === "function" ? okMsg(data) : okMsg); if (sound) playSfx(sound); if (fx && onFx) onFx(fx); }
    catch (e) { toast.error(e?.response?.data?.detail || "That did not work. Try again."); }
    finally { setBusy(""); }
  };

  const claim = (g) => call(`g${g.id}`, () => api.post("/pet/quests/claim", { id: g.id }), "Goal complete! That counts towards your weekly chest.", "cheer", "party");
  const chest = () => call("chest", () => api.post("/pet/quests/chest"), (d) => (d.prize ? `You got a rare accessory: ${d.prize.replace("_", " ")}!` : "Chest opened! Nothing rare this time. Come back next week."), "cheer", "party");
  const swap = (i) => call(`s${i}`, () => api.post("/pet/stable/swap", { index: i }), "Switched pets", "pop", "sparkle");
  const adoptNew = (e) => { e.preventDefault(); call("new", () => api.post("/pet/stable/new", adopt), "A new egg has arrived!", "cheer", "party").then(() => setAdopt({ species: "", name: "" })); };

  const allDone = q.goals.every((g) => g.claimed);

  return (
    <div className="space-y-5" data-testid="pet-quests">
      <section className="paper-card p-5" data-testid="daily-goals">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold" style={INK}>Today's goals</h2>
          <span className="rounded-full px-3 py-1 text-sm font-bold bg-amber-100 text-amber-900" data-testid="goal-days">⭐ {q.chest.days_done} of {q.chest.days_needed} days this week</span>
        </div>
        <ul className="mt-3 space-y-3">
          {q.goals.map((g) => (
            <li key={g.id} className="rounded-xl border p-3 bg-white" style={BORDER} data-testid={`goal-${g.id}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bold text-sm">{g.claimed ? "✅ " : ""}{g.title}</p>
                  <p className="text-xs text-stone-600">{g.progress} of {g.target}</p>
                </div>
                {g.ready && <button type="button" disabled={!!busy} onClick={() => claim(g)} className="rounded-full px-4 py-1.5 text-sm font-bold" style={BTN} data-testid={`claim-${g.id}`}>Collect</button>}
              </div>
              <div className="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden"><div className="h-full" style={{ width: `${Math.round((g.progress / g.target) * 100)}%`, backgroundColor: g.claimed ? "#4A5D3A" : "#C77B5B" }} /></div>
            </li>
          ))}
        </ul>
        {allDone && <p className="mt-3 text-sm font-bold text-emerald-800">All three done today. Brilliant!</p>}
        <div className="mt-4 rounded-xl border p-3" style={{ ...BORDER, background: "#FBF7EA" }} data-testid="weekly-chest">
          <p className="font-bold text-sm">🎁 Weekly chest</p>
          <p className="text-xs text-stone-600">Finish all three goals on {q.chest.days_needed} days this week to open it for a rare accessory. {q.chest.days_done} of {q.chest.days_needed} days so far.</p>
          {q.chest.ready && <button type="button" disabled={!!busy} onClick={chest} className="mt-2 rounded-full px-4 py-1.5 text-sm font-bold" style={BTN} data-testid="open-chest">Open the chest</button>}
          {q.chest.claimed && <p className="mt-1 text-xs font-bold text-emerald-800">Opened this week. A new chest next week!</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-2xl" aria-label="Rare accessories">
            {q.rare.map((r) => <span key={r.id} title={r.label} style={{ opacity: r.have ? 1 : 0.25 }}>{r.have ? RARE_EMOJI[r.id] : "❔"}</span>)}
          </div>
        </div>
      </section>

      <section className="paper-card p-5" data-testid="trophy-shelf">
        <h2 className="font-display text-lg font-bold" style={INK}>Spelling trophies</h2>
        <p className="text-xs text-stone-600 mb-2">{pet.name} puts a trophy on the shelf every time you master a word. You have {q.trophy_count}.</p>
        {q.trophies.length === 0 ? <p className="text-sm text-stone-500">No trophies yet. Master a word in the Word Hoard to win the first one.</p> : (
          <div className="flex flex-wrap gap-2">{q.trophies.map((t) => <span key={t.word} className="rounded-full border px-3 py-1 text-sm bg-white" style={BORDER}>🏆 {t.word}</span>)}</div>
        )}
      </section>

      <section className="paper-card p-5" data-testid="my-pets">
        <h2 className="font-display text-lg font-bold" style={INK}>My pets</h2>
        <p className="text-xs text-stone-600 mb-3">Master 10 words to open a second pet slot, and 30 for a third. Each pet keeps its own level and growth.</p>
        <ul className="space-y-2">
          <li className="rounded-xl border p-3 bg-white flex items-center justify-between" style={{ ...BORDER, borderColor: "#1F3B2D" }}><span className="font-bold text-sm">{pet.name} <span className="text-xs font-normal text-stone-600">· {pet.level_name} · with you now</span></span></li>
          {q.stable.map((s) => (
            <li key={s.index} className="rounded-xl border p-3 bg-white flex items-center justify-between gap-2" style={BORDER}>
              <span className="font-bold text-sm">{s.name} <span className="text-xs font-normal text-stone-600">· {s.hatched ? s.level : "Egg"}</span></span>
              <button type="button" disabled={!!busy} onClick={() => swap(s.index)} className="rounded-full border px-3 py-1 text-xs font-bold" style={OUT} data-testid={`swap-${s.index}`}>Switch to {s.name}</button>
            </li>
          ))}
        </ul>
        {q.slots.used < q.slots.total ? (
          <form onSubmit={adoptNew} className="mt-3 flex flex-wrap gap-2 items-end" data-testid="adopt-form">
            <label className="text-xs font-bold">Kind
              <select value={adopt.species} onChange={(e) => setAdopt({ ...adopt, species: e.target.value })} className="mt-0.5 block rounded-lg border px-2 py-1.5 text-sm bg-white" style={BORDER}>
                <option value="">Choose…</option>{q.species.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold">Name
              <input value={adopt.name} maxLength={30} onChange={(e) => setAdopt({ ...adopt, name: e.target.value })} className="mt-0.5 block rounded-lg border px-2 py-1.5 text-sm bg-white" style={BORDER} />
            </label>
            <button type="submit" disabled={!adopt.species || !!busy} className="rounded-full px-4 py-2 text-sm font-bold disabled:opacity-40" style={BTN}>Adopt a new egg</button>
          </form>
        ) : q.slots.next_at ? <p className="mt-3 text-xs text-stone-600">{q.slots.next_at - q.trophy_count} more mastered {q.slots.next_at - q.trophy_count === 1 ? "word" : "words"} to open the next pet slot.</p> : null}
      </section>
    </div>
  );
}
