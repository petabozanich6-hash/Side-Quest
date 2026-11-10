import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { ensureShopCatalog, buyable, productRow, variantsFor } from "../src/shopCatalog.ts";
import { loadPlatformSettings, clearSettingsCache } from "../src/platformSettings.ts";
import { holdBack, WEEKLY_DISPATCH } from "../src/data/shopLaunchPrices.ts";

const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;

test("launch: every product except the unfinished workbooks is live, priced, buyable and posted weekly; the shop opens", async () => {
  clearSettingsCache();
  const db = makeDb();
  await ensureShopCatalog(db);
  const rows = (await all(db, "SELECT * FROM shop_products")).map(productRow);
  const vars = await variantsFor(db, rows.map((r) => r.id));
  const held = rows.filter((r) => holdBack(r));
  const documents=rows.filter(r=>r.collection==="Home Education Documents");
  assert.equal(documents.length,48);
  assert.equal(documents.filter(r=>buyable(r).ok).length,48,"every edition generates from the paid order and can be purchased");
  const live = rows.filter((r) => !holdBack(r)&&r.collection!=="Home Education Documents");
  assert.ok(held.length >= 16 && held.length < 40, `held back ${held.length}`);
  for (const r of held) assert.deepEqual([r.status, r.visible, r.price_cents], ["draft", false, null], r.title);
  assert.ok(held.some((r) => r.title === "Side-Quest Mathematics workbooks") && held.some((r) => r.title === "Printed Quest Book"));
  for (const r of live) {
    const b = buyable(r, vars.get(r.id) || []);
    assert.ok(b.ok, `${r.title}: ${b.reason}`);
    assert.ok(r.price_cents >= 50, r.title);
    if (r.fulfilment !== "digital") {
      assert.ok(r.parcel_weight_g > 0 && r.parcel_length_cm > 0, `${r.title} needs a parcel size`);
      assert.equal(r.dispatch_estimate, WEEKLY_DISPATCH);
    }
    if (["postal_subscription", "subscription_box"].includes(r.fulfilment)) assert.ok(r.one_off_cents > r.price_cents && r.dispatch_day && r.cutoff_day, r.title);
  }
  const posters = live.find((r) => r.title === "World maps");
  assert.deepEqual((vars.get(posters.id) || []).map((v) => v.price_cents), [1495, 2495, 3495]);
  assert.equal((await loadPlatformSettings(db, { fresh: true })).features.shopOpen, true);
  console.log(`live ${live.length}, held back ${held.length}: ${held.map((r) => r.title).join("; ")}`);
});

test("launch never overwrites the owner's work and runs once", async () => {
  clearSettingsCache();
  const db = makeDb();
  await db.prepare("CREATE TABLE IF NOT EXISTS shop_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)").run();
  await db.prepare("INSERT INTO shop_meta (key, value) VALUES ('launch_v1', 'x')").run();
  await ensureShopCatalog(db);
  // Pre-launch shop: the owner priced one product and hid another deliberately.
  await db.prepare("UPDATE shop_products SET price_cents = 4200, parcel_weight_g = 999 WHERE title = 'Ignis T-shirts'").run();
  await db.prepare("UPDATE shop_products SET status = 'coming_soon' WHERE title = 'Crayons'").run();
  await db.prepare("DELETE FROM shop_meta WHERE key = 'launch_v1'").run();
  const { applyLaunch } = await import("../src/shopCatalog.ts");
  await applyLaunch(db);
  const tee = await db.prepare("SELECT * FROM shop_products WHERE title = 'Ignis T-shirts'").first();
  assert.deepEqual([tee.price_cents, tee.parcel_weight_g, tee.status, tee.visible], [4200, 999, "made_to_order", 1]);
  const crayons = await db.prepare("SELECT status, visible, price_cents FROM shop_products WHERE title = 'Crayons'").first();
  assert.deepEqual([crayons.status, crayons.visible, crayons.price_cents], ["coming_soon", 0, null]);
  await db.prepare("UPDATE shop_products SET price_cents = 100, status = 'draft', visible = 0 WHERE title = 'Ignis T-shirts'").run();
  await applyLaunch(db);
  assert.equal((await db.prepare("SELECT status FROM shop_products WHERE title = 'Ignis T-shirts'").first()).status, "draft", "runs once");
});

test("every catalogue product that isn't held back has a launch price", async () => {
  const { SHOP_SEED, SHOP_ADDITIONS } = await import("../src/data/shopCatalogue.ts");
  const { SHOP_PREFILL } = await import("../src/data/shopPrefill.ts");
  const { launchEntry } = await import("../src/data/shopLaunchPrices.ts");
  const missing = [...SHOP_SEED, ...SHOP_ADDITIONS.flatMap((b) => b.products)]
    .filter((p) => !holdBack({ ...p, description: SHOP_PREFILL[p.title]?.d || p.description }) && !launchEntry(p)).map((p) => p.title);
  assert.deepEqual(missing, []);
});

test("tiers: Basics / Full package options get rising prices; the owner's own option prices are kept", async () => {
  clearSettingsCache();
  const db = makeDb();
  await ensureShopCatalog(db);
  const { applyTierPrices, tierPrice } = await import("../src/shopCatalog.ts");
  const acrylic = await db.prepare("SELECT id FROM shop_products WHERE title = 'Acrylic paint sets'").first();
  const tee = await db.prepare("SELECT id FROM shop_products WHERE title = 'Ignis T-shirts'").first();
  await db.prepare("UPDATE shop_products SET price_cents = 1500 WHERE id = ?").bind(acrylic.id).run();
  await db.prepare("DELETE FROM shop_variants WHERE product_id IN (?, ?)").bind(acrylic.id, tee.id).run();
  const add = (pid, name, sort, details = "", price = null) => db.prepare("INSERT INTO shop_variants (id, product_id, name, sort, details, price_cents) VALUES (?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), pid, name, sort, details, price).run();
  await add(acrylic.id, "Basics", 0, "5 cards"); await add(acrylic.id, "Full package", 1, "10 cards, apron");
  await add(tee.id, "Basics", 0, "", 2000); await add(tee.id, "Full package", 1, "");
  await db.prepare("DELETE FROM shop_meta WHERE key = 'tiers_v1'").run();
  await applyTierPrices(db);
  const prices = async (pid) => (await all(db, "SELECT price_cents FROM shop_variants WHERE product_id = ? ORDER BY sort", pid)).map((r) => r.price_cents);
  assert.deepEqual(await prices(acrylic.id), [1500, 2395]);
  assert.deepEqual(await prices(tee.id), [2000, null], "owner priced one tier, so the product is left alone");
  assert.deepEqual([tierPrice(1695, 1), tierPrice(1695, 2), tierPrice(100, 1)], [2695, 3695, 200]);
  // Sizes and ages aren't tiers.
  const umbrellas = await db.prepare("SELECT id FROM shop_products WHERE title = 'Socks'").first();
  assert.ok((await prices(umbrellas.id)).every((p) => p === null));
});
