import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, useLocation } from "react-router-dom";
import ParentGuidedTour from "./ParentGuidedTour";
import { parentTourSteps, tourStorageKey } from "./parentTour";

global.IS_REACT_ACT_ENVIRONMENT = true;

const parent = { id: "test-parent", role: "parent", jurisdiction: "NSW" };
const international = { id: "other-parent", role: "parent", jurisdiction: "OTHER" };
let host, root;
const click = async (testId) => {
  const button = host.querySelector('[data-testid="' + testId + '"]');
  expect(button).not.toBeNull();
  await act(async () => button.click());
};
const where = () => host.querySelector('[data-testid="test-current-path"]')?.textContent;
function CurrentPath() {
  const location = useLocation();
  return <span data-testid="test-current-path">{location.pathname}</span>;
}
function App({ user, openRequest = 0 }) {
  return (
    <MemoryRouter initialEntries={["/parent"]}>
      <CurrentPath />
      <div data-tour="tour-dashboard">Dashboard</div>
      <ParentGuidedTour user={user} openRequest={openRequest} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});

test("tour steps follow real Parent Hub routes and explain international outcomes honestly", () => {
  const australian = parentTourSteps("NSW");
  const other = parentTourSteps("OTHER");
  expect(australian.length).toBeGreaterThan(6);
  expect(australian[6].title).toMatch(/curriculum/i);
  expect(australian[7].path).toBe("/parent/homeschool-compass");
  expect(other[6].title).toMatch(/learning goals/i);
  expect(other[7].path).toBe("/parent/curriculum");
  expect(other[6].description).toMatch(/doesn't claim/i);
  expect(other.some(step => step.description.includes("Australian outcome codes"))).toBe(false);
});

test("first visit offers a tour that moves through real routes and can be skipped", async () => {
  await act(async () => root.render(<App user={parent} />));
  expect(host.querySelector('[data-testid="parent-tour-dialog"]')).not.toBeNull();
  await click("parent-tour-accept");
  expect(host.textContent).toContain("Dragon HQ: your dashboard");
  await click("parent-tour-next");
  expect(where()).toBe("/parent/children");
  expect(host.textContent).toContain("Start with your adventurers");
  await click("parent-tour-skip");
  expect(host.querySelector('[data-testid="parent-tour-root"]')).toBeNull();
  expect(window.localStorage.getItem(tourStorageKey(parent.id))).toBe("done");
});

test("parents who already dismissed it are not interrupted again but can explicitly restart", async () => {
  window.localStorage.setItem(tourStorageKey(parent.id), "done");
  await act(async () => root.render(<App user={parent} />));
  expect(host.querySelector('[data-testid="parent-tour-dialog"]')).toBeNull();
  await act(async () => root.render(<App user={parent} openRequest={1} />));
  expect(host.textContent).toContain("Dragon HQ: your dashboard");
  await click("parent-tour-close");
  expect(host.querySelector('[data-testid="parent-tour-root"]')).toBeNull();
});

test("outside-Australia families get the international path, with their own replay history", async () => {
  window.localStorage.setItem(tourStorageKey(parent.id), "done");
  await act(async () => root.render(<App user={international} />));
  expect(host.querySelector('[data-testid="parent-tour-dialog"]')).not.toBeNull();
  await click("parent-tour-accept");
  for (let i = 0; i < 6; i++) await click("parent-tour-next");
  expect(host.textContent).toContain("Your family learning goals");
  await click("parent-tour-next");
  expect(where()).toBe("/parent/curriculum");
  expect(host.textContent).toContain("A compass for learning abroad");
});
