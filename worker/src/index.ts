import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import type { Context, Next } from "hono";
import { hashSecret, verifySecret } from "./auth";
import { registerCore } from "./core";
import { registerPets } from "./pets";

type Env = { DB: D1Database; JWT_SECRET: string };
type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
type Vars = { user: AuthUser };

const app = new Hono<{ Bindings: Env; Variables: Vars }>();
const TOKEN_DAYS = 30;

app.use("/api/*", cors());

const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

async function makeToken(env: Env, sub: string, role: string, familyId: string) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_DAYS * 86400;
  return sign({ sub, role, family_id: familyId, exp }, env.JWT_SECRET);
}

async function requireAuth(c: Context<{ Bindings: Env; Variables: Vars }>, next: Next) {
  const header = c.req.header("Authorization") || "";
  if (!header.startsWith("Bearer ")) return c.json({ detail: "Not authenticated" }, 401);
  let payload: any;
  try {
    payload = await verify(header.slice(7), c.env.JWT_SECRET, "HS256");
  } catch {
    return c.json({ detail: "Invalid token" }, 401);
  }
  const role = payload.role;
  if (!payload.sub || (role !== "parent" && role !== "child")) {
    return c.json({ detail: "Invalid authentication token" }, 401);
  }
  const table = role === "parent" ? "users" : "students";
  const row = await c.env.DB.prepare(`SELECT id, family_id, name FROM ${table} WHERE id = ?`)
    .bind(payload.sub)
    .first<{ id: string; family_id: string; name: string }>();
  if (!row) return c.json({ detail: "User not found" }, 401);
  c.set("user", { ...row, role });
  await next();
}

async function requireParent(c: Context<{ Bindings: Env; Variables: Vars }>, next: Next) {
  if (c.get("user").role !== "parent") return c.json({ detail: "Parent access required" }, 403);
  await next();
}

app.get("/api", (c) =>
  c.json({ name: "Side Quest Learning API", runtime: "cloudflare-workers", ok: true })
);
app.get("/api/health", (c) => c.json({ status: "alive" }));

app.post("/api/auth/register", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const name = String(b.name || "").trim();
  if (!email.includes("@") || password.length < 8 || !name) {
    return c.json({ detail: "Valid email, name and a password of 8+ characters are required" }, 400);
  }
  const exists = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return c.json({ detail: "Email already registered" }, 400);

  const familyId = newId();
  const userId = newId();
  const familyName = String(b.family_name || "").trim() || `${name}'s Family`;
  const ts = nowIso();
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO families (id, name, owner_id, created_at) VALUES (?, ?, ?, ?)")
      .bind(familyId, familyName, userId, ts),
    c.env.DB.prepare(
      "INSERT INTO users (id, family_id, email, password_hash, name, is_owner, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)"
    ).bind(userId, familyId, email, await hashSecret(password), name, ts),
  ]);
  const token = await makeToken(c.env, userId, "parent", familyId);
  return c.json({
    token,
    user: { id: userId, email, name, family_id: familyId, role: "parent" },
    family: { id: familyId, name: familyName },
  });
});

app.post("/api/auth/login", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const user = await c.env.DB.prepare(
    "SELECT id, family_id, email, name, password_hash FROM users WHERE email = ?"
  ).bind(email).first<any>();
  if (!user || !(await verifySecret(password, user.password_hash))) {
    return c.json({ detail: "Invalid email or password" }, 401);
  }
  const token = await makeToken(c.env, user.id, "parent", user.family_id);
  const { password_hash, ...safe } = user;
  return c.json({ token, user: { ...safe, role: "parent" } });
});

app.post("/api/auth/child-login", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const username = String(b.username || "").trim().toLowerCase();
  const pin = String(b.pin || "");
  const s = await c.env.DB.prepare("SELECT * FROM students WHERE username = ?").bind(username).first<any>();
  if (!s || !(await verifySecret(pin, s.pin_hash))) {
    return c.json({ detail: "Invalid username or PIN" }, 401);
  }
  const token = await makeToken(c.env, s.id, "child", s.family_id);
  const { pin_hash, ...safe } = s;
  return c.json({ token, student: { ...safe, interests: JSON.parse(s.interests || "[]"), role: "child" } });
});

app.get("/api/auth/me", requireAuth, (c) => c.json(c.get("user")));

app.get("/api/students", requireAuth, requireParent, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, family_id, name, username, birth_year, stage, year_level, theme, interests, notes, created_at FROM students WHERE family_id = ?"
  ).bind(c.get("user").family_id).all<any>();
  return c.json(results.map((r) => ({ ...r, interests: JSON.parse(r.interests || "[]") })));
});

app.post("/api/students", requireAuth, requireParent, async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const name = String(b.name || "").trim();
  const username = String(b.username || "").trim().toLowerCase();
  const pin = String(b.pin || "");
  const stage = String(b.stage || "");
  if (!name || !username || pin.length < 4 || !stage) {
    return c.json({ detail: "Name, username, stage and a PIN of 4+ characters are required" }, 400);
  }
  const taken = await c.env.DB.prepare("SELECT id FROM students WHERE username = ?").bind(username).first();
  if (taken) return c.json({ detail: "Username already taken" }, 400);

  const theme = b.theme || (stage === "ES1" ? "early" : ["S1", "S2", "S3"].includes(stage) ? "primary" : ["S4", "S5"].includes(stage) ? "secondary" : "senior");
  const id = newId();
  const interests = JSON.stringify(Array.isArray(b.interests) ? b.interests : []);
  await c.env.DB.prepare(
    "INSERT INTO students (id, family_id, name, username, pin_hash, birth_year, stage, year_level, theme, interests, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, c.get("user").family_id, name, username, await hashSecret(pin), b.birth_year ?? null, stage, b.year_level ?? null, theme, interests, b.notes ?? null, nowIso()).run();
  return c.json({ id, name, username, stage, theme });
});

// Pets must register before core so its XP hooks wrap the submission routes.
registerPets(app as any, requireAuth as any, requireParent as any);
registerCore(app as any, requireAuth as any, requireParent as any);

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
