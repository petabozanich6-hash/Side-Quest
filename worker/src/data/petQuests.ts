import type { PetState } from "./pets";
import { PET_SPECIES, stageForXp, previousStageForXp, loadPet, savePet } from "./pets";

// Everything here lives inside the pet's existing `extra` JSON, so no database change is needed.
// Rewards are earned by learning (spelling, lessons, reading) and gentle care; nothing is ever lost and nothing is for sale for real money.

export type PetEvent = { kind: "word_right" | "word_mastered" | "lesson_done" | "feed" | "clean" | "play" | "read"; word?: string };

export const RARE: Record<string, { label: string; emoji: string }> = {
  top_hat: { label: "Top Hat", emoji: "🎩" },
  rainbow: { label: "Rainbow Halo", emoji: "🌈" },
  magic_wand: { label: "Magic Wand", emoji: "🪄" },
  headphones: { label: "Study Headphones", emoji: "🎧" },
  shades: { label: "Cool Shades", emoji: "🕶️" },
  butterfly: { label: "Butterfly Wings", emoji: "🦋" },
};

export const SHOP: Array<{ id: string; label: string; emoji: string; price: number }> = [
  { id: "plant", label: "Leafy plant", emoji: "🪴", price: 30 },
  { id: "lamp", label: "Cosy lamp", emoji: "🕯️", price: 40 },
  { id: "rug", label: "Woven rug", emoji: "🧶", price: 50 },
  { id: "bookshelf", label: "Bookshelf", emoji: "📚", price: 60 },
  { id: "fishtank", label: "Fish tank", emoji: "🐠", price: 80 },
  { id: "telescope", label: "Telescope", emoji: "🔭", price: 90 },
  { id: "globe", label: "Globe", emoji: "🌏", price: 100 },
  { id: "piano", label: "Little piano", emoji: "🎹", price: 140 },
];
export const MAX_PLACED = 6;
export const COINS_PER_DAY_FROM_WORDS = 15;
export const WEEKLY_CHEST_DAYS = 5;

type Goal = { id: string; kind: "word_right" | "word_mastered" | "lesson_done" | "care" | "play" | "read"; target: number; title: string; reward: number };
const LEARN: Goal[] = [
  { id: "words5", kind: "word_right", target: 5, title: "Spell 5 words right", reward: 20 },
  { id: "words10", kind: "word_right", target: 10, title: "Spell 10 words right", reward: 35 },
];
const BIG: Goal[] = [
  { id: "master1", kind: "word_mastered", target: 1, title: "Master a word", reward: 40 },
  { id: "lesson1", kind: "lesson_done", target: 1, title: "Hand in a lesson", reward: 40 },
  { id: "read1", kind: "read", target: 1, title: "Log a book you read", reward: 15 },
];
const CARE: Goal[] = [
  { id: "care2", kind: "care", target: 2, title: "Feed and clean up your pet", reward: 15 },
  { id: "play1", kind: "play", target: 1, title: "Play with your pet", reward: 10 },
];
const ALL = [...LEARN, ...BIG, ...CARE];

/** Today's date in Sydney, as YYYY-MM-DD. */
export const dayKey = (now: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(now);
const dayNum = (day: string) => Math.floor(Date.parse(`${day}T00:00:00Z`) / 86400000);
/** Monday of the week containing `day`. */
export const weekKey = (day: string) => {
  const n = dayNum(day);
  const dow = (new Date(n * 86400000).getUTCDay() + 6) % 7; // Monday = 0
  return new Date((n - dow) * 86400000).toISOString().slice(0, 10);
};

const ex = (pet: PetState) => (pet.extra && typeof pet.extra === "object" ? pet.extra : (pet.extra = {}));
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []);

export function goalsFor(day: string): Goal[] {
  const n = dayNum(day);
  return [LEARN[n % 2], BIG[n % 3], CARE[n % 2]];
}

function ensureGoals(pet: PetState, day: string) {
  const e = ex(pet);
  if (!e.goals || e.goals.day !== day) e.goals = { day, items: goalsFor(day).map((g) => ({ id: g.id, progress: 0, claimed: false })) };
  return e.goals as { day: string; items: { id: string; progress: number; claimed: boolean }[] };
}

