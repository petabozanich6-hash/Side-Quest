// The same lesson can't be assigned to the same child twice, and the library shows who has each lesson.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import * as lb from "../src/lessonBuilder.ts";

const NOW = new Date("2026-10-14T00:00:00Z");

function seed(db, fam = "f1") {
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,plan) VALUES (?,?,?,?,?)").run(fam, "Fam", `u-${fam}`, NOW.toISOString(), "ACTIVE_MONTHLY");
  db.raw.prepare("UPDATE families SET plan_period_end = ? WHERE id = ?").run(new Date(NOW.getTime() + 30 * 86400000).toISOString(), fam);
  for (const [id, name] of [["s1", "Mia"], ["s2", "Sam"]]) {
    db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,created_at) VALUES (?,?,?,?,?,?,?)").run(`${fam}-${id}`, fam, name, `${fam}${id}`, "x", "S2", NOW.toISOString());
  }
}

async function readyLesson(db, fam = "f1") {
  const r = await lb.createLesson(db, fam, { title: "Fractions", learning_area: "Mathematics", year_level: "Year 3", status: "ready", objectives: ["Halves"] }, NOW);
  assert.ok(r.ok, JSON.stringify(r));
  return r.lesson;
}

test("a lesson can't be assigned twice to one child, even with two requests at once", async () => {
  const db = makeDb();
  seed(db);
  const l = await readyLesson(db);
  const results = await Promise.all([1, 2, 3].map(() => lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id }, NOW)));
  assert.equal(results.filter((r) => r.ok).length, 1);
  assert.ok(results.filter((r) => !r.ok).every((r) => r.code === "ALREADY_ASSIGNED"));
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM assignments WHERE student_id = 'f1-s1'").get().n, 1);
  assert.ok((await lb.assignLesson(db, "f1", { student_id: "f1-s2", lesson_id: l.id }, NOW)).ok, "a different child can have it");
});

test("a finished lesson needs an explicit 'assign again'; an open one never doubles", async () => {
  const db = makeDb();
  seed(db);
  const l = await readyLesson(db);
  const first = await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id }, NOW);
  assert.equal((await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id, again: true }, NOW)).code, "ALREADY_ASSIGNED", "again never applies while one is open");
  db.raw.prepare("UPDATE assignments SET status = 'completed' WHERE id = ?").run(first.assignment.id);
  const blocked = await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id }, NOW);
  assert.equal(blocked.code, "ALREADY_COMPLETED");
  assert.equal((await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id, again: "true" }, NOW)).code, "ALREADY_COMPLETED", "only a real boolean counts");
  assert.ok((await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id, again: true }, NOW)).ok);
});

test("the library lists who each lesson is assigned to, one entry per child, never another family's", async () => {
  const db = makeDb();
  seed(db);
  seed(db, "f2");
  const l = await readyLesson(db);
  const other = await readyLesson(db, "f2");
  const a = await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id }, NOW);
  db.raw.prepare("UPDATE assignments SET status = 'completed' WHERE id = ?").run(a.assignment.id);
  await lb.assignLesson(db, "f1", { student_id: "f1-s1", lesson_id: l.id, again: true }, NOW);
  await lb.assignLesson(db, "f2", { student_id: "f2-s1", lesson_id: other.id }, NOW);
  const mine = (await lb.listLessons(db, "f1")).find((x) => x.id === l.id);
  assert.equal(mine.assigned_to.length, 1);
  assert.equal(mine.assigned_to[0].student_name, "Mia");
  assert.equal(mine.assigned_to[0].done, false, "the open repeat wins over the finished one");
  assert.ok(!JSON.stringify(await lb.listLessons(db, "f1")).includes("f2-s1"));
});
