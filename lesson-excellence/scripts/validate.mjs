#!/usr/bin/env node
// Usage: node lesson-excellence/scripts/validate.mjs <file-or-dir> [--quiet]
// Exit 0 = all lessons pass schema + pedagogy checks, 1 = at least one fails.
import { listJson, readJson, parseArgs } from "./lib/io.mjs";
import { validateLesson } from "./lib/validate.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
if (!positional.length) { console.error("usage: validate.mjs <file-or-dir> [--quiet]"); process.exit(2); }
let failed = 0, total = 0;
for (const target of positional) for (const f of listJson(target)) {
  total++;
  const { data, error } = readJson(f);
  const errors = error ? [error] : validateLesson(data).errors;
  if (errors.length) { failed++; console.log(`FAIL ${f}`); if (!flags.quiet) errors.forEach((e) => console.log(`  - ${e}`)); }
  else console.log(`PASS ${f}`);
}
console.log(`\n${total - failed}/${total} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
