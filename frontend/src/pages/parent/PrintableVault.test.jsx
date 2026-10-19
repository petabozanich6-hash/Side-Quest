import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import PrintableVault from "./PrintableVault";
import { api } from "../../lib/api";
jest.mock("../../lib/api", () => ({ api: { get: jest.fn() }, apiErrorMessage: jest.fn(()=>"Unavailable") }));
jest.mock("sonner", () => ({toast:{error:jest.fn(),success:jest.fn()}}));
jest.mock("react-router-dom", () => ({Link:({children})=><span>{children}</span>}));
global.IS_REACT_ACT_ENVIRONMENT=true;
global.IntersectionObserver=class { observe(){} disconnect(){} unobserve(){} };
const rows=[
 {id:"haunted-castle-maze",title:"Haunted Castle Maze",category:"Mazes & Puzzles",kind:"maze",ages:"5-10",pages:2,minutes:20,theme:"Halloween",description:"A real maze",materials:"pencil",collection:"halloween-puzzles"},
 {id:"build-a-bat-puppet",title:"Build-a-Bat Puppet",category:"Colour, Cut & Create",kind:"craft",ages:"6-12",pages:2,minutes:35,theme:"Halloween",description:"A real craft",materials:"scissors",collection:"halloween-build"}
];
const sample={unlocked:false,items:rows,bundles:[{id:"halloween-puzzles",title:"Spooky Mazes",description:"Mazes"}]};
let root,container;
beforeEach(async()=>{
 api.get.mockReset().mockResolvedValue({data:sample});
 container=document.createElement("div");document.body.appendChild(container);
 root=createRoot(container);
 await act(async()=>root.render(<PrintableVault/>));
});
afterEach(()=>{act(()=>root.unmount());container.remove();});
test("locked parent may browse only metadata, never image actions",()=>{
 expect(container.querySelector('[data-testid="vault-membership-locked"]')).not.toBeNull();
 expect(container.querySelector('[data-testid="vault-item-haunted-castle-maze"]')).not.toBeNull();
 expect(container.querySelector('[data-testid="vault-item-build-a-bat-puppet"]')).not.toBeNull();
 expect([...container.querySelectorAll("button")].filter(b=>/Print|View|Images|Ink-saving|Parent guide/.test(b.textContent)).every(b=>b.disabled)).toBe(true);
 expect(api.get).toHaveBeenCalledWith("/printables");
});
test("paid parent sees image preview and print controls",async()=>{
 await act(async()=>{
  root.unmount();root=createRoot(container);
  api.get.mockResolvedValueOnce({data:{...sample,unlocked:true}});
  root.render(<PrintableVault/>);
 });
 expect(container.querySelector('[data-testid="vault-membership-locked"]')).toBeNull();
 const buttons=[...container.querySelectorAll("button")].filter(b=>/Print|Images|Ink-saving|View/.test(b.textContent));
 expect(buttons.length).toBeGreaterThan(3);
 expect(buttons.every(b=>!b.disabled)).toBe(true);
});
