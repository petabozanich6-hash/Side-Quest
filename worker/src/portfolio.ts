// Evidence Backpack portfolio: one record of learning and progress for a child, built to be handed to whoever
// reviews home education in the family's state or territory (an Authorised Person in NSW, a moderator, an
// education officer or a written report elsewhere). The learning areas and outcome wording follow the
// family's chosen framework; NSW outcome codes are only shown to NSW families. It pulls together everything the family has
// approved: reviewed lesson work, reviewed life learning and parent-recorded evidence, lists the syllabus
// outcomes each entry gives evidence for, and summarises coverage and progress by key learning area.
// It is a record kept by the parent, not an assessment, and nothing here claims compliance.
import * as lb from "./lessonBuilder";
import * as pl from "./planning";
import { NSW_OUTCOMES } from "./data/curriculum";
import { normArea } from "./outcomeMatch";
import { AC9_OUTCOMES } from "./data/ac9-outcomes";
import { frameworkFor, areasFor, getFamilyJurisdiction, yearLabel, FRAMEWORKS, type Framework } from "./data/jurisdictions";
import { catalogueFor, trackerFor, STATUSES, STATUS_LABELS, GAP_LABELS } from "./outcomeTracker";
import { publicOutcomeDescription } from "./syllabusText";

type DB = any;

/** Key learning areas a family's program is expected to cover at each NSW stage (compulsory areas only). */
export const KLAS_BY_STAGE: Record<string, string[]> = {
  ES1: ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"],
  S1: ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"],
  S2: ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"],
  S3: ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"],
  S4: ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "TAS", "Languages"],
  S5: ["English", "Mathematics", "Science", "HSIE", "PDHPE"],
  S6: ["English"],
};

const STAGE_NAMES: Record<string, string> = { ES1: "Early Stage 1", S1: "Stage 1", S2: "Stage 2", S3: "Stage 3", S4: "Stage 4", S5: "Stage 5", S6: "Stage 6" };

const outcomeByCode = new Map<string, { learning_area: string }>([
  ...NSW_OUTCOMES.map((o: any) => [o.code, o] as [string, any]),
  ...AC9_OUTCOMES.map((o) => [o.code, o] as [string, any]),
]);

/**
 * What one piece of work shows for one outcome, as the parent judged it at review:
 * "shown" = the parent marked understanding shown; "working_towards" = practised, returned or not judged.
 * This is per piece of work. Whether the OUTCOME is Demonstrated or Achieved comes from the Outcome Tracker.
 */
export type PortfolioOutcome = { code: string; description: string; learning_area: string; status: "shown" | "working_towards" };
export type PortfolioFile = { id: string; name: string; content_type: string };
export type PortfolioEntry = {
  id: string;
  kind: "lesson" | "life" | "note" | "reading";
  date: string; // YYYY-MM-DD the learning happened or was approved
  title: string;
  learning_area: string; // key learning area (normalised), or "Other"
  subject: string; // as the family wrote it
  year_level: string;
  result: string; // "Skill shown", "Completed", "Recorded by parent"...
  work: string;
  reflection: string;
  parent_comment: string;
  next_step: string;
  duration_minutes: number | null;
  location: string;
  outcomes: PortfolioOutcome[];
  files: PortfolioFile[];
};

const day = (s: unknown) => (typeof s === "string" ? s.slice(0, 10) : "");
const json = <T,>(s: unknown, d: T): T => { try { return typeof s === "string" ? JSON.parse(s) : (s as T) ?? d; } catch { return d; } };

/**
 * Turns a mapping saved by a parent review into a portfolio outcome. Official outcome wording is never included
 * (codes only; the reader follows the curriculum authority link). Only an explicit "shown" judgement counts as
 * understanding shown: an old mapping that just says accepted: true was approval, which is practice.
 */
export function outcomeFrom(m: any, stage: string, shown: boolean = m?.mark === "shown"): PortfolioOutcome | null {
  const code = String(m?.code || "").trim();
  const known: any = code ? outcomeByCode.get(code) : null;
  const description = publicOutcomeDescription(code, String(m?.description || "").trim()).trim();
  if (!code && !description) return null;
  const area = known?.learning_area || normArea(String(m?.learning_area || ""), stage) || String(m?.learning_area || "") || "Other";
  return { code, description, learning_area: area, status: shown ? "shown" : "working_towards" };
}

