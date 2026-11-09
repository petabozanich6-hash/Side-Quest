// Research-oriented document requirements matrices, NOT approvals.
// Educational plan catalogue is shared with subscriber learning plans; this
// more granular mapping is needed for consumer products and independent review.
// Each matrix needs sign-off and source re-verification before publication.
export type DocumentRequirement = {
  id: string;
  requirement: string;
  section: string;
  parentPrompt: string;
  evidence: string;
  sourceUrl: string;
};
export type DocumentSpec = {
  code: string;
  documentType: string;
  label: string;
  applicability: string;
  reviewedAgainstSourcesOn: string;
  releaseStatus: "research_draft";
  policyWarning?: string;
  requirements: DocumentRequirement[];
  sources: { title: string; url: string }[];
};

const NSW_REQUIREMENTS = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/requirements-for-registration";
const NSW_PREPARE = "https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register/preparing-to-apply-for-registration";
const NSW_CURRICULUM = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/registration-at-a-glance";
const NSW_AP = "https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register/assessment-by-an-authorised-person";
const NSW_HOME = "https://www.nsw.gov.au/education-and-training/home-schooling";

export const DOCUMENT_SPECS: Record<string, DocumentSpec> = {
  NSW: {
    code: "NSW",
    documentType: "educational_program",
    label: "NSW Educational Program and AP Preparation",
    applicability: "Kindergarten to Year 10 planning and recordkeeping. Year 11–12 senior curriculum requires separate planning and review.",
    reviewedAgainstSourcesOn: "2026-11-10",
    releaseStatus: "research_draft",
    policyWarning: "NSW consulted on revised policies in 2026. The current published guidelines remain in effect until replacement policies are finalised. Recheck before every publication.",
    sources: [
      { title: "NSW registration requirements", url: NSW_REQUIREMENTS },
      { title: "Preparing an educational program", url: NSW_PREPARE },
      { title: "Curriculum stages and learning areas", url: NSW_CURRICULUM },
      { title: "Authorised Person assessment", url: NSW_AP },
      { title: "Policy status", url: NSW_HOME },
    ],
    requirements: [
      {
        id: "nesa-curriculum",
        requirement: "Program based on, and taught in accordance with, relevant current NESA syllabuses and minimum learning areas",
        section: "Curriculum and subject-by-subject learning plan",
        parentPrompt: "For every required subject, identify the current syllabus, child's stage, focus or outcomes, learning experiences, resources and how learning will be checked. Explain adaptations without inventing syllabus codes.",
        evidence: "Stage/subject outline with NESA links, resources, dated learning samples and mapped progress where applicable",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "individual-needs",
        requirement: "Program suitable for the child's identified learning needs",
        section: "Learner profile and adjustments",
        parentPrompt: "Describe the child's interests, strengths, starting point, learning needs and planned teaching adjustments in everyday educational terms. Avoid unnecessary medical information.",
        evidence: "Individualised goals, methods, examples of adjustments and progress review approach",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "planning-supervision",
        requirement: "Adequate system for planning, supervising and recording teaching and learning experiences",
        section: "Teaching approach and activity records",
        parentPrompt: "Explain how learning will be planned and supervised and demonstrate how you'll keep dated records of what happened.",
        evidence: "Sample weekly plan, dated learning activity log, projects, photos or annotated work as appropriate",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "progress",
        requirement: "Adequate system for recording progress and achievement",
        section: "Assessment, progress and reflection",
        parentPrompt: "Explain what you'll observe or assess, how often you'll review it, where evidence goes, and how you'll respond when progress differs from the plan.",
        evidence: "Progress tracker linked to learning goals, dated annotated samples and review notes",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "time",
        requirement: "Sufficient time allocated to learning for curriculum coverage",
        section: "Learning rhythm and time allocation",
        parentPrompt: "Describe the typical learning rhythm and time available across required subjects, including how flexible routines still provide appropriate coverage.",
        evidence: "Indicative timetable or routines and examples of learning records",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "environment",
        requirement: "Home learning environment suitable for effective home schooling",
        section: "Learning environments",
        parentPrompt: "Describe the main learning spaces, safe storage and access to suitable locations or community resources.",
        evidence: "Description of practical learning environment and how it supports the proposed program",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "resources",
        requirement: "Adequate resources to support the child's learning",
        section: "Learning resources register",
        parentPrompt: "Name the actual books, websites, subscriptions, equipment, community locations and other resources available or planned for each area.",
        evidence: "Resource list linked to subjects and learning activities",
        sourceUrl: NSW_REQUIREMENTS,
      },
      {
        id: "implementation",
        requirement: "Keep records showing how the planned program is actually delivered",
        section: "Implementation evidence register",
        parentPrompt: "Record the date, subject, activity, learning observed, progress and location of each piece of evidence. Do not pretend future activities have already occurred.",
        evidence: "Dated evidence index and sample work for renewal or current registrations",
        sourceUrl: NSW_PREPARE,
      },
      {
        id: "ap-visit",
        requirement: "Be ready to discuss educational program and records with the Authorised Person",
        section: "AP review preparation",
        parentPrompt: "Identify where the program, teaching records, progress measures, learning environment information and resources can be shown. Distinguish new applications from renewals.",
        evidence: "Parent-prepared overview and evidence location checklist; not a government AP form",
        sourceUrl: NSW_AP,
      },
    ],
  },
};

export function documentSpec(code: string): DocumentSpec | null {
  return DOCUMENT_SPECS[code] || null;
}
