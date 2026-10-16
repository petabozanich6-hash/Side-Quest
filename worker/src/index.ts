import { Hono } from "hono";
import { normJurisdiction, setFamilyJurisdiction, getFamilyJurisdiction } from "./data/jurisdictions";
import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";
import { hashSecret, verifySecret } from "./auth";
import { loginBlocked, recordLoginFailure, clearLoginFailures, ensureAuthSchema } from "./loginThrottle";
import { registerCore } from "./core";
import { trialEndFrom } from "./entitlements";
import { checkCanAddChild, getEntitlement } from "./lessonBuilder";
import { registerFamily, studentOut, studentExtraFromBody, STUDENT_SELECT } from "./family";
import { registerLearning } from "./learning";
import { registerPets } from "./pets";
import { registerWords } from "./words";
import { registerAccount } from "./account";
import { registerPasswordReset } from "./passwordReset";
import { registerStudentCredentials } from "./studentCredentials";
import { registerHelpRequests } from "./helpRequests";
import { registerBilling, reconcileSubscriptions } from "./billing";
import { registerOutcomes } from "./outcomeTracker";
import { registerAutoQuest } from "./autoQuest";
import { registerTimetable } from "./timetable";
import { registerHomeschoolCompass } from "./homeschoolCompass";
import { registerSiteSearch } from "./siteSearch";
import { registerMembershipAccess } from "./membershipAccess";
import { registerFeedback } from "./feedback";
import { registerAnnouncementPreferences, processAnnouncementBatch } from "./announcements";
import { processTrialReminders } from "./trialReminders";
import { createAdminRoutes } from "./adminRoutes";
import { isPlatformOwner } from "./access";
import { ensureOwnerSchema } from "./ownerSchema";
import { applyPlatformSettings, loadPlatformSettings, publicNotices } from "./platformSettings";
import { meterWorkersAi } from "./aiCost";
import { authenticateToken, bumpAuthVersion, familyState, issueFileToken, issueToken, SUSPENDED_MESSAGE } from "./session";
import { sendEmail, welcomeEmail } from "./email";
import { sendParentVerification, redeemParentVerification, resendParentVerification } from "./emailVerification";
import { handleInbound } from "./inbound";
import type { InboundMessage } from "./inbound";

import type { App, Env, Guards, Vars } from "./types";

const app: App = new Hono<{ Bindings: Env; Variables: Vars }>();
// Owner HQ is same-origin only: no CORS headers for /api/admin/* (its CSRF checks are in adminRoutes.ts).
const corsAll = cors();
app.use("/api/*", (c, next) => (c.req.path.startsWith("/api/admin/") || c.req.path === "/api/admin" ? next() : corsAll(c, next)));
// Sign-in security schema (migration 0058) is ensured at runtime too, so a deploy can never precede it.
app.use("/api/*", async (c, next) => { if (c.env.DB) { await ensureAuthSchema(c.env.DB); await ensureOwnerSchema(c.env.DB); } await next(); });

// Private staging gate. Off unless STAGING_KEY is set (it is never set in production).
// Visit /api/staging-access?key=<STAGING_KEY> once in a browser to receive the access cookie.
const sameText = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
app.use("/api/*", async (c, next) => {
  const key = c.env.STAGING_KEY;
  if (!key) return next();
  // Stripe cannot hold the staging cookie; the webhook authenticates by signature instead.
  if (c.req.path === "/api/billing/webhook") return next();
  if (c.req.path === "/api/staging-access") {
    if (sameText(c.req.query("key") || "", key)) {
      return new Response(null, {
        status: 302,
        headers: { location: "/", "set-cookie": `sq_staging=${encodeURIComponent(key)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000` },
      });
    }
    return c.json({ detail: "Not found" }, 404);
  }
  const cookie = (c.req.header("cookie") || "").split(";").map((x) => x.trim()).find((x) => x.startsWith("sq_staging="));
  if (!cookie || !sameText(decodeURIComponent(cookie.slice(11)), key)) return c.json({ detail: "Private staging site" }, 403);
  return next();
});

const nowIso = () => new Date().toISOString();
// Sign-in must never fail because the state/territory lookup did; a missing value just means the parent is asked again.
const jurisdictionOrNull = (db: D1Database, familyId: string) => getFamilyJurisdiction(db, familyId).catch(() => null);
const newId = () => crypto.randomUUID();

const makeToken = (env: Env, sub: string, role: "parent" | "child", familyId: string) => issueToken(env, sub, role, familyId);
const suspended = async (db: D1Database, familyId: string) => (await familyState(db, familyId)).status === "suspended";
const registrationsClosed = async (db: D1Database) => !(await loadPlatformSettings(db)).features.registrationsOpen;

