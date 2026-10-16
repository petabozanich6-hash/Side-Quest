/**
 * Home Schooling Compass - parent-only self-reported checklist.
 * Every operation is scoped by BOTH family and student. Jurisdiction comes from the server,
 * never the request body, so switching states cannot quietly reuse another jurisdiction's record.
 * Government registration is not performed by Side-Quest.
 */
import { getFamilyJurisdiction } from "./data/jurisdictions";
import type { App, Guards } from "./types";
import { nowIso, parseJson } from "./types";

const STEP_IDS = new Set(["understand", "prepare", "program", "apply", "assessment", "maintain"]);
const STATUSES = new Set(["not_started", "preparing", "submitted", "provisional", "approved", "renewal_due"]);
const CREATE_SQL = "CREATE TABLE IF NOT EXISTS homeschool_compass_progress (family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE, student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE, jurisdiction TEXT NOT NULL, completed_steps TEXT NOT NULL DEFAULT '[]', registration_status TEXT NOT NULL DEFAULT 'not_started', submitted_on TEXT, approved_on TEXT, expires_on TEXT, notes TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL, PRIMARY KEY (family_id, student_id, jurisdiction))";
const INDEX_SQL = "CREATE INDEX IF NOT EXISTS idx_homeschool_compass_family ON homeschool_compass_progress (family_id, jurisdiction)";

async function ensureSchema(db: D1Database) {
  // Safe even if the migration was not deployed first. Keep identical to migration 0061.
  await db.prepare(CREATE_SQL).run();
  await db.prepare(INDEX_SQL).run();
}
const dateValue = (v: unknown): string | null | undefined => {
  if (v == null || v === "") return null;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const dt = new Date(v + "T00:00:00Z");
  return Number.isNaN(dt.valueOf()) || dt.toISOString().slice(0, 10) !== v ? undefined : v;
};
const out = (row: Record<string, unknown>) => ({
  student_id: row.student_id,
  jurisdiction: row.jurisdiction,
  completed_steps: parseJson<string[]>(String(row.completed_steps || "[]"), []).filter(x => STEP_IDS.has(x)),
  registration_status: row.registration_status,
  submitted_on: row.submitted_on,
  approved_on: row.approved_on,
  expires_on: row.expires_on,
  notes: row.notes || "",
  updated_at: row.updated_at,
});

export function registerHomeschoolCompass(app: App, guards: Guards) {
  app.get("/api/compass", guards.auth, guards.parent, async (c) => {
    const familyId = c.get("user").family_id;
    const jurisdiction = await getFamilyJurisdiction(c.env.DB, familyId);
    if (!jurisdiction) return c.json({ detail: "Choose your family's state or territory first", code: "JURISDICTION_REQUIRED" }, 409);
    await ensureSchema(c.env.DB);
    const { results } = await c.env.DB.prepare(
      "SELECT p.* FROM homeschool_compass_progress p INNER JOIN students s ON s.id = p.student_id AND s.family_id = p.family_id WHERE p.family_id = ? AND p.jurisdiction = ? ORDER BY p.student_id"
    ).bind(familyId, jurisdiction).all();
    return c.json({ jurisdiction, progress: (results || []).map(row => out(row)) });
  });

  app.put("/api/compass/:studentId", guards.auth, guards.parent, async (c) => {
    const familyId = c.get("user").family_id;
    const studentId = c.req.param("studentId");
    const belongs = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first();
    if (!belongs) return c.json({ detail: "Child not found in this family" }, 404);
    const jurisdiction = await getFamilyJurisdiction(c.env.DB, familyId);
    if (!jurisdiction) return c.json({ detail: "Choose your family's state or territory first", code: "JURISDICTION_REQUIRED" }, 409);
    const payload: unknown = await c.req.json().catch(() => null);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return c.json({ detail: "A checklist object is required" }, 400);
    const body = payload as Record<string, unknown>;
    if (!Array.isArray(body.completed_steps) || body.completed_steps.length > STEP_IDS.size || body.completed_steps.some(x => typeof x !== "string" || !STEP_IDS.has(x)))
      return c.json({ detail: "Invalid checklist steps" }, 400);
    if (typeof body.registration_status !== "string" || !STATUSES.has(body.registration_status))
      return c.json({ detail: "Invalid registration status" }, 400);
    const submitted = dateValue(body.submitted_on);
    const approved = dateValue(body.approved_on);
    const expires = dateValue(body.expires_on);
    if ([submitted, approved, expires].some(x => x === undefined)) return c.json({ detail: "Dates must use YYYY-MM-DD" }, 400);
    const notes = String(body.notes || "").trim();
    if (notes.length > 1000) return c.json({ detail: "Notes must be 1000 characters or fewer" }, 400);
    const completed = Array.from(new Set(body.completed_steps));
    await ensureSchema(c.env.DB);
    const when = nowIso();
    await c.env.DB.prepare(
      "INSERT INTO homeschool_compass_progress (family_id, student_id, jurisdiction, completed_steps, registration_status, submitted_on, approved_on, expires_on, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (family_id, student_id, jurisdiction) DO UPDATE SET completed_steps=excluded.completed_steps, registration_status=excluded.registration_status, submitted_on=excluded.submitted_on, approved_on=excluded.approved_on, expires_on=excluded.expires_on, notes=excluded.notes, updated_at=excluded.updated_at"
    ).bind(familyId, studentId, jurisdiction, JSON.stringify(completed), body.registration_status, submitted, approved, expires, notes, when).run();
    return c.json({ student_id: studentId, jurisdiction, completed_steps: completed, registration_status: body.registration_status, submitted_on: submitted, approved_on: approved, expires_on: expires, notes, updated_at: when });
  });
}
