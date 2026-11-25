import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {unifiedOwnerDirectory,unifiedOwnerFamily} from "../src/unifiedOwnerDirectory.ts";
test("directory groups explicitly associated records only and preserves unclaimed legacy rows",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const now="2026-11-26T00:00:00.000Z";
 for(const n of [1,2]){
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run("f"+n,"Family "+n,"u"+n,now,"PREVIEW_EXPIRED");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run("u"+n,"f"+n,"p"+n+"@example.com","Parent "+n,now,now);
  db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("r"+n,"p"+n+"@example.com","Parent "+n,"English Club: Year 3","PRIVATE",now,now);
 }
 const g=db.raw.prepare("SELECT id FROM support_guest_families WHERE email='p1@example.com'").get().id;
 db.raw.prepare("INSERT INTO support_family_claims(guest_family_id,family_id,parent_user_id,claimed_at) VALUES(?,?,?,?)").run(g,"f1","u1",now);
 const result=await unifiedOwnerDirectory(db,"",1,"all");
 assert.equal(result.items.length,3);
 assert.equal(result.items.find(r=>r.id==="f1").enquiries,1);
 assert.equal(result.items.find(r=>r.id==="f2").enquiries,0);
 assert.equal(result.items.filter(r=>r.kind==="legacy").length,1);
 assert.equal((await unifiedOwnerDirectory(db,"p2@example.com",1,"all")).items.length,2);
 assert.equal((await unifiedOwnerDirectory(db,"",1,"unread")).items.length,2);
 assert.equal(JSON.stringify(result).includes("PRIVATE"),false);
 const a=await unifiedOwnerFamily(db,"account","f1","enquiries",1);assert.deepEqual(a.items.map(r=>r.id),["r1"]);
 const b=await unifiedOwnerFamily(db,"account","f2","enquiries",1);assert.equal(b.items.length,0);
 const old=result.items.find(r=>r.kind==="legacy");assert.deepEqual((await unifiedOwnerFamily(db,"legacy",old.id,"enquiries",1)).items.map(r=>r.id),["r2"]);
 assert.equal(await unifiedOwnerFamily(db,"account","missing","home",1),null);
 for(const section of ["learners","appointments","invoices","messages"]){const p=await unifiedOwnerFamily(db,"account","f1",section,1);assert.ok(p);assert.equal(JSON.stringify(p).includes("PRIVATE"),false);}

});