const requireAuth: MiddlewareHandler<{ Bindings: Env; Variables: Vars }> = async (c, next) => {
  const header = c.req.header("Authorization") || "";
  if (!header.startsWith("Bearer ")) return c.json({ detail: "Not authenticated" }, 401);
  const auth = await authenticateToken(c.env, header.slice(7));
  if (!auth.ok) return c.json({ detail: auth.detail, ...(auth.code ? { code: auth.code } : {}) }, auth.status);
  c.set("user", auth.user);
  await next();
};

const requireParent: MiddlewareHandler<{ Bindings: Env; Variables: Vars }> = async (c, next) => {
  if (c.get("user").role !== "parent") return c.json({ detail: "Parent access required" }, 403);
  await next();
};

const requireChild: MiddlewareHandler<{ Bindings: Env; Variables: Vars }> = async (c, next) => {
  if (c.get("user").role !== "child") return c.json({ detail: "Child access required" }, 403);
  await next();
};

app.get("/api", (c) =>
  c.json({ name: "Side Quest Learning API", runtime: "cloudflare-workers", ok: true })
);
app.get("/api/health", (c) => c.json({ status: "alive" }));
// Announcement and maintenance notices for every visitor (only switched-on notices, plain text).
app.get("/api/platform/notices", async (c) => {
  c.header("Cache-Control", "no-store");
  try { return c.json(await publicNotices(c.env.DB)); } catch { return c.json({ announcement: null, maintenance: null, registrations_open: true }); }
});

app.post("/api/auth/register", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const name = String(b.name || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254 || password.length < 8 || !name) {
    return c.json({ detail: "Valid email, name and a password of 8+ characters are required" }, 400);
  }
  if (!normJurisdiction(b.jurisdiction)) return c.json({ detail: "Please choose your state or territory", code: "JURISDICTION_REQUIRED" }, 400);
  if (await registrationsClosed(c.env.DB)) return c.json({ detail: "New sign-ups are paused for now. Please try again soon.", code: "REGISTRATIONS_CLOSED" }, 503);
  const verificationRequired = c.env.EMAIL_VERIFICATION_REQUIRED === "true";
  if (verificationRequired && !c.env.EMAIL) return c.json({ detail: "Registration is temporarily unavailable while email delivery is being restored." }, 503);
  const exists = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return c.json({ detail: "Email already registered" }, 400);

  const familyId = newId();
  const userId = newId();
  const familyName = String(b.family_name || "").trim() || `${name}'s Family`;
  const ts = nowIso();
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO families (id, name, owner_id, created_at, plan, trial_started_at, trial_ends_at) VALUES (?, ?, ?, ?, 'FREE_PREVIEW', ?, ?)")
      .bind(familyId, familyName, userId, ts, ts, trialEndFrom(ts)),
    c.env.DB.prepare(
      verificationRequired
        ? "INSERT INTO users (id, family_id, email, password_hash, name, is_owner, created_at, email_verification_required_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)"
        : "INSERT INTO users (id, family_id, email, password_hash, name, is_owner, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)"
    ).bind(...(verificationRequired
      ? [userId, familyId, email, await hashSecret(password), name, ts, ts]
      : [userId, familyId, email, await hashSecret(password), name, ts])),
  ]);
  const jurisdiction = normJurisdiction(b.jurisdiction);
  if (jurisdiction) {
    try { await setFamilyJurisdiction(c.env.DB, familyId, jurisdiction); } catch { /* the parent can set it later */ }
  }
  if (verificationRequired) {
    const sent = await sendParentVerification(c.env, userId, email, name);
    // No session token or preview privileges before email ownership is proved.
    return c.json({ verification_required: true, email, email_sent: sent });
  }
  const token = await makeToken(c.env, userId, "parent", familyId);

  // Welcome email: sent in the background, and never blocks or breaks sign up.
  const sending = sendEmail(c.env, welcomeEmail(email, name));
  try { c.executionCtx.waitUntil(sending); } catch { /* no execution context (tests) */ }

  return c.json({
    token,
    user: { id: userId, email, name, family_id: familyId, role: "parent", jurisdiction },
    family: { id: familyId, name: familyName, jurisdiction },
  });
});

