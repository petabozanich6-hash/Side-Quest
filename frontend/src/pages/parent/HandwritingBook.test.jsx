import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import HandwritingBook from "./HandwritingBook";
import { api } from "../../lib/api";

jest.mock("../../lib/api",()=>({api:{get:jest.fn()},apiErrorMessage:jest.fn(()=>"Unavailable")}));
jest.mock("sonner",()=>({toast:{error:jest.fn(),success:jest.fn()}}));
jest.mock("react-router-dom",()=>({Link:({children})=><span>{children}</span>}));
global.IS_REACT_ACT_ENVIRONMENT=true;

let root,container,makeUrl,previousCreate,previousRevoke;
const blankPage=new Blob(['<svg xmlns="http://www.w3.org/2000/svg"></svg>'],{type:"image/svg+xml"});
const mount=async(unlocked)=>{
 api.get.mockImplementation(path=>Promise.resolve({
  data:path==="/handwriting-book"?{unlocked,pages:56,title:"The Little Letter Quest"}:blankPage
 }));
 await act(async()=>root.render(<HandwritingBook/>));
};
beforeEach(()=>{
 localStorage.clear();container=document.createElement("div");document.body.appendChild(container);
 root=createRoot(container);api.get.mockReset();
 previousCreate=URL.createObjectURL;previousRevoke=URL.revokeObjectURL;
 let index=0;
 makeUrl=jest.fn(()=> "blob:handwriting-test-"+(++index));
 URL.createObjectURL=makeUrl;URL.revokeObjectURL=jest.fn();
});
afterEach(()=>{
 act(()=>root.unmount());container.remove();
 URL.createObjectURL=previousCreate;URL.revokeObjectURL=previousRevoke;
});

test("Free preview sees catalogue information but no printable handwriting pages",async()=>{
 await mount(false);
 expect(container.querySelector('[data-testid="handwriting-book-locked"]')).not.toBeNull();
 expect(container.querySelector('[data-testid="print-whole-book"]')).toBeNull();
 expect(api.get.mock.calls.map(c=>c[0])).toEqual(["/handwriting-book"]);
});
test("Parent turns between pages; each authenticated page has its own image request",async()=>{
 await mount(true);
 expect(container.textContent).toContain("Page 1 of 56");
 expect(api.get.mock.calls.map(c=>c[0])).toContain("/handwriting-book/pages/0");
 await act(async()=>container.querySelector('[data-testid="next-page"]').click());
 expect(container.textContent).toContain("Page 2 of 56");
 expect(api.get.mock.calls.map(c=>c[0])).toContain("/handwriting-book/pages/1");
 expect(container.querySelector('[data-testid="previous-page"]').disabled).toBe(false);
});
test("Parent can print both pages of one letter using actual A4 vector sheets",async()=>{
 await mount(true);
 const nativeOpen=window.open;
 const button={disabled:true,textContent:"",addEventListener:jest.fn()};
 const win={
  document:{write:jest.fn(),open:jest.fn(),close:jest.fn(),querySelectorAll:jest.fn(()=>
   [{complete:true,naturalWidth:794},{complete:true,naturalWidth:794}]),
   getElementById:jest.fn(()=>button)},
  addEventListener:jest.fn(),closed:false,print:jest.fn()
 };
 try{
  window.open=jest.fn(()=>win);
  api.get.mockClear();
  await act(async()=>container.querySelector('[data-testid="print-letter"]').click());
  expect(window.open).toHaveBeenCalledTimes(1);
  expect(api.get.mock.calls.map(c=>c[0])).toEqual(["/handwriting-book/pages/2","/handwriting-book/pages/3"]);
  const html=win.document.write.mock.calls[1][0];
  expect(html).toContain("@page{size:A4 portrait;margin:5mm}");
  expect((html.match(/<figure>/g)||[]).length).toBe(2);
  expect(button.disabled).toBe(false);
  expect(button.textContent).toBe("Print / Save as PDF");
  button.addEventListener.mock.calls[0][1]();
  expect(win.print).toHaveBeenCalledTimes(1);
 }finally{window.open=nativeOpen;}
});
