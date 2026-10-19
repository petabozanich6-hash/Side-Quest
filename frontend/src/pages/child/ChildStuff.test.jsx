import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import ChildStuff from "./ChildStuff";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "child-test", role: "child", theme: "primary" } }),
}));
global.IS_REACT_ACT_ENVIRONMENT = true;

test("My Stuff keeps reading and achievements but never links children to Dragon's Library", async () => {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => root.render(<MemoryRouter><ChildStuff /></MemoryRouter>));
  const childDestinations = [...host.querySelectorAll("a")].map(a => a.getAttribute("href"));
  expect(childDestinations).toContain("/child/reading");
  expect(childDestinations).toContain("/child/word-hoard");
  expect(childDestinations).toContain("/child/achievements");
  expect(childDestinations).not.toContain("/child/dragons-library");
  expect(host.textContent).not.toContain("Dragon's Library");
  await act(async () => root.unmount());
  host.remove();
});
