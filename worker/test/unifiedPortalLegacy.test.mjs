import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {claimLegacyFamily,readFamilyClaim,linkedLegacyRequests,linkedLegacyRequest} from "../src/unifiedPortalLegacy.ts";
const now="2026-11-26T00:00:00.000Z";
const hash=async(s)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,"0")).join("");
async function fixture(t){
 const db=makeDb();t.after(()=>db.raw.close());
 const actors=[];
 for(const [i,verified] of [[1,now],[2,now],[3,null]]){
  const family="f"+i,user="u"+i,email="parent"+i+"@example.com";
  db.raw.prepare("INSERT INTO families(id,name,owner_id,created_at,plan) VALUES(?,?,?,?,?)").run(family,family,user,now,"PREVIEW_EXPIRED");
  db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,1,?,?)").run(user,family,email,user,now,verified);
  actors.push({id:user,family_id:family,role:"parent",name:user});
  db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("r"+i,email,user,"Topic "+i,"Private enquiry "+i,now,now);
  db.raw.prepare("INSERT INTO support_guest_sessions(token_hash,email,expires_at) VALUES(?,?,?)").run(await hash(String(i).repeat(64)),email,new Date(Date.now()+3600000).toISOString());
 }
 db.raw.prepare("INSERT INTO support_guest_messages(id,request_id,sender,body,created_at) VALUES(?,?,?,?,?)").run("m1","r1","owner","Parent-facing reply",now);
 return {db,actors};
}
test("legacy claims require two matching identities and explicit consent, preserve IDs and are idempotent",async t=>{
 const {db,actors:[one,two,three]}=await fixture(t);
 const a="1".repeat(64),b="2".repeat(64),c="3".repeat(64);
 assert.equal(await claimLegacyFamily(db,one,a,false),false);
 assert.equal(await claimLegacyFamily(db,one,b,true),false);
 assert.equal(await claimLegacyFamily(db,three,c,true),false);
 assert.equal(await claimLegacyFamily(db,{...one,role:"child"},a,true),false);
 assert.equal(await claimLegacyFamily(db,{...one,family_id:two.family_id},a,true),false);
 assert.equal(await claimLegacyFamily(db,one,"invalid",true),false);
 assert.deepEqual(await linkedLegacyRequests(db,one),[]);
 assert.equal(await claimLegacyFamily(db,one,a,true),true);
 assert.equal(await claimLegacyFamily(db,one,a,true),true);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_family_claims").get().n,1);
 assert.equal((await linkedLegacyRequests(db,one))[0].id,"r1");
 assert.equal((await linkedLegacyRequest(db,one,"r1")).messages[0].body,"Parent-facing reply");
 assert.equal(await linkedLegacyRequest(db,one,"r2"),null);
 assert.deepEqual(await linkedLegacyRequests(db,two),[]);
 assert.equal(await claimLegacyFamily(db,two,b,true),true);
 assert.equal(await linkedLegacyRequest(db,two,"r1"),null);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_guest_requests").get().n,3);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_guest_sessions").get().n,3,"legacy sessions remain valid during reversible read-only pilot");
});
test("expired proof, changed email and suspended family fail closed",async t=>{
 const {db,actors:[one,two]}=await fixture(t);
 const a="1".repeat(64),b="2".repeat(64);
 db.raw.prepare("UPDATE support_guest_sessions SET expires_at=? WHERE email=?").run("2000-01-01T00:00:00.000Z","parent1@example.com");
 assert.equal(await claimLegacyFamily(db,one,a,true),false);
 assert.equal(await claimLegacyFamily(db,two,b,true),true);
 db.raw.prepare("UPDATE users SET email=? WHERE id=?").run("different@example.com","u2");
 assert.equal(await readFamilyClaim(db,two),null);
 assert.equal(await linkedLegacyRequest(db,two,"r2"),null);
 db.raw.prepare("UPDATE users SET email=? WHERE id=?").run("parent2@example.com","u2");
 db.raw.prepare("INSERT INTO family_admin_state(family_id,status,auth_version,updated_at) VALUES(?,'suspended',1,?)").run("f2",now);
 assert.equal(await readFamilyClaim(db,two),null);
 assert.equal(await linkedLegacyRequest(db,two,"r2"),null);
});

test("a second parent in the same canonical family does not inherit the original claimant's records",async t=>{
 const {db,actors:[one]}=await fixture(t);
 const a="1".repeat(64);assert.equal(await claimLegacyFamily(db,one,a,true),true);
 db.raw.prepare("INSERT INTO users(id,family_id,email,name,is_owner,created_at,email_verified_at) VALUES(?,?,?,?,0,?,?)").run("u4","f1","second-parent@example.com","Other parent",now,now);
 const other={id:"u4",family_id:"f1",role:"parent",name:"Other parent"};
 assert.equal(await readFamilyClaim(db,other),null);assert.deepEqual(await linkedLegacyRequests(db,other),[]);assert.equal(await linkedLegacyRequest(db,other,"r1"),null);
 assert.equal(await claimLegacyFamily(db,other,a,true),false);
});
