/**
 * Auto-Quest: Timetable -> curriculum outcomes -> lesson library -> AI drafting -> parent review -> assignment.
 *
 * Ground rules
 * - Planning never spends AI allowance, creates lessons or assigns anything. It writes PROPOSALS only.
 * - A lesson is drafted with AI only when the parent asks for that proposal, through the normal AI drafting path
 *   (paid plans only, same daily and monthly limits, same quality checks).
 * - Nothing is assigned until the parent approves it. An AI draft the parent hasn't reviewed is never assigned:
 *   approving one requires the parent to confirm they reviewed it (which marks it ready, like saving it in the builder).
 * - Outcome codes come only from the family's own verified catalogue (server-side). No catalogue: no codes, and
 *   Auto-Quest says so instead of inventing coverage.
 * - Completing a lesson never means an outcome is mastered: the plan reads the Outcome Tracker, which follows reviews.
 * - Existing assignments and timetable links are never overwritten. Generated drafts are never lost by re-planning.
 * - Revision is deliberate: an outcome that was Demonstrated but not seen for a while can be revisited (at most one
 *   revision slot in every four per learning area), and is labelled as revision. Achieved outcomes are not re-taught.
 */
import * as lb from "./lessonBuilder";
import * as aid from "./aiDraft";
import { catalogueFor, trackerFor, programFor, DEFAULT_RULES, type Catalogue } from "./outcomeTracker";
import { getFamilyJurisdiction } from "./data/jurisdictions";
import { normArea } from "./outcomeMatch";
import type { App, Guards } from "./types";

type DB = any;

// ---------------------------------------------------------------- pure planner

export type QuestSlot = { id: string; student_id: string; date: string; title: string; event_type?: string; linked_assignment_id?: string | null; duration_minutes?: number | null };
export type QuestLesson = { id: string; title: string; learning_area?: string; outcome_codes?: string[]; status?: string; archived_at?: string | null };
export type QuestAssignment = { id: string; student_id: string; lesson_id: string; scheduled_date?: string | null; status?: string };
export type QuestProgress = { code: string; status: string; last_evidence_on?: string | null; gaps?: string[] };
export type QuestOutcome = { code: string; learning_area: string };
export type Purpose = "teach" | "consolidate" | "revise";
export type QuestDecision = {
  slotId: string;
  date?: string;
  learningArea?: string;
  action: "already_assigned" | "reuse_draft" | "needs_parent_plan" | "needs_generation";
  purpose?: Purpose;
  lessonId?: string;
  reason: string;
  eligibleOutcomeCodes: string[];
};
export type QuestInputs = {
  studentId: string;
  slots: QuestSlot[];
  lessons: QuestLesson[];
  assignments: QuestAssignment[];
  progress: QuestProgress[];
  catalogueAvailable: boolean;
  allowedOutcomeCodes: string[];
  /** Catalogue outcomes for the child's level, with their learning areas. Without it, slots can't be matched to outcomes by area. */
  outcomes?: QuestOutcome[];
  /** Maps a timetable title ("Maths", "Science and Technology"...) to a catalogue learning area. Defaults to exact match. */
  areaOf?: (title: string) => string;
  today?: string;
  revisitAfterDays?: number;
};

