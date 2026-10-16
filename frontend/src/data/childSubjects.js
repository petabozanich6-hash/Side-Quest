/**
 * What a home-educated child studies, by the family's state or territory and the child's year level.
 * Used by "Add student" and "Edit student". Based on each authority's HOME EDUCATION registration guidance
 * (not school requirements), the same sources as the Homeschool Compass (components/parent/ChildLearningRequirements).
 * This is a planning aid, not a compliance check.
 *
 * Saved subjects ({ code, name, learning_area }) are what the Outcome Tracker follows (worker outcomeTracker
 * programFor): a broad name ("HSIE") covers its whole learning area, a specific one ("History") narrows to it.
 * NSW subjects use NSW learning-area names (HSIE, Creative Arts, PDHPE, TAS); every other state uses the
 * Australian Curriculum names (Humanities and Social Sciences, The Arts, Technologies, Health and Physical Education).
 */

// ---------------------------------------------------------------- year levels

/** The first year of school has a different name in each state. */
const FIRST_YEAR = { NSW: "Kindergarten", VIC: "Foundation", QLD: "Prep", WA: "Pre-primary", SA: "Reception", TAS: "Prep", ACT: "Kindergarten", NT: "Transition" };
export const firstYearName = (j) => FIRST_YEAR[j] || "Foundation";

/** Internal bands (the app's stage codes). NSW shows them as stages; other states as year ranges. */
const BANDS = [
  { code: "ES1", years: ["K"], nsw: "Early Stage 1", theme: "early" },
  { code: "S1", years: ["1", "2"], nsw: "Stage 1", theme: "primary" },
  { code: "S2", years: ["3", "4"], nsw: "Stage 2", theme: "primary" },
  { code: "S3", years: ["5", "6"], nsw: "Stage 3", theme: "primary" },
  { code: "S4", years: ["7", "8"], nsw: "Stage 4", theme: "secondary" },
  { code: "S5", years: ["9", "10"], nsw: "Stage 5", theme: "secondary" },
  { code: "S6", years: ["11", "12"], nsw: "Stage 6 (HSC)", theme: "senior" },
];
export const yearName = (j, y) => (y === "K" ? firstYearName(j) : `Year ${y}`);
/** Bands as the family's state names them. */
export function bandsFor(j) {
  return BANDS.map((b) => {
    const span = b.years.length === 1 ? yearName(j, b.years[0]) : `Years ${b.years[0]}–${b.years[b.years.length - 1]}`;
    return { ...b, name: j === "NSW" ? `${b.nsw} (${span})` : span };
  });
}
export const bandOf = (code) => BANDS.find((b) => b.code === code) || null;
export const isSecondary = (code) => ["S4", "S5", "S6"].includes(code);

// ---------------------------------------------------------------- subjects

const s = (name, learning_area, extra = {}) => ({ code: `${learning_area}:${name}`.toLowerCase().replace(/[^a-z0-9:]+/g, "-"), name, learning_area, ...extra });

const NSW_SOURCE_K6 = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/k-to-6-curriculum";
const NSW_SOURCE_7_10 = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/7-to-10-curriculum";
const NSW_SOURCE = "https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/curriculum-overview";

// NSW Years 7–10 home schooling: English, Mathematics, Science, at least one HSIE syllabus, and two syllabuses from
// two different areas among Creative Arts, PDHPE, Languages and Technology (NSW home schooling 7–10 guidelines).
const NSW_HSIE_7_10 = ["History", "Geography", "Commerce", "Aboriginal Studies", "History Elective", "Geography Elective", "Work Education"].map((n) => s(n, "HSIE"));
const NSW_ELECTIVE_AREAS_7_10 = [
  { title: "Creative Arts", options: ["Dance", "Drama", "Music", "Photographic and Digital Media", "Visual Arts", "Visual Design"].map((n) => s(n, "Creative Arts")) },
  { title: "PDHPE", options: ["PDHPE", "Child Studies", "Physical Activity and Sports Studies"].map((n) => s(n, "PDHPE")) },
  { title: "Technology", options: ["Agricultural Technology", "Design and Technology", "Food Technology", "Graphics Technology", "Industrial Technology", "Information and Software Technology", "Marine and Aquaculture Technology", "Technology (Mandatory)", "Textiles Technology"].map((n) => s(n, "TAS")) },
  { title: "Languages", options: [s("Languages", "Languages", { note: "Any K–10 language syllabus" })] },
];

