// Official government links and plain-English navigation, reviewed 16 October 2026.
// Links are references only: no government content is copied into Side-Quest.
// Re-check sources regularly; an application, approval or exemption is never issued by Side-Quest.
export const COMPASS_REVIEWED_ON = "2026-10-16";

const steps = (understand, prepare, program, apply, review, maintain) => [
  { id: "understand", title: "Understand the rules", detail: understand },
  { id: "prepare", title: "Get your information ready", detail: prepare },
  { id: "program", title: "Plan your child's education", detail: program },
  { id: "apply", title: "Apply through the official authority", detail: apply },
  { id: "assessment", title: "Follow the assessment process", detail: review },
  { id: "maintain", title: "Keep records and check ongoing requirements", detail: maintain },
];

export const COMPASS_GUIDES = {
  NSW: {
    name: "New South Wales", authority: "NSW Department of Education – Home Schooling Directorate",
    summary: "Register each child through the NSW Department of Education. Prepare an educational program using the relevant NSW syllabuses and be ready for an Authorised Person's assessment.",
    beforeLeavingSchool: "A child of compulsory school age must remain enrolled and attending school unless they hold current home schooling registration or another lawful exemption. Do not assume an application alone authorises withdrawal.",
    whatToPrepare: ["Child identity document", "Two NSW residential address documents", "Relevant court or guardian documents, where applicable", "Child-specific educational program and records for assessment"],
    renewal: "Registration has an expiry date. Apply to renew before that date and prepare updated plans and evidence for an assessment; check the current NSW Guidelines.",
    steps: steps(
      "Read the current registration guidelines. Home schooling registration moved from NESA to the NSW Department of Education in May 2025.",
      "Gather proof of your child's identity, two documents confirming the NSW home address and any relevant legal documents.",
      "Prepare a child-specific program based on the appropriate NESA syllabuses, including how you will teach, assess and keep records.",
      "Use the Home Schooling Platform with your Service NSW account, or follow the official paper/email option if needed.",
      "An Authorised Person assesses initial and renewal applications, including a home visit. Keep your program and teaching records accessible.",
      "Keep learning records and your registration certificate. Check its expiry date and follow the renewal process."
    ),
    links: [
      { label: "How to apply and application forms", url: "https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register/submitting-an-application", category: "Registration" },
      { label: "Home Schooling Platform", url: "https://homeschool.enrol.education.nsw.gov.au/", category: "Apply" },
      { label: "Registration guidelines", url: "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/requirements-for-registration", category: "Requirements" },
      { label: "NSW Curriculum", url: "https://curriculum.nsw.edu.au/", category: "Curriculum" },
    ],
  },
  VIC: {
    name: "Victoria", authority: "Victorian Registration and Qualifications Authority (VRQA)",
    summary: "Apply to the VRQA with a separate learning plan for each child. Your plan should address the eight key learning areas unless an exemption is granted.",
    beforeLeavingSchool: "Children currently enrolled at school must keep attending during the application process. Wait for formal registration approval before withdrawing.",
    whatToPrepare: ["Child identity evidence", "Evidence of parental responsibility", "Relevant court orders and consent where required", "Individual learning plan covering eight key areas"],
    renewal: "VRQA registers home educated children and selects some families for review. Check your registration conditions and respond if selected.",
    steps: steps(
      "Read VRQA requirements, the eight learning areas and the rules for partial school enrolment and exemptions.",
      "Prepare identity and parental-responsibility evidence and any court orders/consent that applies.",
      "Write a learning plan for each child across eight learning areas. You may choose your own educational approach; the Victorian Curriculum itself is not compulsory.",
      "Complete the VRQA form and email your application, learning plan and evidence as instructed on its registration page.",
      "VRQA assesses the documents in your application and may request further information. Your child must remain enrolled in school until the application is approved.",
      "Keep learning activities and records. VRQA may choose your registration for review."
    ),
    links: [
      { label: "Register to home educate", url: "https://www2.vrqa.vic.gov.au/register-home-educate", category: "Apply" },
      { label: "Develop a learning plan", url: "https://www2.vrqa.vic.gov.au/develop-home-education-learning-plan", category: "Planning" },
      { label: "Understand reviews", url: "https://www2.vrqa.vic.gov.au/understand-home-education-reviews", category: "Records" },
      { label: "Victorian Curriculum F–10", url: "https://f10.vcaa.vic.edu.au/", category: "Curriculum" },
    ],
  },
  QLD: {
    name: "Queensland", authority: "Queensland Home Education (QHE), Department of Education",
    summary: "Apply for ongoing home education registration with a summary of the child's proposed learning program. QHE offers online, email and post options.",
    beforeLeavingSchool: "QHE says a child cannot be enrolled in school and registered for home education at the same time. Once a complete ongoing registration application is lodged, the child is provisionally registered; follow QHE's guidance for the transition.",
    whatToPrepare: ["Child's birth certificate or accepted identity evidence", "Proof of parental responsibility and relevant court orders", "Educational program summary", "Completed QHE application"],
    renewal: "Ongoing registration involves an annual report on educational progress. Check QHE's current reporting instructions and due dates.",
    steps: steps(
      "Review QHE eligibility and the difference between ongoing and temporary 60-day provisional registration.",
      "Gather proof of age, parental responsibility, court orders if any, and contact details.",
      "Prepare an educational program summary explaining how you will provide high-quality education and monitor progress.",
      "Apply using QHE's approved online or downloadable registration form with attachments.",
      "A complete ongoing application gives provisional registration while QHE considers it; keep your acknowledgement and respond to queries.",
      "Maintain work samples and complete the annual progress report for ongoing registration."
    ),
    links: [
      { label: "Register for home education", url: "https://education.qld.gov.au/schools-and-educators/other-education/Pages/registration.aspx", category: "Apply" },
      { label: "Approved forms and planning examples", url: "https://education.qld.gov.au/schools-educators/other-education/home-education/forms-and-resources", category: "Planning" },
      { label: "Home education FAQ", url: "https://education.qld.gov.au/schools-and-educators/other-education/Pages/frequently-asked-questions.aspx", category: "Records" },
      { label: "Australian Curriculum v9", url: "https://v9.australiancurriculum.edu.au/", category: "Curriculum" },
    ],
  },
  WA: {
    name: "Western Australia", authority: "WA Department of Education – regional education offices",
    summary: "Register as a home educator through your local WA education regional office. A home education moderator is assigned to evaluate the educational program and progress.",
    beforeLeavingSchool: "Registration changes your child's school enrolment. Contact the school and regional office about the transition; if leaving an existing school, WA says to register within 14 days.",
    whatToPrepare: ["Child's proof of identity and date of birth", "WA residential address and contact information", "Guardianship documents, court orders or visa if relevant", "Information about your education program"],
    renewal: "Maintain registration requirements and arrange evaluation meetings with your moderator. Follow your regional office's advice for updates.",
    steps: steps(
      "Read WA's responsibilities and eligibility, including residency and registration timing.",
      "Contact your regional education office to obtain the registration form and gather identity and guardianship evidence.",
      "Outline the educational program suited to your child and how their progress will be shown.",
      "Complete and lodge the official registration form with your regional office.",
      "After registration you receive a certificate and are assigned a moderator for evaluation meetings.",
      "Keep records of educational progress and participate in required moderator evaluations."
    ),
    links: [
      { label: "Register for home education", url: "https://www.education.wa.edu.au/register-for-home-education", category: "Apply" },
      { label: "Home educator responsibilities", url: "https://www.education.wa.edu.au/home-educator-responsibilities-and-registration", category: "Requirements" },
      { label: "WA education home page", url: "https://www.education.wa.edu.au/home-schooling", category: "Resources" },
      { label: "WA Curriculum (SCSA)", url: "https://k10outline.scsa.wa.edu.au/", category: "Curriculum" },
    ],
  },
  SA: {
    name: "South Australia", authority: "SA Department for Education – Home Education team",
    summary: "South Australia uses a home education exemption process. First request an application form and read the government's home education guide.",
    beforeLeavingSchool: "Students must continue attending school until an exemption is approved. In some cases, a principal may grant up to one month of temporary exemption after receiving confirmation from the Home Education office that an application was lodged.",
    whatToPrepare: ["Family and child contact information", "Current school details", "Individual educational program", "Learning resources, environment and progress-monitoring approach"],
    renewal: "Home education exemption arrangements require ongoing compliance and renewal. Check your approval and the current SA guide for dates.",
    steps: steps(
      "Read the South Australian Home Education guide and how the exemption process works.",
      "Request the application form through the Department for Education webform; it will be sent by email.",
      "Prepare a program that meets the Australian Curriculum goals or similar, including progress monitoring, resources and social opportunities.",
      "Complete the application sent by the Home Education team and follow their submission instructions.",
      "Work with the Home Education team during assessment. Your child must keep attending school unless a valid exemption has been approved; check whether a principal-approved short-term exemption is available.",
      "Save your exemption terms and program records, and check your renewal requirements."
    ),
    links: [
      { label: "South Australia home education guide", url: "https://www.sa.gov.au/topics/education-and-learning/schools/alternative-schooling/home-education", category: "Registration" },
      { label: "Request an application form", url: "https://www.education.sa.gov.au/webforms/request-home-education-application-form", category: "Apply" },
      { label: "Exemption and school attendance", url: "https://www.sa.gov.au/topics/education-and-learning/schools/school-life/exemption-from-attending-school", category: "Requirements" },
      { label: "Australian Curriculum v9", url: "https://v9.australiancurriculum.edu.au/", category: "Curriculum" },
    ],
  },
  TAS: {
    name: "Tasmania", authority: "Office of the Education Registrar (OER)",
    summary: "Apply to the OER with a child-specific home education program addressing Tasmania's ten standards. Tasmania does not require families to use the Australian Curriculum.",
    beforeLeavingSchool: "The OER's current application form says children must remain enrolled and attending an education institution until provisional registration is granted.",
    whatToPrepare: ["OER home education application form", "Individual Home Education Program (HEP) addressing ten standards", "Any legal or other supporting information requested in the official guide"],
    renewal: "After the first year, provide a separate Home Education Summary and Program (HESP) annually for each child.",
    steps: steps(
      "Read the OER guide for new home education registrations and the ten standards.",
      "Follow the OER's latest guide and complete its application form as directed, including certified proof of identity and any relevant legal documents.",
      "Prepare a separate HEP in your own words addressing the ten standards, including learning approaches, literacy, numeracy, wellbeing and evaluation.",
      "Submit the application and each child's HEP to the OER using the current guide's instructions; the 2025 guide describes an online form.",
      "Keep schooling arrangements in place until provisional registration is granted; liaise with the assigned registration officer about assessment.",
      "Keep learning records and prepare the annual HESP with the previous year's summary and next year's program."
    ),
    links: [
      { label: "Service Tasmania: how to apply", url: "https://www.service.tas.gov.au/services/education-and-skills/schools/apply-for-home-education/", category: "Registration" },
      { label: "OER: new registration guide (PDF)", url: "https://oer.tas.gov.au/wp-content/uploads/2025/07/VD4228-Office-of-the-Education-Registrar_NEW-Registration_FINAL.pdf", category: "Requirements" },
      { label: "OER: application form (March 2025 PDF; check for updates)", url: "https://oer.tas.gov.au/wp-content/uploads/2025/05/Home-Education-Application-Form-March-2025-OER-007-V9.pdf", category: "Apply" },
      { label: "OER: understanding the standards (PDF)", url: "https://oer.tas.gov.au/wp-content/uploads/2023/10/Understanding-the-Standards-Sept-2023-FINAL-2.pdf", category: "Planning" },
    ],
  },
  ACT: {
    name: "Australian Capital Territory", authority: "ACT Education Directorate – Home Education team",
    summary: "Apply online with certified supporting documents. Submit a Statement of Intent within three months of registration commencing and report on learning annually.",
    beforeLeavingSchool: "The ACT says a family can begin home educating after submitting a complete application. Follow its instructions about notifying the school if changing full-time enrolment.",
    whatToPrepare: ["Certified child birth certificate or passport", "Certified evidence of parental responsibility where needed", "Certified ACT residency evidence", "Statement of Intent following registration"],
    renewal: "Apply for renewal at least three months before the registration certificate expires. Annual Home Education Reports are required.",
    steps: steps(
      "Read ACT eligibility, registration conditions and the annual reporting requirement.",
      "Get certified identity, ACT residence and parental responsibility documents as described by the ACT government.",
      "Plan educational opportunities and learning strategies. A Statement of Intent is due within three months after registration starts.",
      "Submit the complete online registration application and keep the reference number.",
      "The ACT reviews the complete application and invites you to an online review meeting during the first three months.",
      "Submit annual reports. Renew at least three months before your registration expiry date."
    ),
    links: [
      { label: "ACT registration, forms and renewal", url: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling", category: "Apply" },
      { label: "Australian Curriculum v9", url: "https://v9.australiancurriculum.edu.au/", category: "Curriculum" },
    ],
  },
  NT: {
    name: "Northern Territory", authority: "NT Department of Education and Training – Home Education Unit",
    summary: "Apply for approval of a child-specific teaching and learning program. Approval lasts one school year and must be renewed each year.",
    beforeLeavingSchool: "The NT requires children to remain enrolled at school and attending until the home education program is approved.",
    whatToPrepare: ["Child birth certificate", "Two or three photos of the learning space", "Approved-format self-developed plan or a commercial program", "Relevant court, visa or learning-adjustment documentation where applicable"],
    renewal: "Reapply annually. Check the official government site for the deadline each year; dates can change.",
    steps: steps(
      "Review NT eligibility and the Australian Curriculum requirements for home education.",
      "Gather the required identification documents, learning-space photos and any applicable supporting documents.",
      "Prepare each child's learning program, using the NT's required self-developed templates if designing it yourself.",
      "Apply through Territory Services. The online form must be completed in one sitting; have everything ready first.",
      "Wait for written approval before withdrawing from school; respond to any requests for additional information.",
      "Retain learning evidence in each area and reapply every school year."
    ),
    links: [
      { label: "NT home education requirements and templates", url: "https://nt.gov.au/learning/primary-and-secondary-students/home-education", category: "Requirements" },
      { label: "Apply online at Territory Services", url: "https://service.nt.gov.au/services/education-training/apply-home-education", category: "Apply" },
      { label: "Australian Curriculum v9", url: "https://v9.australiancurriculum.edu.au/", category: "Curriculum" },
    ],
  },
};

export const COMPASS_STEP_IDS = ["understand", "prepare", "program", "apply", "assessment", "maintain"];
export function compassGuideFor(code) {
  return COMPASS_GUIDES[String(code || "").toUpperCase()] || null;
}
