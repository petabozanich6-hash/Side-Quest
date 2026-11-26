import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {validateLessonPack,approveLessonPack,readLessonPack,generateLessonPack} from "../src/supportLessonPack.ts";
import {classroomState,setClassroomOpen,editClassroom} from "../src/supportClassrooms.ts";
const pack={title:"Equivalent fractions",subject:"Mathematics",year_level:"Year 4",objective:"Recognise equivalent fractions",teaching:"Two fractions can describe the same amount. Divide a rectangle into two, then divide each half into two again.",slides:["concept","example","practice","recap"].map((kind,i)=>({kind,heading:"Step "+(i+1),body:"Compare equal parts "+(i+1),notes:"UNDERSTAND: Equal portions. SAY AND SHOW: Fold paper. IF THEY GET STUCK: Check equal-sized parts. CHECK: PRIVATE-SOLUTION-"+i})),worksheet:[1,2,3].map(i=>({prompt:"Draw fraction model "+i,answer:"PRIVATE-WORKSHEET-"+i})),activities:[{title:"Choice",type:"choice",question:"Which fraction equals one half?",options:["2/4","3/4"],answer_key:"2/4"},{title:"Explain",type:"short",question:"Why must parts be equal?",options:[],answer_key:null}]};
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
 assert.equal((await readLessonPack(db,"guest","pack-request","pack-one")).saved.pack.worksheet[0].answer,"PRIVATE-WORKSHEET-1");
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
