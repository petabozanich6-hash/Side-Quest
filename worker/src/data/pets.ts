import { newId, nowIso } from "../types";

export const PET_SPECIES = {
  fox: { label: "Fox", voice: "clever, warm, curious" },
  owl: { label: "Owl", voice: "wise, calm, patient" },
  turtle: { label: "Turtle", voice: "slow and steady, encouraging" },
  hedgehog: { label: "Hedgehog", voice: "gentle, careful, kind" },
  fawn: { label: "Fawn", voice: "soft, hopeful, delicate" },
  squirrel: { label: "Squirrel", voice: "energetic, playful, upbeat" },
  rabbit: { label: "Rabbit", voice: "quick, cheerful, friendly" },
  dragon: { label: "Dragon", voice: "brave, dramatic, warm-hearted" },
} as const;

export const LEVEL_TIERS: Array<[number, string, string]> = [
  [0, "Egg", "egg"],
  [10, "Hatchling", "sprout"],
  [30, "Youngling", "leaf"],
  [80, "Companion", "tree"],
  [200, "Hero", "star"],
  [500, "Legend", "sparkle"],
];

export const CARE_STAGES: Array<[number, string, string]> = [
  [0, "Egg", "egg"],
  [60, "Hatchling", "sprout"],
  [200, "Youngling", "leaf"],
  [500, "Companion", "tree"],
  [1000, "Hero", "star"],
  [2000, "Legend", "sparkle"],
];

export const HATCH_XP = 60;
export const HATCH_CARE_DAYS = 3;
export const FEED_COOLDOWN_HOURS = 6;
export const POOP_INTERVAL_HOURS = 24;
export const SAD_DAYS = 2;
export const SICK_DAYS = 3;
export const ASLEEP_DAYS = 6;
export const PLAY_XP = 2;
export const PLAY_DAILY_CAP = 5;

export const EGG_STYLES: Record<string, { base: string; accent: string; pattern: string; glow: string }> = {
  fox: { base: "#F4A261", accent: "#FFF1E0", pattern: "zigzag", glow: "#FFD6A5" },
  owl: { base: "#A98467", accent: "#EAD7C3", pattern: "feathers", glow: "#E8D5B7" },
  turtle: { base: "#8FBF9F", accent: "#4F8A6B", pattern: "hexagons", glow: "#C7F0D8" },
  hedgehog: { base: "#C9B8A6", accent: "#7B6A5A", pattern: "spikes", glow: "#EFE3D3" },
  fawn: { base: "#E9C8A0", accent: "#FFFFFF", pattern: "spots", glow: "#FFF0DC" },
  squirrel: { base: "#B5651D", accent: "#F0C987", pattern: "stripes", glow: "#FFD9A0" },
  rabbit: { base: "#F2E9F0", accent: "#F7B6D2", pattern: "hearts", glow: "#FFE0EF" },
  dragon: { base: "#7B5EA7", accent: "#F2C14E", pattern: "scales", glow: "#D9C2FF" },
};

export const ACCESSORIES: Record<string, { label: string; rule: string }> = {
  scarf: { label: "Cozy Scarf", rule: "stage:Hatchling" },
  bow: { label: "Little Bow", rule: "cleans:3" },
  flower_crown: { label: "Flower Crown", rule: "stage:Youngling" },
  party_hat: { label: "Party Hat", rule: "streak:7" },
  bookworm_specs: { label: "Bookworm Specs", rule: "reading:5" },
  backpack: { label: "Adventure Backpack", rule: "stage:Companion" },
  cape: { label: "Hero Cape", rule: "stage:Hero" },
  star_badge: { label: "Star Badge", rule: "streak:30" },
  crown: { label: "Legend Crown", rule: "stage:Legend" },
};

const SUBMISSION_XP = 15;
const FEEDBACK_XP: Record<string, number> = {
  accepted: 25,
  demonstrated: 50,
  needs_revision: 5,
  needs_more_practice: 10,
};
const READING_XP = 3;

export type PetActivity = { amount: number; reason: string; at: string };

