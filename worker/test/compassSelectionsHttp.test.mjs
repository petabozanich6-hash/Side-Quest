import { test } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import { registerFamily } from "../src/family.ts";

function harness() {
  const db = makeDb();
  const now = "2026-10-16T00:00:00Z";
  for (const [id, jurisdiction] of [["nsw", "NSW"], ["qld", "QLD"]]) {
    db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at,jurisdiction) VALUES (?,?,?,?,?)").run(id, id, "owner-"+id, now, jurisdiction);
    db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at,extra) VALUES (?,?,?,?,?,?,?,?,?)")
      .run("kid-"+id, id, "Child", "kid-"+id, "hash", "S4", "7", now, JSON.stringify({ electives:[{code:"ENG-S4",name:"English"}], prefs:{reading:"guided"} }));
  }
  const app = new Hono();
  const guards = {
    auth: async (c,next) => { c.set("user",{id:"parent",family_id:c.req.header("x-family")||"nsw",role:c.req.header("x-role")||"parent"}); await next(); },
    parent: async (c,next) => c.get("user").role === "parent" ? next() : c.json({detail:"Parent only"},403),
    child: async (_c,next) => next(),
  };
  registerFamily(app, guards);
  const put = (kid,body,family="nsw",role="parent") => app.request("http://test/api/students/"+kid,{
    method:"PUT",headers:{"content-type":"application/json","x-family":family,"x-role":role},body:JSON.stringify(body),
  },{DB:db});
  return {db,put};
}
test("Only a parent of the owning NSW family may store 2 distinct valid Compass areas",async()=>{
  const {db,put}=harness();
  const body={compass_areas:["Creative Arts","Technology"]};
  assert.equal((await put("kid-qld",body)).status,404);
  assert.equal((await put("kid-nsw",body,"nsw","child")).status,403);
  assert.equal((await put("kid-qld",body,"qld")).status,400);
  assert.equal((await put("kid-nsw",{compass_areas:["PDHPE"]})).status,400);
  assert.equal((await put("kid-nsw",{compass_areas:["PDHPE","PDHPE"]})).status,400);
  assert.equal((await put("kid-nsw",{compass_areas:["PDHPE","Invented"]})).status,400);
  const success=await put("kid-nsw",body);
  assert.equal(success.status,200,await success.text());
  const extra=JSON.parse(db.raw.prepare("SELECT extra FROM students WHERE id = ?").get("kid-nsw").extra);
  assert.deepEqual(extra.compass_areas,body.compass_areas);
  assert.deepEqual(extra.electives,[{code:"ENG-S4",name:"English"}]);
  assert.equal(extra.prefs.reading,"guided");
});
test("Wrong stage rejected and clearing Compass leaves courses intact",async()=>{
  const {db,put}=harness();
  assert.equal((await put("kid-nsw",{stage:"S3",compass_areas:["PDHPE","Technology"]})).status,400);
  assert.equal((await put("kid-nsw",{compass_areas:["PDHPE","Technology"]})).status,200);
  assert.equal((await put("kid-nsw",{compass_areas:[]})).status,200);
  const extra=JSON.parse(db.raw.prepare("SELECT extra FROM students WHERE id = ?").get("kid-nsw").extra);
  assert.deepEqual(extra.compass_areas,[]);
  assert.equal(extra.electives.length,1);
});
