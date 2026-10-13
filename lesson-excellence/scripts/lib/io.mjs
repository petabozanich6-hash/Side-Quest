import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function listJson(target) {
  const st = statSync(target);
  if (st.isFile()) return [target];
  const out = [];
  for (const name of readdirSync(target).sort()) {
    const p = join(target, name);
    if (statSync(p).isDirectory()) out.push(...listJson(p));
    else if (name.endsWith(".json")) out.push(p);
  }
  return out;
}
export function readJson(p) {
  try { return { data: JSON.parse(readFileSync(p, "utf8")) }; }
  catch (e) { return { error: `invalid JSON: ${e.message}` }; }
}
export function parseArgs(argv) {
  const flags = {}; const positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const k = argv[i].slice(2);
      if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) flags[k] = true; else flags[k] = argv[++i];
    } else positional.push(argv[i]);
  }
  return { flags, positional };
}
