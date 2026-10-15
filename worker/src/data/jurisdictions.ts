// Which curriculum framework applies to a family, by the state or territory the parent chose.
// NSW holds a NESA syllabus outcome seed. Five other jurisdictions can use the verified ACARA v9
// content-description REFERENCE catalogue; this is not a certification of local compliance.
// VIC now has a source-backed VC2 plus 2026-current VC1 EAL reference; several other VC1 languages and senior courses remain missing.\n// WA still requires an accessible state-specific official catalogue. Never invent identifiers.

export type JurisdictionCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type Framework = {
  jurisdiction: JurisdictionCode;
  jurisdiction_name: string;
  name: string;
  short: string;
  url: string;
  /** "verified": state outcome seed; "reference": verified but PARTIAL national or state source catalogue, not compliance certification; "none": unavailable. */
  codes: "verified" | "reference" | "none";
  /** How this framework groups year levels ("stage" for NSW, "year" elsewhere). */
  level_kind: "stage" | "year";
  learning_areas: { primary: string[]; secondary: string[] };
};

const AC9_AREAS = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "Health and Physical Education", "The Arts", "Technologies", "Languages"];
const AC9 = { name: "Australian Curriculum Version 9.0", short: "Australian Curriculum v9", url: "https://v9.australiancurriculum.edu.au/" };

export const FRAMEWORKS: Record<JurisdictionCode, Framework> = {
  NSW: {
    jurisdiction: "NSW", jurisdiction_name: "New South Wales", name: "NSW syllabuses (NESA)", short: "NSW syllabus",
    url: "https://curriculum.nsw.edu.au/", codes: "verified", level_kind: "stage",
    learning_areas: {
      primary: ["English", "Mathematics", "Science and Technology", "HSIE", "PDHPE", "Creative Arts", "Languages"],
      secondary: ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "Languages", "TAS"],
    },
  },
  VIC: {
    jurisdiction: "VIC", jurisdiction_name: "Victoria", name: "Victorian Curriculum F–10 Version 2.0", short: "Victorian Curriculum 2.0",
    url: "https://f10.vcaa.vic.edu.au/", codes: "reference", level_kind: "year",
    learning_areas: {
      primary: ["English", "Mathematics", "Science", "Humanities", "Health and Physical Education", "The Arts", "Technologies", "Languages"],
      secondary: ["English", "Mathematics", "Science", "Humanities", "Health and Physical Education", "The Arts", "Technologies", "Languages"],
    },
  },
  WA: {
    jurisdiction: "WA", jurisdiction_name: "Western Australia", name: "Western Australian Curriculum (SCSA)", short: "WA Curriculum",
    url: "https://k10outline.scsa.wa.edu.au/", codes: "none", level_kind: "year",
    learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS },
  },
  QLD: { jurisdiction: "QLD", jurisdiction_name: "Queensland", ...AC9, codes: "reference", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  SA: { jurisdiction: "SA", jurisdiction_name: "South Australia", ...AC9, codes: "reference", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  TAS: { jurisdiction: "TAS", jurisdiction_name: "Tasmania", ...AC9, codes: "reference", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  ACT: { jurisdiction: "ACT", jurisdiction_name: "Australian Capital Territory", ...AC9, codes: "reference", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  NT: { jurisdiction: "NT", jurisdiction_name: "Northern Territory", ...AC9, codes: "reference", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
};

export const JURISDICTION_CODES = Object.keys(FRAMEWORKS) as JurisdictionCode[];

export function normJurisdiction(v: unknown): JurisdictionCode | null {
  const s = String(v ?? "").trim().toUpperCase();
  return (JURISDICTION_CODES as string[]).includes(s) ? (s as JurisdictionCode) : null;
}

export const frameworkFor = (j: unknown): Framework | null => {
  const code = normJurisdiction(j);
  return code ? FRAMEWORKS[code] : null;
};

/** Areas for a student's level: NSW stage codes or a year level such as "Year 3" / "3" / "Foundation". */
export function areasFor(fw: Framework, stage: string | null | undefined): string[] {
  const secondary = ["S4", "S5", "S6"].includes(String(stage || ""));
  return secondary ? fw.learning_areas.secondary : fw.learning_areas.primary;
}

/** "Year 3", "Foundation" etc. from a student's stored year level or NSW stage. */
export function yearLabel(yearLevel: unknown, stage: unknown): string {
  const y = String(yearLevel ?? "").trim();
  if (/^\d{1,2}$/.test(y)) return `Year ${Number(y)}`;
  if (/^(k|kindergarten|prep|foundation|f|reception|transition|pre-primary)$/i.test(y)) return "Foundation";
  if (y) return y;
  const s = String(stage ?? "");
  return ({ ES1: "Foundation", S1: "Years 1–2", S2: "Years 3–4", S3: "Years 5–6", S4: "Years 7–8", S5: "Years 9–10", S6: "Years 11–12" } as Record<string, string>)[s] || "";
}

// Runtime guard so the column exists even if the migration hasn't been applied yet (deploys don't run migrations).
let ready = false;
export async function ensureJurisdictionColumn(db: D1Database) {
  if (ready) return;
  try {
    await db.prepare("ALTER TABLE families ADD COLUMN jurisdiction TEXT").run();
  } catch (error) {
    if (!/duplicate column/i.test(error instanceof Error ? error.message : String(error))) throw error;
  }
  ready = true;
}

export async function getFamilyJurisdiction(db: D1Database, familyId: string): Promise<JurisdictionCode | null> {
  await ensureJurisdictionColumn(db);
  const row = await db.prepare("SELECT jurisdiction FROM families WHERE id = ?").bind(familyId).first<{ jurisdiction: string | null }>();
  return normJurisdiction(row?.jurisdiction);
}

export async function setFamilyJurisdiction(db: D1Database, familyId: string, j: JurisdictionCode) {
  await ensureJurisdictionColumn(db);
  await db.prepare("UPDATE families SET jurisdiction = ? WHERE id = ?").bind(j, familyId).run();
}

/**
 * Lesson outcome suggestions and the plan writer use the NSW syllabus list, the only verified outcome list loaded.
 * Families in any other state or territory, or who haven't chosen yet, never get NSW codes from them (matching the
 * Evidence Backpack, which never defaults to NSW). Parents without a state are asked the next time they sign in.
 */
export const usesNswOutcomes = (j: JurisdictionCode | null) => j === "NSW";

export const outcomesNotLoadedNote = (j: JurisdictionCode) =>
  `Lesson outcome suggestions are not available for ${j} yet. Side-Quest only holds a verified outcome list for NSW, so nothing is suggested rather than showing NSW outcomes that don't apply. Record outcomes yourself from your official curriculum (see Curriculum).`;
