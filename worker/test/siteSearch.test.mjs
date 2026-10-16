import test from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import { registerSiteSearch } from "../src/siteSearch.ts";

function setup() {
  const db = makeDb();
  for (const familyId of ["f-search-one","f-search-two"]) {
    db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES (?,?,?,?)").run(familyId,"Test","owner","2026-10-16T00:00:00Z");
  }
  const students = [
    ["kid-1","f-search-one","Mason"],["kid-2","f-search-one","Oliver"],["kid-3","f-search-two","Other Child"],
  ];
  for (const [id,fam,name] of students) {
    db.raw.prepare("INSERT INTO students (id,family_id,name,username,pin_hash,stage,year_level,created_at) VALUES (?,?,?,?,?,?,?,?)")
      .run(id,fam,name,id,"hash","S2","3","2026-10-16T00:00:00Z");
  }
  for(const [id,family,title] of [["lesson-1","f-search-one","Mathematics: place value"],["lesson-2","f-search-two","Mathematics: private family's lesson"],["lesson-3","f-search-one","Science fair tests"]]) {
    db.raw.prepare("INSERT INTO lessons (id,family_id,title,stage,learning_area,status,data,created_at) VALUES (?,?,?,?,?,?,?,?)")
      .run(id,family,title,"S2","Mathematics","ready","{}","2026-10-16T00:00:00Z");
  }
  for(const [id,family,child,lesson,title] of [
    ["asg-1","f-search-one","kid-1","lesson-1","Mason maths quest"],
    ["asg-2","f-search-one","kid-2","lesson-3","Oliver science quest"],
    ["asg-3","f-search-two","kid-3","lesson-2","Other family's maths quest"],
  ]) {
    db.raw.prepare("INSERT INTO assignments (id,family_id,student_id,lesson_id,status,lesson_snapshot,created_at) VALUES (?,?,?,?,?,?,?)")
      .run(id,family,child,lesson,"not_started",JSON.stringify({title}),"2026-10-16T00:00:00Z");
  }
  for(const [id,family,child,title] of [
    ["read-1","f-search-one","kid-1","Harry Potter"],["read-2","f-search-one","kid-2","Dragon school"],
    ["read-3","f-search-two","kid-3","Harry Potter secret notes"],
  ]) {
    db.raw.prepare("INSERT INTO reading_log (id,family_id,student_id,title,read_date,logged_by,logged_role,created_at) VALUES (?,?,?,?,?,?,?,?)")
      .run(id,family,child,title,"2026-10-16","parent","parent","2026-10-16T00:00:00Z");
  }
  db.raw.prepare("INSERT INTO learning_plans (id,family_id,student_id,title,period_start,period_end,created_at) VALUES (?,?,?,?,?,?,?)")
    .run("plan-1","f-search-one","kid-2","Space explorers","2026-10-16","2026-12-16","2026-10-16T00:00:00Z");
  db.raw.prepare("INSERT INTO life_evidence (id,family_id,student_id,title,description,date,created_at) VALUES (?,?,?,?,?,?,?)")
    .run("life-1","f-search-one","kid-1","Baking muffins","Measured 200g flour","2026-10-16","2026-10-16T00:00:00Z");
  db.raw.prepare("INSERT INTO evidence_notes (id,family_id,student_id,title,occurred_on,created_at) VALUES (?,?,?,?,?,?)")
    .run("ev-1","f-search-one","kid-1","Garden project","2026-10-16","2026-10-16T00:00:00Z");
  db.raw.prepare("INSERT INTO calendar_events (id,family_id,title,date,created_at) VALUES (?,?,?,?,?)")
    .run("cal-1","f-search-one","Library trip","2026-10-16","2026-10-16T00:00:00Z");
  db.raw.prepare("INSERT INTO resources (id,family_id,title,url,created_at) VALUES (?,?,?,?,?)")
    .run("res-1","f-search-one","ABC Education maths","https://example.test","2026-10-16T00:00:00Z");

  const app = new Hono();
  const guards = {
    auth: async (c,next) => {
      const id=c.req.header("x-actor");
      if(!id) return c.json({detail:"Not signed in"},401);
      const found=students.find(([sid]) => sid===id);
      if(found) c.set("user",{id,family_id:found[1],role:"child",name:found[2]});
      else c.set("user",{id,family_id:id==="parent-2"?"f-search-two":"f-search-one",role:"parent",name:"Parent"});
      await next();
    },
    parent: async (c,next) => c.get("user").role === "parent" ? next() : c.json({detail:"Parent only"},403),
    child: async (c,next) => c.get("user").role === "child" ? next() : c.json({detail:"Child only"},403),
  };
  registerSiteSearch(app, guards);
  async function find(actor,q,type="all") {
    const path="/api/site-search?q="+encodeURIComponent(q)+"&type="+encodeURIComponent(type);
    const response=await app.request(path,{headers:actor?{"x-actor":actor}:{}},{DB:db});
    return {status:response.status,data:await response.json()};
  }
  return {find};
}

