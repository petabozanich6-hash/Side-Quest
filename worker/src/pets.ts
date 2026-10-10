import type { Hono, MiddlewareHandler } from "hono";

type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
type Env = { DB: D1Database; JWT_SECRET: string };
type App = Hono<{ Bindings: Env; Variables: { user: AuthUser } }>;

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const newId = () => crypto.randomUUID();

const PET_SPECIES: Record<string, { label: string; voice: string }> = {
  fox: { label: "Fox", voice: "clever, warm, curious" },
  owl: { label: "Owl", voice: "wise, calm, patient" },
  turtle: { label: "Turtle", voice: "slow and steady, encouraging" },
  hedgehog: { label: "Hedgehog", voice: "gentle, careful, kind" },
  fawn: { label: "Fawn", voice: "soft, hopeful, delicate" },
  squirrel: { label: "Squirrel", voice: "energetic, playful, upbeat" },
  rabbit: { label: "Rabbit", voice: "quick, cheerful, friendly" },
  dragon: { label: "Dragon", voice: "brave, dramatic, warm-hearted" },
};

const STAGES: [number, string, string][] = [
  [0, "Egg", "egg"],
  [60, "Hatchling", "sprout"],
  [200, "Youngling", "leaf"],
  [500, "Companion", "tree"],
  [1000, "Hero", "star"],
  [2000, "Legend", "sparkle"],
];
const HATCH_XP = 60;
const HATCH_CARE_DAYS = 3;
const FEED_COOLDOWN_HOURS = 6;
const POOP_INTERVAL_HOURS = 24;
const SAD_DAYS = 2;
const SICK_DAYS = 3;
const ASLEEP_DAYS = 6;
const PLAY_XP = 2;
const PLAY_DAILY_CAP = 5;

const EGG_STYLES: Record<string, any> = {
  fox: { base: "#F4A261", accent: "#FFF1E0", pattern: "zigzag", glow: "#FFD6A5" },
  owl: { base: "#A98467", accent: "#EAD7C3", pattern: "feathers", glow: "#E8D5B7" },
  turtle: { base: "#8FBF9F", accent: "#4F8A6B", pattern: "hexagons", glow: "#C7F0D8" },
  hedgehog: { base: "#C9B8A6", accent: "#7B6A5A", pattern: "spikes", glow: "#EFE3D3" },
  fawn: { base: "#E9C8A0", accent: "#FFFFFF", pattern: "spots", glow: "#FFF0DC" },
  squirrel: { base: "#B5651D", accent: "#F0C987", pattern: "stripes", glow: "#FFD9A0" },
  rabbit: { base: "#F2E9F0", accent: "#F7B6D2", pattern: "hearts", glow: "#FFE0EF" },
  dragon: { base: "#7B5EA7", accent: "#F2C14E", pattern: "scales", glow: "#D9C2FF" },
};

const ACCESSORIES: Record<string, [string, string]> = {
  scarf: ["Cozy Scarf", "stage:Hatchling"],
  bow: ["Little Bow", "cleans:3"],
  flower_crown: ["Flower Crown", "stage:Youngling"],
  party_hat: ["Party Hat", "streak:7"],
  bookworm_specs: ["Bookworm Specs", "reading:5"],
  backpack: ["Adventure Backpack", "stage:Companion"],
  cape: ["Hero Cape", "stage:Hero"],
  star_badge: ["Star Badge", "streak:30"],
  crown: ["Legend Crown", "stage:Legend"],
};

const JSON_COLS = ["egg_care_dates", "unlocked_accessories", "accessories"];
const BOOL_COLS = ["hatched", "poop_pending", "care_paused"];