const counts = (g: Goal, ev: PetEvent) => (g.kind === "care" ? ev.kind === "feed" || ev.kind === "clean" : g.kind === ev.kind);

const addCoins = (pet: PetState, n: number) => { ex(pet).coins = Math.max(0, Number(ex(pet).coins || 0) + n); };

const COIN_FOR: Record<string, number> = { word_mastered: 10, lesson_done: 10, feed: 2, clean: 2, play: 1, read: 3 };

/** Apply one thing the child did. Mutates the pet; the caller saves it. */
export function applyEvent(pet: PetState, ev: PetEvent, now: Date) {
  const e = ex(pet);
  const day = dayKey(now);
  const goals = ensureGoals(pet, day);
  let gained = 0;
  if (ev.kind === "word_right") {
    const t = e.coins_words && e.coins_words.day === day ? e.coins_words : { day, n: 0 };
    if (t.n < COINS_PER_DAY_FROM_WORDS) { t.n += 1; gained += 1; }
    e.coins_words = t;
  } else gained += COIN_FOR[ev.kind] || 0;
  if (gained) addCoins(pet, gained);
  goalsFor(day).forEach((g, i) => {
    const item = goals.items[i];
    if (item && item.id === g.id && !item.claimed && counts(g, ev)) item.progress = Math.min(g.target, item.progress + 1);
  });
  if (ev.kind === "word_mastered" && ev.word) {
    const w = String(ev.word).toLowerCase().slice(0, 40);
    const t = arr(e.trophies);
    if (!t.some((x) => x.word === w)) t.push({ word: w, at: now.toISOString() });
    e.trophies = t.slice(-300);
    e.cheer = { kind: "trophy", text: `${pet.name} put a trophy for “${w}” on the shelf!`, at: now.toISOString(), seen: false };
  } else if (ev.kind === "lesson_done") {
    e.cheer = { kind: "lesson", text: `${pet.name} is so proud of you for finishing a lesson!`, at: now.toISOString(), seen: false };
  }
  return gained;
}

export function claimGoal(pet: PetState, id: string, now: Date): { ok: boolean; detail?: string; reward?: number } {
  const day = dayKey(now);
  const goals = ensureGoals(pet, day);
  const list = goalsFor(day);
  const i = list.findIndex((g) => g.id === id);
  if (i < 0) return { ok: false, detail: "That goal is not one of today's" };
  const item = goals.items[i];
  if (item.claimed) return { ok: false, detail: "Already collected" };
  if (item.progress < list[i].target) return { ok: false, detail: "Not finished yet" };
  item.claimed = true;
  addCoins(pet, list[i].reward);
  if (goals.items.every((x) => x.claimed)) {
    const e = ex(pet);
    e.goal_days = [...new Set([...arr(e.goal_days), day])].sort().slice(-30);
  }
  return { ok: true, reward: list[i].reward };
}

export function chestStatus(pet: PetState, now: Date) {
  const e = ex(pet);
  const wk = weekKey(dayKey(now));
  const done = arr(e.goal_days).filter((d) => weekKey(d) === wk).length;
  const claimed = arr(e.chest_claimed).includes(wk);
  return { week: wk, days_done: done, days_needed: WEEKLY_CHEST_DAYS, ready: done >= WEEKLY_CHEST_DAYS && !claimed, claimed };
}

export function claimChest(pet: PetState, now: Date): { ok: boolean; detail?: string; prize?: string; coins?: number } {
  const st = chestStatus(pet, now);
  if (st.claimed) return { ok: false, detail: "Already opened this week" };
  if (!st.ready) return { ok: false, detail: `Finish all three goals on ${st.days_needed} days this week to open it` };
  const e = ex(pet);
  const have = new Set(arr(e.rare));
  const prize = Object.keys(RARE).find((k) => !have.has(k));
  if (prize) e.rare = [...have, prize];
  e.chest_claimed = [...arr(e.chest_claimed), st.week].slice(-20);
  addCoins(pet, 50);
  if (prize) pet.unlocked_accessories = [...new Set([...pet.unlocked_accessories, prize])].sort();
  return { ok: true, prize, coins: 50 };
}

