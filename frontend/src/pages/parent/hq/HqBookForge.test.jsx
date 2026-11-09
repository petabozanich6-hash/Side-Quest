import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import HqBookForge from "./HqBookForge";
import { adminApi } from "../../../lib/adminApi";
jest.mock("../../../lib/adminApi", () => ({
  adminApi: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
  errorText: (e) => e.message,
}));
jest.mock("../../../lib/api", () => ({ api: { get: jest.fn() } }));
jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <span>{children}</span>,
}));
global.IS_REACT_ACT_ENVIRONMENT = true;
let root, container;
const button = (name) =>
  [...container.querySelectorAll("button")].find((b) => b.textContent === name);
beforeEach(async () => {
  adminApi.get
    .mockReset()
    .mockImplementation(async (path) =>
      path.endsWith("/lessons")
        ? { lessons: [] }
        : path.endsWith("/generation")
          ? { job: null }
          : {
              projects: [],
              templates: [],
              capabilities: { art: true, pdf: true },
            },
    );
  adminApi.post.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<HqBookForge />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
test("primary action sends a workbook brief and starts durable generation; manual creation remains secondary", async () => {
  adminApi.post.mockResolvedValue({
    id: "p",
    revision: 1,
    book: { title: "Creating", template: "woodland", pages: [], releases: [] },
  });
  const create = button("Create my workbook");
  expect(create.type).toBe("submit");
  expect(create.disabled).toBe(false);
  expect(container.textContent).toContain("Optional page target");
  expect(container.textContent).not.toContain("74 pages");
  await act(async () =>
    create
      .closest("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(adminApi.post).toHaveBeenCalledWith(
    "/book-forge/generate",
    expect.objectContaining({
      brief: expect.stringContaining("Foundation mathematics"),
      length: "full",
    }),
  );
  expect(container.textContent).toContain("Your workbook is queued");
});
test("provider connection is required before beginning paid generation", async () => {
  adminApi.get.mockImplementation(async (path) =>
    path.endsWith("/lessons")
      ? { lessons: [] }
      : {
          projects: [],
          templates: [],
          capabilities: { art: false, pdf: false },
        },
  );
  await act(async () => {
    root.unmount();
    root = createRoot(container);
    root.render(<HqBookForge />);
  });
  expect(button("Create my workbook").disabled).toBe(true);
  expect(button("Create project").disabled).toBe(false);
});

test("a running build shows overall progress, the stages, an estimate and each session's state", async () => {
  const job = {
    status: "running", phase: "write", cursor: 2, total: 4, error: "", updated_at: new Date().toISOString(), review: null,
    progress: {
      percent: 43, minutesLeft: 4, pagesSaved: 6, startedAt: new Date().toISOString(),
      steps: { plan: { done: 1, total: 1 }, write: { done: 2, total: 4 }, illustrate: { done: 0, total: 1 }, render: { done: 0, total: 1 } },
      sessions: [
        { n: 1, title: "Numbers have names", state: "done" },
        { n: 2, title: "Counting to five", state: "done" },
        { n: 3, title: "Zero means none", state: "writing", attempts: 1 },
        { n: 4, title: "Ordering to ten", state: "waiting" },
      ],
    },
  };
  adminApi.post.mockResolvedValue({ id: "p", revision: 1, book: { title: "Creating", template: "woodland", pages: [], releases: [] } });
  adminApi.get.mockImplementation(async (path) =>
    path.endsWith("/generation") ? { job } : path.endsWith("/p") ? { id: "p", revision: 1, book: { title: "Creating", template: "woodland", pages: [], releases: [] } } : path.endsWith("/lessons") ? { lessons: [] } : { projects: [], templates: [], capabilities: { art: true, pdf: true } },
  );
  await act(async () =>
    button("Create my workbook").closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  const panel = container.querySelector('[data-testid="forge-progress"]');
  expect(panel).not.toBeNull();
  expect(panel.textContent).toContain("43% complete");
  expect(panel.textContent).toContain("About 4 min left");
  expect(panel.textContent).toContain("6 pages saved");
  expect(panel.textContent).toContain("2 of 4");
  expect(panel.textContent).toContain("Zero means none");
  expect(panel.textContent).toContain("Writing now · attempt 2");
  expect(panel.querySelector('[role="progressbar"]').getAttribute("aria-valuenow")).toBe("43");
});
