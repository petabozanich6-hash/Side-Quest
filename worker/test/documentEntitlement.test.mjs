import test from "node:test";
import assert from "node:assert/strict";
import { guidedProductState, mayAccessGuidedDocument } from "../src/documentEntitlement.ts";

const productId = "11111111-2222-4333-8444-555555555555";
const product = { id: productId, fulfilment: "digital", tags: JSON.stringify(["home-education-document", "guided-document", "nsw"]) };
const paid = {
  paid_at: "2026-11-10T00:00:00.000Z",
  lines: [{ product_id: productId, physical: false, amount_cents: 2995 }],
};

test("guided document can only resolve one supported state from a genuine guided digital product", () => {
  assert.equal(guidedProductState(product), "NSW");
  assert.equal(guidedProductState({ ...product, tags: ["home-education-document", "guided-document", "vic"] }), "VIC");
  assert.equal(guidedProductState({ ...product, tags: ["home-education-document", "guided-document", "nsw", "vic"] }), null);
  assert.equal(guidedProductState({ ...product, tags: ["home-education-document", "nsw"] }), null);
  assert.equal(guidedProductState({ ...product, tags: "not-json" }), null);
  assert.equal(guidedProductState({ ...product, fulfilment: "physical" }), null);
  assert.equal(guidedProductState({ ...product, tags: ["home-education-document", "guided-document", "other"] }), null);
});

test("guided document requires signed webhook payment, matching order line, and matching product", () => {
  assert.equal(mayAccessGuidedDocument(paid, product, productId), true);
  assert.equal(mayAccessGuidedDocument(null, product, productId), false);
  assert.equal(mayAccessGuidedDocument({ ...paid, paid_at: null }, product, productId), false);
  assert.equal(mayAccessGuidedDocument({ ...paid, lines: [] }, product, productId), false);
  assert.equal(mayAccessGuidedDocument({ ...paid, lines: [{ product_id: productId, physical: true, amount_cents: 2995 }] }, product, productId), false);
  assert.equal(mayAccessGuidedDocument({ ...paid, lines: [{ product_id: productId, physical: false, amount_cents: 0 }] }, product, productId), false);
  assert.equal(mayAccessGuidedDocument(paid, { ...product, id: "22222222-2222-4333-8444-555555555555" }, productId), false);
  assert.equal(mayAccessGuidedDocument(paid, product, "33333333-2222-4333-8444-555555555555"), false);
  assert.equal(mayAccessGuidedDocument(paid, { ...product, tags: '["home-education-document","nsw"]' }, productId), false);
  assert.equal(mayAccessGuidedDocument(paid, product, "bad"), false);
});
