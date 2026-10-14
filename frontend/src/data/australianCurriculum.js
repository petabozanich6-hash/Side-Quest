/**
 * Official Australian home-education resources.
 *
 * Each family chooses its state or territory at sign-up (stored on the family
 * as one of these stable codes). Pages show only that family's entry plus the
 * national resources; use jurisdictionFor(code) to look it up.
 *
 * These links are a directory, NOT automatic curriculum alignment or
 * legal/compliance advice. Review official authority pages before acting.
 */
export const NATIONAL_RESOURCES = [
  {
    title: "Australian Curriculum (Version 9.0)",
    url: "https://v9.australiancurriculum.edu.au/",
    desc: "Explore national learning areas, content descriptions, achievement standards and priorities. States and territories decide how these are used.",
  },
  {
    title: "Australian Curriculum — parent and carer guide",
    url: "https://v9.australiancurriculum.edu.au/help/parent-information",
    desc: "Plain-language information for families about what children learn from Foundation to Year 10.",
  },
  {
    title: "ABC Education",
    url: "https://www.abc.net.au/education",
    desc: "Free Australian videos, games and teaching ideas across subjects and year levels. An optional resource, not a registration authority.",
  },
];

/**
 * The resource categories remain consistent across jurisdictions. Pages filter
 * this list by the family's chosen code. Do not use this data to assign NSW
 * outcome codes elsewhere.
 */
