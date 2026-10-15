// Curriculum Outcome & Mastery Tracker.
//
// One record per child per curriculum outcome, built from evidence that already exists elsewhere in Side-Quest
// (reviewed lesson work, quiz attempts, reviewed life learning, Evidence Backpack notes and parent observations).
// Evidence is LINKED by source, never copied, and every status change is logged with its reason.
//
// Ground rules (see docs/OUTCOME-TRACKER.md):
// - Completing a lesson never makes an outcome Achieved. Only a parent's confirmation does.
// - The system can move an outcome up to Demonstrated, and only on parent-reviewed evidence of understanding.
//   Auto-marked quizzes count as practice; AI suggestions are never evidence.
// - A parent's confirmation is never removed automatically. If its evidence later changes, it is flagged instead.
// - Outcomes come only from a verified catalogue for the family's state or territory. Where Side-Quest has no
//   verified list (every jurisdiction except NSW today), the tracker says so instead of inventing outcomes.
import { NSW_OUTCOMES, NSW_LA_LINKS, NSW_SOURCE_LINKS } from "./data/curriculum";
import { NSW_OUTCOMES_SEED_VERSION } from "./data/nsw-outcomes";
import { AC9_OUTCOMES } from "./data/ac9-outcomes";
import { FRAMEWORKS, getFamilyJurisdiction, yearLabel, type JurisdictionCode } from "./data/jurisdictions";
import type { App, Guards } from "./types";

type DB = any;

// ---------------------------------------------------------------- catalogue (which outcomes exist)

export type CatalogueOutcome = { code: string; description: string; learning_area: string; stage: string; source: string; subject?: string; strand?: string; from?: number; to?: number };
export type Catalogue = {
  available: true;
  framework: string; // key stored on every record, e.g. "NSW"
  name: string;
  version: string;
  outcomes: CatalogueOutcome[];
  byCode: Map<string, CatalogueOutcome>;
};
export type NoCatalogue = { available: false; framework: string | null; name: string | null; note: string };

const STAGE_LABEL: Record<string, string> = { ES1: "Early Stage 1", S1: "Stage 1", S2: "Stage 2", S3: "Stage 3", S4: "Stage 4", S5: "Stage 5", S6: "Stage 6" };
const AC9_URL = "https://v9.australiancurriculum.edu.au/";

/**
 * Context shown beside an outcome code instead of its (copyright) wording: the syllabus or subject it comes from, its
 * strand and level, and where to read the official wording. All structural facts, never outcome text.
 */
export function outcomeInfo(o: CatalogueOutcome | undefined | null) {
  if (!o) return { source_title: "", strand: "", level_label: "", official_url: "" };
  if (o.from != null) {
    const level = o.from === o.to ? (o.from === 0 ? "Foundation" : `Year ${o.from}`) : `Years ${o.from === 0 ? "F" : o.from}–${o.to}`;
    return { source_title: `Australian Curriculum v9 · ${String(o.subject || o.learning_area).replace(/ (F-6|7-10)$/, "")}`, strand: (o as any).strand || "", level_label: level, official_url: AC9_URL };
  }
  const url = (NSW_LA_LINKS as Record<string, string>)[o.learning_area] || (NSW_SOURCE_LINKS as Record<string, { url: string }>)[o.stage]?.url || "https://curriculum.nsw.edu.au/";
  return { source_title: o.source || "NSW syllabus (NESA)", strand: "", level_label: STAGE_LABEL[o.stage] || o.stage, official_url: url };
}

const NSW_CATALOGUE: Catalogue = {
  available: true,
  framework: "NSW",
  name: "NSW syllabuses (NESA)",
  version: `nsw-seed-v${NSW_OUTCOMES_SEED_VERSION}`,
  outcomes: NSW_OUTCOMES.map((o) => ({ code: o.code, description: "", learning_area: o.learning_area, stage: o.stage, source: o.source })),
  byCode: new Map(NSW_OUTCOMES.map((o) => [o.code, { code: o.code, description: "", learning_area: o.learning_area, stage: o.stage, source: o.source }])),
};

/**
 * Australian Curriculum v9 reference catalogue (not jurisdictional compliance certification).
 * ACARA publishes core curriculum descriptions under CC BY 4.0; sourced from
 * the reviewed MRAC/2024/04 export. The imported list excludes Languages.
 * States/territories can vary by implementation dates and local requirements.
 */
const ac9Rows: CatalogueOutcome[] = AC9_OUTCOMES.map(o => {
  const stageNumber = o.to === 0 ? 0 : Math.ceil(o.to / 2);
  const stage = stageNumber === 0 ? "ES1" : "S" + stageNumber;
  return {
    code: o.code,
    description: "",
    learning_area: o.learning_area,
    stage,
    subject: o.subject,
    strand: o.strand,
    from: o.from,
    to: o.to,
    source: "ACARA Australian Curriculum v9.0 content description (CC BY 4.0; MRAC/2024/04)",
  };
});
const AC9_CATALOGUE: Catalogue = {
  available: true,
  framework: "AC9",
  name: "Australian Curriculum v9 reference — partial, not jurisdictional compliance",
  version: "AC9-MRAC-2024-04-partial-no-languages",
  outcomes: ac9Rows,
  byCode: new Map(ac9Rows.map(o => [o.code, o])),
};
/** AC9 is a reference list for these jurisdictions, NOT a declaration of complete official compliance. */
const CATALOGUES: Partial<Record<JurisdictionCode, Catalogue>> = {
  NSW: NSW_CATALOGUE,
  QLD: AC9_CATALOGUE,
  SA: AC9_CATALOGUE,
  TAS: AC9_CATALOGUE,
  ACT: AC9_CATALOGUE,
  NT: AC9_CATALOGUE,
};

export function catalogueFor(jurisdiction: JurisdictionCode | null): Catalogue | NoCatalogue {
  if (!jurisdiction) {
    return { available: false, framework: null, name: null, note: "Choose your state or territory first, so the tracker can follow the right curriculum." };
  }
  const cat = CATALOGUES[jurisdiction];
  if (cat) return cat;
  const fw = FRAMEWORKS[jurisdiction];
  return {
    available: false,
    framework: jurisdiction,
    name: fw.name,
    note: `Side-Quest does not hold a verified outcome list for the ${fw.name} yet, so the outcome tracker is not available for ${fw.jurisdiction_name} families. We will not show outcomes we cannot verify. Your lesson work, life learning and notes are still kept in the Evidence Backpack.`,
  };
}

/** Outcome codes any tracker source may refer to (only verified codes are ever recorded). */
const ALL_KNOWN = new Map<string, { framework: string; outcome: CatalogueOutcome }>();
for (const cat of Object.values(CATALOGUES)) for (const o of cat!.outcomes) ALL_KNOWN.set(o.code, { framework: cat!.framework, outcome: o });
const knownCode = (code: unknown) => ALL_KNOWN.get(String(code ?? "").trim()) || null;

// ---------------------------------------------------------------- the child's program (what they will cover)

/**
 * Which catalogue outcomes a child is covering, from what the parent set on the child's profile:
 * - level: the year level (AC9 content descriptions are per year or band, so a Year 3 child isn't given Year 4
 *   content), else the stage; a per-subject level in `subject_levels` overrides it for that learning area;
 * - subjects: for Years 7-12 the courses chosen when the child was added (compulsory core, HSIE pathway, electives).
 *   Only their learning areas count, narrowed to the matching AC9 subject (e.g. Music, History) where there is one.
 *   Primary-age children, and children with no courses saved, cover every learning area for their level.
 * Outcomes outside the program are never hidden when they have evidence; they're listed as "other outcomes".
 */
export type Program = {
  level: string;
  stage: string;
  year: number | null;
  areas: string[] | null; // null = every learning area
  courses: { name: string; learning_area: string }[];
  includes: (o: CatalogueOutcome) => boolean;
  /** The child's subject an outcome belongs to (a chosen course's name, or the learning area for primary). */
  subjectOf: (o: CatalogueOutcome) => string | null;
  /** Subjects in the order the parent chose them (learning areas for primary). */
  subjects: string[];
};

const yearOf = (y: unknown): number | null => {
  const s = String(y ?? "").trim();
  if (!s) return null;
  if (/^(k|kindy|kinder|kindergarten|foundation|prep|reception|transition|pre-?primary)$/i.test(s)) return 0;
  const m = /(\d{1,2})/.exec(s);
  return m ? Number(m[1]) : null;
};
const STAGE_YEARS: Record<string, [number, number]> = { ES1: [0, 0], S1: [1, 2], S2: [3, 4], S3: [5, 6], S4: [7, 8], S5: [9, 10], S6: [11, 12] };
const stageOfYear = (y: number) => Object.entries(STAGE_YEARS).find(([, [a, b]]) => y >= a && y <= b)?.[0] || "";

// Course learning areas (as saved on the child) -> catalogue learning areas.
const NSW_AREA: Record<string, string> = { Technology: "TAS", Technologies: "TAS" };
const AC9_AREA: Record<string, string> = {
  English: "English", Mathematics: "Mathematics", Science: "Science", HSIE: "Humanities and Social Sciences",
  PDHPE: "Health and Physical Education", "Creative Arts": "The Arts", TAS: "Technologies", Technology: "Technologies", Technologies: "Technologies",
};
// A course name that names a specific subject is narrowed to it: AC9 by subject, NSW by the syllabus the outcome
// comes from. A broad course name ("Technology", "HSIE") covers its whole learning area.
const SUBJECT_KEYS: RegExp[] = [/histor/i, /geograph/i, /commerce|business|econom/i, /civic/i, /aboriginal/i, /music/i, /drama/i, /dance/i,
  /visual art/i, /media/i, /software|information|digital|computing|coding/i, /food|textile|design|industrial|agricultur|graphic|engineer/i, /physical activity|sport/i];
