/**
 * Owner HQ data: platform metrics and customer (family) records.
 *
 * Honesty: every figure comes from a real table. Anything not measured is reported as
 * { configured: false } or null with a note, never estimated.
 * Privacy: metadata and counts only. No child names, usernames, PINs, lesson content, answers, evidence, notes,
 * file names, passwords or payment details ever leave these functions.
 */
import { ACTIVE_PLANS, effectivePlan, type Plan } from "./entitlements";
import { aiRequestsLast24h, type PlatformSettings } from "./platformSettings";
import type { Env } from "./types";

const DAY = 86400000;
const iso = (t: number) => new Date(t).toISOString();

async function n(db: D1Database, sql: string, ...binds: unknown[]): Promise<number> {
  const row = await db.prepare(sql).bind(...binds).first<{ n: number }>();
  return Number(row?.n ?? 0);
}

/** COUNT that reports null when the table does not exist (an older database), instead of failing the overview. */
async function maybe(db: D1Database, sql: string, ...binds: unknown[]): Promise<number | null> {
  try { return await n(db, sql, ...binds); } catch { return null; }
}

type FamilyPlanRow = { id: string; plan: string | null; created_at: string | null; trial_started_at: string | null; trial_ends_at: string | null; plan_period_end: string | null };

export async function overview(env: Env, settings: PlatformSettings, now = new Date()) {
  const db = env.DB;
  const t = now.getTime();

  // ---- customers
  const [families, parents, children, new7, new30] = await Promise.all([
    n(db, "SELECT COUNT(*) n FROM families"),
    n(db, "SELECT COUNT(*) n FROM users"),
    n(db, "SELECT COUNT(*) n FROM students"),
    n(db, "SELECT COUNT(*) n FROM families WHERE created_at >= ?", iso(t - 7 * DAY)),
    n(db, "SELECT COUNT(*) n FROM families WHERE created_at >= ?", iso(t - 30 * DAY)),
  ]);
  const suspended = await n(db, "SELECT COUNT(*) n FROM family_admin_state WHERE status = 'suspended'");
  const { results: daily } = await db.prepare(
    "SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM families WHERE created_at >= ? GROUP BY day ORDER BY day",
  ).bind(iso(t - 13 * DAY).slice(0, 10)).all<{ day: string; n: number }>();
  const byDay = new Map((daily ?? []).map((r) => [r.day, Number(r.n)]));
  const registrations14d = Array.from({ length: 14 }, (_, i) => {
    const day = iso(t - (13 - i) * DAY).slice(0, 10);
    return { day, families: byDay.get(day) ?? 0 };
  });

  // ---- plans (effective plan, the same rule the app enforces)
  const { results: planRows } = await db.prepare(
    "SELECT id, plan, created_at, trial_started_at, trial_ends_at, plan_period_end FROM families",
  ).all<FamilyPlanRow>();
  const byPlan: Record<string, number> = {};
  for (const row of planRows ?? []) {
    const p = effectivePlan(row, now);
    byPlan[p] = (byPlan[p] ?? 0) + 1;
  }
  const paid = ACTIVE_PLANS.reduce((s, p) => s + (byPlan[p] ?? 0), 0) + (byPlan.PAST_DUE ?? 0);
  const stripeConfigured = !!env.STRIPE_SECRET_KEY;
  const { results: subStatus } = await db.prepare(
    "SELECT subscription_status AS status, COUNT(*) AS n FROM families WHERE subscription_status IS NOT NULL GROUP BY subscription_status",
  ).all<{ status: string; n: number }>();
  const cancelling = await n(db, "SELECT COUNT(*) n FROM families WHERE cancel_at_period_end = 1 AND stripe_subscription_id IS NOT NULL");

  // ---- AI
  const aiConfigured = !!env.AI;
  const { results: aiKinds } = await db.prepare(
    "SELECT kind, status, COUNT(*) AS n FROM ai_usage WHERE created_at >= ? GROUP BY kind, status",
  ).bind(iso(t - 30 * DAY)).all<{ kind: string; status: string; n: number }>();
  const kinds: Record<string, { requests: number; failed: number }> = {};
  for (const r of aiKinds ?? []) {
    const k = (kinds[r.kind] ??= { requests: 0, failed: 0 });
    k.requests += Number(r.n);
    if (r.status === "failed") k.failed += Number(r.n);
  }
  const [ai24, ai7, aiFailed24] = await Promise.all([
    aiRequestsLast24h(db, now),
    n(db, "SELECT COUNT(*) n FROM ai_usage WHERE created_at >= ? AND status != 'failed'", iso(t - 7 * DAY)),
    n(db, "SELECT COUNT(*) n FROM ai_usage WHERE created_at >= ? AND status = 'failed'", iso(t - DAY)),
  ]);
  const aiFamilies7 = await n(db, "SELECT COUNT(DISTINCT family_id) n FROM ai_usage WHERE created_at >= ?", iso(t - 7 * DAY));

  // ---- storage
  const files = await n(db, "SELECT COUNT(*) n FROM files WHERE is_deleted = 0");
  const bytes = await n(db, "SELECT COALESCE(SUM(size), 0) n FROM files WHERE is_deleted = 0");

  // ---- errors and warnings
  const [errors24, errors7] = await Promise.all([
    n(db, "SELECT COUNT(*) n FROM app_errors WHERE created_at >= ?", iso(t - DAY)),
    n(db, "SELECT COUNT(*) n FROM app_errors WHERE created_at >= ?", iso(t - 7 * DAY)),
  ]);
  const { results: topRoutes } = await db.prepare(
    "SELECT method, route, COUNT(*) AS n, MAX(created_at) AS last FROM app_errors WHERE created_at >= ? GROUP BY method, route ORDER BY n DESC LIMIT 5",
  ).bind(iso(t - 7 * DAY)).all<{ method: string; route: string; n: number; last: string }>();
  const stuckWebhooks = await maybe(db, "SELECT COUNT(*) n FROM stripe_events WHERE processed_at IS NULL AND received_at < ?", iso(t - 60 * 60000));
  const unsentHelp = await maybe(db, "SELECT COUNT(*) n FROM help_requests WHERE emailed_at IS NULL AND created_at < ?", iso(t - 60 * 60000));

  const warnings: { level: "warning" | "info"; message: string }[] = [];
  if (!settings.features.aiEnabled) warnings.push({ level: "warning", message: "AI is switched off in Settings for every family." });
  if (settings.features.aiEnabled && aiConfigured && ai24 >= settings.costSafeguards.aiDailyPlatformCap) {
    warnings.push({ level: "warning", message: `The platform AI limit (${settings.costSafeguards.aiDailyPlatformCap} a day) has been reached, so AI is paused until usage falls.` });
  }
  if (!settings.features.registrationsOpen) warnings.push({ level: "warning", message: "New sign-ups are closed in Settings." });
  if (settings.maintenance.enabled) warnings.push({ level: "info", message: "The maintenance notice is showing to everyone." });
  if ((byPlan.PAST_DUE ?? 0) > 0) warnings.push({ level: "warning", message: `${byPlan.PAST_DUE} membership payment(s) need attention (past due).` });
  if (stuckWebhooks) warnings.push({ level: "warning", message: `${stuckWebhooks} Stripe event(s) received over an hour ago have not been processed.` });
  if (aiFailed24 > 0) warnings.push({ level: "info", message: `${aiFailed24} AI request(s) failed in the last 24 hours.` });
  if (errors24 > 0) warnings.push({ level: "warning", message: `${errors24} server error(s) in the last 24 hours.` });
  if (!env.EMAIL) warnings.push({ level: "info", message: "Outgoing email is not configured on this Worker." });

  return {
    generated_at: now.toISOString(),
    customers: {
      families, parent_accounts: parents, child_profiles: children, suspended_families: suspended,
      new_families_7d: new7, new_families_30d: new30, registrations_14d: registrations14d,
      active_users: { configured: false, note: "Sign-in activity is not tracked, so active users are not reported." },
    },
    plans: {
      by_effective_plan: byPlan, paying_families: paid,
      stripe: stripeConfigured
        ? { configured: true, live: env.STRIPE_LIVE_ENABLED === "true" && /^(sk|rk)_live_/.test(env.STRIPE_SECRET_KEY ?? ""), subscription_status: Object.fromEntries((subStatus ?? []).map((r) => [r.status, Number(r.n)])), cancelling_at_period_end: cancelling }
        : { configured: false, note: "Stripe is not configured on this Worker." },
      revenue: { configured: false, note: "Revenue needs reconciled Stripe financial reports; it is never estimated from member counts." },
    },
    ai: aiConfigured || ai7 > 0
      ? {
          configured: aiConfigured, enabled: settings.features.aiEnabled,
          requests_24h: ai24, requests_7d: ai7, failed_24h: aiFailed24, families_using_7d: aiFamilies7,
          platform_cap_24h: settings.costSafeguards.aiDailyPlatformCap, by_kind_30d: kinds,
          cost: { configured: false, note: "Workers AI cost is billed by Cloudflare; see the Cloudflare dashboard. Request counts are shown instead." },
        }
      : { configured: false, note: "Workers AI is not bound to this Worker." },
    storage: env.BUCKET
      ? { configured: true, files, bytes }
      : { configured: false, files, bytes, note: "File storage (R2) is not configured, so uploads are switched off." },
    health: {
      errors_24h: errors24, errors_7d: errors7, top_error_routes_7d: topRoutes ?? [],
      stripe_events_unprocessed: stuckWebhooks, help_alerts_unsent: unsentHelp,
      email: env.EMAIL ? { configured: true } : { configured: false },
      warnings,
    },
  };
}

