import React from "react";
import {createRoot} from "react-dom/client";
import {act} from "react-dom/test-utils";
import QuestBookOvernight from "./QuestBookOvernight";
import {api} from "../../lib/api";
jest.mock("../../lib/api",()=>({api:{get:jest.fn(),post:jest.fn()},apiErrorMessage:(_e,fallback)=>fallback}));
jest.mock("sonner",()=>({toast:{success:jest.fn(),error:jest.fn()}}));
jest.mock("react-router-dom",()=>({Link:({children,to})=><a href={to}>{children}</a>}));
global.IS_REACT_ACT_ENVIRONMENT=true;
let box,root,state;
const job=(id,kind)=>({id,kind,status:"running",total:2,counts:{pending:2},books:[],failures:[]});
beforeEach(()=>{
  jest.clearAllMocks();
  jest.spyOn(window,"confirm").mockReturnValue(true);
  state={books:[{id:"book",title:"My book",has_chapters:true,total:4,generated:2,missing:2,repairable:2}],jobs:[job("generation","generate")]};
  api.get.mockImplementation(()=>Promise.resolve({data:state}));
  api.post.mockResolvedValue({data:{ok:true}});
  box=document.createElement("div");document.body.appendChild(box);root=createRoot(box);
});
afterEach(async()=>{await act(async()=>root.unmount());box.remove();window.confirm.mockRestore();});
test("repair action stays available while generation runs",async()=>{
  await act(async()=>root.render(<QuestBookOvernight/>));
  expect(box.querySelector('[data-testid="quest-start-overnight"]')).toBeNull();
  const repair=box.querySelector('[data-testid="quest-repair-across-books"]');
  expect(repair.disabled).toBe(false);
  expect(box.querySelector('input[type="checkbox"]').disabled).toBe(false);
  await act(async()=>repair.click());
  expect(api.post).toHaveBeenCalledWith("/quest-books/admin/overnight/start",{book_ids:["book"],mode:"repair",auto_approve:false,auto_follow:true});
});
test("both queues remain visible and pause targets only the selected queue",async()=>{
  state.jobs.push(job("repairs","repair"));
  await act(async()=>root.render(<QuestBookOvernight/>));
  expect(box.querySelectorAll('[data-testid="quest-overnight-status"]')).toHaveLength(2);
  expect(box.querySelector('[data-testid="quest-repair-across-books"]')).toBeNull();
  const pause=[...box.querySelectorAll("button")].find(b=>b.textContent==="Pause repairs");
  await act(async()=>pause.click());
  expect(api.post).toHaveBeenCalledWith("/quest-books/admin/overnight/repairs/control",{action:"pause"});
});

test("live activity names the lesson, and auto-approval can be enabled without restarting",async()=>{
  state.jobs=[{...job("generation","generate"),auto_follow:true,auto_approve:false,
    current:{book_title:"Science Year 4",chapter_title:"Living things",attempts:1},
    recent:{book_title:"Science Year 4",chapter_title:"Cells",status:"done",updated_at:"2026-11-09T00:00:00Z"},
    next:{book_title:"Maths Year 2",chapter_title:"Fractions",status:"pending"}}];
  await act(async()=>root.render(<QuestBookOvernight/>));
  expect(box.querySelector('[data-testid="quest-live-activity"]').textContent).toContain("Science Year 4");
  expect(box.querySelector('[data-testid="quest-live-activity"]').textContent).toContain("Living things");
  expect(box.querySelector('[data-testid="quest-live-activity"]').textContent).toContain("Fractions");
  await act(async()=>box.querySelector('[data-testid="quest-live-auto-approve"]').click());
  expect(api.post).toHaveBeenCalledWith("/quest-books/admin/overnight/generation/control",
    {action:"set_auto_approve",enabled:true});
});
test("finished queues leave the active view",async()=>{
  state.jobs=[{...job("finished","generate"),status:"completed",auto_follow:false}];
  await act(async()=>root.render(<QuestBookOvernight/>));
  expect(box.querySelectorAll('[data-testid="quest-overnight-status"]')).toHaveLength(0);
  expect(box.querySelector('[data-testid="quest-queue-history"]')).not.toBeNull();
});
test("stopping a running queue sends a stop action",async()=>{
  state.jobs=[{...job("generation","generate"),auto_follow:true,auto_approve:false}];
  await act(async()=>root.render(<QuestBookOvernight/>));
  await act(async()=>box.querySelector('[data-testid="quest-stop-queue"]').click());
  expect(api.post).toHaveBeenCalledWith("/quest-books/admin/overnight/generation/control",{action:"stop"});
});
