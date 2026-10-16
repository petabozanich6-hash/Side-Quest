import type { App, Env, Guards } from "./types";
import { nowIso } from "./types";

const RECENT_DAYS = 14;
let columnReady = false;
let labelReady = false;

async function ensureColumn(env: Env) {
  if (columnReady) return;
  try {
    await env.DB.prepare("SELECT child_seen_at FROM submissions LIMIT 1").first();
  } catch {
    try {
      await env.DB.prepare("ALTER TABLE submissions ADD COLUMN child_seen_at TEXT").run();
    } catch (error) {
      if (!/duplicate column/i.test(error instanceof Error ? error.message : String(error))) throw error;
    }
  }
  columnReady = true;
}

async function ensureLabelColumn(env: Env) {
  if (labelReady) return;
  try {
    await env.DB.prepare("SELECT child_label FROM users LIMIT 1").first();
  } catch {
    try {
      await env.DB.prepare("ALTER TABLE users ADD COLUMN child_label TEXT").run();
    } catch (error) {
      if (!/duplicate column/i.test(error instanceof Error ? error.message : String(error))) throw error;
    }
  }
  labelReady = true;
}

export function registerChildInbox(app: App, g: Guards) {
  app.get("/api/me/child-label", g.auth, g.parent, async (c) => {
    try {
      await ensureLabelColumn(c.env);
      const row = await c.env.DB.prepare("SELECT child_label FROM users WHERE id = ?").bind(c.get("user").id).first<{ child_label: string | null }>();
      return c.json({ label: row?.child_label || "" });
    } catch (error) {
      return c.json({ detail: `Couldn't load that. Please try again.` }, 500);
    }
  });

  app.put("/api/me/child-label", g.auth, g.parent, async (c) => {
    try {
      await ensureLabelColumn(c.env);
      const body: any = await c.req.json().catch(() => ({}));
      const label = String(body.label || "").trim().slice(0, 30);
      await c.env.DB.prepare("UPDATE users SET child_label = ? WHERE id = ?").bind(label || null, c.get("user").id).run();
      return c.json({ ok: true, label });
    } catch (error) {
      return c.json({ detail: `Couldn't save that. Please try again.` }, 500);
    }
  });

  app.get("/api/child/parent-labels", g.auth, g.child, async (c) => {
    try {
      await ensureLabelColumn(c.env);
      const rows = (await c.env.DB.prepare("SELECT id, child_label FROM users WHERE family_id = ? AND child_label IS NOT NULL")
        .bind(c.get("user").family_id).all<{ id: string; child_label: string }>()).results ?? [];
      const out: Record<string, string> = {};
      for (const r of rows) if (r.child_label) out[r.id] = r.child_label;
      return c.json(out);
    } catch (error) {
      return c.json({ detail: `Couldn't load that. Please try again.` }, 500);
    }
  });

  app.get("/api/child/inbox", g.auth, g.child, async (c) => {
    try {
      await ensureColumn(c.env);
      const sid = c.get("user").id;
      const cheers = (await c.env.DB.prepare(
        "SELECT id, from_user_id, from_name, message, emoji, created_at FROM cheers WHERE student_id = ? AND seen = 0 ORDER BY created_at DESC LIMIT 20"
      ).bind(sid).all<any>()).results ?? [];
      const cutoff = new Date(Date.now() - RECENT_DAYS * 86400000).toISOString();
      const subs = (await c.env.DB.prepare(
        "SELECT s.id, s.assignment_id, s.status, s.reviewed_by, s.parent_feedback, s.next_step, s.reviewed_at, l.title AS lesson_title FROM submissions s LEFT JOIN lessons l ON l.id = s.lesson_id WHERE s.student_id = ? AND s.reviewed_at IS NOT NULL AND s.reviewed_at > ? AND s.child_seen_at IS NULL ORDER BY s.reviewed_at DESC LIMIT 20"
      ).bind(sid, cutoff).all<any>()).results ?? [];

      const items = [
        ...subs.map((r: any) => {
          const kind = r.status === "needs_revision" ? "revision" : "feedback";
          return {
            key: `${kind}:${r.id}`,
            kind,
            id: r.id,
            assignment_id: r.assignment_id,
            title: r.lesson_title || "your work",
            message: r.parent_feedback || "",
            next_step: r.next_step || "",
            status: r.status,
            reviewed_by: r.reviewed_by,
            created_at: r.reviewed_at,
          };
        }),
        ...cheers.map((r: any) => ({
          key: `cheer:${r.id}`,
          kind: "cheer",
          id: r.id,
          from_name: r.from_name,
          from_user_id: r.from_user_id,
          message: r.message,
          emoji: r.emoji,
          created_at: r.created_at,
        })),
      ];
      const rank = (k: string) => (k === "revision" ? 0 : k === "feedback" ? 1 : 2);
      items.sort((a: any, b: any) => rank(a.kind) - rank(b.kind) || String(b.created_at).localeCompare(String(a.created_at)));
      return c.json(items);
    } catch (error) {
      return c.json({ detail: `Couldn't load your messages. Please try again.` }, 500);
    }
  });

  app.post("/api/child/inbox/seen", g.auth, g.child, async (c) => {
    try {
      await ensureColumn(c.env);
      const sid = c.get("user").id;
      const body: any = await c.req.json().catch(() => ({}));
      const id = String(body.id || "");
      if (!id) return c.json({ detail: "id is required" }, 400);
      if (body.kind === "cheer") {
        await c.env.DB.prepare("UPDATE cheers SET seen = 1, seen_at = ? WHERE id = ? AND student_id = ?").bind(nowIso(), id, sid).run();
      } else if (body.kind === "feedback" || body.kind === "revision") {
        await c.env.DB.prepare("UPDATE submissions SET child_seen_at = ? WHERE id = ? AND student_id = ?").bind(nowIso(), id, sid).run();
      } else {
        return c.json({ detail: "Unknown kind" }, 400);
      }
      return c.json({ ok: true });
    } catch (error) {
      return c.json({ detail: `Couldn't save that. Please try again.` }, 500);
    }
  });
}
