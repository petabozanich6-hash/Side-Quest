import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import PrintableVault from "./PrintableVault";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({ api: { get: jest.fn() }, apiErrorMessage: jest.fn(() => "Unavailable") }));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock("react-router-dom", () => ({ Link: ({children}) => <span>{children}</span> }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let root, container;
const sample = {
  unlocked: false,
  bundles: [{id:"craft",title:"Colour, Cut & Create",description:"Make a model"}],
  items: [
    {id:"dragon",title:"Build Your Own Dragon",category:"Colour, Cut & Create",kind:"craft",ages:"6-12",minutes:30,theme:"Dragon",description:"Cut and build",materials:"scissors"},
    {id:"rune",title:"The Rune Gate",category:"Maths",kind:"worksheet",ages:"12-16",minutes:25,theme:"Dragon",description:"Algebra challenge",materials:"pencil"}
  ]
};
beforeEach(async () => {
  api.get.mockReset().mockResolvedValue({data:sample});
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<PrintableVault/>));
});
afterEach(() => {act(() => root.unmount());container.remove();});

test("the free preview may browse the catalogue but cannot download even the parent guide", () => {
  expect(container.querySelector('[data-testid="vault-membership-locked"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="vault-item-dragon"]')).not.toBeNull();
  expect(container.querySelector('[data-testid="vault-item-rune"]')).not.toBeNull();
  expect([...container.querySelectorAll("button")].filter(b => /PDF|Preview|Ink-saver|Parent guide|Download pack/.test(b.textContent))
    .every(b => b.disabled)).toBe(true);
  expect(api.get).toHaveBeenCalledWith("/printables");
});

test("paid member sees working download controls and not the upgrade warning", async () => {
  await act(async () => {
    root.unmount();root = createRoot(container);
    api.get.mockResolvedValueOnce({data:{...sample,unlocked:true}});
    root.render(<PrintableVault/>);
  });
  expect(container.querySelector('[data-testid="vault-membership-locked"]')).toBeNull();
  const pdfButtons = [...container.querySelectorAll("button")].filter(b=>b.textContent.trim()==="PDF");
  expect(pdfButtons.length).toBe(2);
  expect(pdfButtons.every(b => !b.disabled)).toBe(true);
});
