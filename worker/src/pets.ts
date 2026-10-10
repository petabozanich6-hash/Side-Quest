import type { App, Guards } from "./types";
import { nowIso, newId } from "./types";
import { normaliseAchievement, publicAchievement, syncAchievementsForStudent } from "./data/achievements";
import {
  MAX_WORN,
  PACKS,
  normalisePackRow,
  normalisePrize,
  packView,
  sydneyYear,
  todaySydney,
} from "./data/seasonal";
import {
  PET_SPECIES,
  PLAY_DAILY_CAP,
  PLAY_XP,
  legacyPetView,
  loadPet,
  loadSyncedPet,
  makePet,
  needsFeed,
  publicPet,
  savePet,
  insertPet,
  syncPetCare,
  touchStreak,
} from "./data/pets";

const cleanDate = (value: unknown) => {
  if (value == null || String(value).trim() === "") return null;
  const s = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : s;
};

const jsonBody = async (c: any) => c.req.json().catch(() => ({}));

async function ownedPrizeRows(db: D1Database, studentId: string) {
  const { results } = await db.prepare(
    "SELECT * FROM seasonal_prizes WHERE student_id = ? ORDER BY claimed_at ASC LIMIT 500"
  ).bind(studentId).all<any>();
  const rows = results
    .map((row) => ({ row, keep: normalisePrize(row) }))
    .filter((entry): entry is { row: any; keep: NonNullable<ReturnType<typeof normalisePrize>> } => !!entry.keep);
  const order = Object.keys(PACKS);
  rows.sort((a, b) => {
    const pa = order.indexOf(a.keep.pack);
    const pb = order.indexOf(b.keep.pack);
    if (pa !== pb) return pa - pb;
    return a.keep.id.localeCompare(b.keep.id, undefined, { numeric: true });
  });
  return rows;
}

async function familyConfigs(db: D1Database, familyId: string) {
  const { results } = await db.prepare(
    "SELECT * FROM seasonal_packs WHERE family_id = ? LIMIT 100"
  ).bind(familyId).all<any>();
  const out: Record<string, any> = {};
  for (const row of results) out[String(row.pack)] = normalisePackRow(row);
  return out;
}

function jsonDetail(c: any, detail: string, code: number) {
  return c.json({ detail }, code as any);
}

