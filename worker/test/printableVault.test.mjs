import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

let seq=0;
function harness() {
  const db=makeDb();
  const env={DB:db,JWT_SECRET:"printable-vault-test-secret"};
  const ctx={waitUntil(){},passThroughOnException(){}};
  clearSettingsCache();clearUsageCache();
  async function req(path,token,method="GET",body) {
    const headers={};
    if(token)headers.authorization="Bearer "+token;
    if(body)headers["content-type"]="application/json";
    return worker.fetch(new Request("http://localhost:8787/api"+path,{method,headers,body:body?JSON.stringify(body):undefined}),env,ctx);
  }
  async function parent(plan) {
    const n=++seq;
    const response=await req("/auth/register",undefined,"POST",{name:"Vault Parent "+n,email:"vault"+n+"@example.test",password:"Test-password-123",jurisdiction:"NSW"});
    assert.equal(response.status,200);
    const data=await response.json();
    if(plan!=="FREE_PREVIEW")db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan,data.user.family_id);
    return {token:data.token,id:data.user.family_id,userId:data.user.id};
  }
  async function child(p) {
    const n=++seq;
    const username="vaultchild"+n;
    const response=await req("/students",p.token,"POST",{name:"Child "+n,username,pin:"1234",stage:"S2"});
    assert.equal(response.status,200);
    const login=await req("/auth/child-login",undefined,"POST",{username,pin:"1234"});
    assert.equal(login.status,200);
    return (await login.json()).token;
  }
  return {req,db,parent,child};
}

test("catalogue is parent-only; previews never unlock downloads",async()=>{
  const h=harness();
  const p=await h.parent("FREE_PREVIEW");
  assert.equal((await h.req("/printables")).status,401);
  assert.equal((await h.req("/printables/dragon-hoard/pdf")).status,401);
  const childToken=await h.child(p);
  assert.equal((await h.req("/printables",childToken)).status,403);
  assert.equal((await h.req("/printables/dragon-hoard/pdf?variant=guide",childToken)).status,403);
  const listing=await h.req("/printables",p.token);
  assert.equal(listing.status,200);
  const data=await listing.json();
  assert.equal(data.unlocked,false);
  assert.equal(data.items.length,22);
  assert.equal(data.bundles.length,7);
  const blocked=await h.req("/printables/dragon-hoard/pdf",p.token);
  assert.equal(blocked.status,402);
  assert.equal((await blocked.json()).code,"UPGRADE_REQUIRED");
  assert.equal((await h.req("/printables/dragon-hoard/pdf?variant=guide",p.token)).status,402);
  assert.equal((await h.req("/printables/bundles/craft/pdf",p.token)).status,402);
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(p.id);
  assert.equal((await h.req("/printables/dragon-hoard/pdf",p.token)).status,402);
});

test("paid family receives private valid A4 PDF and separate guide",async()=>{
  const h=harness(),p=await h.parent("ACTIVE_MONTHLY");
  const catalogue=await (await h.req("/printables",p.token)).json();
  assert.equal(catalogue.unlocked,true);
  const student=await h.req("/printables/dragon-hoard/pdf",p.token);
  assert.equal(student.status,200);
  assert.match(student.headers.get("content-type")||"",/application\/pdf/);
  assert.equal(student.headers.get("cache-control"),"private, no-store");
  const studentPdf=await student.text();
  assert.ok(studentPdf.startsWith("%PDF-1.4"));
  assert.match(studentPdf,/The Dragon Hoard/);
  assert.doesNotMatch(studentPdf,/ANSWERS AND FACILITATOR NOTES/);
  assert.match(studentPdf,/\/MediaBox \[0 0 595 842\]/);
  const guide=await h.req("/printables/dragon-hoard/pdf?variant=guide",p.token);
  assert.equal(guide.status,200);
  const guidePdf=await guide.text();
  assert.match(guidePdf,/ANSWERS AND FACILITATOR NOTES/);
  assert.match(guidePdf,/120 - 27 = 93/);
  const ink=await h.req("/printables/build-a-dragon/pdf?variant=ink",p.token);
  assert.equal(ink.status,200);
  assert.match(await ink.text(),/BODY/);
  const bundle=await h.req("/printables/bundles/craft/pdf",p.token);
  assert.equal(bundle.status,200);
  const bundlePdf=await bundle.text();
  assert.equal((bundlePdf.match(/\/Type \/Page \/Parent/g)||[]).length,3);
  assert.equal((await h.req("/printables/bundles/not-a-bundle/pdf",p.token)).status,404);
  assert.equal((await h.req("/printables/missing/pdf",p.token)).status,404);
});