// ------------------------------------------------------------------ customers

export const FAMILY_ID = /^[A-Za-z0-9_-]{1,64}$/;
const PAGE = 25;

export type CustomerFilters = { q?: string; status?: "active" | "suspended"; plan?: Plan; page: number };

/** Families with metadata and counts only. Search matches a parent's email (contains) or an exact family id. */
export async function searchCustomers(db: D1Database, f: CustomerFilters, now = new Date()) {
  const where: string[] = [];
  const binds: unknown[] = [];
  if (f.q) {
    const like = `%${f.q.toLowerCase().replace(/[\\%_]/g, (m) => "\\" + m)}%`;
    where.push("(f.id = ? OR EXISTS (SELECT 1 FROM users su WHERE su.family_id = f.id AND lower(su.email) LIKE ? ESCAPE '\\'))");
    binds.push(f.q, like);
  }
  if (f.status === "suspended") where.push("s.status = 'suspended'");
  if (f.status === "active") where.push("COALESCE(s.status, 'active') = 'active'");
  const sql = `SELECT f.id, f.created_at, f.plan, f.trial_started_at, f.trial_ends_at, f.plan_period_end, f.jurisdiction,
      COALESCE(s.status, 'active') AS status,
      (SELECT email FROM users u WHERE u.id = f.owner_id) AS owner_email,
      (SELECT COUNT(*) FROM users u WHERE u.family_id = f.id) AS parents,
      (SELECT COUNT(*) FROM students st WHERE st.family_id = f.id) AS children
    FROM families f LEFT JOIN family_admin_state s ON s.family_id = f.id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY f.created_at DESC`;
  const { results } = await db.prepare(sql).bind(...binds).all<any>();
  let rows = (results ?? []).map((r) => ({
    id: r.id as string, created_at: r.created_at, status: r.status, jurisdiction: r.jurisdiction ?? null,
    owner_email: r.owner_email ?? null, parents: Number(r.parents), children: Number(r.children),
    plan: effectivePlan(r, now),
  }));
  // The plan filter uses the effective plan, which is computed in code (trial expiry etc.), so it is applied here.
  if (f.plan) rows = rows.filter((r) => r.plan === f.plan);
  const start = (f.page - 1) * PAGE;
  return { customers: rows.slice(start, start + PAGE), total: rows.length, page: f.page, page_size: PAGE };
}

