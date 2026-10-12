// Authenticated pet-room checks against an in-memory database. No production data.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { pathToFileURL } from "node:url";

const root = new URL("../..", import.meta.url);
const bundleDir = mkdtempSync(join(tmpdir(), "pet-room-worker-"));
const outfile = join(bundleDir, "worker.mjs");
execFileSync(
  join(root.pathname, "worker/node_modules/esbuild/bin/esbuild"),
  ["worker/src/index.ts", "--bundle", "--platform=node", "--format=esm", `--outfile=${outfile}`],
  { cwd: root.pathname, stdio: "inherit" },
);
const worker = await import(pathToFileURL(outfile).href);

const SCHEMA = `
CREATE TABLE families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT NOT NULL,
  picture TEXT,
  is_owner INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  birth_year INTEGER,
  stage TEXT NOT NULL,
  year_level TEXT,
  theme TEXT,
  interests TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  created_at TEXT NOT NULL,
  extra TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE pets (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  happiness INTEGER NOT NULL DEFAULT 80,
  created_at TEXT NOT NULL,
  last_fed TEXT,
  last_played TEXT,
  background TEXT,
  accessories TEXT NOT NULL DEFAULT '[]',
  activity TEXT NOT NULL DEFAULT '[]',
  items TEXT NOT NULL DEFAULT '[]',
  hatched INTEGER NOT NULL DEFAULT 0,
  hatched_at TEXT,
  egg_care_dates TEXT NOT NULL DEFAULT '[]',
  next_poop_at TEXT,
  poop_pending INTEGER NOT NULL DEFAULT 0,
  poop_since TEXT,
  unlocked_accessories TEXT NOT NULL DEFAULT '[]',
  play_day TEXT,
  play_count INTEGER NOT NULL DEFAULT 0,
  cleans_total INTEGER NOT NULL DEFAULT 0,
  care_paused INTEGER NOT NULL DEFAULT 0,
  paused_at TEXT,
  last_streak_date TEXT,
  care_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  revived_count INTEGER NOT NULL DEFAULT 0,
  extra TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  lesson_id TEXT,
  response_text TEXT,
  reflection TEXT,
  file_ids TEXT NOT NULL DEFAULT '[]',
  needs_help INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'submitted',
  parent_feedback TEXT,
  next_step TEXT,
  outcome_mappings TEXT NOT NULL DEFAULT '[]',
  reviewed_at TEXT,
  reviewed_by TEXT,
  submitted_at TEXT NOT NULL
);
CREATE TABLE reading_log (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  title TEXT NOT NULL,
  read_date TEXT NOT NULL,
  logged_by TEXT NOT NULL,
  logged_role TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

function createDb() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(SCHEMA);
  let holdPetWrite = false;
  const bound = (sql, args) => {
    const stmt = sqlite.prepare(sql);
    return {
      async first() {
        const row = stmt.get(...args);
        return row === undefined ? null : row;
      },
      async all() {
        return { results: stmt.all(...args) };
      },
      async run() {
        if (holdPetWrite && /^\s*update\s+pets\b/i.test(sql)) {
          holdPetWrite = false;
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        const info = stmt.run(...args);
        return { success: true, meta: { changes: info.changes ?? 0 } };
      },
    };
  };
  return {
    sqlite,
    holdNextPetWrite() { holdPetWrite = true; },
    prepare(sql) {
      return {
        bind(...args) {
          return bound(sql, args);
        },
      };
    },
    async batch(statements) {
      sqlite.exec("BEGIN");
      try {
        const out = [];
        for (const statement of statements) out.push(await statement.run());
        sqlite.exec("COMMIT");
        return out;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
  };
}

const db = createDb();
const env = { DB: db, JWT_SECRET: "pet-room-test-secret" };
const ctx = { waitUntil() {} };

async function call(method, path, { token, body } = {}) {
  const res = await worker.default.fetch(
    new Request(`http://pet-room.test/api${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    env,
    ctx,
  );
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function stored(studentId) {
  const row = db.sqlite.prepare("SELECT xp, extra, name, species, background FROM pets WHERE student_id = ?").get(studentId);
  const extra = JSON.parse(row.extra);
  return { ...row, extra, acorns: extra.economy?.acorns };
}