const DONE = new Set(["completed", "accepted", "demonstrated"]);
const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();
const daysBetween = (a: string, b: string) => Math.floor((Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / 86400000);

export function planAutoQuest(input: QuestInputs): QuestDecision[] {
  const areaOf = input.areaOf || ((t: string) => t);
  const approved = new Set(input.allowedOutcomeCodes);
  const prog = new Map(input.progress.map((p) => [p.code, p]));
  const achieved = new Set(input.progress.filter((p) => p.status === "achieved").map((p) => p.code));
  const mine = input.assignments.filter((a) => a.student_id === input.studentId);
  // Lessons this child has open now (never assigned twice) and lessons already finished (only reused for revision).
  const open = new Set(mine.filter((a) => !DONE.has(a.status || "")).map((a) => a.lesson_id));
  const finished = new Set(mine.filter((a) => DONE.has(a.status || "")).map((a) => a.lesson_id));
  const lessonById = new Map(input.lessons.map((l) => [l.id, l]));
  // Outcomes already being taught by an open assignment are not planned again.
  const inFlight = new Set<string>();
  for (const id of open) for (const c of lessonById.get(id)?.outcome_codes || []) inFlight.add(c);
  const usedLessons = new Set<string>();
  const plannedCodes = new Set<string>();
  const plannedTimes = new Map<string, number>();
  const plan = (c: string) => { plannedCodes.add(c); plannedTimes.set(c, (plannedTimes.get(c) || 0) + 1); };
  const slotsPerArea = new Map<string, number>();
  const today = input.today || new Date().toISOString().slice(0, 10);
  const revisitAfter = input.revisitAfterDays ?? DEFAULT_RULES.revisit_after_days;

  const lessonArea = (l: QuestLesson) => areaOf(String(l.learning_area || l.title || ""));

  return input.slots
    .filter((slot) => slot.student_id === input.studentId && (!slot.event_type || slot.event_type === "lesson" || slot.event_type === "timetable"))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((slot): QuestDecision => {
      const area = areaOf(slot.title);
      const base = { slotId: slot.id, date: slot.date, learningArea: area };
      const assigned = mine.find((a) => a.id === slot.linked_assignment_id || (a.scheduled_date === slot.date && !!lessonById.get(a.lesson_id) && normalize(lessonArea(lessonById.get(a.lesson_id)!)) === normalize(area)));
      if (assigned) return { ...base, action: "already_assigned", lessonId: assigned.lesson_id, reason: "Already assigned for this day; left as it is.", eligibleOutcomeCodes: [] };
      if (!input.catalogueAvailable) return { ...base, action: "needs_parent_plan", reason: "Side-Quest has no verified outcome list for your curriculum, so it won't guess outcome codes. Choose a lesson yourself.", eligibleOutcomeCodes: [] };

      const n = (slotsPerArea.get(normalize(area)) || 0) + 1;
      slotsPerArea.set(normalize(area), n);

      // Outcomes for this learning area at the child's level (or every allowed code when areas aren't known).
      const pool = (input.outcomes ? input.outcomes.filter((o) => normalize(o.learning_area) === normalize(area)).map((o) => o.code) : [...approved])
        .filter((c) => approved.has(c) && !achieved.has(c));
      const free = (c: string) => !plannedCodes.has(c) && !inFlight.has(c);
      const status = (c: string) => prog.get(c)?.status || "not_started";
      const consolidate = pool.filter((c) => free(c) && ["introduced", "developing"].includes(status(c)))
        .sort((a, b) => Number((prog.get(b)?.gaps || []).includes("needs_consolidation")) - Number((prog.get(a)?.gaps || []).includes("needs_consolidation")));
      const fresh = pool.filter((c) => free(c) && status(c) === "not_started");
      const stale = pool.filter((c) => free(c) && status(c) === "demonstrated" && (!prog.get(c)?.last_evidence_on || daysBetween(prog.get(c)!.last_evidence_on!, today) >= revisitAfter));

      let purpose: Purpose | null = null;
      let codes: string[] = [];
      // Purposeful revision: at most one slot in four per area, and only for outcomes not seen for a while.
      if (n % 4 === 0 && stale.length) { purpose = "revise"; codes = stale.slice(0, 1); }
      else if (consolidate.length) { purpose = "consolidate"; codes = consolidate.slice(0, 2); }
      else if (fresh.length) { purpose = "teach"; codes = fresh.slice(0, 2); }
      else if (stale.length) { purpose = "revise"; codes = stale.slice(0, 1); }
      else {
        // Nothing new: a developing outcome may get a second practice session in this plan, never a third.
        const again = pool.filter((c) => !inFlight.has(c) && ["introduced", "developing"].includes(status(c)) && (plannedTimes.get(c) || 0) < 2);
        if (again.length) { purpose = "consolidate"; codes = again.slice(0, 1); }
      }
      if (!purpose && input.outcomes && !input.outcomes.some((o) => normalize(o.learning_area) === normalize(area))) {
        return { ...base, action: "needs_parent_plan", reason: `${area} isn't one of the subjects on this child's profile at their level, so Auto-Quest won't pick outcomes for it. Add the subject on the Children page, or plan this session yourself.`, eligibleOutcomeCodes: [] };
      }
      if (!purpose) {
        return { ...base, action: "needs_parent_plan", reason: pool.length ? "Every outcome for this area is already planned or being taught. Choose an extension, a project or a free day." : "No outstanding verified outcomes for this area at this level. Offer an extension, project or revision of your choice.", eligibleOutcomeCodes: [] };
      }

      // Reuse a saved lesson that teaches the target outcome: never one the child has open, never the same lesson twice
      // in this plan, and a finished lesson only for revision.
      const target = codes[0];
      const reusable = input.lessons
        .filter((l) => l.status !== "archived" && !l.archived_at && (l.outcome_codes || []).includes(target) && !open.has(l.id) && !usedLessons.has(l.id))
        .filter((l) => purpose === "revise" || !finished.has(l.id))
        .sort((a, b) => Number(b.status === "ready") - Number(a.status === "ready"));
      const why = purpose === "revise" ? `Revision: ${target} was demonstrated but hasn't been revisited for ${revisitAfter}+ days.`
        : purpose === "consolidate" ? `Consolidation: ${codes.join(", ")} ${codes.length > 1 ? "are" : "is"} still developing.`
          : `New learning: ${codes.join(", ")} not started yet.`;
      if (reusable.length) {
        const l = reusable[0];
        usedLessons.add(l.id);
        const lc = (l.outcome_codes || []).filter((c) => approved.has(c) && !achieved.has(c));
        for (const c of lc) plan(c);
        return { ...base, action: "reuse_draft", purpose, lessonId: l.id, reason: `${why} Reuses your saved lesson "${l.title}"${l.status === "ready" ? "" : " (still a draft: review it before approving)"}.`, eligibleOutcomeCodes: lc };
      }
      for (const c of codes) plan(c);
      return { ...base, action: "needs_generation", purpose, reason: `${why} No saved lesson covers it yet: draft one with AI or build it yourself.`, eligibleOutcomeCodes: codes };
    });
}

// ---------------------------------------------------------------- area matching

const TO_AC9: Record<string, string> = {
  English: "English", Mathematics: "Mathematics", "Science and Technology": "Science", Science: "Science",
  HSIE: "Humanities and Social Sciences", PDHPE: "Health and Physical Education", "Creative Arts": "The Arts", TAS: "Technologies",
};
export function areaMatcher(cat: Catalogue, stage: string) {
  const areas = new Set(cat.outcomes.map((o) => o.learning_area));
  return (title: string) => {
    const t = String(title || "").replace(/\s*·.*$/, "").trim();
    for (const a of areas) if (a.toLowerCase() === t.toLowerCase()) return a;
    if (/^technolog/i.test(t) && areas.has("Technologies")) return "Technologies";
    const nsw = normArea(t, stage);
    if (!nsw) return t;
    if (cat.framework === "NSW") return nsw;
    return TO_AC9[nsw] && areas.has(TO_AC9[nsw]) ? TO_AC9[nsw] : t;
  };
}

// ---------------------------------------------------------------- storage

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS auto_quest_proposals (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, calendar_event_id TEXT NOT NULL, date TEXT NOT NULL, learning_area TEXT, action TEXT NOT NULL, purpose TEXT, outcome_codes TEXT NOT NULL DEFAULT '[]', framework TEXT, lesson_id TEXT, generated INTEGER NOT NULL DEFAULT 0, reason TEXT, status TEXT NOT NULL DEFAULT 'proposed', assignment_id TEXT, decided_by TEXT, decided_at TEXT, decision_note TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (family_id, calendar_event_id))`,
  `CREATE INDEX IF NOT EXISTS idx_auto_quest_student ON auto_quest_proposals (family_id, student_id, date)`,
];
export const AUTO_QUEST_SCHEMA = SCHEMA;
const ready = new WeakSet<object>();
/** Deploys don't run migrations, so the table is created here too if migration 0059 hasn't been applied yet. */
export async function ensureAutoQuest(db: DB) {
  if (ready.has(db)) return;
  for (const sql of SCHEMA) await db.prepare(sql).run();
  ready.add(db);
}

const newId = () => crypto.randomUUID();
const json = <T,>(s: unknown, d: T): T => { try { return typeof s === "string" ? JSON.parse(s) : (s as T) ?? d; } catch { return d; } };
const DAY = /^\d{4}-\d{2}-\d{2}$/;
type R<T = {}> = ({ ok: true } & T) | { ok: false; status: number; detail: string; code?: string };
const bad = (status: number, detail: string, code?: string) => ({ ok: false as const, status, detail, code });

function proposalOut(r: any, lessons: Map<string, any>) {
  const l = r.lesson_id ? lessons.get(r.lesson_id) : null;
  return {
    id: r.id, student_id: r.student_id, calendar_event_id: r.calendar_event_id, date: r.date, learning_area: r.learning_area,
    action: r.action, purpose: r.purpose, outcome_codes: json<string[]>(r.outcome_codes, []), reason: r.reason, status: r.status,
    lesson: l ? { id: l.id, title: l.title, status: l.status, ai_draft_needs_review: l.review_status === "ai_draft_needs_review", outcome_codes: l.outcome_codes || [] } : null,
    generated: !!r.generated, assignment_id: r.assignment_id, decided_at: r.decided_at, decision_note: r.decision_note,
  };
}

async function lessonMap(db: DB, familyId: string, ids: string[]) {
  const out = new Map<string, any>();
  for (const id of [...new Set(ids.filter(Boolean))]) {
    const row = await db.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(id, familyId).first();
    if (row) out.set(id, lb.lessonOut(row));
  }
  return out;
}

export async function listProposals(db: DB, familyId: string, studentId: string, from: string, to: string) {
  await ensureAutoQuest(db);
  const { results } = await db.prepare("SELECT * FROM auto_quest_proposals WHERE family_id = ? AND student_id = ? AND date >= ? AND date <= ? ORDER BY date, learning_area").bind(familyId, studentId, from, to).all();
  const rows = results || [];
  const lessons = await lessonMap(db, familyId, rows.map((r: any) => r.lesson_id));
  return rows.map((r: any) => proposalOut(r, lessons));
}

async function checkRange(db: DB, familyId: string, q: { student_id?: unknown; from?: unknown; to?: unknown }) {
  const sid = String(q.student_id || ""), from = String(q.from || ""), to = String(q.to || "");
  if (!sid || !DAY.test(from) || !DAY.test(to) || from > to) return bad(400, "Choose a child and valid start and end dates.");
  if (Date.parse(to) - Date.parse(from) > 35 * 86400000) return bad(400, "Choose a date range of up to five weeks.");
  const child = await db.prepare("SELECT id, stage, year_level, extra FROM students WHERE id = ? AND family_id = ?").bind(sid, familyId).first();
  if (!child) return bad(404, "Child not found.");
  return { ok: true as const, sid, from, to, child };
}

/** Reads the timetable, tracker and library, and saves one proposal per timetabled lesson slot. Spends no AI. */
export async function planRange(db: DB, familyId: string, q: { student_id?: unknown; from?: unknown; to?: unknown }, now: Date = new Date()): Promise<R<{ jurisdiction: string | null; catalogue_available: boolean; note: string; proposals: any[]; counts: Record<string, number> }>> {
  await ensureAutoQuest(db);
  const c = await checkRange(db, familyId, q);
  if (!c.ok) return c;
  const { sid, from, to, child } = c;
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  const cat = catalogueFor(jurisdiction);
  const [events, assignments, lessons] = await Promise.all([
    db.prepare("SELECT id, student_id, date, title, event_type, linked_assignment_id, duration_minutes FROM calendar_events WHERE family_id = ? AND student_id = ? AND date >= ? AND date <= ? ORDER BY date ASC, start_time ASC LIMIT 250").bind(familyId, sid, from, to).all(),
    db.prepare("SELECT id, student_id, lesson_id, scheduled_date, status FROM assignments WHERE family_id = ? AND student_id = ? LIMIT 2000").bind(familyId, sid).all(),
    lb.listLessons(db, familyId),
  ]);
  let progress: QuestProgress[] = [];
  let outcomes: QuestOutcome[] | undefined;
  let areaOf: ((t: string) => string) | undefined;
  if (cat.available) {
    const t: any = await trackerFor(db, familyId, sid, { now });
    if (!t?.available) return bad(503, "The Outcome Tracker isn't ready yet. Please try again shortly.");
    progress = t.outcomes.map((o: any) => ({ code: o.code, status: o.status, last_evidence_on: o.last_evidence_on, gaps: o.gaps }));
    // Only what the child is covering: their year level and the subjects chosen on their profile.
    const program = programFor(cat, child);
    outcomes = cat.outcomes.filter(program.includes).map((o) => ({ code: o.code, learning_area: o.learning_area }));
    areaOf = areaMatcher(cat, String(child.stage || ""));
  }
  const decisions = planAutoQuest({
    studentId: sid, slots: events.results || [], lessons: lessons as any, assignments: assignments.results || [], progress,
    catalogueAvailable: cat.available, allowedOutcomeCodes: cat.available ? cat.outcomes.map((o) => o.code) : [], outcomes, areaOf,
    today: now.toISOString().slice(0, 10),
  });

  const ts = now.toISOString();
  for (const d of decisions) {
    const existing = await db.prepare("SELECT * FROM auto_quest_proposals WHERE family_id = ? AND calendar_event_id = ?").bind(familyId, d.slotId).first();
    // Decided proposals and AI drafts already made are kept exactly as they are: re-planning never loses work.
    if (existing && (existing.status !== "proposed" || existing.generated)) continue;
    const vals = [d.date, d.learningArea || null, d.action, d.purpose || null, JSON.stringify(d.eligibleOutcomeCodes), cat.available ? cat.framework : null, d.lessonId || null, d.reason, ts];
    if (existing) {
      await db.prepare("UPDATE auto_quest_proposals SET date = ?, learning_area = ?, action = ?, purpose = ?, outcome_codes = ?, framework = ?, lesson_id = ?, reason = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(...vals, existing.id, familyId).run();
    } else {
      await db.prepare("INSERT INTO auto_quest_proposals (id, family_id, student_id, calendar_event_id, date, learning_area, action, purpose, outcome_codes, framework, lesson_id, reason, updated_at, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(newId(), familyId, sid, d.slotId, ...vals, ts, d.action === "already_assigned" ? "assigned" : "proposed").run();
    }
  }
  // Slots removed from the timetable: their untouched proposals go too (decided ones and drafts are kept).
  const slotIds = new Set(decisions.map((d) => d.slotId));
  const { results: stale } = await db.prepare("SELECT id, calendar_event_id FROM auto_quest_proposals WHERE family_id = ? AND student_id = ? AND date >= ? AND date <= ? AND status = 'proposed' AND generated = 0").bind(familyId, sid, from, to).all();
  for (const r of stale || []) if (!slotIds.has(r.calendar_event_id)) await db.prepare("DELETE FROM auto_quest_proposals WHERE id = ? AND family_id = ?").bind(r.id, familyId).run();

  const proposals = await listProposals(db, familyId, sid, from, to);
  const counts: Record<string, number> = {};
  for (const p of proposals) counts[p.action] = (counts[p.action] || 0) + 1;
  return {
    ok: true, jurisdiction, catalogue_available: cat.available,
    note: cat.available
      ? `Planned from ${cat.name}. Nothing is assigned until you approve it, and finishing a lesson never marks an outcome as mastered.`
      : (cat as any).note,
    proposals, counts,
  };
}

async function ownProposal(db: DB, familyId: string, id: string) {
  await ensureAutoQuest(db);
  return db.prepare("SELECT * FROM auto_quest_proposals WHERE id = ? AND family_id = ?").bind(id, familyId).first();
}

/** Drafts a lesson for a proposal with AI (paid plans, normal limits). The draft is saved unassigned for review. */
export async function generateForProposal(db: DB, ai: any, o: { familyId: string; userId: string; id: string; model?: string; gatewayId?: string; compact?: boolean; fast?: boolean }, now: Date = new Date()): Promise<R<{ proposal: any }>> {
  const p = await ownProposal(db, o.familyId, o.id);
  if (!p) return bad(404, "Proposal not found");
  if (p.status !== "proposed") return bad(409, "This proposal has already been decided.", "DECIDED");
  if (p.lesson_id) return bad(409, "This proposal already has a lesson. Open it to edit, or reject the proposal.", "HAS_LESSON");
  const codes = json<string[]>(p.outcome_codes, []);
  const cat = catalogueFor(await getFamilyJurisdiction(db, o.familyId).catch(() => null));
  if (!cat.available || !codes.length || !codes.every((c) => cat.byCode.has(c))) return bad(409, "This slot has no verified outcomes to plan from. Choose or build a lesson yourself.", "NO_OUTCOMES");
  const ev = await db.prepare("SELECT duration_minutes FROM calendar_events WHERE id = ? AND family_id = ?").bind(p.calendar_event_id, o.familyId).first();
  // The official wording is used privately to steer the draft; the lesson itself references outcomes by code only.
  const goal = codes.map((c) => cat.byCode.get(c)?.description).filter(Boolean).join(" Also: ") || "";
  const purpose = p.purpose === "revise" ? "A short revision lesson revisiting" : p.purpose === "consolidate" ? "A consolidation lesson with extra practice on" : "A first teaching lesson on";
  const r: any = await aid.draftLessonWithAi(db, ai, {
    familyId: o.familyId, userId: o.userId, model: o.model, gatewayId: o.gatewayId, compact: o.compact, fast: o.fast,
    request: { student_id: p.student_id, learning_area: p.learning_area, topic: `${p.learning_area}: ${(goal || codes.join(", ")).slice(0, 250)}`, goal: `${purpose} ${goal}`.slice(0, 400), minutes: Number(ev?.duration_minutes) || undefined, link_outcomes: false } as any,
  }, now);
  if (!r.ok) return r;
  // Attach the verified target codes (filtered to the family's catalogue again by updateLesson). It stays a draft.
  const lesson = r.lesson;
  const up = await lb.updateLesson(db, o.familyId, lesson.id, { ...lesson, status: "draft", outcome_codes: codes, curriculum_refs: [...codes, ...(lesson.curriculum_refs || []).filter((x: string) => !codes.includes(x))].slice(0, 10) }, now);
  if (!up.ok) return up;
  await db.prepare("UPDATE auto_quest_proposals SET lesson_id = ?, generated = 1, action = 'reuse_draft', updated_at = ? WHERE id = ? AND family_id = ?").bind(lesson.id, now.toISOString(), p.id, o.familyId).run();
  const lessons = await lessonMap(db, o.familyId, [lesson.id]);
  return { ok: true, proposal: proposalOut(await ownProposal(db, o.familyId, p.id), lessons) };
}

/** The parent chooses a different saved lesson for a slot (their library, any lesson they own). */
export async function setProposalLesson(db: DB, familyId: string, id: string, lessonId: unknown, now: Date = new Date()): Promise<R<{ proposal: any }>> {
  const p = await ownProposal(db, familyId, id);
  if (!p) return bad(404, "Proposal not found");
  if (p.status !== "proposed") return bad(409, "This proposal has already been decided.", "DECIDED");
  const l = await db.prepare("SELECT id FROM lessons WHERE id = ? AND family_id = ? AND archived_at IS NULL").bind(String(lessonId || ""), familyId).first();
  if (!l) return bad(404, "Lesson not found");
  await db.prepare("UPDATE auto_quest_proposals SET lesson_id = ?, action = 'reuse_draft', updated_at = ? WHERE id = ? AND family_id = ?").bind(l.id, now.toISOString(), id, familyId).run();
  return { ok: true, proposal: proposalOut(await ownProposal(db, familyId, id), await lessonMap(db, familyId, [l.id])) };
}

/**
 * Approves a proposal: assigns its lesson to the child for that day and links the timetable slot, only if the slot isn't
 * already linked to something else. A draft lesson is only assigned when the parent confirms they reviewed it.
 */
export async function approveProposal(db: DB, familyId: string, parentId: string, id: string, body: any, now: Date = new Date()): Promise<R<{ proposal: any }>> {
  const p = await ownProposal(db, familyId, id);
  if (!p) return bad(404, "Proposal not found");
  if (p.status !== "proposed") return bad(409, "This proposal has already been decided.", "DECIDED");
  if (!p.lesson_id) return bad(409, "Choose, build or draft a lesson for this slot first.", "NO_LESSON");
  const row = await db.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(p.lesson_id, familyId).first();
  if (!row) return bad(404, "Lesson not found");
  const lesson: any = lb.lessonOut(row);
  if (row.status !== "ready") {
    if (body?.confirm_reviewed !== true) return bad(409, "This lesson is still a draft. Review it, then confirm you've checked it before it's assigned.", "NEEDS_REVIEW");
    const up = await lb.updateLesson(db, familyId, row.id, { ...lesson, status: "ready" }, now);
    if (!up.ok) return up;
  }
  const ev = await db.prepare("SELECT id, linked_assignment_id, linked_lesson_id FROM calendar_events WHERE id = ? AND family_id = ?").bind(p.calendar_event_id, familyId).first();
  const why = p.purpose === "revise" ? `Revision (Auto-Quest): revisiting ${json<string[]>(p.outcome_codes, []).join(", ")}.` : null;
  const a = await lb.assignLesson(db, familyId, { student_id: p.student_id, lesson_id: p.lesson_id, scheduled_date: p.date, parent_notes: why, again: true }, now);
  let assignmentId: string;
  if (a.ok) assignmentId = a.assignment.id;
  else if (a.code === "ALREADY_ASSIGNED") {
    const open = await db.prepare("SELECT id FROM assignments WHERE family_id = ? AND student_id = ? AND lesson_id = ? AND status NOT IN ('accepted','demonstrated','completed') ORDER BY created_at DESC LIMIT 1").bind(familyId, p.student_id, p.lesson_id).first();
    assignmentId = open.id;
  } else return a;
  // (again: the parent approved this proposal, and revision deliberately repeats a finished lesson.)
  // Never override a slot the parent already linked to something else.
  if (ev && !ev.linked_assignment_id) {
    await db.prepare("UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = COALESCE(linked_lesson_id, ?) WHERE id = ? AND family_id = ? AND linked_assignment_id IS NULL").bind(assignmentId, p.lesson_id, ev.id, familyId).run();
  }
  const ts = now.toISOString();
  await db.prepare("UPDATE auto_quest_proposals SET status = 'assigned', assignment_id = ?, decided_by = ?, decided_at = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(assignmentId, parentId, ts, ts, id, familyId).run();
  return { ok: true, proposal: proposalOut(await ownProposal(db, familyId, id), await lessonMap(db, familyId, [p.lesson_id])) };
}

export async function rejectProposal(db: DB, familyId: string, parentId: string, id: string, body: any, now: Date = new Date()): Promise<R<{ proposal: any }>> {
  const p = await ownProposal(db, familyId, id);
  if (!p) return bad(404, "Proposal not found");
  if (p.status !== "proposed") return bad(409, "This proposal has already been decided.", "DECIDED");
  const ts = now.toISOString();
  // A generated draft stays in the lesson library (Drafts): rejecting the slot never deletes the parent's lesson.
  await db.prepare("UPDATE auto_quest_proposals SET status = 'rejected', decided_by = ?, decided_at = ?, decision_note = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(parentId, ts, String(body?.reason || "").slice(0, 500) || null, ts, id, familyId).run();
  return { ok: true, proposal: proposalOut(await ownProposal(db, familyId, id), await lessonMap(db, familyId, [p.lesson_id])) };
}

/** Puts a rejected proposal back so it can be planned again. */
export async function reopenProposal(db: DB, familyId: string, id: string, now: Date = new Date()): Promise<R<{ proposal: any }>> {
  const p = await ownProposal(db, familyId, id);
  if (!p) return bad(404, "Proposal not found");
  if (p.status !== "rejected") return bad(409, "Only a rejected proposal can be reopened.");
  await db.prepare("UPDATE auto_quest_proposals SET status = 'proposed', decided_by = NULL, decided_at = NULL, decision_note = NULL, updated_at = ? WHERE id = ? AND family_id = ?").bind(now.toISOString(), id, familyId).run();
  return { ok: true, proposal: proposalOut(await ownProposal(db, familyId, id), await lessonMap(db, familyId, [p.lesson_id])) };
}

// ---------------------------------------------------------------- routes

export function registerAutoQuest(app: App, g: Guards) {
  const send = (c: any, r: { ok: false; status: number; detail: string; code?: string }) => c.json({ detail: r.detail, code: r.code }, r.status);
  // Read-only preview kept for older clients: plans without saving anything.
  app.get("/api/auto-quest/preview", g.auth, g.parent, async (c) => {
    const fid = c.get("user").family_id;
    const chk = await checkRange(c.env.DB, fid, { student_id: c.req.query("student_id"), from: c.req.query("from"), to: c.req.query("to") });
    if (!chk.ok) return send(c, chk);
    const r = await listProposals(c.env.DB, fid, chk.sid, chk.from, chk.to);
    return c.json({ student_id: chk.sid, from: chk.from, to: chk.to, proposals: r });
  });
  app.get("/api/auto-quest/proposals", g.auth, g.parent, async (c) => {
    const fid = c.get("user").family_id;
    const chk = await checkRange(c.env.DB, fid, { student_id: c.req.query("student_id"), from: c.req.query("from"), to: c.req.query("to") });
    if (!chk.ok) return send(c, chk);
    return c.json({ proposals: await listProposals(c.env.DB, fid, chk.sid, chk.from, chk.to) });
  });
  app.post("/api/auto-quest/plan", g.auth, g.parent, async (c) => {
    const r = await planRange(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    if (!r.ok) return send(c, r);
    const { ok: _ok, ...out } = r;
    return c.json(out);
  });
  app.post("/api/auto-quest/proposals/:id/generate", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await generateForProposal(c.env.DB, c.env.AI, { familyId: u.family_id, userId: u.id, id: c.req.param("id"), model: c.env.AI_MODEL, gatewayId: c.env.AI_GATEWAY_ID, compact: c.env.AI_COMPACT_GENERATION === "true", fast: c.env.AI_FAST_PIPELINE === "true" });
    return r.ok ? c.json(r.proposal) : send(c, r);
  });
  app.put("/api/auto-quest/proposals/:id/lesson", g.auth, g.parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await setProposalLesson(c.env.DB, c.get("user").family_id, c.req.param("id"), b.lesson_id);
    return r.ok ? c.json(r.proposal) : send(c, r);
  });
  app.post("/api/auto-quest/proposals/:id/approve", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await approveProposal(c.env.DB, u.family_id, u.id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json(r.proposal) : send(c, r);
  });
  app.post("/api/auto-quest/proposals/:id/reject", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await rejectProposal(c.env.DB, u.family_id, u.id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json(r.proposal) : send(c, r);
  });
  app.post("/api/auto-quest/proposals/:id/reopen", g.auth, g.parent, async (c) => {
    const r = await reopenProposal(c.env.DB, c.get("user").family_id, c.req.param("id"));
    return r.ok ? c.json(r.proposal) : send(c, r);
  });
}