test("verified platform owner can review subscriber printables without paying",async()=>{
  const h=harness();
  const owner=await h.parent("FREE_PREVIEW");
  const outsider=await h.parent("FREE_PREVIEW");
  h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(),owner.userId);
  const catalogue=await (await h.req("/printables",owner.token)).json();
  assert.equal(catalogue.unlocked,true);
  const owned=await h.req("/printables/build-a-dragon/pdf",owner.token);
  assert.equal(owned.status,200);
  assert.match(await owned.text(),/%PDF-1.4/);
  assert.equal((await h.req("/printables/build-a-dragon/pdf",outsider.token)).status,402);
});


test("ten activity-first printables are full art pages with working protected downloads",async()=>{
  const h=harness(),paid=await h.parent("ACTIVE_MONTHLY"),free=await h.parent("FREE_PREVIEW");
  const originals=[
    ["lost-treasure-maze",2,"HOARD"],
    ["moving-dragon-puppet",2,"PIN"],
    ["enchanted-castle-colouring",2,"HIDDEN TREASURES"],
    ["race-to-hoard",2,"STAR +1"],
    ["paper-medieval-castle",2,"GLUE"],
    ["design-dragon-egg",2,"HATCHLING"],
    ["forest-detective",2,"TRACK 1"],
    ["potion-spinner",2,"INGREDIENTS"],
    ["illusion-gallery",2,"TESSELLATE"],
    ["goblin-workshop-escape",2,"J     R"]
  ];
  const list=await (await h.req("/printables",paid.token)).json();
  for(const [id,count,needle] of originals){
    assert.ok(list.items.some(i=>i.id===id),id+" present in catalogue");
    const res=await h.req("/printables/"+id+"/pdf",paid.token);
    assert.equal(res.status,200,id+" PDF returns OK");
    const pdf=await res.text();
    assert.ok(pdf.startsWith("%PDF-1.4"),id+" PDF header");
    assert.equal((pdf.match(/\/Type \/Page \/Parent/g)||[]).length,count,id+" page count");
    assert.match(pdf,new RegExp(needle),id+" actual activity art");
    assert.doesNotMatch(pdf,/ANSWERS AND FACILITATOR NOTES/,id+" no parent answers");
    const guide=await h.req("/printables/"+id+"/pdf?variant=guide",paid.token);
    assert.equal(guide.status,200,id+" guide accessible to paid parent");
    const guidePdf=await guide.text();
    assert.ok(guidePdf.startsWith("%PDF-1.4"),id+" guide is a real PDF");
    assert.equal((await h.req("/printables/"+id+"/pdf?variant=ink",paid.token)).status,200,id+" ink saver");
    assert.equal((await h.req("/printables/"+id+"/pdf",free.token)).status,402,id+" private free gate");
  }
  for(const id of ["activity-puzzles","activity-build","activity-art","activity-play"]){
    const pack=await h.req("/printables/bundles/"+id+"/pdf",paid.token);
    assert.equal(pack.status,200,id);
    const pdf=await pack.text();
    assert.ok((pdf.match(/\/Type \/Page \/Parent/g)||[]).length>=4,id+" multi-page activities in bundle");
    assert.equal((await h.req("/printables/bundles/"+id+"/pdf",free.token)).status,402);
  }
});
