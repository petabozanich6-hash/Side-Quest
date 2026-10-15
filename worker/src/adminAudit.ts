/** Audit log, security events and administrative rate limits. Metadata only: never passwords, tokens or content. */
import { nowIso, newId } from "./types";

export type AuditEntry = {
  actorUserId: string | null;
  actorLabel: string;
  action: string;
  targetType?: string;
  targetId?: string;
  detail?: Record<string, unknown>;
};

export async function writeAudit(db: D1Database, e: AuditEntry) {
  await db.prepare(
    "INSERT INTO admin_audit_log (id, actor_user_id, actor_label, action, target_type, target_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(newId(), e.actorUserId, e.actorLabel, e.action, e.targetType ?? "", e.targetId ?? "", JSON.stringify(e.detail ?? {}), nowIso()).run();
}

export async function recordSecurityEvent(db: D1Database, familyId: string, userId: string | null, eventType: string, detail = "") {
  await db.prepare("INSERT INTO security_events (id, family_id, user_id, event_type, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(newId(), familyId, userId, eventType, detail.slice(0, 200), nowIso()).run();
}

/**
 * Fixed-window counter shared by every Worker instance (D1). Returns ok=false once `limit` hits have been counted in
 * the current window.
 */
export async function hitRateLimit(db: D1Database, key: string, limit: number, windowSeconds: number, now = Date.now()) {
  const t = Math.floor(now / 1000);
  const start = t - (t % windowSeconds);
  await db.prepare(
    `INSERT INTO admin_rate_limits (key, window_started, hits) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET
       hits = CASE WHEN window_started = excluded.window_started THEN hits + 1 ELSE 1 END,
       window_started = excluded.window_started`,
  ).bind(key, start).run();
  const row = await db.prepare("SELECT hits FROM admin_rate_limits WHERE key = ?").bind(key).first<{ hits: number }>();
  const hits = Number(row?.hits ?? 0);
  return { ok: hits <= limit, retryAfter: start + windowSeconds - t };
}
