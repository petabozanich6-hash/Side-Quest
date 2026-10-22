/**
 * Australian-English spelling for model-authored lesson prose.
 *
 * The language policy is applied in every model prompt. This conservative
 * postprocessor handles common US spellings when the model ignores the rule.
 * It never rewrites family-provided resources, deliberate spelling-comparison
 * lessons, technical/code subjects, URLs, quoted lines or code spans.
 * It is NOT a dictionary and must not be used on a child's submissions.
 */
const WORDS: Record<string, string> = {
  color: "colour", colors: "colours", colored: "coloured", coloring: "colouring", colorful: "colourful",
  favorite: "favourite", favorites: "favourites", favor: "favour", favors: "favours", favored: "favoured",
  behavior: "behaviour", behaviors: "behaviours", behavioral: "behavioural",
  neighbor: "neighbour", neighbors: "neighbours", neighborhood: "neighbourhood", neighborhoods: "neighbourhoods",
  honor: "honour", honored: "honoured", honorable: "honourable",
  humor: "humour", humorous: "humorous",
  flavor: "flavour", flavors: "flavours", flavored: "flavoured",
  labor: "labour", laborers: "labourers", laboring: "labouring",
  center: "centre", centers: "centres", centered: "centred", centering: "centring",
  theater: "theatre", theaters: "theatres",
  gray: "grey", grays: "greys",
  analyze: "analyse", analyzes: "analyses", analyzed: "analysed", analyzing: "analysing",
  organize: "organise", organizes: "organises", organized: "organised", organizing: "organising",
  organization: "organisation", organizations: "organisations",
  recognize: "recognise", recognizes: "recognises", recognized: "recognised", recognizing: "recognising",
  realize: "realise", realizes: "realises", realized: "realised", realizing: "realising",
  summarize: "summarise", summarizes: "summarises", summarized: "summarised", summarizing: "summarising",
  emphasize: "emphasise", emphasizes: "emphasises", emphasized: "emphasised", emphasizing: "emphasising",
  categorize: "categorise", categorized: "categorised", categorizing: "categorising",
  criticize: "criticise", criticized: "criticised", criticizing: "criticising",
  visualize: "visualise", visualized: "visualised", visualizing: "visualising",
  memorize: "memorise", memorized: "memorised", memorizing: "memorising",
  prioritize: "prioritise", prioritized: "prioritised", prioritizing: "prioritising",
  apologize: "apologise", apologized: "apologised",
  traveled: "travelled", traveling: "travelling", traveler: "traveller", travelers: "travellers",
  canceled: "cancelled", canceling: "cancelling", counselor: "counsellor", counselors: "counsellors",
  defense: "defence", defenses: "defences", offense: "offence", offenses: "offences",
  aluminum: "aluminium",
};
const american = new RegExp("\\b(?:" + Object.keys(WORDS).join("|") + ")\\b", "gi");
// Protect fenced/inline code, URLs and direct quotations (the latter may be
// authentic quotes, dialogue or literal spelling examples).
const protectedSpan = /(\x60\x60\x60[\s\S]*?\x60\x60\x60|\x60[^\x60\n]*\x60|https?:\/\/[^\s]+|"(?:\\.|[^"\\])*")/g;
export const AU_LANGUAGE_RULE =
  "SPELLING STANDARD: Write ALL new teaching and parent/child instructional text in Australian English (colour, favourite, organise, analyse, behaviour, centre, travelling, recognised). Do not drift into US spelling even if a model example uses it. Preserve original quotations, parent-provided source passages, proper names and programming code/CSS syntax. When explicitly comparing American and Australian spellings, label both correctly.";

function matchCase(original: string, replacement: string): string {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  return original[0] === original[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
}
export function australianSpelling(text: string): string {
  if (!text) return text;
  return text.split(protectedSpan).map((part, i) =>
    i % 2 ? part : part.replace(american, (word) => matchCase(word, WORDS[word.toLowerCase()] ?? word))
  ).join("");
}

function skipConversion(area: string, topic: string, hasParentSource: boolean): boolean {
  if (hasParentSource) return true;
  if (/\b(?:American (?:English|spelling)|U\.S\. spelling|US spelling|US vs (?:UK|AU|Australian)|British vs American|colour vs color|favorite vs favourite)\b/i.test(topic)) return true;
  // "technolog\w*" so "Technologies" / "Digital Technologies" match (a bare "technolog\b" never did,
  // which rewrote CSS such as `color: red` into invalid `colour: red`). Coding topics in any area are protected too.
  const technical = /\b(?:computer\w*|coding|programming|software|web development|technolog\w*|CSS|HTML|JavaScript|Python)\b/i;
  if (technical.test(area) || technical.test(topic)) return true;
  return false;
}
/** Model-created draft JSON only, never an assigned lesson or submission. */
export function localiseGeneratedDraft<T>(value: T, area: string, topic: string, hasParentSource = false): T {
  if (!value || typeof value !== "object" || skipConversion(area, topic, hasParentSource)) return value;
  const protectedKeys = new Set(["source", "source_text", "curriculum_refs", "outcome_codes", "resources", "parent_notes"]);
  const map = (data: any, key = ""): any => {
    if (protectedKeys.has(key) || (data && typeof data === "object" && data.kind === "source")) return data;
    if (typeof data === "string") return australianSpelling(data);
    if (Array.isArray(data)) return data.map((x) => map(x, key));
    if (data && typeof data === "object") return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, map(v, k)])
    );
    return data;
  };
  return map(value) as T;
}
