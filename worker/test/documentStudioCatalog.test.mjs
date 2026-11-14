import test from "node:test";
import assert from "node:assert/strict";
import { documentStudioCatalog, validateHomeEducationExport } from "../src/documentStudioRoutes.ts";
import { generateHomeEducationTemplate } from "../src/homeEducationPdf.ts";

test("Document Studio provides 48 independent Square export templates, not old shop records", () => {
  const catalog = documentStudioCatalog();
  assert.equal(catalog.offers.length, 48);
  assert.equal(catalog.square_catalogue_connected, false);
  assert.ok(catalog.offers.every(o => o.sidequest_listings.length === 0));
  assert.equal(catalog.offers.filter(o => o.state === "NSW").length, 6);
});
test("Document Studio exports genuine fillable and print PDFs without shop orders", () => {
  const request = {state:"NSW", year_level:"ALL", product_kind:"blank", edition:"standard", mode:"fillable", secondary_electives:[]};
  const params = validateHomeEducationExport(request);
  assert.equal(params.ok, true);
  if (!params.ok) throw new Error(params.detail);
  const a = new TextDecoder().decode(generateHomeEducationTemplate(params.state, params.year, false, params.mode, params.edition, params.electives, params.kind));
  const b = new TextDecoder().decode(generateHomeEducationTemplate("NSW", "ALL", false, "print", "standard", [], "blank"));
  assert.match(a, /^%PDF-/);
  assert.match(a, /\/AcroForm/);
  assert.doesNotMatch(b, /\/AcroForm/);
});
test("Document Studio refuses mismatched, misleading or invalid production masters", () => {
  const base = {state:"VIC", year_level:"ALL", product_kind:"planner_personalised", edition:"complete", mode:"print"};
  assert.equal(validateHomeEducationExport(base).ok, true);
  assert.equal(validateHomeEducationExport({...base, edition:"standard"}).ok, false);
  assert.equal(validateHomeEducationExport({...base, state:"OTHER"}).ok, false);
  assert.equal(validateHomeEducationExport({...base, mode:"bad"}).ok, false);
  assert.equal(validateHomeEducationExport({...base, secondary_electives:["PDHPE"]}).ok, false);
});
