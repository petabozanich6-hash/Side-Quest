import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { validateLesson } from "../scripts/lib/validate.mjs";
import { scoreLesson } from "../scripts/lib/score.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".json")).map((f) => [f, JSON.parse(readFileSync(join(root, dir, f), "utf8"))]);
const run = (script, args) => spawnSync(process.execPath, [join(root, "scripts", script), ...args], { encoding: "utf8" });

test("gold lessons validate and pass the excellent gate with reviewer scores", () => {
  const reviews = JSON.parse(readFileSync(join(root, "examples/reviews.json"), "utf8"));
  for (const [f, l] of load("examples/gold")) {
    assert.deepEqual(validateLesson(l).errors, [], f);
    assert.equal(scoreLesson(l).tier, "good", f);
    assert.equal(scoreLesson(l, reviews[l.lesson_id]).tier, "excellent", f);
  }
});

test("failing examples are rejected", () => {
  for (const [f, l] of load("examples/failing")) {
    assert.equal(validateLesson(l).valid, false, f);
    assert.equal(scoreLesson(l).tier, "draft", f);
  }
});

test("semantic checks: unaligned objective index and bad multiple-choice answer", () => {
  const l = JSON.parse(JSON.stringify(load("examples/gold")[0][1]));
  l.formative_checks[0].objective_index = 9;
  l.formative_checks[1].type = "multiple-choice"; l.formative_checks[1].options = ["a", "b"];
  const errs = validateLesson(l).errors.join("\n");
  assert.match(errs, /out of range/);
  assert.match(errs, /correct_answer must be one of options/);
});

test("CLI exit codes implement the quality gate", () => {
  assert.equal(run("validate.mjs", [join(root, "examples/gold")]).status, 0);
  assert.equal(run("validate.mjs", [join(root, "examples/failing")]).status, 1);
  assert.equal(run("score.mjs", [join(root, "examples/gold")]).status, 0);
  assert.equal(run("score.mjs", [join(root, "examples/failing")]).status, 1);
});

test("pipeline: deterministic ingest, resumable status, review queue", () => {
  const tmp = mkdtempSync(join(tmpdir(), "lx-"));
  try {
    const src = join(tmp, "src"); mkdirSync(src);
    writeFileSync(join(src, "a.md"), "# Stub");
    writeFileSync(join(src, "b.md"), "Objectives\nExample\nPractice\n".padEnd(300, "x"));
    const work = join(tmp, "work"), out = join(tmp, "out"); mkdirSync(out);
    const args = ["--work", work, "--out", out];
    assert.equal(run("pipeline.mjs", ["ingest", src, "--work", work, "--chunk-size", "1"]).status, 0);
    const m1 = readFileSync(join(work, "manifest.jsonl"), "utf8");
    run("pipeline.mjs", ["ingest", src, "--work", work, "--chunk-size", "1"]);
    assert.equal(readFileSync(join(work, "manifest.jsonl"), "utf8"), m1, "ids must be deterministic");
    const items = m1.trim().split("\n").map((x) => JSON.parse(x));
    assert.deepEqual(items.map((i) => i.state), ["empty", "partial"]);
    assert.equal(readdirSync(join(work, "chunks")).length, 2);
    const gold = load("examples/gold")[0][1];
    writeFileSync(join(out, `${items[0].lesson_id}.json`), JSON.stringify({ ...gold, lesson_id: items[0].lesson_id }));
    assert.match(run("pipeline.mjs", ["status", ...args]).stdout, /done 1\/2, pending 1/);
    assert.equal(JSON.parse(run("pipeline.mjs", ["next", ...args]).stdout)[0].lesson_id, items[1].lesson_id);
    writeFileSync(join(out, "bad.json"), "{}");
    assert.match(run("pipeline.mjs", ["queue", ...args]).stdout, /scored 2 lessons; 1 in review queue/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
