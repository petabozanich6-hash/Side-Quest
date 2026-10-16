import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import AssignmentsPage from "./Assignments";
import { api } from "../../lib/api";
import { toast } from "sonner";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), delete: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ children }) => <span>{children}</span>, useSearchParams: () => [new URLSearchParams()] }));
jest.mock("../../components/parent/LessonPrintActions", () => () => null);
global.IS_REACT_ACT_ENVIRONMENT = true;
let container, root;
const row = { id: "a", student_id: "s", status: "in_progress", lesson: { title: "Fractions" } };
beforeEach(async () => {
  jest.clearAllMocks();
  window.confirm = jest.fn(() => true);
  api.get.mockImplementation(path => Promise.resolve({ data: path === "/assignments" ? [row, { ...row, id: "done", status: "completed" }] : [{ id: "s", name: "Mia" }] }));
  container = document.createElement("div"); document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<AssignmentsPage />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
const button = () => container.querySelector('[data-testid="asg-cancel-a"]');

test("dismissing confirmation leaves started work assigned", async () => {
  window.confirm.mockReturnValue(false);
  await act(async () => button().click());
  expect(api.delete).not.toHaveBeenCalled();
  expect(button()).not.toBeNull();
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Fractions" for Mia'));
});

test("confirmed revoke disables repeat clicks and updates immediately without a refetch", async () => {
  let finish;
  api.delete.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  await act(async () => button().click());
  expect(button().disabled).toBe(true);
  expect(button().textContent).toBe("Revoking…");
  await act(async () => finish({ data: { ok: true } }));
  expect(button()).toBeNull();
  expect(api.get).toHaveBeenCalledTimes(2);
  const filter = container.querySelector('[data-testid="asg-show"]');
  await act(async () => { filter.value = "all"; filter.dispatchEvent(new Event("change", { bubbles: true })); });
  expect(container.querySelector('[data-testid="asg-a"]').textContent).toContain("Revoked");
  expect(container.querySelector('[data-testid="asg-cancel-done"]')).toBeNull();
  expect(container.querySelector('[data-testid="asg-done"]').textContent).toContain("Completed");
});

test("server failure keeps assignment visible and permits retry", async () => {
  api.delete.mockRejectedValue({ response: { data: { detail: "Try again" } } });
  await act(async () => button().click());
  expect(button().disabled).toBe(false);
  expect(toast.error).toHaveBeenCalledWith("Try again");
  expect(container.querySelector('[data-testid="asg-a"]').textContent).toContain("In progress");
});
