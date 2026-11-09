import test from "node:test";
import assert from "node:assert/strict";
import { generateHomeEducationTemplate } from "../src/homeEducationPdf.ts";
import { sha256 } from "../src/documentReview.ts";

test("fillable Home Education PDF is state-specific, multipage and deterministic for preview approval", async () => {
  const first=generateHomeEducationTemplate("QLD","3");
  const again=generateHomeEducationTemplate("QLD","3");
  const raw=new TextDecoder().decode(first);
  assert.ok(first.length>2000);
  assert.match(raw,/^%PDF-1.7/);
  assert.match(raw,/\/AcroForm/);
  assert.match(raw,/\/Subtype \/Widget/);
  assert.match(raw,/\/Ff 4096/);
  assert.match(raw,/Queensland/);
  assert.match(raw,/\/Count [2-9][0-9]*/);
  assert.equal(await sha256(first),await sha256(again),"owner approval must save exact preview bytes");
  assert.notEqual(await sha256(first),await sha256(generateHomeEducationTemplate("NSW","3")));
});
test("fillable PDF refuses unsupported jurisdiction",()=>assert.throws(()=>generateHomeEducationTemplate("OTHER")));
