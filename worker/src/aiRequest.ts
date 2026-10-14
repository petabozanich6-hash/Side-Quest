// Turns "Create a one-hour Year 3 maths lesson about addition using Harry Potter as the theme." plus a child's saved
// preferences into the structured specification the lesson generator needs. Plain pattern matching, no AI call:
// anything it cannot work out is left for the model to read from the parent's own words, which are always passed on.
/** Optional, parent-entered learning preferences. Used only to personalise lessons; never inferred, never shown to the child. */
export type LearningPrefs = {
  duration_minutes?: number; delivery?: "parent_guided" | "independent"; activity_types?: string[];
  reading?: "supported" | "typical" | "confident"; complexity?: "simpler" | "standard" | "challenging";
  support_areas?: string; extension_areas?: string; equipment?: string; other?: string;
};

export function cleanPrefs(v: unknown): LearningPrefs {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const t = (x: unknown, n: number) => (typeof x === "string" ? x.trim().slice(0, n) : "");
  const out: LearningPrefs = {};
  const m = Number(o.duration_minutes);
  if (Number.isFinite(m) && m >= 10 && m <= 120) out.duration_minutes = Math.round(m);
  if (o.delivery === "parent_guided" || o.delivery === "independent") out.delivery = o.delivery;
  if (Array.isArray(o.activity_types)) out.activity_types = o.activity_types.map((x) => t(x, 40)).filter(Boolean).slice(0, 8);
  if (o.reading === "supported" || o.reading === "typical" || o.reading === "confident") out.reading = o.reading;
  if (o.complexity === "simpler" || o.complexity === "standard" || o.complexity === "challenging") out.complexity = o.complexity;
  for (const k of ["support_areas", "extension_areas", "equipment", "other"] as const) { const x = t(o[k], 400); if (x) out[k] = x; }
  return out;
}

export type Parsed = {
  minutes?: number; year?: string; delivery?: "parent_guided" | "independent"; area?: string; theme?: string; count?: number; topic: string; links: boolean;
};

const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, a: 1, an: 1, half: 0.5 };
const AREAS: Array<[RegExp, string]> = [
  [/\b(maths?|mathematics|addition|subtraction|multiplication|division|fractions?|decimals?|algebra|geometry|integers?|number|times tables|percentages?|measurement)\b/i, "Mathematics"],
  [/\b(english|reading|writing|grammar|spelling|punctuation|story|stories|poem|poetry|essay|narrative|comprehension|vocabulary)\b/i, "English"],
  [/\b(science|solar system|planets?|plants?|animals?|chemistry|physics|biology|volcano(?:es)?|weather|energy|forces|space|ecosystems?|magnets?)\b/i, "Science"],
  [/\b(history|geography|civics|hass|humanities|ancient|colony|colonies|settlement|government|explorers?|indigenous|democracy)\b/i, "Humanities and Social Sciences"],
  [/\b(art|drawing|painting|music|drama|dance|sculpt\w*|craft)\b/i, "The Arts"],
  [/\b(coding|programming|technology|robotics|design|digital)\b/i, "Technologies"],
  [/\b(pe|fitness|health|nutrition|sport|physical education)\b/i, "Health and Physical Education"],
];

