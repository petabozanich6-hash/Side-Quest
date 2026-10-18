import test from "node:test";
import assert from "node:assert/strict";
import { compareSchema, REQUIRED, REQUIRED_INDEXES } from "../scripts/audit-d1-schema.mjs";
const fixtures = () => ({
  objects: [...Object.keys(REQUIRED), ...REQUIRED_INDEXES].map(name => ({ name })),
  columns: Object.entries(REQUIRED).flatMap(([table_name, names]) => names.map(name => ({ table_name, name }))),
  recorded: [{ name: "0060_owner_hq.sql" }],
  migrationFiles: ["0060_owner_hq.sql", "0069_parent_email_verification.sql"],
});
test("complete schema with an unrecorded migration produces drift only", () => {
  const report = compareSchema(fixtures());
  assert.deepEqual(report.issues, []);
  assert.deepEqual(report.pending_migration_records, ["0069_parent_email_verification.sql"]);
});
test("reports missing columns, tables and indexes without modifying fixtures", () => {
  const fixture = fixtures();
  fixture.columns = fixture.columns.filter(x => !(x.table_name === "users" && x.name === "email_verified_at"));
  fixture.objects = fixture.objects.filter(x => !["password_resets", "idx_email_verification_user"].includes(x.name));
  const before = JSON.stringify(fixture);
  const report = compareSchema(fixture);
  assert(report.issues.some(x => x.kind === "missing_column" && x.name === "users.email_verified_at"));
  assert(report.issues.some(x => x.kind === "missing_table" && x.name === "password_resets"));
  assert(report.issues.some(x => x.kind === "missing_index" && x.name === "idx_email_verification_user"));
  assert.equal(JSON.stringify(fixture), before);
});
test("pre-release audit refuses a missing one-free-AI-lesson unique index", () => {
  const fixture = fixtures();
  fixture.objects = fixture.objects.filter(x => x.name !== "idx_ai_one_free_lesson_per_family");
  const report = compareSchema(fixture);
  assert(report.issues.some(x => x.kind === "missing_index" && x.name === "idx_ai_one_free_lesson_per_family"));
});

test("identifies migrations recorded but absent in repository", () => {
  const fixture = fixtures();
  fixture.recorded.push({ name: "retired.sql" });
  assert.deepEqual(compareSchema(fixture).recorded_missing_from_repo, ["retired.sql"]);
});
