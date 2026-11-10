import test from "node:test";
import assert from "node:assert/strict";
import { combineFamilyPlanHtml } from "../src/familyDocumentHtml.ts";

const document = (name) => `<!doctype html><html><head><meta charset="utf-8"><style>.cover{break-after:page}</style></head><body><section class="cover"><h1>${name}</h1></section><p>Individual learner content</p></body></html>`;

test("combined family PDF HTML retains every separate learner plan and branded stylesheet", () => {
  const html = combineFamilyPlanHtml([document("Alex"), document("Sam"), document("Taylor")]);
  assert.match(html, /<h1>Alex<\/h1>/);
  assert.match(html, /<h1>Sam<\/h1>/);
  assert.match(html, /<h1>Taylor<\/h1>/);
  assert.equal((html.match(/Individual learner content/g) || []).length, 3);
  assert.equal((html.match(/family-learner-page/g) || []).length, 3);
  assert.match(html, /\.cover\{break-after:page\}/);
  assert.equal((html.match(/<html/g) || []).length, 1);
});

test("combined family PDF rejects missing, too many or malformed learner pages", () => {
  assert.throws(() => combineFamilyPlanHtml([document("Alex")]));
  assert.throws(() => combineFamilyPlanHtml(Array(6).fill(document("Alex"))));
  assert.throws(() => combineFamilyPlanHtml([document("Alex"), "<p>bad</p>"]));
});
