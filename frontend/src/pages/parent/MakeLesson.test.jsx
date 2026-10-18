import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import MakeLesson from "./MakeLesson";
import { api } from "../../lib/api";
import { runBatch } from "../../lib/batchRunner";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), post: jest.fn() } }));
jest.mock("../../lib/batchRunner", () => ({
  newId: () => "11223344-1122-4122-8122-112233445566",
  runBatch: jest.fn(),
}));
global.IS_REACT_ACT_ENVIRONMENT = true;
let node, root;
const TWO = [
  { title: "Science — Haunted chemical reactions", goal: "Explain chemical versus physical changes", learning_area: "Science" },
  { title: "Mathematics — Pumpkin proportions", goal: "Use ratios to scale Halloween recipes", learning_area: "Mathematics" },
];
beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockImplementation(path => {
    if (path === "/account/plan") return Promise.resolve({ data: { limits: { aiGeneration: true }, effective_plan: "ACTIVE_MONTHLY" } });
    if (path === "/students") return Promise.resolve({ data: [{ id: "kid-7", name: "Year 7 child" }] });
    if (path === "/auth/me") return Promise.resolve({ data: { jurisdiction: "NSW", is_platform_owner: false } });
    throw Error("unexpected GET " + path);
  });
  api.post.mockImplementation(path => {
    if (path === "/ai/series-plan") return Promise.resolve({ data: { title: "Halloween Year 7", count: 2, minutes: 60, lessons: TWO, usage: { unlimited: true } } });
    if (path === "/ai/batches") return Promise.resolve({ data: { id: "batch-a", items: [{ index: 0, state: "pending" }, { index: 1, state: "pending" }] } });
    if (path === "/ai/lesson-draft") return Promise.resolve({ data: { lesson: { id: "one" }, assumptions: {}, warnings: [], generation: {} } });
    throw Error("unexpected POST " + path);
  });
  node = document.createElement("div"); document.body.appendChild(node);
  root = createRoot(node);
});
afterEach(async () => { await act(async () => root.unmount()); node.remove(); });
const mount = async prompt => {
  await act(async () => root.render(
    <MemoryRouter initialEntries={[`/parent/lessons/make?prompt=${encodeURIComponent(prompt)}&student=kid-7`]}>
      <MakeLesson />
    </MemoryRouter>
  ));
};
const click = async selector => act(async () => node.querySelector(selector).click());

test("Year 7 Halloween Science and Maths request previews both full lessons, then saves two draft slots", async () => {
  await mount("Create a Halloween science and math lesson at the same time for a Year 7 student");
  await click('[data-testid="mk-go"]');
  const call = api.post.mock.calls.find(([p]) => p === "/ai/series-plan");
  expect(call).toBeDefined();
  expect(call[1]).toMatchObject({ count: 2, subjects: ["Science", "Mathematics"], student_id: "kid-7" });
  expect(api.post.mock.calls.some(([p]) => p === "/ai/lesson-draft")).toBe(false);
  expect(node.querySelectorAll('[data-testid^="series-subject-"]')).toHaveLength(2);
  expect(node.textContent).toContain("Science");
  expect(node.textContent).toContain("Mathematics");
  await click('[data-testid="series-go"]');
  const save = api.post.mock.calls.find(([p]) => p === "/ai/batches");
  expect(save).toBeDefined();
  expect(save[1].lessons).toEqual(TWO);
  expect(runBatch).toHaveBeenCalledWith("batch-a", [0, 1]);
});

test("explicitly integrated Science and Maths request remains a single lesson", async () => {
  await mount("Create a single lesson combining science and math for Year 7");
  await click('[data-testid="mk-go"]');
  expect(api.post.mock.calls.filter(([p]) => p === "/ai/series-plan")).toHaveLength(0);
  expect(api.post.mock.calls.filter(([p]) => p === "/ai/lesson-draft")).toHaveLength(1);
});
