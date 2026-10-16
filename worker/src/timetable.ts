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
  if (!a) return fail(404, "Assignment not found");
  if (lb.DONE_STATUSES.includes(a.status) || a.status === "submitted") return fail(409, "This lesson is already handed in or finished.", "ALREADY_DONE");
  const lesson = await db.prepare("SELECT title, learning_area, stage FROM lessons WHERE id = ?").bind(a.lesson_id).first<any>();
  const child = await db.prepare("SELECT stage FROM students WHERE id = ?").bind(a.student_id).first<any>();
  const area = String(lesson?.learning_area || "");
  const stage = String(child?.stage || lesson?.stage || "");
  const from = validDate(input?.from) ? input.from : now.toISOString().slice(0, 10);
  let chosen: any[] = [];
  if (Array.isArray(input?.slot_ids) && input.slot_ids.length) {
    const ids = input.slot_ids.map(String).slice(0, 10);
    const open = await listSlots(db, familyId, { student_id: a.student_id, open: true });
    chosen = ids.map((id: string) => open.find((s: any) => s.id === id)).filter(Boolean);
    if (chosen.length !== ids.length) return fail(409, "That timetable slot isn't free any more. Please pick another.", "SLOT_TAKEN");
  } else {
    const count = Math.min(10, Math.max(1, Number(input?.count) || 1));
    const open = await listSlots(db, familyId, { student_id: a.student_id, from, open: true });
    chosen = open.filter((s: any) => sameSubject(s.title, area, stage)).slice(0, count);
    if (!chosen.length) return { ok: true, placed: [], reason: "no_slot", learning_area: area };
  }
  for (const s of chosen) {
    // Only fill a slot that is still open (a second tab or Auto-Quest may have filled it meanwhile).
    const r = await db.prepare("UPDATE calendar_events SET linked_assignment_id = ?, linked_lesson_id = ? WHERE id = ? AND family_id = ? AND linked_assignment_id IS NULL AND linked_lesson_id IS NULL")
      .bind(a.id, a.lesson_id, s.id, familyId).run();
    if (!r.meta.changes) return fail(409, "That timetable slot isn't free any more. Please pick another.", "SLOT_TAKEN");
  }
  const first = chosen.map((s: any) => s.date).sort()[0];
  await db.prepare("UPDATE assignments SET scheduled_date = ?, updated_at = ? WHERE id = ? AND family_id = ?").bind(first, now.toISOString(), a.id, familyId).run();
  return { ok: true, placed: chosen.map((s: any) => ({ id: s.id, title: s.title, date: s.date, start_time: s.start_time })), learning_area: area };
}

/** Empties the slots an assignment was in (the timetable itself stays). */
export async function emptySlotsFor(db: DB, familyId: string, assignmentId: string) {
  await db.prepare(`UPDATE calendar_events SET linked_assignment_id = NULL, linked_lesson_id = NULL WHERE family_id = ? AND linked_assignment_id = ? AND ${SLOT_SQL}`)
    .bind(familyId, assignmentId).run();
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
  app.post("/api/assignments/:id/place", g.auth, g.parent, async (c) => {
    const r = await placeAssignment(c.env.DB, c.get("user").family_id, c.req.param("id"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ placed: r.placed, reason: r.reason ?? null, learning_area: r.learning_area }) : send(c, r);
  });
}
