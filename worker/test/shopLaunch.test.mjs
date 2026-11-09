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
  const live = rows.filter((r) => !holdBack(r));
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
