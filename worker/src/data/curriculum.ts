import { NSW_OUTCOMES_SEED } from "./nsw-outcomes";
import { SOURCE, STAGE2_MATHS_OUTCOMES, VERIFIED, WORKING_MATHEMATICALLY } from "./nsw-stage2-maths";

export type CurriculumOutcome = {
  id: string;
  code: string;
  stage: string;
  learning_area: string;
  description: string;
  source: string;
};

export const NSW_STAGES = [
  { code: "ES1", name: "Early Stage 1", years: "Kindergarten", band: "primary" },
  { code: "S1", name: "Stage 1", years: "Years 1-2", band: "primary" },
  { code: "S2", name: "Stage 2", years: "Years 3-4", band: "primary" },
  { code: "S3", name: "Stage 3", years: "Years 5-6", band: "primary" },
  { code: "S4", name: "Stage 4", years: "Years 7-8", band: "secondary" },
  { code: "S5", name: "Stage 5", years: "Years 9-10", band: "secondary" },
  { code: "S6", name: "Stage 6", years: "Years 11-12", band: "senior" },
] as const;

export const NSW_LEARNING_AREAS = {
  primary: ["English", "Mathematics", "Science and Technology", "HSIE", "PDHPE", "Creative Arts", "Languages"],
  secondary: ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "Languages", "TAS"],
  senior: ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "Languages", "TAS", "VET"],
} as const;

export const NSW_SOURCE_LINKS = {
  ES1: { name: "NSW Education Standards (K-6)", url: "https://curriculum.nsw.edu.au/learning-areas/primary" },
  S1: { name: "NSW Education Standards (K-6)", url: "https://curriculum.nsw.edu.au/learning-areas/primary" },
  S2: { name: "NSW Education Standards (K-6)", url: "https://curriculum.nsw.edu.au/learning-areas/primary" },
  S3: { name: "NSW Education Standards (K-6)", url: "https://curriculum.nsw.edu.au/learning-areas/primary" },
  S4: { name: "NSW Education Standards (7-10)", url: "https://curriculum.nsw.edu.au/learning-areas/secondary" },
  S5: { name: "NSW Education Standards (7-10)", url: "https://curriculum.nsw.edu.au/learning-areas/secondary" },
  S6: { name: "NSW Education Standards (11-12)", url: "https://curriculum.nsw.edu.au/learning-areas/11-12" },
} as const;

export const NSW_LA_LINKS = {
  English: "https://curriculum.nsw.edu.au/learning-areas/english",
  Mathematics: "https://curriculum.nsw.edu.au/learning-areas/mathematics",
  "Science and Technology": "https://curriculum.nsw.edu.au/learning-areas/science-and-technology",
  Science: "https://curriculum.nsw.edu.au/learning-areas/science",
  HSIE: "https://curriculum.nsw.edu.au/learning-areas/hsie",
  PDHPE: "https://curriculum.nsw.edu.au/learning-areas/pdhpe",
  "Creative Arts": "https://curriculum.nsw.edu.au/learning-areas/creative-arts",
  Languages: "https://curriculum.nsw.edu.au/learning-areas/languages",
  TAS: "https://curriculum.nsw.edu.au/learning-areas/tas",
  VET: "https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/stage-6-learning-areas/vet",
} as const;