test("authenticated children keep separate rooms, acorns and layouts", async () => {
  const stamp = Date.now();
  const familyA = await call("POST", "/auth/register", {
    body: { email: `ada-parent-${stamp}@example.com`, password: "test-pass-1", name: "Ada Parent", family_name: "Alder" },
  });
  assert.equal(familyA.status, 200, JSON.stringify(familyA.data));
  const familyB = await call("POST", "/auth/register", {
    body: { email: `cam-parent-${stamp}@example.com`, password: "test-pass-2", name: "Cam Parent", family_name: "Birch" },
  });
  assert.equal(familyB.status, 200, JSON.stringify(familyB.data));

  const adaStudent = await call("POST", "/students", {
    token: familyA.data.token,
    body: { name: "Ada", username: `ada${stamp}`, pin: "2468", stage: "S2", birth_year: 2016 },
  });
  const benStudent = await call("POST", "/students", {
    token: familyA.data.token,
    body: { name: "Ben", username: `ben${stamp}`, pin: "1357", stage: "S2", birth_year: 2017 },
  });
  const camStudent = await call("POST", "/students", {
    token: familyB.data.token,
    body: { name: "Cam", username: `cam${stamp}`, pin: "8024", stage: "S2", birth_year: 2016 },
  });
  assert.equal(adaStudent.status, 200);
  assert.equal(benStudent.status, 200);
  assert.equal(camStudent.status, 200);

  const adaLogin = await call("POST", "/auth/child-login", { body: { username: `ada${stamp}`, pin: "2468" } });
  const benLogin = await call("POST", "/auth/child-login", { body: { username: `ben${stamp}`, pin: "1357" } });
  const camLogin = await call("POST", "/auth/child-login", { body: { username: `cam${stamp}`, pin: "8024" } });
  assert.equal(adaLogin.status, 200);
  const ada = adaLogin.data.token;
  const ben = benLogin.data.token;
  const cam = camLogin.data.token;

  assert.equal((await call("GET", "/pet/state")).status, 401);
  assert.equal((await call("GET", "/pet/state", { token: familyA.data.token })).status, 403);
  assert.equal((await call("POST", "/pet/shop/buy", { token: familyB.data.token, body: { item_id: "toy" } })).status, 403);

  const adaPet = await call("POST", "/pet", { token: ada, body: { species: "fox", name: "Fern" } });
  const camPet = await call("POST", "/pet", { token: cam, body: { species: "rabbit", name: "Moss" } });
  assert.equal(adaPet.status, 200);
  assert.equal(adaPet.data.species, "fox");
  assert.equal(camPet.data.species, "rabbit");

  db.sqlite.prepare(
    `INSERT INTO pets (id, student_id, family_id, name, species, xp, created_at, background, extra)
     VALUES (?, ?, ?, 'Old Fern', 'turtle', 40, ?, 'meadow', '{}')`,
  ).run(`legacy-${stamp}`, benStudent.data.id, familyA.data.family.id, new Date().toISOString());

  const adaState = await call("GET", "/pet/state", { token: ada });
  const benState = await call("GET", "/pet/state", { token: ben });
  const camState = await call("GET", "/pet/state", { token: cam });
  assert.equal(adaState.status, 200);
  assert.equal(adaState.data.name, "Fern");
  assert.equal(adaState.data.species, "fox");
  assert.equal(adaState.data.economy.acorns, 8);
  assert.equal(benState.data.name, "Old Fern");
  assert.equal(benState.data.species, "turtle");
  assert.equal(benState.data.xp, 40);
  assert.equal(benState.data.economy.acorns, 8);
  assert.equal(benState.data.care.needs_cleaning, false);
  assert.equal(benState.data.care.asleep, false);
  assert.equal(benState.data.care_status, "ok");
  assert.equal(benState.data.room.placements.length, 4);
  assert.equal(camState.data.name, "Moss");
  assert.equal(JSON.stringify(adaState.data).includes("extraRaw"), false);

  const renamed = await call("PUT", "/pet/customize", { token: ada, body: { name: "Pip" } });
  assert.equal(renamed.status, 200);
  assert.equal(renamed.data.name, "Pip");

  const forged = await call("POST", "/pet/shop/buy", {
    token: ada,
    body: { item_id: "mobile", cost: 0, price: 0, acorns: 9999, student_id: camStudent.data.id },
  });
  assert.equal(forged.status, 400);
  assert.equal(forged.data.detail, "Not enough acorns");
  assert.equal(stored(adaStudent.data.id).acorns, 8);
  assert.equal(stored(camStudent.data.id).acorns, 8);

  const [toyA, toyB] = await Promise.all([
    call("POST", "/pet/shop/buy", { token: ada, body: { item_id: "toy" } }),
    call("POST", "/pet/shop/buy", { token: ada, body: { item_id: "toy" } }),
  ]);
  const toyStatuses = [toyA.status, toyB.status].sort();
  assert.deepEqual(toyStatuses, [200, 400]);
  assert.equal(stored(adaStudent.data.id).acorns, 4);
  assert.ok(stored(adaStudent.data.id).extra.room.owned.includes("toy"));

  const again = await call("POST", "/pet/shop/buy", { token: ada, body: { item_id: "toy" } });
  assert.equal(again.status, 400);
  assert.equal(again.data.detail, "You already own this");
  assert.equal(stored(adaStudent.data.id).acorns, 4);

  const [bowl, plant] = await Promise.all([
    call("POST", "/pet/shop/buy", { token: ada, body: { item_id: "bowl" } }),
    call("POST", "/pet/shop/buy", { token: ada, body: { item_id: "plant", cost: 0 } }),
  ]);
  assert.equal(bowl.status, 200, JSON.stringify(bowl.data));
  assert.equal(plant.status, 400);
  assert.equal(plant.data.detail, "Not enough acorns");
  assert.equal(stored(adaStudent.data.id).acorns, 0);
  assert.equal(stored(adaStudent.data.id).extra.room.owned.includes("plant"), false);
  assert.ok(stored(adaStudent.data.id).acorns >= 0);

  const locked = await call("PUT", "/pet/room", { token: ada, body: { theme: "night" } });
  assert.equal(locked.status, 400);
  assert.match(locked.data.detail, /not unlocked/);

  const placed = await call("PUT", "/pet/room", {
    token: ada,
    body: {
      theme: "sunset",
      placements: [
        { uid: "window", item: "window", x: 0.7, y: 0.22, flip: false },
        { uid: "bed", item: "bed", x: 0.3, y: 0.64, flip: false },
        { uid: "cushion", item: "cushion", x: 0.55, y: 0.7, flip: false },
        { uid: "lamp", item: "lamp", x: 0.84, y: 0.62, flip: false },
        { uid: "toy", item: "toy", x: 0.68, y: 0.66, flip: false },
      ],
    },
  });
  assert.equal(placed.status, 200, JSON.stringify(placed.data));
  assert.equal(placed.data.room.theme, "sunset");
  assert.equal(placed.data.room.placements.find((item) => item.item === "window").x, 0.7);

  const invalid = await call("PUT", "/pet/room", {
    token: ada,
    body: { placements: [{ uid: "window", item: "window", x: 0.2, y: 0.8, flip: false }] },
  });
  assert.equal(invalid.status, 400);
  assert.equal(stored(adaStudent.data.id).extra.room.placements.find((item) => item.item === "window").x, 0.7);

  db.holdNextPetWrite();
  const [camToy, camBowl] = await Promise.all([
    call("POST", "/pet/shop/buy", { token: cam, body: { item_id: "toy", cost: 0 } }),
    call("POST", "/pet/shop/buy", { token: cam, body: { item_id: "bowl", price: 0 } }),
  ]);
  assert.equal(camToy.status, 200, JSON.stringify(camToy.data));
  assert.equal(camBowl.status, 200, JSON.stringify(camBowl.data));
  assert.equal(stored(camStudent.data.id).acorns, 0);
  assert.ok(stored(camStudent.data.id).extra.room.owned.includes("toy"));
  assert.ok(stored(camStudent.data.id).extra.room.owned.includes("bowl"));

  const intrude = await call("PUT", "/pet/room", {
    token: cam,
    body: { theme: "rose", student_id: adaStudent.data.id, placements: [] },
  });
  assert.equal(intrude.status, 200);
  assert.equal(stored(adaStudent.data.id).extra.room.theme, "sunset");
  assert.equal(stored(camStudent.data.id).extra.room.theme, "rose");
  assert.equal(stored(benStudent.data.id).acorns, 8);
  assert.equal(stored(camStudent.data.id).name, "Moss");

  const pauseOther = await call("POST", "/pet/care/pause", {
    token: familyB.data.token,
    body: { student_id: adaStudent.data.id },
  });
  assert.equal(pauseOther.status, 404);

  db.sqlite.prepare(
    `INSERT INTO submissions (id, family_id, assignment_id, student_id, lesson_id, submitted_at)
     VALUES (?, ?, ?, ?, 'lesson-1', ?)`,
  ).run(`sub-${stamp}`, familyA.data.family.id, `asg-${stamp}`, adaStudent.data.id, new Date().toISOString());

  const [rewardA, rewardB] = await Promise.all([
    call("GET", "/pet/state", { token: ada }),
    call("GET", "/pet/state", { token: ada }),
  ]);
  assert.equal(rewardA.status, 200);
  assert.equal(rewardB.status, 200);
  assert.equal(rewardA.data.economy.acorns, 2);
  assert.equal(rewardB.data.economy.acorns, 2);
  assert.equal(stored(adaStudent.data.id).acorns, 2);
  assert.equal(stored(adaStudent.data.id).xp, 15);
  assert.equal(stored(adaStudent.data.id).extra.economy.seen.submissions.length, 1);

  const replay = await call("GET", "/pet/state", { token: ada });
  assert.equal(replay.data.economy.acorns, 2);
  assert.equal(replay.data.xp, 15);

  const returned = await call("POST", "/auth/child-login", { body: { username: `ada${stamp}`, pin: "2468" } });
  const after = await call("GET", "/pet/state", { token: returned.data.token });
  assert.equal(after.data.name, "Pip");
  assert.equal(after.data.species, "fox");
  assert.equal(after.data.room.theme, "sunset");
  assert.equal(after.data.room.placements.find((item) => item.item === "window").x, 0.7);
  assert.equal(after.data.economy.acorns, 2);
  assert.ok(after.data.room.owned.includes("toy"));
  assert.ok(after.data.room.owned.includes("bowl"));
  const benAgain = await call("GET", "/pet/state", { token: ben });
  assert.equal(benAgain.data.economy.acorns, 8);
  assert.equal(benAgain.data.species, "turtle");
});
