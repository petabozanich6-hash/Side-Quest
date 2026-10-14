// Curriculum outcome progress per child: the shared progression model used by the Outcome & Mastery Tracker and Auto-Quest.
//
//   not_started -> introduced -> developing -> demonstrated -> achieved
//
// Rules (see docs/SIDEQUEST-EXECUTION.md, "Outcome progress"):
//  - A parent can set any level for their child, up or down. That level is "parent confirmed".
//  - Automatic updates come only from a parent reviewing their child's work. They only ever RAISE a level, never lower it,
//    and never go past "demonstrated": finishing or passing a lesson is evidence, not proof of mastery. Only a parent
//    confirms "achieved".
//  - A parent-confirmed level is never changed by an automatic update unless the update raises it.
//  - Only outcomes on a verified list the app holds are stored (today the NSW syllabus). For other states and territories
//    the tracker says the list is not loaded yet instead of inventing codes.
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { NSW_OUTCOMES } from "./data/curriculum";
import { getFamilyJurisdiction, usesNswOutcomes, outcomesNotLoadedNote } from "./data/jurisdictions";
import { stageFor } from "./aiRequest";

type DB = D1Database;

export const LEVELS = ["not_started", "introduced", "developing", "demonstrated", "achieved"] as const;
export type Level = (typeof LEVELS)[number];
export const LEVEL_LABELS: Record<Level, string> = { not_started: "Not Started", introduced: "Introduced", developing: "Developing", demonstrated: "Demonstrated", achieved: "Achieved" };
export const rank = (l: string) => Math.max(0, LEVELS.indexOf(l as Level));
const isLevel = (l: unknown): l is Level => typeof l === "string" && (LEVELS as readonly string[]).includes(l);
/** The highest level any automatic update may set. */
export const AUTO_CEILING: Level = "demonstrated";

const byCode = new Map(NSW_OUTCOMES.map((o: any) => [o.code, o]));
export const knownOutcome = (code: string) => byCode.get(code) as { code: string; description: string; learning_area: string; stage: string } | undefined;
const parse = (v: unknown, d: any) => { try { return typeof v === "string" ? JSON.parse(v) : v ?? d; } catch { return d; } };
const newId = () => crypto.randomUUID();

export type Change = {
  familyId: string; studentId: string; code: string; level: Level; source: "parent" | "review" | "lesson";
  by?: string | null; ref?: { type: string; id: string } | null; note?: string | null;
};

