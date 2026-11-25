import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {ownerLearner,saveOwnerLearnerNotes} from "../src/unifiedOwnerLearner.ts";
import {portalLearners,addPortalLearner} from "../src/unifiedPortalLearners.ts";
import {submitPortalEnquiry} from "../src/unifiedPortalIntake.ts";
test("owner preparation is scoped, versioned, audited without content, and never returned to parents",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const now="2026-11-26T00:00:00.000Z";
 const actors=[],ids=[];
 for(const n of [1,2]){
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run("f"+n,"Family","u"+n,now,"PREVIEW_EXPIRED");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run("u"+n,"f"+n,"p"+n+"@example.com","Parent",now,now);
  const a={id:"u"+n,family_id:"f"+n,role:"parent",name:"Parent"};actors.push(a);
  const l=await addPortalLearner(db,a,{label:"Learner "+n,request_key:"first"});assert.ok(l?.id);ids.push(l.id);
  const r=await submitPortalEnquiry(db,a,{learner_id:l.id,kind:"tutoring",request_key:"enquiry",subject:"English",year:"Year 3",service:"Live online support",detail:"Practise reading comprehension.",consent:true});assert.ok(r.id);
 }
 const admin={actorUserId:"u1",actorLabel:"owner:test"},input={goals:"Read aloud",interests:"Animals",approach:"Short activities",private_notes:"PRIVATE PREPARATION",revision:0,confirmed:true};
 assert.equal(await ownerLearner(db,"f2",ids[0]),null);
 assert.ok("error" in await saveOwnerLearnerNotes(db,"f2",ids[0],input,admin));
 const saved=await saveOwnerLearnerNotes(db,"f1",ids[0],input,admin);assert.equal(saved.revision,1);
 assert.ok("error" in await saveOwnerLearnerNotes(db,"f1",ids[0],input,admin));
 assert.equal((await ownerLearner(db,"f1",ids[0])).learner.private_notes,input.private_notes);
 assert.equal((await ownerLearner(db,"f1",ids[0])).enquiries.length,1);
 assert.equal((await ownerLearner(db,"f2",ids[1])).learner.private_notes,"");
 assert.equal(JSON.stringify(await portalLearners(db,actors[0])).includes(input.private_notes),false);
 assert.equal((await saveOwnerLearnerNotes(db,"f1",ids[0],{...input,revision:1,private_notes:"Updated"},admin)).revision,2);
 const log=db.raw.prepare("SELECT detail_json FROM admin_audit_log WHERE action='support.learner_notes_saved'").all();
 assert.equal(log.length,2);assert.equal(JSON.stringify(log).includes("PRIVATE"),false);
});
