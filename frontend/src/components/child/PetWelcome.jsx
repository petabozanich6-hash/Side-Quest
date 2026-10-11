import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Pet } from "../shared/Botanical";
import { useChildInbox } from "./useChildInbox";

const POOL = [
  { id: "g1", t: (c) => `Hi ${c.name}! I'm so glad you're here.` },
  { id: "g2", t: (c) => `${c.name}! I was hoping you'd turn up today.` },
  { id: "g3", t: (c) => `Ready for an adventure, ${c.name}?` },
  { id: "g4", t: (c) => `It's me, ${c.pet}! Let's learn something great.` },
  { id: "g5", t: () => "Welcome back! I saved you a spot." },
  { id: "g6", t: () => "Today feels like a good day to be clever." },
  { id: "g7", t: () => "I've been practising my wiggle just for you." },
  { id: "g8", t: () => "Look who's here! My favourite learner." },
  { id: "g9", t: (c) => `Let's do this together, ${c.name}.` },
  { id: "g10", t: () => "Another day, another quest. Shall we?" },
  { id: "g11", t: () => "I've got a good feeling about today." },
  { id: "g12", t: (c) => `Psst, ${c.name}. You're doing better than you think.` },

  { id: "m1", when: (c) => c.hour < 12, t: (c) => `Good morning, ${c.name}! I'm wide awake.` },
  { id: "m2", when: (c) => c.hour < 12, t: () => "Morning! Fresh day, fresh start." },
  { id: "m3", when: (c) => c.hour < 12, t: (c) => `Rise and shine, ${c.name}!` },
  { id: "a1", when: (c) => c.hour >= 12 && c.hour < 17, t: (c) => `Good afternoon, ${c.name}! Plenty of day left.` },
  { id: "a2", when: (c) => c.hour >= 12 && c.hour < 17, t: () => "Afternoon already? Let's make it count." },
  { id: "e1", when: (c) => c.hour >= 17, t: (c) => `Evening, ${c.name}. Still got some energy?` },
  { id: "e2", when: (c) => c.hour >= 17, t: () => "Hello there, night owl." },

  { id: "d1", when: (c) => c.dow === 1, t: () => "Happy Monday! New week, new quests." },
  { id: "d3", when: (c) => c.dow === 3, t: (c) => `Halfway through the week, ${c.name}!` },
  { id: "d5", when: (c) => c.dow === 5, t: () => "It's Friday! Nearly the weekend." },
  { id: "dw", when: (c) => c.dow === 0 || c.dow === 6, t: () => "A weekend visit? I love it!" },

  { id: "s0", when: (c) => c.today === 0 && c.total === 0, t: () => "Nothing planned today. Want to play with me later?" },
  { id: "s1", when: (c) => c.today === 1, t: () => "Just one quest today. You've got this!" },
  { id: "s3", when: (c) => c.today >= 3, t: (c) => `${c.today} quests today. Take them one at a time and I'll cheer.` },
  { id: "so", when: (c) => c.overdue > 0, t: () => "A few lessons are waiting from earlier. No rush, we'll catch up together." },
  { id: "sa", when: (c) => c.ahead > 0, t: () => "You could even work ahead today if you're feeling brave." },
  { id: "hl", when: (c) => c.happiness < 40, t: () => "I'm a little hungry. Pop into my room when you can?" },
  { id: "hh", when: (c) => c.happiness >= 80, t: () => "I'm feeling fantastic today!" },
];

function pick(ctx, key, exclude) {
  const pool = POOL.filter(m => !m.when || m.when(ctx));
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  if (exclude) recent = [...recent, exclude];
  let fresh = pool.filter(m => !recent.includes(m.id));
  if (fresh.length === 0) {
    recent = exclude ? [exclude] : [];
    fresh = pool.filter(m => !recent.includes(m.id));
  }
  if (fresh.length === 0) fresh = pool;
  const m = fresh[Math.floor(Math.random() * fresh.length)];
  const keep = Math.max(1, Math.min(10, pool.length - 3));
  try { localStorage.setItem(key, JSON.stringify([...recent.filter(x => x !== m.id), m.id].slice(-keep))); } catch {}
  return m;
}

