// Merges the plain-English summary batches in worker/data/outcome-summaries/*.json into
// worker/src/data/outcome-summaries.json (one flat { code: summary } map the Worker imports).
// Summaries are Side-Quest's own words for parents. Never paste official outcome wording here.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "outcome-summaries");
const out = join(root, "src", "data", "outcome-summaries.json");

const merged = {};
const problems = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const batch = JSON.parse(readFileSync(join(dir, file), "utf8"));
  for (const [code, summary] of Object.entries(batch)) {
    const text = String(summary ?? "").trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9.\-_/]*$/.test(code)) problems.push(`${file}: odd code ${code}`);
    if (!text) problems.push(`${file}: ${code} has no summary`);
    if (text.length > 220) problems.push(`${file}: ${code} summary is too long (${text.length})`);
    if (merged[code] && merged[code] !== text) problems.push(`${file}: ${code} summarised twice differently`);
    merged[code] = text;
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
const sorted = Object.fromEntries(Object.keys(merged).sort().map((k) => [k, merged[k]]));
writeFileSync(out, JSON.stringify(sorted, null, 0).replace(/","/g, '",\n"') + "\n");
console.log(`${Object.keys(sorted).length} summaries written to ${out}`);
