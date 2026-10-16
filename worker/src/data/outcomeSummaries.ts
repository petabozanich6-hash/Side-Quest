// Short, plain-English explanations of curriculum outcome codes, written by Side-Quest for parents.
// They are independent summaries (not the official wording, which stays with each curriculum authority and is linked
// from every outcome). One entry per official code: { "AC9M3N01": "Uses place value to…" }.
// Built by worker/scripts/build-outcome-summaries.mjs from the batch files in worker/data/outcome-summaries/.
import summaries from "./outcome-summaries.json" with { type: "json" };

const MAP = summaries as Record<string, string>;
export const summaryFor = (code: unknown): string => MAP[String(code ?? "").trim()] || "";
export const summaryCount = () => Object.keys(MAP).length;
