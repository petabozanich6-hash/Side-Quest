import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Context } from "hono";

import {
  clearSessionCookie,
  issueSession,
  presentedToken,
  revokePresentedSession,
  verifySecret,
} from "./auth";
import { isPlatformOwner, publicPlatformRole } from "./platformRole";
import { sendEmail, welcomeEmail } from "./email";
import type { App, Env, Vars } from "./types";

/** Google redirects the browser here. The path is fixed; the origin comes from the request. */
export const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback";

const OAUTH_COOKIE = "sq_oauth";
const BIND_COOKIE = "sq_login_bind";
const OAUTH_COOKIE_PATH = "/api/auth/google";
const OAUTH_TTL_SECONDS = 10 * 60;
const TICKET_TTL_MS = 2 * 60 * 1000;
const LINK_TTL_SECONDS = 15 * 60;
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";
const ALLOWED_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

type AuthContext = Context<{ Bindings: Env; Variables: Vars }>;

export type GoogleProfile = {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
};

export type GoogleUser = {
  id: string;
  family_id: string;
  email: string;
  name: string;
  picture: string | null;
  password_hash: string | null;
  google_sub: string | null;
  oauth_provider: string | null;
  is_owner: number;
  platform_role: string;
  created_at: string;
};

export type GoogleAccounts = {
  findBySub(sub: string): Promise<GoogleUser | null>;
  findByEmail(email: string): Promise<GoogleUser | null>;
  updateReturning(userId: string, patch: { picture: string | null; email?: string }): Promise<void>;
  attachSub(userId: string, sub: string, picture: string | null): Promise<boolean>;
  linkSub(userId: string, email: string, sub: string, picture: string | null): Promise<boolean>;
  create(profile: GoogleProfile): Promise<GoogleUser>;
};

export type GoogleResolution =
  | { status: "signed_in"; isNew: boolean; user: GoogleUser }
  | { status: "link_required"; userId: string; email: string; name: string; picture: string | null; googleSub: string }
  | { status: "conflict"; detail: string };

type VerifyFailure = "invalid" | "audience" | "issuer" | "expired" | "unverified" | "nonce";
type Jwk = JsonWebKey & { kid?: string };

const USER_COLUMNS =
  "id, family_id, email, name, picture, password_hash, google_sub, oauth_provider, is_owner, platform_role, created_at";

let jwksCache: { keys: Jwk[]; exp: number } | null = null;

export function googleRedirectUri(requestUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const production = host === "sidequestlearning.app" || host === "www.sidequestlearning.app";
  const local = host === "localhost" || host === "127.0.0.1";
  if (production) {
    if (url.protocol !== "https:") return null;
  } else if (!local) {
    return null;
  } else if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }
  return `${url.origin}${GOOGLE_CALLBACK_PATH}`;
}