const AC9_KEY_SUBJECT: [RegExp, string][] = [[/software|information|digital|computing|coding/i, "digital technologies"], [/food|textile|design|industrial|agricultur|graphic|engineer/i, "design and technologies"]];
/** AC9 Languages are distinct subjects/pathways: a child's chosen language must not silently match every language.
 * A broad "Languages" course can intentionally cover the area; a named subject must match its official subject.
 * Unknown named languages return no outcomes until their verified source identifiers are imported.
 */
const LANGUAGE_NAMES = ["Arabic", "Auslan", "Chinese", "Classical Greek", "French", "German", "Hindi",
  "Indonesian", "Italian", "Japanese", "Korean", "Latin", "Modern Greek", "Spanish", "Turkish",
  "Vietnamese", "Aboriginal Languages", "Torres Strait Islander Languages", "Classical Languages"];
const languageSubject = (name: string) => {
  const lower = name.trim().toLowerCase();
  return LANGUAGE_NAMES.find((x) => x.toLowerCase() === lower || lower.startsWith(x.toLowerCase() + " ")) || null;
};
const broadLanguages = (name: string) => /^(languages?|foreign languages?|language studies)$/i.test(name.trim());

export function programFor(cat: Catalogue, student: { stage?: string | null; year_level?: string | null; extra?: unknown }): Program {
  const extra = json<any>(student.extra, {}) || {};
  const stage = String(student.stage || "");
  const year = yearOf(student.year_level);
  const levels: Record<string, string> = extra.subject_levels && typeof extra.subject_levels === "object" ? extra.subject_levels : {};
  const courses = (Array.isArray(extra.electives) ? extra.electives : [])
    .filter((c: any) => c && typeof c === "object" && (c.name || c.learning_area))
    .map((c: any) => ({ name: clip(c.name, 120), learning_area: clip(c.learning_area, 80) }));
  const ac9 = cat.framework === "AC9";
  const toArea = (a: string) => (ac9 ? AC9_AREA[a] || a : NSW_AREA[a] || a);
  const levelFor = (area: string) => {
    const l = levels[area];
    if (!l) return { stage, year };
    const y = yearOf(l);
    return STAGE_YEARS[l] ? { stage: l, year: null } : y != null ? { stage: stageOfYear(y), year: y } : { stage, year };
  };
  const atLevel = (o: CatalogueOutcome) => {
    const lv = levelFor(o.learning_area);
    if (ac9 && lv.year != null && o.from != null && o.to != null) return lv.year >= o.from && lv.year <= o.to;
    return o.stage === lv.stage;
  };
  // What an outcome's own subject text is: AC9 subject ("History 7-10"), NSW syllabus ("NSW History 7-10 Syllabus").
  const subjectText = (o: CatalogueOutcome) => (ac9 ? o.subject || "" : o.source || "");
  const matchers = courses.map((c: { name: string; learning_area: string }) => {
    const area = toArea(c.learning_area);
    // Several keywords ("Creative Arts (Visual Arts + Music)") or none = the whole area.
    const keys = SUBJECT_KEYS.filter((re) => re.test(c.name));
    const key = keys.length === 1 ? keys[0] : null;
    const ac9Name = ac9 && key ? AC9_KEY_SUBJECT.find(([re]) => re.test(c.name))?.[1] : undefined;
    const language = ac9 && area === "Languages" ? languageSubject(c.name) : null;
    const namedLanguageUnmapped = ac9 && area === "Languages" && !language && !broadLanguages(c.name);
    return {
      name: c.name,
      test: (o: CatalogueOutcome) => {
        if (o.learning_area !== area) return false;
        if (area === "Languages" && ac9) {
          if (namedLanguageUnmapped) return false;
          return !language || subjectText(o).toLowerCase().includes(language.toLowerCase());
        }
        return !key || (ac9Name ? subjectText(o).toLowerCase() === ac9Name : key.test(subjectText(o)));
      },
    };
  });
  const subjectOf = (o: CatalogueOutcome) => {
    if (!atLevel(o)) return null;
    if (!matchers.length) return o.learning_area;
    return matchers.find((m: { test: (o: CatalogueOutcome) => boolean }) => m.test(o))?.name || null;
  };
  const includes = (o: CatalogueOutcome) => subjectOf(o) != null;
  const areas = courses.length ? [...new Set<string>(courses.map((c: { learning_area: string }) => toArea(c.learning_area)))] : null;
  const subjects = courses.length ? courses.map((c: { name: string }) => c.name) : [...new Set(cat.outcomes.filter(atLevel).map((o) => o.learning_area))];
  const yl = yearLabel(student.year_level, stage);
  return { level: yl || stage, stage, year, areas, courses, includes, subjectOf, subjects };
}

// ---------------------------------------------------------------- mastery rules

