import {registerFamilySquareInvoices} from "./unifiedPortalSquareInvoices";
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
import { registerPasswordReset,sendPasswordSetup } from "./passwordReset";
import {unifiedPortalPilot,verifiedPortalIdentity} from "./unifiedPortalIdentity";
import {registerUnifiedLegacy} from "./unifiedPortalLegacy";
import {registerPortalLearners} from "./unifiedPortalLearners";
import {registerPortalIntake} from "./unifiedPortalIntake";
import {registerFamilyOverview} from "./unifiedPortalOverview";
import {authEmailOrigin} from "./authEmailOrigin";
import { registerStudentCredentials } from "./studentCredentials";
import { registerHelpRequests } from "./helpRequests";
import { registerBilling, reconcileSubscriptions } from "./billing";
import { registerSquare } from "./square";
import { registerOutcomes } from "./outcomeTracker";
import { registerPriorLearning } from "./priorLearning";
import { registerStartingChecks } from "./startingCheck";
import { registerInternationalGoals } from "./internationalGoals";
import { registerAutoQuest } from "./autoQuest";
import { registerTimetable } from "./timetable";
import { registerHomeschoolCompass } from "./homeschoolCompass";
import { registerSiteSearch } from "./siteSearch";
import { registerHandwritingBook } from "./handwritingBook";
import { registerViewAs, viewAsState } from "./viewAs";
import { registerHandsOnVault } from "./handsOnVault";
import { registerMembershipAccess } from "./membershipAccess";
import { registerFeedback } from "./feedback";
import { registerGuestSupport } from "./guestSupport";
import { registerPublicAvailability } from "./supportPublicAvailability";
import {cleanupVideo} from "./supportVideo";
import {cleanupEnglishVideo} from "./englishClubVideo";
import {runDailyBriefing} from "./supportBriefing";
import { registerAnnouncementPreferences, processAnnouncementBatch } from "./announcements";
import { processTrialReminders } from "./trialReminders";
import { processPaymentNotices } from "./paymentNotices";
import {processSupportInvoiceNotices} from "./supportPaymentSafety";
import { runNextBackgroundBatch } from "./lessonBatches";
import { fastLessonPipelineEnabled, splitLessonStagesEnabled } from "./aiPipeline";
import { createAdminRoutes } from "./adminRoutes";
import { isPlatformOwner } from "./access";
import { ensureOwnerSchema } from "./ownerSchema";
import { applyPlatformSettings, loadPlatformSettings, publicNotices, aiRequestsLast24h } from "./platformSettings";
import { meterWorkersAi } from "./aiCost";
import { normaliseRetiredTextOverrides } from "./aiModelCompatibility";
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
  if (!key) return c.env.STAGING_PRIVATE === "true" ? c.json({ detail: "Private staging is not configured" }, 503) : next();
  // Payment providers cannot hold a staging cookie; their webhooks authenticate by signature.
  if (c.req.path === "/api/billing/webhook") return next();
  // Only a Square SANDBOX callback for our isolated staging Worker can bypass the cookie.
  // The actual Square endpoint still verifies its HMAC signature before processing anything.
  // Never allow live Square credentials or callbacks on another hostname to bypass staging.
  const sandboxCallback = c.req.path === "/api/billing/square-webhook"
    && /^sandbox-sq0idb-/.test(String(c.env.SQUARE_APPLICATION_ID || ""))
    && !!c.env.SQUARE_ACCESS_TOKEN && !!c.env.SQUARE_WEBHOOK_SIGNATURE_KEY
    && c.env.SQUARE_WEBHOOK_URL === c.req.url
    && /^https:\/\/side-quest-staging\.[^.]+\.workers\.dev\/api\/billing\/square-webhook$/.test(c.req.url);
  if (sandboxCallback) return next();
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
  let supplied = "";try { if(cookie) supplied=decodeURIComponent(cookie.slice(11)); } catch { /* malformed cookie remains unauthorized */ }
  if (!cookie || !sameText(supplied, key)) return c.json({ detail: "Private staging site" }, 403);
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

