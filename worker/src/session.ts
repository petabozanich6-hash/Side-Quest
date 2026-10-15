/**
 * Sign-in tokens. Tokens are stateless HS256 JWTs; three claims make them revocable without a session table:
 * - sid: a random id per sign-in, so a passkey step-up belongs to one sign-in only (admin_step_up).
 * - av:  the family's auth_version (family_admin_state). "Sign out everywhere" and suspension bump it.
 * - cv:  a child's credential_version (migration 0058); a PIN change bumps it.
 * Tokens issued before this change carry no sid/av: av counts as 0, so they keep working until the family's
 * version is bumped. They cannot open Owner HQ (no sid), which only asks the Owner to sign in again.
 */
import { sign, verify } from "hono/jwt";
import type { AuthUser, Env } from "./types";

export const TOKEN_DAYS = 30;
export const SUSPENDED_MESSAGE = "This account is suspended. Please contact support@sidequestlearning.app.";

export type FamilyState = { status: "active" | "suspended"; authVersion: number };

export async function familyState(db: D1Database, familyId: string): Promise<FamilyState> {
  const row = await db.prepare("SELECT status, auth_version FROM family_admin_state WHERE family_id = ?")
    .bind(familyId).first<{ status: string; auth_version: number }>();
  return { status: row?.status === "suspended" ? "suspended" : "active", authVersion: Number(row?.auth_version ?? 0) };
}

export async function issueToken(env: Env, sub: string, role: "parent" | "child", familyId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_DAYS * 86400;
  const { authVersion } = await familyState(env.DB, familyId);
  const claims: Record<string, unknown> = { sub, role, family_id: familyId, sid: crypto.randomUUID(), av: authVersion, exp };
  if (role === "child") {
    const s = await env.DB.prepare("SELECT credential_version FROM students WHERE id = ? AND family_id = ?").bind(sub, familyId).first<{ credential_version: number }>();
    if (!s) throw new Error("Child not found");
    claims.cv = Number(s.credential_version ?? 0);
  }
  return sign(claims, env.JWT_SECRET);
}

export type TokenAuth =
  | { ok: true; user: AuthUser; sessionId: string | null }
  | { ok: false; status: 401 | 403; detail: string; code?: string };

/** Verifies a token against the database: the account exists, the family is active and the token is current. */
export async function authenticateToken(env: Env, token: string): Promise<TokenAuth> {
  let payload: any;
  try {
    payload = await verify(token, env.JWT_SECRET, "HS256");
  } catch {
    return { ok: false, status: 401, detail: "Invalid token" };
  }
  const role = payload?.role;
  if (!payload?.sub || (role !== "parent" && role !== "child")) return { ok: false, status: 401, detail: "Invalid authentication token" };
  const table = role === "parent" ? "users" : "students";
  const row = await env.DB.prepare(
    `SELECT t.id, t.family_id, t.name${role === "child" ? ", t.credential_version" : ""},
            COALESCE(s.status, 'active') AS family_status, COALESCE(s.auth_version, 0) AS auth_version
     FROM ${table} t LEFT JOIN family_admin_state s ON s.family_id = t.family_id WHERE t.id = ?`,
  ).bind(payload.sub).first<{ id: string; family_id: string; name: string; credential_version?: number; family_status: string; auth_version: number }>();
  if (!row) return { ok: false, status: 401, detail: "User not found" };
  if (row.family_status === "suspended") return { ok: false, status: 403, detail: SUSPENDED_MESSAGE, code: "ACCOUNT_SUSPENDED" };
  if (Number(payload.av ?? 0) !== Number(row.auth_version)) return { ok: false, status: 401, detail: "Session expired. Please sign in again." };
  // Child sessions die when the parent changes the PIN. Tokens from before credential versions count as version 0.
  if (role === "child" && Number(payload.cv ?? 0) !== Number(row.credential_version ?? 0)) return { ok: false, status: 401, detail: "Session expired. Please sign in again." };
  const sessionId = typeof payload.sid === "string" && /^[0-9a-f-]{36}$/.test(payload.sid) ? payload.sid : null;
  return { ok: true, user: { id: row.id, family_id: row.family_id, name: row.name, role }, sessionId };
}

/** Signs every parent and child of a family out of every device. Returns the new auth version. */
export async function bumpAuthVersion(db: D1Database, familyId: string): Promise<number> {
  await db.prepare(
    `INSERT INTO family_admin_state (family_id, auth_version, updated_at) VALUES (?, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     ON CONFLICT(family_id) DO UPDATE SET auth_version = auth_version + 1, updated_at = excluded.updated_at`,
  ).bind(familyId).run();
  // Passkey step-ups of that family's parents end with their sessions.
  await db.prepare("DELETE FROM admin_step_up WHERE user_id IN (SELECT id FROM users WHERE family_id = ?)").bind(familyId).run();
  return (await familyState(db, familyId)).authVersion;
}
