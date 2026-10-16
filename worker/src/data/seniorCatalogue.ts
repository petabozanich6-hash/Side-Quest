/**
 * Senior-secondary authority catalogue is separate from learning outcomes.
 * TASC codes identify courses; SACE/NTCET codes identify subject+credit variants.
 * These are NEVER passed into the Outcome Tracker's mastery code pool.
 */
import tascData from "./tasc-2026-course-codes.json";
import saceData from "./sace-2026-subject-review.json";
import type { JurisdictionCode } from "./jurisdictions";

export type SeniorCourseRecord = {
  code:string;
  title:string;
  authority:string;
  identifier_kind:"senior_course_code" | "senior_subject_code";
  level:string;
  tce_credit_points?:number;
  credits?:number;
  stage?:number;
  source_url:string;
  applicable_year:number;
  syllabus_variant?:string | null;
};

export type SeniorCatalogue = {
  jurisdiction:JurisdictionCode;
  complete:boolean;
  source_url:string;
  applicable_year:number;
  kind:"senior_course_code" | "senior_subject_code";
  note:string;
  courses:SeniorCourseRecord[];
};

export function seniorCatalogueFor(jurisdiction:JurisdictionCode):SeniorCatalogue|null {
  if(jurisdiction==="TAS") {
    if(tascData.complete !== true || tascData.summary.verified_course_codes !== 164 ||
       tascData.summary.declared !== tascData.summary.verified_course_codes) return null;
    return {
      jurisdiction, complete:true, source_url:tascData.source,
      applicable_year:2026, kind:"senior_course_code",
      note:"Current 2026 TASC-accredited courses. Course IDs are not individual learning outcomes; check TASC for future-year syllabus changes.",
      courses:tascData.courses as SeniorCourseRecord[],
    };
  }
  if(jurisdiction==="SA" || jurisdiction==="NT") {
    // Full matching across ALL 91 source pages; this does not certify that
    // externally administered national continuers or VET offerings are included.
    if(saceData.summary.distinct_subject_codes !== 427 ||
       saceData.summary.failed_or_code_less_pages !== 0 ||
       saceData.failures.length !== 0 || saceData.conflicts.length !== 0) return null;
    return {
      jurisdiction, complete:false, source_url:saceData.official_index,
      applicable_year:2026, kind:"senior_subject_code",
      note:"Verified SACE Stage 1/2 subject-and-credit identifiers from 91 official subject-code tables, including Modified Subjects and elective variants. These are NOT individual learning outcomes. NT NTCET requirements, VET qualifications and externally administered national continuers may need separate verification; the total catalogue is not certified complete.",
      courses:saceData.subject_codes.map(row => ({
        code:row.code, title:row.subject, authority:"SACE Board",
        identifier_kind:"senior_subject_code" as const,level:"Stage "+row.stage,
        stage:row.stage,credits:row.credits,source_url:row.source_url,
        syllabus_variant:row.syllabus_variant,applicable_year:2026,
      })),
    };
  }
  return null;
}
