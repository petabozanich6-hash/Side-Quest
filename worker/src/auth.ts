import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Context } from "hono";
import { isPlatformOwner, publicPlatformRole } from "./platformRole";
import type { AuthUser, Env, Vars } from "./types";

const ITERATIONS = 100000;
export const SESSION_DAYS = 30;
export const SESSION_COOKIE = "sq_session";

type SessionContext = Context<{ Bindings: Env; Variables: Vars }>;

function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(str: string): Uint8Array {
  const s = atob(str);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );
}

export async function hashSecret(secret: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derive(secret, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${toB64(bits)}`;
}

export async function verifySecret(secret: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  const salt = fromB64(parts[2]);
  const expected = fromB64(parts[3]);
  const actual = new Uint8Array(await derive(secret, salt, iterations));
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

function secureCookie(c: SessionContext) {
  return new URL(c.req.url).protocol === "https:";
}

export async function issueSession(c: SessionContext, sub: string, role: "parent" | "child", familyId: string) {
  const jti = crypto.randomUUID();
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const now = new Date().toISOString();
  await c.env.DB.prepare(
    "INSERT INTO auth_sessions (id, user_id, role, family_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(jti, sub, role, familyId, new Date(exp * 1000).toISOString(), now).run();
  const token = await sign({ sub, role, family_id: familyId, exp, jti }, c.env.JWT_SECRET);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie(c),
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return token;
}

export function clearSessionCookie(c: SessionContext) {
  deleteCookie(c, SESSION_COOKIE, {
    path: "/",
    secure: secureCookie(c),
    sameSite: "Lax",
  });
}

export function presentedToken(c: SessionContext, opts?: { allowQuery?: boolean }) {
  const header = c.req.header("Authorization") || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  if (opts?.allowQuery) {
    const query = c.req.query("auth");
    if (query) return query;
  }
  return getCookie(c, SESSION_COOKIE);
}

export async function authenticateToken(env: Env, token: string): Promise<AuthUser | null> {
  let payload: Record<string, unknown>;
  try {
    payload = await verify(token, env.JWT_SECRET, "HS256");
  } catch {
    return null;
  }
  const role = payload.role;
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const jti = typeof payload.jti === "string" ? payload.jti : "";
  if (!sub || !jti || (role !== "parent" && role !== "child")) return null;

  const session = await env.DB.prepare(
    "SELECT user_id, role, family_id, expires_at, revoked_at FROM auth_sessions WHERE id = ?"
  ).bind(jti).first<{ user_id: string; role: string; family_id: string; expires_at: string; revoked_at: string | null }>();
  if (!session || session.revoked_at || session.user_id !== sub || session.role !== role) return null;
  if (session.expires_at <= new Date().toISOString()) return null;

  if (role === "parent") {
    const row = await env.DB.prepare("SELECT id, family_id, name, email, platform_role FROM users WHERE id = ?")
      .bind(sub).first<{ id: string; family_id: string; name: string; email: string; platform_role: string | null }>();
    if (!row || row.family_id !== session.family_id) return null;
    const platform_role = publicPlatformRole(row.platform_role);
    return { id: row.id, family_id: row.family_id, name: row.name, email: row.email, role: "parent", platform_role, lifetime_access: isPlatformOwner(row.platform_role) };
  }
  const row = await env.DB.prepare("SELECT id, family_id, name FROM students WHERE id = ?")
    .bind(sub).first<{ id: string; family_id: string; name: string }>();
  if (!row || row.family_id !== session.family_id) return null;
  return { ...row, role: "child", platform_role: "parent", lifetime_access: false };
}

export async function revokePresentedSession(env: Env, token: string) {
  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    const jti = typeof payload.jti === "string" ? payload.jti : "";
    if (!jti) return;
    await env.DB.prepare("UPDATE auth_sessions SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL")
      .bind(new Date().toISOString(), jti).run();
  } catch {
    /* An expired token still needs its cookie cleared by the caller. */
  }
}

export async function revokeUserSessions(env: Env, userId: string) {
  try {
    await env.DB.prepare("UPDATE auth_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
      .bind(new Date().toISOString(), userId).run();
  } catch (error) {
    if (!/no such table/i.test(error instanceof Error ? error.message : String(error))) throw error;
  }
}
