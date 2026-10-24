import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import StartingCheckDialog from "./StartingCheckDialog";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), post: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const data = { student: { id: "kid", name: "Mia Example" }, areas: [
  { learning_area: "Mathematics" }, { learning_area: "English" }, { learning_area: "Languages", unsupported: true },
] };
const answered = { id: "c1", subject: "Mathematics", created_at: "2026-10-20T00:00:00Z", answered_at: "2026-10-21T00:00:00Z", assignment_status: "submitted",
  items: [{ code: "MA2-RN-01", summary: "Place value", correct: true }, { code: "MA2-AR-01", summary: "Adding", correct: false }] };
let root, box, useResults, checks;
beforeEach(async () => {
  jest.clearAllMocks();
  checks = [answered];
  useResults = jest.fn();
  api.get.mockImplementation(() => Promise.resolve({ data: { checks } }));
  api.post.mockImplementation((_p, body) => { checks = [...checks, { ...answered, id: "c2", subject: body.subject, answered_at: null, items: [] }]; return Promise.resolve({ data: { id: "c2" } }); });
  box = document.createElement("div"); document.body.appendChild(box);
  root = createRoot(box);
  await act(async () => { root.render(<StartingCheckDialog data={data} onClose={jest.fn()} onUseResults={useResults} />); });
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });

test("lists checks with first-try results and offers answered ones as prior learning", async () => {
  expect(box.querySelector('[data-testid="check-Mathematics"]').textContent).toContain("1 of 2 right first time");
  await act(async () => box.querySelector('[data-testid="check-use-Mathematics"]').click());
  expect(useResults).toHaveBeenCalledWith(answered);
});

test("ticks only subjects without a check, skips untracked subjects, and makes the chosen checks", async () => {
  expect(box.querySelector('[data-testid="check-subject-Mathematics"]').checked).toBe(false);
  expect(box.querySelector('[data-testid="check-subject-English"]').checked).toBe(true);
  expect(box.querySelector('[data-testid="check-subject-Languages"]')).toBeNull();
  await act(async () => box.querySelector('[data-testid="check-create"]').click());
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(api.post).toHaveBeenCalledWith("/outcomes/students/kid/starting-checks", { subject: "English" });
  expect(box.querySelector('[data-testid="check-English"]').textContent).toContain("Waiting for Mia");
});
