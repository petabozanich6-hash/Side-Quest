import { analyseLifeEvidence } from "./data/lifeEvidence";
import { buildPlanContent } from "./data/planBuilder";
import type { App, Guards } from "./types";
import { nowIso, parseJson, newId } from "./types";

// Port of FastAPI routes; see docs/CLOUDFLARE_MIGRATION.md.
export function registerLearning(app: App, g: Guards) {
  const getLesson = (db: D1Database, familyId: string, lessonId: string) =>
    db.prepare("SELECT * FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)")
      .bind(lessonId, familyId)
      .first<any>();

  const lessonJson = (row: any): any => parseJson(row?.data, {});
  const jsonArray = (value: unknown) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return parseJson(value, []);
    return [];
  };
  const lessonEvidenceOut = (row: any) => ({ ...row, file_ids: parseJson(row.file_ids, []) });
  const lifeEvidenceOut = (row: any) => ({
    ...row,
    file_ids: parseJson(row.file_ids, []),
    suggested_mappings: parseJson(row.suggested_mappings, []),
    ai_mappings: parseJson(row.suggested_mappings, []),
    accepted_mappings: parseJson(row.accepted_mappings, []),
  });
  const planOut = (row: any) => ({
    ...row,
    interests: parseJson(row.interests, []),
    subject_focus: parseJson(row.subject_focus, []),
    ai_content: parseJson(row.ai_content, null),
  });
  const studentOut = (row: any) => {
    if (!row) return null;
    const extra = parseJson<{ electives?: unknown[]; subject_levels?: Record<string, unknown> }>(row.extra, {});
    const electives = parseJson(row.electives, []);
    const subjectLevels = parseJson(row.subject_levels, {});
    return {
      ...row,
      interests: parseJson(row.interests, []),
      electives: electives.length ? electives : Array.isArray(extra.electives) ? extra.electives : [],
      subject_levels:
        Object.keys(subjectLevels).length ? subjectLevels : extra.subject_levels && typeof extra.subject_levels === "object" ? extra.subject_levels : {},
    };
  };

  async function getStudent(db: D1Database, familyId: string, studentId: string) {
    return db.prepare(
      "SELECT id, family_id, name, username, birth_year, stage, year_level, theme, interests, notes, created_at, electives, subject_levels, extra FROM students WHERE id = ? AND family_id = ?"
    ).bind(studentId, familyId).first<any>();
  }

  async function getFiles(db: D1Database, familyId: string, fileIds: string[]) {
    const files: any[] = [];
    for (const fileId of fileIds) {
      try {
        const row = await db.prepare("SELECT * FROM files WHERE id = ? AND family_id = ?").bind(fileId, familyId).first<any>();
        if (row) files.push(row);
      } catch {
        return [];
      }
    }
    return files;
  }

  async function awardPetXp(db: D1Database, studentId: string, amount: number, reason: string) {
    try {
      await db.prepare("UPDATE pets SET xp = xp + ?, happiness = MIN(100, COALESCE(happiness, 0) + 5) WHERE student_id = ?")
        .bind(amount, studentId)
        .run();
      try {
        const row = await db.prepare("SELECT activity FROM pets WHERE student_id = ?").bind(studentId).first<{ activity?: string | null }>();
        if (!row) return;
        const activity = parseJson(row.activity, []) as any[];
        activity.push({ amount, reason, at: nowIso() });
        await db.prepare("UPDATE pets SET activity = ? WHERE student_id = ?").bind(JSON.stringify(activity), studentId).run();
      } catch {
        // ignore if activity column is unavailable
      }
    } catch {
      // ignore if pets table is not present yet
    }
  }

  app.post("/api/lessons/:lesson_id/quiz", g.auth, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const user = c.get("user");
    const lessonRow = await getLesson(c.env.DB, user.family_id, c.req.param("lesson_id"));
    if (!lessonRow) return c.json({ detail: "Lesson not found" }, 404);

    const quiz = jsonArray(lessonJson(lessonRow).quiz);
    const results = [];
    let correct_count = 0;
    for (const [index, answer] of answers.entries()) {
      if (index >= quiz.length) continue;
      const question: any = quiz[index] || {};
      const is_correct = answer === question.correct_index;
      if (is_correct) correct_count += 1;
      results.push({
        question_index: index,
        selected: answer,
        correct_index: question.correct_index,
        is_correct,
        explanation: question.explanation || "",
      });
    }

    const result = {
      id: newId(),
      family_id: user.family_id,
      lesson_id: c.req.param("lesson_id"),
      child_id: user.id,
      score: correct_count,
      total: quiz.length,
      results,
      completed_at: nowIso(),
    };
    await c.env.DB.prepare(
      "INSERT INTO quiz_results (id, family_id, lesson_id, child_id, score, total, results, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      result.id,
      result.family_id,
      result.lesson_id,
      result.child_id,
      result.score,
      result.total,
      JSON.stringify(result.results),
      result.completed_at
    ).run();
    return c.json(result);
  });

  app.post("/api/lessons/:lesson_id/evidence", g.auth, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const user = c.get("user");
    const lessonRow = await getLesson(c.env.DB, user.family_id, c.req.param("lesson_id"));
    if (!lessonRow) return c.json({ detail: "Lesson not found" }, 404);

    const evidence = {
      id: newId(),
      family_id: user.family_id,
      lesson_id: c.req.param("lesson_id"),
      child_id: user.role === "child" ? user.id : String(body.child_id || user.id),
      type: String(body.type || "text"),
      text: String(body.text || ""),
      file_name: String(body.file_name || ""),
      file_ids: JSON.stringify(Array.isArray(body.file_ids) ? body.file_ids : []),
      submitted_at: nowIso(),
    };
    await c.env.DB.prepare(
      "INSERT INTO lesson_evidence (id, family_id, lesson_id, child_id, type, text, file_name, file_ids, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      evidence.id,
      evidence.family_id,
      evidence.lesson_id,
      evidence.child_id,
      evidence.type,
      evidence.text,
      evidence.file_name,
      evidence.file_ids,
      evidence.submitted_at
    ).run();
    return c.json({ id: evidence.id, message: "Evidence saved" });
  });

  app.get("/api/lessons/:lesson_id/evidence", g.auth, async (c) => {
    const user = c.get("user");
    let sql = "SELECT * FROM lesson_evidence WHERE lesson_id = ? AND family_id = ?";
    const binds: any[] = [c.req.param("lesson_id"), user.family_id];
    if (user.role === "child") {
      sql += " AND child_id = ?";
      binds.push(user.id);
    }
    sql += " ORDER BY submitted_at DESC LIMIT 100";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<any>();
    return c.json((results || []).map(lessonEvidenceOut));
  });

  app.post("/api/life-evidence", g.auth, g.parent, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const user = c.get("user");
    const student = await getStudent(c.env.DB, user.family_id, String(body.student_id || ""));
    if (!student) return c.json({ detail: "Student not found" }, 404);

    const created_at = nowIso();
    const record = {
      id: newId(),
      family_id: user.family_id,
      student_id: student.id,
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      date: String(body.date || created_at.slice(0, 10)),
      duration_minutes: body.duration_minutes == null ? null : Number(body.duration_minutes),
      location: body.location ? String(body.location) : null,
      file_ids: JSON.stringify(Array.isArray(body.file_ids) ? body.file_ids : []),
      parent_note: body.parent_note ? String(body.parent_note) : null,
      status: "awaiting_mapping",
      suggested_mappings: JSON.stringify([]),
      accepted_mappings: JSON.stringify([]),
      ai_summary: null,
      ai_activity_type: null,
      ai_additional: null,
      created_by: user.id,
      reviewed_at: null,
      reviewed_by: null,
      created_at,
      updated_at: created_at,
    };
    if (!record.title || !record.description) return c.json({ detail: "title and description are required" }, 400);
    await c.env.DB.prepare(
      "INSERT INTO life_evidence (id, family_id, student_id, title, description, date, duration_minutes, location, file_ids, parent_note, status, suggested_mappings, accepted_mappings, ai_summary, ai_activity_type, ai_additional, created_by, reviewed_at, reviewed_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      record.id,
      record.family_id,
      record.student_id,
      record.title,
      record.description,
      record.date,
      record.duration_minutes,
      record.location,
      record.file_ids,
      record.parent_note,
      record.status,
      record.suggested_mappings,
      record.accepted_mappings,
      record.ai_summary,
      record.ai_activity_type,
      record.ai_additional,
      record.created_by,
      record.reviewed_at,
      record.reviewed_by,
      record.created_at,
      record.updated_at
    ).run();
    return c.json(lifeEvidenceOut(record));
  });

  app.post("/api/life-evidence/analyse", g.auth, g.parent, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const user = c.get("user");
    const row = await c.env.DB.prepare("SELECT * FROM life_evidence WHERE id = ? AND family_id = ?")
      .bind(String(body.evidence_id || ""), user.family_id)
      .first<any>();
    if (!row) return c.json({ detail: "Evidence not found" }, 404);
    const student = await getStudent(c.env.DB, user.family_id, row.student_id);
    if (!student) return c.json({ detail: "Student not found" }, 404);

    const analysis = await analyseLifeEvidence(c.env.DB, {
      ...row,
      file_ids: parseJson(row.file_ids, []),
    }, studentOut(student) || {});
    await c.env.DB.prepare(
      "UPDATE life_evidence SET suggested_mappings = ?, ai_summary = ?, ai_activity_type = ?, ai_additional = ?, status = ?, updated_at = ? WHERE id = ? AND family_id = ?"
    ).bind(
      JSON.stringify(analysis.mappings),
      analysis.summary,
      analysis.activity_type,
      analysis.additional_evidence_suggested,
      "mapping_ready",
      nowIso(),
      row.id,
      user.family_id
    ).run();
    return c.json(analysis);
  });

  app.get("/api/life-evidence", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    let sql = "SELECT * FROM life_evidence WHERE family_id = ?";
    const binds: any[] = [user.family_id];
    const studentId = c.req.query("student_id");
    if (studentId) {
      sql += " AND student_id = ?";
      binds.push(studentId);
    }
    sql += " ORDER BY created_at DESC LIMIT 500";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<any>();
    const out = [];
    for (const row of results || []) {
      const item = lifeEvidenceOut(row);
      item.student = studentOut(await getStudent(c.env.DB, user.family_id, row.student_id));
      out.push(item);
    }
    return c.json(out);
  });

  app.get("/api/life-evidence/:eid", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const row = await c.env.DB.prepare("SELECT * FROM life_evidence WHERE id = ? AND family_id = ?")
      .bind(c.req.param("eid"), user.family_id)
      .first<any>();
    if (!row) return c.json({ detail: "Not found" }, 404);
    const out = lifeEvidenceOut(row);
    out.student = studentOut(await getStudent(c.env.DB, user.family_id, row.student_id));
    out.files = await getFiles(c.env.DB, user.family_id, out.file_ids);
    return c.json(out);
  });

  app.post("/api/life-evidence/:eid/review", g.auth, g.parent, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const user = c.get("user");
    const accepted = (Array.isArray(body.outcome_mappings) ? body.outcome_mappings : []).filter((mapping: any) => mapping?.accepted);
    const reviewed_at = nowIso();
    await c.env.DB.prepare(
      "UPDATE life_evidence SET accepted_mappings = ?, status = ?, parent_note = ?, reviewed_at = ?, reviewed_by = ?, updated_at = ? WHERE id = ? AND family_id = ?"
    ).bind(
      JSON.stringify(accepted),
      String(body.status || "accepted"),
      body.parent_note ? String(body.parent_note) : null,
      reviewed_at,
      user.id,
      reviewed_at,
      c.req.param("eid"),
      user.family_id
    ).run();
    const record = await c.env.DB.prepare("SELECT * FROM life_evidence WHERE id = ? AND family_id = ?")
      .bind(c.req.param("eid"), user.family_id)
      .first<any>();
    if (record) {
      const xp = ({ accepted: 20, demonstrated: 45, needs_more_evidence: 5 } as Record<string, number>)[String(body.status || "")] ?? 10;
      await awardPetXp(c.env.DB, record.student_id, xp, `Life learning: ${record.title || ""}`);
    }
    return c.json({ ok: true, accepted_count: accepted.length });
  });

  app.get("/api/learning-plans", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    let sql = "SELECT * FROM learning_plans WHERE family_id = ?";
    const binds: any[] = [user.family_id];
    const studentId = c.req.query("student_id");
    if (studentId) {
      sql += " AND student_id = ?";
      binds.push(studentId);
    }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<any>();
    const out = [];
    for (const row of results || []) {
      const item = planOut(row);
      item.student = studentOut(await getStudent(c.env.DB, user.family_id, row.student_id));
      out.push(item);
    }
    return c.json(out);
  });

  app.get("/api/learning-plans/:pid", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const row = await c.env.DB.prepare("SELECT * FROM learning_plans WHERE id = ? AND family_id = ?")
      .bind(c.req.param("pid"), user.family_id)
      .first<any>();
    if (!row) return c.json({ detail: "Not found" }, 404);
    const out = planOut(row);
    out.student = studentOut(await getStudent(c.env.DB, user.family_id, row.student_id));
    return c.json(out);
  });

  app.post("/api/learning-plans", g.auth, g.parent, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const user = c.get("user");
    const student = await getStudent(c.env.DB, user.family_id, String(body.student_id || ""));
    if (!student) return c.json({ detail: "Student not found" }, 404);
    const title = String(body.title || "").trim();
    if (!title) return c.json({ detail: "Title is required" }, 400);

    const created_at = nowIso();
    const plan = {
      id: newId(),
      family_id: user.family_id,
      student_id: student.id,
      title,
      period_start: String(body.period_start || ""),
      period_end: String(body.period_end || ""),
      interests: JSON.stringify(Array.isArray(body.interests) ? body.interests : []),
      subject_focus: JSON.stringify(Array.isArray(body.subject_focus) ? body.subject_focus : []),
      teaching_approach: body.teaching_approach ? String(body.teaching_approach) : null,
      notes: body.notes ? String(body.notes) : null,
      status: "draft",
      ai_content: null,
      created_at,
      updated_at: created_at,
    };
    await c.env.DB.prepare(
      "INSERT INTO learning_plans (id, family_id, student_id, title, period_start, period_end, interests, subject_focus, teaching_approach, notes, status, ai_content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      plan.id,
      plan.family_id,
      plan.student_id,
      plan.title,
      plan.period_start,
      plan.period_end,
      plan.interests,
      plan.subject_focus,
      plan.teaching_approach,
      plan.notes,
      plan.status,
      plan.ai_content,
      plan.created_at,
      plan.updated_at
    ).run();
    return c.json(planOut(plan));
  });

  app.delete("/api/learning-plans/:pid", g.auth, g.parent, async (c) => {
    await c.env.DB.prepare("DELETE FROM learning_plans WHERE id = ? AND family_id = ?")
      .bind(c.req.param("pid"), c.get("user").family_id)
      .run();
    return c.json({ ok: true });
  });

  const buildHandler = async (c: any) => {
    const user = c.get("user");
    const planRow: any = await c.env.DB.prepare("SELECT * FROM learning_plans WHERE id = ? AND family_id = ?")
      .bind(c.req.param("pid"), user.family_id)
      .first();
    if (!planRow) return c.json({ detail: "Plan not found" }, 404);
    const studentRow = await getStudent(c.env.DB, user.family_id, planRow.student_id);
    if (!studentRow) return c.json({ detail: "Student not found" }, 404);
    const content = await buildPlanContent(c.env.DB, planOut(planRow), studentOut(studentRow) || {});
    await c.env.DB.prepare("UPDATE learning_plans SET ai_content = ?, status = 'draft', updated_at = ? WHERE id = ? AND family_id = ?")
      .bind(JSON.stringify(content), nowIso(), planRow.id, user.family_id)
      .run();
    return c.json({ ok: true });
  };

  app.post("/api/learning-plans/:pid/build", g.auth, g.parent, buildHandler);
  app.post("/api/learning-plans/:pid/generate", g.auth, g.parent, buildHandler);
}
