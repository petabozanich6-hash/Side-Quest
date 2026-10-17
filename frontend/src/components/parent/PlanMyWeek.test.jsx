import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import PlanMyWeek from "./PlanMyWeek";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
  apiErrorMessage: (err, fallback) => err?.message || fallback,
}));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("./TimetableGenerator", () => () => null);
global.IS_REACT_ACT_ENVIRONMENT = true;

const first = { id: "first", name: "Mason" }, second = { id: "second", name: "Oliver" };
const date = "2026-10-19";
const slot = (id, child) => ({
  id, student_id: child, event_type: "timetable", date, title: "Mathematics",
  start_time: "09:00", duration_minutes: 45,
});
const proposal = (id, slotId, lessonId) => ({
  id, calendar_event_id: slotId, status: "proposed", action: "reuse_draft",
  learning_area: "Mathematics", outcome_codes: [],
  lesson: { id: lessonId, title: lessonId, status: "ready" },
});
let host, root, entries, decided, confirmed, done, stale;
beforeEach(async () => {
  jest.clearAllMocks();
  entries = [slot("slot-m", "first"), slot("slot-o", "second")];
  decided = new Set();
  stale = false;
  confirmed = jest.fn(() => true);
  done = jest.fn();
  window.confirm = confirmed;
  api.get.mockImplementation((path, options) => {
    if (path === "/calendar") return Promise.resolve({ data: entries.map(e => ({
      ...e, linked_assignment_id: decided.has(e.id) ? "assignment-" + e.id : e.linked_assignment_id,
    })) });
    if (path === "/auto-quest/proposals") {
      const child = options.params.student_id;
      return Promise.resolve({ data: { proposals: [
        { ...proposal(child === "first" ? "p-m" : "p-o",
          child === "first" ? "slot-m" : "slot-o",
          child === "first" ? "Maths for Mason" : "Maths for Oliver"),
          status: decided.has(child === "first" ? "slot-m" : "slot-o") ? "assigned" : "proposed",
        },
      ] } });
    }
    throw Error("Unexpected GET " + path);
  });
  api.post.mockImplementation((path, body) => {
    if (path === "/auto-quest/plan") {
      const child = body.student_id;
      return Promise.resolve({ data: { proposals: [
        proposal(child === "first" ? "p-m" : "p-o",
          child === "first" ? "slot-m" : "slot-o",
          child === "first" ? "Maths for Mason" : "Maths for Oliver"),
      ] } });
    }
    if (path.endsWith("/approve")) {
      const id = path.endsWith("p-m/approve") ? "slot-m" : "slot-o";
      decided.add(id);
      return Promise.resolve({ data: { status: "assigned", assignment_id: "assignment-" + id } });
    }
    throw Error("Unexpected POST " + path);
  });
  host = document.createElement("div"); document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => root.render(<PlanMyWeek students={[first, second]} initialDate={date}
    onClose={jest.fn()} onDone={done} />));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });
const click = async query => act(async () => host.querySelector(query).click());

test("one review safely displays matches for both children without auto-assigning", async () => {
  await click('[data-testid="plan-review-week"]');
  expect(host.querySelector('[data-testid="plan-week-results"]').textContent).toMatch(/Maths for Mason/);
  expect(host.querySelector('[data-testid="plan-week-results"]').textContent).toMatch(/Maths for Oliver/);
  expect(host.querySelector('[data-testid="plan-assign-selected"]').textContent).toMatch(/Assign 2 ready/);
  expect(api.post.mock.calls.filter(([path]) => path.endsWith("/approve"))).toHaveLength(0);
});

test("approved matches are scheduled individually for their own child after confirmation", async () => {
  await click('[data-testid="plan-review-week"]');
  await click('[data-testid="plan-assign-selected"]');
  expect(confirmed).toHaveBeenCalledTimes(1);
  expect(api.post.mock.calls.filter(([path]) => path.endsWith("/approve"))).toHaveLength(2);
  expect(done).toHaveBeenCalledTimes(1);
});

test("a timetable that changes after preview is never overwritten", async () => {
  await click('[data-testid="plan-review-week"]');
  entries = [{ ...slot("slot-m", "first"), linked_assignment_id: "existing" }, slot("slot-o", "second")];
  await click('[data-testid="plan-assign-selected"]');
  expect(api.post.mock.calls.filter(([path]) => path === "/auto-quest/proposals/p-m/approve")).toHaveLength(0);
  expect(api.post.mock.calls.filter(([path]) => path === "/auto-quest/proposals/p-o/approve")).toHaveLength(1);
  expect(host.textContent).toMatch(/changed since preview/);
});

test("when there are no learning times, guides the parent to set up the timetable", async () => {
  entries = [];
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(<PlanMyWeek students={[first, second]} initialDate={date}
    onClose={jest.fn()} onDone={done} />));
  expect(host.textContent).toMatch(/Set up learning times/);
  expect(host.querySelector('[data-testid="plan-review-week"]').disabled).toBe(true);
});