export const STATUSES = ["not_started", "introduced", "developing", "demonstrated", "achieved"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABELS: Record<Status, string> = {
  not_started: "Not Started", introduced: "Introduced", developing: "Developing", demonstrated: "Demonstrated", achieved: "Achieved",
};
const rank = (s: string) => Math.max(0, STATUSES.indexOf(s as Status));

export type Level = "participation" | "practice" | "demonstrated";
export type Support = "independent" | "some" | "significant";
const LEVELS: Level[] = ["participation", "practice", "demonstrated"];
const SUPPORTS: Support[] = ["independent", "some", "significant"];
export const SUPPORT_LABELS: Record<Support, string> = { independent: "Independently", some: "With some help", significant: "With a lot of help" };

export type MasteryRules = {
  /** Pieces of meaningful (demonstrated) evidence needed before an outcome can be Demonstrated. */
  min_evidence: number;
  /** Separate occasions (days) that evidence must come from ("more than one opportunity"). */
  min_occasions: number;
  /** A parent-flagged comprehensive assessment can stand in for the evidence and occasion counts. */
  comprehensive_counts: boolean;
  /** Demonstrations done with a lot of help count as meaningful (on for children with documented adjustments). */
  significant_support_counts: boolean;
  /** An outcome seen only once, longer ago than this, is flagged "not revisited". */
  revisit_after_days: number;
};

/** Platform guidelines, not curriculum-authority thresholds. */
export const DEFAULT_RULES: MasteryRules = { min_evidence: 2, min_occasions: 2, comprehensive_counts: true, significant_support_counts: false, revisit_after_days: 28 };

/**
 * Refinements by framework, learning area or outcome code prefix (a stand-in for outcome type). Later entries win.
 * Empty by default: add entries here (with a reason) rather than changing DEFAULT_RULES for everyone.
 */
export const RULE_OVERRIDES: { framework?: string; learning_area?: string; code_prefix?: string; rules: Partial<MasteryRules>; why: string }[] = [];

export type LearnerSupport = { documented_adjustments?: boolean; note?: string };

export function resolveRules(o: { framework: string; learning_area?: string | null; code: string }, learner: LearnerSupport = {}, overrides = RULE_OVERRIDES): MasteryRules {
  let r: MasteryRules = { ...DEFAULT_RULES };
  for (const x of overrides) {
    if (x.framework && x.framework !== o.framework) continue;
    if (x.learning_area && x.learning_area !== o.learning_area) continue;
    if (x.code_prefix && !o.code.startsWith(x.code_prefix)) continue;
    r = { ...r, ...x.rules };
  }
  // Learner needs: documented adjustments mean well-supported demonstrations are real evidence for this child.
  if (learner.documented_adjustments) r.significant_support_counts = true;
  return r;
}

export type EvidenceRow = {
  id: string;
  source_type: string;
  source_id: string;
  level: Level;
  support: Support | null;
  consolidate: number | boolean;
  comprehensive: number | boolean;
  occurred_on: string;
  removed_at?: string | null;
  excluded_at?: string | null;
  created_at?: string;
};

export type GapKind = "not_introduced" | "not_revisited" | "limited_evidence" | "needs_consolidation" | "awaiting_confirmation" | "confirmed_evidence_changed";
export const GAP_LABELS: Record<GapKind, string> = {
  not_introduced: "Not introduced yet",
  not_revisited: "Introduced but not revisited",
  limited_evidence: "Limited evidence so far",
  needs_consolidation: "Needs more consolidation",
  awaiting_confirmation: "Demonstrated: waiting for your confirmation",
  confirmed_evidence_changed: "Confirmed, but its evidence has changed",
};

const active = (e: EvidenceRow) => !e.removed_at && !e.excluded_at;
const daysBetween = (a: string, b: string) => Math.floor((Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / 86400000);

/** Pure rule evaluation. Never returns "achieved": only a parent confirmation can do that. */
export function evaluate(evidence: EvidenceRow[], rules: MasteryRules, opts: { confirmed?: boolean; now?: Date } = {}) {
  const today = (opts.now || new Date()).toISOString().slice(0, 10);
  const live = evidence.filter(active).sort((a, b) => a.occurred_on.localeCompare(b.occurred_on) || String(a.created_at || "").localeCompare(String(b.created_at || "")));
  const meaningful = live.filter((e) => e.level === "demonstrated" && (e.support !== "significant" || rules.significant_support_counts));
  const occasions = new Set(meaningful.map((e) => e.occurred_on)).size;
  const comprehensive = rules.comprehensive_counts && meaningful.some((e) => !!e.comprehensive);
  const allOccasions = new Set(live.map((e) => e.occurred_on)).size;
  const supportedOnly = live.some((e) => e.level === "demonstrated" && e.support === "significant") && !rules.significant_support_counts;

  let status: Status;
  let reason: string;
  if (!live.length) {
    status = "not_started";
    reason = "No learning evidence yet.";
  } else if (comprehensive) {
    status = "demonstrated";
    reason = "A comprehensive assessment showed this outcome.";
  } else if (meaningful.length >= rules.min_evidence && occasions >= rules.min_occasions) {
    status = "demonstrated";
    reason = `Understanding shown in ${meaningful.length} pieces of reviewed work on ${occasions} separate days.`;
  } else if (live.some((e) => e.level !== "participation") || live.length >= 2) {
    status = "developing";
    const need = [
      meaningful.length < rules.min_evidence ? `${rules.min_evidence - meaningful.length} more piece${rules.min_evidence - meaningful.length === 1 ? "" : "s"} of work showing understanding` : "",
      meaningful.length >= rules.min_evidence && occasions < rules.min_occasions ? "evidence from another day" : "",
    ].filter(Boolean).join(" and ");
    reason = `Practised in ${live.length} learning experience${live.length === 1 ? "" : "s"}${need ? `; needs ${need} to reach Demonstrated` : ""}.${supportedOnly ? " Work done with a lot of help is recorded but does not count towards Demonstrated unless the child has documented adjustments." : ""}`;
  } else {
    status = "introduced";
    reason = "Met in a learning experience, not yet reviewed as practice or understanding.";
  }

  const gaps: GapKind[] = [];
  const latest = live[live.length - 1];
  if (!live.length) gaps.push("not_introduced");
  else {
    if (status !== "demonstrated" && allOccasions === 1 && daysBetween(latest.occurred_on, today) >= rules.revisit_after_days) gaps.push("not_revisited");
    if (status !== "demonstrated" && meaningful.length < rules.min_evidence) gaps.push("limited_evidence");
    if (latest && !!latest.consolidate) gaps.push("needs_consolidation");
  }
  if (status === "demonstrated" && !opts.confirmed) gaps.push("awaiting_confirmation");
  if (opts.confirmed && status !== "demonstrated") gaps.push("confirmed_evidence_changed");

  return {
    computed: status,
    status: (opts.confirmed ? "achieved" : status) as Status,
    reason,
    gaps,
    counts: { evidence: live.length, meaningful: meaningful.length, occasions, all_occasions: allOccasions },
    first_on: live[0]?.occurred_on || null,
    last_on: latest?.occurred_on || null,
    criteria: [
      { key: "evidence", label: `At least ${rules.min_evidence} pieces of reviewed work showing understanding${rules.comprehensive_counts ? " (or one comprehensive assessment)" : ""}`, met: meaningful.length >= rules.min_evidence || comprehensive },
      { key: "occasions", label: `Shown on at least ${rules.min_occasions} separate days`, met: occasions >= rules.min_occasions || comprehensive },
      { key: "independence", label: rules.significant_support_counts ? "Support recorded (documented adjustments apply)" : "Done independently or with some help", met: meaningful.length > 0 },
      { key: "parent", label: "Confirmed by you", met: !!opts.confirmed },
    ],
  };
}

// ---------------------------------------------------------------- storage

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS outcome_evidence (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, framework TEXT NOT NULL, outcome_code TEXT NOT NULL, source_type TEXT NOT NULL, source_id TEXT NOT NULL, lesson_id TEXT, assignment_id TEXT, origin TEXT, level TEXT NOT NULL, support TEXT, consolidate INTEGER NOT NULL DEFAULT 0, comprehensive INTEGER NOT NULL DEFAULT 0, score INTEGER, total INTEGER, summary TEXT, note TEXT, file_ids TEXT NOT NULL DEFAULT '[]', occurred_on TEXT NOT NULL, created_by TEXT, created_at TEXT NOT NULL, updated_at TEXT, removed_at TEXT, removed_reason TEXT, excluded_at TEXT, excluded_reason TEXT, UNIQUE (student_id, framework, outcome_code, source_type, source_id))`,
  `CREATE TABLE IF NOT EXISTS outcome_progress (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, framework TEXT NOT NULL, outcome_code TEXT NOT NULL, learning_area TEXT, stage TEXT, description TEXT, catalogue_version TEXT, computed_status TEXT NOT NULL DEFAULT 'not_started', status TEXT NOT NULL DEFAULT 'not_started', status_reason TEXT, evidence_count INTEGER NOT NULL DEFAULT 0, first_evidence_on TEXT, last_evidence_on TEXT, parent_confirmed_at TEXT, parent_confirmed_by TEXT, confirmation_note TEXT, updated_at TEXT NOT NULL, UNIQUE (student_id, framework, outcome_code))`,
  `CREATE TABLE IF NOT EXISTS outcome_status_history (id TEXT PRIMARY KEY, family_id TEXT NOT NULL, student_id TEXT NOT NULL, framework TEXT NOT NULL, outcome_code TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL, computed_status TEXT, reason TEXT NOT NULL, actor TEXT NOT NULL, actor_id TEXT, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_evidence_student ON outcome_evidence (family_id, student_id, framework, outcome_code)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_evidence_source ON outcome_evidence (family_id, source_type, source_id)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_progress_student ON outcome_progress (family_id, student_id, framework)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_history_student ON outcome_status_history (family_id, student_id, framework, outcome_code, created_at)`,
];
export const TRACKER_SCHEMA = SCHEMA;

const ready = new WeakSet<object>();
/** Deploys don't run migrations, so the tables are created here too if migration 0057 hasn't been applied. */
export async function ensureTracker(db: DB) {
  if (ready.has(db)) return;
  for (const sql of SCHEMA) await db.prepare(sql).run();
  ready.add(db);
}

const newId = () => crypto.randomUUID();
const day = (s: unknown) => (typeof s === "string" && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : "");
const json = <T,>(s: unknown, d: T): T => { try { return typeof s === "string" ? JSON.parse(s) : (s as T) ?? d; } catch { return d; } };
const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

type Contribution = {
  framework: string; code: string; source_type: string; source_id: string;
  lesson_id?: string | null; assignment_id?: string | null; origin?: string | null;
  level: Level; support: Support | null; consolidate: boolean; comprehensive?: boolean;
  score?: number | null; total?: number | null; summary: string; note?: string | null; file_ids?: string[]; occurred_on: string; created_by?: string | null;
};

type Touched = Set<string>; // `${framework}|${code}`

/** Insert or refresh one piece of evidence. A parent's exclusion is never undone here. */
async function upsertEvidence(db: DB, familyId: string, studentId: string, c: Contribution, now: string, touched: Touched) {
  await db.prepare(
    `INSERT INTO outcome_evidence (id, family_id, student_id, framework, outcome_code, source_type, source_id, lesson_id, assignment_id, origin, level, support, consolidate, comprehensive, score, total, summary, note, file_ids, occurred_on, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (student_id, framework, outcome_code, source_type, source_id) DO UPDATE SET
       lesson_id = excluded.lesson_id, assignment_id = excluded.assignment_id, origin = excluded.origin, level = excluded.level,
       support = excluded.support, consolidate = excluded.consolidate, comprehensive = excluded.comprehensive, score = excluded.score,
       total = excluded.total, summary = excluded.summary, note = excluded.note, file_ids = excluded.file_ids, occurred_on = excluded.occurred_on,
       updated_at = excluded.updated_at, removed_at = NULL, removed_reason = NULL
     WHERE outcome_evidence.family_id = excluded.family_id`
  ).bind(
    newId(), familyId, studentId, c.framework, c.code, c.source_type, c.source_id, c.lesson_id ?? null, c.assignment_id ?? null, c.origin ?? null,
    c.level, c.support, c.consolidate ? 1 : 0, c.comprehensive ? 1 : 0, c.score ?? null, c.total ?? null, clip(c.summary, 500), c.note ? clip(c.note, 4000) : null,
    JSON.stringify(c.file_ids || []), c.occurred_on, c.created_by ?? null, now, now,
  ).run();
  touched.add(`${c.framework}|${c.code}`);
}

/** Marks evidence from a source as no longer counting (kept for history), except codes still mapped. */
async function retireSource(db: DB, familyId: string, sourceType: string, sourceId: string, keep: Set<string>, reason: string, now: string, touched: Touched) {
  const { results } = await db.prepare("SELECT id, framework, outcome_code FROM outcome_evidence WHERE family_id = ? AND source_type = ? AND source_id = ? AND removed_at IS NULL")
    .bind(familyId, sourceType, sourceId).all();
  for (const r of results || []) {
    if (keep.has(`${r.framework}|${r.outcome_code}`)) continue;
    await db.prepare("UPDATE outcome_evidence SET removed_at = ?, removed_reason = ?, updated_at = ? WHERE id = ?").bind(now, reason, now, r.id).run();
    touched.add(`${r.framework}|${r.outcome_code}`);
  }
}

async function learnerSupport(db: DB, familyId: string, studentId: string): Promise<LearnerSupport> {
  const s = await db.prepare("SELECT extra FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first();
  const x = json<any>(s?.extra, {})?.outcome_support;
  return x && typeof x === "object" ? { documented_adjustments: !!x.documented_adjustments, note: clip(x.note, 500) } : {};
}

/** Re-evaluates one outcome for one child and logs any status change. */
export async function recompute(db: DB, familyId: string, studentId: string, framework: string, code: string, o: { now?: Date; actor?: string; actorId?: string | null; reason?: string; learner?: LearnerSupport } = {}) {
  const now = o.now || new Date();
  const ts = now.toISOString();
  const known = knownCode(code);
  const existing = await db.prepare("SELECT * FROM outcome_progress WHERE student_id = ? AND framework = ? AND outcome_code = ? AND family_id = ?").bind(studentId, framework, code, familyId).first();
  const { results } = await db.prepare("SELECT * FROM outcome_evidence WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ?").bind(familyId, studentId, framework, code).all();
  const evidence = (results || []) as EvidenceRow[];
  if (!existing && !evidence.length) return null;
  const learner = o.learner || (await learnerSupport(db, familyId, studentId));
  const area = existing?.learning_area || known?.outcome.learning_area || null;
  const rules = resolveRules({ framework, learning_area: area, code }, learner);
  const confirmed = !!existing?.parent_confirmed_at;
  const ev = evaluate(evidence, rules, { confirmed, now });
  const from = existing?.status || "not_started";
  const fromComputed = existing?.computed_status || "not_started";
  if (!existing) {
    await db.prepare(
      "INSERT INTO outcome_progress (id, family_id, student_id, framework, outcome_code, learning_area, stage, description, catalogue_version, computed_status, status, status_reason, evidence_count, first_evidence_on, last_evidence_on, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(newId(), familyId, studentId, framework, code, area, known?.outcome.stage || null, known?.outcome.description || null,
      CATALOGUES[framework as JurisdictionCode]?.version || null, ev.computed, ev.status, o.reason || ev.reason, ev.counts.evidence, ev.first_on, ev.last_on, ts).run();
  } else {
    const changed = from !== ev.status || fromComputed !== ev.computed;
    await db.prepare("UPDATE outcome_progress SET computed_status = ?, status = ?, status_reason = CASE WHEN ? THEN ? ELSE status_reason END, evidence_count = ?, first_evidence_on = ?, last_evidence_on = ?, updated_at = ? WHERE id = ?")
      .bind(ev.computed, ev.status, changed ? 1 : 0, o.reason || ev.reason, ev.counts.evidence, ev.first_on, ev.last_on, ts, existing.id).run();
  }
  if (from !== ev.status || fromComputed !== ev.computed) {
    let reason = o.reason || ev.reason;
    if (confirmed && fromComputed === "demonstrated" && ev.computed !== "demonstrated") {
      reason = `Your confirmation is kept, but the supporting evidence changed (now ${STATUS_LABELS[ev.computed]}). ${ev.reason}`;
    }
    await db.prepare("INSERT INTO outcome_status_history (id, family_id, student_id, framework, outcome_code, from_status, to_status, computed_status, reason, actor, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newId(), familyId, studentId, framework, code, from, ev.status, ev.computed, reason, o.actor || "system", o.actorId ?? null, ts).run();
  }
  return ev;
}

async function recomputeAll(db: DB, familyId: string, studentId: string, touched: Touched, now: Date, reason?: string) {
  if (!touched.size) return;
  const learner = await learnerSupport(db, familyId, studentId);
  for (const key of touched) {
    const [framework, code] = key.split("|");
    await recompute(db, familyId, studentId, framework, code, { now, learner, reason });
  }
}

// ---------------------------------------------------------------- evidence sources

const SUPPORT_FROM_ASSIGNMENT: Record<string, Support> = { green: "independent", yellow: "some", amber: "some", red: "significant" };
const asSupport = (v: unknown): Support | null => (SUPPORTS.includes(v as Support) ? (v as Support) : null);
const asLevel = (v: unknown): Level | null => (LEVELS.includes(v as Level) ? (v as Level) : null);

function lessonOf(a: any): any {
  return json<any>(a?.lesson_snapshot, null) || {};
}
const originOf = (l: any) => (l?.source === "ai" || l?.ai_generated ? "ai" : "manual");

/**
 * Per-outcome judgement saved with a lesson review. New reviews send `mark` ("shown" | "practising" | "not_yet") and
 * `support`; older reviews only sent `accepted`. The review status still decides the overall outcome of the work.
 */
export function levelFromReview(status: string, m: any): { level: Level; consolidate: boolean; comprehensive: boolean } {
  if (status === "needs_revision") return { level: "participation", consolidate: true, comprehensive: false };
  if (status === "needs_more_practice") return { level: "practice", consolidate: true, comprehensive: false };
  if (status === "submitted" || status === "awaiting_help") return { level: "participation", consolidate: false, comprehensive: false };
  // Approval, including legacy accepted=true mappings, is practice unless the parent explicitly marks "shown".
  const mark = String(m?.mark || "");
  // A comprehensive assessment only counts when the parent ALSO judged understanding shown on approved work.
  if (mark === "shown") return { level: "demonstrated", consolidate: false, comprehensive: m?.comprehensive === true };
  if (mark === "not_yet") return { level: "practice", consolidate: true, comprehensive: false };
  return { level: "practice", consolidate: false, comprehensive: false }; // completed and approved, outcome not judged
}

/** Lesson work: one contribution per outcome the lesson was written for, refreshed on hand-in and on every review. */
export async function trackSubmission(db: DB, familyId: string, submissionId: string, now: Date = new Date()) {
  await ensureTracker(db);
  const ts = now.toISOString();
  const touched: Touched = new Set();
  const s = await db.prepare("SELECT * FROM submissions WHERE id = ? AND family_id = ?").bind(submissionId, familyId).first();
  if (!s) return;
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?").bind(s.assignment_id, familyId).first();
  let lesson: any = lessonOf(a);
  if (!a?.lesson_snapshot && s.lesson_id) {
    const live = await db.prepare("SELECT data, title, learning_area, stage FROM lessons WHERE id = ?").bind(s.lesson_id).first();
    lesson = { ...json<any>(live?.data, {}), title: live?.title, learning_area: live?.learning_area, stage: live?.stage };
  }
  const mappings = json<any[]>(s.outcome_mappings, []);
  const codes = new Set<string>();
  // Only codes from the family's own verified catalogue are recorded (the server decides, not the client).
  const famCat = await frameworkForFamily(db, familyId);
  for (const c of [...(Array.isArray(lesson.outcome_codes) ? lesson.outcome_codes : []), ...mappings.map((m: any) => m?.code)]) {
    const k = knownCode(c);
    if (k && famCat && k.framework === famCat.framework) codes.add(String(c).trim());
  }
  const keep = new Set<string>();
  const baseSupport: Support = s.needs_help ? "significant" : SUPPORT_FROM_ASSIGNMENT[String(a?.support_level || "green")] || "independent";
  const reviewed = !!s.reviewed_at;
  for (const code of codes) {
    const k = knownCode(code)!;
    const m = mappings.find((x: any) => String(x?.code || "").trim() === code);
    const { level, consolidate, comprehensive } = levelFromReview(String(s.status), m);
    const support = asSupport(m?.support) || baseSupport;
    const what = level === "demonstrated" ? "Understanding shown" : level === "practice" ? (consolidate ? "Practised; needs more practice" : "Practised") : reviewed ? "Returned for another try" : "Handed in, waiting for your review";
    await upsertEvidence(db, familyId, s.student_id, {
      framework: k.framework, code, source_type: "lesson_review", source_id: s.id, lesson_id: s.lesson_id, assignment_id: s.assignment_id,
      origin: originOf(lesson), level, support, consolidate, comprehensive, summary: `${lesson.title || "Lesson"}: ${what}${comprehensive ? " (comprehensive assessment)" : ""}`,
      note: s.parent_feedback || null, file_ids: json<string[]>(s.file_ids, []), occurred_on: day(s.reviewed_at) || day(s.submitted_at) || ts.slice(0, 10),
      created_by: s.reviewed_by || null,
    }, ts, touched);
    keep.add(`${k.framework}|${code}`);
  }
  await retireSource(db, familyId, "lesson_review", s.id, keep, "No longer linked to this outcome", ts, touched);
  await trackAssignmentQuiz(db, familyId, s.assignment_id, now, touched);
  await recomputeAll(db, familyId, s.student_id, touched, now);
}

/** Quiz attempts on one assignment count once (best attempt). Passing is practice: auto-marking is not understanding. */
export async function trackAssignmentQuiz(db: DB, familyId: string, assignmentId: string, now: Date = new Date(), outer?: Touched) {
  await ensureTracker(db);
  const ts = now.toISOString();
  const touched: Touched = outer || new Set();
  const a = await db.prepare("SELECT * FROM assignments WHERE id = ? AND family_id = ?").bind(assignmentId, familyId).first();
  if (!a) return;
  const lesson = lessonOf(a);
  const qs = (Array.isArray(lesson.quiz) ? lesson.quiz : []).filter((q: any) => q && q.type !== "short_answer" && Array.isArray(q.options));
  const best = await db.prepare("SELECT score, total, completed_at FROM quiz_results WHERE assignment_id = ? AND family_id = ? ORDER BY score * 1.0 / MAX(total, 1) DESC, completed_at ASC LIMIT 1").bind(assignmentId, familyId).first();
  const keep = new Set<string>();
  if (best && qs.length) {
    const needed = Math.ceil(qs.length * (Number(lesson.pass_mark) || 0.9) - 1e-9);
    const passed = Number(best.score) >= needed;
    const famCat = await frameworkForFamily(db, familyId);
    for (const code of Array.isArray(lesson.outcome_codes) ? lesson.outcome_codes : []) {
      const k = knownCode(code);
      if (!k || !famCat || k.framework !== famCat.framework) continue;
      await upsertEvidence(db, familyId, a.student_id, {
        framework: k.framework, code: k.outcome.code, source_type: "quiz", source_id: a.id, lesson_id: a.lesson_id, assignment_id: a.id,
        origin: originOf(lesson), level: passed ? "practice" : "participation", support: SUPPORT_FROM_ASSIGNMENT[String(a.support_level || "green")] || "independent",
        consolidate: !passed, score: Number(best.score), total: Number(best.total),
        summary: `${lesson.title || "Lesson"} quiz: best ${best.score}/${best.total}${passed ? " (passed)" : " (not passed yet)"}`, occurred_on: day(best.completed_at) || ts.slice(0, 10),
      }, ts, touched);
      keep.add(`${k.framework}|${k.outcome.code}`);
    }
  }
  await retireSource(db, familyId, "quiz", assignmentId, keep, "Quiz no longer linked to this outcome", ts, touched);
  if (!outer) await recomputeAll(db, familyId, a.student_id, touched, now);
}

const LIFE_LEVEL: Record<string, { level: Level; consolidate: boolean }> = {
  accepted: { level: "practice", consolidate: false },
  demonstrated: { level: "demonstrated", consolidate: false },
  needs_more_evidence: { level: "participation", consolidate: true },
};

/** Reviewed life learning with verified outcome codes. Unreviewed AI suggestions never count. */
export async function trackLifeEvidence(db: DB, familyId: string, lifeId: string, now: Date = new Date()) {
  await ensureTracker(db);
  const ts = now.toISOString();
  const touched: Touched = new Set();
  const r = await db.prepare("SELECT * FROM life_evidence WHERE id = ? AND family_id = ?").bind(lifeId, familyId).first();
  const keep = new Set<string>();
  const judged = r ? LIFE_LEVEL[String(r.status)] : null;
  if (r && judged) {
    const famCat = await frameworkForFamily(db, familyId);
    for (const m of json<any[]>(r.accepted_mappings, [])) {
      const k = knownCode(m?.code);
      if (!k || !famCat || k.framework !== famCat.framework) continue; // plain-language mappings (no verified code) stay in the Evidence Backpack only
      await upsertEvidence(db, familyId, r.student_id, {
        framework: k.framework, code: k.outcome.code, source_type: "life_learning", source_id: r.id, origin: "life",
        level: judged.level, support: asSupport(m?.support), consolidate: judged.consolidate,
        summary: `Life learning: ${r.title || "activity"}`, note: r.parent_note || null, file_ids: json<string[]>(r.file_ids, []),
        occurred_on: day(r.date) || day(r.reviewed_at) || ts.slice(0, 10), created_by: r.reviewed_by || null,
      }, ts, touched);
      keep.add(`${k.framework}|${k.outcome.code}`);
    }
  }
  await retireSource(db, familyId, "life_learning", lifeId, keep, r ? "No longer linked to this outcome" : "Life learning entry deleted", ts, touched);
  const sid = r?.student_id || (await db.prepare("SELECT student_id FROM outcome_evidence WHERE family_id = ? AND source_type = 'life_learning' AND source_id = ? LIMIT 1").bind(familyId, lifeId).first())?.student_id;
  if (sid) await recomputeAll(db, familyId, sid, touched, now);
}

/** An Evidence Backpack note was deleted: anything that linked to it stops counting (history is kept). */
export async function evidenceNoteDeleted(db: DB, familyId: string, noteId: string, now: Date = new Date()) {
  await ensureTracker(db);
  const ts = now.toISOString();
  const { results } = await db.prepare("SELECT DISTINCT student_id FROM outcome_evidence WHERE family_id = ? AND source_type = 'evidence_note' AND source_id = ? AND removed_at IS NULL").bind(familyId, noteId).all();
  for (const r of results || []) {
    const touched: Touched = new Set();
    await retireSource(db, familyId, "evidence_note", noteId, new Set(), "The Evidence Backpack note was deleted", ts, touched);
    await recomputeAll(db, familyId, r.student_id, touched, now);
  }
}

/** Never lets tracker bookkeeping break the action that triggered it (a review, a hand-in, a quiz). */
export async function safely(label: string, fn: () => Promise<unknown>) {
  try { await fn(); } catch (e) { console.error(`outcome tracker: ${label} failed`, e instanceof Error ? e.message : e); }
}

/** Rebuilds a child's evidence from the records Side-Quest already holds. Idempotent. */
export async function syncStudent(db: DB, familyId: string, studentId: string, now: Date = new Date()) {
  await ensureTracker(db);
  const { results: subs } = await db.prepare("SELECT id FROM submissions WHERE family_id = ? AND student_id = ? ORDER BY submitted_at LIMIT 1000").bind(familyId, studentId).all();
  for (const s of subs || []) await trackSubmission(db, familyId, s.id, now);
  const { results: quizzed } = await db.prepare("SELECT DISTINCT q.assignment_id AS id FROM quiz_results q JOIN assignments a ON a.id = q.assignment_id WHERE q.family_id = ? AND a.student_id = ? AND q.assignment_id IS NOT NULL").bind(familyId, studentId).all();
  for (const q of quizzed || []) await trackAssignmentQuiz(db, familyId, q.id, now);
  const life = await db.prepare("SELECT id FROM life_evidence WHERE family_id = ? AND student_id = ? LIMIT 1000").bind(familyId, studentId).all().then((r: any) => r.results || []).catch(() => []);
  for (const l of life) await trackLifeEvidence(db, familyId, l.id, now);
  // Sources that no longer exist stop counting.
  const ts = now.toISOString();
  const touched: Touched = new Set();
  const checks: [string, string][] = [
    ["lesson_review", "SELECT id FROM submissions WHERE id = ? AND family_id = ?"],
    ["quiz", "SELECT id FROM assignments WHERE id = ? AND family_id = ?"],
    ["life_learning", "SELECT id FROM life_evidence WHERE id = ? AND family_id = ?"],
    ["evidence_note", "SELECT id FROM evidence_notes WHERE id = ? AND family_id = ?"],
  ];
  for (const [type, sql] of checks) {
    const { results } = await db.prepare("SELECT DISTINCT source_id FROM outcome_evidence WHERE family_id = ? AND student_id = ? AND source_type = ? AND removed_at IS NULL").bind(familyId, studentId, type).all();
    for (const r of results || []) {
      const there = await db.prepare(sql).bind(r.source_id, familyId).first().catch(() => null);
      if (!there) await retireSource(db, familyId, type, r.source_id, new Set(), "The original record was deleted", ts, touched);
    }
  }
  await recomputeAll(db, familyId, studentId, touched, now);
}

// ---------------------------------------------------------------- reading the tracker

const LIFE_IDEAS: Record<string, string> = {
  English: "Read a picture book or chapter together and talk about it, write a letter or shopping list, or retell a family story.",
  Mathematics: "Measure ingredients while baking, handle money at the shops, or keep score in a board game.",
  "Science and Technology": "Grow seeds, watch the weather for a week, or build and test something from recycled materials.",
  Science: "Run a kitchen experiment, observe local wildlife, or take something apart to see how it works.",
  HSIE: "Visit a local landmark, museum or council, look at an old family photo, or read a map on a walk.",
  PDHPE: "Plan a healthy meal, play a team game, or practise a new physical skill together.",
  "Creative Arts": "Make music, act out a story, or create an artwork about something you saw.",
  TAS: "Cook a recipe, design and build a small project, or plan a garden bed.",
  Languages: "Learn greetings for a visitor, label things around the house, or cook a dish and learn its words.",
};

export function suggestionsFor(o: { code: string; description: string; learning_area: string }, gaps: GapKind[], student: { id: string; year_level?: string | null; stage?: string | null }) {
  if (!gaps.some((g) => ["not_introduced", "not_revisited", "limited_evidence", "needs_consolidation"].includes(g))) return [];
  const year = yearLabel(student.year_level, student.stage) || "my child's";
  const prompt = `Create a ${year} ${o.learning_area} lesson that helps my child work towards curriculum outcome ${o.code}${o.description ? `: ${o.description}` : ""}`;
  return [
    { kind: "ai_lesson", label: "Draft a lesson with AI", detail: "Paid plans. You review it before your child sees it.", to: `/parent/lessons/make?student=${encodeURIComponent(student.id)}&prompt=${encodeURIComponent(prompt.slice(0, 600))}` },
    { kind: "manual_lesson", label: "Build a lesson yourself", detail: "Starts a new lesson already linked to this outcome.", to: `/parent/lessons/new?outcome=${encodeURIComponent(o.code)}` },
    { kind: "life_learning", label: "Look for it in everyday life", detail: LIFE_IDEAS[o.learning_area] || "Log an everyday activity that uses this skill.", to: "/parent/life-learning" },
  ];
}

async function getStudent(db: DB, familyId: string, sid: string) {
  return db.prepare("SELECT id, name, stage, year_level, extra FROM students WHERE id = ? AND family_id = ?").bind(sid, familyId).first();
}

/** All tracker rows for a child in the family's current framework, plus the catalogue outcomes for their stage. */
export async function trackerFor(db: DB, familyId: string, studentId: string, o: { now?: Date; sync?: boolean } = {}) {
  await ensureTracker(db);
  const now = o.now || new Date();
  const student = await getStudent(db, familyId, studentId);
  if (!student) return null;
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  const cat = catalogueFor(jurisdiction);
  const learner = await learnerSupport(db, familyId, studentId);
  const base = { student: { id: student.id, name: student.name, stage: student.stage, year_level: yearLabel(student.year_level, student.stage) }, jurisdiction, learner_support: learner, rules: DEFAULT_RULES };
  if (!cat.available) return { ...base, available: false as const, framework: { key: cat.framework, name: cat.name }, note: cat.note, areas: [], outcomes: [], gaps: {} };

  const hasAny = await db.prepare("SELECT COUNT(*) n FROM outcome_evidence WHERE family_id = ? AND student_id = ?").bind(familyId, studentId).first();
  if (o.sync || !Number(hasAny?.n)) await syncStudent(db, familyId, studentId, now);

  const { results: progress } = await db.prepare("SELECT * FROM outcome_progress WHERE family_id = ? AND student_id = ? AND framework = ?").bind(familyId, studentId, cat.framework).all();
  const { results: ev } = await db.prepare("SELECT * FROM outcome_evidence WHERE family_id = ? AND student_id = ? AND framework = ?").bind(familyId, studentId, cat.framework).all();
  const byCode = new Map<string, any>((progress || []).map((p: any) => [p.outcome_code, p]));
  const evByCode = new Map<string, EvidenceRow[]>();
  for (const e of (ev || []) as any[]) { const l = evByCode.get(e.outcome_code) || []; l.push(e); evByCode.set(e.outcome_code, l); }

  // The child's program (year level and chosen subjects from their profile), plus any outcome they already have
  // records for (working above or below level, or outside their chosen subjects).
  const program = programFor(cat, student);
  const codes = new Set<string>(cat.outcomes.filter(program.includes).map((x) => x.code));
  for (const c of byCode.keys()) codes.add(c);
  // Rows follow the same order as the subject cards; outcomes outside the program come last.
  const subjectRank = (o: { subject: string | null }) => { const i = o.subject ? program.subjects.indexOf(o.subject) : -1; return i < 0 ? 999 : i; };
  const outcomes = [...codes].map((code) => {
    const k = cat.byCode.get(code);
    const p = byCode.get(code);
    const rules = resolveRules({ framework: cat.framework, learning_area: p?.learning_area || k?.learning_area, code }, learner);
    const e = evaluate(evByCode.get(code) || [], rules, { confirmed: !!p?.parent_confirmed_at, now });
    return {
      code,
      // Official wording isn't republished: the row shows the code with its source, strand and level, and a link.
      description: "",
      ...outcomeInfo(k),
      subject: (k && program.subjectOf(k)) || null,
      learning_area: p?.learning_area || k?.learning_area || "Other",
      stage: p?.stage || k?.stage || "",
      // "in_stage" kept for older clients: it means "in the child's program" (level and chosen subjects).
      in_stage: k ? program.includes(k) : false,
      status: e.status,
      computed_status: e.computed,
      reason: e.reason,
      last_change_reason: p?.status_reason || null,
      parent_confirmed_at: p?.parent_confirmed_at || null,
      evidence_count: e.counts.evidence,
      last_evidence_on: e.last_on,
      gaps: e.gaps,
      catalogue_changed: !!(p?.catalogue_version && p.catalogue_version !== cat.version),
    };
  }).sort((a, b) => subjectRank(a) - subjectRank(b) || a.learning_area.localeCompare(b.learning_area) || a.code.localeCompare(b.code));

  // Headline cards follow the child's own subjects, in the order chosen (learning areas for primary). A chosen subject
  // with no verified outcomes still gets a card saying so. Outcomes outside the program are listed, not counted.
  const blankCard = (name: string) => ({ learning_area: name, subject: name, total: 0, counts: Object.fromEntries(STATUSES.map((s) => [s, 0])), awaiting_confirmation: 0, unsupported: false });
  const areas = new Map<string, any>(program.subjects.map((s) => [s, blankCard(s)]));
  for (const x of outcomes.filter((o) => o.in_stage)) {
    const key = x.subject || x.learning_area;
    const a = areas.get(key) || blankCard(key);
    a.total++; a.counts[x.status]++;
    if (x.gaps.includes("awaiting_confirmation")) a.awaiting_confirmation++;
    areas.set(key, a);
  }
  for (const a of areas.values()) if (!a.total) {
    a.unsupported = true;
    a.note = `Side-Quest doesn't hold verified ${cat.framework === "NSW" ? "NSW syllabus" : "Australian Curriculum"} outcomes for ${a.subject} at this level yet, so it isn't tracked here. Lessons, life learning and notes for it are still kept in the Evidence Backpack.`;
  }
  const gaps: Record<string, number> = {};
  for (const x of outcomes) for (const g of x.gaps) gaps[g] = (gaps[g] || 0) + 1;
  return {
    ...base, available: true as const,
    framework: { key: cat.framework, name: cat.name, version: cat.version },
    program: { level: program.level, areas: program.areas, courses: program.courses, source: "child_profile" },
    note: "Statuses follow Side-Quest's evidence guidelines, not official curriculum-authority thresholds. Only you can mark an outcome Achieved.",
    areas: [...areas.values()],
    outcomes,
    gaps,
  };
}

/** Everything behind one outcome: evidence (linked to where it lives), status history, rules and suggestions. */
export async function outcomeDetail(db: DB, familyId: string, studentId: string, code: string, o: { now?: Date } = {}) {
  await ensureTracker(db);
  const now = o.now || new Date();
  const student = await getStudent(db, familyId, studentId);
  if (!student) return null;
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  const cat = catalogueFor(jurisdiction);
  if (!cat.available) return { available: false as const, note: cat.note };
  const k = cat.byCode.get(code);
  const p = await db.prepare("SELECT * FROM outcome_progress WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ?").bind(familyId, studentId, cat.framework, code).first();
  if (!k && !p) return null;
  const learner = await learnerSupport(db, familyId, studentId);
  const { results: rows } = await db.prepare("SELECT * FROM outcome_evidence WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ? ORDER BY occurred_on DESC, created_at DESC").bind(familyId, studentId, cat.framework, code).all();
  const area = p?.learning_area || k?.learning_area || "Other";
  const rules = resolveRules({ framework: cat.framework, learning_area: area, code }, learner);
  const e = evaluate((rows || []) as EvidenceRow[], rules, { confirmed: !!p?.parent_confirmed_at, now });

  const evidence = [];
  for (const r of (rows || []) as any[]) {
    const fileIds = json<string[]>(r.file_ids, []);
    const files = [];
    for (const fid of fileIds.slice(0, 12)) {
      const f = await db.prepare("SELECT id, original_filename, content_type FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fid, familyId).first().catch(() => null);
      files.push(f ? { id: f.id, name: f.original_filename || "file", content_type: f.content_type || "" } : { id: fid, name: "File no longer available", content_type: "", missing: true });
    }
    let link: { label: string; to: string } | null = null;
    // Lesson work opens in the review window (by submission id) on the outcome page itself.
    if (r.source_type === "life_learning") link = { label: "Open in Life learning", to: "/parent/life-learning" };
    else if (r.source_type === "evidence_note") link = { label: "Open in Evidence Backpack", to: "/parent/evidence" };
    evidence.push({
      id: r.id, source_type: r.source_type, source_id: r.source_id, origin: r.origin, lesson_id: r.lesson_id, assignment_id: r.assignment_id,
      submission_id: r.source_type === "lesson_review" ? r.source_id
        : r.source_type === "quiz" ? (await db.prepare("SELECT id FROM submissions WHERE assignment_id = ? AND family_id = ? ORDER BY submitted_at DESC LIMIT 1").bind(r.assignment_id, familyId).first())?.id || null : null,
      level: r.level, support: r.support, consolidate: !!r.consolidate, comprehensive: !!r.comprehensive, score: r.score, total: r.total,
      summary: r.summary, note: r.note, occurred_on: r.occurred_on, files, link,
      counts: !r.removed_at && !r.excluded_at,
      removed_at: r.removed_at, removed_reason: r.removed_reason, excluded_at: r.excluded_at, excluded_reason: r.excluded_reason,
      editable: r.source_type === "parent_observation" || r.source_type === "evidence_note",
    });
  }
  const { results: history } = await db.prepare("SELECT from_status, to_status, computed_status, reason, actor, created_at FROM outcome_status_history WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ? ORDER BY created_at DESC, rowid DESC LIMIT 200").bind(familyId, studentId, cat.framework, code).all();
  // Learning plans that list this outcome are shown as planned, never as evidence.
  const plans = await db.prepare("SELECT id, title, period_start, period_end, ai_content FROM learning_plans WHERE family_id = ? AND student_id = ?").bind(familyId, studentId).all().then((r: any) => r.results || []).catch(() => []);
  const planned = plans.filter((pl: any) => JSON.stringify(json<any>(pl.ai_content, {})).includes(`"${code}"`)).map((pl: any) => ({ id: pl.id, title: pl.title, period_start: pl.period_start, period_end: pl.period_end }));
  const outcome = { code, description: "", learning_area: area, stage: p?.stage || k?.stage || "", source: k?.source || "", ...outcomeInfo(k) };
  return {
    available: true as const,
    student: { id: student.id, name: student.name },
    framework: { key: cat.framework, name: cat.name, version: cat.version },
    outcome,
    catalogue_changed: !!(p?.catalogue_version && p.catalogue_version !== cat.version) ? { recorded_version: p.catalogue_version, current_version: cat.version } : null,
    status: e.status, computed_status: e.computed, reason: e.reason, last_change_reason: p?.status_reason || null,
    confirmed: p?.parent_confirmed_at ? { at: p.parent_confirmed_at, note: p.confirmation_note || "" } : null,
    criteria: e.criteria, gaps: e.gaps, counts: e.counts, rules, learner_support: learner,
    evidence, history: history || [], planned,
    suggestions: suggestionsFor(outcome, e.gaps, student),
  };
}

// ---------------------------------------------------------------- parent actions

type R<T = {}> = ({ ok: true } & T) | { ok: false; status: number; detail: string; code?: string };
const bad = (status: number, detail: string, code?: string) => ({ ok: false as const, status, detail, code });

async function frameworkForFamily(db: DB, familyId: string) {
  const cat = catalogueFor(await getFamilyJurisdiction(db, familyId).catch(() => null));
  return cat.available ? cat : null;
}

export async function confirmOutcome(db: DB, familyId: string, parentId: string, studentId: string, code: string, body: { note?: unknown; override?: unknown }, now: Date = new Date()): Promise<R> {
  await ensureTracker(db);
  const cat = await frameworkForFamily(db, familyId);
  if (!cat) return bad(409, "The outcome tracker isn't available for your curriculum yet.", "NO_CATALOGUE");
  if (!(await getStudent(db, familyId, studentId))) return bad(404, "Child not found");
  if (!cat.byCode.has(code)) return bad(404, "Outcome not found");
  const ev = await recompute(db, familyId, studentId, cat.framework, code, { now });
  const note = clip(body.note, 2000);
  if (ev?.status === "achieved") return bad(409, "This outcome is already confirmed as Achieved.", "ALREADY_CONFIRMED");
  if (ev?.computed !== "demonstrated") {
    if (body.override !== true) return bad(409, "The evidence doesn't meet the Demonstrated guideline yet. You can still confirm it with a note explaining your judgement.", "BELOW_GUIDELINE");
    if (note.length < 5) return bad(400, "Add a short note explaining your judgement when confirming below the guideline.", "NOTE_REQUIRED");
  }
  const ts = now.toISOString();
  const k = cat.byCode.get(code)!;
  await db.prepare(
    "INSERT INTO outcome_progress (id, family_id, student_id, framework, outcome_code, learning_area, stage, description, catalogue_version, computed_status, status, status_reason, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'not_started', 'not_started', '', ?) ON CONFLICT (student_id, framework, outcome_code) DO NOTHING"
  ).bind(newId(), familyId, studentId, cat.framework, code, k.learning_area, k.stage, k.description, cat.version, ts).run();
  await db.prepare("UPDATE outcome_progress SET parent_confirmed_at = ?, parent_confirmed_by = ?, confirmation_note = ? WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ?")
    .bind(ts, parentId, note || null, familyId, studentId, cat.framework, code).run();
  const reason = ev?.computed === "demonstrated" ? `Confirmed as Achieved by you.${note ? ` Note: ${note}` : ""}` : `Confirmed as Achieved by you on your own judgement (evidence was at ${STATUS_LABELS[(ev?.computed || "not_started") as Status]}). Note: ${note}`;
  // Confirming always changes the visible status to Achieved, so recompute logs it as the parent's decision.
  await recompute(db, familyId, studentId, cat.framework, code, { now, actor: "parent", actorId: parentId, reason });
  return { ok: true };
}

export async function unconfirmOutcome(db: DB, familyId: string, parentId: string, studentId: string, code: string, body: { note?: unknown }, now: Date = new Date()): Promise<R> {
  await ensureTracker(db);
  const cat = await frameworkForFamily(db, familyId);
  if (!cat) return bad(409, "The outcome tracker isn't available for your curriculum yet.", "NO_CATALOGUE");
  const p = await db.prepare("SELECT id, parent_confirmed_at FROM outcome_progress WHERE family_id = ? AND student_id = ? AND framework = ? AND outcome_code = ?").bind(familyId, studentId, cat.framework, code).first();
  if (!p?.parent_confirmed_at) return bad(409, "This outcome isn't confirmed.", "NOT_CONFIRMED");
  const note = clip(body.note, 2000);
  if (note.length < 3) return bad(400, "Add a short note saying why you are withdrawing the confirmation.", "NOTE_REQUIRED");
  await db.prepare("UPDATE outcome_progress SET parent_confirmed_at = NULL, parent_confirmed_by = NULL, confirmation_note = NULL WHERE id = ?").bind(p.id).run();
  await recompute(db, familyId, studentId, cat.framework, code, { now, actor: "parent", actorId: parentId, reason: `You withdrew the Achieved confirmation. Note: ${note}` });
  return { ok: true };
}

/** A parent adds evidence: a new observation, or a link to an existing Evidence Backpack note (not a copy). */
export async function addEvidence(db: DB, familyId: string, parentId: string, studentId: string, code: string, body: any, now: Date = new Date()): Promise<R<{ id: string }>> {
  await ensureTracker(db);
  const cat = await frameworkForFamily(db, familyId);
  if (!cat) return bad(409, "The outcome tracker isn't available for your curriculum yet.", "NO_CATALOGUE");
  if (!(await getStudent(db, familyId, studentId))) return bad(404, "Child not found");
  if (!cat.byCode.has(code)) return bad(404, "Outcome not found");
  const level = asLevel(body?.level);
  if (!level) return bad(400, "Choose what this evidence shows: met it, practised it, or showed understanding.");
  const support = asSupport(body?.support);
  const occurred = day(body?.occurred_on) || now.toISOString().slice(0, 10);
  const ts = now.toISOString();
  const touched: Touched = new Set();
  let sourceType = "parent_observation";
  let sourceId = newId();
  let summary = clip(body?.title, 200) || "Parent observation";
  let fileIds: string[] = (Array.isArray(body?.file_ids) ? body.file_ids : []).filter((x: unknown) => typeof x === "string").slice(0, 10);
  if (body?.evidence_note_id) {
    const n = await db.prepare("SELECT * FROM evidence_notes WHERE id = ? AND family_id = ? AND student_id = ?").bind(String(body.evidence_note_id), familyId, studentId).first().catch(() => null);
    if (!n) return bad(404, "That Evidence Backpack note wasn't found for this child.");
    sourceType = "evidence_note"; sourceId = n.id; summary = `Evidence Backpack: ${n.title}`; fileIds = json<string[]>(n.file_ids, []);
  } else {
    if (!clip(body?.note, 4000)) return bad(400, "Describe what you saw your child do.");
    for (const fid of fileIds) {
      const f = await db.prepare("SELECT id FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0").bind(fid, familyId).first();
      if (!f) return bad(400, "One of the files could not be found.");
    }
  }
  const dup = await db.prepare("SELECT id, removed_at, excluded_at FROM outcome_evidence WHERE student_id = ? AND framework = ? AND outcome_code = ? AND source_type = ? AND source_id = ? AND family_id = ?").bind(studentId, cat.framework, code, sourceType, sourceId, familyId).first();
  if (dup && !dup.removed_at && !dup.excluded_at) return bad(409, "That evidence is already linked to this outcome.", "DUPLICATE");
  if (dup?.excluded_at) await db.prepare("UPDATE outcome_evidence SET excluded_at = NULL, excluded_reason = NULL WHERE id = ?").bind(dup.id).run();
  await upsertEvidence(db, familyId, studentId, {
    framework: cat.framework, code, source_type: sourceType, source_id: sourceId, origin: "parent", level, support,
    consolidate: body?.consolidate === true, comprehensive: body?.comprehensive === true && level === "demonstrated",
    summary, note: clip(body?.note, 4000) || null, file_ids: fileIds, occurred_on: occurred, created_by: parentId,
  }, ts, touched);
  await recomputeAll(db, familyId, studentId, touched, now, `You added evidence: ${summary}.`);
  const row = await db.prepare("SELECT id FROM outcome_evidence WHERE student_id = ? AND framework = ? AND outcome_code = ? AND source_type = ? AND source_id = ?").bind(studentId, cat.framework, code, sourceType, sourceId).first();
  return { ok: true, id: row.id };
}

async function ownEvidence(db: DB, familyId: string, id: string) {
  return db.prepare("SELECT * FROM outcome_evidence WHERE id = ? AND family_id = ?").bind(id, familyId).first();
}

/** Exclude or re-include any evidence (e.g. "this lesson didn't really cover it"). Kept for history either way. */
export async function setExcluded(db: DB, familyId: string, id: string, exclude: boolean, reason: unknown, now: Date = new Date()): Promise<R> {
  await ensureTracker(db);
  const r = await ownEvidence(db, familyId, id);
  if (!r) return bad(404, "Evidence not found");
  const why = clip(reason, 500);
  if (exclude && why.length < 3) return bad(400, "Add a short reason for not counting this evidence.", "NOTE_REQUIRED");
  const ts = now.toISOString();
  await db.prepare("UPDATE outcome_evidence SET excluded_at = ?, excluded_reason = ?, updated_at = ? WHERE id = ?").bind(exclude ? ts : null, exclude ? why : null, ts, id).run();
  await recompute(db, familyId, r.student_id, r.framework, r.outcome_code, { now, actor: "parent", reason: exclude ? `You stopped counting "${r.summary}": ${why}` : `You counted "${r.summary}" again.` });
  return { ok: true };
}

/** Edit, remove or move (to another outcome) evidence a parent added. Lesson and life learning evidence follows its source. */
export async function editEvidence(db: DB, familyId: string, id: string, body: any, now: Date = new Date()): Promise<R<{ id: string }>> {
  await ensureTracker(db);
  const r = await ownEvidence(db, familyId, id);
  if (!r) return bad(404, "Evidence not found");
  if (!["parent_observation", "evidence_note"].includes(r.source_type)) return bad(409, "This evidence comes from lesson work or life learning. Change it there, or choose not to count it.", "SOURCE_OWNED");
  if (r.removed_at) return bad(409, "This evidence has been removed.");
  const ts = now.toISOString();
  const touched: Touched = new Set();
  if (body?.remove === true) {
    await db.prepare("UPDATE outcome_evidence SET removed_at = ?, removed_reason = ?, updated_at = ? WHERE id = ?").bind(ts, "Removed by you", ts, id).run();
    await recompute(db, familyId, r.student_id, r.framework, r.outcome_code, { now, actor: "parent", reason: `You removed "${r.summary}".` });
    return { ok: true, id };
  }
  const target = body?.outcome_code ? String(body.outcome_code).trim() : r.outcome_code;
  const k = knownCode(target);
  if (!k || k.framework !== r.framework) return bad(400, "Choose an outcome from your curriculum.");
  const level = asLevel(body?.level) || r.level;
  const support = body && "support" in body ? asSupport(body.support) : r.support;
  const c: Contribution = {
    framework: r.framework, code: target, source_type: r.source_type, source_id: r.source_id, origin: r.origin, level, support,
    consolidate: body && "consolidate" in body ? body.consolidate === true : !!r.consolidate,
    comprehensive: (body && "comprehensive" in body ? body.comprehensive === true : !!r.comprehensive) && level === "demonstrated",
    summary: r.summary, note: body && "note" in body ? clip(body.note, 4000) : r.note, file_ids: json<string[]>(r.file_ids, []),
    occurred_on: day(body?.occurred_on) || r.occurred_on, created_by: r.created_by,
  };
  if (target !== r.outcome_code) {
    await db.prepare("UPDATE outcome_evidence SET removed_at = ?, removed_reason = ?, updated_at = ? WHERE id = ?").bind(ts, `Moved to ${target}`, ts, id).run();
    touched.add(`${r.framework}|${r.outcome_code}`);
  }
  await upsertEvidence(db, familyId, r.student_id, c, ts, touched);
  await recomputeAll(db, familyId, r.student_id, touched, now, `You edited evidence: ${r.summary}.`);
  const row = await db.prepare("SELECT id FROM outcome_evidence WHERE student_id = ? AND framework = ? AND outcome_code = ? AND source_type = ? AND source_id = ?").bind(r.student_id, r.framework, target, r.source_type, r.source_id).first();
  return { ok: true, id: row.id };
}

export async function setLearnerSupport(db: DB, familyId: string, studentId: string, body: any, now: Date = new Date()): Promise<R> {
  await ensureTracker(db);
  const s = await db.prepare("SELECT extra FROM students WHERE id = ? AND family_id = ?").bind(studentId, familyId).first();
  if (!s) return bad(404, "Child not found");
  const extra = json<any>(s.extra, {}) || {};
  extra.outcome_support = { documented_adjustments: body?.documented_adjustments === true, note: clip(body?.note, 500) };
  await db.prepare("UPDATE students SET extra = ? WHERE id = ? AND family_id = ?").bind(JSON.stringify(extra), studentId, familyId).run();
  const { results } = await db.prepare("SELECT framework, outcome_code FROM outcome_progress WHERE family_id = ? AND student_id = ?").bind(familyId, studentId).all();
  const touched: Touched = new Set((results || []).map((r: any) => `${r.framework}|${r.outcome_code}`));
  await recomputeAll(db, familyId, studentId, touched, now, body?.documented_adjustments === true ? "Documented adjustments recorded: work done with a lot of help now counts." : "Documented adjustments removed: work done with a lot of help no longer counts towards Demonstrated.");
  return { ok: true };
}

/** Per-child headline numbers for the Parent Hub. No sync here: it reads what the hooks keep up to date. */
export async function familySummary(db: DB, familyId: string, now: Date = new Date()) {
  await ensureTracker(db);
  const jurisdiction = await getFamilyJurisdiction(db, familyId).catch(() => null);
  const cat = catalogueFor(jurisdiction);
  const { results: kids } = await db.prepare("SELECT id, name, stage, year_level FROM students WHERE family_id = ? ORDER BY created_at").bind(familyId).all();
  if (!cat.available) return { available: false, note: cat.note, students: (kids || []).map((k: any) => ({ id: k.id, name: k.name })) };
  const out = [];
  for (const k of kids || []) {
    const t = await trackerFor(db, familyId, k.id, { now });
    if (!t || !t.available) continue;
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
    for (const o of t.outcomes.filter((x) => x.in_stage)) counts[o.status]++;
    out.push({
      id: k.id, name: k.name, year_level: t.student.year_level, total: t.outcomes.filter((x) => x.in_stage).length, counts,
      awaiting_confirmation: t.gaps.awaiting_confirmation || 0, needs_attention: t.gaps.confirmed_evidence_changed || 0, needs_consolidation: t.gaps.needs_consolidation || 0,
    });
  }
  return { available: true, framework: { key: cat.framework, name: cat.name }, students: out };
}

// ---------------------------------------------------------------- routes

export function registerOutcomes(app: App, g: Guards) {
  const send = (c: any, r: { ok: false; status: number; detail: string; code?: string }) => c.json({ detail: r.detail, code: r.code }, r.status);
  app.get("/api/outcomes/summary", g.auth, g.parent, async (c) => c.json(await familySummary(c.env.DB, c.get("user").family_id)));
  app.get("/api/outcomes/students/:sid", g.auth, g.parent, async (c) => {
    const t = await trackerFor(c.env.DB, c.get("user").family_id, c.req.param("sid"), { sync: c.req.query("refresh") === "1" });
    return t ? c.json(t) : c.json({ detail: "Child not found" }, 404);
  });
  app.post("/api/outcomes/students/:sid/rebuild", g.auth, g.parent, async (c) => {
    const t = await trackerFor(c.env.DB, c.get("user").family_id, c.req.param("sid"), { sync: true });
    return t ? c.json(t) : c.json({ detail: "Child not found" }, 404);
  });
  app.put("/api/outcomes/students/:sid/support", g.auth, g.parent, async (c) => {
    const r = await setLearnerSupport(c.env.DB, c.get("user").family_id, c.req.param("sid"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });
  app.get("/api/outcomes/students/:sid/outcomes/:code", g.auth, g.parent, async (c) => {
    const d = await outcomeDetail(c.env.DB, c.get("user").family_id, c.req.param("sid"), decodeURIComponent(c.req.param("code")));
    return d ? c.json(d) : c.json({ detail: "Not found" }, 404);
  });
  app.post("/api/outcomes/students/:sid/outcomes/:code/confirm", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await confirmOutcome(c.env.DB, u.family_id, u.id, c.req.param("sid"), decodeURIComponent(c.req.param("code")), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });
  app.post("/api/outcomes/students/:sid/outcomes/:code/unconfirm", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await unconfirmOutcome(c.env.DB, u.family_id, u.id, c.req.param("sid"), decodeURIComponent(c.req.param("code")), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });
  app.post("/api/outcomes/students/:sid/outcomes/:code/evidence", g.auth, g.parent, async (c) => {
    const u = c.get("user");
    const r = await addEvidence(c.env.DB, u.family_id, u.id, c.req.param("sid"), decodeURIComponent(c.req.param("code")), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ ok: true, id: r.id }) : send(c, r);
  });
  app.put("/api/outcomes/evidence/:eid", g.auth, g.parent, async (c) => {
    const r = await editEvidence(c.env.DB, c.get("user").family_id, c.req.param("eid"), await c.req.json().catch(() => ({})));
    return r.ok ? c.json({ ok: true, id: r.id }) : send(c, r);
  });
  app.post("/api/outcomes/evidence/:eid/exclude", g.auth, g.parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const r = await setExcluded(c.env.DB, c.get("user").family_id, c.req.param("eid"), true, b.reason);
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });
  app.post("/api/outcomes/evidence/:eid/include", g.auth, g.parent, async (c) => {
    const r = await setExcluded(c.env.DB, c.get("user").family_id, c.req.param("eid"), false, "");
    return r.ok ? c.json({ ok: true }) : send(c, r);
  });
}
