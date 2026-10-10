import { newId } from "../types";

type StudentLite = { name?: string | null; stage?: string | null };
type LifeEvidenceLite = {
  title?: string | null;
  description?: string | null;
  location?: string | null;
  parent_note?: string | null;
  file_ids?: string[];
};

export type SuggestedMapping = {
  id: string;
  learning_area: string;
  code?: string;
  description: string;
  evidence_statement: string;
  confidence: "high" | "medium" | "low";
  accepted: boolean | null;
};

export type LifeEvidenceAnalysis = {
  summary: string;
  activity_type: string;
  mappings: SuggestedMapping[];
  additional_evidence_suggested: string;
};

type Rule = {
  learning_area: string;
  keywords: string[];
  evidence: string;
  fallback: string;
};

const RULES: Rule[] = [
  {
    learning_area: "English",
    keywords: ["read", "reading", "write", "writing", "story", "journal", "recipe", "discuss", "presentation", "spelling"],
    evidence: "The activity involved reading, speaking or writing for a real purpose.",
    fallback: "Communicates ideas clearly for familiar purposes.",
  },
  {
    learning_area: "Mathematics",
    keywords: ["measure", "measured", "count", "budget", "money", "price", "grams", "kg", "litre", "timed", "distance", "change", "compare", "add"],
    evidence: "The activity used number, measurement or comparison in a practical setting.",
    fallback: "Applies number and measurement skills in everyday situations.",
  },
  {
    learning_area: "Science and Technology",
    keywords: ["observe", "experiment", "chemical", "science", "bird", "plant", "animal", "design", "build", "tested", "tool", "materials", "nature"],
    evidence: "The activity involved observing, testing, designing or explaining how something works.",
    fallback: "Investigates the natural or made world and communicates findings.",
  },
  {
    learning_area: "HSIE",
    keywords: ["map", "museum", "history", "community", "country", "place", "culture", "shop", "local", "market"],
    evidence: "The activity connected learning to places, people, communities or how society works.",
    fallback: "Explores people, places and environments in meaningful contexts.",
  },
  {
    learning_area: "PDHPE",
    keywords: ["walk", "bushwalk", "sport", "exercise", "safety", "team", "healthy", "cook", "balance", "swim", "run"],
    evidence: "The activity supported wellbeing, safety, movement or healthy choices.",
    fallback: "Builds health, safety and active-living habits.",
  },
  {
    learning_area: "Creative Arts",
    keywords: ["draw", "paint", "music", "song", "dance", "sketch", "photo", "craft", "design"],
    evidence: "The activity required creative expression, performance or making.",
    fallback: "Creates and responds to artworks, sound or movement.",
  },
  {
    learning_area: "Languages",
    keywords: ["language", "translate", "vocabulary", "phrase", "speaking", "listening", "spanish", "french", "italian", "japanese", "mandarin"],
    evidence: "The activity included learning or using another language.",
    fallback: "Uses vocabulary and phrases in another language.",
  },
  {
    learning_area: "TAS",
    keywords: ["cook", "bake", "sew", "wood", "drill", "construction", "build", "materials list", "budget", "prototype"],
    evidence: "The activity involved planning, making and evaluating a practical task.",
    fallback: "Plans and makes practical projects using tools, materials or food.",
  },
];

const AREA_PRIORITY: Record<string, number> = {
  Mathematics: 8,
  "Science and Technology": 7,
  English: 6,
  TAS: 5,
  PDHPE: 4,
  HSIE: 3,
  "Creative Arts": 2,
  Languages: 1,
};

const normalise = (value: string) => value.toLowerCase();

const inferActivityType = (text: string) => {
  if (/(bake|cook|recipe|kitchen)/.test(text)) return "Cooking and food preparation";
  if (/(walk|bushwalk|trail|park|bird|creek|nature)/.test(text)) return "Outdoor exploration";
  if (/(budget|money|price|shop|grocery|change)/.test(text)) return "Real-world maths and budgeting";
  if (/(build|drill|timber|design|prototype|materials)/.test(text)) return "Design and making";
  if (/(draw|paint|music|song|dance|craft|photo)/.test(text)) return "Creative practice";
  return "Integrated everyday learning";
};

async function pickOutcome(
  db: D1Database,
  stage: string,
  learningArea: string
): Promise<{ code?: string; description: string }> {
  try {
    const row = await db
      .prepare("SELECT code, description FROM outcomes WHERE stage = ? AND learning_area = ? LIMIT 1")
      .bind(stage, learningArea)
      .first<{ code: string; description: string }>();
    if (row) return row;
  } catch {
    // optional table
  }
  const rule = RULES.find((item) => item.learning_area === learningArea);
  return { description: rule?.fallback || `${learningArea} learning connected to the activity.` };
}

export async function analyseLifeEvidence(
  db: D1Database,
  evidence: LifeEvidenceLite,
  student: StudentLite
): Promise<LifeEvidenceAnalysis> {
  const text = normalise(
    [evidence.title, evidence.description, evidence.location, evidence.parent_note].filter(Boolean).join(" ")
  );
  const stage = String(student.stage || "S2");
  const areaScores = RULES.map((rule) => {
    const hits = rule.keywords.filter((keyword) => text.includes(keyword));
    return { rule, hits, score: hits.length };
  })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || (AREA_PRIORITY[b.rule.learning_area] || 0) - (AREA_PRIORITY[a.rule.learning_area] || 0));

  const selected = (areaScores.length ? areaScores : RULES.slice(0, 2).map((rule) => ({ rule, hits: [], score: 1 }))).slice(0, 4);
  const mappings: SuggestedMapping[] = [];
  for (const selectedRule of selected) {
    const outcome = await pickOutcome(db, stage, selectedRule.rule.learning_area);
    mappings.push({
      id: newId(),
      learning_area: selectedRule.rule.learning_area,
      code: outcome.code,
      description: outcome.description,
      evidence_statement: selectedRule.hits.length
        ? `${selectedRule.rule.evidence} Evidence noted: ${selectedRule.hits.slice(0, 3).join(", ")}.`
        : selectedRule.rule.evidence,
      confidence: selectedRule.score >= 3 ? "high" : selectedRule.score === 2 ? "medium" : "low",
      accepted: null,
    });
  }

  const firstName = String(student.name || "This student").split(/\s+/)[0] || "This student";
  const activityType = inferActivityType(text);
  return {
    summary: `${firstName} showed meaningful learning through "${evidence.title || "this activity"}", with strong links to ${mappings
      .map((mapping) => mapping.learning_area)
      .slice(0, 3)
      .join(", ")}.`,
    activity_type: activityType,
    mappings,
    additional_evidence_suggested:
      (evidence.file_ids || []).length > 0
        ? "Add a brief child reflection or a dated work sample to strengthen the record."
        : "Add a photo, a short child reflection, or a sample of any notes, calculations or finished work.",
  };
}