/** Applies one change under the rules above. Returns whether anything changed. */
export async function applyChange(db: DB, c: Change, now: Date = new Date()): Promise<{ changed: boolean; level: Level }> {
  const cur = await db.prepare("SELECT * FROM outcome_progress WHERE student_id = ? AND code = ? AND family_id = ?").bind(c.studentId, c.code, c.familyId).first<any>();
  const from: Level = cur && isLevel(cur.level) ? cur.level : "not_started";
  const manual = c.source === "parent";
  let to: Level = c.level;
  if (!manual) {
    if (rank(to) > rank(AUTO_CEILING)) to = AUTO_CEILING;
    if (rank(to) <= rank(from)) return { changed: false, level: from }; // never lower, never repeat
  }
  const confirmed = manual ? 1 : cur?.parent_confirmed ? 1 : 0;
  if (cur && from === to && Number(cur.parent_confirmed) === confirmed && (c.note ?? null) === (cur.note ?? null)) return { changed: false, level: from };
  const ts = now.toISOString();
  await db.batch([
    db.prepare(
      `INSERT INTO outcome_progress (student_id, code, family_id, level, parent_confirmed, source, note, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (student_id, code) DO UPDATE SET level = excluded.level, parent_confirmed = excluded.parent_confirmed, source = excluded.source,
         note = COALESCE(excluded.note, outcome_progress.note), updated_by = excluded.updated_by, updated_at = excluded.updated_at`
    ).bind(c.studentId, c.code, c.familyId, to, confirmed, c.source, c.note ?? null, c.by ?? null, ts),
    db.prepare("INSERT INTO outcome_progress_events (id, family_id, student_id, code, from_level, to_level, source, parent_confirmed, ref_type, ref_id, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newId(), c.familyId, c.studentId, c.code, cur ? from : null, to, c.source, confirmed, c.ref?.type ?? null, c.ref?.id ?? null, c.note ?? null, c.by ?? null, ts),
  ]);
  return { changed: true, level: to };
}

/**
 * What a parent's review of a piece of work says about each outcome the lesson targets:
 *  - outcome ticked as achieved on work the parent approved -> demonstrated (the parent confirms "achieved" separately)
 *  - outcome marked "not yet", or the work sent back for more practice -> developing
 *  - outcome the lesson targets but the parent did not mark -> introduced
 */
export function levelsFromReview(lessonCodes: string[], mappings: any[], reviewStatus: string): Map<string, Level> {
  const approved = reviewStatus === "accepted" || reviewStatus === "demonstrated";
  const out = new Map<string, Level>();
  for (const code of lessonCodes) out.set(code, "introduced");
  for (const m of Array.isArray(mappings) ? mappings : []) {
    const code = String(m?.code || "").trim();
    if (!code) continue;
    const yes = m?.accepted === true || m?.status === "achieved";
    out.set(code, yes && approved ? "demonstrated" : "developing");
  }
  if (!approved) for (const [code, l] of out) if (l === "introduced") out.set(code, "developing");
  return out;
}

/** Records the outcome evidence from one reviewed submission. Safe to call more than once for the same submission. */
export async function recordReview(db: DB, familyId: string, parentId: string | null, submissionId: string, now: Date = new Date()) {
  const sub = await db.prepare("SELECT * FROM submissions WHERE id = ? AND family_id = ?").bind(submissionId, familyId).first<any>();
  if (!sub || !sub.status) return { changed: 0 };
  const a = sub.assignment_id ? await db.prepare("SELECT lesson_snapshot FROM assignments WHERE id = ? AND family_id = ?").bind(sub.assignment_id, familyId).first<any>() : null;
  const live = await db.prepare("SELECT * FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)").bind(sub.lesson_id, familyId).first<any>();
  const lesson = parse(a?.lesson_snapshot, null) || lb.lessonOut(live) || {};
  const codes = (Array.isArray(lesson.outcome_codes) ? lesson.outcome_codes : []).map(String);
  const levels = levelsFromReview(codes, parse(sub.outcome_mappings, []), String(sub.status));
  let changed = 0;
  for (const [code, level] of levels) {
    if (!knownOutcome(code)) continue; // never store codes that are not on a verified list
    const r = await applyChange(db, { familyId, studentId: sub.student_id, code, level, source: "review", by: parentId, ref: { type: "submission", id: sub.id } }, now);
    if (r.changed) changed++;
  }
  return { changed };
}

/** Reviews made before progress tracking existed are replayed once, so a child's history is not lost. */
async function backfill(db: DB, familyId: string, studentId: string, now: Date) {
  const has = await db.prepare("SELECT 1 FROM outcome_progress_events WHERE student_id = ? AND family_id = ? LIMIT 1").bind(studentId, familyId).first();
  if (has) return;
  const subs = (await db.prepare("SELECT id FROM submissions WHERE family_id = ? AND student_id = ? AND reviewed_at IS NOT NULL ORDER BY reviewed_at").bind(familyId, studentId).all<any>()).results || [];
  for (const s of subs) await recordReview(db, familyId, null, s.id, now);
}

export async function studentFor(db: DB, familyId: string, studentId: string) {
  return db.prepare("SELECT id, name, stage, year_level FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first<any>();
}

/** Every outcome for the child's stage (plus any others they have progress on), with its current level. */
export async function getProgress(db: DB, familyId: string, studentId: string, now: Date = new Date()): Promise<Result<{ progress: any }>> {
  const student = await studentFor(db, familyId, studentId);
  if (!student) return lb.fail(404, "Child not found");
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  const stage = String(student.stage || stageFor(String(student.year_level || "")) || "");
  if (!usesNswOutcomes(jurisdiction)) {
    return { ok: true, progress: { student: { id: student.id, name: student.name, stage }, available: false, jurisdiction, note: jurisdiction ? outcomesNotLoadedNote(jurisdiction) : "Choose your family's state or territory on the Curriculum page first.", outcomes: [], counts: emptyCounts() } };
  }
  await backfill(db, familyId, studentId, now);
  const rows = (await db.prepare("SELECT * FROM outcome_progress WHERE student_id = ? AND family_id = ?").bind(studentId, familyId).all<any>()).results || [];
  const stored = new Map(rows.map((r: any) => [r.code, r]));
  const list = NSW_OUTCOMES.filter((o: any) => o.stage === stage || stored.has(o.code));
  const outcomes = list.map((o: any, i: number) => {
    const r: any = stored.get(o.code);
    return {
      code: o.code, description: o.description, learning_area: o.learning_area, stage: o.stage, order: i,
      level: r && isLevel(r.level) ? r.level : "not_started", parent_confirmed: !!r?.parent_confirmed, source: r?.source || null, note: r?.note || null, updated_at: r?.updated_at || null,
    };
  });
  const counts = emptyCounts();
  for (const o of outcomes) counts[o.level as Level]++;
  return { ok: true, progress: { student: { id: student.id, name: student.name, stage }, available: true, jurisdiction, framework: "NSW syllabus outcomes", outcomes, counts } };
}
const emptyCounts = () => Object.fromEntries(LEVELS.map((l) => [l, 0])) as Record<Level, number>;

/** A parent setting a level themselves. */
export async function setLevel(db: DB, familyId: string, parentId: string, studentId: string, code: string, body: any, now: Date = new Date()): Promise<Result<{ outcome: any }>> {
  const student = await studentFor(db, familyId, studentId);
  if (!student) return lb.fail(404, "Child not found");
  if (!usesNswOutcomes(await getFamilyJurisdiction(db, familyId).catch(() => null))) return lb.fail(409, "Outcome tracking needs a verified outcome list for your state or territory, which is not loaded yet.", "NOT_AVAILABLE");
  const known = knownOutcome(code);
  if (!known) return lb.fail(404, "That outcome is not on the list Side-Quest holds.");
  if (!isLevel(body?.level)) return lb.fail(400, `Choose one of: ${LEVELS.map((l) => LEVEL_LABELS[l]).join(", ")}.`);
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 500) || null : null;
  await applyChange(db, { familyId, studentId, code, level: body.level, source: "parent", by: parentId, note }, now);
  const r = await db.prepare("SELECT * FROM outcome_progress WHERE student_id = ? AND code = ?").bind(studentId, code).first<any>();
  return { ok: true, outcome: { code, description: known.description, learning_area: known.learning_area, stage: known.stage, level: r.level, parent_confirmed: !!r.parent_confirmed, note: r.note, updated_at: r.updated_at } };
}

export async function history(db: DB, familyId: string, studentId: string, code: string) {
  return (await db.prepare("SELECT from_level, to_level, source, parent_confirmed, ref_type, ref_id, note, created_at FROM outcome_progress_events WHERE family_id = ? AND student_id = ? AND code = ? ORDER BY created_at DESC LIMIT 50").bind(familyId, studentId, code).all<any>()).results || [];
}
