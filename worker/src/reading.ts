import type { Hono, MiddlewareHandler } from "hono";
import { awardXp } from "./pets";

type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
type Env = { DB: D1Database; JWT_SECRET: string };
type App = Hono<{ Bindings: Env; Variables: { user: AuthUser } }>;

const DAILY_LIMIT = 3;
const MAX_DAYS_BACK = 7;
const READING_XP = 3;
const DAY = 86400000;
const BOOK_TYPES = ["fiction", "nonfiction", "picture", "graphic", "poetry", "reference"];
const MODES = ["independent", "with_adult", "read_to", "audio"];
const newId = () => crypto.randomUUID();

class Bad extends Error {}

function cleanInt(v: any, lo: number, hi: number, field: string): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isInteger(n)) throw new Bad(`${field} must be a number`);
  if (n < lo || n > hi) throw new Bad(`${field} must be between ${lo} and ${hi}`);
  return n;
}

const out = (r: any) => ({
  ...r,
  verified_by_parent: !!r.verified_by_parent,
  submitted_by_child: !!r.submitted_by_child,
});

export function registerReading(app: App, auth: MiddlewareHandler, parent: MiddlewareHandler) {
  const guard = (fn: (c: any) => Promise<Response>) => async (c: any) => {
    try {
      return await fn(c);
    } catch (e) {
      if (e instanceof Bad) return c.json({ detail: e.message }, 400);
      throw e;
    }
  };
  const isChild = (c: any) => c.get("user").role === "child";
  const noChild = (c: any) => c.json({ detail: "Child access required" }, 403);

  // ---------- Child submissions ----------
  app.post("/api/reading-submissions", auth, guard(async (c) => {
    if (!isChild(c)) return noChild(c);
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const title = String(b.title || "").trim();
    if (!title || title.length > 120) throw new Bad("Please enter the book title");
    const author = String(b.author || "").trim().slice(0, 80);
    const rd = new Date(String(b.read_date));
    if (isNaN(rd.getTime())) throw new Bad("Please choose the date you read");
    const readDate = rd.toISOString().slice(0, 10);
    const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
    const rdMs = new Date(readDate).getTime();
    if (rdMs > today + DAY) throw new Bad("That date is in the future");
    if (rdMs < today - MAX_DAYS_BACK * DAY) throw new Bad(`You can only add reading from the last ${MAX_DAYS_BACK} days`);
    const minutes = cleanInt(b.duration_minutes, 1, 600, "Minutes");
    if (minutes === null) throw new Bad("How many minutes did you read?");
    const pages = cleanInt(b.pages, 1, 5000, "Pages");
    const bookType = b.book_type || "fiction";
    const mode = b.reading_mode || "independent";
    if (!BOOK_TYPES.includes(bookType) || !MODES.includes(mode)) throw new Bad("Invalid book type or reading mode");

    const start = new Date(today).toISOString();
    const { results: todays } = await c.env.DB.prepare(
      "SELECT title, status FROM reading_submissions WHERE student_id = ? AND created_at >= ? LIMIT 50"
    ).bind(u.id, start).all();
    if (todays.length >= DAILY_LIMIT) throw new Bad(`You can add up to ${DAILY_LIMIT} books a day`);
    if (todays.some((t: any) => t.title.toLowerCase() === title.toLowerCase() && t.status !== "rejected")) {
      throw new Bad("You already added that book today");
    }

    const id = newId();
    const created = new Date().toISOString();
    await c.env.DB.prepare(
      "INSERT INTO reading_submissions (id, student_id, family_id, title, author, read_date, duration_minutes, pages, book_type, reading_mode, status, parent_note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', ?)"
    ).bind(id, u.id, u.family_id, title, author, readDate, minutes, pages, bookType, mode, created).run();
    return c.json({
      id, student_id: u.id, family_id: u.family_id, title, author, read_date: readDate,
      duration_minutes: minutes, pages, book_type: bookType, reading_mode: mode,
      status: "pending", parent_note: "", created_at: created,
    });
  }));

  app.get("/api/reading-submissions/mine", auth, async (c) => {
    if (!isChild(c)) return noChild(c);
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM reading_submissions WHERE student_id = ? ORDER BY created_at DESC LIMIT 100"
    ).bind(c.get("user").id).all();
    return c.json(results);
  });

  app.get("/api/reading-submissions/pending", auth, parent, async (c) => {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM reading_submissions WHERE family_id = ? AND status = 'pending' ORDER BY created_at ASC LIMIT 200"
    ).bind(c.get("user").family_id).all();
    return c.json(results);
  });

  const getPending = async (c: any) => {
    const sub: any = await c.env.DB.prepare("SELECT * FROM reading_submissions WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).first();
    if (!sub) return { err: c.json({ detail: "Submission not found" }, 404) };
    if (sub.status !== "pending") return { err: c.json({ detail: "Already reviewed" }, 400) };
    return { sub };
  };

  app.post("/api/reading-submissions/:id/approve", auth, parent, guard(async (c) => {
    const { sub, err } = await getPending(c);
    if (err) return err;
    const edits: any = await c.req.json().catch(() => ({}));
    const minutes = cleanInt(edits.duration_minutes, 1, 600, "Minutes") || sub.duration_minutes;
    const pages = cleanInt(edits.pages, 1, 5000, "Pages") || sub.pages;
    const now = new Date().toISOString();
    const entryId = newId();
    await c.env.DB.batch([
      c.env.DB.prepare(
        "INSERT INTO reading_log (id, student_id, family_id, title, author, pages, read_date, duration_minutes, source, book_type, reading_mode, comprehension_notes, favourite_part, difficulty, parent_note, verified_by_parent, submitted_by_child, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'home', ?, ?, '', '', 'just_right', '', 1, 1, ?)"
      ).bind(entryId, sub.student_id, sub.family_id, sub.title, sub.author || "", pages, sub.read_date, minutes, sub.book_type, sub.reading_mode, now),
      c.env.DB.prepare("UPDATE reading_submissions SET status = 'approved', reviewed_at = ?, reading_log_id = ? WHERE id = ?")
        .bind(now, entryId, sub.id),
    ]);
    await awardXp(c.env.DB, sub.student_id, READING_XP).catch(() => {});
    return c.json({ ok: true, entry_id: entryId });
  }));

  app.post("/api/reading-submissions/:id/reject", auth, parent, async (c) => {
    const { sub, err } = await getPending(c);
    if (err) return err;
    const b: any = await c.req.json().catch(() => ({}));
    const note = String(b.parent_note || "").trim().slice(0, 200);
    await c.env.DB.prepare("UPDATE reading_submissions SET status = 'rejected', parent_note = ?, reviewed_at = ? WHERE id = ?")
      .bind(note, new Date().toISOString(), sub.id).run();
    return c.json({ ok: true });
  });

  // ---------- Reading log (parent-entered or read-only for child) ----------
  app.get("/api/reading-log", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM reading_log WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    sql += " ORDER BY read_date DESC, created_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all();
    return c.json(results.map(out));
  });

  app.post("/api/reading-log", auth, parent, guard(async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const title = String(b.title || "").trim();
    if (!title || !b.student_id) throw new Bad("student_id and title are required");
    const st = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(b.student_id, u.family_id).first();
    if (!st) return c.json({ detail: "Student not found" }, 404);
    const id = newId();
    const readDate = b.read_date ? String(b.read_date).slice(0, 10) : new Date().toISOString().slice(0, 10);
    await c.env.DB.prepare(
      "INSERT INTO reading_log (id, student_id, family_id, title, author, pages, pages_read, read_date, duration_minutes, source, book_type, reading_mode, comprehension_notes, favourite_part, difficulty, parent_note, verified_by_parent, submitted_by_child, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)"
    ).bind(
      id, b.student_id, u.family_id, title, String(b.author || "").slice(0, 80),
      cleanInt(b.pages, 1, 5000, "Pages"), cleanInt(b.pages_read, 1, 5000, "Pages read"), readDate,
      cleanInt(b.duration_minutes, 1, 600, "Minutes"), b.source || "home",
      BOOK_TYPES.includes(b.book_type) ? b.book_type : "fiction",
      MODES.includes(b.reading_mode) ? b.reading_mode : "independent",
      b.comprehension_notes ?? "", b.favourite_part ?? "", b.difficulty || "just_right", b.parent_note ?? "",
      new Date().toISOString()
    ).run();
    return c.json(out(await c.env.DB.prepare("SELECT * FROM reading_log WHERE id = ?").bind(id).first()));
  }));

  app.delete("/api/reading-log/:id", auth, parent, async (c) => {
    const r = await c.env.DB.prepare("DELETE FROM reading_log WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).run();
    if (!r.meta.changes) return c.json({ detail: "Entry not found" }, 404);
    return c.json({ ok: true });
  });
}
