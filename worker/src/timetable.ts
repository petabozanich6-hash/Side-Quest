/**
 * Timetable slots (Family Membership feature).
 *
 * A parent generates a child's timetable one week at a time. Each block is a calendar entry with
 * event_type "timetable": a SLOT for a subject ("Mathematics", Tuesday 9:00, 45 min). Assigning a lesson fills the
 * child's next open slot of the lesson's subject (linked_assignment_id + linked_lesson_id on the slot), so the
 * calendar, the child's "Today's quests" and Auto-Quest all read the same timetable. Un-assigning empties the slot
 * again; it never deletes the timetable.
 *
 * No schema change: slots are calendar_events rows. Entries made by the older one-week generator (event_type
 * "lesson", no lesson linked, notes starting "Suggested by Side-Quest") are treated as slots too; nothing is rewritten.
 */
import * as lb from "./lessonBuilder";
import type { Result } from "./lessonBuilder";
import { normArea } from "./outcomeMatch";
import type { App, Guards } from "./types";

type DB = D1Database;
const { fail } = lb;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const MAX_BLOCKS = 120;
const LEGACY_NOTE = "Suggested by Side-Quest%";
const validDate = (v: unknown): v is string => typeof v === "string" && DATE.test(v) && !Number.isNaN(Date.parse(v));
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const addDays = (d: string, n: number) => new Date(Date.parse(d + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);

/** SQL condition for "this calendar row is a timetable slot" (new slots, and slots from the older generator). */
export const SLOT_SQL = `(event_type = 'timetable' OR (event_type = 'lesson' AND notes LIKE '${LEGACY_NOTE}'))`;

/** Same subject? Exact name, or both names mean the same learning area (Maths = Mathematics, PDHPE = Health...). */
export function sameSubject(slotTitle: string, lessonArea: string, stage: string): boolean {
  const a = String(slotTitle || "").trim().toLowerCase();
  const b = String(lessonArea || "").trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  const na = normArea(a, stage), nb = normArea(b, stage);
  return !!na && na === nb;
}

async function timetableAllowed(db: DB, familyId: string) {
  return (await lb.getEntitlement(db, familyId)).limits.timetable;
}
const paywall = () => lb.paywall("Timetables are part of the Family Membership. You can still assign lessons and choose a day yourself.");

export type Block = { student_id: string; title: string; date: string; start_time: string; duration_minutes: number };

/** Saves a week of timetable slots (one week at a time). Skips any slot that is already there. */
export async function saveWeek(db: DB, familyId: string, input: any, now = new Date()): Promise<Result<{ created: number; skipped: number }>> {
  if (!(await timetableAllowed(db, familyId))) return paywall();
  const weekStart = input?.week_start;
  if (!validDate(weekStart)) return fail(400, "Choose the week (a date like 2026-10-19).");
  const weekEnd = addDays(weekStart, 6);
  const blocks: Block[] = Array.isArray(input?.blocks) ? input.blocks : [];
  if (!blocks.length) return fail(400, "Nothing to save.");
  if (blocks.length > MAX_BLOCKS) return fail(400, `A week can have at most ${MAX_BLOCKS} timetable slots.`);
  const children = new Map<string, boolean>();
  const rows: Block[] = [];
  for (const b of blocks) {
    const title = clip(b?.title, 80);
    const minutes = Number(b?.duration_minutes);
    if (!title || !validDate(b?.date) || !TIME.test(String(b?.start_time || "")) || !Number.isInteger(minutes) || minutes < 10 || minutes > 180) {
      return fail(400, "Each slot needs a subject, a date, a start time and 10 to 180 minutes.");
    }
    if (b.date < weekStart || b.date > weekEnd) return fail(400, "All slots must be in the chosen week.");
    const sid = String(b?.student_id || "");
    if (!children.has(sid)) {
      children.set(sid, !!(await db.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(sid, familyId).first()));
    }
    if (!children.get(sid)) return fail(404, "Child not found");
    rows.push({ student_id: sid, title, date: b.date, start_time: b.start_time, duration_minutes: minutes });
  }
  let created = 0, skipped = 0;
  for (const r of rows) {
    // Check real interval overlap across ALL calendar event types (including parent-added commitments).
    // An identical start-time comparison allows two lessons to overlap when their starts differ.
    const start = Number(r.start_time.slice(0, 2)) * 60 + Number(r.start_time.slice(3));
    if (start + r.duration_minutes > 1440) return fail(400, "A lesson cannot run past midnight.");
    const sameDay = (await db.prepare(
      "SELECT start_time, duration_minutes FROM calendar_events WHERE family_id = ? AND student_id = ? AND date = ? AND start_time IS NOT NULL"
    ).bind(familyId, r.student_id, r.date).all<any>()).results ?? [];
    const clash = sameDay.some((event: any) => {
      if (!TIME.test(String(event.start_time ?? ""))) return false;
      const eventStart = Number(event.start_time.slice(0, 2)) * 60 + Number(event.start_time.slice(3));
      const eventEnd = eventStart + Math.max(1, Number(event.duration_minutes) || 1);
      return start < eventEnd && eventStart < start + r.duration_minutes;
    });
    if (clash) { skipped++; continue; }
    await db.prepare(
      "INSERT INTO calendar_events (id, family_id, student_id, title, date, start_time, duration_minutes, event_type, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'timetable', ?, ?)",
    ).bind(crypto.randomUUID(), familyId, r.student_id, r.title, r.date, r.start_time, r.duration_minutes, "Timetable slot", now.toISOString()).run();
    created++;
  }
  return { ok: true, created, skipped };
}

/** A child's timetable slots in a date range (filled and open), for "Repeat last week" and the assign window. */
export async function listSlots(db: DB, familyId: string, q: { student_id?: string; from?: string; to?: string; open?: boolean }) {
  let sql = `SELECT e.id, e.student_id, e.title, e.date, e.start_time, e.duration_minutes, e.linked_assignment_id, e.linked_lesson_id, l.title AS lesson_title
    FROM calendar_events e LEFT JOIN lessons l ON l.id = e.linked_lesson_id
    WHERE e.family_id = ? AND ${SLOT_SQL.replace(/event_type/g, "e.event_type").replace(/notes/g, "e.notes")}`;
  const b: unknown[] = [familyId];
  if (q.student_id) { sql += " AND e.student_id = ?"; b.push(q.student_id); }
  if (q.from && validDate(q.from)) { sql += " AND e.date >= ?"; b.push(q.from); }
  if (q.to && validDate(q.to)) { sql += " AND e.date <= ?"; b.push(q.to); }
  if (q.open) sql += " AND e.linked_assignment_id IS NULL AND e.linked_lesson_id IS NULL";
  sql += " ORDER BY e.date ASC, e.start_time ASC LIMIT 400";
  return (await db.prepare(sql).bind(...b).all<any>()).results ?? [];
}

/**
 * Puts an assignment into the timetable. With slot_ids, exactly those open slots (the child's own); otherwise the
 * next `count` open slots of the lesson's subject from `from` (default today). Returns the filled slots; an empty list
 * with reason "no_slot" when there is no matching open slot (the assignment itself is unchanged).
 */
export async function placeAssignment(db: DB, familyId: string, assignmentId: string, input: any, now = new Date()):
  Promise<Result<{ placed: any[]; reason?: string; learning_area: string }>> {
  if (!(await timetableAllowed(db, familyId))) return paywall();
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?").bind(assignmentId, familyId).first<any>();
  if (!a || a.status === "revoked") return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status) || a.status === "submitted") return fail(409, "This lesson is already handed in or finished.", "ALREADY_DONE");
  const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ?").bind(a.lesson_id).first<any>();
  const child = await db.prepare("SELECT stage FROM students WHERE id = ?").bind(a.student_id).first<any>();
  const area = String(lesson?.learning_area || "");
  const stage = String(child?.stage || lesson?.stage || "");
  const from = validDate(input?.from) ? input.from : now.toISOString().slice(0, 10);
  let chosen: any[] = [];
  if (Array.isArray(input?.slot_ids) && input.slot_ids.length) {
    const ids = input.slot_ids.map(String).slice(0, 10);
    if (new Set(ids).size !== ids.length)
      return fail(400, "Choose each timetable slot only once.");
    // Query exactly the requested IDs, even when years of slots exist.
    const slots = (await db.prepare(`SELECT id, student_id, title, date, start_time,
      linked_assignment_id, linked_lesson_id FROM calendar_events
      WHERE family_id = ? AND student_id = ? AND id IN (${ids.map(() => "?").join(",")})
      AND ${SLOT_SQL}`).bind(familyId, a.student_id, ...ids).all<any>()).results ?? [];
    chosen = ids.map((id: string) => slots.find((slot: any) => slot.id === id)).filter(Boolean);
    if (chosen.length !== ids.length || chosen.some((slot: any) =>
      slot.linked_assignment_id || slot.linked_lesson_id || !sameSubject(slot.title, area, stage)))
      return fail(409, "Choose empty timetable slots for this child's subject.", "SLOT_TAKEN");
  } else {
    const count = Math.min(10, Math.max(1, Number(input?.count) || 1));
    const open = await listSlots(db, familyId, { student_id: a.student_id, from, open: true });
    chosen = open.filter((s: any) => sameSubject(s.title, area, stage)).slice(0, count);
    if (!chosen.length) return { ok: true, placed: [], reason: "no_slot", learning_area: area };
  }
  // D1 batch is transactional. Verify each slot INSIDE the same transaction
  // as the updates: no partial assignments if another parent tab filled a slot.
  const writes: D1PreparedStatement[] = [];
  for (const s of chosen) {
    writes.push(db.prepare(`SELECT CASE WHEN EXISTS(
      SELECT 1 FROM calendar_events WHERE id = ? AND family_id = ? AND student_id = ?
        AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL AND ${SLOT_SQL}
    ) THEN 1 ELSE json_extract('SLOT_TAKEN', '
}

/** Empties the slots an assignment was in (the timetable itself stays). */
export async function emptySlotsFor(db: DB, familyId: string, assignmentId: string) {
  await db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE family_id = ? AND linked_assignment_id = ? AND ${SLOT_SQL}`)
    .bind(familyId, assignmentId).run();
}

/** Preview moving unfinished filled timetable slots from a disrupted day.
 * Plans only into already-free slots of the same subject, never inventing a new school day. */
export async function planMissedDay(db: DB, familyId: string, input: any) {
  if (!(await timetableAllowed(db, familyId))) return paywall();
  const studentId = String(input?.student_id || "");
  const date = input?.date;
  if (!validDate(date)) return fail(400, "Choose the day to reschedule.");
  const student = await db.prepare("SELECT id, stage FROM students WHERE id = ? AND family_id = ?")
    .bind(studentId, familyId).first<any>();
  if (!student) return fail(404, "Child not found");
  const futureUntil = addDays(date, 28);
  const current = await listSlots(db, familyId, { student_id: studentId, from: date, to: date });
  const future = await listSlots(db, familyId, { student_id: studentId, from: addDays(date, 1), to: futureUntil, open: true });
  const plan: any[] = [], unplaced: any[] = [];
  const used = new Set<string>();
  for (const slot of current.filter((s: any) => !!s.linked_assignment_id)) {
    const a = await db.prepare("SELECT status FROM assignments WHERE id = ? AND family_id = ? AND student_id = ?")
      .bind(slot.linked_assignment_id, familyId, studentId).first<any>();
    if (!a || lb.DONE_STATUSES.includes(a.status) || a.status === "submitted") continue;
    const candidate = future.find((s: any) => !used.has(s.id) && sameSubject(s.title, slot.title, student.stage || "") && Number(s.duration_minutes) >= Number(slot.duration_minutes));
    if (!candidate) { unplaced.push({ from_slot_id: slot.id, title: slot.title }); continue; }
    used.add(candidate.id);
    plan.push({ from_slot_id: slot.id, to_slot_id: candidate.id, assignment_id: slot.linked_assignment_id,
      title: slot.title, from_date: slot.date, to_date: candidate.date, to_time: candidate.start_time });
  }
  return { ok: true, plan, unplaced };
}

/** Apply a fresh preview only when all source/target records remain unchanged. */
export async function applyMissedDay(db: DB, familyId: string, input: any) {
  const preview = await planMissedDay(db, familyId, input);
  if (!preview.ok) return preview;
  const requested = Array.isArray(input?.moves) ? input.moves : [];
  if (!requested.length) return fail(400, "No lessons selected to move.");
  const planned = new Map(preview.plan.map((p: any) => [p.from_slot_id + ":" + p.to_slot_id, p]));
  const moves: any[] = [];
  for (const move of requested) {
    const found = planned.get(String(move?.from_slot_id) + ":" + String(move?.to_slot_id));
    if (!found || moves.some(m => m.from_slot_id === found.from_slot_id || m.to_slot_id === found.to_slot_id))
      return fail(409, "The proposed timetable has changed. Preview again.", "PLAN_CHANGED");
    moves.push(found);
  }
  // Conditional validation and updates run within one D1 batch.
  const statements: D1PreparedStatement[] = [];
  for (const move of moves) {
    statements.push(db.prepare(`SELECT CASE WHEN EXISTS (
      SELECT 1 FROM calendar_events src JOIN calendar_events dest
        ON dest.id = ? AND dest.family_id = ?
      WHERE src.id = ? AND src.family_id = ?
        AND src.linked_assignment_id = ?
        AND dest.linked_assignment_id IS NULL AND dest.linked_lesson_id IS NULL
    ) THEN 1 ELSE json_extract('STALE_RESCHEDULE_PLAN', '$') END AS valid`)
      .bind(move.to_slot_id, familyId, move.from_slot_id, familyId, move.assignment_id));
    statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL
      WHERE id = ? AND family_id = ? AND linked_assignment_id = ?`)
      .bind(move.from_slot_id, familyId, move.assignment_id));
    statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id =
      (SELECT lesson_id FROM assignments WHERE id = ? AND family_id = ?)
      WHERE id = ? AND family_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL`)
      .bind(move.assignment_id, move.assignment_id, familyId, move.to_slot_id, familyId));
  }
  // Some lessons span multiple timetable sessions. Preserve their actual
  // earliest remaining session after every move, rather than the last moved date.
  const assignmentIds = [...new Set(moves.map(m => String(m.assignment_id)))];
  for (const id of assignmentIds) statements.push(db.prepare(`UPDATE assignments SET
    scheduled_date = (SELECT MIN(date) FROM calendar_events WHERE family_id = ? AND linked_assignment_id = ?),
    updated_at = ? WHERE id = ? AND family_id = ?`)
    .bind(familyId, id, new Date().toISOString(), id, familyId));
  await db.batch(statements);
  return { ok: true, moved: moves.length };
}

