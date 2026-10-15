import { test } from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";

const ORIGIN = "http://localhost:8787";
function setup() {
  const db=makeDb(), env={DB:db,JWT_SECRET:"curriculum-test-only-secret"};
  const ctx={waitUntil(){},passThroughOnException(){}};
  async function req(path,token,method="GET",body) {
    const headers={"content-type":"application/json"};
    if(token)headers.authorization="Bearer "+token;
    const r=await worker.fetch(new Request(ORIGIN+"/api"+path,{method,headers,body:body?JSON.stringify(body):undefined}),env,ctx);
    return {status:r.status,data:await r.json()};
  }
  async function register(name,jurisdiction) {
    const email=`curriculum-${name}@example.com`;
    const r=await req("/auth/register",null,"POST",{email,password:"Correct-horse-9",name,jurisdiction});
    assert.equal(r.status,200,JSON.stringify(r.data));
    return r.data.token;
  }
  return {db,req,register};
}

test("Curriculum code index is authenticated, paginated and bound to the actual family jurisdiction",async()=>{
  const h=setup();
  assert.equal((await h.req("/curriculum/identifiers")).status,401);
  const vic=await h.register("Victoria","VIC");
  const qld=await h.register("Queensland","QLD");
  const wa=await h.register("WesternAustralia","WA");
  const v=await h.req("/curriculum/identifiers?limit=3&jurisdiction=QLD",vic);
  assert.equal(v.status,200);
  assert.equal(v.data.jurisdiction,"VIC","client cannot select someone else’s state");
  assert.equal(v.data.framework,"VIC");
  assert.equal(v.data.identifiers.length,3);
  assert.ok(v.data.total>=3723);
  assert.ok(v.data.identifiers.every(x=>x.code.startsWith("VC2")||x.code.startsWith("VCEAL")));
  const n=await h.req("/curriculum/identifiers?limit=999&q=VC2S2U01",vic);
  assert.equal(n.status,200);
  assert.equal(n.data.limit,100);
  assert.ok(n.data.identifiers.some(x=>x.code==="VC2S2U01"));
  assert.ok(n.data.identifiers.every(x=>x.official_url.startsWith("https://")));
  const q=await h.req("/curriculum/identifiers?limit=2&jurisdiction=VIC",qld);
  assert.equal(q.data.framework,"AC9");
  assert.ok(q.data.identifiers.every(x=>x.code.startsWith("AC9")||x.code.startsWith("ACL9")));
  const legacyVic=await h.req("/curriculum/outcomes?stage=S2&learning_area=Science",vic);
  assert.ok(legacyVic.data.every(x=>x.code.startsWith("VC2")), "old outcomes API must never return NSW codes to Victoria");
  const legacyQld=await h.req("/curriculum/outcomes?stage=S2&learning_area=Mathematics",qld);
  assert.ok(legacyQld.data.some(x=>x.code.startsWith("AC9M")));
  assert.ok(legacyQld.data.every(x=>x.code.startsWith("AC9")||x.code.startsWith("ACL9")));
  assert.equal((await h.req("/curriculum/outcomes",null)).status,401, "outcome list requires family identity");
  const blocked=await h.req("/curriculum/identifiers",wa);
  assert.equal(blocked.data.available,false);
  assert.deepEqual(blocked.data.identifiers,[]);
  assert.deepEqual((await h.req("/curriculum/outcomes",wa)).data,[], "WA missing source is not filled with NSW outcomes");
});

test("Official senior course IDs cannot be used as outcomes or queried across state accounts",async()=>{
  const h=setup();
  const tas=await h.register("Tasmania","TAS");
  const sa=await h.register("SouthAustralia","SA");
  const nt=await h.register("NorthernTerritory","NT");
  const qld=await h.register("Queensland","QLD");
  const tasList=await h.req("/curriculum/senior-courses?jurisdiction=SA",tas);
  assert.equal(tasList.data.jurisdiction,"TAS");
  assert.equal(tasList.data.courses.length,164);
  assert.ok(tasList.data.courses.every(x=>x.identifier_kind==="senior_course_code"));
  for(const token of [sa,nt]){
    const s=await h.req("/curriculum/senior-courses?jurisdiction=TAS",token);
    assert.equal(s.data.courses.length,427);
    assert.ok(s.data.courses.every(x=>x.identifier_kind==="senior_subject_code"));
    assert.ok(s.data.courses.some(x=>x.code==="2BGY20"));
    assert.equal(s.data.complete,false);
  }
  assert.equal((await h.req("/curriculum/senior-courses",qld)).data.available,false);
});
