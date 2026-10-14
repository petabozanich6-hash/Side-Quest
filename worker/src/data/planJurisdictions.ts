// What each Australian state and territory asks of a home education learning plan.
// Summarised from the official pages listed in `sources` (checked 14 October 2026). This is planning guidance for the
// AI and the template, not legal advice: rules change, so every plan tells the parent to confirm with the authority.
// Keep wording factual; never claim a plan "meets" or "is approved under" any jurisdiction's rules.

export type JurisdictionCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type Jurisdiction = {
  code: JurisdictionCode;
  name: string;
  /** Who registers or approves home education. */
  authority: string;
  /** The person or process that looks at the plan. Used for the "Notes for ..." heading. */
  reviewer: string;
  notesHeading: string;
  /** What the plan is called locally. */
  planName: string;
  /** Curriculum position in one sentence. */
  curriculum: string;
  /** Whether a curriculum is mandatory for the plan. */
  curriculumRequired: boolean;
  /** Whether Side-Quest holds an outcome list for this jurisdiction (only NSW today). Codes are never invented. */
  outcomeCodes: boolean;
  /** Name for the first year of school. */
  foundationYear: string;
  /** Learning areas the plan is organised by (primary years). */
  areas: string[];
  /** Secondary (Years 7-10) organisation, when it differs from `areas`. */
  secondary?: { required: string[]; chooseTwoFrom?: string[]; note: string };
  /** The elements the authority looks for in a plan, used for the requirements checklist. */
  requirements: string[];
  /** Extra writing guidance for the AI. */
  guidance: string[];
  sources: { title: string; url: string }[];
};

const AC_AREAS = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "The Arts", "Technologies", "Health and Physical Education", "Languages"];

