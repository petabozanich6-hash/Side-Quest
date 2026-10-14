// Which curriculum framework applies to a family, by the state or territory the parent chose.
// Only NSW has a verified outcome-code list loaded in Side-Quest. For every other jurisdiction, AI mappings are
// described against that framework's learning areas WITHOUT a code: a code is never shown unless it came from a
// verified list we hold. Add a verified list here (and set codes: "verified") when one is loaded.

export type JurisdictionCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type Framework = {
  jurisdiction: JurisdictionCode;
  jurisdiction_name: string;
  name: string;
  short: string;
  url: string;
  /** "verified": codes come from a list Side-Quest holds. "none": no codes are attached. */
  codes: "verified" | "none";
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
    url: "https://f10.vcaa.vic.edu.au/", codes: "none", level_kind: "year",
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
  QLD: { jurisdiction: "QLD", jurisdiction_name: "Queensland", ...AC9, codes: "none", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  SA: { jurisdiction: "SA", jurisdiction_name: "South Australia", ...AC9, codes: "none", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  TAS: { jurisdiction: "TAS", jurisdiction_name: "Tasmania", ...AC9, codes: "none", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  ACT: { jurisdiction: "ACT", jurisdiction_name: "Australian Capital Territory", ...AC9, codes: "none", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
  NT: { jurisdiction: "NT", jurisdiction_name: "Northern Territory", ...AC9, codes: "none", level_kind: "year", learning_areas: { primary: AC9_AREAS, secondary: AC9_AREAS } },
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
