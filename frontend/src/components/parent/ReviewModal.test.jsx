import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import ReviewModal from "./ReviewModal";
import { api } from "../../lib/api";
import { toast } from "sonner";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn(), post: jest.fn() }, fileUrl: jest.fn() }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const submission = {
  id: "sub-1", assignment_id: "assignment-1", status: "submitted",
  submitted_at: "2026-10-21T00:00:00Z", response_text: "My answers",
  student: { name: "Explorer" },
  lesson: {
    title: "Fractions", builder: true, stage: "S2", learning_area: "Mathematics", outcome_codes: [],
    questions: [{ prompt: "Why is a half plus a half one whole?" }],
    guided_practice: [{ prompt: "Try one half plus one quarter" }],
    activities: [{ title: "Fraction blocks", tasks: [{ prompt: "Describe your result" }] }],
  },
  review_answers: {
    answers: { 0: "Two halves" },
    guided: { 0: "three quarters" },
    tasks: { "0.0": "A whole" },
  },
  review_flags: [],
};
let root, box, done, close;
beforeEach(async () => {
  jest.clearAllMocks();
  api.get.mockResolvedValue({ data: submission });
  api.post.mockResolvedValue({ data: { ok: true } });
  done = jest.fn(); close = jest.fn();
  box = document.createElement("div");
  document.body.appendChild(box);
  root = createRoot(box);
  await act(async () => { root.render(<ReviewModal submissionId="sub-1" onDone={done} onClose={close} />); });
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });

test("parents can flag a single question and return work without a general comment", async () => {
  const boxToTick = box.querySelector('[data-testid="flag-question:0"]');
  expect(boxToTick).not.toBeNull();
  expect(box.textContent).toContain("Two halves");
  await act(async () => { boxToTick.click(); });
  expect(box.querySelector('[data-testid="flag-count"]').textContent).toContain("1 flagged");
  await act(async () => { box.querySelector('[data-testid="return-btn"]').click(); });
  expect(api.post).toHaveBeenCalledWith("/submissions/sub-1/feedback", expect.objectContaining({
    status: "needs_revision",
    review_flags: [{ key: "question:0", comment: "" }],
  }));
  expect(done).toHaveBeenCalledTimes(1);
});

test("parents must flag something or leave a comment before sending back", async () => {
  await act(async () => { box.querySelector('[data-testid="return-btn"]').click(); });
  expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Flag a question"));
  expect(api.post).not.toHaveBeenCalled();
});