export function registerTimetable(app: App, g: Guards) {
  const send = (c: any, r: any) => c.json({ detail: r.detail, ...(r.code ? { code: r.code } : {}) }, r.status);
  app.get("/api/timetable/status", g.auth, g.parent, async (c) => c.json({ allowed: await timetableAllowed(c.env.DB, c.get("user").family_id) }));
  app.get("/api/timetable/slots", g.auth, g.parent, async (c) => {
    const fid = c.get("user").family_id;
    if (!(await timetableAllowed(c.env.DB, fid))) return send(c, paywall());
    return c.json(await listSlots(c.env.DB, fid, { student_id: c.req.query("student_id") || undefined, from: c.req.query("from") || undefined, to: c.req.query("to") || undefined, open: c.req.query("open") === "1" }));
  });
  app.post("/api/timetable/week", g.auth, g.parent, async (c) => {
    const r = await saveWeek(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ created: r.created, skipped: r.skipped }) : send(c, r);
  });
  app.post("/api/timetable/reschedule/preview", g.auth, g.parent, async (c) => {
    const r = await planMissedDay(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ plan: r.plan, unplaced: r.unplaced }) : send(c, r);
  });
  app.post("/api/timetable/reschedule/apply", g.auth, g.parent, async (c) => {
    const r = await applyMissedDay(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok && "moved" in r ? c.json({ moved: r.moved }) : send(c, r);
  });
  app.post("/api/assignments/:id/place", g.auth, g.parent, async (c) => {
    const r = await placeAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ placed: r.placed, reason: r.reason ?? null, learning_area: r.learning_area }) : send(c, r);
  });
}
) END AS available`)
      .bind(s.id, familyId, a.student_id));
    writes.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ?
      WHERE id = ? AND family_id = ? AND student_id = ?
        AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL`)
      .bind(a.id, a.lesson_id, s.id, familyId, a.student_id));
  }
  writes.push(db.prepare(`UPDATE assignments SET
    scheduled_date = (SELECT MIN(date) FROM calendar_events
      WHERE family_id = ? AND linked_assignment_id = ?),
    updated_at = ? WHERE id = ? AND family_id = ?`)
    .bind(familyId, a.id, now.toISOString(), a.id, familyId));
  try { await db.batch(writes); }
  catch (e) {
    if (/malformed JSON|SLOT_TAKEN/i.test(String(e)))
      return fail(409, "That timetable slot isn't free any more. Please refresh and choose another.", "SLOT_TAKEN");
    throw e;
  }
  return { ok: true, placed: chosen.map((s: any) => ({ id: s.id, title: s.title, date: s.date, start_time: s.start_time })), learning_area: area };
}

