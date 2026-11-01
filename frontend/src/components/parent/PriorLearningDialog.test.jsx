import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import PriorLearningDialog from "./PriorLearningDialog";
import { api } from "../../lib/api";
import { readPdfPages, turnedPage } from "../../lib/pdfPages";

jest.mock("../../lib/api", () => ({ api: { post: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("../../lib/pdfPages", () => ({ readPdfPages: jest.fn(), turnedPage: jest.fn(async () => "turned-blob") }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const outcome = (code, subject, status = "not_started") => ({ code, subject, learning_area: subject, in_stage: true, status, summary: `Summary of ${code}` });
const data = { student: { id: "kid", name: "Mia Example" }, outcomes: [
  outcome("MA2-RN-01", "Mathematics"), outcome("MA2-AR-01", "Mathematics"), outcome("EN2-OLC-01", "English"), outcome("MA2-GM-01", "Mathematics", "achieved"),
] };
let root, box, done;
beforeEach(async () => {
  jest.clearAllMocks();
  done = jest.fn();
  api.post.mockImplementation((path) => path.endsWith("/analyse")
    ? Promise.resolve({ data: { document_type: "school_report", summary: "Year 3 Semester 1 report.", suggestions: [
        { code: "MA2-RN-01", subject: "Mathematics", summary: "Place value", evidence: "Grade A in Number", confidence: "high" },
        { code: "EN2-OLC-01", subject: "English", summary: "Speaking", evidence: "Sound oral presentations", confidence: "low" },
      ] } })
    : Promise.resolve({ data: { recorded: 1, skipped: 0 } }));
  box = document.createElement("div"); document.body.appendChild(box);
  root = createRoot(box);
  await act(async () => { root.render(<PriorLearningDialog data={data} onClose={jest.fn()} onDone={done} />); });
});
afterEach(async () => { await act(async () => root.unmount()); box.remove(); });
const click = async (id) => act(async () => box.querySelector(`[data-testid="${id}"]`).click());
const type = async (id, value) => act(async () => {
  const el = box.querySelector(`[data-testid="${id}"]`);
  const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
});

test("reading a report suggests outcomes, none ticked until the parent agrees", async () => {
  await click("prior-read");
  await type("prior-text", "Year 3 Semester 1. Mathematics: A. Number and algebra: confident with place value to 10,000.");
  await click("prior-analyse");
  expect(api.post).toHaveBeenCalledWith("/outcomes/students/kid/prior-learning/analyse", { text: expect.stringContaining("place value") });
  expect(box.querySelector('[data-testid="prior-summary"]').textContent).toContain("Year 3 Semester 1");
  expect([...box.querySelectorAll('[data-testid="prior-suggestions"] input')].every((i) => !i.checked)).toBe(true);
  expect(box.querySelector('[data-testid="prior-save"]').disabled).toBe(true);
  await click("prior-tick-strong");
  expect(box.querySelector('[data-testid="prior-suggestion-MA2-RN-01"] input').checked).toBe(true);
  expect(box.querySelector('[data-testid="prior-suggestion-EN2-OLC-01"] input').checked).toBe(false);
  expect(box.querySelector('[data-testid="prior-source"]').value).toBe("School report");
  await click("prior-save");
  expect(api.post).toHaveBeenLastCalledWith("/outcomes/students/kid/prior-learning", expect.objectContaining({ codes: ["MA2-RN-01"], source: "School report", file_ids: [] }));
  expect(done).toHaveBeenCalled();
});

test("choosing by hand lists only outcomes not already met, and needs a source", async () => {
  await click("prior-manual");
  expect(box.querySelector('[data-testid="prior-option-MA2-GM-01"]')).toBeNull();
  await act(async () => box.querySelector('[data-testid="prior-option-MA2-AR-01"] input').click());
  expect(box.querySelector('[data-testid="prior-save"]').disabled).toBe(true);
  await type("prior-source", "Previous school, Term 1");
  await click("prior-save");
  expect(api.post).toHaveBeenCalledWith("/outcomes/students/kid/prior-learning", expect.objectContaining({ codes: ["MA2-AR-01"], source: "Previous school, Term 1" }));
});

test("starting check results open straight on the review step, still unticked, with the source filled in", async () => {
  await act(async () => root.unmount());
  root = createRoot(box);
  const preset = { source: "Starting check: Mathematics (21 Oct 2026)", summary: "Mia answered 1 of 2 right first time.",
    suggestions: [{ code: "MA2-RN-01", subject: "Mathematics", summary: "Place value", evidence: "Answered correctly first time in the starting check.", confidence: "medium" }] };
  await act(async () => { root.render(<PriorLearningDialog data={data} preset={preset} onClose={jest.fn()} onDone={done} />); });
  expect(box.querySelector('[data-testid="prior-summary"]').textContent).toContain("1 of 2");
  expect(box.querySelector('[data-testid="prior-suggestion-MA2-RN-01"] input').checked).toBe(false);
  expect(box.querySelector('[data-testid="prior-source"]').value).toBe("Starting check: Mathematics (21 Oct 2026)");
  await act(async () => box.querySelector('[data-testid="prior-suggestion-MA2-RN-01"] input').click());
  await act(async () => box.querySelector('[data-testid="prior-save"]').click());
  expect(api.post).toHaveBeenCalledWith("/outcomes/students/kid/prior-learning", expect.objectContaining({ codes: ["MA2-RN-01"], source: "Starting check: Mathematics (21 Oct 2026)" }));
});

test("a scanned PDF is read as page pictures, with upside-down pages turned first", async () => {
  readPdfPages.mockResolvedValue({ hasText: false, total: 2, pages: [{ blob: new Blob(["a"]), url: "blob:1" }, { blob: new Blob(["b"]), url: "blob:2" }] });
  let uploads = 0;
  api.post.mockImplementation((path) => {
    if (path === "/files/upload") return Promise.resolve({ data: { id: `f${++uploads}` } });
    if (path.endsWith("/analyse")) return Promise.resolve({ data: { document_type: "work_sample", summary: "Science workbook.", suggestions: [] } });
    return Promise.resolve({ data: { recorded: 0, skipped: 0 } });
  });
  await click("prior-read");
  const input = box.querySelector('[data-testid="prior-file"]');
  const pdf = new File(["%PDF"], "workbook.pdf", { type: "application/pdf" });
  await act(async () => { Object.defineProperty(input, "files", { value: [pdf] }); input.dispatchEvent(new Event("change", { bubbles: true })); });
  expect(box.querySelector('[data-testid="prior-scan"]').textContent).toMatch(/its 2 pages/);
  await click("prior-turn-all");
  await click("prior-analyse");
  expect(turnedPage).toHaveBeenCalledTimes(2);
  // The original PDF (f1) is kept as evidence; the two page pictures (f2, f3) are what gets read.
  expect(api.post).toHaveBeenCalledWith("/outcomes/students/kid/prior-learning/analyse", { file_ids: ["f2", "f3"] });
});