test("parent search discovers only their family records across sections",async ()=>{
  const {find}=setup();
  const math=await find("parent-1","math");
  assert.equal(math.status,200);
  assert.ok(math.data.items.some(x=>x.type==="lessons"&&x.id==="lesson-1"));
  assert.ok(math.data.items.some(x=>x.type==="assignments"&&x.id==="asg-1"));
  assert.ok(math.data.items.some(x=>x.type==="resources"&&x.id==="res-1"));
  assert.equal(math.data.items.some(x=>x.id==="lesson-2"||x.id==="asg-3"),false);
  for(const [q,type,id] of [["Mason","children","kid-1"],["Potter","reading","read-1"],["Space","plans","plan-1"],["Baking","life_learning","life-1"],["Garden","evidence","ev-1"],["Library","calendar","cal-1"]]) {
    const r=await find("parent-1",q,type);
    assert.equal(r.status,200,q);
    assert.ok(r.data.items.some(x=>x.id===id),q+" "+type);
  }
  const other=await find("parent-2","math");
  assert.ok(other.data.items.some(x=>x.id==="lesson-2"));
  assert.equal(other.data.items.some(x=>x.id==="lesson-1"),false);
});

test("child search is strictly limited to their own assignments and reading, never family or parent records",async ()=>{
  const {find}=setup();
  const mason=await find("kid-1","math");
  assert.equal(mason.status,200);
  assert.deepEqual([...new Set(mason.data.items.map(x=>x.type))],["assignments"]);
  assert.equal(mason.data.items.length,1);
  assert.equal(mason.data.items[0].id,"asg-1");
  assert.equal(mason.data.items[0].url,"/child/lesson/asg-1");
  const otherKid=await find("kid-2","math");
  assert.equal(otherKid.data.items.length,0);
  const potter=await find("kid-1","Potter");
  assert.deepEqual(potter.data.items.map(x=>x.id),["read-1"]);
  const studentListing=await find("kid-1","Mason","children");
  assert.equal(studentListing.status,400);
  const familyPlan=await find("kid-2","Space");
  assert.equal(familyPlan.data.items.length,0);
});

test("search input is constrained and syntax characters are searched literally",async ()=>{
  const {find}=setup();
  assert.equal((await find(null,"math")).status,401);
  assert.equal((await find("parent-1","a")).status,400);
  assert.equal((await find("parent-1","x".repeat(81))).status,400);
  assert.equal((await find("parent-1","math","root_secrets")).status,400);
  const percent=await find("parent-1","%_");
  assert.equal(percent.status,200);
  assert.equal(percent.data.items.length,0,"wildcards are not treated as SQL patterns");
  const quote=await find("parent-1","' OR 1=1");
  assert.equal(quote.status,200);
  assert.equal(quote.data.items.length,0);
});
