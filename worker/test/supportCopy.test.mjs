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