app.post("/api/auth/login", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const ip = c.req.header("CF-Connecting-IP") || "";
  if (await loginBlocked(c.env.DB, "parent", email, ip)) return c.json({ detail: "Too many sign-in attempts. Please wait 15 minutes and try again, or reset your password." }, 429);
  const user = await c.env.DB.prepare(
    "SELECT id, family_id, email, name, password_hash FROM users WHERE email = ?"
  ).bind(email).first<any>();
  if (!user || !(await verifySecret(password, user.password_hash))) {
    await recordLoginFailure(c.env.DB, "parent", email, ip);
    return c.json({ detail: "Invalid email or password" }, 401);
  }
  await clearLoginFailures(c.env.DB, "parent", email);
  {
    // All marked accounts require proof, even if new registrations are ungated.
    // During migration rollout, the old schema must still permit legacy login.
    let verification: { email_verified_at: string | null; email_verification_required_at: string | null } | null = null;
    try {
      verification = await c.env.DB.prepare(
        "SELECT email_verified_at, email_verification_required_at FROM users WHERE id = ?"
      ).bind(user.id).first<{email_verified_at: string | null; email_verification_required_at: string | null}>();
    } catch (error) {
      const missingColumn = /no such column: email_verification_required_at/i.test(String(error));
      if (!missingColumn || c.env.EMAIL_VERIFICATION_REQUIRED === "true") {
        return c.json({ detail: "Email verification is temporarily unavailable. Please try again.", code: "VERIFICATION_UNAVAILABLE" }, 503);
      }
      // New gated users cannot predate migration 0069; old sign-ins remain safe.
    }
    if (verification?.email_verification_required_at && !verification.email_verified_at) {
      return c.json({ detail: "Please confirm your email before signing in.", code: "EMAIL_VERIFICATION_REQUIRED" }, 403);
    }
  }
  if (await suspended(c.env.DB, user.family_id)) return c.json({ detail: SUSPENDED_MESSAGE, code: "ACCOUNT_SUSPENDED" }, 403);
  const token = await makeToken(c.env, user.id, "parent", user.family_id);
  const { password_hash, ...safe } = user;
  const jurisdiction = await jurisdictionOrNull(c.env.DB, user.family_id);
  // /auth/me already exposes this navigation hint; a fresh sign-in must too,
  // otherwise Owner HQ stays hidden until the page is manually refreshed.
  const owner = await isPlatformOwner(c.env.DB, user.id);
  return c.json({ token, user: { ...safe, role: "parent", jurisdiction, ...(owner ? { is_platform_owner: true } : {}) } });
});

// Proof comes from a one-time token sent only to the address, not the browser.
app.post("/api/auth/verify-email", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const valid = await redeemParentVerification(c.env, String(b.token || ""));
  if (!valid) return c.json({ detail: "This confirmation link has expired or has already been used." }, 400);
  return c.json({ ok: true });
});

// Pending families cannot log in, so resend is public and throttled.
app.post("/api/auth/verify-email/resend", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return c.json({ detail: "Enter a valid email address." }, 400);
  }
  return c.json(await resendParentVerification(c.env, email, c.req.header("CF-Connecting-IP") || ""));
});

app.post("/api/auth/child-login", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const username = String(b.username || "").trim().toLowerCase();
  const pin = String(b.pin || "");
  const ip = c.req.header("CF-Connecting-IP") || "";
  if (await loginBlocked(c.env.DB, "child", username, ip)) return c.json({ detail: "Too many sign-in attempts. Please ask a parent to help, or wait and try again later." }, 429);
  const s = await c.env.DB.prepare("SELECT * FROM students WHERE username = ?").bind(username).first<any>();
  if (!s || !(await verifySecret(pin, s.pin_hash))) {
    await recordLoginFailure(c.env.DB, "child", username, ip);
    return c.json({ detail: "Invalid username or PIN" }, 401);
  }
  await clearLoginFailures(c.env.DB, "child", username);
  if (await suspended(c.env.DB, s.family_id)) return c.json({ detail: SUSPENDED_MESSAGE, code: "ACCOUNT_SUSPENDED" }, 403);
  const token = await makeToken(c.env, s.id, "child", s.family_id);
  // Parent-only fields stay out of the child's session (notes are the parent's private notes about the child).
  const { pin_hash, pin_enc, notes: _notes, ...safe } = s;
  // Offline sign-in on the child's device is a Family Membership feature.
  const offlineAllowed = await getEntitlement(c.env.DB, s.family_id).then((e) => e.limits.offlineLessons).catch(() => false);
  return c.json({ token, offline_allowed: offlineAllowed, student: { ...safe, interests: JSON.parse(s.interests || "[]"), role: "child" } });
});