// NSW key learning area -> the nearest learning area in another state's framework.
const TO_OTHER: Record<string, string[]> = {
  English: ["English"], Mathematics: ["Mathematics"], "Science and Technology": ["Science"], Science: ["Science"],
  HSIE: ["Humanities and Social Sciences", "Humanities"], PDHPE: ["Health and Physical Education"],
  "Creative Arts": ["The Arts"], TAS: ["Technologies"], Languages: ["Languages"],
};
/** Puts a learning area into the family's framework's wording. NSW (or unknown) keeps the NSW names. */
export function toFrameworkArea(area: string, fw: Framework | null, stage: string): string {
  if (!fw || fw.jurisdiction === "NSW") return area;
  const list = areasFor(fw, stage);
  if (list.includes(area)) return area;
  const nsw = normArea(area, stage) || area;
  return (TO_OTHER[nsw] || []).find((a) => list.includes(a)) || (area ? area : "Other");
}

/** The key learning area an entry belongs to: from its subject, else from its outcomes. */
export function klaFor(subject: string, outcomes: PortfolioOutcome[], stage: string): string {
  return normArea(subject, stage) || outcomes.find((o) => o.learning_area && o.learning_area !== "Other")?.learning_area || "Other";
}

export type AreaSummary = {
  learning_area: string;
  expected: boolean;
  entries: number;
  first: string | null;
  latest: string | null;
  minutes: number;
  /** Outcomes with work in this period where the parent marked understanding shown at least once. */
  outcomes_shown: number;
  outcomes_working_towards: number;
  /** Evidence in this period by kind (lesson work, life learning, parent notes, reading records). */
  by_kind: Record<string, number>;
};
export type OutcomeSummary = { code: string; description: string; learning_area: string; times: number; first: string; latest: string; status: "shown" | "working_towards"; mastery?: string | null; mastery_confirmed?: boolean };

/** Coverage and progress by key learning area, plus every outcome evidenced (earliest and latest evidence). */
export function summarise(entries: PortfolioEntry[], stage: string, expectedAreas?: string[]) {
  const expected = expectedAreas || KLAS_BY_STAGE[stage] || KLAS_BY_STAGE.S2;
  const areas = new Map<string, AreaSummary>();
  const blank = (a: string): AreaSummary => ({ learning_area: a, expected: expected.includes(a), entries: 0, first: null, latest: null, minutes: 0, outcomes_shown: 0, outcomes_working_towards: 0, by_kind: {} });
  for (const a of expected) areas.set(a, blank(a));
  const outcomes = new Map<string, OutcomeSummary>();
  for (const e of entries) {
    const a = areas.get(e.learning_area) || blank(e.learning_area);
    areas.set(e.learning_area, a);
    a.entries++;
    if (e.kind) a.by_kind[e.kind] = (a.by_kind[e.kind] || 0) + 1;
    if (e.date) { if (!a.first || e.date < a.first) a.first = e.date; if (!a.latest || e.date > a.latest) a.latest = e.date; }
    a.minutes += e.duration_minutes || 0;
    for (const o of e.outcomes) {
      const key = o.code || o.description;
      const cur = outcomes.get(key);
      if (!cur) outcomes.set(key, { code: o.code, description: o.description, learning_area: o.learning_area, times: 1, first: e.date, latest: e.date, status: o.status });
      else {
        cur.times++;
        if (e.date && e.date < cur.first) cur.first = e.date;
        if (e.date && e.date >= cur.latest) { cur.latest = e.date; }
        if (o.status === "shown") cur.status = "shown";
      }
    }
  }
  for (const o of outcomes.values()) {
    const a = areas.get(o.learning_area);
    if (a) o.status === "shown" ? a.outcomes_shown++ : a.outcomes_working_towards++;
  }
  const areaList = [...areas.values()].sort((x, y) => Number(y.expected) - Number(x.expected) || (expected.indexOf(x.learning_area) - expected.indexOf(y.learning_area)) || x.learning_area.localeCompare(y.learning_area));
  const outcomeList = [...outcomes.values()].sort((x, y) => x.learning_area.localeCompare(y.learning_area) || x.code.localeCompare(y.code));
  return {
    areas: areaList,
    outcomes: outcomeList,
    not_yet_evidenced: areaList.filter((a) => a.expected && a.entries === 0).map((a) => a.learning_area),
  };
}

