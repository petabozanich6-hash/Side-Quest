import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const copy=readFileSync(new URL("../../frontend/src/pages/legal/legalContent.js",import.meta.url),"utf8");
test("privacy policy prioritises private in-app feedback with email fallback",()=>{
  assert.match(copy,/Signed-in families can contact me privately through Parent Hub/);
  assert.match(copy,/If you cannot sign in or that tool fails, email support@sidequestlearning\.app/);
  assert.doesNotMatch(copy,/\{ h: "Contact", p: "Side-Quest, support@sidequestlearning\.app" \}/);
});

test("branded email footer points signed-in families to the private feedback tool",()=>{
  const email=readFileSync(new URL("../src/email.ts",import.meta.url),"utf8");
  assert.match(email,/Need help\? Signed in\? Use/);
  assert.match(email,/SITE_URL}\/parent\/feedback/);
  assert.match(email,/If you cannot access it, reply or email/);
});

 test("public pricing and HQ quote builder share the same catalogue",async()=>{
 const src=readFileSync(new URL("../../frontend/src/lib/supportPricing.js",import.meta.url),"utf8");
 const {SUPPORT_RATES,packageRate}=await import("data:text/javascript;base64,"+Buffer.from(src).toString("base64"));
 assert.deepEqual(SUPPORT_RATES.map(r=>r.cents),[2500,3500,4500,3000,1500]);
 assert.equal(packageRate([{minutes:30},{minutes:45},{minutes:60}]),10500);
 assert.equal(packageRate([{minutes:90}]),null);
 for(const p of ["../../frontend/src/pages/parent/LearningSupport.jsx","../../frontend/src/pages/parent/hq/HqSupportQuotes.jsx","../../frontend/src/pages/parent/hq/HqSupportPriceGuide.jsx"]){assert.match(readFileSync(new URL(p,import.meta.url),"utf8"),/supportPricing/);}
 });
