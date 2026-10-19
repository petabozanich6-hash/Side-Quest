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
 {id:"haunted-castle-maze",title:"Haunted Castle Maze",category:"Mazes & Puzzles",kind:"maze",ages:"5-10",pages:1,available:true,ink_available:true,minutes:20,theme:"Halloween",description:"A real maze",materials:"pencil",collection:"halloween-puzzles"},
 {id:"build-a-bat-puppet",title:"Build-a-Bat Puppet",category:"Colour, Cut & Create",kind:"craft",ages:"6-12",pages:1,available:true,ink_available:true,minutes:35,theme:"Halloween",description:"A real craft",materials:"scissors",collection:"halloween-build"}
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
test("owner with imported artwork sees image preview and print controls",async()=>{
 await act(async()=>{
  root.unmount();root=createRoot(container);
  api.get.mockResolvedValueOnce({data:{...sample,unlocked:true,owner:true,ready_count:2}});
  root.render(<PrintableVault/>);
 });
 expect(container.querySelector('[data-testid="vault-membership-locked"]')).toBeNull();
 expect(container.querySelector('[data-testid="vault-owner-import"]')).not.toBeNull();
 const buttons=[...container.querySelectorAll("button")].filter(b=>/Print|Images|Ink-saving|View/.test(b.textContent));
 expect(buttons.length).toBeGreaterThan(3);
 expect(buttons.every(b=>!b.disabled)).toBe(true);
});


test("printing imported PNGs produces a ready A4 print window (not broken SVG image URLs)",async()=>{
 const nativeCreateObjectURL=URL.createObjectURL;
 const nativeRevokeObjectURL=URL.revokeObjectURL;
 const open=jest.spyOn(window,"open");
 const printButton={disabled:true,textContent:"",addEventListener:jest.fn()};
 const printableImage={complete:true,naturalWidth:2480};
 const printWindow={
  document:{
   write:jest.fn(),open:jest.fn(),close:jest.fn(),
   querySelectorAll:jest.fn(()=>[printableImage]),
   getElementById:jest.fn(()=>printButton)
  },
  addEventListener:jest.fn(),close:jest.fn(),closed:false,print:jest.fn()
 };
 const makeUrl=jest.fn().mockReturnValue("blob:sidequest-print-test");
 try{
  URL.createObjectURL=makeUrl;
  URL.revokeObjectURL=jest.fn();
  open.mockReturnValue(printWindow);
  api.get.mockImplementation(path=>Promise.resolve({data:path==="/printables"
   ?{...sample,owner:true,unlocked:true,ready_count:2}
   :new Blob(["png-bytes"],{type:"image/png"})}));
  await act(async()=>{root.unmount();root=createRoot(container);root.render(<PrintableVault/>);});
  const card=container.querySelector('[data-testid="vault-item-haunted-castle-maze"]');
  const button=[...card.querySelectorAll("button")].find(b=>b.textContent.includes("Print / PDF"));
  expect(button.disabled).toBe(false);
  await act(async()=>{button.click();});
  expect(makeUrl).toHaveBeenCalledTimes(1);
  expect(makeUrl.mock.calls[0][0]).toBeInstanceOf(Blob);
  expect(makeUrl.mock.calls[0][0].type).toBe("image/png");
  expect(printWindow.document.write.mock.calls[1][0]).toContain('src="blob:sidequest-print-test"');
  expect(printWindow.document.write.mock.calls[1][0]).toContain("@page{size:A4 portrait;margin:5mm}");
  expect(printButton.disabled).toBe(false);
  expect(printButton.textContent).toBe("Print / Save as PDF");
  expect(printWindow.print).not.toHaveBeenCalled();
  printButton.addEventListener.mock.calls[0][1]();
  expect(printWindow.print).toHaveBeenCalledTimes(1);
 }finally{
  open.mockRestore();
  URL.createObjectURL=nativeCreateObjectURL;
  URL.revokeObjectURL=nativeRevokeObjectURL;
 }
});
