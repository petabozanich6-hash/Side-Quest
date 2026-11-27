import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {portalLearners,addPortalLearner,linkPortalLegacyLearner} from "../src/unifiedPortalLearners.ts";
const stamp="2026-11-26T00:00:00.000Z";
function fixture(t){
 const db=makeDb();t.after(()=>db.raw.close());
 for(const n of [1,2]){
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run("f"+n,"Family "+n,"u"+n,stamp,n===1?"PREVIEW_EXPIRED":"INTERNAL");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run("u"+n,"f"+n,"parent"+n+"@example.com","Parent "+n,stamp,stamp);
  db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("r"+n,"parent"+n+"@example.com","Parent "+n,"English","Example",stamp,stamp);
  const g=db.raw.prepare("SELECT id FROM support_guest_families WHERE email=?").get("parent"+n+"@example.com").id;
  db.raw.prepare("INSERT INTO support_guest_learners(id,family_id,label,year_level,private_notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("g"+n,g,"Legacy "+n,"Year 3","PRIVATE",stamp,stamp);
  db.raw.prepare("INSERT INTO support_family_claims(guest_family_id,family_id,parent_user_id,claimed_at) VALUES(?,?,?,?)").run(g,"f"+n,"u"+n,stamp);
 }
 db.raw.prepare("INSERT INTO students(id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES(?,?,?,?,?,?,?,?)").run("s2","f2","Existing learner","unique-learner","not-a-real-pin","S2","Year 3",stamp);
 const actor=n=>({id:"u"+n,family_id:"f"+n,role:"parent",name:"Parent "+n});
 return {db,one:actor(1),two:actor(2)};
}
test("support-only learners do not create homeschool logins or alter plans; retries are idempotent",async t=>{
 const {db,one,two}=fixture(t);
 const input={label:"Learner A",year_level:"Year 5",request_key:"test-key"};
 const first=await addPortalLearner(db,one,input);
 assert.ok(first?.id);
 assert.deepEqual(await addPortalLearner(db,one,input),first);
 assert.equal(await addPortalLearner(db,one,{...input,label:"Different"}),null);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM students WHERE family_id='f1'").get().n,0);
 assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='f1'").get().plan,"PREVIEW_EXPIRED");
 assert.equal((await portalLearners(db,one)).learners.length,1);
 assert.equal((await portalLearners(db,two)).learners.length,0);
 assert.equal(await addPortalLearner(db,one,{student_id:"s2",request_key:"wrong"}),null);
 assert.equal(await portalLearners(db,{...one,role:"child"}),null);
});
test("existing homeschool profile reused once; labels follow its current name",async t=>{
 const {db,two}=fixture(t);
 assert.equal((await portalLearners(db,two)).students[0].id,"s2");
 const first=await addPortalLearner(db,two,{student_id:"s2",request_key:"first"});
 assert.ok(first?.id);
 assert.deepEqual(await addPortalLearner(db,two,{student_id:"s2",request_key:"repeat"}),first);
 db.raw.prepare("UPDATE students SET name='Updated learner' WHERE id='s2'").run();
 const r=await portalLearners(db,two);
 assert.equal(r.learners.length,1);assert.equal(r.learners[0].label,"Updated learner");assert.equal(r.students.length,0);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM students").get().n,1);
});
test("legacy learner links need matching claimed family, explicit confirmation and distinct learner IDs",async t=>{
 const {db,one,two}=fixture(t);
 const l1=await addPortalLearner(db,one,{label:"Learner one",request_key:"one"});
 const l2=await addPortalLearner(db,two,{student_id:"s2",request_key:"two"});
 assert.ok(l1?.id&&l2?.id);
 assert.equal(await linkPortalLegacyLearner(db,one,{legacy_id:"g1",learner_id:l1.id,confirmed:false}),false);
 assert.equal(await linkPortalLegacyLearner(db,one,{legacy_id:"g2",learner_id:l1.id,confirmed:true}),false);
 assert.equal(await linkPortalLegacyLearner(db,one,{legacy_id:"g1",learner_id:l2.id,confirmed:true}),false);
 assert.equal(await linkPortalLegacyLearner(db,one,{legacy_id:"g1",learner_id:l1.id,confirmed:true}),true);
 assert.equal(await linkPortalLegacyLearner(db,one,{legacy_id:"g1",learner_id:l1.id,confirmed:true}),true);
 const r=await portalLearners(db,one);assert.equal(r.legacy[0].learner_id,l1.id);
 assert.equal(JSON.stringify(r).includes("PRIVATE"),false);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_guest_learners").get().n,2);
});
