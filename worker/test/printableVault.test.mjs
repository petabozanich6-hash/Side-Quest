import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

let seq=0;
function harness() {
  const db=makeDb();
  const storage=new Map();
  const env={DB:db,JWT_SECRET:"printable-vault-test-secret",
    BUCKET:{
      head:async key=>storage.has(key)?{key}:null,
      get:async key=>storage.has(key)?{body:new Response(storage.get(key)).body}:null,
      put:async (key,bytes)=>{storage.set(key,bytes);return {key};}
    }
  };
  const ctx={waitUntil(){},passThroughOnException(){}};
  clearSettingsCache();clearUsageCache();
  async function req(path,token,method="GET",body,contentType) {
    const headers={};
    if(token)headers.authorization="Bearer "+token;
    if(body)headers["content-type"]=contentType||"application/json";
    return worker.fetch(new Request("http://localhost:8787/api"+path,{method,headers,body:body?(contentType==="image/png"?body:JSON.stringify(body)):undefined}),env,ctx);
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
  return {req,db,parent,child,storage};
}



test("Only the ten premium illustrated activities remain; old SVG and PDF routes are retired",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW");
 const r=await h.req("/printables",p.token);
 assert.equal(r.status,200);
 const data=await r.json();
 assert.equal(data.items.length,10);
 assert.ok(data.items.every(i=>i.pages===1&&i.format==="png"&&!i.available));
 assert.ok(data.items.every(i=>i.kind!=="worksheet"));
 assert.equal(data.art_review_only,false);
 assert.equal(data.unlocked,false);
 assert.equal((await h.req("/printables/dragon-hoard/pdf",p.token)).status,404);
 const unauthorized=await h.req("/printables/lost-treasure-maze/image",p.token);
 assert.equal(unauthorized.status,402);
});
test("Owner-only import is enforced for free, paid and child accounts; free remains locked",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW"),paid=await h.parent("ACTIVE_MONTHLY");
 const child=await h.child(p);
 const fake=new Uint8Array(33);
 for(const [i,b] of [137,80,78,71,13,10,26,10].entries())fake[i]=b;
 const dv=new DataView(fake.buffer);dv.setUint32(16,2480);dv.setUint32(20,3508);
 for(const who of [p.token,paid.token,child]){
  assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze",who,"POST",fake,"image/png")).status,who===child?403:403);
  assert.equal((await h.req("/printables/lost-treasure-maze/image",who)).status,who===child?403:who===paid.token?404:402);
 }
 assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze",undefined,"POST",fake,"image/png")).status,401);
});
test("Only verified owner imports a valid 2480x3508 A4 PNG to private R2 and reads it back",async()=>{
 const h=harness(),p=await h.parent("FREE_PREVIEW");
 h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')")
   .run(crypto.randomUUID(),p.userId);
 const bytes=new Uint8Array(33);
 for(const [i,b] of [137,80,78,71,13,10,26,10].entries())bytes[i]=b;
 const dv=new DataView(bytes.buffer);dv.setUint32(16,2480);dv.setUint32(20,3508);
 let r=await h.req("/printables/admin/assets/lost-treasure-maze",p.token,"POST",bytes,"image/png");
 assert.equal(r.status,200);
 assert.equal(h.storage.size,1);
 assert.ok([...h.storage.keys()][0].startsWith("printable-vault/illustrated-v1/"));
 assert.equal((await h.req("/printables",p.token)).status,200);
 const meta=await (await h.req("/printables",p.token)).json();
 assert.equal(meta.ready_count,1);assert.equal(meta.items.find(x=>x.id==="lost-treasure-maze").available,true);
 r=await h.req("/printables/lost-treasure-maze/image",p.token);
 assert.equal(r.status,200);assert.match(r.headers.get("content-type")||"",/image\/png/);
 assert.equal(r.headers.get("cache-control"),"private, no-store");
 assert.equal((await r.arrayBuffer()).byteLength,33);
 assert.equal((await h.req("/printables/lost-treasure-maze/image?page=1",p.token)).status,404);
 assert.equal((await h.req("/printables/lost-treasure-maze/image?variant=guide",p.token)).status,404);
 const invalid=new Uint8Array(30);
 assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze",p.token,"POST",invalid,"image/png")).status,400);
 assert.equal((await h.req("/printables/admin/assets/missing",p.token,"POST",bytes,"image/png")).status,404);
});

test("Owner uploads become immediately viewable and printable by paid families, never free or expired families",async()=>{
 const h=harness();
 const owner=await h.parent("FREE_PREVIEW");
 const monthly=await h.parent("ACTIVE_MONTHLY");
 const weekly=await h.parent("ACTIVE_WEEKLY");
 const expired=await h.parent("PREVIEW_EXPIRED");
 const preview=await h.parent("FREE_PREVIEW");
 h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')")
   .run(crypto.randomUUID(),owner.userId);
 const bytes=new Uint8Array(33);
 for(const [i,b] of [137,80,78,71,13,10,26,10].entries())bytes[i]=b;
 const dv=new DataView(bytes.buffer);dv.setUint32(16,2480);dv.setUint32(20,3508);
 const name="/printables/lost-treasure-maze/image";
 assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze",owner.token,"POST",bytes,"image/png")).status,200);
 assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze?variant=ink",owner.token,"POST",bytes,"image/png")).status,200);
 for(const paid of [monthly,weekly]){
   const catalogue=await (await h.req("/printables",paid.token)).json();
   assert.equal(catalogue.owner,false);
   assert.equal(catalogue.unlocked,true);
   assert.equal(catalogue.art_review_only,false);
   assert.equal(catalogue.ready_count,1);
   assert.equal(catalogue.items.length,10);
   assert.equal(catalogue.items.find(i=>i.id==="lost-treasure-maze").available,true);
   assert.equal(catalogue.items.find(i=>i.id==="lost-treasure-maze").ink_available,true);
   assert.equal(catalogue.items.find(i=>i.id==="moving-dragon-puppet").available,false);
   for(const route of [name,name+"?variant=ink"]){
     const image=await h.req(route,paid.token);
     assert.equal(image.status,200);
     assert.match(image.headers.get("content-type")||"",/image\/png/);
     assert.equal(image.headers.get("cache-control"),"private, no-store");
   }
   assert.equal((await h.req("/printables/admin/assets/lost-treasure-maze",paid.token,"POST",bytes,"image/png")).status,403);
 }
 for(const blocked of [preview,expired]){
   const catalogue=await (await h.req("/printables",blocked.token)).json();
   assert.equal(catalogue.unlocked,false);
   assert.equal(catalogue.items.find(i=>i.id==="lost-treasure-maze").available,false);
   assert.equal((await h.req(name,blocked.token)).status,402);
   assert.equal((await h.req(name+"?variant=ink",blocked.token)).status,402);
 }
 assert.equal((await h.req(name)).status,401);
});