/** Empties the slots an assignment was in (the timetable itself stays). */
export async function emptySlotsFor(db: DB, familyId: string, assignmentId: string) {
  await db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE family_id = ? AND linked_assignment_id = ? AND ${SLOT_SQL}`)
    .bind(familyId, assignmentId).run();
}

/** Preview moving unfinished filled timetable slots from a disrupted day.
 * Plans only into already-free slots of the same subject, never inventing a new school day. */
export async function planMissedDay(db: DB, familyId: string, input: any) {
  if (!(await timetableAllowed(db, familyId))) return paywall();
  const studentId = String(input?.student_id || "");
  const date = input?.date;
  if (!validDate(date)) return fail(400, "Choose the day to reschedule.");
  const student = await db.prepare("SELECT id, stage FROM students WHERE id = ? AND family_id = ?")
    .bind(studentId, familyId).first<any>();
  if (!student) return fail(404, "Child not found");
  const futureUntil = addDays(date, 28);
  const current = await listSlots(db, familyId, { student_id: studentId, from: date, to: date });
  const future = await listSlots(db, familyId, { student_id: studentId, from: addDays(date, 1), to: futureUntil, open: true });
  const plan: any[] = [], unplaced: any[] = [];
  const used = new Set<string>();
  for (const slot of current.filter((s: any) => !!s.linked_assignment_id)) {
    const a = await db.prepare("SELECT status FROM assignments WHERE id = ? AND family_id = ? AND student_id = ?")
      .bind(slot.linked_assignment_id, familyId, studentId).first<any>();
    if (!a || lb.DONE_STATUSES.includes(a.status) || a.status === "submitted") continue;
    const candidate = future.find((s: any) => !used.has(s.id) && sameSubject(s.title, slot.title, student.stage || "") && Number(s.duration_minutes) >= Number(slot.duration_minutes));
    if (!candidate) { unplaced.push({ from_slot_id: slot.id, title: slot.title }); continue; }
    used.add(candidate.id);
    plan.push({ from_slot_id: slot.id, to_slot_id: candidate.id, assignment_id: slot.linked_assignment_id,
      title: slot.title, from_date: slot.date, to_date: candidate.date, to_time: candidate.start_time });
  }
  return { ok: true, plan, unplaced };
}

/** Apply a fresh preview only when all source/target records remain unchanged. */
export async function applyMissedDay(db: DB, familyId: string, input: any) {
  const preview = await planMissedDay(db, familyId, input);
  if (!preview.ok) return preview;
  const requested = Array.isArray(input?.moves) ? input.moves : [];
  if (!requested.length) return fail(400, "No lessons selected to move.");
  const planned = new Map(preview.plan.map((p: any) => [p.from_slot_id + ":" + p.to_slot_id, p]));
  const moves: any[] = [];
  for (const move of requested) {
    const found = planned.get(String(move?.from_slot_id) + ":" + String(move?.to_slot_id));
    if (!found || moves.some(m => m.from_slot_id === found.from_slot_id || m.to_slot_id === found.to_slot_id))
      return fail(409, "The proposed timetable has changed. Preview again.", "PLAN_CHANGED");
    moves.push(found);
  }
  // Conditional validation and updates run within one D1 batch.
  const statements: D1PreparedStatement[] = [];
  for (const move of moves) {
    statements.push(db.prepare(`SELECT CASE WHEN EXISTS (
      SELECT 1 FROM calendar_events src JOIN calendar_events dest
        ON dest.id = ? AND dest.family_id = ?
      WHERE src.id = ? AND src.family_id = ?
        AND src.linked_assignment_id = ?
        AND dest.linked_assignment_id IS NULL AND dest.linked_lesson_id IS NULL
    ) THEN 1 ELSE json_extract('STALE_RESCHEDULE_PLAN', '$') END AS valid`)
      .bind(move.to_slot_id, familyId, move.from_slot_id, familyId, move.assignment_id));
    statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL
      WHERE id = ? AND family_id = ? AND linked_assignment_id = ?`)
      .bind(move.from_slot_id, familyId, move.assignment_id));
    statements.push(db.prepare(`UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id =
      (SELECT lesson_id FROM assignments WHERE id = ? AND family_id = ?)
      WHERE id = ? AND family_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL`)
      .bind(move.assignment_id, move.assignment_id, familyId, move.to_slot_id, familyId));
    statements.push(db.prepare("UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?")
      .bind(move.to_date, new Date().toISOString(), move.assignment_id, familyId));
  }
  await db.batch(statements);
  return { ok: true, moved: moves.length };
}

