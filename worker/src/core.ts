import { validateCalendarAssignment } from "./calendarLinks";
import { calendarConflict, syncAssignmentDate } from "./calendarIntegrity";
import { publicMapping } from "./syllabusText";
import type { Hono, MiddlewareHandler } from "hono";
import { applySpelling } from "./data/spelling";
import * as lb from "./lessonBuilder";
import * as aid from "./aiDraft";
import { fastLessonPipelineEnabled } from "./aiPipeline";
import * as bat from "./lessonBatches";
import * as help from "./aiHelp";
import * as res from "./resources";
import * as pl from "./planning";
import { buildPortfolio } from "./portfolio";
import { billingSummary } from "./billing";

type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
type Env = { DB: D1Database; JWT_SECRET: string; BUCKET?: R2Bucket; AI?: aid.AiBinding; AI_GATEWAY_ID?: string; AI_MODEL?: string; AI_HELP_MODEL?: string; AI_COMPACT_GENERATION?: string; AI_FAST_PIPELINE?: string; AI_FAST_PIPELINE_STOP?: string; HELP_PER_CHILD_DAY?: string; HELP_PER_FAMILY_DAY?: string; HELP_PER_FAMILY_MONTH?: string; YOUTUBE_API_KEY?: string };
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
const ASSIGNMENT_STATUSES = ["not_started", "opened", "in_progress", "awaiting_help", "submitted", "needs_revision", "accepted", "demonstrated", "completed"];
const WORKING = ["not_started", "opened", "in_progress", "awaiting_help", "needs_revision"];
const CHILD_STATUS_FROM: Record<string, string[]> = {
  opened: ["not_started"],
  in_progress: WORKING,
  awaiting_help: WORKING,
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
/** Rows keyed by id for `${sqlPrefix} (?, ?, ...)`, in chunks that stay under D1's 100 bound parameters per query. */
async function rowsById(db: D1Database, sqlPrefix: string, ids: unknown[], leading: unknown[] = []): Promise<Map<string, any>> {
  const unique = [...new Set(ids.filter((x): x is string => typeof x === "string" && x.length > 0))];
  const out = new Map<string, any>();
  for (let i = 0; i < unique.length; i += 90) {
    const chunk = unique.slice(i, i + 90);
    const { results } = await db.prepare(`${sqlPrefix} (${chunk.map(() => "?").join(", ")})`).bind(...leading, ...chunk).all<any>();
    for (const row of results) out.set(row.id, row);
  }
  return out;
}

function subOut(r: any) {
  return {
    ...r,
    needs_help: !!r.needs_help,
    file_ids: parseJson(r.file_ids, []),
    review_flags: parseJson(r.review_flags, []),
    outcome_mappings: (parseJson(r.outcome_mappings, []) as any[]).map(publicMapping),
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
      "SELECT * FROM assignments WHERE student_id = ? AND status IN ('not_started','opened','in_progress','awaiting_help','needs_revision','needs_more_practice') ORDER BY CASE WHEN status IN ('needs_revision','needs_more_practice','in_progress','awaiting_help','opened') THEN 0 ELSE 1 END, created_at DESC LIMIT 200"
    ).bind(u.id).all<any>();
    for (const a of pending) {
      const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      a.lesson = lb.childSafeLesson(lb.assignmentLesson(a, live));
      // Give the dashboard the *last visited step*, never the child's answers.
      // This is a position indicator, not a claim that all earlier work is completed.
      const draft = parseJson<any>(a.draft, {});
      const lesson = a.lesson || {};
      if (Number.isInteger(draft.step) && (lesson.builder || lesson.source === "parent" || lesson.source === "ai")) {
        const count = (key: string) => Array.isArray(lesson[key]) ? lesson[key].length : 0;
        const hasScoredQuiz = (lesson.quiz || []).some((q: any) => q.type !== "short_answer" && Array.isArray(q.options));
        const videos = (lesson.resources || []).filter((r: any) => r.type === "video" && (r.embed_url || r.url)).length;
        const total = 3 + count("texts") + count("sections") + count("worked_examples") +
          (count("misconceptions") ? 1 : 0) + Math.ceil(count("guided_practice") / 4) +
          count("activities") + (count("questions") ? 1 : 0) +
          (hasScoredQuiz ? 1 : 0) + videos;
        a.resume = { step: Math.max(0, Math.min(total - 1, draft.step)), total };
      }
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
      // No "notes": those are the parent's private notes about the child (child-login strips them too).
      "SELECT id, family_id, name, username, birth_year, stage, year_level, theme, interests, created_at, extra FROM students WHERE id = ?"
    ).bind(u.id).first<any>();
    const { results: doneRows } = await db.prepare(
      "SELECT * FROM assignments WHERE student_id = ? AND status IN ('accepted','demonstrated','completed') ORDER BY updated_at DESC LIMIT 20"
    ).bind(u.id).all<any>();
    const completed = [];
    for (const a of doneRows) {
      const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      const l: any = lb.childSafeLesson(lb.assignmentLesson(a, live)) || {};
      completed.push({ id: a.id, status: a.status, updated_at: a.updated_at, lesson: { title: l.title, learning_area: l.learning_area } });
    }
    const { results: waitRows } = await db.prepare(
      "SELECT * FROM assignments WHERE student_id = ? AND status = 'submitted' ORDER BY updated_at DESC LIMIT 20"
    ).bind(u.id).all<any>();
    const waiting = [];
    for (const a of waitRows) {
      const live = a.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      const l: any = lb.assignmentLesson(a, live) || {};
      waiting.push({ id: a.id, lesson: { title: l.title, learning_area: l.learning_area } });
    }
    const pet = await db.prepare("SELECT xp FROM pets WHERE student_id = ?").bind(u.id).first<{ xp: number }>().catch(() => null);
    for (const a of pending) delete a.draft;
    // Offline lessons (saved on the child's device) are a Family Membership feature.
    const offlineAllowed = (await lb.getEntitlement(db, u.family_id)).limits.offlineLessons;
    return c.json({
      offline_allowed: offlineAllowed,
      student: { ...studentOut(student), role: "child" },
      completed,
      waiting,
      xp: pet?.xp ?? 0,
      today: pending.slice(0, 5),
      all_pending: pending,
      feedback,
      cheers: ch.map(cheerOut),
    });
  });

  app.get("/api/features", auth, (c) => c.json({ uploads: !!c.env.BUCKET }));

  // ---------- Portfolio export (parent only) ----------
  app.get("/api/portfolio", auth, parent, async (c) => {
    const u = c.get("user");
    const out = await buildPortfolio(c.env.DB, u.family_id, c.req.query("student_id") || "", { from: c.req.query("from") || "", to: c.req.query("to") || "" });
    if (!out) return c.json({ detail: "Student not found" }, 404);
    return c.json(out);
  });

  // ---------- Account plan ----------
  app.get("/api/account/plan", auth, async (c) => {
    const fid = c.get("user").family_id;
    return c.json({ ...(await lb.planSummary(c.env.DB, fid)), billing: await billingSummary(c.env.DB, c.env as any, fid) });
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

  // The single AI draft is available once during an active free preview.
  // All generation and quota checks are still enforced in the server function.
  app.get("/api/ai/status", auth, parent, async (c) => {
    const u = c.get("user");
    const { plan, limits } = await lb.getEntitlement(c.env.DB, u.family_id);
    const usage = await aid.aiUsage(c.env.DB, u.family_id);
    const previewEligible = plan === "FREE_PREVIEW" && usage.preview.remaining > 0;
    return c.json({ allowed: limits.aiGeneration || previewEligible, available: !!c.env.AI, preview_eligible: previewEligible, usage });
  });

  app.post("/api/ai/lesson-draft", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await aid.draftLessonWithAi(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, compact: c.env.AI_COMPACT_GENERATION === "true", fastPipeline: fastLessonPipelineEnabled(c.env), request: b });
    return r.ok ? c.json({ lesson: r.lesson, usage: r.usage, warnings: r.warnings, model: r.model, assumptions: r.assumptions, generation: r.generation }) : send(c, r);
  });

  app.post("/api/ai/lesson-refine", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await aid.refineLessonWithAi(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, lessonId: String(b.lesson_id || ""), instruction: b.instruction, target: b.target });
    return r.ok ? c.json(r) : send(c, r);
  });

  app.post("/api/ai/series-plan", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await aid.planSeriesWithAi(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, request: b });
    return r.ok ? c.json(r) : send(c, r);
  });

  // Sets of AI lessons ("four science lessons…"), remembered on the server so no draft is ever lost from view.
  app.post("/api/ai/batches", auth, parent, async (c) => {
    const u = c.get("user");
    const b: any = await c.req.json().catch(() => ({}));
    const r = await bat.createBatch(c.env.DB, { familyId: u.family_id, userId: u.id, body: b });
    return r.ok ? c.json(r.batch) : send(c, r);
  });
  app.get("/api/ai/batches", auth, parent, async (c) => c.json(await bat.listBatches(c.env.DB, c.get("user").family_id, { open: c.req.query("open") === "1" })));
  app.get("/api/ai/batches/:id", auth, parent, async (c) => {
    const r = await bat.getBatch(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json(r.batch) : send(c, r);
  });
  app.post("/api/ai/batches/:id/items/:index/draft", auth, parent, async (c) => {
    const u = c.get("user");
    const r = await bat.draftBatchItem(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, compact: c.env.AI_COMPACT_GENERATION === "true", fastPipeline: fastLessonPipelineEnabled(c.env), batchId: c.req.param("id"), index: Number(c.req.param("index")) });
    return r.ok ? c.json({ lesson: r.lesson, reused: r.reused, usage: r.usage, warnings: r.warnings, assumptions: r.assumptions, generation: r.generation }) : send(c, r);
  });
  app.post("/api/ai/batches/:id/dismiss", auth, parent, async (c) => {
    const r = await bat.dismissBatch(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json(r) : send(c, r);
  });

  app.get("/api/resources/status", auth, parent, async (c) => c.json(await res.resourceStatus(c.env, c.env.DB, c.get("user").family_id)));

  app.post("/api/resources/suggest", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await res.suggestForLesson(c.env, c.env.DB, c.get("user"), b);
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json(out);
  });

  app.post("/api/resources/verify-link", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await res.verifyLink(b.url);
    if (!r.ok) return send(c, r);
    return c.json(r.video);
  });

  app.post("/api/lessons/:id/match-outcomes", auth, parent, async (c) => {
    const u = c.get("user");
    const r = await aid.matchLessonOutcomes(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, lessonId: c.req.param("id"), model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID });
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json({ ...out, suggestions: (out.suggestions || []).map(publicMapping) });
  });

  app.post("/api/lessons/:id/apply-patch", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await aid.applyLessonPatch(c.env.DB, c.get("user").family_id, c.req.param("id"), b.patch);
    return r.ok ? c.json(r.lesson) : send(c, r);
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
    return r.ok ? c.json({ ok: true, deleted: r.deleted, archived: r.archived }) : send(c, r);
  });

  // ---------- Assignments ----------
  app.get("/api/assignments", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM assignments WHERE family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND student_id = ? AND status != 'revoked'"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND student_id = ?"; b.push(c.req.query("student_id")); }
    if (c.req.query("status")) { sql += " AND status = ?"; b.push(c.req.query("status")); }
    sql += " ORDER BY created_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    for (const a of results) {
      const live = a.lesson_snapshot ? null : await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
      const l = lb.assignmentLesson(a, live);
      a.lesson = u.role === "child" ? lb.childSafeLesson(l) : l;
      delete a.lesson_snapshot;
      delete a.draft;
    }
    return c.json(results);
  });

  // Who already has this lesson, so the assign dialog can stop duplicates before they're sent.
  app.get("/api/lessons/:id/assignees", auth, parent, async (c) => {
    const fid = c.get("user").family_id;
    const lesson = await c.env.DB.prepare("SELECT id FROM lessons WHERE id = ? AND family_id = ?").bind(c.req.param("id"), fid).first();
    if (!lesson) return c.json({ detail: "Lesson not found" }, 404);
    return c.json((await lb.lessonAssignees(c.env.DB, fid, c.req.param("id"))).get(c.req.param("id")) || []);
  });

  app.post("/api/assignments", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.assignLesson(c.env.DB, c.get("user").family_id, b);
    return r.ok ? c.json(r.assignment) : send(c, r);
  });

  app.put("/api/assignments/:id", auth, parent, async (c) => {
    const r = await pl.updateAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json(r.assignment) : send(c, r);
  });
  app.post("/api/assignments/:id/reassign", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await pl.reassignAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"), b.student_id);
    return r.ok ? c.json(r.assignment) : send(c, r);
  });
  app.delete("/api/assignments/:id", auth, parent, async (c) => {
    const r = await pl.cancelAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });

  // ---------- Evidence not tied to a lesson (excursions, observations, projects) ----------
  app.get("/api/evidence-notes", auth, parent, async (c) => {
    return c.json(await pl.listEvidenceNotes(c.env.DB, c.get("user").family_id, { student_id: c.req.query("student_id") || undefined, q: c.req.query("q") || undefined, from: c.req.query("from") || undefined, to: c.req.query("to") || undefined }));
  });
  app.post("/api/evidence-notes", auth, parent, async (c) => {
    const r = await pl.createEvidenceNote(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok ? c.json(r.note) : send(c, r);
  });
  app.delete("/api/evidence-notes/:id", auth, parent, async (c) => {
    const r = await pl.deleteEvidenceNote(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });

  app.get("/api/assignments/:id", auth, async (c) => {
    const u = c.get("user");
    let sql = "SELECT * FROM assignments WHERE id = ? AND family_id = ?";
    const b: any[] = [c.req.param("id"), u.family_id];
    if (u.role === "child") { sql += " AND student_id = ? AND status != 'revoked'"; b.push(u.id); }
    const a: any = await c.env.DB.prepare(sql).bind(...b).first();
    if (!a) return c.json({ detail: "Not found" }, 404);
    const live = a.lesson_snapshot ? null : await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(a.lesson_id).first();
    const l = lb.assignmentLesson(a, live);
    a.lesson = u.role === "child" ? lb.childSafeLesson(l) : l;
    delete a.lesson_snapshot;
    if (u.role === "child") {
      a.draft = parseJson(a.draft, null);
      a.quiz_passed = await lb.quizPassed(c.env.DB, u, a, l);
    } else {
      delete a.draft;
    }
    const { results } = await c.env.DB.prepare("SELECT * FROM submissions WHERE assignment_id = ? ORDER BY submitted_at DESC LIMIT 50").bind(a.id).all<any>();
    a.submissions = results.map(subOut);
    return c.json(a);
  });

  app.put("/api/assignments/:id/status", auth, async (c) => {
    const u = c.get("user");
    const status = c.req.query("status") || "";
    if (!status) return c.json({ detail: "status is required" }, 400);
    if (!ASSIGNMENT_STATUSES.includes(status)) return c.json({ detail: "Unknown status" }, 400);
    let sql = "UPDATE assignments SET status = ?, updated_at = ? WHERE id = ? AND family_id = ? AND status != 'revoked'";
    const b: any[] = [status, nowIso(), c.req.param("id"), u.family_id];
    if (u.role === "child") {
      // A child can open, work on, or ask for help with their own unfinished work. Submitting goes through
      // /api/submissions, and finished or submitted work is never moved backwards.
      const from = CHILD_STATUS_FROM[status];
      if (!from) return c.json({ detail: "Child cannot set this status" }, 403);
      sql += ` AND student_id = ? AND status IN (${from.map(() => "?").join(",")})`; b.push(u.id, ...from);
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

  app.put("/api/assignments/:id/draft", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.saveDraft(c.env.DB, u, c.req.param("id"), b);
    return r.ok ? c.json({ ok: true, saved_at: r.saved_at }) : send(c, r);
  });

  app.post("/api/assignments/:id/practice-check", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const b: any = await c.req.json().catch(() => ({}));
    const r = await lb.checkPractice(c.env.DB, u, c.req.param("id"), b);
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json(out);
  });

  app.get("/api/help/status", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    return c.json(await help.helpStatus(c.env.DB, c.env.AI, u, help.helpLimits(c.env)));
  });

  app.post("/api/assignments/:id/help", auth, async (c) => {
    const u = c.get("user");
    if (u.role !== "child") return c.json({ detail: "Child access required" }, 403);
    const b: any = await c.req.json().catch(() => ({}));
    const r = await help.helpForChild(c.env.DB, c.env.AI, { user: u, assignmentId: c.req.param("id"), kind: b.kind, target: b.target, level: b.level, model: c.env.AI_HELP_MODEL || c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, limits: help.helpLimits(c.env) });
    if (!r.ok) return send(c, r);
    return c.json({ text: r.text, source: r.source, remaining_today: r.remaining_today });
  });

  app.get("/api/ai/help-usage", auth, parent, async (c) => c.json(await help.helpUsageForFamily(c.env.DB, c.get("user").family_id, help.helpLimits(c.env))));

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
    // Look lessons and children up in batches: one query per row would pass D1's
    // 1,000-queries-per-request limit for a family with a few hundred submissions.
    const lessons = await rowsById(c.env.DB, "SELECT * FROM lessons WHERE id IN", results.map((r: any) => r.lesson_id));
    const students = await rowsById(c.env.DB, "SELECT id, name, username, stage, year_level, theme FROM students WHERE family_id = ? AND id IN", results.map((r: any) => r.student_id), [u.family_id]);
    const out = [];
    for (const r of results) {
      const s: any = subOut(r);
      const summary = lessonSummary(lessons.get(r.lesson_id) ?? null);
      // A child's list must never carry answer keys, quiz answers or parent notes (same rule as every other child route).
      s.lesson = u.role === "child" ? lb.childSafeLesson(summary) : summary;
      s.student = students.get(r.student_id) ?? null;
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
    // Review the same immutable lesson snapshot the child answered, even when the parent edits their library copy.
    const assignment: any = await c.env.DB.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ? AND student_id = ?")
      .bind(r.assignment_id, u.family_id, r.student_id).first();
    const live = assignment?.lesson_snapshot ? null : await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)")
      .bind(r.lesson_id, u.family_id).first();
    const sl = assignment ? lb.assignmentLesson(assignment, live) : lessonOut(live);
    s.lesson = u.role === "child" ? lb.childSafeLesson(sl) : sl;
    if (u.role === "parent") s.review_answers = parseJson(assignment?.draft, {});
    s.student = await c.env.DB.prepare("SELECT id, name, username, stage, year_level, theme FROM students WHERE id = ?").bind(r.student_id).first();
    // The support level the parent set when assigning: the default for the review's per-outcome support.
    if (u.role === "parent") s.support_level = assignment?.support_level || "green";
    const ids: string[] = Array.isArray(s.file_ids) ? s.file_ids.slice(0, 20) : [];
    s.files = [];
    for (const fid of ids) {
      const f = await c.env.DB.prepare("SELECT id, original_filename, content_type, size FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fid, u.family_id).first();
      if (f) s.files.push(f);
    }
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
    // lesson_title: the lesson sitting in a timetable slot (the slot's own title is its subject).
    let sql = "SELECT e.*, l.title AS lesson_title FROM calendar_events e LEFT JOIN lessons l ON l.id = e.linked_lesson_id WHERE e.family_id = ?";
    const b: any[] = [u.family_id];
    if (u.role === "child") { sql += " AND (e.student_id = ? OR e.student_id IS NULL)"; b.push(u.id); }
    else if (c.req.query("student_id")) { sql += " AND e.student_id = ?"; b.push(c.req.query("student_id")); }
    // A calendar month needs its six visible weeks, not the family's oldest
    // 1,000 entries. Explicit range keeps long-running school years accessible.
    const from = c.req.query("from"), to = c.req.query("to");
    if (from || to) {
      const dateOk = (v: string | undefined) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
        !Number.isNaN(Date.parse(v + "T12:00:00Z"));
      const span = Date.parse((to || "") + "T12:00:00Z") - Date.parse((from || "") + "T12:00:00Z");
      if (!dateOk(from) || !dateOk(to) || from! > to! || span > 100 * 86400000)
        return c.json({ detail: "Choose a valid calendar date range of up to 100 days." }, 400);
      sql += " AND e.date >= ? AND e.date <= ?"; b.push(from, to);
    }
    sql += " ORDER BY e.date ASC, e.start_time ASC LIMIT 1000";
    const { results } = await c.env.DB.prepare(sql).bind(...b).all<any>();
    return c.json(results);
  });

  app.post("/api/calendar", auth, parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    if (!b.title || !b.date) return c.json({ detail: "Title and date are required" }, 400);
    if (b.student_id) {
      const student = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?")
        .bind(String(b.student_id), c.get("user").family_id).first();
      if (!student) return c.json({ detail: "Student not found" }, 404);
    }
    if (b.linked_lesson_id) {
      const lesson = await c.env.DB.prepare("SELECT id FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)").bind(String(b.linked_lesson_id), c.get("user").family_id).first();
      if (!lesson) return c.json({ detail: "Lesson not found" }, 404);
    }
    const link = await validateCalendarAssignment(
      c.env.DB, c.get("user").family_id,
      b.linked_assignment_id, b.student_id, b.linked_lesson_id
    );
    if (!link.ok) return c.json({ detail: link.detail }, link.status);
    // A retry or an already-assigned child must not get a second calendar
    // entry for the same learning session. Separate timed sessions are valid.
    if (b.linked_assignment_id) {
      const duplicate = await c.env.DB.prepare(
        "SELECT id FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ? AND date = ? AND (? IS NULL OR start_time IS ?) LIMIT 1"
      ).bind(c.get("user").family_id, b.linked_assignment_id, b.date,
        b.start_time ?? null, b.start_time ?? null).first<{ id: string }>();
      if (duplicate) return c.json({
        code: "ALREADY_SCHEDULED",
        detail: "This lesson is already scheduled for that day. Open the existing calendar entry to change it.",
        event_id: duplicate.id,
      }, 409);
    }
    const conflict = await calendarConflict(c.env.DB, c.get("user").family_id, b);
    if (conflict) return c.json(conflict, conflict.code === "INVALID_TIME" ? 400 : 409);
    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, linked_lesson_id, linked_assignment_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, c.get("user").family_id, b.student_id || null, b.title, b.date, b.start_time ?? null, b.duration_minutes ?? null, b.event_type || "lesson", b.linked_lesson_id || null, b.linked_assignment_id || null, b.notes ?? null, nowIso()).run();
    await syncAssignmentDate(c.env.DB, c.get("user").family_id, b.linked_assignment_id);
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
    const linked = await c.env.DB.prepare("SELECT linked_assignment_id FROM calendar_events WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).first<{ linked_assignment_id: string | null }>();
    const r = await c.env.DB.prepare("DELETE FROM calendar_events WHERE id = ? AND family_id = ?")
      .bind(c.req.param("id"), c.get("user").family_id).run();
    if (!r.meta.changes) return c.json({ detail: "Event not found" }, 404);
    await syncAssignmentDate(c.env.DB, c.get("user").family_id, linked?.linked_assignment_id);
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