const parse = (s: any): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};
const iso = (d: Date) => d.toISOString();
const parseArr = (s: any): any[] => {
  try { const v = JSON.parse(s || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
};

function fromRow(r: any) {
  const p: any = { ...r };
  for (const k of JSON_COLS) p[k] = parseArr(r[k]);
  for (const k of BOOL_COLS) p[k] = !!r[k];
  return p;
}

async function save(db: D1Database, studentId: string, upd: Record<string, any>) {
  const keys = Object.keys(upd);
  if (!keys.length) return;
  const vals = keys.map((k) => {
    const v = upd[k];
    if (Array.isArray(v)) return JSON.stringify(v);
    if (typeof v === "boolean") return v ? 1 : 0;
    return v === undefined ? null : v;
  });
  await db.prepare(`UPDATE pets SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE student_id = ?`)
    .bind(...vals, studentId).run();
}

function stageFor(xp: number, hatched: boolean) {
  let tier = hatched ? STAGES[1] : STAGES[0];
  if (hatched) for (const t of STAGES.slice(1)) if (xp >= t[0]) tier = t;
  const nxt = hatched ? STAGES.find((x) => x[0] > xp) : STAGES[1];
  return {
    level_name: tier[1],
    level_icon: tier[2],
    next_xp: nxt ? nxt[0] : null,
    next_level: nxt ? nxt[1] : null,
  };
}

function careStatus(hatched: boolean, neglect: number) {
  if (neglect >= ASLEEP_DAYS) return hatched ? "asleep" : "cold";
  if (neglect >= SICK_DAYS) return hatched ? "sick" : "cold";
  if (neglect >= SAD_DAYS) return hatched ? "sad" : "chilly";
  return "ok";
}

function ruleMet(rule: string, stageIdx: number, pet: any, readingCount: number) {
  const [kind, val] = rule.split(":");
  if (kind === "stage") {
    const names = STAGES.map((s) => s[1]);
    return names.includes(val) && stageIdx >= names.indexOf(val);
  }
  if (kind === "streak") return (pet.best_streak | 0) >= parseInt(val);
  if (kind === "cleans") return (pet.cleans_total | 0) >= parseInt(val);
  if (kind === "reading") return readingCount >= parseInt(val);
  return false;
}

function needsFeed(pet: any, now = new Date()) {
  const lf = parse(pet.last_fed);
  if (!lf) return true;
  return now.getTime() - lf.getTime() >= FEED_COOLDOWN_HOURS * HOUR;
}

async function sync(db: D1Database, pet: any, now: Date) {
  const upd: Record<string, any> = {};
  const paused = !!pet.care_paused;
  const clock = paused && pet.paused_at ? parse(pet.paused_at) || now : now;
  const lastFed = parse(pet.last_fed) || clock;
  let hatched = !!pet.hatched;
  const xp = pet.xp | 0;

  if (!hatched && xp >= HATCH_XP && pet.egg_care_dates.length >= HATCH_CARE_DAYS) {
    hatched = true;
    upd.hatched = true;
    upd.hatched_at = iso(clock);
    upd.next_poop_at = iso(new Date(clock.getTime() + POOP_INTERVAL_HOURS * HOUR));
    pet.next_poop_at = upd.next_poop_at;
  }

  let nextPoop = parse(pet.next_poop_at);
  if (hatched && !nextPoop) {
    nextPoop = new Date(clock.getTime() + POOP_INTERVAL_HOURS * HOUR);
    upd.next_poop_at = iso(nextPoop);
  }
  let poopPending = !!pet.poop_pending;
  let poopSince = parse(pet.poop_since);
  if (hatched && !poopPending && nextPoop && clock >= nextPoop) {
    poopPending = true;
    poopSince = nextPoop;
    upd.poop_pending = true;
    upd.poop_since = iso(nextPoop);
  }

  const fedDays = Math.max(0, (clock.getTime() - lastFed.getTime()) / DAY);
  const poopDays = poopPending && poopSince ? Math.max(0, (clock.getTime() - poopSince.getTime()) / DAY) : 0;
  const neglect = Math.max(fedDays, poopDays);

  Object.assign(pet, upd);
  Object.assign(pet, {
    hatched,
    poop_pending: poopPending,
    poop_since: poopSince ? iso(poopSince) : null,
    neglect_days: Math.round(neglect * 100) / 100,
    care_status: careStatus(hatched, neglect),
  });
  await save(db, pet.student_id, upd);
  return pet;
}

async function readingCount(db: D1Database, studentId: string) {
  try {
    const r = await db.prepare("SELECT COUNT(*) n FROM reading_log WHERE student_id = ?").bind(studentId).first<{ n: number }>();
    return r?.n ?? 0;
  } catch {
    return 0;
  }
}

async function publicPet(db: D1Database, pet: any) {
  const out: any = { ...pet };
  out.care_paused = !!pet.care_paused;
  const stage = stageFor(pet.xp | 0, !!pet.hatched);
  Object.assign(out, stage);
  const stageIdx = STAGES.map((s) => s[1]).indexOf(stage.level_name);
  const reading = await readingCount(db, pet.student_id);

  const before: string[] = pet.unlocked_accessories || [];
  const unlocked = new Set<string>(before);
  for (const [aid, [, rule]] of Object.entries(ACCESSORIES)) {
    if (!unlocked.has(aid) && ruleMet(rule, stageIdx, pet, reading)) unlocked.add(aid);
  }
  const sorted = [...unlocked].sort();
  if (sorted.length !== before.length) await save(db, pet.student_id, { unlocked_accessories: sorted });
  out.unlocked_accessories = sorted;
  out.accessory_catalog = Object.entries(ACCESSORIES).map(([id, [label, rule]]) => ({
    id, label, rule, unlocked: unlocked.has(id),
  }));
  out.egg_style = EGG_STYLES[pet.species] || EGG_STYLES.dragon;
  out.hatch = {
    xp_needed: HATCH_XP,
    care_days_needed: HATCH_CARE_DAYS,
    care_days_done: (pet.egg_care_dates || []).length,
  };
  out.care = {
    needs_feeding: needsFeed(pet),
    needs_cleaning: !!pet.poop_pending,
    asleep: pet.care_status === "asleep",
    paused: !!pet.care_paused,
  };
  return out;
}

function touchStreak(pet: any, now: Date) {
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - DAY).toISOString().slice(0, 10);
  const last = pet.last_streak_date;
  let streak = pet.care_streak | 0;
  if (last === today) { /* same day */ }
  else if (last === yesterday) streak += 1;
  else streak = 1;
  return { last_streak_date: today, care_streak: streak, best_streak: Math.max(pet.best_streak | 0, streak) };
}

export async function awardXp(db: D1Database, studentId: string, amount: number) {
  await db.prepare("UPDATE pets SET xp = xp + ?, happiness = MIN(100, happiness + 5) WHERE student_id = ?")
    .bind(amount, studentId).run();
}

export function registerPets(app: App, auth: MiddlewareHandler, parent: MiddlewareHandler) {
  const loadPet = async (c: any, studentId: string) => {
    const r = await c.env.DB.prepare("SELECT * FROM pets WHERE student_id = ?").bind(studentId).first();
    return r ? fromRow(r) : null;
  };
  const childOnly = (c: any) => c.get("user").role === "child";
  const noChild = (c: any) => c.json({ detail: "Child access required" }, 403);

  // XP hooks: run after the submission routes (registered later) finish
  app.use("/api/submissions", async (c, next) => {
    await next();
    if (c.req.method !== "POST" || c.res.status !== 200) return;
    const u = c.get("user");
    if (u && u.role === "child") await awardXp(c.env.DB, u.id, 15).catch(() => {});
  });
  app.use("/api/submissions/:id/feedback", async (c, next) => {
    await next();
    if (c.req.method !== "POST" || c.res.status !== 200) return;
    const sub: any = await c.env.DB.prepare("SELECT student_id, status FROM submissions WHERE id = ?")
      .bind(c.req.param("id")).first();
    if (!sub) return;
    const xp = ({ accepted: 25, demonstrated: 50, needs_revision: 5, needs_more_practice: 10 } as any)[sub.status] || 0;
    if (xp) await awardXp(c.env.DB, sub.student_id, xp).catch(() => {});
  });

  app.get("/api/pet/species", (c) =>
    c.json(Object.entries(PET_SPECIES).map(([id, v]) => ({ id, ...v })))
  );

  const getPet = async (c: any) => {
    if (!childOnly(c)) return noChild(c);
    const now = new Date();
    const pet = await loadPet(c, c.get("user").id);
    if (!pet) return c.json({ needs_pet: true });
    await sync(c.env.DB, pet, now);
    return c.json(await publicPet(c.env.DB, pet));
  };
  app.get("/api/pet", auth, getPet);
  app.get("/api/pet/state", auth, getPet);

  app.post("/api/pet", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    if (!PET_SPECIES[b.species]) return c.json({ detail: "Unknown species" }, 400);
    if (await loadPet(c, u.id)) return c.json({ detail: "Pet already exists" }, 400);
    const name = String(b.name || "").trim().slice(0, 30) || PET_SPECIES[b.species].label;
    const ts = new Date().toISOString();
    await c.env.DB.prepare(
      "INSERT INTO pets (id, student_id, family_id, name, species, xp, happiness, created_at, last_fed) VALUES (?, ?, ?, ?, ?, 0, 80, ?, ?)"
    ).bind(newId(), u.id, u.family_id, name, b.species, ts, ts).run();
    const pet = await loadPet(c, u.id);
    await sync(c.env.DB, pet, new Date());
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.post("/api/pet/care/feed", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const now = new Date();
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    await sync(c.env.DB, pet, now);
    if (pet.care_paused) return c.json({ detail: "Care is paused by your parent" }, 400);
    const revived = pet.care_status === "asleep";
    if (!revived && !needsFeed(pet, now)) return c.json({ detail: "Not hungry yet - try again later" }, 400);
    const upd: Record<string, any> = { last_fed: iso(now), ...touchStreak(pet, now) };
    if (revived) {
      upd.happiness = 25;
      upd.revived_count = (pet.revived_count | 0) + 1;
      if (pet.poop_pending) upd.poop_since = iso(now);
    } else {
      upd.happiness = Math.min(100, (pet.happiness | 0) + 10);
    }
    if (!pet.hatched) {
      const dates = new Set<string>(pet.egg_care_dates);
      dates.add(now.toISOString().slice(0, 10));
      upd.egg_care_dates = [...dates].sort();
    }
    await save(c.env.DB, u.id, upd);
    Object.assign(pet, upd);
    await sync(c.env.DB, pet, now);
    const out: any = await publicPet(c.env.DB, pet);
    out.revived = revived;
    return c.json(out);
  });

  app.post("/api/pet/care/play", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const now = new Date();
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    await sync(c.env.DB, pet, now);
    if (pet.care_paused) return c.json({ detail: "Care is paused by your parent" }, 400);
    if (pet.care_status === "asleep") return c.json({ detail: "Your pet is asleep - feed it to wake it up" }, 400);
    const today = now.toISOString().slice(0, 10);
    const count = pet.play_day === today ? pet.play_count | 0 : 0;
    if (count >= PLAY_DAILY_CAP) return c.json({ detail: "Your pet is tired - play again tomorrow" }, 400);
    const upd: Record<string, any> = {
      play_day: today,
      play_count: count + 1,
      last_played: iso(now),
      happiness: Math.min(100, (pet.happiness | 0) + 8),
      xp: (pet.xp | 0) + PLAY_XP,
    };
    if (!pet.hatched) {
      const dates = new Set<string>(pet.egg_care_dates);
      dates.add(today);
      upd.egg_care_dates = [...dates].sort();
    }
    await save(c.env.DB, u.id, upd);
    Object.assign(pet, upd);
    await sync(c.env.DB, pet, now);
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.post("/api/pet/care/clean", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const now = new Date();
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    await sync(c.env.DB, pet, now);
    if (pet.care_paused) return c.json({ detail: "Care is paused by your parent" }, 400);
    if (!pet.poop_pending) return c.json({ detail: "Nothing to clean right now" }, 400);
    const upd = {
      poop_pending: false,
      poop_since: null,
      next_poop_at: iso(new Date(now.getTime() + POOP_INTERVAL_HOURS * HOUR)),
      cleans_total: (pet.cleans_total | 0) + 1,
      happiness: Math.min(100, (pet.happiness | 0) + 5),
    };
    await save(c.env.DB, u.id, upd);
    Object.assign(pet, upd);
    await sync(c.env.DB, pet, now);
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.put("/api/pet/care/wear", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    await sync(c.env.DB, pet, new Date());
    const pub: any = await publicPet(c.env.DB, pet);
    const b: any = await c.req.json().catch(() => ({}));
    if (!Array.isArray(b.accessories)) return c.json({ detail: "accessories must be a list" }, 400);
    const allowed = new Set<string>(pub.unlocked_accessories);
    const worn = b.accessories.filter((a: any) => allowed.has(a)).slice(0, 10);
    await save(c.env.DB, u.id, { accessories: worn });
    return c.json({ accessories: worn });
  });

  app.put("/api/pet/customize", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    const b: any = await c.req.json().catch(() => ({}));
    const upd: Record<string, any> = {};
    if (typeof b.name === "string" && b.name.trim()) upd.name = b.name.trim().slice(0, 30);
    if (typeof b.background === "string") upd.background = b.background.trim().slice(0, 30);
    if (!Object.keys(upd).length) return c.json({ detail: "Nothing to update" }, 400);
    await save(c.env.DB, u.id, upd);
    const fresh = await loadPet(c, u.id);
    await sync(c.env.DB, fresh, new Date());
    return c.json(await publicPet(c.env.DB, fresh));
  });

  app.post("/api/pet/help", auth, async (c) => {
    if (!childOnly(c)) return noChild(c);
    const u = c.get("user");
    const pet = await loadPet(c, u.id);
    if (!pet) return c.json({ detail: "No pet yet" }, 404);
    const message = `Hey ${u.name || "friend"}! I'm ${pet.name}. Let's take this one tiny step. Read the first question slowly, then try just the beginning. If a word feels tricky, check the key words. You've got this - I'll be right here. \u{1F49B}`;
    return c.json({ message, pet: { name: pet.name, species: pet.species } });
  });

  // ---- Parent holiday pause ----
  app.post("/api/pet/care/pause", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const row: any = await c.env.DB.prepare("SELECT * FROM pets WHERE student_id = ? AND family_id = ?")
      .bind(b.student_id, c.get("user").family_id).first();
    if (!row) return c.json({ detail: "Pet not found" }, 404);
    const pet = fromRow(row);
    if (pet.care_paused) return c.json({ ok: true, paused: true });
    const now = new Date();
    await sync(c.env.DB, pet, now);
    await save(c.env.DB, pet.student_id, { care_paused: true, paused_at: iso(now) });
    return c.json({ ok: true, paused: true });
  });

  app.post("/api/pet/care/resume", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const row: any = await c.env.DB.prepare("SELECT * FROM pets WHERE student_id = ? AND family_id = ?")
      .bind(b.student_id, c.get("user").family_id).first();
    if (!row) return c.json({ detail: "Pet not found" }, 404);
    const pet = fromRow(row);
    if (!pet.care_paused) return c.json({ ok: true, paused: false });
    const now = new Date();
    const delta = Math.max(0, now.getTime() - (parse(pet.paused_at) || now).getTime());
    const upd: Record<string, any> = { care_paused: false, paused_at: null };
    for (const key of ["last_fed", "next_poop_at", "poop_since"]) {
      const d = parse(pet[key]);
      if (d) upd[key] = iso(new Date(d.getTime() + delta));
    }
    await save(c.env.DB, pet.student_id, upd);
    return c.json({ ok: true, paused: false });
  });
}