export function parseRequestText(raw: string): Parsed {
  let t = raw.replace(/\s+/g, " ").trim();
  const links = /https?:\/\/\S+|www\.\S+/i.test(t);
  t = t.replace(/https?:\/\/\S+|www\.\S+/gi, " ").replace(/\s+/g, " ").trim();
  const out: Parsed = { topic: "", links };

  const hrs = /\b(?:(\d+(?:\.\d+)?)|(one|two|an?|half))[\s-]*(hours?|hrs?|hr)\b/i.exec(t);
  const mins = /\b(\d{2,3})[\s-]*(?:minutes?|mins?)\b/i.exec(t);
  if (/\bhalf[\s-]*(?:an?[\s-]*)?hour\b/i.test(t)) out.minutes = 30;
  else if (hrs) out.minutes = Math.round((hrs[1] ? Number(hrs[1]) : NUM[hrs[2].toLowerCase()] ?? 1) * 60);
  else if (mins) out.minutes = Number(mins[1]);
  if (out.minutes) out.minutes = Math.min(120, Math.max(10, out.minutes));

  const yr = /\byear\s*(\d{1,2})\b/i.exec(t) || /\bgrade\s*(\d{1,2})\b/i.exec(t);
  if (yr && Number(yr[1]) <= 12) out.year = `Year ${Number(yr[1])}`;
  else if (/\b(foundation|kindergarten|prep|reception)\b/i.test(t)) out.year = "Foundation";
  else { const age = /\b(?:aged?|(\d{1,2})[\s-]*year[\s-]*old)\s*(\d{1,2})?\b/i.exec(t); const n = age && (age[2] || age[1]); if (n) out.year = `age ${n}`; }

  if (/\b(independent(?:ly)?|on (?:his|her|their|my child'?s) own|by (?:him|her|them|it)self|works? alone|without (?:me|my help|help)|self[- ]directed)\b/i.test(t)) out.delivery = "independent";
  else if (/\b(parent[- ]guided|with me|together|i(?:'ll| will| can) teach|i will guide|guided by me|hands[- ]on with me)\b/i.test(t)) out.delivery = "parent_guided";

  const theme =
    /\b(?:using|with|use|around|based on|in)\s+(?:an?\s+|the\s+)?(.{2,60}?)\s+(?:as\s+(?:the\s+|a\s+|our\s+)?theme|theme)\b/i.exec(t) ||
    /\btheme[d]?\s*(?:of|around|on|is|:)?\s*(.{2,60}?)(?=[.,;]|\s+and\s|$)/i.exec(t) ||
    /[,;]\s*(?:an?\s+|the\s+)?([\w' -]{2,40}?)\s+theme\b/i.exec(t) ||
    /\b(.{2,40}?)[\s-]themed\b/i.exec(t);
  if (theme) out.theme = theme[1].replace(/^(a|an|the)\s+/i, "").trim();

  const cnt = /(?<!year\s)\b(two|three|four|five|six|[2-6])\s+(?:[\w-]+\s+){0,4}?lessons?\b/i.exec(t);
  if (cnt) { const n = /^\d$/.test(cnt[1]) ? Number(cnt[1]) : NUM[cnt[1].toLowerCase()]; if (n >= 2 && n <= 6) out.count = n; }

  for (const [re, name] of AREAS) if (re.test(t)) { out.area = name; break; }

  // The topic is what the lesson is "about"; failing that, the request without the instruction words.
  const about = /\babout\s+(.+?)(?=\s+(?:using|with|in\s+the\s+theme|as\s+a\s+theme|for\s+my|for\s+a|for\s+year|next\s+week|this\s+week|and\s+my|my\s+child)\b|[.,;!?]|$)/i.exec(t);
  let topic: string;
  if (about) topic = about[1];
  else {
    const first = t.split(/(?<=[.!?])\s+/)[0];
    const after = /\b(?:introducing|introduction to|introduce|on|covering|teaching|teach|exploring|that teaches|where we learn)\s+(.+)$/i.exec(first);
    topic = (after ? after[1] : first)
      .replace(/^(?:please\s+)?(?:can you\s+)?(?:create|make|write|build|generate|design|plan|give me|i(?:'d| would) like|i want|we need)\s+(?:me\s+)?(?:an?\s+|the\s+)?/i, "")
      .replace(/[,;]\s*(?:\S+\s+){0,3}themed?\b.*$/i, "");
  }
  out.topic = topic.replace(/\s+/g, " ").trim().replace(/^[\s,.;:-]+|[\s,.;:-]+$/g, "").slice(0, 300);
  return out;
}

export type StudentInfo = { year_level?: string | null; stage?: string | null; interests?: string[]; prefs?: LearningPrefs; notes?: string | null };

const yearText = (s: StudentInfo): string => {
  const y = (s.year_level || "").trim();
  if (/^\d{1,2}$/.test(y)) return `Year ${y}`;
  return y;
};
const yearNum = (y: string): number | null => { const m = /(\d{1,2})/.exec(y); return m ? Number(m[1]) : /foundation|kinder|prep/i.test(y) ? 0 : null; };

export type Resolved = {
  topic: string; area: string; year: string; goal: string; minutes: number; delivery: "parent_guided" | "independent";
  interests: string; needs: string; notes: string; theme: string; profile: string[]; assumptions: Record<string, string | number>;
  count?: number; links: boolean;
};

/** Explicit fields win over the parent's sentence, which wins over the child's saved preferences, which win over defaults. */
export function resolveRequest(body: Record<string, unknown>, student: StudentInfo | null): Resolved {
  const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const text = clip(body.request, 1200);
  const p = text ? parseRequestText(text) : ({ topic: "", links: false } as Parsed);
  const prefs = student?.prefs || {};
  const year = clip(body.year_level, 40) || p.year || (student ? yearText(student) : "");
  const n = yearNum(year);
  const minutes = Number(body.duration_minutes) > 0 ? Number(body.duration_minutes) : p.minutes || prefs.duration_minutes || 45;
  const delivery: Resolved["delivery"] =
    body.delivery === "independent" || body.delivery === "parent_guided" ? (body.delivery as Resolved["delivery"]) : p.delivery || prefs.delivery || "independent";
  const interests = clip(body.interests, 300) || (student?.interests || []).join(", ");
  const profile: string[] = [];
  if (prefs.reading === "supported") profile.push("Reading confidence: needs support. Use short sentences and everyday words, explain every new word where it first appears, and keep any reading passages short.");
  if (prefs.reading === "confident") profile.push("Reading confidence: strong reader. Richer vocabulary and longer passages are fine.");
  if (prefs.complexity === "simpler") profile.push("Explanation complexity: keep explanations simple and concrete, with small steps.");
  if (prefs.complexity === "challenging") profile.push("Explanation complexity: pitch this challengingly; move briskly through basics and include harder reasoning.");
  if (prefs.activity_types?.length) profile.push(`Preferred activity types (favour these): ${prefs.activity_types.join(", ")}.`);
  if (prefs.support_areas) profile.push(`Areas where the child needs support: ${prefs.support_areas}`);
  if (prefs.extension_areas) profile.push(`Areas where the child enjoys extension: ${prefs.extension_areas}`);
  if (prefs.equipment) profile.push(`Equipment normally available (use only these plus paper and pencil): ${prefs.equipment}`);
  if (prefs.other) profile.push(`Other parent preferences: ${prefs.other}`);
  const theme = clip(body.theme, 120) || p.theme || "";
  const topic = clip(body.topic, 300) || p.topic;
  const assumptions: Resolved["assumptions"] = { year: year || "not stated", minutes, delivery: delivery === "independent" ? "independent" : "parent-guided" };
  if (theme) assumptions.theme = theme;
  if (interests && !theme) assumptions.interests = interests;
  return {
    topic, area: clip(body.learning_area, 80) || p.area || "", year, goal: clip(body.goal, 400), minutes: Math.min(120, Math.max(10, Math.round(minutes))), delivery,
    interests, needs: clip(body.needs, 400), notes: clip(body.notes, 800), theme, profile, assumptions, count: p.count, links: p.links,
  };
}

/** NSW-style stage code used by the lesson library for a year level such as "Year 3". */
export function stageFor(year: string): string | null {
  const n = yearNum(year);
  if (n === null) return null;
  return n === 0 ? "ES1" : n <= 2 ? "S1" : n <= 4 ? "S2" : n <= 6 ? "S3" : n <= 8 ? "S4" : n <= 10 ? "S5" : "S6";
}
