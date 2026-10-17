import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import CalendarPage from "./CalendarPage";
import { api } from "../../lib/api";

jest.mock("../../lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
  apiErrorMessage: (error, fallback) => error?.message || fallback
}));
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock("../../components/parent/TimetableGenerator", () => () => null);
jest.mock("../../components/parent/AutoQuestPreview", () => () => null);
jest.mock("../../components/parent/CalendarEventEditor", () => () => null);
jest.mock("../../components/parent/ScheduleModal", () => ({
  __esModule:true, default:()=>null,
  isoLocal: (d) => [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"),
    String(d.getDate()).padStart(2,"0")].join("-")
}));
global.IS_REACT_ACT_ENVIRONMENT = true;
const iso = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
let node,root,originalConfirm;

beforeEach(() => {
  jest.clearAllMocks();
  originalConfirm = window.confirm;
  window.confirm = jest.fn(() => true);
  node=document.createElement("div");document.body.appendChild(node);root=createRoot(node);
});
afterEach(async () => {await act(async () => root.unmount());node.remove();window.confirm=originalConfirm;});
const click = async el => act(async () => el.click());

test("day batch fills unused ready library lessons first, then saves missing AI drafts for parent review", async () => {
  const date=iso(new Date());
  const slots=[
    {id:"library-slot",student_id:"child-1",title:"Mathematics",date,start_time:"09:00",duration_minutes:45,event_type:"timetable"},
    {id:"draft-slot",student_id:"child-1",title:"Science",date,start_time:"10:00",duration_minutes:45,event_type:"timetable"}
  ];
  api.get.mockImplementation(path => Promise.resolve({data: path==="/calendar" ? slots :
    path==="/students" ? [{id:"child-1",name:"Mason"}] : []}));
  const proposals=[
    {id:"p1",calendar_event_id:"library-slot",status:"proposed",action:"reuse_draft",
      learning_area:"Mathematics",lesson:{id:"l1",title:"Number practice",status:"ready"},outcome_codes:["MA4"]},
    {id:"p2",calendar_event_id:"draft-slot",status:"proposed",action:"needs_generation",
      learning_area:"Science",lesson:null,outcome_codes:["SC4"]}
  ];
  api.post.mockImplementation(path => {
    if(path==="/auto-quest/plan") return Promise.resolve({data:{proposals}});
    if(path==="/auto-quest/proposals/p1/approve") return Promise.resolve({data:{status:"assigned",assignment_id:"a1"}});
    if(path==="/auto-quest/proposals/p2/generate") return Promise.resolve({data:{status:"proposed",lesson:{id:"draft",status:"draft"}}});
    throw Error("Unexpected request: "+path);
  });
  await act(async () => root.render(<MemoryRouter><CalendarPage /></MemoryRouter>));
  const day=node.querySelector(`[aria-label="View and edit ${date}"]`);
  expect(day).not.toBeNull();
  await click(day);
  expect(node.querySelector('[data-testid="day-modal"]')).not.toBeNull();
  await click(node.querySelector('[data-testid="generate-day-lessons"]'));
  expect(window.confirm).toHaveBeenCalledTimes(1);
  const urls=api.post.mock.calls.map(c=>c[0]);
  const library=urls.indexOf("/auto-quest/proposals/p1/approve");
  const generated=urls.indexOf("/auto-quest/proposals/p2/generate");
  expect(library).toBeGreaterThan(-1);
  expect(generated).toBeGreaterThan(library);
  const progress=node.querySelector('[data-testid="day-batch-progress"]');
  expect(progress.textContent).toMatch(/1 library lesson\(s\) assigned/);
  expect(progress.textContent).toMatch(/1 AI drafts saved for review/);
  expect(slots.every(s=>!s.linked_assignment_id)).toBe(true, "drafting never mutates timetable data locally");
});
