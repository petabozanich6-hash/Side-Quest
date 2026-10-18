import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import MakeLesson from "./MakeLesson";
import { api } from "../../lib/api";
import { runBatch } from "../../lib/batchRunner";

let mockSearch = new URLSearchParams();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => require("react").createElement("a", { href: to, ...props }, children),
  useNavigate: () => jest.fn(),
  useSearchParams: () => [mockSearch],
}));
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
const THREE = [
  { title: "Science — Witch's laboratory", goal: "Explore changes", learning_area: "Science", additional_learning_areas: [] },
  { title: "English — Gothic writing", goal: "Write a suspenseful passage", learning_area: "English", additional_learning_areas: ["Humanities and Social Sciences"] },
  { title: "Humanities and Social Sciences — Origins of Halloween", goal: "Investigate cultural traditions", learning_area: "Humanities and Social Sciences", additional_learning_areas: ["English"] },
];
beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockImplementation(path => {
    if (path === "/account/plan") return Promise.resolve({ data: { limits: { aiGeneration: true }, effective_plan: "ACTIVE_MONTHLY" } });
    if (path === "/students") return Promise.resolve({ data: [{ id: "kid-7", name: "Year 7 child" }] });
    if (path === "/auth/me") return Promise.resolve({ data: { jurisdiction: "NSW", is_platform_owner: false } });
    throw Error("unexpected GET " + path);
  });
  api.post.mockImplementation((path, body) => {
    const count = body?.subjects?.length === 3 || body?.lessons?.length === 3 ? 3 : 2;
    if (path === "/ai/series-plan") return Promise.resolve({ data: { title: "Halloween Year 7", count, minutes: 60, lessons: count === 3 ? THREE : TWO, usage: { unlimited: true } } });
    if (path === "/ai/batches") return Promise.resolve({ data: { id: "batch-a", items: Array.from({ length: count }, (_, index) => ({ index, state: "pending" })) } });
    if (path === "/ai/lesson-draft") return Promise.resolve({ data: { lesson: { id: "one" }, assumptions: {}, warnings: [], generation: {} } });
    throw Error("unexpected POST " + path);
  });
  node = document.createElement("div"); document.body.appendChild(node);
  root = createRoot(node);
});
afterEach(async () => { await act(async () => root.unmount()); node.remove(); });
const mount = async prompt => {
  mockSearch = new URLSearchParams(`prompt=${encodeURIComponent(prompt)}&student=kid-7`);
  await act(async () => root.render(<MakeLesson />));
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

test("a three-subject Halloween request previews Science, English and HSIE separately and retains related areas", async () => {
  await mount("Create three Halloween lessons for Year 7: a science, an English, and an HSIE");
  await click('[data-testid="mk-go"]');
  const call = api.post.mock.calls.find(([p]) => p === "/ai/series-plan");
  expect(call[1]).toMatchObject({
    count: 3, subjects: ["Science", "English", "Humanities and Social Sciences"],
  });
  expect(node.querySelectorAll('[data-testid^="series-subject-"]')).toHaveLength(3);
  expect(node.querySelectorAll('[data-testid^="series-related-"]')).toHaveLength(3);
  await click('[data-testid="series-go"]');
  const saved = api.post.mock.calls.find(([p]) => p === "/ai/batches")[1];
  expect(saved.lessons.map(l => l.learning_area)).toEqual(["Science", "English", "Humanities and Social Sciences"]);
  expect(saved.lessons[1].additional_learning_areas).toEqual(["Humanities and Social Sciences"]);
  expect(runBatch).toHaveBeenCalledWith("batch-a", [0, 1, 2]);
});

test("free preview can request one complete lesson with no multi-lesson planning", async () => {
  api.get.mockImplementation(path => {
    if (path === "/account/plan") return Promise.resolve({ data: { limits: { aiGeneration: false }, effective_plan: "FREE_PREVIEW", free_ai_lesson: { available: true, used: false } } });
    if (path === "/students") return Promise.resolve({ data: [{ id: "kid-7", name: "Year 7 child" }] });
    if (path === "/auth/me") return Promise.resolve({ data: { jurisdiction: "NSW", is_platform_owner: false } });
    throw Error("unexpected GET " + path);
  });
  await mount("Create a one-hour Year 7 maths lesson about fractions");
  expect(node.querySelector('[data-testid="free-ai-lesson-offer"]')).not.toBeNull();
  expect(node.querySelector('[data-testid="mk-go"]').textContent).toContain("Free AI Lesson");
  expect(node.querySelectorAll('[data-testid="mk-example"]')).toHaveLength(2);
  await click('[data-testid="mk-go"]');
  expect(api.post.mock.calls.filter(([p]) => p === "/ai/lesson-draft")).toHaveLength(1);
  expect(api.post.mock.calls.filter(([p]) => p === "/ai/series-plan")).toHaveLength(0);
});

test("free preview multi-lesson requests are explained without calling AI", async () => {
  api.get.mockImplementation(path => {
    if (path === "/account/plan") return Promise.resolve({ data: { limits: { aiGeneration: false }, effective_plan: "FREE_PREVIEW", free_ai_lesson: { available: true } } });
    if (path === "/students") return Promise.resolve({ data: [{ id: "kid-7", name: "Year 7 child" }] });
    if (path === "/auth/me") return Promise.resolve({ data: { jurisdiction: "NSW", is_platform_owner: false } });
    throw Error("unexpected GET " + path);
  });
  await mount("Create four science lessons about the solar system for my Year 5 child next week.");
  await click('[data-testid="mk-go"]');
  expect(node.querySelector('[data-testid="mk-error"]').textContent).toContain("one complete lesson");
  expect(api.post).not.toHaveBeenCalled();
});

test("free preview with used AI lesson shows upgrade instead of another generator", async () => {
  api.get.mockImplementation(path => {
    if (path === "/account/plan") return Promise.resolve({ data: { limits: { aiGeneration: false }, effective_plan: "FREE_PREVIEW", free_ai_lesson: { available: false, used: true } } });
    if (path === "/students") return Promise.resolve({ data: [] });
    if (path === "/auth/me") return Promise.resolve({ data: { jurisdiction: "NSW", is_platform_owner: false } });
    throw Error("unexpected GET " + path);
  });
  await mount("");
  expect(node.querySelector('[data-testid="ai-upsell"]')).not.toBeNull();
  expect(node.querySelector('[data-testid="mk-go"]')).toBeNull();
  expect(node.textContent).toContain("one complete free AI lesson");
});