export type PetState = {
  id: string;
  student_id: string;
  family_id: string;
  name: string;
  species: string;
  xp: number;
  happiness: number;
  created_at: string;
  last_fed: string | null;
  last_played: string | null;
  background: string | null;
  accessories: string[];
  activity: PetActivity[];
  items: any[];
  hatched: boolean;
  hatched_at: string | null;
  egg_care_dates: string[];
  next_poop_at: string | null;
  poop_pending: boolean;
  poop_since: string | null;
  unlocked_accessories: string[];
  play_day: string | null;
  play_count: number;
  cleans_total: number;
  care_paused: boolean;
  paused_at: string | null;
  last_streak_date: string | null;
  care_streak: number;
  best_streak: number;
  revived_count: number;
  extra: Record<string, any>;
  care_status?: string;
  neglect_days?: number;
};

const parseJson = <T>(value: unknown, fallback: T): T => {
  try {
    return value ? JSON.parse(String(value)) as T : fallback;
  } catch {
    return fallback;
  }
};
const stringArray = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item)) : parseJson<string[]>(value, []);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const boolInt = (value: boolean) => (value ? 1 : 0);
const dateOnlyUtc = (d: Date) => d.toISOString().slice(0, 10);
const plusHours = (d: Date, hours: number) => new Date(d.getTime() + hours * 3600000);

export function levelForXp(xp: number) {
  let tier = LEVEL_TIERS[0];
  for (const t of LEVEL_TIERS) if (xp >= t[0]) tier = t;
  const next = LEVEL_TIERS.find((t) => t[0] > xp) ?? null;
  return {
    xp,
    level_name: tier[1],
    level_icon: tier[2],
    next_xp: next?.[0] ?? null,
    next_level: next?.[1] ?? null,
  };
}

function stageFor(xp: number, hatched: boolean) {
  let tier = hatched ? CARE_STAGES[1] : CARE_STAGES[0];
  if (hatched) {
    for (const t of CARE_STAGES.slice(1)) if (xp >= t[0]) tier = t;
  }
  let next = CARE_STAGES.find((t) => t[0] > xp && (hatched || t[0] > 0)) ?? null;
  if (!hatched) next = CARE_STAGES[1];
  return {
    level_name: tier[1],
    level_icon: tier[2],
    next_xp: next?.[0] ?? null,
    next_level: next?.[1] ?? null,
  };
}

const parseDate = (value: string | null | undefined) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const careStatus = (hatched: boolean, neglectDays: number) => {
  if (neglectDays >= ASLEEP_DAYS) return hatched ? "asleep" : "cold";
  if (neglectDays >= SICK_DAYS) return hatched ? "sick" : "cold";
  if (neglectDays >= SAD_DAYS) return hatched ? "sad" : "chilly";
  return "ok";
};

export function needsFeed(pet: Pick<PetState, "last_fed">, now = new Date()) {
  const lastFed = parseDate(pet.last_fed);
  if (!lastFed) return true;
  return now.getTime() - lastFed.getTime() >= FEED_COOLDOWN_HOURS * 3600000;
}

function ruleMet(rule: string, stageIndex: number, pet: PetState, readingCount: number) {
  const [kind, value = ""] = rule.split(":");
  const stageNames = CARE_STAGES.map((s) => s[1]);
  if (kind === "stage") return stageNames.includes(value) && stageIndex >= stageNames.indexOf(value);
  if (kind === "streak") return pet.best_streak >= Number(value || 0);
  if (kind === "cleans") return pet.cleans_total >= Number(value || 0);
  if (kind === "reading") return readingCount >= Number(value || 0);
  return false;
}

function pushActivity(pet: PetState, amount: number, reason: string, at: string) {
  pet.activity = [...pet.activity, { amount, reason, at }];
}

function serialisePet(pet: PetState) {
  return [
    pet.family_id,
    pet.name,
    pet.species,
    pet.xp,
    pet.happiness,
    pet.created_at,
    pet.last_fed,
    pet.last_played,
    pet.background,
    JSON.stringify(pet.accessories),
    JSON.stringify(pet.activity),
    JSON.stringify(pet.items),
    boolInt(pet.hatched),
    pet.hatched_at,
    JSON.stringify(pet.egg_care_dates),
    pet.next_poop_at,
    boolInt(pet.poop_pending),
    pet.poop_since,
    JSON.stringify(pet.unlocked_accessories),
    pet.play_day,
    pet.play_count,
    pet.cleans_total,
    boolInt(pet.care_paused),
    pet.paused_at,
    pet.last_streak_date,
    pet.care_streak,
    pet.best_streak,
    pet.revived_count,
    JSON.stringify(pet.extra),
  ];
}