export function safePicture(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 500) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (host !== "lh3.googleusercontent.com" && !host.endsWith(".googleusercontent.com")) return null;
    return value;
  } catch {
    return null;
  }
}

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(value: string): Uint8Array {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function randomToken(bytes = 32): string {
  return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

function cookieBase(c: AuthContext) {
  return {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Lax" as const,
    path: OAUTH_COOKIE_PATH,
  };
}

function publicUser(user: GoogleUser) {
  return {
    id: user.id,
    family_id: user.family_id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    oauth_provider: user.oauth_provider,
    is_owner: user.is_owner,
    platform_role: publicPlatformRole(user.platform_role),
    lifetime_access: isPlatformOwner(user.platform_role),
    created_at: user.created_at,
    role: "parent" as const,
  };
}

function isUniqueError(error: unknown) {
  return /unique/i.test(error instanceof Error ? error.message : String(error));
}

export function normaliseGoogleProfile(raw: {
  sub?: unknown;
  email?: unknown;
  name?: unknown;
  picture?: unknown;
}): GoogleProfile | null {
  const sub = String(raw.sub || "").trim();
  const email = String(raw.email || "").trim().toLowerCase();
  if (!sub || sub.length > 255 || /\s/.test(sub)) return null;
  if (!email.includes("@") || email.length > 254 || /\s/.test(email)) return null;
  const name = String(raw.name || email.split("@")[0]).trim().slice(0, 80) || email.split("@")[0];
  return { sub, email, name, picture: safePicture(raw.picture) };
}

export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string,
  options: { nonce?: string; now?: number; jwks?: Jwk[]; fetchImpl?: typeof fetch } = {}
): Promise<{ ok: true; profile: GoogleProfile } | { ok: false; code: VerifyFailure }> {
  const parts = idToken.split(".");
  if (parts.length !== 3) return { ok: false, code: "invalid" };
  let header: { alg?: string; kid?: string };
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
  } catch {
    return { ok: false, code: "invalid" };
  }
  if (header.alg !== "RS256" || !header.kid) return { ok: false, code: "invalid" };

  const keys = options.jwks ?? (await fetchGoogleJwks(options.fetchImpl));
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) return { ok: false, code: "invalid" };

  let signatureOk = false;
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    signatureOk = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
  } catch {
    return { ok: false, code: "invalid" };
  }
  if (!signatureOk) return { ok: false, code: "invalid" };

  let claims: Record<string, unknown>;
  try {
    claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  } catch {
    return { ok: false, code: "invalid" };
  }

  const now = options.now ?? Math.floor(Date.now() / 1000);
  const exp = typeof claims.exp === "number" ? claims.exp : 0;
  const iat = typeof claims.iat === "number" ? claims.iat : 0;
  if (!exp || exp < now - 60 || (iat && iat > now + 60)) return { ok: false, code: "expired" };
  if (!ALLOWED_ISSUERS.has(String(claims.iss || ""))) return { ok: false, code: "issuer" };
  const aud = claims.aud;
  const audOk = aud === clientId || (Array.isArray(aud) && aud.includes(clientId));
  if (!audOk || (claims.azp && claims.azp !== clientId)) return { ok: false, code: "audience" };
  if (options.nonce && !safeEqual(String(claims.nonce || ""), options.nonce)) return { ok: false, code: "nonce" };
  if (claims.email_verified !== true && claims.email_verified !== "true") return { ok: false, code: "unverified" };

  const profile = normaliseGoogleProfile(claims);
  if (!profile) return { ok: false, code: "invalid" };
  return { ok: true, profile };
}

