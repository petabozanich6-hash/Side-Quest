import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {lessonProgress,saveLessonCheckpoint,reportFromCheckpoints,lessonContinuity} from "../src/supportLessonProgress.ts";
test("live progress is scoped, saved, revision checked and report contains only observed activities",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const at="2026-11-25T00:00:00.000Z",end="2026-11-25T01:00:00.000Z",now=new Date(at);
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("guest","parent@example.test","Parent","Support","Enquiry",at,at);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run("order","guest","guest","quote",3000,"Learning","Online","Terms","live",at,end,"paid",at,at);
 assert.equal(await lessonProgress(db,"guest","other","order"),null);
 let p=await saveLessonCheckpoint(db,"guest","guest","order",{action:"add",label:"Compare fractions",home:"Fold paper into halves",revision:0},now);
 assert.equal(p.revision,1);assert.equal(reportFromCheckpoints(p.checkpoints),null);
 const id=p.checkpoints[0].id;
 assert.ok("error" in await saveLessonCheckpoint(db,"guest","guest","order",{action:"mark",checkpoint_id:id,status:"independent",revision:0},now));
 p=await saveLessonCheckpoint(db,"guest","guest","order",{action:"mark",checkpoint_id:id,status:"supported",revision:1},now);
 p=await saveLessonCheckpoint(db,"guest","guest","order",{action:"add",label:"UNATTEMPTED_ACTIVITY",revision:2},now);
 const restored=await lessonProgress(db,"guest","guest","order");
 assert.equal(restored.revision,3);assert.equal(restored.checkpoints[0].observed_at,at);
 const report=reportFromCheckpoints(restored.checkpoints).join("\n");
 assert.match(report,/demonstrated with guidance/);assert.match(report,/Fold paper into halves/);assert.ok(!report.includes("UNATTEMPTED_ACTIVITY"));
});

test("continuity includes only earlier observed lessons in the same package, never nickname or email matches",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const at="2026-11-25T00:00:00.000Z",end="2026-11-25T01:00:00.000Z",future="2026-12-02T00:00:00.000Z",futureEnd="2026-12-02T01:00:00.000Z",now=new Date("2026-11-27T00:00:00.000Z");
 const req=db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)");
 for(const id of ["same","other"])req.run(id,"same@example.test","Parent","Support","Enquiry",at,at);
 const order=db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
 for(const [id,request,start,finish,status] of [["earlier","same",at,end,"completed"],["next","same",future,futureEnd,"confirmed"],["unlinked","same",at,end,"completed"],["sibling","other",at,end,"completed"],["later","same",future,futureEnd,"paid"]])order.run(id,"guest",request,"quote-"+id,3000,"Learning","Online","Terms","live",start,finish,status,at,at);
 const link=db.raw.prepare("INSERT INTO support_package_sessions(order_id,root_id,quote_id,sequence,total) VALUES(?,?,?,?,?)");
 link.run("earlier","earlier","package",1,3);link.run("next","earlier","package",2,3);link.run("later","earlier","package",3,3);
 const mark=db.raw.prepare("INSERT INTO support_lesson_progress(order_id,checkpoints_json,revision,updated_at) VALUES(?,?,1,?)");
 for(const id of ["earlier","unlinked","sibling","later"])mark.run(id,JSON.stringify([{id:"a",label:id+" observed",status:"supported",observed_at:at,home:"PRIVATE_HOME"},{id:"b",label:"UNATTEMPTED",status:"not_attempted",observed_at:at}]),at);
 const history=await lessonContinuity(db,"guest","same","next",now);
 assert.equal(history.scope,"same_package");assert.equal(history.lessons.length,1);assert.deepEqual(history.lessons[0].observations,[{label:"earlier observed",status:"supported",observed_at:at}]);
 assert.ok(!JSON.stringify(history).includes("PRIVATE_HOME"));assert.ok(!JSON.stringify(history).includes("UNATTEMPTED"));
 assert.equal(await lessonContinuity(db,"guest","other","next",now),null);
 assert.deepEqual(await lessonContinuity(db,"guest","same","unlinked",now),{scope:"unlinked",lessons:[]});
});
