import type { Env } from "./types";
import { SITE_URL, sendEmail } from "./email";
import { parentVerificationEmail } from "./authEmails";
import { newId, nowIso } from "./types";
import { trialEndFrom } from "./entitlements";
import { loginBlocked, recordLoginFailure } from "./loginThrottle";

const HOURS_48 = 48 * 60 * 60_000;
const hash = async (token: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))),
    (b) => b.toString(16).padStart(2, "0")).join("");
const createToken = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Mail links hold the single-use token in a URL fragment, not in access logs. */
export async function sendParentVerification(env: Env, userId: string, email: string, name: string) {
  if (!env.EMAIL) return false;
  const token = createToken();
  const now = nowIso();
  await env.DB.batch([
    env.DB.prepare("UPDATE email_verification_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL")
      .bind(now, userId),
    env.DB.prepare("INSERT INTO email_verification_tokens (id,user_id,token_hash,expires_at,created_at) VALUES (?,?,?,?,?)")
      .bind(newId(), userId, await hash(token), new Date(Date.now() + HOURS_48).toISOString(), now),
  ]);
  return sendEmail(env, parentVerificationEmail(email, name, `${SITE_URL}/verify-email#token=${token}`));
}

export async function redeemParentVerification(env: Env, token: string) {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return false;
  const row = await env.DB.prepare(
    "SELECT user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?"
  ).bind(await hash(token), nowIso()).first<{user_id: string}>();
  if (!row) return false;
  const now = nowIso();
  // Atomically claim: only one concurrent request may redeem this token.
  const used = await env.DB.prepare(
    "UPDATE email_verification_tokens SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?"
  ).bind(now, await hash(token), now).run();
  if (!used.meta?.changes) return false;
  const user = await env.DB.prepare(
    "SELECT family_id, email_verified_at, email_verification_required_at FROM users WHERE id = ?"
  ).bind(row.user_id).first<{family_id: string; email_verified_at: string | null; email_verification_required_at: string | null}>();
  if (!user) return false;
  if (!user.email_verified_at) {
    await env.DB.prepare("UPDATE users SET email_verified_at = ? WHERE id = ? AND email_verified_at IS NULL")
      .bind(now, row.user_id).run();
    if (user.email_verification_required_at) {
      // Their 7-day free preview begins on actual verification, not registration.
      await env.DB.prepare(
        "UPDATE families SET trial_started_at = ?, trial_ends_at = ? WHERE id = ? AND plan = 'FREE_PREVIEW' AND stripe_subscription_id IS NULL"
      ).bind(now, trialEndFrom(now), user.family_id).run();
    }
  }
  return true;
}

/** Public resend; no account enumeration and no access without the email link. */
export async function resendParentVerification(env: Env, email: string, ip: string) {
  const reply = { ok: true, message: "If that email needs verification, a new link is on its way." };
  // Isolate resend throttling from ordinary parent login's IP budget:
  // requesting emails must never lock an unrelated family out of sign-in.
  const accountKey = "verify-resend:" + email;
  const ipKey = "verify-resend-ip:" + (ip || "local");
  if (await loginBlocked(env.DB, "parent", accountKey, "") ||
      await loginBlocked(env.DB, "parent", ipKey, "")) return reply;
  await recordLoginFailure(env.DB, "parent", accountKey, "");
  await recordLoginFailure(env.DB, "parent", ipKey, "");
  if (!env.EMAIL) return reply;
  const user = await env.DB.prepare(
    "SELECT id, name FROM users WHERE email = ? AND email_verified_at IS NULL AND email_verification_required_at IS NOT NULL"
  ).bind(email).first<{id: string; name: string}>();
  if (!user) return reply;
  const since = new Date(Date.now() - 3600_000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) n FROM email_verification_tokens WHERE user_id = ? AND created_at > ?"
  ).bind(user.id, since).first<{n: number}>();
  if ((recent?.n ?? 0) >= 3) return reply;
  await sendParentVerification(env, user.id, email, user.name);
  return reply;
}