export function normalisePetRow(row: any): PetState {
  return {
    id: String(row.id),
    student_id: String(row.student_id),
    family_id: String(row.family_id),
    name: String(row.name ?? ""),
    species: String(row.species ?? "fox"),
    xp: Number(row.xp ?? 0),
    happiness: Number(row.happiness ?? 80),
    created_at: String(row.created_at ?? nowIso()),
    last_fed: row.last_fed ? String(row.last_fed) : null,
    last_played: row.last_played ? String(row.last_played) : null,
    background: row.background ? String(row.background) : null,
    accessories: parseJson<string[]>(row.accessories, []),
    activity: parseJson<PetActivity[]>(row.activity, []),
    items: parseJson<any[]>(row.items, []),
    hatched: !!row.hatched,
    hatched_at: row.hatched_at ? String(row.hatched_at) : null,
    egg_care_dates: parseJson<string[]>(row.egg_care_dates, []),
    next_poop_at: row.next_poop_at ? String(row.next_poop_at) : null,
    poop_pending: !!row.poop_pending,
    poop_since: row.poop_since ? String(row.poop_since) : null,
    unlocked_accessories: parseJson<string[]>(row.unlocked_accessories, []),
    play_day: row.play_day ? String(row.play_day) : null,
    play_count: Number(row.play_count ?? 0),
    cleans_total: Number(row.cleans_total ?? 0),
    care_paused: !!row.care_paused,
    paused_at: row.paused_at ? String(row.paused_at) : null,
    last_streak_date: row.last_streak_date ? String(row.last_streak_date) : null,
    care_streak: Number(row.care_streak ?? 0),
    best_streak: Number(row.best_streak ?? 0),
    revived_count: Number(row.revived_count ?? 0),
    extra: parseJson<Record<string, any>>(row.extra, {}),
  };
}

export async function loadPet(db: D1Database, studentId: string) {
  const row = await db.prepare("SELECT * FROM pets WHERE student_id = ?").bind(studentId).first<any>();
  return row ? normalisePetRow(row) : null;
}