export async function customerSummary(db: D1Database, familyId: string) {
  if (!FAMILY_ID.test(familyId)) return null;
  return db.prepare(
    `SELECT f.id, f.owner_id, COALESCE(s.status, 'active') AS status, COALESCE(s.auth_version, 0) AS auth_version
     FROM families f LEFT JOIN family_admin_state s ON s.family_id = f.id WHERE f.id = ?`,
  ).bind(familyId).first<{ id: string; owner_id: string; status: string; auth_version: number }>();
}

/** True when any parent of the family holds an active administrative role. */
export async function familyHasAdmin(db: D1Database, familyId: string) {
  return (await n(db, "SELECT COUNT(*) n FROM user_roles r JOIN users u ON u.id = r.user_id WHERE u.family_id = ? AND r.revoked_at IS NULL", familyId)) > 0;
}

export async function customerDetail(db: D1Database, familyId: string, now = new Date()) {
  if (!FAMILY_ID.test(familyId)) return null;
  const f = await db.prepare(
    `SELECT f.id, f.created_at, f.plan, f.trial_started_at, f.trial_ends_at, f.plan_period_end, f.jurisdiction,
            f.stripe_customer_id, f.stripe_subscription_id, f.billing_interval, f.subscription_status, f.cancel_at_period_end, f.billing_updated_at,
            COALESCE(s.status, 'active') AS status, s.suspended_at, s.suspended_reason
     FROM families f LEFT JOIN family_admin_state s ON s.family_id = f.id WHERE f.id = ?`,
  ).bind(familyId).first<any>();
  if (!f) return null;
  const { results: parents } = await db.prepare(
    `SELECT u.id, u.email, u.created_at, CASE WHEN u.password_hash IS NULL THEN 'google' ELSE COALESCE(u.oauth_provider, 'password') END AS sign_in,
            (u.id = ?) AS primary_parent,
            EXISTS (SELECT 1 FROM user_roles r WHERE r.user_id = u.id AND r.revoked_at IS NULL) AS has_admin_role
     FROM users u WHERE u.family_id = ? ORDER BY u.created_at`,
  ).bind(String(f.owner_id ?? ""), familyId).all<any>();
  // Children: how many, by stage. Never names, usernames, notes or interests.
  const { results: stages } = await db.prepare("SELECT stage, COUNT(*) AS n FROM students WHERE family_id = ? GROUP BY stage ORDER BY stage")
    .bind(familyId).all<{ stage: string; n: number }>();
  const c = (sql: string) => maybe(db, sql, familyId);
  const counts = {
    lessons: await c("SELECT COUNT(*) n FROM lessons WHERE family_id = ? AND archived_at IS NULL"),
    assignments: await c("SELECT COUNT(*) n FROM assignments WHERE family_id = ?"),
    submissions: await c("SELECT COUNT(*) n FROM submissions WHERE family_id = ?"),
    evidence_items: await c("SELECT (SELECT COUNT(*) FROM life_evidence WHERE family_id = ?1) + (SELECT COUNT(*) FROM evidence_notes WHERE family_id = ?1) AS n"),
    files: await c("SELECT COUNT(*) n FROM files WHERE family_id = ? AND is_deleted = 0"),
    file_bytes: await c("SELECT COALESCE(SUM(size), 0) n FROM files WHERE family_id = ? AND is_deleted = 0"),
    help_requests: await c("SELECT COUNT(*) n FROM help_requests WHERE family_id = ?"),
  };
  const { results: ai } = await db.prepare(
    "SELECT kind, COUNT(*) AS n FROM ai_usage WHERE family_id = ? AND created_at >= ? AND status != 'failed' GROUP BY kind ORDER BY kind",
  ).bind(familyId, iso(now.getTime() - 30 * DAY)).all<{ kind: string; n: number }>();
  const { results: events } = await db.prepare(
    "SELECT event_type, detail, created_at FROM security_events WHERE family_id = ? ORDER BY created_at DESC LIMIT 20",
  ).bind(familyId).all<any>();
  const { results: audit } = await db.prepare(
    "SELECT action, actor_label AS actor, detail_json, created_at FROM admin_audit_log WHERE target_type = 'family' AND target_id = ? ORDER BY created_at DESC LIMIT 20",
  ).bind(familyId).all<any>();
  return {
    id: f.id, created_at: f.created_at, jurisdiction: f.jurisdiction ?? null,
    status: f.status, suspended_at: f.suspended_at ?? null, suspended_reason: f.suspended_reason ?? null,
    parents: (parents ?? []).map((p) => ({ id: p.id, email: p.email, created_at: p.created_at, sign_in: p.sign_in, primary: !!p.primary_parent, admin: !!p.has_admin_role })),
    children: { total: (stages ?? []).reduce((s, r) => s + Number(r.n), 0), by_stage: Object.fromEntries((stages ?? []).map((r) => [r.stage || "unknown", Number(r.n)])) },
    billing: {
      plan: f.plan, effective_plan: effectivePlan(f, now), trial_ends_at: f.trial_ends_at ?? null, plan_period_end: f.plan_period_end ?? null,
      billing_interval: f.billing_interval ?? null, subscription_status: f.subscription_status ?? null, cancel_at_period_end: !!f.cancel_at_period_end,
      stripe_customer_id: f.stripe_customer_id ?? null, stripe_subscription_id: f.stripe_subscription_id ?? null, billing_updated_at: f.billing_updated_at ?? null,
    },
    counts,
    ai_requests_30d: Object.fromEntries((ai ?? []).map((r) => [r.kind, Number(r.n)])),
    security_events: events ?? [],
    admin_history: (audit ?? []).map((a) => ({ action: a.action, actor: a.actor, created_at: a.created_at, detail: safeJson(a.detail_json) })),
  };
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return {}; }
}
