import React from "react";
import {createRoot} from "react-dom/client";
import {act} from "react-dom/test-utils";
import SupportSlideVisual from "./SupportSlideVisual";
global.IS_REACT_ACT_ENVIRONMENT=true;
const models={
 evidence:{type:"evidence-quest",context:"reading",passage_title:"The letter",prompt:"Find clues",items:["She hesitated.","She turned away.","The sky was blue."]},
 sort:{type:"sort-quest",prompt:"Classify evidence",groups:["Observation","Inference"],items:["A leaf is yellow","It may need water","The soil is dry","It may be too cold"]},
 data:{type:"data-quest",title:"Hypothetical growth",unit:"cm",prompt:"Compare the measurements",rows:[{label:"A",value:2},{label:"B",value:4},{label:"C",value:1}]},
 fractions:{type:"fraction-quest",total:2,shaded:1,target_total:4,context:"pizza"}
};
let tutor,learner,tutorRoot,learnerRoot;
beforeEach(()=>{
 tutor=document.createElement("div");learner=document.createElement("div");
 document.body.append(tutor,learner);tutorRoot=createRoot(tutor);learnerRoot=createRoot(learner);
});
afterEach(()=>{act(()=>{tutorRoot.unmount();learnerRoot.unmount();});tutor.remove();learner.remove();});
const button=(node,label)=>Array.from(node.querySelectorAll("button")).find(b=>(b.getAttribute("aria-label")||b.textContent.trim())===label);
async function click(node,label){const b=button(node,label);expect(b).toBeDefined();await act(async()=>b.click());}
function setup(visual){
 let state={id:"shared-visual",reveal:1,checked:false,selected:[],placements:visual.items?.map(()=>-1)||[],order:[]};
 const render=()=>{tutorRoot.render(<SupportSlideVisual visual={visual} interaction={state} live owner send={tutorSend}/>);learnerRoot.render(<SupportSlideVisual visual={visual} interaction={state} live send={learnerSend}/>);};
 const apply=({operation,index,direction})=>{
  if(operation==="toggle")state={...state,checked:false,selected:state.selected.includes(index)?state.selected.filter(n=>n!==index):[...state.selected,index]};
  if(operation==="place")state={...state,checked:false,placements:state.placements.map((n,i)=>i===index?direction:n)};
  if(operation==="check")state={...state,checked:true};
  if(operation==="reset")state={...state,checked:false,selected:[],placements:state.placements.map(()=>-1)};
  render();
 };
 const tutorSend=jest.fn(apply),learnerSend=jest.fn(apply);
 act(render);return {tutorSend,learnerSend};
}
test("reading detective highlights are reflected in tutor view, with explicit submission and no tutor answer control",async()=>{
 const {tutorSend,learnerSend}=setup(models.evidence);
 expect(button(tutor,"She hesitated.").disabled).toBe(true);
 expect(button(tutor,"Submit my thinking")).toBeUndefined();
 expect(button(learner,"Submit my thinking").disabled).toBe(true);
 await click(learner,"She hesitated.");
 expect(learnerSend).toHaveBeenCalledWith(expect.objectContaining({action:"slide-interact",visual_id:"shared-visual",operation:"toggle",index:0}));
 expect(button(tutor,"She hesitated.").getAttribute("aria-pressed")).toBe("true");
 await click(learner,"Submit my thinking");
 expect(tutor.textContent).toContain("Learner has submitted this attempt");
 expect(learner.textContent).toContain("Your thinking is ready to discuss");
 await click(tutor,"Reset model");
 expect(tutorSend).toHaveBeenCalledWith(expect.objectContaining({operation:"reset"}));
 expect(button(learner,"She hesitated.").getAttribute("aria-pressed")).toBe("false");
});
test("sorting station requires each card to be placed and permits revision",async()=>{
 setup(models.sort);
 for(const [i,item] of models.sort.items.entries()){
  const label="Place "+item+" in "+models.sort.groups[i%2];
  expect(button(tutor,label).disabled).toBe(true);
  await click(learner,label);
  expect(button(tutor,label).getAttribute("aria-pressed")).toBe("true");
 }
 expect(button(learner,"Submit my thinking").disabled).toBe(false);
 await click(learner,"Submit my thinking");
 expect(tutor.textContent).toContain("Learner has submitted this attempt");
 await click(learner,"Unsort");
 expect(button(learner,"Submit my thinking").disabled).toBe(true);
});
test("data lab exposes actual values through accessible controls",async()=>{
 setup(models.data);
 expect(button(learner,"B: 4 cm").disabled).toBe(false);
 await click(learner,"B: 4 cm");
 expect(button(tutor,"B: 4 cm").getAttribute("aria-pressed")).toBe("true");
 await click(learner,"Submit my thinking");
 expect(tutor.textContent).toContain("Learner has submitted this attempt");
});
test("fraction kitchen gives specific mathematical feedback and supports revision",async()=>{
 setup(models.fractions);
 await click(learner,"Piece 1");
 await click(learner,"Check my creation");
 expect(learner.textContent).toContain("smaller share");
 await click(learner,"Piece 2");
 await click(learner,"Check my creation");
 expect(learner.textContent).toContain("Quest solved!");
 expect(tutor.textContent).toContain("Quest solved!");
 expect(button(tutor,"Piece 2").disabled).toBe(true);
});
