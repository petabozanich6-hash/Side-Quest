#!/usr/bin/env node
// Usage: node lesson-excellence/scripts/score.mjs <file-or-dir> [--target good|excellent] [--reviews reviews.json] [--json]
// Quality gate: exit 1 if any lesson's tier is below --target (default: good).
import { readFileSync } from "node:fs";
import { listJson, readJson, parseArgs } from "./lib/io.mjs";
import { scoreLesson, RUBRIC } from "./lib/score.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
if (!positional.length) { console.error("usage: score.mjs <file-or-dir> [--target good|excellent] [--reviews file] [--json]"); process.exit(2); }
const target = flags.target || RUBRIC.quality_gate.default_target;
const rank = { draft: 0, good: 1, excellent: 2 };
if (!(target in rank)) { console.error(`unknown target '${target}'`); process.exit(2); }
const reviews = flags.reviews ? JSON.parse(readFileSync(flags.reviews, "utf8")) : {};

let failed = 0; const results = [];
for (const p of positional) for (const f of listJson(p)) {
  const { data, error } = readJson(f);
  const r = error ? { tier: "draft", total: 0, schema_valid: false, schema_errors: [error], scores: {} } : scoreLesson(data, reviews[data?.lesson_id]);
  const pass = rank[r.tier] >= rank[target];
  if (!pass) failed++;
  results.push({ file: f, pass, ...r });
  if (!flags.json) console.log(`${pass ? "PASS" : "FAIL"} ${f}  tier=${r.tier} total=${r.total}/40 schema=${r.schema_valid ? "ok" : `${r.schema_errors.length} error(s)`}`);
}
if (flags.json) console.log(JSON.stringify(results, null, 2));
else console.log(`\nquality gate (target=${target}): ${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
