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


test("Vault removes retired question-sheet PDFs and lists only hands-on activities",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW");
 assert.equal((await h.req("/printables")).status,401);
 const r=await h.req("/printables",p.token);
 assert.equal(r.status,200);
 const data=await r.json();
 assert.equal(data.unlocked,false);
 assert.equal(data.items.length,20);
 assert.equal(data.bundles.length,8);
 assert.ok(data.items.every(i=>i.kind!=="worksheet"&&i.format==="svg"));
 assert.equal(data.items.filter(i=>i.theme==="Halloween").length,10);
 assert.equal((await h.req("/printables/dragon-hoard/pdf",p.token)).status,404);
 assert.equal((await h.req("/printables/secret-library/pdf",p.token)).status,404);
 assert.equal((await h.req("/printables/dragon-hoard/image",p.token)).status,402);
});
test("Free, child, expired and unauthenticated cannot obtain protected images",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW");
 const child=await h.child(p);
 for(const endpoint of ["/printables/lost-treasure-maze/image","/printables/build-a-bat-puppet/image?variant=guide","/printables/halloween-colouring-adventure/image?variant=ink"]){
  assert.equal((await h.req(endpoint)).status,401);
  assert.equal((await h.req(endpoint,child)).status,403);
  const r=await h.req(endpoint,p.token);
  assert.equal(r.status,402);
  assert.equal((await r.json()).code,"VAULT_REVIEW_ONLY");
 }
 h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(p.id);
 assert.equal((await h.req("/printables/escape-pumpkin-patch/image",p.token)).status,402);
});
test("Owner review receives private A4 SVGs and separate parent guides",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW");
 h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')")
  .run(crypto.randomUUID(),p.userId);
 const catalogue=(await (await h.req("/printables",p.token)).json()).items;
 for(const item of catalogue){
  for(let page=0;page<item.pages;page++){
   const r=await h.req("/printables/"+item.id+"/image?page="+page,p.token);
   assert.equal(r.status,200,item.id+" page "+page);
   assert.match(r.headers.get("content-type")||"",/image\/svg\+xml/);
   assert.equal(r.headers.get("cache-control"),"private, no-store");
   const svg=await r.text();
   assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
   assert.match(svg,/width="210mm" height="297mm"/);
   assert.ok(svg.includes(item.title.slice(0,12)),item.id+" title");
   assert.ok(svg.length>3000,item.id+" artwork is not an empty placeholder");
   assert.doesNotMatch(svg,/<script|onload=|(?:href|src)=["\x27]https?:/i,item.id+" no script or remote URLs");
  }
  const ink=await h.req("/printables/"+item.id+"/image?variant=ink",p.token);
  assert.equal(ink.status,200,item.id+" ink saver");
  const guide=await h.req("/printables/"+item.id+"/image?variant=guide",p.token);
  assert.equal(guide.status,200,item.id+" parent guide");
  assert.match(await guide.text(),/PARENT GUIDE/);
 }
 assert.equal((await h.req("/printables/lost-treasure-maze/image?page=3",p.token)).status,404);
 assert.equal((await h.req("/printables/lost-treasure-maze/image?page=-1",p.token)).status,404);
 assert.equal((await h.req("/printables/dragon-hoard/image",p.token)).status,404);
});
test("Verified owner can review; ordinary free family remains locked",async()=>{
 const h=harness(),owner=await h.parent("FREE_PREVIEW"),other=await h.parent("FREE_PREVIEW");
 h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')")
  .run(crypto.randomUUID(),owner.userId);
 assert.equal((await (await h.req("/printables",owner.token)).json()).unlocked,true);
 assert.equal((await h.req("/printables/pumpkin-face-creator/image",owner.token)).status,200);
 assert.equal((await h.req("/printables/pumpkin-face-creator/image",other.token)).status,402);
});

test("Even subscribed customers cannot access under-review artwork until it is approved",async()=>{
 const h=harness(),subscriber=await h.parent("ACTIVE_MONTHLY");
 const data=await (await h.req("/printables",subscriber.token)).json();
 assert.equal(data.art_review_only,true);
 assert.equal(data.unlocked,false);
 const r=await h.req("/printables/haunted-castle-maze/image",subscriber.token);
 assert.equal(r.status,402);
 assert.equal((await r.json()).code,"VAULT_REVIEW_ONLY");
});