export async function insertPet(db: D1Database, pet: PetState) {
  await db.prepare(
    `INSERT INTO pets (
      id, student_id, family_id, name, species, xp, happiness, created_at, last_fed, last_played,
      background, accessories, activity, items, hatched, hatched_at, egg_care_dates, next_poop_at,
      poop_pending, poop_since, unlocked_accessories, play_day, play_count, cleans_total, care_paused,
      paused_at, last_streak_date, care_streak, best_streak, revived_count, extra
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    pet.id,
    pet.student_id,
    ...serialisePet(pet),
  ).run();
}

export async function savePet(db: D1Database, pet: PetState) {
  await db.prepare(
    `UPDATE pets SET
      family_id = ?, name = ?, species = ?, xp = ?, happiness = ?, created_at = ?, last_fed = ?, last_played = ?,
      background = ?, accessories = ?, activity = ?, items = ?, hatched = ?, hatched_at = ?, egg_care_dates = ?,
      next_poop_at = ?, poop_pending = ?, poop_since = ?, unlocked_accessories = ?, play_day = ?, play_count = ?,
      cleans_total = ?, care_paused = ?, paused_at = ?, last_streak_date = ?, care_streak = ?, best_streak = ?,
      revived_count = ?, extra = ?
    WHERE student_id = ?`
  ).bind(...serialisePet(pet), pet.student_id).run();
}

export function makePet(studentId: string, familyId: string, name: string, species: keyof typeof PET_SPECIES): PetState {
  const ts = nowIso();
  return {
    id: newId(),
    student_id: studentId,
    family_id: familyId,
    name: name.trim().slice(0, 30) || PET_SPECIES[species].label,
    species,
    xp: 0,
    happiness: 80,
    created_at: ts,
    last_fed: ts,
    last_played: null,
    background: null,
    accessories: [],
    activity: [],
    items: [],
    hatched: false,
    hatched_at: null,
    egg_care_dates: [],
    next_poop_at: null,
    poop_pending: false,
    poop_since: null,
    unlocked_accessories: [],
    play_day: null,
    play_count: 0,
    cleans_total: 0,
    care_paused: false,
    paused_at: null,
    last_streak_date: null,
    care_streak: 0,
    best_streak: 0,
    revived_count: 0,
    extra: {},
  };
}

export async function syncPetProgress(db: D1Database, pet: PetState) {
  const awards = {
    submissions: new Set<string>(stringArray(pet.extra?.awards?.submissions)),
    feedback: new Set<string>(stringArray(pet.extra?.awards?.feedback)),
    reading: new Set<string>(stringArray(pet.extra?.awards?.reading)),
  };
  let changed = false;

  try {
    const { results: submissions } = await db.prepare(
      "SELECT id, lesson_id, submitted_at FROM submissions WHERE student_id = ? ORDER BY submitted_at ASC LIMIT 5000"
    ).bind(pet.student_id).all<any>();
    for (const row of submissions) {
      const key = String(row.id);
      if (awards.submissions.has(key)) continue;
      awards.submissions.add(key);
      pet.xp += SUBMISSION_XP;
      pet.happiness = clamp(pet.happiness + 5, 0, 100);
      pushActivity(pet, SUBMISSION_XP, `Submitted: ${row.lesson_id || row.id}`, String(row.submitted_at || nowIso()));
      changed = true;
    }
  } catch {}

  try {
    const { results: feedbackRows } = await db.prepare(
      "SELECT id, status, reviewed_at FROM submissions WHERE student_id = ? AND reviewed_at IS NOT NULL AND status IN ('accepted', 'demonstrated', 'needs_revision', 'needs_more_practice') ORDER BY reviewed_at ASC LIMIT 5000"
    ).bind(pet.student_id).all<any>();
    for (const row of feedbackRows) {
      const amount = FEEDBACK_XP[String(row.status)] ?? 0;
      if (!amount) continue;
      const key = `${row.id}:${row.reviewed_at}:${row.status}`;
      if (awards.feedback.has(key)) continue;
      awards.feedback.add(key);
      pet.xp += amount;
      pet.happiness = clamp(pet.happiness + 5, 0, 100);
      pushActivity(pet, amount, `Feedback: ${row.status}`, String(row.reviewed_at));
      changed = true;
    }
  } catch {}

  try {
    const { results: readingRows } = await db.prepare(
      "SELECT id, title, created_at FROM reading_log WHERE student_id = ? ORDER BY created_at ASC LIMIT 5000"
    ).bind(pet.student_id).all<any>();
    for (const row of readingRows) {
      const key = String(row.id);
      if (awards.reading.has(key)) continue;
      awards.reading.add(key);
      pet.xp += READING_XP;
      pushActivity(pet, READING_XP, `Read: ${row.title || "Book"}`, String(row.created_at || nowIso()));
      changed = true;
    }
  } catch {}

  if (changed) {
    pet.extra = {
      ...pet.extra,
      awards: {
        submissions: [...awards.submissions],
        feedback: [...awards.feedback],
        reading: [...awards.reading],
      },
    };
    await savePet(db, pet);
  }
  return pet;
}

export async function syncPetCare(db: D1Database, pet: PetState, now = new Date()) {
  const updates: Partial<PetState> = {};
  const clock = pet.care_paused ? parseDate(pet.paused_at) ?? now : now;
  const lastFed = parseDate(pet.last_fed) ?? clock;

  if (!pet.hatched && pet.xp >= HATCH_XP && pet.egg_care_dates.length >= HATCH_CARE_DAYS) {
    pet.hatched = true;
    pet.hatched_at = clock.toISOString();
    pet.next_poop_at = plusHours(clock, POOP_INTERVAL_HOURS).toISOString();
    updates.hatched = true;
    updates.hatched_at = pet.hatched_at;
    updates.next_poop_at = pet.next_poop_at;
  }

  let nextPoop = parseDate(pet.next_poop_at);
  if (pet.hatched && !nextPoop) {
    nextPoop = plusHours(clock, POOP_INTERVAL_HOURS);
    pet.next_poop_at = nextPoop.toISOString();
    updates.next_poop_at = pet.next_poop_at;
  }

  if (pet.hatched && !pet.poop_pending && nextPoop && clock.getTime() >= nextPoop.getTime()) {
    pet.poop_pending = true;
    pet.poop_since = nextPoop.toISOString();
    updates.poop_pending = true;
    updates.poop_since = pet.poop_since;
  }

  const poopSince = parseDate(pet.poop_since);
  const fedDays = Math.max(0, clock.getTime() - lastFed.getTime()) / 86400000;
  const poopDays = pet.poop_pending && poopSince ? Math.max(0, clock.getTime() - poopSince.getTime()) / 86400000 : 0;
  pet.neglect_days = Math.round(Math.max(fedDays, poopDays) * 100) / 100;
  pet.care_status = careStatus(pet.hatched, pet.neglect_days);

  if (Object.keys(updates).length) await savePet(db, pet);
  return pet;
}

export async function loadSyncedPet(db: D1Database, studentId: string, now = new Date()) {
  const pet = await loadPet(db, studentId);
  if (!pet) return null;
  await syncPetProgress(db, pet);
  await syncPetCare(db, pet, now);
  return pet;
}

export function touchStreak(pet: PetState, now = new Date()) {
  const today = dateOnlyUtc(now);
  const yesterday = dateOnlyUtc(new Date(now.getTime() - 86400000));
  let streak = pet.care_streak;
  if (pet.last_streak_date === today) {
    return { last_streak_date: today, care_streak: streak, best_streak: pet.best_streak };
  }
  if (pet.last_streak_date === yesterday) streak += 1;
  else streak = 1;
  return {
    last_streak_date: today,
    care_streak: streak,
    best_streak: Math.max(pet.best_streak, streak),
  };
}

async function countReadingLog(db: D1Database, studentId: string) {
  try {
    return (await db.prepare("SELECT COUNT(*) AS n FROM reading_log WHERE student_id = ?").bind(studentId).first<{ n: number }>())?.n ?? 0;
  } catch {
    return 0;
  }
}

export async function publicPet(db: D1Database, pet: PetState) {
  const out: any = {
    ...pet,
    accessories: [...pet.accessories],
    items: [...pet.items],
    egg_care_dates: [...pet.egg_care_dates],
    unlocked_accessories: [...pet.unlocked_accessories],
  };
  delete out.activity;
  delete out.extra;

  const stage = stageFor(pet.xp, pet.hatched);
  Object.assign(out, stage);

  const stageNames = CARE_STAGES.map((s) => s[1]);
  const stageIndex = stageNames.indexOf(stage.level_name);
  const readingCount = await countReadingLog(db, pet.student_id);
  const unlocked = new Set(pet.unlocked_accessories);
  for (const [id, accessory] of Object.entries(ACCESSORIES)) {
    if (!unlocked.has(id) && ruleMet(accessory.rule, stageIndex, pet, readingCount)) unlocked.add(id);
  }
  const sortedUnlocked = [...unlocked].sort();
  if (JSON.stringify(sortedUnlocked) !== JSON.stringify(pet.unlocked_accessories)) {
    pet.unlocked_accessories = sortedUnlocked;
    await savePet(db, pet);
  }

  out.unlocked_accessories = sortedUnlocked;
  out.accessory_catalog = Object.entries(ACCESSORIES).map(([id, accessory]) => ({
    id,
    label: accessory.label,
    rule: accessory.rule,
    unlocked: unlocked.has(id),
  }));
  out.egg_style = EGG_STYLES[pet.species] ?? EGG_STYLES.dragon;
  out.hatch = {
    xp_needed: HATCH_XP,
    care_days_needed: HATCH_CARE_DAYS,
    care_days_done: pet.egg_care_dates.length,
  };
  out.care = {
    needs_feeding: needsFeed(pet),
    needs_cleaning: pet.poop_pending,
    asleep: pet.care_status === "asleep",
    paused: pet.care_paused,
  };
  return out;
}

export function legacyPetView(pet: PetState) {
  return {
    ...pet,
    accessories: [...pet.accessories],
    activity: [...pet.activity],
    items: [...pet.items],
    egg_care_dates: [...pet.egg_care_dates],
    unlocked_accessories: [...pet.unlocked_accessories],
    ...levelForXp(pet.xp),
  };
}
