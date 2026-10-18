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
});