export const NSW_SECONDARY_PATTERN = {
  S4: {
    band_name: "Years 7-8",
    compulsory: [
      { code: "ENG-S4", name: "English", learning_area: "English", units: 1 },
      { code: "MAT-S4", name: "Mathematics", learning_area: "Mathematics", units: 1 },
      { code: "SCI-S4", name: "Science", learning_area: "Science", units: 1 },
      { code: "HSIE-S4", name: "Human Society and its Environment (History + Geography)", learning_area: "HSIE", units: 1 },
      { code: "PDHPE-S4", name: "PDHPE", learning_area: "PDHPE", units: 1 },
      { code: "CA-S4", name: "Creative Arts (Visual Arts + Music)", learning_area: "Creative Arts", units: 1 },
      { code: "TM-S4", name: "Technology Mandatory", learning_area: "TAS", units: 1 },
      { code: "LANG-S4", name: "Languages (100 hours over Years 7-8)", learning_area: "Languages", units: 1 },
    ],
    electives: [],
  },
  S5: {
    band_name: "Years 9-10",
    compulsory: [
      { code: "ENG-S5", name: "English", learning_area: "English", units: 1 },
      { code: "MAT-S5", name: "Mathematics", learning_area: "Mathematics", units: 1 },
      { code: "SCI-S5", name: "Science", learning_area: "Science", units: 1 },
      { code: "AUS-HIST", name: "Australian History", learning_area: "HSIE", units: 1 },
      { code: "AUS-GEO", name: "Australian Geography", learning_area: "HSIE", units: 1 },
      { code: "PDHPE-S5", name: "PDHPE", learning_area: "PDHPE", units: 1 },
    ],
    electives: [
      { code: "COMM", name: "Commerce", learning_area: "HSIE" },
      { code: "DRAMA", name: "Drama", learning_area: "Creative Arts" },
      { code: "MUSIC", name: "Music", learning_area: "Creative Arts" },
      { code: "VA-E", name: "Visual Arts", learning_area: "Creative Arts" },
      { code: "DT", name: "Design and Technology", learning_area: "TAS" },
      { code: "FT", name: "Food Technology", learning_area: "TAS" },
      { code: "IST", name: "Information and Software Technology", learning_area: "TAS" },
      { code: "AGR", name: "Agricultural Technology", learning_area: "TAS" },
      { code: "GRAPHIC", name: "Graphics Technology", learning_area: "TAS" },
      { code: "LOTE", name: "Language (continuer)", learning_area: "Languages" },
      { code: "PASS", name: "Physical Activity and Sports Studies", learning_area: "PDHPE" },
      { code: "WORK", name: "Work Education", learning_area: "TAS" },
    ],
  },
  S6: {
    band_name: "Years 11-12 (HSC)",
    compulsory: [{ code: "ENG-S6", name: "English (any English course required)", learning_area: "English", units: 2 }],
    electives: [
      { code: "ENG-STD", name: "English Standard", learning_area: "English", units: 2 },
      { code: "ENG-ADV", name: "English Advanced", learning_area: "English", units: 2 },
      { code: "ENG-EXT1", name: "English Extension 1", learning_area: "English", units: 1 },
      { code: "ENG-EXT2", name: "English Extension 2", learning_area: "English", units: 1 },
      { code: "MA-STD1", name: "Mathematics Standard 1", learning_area: "Mathematics", units: 2 },
      { code: "MA-STD2", name: "Mathematics Standard 2", learning_area: "Mathematics", units: 2 },
      { code: "MA-ADV", name: "Mathematics Advanced", learning_area: "Mathematics", units: 2 },
      { code: "MA-EXT1", name: "Mathematics Extension 1", learning_area: "Mathematics", units: 1 },
      { code: "MA-EXT2", name: "Mathematics Extension 2", learning_area: "Mathematics", units: 1 },
      { code: "BIO", name: "Biology", learning_area: "Science", units: 2 },
      { code: "CHEM", name: "Chemistry", learning_area: "Science", units: 2 },
      { code: "PHY", name: "Physics", learning_area: "Science", units: 2 },
      { code: "ES", name: "Earth and Environmental Science", learning_area: "Science", units: 2 },
      { code: "IPT", name: "Information Processes and Technology", learning_area: "TAS", units: 2 },
      { code: "SDD", name: "Software Design and Development", learning_area: "TAS", units: 2 },
      { code: "MH", name: "Modern History", learning_area: "HSIE", units: 2 },
      { code: "AH", name: "Ancient History", learning_area: "HSIE", units: 2 },
      { code: "GEO", name: "Geography", learning_area: "HSIE", units: 2 },
      { code: "ECO", name: "Economics", learning_area: "HSIE", units: 2 },
      { code: "BS", name: "Business Studies", learning_area: "HSIE", units: 2 },
      { code: "LS", name: "Legal Studies", learning_area: "HSIE", units: 2 },
      { code: "SOR1", name: "Studies of Religion I", learning_area: "HSIE", units: 1 },
      { code: "SOR2", name: "Studies of Religion II", learning_area: "HSIE", units: 2 },
      { code: "PDHPE-S6", name: "PDHPE", learning_area: "PDHPE", units: 2 },
      { code: "VA-S6", name: "Visual Arts", learning_area: "Creative Arts", units: 2 },
      { code: "MUSIC1", name: "Music 1", learning_area: "Creative Arts", units: 2 },
      { code: "MUSIC2", name: "Music 2", learning_area: "Creative Arts", units: 2 },
      { code: "DRAMA-S6", name: "Drama", learning_area: "Creative Arts", units: 2 },
      { code: "DT-S6", name: "Design and Technology", learning_area: "TAS", units: 2 },
      { code: "ENT", name: "Engineering Studies", learning_area: "TAS", units: 2 },
      { code: "FT-S6", name: "Food Technology", learning_area: "TAS", units: 2 },
      { code: "AGR-S6", name: "Agriculture", learning_area: "TAS", units: 2 },
      { code: "LANG-S6", name: "Modern/Classical Language", learning_area: "Languages", units: 2 },
    ],
    note: "HSC pattern of study: minimum 12 units in Preliminary (Year 11), minimum 10 units in HSC (Year 12). Must include English and at least 6 units from Board Developed Courses in HSC.",
  },
} as const;

export const STAGE2_MATHS_METADATA = { verified: VERIFIED, source: SOURCE, working_mathematically: WORKING_MATHEMATICALLY } as const;

export const NSW_OUTCOMES: CurriculumOutcome[] = [
  ...NSW_OUTCOMES_SEED.filter((item) => !(item.stage === "S2" && item.learning_area === "Mathematics")).map((item, index) => ({
    id: item.code || `outcome-${index}`,
    ...item,
  })),
  ...Object.entries(STAGE2_MATHS_OUTCOMES).map(([code, description]) => ({
    id: code,
    code,
    stage: "S2",
    learning_area: "Mathematics",
    description,
    source: SOURCE,
  })),
];