function speak(item, name) {
  if (item.kind === "cheer") {
    return { lead: `${name}, ${item.from_name || "your parent"} sent you a cheer! ${item.emoji || ""}`.trim(), body: item.message, next: "", cta: "Got it!" };
  }
  if (item.kind === "revision") {
    return { lead: `${name}, your parent sent "${item.title}" back for another try.`, body: item.message, next: item.next_step, cta: "Let's go" };
  }
  return { lead: `${name}, your parent left feedback on "${item.title}"!`, body: item.message, next: item.next_step, cta: "Got it!" };
}

export default function PetWelcome({ childId, name, today = 0, overdue = 0, ahead = 0, total = 0 }) {
  const [pet, setPet] = useState(null);
  const [msg, setMsg] = useState(null);
  const started = useRef(false);
  const nav = useNavigate();
  const { items, ack } = useChildInbox();

  useEffect(() => { api.get("/pet").then(r => { if (!r.data?.needs_pet) setPet(r.data); }).catch(() => {}); }, []);

  const ctxOf = (p) => {
    const now = new Date();
    return { name: name || "friend", pet: p.name, hour: now.getHours(), dow: now.getDay(), today, overdue, ahead, total, happiness: p.happiness ?? 50 };
  };
  const key = `pet-welcome-recent-${childId || "child"}`;

  useEffect(() => {
    if (pet && !started.current) { started.current = true; setMsg(pick(ctxOf(pet), key)); }
  }, [pet]);

  if (!pet || !msg) return null;
  const ctx = ctxOf(pet);
  const cur = items[0];
  const say = cur ? speak(cur, ctx.name) : null;

  const respond = async () => {
    await ack(cur);
    if (cur.kind === "revision" && cur.assignment_id) nav(`/child/lesson/${cur.assignment_id}`);
  };

  return (
    <section className="paper-card p-4 flex items-center gap-4" style={cur ? { borderColor: "#C77B5B", borderWidth: 2 } : undefined} data-testid="pet-welcome">
      <button onClick={() => { if (!cur) setMsg(pick(ctx, key, msg.id)); }} className="shrink-0" aria-label={`Tap ${pet.name} for another hello`} data-testid="pet-welcome-tap">
        <Pet species={pet.species} size={96} happy={(pet.happiness ?? 50) > 40} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="relative rounded-2xl border px-4 py-3" style={cur ? { borderColor: "#C77B5B", backgroundColor: "#FEF3C7" } : { borderColor: "#D4C8A8", backgroundColor: "#FFFFFF" }}>
          <div className="font-script text-xl" style={{color:"#C77B5B"}}>{pet.name}</div>
          {cur ? (
            <div data-testid="pet-inbox-text">
              <p className="text-base font-bold mt-0.5" style={{color:"#1F3B2D"}}>{say.lead}</p>
              {say.body && <p className="text-base font-bold mt-1">"{say.body}"</p>}
              {say.next && <p className="text-sm font-bold mt-1">Next: {say.next}</p>}
              {!say.body && cur.kind !== "cheer" && <p className="text-sm font-bold mt-1">{cur.kind === "revision" ? "Have another go when you're ready." : "They're happy with it."}</p>}
            </div>
          ) : (
            <p className="text-sm mt-0.5" data-testid="pet-welcome-text">{msg.t(ctx)}</p>
          )}
        </div>
        {cur ? (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <button onClick={respond} className="rounded-full px-5 py-2 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="pet-inbox-ack">{say.cta}</button>
            {items.length > 1 && <span className="font-bold opacity-70">1 of {items.length}</span>}
          </div>
        ) : (
          <div className="mt-1.5 flex items-center gap-3 text-xs">
            <span className="opacity-50">Tap me for another hello</span>
            <Link to="/child/room" className="font-semibold underline" data-testid="pet-visit-room">Visit my room</Link>
          </div>
        )}
      </div>
    </section>
  );
}
