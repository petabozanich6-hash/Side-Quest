import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { ensureShopCatalog, validateProduct, publicProduct, buyable, profitFor } from "../src/shopCatalog.ts";
import { priceItems, publicCatalog, readiness, squareLinesFor } from "../src/shopRoutes.ts";
import { createShopOrder, recordPaidShopOrder } from "../src/shopOrders.ts";
import { validateRecipient } from "../src/shopSubscriptions.ts";

const env = (db) => ({ DB: db });
const one = (db, title) => db.prepare("SELECT * FROM shop_products WHERE title = ?").bind(title).first();

test("the catalogue seeds once, as hidden drafts with no prices, stock, suppliers or photos", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const n = await db.prepare("SELECT COUNT(*) n FROM shop_products").first();
  assert.ok(n.n > 350, `seeded ${n.n}`);
  const odd = await db.prepare("SELECT COUNT(*) n FROM shop_products WHERE visible != 0 OR status != 'draft' OR price_cents IS NOT NULL OR stock IS NOT NULL OR supplier != '' OR images != 0").first();
  assert.equal(odd.n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM shop_variants WHERE price_cents IS NOT NULL OR stock IS NOT NULL").first()).n, 0);
  // Mums, dads, grandparents and carers.
  const who = (await db.prepare("SELECT v.name FROM shop_variants v JOIN shop_products p ON p.id = v.product_id WHERE p.title = 'Grown-Up Coffee Mugs'").all()).results.map((r) => r.name);
  for (const w of ["Mum", "Dad", "Nan", "Pop", "Carer"]) assert.ok(who.includes(w), w);
  // Printed Quest Books, with the state for lesson outcome codes.
  const printed = await one(db, "Printed Quest Book + Lesson Pack");
  assert.equal(printed.prints_books, 1);
  assert.match(printed.personalisation, /state/);
  // Deleting a product never brings it back.
  await db.prepare("DELETE FROM shop_products WHERE id = ?").bind(printed.id).run();
  await ensureShopCatalog(db);
  assert.equal(await one(db, "Printed Quest Book + Lesson Pack"), null);
  assert.deepEqual((await publicCatalog(db)).products, [], "nothing is public until switched on");
});

test("a product only sells once switched on, given a selling status and a price", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const p = await one(db, "Printed Quest Book");
  const set = (sql, ...a) => db.prepare(`UPDATE shop_products SET ${sql} WHERE id = ?`).bind(...a, p.id).run();
  assert.equal((await priceItems(db, [{ product_id: p.id }])).ok, false, "hidden draft");
  await set("visible = 1, status = 'register_interest'");
  let cat = await publicCatalog(db);
  assert.equal(cat.products.length, 1);
  assert.equal(cat.products[0].can_buy, false);
  assert.equal(cat.products[0].can_register_interest, true);
  assert.ok(!("supplier" in cat.products[0]) && !("wholesale_cents" in cat.products[0]), "no costs or suppliers in public");
  await set("status = 'made_to_order', price_cents = 2499, postage_cents = 995, max_per_order = 3");
  await db.prepare("INSERT INTO shop_variants (id, product_id, name, sort, book_id) VALUES ('11111111-1111-1111-1111-111111111111', ?, 'Number Navigators', 0, 'number-navigators')").bind(p.id).run();
  cat = await publicCatalog(db);
  assert.equal(cat.products[0].can_buy, true);
  assert.equal(cat.products[0].variants[0].book_id, "number-navigators");
  assert.match((await priceItems(db, [{ product_id: p.id }])).detail, /Choose an option/);
  assert.match((await priceItems(db, [{ product_id: p.id, variant_id: "11111111-1111-1111-1111-111111111111", qty: 4 }])).detail, /up to 3/);
  const ok = await priceItems(db, [{ product_id: p.id, variant_id: "11111111-1111-1111-1111-111111111111", qty: 2 }]);
  assert.equal(ok.ok, true);
  assert.equal(ok.lines[0].amount_cents, 4998);
  assert.equal(ok.postage, 995);
  assert.equal(ok.physical, true);
  const sq = squareLinesFor(ok.lines, ok.postage);
  assert.deepEqual(sq.map((l) => [l.amount_cents, l.quantity || 1]), [[2499, 2], [995, 1]]);
});