export function buyItem(pet: PetState, id: string): { ok: boolean; detail?: string } {
  const item = SHOP.find((s) => s.id === id);
  if (!item) return { ok: false, detail: "Unknown item" };
  const e = ex(pet);
  const owned = arr(e.owned);
  if (owned.includes(id)) return { ok: false, detail: "You already have that" };
  if (Number(e.coins || 0) < item.price) return { ok: false, detail: `You need ${item.price} coins` };
  addCoins(pet, -item.price);
  e.owned = [...owned, id];
  e.room = [...arr(e.room), id].slice(0, MAX_PLACED);
  return { ok: true };
}

export function placeItems(pet: PetState, ids: unknown, positions?: unknown): { ok: boolean; detail?: string } {
  const e = ex(pet);
  const owned = new Set(arr(e.owned));
  const list = [...new Set(arr(ids).map(String))].filter((x) => owned.has(x));
  if (list.length > MAX_PLACED) return { ok: false, detail: `Up to ${MAX_PLACED} things fit in the room` };
  e.room = list;
  // where each thing sits, as a percentage across (x) and up from the floor (y); anything out of range is pulled back in
  if (positions && typeof positions === "object" && !Array.isArray(positions)) {
    const out: Record<string, { x: number; y: number }> = {};
    for (const id of list) {
      const p: any = (positions as any)[id];
      const x = Number(p?.x), y = Number(p?.y);
      if (Number.isFinite(x) && Number.isFinite(y)) out[id] = { x: Math.round(Math.min(92, Math.max(2, x))), y: Math.round(Math.min(60, Math.max(0, y))) };
    }
    e.room_pos = out;
  }
  return { ok: true };
}

/** Extra pets: a second after 10 mastered words, a third after 30. */
export const stableSlots = (trophies: number) => 1 + (trophies >= 10 ? 1 : 0) + (trophies >= 30 ? 1 : 0);
const SWAP = ["name", "species", "xp", "happiness", "background", "hatched", "hatched_at"] as const;
const snap = (pet: PetState) => ({ name: pet.name, species: pet.species, xp: pet.xp, happiness: pet.happiness, background: pet.background, accessories: [...pet.accessories], hatched: pet.hatched, hatched_at: pet.hatched_at, egg_care_dates: [...pet.egg_care_dates], growth_version: ex(pet).growth_version, growth_floor: ex(pet).growth_floor });
const load = (pet: PetState, s: any) => {
  for (const k of SWAP) (pet as any)[k] = s[k];
  pet.accessories = arr(s.accessories).map(String);
  pet.egg_care_dates = arr(s.egg_care_dates).map(String);
  ex(pet).growth_version = 2;
  ex(pet).growth_floor = s.growth_version === 2 ? (s.growth_floor || null) : previousStageForXp(Number(s.xp || 0), !!s.hatched);
};

export function newPet(pet: PetState, species: string, name: string): { ok: boolean; detail?: string } {
  const e = ex(pet);
  const stable = arr(e.stable);
  if (!(species in PET_SPECIES)) return { ok: false, detail: "Unknown species" };
  if (1 + stable.length >= stableSlots(arr(e.trophies).length)) return { ok: false, detail: "Master more words to open another pet slot" };
  if ([pet.species, ...stable.map((s) => s.species)].includes(species)) return { ok: false, detail: "You already have that kind of pet" };
  stable.push(snap(pet));
  load(pet, { name: String(name || "").trim().slice(0, 30) || PET_SPECIES[species as keyof typeof PET_SPECIES].label, species, xp: 0, happiness: 80, background: pet.background, accessories: [], hatched: false, hatched_at: null, egg_care_dates: [] });
  e.stable = stable;
  return { ok: true };
}

