/**
 * Family feedback is private to the submitting parent and the passkey-protected Owner HQ.
 * All identifiers are determined by the authenticated server session, never from input.
 */
import type { App, Guards, Env } from "./types";
import { newId, nowIso } from "./types";
import { hitRateLimit } from "./adminAudit";
import { sendEmail, SITE_URL } from "./email";

export const FEEDBACK_CATEGORIES = ["problem", "idea", "feedback", "other"] as const;
export const FEEDBACK_STATUSES = ["new", "reviewing", "in_progress", "resolved", "closed"] as const;

export const FEEDBACK_SCHEMA: readonly string[] = [
  "CREATE TABLE IF NOT EXISTS parent_feedback (id TEXT PRIMARY KEY, family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, category TEXT NOT NULL CHECK (category IN ('problem','idea','feedback','other')), subject TEXT NOT NULL, message TEXT NOT NULL, page_hint TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','in_progress','resolved','closed')), owner_note TEXT NOT NULL DEFAULT '', seen_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_created ON parent_feedback(created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_family ON parent_feedback(family_id,created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_unseen ON parent_feedback(seen_at,created_at DESC)",
  "CREATE TABLE IF NOT EXISTS parent_feedback_replies (id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES parent_feedback(id) ON DELETE CASCADE, author_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, body TEXT NOT NULL, parent_read_at TEXT, created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_thread ON parent_feedback_replies(feedback_id,created_at,id)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_unread ON parent_feedback_replies(feedback_id,parent_read_at)",
];
export async function ensureFeedbackSchema(db: D1Database) {
  // Remote migrations are not run by production deploys, so runtime DDL remains idempotent.
  for (const statement of FEEDBACK_SCHEMA) await db.prepare(statement).run();
}
const ownRow = (r: any) => ({
  id: r.id, category: r.category, subject: r.subject, message: r.message, page_hint: r.page_hint,
  status: r.status, created_at: r.created_at, updated_at: r.updated_at,
  replies: [] as any[], unread_replies: 0,
});
const isCategory = (value: unknown): value is typeof FEEDBACK_CATEGORIES[number] =>
  typeof value === "string" && (FEEDBACK_CATEGORIES as readonly string[]).includes(value);

async function ownerAlert(env: Env, id: string, category: string) {
  const to = String(env.OWNER_NOTIFICATION_EMAIL || "").trim();
  if (!env.EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return;
  const link = SITE_URL + "/parent/command-centre/feedback";
  // Keep names, addresses and free-text descriptions OUT of the optional email.
  await sendEmail(env, {
    to, subject: "Side-Quest: new " + category + " submission",
    text: "New submission in Owner HQ.\nReference: " + id + "\nCategory: " + category + "\n" + link,
    html: '<p>A parent has sent a ' + category + ' submission.</p><p>Reference: ' + id + '</p><p><a href="' + link + '">Open the secure Owner HQ inbox</a></p>',
  });
}

export function registerFeedback(app: App, guards: Guards) {
  app.get("/api/feedback", guards.auth, guards.parent, async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const { results } = await c.env.DB.prepare(
      "SELECT id, category, subject, message, page_hint, status, created_at, updated_at FROM parent_feedback WHERE family_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 50",
    ).bind(c.get("user").family_id, c.get("user").id).all();
    // One batched, family-and-parent-scoped query. Internal notes and other users' replies never leave the server.
    const reports = (results ?? []).map(ownRow);
    if (reports.length) {
      const { results: replies } = await c.env.DB.prepare(
        "SELECT r.id,r.feedback_id,r.body,r.created_at,r.parent_read_at FROM parent_feedback_replies r JOIN parent_feedback p ON p.id = r.feedback_id WHERE p.family_id = ? AND p.user_id = ? ORDER BY r.created_at ASC,r.id ASC LIMIT 500"
      ).bind(c.get("user").family_id,c.get("user").id).all<any>();
      const byId = new Map(reports.map((r: any) => [r.id,r]));
      for (const reply of replies ?? []) {
        const report: any = byId.get(reply.feedback_id);
        if (!report) continue;
        report.replies.push({ id:reply.id, body:reply.body, created_at:reply.created_at, read_at:reply.parent_read_at });
        if (!reply.parent_read_at) report.unread_replies++;
      }
    }
    c.header("Cache-Control", "no-store");
    return c.json({ reports });
  });

  // Small count endpoint for parent-side unread badge. Works on every plan, including expired previews.
  app.get("/api/feedback/unread-count", guards.auth, guards.parent, async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const u = c.get("user");
    const result = await c.env.DB.prepare(
      "SELECT COUNT(*) n FROM parent_feedback_replies r JOIN parent_feedback p ON p.id=r.feedback_id WHERE p.family_id=? AND p.user_id=? AND r.parent_read_at IS NULL",
    ).bind(u.family_id,u.id).first<{n:number}>();
    c.header("Cache-Control","no-store");
    return c.json({unread:Number(result?.n || 0)});
  });

  // Acknowledgement is scoped to the exact submitting account, never just a guessed feedback ID.
  app.post("/api/feedback/:id/replies/read", guards.auth, guards.parent, async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const u=c.get("user");
    const owns = await c.env.DB.prepare(
      "SELECT id FROM parent_feedback WHERE id=? AND family_id=? AND user_id=?",
    ).bind(c.req.param("id"),u.family_id,u.id).first();
    if(!owns) return c.json({detail:"Message not found"},404);
    await c.env.DB.prepare(
      "UPDATE parent_feedback_replies SET parent_read_at=? WHERE feedback_id=? AND parent_read_at IS NULL",
    ).bind(nowIso(),c.req.param("id")).run();
    return c.json({ok:true});
  });

  app.post("/api/feedback", guards.auth, guards.parent, async (c) => {
    const input: unknown = await c.req.json().catch(() => null);
    if (!input || typeof input !== "object" || Array.isArray(input)) return c.json({ detail: "Enter a report." }, 400);
    const b = input as Record<string, unknown>;
    if (!isCategory(b.category)) return c.json({ detail: "Choose a report category." }, 400);
    if (typeof b.subject !== "string" || b.subject.trim().length < 4 || b.subject.trim().length > 120)
      return c.json({ detail: "Give your report a title (4 to 120 characters)." }, 400);
    if (typeof b.message !== "string" || b.message.trim().length < 10 || b.message.trim().length > 4000)
      return c.json({ detail: "Describe it in 10 to 4000 characters." }, 400);
    if (b.page_hint !== undefined && (typeof b.page_hint !== "string" || b.page_hint.length > 160))
      return c.json({ detail: "Page or feature name is too long." }, 400);
    await ensureFeedbackSchema(c.env.DB);
    const user = c.get("user");
    const limit = await hitRateLimit(c.env.DB, "feedback:" + user.id, 5, 600);
    if (!limit.ok) { c.header("Retry-After", String(limit.retryAfter)); return c.json({ detail: "You've sent several reports. Please try again in a few minutes." }, 429); }
    const id = newId(), now = nowIso();
    await c.env.DB.prepare(
      "INSERT INTO parent_feedback (id,family_id,user_id,category,subject,message,page_hint,status,owner_note,seen_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,'new','',NULL,?,?)",
    ).bind(id, user.family_id, user.id, b.category, b.subject.trim(), b.message.trim(), (b.page_hint || "").trim(), now, now).run();
    // A failed or unconfigured email never undoes the durable, private HQ submission.
    try { await ownerAlert(c.env, id, b.category); } catch { /* optional */ }
    return c.json({ id, status: "new", created_at: now }, 201);
  });
}
