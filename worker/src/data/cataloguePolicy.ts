/**
 * Curriculum catalogue source manifest. This is policy/metadata, not an assertion that
 * Side-Quest already holds complete, verified content for these jurisdictions.
 *
 * Keep framework, record type and licence separate: a national content description
 * is NOT the same as a state syllabus outcome or an achievement standard.
 */
export type Jurisdiction = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
export type CurriculumRecordType = "syllabus_outcome" | "content_description" | "achievement_standard";
export type CatalogueAvailability = "verified" | "import_pending_review" | "permission_required" | "not_loaded";
export type ReusePolicy = "cc_by_4" | "permission_required" | "review_required";
export type CatalogueSource = {
  id: string;
  publisher: string;
  officialUrl: string;
  licenceUrl: string;
  reuse: ReusePolicy;
  version: string;
  recordTypes: readonly CurriculumRecordType[];
  status: CatalogueAvailability;
  notes: string;
};

export const CATALOGUE_SOURCES: Record<"NESA" | "VCAA" | "ACARA_AC9" | "SCSA", CatalogueSource> = {
  NESA: {
    id: "NESA", publisher: "NSW Education Standards Authority",
    officialUrl: "https://curriculum.nsw.edu.au/",
    licenceUrl: "https://www.nsw.gov.au/education-and-training/nesa/copyright",
    reuse: "permission_required", version: "syllabus-specific",
    recordTypes: ["syllabus_outcome"], status: "permission_required",
    notes: "Existing NSW outcome references must be audited for coverage, accuracy, and permission for commercial republication.",
  },
  VCAA: {
    id: "VCAA", publisher: "Victorian Curriculum and Assessment Authority",
    officialUrl: "https://f10.vcaa.vic.edu.au/",
    licenceUrl: "https://f10.vcaa.vic.edu.au/copyright-statement",
    reuse: "permission_required", version: "Victorian Curriculum F-10 v2.0 / subject-specific transitions",
    recordTypes: ["content_description", "achievement_standard"], status: "permission_required",
    notes: "The VCAA curriculum's default licence is non-commercial; request permission before storing its full text in paid Side-Quest.",
  },
  ACARA_AC9: {
    id: "ACARA_AC9", publisher: "Australian Curriculum Assessment and Reporting Authority",
    officialUrl: "https://www.australiancurriculum.edu.au/machine-readable-australian-curriculum",
    licenceUrl: "https://www.australiancurriculum.edu.au/copyright-and-terms-of-use/",
    reuse: "cc_by_4", version: "Australian Curriculum v9.0 MRAC/2024/04",
    recordTypes: ["content_description", "achievement_standard"], status: "import_pending_review",
    notes: "Generated content descriptions exist on data/ac9-import but have not been reviewed or deployed. Import excludes Languages and may have other gaps. Excluded third-party materials are not CC BY.",
  },
  SCSA: {
    id: "SCSA", publisher: "School Curriculum and Standards Authority (WA)",
    officialUrl: "https://k10outline.scsa.wa.edu.au/",
    licenceUrl: "https://k10outline.scsa.wa.edu.au/",
    reuse: "review_required", version: "subject-specific WA curriculum",
    recordTypes: ["content_description", "achievement_standard"], status: "not_loaded",
    notes: "Verify the current WA implementation and commercial reuse rights before importing WA-specific text.",
  },
};

export const JURISDICTION_CATALOGUES: Record<Jurisdiction, readonly (keyof typeof CATALOGUE_SOURCES)[]> = {
  NSW: ["NESA"], VIC: ["VCAA"], QLD: ["ACARA_AC9"], WA: ["SCSA"],
  SA: ["ACARA_AC9"], TAS: ["ACARA_AC9"], ACT: ["ACARA_AC9"], NT: ["ACARA_AC9"],
};

export type CatalogueRecord = {
  framework: string;
  version: string;
  jurisdiction: Jurisdiction;
  recordType: CurriculumRecordType;
  identifier: string;
  learningArea: string;
  yearFrom: number;
  yearTo: number;
  text: string;
  sourceUrl: string;
  sourceId: keyof typeof CATALOGUE_SOURCES;
  checkedAt: string; // yyyy-mm-dd (a real recorded review date, never generated implicitly)
};

export function validateCatalogueRecord(record: CatalogueRecord): string[] {
  const errors: string[] = [];
  const source = CATALOGUE_SOURCES[record.sourceId];
  if (!source) return ["Unknown curriculum source"];
  if (!JURISDICTION_CATALOGUES[record.jurisdiction]?.includes(record.sourceId)) errors.push("Source not approved for jurisdiction");
  if (!source.recordTypes.includes(record.recordType)) errors.push("Record type not supported by source");
  if (source.reuse !== "cc_by_4") errors.push("Commercial reuse permission not yet verified");
  if (!record.identifier.trim() || !record.text.trim()) errors.push("Missing identifier or description");
  if (!record.version.trim() || record.version !== source.version) errors.push("Incorrect or missing source version");
  if (!Number.isInteger(record.yearFrom) || !Number.isInteger(record.yearTo) || record.yearFrom < 0 || record.yearTo > 12 || record.yearFrom > record.yearTo) errors.push("Invalid year range");
  if (!/^https:\/\//.test(record.sourceUrl)) errors.push("Missing official source URL");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.checkedAt)) errors.push("Missing verification date");
  return errors;
}

export function canPublishCatalogue(sourceId: keyof typeof CATALOGUE_SOURCES): boolean {
  const source = CATALOGUE_SOURCES[sourceId];
  return source.reuse === "cc_by_4" && source.status === "verified";
}
