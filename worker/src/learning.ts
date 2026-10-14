import { buildPlanWithAi, planAiUsage } from "./aiPlan";
import { JURISDICTIONS as PLAN_JURISDICTIONS, CHECKED_ON } from "./data/planJurisdictions";
import { analyseLifeEvidence } from "./data/lifeEvidence";
import { FRAMEWORKS, JURISDICTION_CODES, frameworkFor, getFamilyJurisdiction, normJurisdiction, setFamilyJurisdiction, usesNswOutcomes } from "./data/jurisdictions";
import { mapLifeEvidenceWithAi, lifeMapLimits } from "./lifeLearningAi";
import { getEntitlement } from "./lessonBuilder";
import { safely, trackLifeEvidence } from "./outcomeTracker";
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
    suggested_mappings: parseJson(row.suggested_mappings ?? row.ai_mappings, []),
    ai_mappings: parseJson(row.suggested_mappings ?? row.ai_mappings, []),
    accepted_mappings: parseJson(row.accepted_mappings, []),
  });
  // Existing production databases may use the original life_evidence schema (ai_mappings).
  // Never drop or rename historical evidence fields. D1 PRAGMA is read-only and cached per request.
  const evidenceColumns = async (db: D1Database): Promise<Set<string>> => {
    const { results } = await db.prepare("PRAGMA table_info(life_evidence)").all<{ name: string }>();
    const names = new Set((results || []).map(row => row.name));
    if (!names.has("id") || !names.has("family_id")) throw new Error("life_evidence schema is unavailable");
    return names;
  };
  const evidenceMappingColumn = (columns: Set<string>) =>
    columns.has("suggested_mappings") ? "suggested_mappings" : "ai_mappings";
  async function saveLifeEvidence(db: D1Database, record: Record<string, unknown>) {
    const columns = await evidenceColumns(db);
    const values = { ...record, [evidenceMappingColumn(columns)]: record.suggested_mappings };
    const keys = Object.keys(values).filter(k => columns.has(k));
    await db.prepare(`INSERT INTO life_evidence (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`)
      .bind(...keys.map(k => values[k])).run();
  }
  // Keep saves compatible with existing D1 installations without altering historical data.
  const planColumns = async (db: D1Database): Promise<Set<string>> => {
    const { results } = await db.prepare("PRAGMA table_info(learning_plans)").all<{ name: string }>();
    const names = new Set((results || []).map(row => row.name));
    if (!["id", "family_id", "student_id", "title"].every(key => names.has(key))) {
      throw new Error("learning_plans is missing its required columns");
    }
    return names;
  };
  async function insertLearningPlan(db: D1Database, plan: Record<string, unknown>) {
    const available = await planColumns(db);
    const keys = Object.keys(plan).filter(key => available.has(key));
    await db.prepare(`INSERT INTO learning_plans (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`)
      .bind(...keys.map(key => plan[key])).run();
  }
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
      "SELECT * FROM students WHERE id = ? AND family_id = ?"
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
    await saveLifeEvidence(c.env.DB, record);
    return c.json(lifeEvidenceOut(record));
  });

  // The family's state or territory decides which curriculum framework life learning is mapped to.
  app.get("/api/jurisdictions", (c) =>
    c.json(JURISDICTION_CODES.map((code) => {
      const f = FRAMEWORKS[code];
      return { code, name: f.jurisdiction_name, framework: f.name, framework_short: f.short, url: f.url, codes: f.codes };
    }))
  );

  app.get("/api/me/jurisdiction", g.auth, g.parent, async (c) => {
    const code = await getFamilyJurisdiction(c.env.DB, c.get("user").family_id);
    const f = frameworkFor(code);
    return c.json({ jurisdiction: code, framework: f ? { name: f.name, short: f.short, url: f.url, codes: f.codes, jurisdiction_name: f.jurisdiction_name } : null });
  });

  app.put("/api/me/jurisdiction", g.auth, g.parent, async (c) => {
    const body: any = await c.req.json().catch(() => ({}));
    const code = normJurisdiction(body.jurisdiction);
    if (!code) return c.json({ detail: "Choose your state or territory." }, 400);
    await setFamilyJurisdiction(c.env.DB, c.get("user").family_id, code);
    const f = FRAMEWORKS[code];
    return c.json({ ok: true, jurisdiction: code, framework: { name: f.name, short: f.short, url: f.url, codes: f.codes, jurisdiction_name: f.jurisdiction_name } });
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

    const fw = frameworkFor(await getFamilyJurisdiction(c.env.DB, user.family_id));
    if (!fw) return c.json({ detail: "Choose your state or territory first, so outcomes match your curriculum.", code: "JURISDICTION_REQUIRED" }, 409);

    const evidence = { ...row, file_ids: parseJson(row.file_ids, []) };
    const s = studentOut(student) || {};
    const { limits } = await getEntitlement(c.env.DB, user.family_id);
    let analysis;
    let notice: string | undefined;
    if (limits.aiGeneration && c.env.AI) {
      const r = await mapLifeEvidenceWithAi(c.env.DB, c.env.AI, {
        familyId: user.family_id, userId: user.id, framework: fw, evidence, student: s,
        model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, limits: lifeMapLimits(c.env),
      });
      if (!r.ok) return c.json({ detail: r.detail, code: r.code }, r.status as 429 | 502);
      analysis = r.analysis;
    } else {
      analysis = await analyseLifeEvidence(c.env.DB, evidence, s, fw);
      notice = limits.aiGeneration
        ? "AI mapping isn't available right now, so these are basic keyword suggestions."
        : "These are basic keyword suggestions. AI outcome mapping for your curriculum is part of the paid plan.";
    }
    const columns = await evidenceColumns(c.env.DB);
    const changes: Record<string, unknown> = {
      [evidenceMappingColumn(columns)]: JSON.stringify(analysis.mappings),
      ai_summary: analysis.summary, ai_activity_type: analysis.activity_type,
      ai_additional: analysis.additional_evidence_suggested,
      status: "mapping_ready", updated_at: nowIso()
    };
    const keys = Object.keys(changes).filter(k => columns.has(k));
    await c.env.DB.prepare(`UPDATE life_evidence SET ${keys.map(k => k + " = ?").join(", ")} WHERE id = ? AND family_id = ?`)
      .bind(...keys.map(k => changes[k]), row.id, user.family_id).run();
    return c.json({ ...analysis, notice });
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
    const columns = await evidenceColumns(c.env.DB);
    const proposed: Record<string, unknown> = {
      accepted_mappings: JSON.stringify(accepted),
      status: String(body.status || "accepted"),
      parent_note: body.parent_note ? String(body.parent_note) : null,
      reviewed_at, reviewed_by: user.id, updated_at: reviewed_at
    };
    const keys = Object.keys(proposed).filter(key => columns.has(key));
    await c.env.DB.prepare(`UPDATE life_evidence SET ${keys.map(key => key + " = ?").join(", ")} WHERE id = ? AND family_id = ?`)
      .bind(...keys.map(key => proposed[key]), c.req.param("eid"), user.family_id).run();
    const record = await c.env.DB.prepare("SELECT * FROM life_evidence WHERE id = ? AND family_id = ?")
      .bind(c.req.param("eid"), user.family_id)
      .first<any>();
    if (record) {
      const xp = ({ accepted: 20, demonstrated: 45, needs_more_evidence: 5 } as Record<string, number>)[String(body.status || "")] ?? 10;
      await awardPetXp(c.env.DB, record.student_id, xp, `Life learning: ${record.title || ""}`);
      await safely("life learning review", () => trackLifeEvidence(c.env.DB, user.family_id, record.id));
    }
    return c.json({ ok: true, accepted_count: accepted.length });
  });

  // Backwards-compatible planning metadata; uses the same family jurisdiction as registration and curriculum.
  app.get("/api/family/jurisdiction", g.auth, g.parent, async (c) => {
    const code = await getFamilyJurisdiction(c.env.DB, c.get("user").family_id);
    const j = code ? PLAN_JURISDICTIONS[code] : null;
    return c.json({ jurisdiction: code, name: j?.name ?? null, authority: j?.authority ?? null,
      plan_name: j?.planName ?? null, areas: j?.areas ?? [], requirements: j?.requirements ?? [],
      sources: j?.sources ?? [], checked_on: CHECKED_ON,
      options: JURISDICTION_CODES.map(c=>({code:c,name:PLAN_JURISDICTIONS[c].name,authority:PLAN_JURISDICTIONS[c].authority})) });
  });
  app.put("/api/family/jurisdiction", g.auth, g.parent, async (c) => {
    const body = await c.req.json().catch(()=>({})) as { jurisdiction?: string };
    const code = normJurisdiction(body.jurisdiction);
    if (!code) return c.json({detail:"Choose a state or territory"},400);
    await setFamilyJurisdiction(c.env.DB,c.get("user").family_id,code);
    return c.json({ok:true,jurisdiction:code,name:PLAN_JURISDICTIONS[code].name});
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
    await insertLearningPlan(c.env.DB, plan);
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
    const place = await getFamilyJurisdiction(c.env.DB, user.family_id);
    const jurisdiction = PLAN_JURISDICTIONS[place as keyof typeof PLAN_JURISDICTIONS];
    if (!jurisdiction) return c.json({ detail: "Choose a state or territory before generating a plan", code: "JURISDICTION_REQUIRED" }, 409);
    const { limits } = await getEntitlement(c.env.DB, user.family_id);
    const useAi = limits.aiGeneration && !!c.env.AI && c.req.query("mode") !== "template";
    let content: any;
    let warnings: string[] = [];
    if (useAi) {
      const r = await buildPlanWithAi(c.env.DB, c.env.AI, { familyId: user.family_id, userId: user.id, planId: planRow.id, model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID });
      if (!r.ok) return c.json({ detail: r.detail, code: r.code }, r.status);
      content = r.content;
      warnings = r.warnings;
    } else {
      content = await buildPlanContent(c.env.DB, planOut(planRow), studentOut(studentRow) || {}, jurisdiction);
    }
    const available = await planColumns(c.env.DB);
    if (!available.has("ai_content")) return c.json({ detail: "This database needs the learning plan AI content column before AI writing can be saved." }, 503);
    const changes: Record<string, unknown> = { ai_content: JSON.stringify(content), status: "draft", updated_at: nowIso() };
    const keys = Object.keys(changes).filter(key => available.has(key));
    await c.env.DB.prepare(`UPDATE learning_plans SET ${keys.map(key => key + " = ?").join(", ")} WHERE id = ? AND family_id = ?`)
      .bind(...keys.map(key => changes[key]), planRow.id, user.family_id).run();
    return c.json({ ok: true, generated_by: content.generated_by, warnings });
  };

  app.get("/api/learning-plans-ai/status", g.auth, g.parent, async (c) => {
    const user = c.get("user");
    const { limits } = await getEntitlement(c.env.DB, user.family_id);
    const code = await getFamilyJurisdiction(c.env.DB, user.family_id);
    const jurisdiction = PLAN_JURISDICTIONS[code as keyof typeof PLAN_JURISDICTIONS];
    return c.json({ allowed: limits.aiGeneration, available: !!c.env.AI, jurisdiction: code, jurisdiction_name: jurisdiction?.name || null, usage: await planAiUsage(c.env.DB, user.family_id) });
  });

  app.post("/api/learning-plans/:pid/build", g.auth, g.parent, buildHandler);
  app.post("/api/learning-plans/:pid/generate", g.auth, g.parent, buildHandler);
}
