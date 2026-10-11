import { button, esc, firstName, layout, note, p, sendEmail, SITE_URL, steps } from "./email";
import type { OutgoingEmail } from "./email";
import type { App, Env, Guards } from "./types";
import { newId, nowIso } from "./types";
import { registerChildInbox } from "./childInbox";

const THROTTLE_MINUTES = 10;
let tableReady = false;

async function ensureTable(env: Env) {
  if (tableReady) return;
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS help_requests (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, created_at TEXT NOT NULL, emailed_at TEXT, resolved_at TEXT, email_status TEXT)"
  ).run();
  try {
    await env.DB.prepare("SELECT email_status FROM help_requests LIMIT 1").first();
  } catch {
    try {
      await env.DB.prepare("ALTER TABLE help_requests ADD COLUMN email_status TEXT").run();
    } catch (error) {
      if (!/duplicate column/i.test(error instanceof Error ? error.message : String(error))) throw error;
    }
  }
  tableReady = true;
}

export function helpEmail(to: string, parentName: string, childName: string, username: string): OutgoingEmail {
  const parent = firstName(parentName);
  const child = firstName(childName);
  const link = `${SITE_URL}/parent/children`;
  const subject = `${child} is stuck at the gate and needs your help`;

  const text = `Hi ${parent},

Your adventurer ${child} has lost the key to their quest and is asking for help getting back in.

Here's how to send them on their way:
1. Sign in to your parent hub: ${SITE_URL}/login
2. Open the Children page: ${link}
3. Tap "View login" on ${child}'s card to see their username and PIN. If the PIN can't be shown, tap "Edit" and set a new one.
4. Hand ${child} the key, then dismiss the help alert.

For safety, we never put a PIN in an email. ${child}'s username is @${username}.

Happy questing,
Side Quest

--
You are getting this because ${child} asked for help signing in to Side Quest. Write to support@sidequestlearning.app any time.`;

  const body = [
    p(`Hi ${esc(parent)}, your adventurer <strong>${esc(child)}</strong> has lost the key to their quest and is asking for help getting back in.`),
    p(`A quest never really ends at a locked gate. Here's how to guide ${esc(child)} through:`),
    steps([
      `Sign in to your parent hub.`,
      `Open the <strong>Children</strong> page.`,
      `Tap <strong>View login</strong> on ${esc(child)}'s card to see their username and PIN. If the PIN can't be shown, tap <strong>Edit</strong> and set a new one.`,
      `Hand ${esc(child)} the key, then dismiss the help alert.`,
    ]),
    button("Open the Children page", link),
    note(`For safety, we never put a PIN in an email. ${esc(child)}'s username is <strong>@${esc(username)}</strong>.`),
    p(`Happy questing,<br/><em>Side Quest</em>`),
  ].join("\n");

  const html = layout({
    preheader: `${child} has lost the key to their quest. Here's how to help.`,
    kicker: "A quest needs its guide.",
    heading: `${child} has lost the key to their quest`,
    body,
    reason: `You are getting this because ${esc(child)} asked for help signing in to Side Quest.`,
  });
  return { to, subject, text, html };
}

export function registerHelpRequests(app: App, g: Guards) {
  /** Public: a child who can't sign in asks for help. Always answers the same way so usernames can't be probed. */
  app.post("/api/auth/child-help", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const username = String(body.username || "").trim().toLowerCase().slice(0, 64);
    if (!username) return c.json({ detail: "Please type your username" }, 400);

    try {
      await ensureTable(c.env);
      const s = await c.env.DB.prepare("SELECT id, family_id, name, username FROM students WHERE username = ?")
        .bind(username).first<{ id: string; family_id: string; name: string; username: string }>();
      if (s) {
        const open = await c.env.DB.prepare(
          "SELECT id, emailed_at FROM help_requests WHERE student_id = ? AND resolved_at IS NULL ORDER BY created_at DESC LIMIT 1"
        ).bind(s.id).first<{ id: string; emailed_at: string | null }>();
        const cutoff = new Date(Date.now() - THROTTLE_MINUTES * 60000).toISOString();
        if (!(open?.emailed_at && open.emailed_at > cutoff)) {
          const ts = nowIso();
          let id = open?.id;
          if (id) {
            await c.env.DB.prepare("UPDATE help_requests SET emailed_at = ?, created_at = ?, email_status = NULL WHERE id = ?").bind(ts, ts, id).run();
          } else {
            id = newId();
            await c.env.DB.prepare(
              "INSERT INTO help_requests (id, family_id, student_id, created_at, emailed_at) VALUES (?, ?, ?, ?, ?)"
            ).bind(id, s.family_id, s.id, ts, ts).run();
          }
          const requestId = id;
          const parents = (await c.env.DB.prepare("SELECT email, name FROM users WHERE family_id = ?")
            .bind(s.family_id).all<{ email: string | null; name: string }>()).results ?? [];
          const job = (async () => {
            let status = "no_address";
            if (!c.env.EMAIL) {
              status = "not_configured";
            } else {
              let sent = 0;
              let tried = 0;
              for (const u of parents) {
                if (!u.email) continue;
                tried++;
                if (await sendEmail(c.env, helpEmail(u.email, u.name, s.name, s.username))) sent++;
              }
              status = tried === 0 ? "no_address" : sent > 0 ? "sent" : "failed";
            }
            try {
              await c.env.DB.prepare("UPDATE help_requests SET email_status = ? WHERE id = ?").bind(status, requestId).run();
            } catch (error) {
              console.error("child-help status save failed", error instanceof Error ? error.message : error);
            }
          })();
          try { c.executionCtx.waitUntil(job); } catch { await job; }
        }
      }
    } catch (error) {
      console.error("child-help failed", error instanceof Error ? error.message : error);
    }
    return c.json({ ok: true });
  });

  app.get("/api/help-requests", g.auth, g.parent, async (c) => {
    try {
      await ensureTable(c.env);
      const { results } = await c.env.DB.prepare(
        "SELECT h.id, h.student_id, h.created_at, h.email_status, s.name, s.username FROM help_requests h JOIN students s ON s.id = h.student_id WHERE h.family_id = ? AND h.resolved_at IS NULL ORDER BY h.created_at DESC LIMIT 20"
      ).bind(c.get("user").family_id).all();
      return c.json(results ?? []);
    } catch (error) {
      return c.json({ detail: `Couldn't load help requests: ${error instanceof Error ? error.message : String(error)}` }, 500);
    }
  });

  app.post("/api/help-requests/:id/resolve", g.auth, g.parent, async (c) => {
    try {
      await ensureTable(c.env);
      await c.env.DB.prepare("UPDATE help_requests SET resolved_at = ? WHERE id = ? AND family_id = ?")
        .bind(nowIso(), c.req.param("id"), c.get("user").family_id).run();
      return c.json({ ok: true });
    } catch (error) {
      return c.json({ detail: `Couldn't update that: ${error instanceof Error ? error.message : String(error)}` }, 500);
    }
  });

  registerChildInbox(app, g);
}