export function registerPets(app: App, g: Guards) {
  app.get("/api/pet/species", (c) =>
    c.json(Object.entries(PET_SPECIES).map(([id, meta]) => ({ id, ...meta })))
  );

  app.get("/api/pet", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return c.json({ needs_pet: true });
    return c.json(legacyPetView(pet));
  });

  app.post("/api/pet", g.auth, g.child, async (c) => {
    const user = c.get("user");
    const body: any = await jsonBody(c);
    const species = String(body.species || "") as keyof typeof PET_SPECIES;
    if (!(species in PET_SPECIES)) return jsonDetail(c, "Unknown species", 400);
    if (await loadPet(c.env.DB, user.id)) return jsonDetail(c, "Pet already exists", 400);
    const pet = makePet(user.id, user.family_id, String(body.name || ""), species);
    await insertPet(c.env.DB, pet);
    return c.json(legacyPetView(pet));
  });

  app.post("/api/pet/feed", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    pet.happiness = Math.min(100, pet.happiness + 10);
    pet.last_fed = nowIso();
    await savePet(c.env.DB, pet);
    return c.json({ happiness: pet.happiness });
  });

  app.post("/api/pet/play", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    const ts = nowIso();
    pet.happiness = Math.min(100, pet.happiness + 8);
    pet.xp += 2;
    pet.last_played = ts;
    pet.activity = [...pet.activity, { amount: 2, reason: "Played with pet", at: ts }];
    await savePet(c.env.DB, pet);
    return c.json({ happiness: pet.happiness, xp: pet.xp });
  });

  app.put("/api/pet/customize", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    const body: any = await jsonBody(c);
    let changed = false;
    if (typeof body.name === "string") {
      const name = body.name.trim().slice(0, 30);
      if (name) {
        pet.name = name;
        changed = true;
      }
    }
    if (typeof body.background === "string") {
      pet.background = body.background.trim().slice(0, 30) || null;
      changed = true;
    }
    if (Array.isArray(body.accessories)) {
      pet.accessories = Array.from(
        new Set(
          body.accessories
            .map((item: unknown) => String(item).slice(0, 30))
            .filter((item: string) => !!item),
        ),
      ) as string[];
      pet.accessories = pet.accessories.slice(0, 10);
      changed = true;
    }
    if (!changed) return jsonDetail(c, "Nothing to update", 400);
    await savePet(c.env.DB, pet);
    return c.json(legacyPetView(pet));
  });

  app.post("/api/pet/help", g.auth, g.child, async (c) => {
    const user = c.get("user");
    const pet = await loadPet(c.env.DB, user.id);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    return c.json({
      message: `Hey ${user.name || "friend"}! I'm ${pet.name}. Let's take this one tiny step. Read the first question slowly, then try just the beginning. If a word feels tricky, check the key words. You've got this - I'll be right here. 💛`,
      pet: { name: pet.name, species: pet.species },
    });
  });

  app.get("/api/pet/state", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return c.json({ needs_pet: true });
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.post("/api/pet/care/feed", g.auth, g.child, async (c) => {
    const now = new Date();
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id, now);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    if (pet.care_paused) return jsonDetail(c, "Care is paused by your parent", 400);
    const revived = pet.care_status === "asleep";
    if (!revived && !needsFeed(pet, now)) return jsonDetail(c, "Not hungry yet - try again later", 400);
    pet.last_fed = now.toISOString();
    Object.assign(pet, touchStreak(pet, now));
    if (revived) {
      pet.happiness = 25;
      pet.revived_count += 1;
      if (pet.poop_pending) pet.poop_since = now.toISOString();
    } else {
      pet.happiness = Math.min(100, pet.happiness + 10);
    }
    if (!pet.hatched) {
      pet.egg_care_dates = [...new Set([...pet.egg_care_dates, now.toISOString().slice(0, 10)])].sort();
    }
    await savePet(c.env.DB, pet);
    await syncPetCare(c.env.DB, pet, now);
    return c.json({ ...(await publicPet(c.env.DB, pet)), revived });
  });

  app.post("/api/pet/care/play", g.auth, g.child, async (c) => {
    const now = new Date();
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id, now);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    if (pet.care_paused) return jsonDetail(c, "Care is paused by your parent", 400);
    if (pet.care_status === "asleep") return jsonDetail(c, "Your pet is asleep - feed it to wake it up", 400);
    const today = now.toISOString().slice(0, 10);
    const count = pet.play_day === today ? pet.play_count : 0;
    if (count >= PLAY_DAILY_CAP) return jsonDetail(c, "Your pet is tired - play again tomorrow", 400);
    pet.play_day = today;
    pet.play_count = count + 1;
    pet.last_played = now.toISOString();
    pet.happiness = Math.min(100, pet.happiness + 8);
    pet.xp += PLAY_XP;
    pet.activity = [...pet.activity, { amount: PLAY_XP, reason: "Played with pet", at: now.toISOString() }];
    if (!pet.hatched) pet.egg_care_dates = [...new Set([...pet.egg_care_dates, today])].sort();
    await savePet(c.env.DB, pet);
    await syncPetCare(c.env.DB, pet, now);
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.post("/api/pet/care/clean", g.auth, g.child, async (c) => {
    const now = new Date();
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id, now);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    if (pet.care_paused) return jsonDetail(c, "Care is paused by your parent", 400);
    if (!pet.poop_pending) return jsonDetail(c, "Nothing to clean right now", 400);
    pet.poop_pending = false;
    pet.poop_since = null;
    pet.next_poop_at = new Date(now.getTime() + 24 * 3600000).toISOString();
    pet.cleans_total += 1;
    pet.happiness = Math.min(100, pet.happiness + 5);
    await savePet(c.env.DB, pet);
    await syncPetCare(c.env.DB, pet, now);
    return c.json(await publicPet(c.env.DB, pet));
  });

  app.put("/api/pet/care/wear", g.auth, g.child, async (c) => {
    const pet = await loadSyncedPet(c.env.DB, c.get("user").id);
    if (!pet) return jsonDetail(c, "No pet yet", 404);
    const body: any = await jsonBody(c);
    if (!Array.isArray(body.accessories)) return jsonDetail(c, "accessories must be a list", 400);
    const pub: any = await publicPet(c.env.DB, pet);
    const allowed = new Set<string>(pub.unlocked_accessories || []);
    pet.accessories = Array.from(
      new Set(
        body.accessories
          .map((item: unknown) => String(item))
          .filter((item: string) => allowed.has(item)),
      ),
    ) as string[];
    pet.accessories = pet.accessories.slice(0, 10);
    await savePet(c.env.DB, pet);
    return c.json({ accessories: pet.accessories });
  });

  app.post("/api/pet/care/pause", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const body: any = await jsonBody(c);
    const studentId = String(body.student_id || "");
    if (!studentId) return jsonDetail(c, "student_id is required", 400);
    const pet = await loadPet(c.env.DB, studentId);
    if (!pet || pet.family_id !== user.family_id) return jsonDetail(c, "Pet not found", 404);
    if (pet.care_paused) return c.json({ ok: true, paused: true });
    const now = new Date();
    await syncPetCare(c.env.DB, pet, now);
    pet.care_paused = true;
    pet.paused_at = now.toISOString();
    await savePet(c.env.DB, pet);
    return c.json({ ok: true, paused: true });
  });

  app.post("/api/pet/care/resume", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const body: any = await jsonBody(c);
    const studentId = String(body.student_id || "");
    if (!studentId) return jsonDetail(c, "student_id is required", 400);
    const pet = await loadPet(c.env.DB, studentId);
    if (!pet || pet.family_id !== user.family_id) return jsonDetail(c, "Pet not found", 404);
    if (!pet.care_paused) return c.json({ ok: true, paused: false });
    const now = new Date();
    const pausedAt = pet.paused_at ? new Date(pet.paused_at) : now;
    const delta = Math.max(0, now.getTime() - pausedAt.getTime());
    const shift = (value: string | null) => {
      if (!value) return null;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? value : new Date(d.getTime() + delta).toISOString();
    };
    pet.care_paused = false;
    pet.paused_at = null;
    pet.last_fed = shift(pet.last_fed);
    pet.next_poop_at = shift(pet.next_poop_at);
    pet.poop_since = shift(pet.poop_since);
    await savePet(c.env.DB, pet);
    return c.json({ ok: true, paused: false });
  });

  app.get("/api/achievements", g.auth, async (c) => {
    const user = c.get("user");
    let students: Array<{ id: string; family_id: string; name: string }> = [];
    if (user.role === "child") {
      students = [{ id: user.id, family_id: user.family_id, name: user.name }];
    } else {
      const wanted = c.req.query("student_id");
      const sql = wanted
        ? "SELECT id, family_id, name FROM students WHERE family_id = ? AND id = ? LIMIT 50"
        : "SELECT id, family_id, name FROM students WHERE family_id = ? LIMIT 50";
      const bind = wanted ? [user.family_id, wanted] : [user.family_id];
      students = (await c.env.DB.prepare(sql).bind(...bind).all<any>()).results;
    }
    for (const student of students) await syncAchievementsForStudent(c.env.DB, student);
    if (!students.length) return c.json({ items: [], unclaimed: 0 });
    const placeholders = students.map(() => "?").join(", ");
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM achievements WHERE family_id = ? AND student_id IN (${placeholders}) ORDER BY awarded_at DESC LIMIT 2000`
    ).bind(user.family_id, ...students.map((student) => student.id)).all<any>();
    const items = results.map(publicAchievement);
    return c.json({ items, unclaimed: items.filter((item) => !item.claimed).length });
  });

  app.post("/api/achievements/:aid/claim", g.auth, g.child, async (c) => {
    const body: any = await jsonBody(c);
    const box = Number(body.box);
    if (![0, 1, 2].includes(box)) return jsonDetail(c, "Pick one of the three boxes", 400);
    const row = await c.env.DB.prepare(
      "SELECT * FROM achievements WHERE id = ? AND student_id = ?"
    ).bind(c.req.param("aid"), c.get("user").id).first<any>();
    if (!row) return jsonDetail(c, "Achievement not found", 404);
    const fullDoc: any = normaliseAchievement(row);
    if (fullDoc.claimed) return jsonDetail(c, "You already opened a box for this one", 400);
    const prize = fullDoc.box_prizes?.[box];
    if (!prize) return jsonDetail(c, "Pick one of the three boxes", 400);
    const ts = nowIso();
    const res = await c.env.DB.prepare(
      "UPDATE achievements SET claimed = 1, chosen_box = ?, prize = ?, claimed_at = ? WHERE id = ? AND student_id = ? AND claimed = 0"
    ).bind(box, JSON.stringify(prize), ts, c.req.param("aid"), c.get("user").id).run();
    if (!res.meta.changes) return jsonDetail(c, "You already opened a box for this one", 400);
    const pet = await loadPet(c.env.DB, c.get("user").id);
    if (pet) {
      pet.items = [...pet.items, { ...prize, from_lesson: row.lesson_title, at: ts }];
      await savePet(c.env.DB, pet);
    }
    return c.json({ prize, boxes: fullDoc.box_prizes, chosen_box: box, lesson_title: row.lesson_title });
  });

  app.get("/api/seasonal", g.auth, g.parent, async (c) => {
    const cfgs = await familyConfigs(c.env.DB, c.get("user").family_id);
    return c.json({ today: todaySydney(), packs: Object.keys(PACKS).map((pack) => packView(pack, cfgs[pack])) });
  });

  app.put("/api/seasonal/worn", g.auth, g.child, async (c) => {
    const body: any = await jsonBody(c);
    const ids = Array.isArray(body.ids) ? new Set(body.ids.map((id: unknown) => String(id))) : new Set<string>();
    const rows = await ownedPrizeRows(c.env.DB, c.get("user").id);
    const wanted = rows.map((entry) => entry.keep).filter((keep) => ids.has(keep.id));
    if (wanted.length > MAX_WORN) return jsonDetail(c, `Pick up to ${MAX_WORN} prizes at a time`, 400);
    const slots = wanted.map((keep) => keep.slot);
    if (slots.length !== new Set(slots).size) return jsonDetail(c, "Only one prize can go in each spot", 400);
    await c.env.DB.batch(rows.map((entry) =>
      c.env.DB.prepare("UPDATE seasonal_prizes SET worn = ? WHERE id = ?").bind(ids.has(entry.keep.id) ? 1 : 0, entry.row.id)
    ));
    return c.json({ ok: true, keepsakes: rows.map((entry) => ({ ...entry.keep, worn: ids.has(entry.keep.id) })) });
  });

  app.get("/api/seasonal/active", g.auth, g.child, async (c) => {
    const cfgs = await familyConfigs(c.env.DB, c.get("user").family_id);
    const keepsakes = (await ownedPrizeRows(c.env.DB, c.get("user").id)).map((entry) => entry.keep);
    const year = sydneyYear();
    const claimedThisYear = new Set(keepsakes.filter((keep) => keep.year === year).map((keep) => keep.pack));
    const packs = Object.keys(PACKS)
      .map((pack) => {
        const view = packView(pack, cfgs[pack]);
        if (!view.active) return null;
        const have = keepsakes.filter((keep) => keep.pack === pack).length;
        return {
          pack,
          label: view.label,
          decorations: view.decorations,
          prize_enabled: view.prize_enabled,
          claimed: claimedThisYear.has(pack),
          complete: have >= PACKS[pack].prizes.length,
        };
      })
      .filter(Boolean);
    return c.json({ packs, keepsakes, max_worn: MAX_WORN });
  });

  app.put("/api/seasonal/:pack", g.auth, g.parent, async (c) => {
    const pack = c.req.param("pack");
    if (!PACKS[pack]) return jsonDetail(c, "Unknown pack", 404);
    const body: any = await jsonBody(c);
    const start = body.start_date === "" ? null : cleanDate(body.start_date);
    const end = body.end_date === "" ? null : cleanDate(body.end_date);
    if (body.start_date && start === null) return jsonDetail(c, "Dates must look like YYYY-MM-DD", 400);
    if (body.end_date && end === null) return jsonDetail(c, "Dates must look like YYYY-MM-DD", 400);
    if (start && end && end < start) return jsonDetail(c, "End date must be on or after the start date", 400);
    const familyId = c.get("user").family_id;
    await c.env.DB.prepare(
      `INSERT INTO seasonal_packs (family_id, pack, enabled, start_date, end_date, decorations, prize, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(family_id, pack) DO UPDATE SET
         enabled = excluded.enabled,
         start_date = excluded.start_date,
         end_date = excluded.end_date,
         decorations = excluded.decorations,
         prize = excluded.prize,
         updated_at = excluded.updated_at`
    ).bind(
      familyId,
      pack,
      body.enabled ? 1 : 0,
      start,
      end,
      body.decorations === false ? 0 : 1,
      body.prize === false ? 0 : 1,
      nowIso(),
    ).run();
    return c.json(packView(pack, {
      family_id: familyId,
      pack,
      enabled: !!body.enabled,
      start_date: start,
      end_date: end,
      decorations: body.decorations !== false,
      prize: body.prize !== false,
    }));
  });

  app.post("/api/seasonal/:pack/claim", g.auth, g.child, async (c) => {
    const pack = c.req.param("pack");
    if (!PACKS[pack]) return jsonDetail(c, "Unknown pack", 404);
    const cfg = (await familyConfigs(c.env.DB, c.get("user").family_id))[pack];
    const view = packView(pack, cfg);
    if (!view.active || !view.prize_enabled) return jsonDetail(c, "This prize is not available right now", 400);
    const rows = await ownedPrizeRows(c.env.DB, c.get("user").id);
    const year = sydneyYear();
    const mine = rows.map((entry) => entry.keep).filter((keep) => keep.pack === pack);
    if (mine.some((keep) => keep.year === year)) {
      return jsonDetail(c, "You already claimed this year's prize. See you next year!", 400);
    }
    const have = new Set(mine.map((keep) => keep.id));
    const left = PACKS[pack].prizes.map((_, index) => `${pack}-${index + 1}`).filter((id) => !have.has(id));
    if (!left.length) return jsonDetail(c, "You have collected every prize in this set!", 400);
    const prizeId = left[Math.floor(Math.random() * left.length)];
    const prizeIndex = Number(prizeId.split("-").pop()) - 1;
    const [name, emoji, slot] = PACKS[pack].prizes[prizeIndex];
    const worn = rows.map((entry) => entry.keep).filter((keep) => keep.worn);
    const canWear = worn.length < MAX_WORN && worn.every((keep) => keep.slot !== slot);
    await c.env.DB.prepare(
      "INSERT INTO seasonal_prizes (id, student_id, family_id, pack, year, prize_id, claimed_at, worn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(newId(), c.get("user").id, c.get("user").family_id, pack, year, prizeId, nowIso(), canWear ? 1 : 0).run();
    return c.json({ ok: true, prize: { id: prizeId, name, emoji, slot } });
  });

  app.post("/api/cheers/:cid/seen", g.auth, g.child, async (c) => {
    await c.env.DB.prepare("UPDATE cheers SET seen = 1, seen_at = ? WHERE id = ? AND student_id = ?")
      .bind(nowIso(), c.req.param("cid"), c.get("user").id)
      .run();
    return c.json({ ok: true });
  });
}
