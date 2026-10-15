// Audits checked-in identifiers without network access. The strict mode is for
// freshly generated ACARA MRAC data; it fails if a learning area was silently omitted.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/data/", import.meta.url));
function readArray(file, identifier) {
  const source = readFileSync(root + file, "utf8");
  const declaration = source.indexOf("export const " + identifier);
  if (declaration < 0) throw Error("Missing catalogue declaration " + identifier);
  const eq = source.indexOf(" = ", declaration);
  const start = source.indexOf("[", eq);
  const end = source.indexOf("];", start);
  if (start < 0 || end < 0) throw Error("Cannot locate JSON list for " + identifier);
  return JSON.parse(source.slice(start, end + 1));
}
const ac9 = readArray("ac9-outcomes.ts", "AC9_OUTCOMES");
const nsw = readArray("nsw-outcomes.ts", "NSW_OUTCOMES_SEED");
const areas = ["English", "Mathematics", "Science", "Humanities and Social Sciences", "Health and Physical Education", "The Arts", "Technologies", "Languages"];
const byArea = Object.fromEntries(areas.map((area) => [area, ac9.filter((item) => item.learning_area === area).length]));
const languageSubjects = [...new Set(ac9.filter((x) => x.learning_area === "Languages").map((x) => x.subject).filter(Boolean))].sort();
const duplicateCodes = (rows) => rows.map((x) => x.code).filter((code, i, all) => all.indexOf(code) !== i);
const failures = [];
for (const [name, rows] of [["AC9", ac9], ["NSW", nsw]]) {
  const dup = duplicateCodes(rows);
  if (dup.length) failures.push(name + " has duplicate identifiers: " + dup.slice(0, 8).join(", "));
  if (rows.some((x) => !x.code || typeof x.code !== "string")) failures.push(name + " has empty or malformed codes");
}
for (const row of ac9) {
  if (!/^(?:AC9|ACL9)[A-Z0-9]+$/.test(row.code)) failures.push("Invalid AC9 identifier: " + row.code);
  if (!Number.isInteger(row.from) || !Number.isInteger(row.to) || row.from < 0 || row.to > 10 || row.from > row.to) failures.push("Invalid year band: " + row.code);
}
const strict = process.argv.includes("--require-all-eight");
if (strict) {
  for (const area of areas) if (!byArea[area]) failures.push("Missing AC9 learning area: " + area);
  if (byArea.Languages < 100) failures.push("Languages import insufficient: " + byArea.Languages);
  if (languageSubjects.length < 8) failures.push("Languages subject/pathway coverage unresolved; only " + languageSubjects.length + " distinct subjects");
}
const summary = {
  generated_at: new Date().toISOString(), source: "Checked-in ACARA MRAC/2024/04 and NSW NESA seed v3",
  ac9: { total: ac9.length, by_learning_area: byArea, language_subjects: languageSubjects },
  nsw: { seed_identifiers: nsw.length, status: "PARTIAL — per-syllabus elective/senior manifest not yet verified" },
  jurisdictions: {
    NSW: "PARTIAL NSW syllabus seed", VIC: "MISSING Victorian v2 verified catalogue",
    WA: "MISSING Western Australian state catalogue",
    QLD: "PARTIAL AC9 reference; senior QCE missing", SA: "PARTIAL AC9 reference; senior SACE missing",
    TAS: "PARTIAL AC9 reference; senior TASC missing", ACT: "PARTIAL AC9 reference; senior BSSS missing",
    NT: "PARTIAL AC9 reference; senior NTCET missing",
  }, complete: false, failures
};
console.log(JSON.stringify(summary, null, 2));
const reportPath = process.env.CURRICULUM_REPORT_PATH;
if (reportPath) writeFileSync(reportPath, JSON.stringify(summary, null, 2) + "\n");
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