app.get("/api/auth/me", requireAuth, async (c) => {
  const u = c.get("user");
  // is_platform_owner only decides whether the Owner HQ link is shown; every /api/admin call re-checks the role.
  const owner = u.role === "parent" && (await isPlatformOwner(c.env.DB, u.id));
  // Lets account screens ask for the right proof (password, or a fresh Google sign-in).
  const hasPassword = u.role === "parent"
    ? !!(await c.env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(u.id).first<{ password_hash: string | null }>())?.password_hash
    : undefined;
  return c.json({ ...u, jurisdiction: await jurisdictionOrNull(c.env.DB, u.family_id), file_token: await issueFileToken(c.env, u), ...(hasPassword === undefined ? {} : { has_password: hasPassword }), ...(owner ? { is_platform_owner: true } : {}) });
});


app.get("/api/students", requireAuth, requireParent, async (c) => {
  const { results } = await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE family_id = ?`)
    .bind(c.get("user").family_id).all<any>();
  return c.json(results.map((r) => studentOut(r, true)));
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
  const allowed = await checkCanAddChild(c.env.DB, c.get("user").family_id);
  if (!allowed.ok) return c.json({ detail: allowed.detail, code: allowed.code }, allowed.status as any);

  const theme = b.theme || (stage === "ES1" ? "early" : ["S1", "S2", "S3"].includes(stage) ? "primary" : ["S4", "S5"].includes(stage) ? "secondary" : "senior");
  const id = newId();
  const interests = JSON.stringify(Array.isArray(b.interests) ? b.interests : []);
  await c.env.DB.prepare(
    "INSERT INTO students (id, family_id, name, username, pin_hash, birth_year, stage, year_level, theme, interests, notes, created_at, extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, c.get("user").family_id, name, username, await hashSecret(pin), b.birth_year ?? null, stage, b.year_level ?? null, theme, interests, b.notes ?? null, nowIso(), JSON.stringify(studentExtraFromBody(b, stage))).run();
  const created = await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE id = ?`).bind(id).first<any>();
  return c.json(studentOut(created, true));
});

// Membership write restrictions run before every module route, including direct API calls.
registerMembershipAccess(app);
registerCore(app, requireAuth, requireParent);
const guards: Guards = { auth: requireAuth, parent: requireParent, child: requireChild };
registerFamily(app, guards);
registerLearning(app, guards);
registerPets(app, guards);
registerWords(app, guards);
registerAccount(app, guards);
registerPasswordReset(app);
registerStudentCredentials(app, guards);
registerHelpRequests(app, guards);
registerBilling(app, guards);
registerOutcomes(app, guards);
registerAutoQuest(app, guards);
registerTimetable(app, guards);
registerHomeschoolCompass(app, guards);
registerSiteSearch(app, guards);
registerFeedback(app, guards);
registerAnnouncementPreferences(app, guards);
app.route("/api/admin", createAdminRoutes());

// Unhandled errors: record the method, route pattern and error class only (no ids, bodies or messages).
app.onError(async (err, c) => {
  console.error("unhandled", c.req.method, c.req.routePath, err instanceof Error ? err.name : "error");
  try {
    await c.env.DB.prepare("INSERT INTO app_errors (id, method, route, status, error_name, created_at) VALUES (?, ?, ?, 500, ?, ?)")
      .bind(newId(), c.req.method, String(c.req.routePath || "unknown").slice(0, 200), (err instanceof Error ? err.name : "Error").slice(0, 60), nowIso()).run();
  } catch { /* never let error logging fail the response */ }
  return c.json({ detail: "Something went wrong. Please try again." }, 500);
});

app.notFound((c) => c.json({ detail: "Not found" }, 404));

export default {
  // Feature switches and the platform AI limit are applied to the bindings before any route runs (platformSettings.ts).
  fetch: async (req: Request, env: Env, ctx: ExecutionContext) => {
    if (!new URL(req.url).pathname.startsWith("/api/") || !env.DB) return app.fetch(req, env, ctx);
    // Still metered (which also removes Side-Quest's call tags before Workers AI sees them).
    try { await ensureOwnerSchema(env.DB); } catch { return app.fetch(req, meterWorkersAi(env, ctx), ctx); }
    return app.fetch(req, meterWorkersAi(await applyPlatformSettings(env), ctx), ctx);
  },
  scheduled: async (_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) => {
    // The two independent mail queues must not prevent each other running.
    try { await processAnnouncementBatch(env); } catch (e) { console.error("announcement cron failed", e); }
    try { await processTrialReminders(env); } catch (e) { console.error("trial reminder cron failed", e); }
    try { await reconcileSubscriptions(env.DB, env); } catch (e) { console.error("billing reconcile cron failed", e); }
  },
  email: (message: InboundMessage, env: Env) => handleInbound(message, env),
};
