import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { HANDWRITING_PAGE_COUNT, STROKES, renderHandwritingPage } from "../src/handwritingBook.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

let sequence=0;
function harness(){
 const db=makeDb();
 const env={DB:db,JWT_SECRET:"handwriting-test-secret"};
 const ctx={waitUntil(){},passThroughOnException(){}};
 clearSettingsCache();clearUsageCache();
 const req=(path,token,method="GET",body)=>worker.fetch(new Request("http://localhost/api"+path,{
  method,headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},
  ...(body?{body:JSON.stringify(body)}:{})
 }),env,ctx);
 async function parent(plan){
  const n=++sequence;
  const response=await req("/auth/register",null,"POST",{name:"Handwriting Parent "+n,email:"handwriting"+n+"@example.test",password:"Password-1234",jurisdiction:"NSW"});
  assert.equal(response.status,200);
  const data=await response.json();
  if(plan!=="FREE_PREVIEW")db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan,data.user.family_id);
  return {token:data.token,userId:data.user.id,familyId:data.user.family_id};
 }
 return {req,parent,db};
}

test("All 56 A4 pages exist as black-and-white scalable practice sheets",()=>{
 assert.equal(HANDWRITING_PAGE_COUNT,56);
 assert.equal(Object.keys(STROKES).length,52);
 for(const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"){
  assert.ok(STROKES[letter].length>0,"missing strokes for "+letter);
 }
 for(let n=0;n<56;n++){
  const svg=renderHandwritingPage(n);
  assert.ok(svg?.startsWith("<svg"),"missing "+n);
  assert.match(svg,/width="210mm" height="297mm"/);
  // Six-digit grey strokes are printer-safe: only reject tinted RGB values.
  for(const hex of svg.matchAll(/#([0-9a-f]{6})/gi)){
   const value=hex[1].toLowerCase();
   assert.equal(value.slice(0,2),value.slice(2,4),"tinted RGB on page "+n);
   assert.equal(value.slice(2,4),value.slice(4,6),"tinted RGB on page "+n);
  }
  assert.doesNotMatch(svg,/fill="(red|green|blue)"/i);
  assert.match(svg,/sidequestlearning\.app/);
 }
 for(const n of [-1,56,1.5,NaN])assert.equal(renderHandwritingPage(n),null);
 for(const n of [2,3,52,53]){
  const svg=renderHandwritingPage(n);
  assert.match(svg,/stroke-dasharray="0.7 7.5"/);
  assert.match(svg,/handwriting-arrow/);
  assert.match(svg,/width="210mm" height="297mm"/);
 }
 // Every letter gets a genuinely different illustrated introduction and a
 // second page of independent practice with ample ruled writing space.
 for(let i=0;i<26;i++){
  const letter="abcdefghijklmnopqrstuvwxyz"[i];
  const intro=renderHandwritingPage(2+i*2);
  const practise=renderHandwritingPage(3+i*2);
  assert.match(intro,/Let(?:'|&apos;)s learn the letter /);
  assert.match(intro,/Uppercase /);
  assert.match(intro,/Lowercase /);
  assert.match(intro,/Start at the numbered dots/);
  assert.match(intro,/Trace the uppercase /);
  assert.match(intro,/Trace the lowercase /);
  assert.match(practise,/Let(?:'|&apos;)s practise /);
  assert.match(practise,/Now try without tracing/);
  assert.match(practise,/1\. Trace the capital /);
  assert.match(practise,/2\. Trace the lowercase /);
  assert.ok((practise.match(/stroke-dasharray="7 8"/g)||[]).length>=5,"not enough handwriting lines for "+letter);
 }
 assert.match(renderHandwritingPage(2),/Let(?:'|&apos;)s learn the letter Aa/);
 assert.match(renderHandwritingPage(3),/Let(?:'|&apos;)s practise Aa/);
 assert.match(renderHandwritingPage(54),/LITTLE LETTER HERO/);
});
test("Free families never receive book artwork; paid parents can read it",async()=>{
 const h=harness(),free=await h.parent("FREE_PREVIEW"),paid=await h.parent("ACTIVE_MONTHLY");
 const freeMeta=await h.req("/handwriting-book",free.token);
 assert.equal(freeMeta.status,200);
 const locked=await freeMeta.json();
 assert.equal(locked.unlocked,false);
 assert.equal(locked.pages,56);
 assert.equal((await h.req("/handwriting-book/pages/2",free.token)).status,402);
 assert.equal((await h.req("/handwriting-book/pages/2")).status,401);
 const meta=await (await h.req("/handwriting-book",paid.token)).json();
 assert.equal(meta.unlocked,true);
 const sheet=await h.req("/handwriting-book/pages/2",paid.token);
 assert.equal(sheet.status,200);
 assert.match(sheet.headers.get("content-type")||"",/image\/svg\+xml/);
 assert.equal(sheet.headers.get("cache-control"),"private, no-store");
 const content=await sheet.text();
 assert.match(content,/Lowercase a/);
 assert.match(content,/stroke-dasharray/);
 for(const page of ["-1","56","abc","01"])
  assert.equal((await h.req("/handwriting-book/pages/"+page,paid.token)).status,404);
});
test("Owner has free creator access while ordinary free families stay locked",async()=>{
 const h=harness(),parent=await h.parent("FREE_PREVIEW");
 h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(),parent.userId);
 const result=await h.req("/handwriting-book/pages/0",parent.token);
 assert.equal(result.status,200);
 assert.match(await result.text(),/THE LITTLE/);
});
