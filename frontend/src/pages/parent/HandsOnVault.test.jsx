import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import HandsOnVault from "./HandsOnVault";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn() }, apiErrorMessage: jest.fn(() => "Unavailable") }));
jest.mock("sonner", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({ children, to }) => <a href={to}>{children}</a> }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const sampleQuest = {
  id: "oobleck-lab", title: "The Dragon's Oobleck Quicksand", icon: "🧪",
  description: "Make a material that acts solid when squeezed and flows when released.",
  category: "Kitchen Science", ages: "5–14", minutes: 25, mess: "High",
  skills: ["Properties of materials", "Observation"],
};
const fullQuest = {
  ...sampleQuest,
  materials: ["Cornflour", "Water", "Bowl"],
  steps: ["Mix the cornflour.", "Add water.", "Press quickly.", "Move slowly."],
  wonder: ["What changed?", "Why is it different?"],
  safety: "Do not eat. Scrape leftovers into a rubbish bin, not the drain.",
  extension: "Draw what happens when you move fast and slow.",
  runbook: {
    prepare: "Measure two cups cornflour into a large bowl on a waterproof tray.",
    expected: "Firm when squeezed fast, flowing slowly with gentle pressure.",
    troubleshoot: "If it is too runny, add a little cornflour at a time; bin leftovers.",
  },
  parentLearning: {
    objective: "Investigate how materials behave under different forces.",
    explanation: "Cornflour particles resist a fast push more than a gentle one.",
    parentPrompt: "Ask the child to compare pushing the same mixture fast and slowly.",
    evidence: "Describe the two results and explain the difference in the child's words.",
  },
};
const catalogue = unlocked => ({
  unlocked, count: 174, categories: ["Kitchen Science"],
  items: [{ ...sampleQuest, ...(unlocked ? { materials: fullQuest.materials } : {}) }],
});

let root, container, oldMatchMedia, oldPrint;
beforeEach(async () => {
  oldMatchMedia = window.matchMedia; oldPrint = window.print;
  window.matchMedia = jest.fn(() => ({ matches: false }));
  window.print = jest.fn();
  api.get.mockReset().mockImplementation(path => Promise.resolve({
    data: path === "/hands-on-quests" ? catalogue(false) : fullQuest,
  }));
  container = document.createElement("div"); document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(<HandsOnVault />); });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.matchMedia = oldMatchMedia;
  window.print = oldPrint;
});

test("preview displays catalogue without fetching, showing or printing member instructions", () => {
  expect(container.querySelector('[data-testid="quest-oobleck-lab"]')).not.toBeNull();
  expect(container.textContent).toContain("A treasure chest for Family Members");
  expect(container.textContent).not.toContain("Cornflour particles resist");
  expect(api.get).toHaveBeenCalledTimes(1);
  expect(api.get).toHaveBeenCalledWith("/hands-on-quests");
  const print = container.querySelector('[data-testid="hands-on-print"]');
  expect(print).toBeNull();
  const cardButton = container.querySelector('[data-testid="quest-oobleck-lab"] button');
  expect(cardButton.disabled).toBe(true);
});

test("paid parent sees A4 guide with explicit education, safety and evidence link", async () => {
  await act(async () => {
    root.unmount(); root = createRoot(container);
    api.get.mockImplementation(path => Promise.resolve({
      data: path === "/hands-on-quests" ? catalogue(true) : fullQuest,
    }));
    root.render(<HandsOnVault />);
  });
  const button = container.querySelector('[data-testid="quest-oobleck-lab"] button');
  expect(button.disabled).toBe(false);
  await act(async () => { button.click(); });
  expect(api.get).toHaveBeenCalledWith("/hands-on-quests/oobleck-lab");
  const guide = container.querySelector("#hands-on-print");
  expect(guide).not.toBeNull();
  expect(guide.textContent).toContain("For the Grown-Ups: What They're Really Learning");
  expect(guide.textContent).toContain(fullQuest.parentLearning.objective);
  expect(guide.textContent).toContain(fullQuest.parentLearning.explanation);
  expect(guide.textContent).toContain(fullQuest.parentLearning.parentPrompt);
  expect(guide.textContent).toContain(fullQuest.parentLearning.evidence);
  expect(guide.textContent).toContain(fullQuest.safety);
  expect(guide.textContent.indexOf("Grown-up safety check")).toBeLessThan(guide.textContent.indexOf("Gather your treasure"));
  expect(guide.textContent.indexOf("Grown-up safety check")).toBeLessThan(guide.textContent.indexOf("Your quest, step by step"));
  expect(guide.textContent).toContain("Before you start: set up for success");
  expect(guide.textContent).toContain(fullQuest.runbook.prepare);
  expect(guide.textContent).toContain(fullQuest.runbook.expected);
  expect(guide.textContent).toContain(fullQuest.runbook.troubleshoot);
  expect(guide.textContent).toContain("If it doesn’t work first time");
  expect(guide.querySelectorAll(".print-step-checkbox")).toHaveLength(4);
  const recordLink = [...container.querySelectorAll("a")].find(a => a.textContent.includes("Record the learning"));
  expect(recordLink.getAttribute("href")).toContain("/parent/life-learning?vault_activity=");
  expect(container.querySelector("style").textContent).toContain("@page { size: A4 portrait;");
  await act(async () => { container.querySelector('[data-testid="hands-on-print"]').click(); });
  expect(window.print).toHaveBeenCalledTimes(1);
});
