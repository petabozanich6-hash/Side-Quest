import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import { squareConfig, verifySquareSignature, handleSquareEvent, createCartPaymentLink } from "../src/square.ts";
import { saveCart, ownedTiers, cartPaid } from "../src/questBookPurchases.ts";

const ENV = { SQUARE_ACCESS_TOKEN: "EAAA-test", SQUARE_APPLICATION_ID: "sandbox-sq0idb-abc", SQUARE_LOCATION_ID: "LTEST123456", SQUARE_WEBHOOK_SIGNATURE_KEY: "sig-key" };
const URL_ = "https://sidequestlearning.app/api/billing/square-webhook";

async function sign(body, key = "sig-key", url = URL_) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(url + body)));
  return btoa(String.fromCharCode(...mac));
}

test("Square stays off until every setting (including the webhook key) is present; sandbox is detected", () => {
  assert.equal(squareConfig({}).ok, false);
  assert.equal(squareConfig({ ...ENV, SQUARE_WEBHOOK_SIGNATURE_KEY: "" }).ok, false);
  const cfg = squareConfig(ENV);
  assert.equal(cfg.ok, true);
  assert.equal(cfg.production, false);
  assert.equal(squareConfig({ ...ENV, SQUARE_APPLICATION_ID: "sq0idp-xyz" }).production, true);
});

test("webhook signatures: only Square's exact HMAC over URL + body passes", async () => {
  const body = JSON.stringify({ event_id: "e1" });
  const good = await sign(body);
  assert.equal(await verifySquareSignature(body, good, "sig-key", URL_), true);
  assert.equal(await verifySquareSignature(body + " ", good, "sig-key", URL_), false);
  assert.equal(await verifySquareSignature(body, good, "other-key", URL_), false);
  assert.equal(await verifySquareSignature(body, good, "sig-key", URL_ + "x"), false);
  assert.equal(await verifySquareSignature(body, undefined, "sig-key", URL_), false);
});

function fakeSquare(state) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const path = url.replace(/^https:\/\/[^/]+\/v2\//, "");
    if (path === "online-checkout/payment-links") return new Response(JSON.stringify({ payment_link: { url: "https://square.link/u/abc", order_id: "o1" } }), { status: 200 });
    if (path.startsWith("payments/")) return new Response(JSON.stringify({ payment: state.payment }), { status: 200 });
    if (path.startsWith("orders/")) return new Response(JSON.stringify({ order: state.order }), { status: 200 });
    return new Response("{}", { status: 404 });
  };
  return { fetchImpl, calls };
}

test("a cart checkout sends the server's lines and cart id to Square, never browser prices", async () => {
  const cfg = squareConfig(ENV);
  const sq = fakeSquare({});
  const url = await createCartPaymentLink(cfg, { cartId: "cart-1", familyId: "fam-1", redirectUrl: "https://x/cart", lines: [{ name: "Quest Book: A", amount_cents: 399 }], fetchImpl: sq.fetchImpl });
  assert.equal(url, "https://square.link/u/abc");
  const sent = JSON.parse(sq.calls[0].init.body);
  assert.equal(sent.order.reference_id, "cart-1");
  assert.equal(sent.order.metadata.family_id, "fam-1");
  assert.equal(sent.order.line_items[0].base_price_money.amount, 399);
  assert.equal(sq.calls[0].init.headers.Authorization, "Bearer EAAA-test");
});

test("a completed Square payment unlocks the cart once; wrong amounts and other locations unlock nothing", async () => {
  const db = makeDb();
  const cfg = squareConfig(ENV);
  const cartId = await saveCart(db, "fam-1", [{ book_id: "book-a", tier: "book", amount_cents: 399, title: "A" }], 399);
  const order = { id: "o1", location_id: "LTEST123456", reference_id: cartId, metadata: { kind: "quest_cart", family_id: "fam-1", cart_id: cartId } };
  const event = (status) => ({ type: "payment.updated", event_id: "e", data: { object: { payment: { id: "p1", order_id: "o1", status, location_id: "LTEST123456" } } } });
  // Not completed yet.
  let sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "APPROVED", amount_money: { amount: 399, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("APPROVED"), sq.fetchImpl), /APPROVED/);
  // Paid the wrong amount.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 1, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /does not match/);
  assert.equal((await ownedTiers(db, "fam-1")).size, 0);
  // Another location's order.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 399, currency: "AUD" } }, order: { ...order, location_id: "OTHER" } });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /location/);
  // The real thing, twice (Square retries): one purchase.
  sq = fakeSquare({ payment: { id: "p1", order_id: "o1", status: "COMPLETED", amount_money: { amount: 399, currency: "AUD" } }, order });
  assert.match(await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl), /purchased/);
  await handleSquareEvent(db, cfg, event("COMPLETED"), sq.fetchImpl);
  assert.equal((await ownedTiers(db, "fam-1")).get("book-a"), "book");
  assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM quest_book_purchases").get().n, 1);
  assert.equal(await cartPaid(db, "fam-1", cartId), true);
});
