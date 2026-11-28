import React from "react";
import {createRoot} from "react-dom/client";
import {act} from "react-dom/test-utils";
import AcademyFacilitatorDesk from "./AcademyFacilitatorDesk";
import {workshopTimeline,elapsedWorkshopSeconds} from "./academyWorkshopTimeline";
global.IS_REACT_ACT_ENVIRONMENT=true;
let node,root;
beforeEach(()=>{node=document.createElement("div");document.body.append(node);root=createRoot(node);});
afterEach(()=>{act(()=>root.unmount());node.remove();});
const button=label=>Array.from(node.querySelectorAll("button")).find(b=>b.textContent.trim()===label);
test("phase changes do not automatically reveal slides, but facilitator can jump explicitly",()=>{
 const onSlide=jest.fn(),onActivity=jest.fn(),onVideo=jest.fn();
 act(()=>root.render(<AcademyFacilitatorDesk programmeId="english-creative-camp-junior-v1" title="Mystery" preparation={"0–5 min | Icebreaker: Private opening cue.\n\n5–15 min | Book chat: Ask what stories learners enjoy."} onSlide={onSlide} onActivity={onActivity} onVideo={onVideo}/>));
 expect(node.textContent).toContain("Private opening cue.");
 act(()=>button("Next phase").click());
 expect(node.textContent).toContain("Ask what stories learners enjoy.");
 expect(onSlide).not.toHaveBeenCalled();
 act(()=>button("Show corresponding learner slide").click());
 expect(onSlide).toHaveBeenCalledWith(1);
 act(()=>button("Go to live activities").click());
 expect(onActivity).toHaveBeenCalledTimes(1);
});
test("adult preparation does not expose live controls and uses 90-minute timeline",()=>{
 act(()=>root.render(<AcademyFacilitatorDesk programmeId="english-author-studio-adult-v1" title="Writing studio" preparation="0–10 min | Welcome and writing warm-up: Private cue." onSlide={jest.fn()} previewOnly/>));
 expect(node.textContent).toContain("90 minutes");
 expect(button("Go to live activities")).toBeUndefined();
 expect(button("Go to video")).toBeUndefined();
 expect(workshopTimeline("",true).map(s=>s.to)).toEqual([10,25,40,45,70,83,90]);
 expect(workshopTimeline("",false).map(s=>s.to)).toEqual([5,15,25,37,52,57,60]);
});
test("elapsed timer preserves accumulated time and never runs backwards",()=>{
 expect(elapsedWorkshopSeconds(2500,10000,13500)).toBe(6);
 expect(elapsedWorkshopSeconds(6000,null,99000)).toBe(6);
 expect(elapsedWorkshopSeconds(6000,10000,9000)).toBe(6);
});