// NSW HSC (Stage 6): English is required; the rest is a choice of courses.
const NSW_HSC_ENGLISH = ["English Standard", "English Advanced", "English Studies", "English as an Additional Language or Dialect (EAL/D)"].map((n) => s(n, "English", { units: 2 }));
const NSW_HSC_COURSES = [
  ...["English Extension 1", "English Extension 2"].map((n) => s(n, "English", { units: 1 })),
  ...["Mathematics Standard 1", "Mathematics Standard 2", "Mathematics Advanced"].map((n) => s(n, "Mathematics", { units: 2 })),
  ...["Mathematics Extension 1", "Mathematics Extension 2"].map((n) => s(n, "Mathematics", { units: 1 })),
  ...["Biology", "Chemistry", "Physics", "Earth and Environmental Science", "Investigating Science", "Science Extension"].map((n) => s(n, "Science", { units: n === "Science Extension" ? 1 : 2 })),
  ...["Modern History", "Ancient History", "History Extension", "Geography", "Business Studies", "Economics", "Legal Studies", "Society and Culture", "Studies of Religion I", "Studies of Religion II", "Aboriginal Studies"].map((n) => s(n, "HSIE", { units: n === "History Extension" || n === "Studies of Religion I" ? 1 : 2 })),
  ...["PDHPE", "Community and Family Studies", "Health and Movement Science"].map((n) => s(n, "PDHPE", { units: 2 })),
  ...["Visual Arts", "Music 1", "Music 2", "Drama", "Dance"].map((n) => s(n, "Creative Arts", { units: 2 })),
  ...["Software Engineering", "Enterprise Computing", "Design and Technology", "Engineering Studies", "Food Technology", "Industrial Technology", "Textiles and Design", "Agriculture"].map((n) => s(n, "TAS", { units: 2 })),
  s("A language (Continuers, Beginners or Extension)", "Languages", { units: 2 }),
];

// Australian Curriculum learning areas and their subjects (used by every state except NSW).
const AC_AREAS = [
  { title: "English", options: [s("English", "English")] },
  { title: "Mathematics", options: [s("Mathematics", "Mathematics")] },
  { title: "Science", options: [s("Science", "Science")] },
  { title: "Humanities and Social Sciences", options: ["History", "Geography", "Civics and Citizenship", "Economics and Business"].map((n) => s(n, "Humanities and Social Sciences")), primary: s("Humanities and Social Sciences (HASS)", "Humanities and Social Sciences") },
  { title: "The Arts", options: ["Dance", "Drama", "Media Arts", "Music", "Visual Arts"].map((n) => s(n, "The Arts")), primary: s("The Arts", "The Arts") },
  { title: "Technologies", options: ["Design and Technologies", "Digital Technologies"].map((n) => s(n, "Technologies")), primary: s("Technologies", "Technologies") },
  { title: "Health and Physical Education", options: [s("Health and Physical Education", "Health and Physical Education")] },
  { title: "Languages", options: [s("Languages", "Languages", { note: "Choose the language in your plan" })] },
];
// The whole learning area as one entry (the tracker follows every subject in it).
const areaWhole = (a) => ({ ...(a.primary || a.options[0]), whole: true });
// Victoria's Arts also include Visual Communication Design.
const VIC_AREAS = AC_AREAS.map((a) => (a.title === "The Arts" ? { ...a, options: [...a.options, s("Visual Communication Design", "The Arts")] } : a));