test("personalisation is required where set, stock is respected, and postage is charged once", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const a = await one(db, "Printed Quest Book + Lesson Pack");
  const b = await one(db, "Printed Quest Book");
  for (const [p, post] of [[a, 1200], [b, 800]]) {
    await db.prepare("UPDATE shop_products SET visible = 1, status = 'in_stock', price_cents = 3000, postage_cents = ?, stock = 2 WHERE id = ?").bind(post, p.id).run();
  }
  assert.match((await priceItems(db, [{ product_id: a.id }])).detail, /state/i);
  assert.match((await priceItems(db, [{ product_id: b.id, qty: 3 }])).detail, /Only 2/);
  const ok = await priceItems(db, [{ product_id: a.id, personalisation: { state: "VIC <b>" } }, { product_id: b.id }]);
  assert.equal(ok.ok, true);
  assert.equal(ok.postage, 1200, "highest postage, once");
  assert.equal(ok.lines[0].personalisation.state, "VIC  b");
  // Paying takes stock off once.
  const order = await createShopOrder(db, "x@y.co", ok.lines, new Date(), ok.postage);
  assert.equal(order.total, 3000 + 3000 + 1200);
  await recordPaidShopOrder(db, env(db), order.id, order.total, "p1", "https://x");
  await recordPaidShopOrder(db, env(db), order.id, order.total, "p1", "https://x");
  assert.equal((await db.prepare("SELECT stock FROM shop_products WHERE id = ?").bind(b.id).first()).stock, 1);
  assert.equal((await db.prepare("SELECT status FROM shop_orders WHERE id = ?").bind(order.id).first()).status, "to_fulfil");
});

test("owner edits are validated; readiness and profit come from the owner's own numbers", () => {
  assert.equal(validateProduct({ title: "", department: "books" }).ok, false);
  assert.equal(validateProduct({ title: "Mug", department: "nope" }).ok, false);
  assert.equal(validateProduct({ title: "Mug", department: "homewares", price_cents: 20 }).ok, false);
  const v = validateProduct({ title: "Mug", department: "homewares", status: "in_stock", price_cents: 2500, variants: [{ name: "Dad", price_cents: 2700, stock: 4 }] });
  assert.equal(v.ok, true);
  assert.equal(v.variants[0].name, "Dad");
  const p = { status: "in_stock", visible: 1, price_cents: 2500, wholesale_cents: 900, postage_cents: 800, images: 0, description: "x", fulfilment: "physical", supplier: "", stock: 3 };
  assert.deepEqual(readiness(p, []), ["photo", "packed weight & dimensions", "supplier"]);
  assert.deepEqual(profitFor(p), { fee_cents: 55, profit_cents: 1545, postage_cents: 800, cost_known: true });
  assert.equal(buyable({ ...p, stock: 0 }, []).ok, false);
  assert.equal(publicProduct({ ...p, tags: [], personalisation: [], bundle_items: [], addons: [], gift_months: [] }).can_buy, true);
  assert.equal(typeof validateRecipient({ name: "Sam" }), "string");
  assert.equal(validateRecipient({ name: "Sam", address_line_1: "1 Rd", locality: "Town", state: "NSW", postcode: "2000" }).country, "Australia");
});

test("Owner HQ shop routes are registered before the admin catch-all", async () => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(new URL("../src/adminRoutes.ts", import.meta.url), "utf8");
  assert.ok(src.indexOf("registerShopAdmin(admin") > 0 && src.indexOf("registerShopAdmin(admin") < src.indexOf('admin.all("*"'));
});

test("later product batches reach an already-seeded shop once, as hidden drafts", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const girls = await one(db, "Growing Up Care Box (Girls)");
  assert.ok(girls && girls.visible === 0 && girls.status === "draft" && girls.price_cents === null);
  assert.ok(await one(db, "Growing Up Care Box (Boys)"));
  assert.ok(await one(db, "Weighted Lap Pad") && await one(db, "The Sensory Quest Box"));
  // An owner who deletes it doesn't get it back.
  await db.prepare("DELETE FROM shop_products WHERE id = ?").bind(girls.id).run();
  const again = await import("../src/shopCatalog.ts?again");
  await again.ensureShopCatalog(db);
  assert.equal(await one(db, "Growing Up Care Box (Girls)"), null);
});

test("tiers: each option keeps its own price and what's included", async () => {
  const v = validateProduct({ title: "Science kit", department: "science", price_cents: 2900, variants: [{ name: "Basics", price_cents: 2900, details: "Workbook\nMagnifier" }, { name: "Full package", price_cents: 6900, details: "Everything in Basics\nMicroscope <b>" }] });
  assert.equal(v.ok, true);
  assert.equal(v.variants[1].details, "Everything in Basics\nMicroscope  b");
  const pub = publicProduct({ status: "in_stock", visible: 1, price_cents: 2900, tags: [], personalisation: [], bundle_items: [], addons: [], gift_months: [], fulfilment: "physical" }, v.variants);
  assert.deepEqual(pub.variants.map((x) => [x.name, x.price_cents, x.details.split("\n").length]), [["Basics", 2900, 2], ["Full package", 6900, 2]]);
});

