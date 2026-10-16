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
import { ensureFeedbackSchema, FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from "./feedback";
import { sendEmail, SITE_URL, esc } from "./email";

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
    const id = c.req.param("id");
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
    if (status && !(FEEDBACK_STATUSES as readonly string[]).includes(status)) return c.json({ detail: "Invalid status" }, 400);
    if (category && !(FEEDBACK_CATEGORIES as readonly string[]).includes(category)) return c.json({ detail: "Invalid category" }, 400);
    const page = Number(c.req.query("page") || "1");
    if (!Number.isInteger(page) || page < 1 || page > 10000) return c.json({ detail: "Invalid page" }, 400);
    const { results } = await c.env.DB.prepare(
      "SELECT p.id,p.family_id,p.user_id,p.category,p.subject,p.message,p.page_hint,p.status,p.owner_note,p.seen_at,p.created_at,p.updated_at, u.email AS parent_email,u.name AS parent_name, f.jurisdiction AS family_jurisdiction FROM parent_feedback p JOIN users u ON u.id=p.user_id AND u.family_id=p.family_id JOIN families f ON f.id=p.family_id WHERE (? = '' OR p.status = ?) AND (? = '' OR p.category = ?) ORDER BY CASE WHEN p.seen_at IS NULL THEN 0 ELSE 1 END, p.created_at DESC LIMIT 51 OFFSET ?",
    ).bind(status,status,category,category,(page - 1)*50).all();
    const rows=results || [];
    return c.json({ items: rows.slice(0,50), has_more: rows.length > 50, page });
  });

  admin.put("/feedback/:id", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const row = await c.env.DB.prepare("SELECT id,family_id,status,seen_at FROM parent_feedback WHERE id = ?")
      .bind(c.req.param("id")).first<{id:string;family_id:string;status:string;seen_at:string|null}>();
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
  admin.get("/feedback/:id/replies", requirePermission("customers.read"), async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const exists=await c.env.DB.prepare("SELECT id FROM parent_feedback WHERE id=?").bind(c.req.param("id")).first();
    if(!exists) return c.json({detail:"Feedback not found"},404);
    const {results}=await c.env.DB.prepare(
      "SELECT id,body,created_at,parent_read_at FROM parent_feedback_replies WHERE feedback_id=? ORDER BY created_at ASC,id ASC LIMIT 100",
    ).bind(c.req.param("id")).all();
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
    ).bind(c.req.param("id")).first<{id:string;family_id:string;user_id:string;status:string;email:string}>();
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
          html:'<p>You have a new reply from Side-Quest.</p><p><a href="'+esc(url)+'">Sign in to your Parent Hub to read it</a></p><p>This email contains no private feedback content.</p>',
        });
      }
    } catch { /* the on-site reply is always delivered */ }
    return c.json({ok:true,id:replyId,feedback_id:report.id,status:status??report.status,
      created_at:when,email_notification_sent:emailSent,delivered_in_app:true},201);
  });

  admin.all("*", (c) => notFound(c));
  return admin;
}