async function filesFor(db: DB, familyId: string, ids: string[], max: number): Promise<PortfolioFile[]> {
  const out: PortfolioFile[] = [];
  for (const fid of (Array.isArray(ids) ? ids : []).slice(0, max)) {
    if (typeof fid !== "string") continue;
    const f = await db.prepare("SELECT id, original_filename, content_type FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fid, familyId).first();
    if (f) out.push({ id: f.id, name: f.original_filename || "file", content_type: f.content_type || "" });
  }
  return out;
}

export async function buildPortfolio(db: DB, familyId: string, studentId: string, o: { from?: string; to?: string; now?: Date } = {}) {
  const student = await db.prepare("SELECT id, name, stage, year_level, extra FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first();
  if (!student) return null;
  const stage = String(student.stage || "");
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  // No state chosen yet: use the Australian Curriculum (the national framework), never NSW by default.
  const fw: Framework = frameworkFor(jurisdiction) || FRAMEWORKS.ACT;
  const nsw = jurisdiction === "NSW";
  const expectedAreas = nsw ? KLAS_BY_STAGE[stage] || KLAS_BY_STAGE.S2 : areasFor(fw, stage);
  const { limits } = await lb.getEntitlement(db, familyId, o.now);
  const from = o.from && /^\d{4}-\d{2}-\d{2}$/.test(o.from) ? o.from : "";
  const to = o.to && /^\d{4}-\d{2}-\d{2}$/.test(o.to) ? o.to : "";
  const toTs = to ? `${to}T23:59:59.999Z` : "";

  const entries: PortfolioEntry[] = [];

  // 1. Lesson work the parent reviewed and approved.
  const { results: subs } = await db.prepare(
    "SELECT s.*, a.lesson_snapshot FROM submissions s JOIN assignments a ON a.id = s.assignment_id WHERE s.family_id = ? AND s.student_id = ? AND s.status IN ('accepted','demonstrated') AND (? = '' OR s.reviewed_at >= ?) AND (? = '' OR s.reviewed_at <= ?) ORDER BY s.reviewed_at ASC LIMIT 500"
  ).bind(familyId, studentId, from, from, toTs, toTs).all();
  for (const r of subs || []) {
    const live = r.lesson_snapshot ? null : await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(r.lesson_id).first();
    const l: any = lb.assignmentLesson({ lesson_snapshot: r.lesson_snapshot }, live) || {};
    const outcomes = json<any[]>(r.outcome_mappings, []).map((m) => outcomeFrom(m, stage)).filter(Boolean) as PortfolioOutcome[];
    // Outcomes the lesson was written for but the parent didn't mark: show them as being worked towards.
    for (const code of Array.isArray(l.outcome_codes) ? l.outcome_codes : []) {
      if (!outcomes.some((x) => x.code === code)) { const x = outcomeFrom({ code, accepted: false }, stage); if (x) outcomes.push(x); }
    }
    entries.push({
      id: r.id, kind: "lesson", date: day(r.reviewed_at) || day(r.submitted_at), title: l.title || "Lesson",
      learning_area: klaFor(l.learning_area || "", outcomes, stage), subject: l.learning_area || "", year_level: l.year_level || "",
      result: r.status === "demonstrated" ? "Skill shown" : "Completed",
      work: r.response_text || "", reflection: r.reflection || "", parent_comment: r.parent_feedback || "", next_step: r.next_step || "",
      duration_minutes: null, location: "", outcomes, files: [],
      _file_ids: json<string[]>(r.file_ids, []), _submitted: day(r.submitted_at),
    } as any);
  }

  // 2. Life learning the parent reviewed.
  const lifeRows = await db.prepare(
    "SELECT * FROM life_evidence WHERE family_id = ? AND student_id = ? AND status IN ('accepted','demonstrated') AND (? = '' OR date >= ?) AND (? = '' OR date <= ?) ORDER BY date ASC LIMIT 500"
  ).bind(familyId, studentId, from, from, to, to).all().then((r: any) => r.results || []).catch(() => [] as any[]);
  for (const r of lifeRows) {
    // Life learning: the parent's review of the whole activity decides (demonstrated = understanding shown).
    const outcomes = json<any[]>(r.accepted_mappings, []).map((m) => outcomeFrom(m, stage, r.status === "demonstrated")).filter(Boolean) as PortfolioOutcome[];
    entries.push({
      id: r.id, kind: "life", date: day(r.date), title: r.title || "Life learning",
      learning_area: klaFor(outcomes[0]?.learning_area || "", outcomes, stage), subject: "", year_level: "",
      result: r.status === "demonstrated" ? "Skill shown" : "Completed",
      work: r.description || "", reflection: "", parent_comment: r.parent_note || "", next_step: "",
      duration_minutes: r.duration_minutes ? Number(r.duration_minutes) : null, location: r.location || "", outcomes, files: [],
      _file_ids: json<string[]>(r.file_ids, []),
    } as any);
  }

  // 3. Evidence the parent recorded themselves. Tolerates a database without migration 0052.
  const noteRows = await pl.listEvidenceNotes(db, familyId, { student_id: studentId, from: from || undefined, to: to || undefined }).catch(() => [] as any[]);
  for (const n of noteRows) {
    entries.push({
      id: n.id, kind: "note", date: day(n.occurred_on), title: n.title, learning_area: normArea(n.learning_area || "", stage) || "Other",
      subject: n.learning_area || "", year_level: "", result: "Recorded by parent", work: n.notes || "", reflection: "", parent_comment: "", next_step: "",
      duration_minutes: null, location: "", outcomes: [], files: [], _file_ids: n.file_ids || [],
    } as any);
  }

  // 4. Reading records added or approved by a parent.
  // Child-written reading suggestions are omitted until a parent approves them.
  // An approved child submission is copied to reading_log with logged_role='parent'.
  // Reading demonstrates engagement and progress but never silently awards
  // curriculum outcomes; parents may record supporting observations separately.
  const reading = await db.prepare(
    "SELECT * FROM reading_log WHERE family_id = ? AND student_id = ? AND logged_role = 'parent' AND (? = '' OR read_date >= ?) AND (? = '' OR read_date <= ?) ORDER BY read_date ASC LIMIT 500"
  ).bind(familyId, studentId, from, from, to, to).all().then((r: any) => r.results || []).catch(() => [] as any[]);
  for (const r of reading) {
    const pages = Number(r.pages_read || r.pages || 0);
    const book = String(r.title || "Reading");
    const details = [
      r.author ? `Author: ${r.author}` : "",
      r.book_type ? `Book type: ${r.book_type}` : "",
      r.reading_mode ? `Reading mode: ${String(r.reading_mode).replace(/_/g, " ")}` : "",
      pages > 0 ? `Pages read: ${pages}` : "",
      r.comprehension_notes ? `Comprehension: ${r.comprehension_notes}` : "",
    ].filter(Boolean).join("\n");
    entries.push({
      id: r.id, kind: "reading", date: day(r.read_date), title: `Reading: ${book}`,
      learning_area: "English", subject: "Reading", year_level: yearLabel(student.year_level, stage),
      result: "Recorded or approved by parent", work: details,
      reflection: String(r.favourite_part || ""), parent_comment: String(r.parent_note || ""), next_step: "",
      duration_minutes: Number(r.duration_minutes) > 0 ? Number(r.duration_minutes) : null,
      location: "", outcomes: [], files: [],
    });
  }

  // Only codes from the family's own verified catalogue are shown (a NSW code means nothing to a Queensland reviewer,
  // and an AC9 code isn't a NSW syllabus outcome). Other codes are dropped, never relabelled; plain-language notes stay.
  const cat = catalogueFor(jurisdiction);
  for (const e of entries) {
    if (!nsw) e.learning_area = toFrameworkArea(e.learning_area === "Other" ? e.subject : e.learning_area, fw, stage);
    for (const o of e.outcomes) {
      if (!nsw) o.learning_area = toFrameworkArea(o.learning_area, fw, stage);
      if (o.code && !(cat.available && cat.byCode.has(o.code))) o.code = "";
    }
    e.outcomes = e.outcomes.filter((o) => o.code || o.description);
  }
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const total = entries.length;
  // The summary always reflects everything, so the free preview shows what the full record looks like;
  // only the detailed entries are limited to a single sample.
  const summary = summarise(entries, stage, expectedAreas);
  // The Outcome Tracker is the record of mastery. Its status is attached so the Backpack and the tracker never disagree:
  // a review mark ("achieved" in this work) is evidence, while "Achieved" for the outcome needs the parent's confirmation.
  // The all-time snapshot (as at today) comes straight from the tracker, which keeps itself up to date from reviews.
  const tracker: any = await trackerFor(db, familyId, studentId, { now: o.now }).catch(() => null);
  if (tracker?.available) {
    const byCode = new Map<string, any>(tracker.outcomes.map((x: any) => [x.code, x]));
    for (const so of summary.outcomes as any[]) {
      const t: any = so.code ? byCode.get(so.code) : null;
      so.mastery = t ? t.status : null;
      so.mastery_confirmed = !!t?.parent_confirmed_at;
    }
  }
  const progress = progressSnapshot(tracker, nsw ? null : fw, stage, o.now || new Date());
  const shown = limits.fullExports ? entries : entries.slice(-1);
  for (const e of shown as any[]) { e.files = await filesFor(db, familyId, e._file_ids, 20); }
  for (const e of entries as any[]) { delete e._file_ids; delete e._submitted; }

  const parentRow = await db.prepare("SELECT u.name FROM users u JOIN families f ON f.owner_id = u.id WHERE f.id = ?").bind(familyId).first().catch(() => null);
  const extra = json<any>(student.extra, {});
  const dates = entries.map((e) => e.date).filter(Boolean);
  return {
    student: { id: student.id, name: student.name, stage, stage_name: nsw ? extra.stage_name || STAGE_NAMES[stage] || stage : "", year_level: nsw ? student.year_level || "" : yearLabel(student.year_level, stage) },
    parent_name: parentRow?.name || "",
    jurisdiction: jurisdiction || null,
    jurisdiction_name: jurisdiction ? fw.jurisdiction_name : null,
    framework: nsw ? "NSW syllabuses (NESA)" : fw.name,
    curriculum_source: jurisdiction ? { name: nsw ? "NSW Curriculum (NESA)" : fw.name, url: fw.url } : null,
    progress,
    from: from || null, to: to || null,
    first_entry: dates[0] || null, last_entry: dates[dates.length - 1] || null,
    expected_areas: expectedAreas,
    summary,
    entries: shown,
    total,
    limited: !limits.fullExports && total > shown.length,
    generated_at: (o.now || new Date()).toISOString(),
  };
}

const NEEDS_EVIDENCE_GAPS = ["limited_evidence", "not_revisited", "needs_consolidation", "confirmed_evidence_changed"];

/**
 * Outcome Tracker snapshot for the printable record: per learning area, how many of the child's stage outcomes are at
 * each status, and where more evidence is needed. All-time and as at the date generated, unlike the dated entries,
 * which cover only the reporting period. Codes only, never outcome wording.
 */
export function progressSnapshot(tracker: any, fw: Framework | null, stage: string, now: Date) {
  const as_at = now.toISOString().slice(0, 10);
  if (!tracker) return { available: false, as_at, note: "The Outcome Tracker could not be read.", areas: [], totals: null, needs_evidence: [], beyond_stage: 0 };
  if (!tracker.available) return { available: false, as_at, note: tracker.note, framework: tracker.framework?.name || null, areas: [], totals: null, needs_evidence: [], beyond_stage: 0 };
  const zero = () => Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<string, number>;
  const areas = new Map<string, { learning_area: string; total: number; counts: Record<string, number>; with_evidence: number; awaiting_confirmation: number }>();
  const totals = { total: 0, counts: zero(), with_evidence: 0, awaiting_confirmation: 0 };
  const needs: { code: string; learning_area: string; status: string; gaps: string[] }[] = [];
  let beyond = 0;
  for (const x of tracker.outcomes as any[]) {
    if (!x.in_stage) { if (x.evidence_count > 0) beyond++; continue; }
    const area = fw ? toFrameworkArea(x.learning_area, fw, stage) : x.learning_area;
    const a = areas.get(area) || { learning_area: area, total: 0, counts: zero(), with_evidence: 0, awaiting_confirmation: 0 };
    a.total++; a.counts[x.status]++; totals.total++; totals.counts[x.status]++;
    if (x.evidence_count > 0) { a.with_evidence++; totals.with_evidence++; }
    if (x.gaps.includes("awaiting_confirmation")) { a.awaiting_confirmation++; totals.awaiting_confirmation++; }
    areas.set(area, a);
    const g = (x.gaps as string[]).filter((k) => NEEDS_EVIDENCE_GAPS.includes(k));
    if (x.evidence_count > 0 && g.length && x.status !== "achieved") needs.push({ code: x.code, learning_area: area, status: x.status, gaps: g });
  }
  return {
    available: true,
    as_at,
    framework: tracker.framework?.name || null,
    note: tracker.note,
    status_labels: STATUS_LABELS,
    gap_labels: GAP_LABELS,
    areas: [...areas.values()].sort((x, y) => x.learning_area.localeCompare(y.learning_area)),
    totals,
    needs_evidence: needs.sort((x, y) => x.learning_area.localeCompare(y.learning_area) || x.code.localeCompare(y.code)).slice(0, 200),
    beyond_stage: beyond,
  };
}
