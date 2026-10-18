/**
 * Parent-defined learning goals for families outside Australia.
 * Never treats these as verified national/state curriculum outcomes.
 * Every read/write is scoped to a parent-owned family and child.
 */
import type { App, Guards } from "./types";
import { getFamilyJurisdiction } from "./data/jurisdictions";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const STATUSES = new Set(["not_started", "introduced", "developing", "demonstrated", "achieved"]);
const today = () => new Date().toISOString().slice(0, 10);

// Additive and safe to run against the existing production D1 database.
// Runtime schema creation avoids requiring a separate production migration to admit international families.
async function ensureTables(db: D1Database) {
  await db.prepare("CREATE TABLE IF NOT EXISTS international_learning_goals (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, learning_area TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'not_started', confirmation_note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_international_goals_child ON international_learning_goals(family_id, student_id)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS international_goal_evidence (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, goal_id TEXT NOT NULL, title TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', occurred_on TEXT NOT NULL, evidence_note_id TEXT, created_at TEXT NOT NULL)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_international_goal_evidence ON international_goal_evidence(family_id, student_id, goal_id)").run();
}

async function childFor(c: any) {
  const familyId = c.get("user").family_id as string;
  if (await getFamilyJurisdiction(c.env.DB, familyId) !== "OTHER") return null;
  return c.env.DB.prepare("SELECT id, name FROM students WHERE id = ? AND family_id = ?")
    .bind(c.req.param("sid"), familyId).first() as Promise<{ id: string; name: string } | null>;
}

async function goalFor(c: any) {
  return c.env.DB.prepare("SELECT * FROM international_learning_goals WHERE id = ? AND family_id = ? AND student_id = ?")
    .bind(c.req.param("gid"), c.get("user").family_id, c.req.param("sid")).first() as Promise<any>;
}

/** Lightweight goal counts for the same progress cards Australian families use. */
export async function internationalGoalSummary(db: D1Database, familyId: string) {
  await ensureTables(db);
  const { results: kids } = await db.prepare("SELECT id, name, stage, year_level FROM students WHERE family_id = ? ORDER BY created_at").bind(familyId).all<any>();
  const { results: goalCounts } = await db.prepare("SELECT student_id, status, COUNT(*) AS n FROM international_learning_goals WHERE family_id = ? GROUP BY student_id, status").bind(familyId).all<any>();
  const students = (kids || []).map((child) => {
    const counts: Record<string, number> = { not_started: 0, introduced: 0, developing: 0, demonstrated: 0, achieved: 0 };
    for (const row of goalCounts || []) if (row.student_id === child.id && row.status in counts) counts[row.status] = Number(row.n || 0);
    return { id: child.id, name: child.name, year_level: child.year_level || null,
      total: Object.values(counts).reduce((sum, n) => sum + n, 0), counts,
      awaiting_confirmation: counts.demonstrated, needs_attention: 0, needs_consolidation: 0 };
  });
  return { available: true, mode: "parent_defined", framework: { key: "OTHER", name: "Family-defined goals" }, students };
}