export function registerTimetable(app: App, g: Guards) {
  const send = (c: any, r: any) => c.json({ detail: r.detail, ...(r.code ? { code: r.code } : {}) }, r.status);
  app.get("/api/timetable/status", g.auth, g.parent, async (c) => c.json({ allowed: await timetableAllowed(c.env.DB, c.get("user").family_id) }));
  app.get("/api/timetable/slots", g.auth, g.parent, async (c) => {
    const fid = c.get("user").family_id;
    if (!(await timetableAllowed(c.env.DB, fid))) return send(c, paywall());
    return c.json(await listSlots(c.env.DB, fid, { student_id: c.req.query("student_id") || undefined, from: c.req.query("from") || undefined, to: c.req.query("to") || undefined, open: c.req.query("open") === "1" }));
  });
  app.post("/api/timetable/week", g.auth, g.parent, async (c) => {
    const r = await saveWeek(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ created: r.created, skipped: r.skipped }) : send(c, r);
  });
  app.post("/api/timetable/reschedule/preview", g.auth, g.parent, async (c) => {
    const r = await planMissedDay(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ plan: r.plan, unplaced: r.unplaced }) : send(c, r);
  });
  app.post("/api/timetable/reschedule/apply", g.auth, g.parent, async (c) => {
    const r = await applyMissedDay(c.env.DB, c.get("user").family_id, await c.req.json().catch(() => ({})));
    return r.ok && "moved" in r ? c.json({ moved: r.moved }) : send(c, r);
  });
  app.post("/api/assignments/:id/place", g.auth, g.parent, async (c) => {
    const r = await placeAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ placed: r.placed, reason: r.reason ?? null, learning_area: r.learning_area }) : send(c, r);
  });
}
