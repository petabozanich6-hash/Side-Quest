// "View site as": lets the platform owner see Side-Quest the way a family on another plan sees it.
//
// - Only the owner can switch it, and it only ever changes the owner's OWN family. Every other family is untouched.
// - While it's on, getEntitlement() returns the simulated plan for that family, and owner-only shortcuts that grant
//   content (Printable Vault, Hands-on Vault, Quest Books) are switched off, so pages look exactly as they would for
//   that kind of family. Owner HQ and the owner admin endpoints keep checking the real role, so switching back works.
// - It switches itself off after VIEW_AS_HOURS so it can't be forgotten.
// - Stored in its own small table, created on first use (migration 0073 creates it too). Nothing in families changes.
import type { App, Guards } from "./types";
import type { Plan } from "./entitlements";
import { isPlatformOwner } from "./access";

type DB = D1Database;
export const VIEW_AS_HOURS = 2;
export const VIEW_AS_MODES: Record<string, Plan | null> = {
  owner: null,
  member: "ACTIVE_MONTHLY",
  free: "FREE_PREVIEW",
  expired: "PREVIEW_EXPIRED",
};
const LABEL: Record<string, string> = { owner: "Owner (normal)", member: "Family member", free: "Free preview", expired: "Preview ended" };

const CREATE = `CREATE TABLE IF NOT EXISTS owner_view_as (
  family_id TEXT PRIMARY KEY, mode TEXT NOT NULL, user_id TEXT NOT NULL, started_at TEXT NOT NULL, expires_at TEXT NOT NULL)`;

let ensured: Promise<void> | null = null;
function ensureTable(db: DB) {
  if (!ensured) ensured = db.prepare(CREATE).run().then(() => undefined).catch((e) => { ensured = null; throw e; });
  return ensured;
}

// A short in-isolate cache keeps this to (at most) one cheap query every few seconds for everyone else.
let active: { at: number; ids: Map<string, { mode: string; expires_at: string }> } | null = null;
const CACHE_MS = 5000;
export function clearViewAsCache() { active = null; }

async function activeRows(db: DB, now: Date) {
  if (active && now.getTime() - active.at < CACHE_MS) return active.ids;
  const ids = new Map<string, { mode: string; expires_at: string }>();
  try {
    const { results } = await db.prepare("SELECT family_id, mode, expires_at FROM owner_view_as WHERE expires_at > ?").bind(now.toISOString()).all<any>();
    for (const r of results || []) ids.set(r.family_id, { mode: r.mode, expires_at: r.expires_at });
  } catch {
    // Table not created yet: nobody is viewing as anyone.
  }
  active = { at: now.getTime(), ids };
  return ids;
}

/** The simulated plan for this family, or null when view-as is off (the normal case). */
export async function viewAsPlan(db: DB, familyId: string, now: Date = new Date()): Promise<Plan | null> {
  const row = (await activeRows(db, now)).get(familyId);
  return row ? VIEW_AS_MODES[row.mode] ?? null : null;
}

/** True when the owner should get owner-only content shortcuts right now (they're the owner and not viewing as a family). */
export async function ownerPowers(db: DB, user: { id: string; family_id: string }): Promise<boolean> {
  if (!(await isPlatformOwner(db, user.id))) return false;
  const row = (await activeRows(db, new Date())).get(user.family_id);
  return !row || row.mode === "owner";
}

export async function viewAsState(db: DB, familyId: string, now: Date = new Date()) {
  const row = (await activeRows(db, now)).get(familyId);
  const mode = row && VIEW_AS_MODES[row.mode] ? row.mode : "owner";
  return { mode, label: LABEL[mode], expires_at: mode === "owner" ? null : row!.expires_at };
}

export function registerViewAs(app: App, g: Guards) {
  const realOwner = async (c: any, next: any) => {
    if (!(await isPlatformOwner(c.env.DB, c.get("user").id))) return c.json({ detail: "Not found" }, 404);
    return next();
  };
  app.get("/api/owner/view-as", g.auth, g.parent, realOwner, async (c) => {
    c.header("Cache-Control", "no-store");
    return c.json({ ...(await viewAsState(c.env.DB, c.get("user").family_id)), modes: Object.keys(VIEW_AS_MODES).map((m) => ({ id: m, label: LABEL[m] })), hours: VIEW_AS_HOURS });
  });
  app.put("/api/owner/view-as", g.auth, g.parent, realOwner, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const mode = String(body?.mode || "");
    if (!(mode in VIEW_AS_MODES)) return c.json({ detail: "Choose owner, member, free or expired." }, 400);
    const user = c.get("user");
    await ensureTable(c.env.DB);
    if (mode === "owner") {
      await c.env.DB.prepare("DELETE FROM owner_view_as WHERE family_id = ?").bind(user.family_id).run();
    } else {
      const now = new Date();
      const expires = new Date(now.getTime() + VIEW_AS_HOURS * 3600_000).toISOString();
      await c.env.DB.prepare(`INSERT INTO owner_view_as (family_id, mode, user_id, started_at, expires_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(family_id) DO UPDATE SET mode = excluded.mode, user_id = excluded.user_id, started_at = excluded.started_at, expires_at = excluded.expires_at`)
        .bind(user.family_id, mode, user.id, now.toISOString(), expires).run();
    }
    clearViewAsCache();
    c.header("Cache-Control", "no-store");
    return c.json(await viewAsState(c.env.DB, user.family_id));
  });
}
