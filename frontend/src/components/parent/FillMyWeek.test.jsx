import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import FillMyWeek from "./FillMyWeek";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
  apiErrorMessage: (error, fallback) => error?.message || fallback
}));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const day="2026-10-19";
const slot=(id, time, area)=>({id,date:day,start_time:time,duration_minutes:45,
  student_id:"mason",event_type:"timetable",title:area});
const match={id:"proposal-a", calendar_event_id:"maths",status:"proposed",action:"reuse_draft",
  lesson:{id:"saved-a",title:"Year 8 Fractions",status:"ready"},learning_area:"Mathematics",outcome_codes:["MA4"]};
const gap={id:"proposal-b",calendar_event_id:"english",status:"proposed",action:"needs_generation",
  learning_area:"English",lesson:null,outcome_codes:["EN4"]};
let holder,root,done,closed,savedAssigned,conflictAfterPreview;

beforeEach(async ()=>{
  jest.clearAllMocks();
  done=jest.fn();closed=jest.fn();savedAssigned=false;conflictAfterPreview=false;
  api.get.mockImplementation(path=>{
    if(path==="/calendar") return Promise.resolve({data:[
      {...slot("maths","09:00","Mathematics"),
        linked_assignment_id:savedAssigned?"assigned-1":null},
      slot("english","10:00","English"),
      ...(conflictAfterPreview?[{id:"dentist",student_id:"mason",date:day,title:"Dentist",
        start_time:"09:05",duration_minutes:45,event_type:"appointment"}]:[])
    ]});
    if(path==="/auto-quest/proposals") return Promise.resolve({data:{proposals:[
      {...match,status:savedAssigned?"assigned":"proposed"},gap
    ]}});
    throw Error("Unexpected read "+path);
  });
  api.post.mockImplementation(path=>{
    if(path==="/auto-quest/plan") return Promise.resolve({data:{proposals:[match,gap]}});
    if(path==="/auto-quest/proposals/proposal-a/approve"){
      savedAssigned=true;
      return Promise.resolve({data:{...match,status:"assigned",assignment_id:"assigned-1"}});
    }
    throw Error("Unexpected write "+path);
  });
  window.confirm=jest.fn(()=>true);
  holder=document.createElement("div");document.body.appendChild(holder);
  root=createRoot(holder);
  await act(async ()=>root.render(<FillMyWeek students={[{id:"mason",name:"Mason"}]} initialChild="mason"
    initialDate={day} onClose={closed} onDone={done} onOpenDay={jest.fn()}/>));
});
afterEach(async ()=>{await act(async()=>root.unmount());holder.remove();});
const click=async selector=>act(async()=>holder.querySelector(selector).click());

test("one week review shows previously assigned, library matched, and missing lessons without assigning immediately",async()=>{
  await click('[data-testid="week-preview"]');
  expect(holder.querySelector('[data-testid="week-plan"]').textContent).toMatch(/Ready in library/);
  expect(holder.querySelector('[data-testid="week-plan"]').textContent).toMatch(/Needs a lesson/);
  expect(api.post).toHaveBeenCalledWith("/auto-quest/plan",{
    student_id:"mason",from:day,to:"2026-10-25",topic:""
  });
  expect(api.post.mock.calls.filter(([url])=>url.endsWith("/approve"))).toHaveLength(0);
  expect(holder.querySelector('[data-testid="week-apply"]').textContent).toMatch(/Assign 1 selected/);
});

test("only after confirmation does it assign a ready library lesson to that slot",async()=>{
  await click('[data-testid="week-preview"]');
  await click('[data-testid="week-apply"]');
  expect(window.confirm).toHaveBeenCalledTimes(1);
  expect(api.post).toHaveBeenCalledWith("/auto-quest/proposals/proposal-a/approve",{});
  expect(api.post.mock.calls.some(([url])=>url.endsWith("/generate"))).toBe(false);
  expect(done).toHaveBeenCalledTimes(1);
});

test("if another tab adds an overlapping appointment, it stops before assignment",async()=>{
  await click('[data-testid="week-preview"]');
  conflictAfterPreview=true;
  await click('[data-testid="week-apply"]');
  expect(api.post.mock.calls.filter(([url])=>url.endsWith("/approve"))).toHaveLength(0);
  expect(holder.querySelector('[data-testid="week-plan"]').textContent).toMatch(/Time conflict/);
});