const SOURCES = {
  VIC: "https://www2.vrqa.vic.gov.au/develop-home-education-learning-plan",
  SA: "https://www.education.sa.gov.au/docs/curriculum/guide-to-home-education-in-south-australia.pdf",
  QLD: "https://education.qld.gov.au/schools-and-educators/other-education/Pages/registration.aspx",
  WA: "https://www.education.wa.edu.au/develop-an-education-program",
  TAS: "https://oer.tas.gov.au/wp-content/uploads/2023/10/Understanding-the-Standards-Sept-2023-FINAL-2.pdf",
  ACT: "https://www.act.gov.au/education-and-training/find-a-school-and-enrol/home-education-home-schooling",
  NT: "https://nt.gov.au/learning/primary-and-secondary-students/home-education",
};

/**
 * The plan for a child: { required: subjects always included, groups: [{ title, rule, options }], rule text,
 * source }. Group rules: "one-plus" (choose at least one), "pick" (any number), "areas-2" (choose subjects from
 * at least two different groups among those marked areas-2).
 */
export function subjectPlanFor(j, stage) {
  const secondary = isSecondary(stage);
  if (j === "NSW") {
    if (!secondary) return {
      required: [s("English", "English"), s("Mathematics", "Mathematics"), s("Science and Technology", "Science and Technology"), s("HSIE (History and Geography)", "HSIE"), s("Creative Arts", "Creative Arts"), s("PDHPE", "PDHPE")],
      groups: [{ title: "Languages (optional)", rule: "pick", options: [s("Languages", "Languages")] }],
      summary: "NSW home schooling, Kindergarten to Year 6: plan learning in all six key learning areas. Languages can be added.",
      source: NSW_SOURCE_K6,
    };
    if (stage === "S6") return {
      required: [],
      groups: [
        { title: "English (choose one)", rule: "one", options: NSW_HSC_ENGLISH },
        { title: "Other courses", rule: "pick", options: NSW_HSC_COURSES },
      ],
      summary: "Years 11–12 depend on your child's pathway (HSC, TAFE, other study). English is required for the HSC. Check the official NSW guidance for senior home schooling.",
      source: NSW_SOURCE,
    };
    return {
      required: [s("English", "English"), s("Mathematics", "Mathematics"), s("Science", "Science")],
      groups: [
        { title: "HSIE: choose at least one", rule: "one-plus", options: NSW_HSIE_7_10, hint: "Most families include some History and some Geography." },
        ...NSW_ELECTIVE_AREAS_7_10.map((g) => ({ ...g, rule: "areas-2" })),
      ],
      summary: "NSW home schooling, Years 7–10: English, Mathematics, Science and at least one HSIE subject, plus subjects from at least two different areas out of Creative Arts, PDHPE, Technology and Languages. Choices can change each year.",
      source: NSW_SOURCE_7_10,
    };
  }

  const areas = j === "VIC" ? VIC_AREAS : AC_AREAS;
  const all = (pickSubjects) => areas.map((a) => (pickSubjects && a.options.length > 1 ? { title: a.title, rule: "pick", options: a.options } : null)).filter(Boolean);
  const wholeAreas = areas.map(areaWhole);
  const coreSubjects = (names) => wholeAreas.filter((x) => names.includes(x.learning_area));

  if (j === "VIC" || j === "SA") return {
    required: wholeAreas,
    groups: all(secondary),
    summary: j === "VIC"
      ? "Victoria: a home education learning plan must address all eight learning areas (unless an exemption applies). Following the Victorian Curriculum exactly isn't required."
      : "South Australia: a home education program must address all eight Australian Curriculum learning areas, taught your way.",
    source: SOURCES[j],
    pickHint: secondary ? "Optional: choose specific subjects within an area to track just those." : null,
  };
  if (j === "NT") {
    const base = ["English", "Mathematics", "Science", "Health and Physical Education", "Technologies"];
    if (!secondary || stage === "S4") return {
      required: coreSubjects([...base, "Humanities and Social Sciences", "The Arts"]),
      groups: [{ title: "Optional", rule: "pick", options: [s("Languages", "Languages")] }, ...all(stage === "S4")],
      summary: stage === "S4"
        ? "Northern Territory, Years 7–8: English, Maths, Science, Health and PE, Humanities and Social Sciences, The Arts and Technologies. Languages are optional."
        : "Northern Territory, Transition to Year 6: English, Maths, Science, Health and PE, Humanities and Social Sciences, The Arts and Technologies. Languages are optional.",
      source: SOURCES.NT,
    };
    if (stage === "S5") return {
      required: [...coreSubjects(base), s("History", "Humanities and Social Sciences")],
      groups: [{ title: "Optional", rule: "pick", options: [...["Geography", "Civics and Citizenship", "Economics and Business"].map((n) => s(n, "Humanities and Social Sciences")), ...areas.find((a) => a.title === "The Arts").options, s("Languages", "Languages")] }, { title: "Technologies", rule: "pick", options: areas.find((a) => a.title === "Technologies").options }],
      summary: "Northern Territory, Years 9–10: English, Maths, Science, Health and PE, History and Technologies. Geography, Economics and Business, Civics and Citizenship, The Arts and Languages are optional.",
      source: SOURCES.NT,
    };
  }
  if (j === "TAS") return {
    required: coreSubjects(["English", "Mathematics"]),
    groups: [{ title: "A broad range of other learning areas", rule: "pick", options: wholeAreas.filter((x) => !["English", "Mathematics"].includes(x.learning_area)) }, ...all(secondary)],
    summary: "Tasmania: literacy and numeracy, plus a broad range of other learning areas suited to your child. The eight Australian Curriculum areas aren't all compulsory.",
    source: SOURCES.TAS,
  };
  // QLD, WA, ACT (and senior years elsewhere): no compulsory subject list in the home education guidance.
  const senior = stage === "S6";
  return {
    required: [],
    groups: [{ title: senior ? "Subjects or courses your child is doing" : "Learning areas in your program", rule: "pick", options: wholeAreas }, ...all(secondary)],
    summary: senior
      ? "Years 11–12 depend on your child's pathway. Choose the areas your program covers; check your state's senior guidance."
      : `${{ QLD: "Queensland", WA: "Western Australia", ACT: "The ACT" }[j] || "Your state"} doesn't set a compulsory subject list for home education. Choose the learning areas your program covers (most families include all eight).`,
    source: SOURCES[j] || null,
    defaultAll: !senior,
  };
}

