import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {validateLessonPack,approveLessonPack,readLessonPack,generateLessonPack} from "../src/supportLessonPack.ts";
import {fractionPack} from "../src/supportFractionPack.ts";
import {validateSlideVisual} from "../src/supportSlideVisuals.ts";
import {classroomState,setClassroomOpen,editClassroom} from "../src/supportClassrooms.ts";
const pack=fractionPack("Equivalent fractions","Mathematics","Year 4","Understand and identify equivalent fractions using visual models.",30);
pack.slides[0].notes+=" PRIVATE-SOLUTION";
pack.worksheet[0].answer+=" PRIVATE-WORKSHEET-1";
function setup(){
 const db=makeDb(),now=new Date(),at=now.toISOString(),end=new Date(now.getTime()+30*60000).toISOString();
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("pack-request","pack@example.com","Test parent","Maths","Test request",at,at);
 for(const id of ["pack-one","pack-two"])db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id,"guest","pack-request",id+"-quote",0,"Maths","Online","Terms","live",at,end,"paid",at,at);
 return {db,now};
}
test("validate complete resource pack and reject invalid answers and repeated prompts",()=>{
 assert.ok(validateLessonPack(pack));
 assert.equal(validateLessonPack({...pack,worksheet:[]}),null);
 assert.equal(validateLessonPack({...pack,activities:[{...pack.activities[0],answer_key:"wrong"},pack.activities[1]]}),null);
 assert.equal(validateLessonPack({...pack,activities:[pack.activities[0],pack.activities[0]]}),null);
});
test("approval is scoped, atomic, preserves an existing plan, and only learner slide is presented",async()=>{
 const {db,now}=setup();
 assert.ok((await approveLessonPack(db,"guest","wrong","pack-one",{pack,confirmed:true})).error);
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:false})).error);
 const result=await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:true});
 assert.ok(result.saved,JSON.stringify(result));
 assert.equal((await readLessonPack(db,"guest","wrong","pack-one")),null);
 assert.equal((await readLessonPack(db,"guest","pack-request","pack-one")).saved.pack.worksheet[0].answer,pack.worksheet[0].answer);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates WHERE status='reviewed'").get().n,2);
 assert.equal(JSON.parse(db.raw.prepare("SELECT items_json FROM support_session_activity_plans WHERE session_id='pack-one'").get().items_json).length,2);
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:true})).error);
 db.raw.prepare("INSERT INTO support_session_activity_plans(kind,session_id,items_json,updated_at) VALUES('tutoring','pack-two','[]',?)").run(now.toISOString());
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-two",{pack,confirmed:true})).error);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates WHERE status='reviewed'").get().n,2);
 assert.equal(await setClassroomOpen(db,"guest","pack-request","pack-one",true,now),true);
 assert.equal((await editClassroom(db,"guest","pack-request","pack-one",true,{action:"present",deck_id:result.saved.deck_id,deck_revision:1,index:0,revision:0},now)).ok,true);
 const state=await classroomState(db,"guest","pack-request","pack-one",false,now);
 assert.equal(state.board.slide.body,pack.slides[0].body);
 assert.deepEqual(state.board.slide.visual,pack.slides[0].visual);
 assert.equal(JSON.stringify(state).includes("PRIVATE-SOLUTION"),false);
 assert.equal(JSON.stringify(state).includes("PRIVATE-WORKSHEET"),false);
});
test("AI pack generation fails closed when the isolated pilot is disabled",async()=>{
 let called=false;
 const {db}=setup(),e={DB:db,AI:{run:async()=>{called=true;return {}}}};
 const r=await generateLessonPack(e,{},"guest","pack-request","pack-one",{});
 assert.ok(r.error);
 assert.equal(called,false);
});

test("reject screenshot-like short vague notes, long primary paragraphs and text-only slides",()=>{
 for(const bad of [{...pack.slides[0],notes:"Work through the example step by step, explaining why."},{...pack.slides[0],body:"Long ".repeat(100)},{...pack.slides[0],visual:undefined}]){
  assert.equal(validateLessonPack({...pack,slides:[bad,...pack.slides.slice(1)]}),null);
 }
 assert.equal(fractionPack("Equivalent fractions","Mathematics","Year 7","Understand and identify equivalent fractions using visual models.",30),null);
 assert.equal(fractionPack("Equivalent fractions","Mathematics","Year 4","Convert fractions to decimals",30),null);
 assert.equal(validateSlideVisual({type:"fraction-bars",rows:[{total:4,shaded:5}]}),null);
 assert.deepEqual(validateSlideVisual({type:"fraction-build",total:6,answer:4,notes:"private"}),{type:"fraction-build",total:6});
});
