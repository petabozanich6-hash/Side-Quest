import type { App } from "./types";
import { newId, nowIso } from "./types";
import { hashSecret } from "./auth";
import { SITE_URL, sendEmail } from "./email";
import { passwordChangedEmail, passwordResetEmail } from "./authEmails";

const TOKEN_TTL_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_HOUR = 3;
const MIN_PASSWORD = 8;
const INVALID_LINK = "This reset link is invalid or has expired. Please request a new one.";
const SAME_REPLY = {
  ok: true,
  message: "If an account exists for that email, we've sent a link to reset the password. It can take a few minutes to arrive, so check your spam folder too.",
};

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function sha256(s: string) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
}

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function registerPasswordReset(app: App) {
  /** Step 1: email a reset link. Always answers the same way so it can't be used to find out who has an account. */
  app.post("/api/auth/forgot-password", async (c) => {
    const b = await c.req.json().catch(() => ({}));
    const email = String(b.email || "").trim().toLowerCase();
    if (!email.includes("@") || email.length > 254) return c.json(SAME_REPLY);

    const user = await c.env.DB.prepare("SELECT id, name, email FROM users WHERE email = ?")
      .bind(email).first<{ id: string; name: string; email: string }>();
    if (!user) return c.json(SAME_REPLY);

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM password_resets WHERE user_id = ? AND created_at > ?")
      .bind(user.id, since).first<{ n: number }>();
    if ((recent?.n ?? 0) >= MAX_REQUESTS_PER_HOUR) return c.json(SAME_REPLY);

    const token = newToken();
    const ts = nowIso();
    await c.env.DB.batch([
      c.env.DB.prepare("UPDATE password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL").bind(ts, user.id),
      c.env.DB.prepare("INSERT INTO password_resets (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(newId(), user.id, await sha256(token), new Date(Date.now() + TOKEN_TTL_MS).toISOString(), ts),
    ]);

    const sending = sendEmail(c.env, passwordResetEmail(user.email, user.name, `${SITE_URL}/reset-password?token=${token}`));
    try { c.executionCtx.waitUntil(sending); } catch { /* no execution context (tests) */ }
    return c.json(SAME_REPLY);
  });

  /** Step 2: swap a valid single-use token for a new password. */
  app.post("/api/auth/reset-password", async (c) => {
    const b = await c.req.json().catch(() => ({}));
    const token = String(b.token || "");
    const password = String(b.password || "");
    if (password.length < MIN_PASSWORD) {
      return c.json({ detail: `Password must be at least ${MIN_PASSWORD} characters` }, 400);
    }
    if (!token || token.length > 200) return c.json({ detail: INVALID_LINK }, 400);

    const row = await c.env.DB.prepare(
      "SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?"
    ).bind(await sha256(token), nowIso()).first<{ id: string; user_id: string }>();
    if (!row) return c.json({ detail: INVALID_LINK }, 400);

    const newHash = await hashSecret(password);
    const ts = nowIso();
    const claim = await c.env.DB.prepare("UPDATE password_resets SET used_at = ? WHERE id = ? AND used_at IS NULL")
      .bind(ts, row.id).run();
    if (!claim.meta?.changes) return c.json({ detail: INVALID_LINK }, 400);

    await c.env.DB.batch([
      c.env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(newHash, row.user_id),
      c.env.DB.prepare("UPDATE password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL").bind(ts, row.user_id),
    ]);

    const user = await c.env.DB.prepare("SELECT name, email FROM users WHERE id = ?")
      .bind(row.user_id).first<{ name: string; email: string }>();
    if (user) {
      const sending = sendEmail(c.env, passwordChangedEmail(user.email, user.name));
      try { c.executionCtx.waitUntil(sending); } catch { /* no execution context (tests) */ }
    }
    return c.json({ ok: true });
  });
}
