import { test } from "node:test";
import assert from "node:assert/strict";
import { extractVicIds, LEVEL_PATHS } from "../scripts/import-vic-review.mjs";

test("VCAA page extraction only emits authentic-looking VC2 identifiers and dedupes", () => {
  const html = '<div><span>VC2M3N01</span><p>VC2M3N01</p><p>VC2S2U01</p>' +
    '<p>AC9M3N06</p><p>VCELL100</p><p>VC2M</p></div>';
  const rows=extractVicIds(html,"https://f10.vcaa.vic.edu.au/levels/level-3","3");
  assert.deepEqual(rows.map(x=>x.code),["VC2M3N01","VC2S2U01"]);
  assert.ok(rows.every(x=>x.framework==="VCAA F–10 v2"));
  assert.ok(rows.every(x=>x.source_level==="3"));
});
test("VCAA probe covers all standard years and A–D, with no duplicate download URLs",()=>{
  assert.ok(LEVEL_PATHS.some(x=>x.level==="10"));
  assert.ok(LEVEL_PATHS.some(x=>x.level==="Foundation"));
  for (const level of ["FLA","FLB","FLC","FLD"]) assert.ok(LEVEL_PATHS.some(x=>x.level===level));
  assert.equal(new Set(LEVEL_PATHS.map(x=>x.url)).size,LEVEL_PATHS.length);
});
