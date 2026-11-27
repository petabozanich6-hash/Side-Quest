import React from "react";
import {createRoot} from "react-dom/client";
import {act} from "react-dom/test-utils";
import {GuidedTutorView} from "./AppointmentLessonPack";
jest.mock("../../lib/adminApi",()=>({adminApi:{},errorText:jest.fn()}));
jest.mock("react-router-dom",()=>({Link:({children})=><span>{children}</span>}));
global.IS_REACT_ACT_ENVIRONMENT=true;
const pack={title:"Learning adventure",teaching:"Concept refresher",slides:[
 {heading:"First step",body:"First learner prompt",notes:"UNDERSTAND: First concept\nSAY AND SHOW: First private script\nIF THEY GET STUCK: First hint\nCHECK: First solution",visual:{type:"select",items:["One","Two"]}},
 {heading:"Second step",body:"Second learner prompt",notes:"UNDERSTAND: Second concept\nSAY AND SHOW: Second private script\nIF THEY GET STUCK: Second hint\nCHECK: Second solution",visual:{type:"select",items:["Three","Four"]}}
],sequence:[{phase:"teach",minutes:5},{phase:"check",minutes:5}],worksheet:[{prompt:"Worksheet",answer:"PRIVATE_WORKSHEET"}],activities:[{question:"Activity",answer_key:"PRIVATE_ACTIVITY"}]};
let root,container;
beforeEach(()=>{container=document.createElement("div");document.body.appendChild(container);root=createRoot(container);});
afterEach(()=>{act(()=>root.unmount());container.remove();});
const click=async label=>{const button=Array.from(container.querySelectorAll("button")).find(b=>b.textContent.trim()===label);expect(button).toBeDefined();await act(async()=>button.click());};
test("Live guide keeps one shared stage visible and only presents on explicit tutor action",async()=>{
 const present=jest.fn();
 await act(async()=>root.render(<GuidedTutorView pack={pack} onPresent={present} liveStage={<div data-testid="shared-stage">Shared learner stage</div>}/>));
 expect(container.querySelectorAll('[data-testid="shared-stage"]')).toHaveLength(1);
 expect(container.textContent).toContain("First private script");
 expect(container.querySelector("details").open).toBe(false);
 await click("Next");
 expect(container.textContent).toContain("Second private script");
 expect(present).not.toHaveBeenCalled();
 await click("Present selected step to learner");
 expect(present).toHaveBeenCalledWith(1);
 expect(container.querySelectorAll('[data-testid="shared-stage"]')).toHaveLength(1);
 await click("View worksheet and activity answers");
 expect(container.textContent).toContain("PRIVATE_WORKSHEET");
 expect(container.textContent).toContain("PRIVATE_ACTIVITY");
 expect(container.querySelector('[data-testid="shared-stage"]').textContent).not.toContain("PRIVATE");
});
test("Private rehearsal does not require a live classroom",async()=>{
 await act(async()=>root.render(<GuidedTutorView pack={pack}/>));
 expect(container.textContent).toContain("Interactive learner-facing preview");
 expect(container.textContent).toContain("First learner prompt");
 expect(container.textContent).not.toContain("Present selected step to learner");
 await click("Next");
 expect(container.textContent).toContain("Second learner prompt");
 expect(container.textContent).toContain("Second private script");
});

test("spoken dialogue and learner pauses are explicit and stay outside the shared stage",async()=>{
 const next=JSON.parse(JSON.stringify(pack));next.slides[0].notes="UNDERSTAND: Private concept\nSAY AND SHOW: [SAY] Today we will investigate. [ASK] What do you notice? [PAUSE] Wait for their own attempt. [RESPOND] Discuss their reasoning.\nIF THEY GET STUCK: Private help\nCHECK: PRIVATE ANSWER";
 await act(async()=>root.render(<GuidedTutorView pack={next} onPresent={jest.fn()} liveStage={<div data-testid="shared-stage">Shared learner stage</div>}/>));
 expect(container.textContent).toContain("Say to the learner");
 expect(container.textContent).not.toContain("Discuss their reasoning.");
 await click("Next cue");
 expect(container.textContent).toContain("What do you notice?");
 await click("Next cue");
 expect(container.textContent).toContain("Give the learner time to try");
 expect(container.textContent).toContain("Wait for their own attempt.");
 expect(container.textContent).not.toContain("Discuss their reasoning.");
 await click("Learner is ready — continue");
 expect(container.textContent).toContain("Discuss their reasoning.");
 await click("Previous cue");
 expect(container.textContent).toContain("Wait for their own attempt.");
 await click("Read entire script privately");
 expect(container.textContent).toContain("Today we will investigate");
 expect(container.textContent).toContain("Discuss their reasoning.");
 expect(container.querySelector('[data-testid="shared-stage"]').textContent).not.toContain("Today we will investigate");
 expect(container.querySelector('[data-testid="shared-stage"]').textContent).not.toContain("PRIVATE ANSWER");
});
