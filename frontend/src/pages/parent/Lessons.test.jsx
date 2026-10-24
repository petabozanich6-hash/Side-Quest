import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import LessonsPage from "./Lessons";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), post: jest.fn(), delete: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
// CRA's Jest resolver cannot import React Router 7's react-router/dom entrypoint.
jest.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}));
jest.mock("../../components/parent/ScheduleModal", () => () => null);
global.IS_REACT_ACT_ENVIRONMENT = true;

const kid = (done, status = "in_progress") => ({ student_id: "k1", student_name: "Mia", done, status });
let library;
let root, box;
const render = async () => {
  box = document.createElement("div"); document.body.appendChild(box);
  root = createRoot(box);
  await act(async () => { root.render(<LessonsPage />); });
};
beforeEach(() => {
  jest.clearAllMocks();
  library = [
    { id: "draft", title: "Volcano draft", status: "draft", ai_generated: true, assigned_to: [] },
    { id: "ready", title: "Fractions", status: "ready", assigned_to: [] },
    { id: "busy", title: "Place value", status: "ready", assigned_to: [kid(false)] },
    { id: "done", title: "Telling time", status: "ready", assigned_to: [kid(true, "accepted")] },
  ];
  api.get.mockImplementation(path => Promise.resolve({ data: path.startsWith("/lessons") ? library : path === "/students" ? [] : {} }));
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });
const visible = () => [...box.querySelectorAll('[data-testid^="open-"]')].map(a => a.textContent);
const tab = async k => act(async () => box.querySelector(`[data-testid="lib-tab-${k}"]`).click());

test("opens on lessons ready to use, keeping drafts, in-progress and finished lessons on their own tabs", async () => {
  await render();
  expect(visible()).toEqual(["Fractions"]);
  expect(box.querySelector('[data-testid="lib-tab-review"]').textContent).toContain("1");
  await tab("in_use");
  expect(visible()).toEqual(["Place value"]);
  await tab("finished");
  expect(visible()).toEqual(["Telling time"]);
  expect(box.querySelector('[data-testid="assign-done"]').textContent).toContain("Assign again");
  await tab("review");
  expect(visible()).toEqual(["Volcano draft"]);
  expect(box.querySelector('[data-testid="review-draft"]').getAttribute("href")).toBe("/parent/lessons/draft/review");
  await tab("all");
  expect(visible()).toHaveLength(4);
});

test("with nothing ready yet, a library of drafts opens on Needs review", async () => {
  library = library.filter(l => l.id === "draft");
  await render();
  expect(visible()).toEqual(["Volcano draft"]);
});

test("each card opens the lesson and keeps rarely used actions in its menu", async () => {
  await render();
  const card = box.querySelector('[data-testid="lesson-ready"]');
  expect(card.querySelector('[data-testid="open-ready"]').getAttribute("href")).toBe("/parent/lessons/ready/review");
  const menu = card.querySelector('[data-testid="more-ready"]');
  expect(menu.tagName).toBe("DETAILS");
  for (const id of ["dup-ready", "archive-ready", "delete-ready", "print-student-ready", "print-parent-ready"])
    expect(menu.querySelector(`[data-testid="${id}"]`)).not.toBeNull();
});

test("sorting by title reorders the cards", async () => {
  await render();
  await tab("all");
  await act(async () => {
    const select = box.querySelector('[data-testid="lib-sort"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
    setter.call(select, "title");
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(visible()).toEqual(["Fractions", "Place value", "Telling time", "Volcano draft"]);
});
