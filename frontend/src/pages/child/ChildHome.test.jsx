import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import ChildHome from "./ChildHome";
import { api } from "../../lib/api";
import { syncSavedLessons, savedLessonIds, notices, savedDashboard } from "../../lib/offline";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn() } }));
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "child-1", name: "Child", username: "child-one", theme: "senior" } }),
}));
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => require("react").createElement("a", { href: to, ...props }, children),
}));
jest.mock("../../components/child/PetWelcome", () => () => null);
jest.mock("../../lib/offlineSignIn", () => ({ forgetOfflineChild: jest.fn() }));
jest.mock("../../lib/offline", () => ({
  clearNotices: jest.fn(), dropSavedLessons: jest.fn(), isNetworkError: () => false,
  notices: jest.fn(async () => []), onOfflineChange: () => () => {},
  saveDashboard: jest.fn(), savedDashboard: jest.fn(async () => null),
  savedLessonIds: jest.fn(async () => new Set()), syncSavedLessons: jest.fn(),
}));

global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;

beforeEach(async () => {
  jest.clearAllMocks();
  // CRA's Jest configuration resets mock implementations between tests.
  savedLessonIds.mockResolvedValue(new Set());
  notices.mockResolvedValue([]);
  savedDashboard.mockResolvedValue(null);
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

test("all unfinished quests remain accessible, including a sixth in-progress lesson", async () => {
  const quests = Array.from({ length: 7 }, (_, i) => ({
    id: `assignment-${i + 1}`, student_id: "child-1",
    status: i === 5 ? "in_progress" : i === 6 ? "needs_revision" : "not_started",
    lesson: { id: `lesson-${i + 1}`, title: `Quest ${i + 1}`, learning_area: "Science", stage: "S2" },
  }));
  api.get.mockImplementation((path) => {
    if (path === "/dashboard/child") return Promise.resolve({
      data: { today: quests.slice(0, 5), all_pending: quests, offline_allowed: true,
        completed: [], waiting: [], xp: 0 },
    });
    if (path === "/calendar") return Promise.resolve({ data: [] });
    throw Error("Unexpected path " + path);
  });

  await act(async () => root.render(<ChildHome />));

  expect(host.querySelectorAll('[data-testid^="task-assignment-"]')).toHaveLength(7);
  expect(host.querySelector('[data-testid="task-assignment-6"]')).not.toBeNull();
  expect(host.querySelector('[data-testid="task-assignment-7"]')).not.toBeNull();
  expect(syncSavedLessons).toHaveBeenCalledWith("child-1", quests);
  expect(host.querySelector('[data-testid="continue-quest"]')).not.toBeNull();
  expect(host.querySelector('[data-testid="task-assignment-6"]').getAttribute("href")).toBe("/child/lesson/assignment-6");
});


test("returned work has a clear action and never loses the child-facing feedback", async () => {
  api.get.mockImplementation((path) => {
    if (path === "/dashboard/child") return Promise.resolve({
      data: {
        all_pending: [{
          id: "try-again", student_id: "child-1", status: "needs_revision",
          lesson: { id: "plant-lesson", title: "Plant Life Cycles", learning_area: "Science" },
        }],
        feedback: [{ assignment_id: "try-again", parent_feedback: "Have another look at question three." }],
        waiting: [], completed: [], offline_allowed: true, xp: 5,
      },
    });
    if (path === "/calendar") return Promise.resolve({ data: [] });
    throw Error("Unexpected path " + path);
  });
  await act(async () => root.render(<ChildHome />));
  expect(host.textContent).toContain("Have another look at question three.");
  expect(host.textContent).toContain("Review and Continue");
  expect(host.querySelector('[data-testid="task-try-again"]').getAttribute("href")).toBe("/child/lesson/try-again");
});

test("an empty dashboard offers other useful activities without invented quests", async () => {
  api.get.mockImplementation((path) => {
    if (path === "/dashboard/child") return Promise.resolve({
      data: { all_pending: [], completed: [], waiting: [], offline_allowed: false, xp: 0 },
    });
    if (path === "/calendar") return Promise.resolve({ data: [] });
    throw Error("Unexpected path " + path);
  });
  await act(async () => root.render(<ChildHome />));
  expect(host.querySelector('[data-testid="no-work"]')).not.toBeNull();
  expect(host.querySelector('[data-testid="continue-quest"]')).toBeNull();
  expect(host.querySelector('a[href="/child/stuff"]')).not.toBeNull();
});
