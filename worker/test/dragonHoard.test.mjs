import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { makeDb } from "./fakeD1.mjs";
import { HOARD_SCHEMA, validateHoardOffer, createHoardOffer, disableHoardOffer, listHoardOffers, giftPreviewDays } from "../src/dragonHoard.ts";

const offer = () => ({
  code: "FOUNDINGDRAGON", label: "Founding Dragon", percent_off: 20,
  duration_months: 1, max_redemptions: 25,
  expires_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
});

test("Hoard schema is additive, idempotent and appears in migration 0067", async () => {
  const db = makeDb();
  for (const sql of HOARD_SCHEMA) {
    assert.ok(readFileSync(new URL("../migrations/0067_dragons_hoard.sql", import.meta.url), "utf8").includes(sql.replace(/\s+/g, " ").slice(0, 40).trim().split(" (")[0]));
  }
  const before = await listHoardOffers(db);
  assert.deepEqual(before, []);
  await listHoardOffers(db);
  assert.equal(db.raw.prepare("SELECT COUNT(*) AS n FROM dragon_hoard_offers").get().n, 0);
});

test("Hoard rejects unsafe or overly generous discounts", () => {
  assert.equal(validateHoardOffer(offer()).ok, true);
  for (const bad of [
    { code: "X!" }, { percent_off: 100 }, { percent_off: "20" },
    { duration_months: 3 }, { duration_months: 100 }, { max_redemptions: 501 },
    { expires_at: "2020-01-01" }, { label: "<script>" },
  ]) {
    assert.equal(validateHoardOffer({ ...offer(), ...bad }).ok, false, JSON.stringify(bad));
  }
});

test("Stripe handles coupon and redemption caps, and retiring a code disables it", async () => {
  const db = makeDb();
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: String(init?.body || ""), method: init?.method });
    if (url.includes("/prices/")) return new Response(JSON.stringify({ id: url.split("/").at(-1), product: "prod_SideQuest1" }), { status: 200 });
    if (url.endsWith("/coupons")) return new Response(JSON.stringify({ id: "sqhoard_test_foundingdragon" }), { status: 200 });
    if (url.endsWith("/promotion_codes")) return new Response(JSON.stringify({ id: "promo_a1" }), { status: 200 });
    if (url.endsWith("/promotion_codes/promo_a1")) return new Response(JSON.stringify({ id: "promo_a1", active: false }), { status: 200 });
    return new Response(JSON.stringify({ error: { message: "Unexpected path" } }), { status: 400 });
  };
  try {
    const env = { STRIPE_SECRET_KEY: "sk_test_fake" };
    const made = await createHoardOffer(db, env, offer(), "owner1");
    assert.equal(made.ok, true);
    const rows = await listHoardOffers(db);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].mode, "test");
    assert.equal(rows[0].code, "FOUNDINGDRAGON");
    assert.equal(calls.filter((c) => c.url.includes("/prices/")).length, 4, "all SideQuest billing prices must be resolved");
    assert.ok(calls.some((c) => c.url.endsWith("/coupons") && c.body.includes("duration=once") && c.body.includes("applies_to%5Bproducts%5D%5B0%5D=prod_SideQuest1") && !c.body.includes("duration_in_months")));
    assert.ok(calls.some((c) => c.url.endsWith("/promotion_codes") && c.body.includes("max_redemptions=25") && c.body.includes("first_time_transaction")));
    assert.equal((await createHoardOffer(db, env, offer(), "owner1")).status, 409);
    assert.equal((await disableHoardOffer(db, { STRIPE_SECRET_KEY: "sk_live_fake", STRIPE_LIVE_ENABLED: "true" }, made.id)).status, 409);
    assert.equal((await disableHoardOffer(db, env, made.id)).ok, true);
    assert.equal((await listHoardOffers(db))[0].active, 0);
    assert.equal((await disableHoardOffer(db, env, made.id)).status, 409);
  } finally {
    globalThis.fetch = original;
  }
});

test("Preview gifts are capped, conditional and do not confer paid access", async () => {
  const db = makeDb();
  const start = new Date().toISOString();
  const end = new Date(Date.now() + 7 * 86400_000).toISOString();
  db.raw.prepare("INSERT INTO families (id, name, owner_id, created_at, plan, trial_started_at, trial_ends_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run("hoard-family", "A test family", "parent", start, "FREE_PREVIEW", start, end);
  const first = await giftPreviewDays(db, "hoard-family", 7);
  assert.equal(first.ok, true);
  assert.ok(Date.parse(first.ends_at) > Date.parse(end));
  assert.equal((await giftPreviewDays(db, "hoard-family", 14)).ok, true);
  assert.equal((await giftPreviewDays(db, "hoard-family", 14)).status, 409);
  const row = db.raw.prepare("SELECT plan, stripe_subscription_id FROM families WHERE id='hoard-family'").get();
  assert.equal(row.plan, "FREE_PREVIEW");
  assert.equal(row.stripe_subscription_id, null);
  assert.equal((await giftPreviewDays(db, "hoard-family", -1)).status, 400);
  db.raw.prepare("UPDATE families SET plan='ACTIVE_MONTHLY' WHERE id='hoard-family'").run();
  assert.equal((await giftPreviewDays(db, "hoard-family", 1)).status, 409);
});
