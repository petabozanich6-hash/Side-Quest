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
// CRA's Jest resolver cannot import React Router 7's react-router/dom entrypoint.
jest.mock("react-router-dom", () => ({ Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a> }));
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
  expect(host.textContent).toMatch(/Choose different learning times/);
  expect(host.querySelector('[data-testid="plan-review-week"]').disabled).toBe(true);
});

test("copies last week's times for both children without carrying over old assignments", async () => {
  const get = api.get.getMockImplementation();
  const post = api.post.getMockImplementation();
  api.get.mockImplementation((path, options) => {
    if (path === "/timetable/slots") return Promise.resolve({ data: [{
      id: "last-week-maths", title: "Mathematics", date: "2026-10-12",
      start_time: "09:00", duration_minutes: 45,
      linked_assignment_id: "previous-assignment", linked_lesson_id: "old-lesson",
    }] });
    return get(path, options);
  });
  api.post.mockImplementation((path, body) => {
    if (path === "/timetable/week") return Promise.resolve({ data: { created: 2, skipped: 0 } });
    return post(path, body);
  });
  await click('[data-testid="plan-copy-week"]');
  const call = api.post.mock.calls.find(([path]) => path === "/timetable/week");
  expect(call).toBeDefined();
  expect(call[1].week_start).toBe("2026-10-19");
  expect(call[1].blocks).toHaveLength(2);
  expect(call[1].blocks.map(b => b.student_id).sort()).toEqual(["first", "second"]);
  expect(call[1].blocks.every(b => b.date === "2026-10-19" && !("linked_assignment_id" in b) && !("linked_lesson_id" in b))).toBe(true);
  expect(confirmed).toHaveBeenCalledTimes(1);
});

// Both children's slots have no matching lesson, or a draft waiting for review.
const useProposals = make => {
  const get = api.get.getMockImplementation();
  const post = api.post.getMockImplementation();
  const listed = options => ({ data: { proposals: [make(options.params?.student_id ?? options.student_id)] } });
  api.get.mockImplementation((path, options) => path === "/auto-quest/proposals" ? Promise.resolve(listed(options)) : get(path, options));
  api.post.mockImplementation((path, body) => path === "/auto-quest/plan" ? Promise.resolve(listed({ student_id: body.student_id })) : post(path, body));
};
const missingFor = child => ({ id: "p-" + child, calendar_event_id: child === "first" ? "slot-m" : "slot-o", status: "proposed",
  action: "needs_generation", learning_area: "Mathematics", outcome_codes: [], lesson: null });

test("missing lessons are written in the background, several at once, and the planner can still be closed", async () => {
  useProposals(missingFor);
  const finish = [];
  const post = api.post.getMockImplementation();
  api.post.mockImplementation((path, body) => path.endsWith("/generate")
    ? new Promise(resolve => finish.push(() => resolve({ data: {} }))) : post(path, body));
  await click('[data-testid="plan-review-week"]');
  await click('[data-testid="plan-draft-missing"]');
  expect(confirmed).toHaveBeenCalledTimes(1);
  // Both drafts start without waiting for each other.
  expect(api.post.mock.calls.filter(([path]) => path.endsWith("/generate"))).toHaveLength(2);
  expect(host.querySelector('[data-testid="plan-drafting"]').textContent).toMatch(/Writing 2 lessons/);
  expect(host.textContent).toMatch(/Writing the lesson…/);
  expect(host.querySelector('[aria-label="Close weekly planner"]').disabled).toBe(false);
  await act(async () => { finish.forEach(f => f()); });
  expect(host.querySelector('[data-testid="plan-drafting"]')).toBeNull();
});

test("drafts waiting for review link to a review page that can put them in their slot", async () => {
  useProposals(child => ({ ...missingFor(child), action: "reuse_draft", lesson: { id: "draft-" + child, title: "Draft", status: "draft" } }));
  await click('[data-testid="plan-review-week"]');
  expect(host.querySelector('[data-testid="plan-review-banner"]').textContent).toMatch(/2 drafts ready for your review/);
  expect(host.querySelector('[data-testid="plan-review-first"]').getAttribute("href"))
    .toBe("/parent/lessons/draft-first/review?week=2026-10-19&child=first");
  expect(host.querySelector('[data-testid="plan-review-slot-o"]').getAttribute("href"))
    .toBe("/parent/lessons/draft-second/review?week=2026-10-19&child=second");
});