export const AUSTRALIAN_JURISDICTIONS = [
  {
    code: "NSW",
    name: "New South Wales",
    authority: "NSW Department of Education (home schooling); NESA (syllabuses)",
    intro: "NSW registration involves an educational program based on the relevant NSW syllabuses and evidence of learning.",
    focus: "Prepare a suitable learning program, keep dated records and be ready to discuss the program with an Authorised Person.",
    links: [
      { category: "Registration", title: "NSW home schooling and registration", url: "https://www.nsw.gov.au/education-and-training/home-schooling", desc: "Official registration guidance, applications, guidelines and current policy updates." },
      { category: "Curriculum", title: "NSW Curriculum", url: "https://curriculum.nsw.edu.au/", desc: "The official NESA syllabuses, content and outcome descriptions." },
      { category: "Records", title: "Keeping records of learning", url: "https://www.nsw.gov.au/education-and-training/home-schooling/educational-programs/keeping-records", desc: "Examples of work samples, progress notes and evidence to support home schooling reviews." },
      { category: "Planning", title: "Preparing to apply", url: "https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register/preparing-to-apply-for-registration", desc: "How to plan a program, gather resources and prepare for registration." },
    ],
  },
  {
    code: "VIC",
    name: "Victoria",
    authority: "Victorian Registration and Qualifications Authority (VRQA)",
    intro: "Registration includes an individual learning plan addressing the eight learning areas. Families choose their educational approach.",
    focus: "The VRQA does not require you to follow the Victorian or Australian Curriculum exactly; check its learning-plan and review guidance.",
    links: [
      { category: "Registration", title: "VRQA home education", url: "https://www2.vrqa.vic.gov.au/home-education", desc: "Registration, ongoing requirements, reviews and contact information." },
      { category: "Planning", title: "Develop a home education learning plan", url: "https://www2.vrqa.vic.gov.au/develop-home-education-learning-plan", desc: "Learning-plan examples and guidance across the eight key learning areas." },
      { category: "Records", title: "Learning resources and review support", url: "https://www2.vrqa.vic.gov.au/access-support-and-resources-home-education", desc: "VRQA links to learning resources and support for home education." },
      { category: "Curriculum", title: "Victorian Curriculum F–10 Version 2.0", url: "https://f10.vcaa.vic.edu.au/", desc: "Victorian curriculum content, achievement standards and planning references." },
    ],
  },
  {
    code: "QLD",
    name: "Queensland",
    authority: "Queensland Home Education (QHE), Department of Education",
    intro: "Parents register through QHE and demonstrate a high-quality, individualised learning program.",
    focus: "Annual progress reporting and a plan for the following year are important parts of continuing registration.",
    links: [
      { category: "Registration", title: "Registering for home education", url: "https://education.qld.gov.au/schools-educators/other-education/home-education/registration", desc: "QHE eligibility, the application process and program requirements." },
      { category: "Records", title: "Annual reporting requirements", url: "https://education.qld.gov.au/schools-educators/other-education/home-education/reports", desc: "Required reporting forms, work-sample examples and guidance for continuing registration." },
      { category: "Curriculum", title: "Australian Curriculum in Queensland", url: "https://www.qcaa.qld.edu.au/p-10/aciq", desc: "QCAA's Prep–Year 10 Australian Curriculum implementation information for planning reference." },
      { category: "Planning", title: "Queensland home education overview", url: "https://www.qld.gov.au/education/schools/information/programs/homeed", desc: "Queensland Government information about home education and family responsibilities." },
    ],
  },
  {
    code: "WA",
    name: "Western Australia",
    authority: "WA Department of Education; School Curriculum and Standards Authority (SCSA)",
    intro: "Home educators register through the Department of Education and work with a home education moderator.",
    focus: "Keep an education program and evidence of progress for initial and ongoing evaluation meetings.",
    links: [
      { category: "Registration", title: "Register for home education", url: "https://www.education.wa.edu.au/en/register-for-home-education", desc: "WA registration process and regional office contact details." },
      { category: "Records", title: "Preparing for an evaluation meeting", url: "https://www.education.wa.edu.au/en/what-to-expect-at-your-home-education-evaluation-meeting", desc: "What moderators discuss and examples of programs, records and learning evidence." },
      { category: "Curriculum", title: "Western Australian Curriculum", url: "https://k10outline.scsa.wa.edu.au/home/wa-curriculum", desc: "SCSA's official Pre-primary to Year 10 curriculum and achievement standards." },
      { category: "Planning", title: "WA home education hub", url: "https://www.education.wa.edu.au/en/home-schooling", desc: "Official information on responsibilities, designing a learning program and evaluation." },
    ],
  },
  {
    code: "SA",
    name: "South Australia",
    authority: "SA Department for Education — Home Education team",
    intro: "Home education in SA is arranged through an application for exemption from school attendance.",
    focus: "The department's guide explains preparing an education program, assessment meetings and review arrangements.",
    links: [
      { category: "Registration", title: "SA home education information", url: "https://www.sa.gov.au/topics/education-and-learning/schools/alternative-schooling/home-education", desc: "Government overview, eligibility and the application starting point." },
      { category: "Planning", title: "Guide to Home Education in South Australia (PDF)", url: "https://www.education.sa.gov.au/docs/curriculum/guide-to-home-education-in-south-australia.pdf", desc: "Detailed government guide to programs, exemptions, meetings, record-keeping and reviews." },
      { category: "Registration", title: "Request a home education application", url: "https://www.education.sa.gov.au/webforms/request-home-education-application-form", desc: "Official form to request the application documents." },
      { category: "Curriculum", title: "Australian Curriculum — national reference", url: "https://v9.australiancurriculum.edu.au/", desc: "National curriculum material for lesson planning. Consult the SA guide for the requirements that apply to your family." },
    ],
  },
  {
    code: "TAS",
    name: "Tasmania",
    authority: "Office of the Education Registrar (OER)",
    intro: "Tasmanian home education is registered and monitored through the OER, with an individual home education program.",
    focus: "Home Education Programs (HEPs) and annual summaries/programs (HESPs) are framed around ten home education standards, not mandatory Australian Curriculum outcomes.",
    links: [
      { category: "Registration", title: "New home education registration", url: "https://oer.tas.gov.au/home-education-registration/register-for-home-education/", desc: "Official application guidance and requirements for a new home educator." },
      { category: "Planning", title: "Home education program templates", url: "https://oer.tas.gov.au/home-education-registration/he-program-templates-and-examples/", desc: "OER templates and examples for documenting an individual program." },
      { category: "Records", title: "Writing your HESP", url: "https://oer.tas.gov.au/home-education-registration/understanding-the-standards/writing-your-home-education-summary-and-program-hesp/", desc: "Guidance on annual learning summaries, plans and evidence of progress." },
      { category: "Curriculum", title: "Australian Curriculum — optional planning resource", url: "https://v9.australiancurriculum.edu.au/", desc: "Explore national subject content if useful. The OER advises a specific purchased or Australian Curriculum program is not compulsory." },
    ],
  },
  {
    code: "ACT",
    name: "Australian Capital Territory",
    authority: "ACT Education Directorate — Home Education team",
    intro: "Families register for home education and document the learning opportunities they provide.",
    focus: "Check requirements for the Statement of Intent, annual Home Education Report and registration renewal.",
    links: [
      { category: "Registration", title: "ACT home education and registration", url: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling", desc: "Official registration, eligibility, renewal and contact guidance." },
      { category: "Records", title: "ACT Home Education Report guidance", url: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling", desc: "The ACT page includes annual reporting expectations and optional example templates." },
      { category: "Planning", title: "ACT Statement of Intent guidance", url: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling", desc: "Information about preparing and submitting the statement of educational approach." },
      { category: "Curriculum", title: "Australian Curriculum — national reference", url: "https://v9.australiancurriculum.edu.au/", desc: "Browse subject content for your program; refer to the ACT Directorate for your registration obligations." },
    ],
  },
  {
    code: "NT",
    name: "Northern Territory",
    authority: "NT Department of Education and Training",
    intro: "Home education requires an approved learning program. NT guidance specifies alignment with Australian Curriculum requirements.",
    focus: "Plan, teach, assess and keep evidence of learning. Approval and renewal arrangements are set by the NT department.",
    links: [
      { category: "Registration", title: "Northern Territory home education", url: "https://nt.gov.au/learning/primary-and-secondary-students/home-education", desc: "Official eligibility, program expectations, approvals and ongoing responsibilities." },
      { category: "Registration", title: "Apply for home education online", url: "https://service.nt.gov.au/services/education-training/apply-home-education", desc: "NT Government's online application service and required supporting documents." },
      { category: "Records", title: "NT teaching and evidence requirements", url: "https://nt.gov.au/learning/primary-and-secondary-students/home-education", desc: "Read the department's instructions on planning, progress evidence and reviews." },
      { category: "Curriculum", title: "Australian Curriculum — Version 9.0", url: "https://v9.australiancurriculum.edu.au/", desc: "The Australian Curriculum referenced by NT home education program guidance." },
    ],
  },
];

export const JURISDICTION_CODES = AUSTRALIAN_JURISDICTIONS.map(({ code }) => code);

export const jurisdictionFor = (code) => AUSTRALIAN_JURISDICTIONS.find((j) => j.code === code) || null;

/** NSW syllabus outcomes are the only verified outcome list loaded. Never assumed for a family that hasn't chosen. */
export const usesNswOutcomes = (code) => code === "NSW";