// Private pilot only. Account credentials and family IDs are shared with homeschool sign-in.
app.post("/api/auth/support-register",async c=>{
  if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);
  const b=await c.req.json().catch(()=>({}));
  const email=typeof b.email==="string"?b.email.trim().toLowerCase():"",name=typeof b.name==="string"?b.name.trim():"";
  const jurisdiction=normJurisdiction(b.jurisdiction);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)||email.length>254||!name||name.length>100||!jurisdiction)return c.json({detail:"Enter your name, valid email and state or territory."},400);
  // One expressly configured synthetic mailbox only; no arbitrary recipient email from this pilot.
  const allowed=String(c.env.SUPPORT_UNIFIED_TEST_EMAIL||"").trim().toLowerCase();
  if(!allowed||!c.env.EMAIL||!authEmailOrigin(c.env))return c.json({detail:"Account setup is not configured in staging."},503);
  if(email!==allowed)return c.json({detail:"Only the authorised test mailbox can register during the private pilot."},403);
  if(await registrationsClosed(c.env.DB))return c.json({detail:"New sign-ups are paused."},503);
  const key="support-register:"+email,ip="support-register-ip:"+(c.req.header("CF-Connecting-IP")||"local");
  if(await loginBlocked(c.env.DB,"parent",key,"")||await loginBlocked(c.env.DB,"parent",ip,""))return c.json({detail:"Too many requests. Try again later."},429);
  await recordLoginFailure(c.env.DB,"parent",key,"");await recordLoginFailure(c.env.DB,"parent",ip,"");
  const reply={ok:true,message:"If this address is new, check your email to set your password. If you already have a Side-Quest account, sign in or use Forgot password."};
  if(await c.env.DB.prepare("SELECT id FROM users WHERE lower(email)=?").bind(email).first())return c.json(reply);
  const familyId=newId(),userId=newId(),ts=nowIso();
  try{
    await c.env.DB.batch([
      c.env.DB.prepare("INSERT INTO families(id,name,owner_id,created_at,plan,trial_started_at,trial_ends_at) VALUES(?,?,?,?,'PREVIEW_EXPIRED',NULL,NULL)").bind(familyId,name+"'s Family",userId,ts),
      c.env.DB.prepare("INSERT INTO users(id,family_id,email,password_hash,name,is_owner,created_at,email_verification_required_at) VALUES(?,?,?,NULL,?,1,?,?)").bind(userId,familyId,email,name,ts,ts),
      c.env.DB.prepare("INSERT INTO support_account_intents(family_id,registration_intent,created_at) VALUES(?,'support_only',?)").bind(familyId,ts),
    ]);
  }catch(e){
    if(await c.env.DB.prepare("SELECT id FROM users WHERE lower(email)=?").bind(email).first())return c.json(reply);
    throw e;
  }
  await setFamilyJurisdiction(c.env.DB,familyId,jurisdiction);
  // No credential or session exists until the inbox owner redeems the existing password reset flow.
  await sendPasswordSetup(c.env,{id:userId,name,email},true);
  return c.json(reply);
});
app.get("/api/family-portal/status",c=>{
  c.header("Cache-Control","no-store");
  return c.json({available:unifiedPortalPilot(c.env),registration_available:unifiedPortalPilot(c.env)&&!!c.env.EMAIL&&!!authEmailOrigin(c.env)&&!!String(c.env.SUPPORT_UNIFIED_TEST_EMAIL||"").trim()});
});
app.get("/api/family-portal/identity",requireAuth,requireParent,async c=>{
  c.header("Cache-Control","no-store");
  if(!unifiedPortalPilot(c.env))return c.json({detail:"Not found"},404);
  const identity=await verifiedPortalIdentity(c.env.DB,c.get("user"));
  if(!identity)return c.json({detail:"Verify your email using account recovery before accessing the family portal.",code:"PORTAL_VERIFICATION_REQUIRED"},403);
  return c.json(identity);
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
  const identity=unifiedPortalPilot(c.env)?await verifiedPortalIdentity(c.env.DB,{id:user.id,family_id:user.family_id,role:"parent",name:user.name}):null;
  return c.json({ token, user: { ...safe, role: "parent", jurisdiction, ...(identity?.registration_intent==="support_only"?{family_portal_default:true}:{}), ...(owner ? { is_platform_owner: true } : {}) } });
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
  return c.json({ ...u, jurisdiction: await jurisdictionOrNull(c.env.DB, u.family_id), file_token: await issueFileToken(c.env, u), ...(hasPassword === undefined ? {} : { has_password: hasPassword }), ...(owner ? { is_platform_owner: true, view_as: await viewAsState(c.env.DB, u.family_id) } : {}) });
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
registerSquare(app);
registerOutcomes(app, guards);
registerPriorLearning(app, guards);
registerStartingChecks(app, guards);
registerInternationalGoals(app, guards);
registerAutoQuest(app, guards);
registerTimetable(app, guards);
registerHomeschoolCompass(app, guards);
registerSiteSearch(app, guards);
registerHandwritingBook(app, guards);
registerViewAs(app, guards);
registerHandsOnVault(app, guards);
registerFeedback(app, guards);
registerGuestSupport(app);
registerUnifiedLegacy(app,guards);
registerPortalLearners(app,guards);
registerPortalIntake(app,guards);
registerFamilyOverview(app,guards);
registerFamilySquareInvoices(app,guards);
registerPublicAvailability(app);
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
    env = normaliseRetiredTextOverrides(env);
    if (!new URL(req.url).pathname.startsWith("/api/") || !env.DB) return app.fetch(req, env, ctx);
    try { await ensureOwnerSchema(env.DB); } catch { return app.fetch(req, env, ctx); }
    return app.fetch(req, meterWorkersAi(await applyPlatformSettings(env), ctx), ctx);
  },
  scheduled: async (event: ScheduledEvent, env: Env, _ctx: ExecutionContext) => {
    env = normaliseRetiredTextOverrides(env);
    if (event.cron !== "*/5 * * * *") return;
    // Preserve the five-minute cadence of every existing maintenance task.
    try { await processAnnouncementBatch(env); } catch (e) { console.error("announcement cron failed", e); }
    try { await processTrialReminders(env); } catch (e) { console.error("trial reminder cron failed", e); }
    try { await reconcileSubscriptions(env.DB, env); } catch (e) { console.error("billing reconcile cron failed", e); }
    // After reconciling, so notices use each family's latest plan.
    try { await processPaymentNotices(env); } catch (e) { console.error("payment notice cron failed", e); }
    try { await processSupportInvoiceNotices(env); } catch { console.error("Learning Support payment notices need review"); }
    try { await cleanupVideo(env); } catch { console.error("video cleanup needs review"); }
    try { await cleanupEnglishVideo(env); } catch { console.error("English Club video cleanup needs review"); }
    try { await runDailyBriefing(env); } catch { console.error("daily owner briefing needs review"); }
    // Disabled until a separate staging trial. Recheck the platform cap before every scheduled attempt.
    if(env.AI_BACKGROUND_BATCHES === "true" && env.AI) {
      try {
        await ensureOwnerSchema(env.DB);
        const settings=await loadPlatformSettings(env.DB);
        if(!settings.features.aiEnabled || settings.maintenance.enabled || await aiRequestsLast24h(env.DB)>=settings.costSafeguards.aiDailyPlatformCap)return;
        const metered=meterWorkersAi(env,_ctx);
        if(metered.AI) await runNextBackgroundBatch(metered.DB,metered.AI,{model:metered.AI_MODEL,gatewayId:metered.AI_GATEWAY_ID,compact:metered.AI_COMPACT_GENERATION==="true",fastPipeline:fastLessonPipelineEnabled(metered),splitStages:splitLessonStagesEnabled(metered)});
      }catch(e){console.error("background batch tick failed",e instanceof Error?e.name:"error");}
    }
  },
  email: (message: InboundMessage, env: Env) => handleInbound(message, env),
};