export const JURISDICTIONS: Record<JurisdictionCode, Jurisdiction> = {
  NSW: {
    code: "NSW",
    name: "New South Wales",
    authority: "NSW Department of Education Home Schooling Unit, with NESA syllabuses",
    reviewer: "Authorised Person",
    notesHeading: "Notes for the Authorised Person",
    planName: "educational program (teaching and learning plan)",
    curriculum: "The program must be based on, and taught in accordance with, the relevant NESA syllabuses. Parents choose which stage to use for each subject.",
    curriculumRequired: true,
    outcomeCodes: true,
    foundationYear: "Kindergarten",
    areas: ["English", "Mathematics", "Science and Technology", "HSIE (Geography and/or History)", "PDHPE", "Creative Arts"],
    secondary: {
      required: ["English", "Mathematics", "Science", "HSIE (Geography, History and/or another HSIE syllabus)"],
      chooseTwoFrom: ["PDHPE", "Creative Arts", "Languages", "Technology"],
      note: "Years 7-10 study English, Mathematics, Science and HSIE, plus two further subjects chosen by the parent, each from a different key learning area (PDHPE, Creative Arts, Languages or Technology).",
    },
    requirements: [
      "Based on and taught in accordance with the relevant NESA syllabuses",
      "Covers each required key learning area for the child's stage",
      "Suits the child's interests and needs",
      "Shows how teaching and learning will happen over the registration period",
      "Has a method for recording progress and keeping dated evidence (the program includes its records)",
    ],
    guidance: [
      "Use NSW terms: Stages, key learning areas, NESA syllabuses, Authorised Person.",
      "Link each area to syllabus outcomes ONLY by choosing codes from the outcome list provided. If no list is provided for an area, describe the syllabus focus in words and add no codes.",
    ],
    sources: [
      { title: "NSW home schooling: educational programs", url: "https://www.nsw.gov.au/education-and-training/home-schooling/educational-programs" },
      { title: "NSW registration guidelines: curriculum overview", url: "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/curriculum-overview" },
    ],
  },
  VIC: {
    code: "VIC",
    name: "Victoria",
    authority: "Victorian Registration and Qualifications Authority (VRQA)",
    reviewer: "VRQA review",
    notesHeading: "Notes for a VRQA review",
    planName: "home education learning plan",
    curriculum: "Families do not have to follow the Victorian Curriculum or the Australian Curriculum, but the program must substantially address the eight learning areas.",
    curriculumRequired: false,
    outcomeCodes: false,
    foundationYear: "Foundation",
    areas: ["English", "Mathematics", "Sciences", "Humanities (including history, geography and economics)", "The Arts", "Technologies", "Health and Physical Education", "Languages"],
    requirements: [
      "Child's full name and date of birth (added by the parent, not by Side-Quest)",
      "The subject matter the child will cover, substantially addressing all eight learning areas",
      "Where and when learning will take place",
      "The main methods used to record learning",
      "Specific resources for each area (full book titles, websites, apps or named services)",
      "Any learning area exemptions and whether the child is partially enrolled at a school",
      "Optional: a summary of the child's needs, strengths and interests, without specific medical information",
    ],
    guidance: [
      "Address all eight learning areas. Say where and when learning happens.",
      "The VRQA expects named resources. Never invent book titles, apps or websites: describe the kind of resource and list it under 'parent_to_complete' so the parent names the actual ones.",
      "Do not include medical information.",
    ],
    sources: [
      { title: "VRQA: develop a home education learning plan", url: "https://www2.vrqa.vic.gov.au/develop-home-education-learning-plan" },
    ],
  },
  QLD: {
    code: "QLD",
    name: "Queensland",
    authority: "Queensland Home Education (QHE), Department of Education",
    reviewer: "Queensland Home Education unit",
    notesHeading: "Notes for the QHE summary and annual report",
    planName: "summary of the educational program",
    curriculum: "No curriculum is mandated. The program must give a high-quality education suited to the child's age, ability, aptitude and development. QHE offers optional templates, including an Australian Curriculum yearly overview.",
    curriculumRequired: false,
    outcomeCodes: false,
    foundationYear: "Prep",
    areas: AC_AREAS,
    requirements: [
      "Background on the child's learning needs and experience",
      "Aims or goals for the year",
      "A summary of planned topics and activities",
      "Why these meet the child's needs",
      "How the learning environment supports learning and wellbeing",
      "How progress will be tracked and responded to",
      "At renewal: a written report on educational progress and an updated program summary for the next year",
    ],
    guidance: [
      "Write it as a summary: it does not need to list everything planned for the year.",
      "Explain WHY the planned learning suits this child, and how the home environment supports learning and wellbeing.",
      "The Australian Curriculum learning areas are used here only as an organising reference.",
    ],
    sources: [
      { title: "QHE: registering for home education", url: "https://education.qld.gov.au/schools-educators/other-education/home-education/registration" },
      { title: "QHE: reporting requirements", url: "https://education.qld.gov.au/schools-educators/other-education/home-education/reports" },
    ],
  },
  WA: {
    code: "WA",
    name: "Western Australia",
    authority: "WA Department of Education (regional education office)",
    reviewer: "home education moderator",
    notesHeading: "Notes for the moderator's evaluation meeting",
    planName: "education program",
    curriculum: "The program does not have to follow the Western Australian Curriculum; its eight learning areas are a useful reference.",
    curriculumRequired: false,
    outcomeCodes: false,
    foundationYear: "Pre-primary",
    areas: AC_AREAS,
    requirements: [
      "What the child will learn",
      "How the child will learn",
      "How progress will be monitored and recorded",
      "Reflects the child's individual needs, strengths, interests and learning goals",
      "Examples of progress collected over time for evaluation meetings with a moderator",
    ],
    guidance: [
      "Use WA terms: education program, home education moderator, evaluation meeting, Pre-primary.",
      "Organise by the eight WA Curriculum learning areas as a reference, without claiming formal alignment.",
    ],
    sources: [
      { title: "WA: develop an education program", url: "https://www.education.wa.edu.au/develop-an-education-program" },
      { title: "WA: evaluation meetings", url: "https://www.education.wa.edu.au/what-to-expect-at-your-home-education-evaluation-meeting" },
    ],
  },
  SA: {
    code: "SA",
    name: "South Australia",
    authority: "SA Department for Education, Home Education unit (exemption from school attendance)",
    reviewer: "Home Education unit's annual review",
    notesHeading: "Notes for the annual review",
    planName: "home education program",
    curriculum: "The program must meet the goals of the Australian Curriculum (or similar) and cover the eight learning areas, planned for a 12-month period.",
    curriculumRequired: true,
    outcomeCodes: false,
    foundationYear: "Reception",
    areas: AC_AREAS,
    requirements: [
      "Covers the eight Australian Curriculum learning areas over a 12-month period",
      "Specific topics, activities or units for each learning area",
      "Named resources for each learning area",
      "Strategies and tools to monitor progress (observation, recording, comparison, discussion or formal testing)",
      "A suitable learning environment and opportunities for social interaction",
      "Clear evidence of learning in literacy and numeracy, which is prioritised at review",
    ],
    guidance: [
      "Give specific topics or units for every learning area. Make literacy and numeracy evidence prominent.",
      "Never invent resource titles: describe the kind of resource and list naming them under 'parent_to_complete'.",
      "Mention opportunities for social interaction.",
    ],
    sources: [
      { title: "SA Government: home education", url: "https://www.sa.gov.au/topics/education-and-learning/schools/alternative-schooling/home-education" },
      { title: "Guide to home education in South Australia", url: "https://www.education.sa.gov.au/docs/sa.gov/guide-to-home-education-in-south-australia.pdf" },
    ],
  },
  TAS: {
    code: "TAS",
    name: "Tasmania",
    authority: "Office of the Education Registrar (OER)",
    reviewer: "Office of the Education Registrar",
    notesHeading: "Notes for the OER (Home Education Summary and Program)",
    planName: "Home Education Summary and Program (HESP)",
    curriculum: "There is no requirement to follow the Australian Curriculum or any particular curriculum. Programs are assessed against the home education standards.",
    curriculumRequired: false,
    outcomeCodes: false,
    foundationYear: "Prep",
    areas: ["Literacy", "Numeracy", "Science", "History and Geography", "Technologies", "The Arts", "Health, Physical Education and Wellbeing", "Civics, Citizenship, Economics and Business"],
    requirements: [
      "Literacy standard",
      "Numeracy standard",
      "Range of Learning Areas standard: a broad range of areas suited to the child, each identified (not every area is required)",
      "Wellbeing standard",
      "Pedagogy standard: how the child will be taught",
      "Evaluation standard: how progress will be evaluated",
      "At renewal: a summary, a plan and an evaluation for each standard",
    ],
    guidance: [
      "Use OER terms: HESP, home education standards. Literacy and Numeracy are standards of their own, separate from the range of learning areas.",
      "The OER asks parents to write the HESP from their own research and reflection, so write it as an editable draft in the parent's voice and ask them to personalise it.",
    ],
    sources: [
      { title: "OER: understanding the standards", url: "https://oer.tas.gov.au/home-education/understanding-the-standards/" },
      { title: "OER: range of learning areas", url: "https://oer.tas.gov.au/home-education/understanding-the-standards/range-of-learning-areas/" },
    ],
  },
  ACT: {
    code: "ACT",
    name: "Australian Capital Territory",
    authority: "ACT Education Directorate, Home Education team",
    reviewer: "ACT Home Education team",
    notesHeading: "Notes for the Statement of Intent and annual report",
    planName: "Statement of Intent",
    curriculum: "The Australian Curriculum is not required, though parents are encouraged to be aware of it. The Directorate looks for balanced intellectual, social, emotional and physical development.",
    curriculumRequired: false,
    outcomeCodes: false,
    foundationYear: "Kindergarten",
    areas: AC_AREAS,
    requirements: [
      "A plan for providing a high-quality education (Statement of Intent, due within 3 months of registration)",
      "The educational opportunities offered and strategies used to encourage learning",
      "How the approach supports spiritual, emotional, physical, social and intellectual development",
      "How it values the child's individual needs and interests",
      "How it prepares the child to be an independent, effective local and global citizen",
      "Annual report (by 31 December): progress intellectually (including literacy and numeracy), socially and emotionally, and physically",
      "Records of learning such as journals, dated work samples and photos",
    ],
    guidance: [
      "Address spiritual, emotional, physical, social and intellectual development explicitly, and citizenship.",
      "Keep spiritual development neutral and family-led; never assume a religion.",
    ],
    sources: [
      { title: "ACT: home education", url: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling" },
    ],
  },
  NT: {
    code: "NT",
    name: "Northern Territory",
    authority: "NT Department of Education and Training, Home Education unit",
    reviewer: "NT Home Education unit",
    notesHeading: "Notes for the NT Home Education unit",
    planName: "teaching, learning and assessment plan",
    curriculum: "The program must meet Australian Curriculum requirements. A self-developed program must be written on the department's own template, so use this draft to fill in that template.",
    curriculumRequired: true,
    outcomeCodes: false,
    foundationYear: "Transition",
    areas: AC_AREAS,
    requirements: [
      "Meets Australian Curriculum requirements",
      "Clearly shows each subject, its content, assessment tasks and resources",
      "Written on the department's template (or a commercial Australian Curriculum aligned program)",
      "Evidence kept for each learning area, consistent with the planned topics and assessment tasks",
      "Approval lasts one school year; reapply each year",
    ],
    guidance: [
      "For every area give the content (topics), at least one assessment task, and the kind of resources.",
      "Remind the parent that the NT only accepts its own template or a commercial program, so this is the working draft to transfer.",
    ],
    sources: [
      { title: "NT Government: home education", url: "https://nt.gov.au/learning/primary-and-secondary-students/home-education" },
    ],
  },
};

export const JURISDICTION_CODES = Object.keys(JURISDICTIONS) as JurisdictionCode[];
export const CHECKED_ON = "2026-10-14";

export function asJurisdiction(v: unknown): JurisdictionCode | null {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return (JURISDICTION_CODES as string[]).includes(s) ? (s as JurisdictionCode) : null;
}

const SECONDARY_STAGES = new Set(["S4", "S5"]);
const STAGE_YEARS: Record<string, string> = { ES1: "F", S1: "1-2", S2: "3-4", S3: "5-6", S4: "7-8", S5: "9-10", S6: "11-12" };

/** "Year 3", "Prep", "Years 7-8": the child's level in this jurisdiction's words. */
export function levelFor(j: Jurisdiction, student: { stage?: unknown; year_level?: unknown }): string {
  const y = String(student.year_level ?? "").trim();
  const stage = String(student.stage ?? "");
  if (/^(k|f|0|prep|kindy|kindergarten|foundation|reception|transition|pre-?primary)$/i.test(y) || (!y && stage === "ES1")) return j.foundationYear;
  if (/^\d{1,2}$/.test(y)) return `Year ${y}`;
  const r = STAGE_YEARS[stage];
  return r ? (r === "F" ? j.foundationYear : `Years ${r}`) : "";
}

export function isSecondary(student: { stage?: unknown; year_level?: unknown }): boolean {
  const y = Number(student.year_level);
  if (Number.isInteger(y) && y >= 1) return y >= 7 && y <= 10;
  return SECONDARY_STAGES.has(String(student.stage ?? ""));
}

/** Map one of the app's NSW-style area names to this jurisdiction's name for it. */
const AREA_ALIAS: Array<[RegExp, Partial<Record<JurisdictionCode | "AC", string>>]> = [
  [/^english$/i, { AC: "English", TAS: "Literacy" }],
  [/^math/i, { AC: "Mathematics", TAS: "Numeracy" }],
  [/^science/i, { AC: "Science", VIC: "Sciences" }],
  [/^hsie|human society|history|geography/i, { AC: "Humanities and Social Sciences", VIC: "Humanities (including history, geography and economics)", TAS: "History and Geography" }],
  [/^pdhpe|personal development|health/i, { AC: "Health and Physical Education", TAS: "Health, Physical Education and Wellbeing" }],
  [/^creative|arts?$|visual|music|drama|dance/i, { AC: "The Arts" }],
  [/^tas$|technolog/i, { AC: "Technologies" }],
  [/^language|lote/i, { AC: "Languages" }],
];
export function areaName(j: Jurisdiction, area: string): string {
  if (j.code === "NSW") return area;
  for (const [re, names] of AREA_ALIAS) if (re.test(area.trim())) return names[j.code] || names.AC || area;
  return area;
}

/** The areas a plan for this child must contain, in this jurisdiction's words, plus any extra areas the parent asked for. */
export function planAreas(j: Jurisdiction, student: { stage?: unknown; year_level?: unknown }, focus: string[] = [], courses: string[] = []): { areas: string[]; note: string } {
  const extra = focus.map((a) => areaName(j, a));
  if (j.code === "NSW" && isSecondary(student) && j.secondary) {
    const core = /^(english|math|science|hsie|history|geography|commerce|aboriginal)/i;
    const pool = [...courses, ...focus].filter((a) => !core.test(a.trim()));
    const chosen = [...new Set(pool)];
    const areas = [...j.secondary.required, ...chosen];
    return { areas: [...new Set(areas)], note: chosen.length >= 2 ? j.secondary.note : `${j.secondary.note} The parent has not chosen both of these yet, so the plan flags it.` };
  }
  return { areas: [...new Set([...j.areas, ...extra])], note: "" };
}
