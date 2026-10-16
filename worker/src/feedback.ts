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
];
export async function ensureFeedbackSchema(db: D1Database) {
  // Remote migrations are not run by production deploys, so runtime DDL remains idempotent.
  for (const statement of FEEDBACK_SCHEMA) await db.prepare(statement).run();
}
const ownRow = (r: any) => ({
  id: r.id, category: r.category, subject: r.subject, message: r.message, page_hint: r.page_hint,
  status: r.status, created_at: r.created_at, updated_at: r.updated_at,
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
    c.header("Cache-Control", "no-store");
    return c.json({ reports: (results ?? []).map(ownRow) });
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
