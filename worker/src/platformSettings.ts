/**
 * Owner-managed platform settings, stored in D1 (`platform_settings`).
 *
 * Every key has a strict validator, a default that keeps today's behaviour, and hard limits. Secrets never live here:
 * Cloudflare secrets (JWT_SECRET, STRIPE_*, YOUTUBE_API_KEY, ...) can be neither read nor written through settings.
 */
import type { Env } from "./types";

export type Announcement = { enabled: boolean; message: string; tone: "info" | "warning" };
export type Maintenance = { enabled: boolean; message: string };
export type Features = {
  /** New family sign-ups (email and Google). Existing families can always sign in. */
  registrationsOpen: boolean;
  /** Master switch for every Workers AI call (lesson drafting, help, planning, ...). Templates keep working. */
  aiEnabled: boolean;
  /** YouTube video suggestions (uses the YouTube Data API quota). */
  videoSearch: boolean;
};
export type CostSafeguards = {
  /** Most AI requests the whole platform may make in any rolling 24 hours. Per-family fair-use caps still apply. */
  aiDailyPlatformCap: number;
};

export type PlatformSettings = { announcement: Announcement; maintenance: Maintenance; features: Features; costSafeguards: CostSafeguards };
export type SettingKey = keyof PlatformSettings;
export const SETTING_KEYS: readonly SettingKey[] = ["announcement", "maintenance", "features", "costSafeguards"];

/** Hard ceilings no administrative update may exceed. */
export const LIMITS = {
  messageLength: 280,
  aiDailyPlatformCapMax: 20000,
  /** Raising the platform AI cap above this counts as a high-cost change. */
  aiDailyPlatformCapHighImpact: 5000,
} as const;