/**
 * The subjects to save for a child: the plan's required subjects plus the choices. A whole learning area is dropped
 * when specific subjects in that area were chosen, so the tracker follows just those subjects.
 */
export function finalSubjects(plan, chosen) {
  const picked = chosen.filter((c) => !plan.required.some((r) => r.code === c.code));
  const narrowed = new Set(picked.filter((c) => !c.whole).map((c) => c.learning_area));
  const keep = (x) => !(x.whole && narrowed.has(x.learning_area));
  const out = [];
  for (const x of [...plan.required, ...picked]) if (keep(x) && !out.some((o) => o.code === x.code)) out.push(x);
  return out.map(({ code, name, learning_area, units }) => ({ code, name, learning_area, ...(units ? { units } : {}) }));
}

/** Checks a selection against the plan. Returns a message to show, or "" when it's fine. */
export function selectionProblem(plan, chosen) {
  const has = (g) => g.options.some((o) => chosen.some((c) => c.code === o.code));
  for (const g of plan.groups) {
    if ((g.rule === "one-plus" || g.rule === "one") && !has(g)) return `Choose ${g.rule === "one" ? "one" : "at least one"} subject from "${g.title.replace(/:.*$/, "").replace(/\s*\(.*\)/, "")}".`;
  }
  const areaGroups = plan.groups.filter((g) => g.rule === "areas-2");
  if (areaGroups.length && areaGroups.filter(has).length < 2) return "Choose subjects from at least two different areas out of Creative Arts, PDHPE, Technology and Languages.";
  return "";
}