export function swapPet(pet: PetState, index: number): { ok: boolean; detail?: string } {
  const e = ex(pet);
  const stable = arr(e.stable);
  if (!Number.isInteger(index) || index < 0 || index >= stable.length) return { ok: false, detail: "No such pet" };
  const mine = snap(pet);
  load(pet, stable[index]);
  stable[index] = mine;
  e.stable = stable;
  return { ok: true };
}

export function moodFor(pet: PetState): { mood: string; text: string } {
  const st = pet.care_status || "ok";
  if (!pet.hatched) return { mood: "egg", text: `${pet.name} is still snug in the egg.` };
  if (st === "asleep") return { mood: "sleepy", text: `${pet.name} is asleep. A snack will wake them.` };
  if (st === "sick") return { mood: "sick", text: `${pet.name} feels unwell. Feed and clean up to help.` };
  if (st === "sad" || pet.happiness < 35) return { mood: "sad", text: `${pet.name} would love some company.` };
  if (pet.happiness >= 75) return { mood: "happy", text: `${pet.name} is bouncing with joy!` };
  return { mood: "calm", text: `${pet.name} is relaxed.` };
}

export function questView(pet: PetState, now: Date) {
  const e = ex(pet);
  const day = dayKey(now);
  const goals = ensureGoals(pet, day);
  const list = goalsFor(day);
  const trophies = arr(e.trophies);
  const owned = new Set(arr(e.owned));
  return {
    coins: Number(e.coins || 0),
    day,
    goals: list.map((g, i) => ({ id: g.id, title: g.title, target: g.target, reward: g.reward, progress: goals.items[i].progress, claimed: goals.items[i].claimed, ready: goals.items[i].progress >= g.target && !goals.items[i].claimed })),
    chest: chestStatus(pet, now),
    trophies: trophies.slice(-60).reverse(),
    trophy_count: trophies.length,
    shop: SHOP.map((s) => ({ ...s, owned: owned.has(s.id) })),
    room: arr(e.room),
    room_pos: e.room_pos && typeof e.room_pos === "object" ? e.room_pos : {},
    rare: Object.entries(RARE).map(([id, r]) => ({ id, ...r, have: arr(e.rare).includes(id) })),
    mood: moodFor(pet),
    form: stageForXp(pet.xp, pet.hatched, e.growth_floor).level_name,
    cheer: e.cheer && !e.cheer.seen ? e.cheer : null,
    slots: { total: stableSlots(trophies.length), used: 1 + arr(e.stable).length, next_at: trophies.length < 10 ? 10 : trophies.length < 30 ? 30 : null },
    stable: arr(e.stable).map((s, i) => ({ index: i, name: s.name, species: s.species, level: stageForXp(Number(s.xp || 0), !!s.hatched, s.growth_version === 2 ? s.growth_floor : previousStageForXp(Number(s.xp || 0), !!s.hatched)).level_name, hatched: !!s.hatched })),
    species: Object.entries(PET_SPECIES).map(([id, s]) => ({ id, label: s.label })),
  };
}

export function weekSummary(pet: PetState, now: Date) {
  const e = ex(pet);
  const wk = weekKey(dayKey(now));
  const since = Date.parse(`${wk}T00:00:00Z`) - 11 * 3600000;
  const trophies = arr(e.trophies).filter((t) => Date.parse(t.at) >= since);
  const xp = arr(pet.activity).filter((a) => Date.parse(a.at) >= since).reduce((n, a) => n + Number(a.amount || 0), 0);
  return { week: wk, words_mastered: trophies.map((t) => t.word), xp_earned: xp, goal_days: arr(e.goal_days).filter((d) => weekKey(d) === wk).length, chest: chestStatus(pet, now), trophy_total: arr(e.trophies).length };
}

/** Record something the child did against their pet. Never throws: a missing pet or table must not break learning. */
export async function recordPetEvent(db: D1Database, studentId: string, ev: PetEvent, now: Date = new Date()) {
  try {
    const pet = await loadPet(db, studentId);
    if (!pet) return;
    applyEvent(pet, ev, now);
    await savePet(db, pet);
  } catch { /* the pet is a bonus; learning must never fail because of it */ }
}
