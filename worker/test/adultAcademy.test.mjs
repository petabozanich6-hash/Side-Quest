import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {adultParticipant,registerAdultParticipant,ADULT_ATTESTATION_VERSION} from "../src/adultAcademy.ts";
import {portalLearners} from "../src/unifiedPortalLearners.ts";
test("adult self-registration uses verified account, creates no child, and isolates different accounts",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const at="2026-11-28T00:00:00.000Z";
 for(const n of [1,2,3]){
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run("f"+n,"Family "+n,"u"+n,at,"PREVIEW_EXPIRED");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run("u"+n,"f"+n,"adult"+n+"@example.test","Account "+n,at,n===3?null:at);
 }
 const actor=n=>({id:"u"+n,family_id:"f"+n,role:"parent"});
 const a=actor(1),b={display_name:"Writer A",confirmed:true,attestation_version:ADULT_ATTESTATION_VERSION};
 assert.ok((await registerAdultParticipant(db,a,{...b,confirmed:false})).error);
 assert.ok((await registerAdultParticipant(db,a,{...b,learner_id:"child"})).error);
 assert.ok((await registerAdultParticipant(db,actor(3),b)).error);
 assert.ok((await registerAdultParticipant(db,{...a,role:"child"},b)).error);
 const r=await registerAdultParticipant(db,a,b,new Date(at));assert.equal(r.participant.display_name,"Writer A");assert.equal(r.created,true);
 assert.equal((await registerAdultParticipant(db,a,b)).created,false);
 assert.ok((await registerAdultParticipant(db,a,{...b,display_name:"Different"})).error);
 assert.equal(await adultParticipant(db,actor(2)),null);
 assert.equal(await adultParticipant(db,{...a,family_id:"f2"}),null);
 assert.equal(await adultParticipant(db,{...a,role:"child"}),null);
 assert.equal((await portalLearners(db,a)).learners.length,0);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM students").get().n,0);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_english_enrolments").get().n,0);
 assert.equal(db.raw.prepare("SELECT plan FROM families WHERE id='f1'").get().plan,"PREVIEW_EXPIRED");
});