test("development stages: every catalogue product is reconciled to a stage", async () => {
  const { SHOP_SEED, SHOP_ADDITIONS } = await import("../src/data/shopCatalogue.ts");
  const { STAGE_BY_TITLE, PLANNED_ART_SUPPLIES, stageFor } = await import("../src/shopStages.ts");
  const all = [...SHOP_SEED, ...SHOP_ADDITIONS.flatMap((b) => b.products)];
  assert.equal(all.length, 395);
  assert.deepEqual(all.filter((p) => !(p.title in STAGE_BY_TITLE)).map((p) => p.title), [], "every product has an explicit stage");
  for (const t of PLANNED_ART_SUPPLIES) assert.equal(STAGE_BY_TITLE[t], "launch_now", t);
  for (const p of all.filter((x) => x.department === "boxes" || x.department === "dragon-post" && x.fulfilment !== "physical" || x.department === "digital")) assert.equal(stageFor(p), "launch_now", p.title);
  for (const t of ["Brain teaser decks", "Storytelling dice", "Educational bingo sets", "Jigsaw puzzles", "Memory matching games", "Creative Writing prompt card decks"]) assert.equal(STAGE_BY_TITLE[t], "pro_manufacturing", t);
  for (const t of ["Ignis plush dragon", "Ignis figurines", "Side-Quest original board game", "Weighted Lap Pad", "Hoodies and jumpers"]) assert.equal(STAGE_BY_TITLE[t], "future", t);
  assert.equal(stageFor({ title: "Something new", department: "clothing" }), "future");
});

test("an existing shop gets stages without touching anything else, and nothing is published", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const p = await one(db, "Ignis T-shirts");
  // A live shop from before stages: no stage yet, and the owner had already priced and edited this product.
  db.raw.prepare("UPDATE shop_products SET stage = NULL, price_cents = 3500, description = 'Mine', supplier = 'POD Co'").run();
  db.raw.prepare("DELETE FROM shop_meta WHERE key = 'staged_v1'").run();
  const again = await import("../src/shopCatalog.ts?stages");
  await again.ensureShopCatalog(db);
  const after = await db.prepare("SELECT * FROM shop_products WHERE id = ?").bind(p.id).first();
  assert.deepEqual([after.stage, after.price_cents, after.description, after.supplier, after.visible, after.status], ["launch_now", 3500, "Mine", "POD Co", 0, "draft"]);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM shop_products WHERE stage IS NULL").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) n FROM shop_products WHERE visible = 1").first()).n, 0);
});

test("products waiting on manufacturing can't sell as ready to make; monthly boxes sell one-off too", async () => {
  const db = makeDb();
  await ensureShopCatalog(db);
  const deck = await one(db, "Brain teaser decks");
  db.raw.prepare("UPDATE shop_products SET visible = 1, status = 'made_to_order', price_cents = 2000 WHERE id = ?").run(deck.id);
  assert.match((await priceItems(db, [{ product_id: deck.id }])).detail, /Not in production yet/);
  db.raw.prepare("UPDATE shop_products SET status = 'pre_order' WHERE id = ?").run(deck.id);
  assert.equal((await priceItems(db, [{ product_id: deck.id }])).ok, true, "pre-orders are allowed");
  const box = await one(db, "The Creative Quest Box");
  db.raw.prepare("UPDATE shop_products SET visible = 1, status = 'made_to_order', price_cents = 3900, one_off_cents = 4900, dispatch_day = 1, cutoff_day = 20 WHERE id = ?").run(box.id);
  assert.match((await priceItems(db, [{ product_id: box.id }])).detail, /subscription/);
  const r = await priceItems(db, [{ product_id: box.id, one_off: true }]);
  assert.equal(r.ok, true);
  assert.deepEqual([r.lines[0].unit_cents, r.lines[0].physical], [4900, true]);
  const pub = (await publicCatalog(db)).products.find((x) => x.id === box.id);
  assert.deepEqual([pub.price_cents, pub.one_off_cents, pub.cutoff_day, pub.dispatch_day], [3900, 4900, 20, 1]);
  const row = { ...(await db.prepare("SELECT * FROM shop_products WHERE id = ?").bind(box.id).first()), tags: [], gift_months: [] };
  assert.ok(!readiness(row, []).includes("one-off price") && !readiness(row, []).includes("monthly dispatch day"));
  assert.ok(readiness({ ...row, one_off_cents: 3000 }, []).includes("one-off price above the monthly price"));
  assert.ok(readiness({ ...row, stage: "future" }, []).includes("future expansion"));
});