export function registerInternationalGoals(app: App, g: Guards) {
  app.get("/api/international/goals/:sid", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "No international learning goals for this child." }, 404);
    await ensureTables(c.env.DB);
    const familyId = c.get("user").family_id;
    const { results: goals } = await c.env.DB.prepare("SELECT * FROM international_learning_goals WHERE family_id = ? AND student_id = ? ORDER BY created_at DESC")
      .bind(familyId, child.id).all<any>();
    const { results: evidence } = await c.env.DB.prepare(
      "SELECT e.*, n.title AS linked_title, n.notes AS linked_notes, n.occurred_on AS linked_on FROM international_goal_evidence e LEFT JOIN evidence_notes n ON e.evidence_note_id = n.id AND n.family_id = e.family_id AND n.student_id = e.student_id WHERE e.family_id = ? AND e.student_id = ? ORDER BY e.created_at DESC"
    ).bind(familyId, child.id).all<any>();
    return c.json({
      student: child, mode: "parent_defined",
      note: "These are goals written and confirmed by your family, not certified curriculum outcomes. Check your local education requirements.",
      goals: (goals || []).map((goal) => ({
        ...goal, evidence: (evidence || []).filter((row) => row.goal_id === goal.id).map((row) => ({
          ...row, title: row.evidence_note_id ? (row.linked_title || "Linked note no longer available") : row.title,
          note: row.evidence_note_id ? (row.linked_notes || "") : row.note,
          occurred_on: row.evidence_note_id ? (row.linked_on || row.occurred_on) : row.occurred_on,
          missing_source: !!row.evidence_note_id && !row.linked_title,
        })),
      })),
    });
  });

  app.post("/api/international/goals/:sid", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "Child not found in an international family." }, 404);
    const b: any = await c.req.json().catch(() => ({}));
    const title = clean(b.title, 160), area = clean(b.learning_area, 80) || "General learning";
    if (title.length < 3) return c.json({ detail: "Add a learning goal of at least three characters." }, 400);
    await ensureTables(c.env.DB);
    const id = crypto.randomUUID(), ts = new Date().toISOString();
    await c.env.DB.prepare("INSERT INTO international_learning_goals (id, family_id, student_id, learning_area, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'not_started', ?, ?)")
      .bind(id, c.get("user").family_id, child.id, area, title, clean(b.description, 2500), ts, ts).run();
    return c.json({ ok: true, id }, 201);
  });

  app.put("/api/international/goals/:sid/:gid", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "Child not found." }, 404);
    await ensureTables(c.env.DB);
    const goal = await goalFor(c);
    if (!goal) return c.json({ detail: "Learning goal not found." }, 404);
    const b: any = await c.req.json().catch(() => ({}));
    const title = "title" in b ? clean(b.title, 160) : goal.title;
    if (title.length < 3) return c.json({ detail: "A learning goal needs a title of at least three characters." }, 400);
    const status = "status" in b ? clean(b.status, 30) : goal.status;
    if (!STATUSES.has(status)) return c.json({ detail: "Choose a valid progress status." }, 400);
    const note = "confirmation_note" in b ? clean(b.confirmation_note, 2000) : goal.confirmation_note;
    if (status === "achieved" && goal.status !== "achieved") {
      const count = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM international_goal_evidence WHERE family_id = ? AND student_id = ? AND goal_id = ?")
        .bind(c.get("user").family_id, child.id, goal.id).first<{ n: number }>();
      if (!Number(count?.n) || note.length < 5)
        return c.json({ detail: "To confirm Achieved, first link evidence and add a short note explaining your judgement." }, 409);
    }
    await c.env.DB.prepare("UPDATE international_learning_goals SET title = ?, learning_area = ?, description = ?, status = ?, confirmation_note = ?, updated_at = ? WHERE id = ? AND family_id = ? AND student_id = ?")
      .bind(title, "learning_area" in b ? (clean(b.learning_area, 80) || "General learning") : goal.learning_area,
        "description" in b ? clean(b.description, 2500) : goal.description, status,
        status === "achieved" ? note : "", new Date().toISOString(), goal.id, c.get("user").family_id, child.id).run();
    return c.json({ ok: true });
  });

  app.delete("/api/international/goals/:sid/:gid", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "Child not found." }, 404);
    await ensureTables(c.env.DB);
    const goal = await goalFor(c);
    if (!goal) return c.json({ detail: "Learning goal not found." }, 404);
    await c.env.DB.prepare("DELETE FROM international_goal_evidence WHERE goal_id = ? AND family_id = ? AND student_id = ?").bind(goal.id, c.get("user").family_id, child.id).run();
    await c.env.DB.prepare("DELETE FROM international_learning_goals WHERE id = ? AND family_id = ? AND student_id = ?").bind(goal.id, c.get("user").family_id, child.id).run();
    return c.json({ ok: true });
  });

  app.post("/api/international/goals/:sid/:gid/evidence", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "Child not found." }, 404);
    await ensureTables(c.env.DB);
    const goal = await goalFor(c);
    if (!goal) return c.json({ detail: "Learning goal not found." }, 404);
    const b: any = await c.req.json().catch(() => ({}));
    const sourceId = clean(b.evidence_note_id, 100);
    let title = clean(b.title, 160), note = clean(b.note, 3000);
    if (sourceId) {
      const linked = await c.env.DB.prepare("SELECT id FROM evidence_notes WHERE id = ? AND family_id = ? AND student_id = ?")
        .bind(sourceId, c.get("user").family_id, child.id).first();
      if (!linked) return c.json({ detail: "That Evidence Backpack note does not belong to this child." }, 404);
      const dup = await c.env.DB.prepare("SELECT id FROM international_goal_evidence WHERE family_id = ? AND student_id = ? AND goal_id = ? AND evidence_note_id = ?")
        .bind(c.get("user").family_id, child.id, goal.id, sourceId).first();
      if (dup) return c.json({ detail: "That note is already linked to this goal." }, 409);
    } else if (title.length < 3 || note.length < 3) {
      return c.json({ detail: "Add a title and a note describing what your child did." }, 400);
    }
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.occurred_on || "")) ? String(b.occurred_on) : today();
    await c.env.DB.prepare("INSERT INTO international_goal_evidence (id, family_id, student_id, goal_id, title, note, occurred_on, evidence_note_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), c.get("user").family_id, child.id, goal.id,
        sourceId ? "Linked Evidence Backpack note" : title, sourceId ? "" : note, date, sourceId || null, new Date().toISOString()).run();
    return c.json({ ok: true }, 201);
  });

  app.delete("/api/international/goals/:sid/:gid/evidence/:eid", g.auth, g.parent, async (c) => {
    const child = await childFor(c);
    if (!child) return c.json({ detail: "Child not found." }, 404);
    await ensureTables(c.env.DB);
    const row = await c.env.DB.prepare("SELECT id FROM international_goal_evidence WHERE id = ? AND goal_id = ? AND student_id = ? AND family_id = ?")
      .bind(c.req.param("eid"), c.req.param("gid"), child.id, c.get("user").family_id).first();
    if (!row) return c.json({ detail: "Evidence link not found." }, 404);
    await c.env.DB.prepare("DELETE FROM international_goal_evidence WHERE id = ? AND goal_id = ? AND student_id = ? AND family_id = ?")
      .bind(c.req.param("eid"), c.req.param("gid"), child.id, c.get("user").family_id).run();
    // Never deletes the source Evidence Backpack note.
    return c.json({ ok: true });
  });
}
