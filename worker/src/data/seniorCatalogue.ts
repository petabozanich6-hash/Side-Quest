/**
 * Senior-secondary catalogue is intentionally separate from Outcome Tracker.
 * TASC course codes identify accredited COURSE choices, not curriculum outcomes.
 * Future ACT/SACE/QCE etc can join once their real authority identifiers are verified.
 */
import tascData from "./tasc-2026-course-codes.json";
import type { JurisdictionCode } from "./jurisdictions";

export type SeniorCourseRecord = {
  code:string;
  title:string;
  authority:string;
  framework:string;
  identifier_kind:"senior_course_code";
  level:string;
  tce_credit_points:number;
  jurisdiction:string;
  school_stage:string;
  source_url:string;
  index_url:string;
  applicable_year:number;
  verification_status:string;
};

export type SeniorCatalogue = {
  jurisdiction: JurisdictionCode;
  complete:boolean;
  source_url:string;
  applicable_year:number;
  kind:"senior_course_code";
  note:string;
  courses:SeniorCourseRecord[];
};

/** Only include fully source-and-count validated catalogues; no fake codes. */
export function seniorCatalogueFor(jurisdiction: JurisdictionCode): SeniorCatalogue | null {
  if(jurisdiction !== "TAS")return null;
  if(tascData.complete !== true || tascData.summary.verified_course_codes !== 164 ||
     tascData.summary.declared !== tascData.summary.verified_course_codes)
    return null;
  return {
    jurisdiction:"TAS", complete:true, source_url:tascData.source,
    applicable_year:2026, kind:"senior_course_code",
    note:"This is the 2026 TASC-accredited course list. These identify senior subjects and courses, not individual learning outcomes. Check TASC for future-year syllabus changes and assessment requirements.",
    courses:tascData.courses as SeniorCourseRecord[],
  };
}
