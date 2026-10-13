#!/usr/bin/env node
// Batch transformation pipeline. Dependency-light, deterministic, resumable.
//
//   ingest <srcDir> [--work .work] [--chunk-size 500] [--ext .md,.json,.txt,.html]
//       Scan legacy lessons, assign deterministic lesson_ids, classify (empty/partial/decent),
//       write <work>/manifest.jsonl and <work>/chunks/chunk-NNNN.json (work orders for rewriting).
//   status  [--work .work] [--out lesson-excellence/content]
//       Count done / pending per state. "Done" = a schema-valid lesson <lesson_id>.json exists in --out.
//   next    [--work .work] [--out ...] [--limit 50] [--state empty|partial|decent]
//       Print the next pending work items (resume point). Re-run after each batch.
//   queue   [--out ...] [--work .work] [--reviews file]
//       Validate + score every lesson in --out, write <work>/review-queue.json (lessons below "good").
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import { parseArgs, readJson } from "./lib/io.mjs";
import { validateLesson } from "./lib/validate.mjs";
import { scoreLesson } from "./lib/score.mjs";

const { flags, positional } = parseArgs(process.argv.slice(2));
const cmd = positional[0];
const work = flags.work || ".work";
const outDir = flags.out || "lesson-excellence/content";

const SECTION_HINTS = [/objective|learning intention/i, /example/i, /practice|exercise|activity/i, /misconception|common mistake/i,
  /check|quiz|question/i, /summary|recap/i, /prerequisite|prior knowledge/i, /explanation|instruction|teach/i];

export function lessonId(relPath) {
  const norm = relPath.split("\\").join("/");
  const slug = norm.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "lesson";
  return `${slug}-${createHash("sha1").update(norm).digest("hex").slice(0, 8)}`;
}

export function classify(text, ext) {
  const t = text.trim();
  if (ext === ".json") {
    try { const j = JSON.parse(t); if (validateLesson(j).valid) return "decent"; } catch { /* fall through to text heuristics */ }
  }
  if (t.length < 200) return "empty";
  const hits = SECTION_HINTS.filter((re) => re.test(t)).length;
  return t.length >= 1500 && hits >= 5 ? "decent" : "partial";
}

function walk(dir, exts, acc = []) {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, acc);
    else if (exts.includes(extname(name).toLowerCase())) acc.push(p);
  }
  return acc;
}

const readManifest = () => {
  const p = join(work, "manifest.jsonl");
  if (!existsSync(p)) { console.error(`no manifest at ${p}; run ingest first`); process.exit(2); }
  return readFileSync(p, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
};
const isDone = (id) => {
  const p = join(outDir, `${id}.json`);
  if (!existsSync(p)) return false;
  const { data } = readJson(p);
  return !!data && validateLesson(data).valid;
};

if (cmd === "ingest") {
  const src = positional[1];
  if (!src) { console.error("usage: pipeline.mjs ingest <srcDir>"); process.exit(2); }
  const exts = String(flags.ext || ".md,.json,.txt,.html").split(",");
  const size = Number(flags["chunk-size"] || 500);
  const items = walk(src, exts).map((f) => {
    const rel = relative(src, f);
    const text = readFileSync(f, "utf8");
    return { lesson_id: lessonId(rel), source_path: rel, source_sha1: createHash("sha1").update(text).digest("hex"),
      state: classify(text, extname(f).toLowerCase()), chars: text.length };
  });
  const seen = new Map();
  for (const it of items) { // guarantee uniqueness while staying deterministic (sorted walk)
    const n = seen.get(it.lesson_id) || 0; seen.set(it.lesson_id, n + 1);
    if (n) it.lesson_id += `-${n + 1}`;
  }
  mkdirSync(join(work, "chunks"), { recursive: true });
  writeFileSync(join(work, "manifest.jsonl"), items.map((i) => JSON.stringify(i)).join("\n") + (items.length ? "\n" : ""));
  const order = { empty: 0, partial: 1, decent: 2 }; // rewrite worst lessons first
  const sorted = [...items].sort((a, b) => order[a.state] - order[b.state] || a.lesson_id.localeCompare(b.lesson_id));
  for (let i = 0; i * size < sorted.length; i++) {
    const name = `chunk-${String(i + 1).padStart(4, "0")}.json`;
    writeFileSync(join(work, "chunks", name), JSON.stringify({ chunk: i + 1, items: sorted.slice(i * size, (i + 1) * size) }, null, 1));
  }
  const counts = items.reduce((a, i) => ((a[i.state] = (a[i.state] || 0) + 1), a), {});
  console.log(`ingested ${items.length} lessons from ${src} into ${Math.ceil(items.length / size)} chunk(s):`, JSON.stringify(counts));
} else if (cmd === "status") {
  const m = readManifest();
  const stats = {};
  for (const it of m) { const s = (stats[it.state] ||= { total: 0, done: 0 }); s.total++; if (isDone(it.lesson_id)) s.done++; }
  const done = Object.values(stats).reduce((a, s) => a + s.done, 0);
  console.log(JSON.stringify(stats, null, 2));
  console.log(`done ${done}/${m.length}, pending ${m.length - done}`);
} else if (cmd === "next") {
  const limit = Number(flags.limit || 50);
  const pending = readManifest().filter((i) => (!flags.state || i.state === flags.state) && !isDone(i.lesson_id));
  const order = { empty: 0, partial: 1, decent: 2 };
  pending.sort((a, b) => order[a.state] - order[b.state] || a.lesson_id.localeCompare(b.lesson_id));
  console.log(JSON.stringify(pending.slice(0, limit), null, 1));
} else if (cmd === "queue") {
  const reviews = flags.reviews ? JSON.parse(readFileSync(flags.reviews, "utf8")) : {};
  const queue = [];
  let n = 0;
  if (existsSync(outDir)) for (const name of readdirSync(outDir).sort()) {
    if (!name.endsWith(".json")) continue;
    n++;
    const { data, error } = readJson(join(outDir, name));
    const r = error ? { tier: "draft", total: 0, schema_errors: [error], scores: {} } : scoreLesson(data, reviews[data?.lesson_id]);
    if (r.tier === "draft") {
      const weakest = Object.entries(r.scores).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k, v]) => `${k}=${v}`);
      queue.push({ lesson_id: basename(name, ".json"), total: r.total, weakest, schema_errors: r.schema_errors.slice(0, 10) });
    }
  }
  queue.sort((a, b) => a.total - b.total);
  mkdirSync(work, { recursive: true });
  writeFileSync(join(work, "review-queue.json"), JSON.stringify(queue, null, 2));
  console.log(`scored ${n} lessons; ${queue.length} in review queue -> ${join(work, "review-queue.json")}`);
} else {
  console.error("usage: pipeline.mjs <ingest|status|next|queue> ...");
  process.exit(2);
}
