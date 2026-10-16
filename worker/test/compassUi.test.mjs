import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPASS_GUIDES, COMPASS_STEP_IDS } from "../../frontend/src/data/homeschoolCompass.js";
import { COMPASS_BRIEF, COMPASS_STEP_HELP, compassStepHelp } from "../../frontend/src/data/compassStepHelp.js";
import { compassDaysUntil, compassPrettyDate, compassRegistrationSummary, compassSubtractMonths } from "../../frontend/src/lib/compassProgress.js";

test("all eight jurisdictions have complete expandable instructions for every Compass checklist step", () => {
  assert.equal(Object.keys(COMPASS_GUIDES).length, 8);
  for (const [code, guide] of Object.entries(COMPASS_GUIDES)) {
    assert.equal(guide.steps.length, COMPASS_STEP_IDS.length, code);
    assert.deepEqual(guide.steps.map(s => s.id), COMPASS_STEP_IDS, code);
    for (const step of guide.steps) {
      const help = compassStepHelp(code, step.id);
      assert.ok(help, code + " missing " + step.id);
      assert.ok(typeof help.meaning === "string" && help.meaning.length > 40, code + " " + step.id + " explanation");
      assert.ok(help.actions.length >= 3 && help.actions.every(a => a.length > 30), code + " " + step.id + " practical tasks");
      assert.ok(help.completeWhen?.length > 30, code + " " + step.id + " completion criteria");
      assert.ok(COMPASS_BRIEF[step.id]?.length > 15);
      assert.ok(guide.links[help.link]?.url.startsWith("https://"), code + " " + step.id + " official link");
    }
    assert.equal(Object.keys(COMPASS_STEP_HELP[code]).length, COMPASS_STEP_IDS.length);
  }
});

const now = new Date("2026-10-16T12:00:00Z");
test("registration summary shows entered dates and a near-expiry warning without government confirmation claims", () => {
  const v = compassRegistrationSummary({ registration_status: "approved", approved_on: "2026-02-12", expires_on: "2026-12-01" }, "NSW", now);
  assert.equal(v.label, "Registered (parent-reported)");
  assert.equal(v.expiryDays, 46);
  assert.equal(v.expiryDate, "1 Dec 2026");
  assert.equal(v.tone, "amber");
  assert.match(v.reminder, /registration expires/);
});
test("already expired registration is surfaced above any non-expired status", () => {
  const v = compassRegistrationSummary({ registration_status: "approved", expires_on: "2026-09-01" }, "QLD", now);
  assert.equal(v.tone, "red");
  assert.match(v.reminder, /has passed/);
});
test("ACT renewal is three calendar months before expiry, including last-day clamp", () => {
  assert.equal(compassSubtractMonths("2026-05-31", 3), "2026-02-28");
  const v = compassRegistrationSummary({ registration_status: "approved", expires_on: "2027-01-16" }, "ACT", now);
  assert.equal(v.renewalDeadline, "16 Oct 2026");
  assert.equal(v.tone, "red");
  assert.match(v.reminder, /ACT renewal deadline/);
});
test("approved registrations without an expiry in VIC are not given invented annual renewal reminders", () => {
  const vic = compassRegistrationSummary({ registration_status: "approved" }, "VIC", now);
  assert.equal(vic.reminder, "");
  assert.equal(vic.tone, "green");
  const nsw = compassRegistrationSummary({ registration_status: "approved" }, "NSW", now);
  assert.match(nsw.reminder, /Add the expiry date/);
});
test("status, date and validation helpers account for user-entered values", () => {
  assert.equal(compassPrettyDate("2026-02-30"), null);
  assert.equal(compassDaysUntil("", "2026-10-16"), null);
  assert.equal(compassDaysUntil("2026-10-17", "2026-10-16"), 1);
  assert.match(compassRegistrationSummary({ registration_status: "approved" }, "SA", now).label, /Exemption/);
});