async function fetchGoogleJwks(fetchImpl: typeof fetch = fetch): Promise<Jwk[]> {
  if (jwksCache && jwksCache.exp > Date.now()) return jwksCache.keys;
  const response = await fetchImpl(GOOGLE_JWKS);
  if (!response.ok) return [];
  const body = (await response.json()) as { keys?: Jwk[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  jwksCache = { keys, exp: Date.now() + 60 * 60 * 1000 };
  return keys;
}

export async function sealOauth(
  secret: string,
  fields: { state: string; verifier: string; nonce: string }
): Promise<string> {
  return sign(
    {
      purpose: "google_oauth",
      state: fields.state,
      verifier: fields.verifier,
      nonce: fields.nonce,
      exp: Math.floor(Date.now() / 1000) + OAUTH_TTL_SECONDS,
    },
    secret
  );
}

export async function openOauth(
  secret: string,
  token: string
): Promise<{ state: string; verifier: string; nonce: string } | null> {
  try {
    const payload = await verify(token, secret, "HS256");
    if (payload.purpose !== "google_oauth") return null;
    const state = String(payload.state || "");
    const verifier = String(payload.verifier || "");
    const nonce = String(payload.nonce || "");
    if (!state || !verifier || !nonce) return null;
    return { state, verifier, nonce };
  } catch {
    return null;
  }
}

export async function signGoogleLinkToken(
  secret: string,
  claims: { uid: string; googleSub: string; email: string; name: string; picture: string | null }
): Promise<string> {
  return sign(
    {
      purpose: "google_link",
      uid: claims.uid,
      google_sub: claims.googleSub,
      email: claims.email,
      name: claims.name,
      picture: claims.picture || "",
      exp: Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS,
    },
    secret
  );
}

export async function readGoogleLinkToken(
  secret: string,
  token: string
): Promise<{ uid: string; googleSub: string; email: string; name: string; picture: string | null } | null> {
  try {
    const payload = await verify(token, secret, "HS256");
    if (payload.purpose !== "google_link") return null;
    const uid = String(payload.uid || "");
    const googleSub = String(payload.google_sub || "");
    const email = String(payload.email || "").trim().toLowerCase();
    const name = String(payload.name || "").trim();
    if (!uid || !googleSub || !email.includes("@") || !name) return null;
    return { uid, googleSub, email, name, picture: safePicture(payload.picture) };
  } catch {
    return null;
  }
}

const CONFLICT = "This email is already linked to a different Google account. Sign in with that Google account, or with your Side Quest password.";

export async function resolveGoogleSignIn(accounts: GoogleAccounts, profile: GoogleProfile): Promise<GoogleResolution> {
  const bySub = await accounts.findBySub(profile.sub);
  if (bySub) {
    let email = bySub.email;
    if (bySub.email !== profile.email) {
      const owner = await accounts.findByEmail(profile.email);
      if (!owner || owner.id === bySub.id) email = profile.email;
    }
    await accounts.updateReturning(bySub.id, {
      picture: profile.picture,
      email: email !== bySub.email ? email : undefined,
    });
    return {
      status: "signed_in",
      isNew: false,
      user: { ...bySub, email, picture: profile.picture ?? bySub.picture },
    };
  }

  const byEmail = await accounts.findByEmail(profile.email);
  if (byEmail) {
    if (byEmail.google_sub && byEmail.google_sub !== profile.sub) return { status: "conflict", detail: CONFLICT };
    if (byEmail.password_hash) {
      return {
        status: "link_required",
        userId: byEmail.id,
        email: byEmail.email,
        name: profile.name,
        picture: profile.picture,
        googleSub: profile.sub,
      };
    }
    const attached = await accounts.attachSub(byEmail.id, profile.sub, profile.picture);
    if (!attached) {
      const again = await accounts.findBySub(profile.sub);
      if (again) return { status: "signed_in", isNew: false, user: again };
      return { status: "conflict", detail: CONFLICT };
    }
    return {
      status: "signed_in",
      isNew: false,
      user: { ...byEmail, google_sub: profile.sub, oauth_provider: "google", picture: profile.picture ?? byEmail.picture },
    };
  }

  try {
    const created = await accounts.create(profile);
    return { status: "signed_in", isNew: true, user: created };
  } catch (error) {
    if (!isUniqueError(error)) throw error;
    const againSub = await accounts.findBySub(profile.sub);
    if (againSub) return { status: "signed_in", isNew: false, user: againSub };
    const againEmail = await accounts.findByEmail(profile.email);
    if (againEmail?.password_hash) {
      return {
        status: "link_required",
        userId: againEmail.id,
        email: againEmail.email,
        name: profile.name,
        picture: profile.picture,
        googleSub: profile.sub,
      };
    }
    if (againEmail && !againEmail.google_sub) {
      const attached = await accounts.attachSub(againEmail.id, profile.sub, profile.picture);
      if (attached) {
        return {
          status: "signed_in",
          isNew: false,
          user: { ...againEmail, google_sub: profile.sub, oauth_provider: "google", picture: profile.picture ?? againEmail.picture },
        };
      }
    }
    return { status: "conflict", detail: CONFLICT };
  }
}

function rowToUser(row: GoogleUser | null): GoogleUser | null {
  return row ? { ...row, picture: row.picture ?? null, google_sub: row.google_sub ?? null } : null;
}

export function createD1GoogleAccounts(db: D1Database): GoogleAccounts {
  return {
    async findBySub(sub) {
      return rowToUser(await db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE google_sub = ?`).bind(sub).first<GoogleUser>());
    },
    async findByEmail(email) {
      return rowToUser(await db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE email = ?`).bind(email).first<GoogleUser>());
    },
    async updateReturning(userId, patch) {
      if (patch.email) {
        await db.prepare("UPDATE users SET picture = COALESCE(?, picture), email = ? WHERE id = ?")
          .bind(patch.picture, patch.email, userId).run();
      } else {
        await db.prepare("UPDATE users SET picture = COALESCE(?, picture) WHERE id = ?")
          .bind(patch.picture, userId).run();
      }
    },
    async attachSub(userId, sub, picture) {
      const result = await db.prepare(
        "UPDATE users SET google_sub = ?, oauth_provider = 'google', picture = COALESCE(?, picture) WHERE id = ? AND google_sub IS NULL AND password_hash IS NULL"
      ).bind(sub, picture, userId).run();
      return (result.meta?.changes ?? 0) === 1;
    },
    async linkSub(userId, email, sub, picture) {
      const result = await db.prepare(
        "UPDATE users SET google_sub = ?, oauth_provider = 'google', picture = COALESCE(?, picture) WHERE id = ? AND email = ? AND google_sub IS NULL AND password_hash IS NOT NULL"
      ).bind(sub, picture, userId, email).run();
      return (result.meta?.changes ?? 0) === 1;
    },
    async create(profile) {
      const familyId = crypto.randomUUID();
      const userId = crypto.randomUUID();
      const ts = new Date().toISOString();
      try {
        await db.batch([
          db.prepare("INSERT INTO families (id, name, owner_id, created_at) VALUES (?, ?, ?, ?)")
            .bind(familyId, `${profile.name}'s Family`, userId, ts),
          db.prepare(
            "INSERT INTO users (id, family_id, email, password_hash, name, picture, oauth_provider, google_sub, is_owner, platform_role, created_at) VALUES (?, ?, ?, NULL, ?, ?, 'google', ?, 1, 'parent', ?)"
          ).bind(userId, familyId, profile.email, profile.name, profile.picture, profile.sub, ts),
        ]);
      } catch (error) {
        await db.prepare(
          "DELETE FROM families WHERE id = ? AND owner_id = ? AND NOT EXISTS (SELECT 1 FROM users WHERE family_id = families.id)"
        ).bind(familyId, userId).run().catch(() => undefined);
        throw error;
      }
      return {
        id: userId,
        family_id: familyId,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        password_hash: null,
        google_sub: profile.sub,
        oauth_provider: "google",
        is_owner: 1,
        platform_role: "parent",
        created_at: ts,
      };
    },
  };
}

function loginError(c: AuthContext, code: string) {
  c.header("Cache-Control", "no-store");
  c.header("Referrer-Policy", "no-referrer");
  return c.redirect(`/login?error=${encodeURIComponent(code)}`);
}

function clearOauthCookie(c: AuthContext) {
  deleteCookie(c, OAUTH_COOKIE, cookieBase(c));
}

async function finishResolution(c: AuthContext, resolution: GoogleResolution) {
  c.header("Cache-Control", "no-store");
  if (resolution.status === "conflict") return c.json({ detail: resolution.detail }, 409);
  if (resolution.status === "link_required") {
    const linkToken = await signGoogleLinkToken(c.env.JWT_SECRET, {
      uid: resolution.userId,
      googleSub: resolution.googleSub,
      email: resolution.email,
      name: resolution.name,
      picture: resolution.picture,
    });
    return c.json({ status: "link_required", link_token: linkToken, email: resolution.email });
  }
  if (resolution.isNew) {
    const sending = sendEmail(c.env, welcomeEmail(resolution.user.email, resolution.user.name));
    try { c.executionCtx.waitUntil(sending); } catch { /* tests have no execution context */ }
  }
  const token = await issueSession(c, resolution.user.id, "parent", resolution.user.family_id);
  return c.json({ token, user: publicUser(resolution.user), is_new: resolution.isNew });
}

async function storeTicket(c: AuthContext, kind: "session" | "link", payload: Record<string, unknown>) {
  const ticket = randomToken();
  const bind = randomToken();
  const expires = new Date(Date.now() + TICKET_TTL_MS).toISOString();
  await c.env.DB.prepare(
    "INSERT INTO oauth_login_tickets (token_hash, bind_hash, kind, payload, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(await sha256Hex(ticket), await sha256Hex(bind), kind, JSON.stringify(payload), expires, new Date().toISOString()).run();
  setCookie(c, BIND_COOKIE, bind, { ...cookieBase(c), maxAge: Math.floor(TICKET_TTL_MS / 1000) });
  c.header("Cache-Control", "no-store");
  c.header("Referrer-Policy", "no-referrer");
  return c.redirect(`/auth/callback?ticket=${encodeURIComponent(ticket)}`);
}

export function registerGoogleAuth(app: App) {
  app.post("/api/auth/logout", async (c) => {
    const token = presentedToken(c);
    if (token) await revokePresentedSession(c.env, token);
    clearSessionCookie(c);
    c.header("Cache-Control", "no-store");
    return c.json({ ok: true });
  });

  app.post("/api/auth/session", (c) =>
    c.json({ detail: "This sign-in link is no longer used. Choose Google, or sign in with email and password." }, 410)
  );

  app.get("/api/auth/google/start", async (c) => {
    const redirectUri = googleRedirectUri(c.req.url);
    const clientId = c.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    const clientSecret = c.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
    if (!redirectUri) return loginError(c, "google_failed");
    if (!clientId || !clientSecret || !c.env.JWT_SECRET) return loginError(c, "google_config");

    const state = randomToken();
    const verifier = randomToken();
    const nonce = randomToken();
    const sealed = await sealOauth(c.env.JWT_SECRET, { state, verifier, nonce });
    setCookie(c, OAUTH_COOKIE, sealed, { ...cookieBase(c), maxAge: OAUTH_TTL_SECONDS });

    const url = new URL(GOOGLE_AUTH);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);
    url.searchParams.set("nonce", nonce);
    url.searchParams.set("code_challenge", await pkceChallenge(verifier));
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("prompt", "select_account");
    c.header("Cache-Control", "no-store");
    c.header("Referrer-Policy", "no-referrer");
    return c.redirect(url.toString());
  });

  app.get("/api/auth/google/callback", async (c) => {
    const redirectUri = googleRedirectUri(c.req.url);
    const clientId = c.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    const clientSecret = c.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
    if (!redirectUri || !clientId || !clientSecret || !c.env.JWT_SECRET) return loginError(c, "google_config");

    const sealed = getCookie(c, OAUTH_COOKIE);
    const pending = sealed ? await openOauth(c.env.JWT_SECRET, sealed) : null;
    clearOauthCookie(c);
    const returnedState = c.req.query("state") || "";
    if (!pending || !safeEqual(pending.state, returnedState)) return loginError(c, "google_state");

    const oauthError = c.req.query("error");
    if (oauthError === "access_denied") return loginError(c, "google_cancelled");
    if (oauthError) return loginError(c, "google_failed");

    const code = c.req.query("code") || "";
    if (!code) return loginError(c, "google_failed");

    const tokenResponse = await fetch(GOOGLE_TOKEN, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: pending.verifier,
      }),
    }).catch(() => null);
    if (!tokenResponse?.ok) {
      console.error("google token exchange failed", tokenResponse?.status ?? "network");
      return loginError(c, "google_failed");
    }
    const tokens = (await tokenResponse.json()) as { id_token?: string };
    if (!tokens.id_token) return loginError(c, "google_failed");

    const verified = await verifyGoogleIdToken(tokens.id_token, clientId, { nonce: pending.nonce });
    if (!verified.ok) {
      const codeMap: Record<VerifyFailure, string> = {
        unverified: "google_denied",
        expired: "google_expired",
        nonce: "google_state",
        audience: "google_failed",
        issuer: "google_failed",
        invalid: "google_failed",
      };
      return loginError(c, codeMap[verified.code]);
    }

    const resolution = await resolveGoogleSignIn(createD1GoogleAccounts(c.env.DB), verified.profile);
    if (resolution.status === "conflict") return loginError(c, "google_conflict");
    if (resolution.status === "link_required") {
      const linkToken = await signGoogleLinkToken(c.env.JWT_SECRET, {
        uid: resolution.userId,
        googleSub: resolution.googleSub,
        email: resolution.email,
        name: resolution.name,
        picture: resolution.picture,
      });
      return storeTicket(c, "link", { link_token: linkToken, email: resolution.email });
    }
    if (resolution.isNew) {
      const sending = sendEmail(c.env, welcomeEmail(resolution.user.email, resolution.user.name));
      try { c.executionCtx.waitUntil(sending); } catch { /* no execution context */ }
    }
    return storeTicket(c, "session", { user_id: resolution.user.id, is_new: resolution.isNew });
  });

  app.post("/api/auth/google/exchange", async (c) => {
    c.header("Cache-Control", "no-store");
    const body = await c.req.json().catch(() => ({}));
    const ticket = String(body.ticket || "");
    const bind = getCookie(c, BIND_COOKIE) || "";
    if (!ticket || !bind || ticket.length > 200) {
      return c.json({ detail: "This Google sign-in has expired. Please try again." }, 401);
    }
    const now = new Date().toISOString();
    const row = await c.env.DB.prepare(
      "SELECT kind, payload FROM oauth_login_tickets WHERE token_hash = ? AND bind_hash = ? AND used_at IS NULL AND expires_at > ?"
    ).bind(await sha256Hex(ticket), await sha256Hex(bind), now).first<{ kind: string; payload: string }>();
    if (!row) return c.json({ detail: "This Google sign-in has expired. Please try again." }, 401);

    const claim = await c.env.DB.prepare(
      "UPDATE oauth_login_tickets SET used_at = ? WHERE token_hash = ? AND used_at IS NULL"
    ).bind(now, await sha256Hex(ticket)).run();
    deleteCookie(c, BIND_COOKIE, cookieBase(c));
    if (!claim.meta?.changes) return c.json({ detail: "This Google sign-in has expired. Please try again." }, 401);

    let payload: { user_id?: string; link_token?: string; email?: string; is_new?: boolean };
    try {
      payload = JSON.parse(row.payload);
    } catch {
      return c.json({ detail: "This Google sign-in has expired. Please try again." }, 401);
    }
    if (row.kind === "link" && payload.link_token && payload.email) {
      return c.json({ status: "link_required", link_token: payload.link_token, email: payload.email });
    }
    if (row.kind !== "session" || !payload.user_id) {
      return c.json({ detail: "This Google sign-in has expired. Please try again." }, 401);
    }
    const user = await c.env.DB.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`).bind(payload.user_id).first<GoogleUser>();
    if (!user) return c.json({ detail: "Account not found" }, 401);
    const token = await issueSession(c, user.id, "parent", user.family_id);
    return c.json({ token, user: publicUser(user), is_new: !!payload.is_new });
  });

  app.post("/api/auth/google/link", async (c) => {
    c.header("Cache-Control", "no-store");
    const body = await c.req.json().catch(() => ({}));
    const parsed = await readGoogleLinkToken(c.env.JWT_SECRET, String(body.link_token || ""));
    if (!parsed) return c.json({ detail: "This linking request has expired. Start Google sign-in again." }, 401);

    const accounts = createD1GoogleAccounts(c.env.DB);
    const user = await accounts.findByEmail(parsed.email);
    if (!user || user.id !== parsed.uid) {
      return c.json({ detail: "This linking request has expired. Start Google sign-in again." }, 401);
    }
    if (user.google_sub === parsed.googleSub) {
      const token = await issueSession(c, user.id, "parent", user.family_id);
      return c.json({ token, user: publicUser(user) });
    }
    if (user.google_sub && user.google_sub !== parsed.googleSub) {
      return c.json({ detail: CONFLICT }, 409);
    }
    const taken = await accounts.findBySub(parsed.googleSub);
    if (taken && taken.id !== user.id) {
      return c.json({ detail: "This Google account is already linked to a different Side Quest family." }, 409);
    }
    if (!user.password_hash || !(await verifySecret(String(body.password || ""), user.password_hash))) {
      return c.json({ detail: "That password isn't right. Google was not linked, and no second account was created." }, 401);
    }
    const linked = await accounts.linkSub(user.id, user.email, parsed.googleSub, parsed.picture);
    if (!linked) return c.json({ detail: "Google could not be linked. Start sign-in again." }, 409);
    const token = await issueSession(c, user.id, "parent", user.family_id);
    return c.json({
      token,
      user: publicUser({ ...user, google_sub: parsed.googleSub, oauth_provider: "google", picture: parsed.picture ?? user.picture }),
    });
  });

  app.post("/api/auth/google", async (c) => {
    c.header("Cache-Control", "no-store");
    const clientId = c.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    if (!clientId) return c.json({ detail: "Google sign-in is not configured" }, 500);
    const body = await c.req.json().catch(() => ({}));
    const credential = String(body.credential || "");
    if (!credential) return c.json({ detail: "Invalid Google sign-in credential" }, 401);
    const verified = await verifyGoogleIdToken(credential, clientId);
    if (!verified.ok) {
      const detail = verified.code === "unverified"
        ? "Google has not verified this email address."
        : "Invalid Google sign-in credential";
      return c.json({ detail }, 401);
    }
    const resolution = await resolveGoogleSignIn(createD1GoogleAccounts(c.env.DB), verified.profile);
    return finishResolution(c, resolution);
  });
}
