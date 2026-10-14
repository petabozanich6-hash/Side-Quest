/** Durable, database-backed child sign-in throttling across Worker instances. */
const windowSeconds = 15 * 60;
async function keyOf(input: string) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hit(db: D1Database, key: string, max: number, now: number): Promise<boolean> {
  await db.prepare(`INSERT INTO child_login_attempts (key, window_started, attempts)
    VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      window_started = CASE WHEN window_started <= ? THEN excluded.window_started ELSE window_started END,
      attempts = CASE WHEN window_started <= ? THEN 1 ELSE attempts + 1 END`)
    .bind(key, now, now - windowSeconds, now - windowSeconds).run();
  const row = await db.prepare("SELECT attempts FROM child_login_attempts WHERE key = ?").bind(key).first<{attempts:number}>();
  return Number(row?.attempts || 0) <= max;
}

/** Limits username guessing and requests from the same IP; never trusts a client-provided family ID. */
export async function childLoginAllowed(db: D1Database, username: string, ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const accountKey = "account:" + await keyOf(username);
  const accountAllowed = await hit(db, accountKey, 8, now);
  // CF-Connecting-IP is supplied by Cloudflare on deployed Workers.
  if (!ip) return accountAllowed;
  const ipKey = "ip:" + await keyOf(ip);
  const ipAllowed = await hit(db, ipKey, 60, now);
  return accountAllowed && ipAllowed;
}
