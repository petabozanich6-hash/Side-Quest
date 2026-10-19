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
    return {token:data.token,id:data.user.family_id};
  }
  return {req,db,parent};
}

test("catalogue is parent-only; previews never unlock downloads",async()=>{
  const h=harness();
  const p=await h.parent("FREE_PREVIEW");
  assert.equal((await h.req("/printables")).status,401);
  assert.equal((await h.req("/printables/dragon-hoard/pdf")).status,401);
  const listing=await h.req("/printables",p.token);
  assert.equal(listing.status,200);
  const data=await listing.json();
  assert.equal(data.unlocked,false);
  assert.equal(data.items.length,12);
  assert.equal(data.bundles.length,3);
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
