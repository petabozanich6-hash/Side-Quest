import test from "node:test";
import assert from "node:assert/strict";
import { makeDb as freshDb } from "./fakeD1.mjs";
// These tests cover the catalogue before the 9 Nov 2026 launch (shopLaunch.test.mjs covers the launch itself).
const makeDb = (...a) => { const db = freshDb(...a); db.raw.exec("CREATE TABLE IF NOT EXISTS shop_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL); INSERT INTO shop_meta VALUES ('launch_v1', 'test')"); return db; };
import { ensureShopCatalog, validateProduct } from "../src/shopCatalog.ts";
import { parcelForCart, quoteStandardPost, ShippingQuoteError } from "../src/shopShipping.ts";
import { createShopOrder, recordPaidShopOrder } from "../src/shopOrders.ts";

const product = async (db) => {
  await ensureShopCatalog(db);
  const p = await db.prepare("SELECT id FROM shop_products LIMIT 1").first();
  await db.prepare("UPDATE shop_products SET parcel_weight_g = 180, parcel_length_cm = 20, parcel_width_cm = 14, parcel_height_cm = 3 WHERE id = ?").bind(p.id).run();
  return p.id;
};
const line = (id, qty = 1) => ({ product_id: id, qty, physical: true, title: "Painting Set", unit_cents: 1499, amount_cents: 1499 * qty });

test("postage uses packed measurements for the combined order, not browser-supplied rates", async () => {
  const db = makeDb();
  const id = await product(db);
  const parcel = await parcelForCart(db, [line(id, 2)]);
  assert.deepEqual(parcel, { weight_g: 360, length_cm: 20, width_cm: 14, height_cm: 6 });
  let calls = 0;
  const fetchImpl = async (url, init) => {
    calls++;
    assert.equal(init.headers["AUTH-KEY"], "private-test-key");
    const u = new URL(url);
    assert.equal(u.searchParams.get("from_postcode"), "2340");
    assert.equal(u.searchParams.get("to_postcode"), "2000");
    assert.equal(u.searchParams.get("service_code"), "AUS_PARCEL_REGULAR");
    assert.equal(u.searchParams.get("weight"), "0.36");
    assert.equal(u.searchParams.get("height"), "6");
    return Response.json({ postage_result: { service: "Parcel Post", total_cost: "13.70" } });
  };
  const quote = await quoteStandardPost({ DB: db, AUSPOST_PAC_API_KEY: "private-test-key" }, [line(id, 2)], "2000", fetchImpl);
  assert.equal(calls, 1);
  assert.deepEqual(quote && { service: quote.service, postage_cents: quote.postage_cents, postcode: quote.postcode }, { service: "Parcel Post", postage_cents: 1370, postcode: "2000" });
  assert.equal(JSON.stringify(quote).includes("private-test-key"), false);
});

test("postage refuses incomplete packing data rather than guessing a price", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const id = (await db.prepare("SELECT id FROM shop_products LIMIT 1").first()).id;
  await assert.rejects(parcelForCart(db, [line(id)]), /measurements are not ready/i);
  await db.prepare("UPDATE shop_products SET parcel_weight_g = 180, parcel_length_cm = 20, parcel_width_cm = 14, parcel_height_cm = 3 WHERE id = ?").bind(id).run();
  await assert.rejects(quoteStandardPost({ DB: db, AUSPOST_PAC_API_KEY: "x" }, [line(id)], "not-a-postcode"), /four-digit/i);
  await assert.rejects(quoteStandardPost({ DB: db }, [line(id)], "2000"), /not configured/i);
  await assert.rejects(quoteStandardPost({ DB: db, AUSPOST_PAC_API_KEY: "x" }, [line(id)], "2000", async () => Response.json({ postage_result: { total_cost: "NaN" } })), /invalid postage/i);
  await assert.rejects(parcelForCart(db, [line(id, 40)]), /custom shipping quote/i);
  assert.equal(await quoteStandardPost({ DB: db }, [{ title: "PDF", amount_cents: 200 }], "2000"), null);
});

test("packed measurements are validated as positive whole grams and centimetres", () => {
  const base = { title: "Paint", department: "arts", parcel_weight_g: 170, parcel_length_cm: 19, parcel_width_cm: 13, parcel_height_cm: 3 };
  const valid = validateProduct(base);
  assert.equal(valid.ok, true);
  assert.equal(valid.value.parcel_weight_g, 170);
  assert.equal(validateProduct({ ...base, parcel_weight_g: -1 }).ok, false);
  assert.equal(validateProduct({ ...base, parcel_length_cm: 120 }).ok, false);
});

test("Square delivery postcode changes hold paid orders for owner review", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const lines = [{ title: "Paint", amount_cents: 1499, physical: true, qty: 1 }];
  const changed = await createShopOrder(db, "sample@example.com", lines, new Date(), 1300, "2000");
  assert.equal(changed.total, 2799);
  await recordPaidShopOrder(db, { DB: db }, changed.id, changed.total, "square-1", "https://sidequestlearning.app", new Date(), { postal_code: "3000" });
  const first = await db.prepare("SELECT status, quoted_postcode, shipping_service FROM shop_orders WHERE id = ?").bind(changed.id).first();
  assert.equal(first.status, "address_review");
  assert.equal(first.quoted_postcode, "2000");
  assert.equal(first.shipping_service, "Parcel Post");
  const matching = await createShopOrder(db, "sample@example.com", lines, new Date(), 1300, "2000");
  await recordPaidShopOrder(db, { DB: db }, matching.id, matching.total, "square-2", "https://sidequestlearning.app", new Date(), { postal_code: "2000" });
  assert.equal((await db.prepare("SELECT status FROM shop_orders WHERE id = ?").bind(matching.id).first()).status, "to_fulfil");
});


test("document print-and-post is delivered with no additional postage line", async () => {
  const db=makeDb(); const id=await product(db);
  await db.prepare("UPDATE shop_products SET tags=?, fulfilment=?, collection=? WHERE id=?")
    .bind('["home-education-document","print-and-post","nsw"]',"made_to_order","Home Education Documents",id).run();
  const order={...line(id),personalisation:{child_count:"4"}};
  assert.equal(await parcelForCart(db,[order]),null);
  assert.equal(await quoteStandardPost({DB:db},[order],"2000"),null);
});
test("spiral-bound premium diary also includes delivery",async()=>{
  const db=makeDb();const id=await product(db);
  await db.prepare("UPDATE shop_products SET tags=?, fulfilment=?, collection=? WHERE id=?")
    .bind('["home-education-document","premium-planner-printed","nsw"]',"made_to_order","Home Education Documents",id).run();
  assert.equal(await parcelForCart(db,[line(id)]),null);
});
