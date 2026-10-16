/**
 * Durable, database-backed sign-in throttling across Worker instances.
 * Only FAILED attempts count, so a child signing in and out on a shared device is never locked out; a successful
 * sign-in clears that account's counter. Keys are hashed so no usernames, emails or IPs are stored in clear.
 */
const WINDOW_SECONDS = 15 * 60;
const LIMITS = { account: 8, ip: 60 };
// Rotating IPs get around the per-IP limit; this daily cap per account keeps a 4-digit PIN out of reach
// (about 30 guesses a day). A parent setting a new PIN clears it.
const DAY_SECONDS = 24 * 3600;
const DAILY_ACCOUNT_LIMIT = 30;

async function keyOf(input: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function keys(kind: "child" | "parent", account: string, ip: string) {
  // Child and parent counters are kept apart so a child username can never lock out a parent email.
  const accountKey = (kind === "child" ? "account:" : "parent:") + (await keyOf(account));
  return { accountKey, ipKey: ip ? "ip:" + (await keyOf(ip)) : "" };
}

async function failures(db: D1Database, key: string, now: number, windowSeconds = WINDOW_SECONDS) {
  const row = await db.prepare("SELECT attempts, window_started FROM login_attempts WHERE key = ?").bind(key).first<{ attempts: number; window_started: number }>();
  if (!row || Number(row.window_started) <= now - windowSeconds) return 0;
  return Number(row.attempts || 0);
}

async function bump(db: D1Database, key: string, now: number, windowSeconds = WINDOW_SECONDS) {
  await db.prepare(`INSERT INTO login_attempts (key, window_started, attempts) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      attempts = CASE WHEN window_started <= ? THEN 1 ELSE attempts + 1 END,
      window_started = CASE WHEN window_started <= ? THEN excluded.window_started ELSE window_started END`)
    .bind(key, now, now - windowSeconds, now - windowSeconds).run();
}

/** True when this account or IP has had too many failed sign-ins in the last 15 minutes. Never trusts a client family ID. */
export async function loginBlocked(db: D1Database, kind: "child" | "parent", account: string, ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const { accountKey, ipKey } = await keys(kind, account, ip);
  if ((await failures(db, accountKey, now)) >= LIMITS.account) return true;
  if ((await failures(db, "day:" + accountKey, now, DAY_SECONDS)) >= DAILY_ACCOUNT_LIMIT) return true;
  // CF-Connecting-IP is supplied by Cloudflare on deployed Workers.
  return !!ipKey && (await failures(db, ipKey, now)) >= LIMITS.ip;
}

export async function recordLoginFailure(db: D1Database, kind: "child" | "parent", account: string, ip: string) {
  const now = Math.floor(Date.now() / 1000);
  const { accountKey, ipKey } = await keys(kind, account, ip);
  await bump(db, accountKey, now);
  await bump(db, "day:" + accountKey, now, DAY_SECONDS);
  if (ipKey) await bump(db, ipKey, now);
  // Housekeeping: drop expired windows now and then so the table stays small.
  if (Math.random() < 0.05) {
    await db.prepare("DELETE FROM login_attempts WHERE window_started <= ? AND key NOT LIKE 'day:%'").bind(now - WINDOW_SECONDS).run();
    await db.prepare("DELETE FROM login_attempts WHERE window_started <= ? AND key LIKE 'day:%'").bind(now - DAY_SECONDS).run();
  }
}

/** A successful sign-in clears the short window; the daily count only goes when `daily` is set (a new PIN or password). */
export async function clearLoginFailures(db: D1Database, kind: "child" | "parent", account: string, { daily = false } = {}) {
  const { accountKey } = await keys(kind, account, "");
  await db.prepare("DELETE FROM login_attempts WHERE key IN (?, ?)").bind(accountKey, daily ? "day:" + accountKey : accountKey).run();
}

let authSchemaReady = false;
/**
 * Deploys don't run migrations, so the sign-in security schema (migration 0058) is also ensured here, once per
 * Worker instance. Additive only: a column defaulting to 0 (every child keeps signing in) and a counters table.
 */
export async function ensureAuthSchema(db: D1Database) {
  if (authSchemaReady) return;
  try {
    await db.prepare("SELECT credential_version FROM students LIMIT 1").first();
  } catch {
    try { await db.prepare("ALTER TABLE students ADD COLUMN credential_version INTEGER NOT NULL DEFAULT 0").run(); }
    catch (e) { if (!/duplicate column/i.test(e instanceof Error ? e.message : String(e))) throw e; }
  }
  await db.prepare("CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, window_started INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0)").run();
  authSchemaReady = true;
}
