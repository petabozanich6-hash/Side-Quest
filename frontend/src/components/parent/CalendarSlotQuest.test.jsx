import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import CalendarSlotQuest from "./CalendarSlotQuest";
import { api } from "../../lib/api";
import { toast } from "sonner";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), post: jest.fn(), put: jest.fn() }, apiErrorMessage: (_e, fallback) => fallback }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ children, ...props }) => <a href={props.to}>{children}</a> }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const event = { id: "slot-1", student_id: "child-1", title: "Mathematics",
  date: "2026-10-19", start_time: "09:00", duration_minutes: 45 };
const idea = { id: "proposal-1", calendar_event_id: "slot-1", status: "proposed",
  learning_area: "Mathematics", action: "needs_generation", outcome_codes: ["MA2-1"],
  reason: "Introduce new learning", lesson: null };
let box, root, done;

beforeEach(async () => {
  jest.clearAllMocks();
  done = jest.fn();
  api.get.mockImplementation(url => Promise.resolve({ data: url === "/lessons"
    ? [
      { id: "saved-1", title: "Fractions", learning_area: "Mathematics", status: "ready" },
      { id: "mason-open", title: "Already assigned", learning_area: "Mathematics", status: "ready",
        assigned_to: [{ student_id: "child-1", status: "in_progress" }] },
      { id: "mason-done", title: "Already finished", learning_area: "Mathematics", status: "ready",
        assigned_to: [{ student_id: "child-1", status: "completed" }] },
      { id: "sibling-assigned", title: "Sibling lesson", learning_area: "Mathematics", status: "ready",
        assigned_to: [{ student_id: "child-2", status: "accepted" }] },
    ]
    : { proposals: [] } }));
  api.post.mockImplementation(url => {
    if (url === "/auto-quest/plan") return Promise.resolve({ data: { proposals: [idea] } });
    if (url.endsWith("/generate")) return Promise.resolve({ data: { ...idea,
      lesson: { id: "draft-1", title: "Maths practice", status: "draft" } } });
    if (url.endsWith("/approve")) return Promise.resolve({ data: { ...idea, status: "assigned", assignment_id: "a-1" } });
    throw Error("Unexpected request: " + url);
  });
  api.put.mockResolvedValue({ data: { ...idea, lesson: { id: "saved-1", title: "Fractions", status: "ready" } } });
  box = document.createElement("div"); document.body.appendChild(box);
  root = createRoot(box);
  await act(async () => root.render(<CalendarSlotQuest event={event} onAssigned={done} />));
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });
const click = async selector => act(async () => box.querySelector(selector).click());

test("plans only its exact slot and assigns a chosen ready library lesson", async () => {
  await click('[data-testid="slot-plan"]');
  expect(api.post).toHaveBeenCalledWith("/auto-quest/plan", { student_id: "child-1", from: event.date, to: event.date, topic: "" });
  const select = box.querySelector('[data-testid="slot-lesson"]');
  await act(async () => { select.value = "saved-1"; select.dispatchEvent(new Event("change", { bubbles: true })); });
  await click('[data-testid="slot-choose"]');
  expect(api.put).toHaveBeenCalledWith("/auto-quest/proposals/proposal-1/lesson", { lesson_id: "saved-1" });
  await click('[data-testid="slot-approve"]');
  expect(api.post).toHaveBeenCalledWith("/auto-quest/proposals/proposal-1/approve", {});
  expect(done).toHaveBeenCalledTimes(1);
});


test("slot library hides assignments and completed lessons for this child, but keeps sibling lessons", async () => {
  await click('[data-testid="slot-plan"]');
  const options = [...box.querySelector('[data-testid="slot-lesson"]').options].map(o => o.value);
  expect(options).toContain("saved-1");
  expect(options).toContain("sibling-assigned");
  expect(options).not.toContain("mason-open");
  expect(options).not.toContain("mason-done");
});

test("AI draft requires explicit parent review before it can be assigned", async () => {
  await click('[data-testid="slot-plan"]');
  await click('[data-testid="slot-generate"]');
  expect(box.querySelector('[data-testid="slot-approve"]').disabled).toBe(true);
  await click('[data-testid="slot-reviewed"]');
  expect(box.querySelector('[data-testid="slot-approve"]').disabled).toBe(false);
  await click('[data-testid="slot-approve"]');
  expect(api.post).toHaveBeenCalledWith("/auto-quest/proposals/proposal-1/approve", { confirm_reviewed: true });
  expect(done).toHaveBeenCalledTimes(1);
});
