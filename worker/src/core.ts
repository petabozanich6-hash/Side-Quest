import type { Hono, MiddlewareHandler } from "hono";
import { applySpelling } from "./data/spelling";
import * as lb from "./lessonBuilder";

type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
type Env = { DB: D1Database; JWT_SECRET: string };
type App = Hono<{ Bindings: Env; Variables: { user: AuthUser } }>;

const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();
const parseJson = <T>(s: string | null | undefined, fallback: T): T => {
  try { return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
const stageInfo: Record<string, { name: string; band: string }> = {
  ES1: { name: "Early Stage 1", band: "primary" },
  S1: { name: "Stage 1", band: "primary" },
  S2: { name: "Stage 2", band: "primary" },
  S3: { name: "Stage 3", band: "primary" },
  S4: { name: "Stage 4", band: "secondary" },
  S5: { name: "Stage 5", band: "secondary" },
  S6: { name: "Stage 6", band: "senior" },
};
function studentOut(r: any) {
  const extra = parseJson<{ stage_name?: string; band?: string; subject_levels?: Record<string, string>; electives?: any[] }>(r.extra, {});
  const meta = stageInfo[r.stage] || { name: r.stage, band: "primary" };
  const { extra: _extra, ...rest } = r;
  return {
    ...rest,
    interests: parseJson(r.interests, []),
    stage_name: extra.stage_name || meta.name,
    band: extra.band || meta.band,
    subject_levels: extra.subject_levels || {},
    electives: extra.electives || [],
  };
}

function lessonOut(r: any) {
  if (!r) return null;
  const { data, ...cols } = r;
  return applySpelling({ ...parseJson(data, {}), ...cols });
}
function lessonSummary(r: any) {
  const l: any = lessonOut(r);
  if (!l) return null;
  delete l.explicit_teaching;
  delete l.worked_example;
  return l;
}
function subOut(r: any) {
  return {
    ...r,
    needs_help: !!r.needs_help,
    file_ids: parseJson(r.file_ids, []),
    outcome_mappings: parseJson(r.outcome_mappings, []),
  };
}
const resOut = (r: any) => ({ ...r, approved: !!r.approved, shared: !!r.shared });
const cheerOut = (r: any) => ({ ...r, seen: !!r.seen });

export function registerCore(app: App, auth: MiddlewareHandler, parent: MiddlewareHandler) {
  // ---------- Dashboards ----------
  app.get("/api/dashboard/parent", auth, parent, async (c) => {
    const fid = c.get("user").family_id;
    const db = c.env.DB;
    const count = async (sql: string, ...b: any[]) =>
      (await db.prepare(sql).bind(...b).first<{ n: number }>())?.n ?? 0;
    const { results: students } = await db.prepare(
      "SELECT id, family_id, name, username, birth_year, stage, year_level, theme, interests, notes, created_at, extra FROM students WHERE family_id = ?"
    ).bind(fid).all<any>();
    const out: any = {
      students: [],
      pending_review: await count("SELECT COUNT(*) n FROM submissions WHERE family_id = ? AND status = 'submitted'", fid),
      awaiting_help: await count("SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND status = 'awaiting_help'", fid),
      resources_pending: 0,
      unapproved_resources: await count("SELECT COUNT(*) n FROM resources WHERE family_id = ? AND approved = 0", fid),
    };
    for (const s of students) {
      out.students.push({
        ...studentOut(s),
        total_assignments: await count("SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND student_id = ?", fid, s.id),
        completed: await count("SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND student_id = ? AND status IN ('accepted','demonstrated','completed')", fid, s.id),
        awaiting_help: await count("SELECT COUNT(*) n FROM assignments WHERE family_id = ? AND student_id = ? AND status = 'awaiting_help'", fid, s.id),
      });
    }
    return c.json(out);
  });

  app.get("/api/dashboard/child", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const db = c.env.DB;
    const { results: pending } = await db.prepare(
      "SELECT * FROM assignments WHERE student_id = ? AND status IN ('not_started','opened','in_progress','awaiting_help','needs_revision') ORDER BY created_at DESC LIMIT 50"
    ).bind(u.id).all<any>();
    for (const a of pending) {
      const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      a.lesson = lb.childSafeLesson(lb.assignmentLesson(a, live));
      delete a.lesson_snapshot;
    }
    const { results: fb } = await db.prepare(
      "SELECT * FROM submissions WHERE student_id = ? AND parent_feedback IS NOT NULL ORDER BY reviewed_at DESC LIMIT 5"
    ).bind(u.id).all<any>();
    const feedback = [];
    for (const f of fb) {
      const o: any = subOut(f);
      o.lesson = lb.childSafeLesson(lessonSummary(await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(f.lesson_id).first()));
      feedback.push(o);
    }
    const { results: ch } = await db.prepare(
      "SELECT * FROM cheers WHERE student_id = ? AND seen = 0 ORDER BY created_at DESC LIMIT 20"
    ).bind(u.id).all<any>();
    const student = await db.prepare(
      "SELECT id, family_id, name, username, birth_year, stage, year_level, theme, interests, notes, created_at, extra FROM students WHERE id = ?"
    ).bind(u.id).first<any>();
    return c.json({
      student: { ...studentOut(student), role: "child" },
      today: pending.slice(0, 5),
      all_pending: pending,
      feedback,
      cheers: ch.map(cheerOut),
    });
  });

  // ---------- Account plan ----------
  app.get("/api/account/plan", auth, async (c) => {
    return c.json(await lb.planSummary(c.env.DB, c.get("user").family_id));
  });

  // ---------- Lessons (family library; pre-made lessons are hidden: "Side-Quest upgrade coming later") ----------
  const send = (c: any, r: lb.Fail) => c.json({ detail: r.detail, code: r.code }, r.status);

  app.get("/api/lessons", auth, parent, async (c) => {
    const archived = c.req.query("archived") === "1";
    return c.json(await lb.listLessons(c.env.DB, c.get("user").family_id, { archived, q: c.req.query("q") || undefined }));
  });

  app.get("/api/lesson-index", auth, parent, async (c) => {
    const archived = c.req.query("archived") === "1";
    return c.json(await lb.listLessons(c.env.DB, c.get("user").family_id, { archived, q: c.req.query("q") || undefined }));
  });

  app.post("/api/lessons", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.createLesson(c.env.DB, c.get("user").family_id, b);
    return r.ok ? c.json(r.lesson) : send(c, r);
  });

  app.put("/api/lessons/:id", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.updateLesson(c.env.DB, c.get("user").family_id, c.req.param("id"), b);
    return r.ok ? c.json({ ...r.lesson, assigned_copies_unchanged: r.assigned_copies_unchanged }) : send(c, r);
  });

  app.post("/api/lessons/:id/duplicate", auth, parent, async (c) => {
    const r = await lb.duplicateLesson(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json(r.lesson) : send(c, r);
  });

  app.post("/api/lessons/:id/archive", auth, parent, async (c) => {
    const r = await lb.setArchived(c.env.DB, c.get("user").family_id, c.req.param("id"), true);
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });

  app.post("/api/lessons/:id/restore", auth, parent, async (c) => {
    const r = await lb.setArchived(c.env.DB, c.get("user").family_id, c.req.param("id"), false);
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });

  app.get("/api/lessons/:id", auth, parent, async (c) => {
    const l = await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(c.req.param("id"), c.get("user").family_id).first();
    if (!l) return c.json({ detail: "Lesson not found" }, 404);
    return c.json(lb.lessonOut(l));
  });

  app.delete("/api/lessons/:id", auth, parent, async (c) => {
    const r = await lb.deleteLesson(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json({ ok: true, archived: r.archived }) : send(c, r);
  });

  // ---------- Assignments ----------
  app.get("/api/assignments", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM assignments WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    if (c.req.query("status")) { sql += " AND status = ?"; b.push(c.req.query("status")); }
    sql += " ORDER BY created_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    for (const a of results) {
      const live = a.lesson_snapshot ? null : await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      const l = lb.assignmentLesson(a, live);
      a.lesson = u.role === "child" ? lb.childSafeLesson(l) : l;
      delete a.lesson_snapshot;
    }
    return c.json(results);
  });

  app.post("/api/assignments", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.assignLesson(c.env.DB, c.get("user").family_id, b);
    return r.ok ? c.json(r.assignment) : send(c, r);
  });

  app.get("/api/assignments/:id", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM assignments WHERE id = ? AND family_id = ?";
    const b: any[] = [c.req.param("id"), u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    const a: any = await c.env.DB.prepare(sql).bind(...b).first();
    if (!a) return c.json({ detail: "Not found" }, 404);
    const live = a.lesson_snapshot ? null : await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
    const l = lb.assignmentLesson(a, live);
    a.lesson = u.role === "child" ? lb.childSafeLesson(l) : l;
    delete a.lesson_snapshot;
    const { results } = await c.env.DB.prepare("SELECT * FROM submissions WHERE assignment_id = ? ORDER BY submitted_at DESC LIMIT 50").bind(a.id).all<any>();
    a.submissions = results.map(subOut);
    return c.json(a);
  });

  app.put("/api/assignments/:id/status", auth, async (c) => {
    const u = c.get("user");
    const status = c.req.query("status") || "";
    if (!status) return c.json({ detail: "status is required" }, 400);
    let sql = "UPDATE assignments SET status = ?, updated_at = ? WHERE id = ? AND family_id = ?";
    const b: any[] = [status, nowIso(), c.req.param("id"), u.family_id];
    if (u.role === "child") {
      if (!["opened", "in_progress", "awaiting_help", "submitted"].includes(status)) {
        return c.json({ detail: "Child cannot set this status" }, 403);
      }
      sql += " AND student_id = ?"; b.push(u.id);
    }
    await c.env.DB.prepare(sql).bind(...b).run();
    return c.json({ ok: true });
  });

  // ---------- Submissions ----------
  app.post("/api/submissions", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.submitWork(c.env.DB, u, b);
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json(out);
  });

  app.post("/api/assignments/:id/quiz-check", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.checkQuiz(c.env.DB, u, c.req.param("id"), b.answers);
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json(out);
  });

  app.get("/api/submissions", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM submissions WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    if (c.req.query("status")) { sql += " AND status = ?"; b.push(c.req.query("status")); }
    sql += " ORDER BY submitted_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    const out = [];
    for (const r of results) {
      const s: any = subOut(r);
      s.lesson = lessonSummary(await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(r.lesson_id).first());
      const st: any = await c.env.DB.prepare("SELECT id, name, username, stage, year_level, theme FROM students WHERE id = ?").bind(r.student_id).first();
      s.student = st;
      out.push(s);
    }
    return c.json(out);
  });

  app.get("/api/submissions/:id", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM submissions WHERE id = ? AND family_id = ?";
    const b: any[] = [c.req.param("id"), u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    const r: any = await c.env.DB.prepare(sql).bind(...b).first();
    if (!r) return c.json({ detail: "Not found" }, 404);
    const s: any = subOut(r);
    const sl = lessonOut(await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(r.lesson_id).first());
    s.lesson = u.role === "child" ? lb.childSafeLesson(sl) : sl;
    s.student = await c.env.DB.prepare("SELECT id, name, username, stage, year_level, theme FROM students WHERE id = ?").bind(r.student_id).first();
    s.files = [];
    return c.json(s);
  });

  app.post("/api/submissions/:id/feedback", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.reviewSubmission(c.env.DB, u.family_id, u.id, c.req.param("id"), b);
    return r.ok ? c.json({ ok: true, xp_awarded: r.xp_awarded }) : send(c, r);
  });

  // ---------- Resources ----------
  app.get("/api/resources", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM resources WHERE (family_id = ? OR shared = 1)";
    const b: any[] = [u.family_id];
    if (c.req.query("stage")) { sql += " AND stage = ?"; b.push(c.req.query("stage")); }
    if (c.req.query("learning_area")) { sql += " AND learning_area = ?"; b.push(c.req.query("learning_area")); }
    if (u.role === "child") sql += " AND approved = 1";
    sql += " ORDER BY created_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    return c.json(results.map(resOut));
  });

  app.post("/api/resources", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const title = String(b.title || "").trim();
    const url = String(b.url || "").trim();
    if (!title || !url) return c.json({ detail: "Title and URL are required" }, 400);
    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO resources (id, family_id, title, url, provider, resource_type, learning_area, stage, purpose, licence, attribution, response_task, offline_alternative, age_suitability, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, c.get("user").family_id, title, url, b.provider ?? null, b.resource_type || "link", b.learning_area ?? null, b.stage ?? null, b.purpose ?? null, b.licence || "unknown", b.attribution ?? null, b.response_task ?? null, b.offline_alternative ?? null, b.age_suitability ?? null, nowIso()).run();
    return c.json(resOut(await c.env.DB.prepare("SELECT * FROM resources WHERE id = ?").bind(id).first()));
  });

  app.put("/api/resources/:id/approve", auth, parent, async (c) => {
    await c.env.DB.prepare("UPDATE resources SET approved = 1, status = 'parent_approved' WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).run();
    return c.json({ ok: true });
  });

  // ---------- Calendar ----------
  app.get("/api/calendar", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM calendar_events WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND (student_id = ? OR student_id IS NULL)"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    sql += " ORDER BY date ASC LIMIT 1000";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    return c.json(results);
  });

  app.post("/api/calendar", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    if (!b.title || !b.date) return c.json({ detail: "Title and date are required" }, 400);
    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, c.get("user").family_id, b.student_id || null, b.title, b.date, b.start_time ?? null, b.duration_minutes ?? null, b.event_type || "lesson", b.linked_lesson_id || null, b.linked_assignment_id || null, b.notes ?? null, nowIso()).run();
    return c.json(await c.env.DB.prepare("SELECT * FROM calendar_events WHERE id = ?").bind(id).first());
  });

  app.put("/api/calendar/:id/done", auth, async (c) => {
    const u = c.get("user");
    const done = c.req.query("done") !== "false";
    let sql = "UPDATE calendar_events SET status = ? WHERE id = ? AND family_id = ?";
    const b: any[] = [done ? "done" : "scheduled", c.req.param("id"), u.family_id];
    if (u.role === "child") { sql += " AND (student_id = ? OR student_id IS NULL)"; b.push(u.id); }
    const r = await c.env.DB.prepare(sql).bind(...b).run();
    if (!r.meta.changes) return c.json({ detail: "Event not found" }, 404);
    return c.json({ ok: true, status: done ? "done" : "scheduled" });
  });

  app.delete("/api/calendar/:id", auth, parent, async (c) => {
    const r = await c.env.DB.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).run();
    if (!r.meta.changes) return c.json({ detail: "Event not found" }, 404);
    return c.json({ ok: true });
  });

  // ---------- Cheers ----------
  app.post("/api/cheers", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const st = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(b.student_id, u.family_id).first();
    if (!st) return c.json({ detail: "Student not found" }, 404);
    const message = String(b.message || "").trim().slice(0, 280);
    if (!message) return c.json({ detail: "Message is required" }, 400);
    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO cheers (id, family_id, student_id, from_user_id, from_name, message, emoji, seen, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)"
    ).bind(id, u.family_id, b.student_id, u.id, u.name, message, String(b.emoji || "✨").slice(0, 8), nowIso()).run();
    return c.json({ id, message });
  });

  app.get("/api/cheers", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM cheers WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND student_id = ?"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    if (u.role === "child") {
      await c.env.DB.prepare("UPDATE cheers SET seen = 1 WHERE student_id = ? AND seen = 0").bind(u.id).run();
    }
    return c.json(results.map(cheerOut));
  });
}
