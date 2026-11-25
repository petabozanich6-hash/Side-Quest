/**
 * Owner HQ: owner-only administration API (/api/admin/*).
 *
 * Layers, in order, on every request:
 *  1. Identity + role: a valid, current parent token whose account holds an active owner role, re-read from D1 on
 *     every request. Anyone else (signed out, children, ordinary parents, suspended) gets 404, as if the area did
 *     not exist.
 *  2. CSRF: changes need an allow-listed Origin that matches this site, a same-origin fetch, and the
 *     X-SideQuest-Admin header (which a cross-site form cannot send).
 *  3. Rate limits per user (D1, shared by every Worker instance).
 *  4. Passkey step-up (15 minutes, this sign-in only) for everything except the step-up itself.
 *  5. Per-route permission checks, input validation and an audit record for every change.
 *
 * There is deliberately no endpoint that grants or changes roles.
 */
import { Hono, type Context, type Next } from "hono";
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from "@simplewebauthn/server";
import { activeRoles, permissionsFor, type Permission, type Role } from "./access";
import { hitRateLimit, recordSecurityEvent, writeAudit } from "./adminAudit";
import { customerDetail, customerSummary, familyHasAdmin, FAMILY_ID, overview, searchCustomers } from "./adminData";
import { verifySecret } from "./auth";
import type { Plan } from "./entitlements";
import {
  authenticationOptions, elevatedUntil, endStepUp, listCredentials, registrationOptions, STEP_UP_MINUTES,
  verifyAuthentication, verifyRegistration, type RelyingParty,
} from "./passkeys";
import {
  defaultSettings, highImpactReasons, isSettingKey, LIMITS, loadPlatformSettings, saveSetting, SETTING_KEYS, validateSetting,
} from "./platformSettings";
import { authenticateToken, bumpAuthVersion } from "./session";
import type { AuthUser, Env } from "./types";
import { nowIso } from "./types";
import { billingConfig } from "./billing";
import { giftPreviewDays } from "./previewGifts";
import { registerDocumentStudio } from "./documentStudioRoutes";
import { ensureFeedbackSchema, FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from "./feedback";
import { ensureQuoteSchema, supportThread, listSupportQuotes, validateQuote } from "./learningSupportQuotes";
import { ensureGuestSchema, guestQuotes, guestMessages, guestNotify, guestOrigin } from "./guestSupport";
import { listOrders,getOrder,hasOrder,createServiceOrder,cancelUnstartedOrder,completeOrder,recordManualInvoice,verifyManualInvoice,cancelManualInvoiceOrder } from "./supportOrders";
import { sendEmail, SITE_URL, layout, p, button } from "./email";
import { classroomEnabled,classroomState,setClassroomOpen,editClassroom,canReadClassroomImage } from "./supportClassrooms";
import {prepareVideo,videoToken,closeVideo,videoEnabled} from "./supportVideo";
import {findDecks,getDeck,saveDeck,archiveDeck,draftDeck} from "./supportDecks";
import {planSnapshot,issueQuoteWithPlan,readQuotePlan,draftQuotePlan} from "./supportQuotePlans";
import {buildContinuity,emailContinuity} from "./supportContinuity";
import {uploadResource,listResources,archiveResource,downloadResource,grantResource,revokeResource,grantedResources,readPresentedImage} from "./supportFiles";
import { ensureOrderSchema } from "./supportOrders";
import {readDiary,saveDiary,createBusyBlock} from "./supportDiary";
import {offerSlots,readSlots,removeSlots} from "./supportSlots";
import { ensureAnnouncementSchema, audienceCount, validateAnnouncement, queueAnnouncement, listAnnouncements, cancelAnnouncement } from "./announcements";

type AdminVars = { user: AuthUser; sessionId: string | null; roles: Role[] };
type AdminContext = Context<{ Bindings: Env; Variables: AdminVars }>;

export const ADMIN_HEADER = "X-SideQuest-Admin";
const PRODUCTION_ORIGINS = ["https://sidequestlearning.app", "https://www.sidequestlearning.app"];
const PLANS: Plan[] = ["FREE_PREVIEW", "PREVIEW_EXPIRED", "ACTIVE_WEEKLY", "ACTIVE_FORTNIGHTLY", "ACTIVE_MONTHLY", "ACTIVE_ANNUAL", "PAST_DUE", "CANCELLED", "INTERNAL"];

const notFound = (c: Context) => c.json({ detail: "Not found" }, 404);

/**
 * An Origin may perform admin changes only if it is this site's own origin AND on the allow-list: the production
 * domains, extra origins in ADMIN_ORIGINS (comma-separated, e.g. the staging workers.dev URL), or a local development
 * address when the request itself is local.
 */
export function allowedOrigin(origin: string, requestUrl: string, env: Pick<Env, "ADMIN_ORIGINS">): boolean {
  if (!origin) return false;
  let req: URL;
  try { req = new URL(requestUrl); } catch { return false; }
  if (origin !== req.origin) return false;
  if (PRODUCTION_ORIGINS.includes(origin)) return true;
  const extra = (env.ADMIN_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (extra.includes(origin)) return true;
  return req.protocol === "http:" && (req.hostname === "localhost" || req.hostname === "127.0.0.1");
}

const isMutation = (method: string) => !["GET", "HEAD", "OPTIONS"].includes(method);

export function createAdminRoutes() {
  const admin = new Hono<{ Bindings: Env; Variables: AdminVars }>();

  // ------------------------------------------------------- 1. identity + role
  admin.use("*", async (c, next) => {
    const header = c.req.header("Authorization") || "";
    if (!header.startsWith("Bearer ")) return notFound(c);
    const auth = await authenticateToken(c.env, header.slice(7));
    if (!auth.ok || auth.user.role !== "parent") return notFound(c);
    const roles = await activeRoles(c.env.DB, auth.user.id).catch(() => [] as Role[]);
    if (!permissionsFor(roles).has("admin.access")) return notFound(c);
    c.set("user", auth.user);
    c.set("sessionId", auth.sessionId);
    c.set("roles", roles);
    c.header("Cache-Control", "no-store");
    await next();
  });

  // ------------------------------------------------------------------ 2. CSRF
  admin.use("*", async (c, next) => {
    if (!isMutation(c.req.method)) return next();
    const fetchSite = c.req.header("Sec-Fetch-Site");
    if (!allowedOrigin(c.req.header("Origin") ?? "", c.req.url, c.env) || c.req.header(ADMIN_HEADER) !== "1" || (fetchSite !== undefined && fetchSite !== "same-origin")) {
      return c.json({ detail: "Request blocked" }, 403);
    }
    return next();
  });

  // ----------------------------------------------------------- 3. rate limits
  admin.use("*", async (c, next) => {
    const write = isMutation(c.req.method);
    const limit = await hitRateLimit(c.env.DB, `admin:${write ? "w" : "r"}:${c.get("user").id}`, write ? 30 : 300, 300);
    if (!limit.ok) {
      c.header("Retry-After", String(limit.retryAfter));
      return c.json({ detail: "Too many requests. Please slow down for a moment." }, 429);
    }
    return next();
  });

  // ------------------------------------------- sign-in session for step-up
  // Tokens issued before Owner HQ have no session id; the Owner just signs in again.
  admin.use("*", async (c, next) => {
    if (!c.get("sessionId")) return c.json({ detail: "Please sign out and sign in again to open Owner HQ.", code: "fresh_sign_in_required" }, 401);
    return next();
  });

  // --------------------------------------------------------------- helpers
  const sid = (c: AdminContext) => c.get("sessionId") as string;
  const actor = (c: AdminContext) => ({ actorUserId: c.get("user").id, actorLabel: `owner:${c.get("user").id}` });
  const relyingParty = (c: AdminContext): RelyingParty | null => {
    const origin = c.req.header("Origin") ?? "";
    return allowedOrigin(origin, c.req.url, c.env) ? { origin, rpID: new URL(origin).hostname } : null;
  };
  const readJson = async (c: AdminContext): Promise<Record<string, unknown>> => {
    const body = (await c.req.json().catch(() => null)) as unknown;
    return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  };
  const reasonFrom = (b: Record<string, unknown>) => {
    const r = typeof b.reason === "string" ? b.reason.trim() : "";
    return r.length >= 5 && r.length <= 500 && !/[<>]/.test(r) ? r : null;
  };
  const requirePermission = (p: Permission) => async (c: AdminContext, next: Next) => {
    if (!permissionsFor(c.get("roles")).has(p)) return c.json({ detail: "Not permitted" }, 403);
    return next();
  };
  const stepUpPaths = (path: string) =>
    path === "/api/admin/me" || path === "/api/admin/security/status" || path.startsWith("/api/admin/security/passkeys/register/") || path.startsWith("/api/admin/security/step-up/");

  // ---------------------------------------------------- security: step-up
  admin.get("/me", async (c) => {
    const user = c.get("user");
    const until = await elevatedUntil(c.env.DB, user.id, sid(c));
    return c.json({ user_id: user.id, name: user.name, roles: c.get("roles"), elevated: !!until, elevated_until: until });
  });

  admin.get("/security/status", async (c) => {
    const user = c.get("user");
    const [passkeys, until] = await Promise.all([listCredentials(c.env.DB, user.id), elevatedUntil(c.env.DB, user.id, sid(c))]);
    return c.json({ passkey_count: passkeys.length, elevated: !!until, elevated_until: until, step_up_minutes: STEP_UP_MINUTES });
  });

  admin.post("/security/passkeys/register/options", async (c) => {
    const user = c.get("user");
    const rp = relyingParty(c);
    if (!rp) return c.json({ detail: "Request blocked" }, 403);
    const existing = await listCredentials(c.env.DB, user.id);
    if (existing.length === 0) {
      // First passkey: prove the password again, so a stolen token alone cannot attach an attacker's authenticator.
      const limit = await hitRateLimit(c.env.DB, `admin:reauth:${user.id}`, 5, 900);
      if (!limit.ok) return c.json({ detail: "Too many attempts. Please wait 15 minutes." }, 429);
      const body = await readJson(c);
      const row = await c.env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(user.id).first<{ password_hash: string | null }>();
      if (!row?.password_hash) return c.json({ detail: "This account signs in with Google and has no password to confirm. Set a password first (Forgot password), then add a passkey.", code: "password_required" }, 409);
      if (typeof body.password !== "string" || !(await verifySecret(body.password, row.password_hash))) {
        await recordSecurityEvent(c.env.DB, user.family_id, user.id, "reauth_failed", "passkey enrolment");
        return c.json({ detail: "That password is not right." }, 401);
      }
    } else if (!(await elevatedUntil(c.env.DB, user.id, sid(c)))) {
      return c.json({ detail: "Confirm it's you with an existing passkey first.", code: "step_up_required" }, 401);
    }
    const email = (await c.env.DB.prepare("SELECT email FROM users WHERE id = ?").bind(user.id).first<{ email: string }>())?.email ?? user.id;
    const options = await registrationOptions(c.env.DB, rp, { id: user.id, email, name: user.name }, sid(c));
    return c.json({ options });
  });

  admin.post("/security/passkeys/register/verify", async (c) => {
    const user = c.get("user");
    const rp = relyingParty(c);
    if (!rp) return c.json({ detail: "Request blocked" }, 403);
    const body = await readJson(c);
    if (typeof body.response !== "object" || body.response === null) return c.json({ detail: "Passkey response is required" }, 400);
    const label = typeof body.label === "string" && body.label.trim() && !/[<>]/.test(body.label) ? body.label.trim().slice(0, 60) : "Passkey";
    const result = await verifyRegistration(c.env.DB, rp, user.id, sid(c), body.response as RegistrationResponseJSON, label);
    if (!result.ok) return c.json({ detail: result.error }, 400);
    await recordSecurityEvent(c.env.DB, user.family_id, user.id, "passkey_registered", label);
    await writeAudit(c.env.DB, { ...actor(c), action: "passkey.register", targetType: "user", targetId: user.id, detail: { label } });
    return c.json({ ok: true }, 201);
  });

  admin.post("/security/step-up/options", async (c) => {
    const rp = relyingParty(c);
    if (!rp) return c.json({ detail: "Request blocked" }, 403);
    const options = await authenticationOptions(c.env.DB, rp, c.get("user").id, sid(c));
    if (!options) return c.json({ detail: "Add a passkey first.", code: "passkey_required" }, 409);
    return c.json({ options });
  });

  admin.post("/security/step-up/verify", async (c) => {
    const user = c.get("user");
    const rp = relyingParty(c);
    if (!rp) return c.json({ detail: "Request blocked" }, 403);
    const limit = await hitRateLimit(c.env.DB, `admin:stepup:${user.id}`, 10, 900);
    if (!limit.ok) return c.json({ detail: "Too many attempts. Please wait 15 minutes." }, 429);
    const body = await readJson(c);
    if (typeof body.response !== "object" || body.response === null) return c.json({ detail: "Passkey response is required" }, 400);
    const result = await verifyAuthentication(c.env.DB, rp, user.id, sid(c), body.response as AuthenticationResponseJSON);
    if (!result.ok) {
      await recordSecurityEvent(c.env.DB, user.family_id, user.id, "step_up_failed");
      return c.json({ detail: result.error }, 401);
    }
    await recordSecurityEvent(c.env.DB, user.family_id, user.id, "step_up_success");
    return c.json({ elevated_until: result.elevatedUntil });
  });

  admin.post("/security/step-up/end", async (c) => {
    await endStepUp(c.env.DB, c.get("user").id, sid(c));
    return c.json({ ok: true });
  });

  // ------------------------------------- 4. everything below needs a step-up
  admin.use("*", async (c, next) => {
    if (stepUpPaths(c.req.path)) return next();
    if (!(await elevatedUntil(c.env.DB, c.get("user").id, sid(c)))) {
      return c.json({ detail: "Confirm it's you with your passkey.", code: "step_up_required" }, 401);
    }
    return next();
  });

  admin.get("/security/passkeys", async (c) => {
    const passkeys = await listCredentials(c.env.DB, c.get("user").id);
    return c.json({ passkeys: passkeys.map((p) => ({ id: p.id, label: p.label, created_at: p.createdAt, last_used_at: p.lastUsedAt })) });
  });

  admin.delete("/security/passkeys/:id", async (c) => {
    const user = c.get("user");
    const id = (c.req.param("id")??"");
    const passkeys = await listCredentials(c.env.DB, user.id);
    if (!passkeys.some((p) => p.id === id)) return c.json({ detail: "Passkey not found" }, 404);
    if (passkeys.length < 2) return c.json({ detail: "Add another passkey before removing your last one." }, 409);
    await c.env.DB.prepare("DELETE FROM webauthn_credentials WHERE id = ? AND user_id = ?").bind(id, user.id).run();
    await recordSecurityEvent(c.env.DB, user.family_id, user.id, "passkey_removed");
    await writeAudit(c.env.DB, { ...actor(c), action: "passkey.remove", targetType: "user", targetId: user.id });
    return c.json({ ok: true });
  });

  // ---------------------------------------------------------------- overview
  admin.get("/overview", requirePermission("metrics.read"), async (c) => {
    const settings = await loadPlatformSettings(c.env.DB, { fresh: true });
    return c.json(await overview(c.env, settings));
  });

  // --------------------------------------------------------------- customers
  admin.get("/customers", requirePermission("customers.read"), async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    if (q.length > 254) return c.json({ detail: "Search is too long" }, 400);
    const status = c.req.query("status") || undefined;
    if (status && status !== "active" && status !== "suspended") return c.json({ detail: "Invalid status" }, 400);
    const plan = c.req.query("plan") || undefined;
    if (plan && !PLANS.includes(plan as Plan)) return c.json({ detail: "Invalid plan" }, 400);
    const page = Number(c.req.query("page") ?? "1");
    if (!Number.isInteger(page) || page < 1 || page > 10000) return c.json({ detail: "Invalid page" }, 400);
    return c.json(await searchCustomers(c.env.DB, { q: q || undefined, status: status as "active" | "suspended" | undefined, plan: plan as Plan | undefined, page }));
  });

  admin.get("/customers/:id", requirePermission("customers.read"), async (c) => {
    const detail = await customerDetail(c.env.DB, c.req.param("id") ?? "");
    return detail ? c.json(detail) : c.json({ detail: "Customer not found" }, 404);
  });

  /** Loads the target family and refuses to act on any family that contains an administrator (incl. the Owner's own). */
  const loadTarget = async (c: AdminContext) => {
    const id = c.req.param("id") ?? "";
    if (!FAMILY_ID.test(id)) return { error: c.json({ detail: "Customer not found" }, 404) };
    const target = await customerSummary(c.env.DB, id);
    if (!target) return { error: c.json({ detail: "Customer not found" }, 404) };
    if (target.id === c.get("user").family_id || (await familyHasAdmin(c.env.DB, target.id))) {
      return { error: c.json({ detail: "Administrator accounts cannot be changed here." }, 409) };
    }
    return { target };
  };

  admin.post("/customers/:id/suspend", requirePermission("customers.suspend"), async (c) => {
    const { target, error } = await loadTarget(c);
    if (error) return error;
    const body = await readJson(c);
    if (body.confirm !== "SUSPEND") return c.json({ detail: "Type SUSPEND to confirm." }, 400);
    const reason = reasonFrom(body);
    if (!reason) return c.json({ detail: "Give a reason (5 to 500 characters)." }, 400);
    if (target!.status === "suspended") return c.json({ detail: "This family is already suspended." }, 409);
    const ts = nowIso();
    await c.env.DB.prepare(
      `INSERT INTO family_admin_state (family_id, status, suspended_at, suspended_reason, updated_at) VALUES (?, 'suspended', ?, ?, ?)
       ON CONFLICT(family_id) DO UPDATE SET status = 'suspended', suspended_at = excluded.suspended_at, suspended_reason = excluded.suspended_reason, updated_at = excluded.updated_at`,
    ).bind(target!.id, ts, reason, ts).run();
    const version = await bumpAuthVersion(c.env.DB, target!.id);
    await recordSecurityEvent(c.env.DB, target!.id, null, "family_suspended");
    await writeAudit(c.env.DB, { ...actor(c), action: "customer.suspend", targetType: "family", targetId: target!.id, detail: { reason, auth_version: version } });
    return c.json({ ok: true, status: "suspended" });
  });

  admin.post("/customers/:id/restore", requirePermission("customers.suspend"), async (c) => {
    const { target, error } = await loadTarget(c);
    if (error) return error;
    if (target!.status !== "suspended") return c.json({ detail: "This family is not suspended." }, 409);
    const reason = reasonFrom(await readJson(c));
    if (!reason) return c.json({ detail: "Give a reason (5 to 500 characters)." }, 400);
    await c.env.DB.prepare("UPDATE family_admin_state SET status = 'active', suspended_at = NULL, suspended_reason = NULL, updated_at = ? WHERE family_id = ? AND status = 'suspended'")
      .bind(nowIso(), target!.id).run();
    await recordSecurityEvent(c.env.DB, target!.id, null, "family_restored");
    await writeAudit(c.env.DB, { ...actor(c), action: "customer.restore", targetType: "family", targetId: target!.id, detail: { reason } });
    return c.json({ ok: true, status: "active" });
  });

  admin.post("/customers/:id/sign-out-everywhere", requirePermission("customers.sessions.revoke"), async (c) => {
    const { target, error } = await loadTarget(c);
    if (error) return error;
    const reason = reasonFrom(await readJson(c));
    if (!reason) return c.json({ detail: "Give a reason (5 to 500 characters)." }, 400);
    const version = await bumpAuthVersion(c.env.DB, target!.id);
    await recordSecurityEvent(c.env.DB, target!.id, null, "signed_out_everywhere", "by administrator");
    await writeAudit(c.env.DB, { ...actor(c), action: "customer.sign_out_everywhere", targetType: "family", targetId: target!.id, detail: { reason, auth_version: version } });
    return c.json({ ok: true });
  });


  // ---------------------------------------------- Preview gifts
  admin.post("/customers/:id/gift-preview", requirePermission("settings.write"), async (c) => {
    const { target, error } = await loadTarget(c);
    if (error) return error;
    if (target!.status !== "active") return c.json({ detail: "A suspended family cannot receive gifts." }, 409);
    const body = await readJson(c);
    if (body.confirm !== "GIFT") return c.json({ detail: "Type GIFT to confirm this preview extension." }, 400);
    const reason = reasonFrom(body);
    if (!reason) return c.json({ detail: "Give a reason (5–500 characters)." }, 400);
    const days = Number(body.days);
    if (![1, 7, 14].includes(days) || typeof body.days !== "number" || !Number.isInteger(body.days)) return c.json({ detail: "Choose 1, 7 or 14 bonus days." }, 400);
    const result = await giftPreviewDays(c.env.DB, target!.id, days);
    if (!result.ok) return c.json({ detail: result.detail }, result.status);
    await writeAudit(c.env.DB, { ...actor(c), action: "hoard.preview_gift", targetType: "family", targetId: target!.id, detail: { days, ends_at: result.ends_at, reason } });
    return c.json(result);
  });

  // ---------------------------------------------------------------- settings
  admin.get("/settings", requirePermission("settings.read"), async (c) => {
    const settings = await loadPlatformSettings(c.env.DB, { fresh: true });
    const { results } = await c.env.DB.prepare("SELECT key, updated_at FROM platform_settings").all<{ key: string; updated_at: string }>();
    return c.json({ settings, defaults: defaultSettings(), limits: LIMITS, keys: SETTING_KEYS, updated_at: Object.fromEntries((results ?? []).map((r) => [r.key, r.updated_at])) });
  });

  admin.put("/settings/:key", requirePermission("settings.write"), async (c) => {
    const key = c.req.param("key") ?? "";
    if (!isSettingKey(key)) return c.json({ detail: "Unknown setting" }, 404);
    const body = await readJson(c);
    const checked = validateSetting(key, body.value);
    if (!checked.ok) return c.json({ detail: checked.error }, 400);
    const current = await loadPlatformSettings(c.env.DB, { fresh: true });
    const reasons = highImpactReasons(key, current[key], checked.value);
    if (reasons.length > 0 && body.confirm_high_impact !== true) {
      return c.json({ detail: "This change needs confirmation.", code: "confirmation_required", reasons }, 409);
    }
    await saveSetting(c.env.DB, key, checked.value, c.get("user").id);
    await writeAudit(c.env.DB, { ...actor(c), action: "settings.update", targetType: "setting", targetId: key, detail: { from: current[key], to: checked.value, high_impact: reasons } });
    return c.json({ key, value: checked.value });
  });

  // ------------------------------------------------------------------- audit
  admin.get("/audit", requirePermission("audit.read"), async (c) => {
    const page = Number(c.req.query("page") ?? "1");
    if (!Number.isInteger(page) || page < 1 || page > 10000) return c.json({ detail: "Invalid page" }, 400);
    const limit = 50;
    const { results } = await c.env.DB.prepare(
      "SELECT id, actor_label AS actor, action, target_type, target_id, detail_json, created_at FROM admin_audit_log ORDER BY created_at DESC, id LIMIT ? OFFSET ?",
    ).bind(limit + 1, (page - 1) * limit).all<any>();
    const rows = (results ?? []).map(({ detail_json, ...r }) => {
      let detail: unknown = {};
      try { detail = JSON.parse(detail_json); } catch { /* keep {} */ }
      return { ...r, detail };
    });
    return c.json({ entries: rows.slice(0, limit), has_more: rows.length > limit, page });
  });

  // --------------------------------------- family feedback: owner-only inbox
  // Step-up, Owner role, CSRF, rate limits and admin permissions are all enforced above.
  admin.get("/feedback/unread-count", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const r = await c.env.DB.prepare("SELECT COUNT(*) n FROM parent_feedback WHERE seen_at IS NULL").first<{n:number}>();
    return c.json({ unread: Number(r?.n || 0) });
  });

  admin.get("/feedback", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const status = c.req.query("status") || "";
    const category = c.req.query("category") || "";
    const supportOnly = c.req.query("kind") === "learning-support";
    if (status && !(FEEDBACK_STATUSES as readonly string[]).includes(status)) return c.json({ detail: "Invalid status" }, 400);
    if (category && !(FEEDBACK_CATEGORIES as readonly string[]).includes(category)) return c.json({ detail: "Invalid category" }, 400);
    const page = Number(c.req.query("page") || "1");
    if (!Number.isInteger(page) || page < 1 || page > 10000) return c.json({ detail: "Invalid page" }, 400);
    const { results } = await c.env.DB.prepare(
      "SELECT p.id,p.family_id,p.user_id,p.category,p.subject,p.message,p.page_hint,p.status,p.owner_note,p.seen_at,p.created_at,p.updated_at, u.email AS parent_email,u.name AS parent_name, f.jurisdiction AS family_jurisdiction FROM parent_feedback p JOIN users u ON u.id=p.user_id AND u.family_id=p.family_id JOIN families f ON f.id=p.family_id WHERE (? = '' OR p.status = ?) AND (? = '' OR p.category = ?) AND (? = 0 OR p.page_hint = 'learning-support') ORDER BY CASE WHEN p.seen_at IS NULL THEN 0 ELSE 1 END, p.created_at DESC LIMIT 51 OFFSET ?",
    ).bind(status,status,category,category,supportOnly ? 1 : 0,(page - 1)*50).all();
    const rows=results || [];
    return c.json({ items: rows.slice(0,50), has_more: rows.length > 50, page });
  });

  admin.put("/feedback/:id", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const row = await c.env.DB.prepare("SELECT id,family_id,status,seen_at FROM parent_feedback WHERE id = ?")
      .bind((c.req.param("id")??"")).first<{id:string;family_id:string;status:string;seen_at:string|null}>();
    if (!row) return c.json({ detail: "Feedback not found" }, 404);
    const body = await readJson(c);
    const status = body.status === undefined ? row.status : body.status;
    if (typeof status !== "string" || !(FEEDBACK_STATUSES as readonly string[]).includes(status)) return c.json({ detail: "Invalid status" }, 400);
    if (body.owner_note !== undefined && (typeof body.owner_note !== "string" || body.owner_note.length > 2000))
      return c.json({ detail: "Internal note must be 2000 characters or fewer" }, 400);
    const ownerNote = body.owner_note === undefined ? null : String(body.owner_note).trim();
    const when = nowIso();
    await c.env.DB.prepare(
      "UPDATE parent_feedback SET status=?, owner_note=COALESCE(?,owner_note), seen_at=COALESCE(seen_at,?), updated_at=? WHERE id=?",
    ).bind(status,ownerNote,when,when,row.id).run();
    // Audit metadata only: no private parent report text in administrative log.
    await writeAudit(c.env.DB,{...actor(c),action:"feedback.update",targetType:"feedback",targetId:row.id,detail:{from:row.status,to:status,notes_updated:ownerNote!==null}});
    return c.json({ok:true,id:row.id,status,seen_at:row.seen_at || when});
  });

  // A private reply is persisted first. Optional email only alerts the correct submitting parent
  // to sign in; it never contains the report, reply, names, or other customer data.
  admin.post("/support-plan/draft",requirePermission("customers.read"),async c=>{const r=await draftQuotePlan(c.env,c.get("user").id,await readJson(c));return "error" in r?c.json({detail:r.error},409):c.json(r);});
  admin.get("/feedback/:id/quotes",requirePermission("customers.read"),async c=>{
    await ensureFeedbackSchema(c.env.DB);
    const id=(c.req.param("id")??"");
    if(!await supportThread(c.env.DB,id))return c.json({detail:"Learning support request not found"},404);
    await ensureQuoteSchema(c.env.DB);
    return c.json({quotes:await listSupportQuotes(c.env.DB,id),ai_enabled:c.env.SUPPORT_RESOURCE_AI==="true"&&!!c.env.AI});
  });
  admin.post("/feedback/:id/quotes",requirePermission("customers.read"),async c=>{
    await ensureFeedbackSchema(c.env.DB);
    const id=(c.req.param("id")??""),thread=await supportThread(c.env.DB,id);
    if(!thread)return c.json({detail:"Learning support request not found"},404);
    if(["closed","resolved"].includes(thread.status))return c.json({detail:"Reopen the enquiry before proposing support."},409);
    const b=await readJson(c),v=validateQuote(b);
    if("error" in v)return c.json({detail:v.error},400);
    if(b.confirmed!==true)return c.json({detail:"Confirm that this is a non-binding proposal, not a payment or confirmed booking."},400);
    await ensureQuoteSchema(c.env.DB);
    const qid=crypto.randomUUID(),now=new Date(),when=now.toISOString(),expires=new Date(now.getTime()+v.days*86400000).toISOString();
    // Expired offers remain immutable in history. Explicitly withdraw them before making another proposal.
    const snap=planSnapshot(b);if("error" in snap)return c.json({detail:snap.error},400);
    const stmt=c.env.DB.prepare("INSERT OR IGNORE INTO learning_support_quotes (id,feedback_id,scope,delivery,amount_cents,currency,status,created_at,expires_at) SELECT ?,p.id,?,?,?,'AUD','offered',?,? FROM parent_feedback p WHERE p.id=? AND p.page_hint='learning-support' AND p.status NOT IN ('closed','resolved')").bind(qid,v.scope,v.delivery,v.cents,when,expires,id);
    const r=await issueQuoteWithPlan(c.env.DB,"member",id,qid,stmt,snap.plan,when);
    if(!r.meta?.changes)return c.json({detail:"An open proposal already exists or this enquiry was closed. Withdraw the old proposal first."},409);
    // Durable proposal is authoritative. A notification failure does not undo it.
    try{
      await c.env.DB.prepare("INSERT INTO parent_feedback_replies (id,feedback_id,author_user_id,body,parent_read_at,created_at) VALUES (?,?,?,?,NULL,?)").bind(crypto.randomUUID(),id,c.get("user").id,"A learning support proposal is ready. Open Learning Support in your Parent Hub to review the scope, total price and delivery details.",when).run();
      await writeAudit(c.env.DB,{...actor(c),action:"learning_support.quote",targetType:"feedback",targetId:id,detail:{quote_id:qid,amount_cents:v.cents}});
    }catch{console.warn("learning support quote notification or audit unavailable");}
    return c.json({ok:true,id:qid},201);
  });
  admin.post("/feedback/:id/quotes/:quoteId/withdraw",requirePermission("customers.read"),async c=>{
    await ensureFeedbackSchema(c.env.DB);
    const id=(c.req.param("id")??""),qid=(c.req.param("quoteId")??"");
    if(!await supportThread(c.env.DB,id))return c.json({detail:"Learning support request not found"},404);
    await ensureQuoteSchema(c.env.DB);
    const b=await readJson(c);
    if(b.confirmed!==true)return c.json({detail:"Confirm withdrawal."},400);
    if(await hasOrder(c.env.DB,"member",qid))return c.json({detail:"Resolve the associated order before withdrawing the quote."},409);
    const r=await c.env.DB.prepare("UPDATE learning_support_quotes SET status='withdrawn',withdrawn_at=? WHERE id=? AND feedback_id=? AND status IN ('offered','interested') AND NOT EXISTS (SELECT 1 FROM support_service_orders o WHERE o.channel='member' AND o.quote_id=learning_support_quotes.id AND o.status<>'cancelled')").bind(nowIso(),qid,id).run();
    if(!r.meta?.changes)return c.json({detail:"This proposal cannot be withdrawn."},409);
    try{await writeAudit(c.env.DB,{...actor(c),action:"learning_support.withdraw",targetType:"feedback",targetId:id,detail:{quote_id:qid}});}catch{}
    return c.json({ok:true});
  });

  admin.get("/feedback/:id/replies", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const exists=await c.env.DB.prepare("SELECT id FROM parent_feedback WHERE id=?").bind((c.req.param("id")??"")).first();
    if(!exists) return c.json({detail:"Feedback not found"},404);
    const {results}=await c.env.DB.prepare(
      "SELECT id,body,created_at,parent_read_at FROM parent_feedback_replies WHERE feedback_id=? ORDER BY created_at ASC,id ASC LIMIT 100",
    ).bind((c.req.param("id")??"")).all();
    return c.json({replies:results||[]});
  });

  admin.post("/feedback/:id/replies", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const b=await readJson(c);
    if(typeof b.message !== "string" || b.message.trim().length<2 || b.message.trim().length>2000)
      return c.json({detail:"Write a reply of 2 to 2000 characters."},400);
    const status=b.status===undefined?undefined:b.status;
    if(status!==undefined && (typeof status!=="string" || !(FEEDBACK_STATUSES as readonly string[]).includes(status)))
      return c.json({detail:"Invalid feedback status"},400);
    const report=await c.env.DB.prepare(
      "SELECT p.id,p.family_id,p.user_id,p.status,u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id AND u.family_id=p.family_id WHERE p.id=?"
    ).bind((c.req.param("id")??"")).first<{id:string;family_id:string;user_id:string;status:string;email:string}>();
    if(!report)return c.json({detail:"Feedback not found"},404);
    const replyId=crypto.randomUUID(), when=nowIso(), body=b.message.trim();
    // The owner cannot reroute the reply by supplying a target email, family id or user id.
    const replies=(await c.env.DB.prepare("SELECT COUNT(*) n FROM parent_feedback_replies WHERE feedback_id=?")
      .bind(report.id).first<{n:number}>())?.n||0;
    if(Number(replies)>=100)return c.json({detail:"This feedback thread has reached its reply limit."},409);
    await c.env.DB.batch([
      c.env.DB.prepare("INSERT INTO parent_feedback_replies (id,feedback_id,author_user_id,body,parent_read_at,created_at) VALUES (?,?,?,?,NULL,?)")
        .bind(replyId,report.id,c.get("user").id,body,when),
      c.env.DB.prepare("UPDATE parent_feedback SET status=COALESCE(?,status),seen_at=COALESCE(seen_at,?),updated_at=? WHERE id=?")
        .bind(status??null,when,when,report.id),
    ]);
    // Keep the audit trail content-free, like other Owner HQ operations.
    try {
      await writeAudit(c.env.DB,{...actor(c),action:"feedback.reply",targetType:"feedback",targetId:report.id,
        detail:{reply_id:replyId, status:status??report.status}});
    } catch { console.warn("feedback reply audit could not be recorded"); }
    let emailSent=false;
    try {
      if(typeof report.email==="string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(report.email)) {
        const url=SITE_URL+"/parent/feedback?thread="+encodeURIComponent(report.id);
        emailSent=await sendEmail(c.env,{
          to:report.email,subject:"Side-Quest has replied to your feedback",
          text:"You have a new reply from Side-Quest. Sign in to your Parent Hub to read it:\n"+url+"\n\nThis is a notification only. Your message stays private in your Side-Quest account.",
          html:layout({
            preheader:"The Side-Quest team has replied to your feedback. Your message is waiting in the Parent Hub.",
            kicker:"The quest board has news.",
            heading:"Side-Quest has reported back!",
            body:p("There's a new reply from the Side-Quest team in your private Parent Hub.") +
              button("Read your message",url) +
              p("Sign in to read your reply. For your privacy, the message itself is not included in this email."),
            reason:"You're receiving this because you sent feedback to Side-Quest and the team has replied.",
          }),
        });
      }
    } catch { /* the on-site reply is always delivered */ }
    return c.json({ok:true,id:replyId,feedback_id:report.id,status:status??report.status,
      created_at:when,email_notification_sent:emailSent,delivered_in_app:true},201);
  });


  // Owner-only, passkey-protected special email announcements.
  // Mailing list sources are private registered parent accounts ONLY; the owner
  // cannot supply an arbitrary recipient address or list through these endpoints.
  admin.get("/announcements", requirePermission("settings.read"), async c=>{
    await ensureAnnouncementSchema(c.env.DB);
    const now=new Date();
    return c.json({
      email_configured:!!c.env.EMAIL,
      service_recipients:await audienceCount(c.env.DB,"service",now),
      opted_in_recipients:await audienceCount(c.env.DB,"optional",now),
      broadcasts:await listAnnouncements(c.env.DB),
    });
  });
  admin.post("/announcements/preview",requirePermission("settings.read"),async c=>{
    const body=await readJson(c),v=validateAnnouncement(body);
    if(!v.ok)return c.json({detail:v.detail},400);
    await ensureAnnouncementSchema(c.env.DB);
    return c.json({
      kind:v.kind,subject:v.subject,body:v.body,
      recipients:await audienceCount(c.env.DB,v.kind),
      email_configured:!!c.env.EMAIL,
      confirmation:"SEND "+await audienceCount(c.env.DB,v.kind)+" PARENTS",
    });
  });
  admin.post("/announcements",requirePermission("settings.write"),async c=>{
    const body=await readJson(c),v=validateAnnouncement(body);
    if(!v.ok)return c.json({detail:v.detail},400);
    if(typeof body.idempotency_key!=="string" || !/^[a-fA-F0-9-]{36}$/.test(body.idempotency_key))
      return c.json({detail:"Refresh the composer and confirm sending again."},400);
    if(typeof body.expected_recipients!=="number" || !Number.isInteger(body.expected_recipients))
      return c.json({detail:"Preview the recipient count again."},400);
    if(body.confirmation!=="SEND "+body.expected_recipients+" PARENTS")
      return c.json({detail:"Type the exact confirmation phrase shown in the preview."},400);
    if(v.kind==="service" && body.non_promotional_confirmed!==true)
      return c.json({detail:"Confirm that a service notice contains no advertising or promotional content."},400);
    if(v.kind==="optional" && body.consent_confirmed!==true)
      return c.json({detail:"Confirm that optional news goes only to parents who have opted in."},400);
    if(!c.env.EMAIL)return c.json({detail:"Outgoing email is not configured on this Cloudflare Worker. Nothing was sent."},503);
    const safeIdempotencyKey=body.idempotency_key as string;
    const safeRecipientCount=body.expected_recipients as number;
    await ensureAnnouncementSchema(c.env.DB);
    const result=await queueAnnouncement(c.env.DB,c.get("user").id,{
      kind:v.kind,subject:v.subject,body:v.body,
      idempotency_key:safeIdempotencyKey,expected_recipients:safeRecipientCount
    });
    if("error" in result)return c.json({detail:result.error},409);
    if(!result.existing)await writeAudit(c.env.DB,{
      ...actor(c),action:"announcement.queued",targetType:"announcement",targetId:result.id,
      detail:{kind:v.kind,recipient_count:result.count}
    });
    return c.json({queued:true,id:result.id,already_queued:result.existing,delivery:"Paced in batches via Cloudflare cron."},result.existing?200:201);
  });
  admin.post("/announcements/:id/cancel",requirePermission("settings.write"),async c=>{
    await ensureAnnouncementSchema(c.env.DB);
    const id=c.req.param("id") ?? "";
    if(!/^[a-fA-F0-9-]{36}$/.test(id))return c.json({detail:"Unknown announcement"},404);
    const cancelled=await cancelAnnouncement(c.env.DB,id);
    if(!cancelled)return c.json({detail:"This announcement is already complete or cancelled."},409);
    await writeAudit(c.env.DB,{...actor(c),action:"announcement.cancelled",targetType:"announcement",targetId:id});
    return c.json({cancelled:true});
  });


  // Standalone guests are separate from homeschool customers and remain behind Owner HQ step-up.
  admin.get("/support-guests",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);
    const page=Number(c.req.query("page")||1);if(!Number.isInteger(page)||page<1||page>10000)return c.json({detail:"Invalid page"},400);
    const {results}=await c.env.DB.prepare("SELECT * FROM support_guest_requests ORDER BY CASE WHEN seen_at IS NULL THEN 0 ELSE 1 END,updated_at DESC LIMIT 51 OFFSET ?").bind((page-1)*50).all<any>();
    const rows=results||[];return c.json({items:rows.slice(0,50),has_more:rows.length>50});
  });
  admin.get("/support-guests/:id",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??"");
    const row=await c.env.DB.prepare("SELECT * FROM support_guest_requests WHERE id=?").bind(id).first<any>();
    if(!row)return c.json({detail:"Request not found"},404);
    return c.json({request:row,messages:await guestMessages(c.env.DB,id)});
  });
  admin.put("/support-guests/:id",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??""),b=await readJson(c);
    if(typeof b.status!=="string"||!(FEEDBACK_STATUSES as readonly string[]).includes(b.status))return c.json({detail:"Invalid status"},400);
    const r=await c.env.DB.prepare("UPDATE support_guest_requests SET status=?,seen_at=? WHERE id=?").bind(b.status,nowIso(),id).run();if(!r.meta?.changes)return c.json({detail:"Request not found"},404);
    await writeAudit(c.env.DB,{...actor(c),action:"guest_support.status",targetType:"support_guest",targetId:id,detail:{status:b.status}});
    return c.json({ok:true});
  });
  admin.post("/support-guests/:id/messages",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??""),b=await readJson(c),message=typeof b.message==="string"?b.message.trim():"",when=nowIso();
    if(message.length<2||message.length>2000)return c.json({detail:"Write 2–2000 characters."},400);
    const row=await c.env.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>();if(!row)return c.json({detail:"Request not found"},404);
    const r=await c.env.DB.prepare("INSERT INTO support_guest_messages(id,request_id,sender,body,created_at) SELECT ?,id,'owner',?,? FROM support_guest_requests WHERE id=? AND (SELECT COUNT(*) FROM support_guest_messages WHERE request_id=?)<100").bind(crypto.randomUUID(),message,when,id,id).run();if(!r.meta?.changes)return c.json({detail:"Thread full"},409);
    await writeAudit(c.env.DB,{...actor(c),action:"guest_support.reply",targetType:"support_guest",targetId:id,detail:{}});
    return c.json({ok:true,email_notification_sent:await guestNotify(c.env,row.email)},201);
  });
  admin.get("/support-guests/:id/quotes",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??"");
    if(!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=?").bind(id).first())return c.json({detail:"Request not found"},404);
    return c.json({quotes:await guestQuotes(c.env.DB,id),ai_enabled:c.env.SUPPORT_RESOURCE_AI==="true"&&!!c.env.AI});
  });
  admin.post("/support-guests/:id/quotes",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??""),b=await readJson(c),v=validateQuote(b);
    if("error" in v)return c.json({detail:v.error},400);if(b.confirmed!==true)return c.json({detail:"Confirm non-binding proposal."},400);
    const row=await c.env.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>();if(!row)return c.json({detail:"Request not found"},404);
    const qid=crypto.randomUUID(),now=new Date();
    const snap=planSnapshot(b);if("error" in snap)return c.json({detail:snap.error},400);
    const stmt=c.env.DB.prepare("INSERT OR IGNORE INTO support_guest_quotes(id,request_id,scope,delivery,amount_cents,currency,status,created_at,expires_at) SELECT ?,id,?,?,?,'AUD','offered',?,? FROM support_guest_requests WHERE id=? AND status NOT IN ('closed','resolved')").bind(qid,v.scope,v.delivery,v.cents,now.toISOString(),new Date(now.getTime()+v.days*86400000).toISOString(),id);
    const r=await issueQuoteWithPlan(c.env.DB,"guest",id,qid,stmt,snap.plan,now.toISOString());
    if(!r.meta?.changes)return c.json({detail:"Withdraw any open proposal or reopen this request first."},409);
    await writeAudit(c.env.DB,{...actor(c),action:"guest_support.quote",targetType:"support_guest",targetId:id,detail:{quote_id:qid,amount_cents:v.cents}});
    return c.json({id:qid,email_notification_sent:await guestNotify(c.env,row.email)},201);
  });
  admin.post("/support-guests/:id/quotes/:qid/withdraw",requirePermission("customers.read"),async c=>{
    await ensureGuestSchema(c.env.DB);const id=(c.req.param("id")??""),b=await readJson(c);if(b.confirmed!==true)return c.json({detail:"Confirm withdrawal."},400);
    if(await hasOrder(c.env.DB,"guest",(c.req.param("qid")??"")))return c.json({detail:"Resolve the associated order before withdrawing the quote."},409);
    const r=await c.env.DB.prepare("UPDATE support_guest_quotes SET status='withdrawn',withdrawn_at=? WHERE id=? AND request_id=? AND status IN ('offered','interested') AND NOT EXISTS (SELECT 1 FROM support_service_orders o WHERE o.channel='guest' AND o.quote_id=support_guest_quotes.id AND o.status<>'cancelled')").bind(nowIso(),(c.req.param("qid")??""),id).run();if(!r.meta?.changes)return c.json({detail:"Proposal unavailable"},409);
    await writeAudit(c.env.DB,{...actor(c),action:"guest_support.withdraw",targetType:"support_guest",targetId:id,detail:{quote_id:(c.req.param("qid")??"")}});
    return c.json({ok:true});
  });

  admin.get("/support-files",requirePermission("customers.read"),async c=>c.json({files:await listResources(c.env.DB,c.req.query("q")||"",c.req.query("learner")==="1"),storage_available:!!c.env.BUCKET}));
  admin.post("/support-files",requirePermission("customers.read"),async c=>{
    if(Number(c.req.header("Content-Length")||0)>7500000)return c.json({detail:"File too large."},413);
    if(!(await hitRateLimit(c.env.DB,"support-upload:"+c.get("user").id,30,3600)).ok)return c.json({detail:"Upload limit reached."},429);
    const r=await uploadResource(c.env,await readJson(c));if("error" in r)return c.json({detail:r.error},400);
    await writeAudit(c.env.DB,{...actor(c),action:"support.file.upload",targetType:"support_file",targetId:r.id,detail:{}});return c.json(r,201);
  });
  admin.get("/support-files/:fid/download",requirePermission("customers.read"),async c=>{
    const r=await downloadResource(c.env,c.req.param("fid")??"");return r?c.json(r):c.json({detail:"Resource unavailable"},404);
  });
  admin.post("/support-files/:fid/archive",requirePermission("customers.read"),async c=>{
    const id=c.req.param("fid")??"",b=await readJson(c);if(b.confirmed!==true||!await archiveResource(c.env.DB,id))return c.json({detail:"Resource unavailable"},409);
    await writeAudit(c.env.DB,{...actor(c),action:"support.file.archive",targetType:"support_file",targetId:id,detail:{}});return c.json({ok:true});
  });
  admin.get("/support-decks",requirePermission("customers.read"),async c=>c.json({decks:await findDecks(c.env.DB,c.req.query("q")||"",c.req.query("reviewed")==="1"),ai_enabled:c.env.SUPPORT_RESOURCE_AI==="true"&&!!c.env.AI}));
  admin.post("/support-decks/draft",requirePermission("customers.read"),async c=>{
    const r=await draftDeck(c.env,c.get("user").id,await readJson(c));return "error" in r?c.json({detail:r.error},409):c.json(r);
  });
  admin.get("/support-decks/:deckId",requirePermission("customers.read"),async c=>{
    const d=await getDeck(c.env.DB,(c.req.param("deckId")??""));return d&&d.status!=="archived"?c.json({deck:d}):c.json({detail:"Resource not found"},404);
  });
  admin.post("/support-decks",requirePermission("customers.read"),async c=>{
    const r=await saveDeck(c.env.DB,await readJson(c));if("error" in r)return c.json({detail:r.error},400);
    await writeAudit(c.env.DB,{...actor(c),action:"support.deck.create",targetType:"support_deck",targetId:r.id,detail:{}});return c.json(r,201);
  });
  admin.put("/support-decks/:deckId",requirePermission("customers.read"),async c=>{
    const id=(c.req.param("deckId")??""),r=await saveDeck(c.env.DB,await readJson(c),id);if("error" in r)return c.json({detail:r.error},409);
    await writeAudit(c.env.DB,{...actor(c),action:"support.deck.update",targetType:"support_deck",targetId:id,detail:{}});return c.json(r);
  });
  admin.post("/support-decks/:deckId/archive",requirePermission("customers.read"),async c=>{
    const id=(c.req.param("deckId")??""),b=await readJson(c);if(b.confirmed!==true||!await archiveDeck(c.env.DB,id,b.revision))return c.json({detail:"Resource changed; refresh before archiving."},409);
    await writeAudit(c.env.DB,{...actor(c),action:"support.deck.archive",targetType:"support_deck",targetId:id,detail:{}});return c.json({ok:true});
  });
  admin.post("/support-calendar/blocks",requirePermission("customers.read"),async c=>{
    const r=await createBusyBlock(c.env.DB,await readJson(c));if("error" in r)return c.json({detail:r.error},409);
    await writeAudit(c.env.DB,{...actor(c),action:"support.calendar.block",targetType:"support_block",targetId:r.id,detail:{}});return c.json(r,201);
  });
  admin.post("/support-calendar/blocks/:bid/remove",requirePermission("customers.read"),async c=>{
    const b=await readJson(c),id=c.req.param("bid")??"";if(b.confirmed!==true)return c.json({detail:"Confirm removal."},400);
    await ensureOrderSchema(c.env.DB);const r=await c.env.DB.prepare("DELETE FROM support_busy_blocks WHERE id=?").bind(id).run();
    if(!r.meta?.changes)return c.json({detail:"Block not found"},404);
    await writeAudit(c.env.DB,{...actor(c),action:"support.calendar.unblock",targetType:"support_block",targetId:id,detail:{}});return c.json({ok:true});
  });
  admin.get("/support-calendar",requirePermission("customers.read"),async c=>{
    await ensureOrderSchema(c.env.DB);await ensureGuestSchema(c.env.DB);await ensureFeedbackSchema(c.env.DB);
    const from=c.req.query("from")||"",to=c.req.query("to")||"";
    if(!Number.isFinite(Date.parse(from))||!Number.isFinite(Date.parse(to))||Date.parse(to)<=Date.parse(from)||Date.parse(to)-Date.parse(from)>62*86400000)return c.json({detail:"Choose a date range of up to 62 days."},400);
    const {results}=await c.env.DB.prepare("SELECT o.id,o.channel,o.request_id,o.scope,o.start_at,o.end_at,o.status,o.amount_cents,i.due_at,i.reference,d.learner_label,d.prep_minutes,d.wrap_minutes,d.ready,CASE WHEN o.channel='guest' THEN g.parent_name ELSE u.name END parent_name FROM support_service_orders o LEFT JOIN support_manual_invoices i ON i.order_id=o.id LEFT JOIN support_tutor_diary d ON d.order_id=o.id LEFT JOIN support_guest_requests g ON o.channel='guest' AND g.id=o.request_id LEFT JOIN parent_feedback f ON o.channel='member' AND f.id=o.request_id LEFT JOIN users u ON u.id=f.user_id WHERE o.mode='live' AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?) AND o.status<>'cancelled' ORDER BY o.start_at LIMIT 501").bind(new Date(to).toISOString(),new Date(from).toISOString()).all<any>();
    const overdue=(await c.env.DB.prepare("SELECT o.id,o.channel,o.request_id,o.scope,o.start_at,o.status,i.reference,i.due_at FROM support_service_orders o JOIN support_manual_invoices i ON i.order_id=o.id WHERE o.status='confirmed' AND i.due_at<=? AND i.cancelled_at IS NULL ORDER BY i.due_at LIMIT 100").bind(nowIso()).all<any>()).results||[];
    const blocks=(await c.env.DB.prepare("SELECT id,label,start_at,end_at FROM support_busy_blocks WHERE start_at<? AND end_at>? ORDER BY start_at LIMIT 500").bind(new Date(to).toISOString(),new Date(from).toISOString()).all()).results||[];
    return c.json({blocks,appointments:(results||[]).slice(0,500),truncated:(results||[]).length>500,overdue,classroom_enabled:classroomEnabled(c.env)});
  });
  for(const channel of ["member","guest"] as const){
    admin.get((channel==="guest"?"/support-guests/":"/feedback/")+":id/quotes/:qid/plan",requirePermission("customers.read"),async c=>c.json({plan:await readQuotePlan(c.env.DB,channel,(c.req.param("id")??""),(c.req.param("qid")??""),true)}));
    const path=(channel==="guest"?"/support-guests/":"/feedback/")+":id/orders";
    const exists=async(c:AdminContext,id:string)=>channel==="guest"?!!await c.env.DB.prepare("SELECT id FROM support_guest_requests WHERE id=?").bind(id).first():!!await supportThread(c.env.DB,id);
    const slotsPath=(channel==="guest"?"/support-guests/":"/feedback/")+":id/quotes/:qid/slots";
    admin.get(slotsPath,requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",qid=c.req.param("qid")??"";if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      return c.json({offer:await readSlots(c.env.DB,channel,id,qid)});
    });
    admin.post(slotsPath,requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",qid=c.req.param("qid")??"";if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      const r=await offerSlots(c.env.DB,channel,id,qid,await readJson(c));if("error" in r)return c.json({detail:r.error},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support.slots.offer",targetType:"support",targetId:id,detail:{channel,quote_id:qid}});
      const recipient=channel==="guest"?await c.env.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>():await c.env.DB.prepare("SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
      let sent=false;try{if(recipient?.email){const origin=guestOrigin(c.env);if(origin){const url=origin+(channel==="guest"?"/learning-support/portal":"/parent/learning-support");sent=await sendEmail(c.env,{to:recipient.email,subject:"Side-Quest Learning Support: choose your appointment",text:"Appointment options are available in your private portal: "+url,html:layout({preheader:"Choose a suitable appointment time.",kicker:"Learning Support",heading:"Choose an appointment time",body:p("Review the available times in your private portal. No payment has been taken.")+button("View appointment options",url),reason:"This is a service notification."})});}}}catch{}
      return c.json({ok:true,email_notification_sent:sent,offer:await readSlots(c.env.DB,channel,id,qid)},201);
    });
    admin.post(slotsPath+"/withdraw",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",qid=c.req.param("qid")??"",b=await readJson(c);
      if(b.confirmed!==true||!await exists(c,id)||!await removeSlots(c.env.DB,channel,id,qid))return c.json({detail:"Offer unavailable"},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support.slots.withdraw",targetType:"support",targetId:id,detail:{channel,quote_id:qid}});return c.json({ok:true});
    });
    admin.get(path,requirePermission("customers.read"),async c=>{
      const id=(c.req.param("id")??"");if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      return c.json({orders:await listOrders(c.env.DB,channel,id)});
    });
    admin.post(path,requirePermission("customers.read"),async c=>{
      const id=(c.req.param("id")??"");if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      const result=await createServiceOrder(c.env.DB,channel,id,await readJson(c));
      if("error" in result)return c.json({detail:result.error},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support.order",targetType:"support",targetId:id,detail:{order_id:result.id,channel}});
      return c.json(result,201);
    });
    admin.get(path+"/:oid/diary",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",oid=c.req.param("oid")??"";if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      const d=await readDiary(c.env.DB,channel,id,oid);return d?c.json(d):c.json({detail:"Order not found"},404);
    });
    admin.put(path+"/:oid/diary",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",oid=c.req.param("oid")??"";if(!await exists(c,id)||!await saveDiary(c.env.DB,channel,id,oid,await readJson(c)))return c.json({detail:"Check the diary fields and reload if another edit was saved. Ready lessons need objectives, an agenda and materials."},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support.diary.save",targetType:"support",targetId:oid,detail:{channel}});return c.json({ok:true});
    });
    admin.get(path+"/:oid/files",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",oid=c.req.param("oid")??"";if(!await exists(c,id))return c.json({detail:"Request not found"},404);
      return c.json({files:await grantedResources(c.env.DB,channel,id,oid)});
    });
    admin.post(path+"/:oid/files/:fid/:fileAction",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"",action=c.req.param("fileAction"),b=await readJson(c);
      if(b.confirmed!==true||!await exists(c,id))return c.json({detail:"Confirm customer and resource."},400);
      const ok=action==="share"?await grantResource(c.env.DB,channel,id,oid,fid):action==="revoke"?await revokeResource(c.env.DB,channel,id,oid,fid):false;
      if(!ok)return c.json({detail:"Resource or confirmed service unavailable."},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support.file."+action,targetType:"support",targetId:oid,detail:{file_id:fid,channel}});return c.json({ok:true});
    });
    admin.post(path+"/:oid/video-prepare",requirePermission("customers.read"),async c=>{
      const b=await readJson(c);if(b.confirmed!==true)return c.json({detail:"Confirm video setup."},400);
      const r=await prepareVideo(c.env,channel,(c.req.param("id")??""),(c.req.param("oid")??""));
      return "error" in r?c.json({detail:r.error},409):c.json(r);
    });
    admin.post(path+"/:oid/video-token",requirePermission("customers.read"),async c=>{
      const r=await videoToken(c.env,channel,(c.req.param("id")??""),(c.req.param("oid")??""),true);
      return "error" in r?c.json({detail:r.error},409):c.json(r);
    });
    admin.get(path+"/:oid/classroom-image/:fid",requirePermission("customers.read"),async c=>{
      const id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"";
      if(!classroomEnabled(c.env)||!await canReadClassroomImage(c.env.DB,channel,id,oid,fid,true))return c.json({detail:"Image unavailable"},404);
      const r=await readPresentedImage(c.env,fid);return r?c.json(r):c.json({detail:"Image unavailable"},404);
    });
    admin.get(path+"/:oid/classroom",requirePermission("customers.read"),async c=>{
      if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
      const s=await classroomState(c.env.DB,channel,(c.req.param("id")??""),(c.req.param("oid")??""),true);
      return s?c.json({...s,video_enabled:videoEnabled(c.env)}):c.json({detail:"Confirmed live booking required."},404);
    });
    admin.post(path+"/:oid/classroom-board",requirePermission("customers.read"),async c=>{
      if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
      const id=(c.req.param("id")??""),oid=(c.req.param("oid")??""),b=await readJson(c);
      if(b.action==="open"||b.action==="close"){
        if(b.confirmed!==true||!await setClassroomOpen(c.env.DB,channel,id,oid,b.action==="open"))return c.json({detail:"Cannot change this classroom now."},409);
        await writeAudit(c.env.DB,{...actor(c),action:"support.classroom."+b.action,targetType:"support",targetId:id,detail:{order_id:oid,channel}});
        if(b.action==="close"&&c.env.SUPPORT_VIDEO_TOKEN&&!await closeVideo(c.env,oid))return c.json({ok:true,video_cleanup_pending:true});
        return c.json({ok:true});
      }
      const r=await editClassroom(c.env.DB,channel,id,oid,true,b);return "error" in r?c.json({detail:r.error},409):c.json(r);
    });
    admin.post(path+"/:oid/:action",requirePermission("customers.read"),async c=>{
      const id=(c.req.param("id")??""),oid=(c.req.param("oid")??""),action=(c.req.param("action")??""),b=await readJson(c);
      if(!await exists(c,id)||!await getOrder(c.env.DB,channel,id,oid))return c.json({detail:"Order not found"},404);
      if(b.confirmed!==true)return c.json({detail:"Confirm this action."},400);
      if(action==="backup-preview"||action==="backup-email"){
        const pack=await buildContinuity(c.env,channel,id,oid,b);
        if("error" in pack)return c.json({detail:pack.error},409);
        if(action==="backup-preview")return c.json(pack);
        const sent=await emailContinuity(c.env,pack);
        if(sent)await writeAudit(c.env.DB,{...actor(c),action:"support.backup_email",targetType:"support",targetId:id,detail:{order_id:oid,channel}});
        return c.json({ok:sent,email_notification_sent:sent});
      }
      if(action==="checkout")return c.json({detail:"Create and send invoices directly in Square instead."},410);
      if(action==="invoice"){
        const r=await recordManualInvoice(c.env.DB,channel,id,oid,b,c.get("user").id);
        if("error" in r)return c.json({detail:r.error},409);
        await writeAudit(c.env.DB,{...actor(c),action:"support.invoice_recorded",targetType:"support",targetId:id,detail:{order_id:oid,channel}});
        return c.json({ok:true},201);
      }
      if(action==="verify-payment"){
        if(!await verifyManualInvoice(c.env.DB,channel,id,oid,b,c.get("user").id))return c.json({detail:"Payment could not be recorded. Check the invoice reference, full amount, order status and appointment time."},409);
        await writeAudit(c.env.DB,{...actor(c),action:"support.payment_verified_manually",targetType:"support",targetId:id,detail:{order_id:oid,channel}});
        const recipient=channel==="guest"?await c.env.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>():await c.env.DB.prepare("SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
        const origin=guestOrigin(c.env),url=origin+(channel==="guest"?"/learning-support/portal":"/parent/learning-support");
        const sent=!!(recipient?.email&&origin)&&await sendEmail(c.env,{to:recipient!.email,subject:"Side-Quest Learning Support: booking confirmed",text:"Your service is confirmed. Open your private portal for appointment or delivery details: "+url,html:layout({preheader:"Your Learning Support booking is confirmed.",kicker:"Learning Support",heading:"Your booking is confirmed",body:p("Payment has been checked and your arrangements are confirmed. Open your private portal to review the details. If classroom access is enabled, open your live appointment in the portal during the session window.")+button("View arrangements",url),reason:"This is a service notification."})});
        return c.json({ok:true,email_notification_sent:sent});
      }
      if(action==="cancel-invoice"){
        if(!await cancelManualInvoiceOrder(c.env.DB,channel,id,oid,b))return c.json({detail:"Only a confirmed unpaid order with a cancelled Square invoice can be released."},409);
        await writeAudit(c.env.DB,{...actor(c),action:"support.invoice_cancelled",targetType:"support",targetId:id,detail:{order_id:oid,channel}});return c.json({ok:true});
      }
      const ok=action==="cancel"?await cancelUnstartedOrder(c.env.DB,channel,id,oid):action==="complete"?await completeOrder(c.env.DB,channel,id,oid):false;
      if(!ok)return c.json({detail:"Action unavailable. Orders with an initiated Square checkout require reconciliation before cancellation."},409);
      await writeAudit(c.env.DB,{...actor(c),action:"support."+action,targetType:"support",targetId:id,detail:{order_id:oid,channel}});return c.json({ok:true});
    });
  }
  registerDocumentStudio(admin, requirePermission);

  admin.all("*", (c) => notFound(c));
  return admin;
}
