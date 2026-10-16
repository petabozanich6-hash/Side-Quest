// Short, plain-English explanations of curriculum outcome codes, written by Side-Quest for parents.
// They are independent summaries (not the official wording, which stays with each curriculum authority and is linked
// from every outcome). One entry per official code: { "AC9M3N01": "Uses place value to…" }.
// Built by worker/scripts/build-outcome-summaries.mjs from the batch files in worker/data/outcome-summaries/.
import summaries from "./outcome-summaries.json";

const MAP = summaries as Record<string, string>;
// Older Side-Quest records spell some NESA codes with a lower-case stage letter ("ENe-OLC-01" for "ENE-OLC-01").
const UPPER = new Map(Object.entries(MAP).map(([k, v]) => [k.toUpperCase(), v]));
export const summaryFor = (code: unknown): string => {
  const c = String(code ?? "").trim();
  return MAP[c] || UPPER.get(c.toUpperCase()) || "";
};
export const summaryCount = () => Object.keys(MAP).length;