export function defaultSettings(): PlatformSettings {
  return {
    announcement: { enabled: false, message: "", tone: "info" },
    maintenance: { enabled: false, message: "" },
    features: { registrationsOpen: true, aiEnabled: true, videoSearch: true },
    costSafeguards: { aiDailyPlatformCap: 2000 },
  };
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const fail = (error: string) => ({ ok: false as const, error });

function onlyKeys(v: Record<string, unknown>, keys: string[]): string | null {
  const extra = Object.keys(v).filter((k) => !keys.includes(k));
  return extra.length ? `Unknown field: ${extra[0]}` : null;
}
function bool(v: unknown, name: string): Result<boolean> {
  return typeof v === "boolean" ? { ok: true, value: v } : fail(`${name} must be true or false`);
}
function int(v: unknown, name: string, min: number, max: number): Result<number> {
  if (typeof v !== "number" || !Number.isInteger(v)) return fail(`${name} must be a whole number`);
  if (v < min || v > max) return fail(`${name} must be between ${min} and ${max}`);
  return { ok: true, value: v };
}
function message(v: unknown, name: string): Result<string> {
  if (typeof v !== "string") return fail(`${name} must be text`);
  const t = v.trim();
  if (t.length > LIMITS.messageLength) return fail(`${name} must be ${LIMITS.messageLength} characters or fewer`);
  // Plain text only. React renders it as text anyway, but refuse markup outright.
  if (/[<>]/.test(t)) return fail(`${name} cannot contain < or >`);
  return { ok: true, value: t };
}

export function validateSetting<K extends SettingKey>(key: K, raw: unknown): Result<PlatformSettings[K]> {
  if (!isObject(raw)) return fail("Value must be an object");
  const ok = (value: unknown) => ({ ok: true as const, value: value as PlatformSettings[K] });
  switch (key) {
    case "announcement": {
      const extra = onlyKeys(raw, ["enabled", "message", "tone"]);
      if (extra) return fail(extra);
      const enabled = bool(raw.enabled, "enabled");
      if (!enabled.ok) return enabled;
      const msg = message(raw.message, "message");
      if (!msg.ok) return msg;
      if (raw.tone !== "info" && raw.tone !== "warning") return fail("tone must be info or warning");
      if (enabled.value && !msg.value) return fail("An announcement that is switched on needs a message");
      return ok({ enabled: enabled.value, message: msg.value, tone: raw.tone });
    }
    case "maintenance": {
      const extra = onlyKeys(raw, ["enabled", "message"]);
      if (extra) return fail(extra);
      const enabled = bool(raw.enabled, "enabled");
      if (!enabled.ok) return enabled;
      const msg = message(raw.message, "message");
      if (!msg.ok) return msg;
      if (enabled.value && !msg.value) return fail("A maintenance notice that is switched on needs a message");
      return ok({ enabled: enabled.value, message: msg.value });
    }
    case "features": {
      const keys = ["registrationsOpen", "aiEnabled", "videoSearch"];
      const extra = onlyKeys(raw, keys);
      if (extra) return fail(extra);
      const out: Record<string, boolean> = {};
      for (const k of keys) {
        const b = bool(raw[k], k);
        if (!b.ok) return b;
        out[k] = b.value;
      }
      return ok(out);
    }
    case "costSafeguards": {
      const extra = onlyKeys(raw, ["aiDailyPlatformCap"]);
      if (extra) return fail(extra);
      const n = int(raw.aiDailyPlatformCap, "aiDailyPlatformCap", 0, LIMITS.aiDailyPlatformCapMax);
      if (!n.ok) return n;
      return ok({ aiDailyPlatformCap: n.value });
    }
  }
  return fail("Unknown setting");
}

export const isSettingKey = (v: string): v is SettingKey => (SETTING_KEYS as readonly string[]).includes(v);

/** Changes that could raise costs or shut customers out need an explicit confirmation. Human-readable reasons. */
export function highImpactReasons<K extends SettingKey>(key: K, current: PlatformSettings[K], next: PlatformSettings[K]): string[] {
  const reasons: string[] = [];
  if (key === "features") {
    const c = current as Features, n = next as Features;
    if (!c.aiEnabled && n.aiEnabled) reasons.push("Turns paid AI calls back on for every family");
    if (c.aiEnabled && !n.aiEnabled) reasons.push("Switches AI off for every family, including paying members");
    if (c.registrationsOpen && !n.registrationsOpen) reasons.push("Stops new families from signing up");
    if (!c.videoSearch && n.videoSearch) reasons.push("Turns YouTube API calls back on");
  }
  if (key === "costSafeguards") {
    const c = current as CostSafeguards, n = next as CostSafeguards;
    if (n.aiDailyPlatformCap > c.aiDailyPlatformCap && n.aiDailyPlatformCap > LIMITS.aiDailyPlatformCapHighImpact) {
      reasons.push(`Raises the platform AI limit above ${LIMITS.aiDailyPlatformCapHighImpact} requests a day`);
    }
    if (n.aiDailyPlatformCap === 0 && c.aiDailyPlatformCap > 0) reasons.push("A limit of 0 stops all AI requests");
  }
  if (key === "maintenance") {
    const c = current as Maintenance, n = next as Maintenance;
    if (!c.enabled && n.enabled) reasons.push("Shows a maintenance notice to every family and child");
  }
  return reasons;
}

// ------------------------------------------------------------------ storage

const CACHE_MS = 30_000;
let cache: { at: number; value: PlatformSettings } | null = null;
/** Settings are cached per Worker instance for 30 seconds; other instances see a change within that time. */
export function clearSettingsCache() {
  cache = null;
}

export async function loadPlatformSettings(db: D1Database, opts: { fresh?: boolean } = {}): Promise<PlatformSettings> {
  if (!opts.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  const merged: PlatformSettings = defaultSettings();
  const { results } = await db.prepare("SELECT key, value_json FROM platform_settings").all<{ key: string; value_json: string }>();
  for (const row of results ?? []) {
    if (!isSettingKey(row.key)) continue;
    let parsed: unknown;
    try { parsed = JSON.parse(row.value_json); } catch { continue; }
    const checked = validateSetting(row.key, parsed);
    // An invalid stored value falls back to the safe default.
    if (checked.ok) (merged as Record<SettingKey, unknown>)[row.key] = checked.value;
  }
  cache = { at: Date.now(), value: merged };
  return merged;
}

export async function saveSetting<K extends SettingKey>(db: D1Database, key: K, value: PlatformSettings[K], updatedBy: string) {
  await db.prepare(
    `INSERT INTO platform_settings (key, value_json, updated_by, updated_at) VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).bind(key, JSON.stringify(value), updatedBy).run();
  clearSettingsCache();
}

// ------------------------------------------------------------ enforcement

/** AI requests counted against the platform cap in the last 24 hours (failed attempts excluded, as per-family caps do). */
export async function aiRequestsLast24h(db: D1Database, now = new Date()): Promise<number> {
  const since = new Date(now.getTime() - 86400000).toISOString();
  const row = await db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE created_at >= ? AND status != 'failed'").bind(since).first<{ n: number }>();
  return Number(row?.n ?? 0);
}

let usageCache: { at: number; n: number } | null = null;
/** Tests only. */
export function clearUsageCache() {
  usageCache = null;
}

/**
 * Applies the feature switches and cost safeguards to a request's bindings. Every AI code path already treats a
 * missing AI binding as "AI unavailable" (and offers templates), and video search treats a missing YouTube key as
 * "not configured", so withholding them here is a single, safe choke point.
 * Never throws: if settings cannot be read, the request carries on with today's behaviour.
 */
export async function applyPlatformSettings(env: Env): Promise<Env> {
  if (!env.DB) return env;
  try {
    const s = await loadPlatformSettings(env.DB);
    let out = env;
    if (env.AI) {
      let withhold = !s.features.aiEnabled;
      if (!withhold) {
        if (!usageCache || Date.now() - usageCache.at > 60_000) usageCache = { at: Date.now(), n: await aiRequestsLast24h(env.DB) };
        withhold = usageCache.n >= s.costSafeguards.aiDailyPlatformCap;
      }
      if (withhold) out = { ...out, AI: undefined };
    }
    if (env.YOUTUBE_API_KEY && !s.features.videoSearch) out = { ...out, YOUTUBE_API_KEY: undefined };
    return out;
  } catch (e) {
    console.error("platform settings unavailable", e instanceof Error ? e.name : "error");
    return env;
  }
}

/** What every visitor may see: only switched-on notices, as plain text. */
export async function publicNotices(db: D1Database) {
  const s = await loadPlatformSettings(db);
  return {
    announcement: s.announcement.enabled ? { message: s.announcement.message, tone: s.announcement.tone } : null,
    maintenance: s.maintenance.enabled ? { message: s.maintenance.message } : null,
    registrations_open: s.features.registrationsOpen,
  };
}
