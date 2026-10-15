/**
 * Passkeys (WebAuthn) for Owner HQ step-up.
 *
 * Phishing-resistant: the browser binds every assertion to the site's origin, so a look-alike domain cannot replay
 * it. Challenges are single-use, expire after five minutes and are bound to the sign-in session (token "sid") that
 * asked for them. A successful step-up elevates only that sign-in session, for STEP_UP_MINUTES.
 */
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";

export const STEP_UP_MINUTES = 15;
const CHALLENGE_TTL_MS = 5 * 60_000;
const RP_NAME = "Side-Quest Learning";

export type RelyingParty = { origin: string; rpID: string };
export type StoredCredential = { id: string; publicKey: string; counter: number; transports: string; label: string; createdAt: string; lastUsedAt: string | null };

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function parseTransports(raw: string): AuthenticatorTransportFuture[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? (v.filter((t) => typeof t === "string") as AuthenticatorTransportFuture[]) : [];
  } catch {
    return [];
  }
}

export async function listCredentials(db: D1Database, userId: string): Promise<StoredCredential[]> {
  const { results } = await db.prepare(
    `SELECT id, public_key AS publicKey, counter, transports, label, created_at AS createdAt, last_used_at AS lastUsedAt
     FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at ASC`,
  ).bind(userId).all<StoredCredential>();
  return results ?? [];
}

async function storeChallenge(db: D1Database, userId: string, sessionId: string, purpose: "register" | "authenticate", challenge: string, now: Date) {
  // One outstanding challenge per session and purpose; expired ones are swept at the same time.
  await db.prepare("DELETE FROM webauthn_challenges WHERE (user_id = ? AND session_id = ? AND purpose = ?) OR expires_at < ?")
    .bind(userId, sessionId, purpose, now.toISOString()).run();
  await db.prepare("INSERT INTO webauthn_challenges (id, user_id, session_id, purpose, challenge, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), userId, sessionId, purpose, challenge, new Date(now.getTime() + CHALLENGE_TTL_MS).toISOString(), now.toISOString()).run();
}

/** Fetches and deletes the session's challenge, so it can be used exactly once. */
async function consumeChallenge(db: D1Database, userId: string, sessionId: string, purpose: "register" | "authenticate", now: Date): Promise<string | null> {
  const row = await db.prepare(
    "SELECT id, challenge, expires_at AS expiresAt FROM webauthn_challenges WHERE user_id = ? AND session_id = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1",
  ).bind(userId, sessionId, purpose).first<{ id: string; challenge: string; expiresAt: string }>();
  if (!row) return null;
  await db.prepare("DELETE FROM webauthn_challenges WHERE id = ?").bind(row.id).run();
  return row.expiresAt > now.toISOString() ? row.challenge : null;
}

export async function registrationOptions(db: D1Database, rp: RelyingParty, user: { id: string; email: string; name: string }, sessionId: string, now = new Date()) {
  const existing = await listCredentials(db, user.id);
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rp.rpID,
    userName: user.email,
    userDisplayName: user.name,
    userID: new Uint8Array(new TextEncoder().encode(user.id)),
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({ id: c.id, transports: parseTransports(c.transports) })),
    authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
  });
  await storeChallenge(db, user.id, sessionId, "register", options.challenge, now);
  return options;
}

export async function verifyRegistration(db: D1Database, rp: RelyingParty, userId: string, sessionId: string, response: RegistrationResponseJSON, label: string, now = new Date()):
  Promise<{ ok: true; credentialId: string } | { ok: false; error: string }> {
  const challenge = await consumeChallenge(db, userId, sessionId, "register", now);
  if (!challenge) return { ok: false, error: "The passkey request expired. Please try again." };
  let verification;
  try {
    verification = await verifyRegistrationResponse({ response, expectedChallenge: challenge, expectedOrigin: rp.origin, expectedRPID: rp.rpID, requireUserVerification: true });
  } catch {
    return { ok: false, error: "The passkey could not be verified." };
  }
  if (!verification.verified) return { ok: false, error: "The passkey could not be verified." };
  const info = verification.registrationInfo;
  await db.prepare(
    "INSERT INTO webauthn_credentials (id, user_id, public_key, counter, transports, device_type, backed_up, label, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(info.credential.id, userId, toBase64Url(info.credential.publicKey), info.credential.counter, JSON.stringify(info.credential.transports ?? []),
    info.credentialDeviceType, info.credentialBackedUp ? 1 : 0, label, now.toISOString()).run();
  return { ok: true, credentialId: info.credential.id };
}

export async function authenticationOptions(db: D1Database, rp: RelyingParty, userId: string, sessionId: string, now = new Date()) {
  const credentials = await listCredentials(db, userId);
  if (credentials.length === 0) return null;
  const options = await generateAuthenticationOptions({
    rpID: rp.rpID,
    allowCredentials: credentials.map((c) => ({ id: c.id, transports: parseTransports(c.transports) })),
    userVerification: "required",
  });
  await storeChallenge(db, userId, sessionId, "authenticate", options.challenge, now);
  return options;
}

export async function verifyAuthentication(db: D1Database, rp: RelyingParty, userId: string, sessionId: string, response: AuthenticationResponseJSON, now = new Date()):
  Promise<{ ok: true; elevatedUntil: string } | { ok: false; error: string }> {
  const challenge = await consumeChallenge(db, userId, sessionId, "authenticate", now);
  if (!challenge) return { ok: false, error: "The passkey request expired. Please try again." };
  // Only this user's own credentials can satisfy their step-up.
  const credential = (await listCredentials(db, userId)).find((c) => c.id === response?.id);
  if (!credential) return { ok: false, error: "That passkey is not registered to this account." };
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response, expectedChallenge: challenge, expectedOrigin: rp.origin, expectedRPID: rp.rpID, requireUserVerification: true,
      credential: { id: credential.id, publicKey: fromBase64Url(credential.publicKey), counter: credential.counter, transports: parseTransports(credential.transports) },
    });
  } catch {
    return { ok: false, error: "The passkey could not be verified." };
  }
  if (!verification.verified) return { ok: false, error: "The passkey could not be verified." };
  const elevatedUntil = new Date(now.getTime() + STEP_UP_MINUTES * 60_000).toISOString();
  await db.prepare("UPDATE webauthn_credentials SET counter = ?, last_used_at = ? WHERE id = ? AND user_id = ?")
    .bind(verification.authenticationInfo.newCounter, now.toISOString(), credential.id, userId).run();
  await db.prepare(
    `INSERT INTO admin_step_up (session_id, user_id, elevated_until) VALUES (?, ?, ?)
     ON CONFLICT(session_id) DO UPDATE SET elevated_until = excluded.elevated_until WHERE admin_step_up.user_id = excluded.user_id`,
  ).bind(sessionId, userId, elevatedUntil).run();
  return { ok: true, elevatedUntil };
}

export async function elevatedUntil(db: D1Database, userId: string, sessionId: string, now = new Date()): Promise<string | null> {
  const row = await db.prepare("SELECT elevated_until FROM admin_step_up WHERE session_id = ? AND user_id = ?").bind(sessionId, userId).first<{ elevated_until: string }>();
  return row && row.elevated_until > now.toISOString() ? row.elevated_until : null;
}

export async function endStepUp(db: D1Database, userId: string, sessionId: string) {
  await db.prepare("DELETE FROM admin_step_up WHERE session_id = ? AND user_id = ?").bind(sessionId, userId).run();
}
