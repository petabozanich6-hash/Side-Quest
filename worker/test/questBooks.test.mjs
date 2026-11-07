import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import { validateMeta, slugify } from "../src/questBooks.ts";
import { recordQuestBookPurchase } from "../src/questBookPurchases.ts";

let seq = 0;
function harness() {
  const db = makeDb();
  const storage = new Map();
  const toBytes = async (v) => (v instanceof ArrayBuffer ? new Uint8Array(v) : typeof v === "string" ? new TextEncoder().encode(v) : new Uint8Array(await new Response(v).arrayBuffer()));
  const env = {
    DB: db, JWT_SECRET: "quest-books-test-secret",
    BUCKET: {
      head: async (key) => (storage.has(key) ? { key, size: storage.get(key).length } : null),
      get: async (key, opts) => {
        if (!storage.has(key)) return null;
        let b = storage.get(key);
        if (opts?.range) b = b.slice(opts.range.offset, opts.range.offset + opts.range.length);
        return { body: new Response(b).body, size: storage.get(key).length };
      },
      put: async (key, value) => { storage.set(key, await toBytes(value)); return { key }; },
      delete: async (keys) => { for (const key of Array.isArray(keys) ? keys : [keys]) storage.delete(key); },
      list: async ({ prefix } = {}) => ({ objects: [...storage.keys()].filter((k) => k.startsWith(prefix || "")).map((key) => ({ key, size: storage.get(key).length, uploaded: new Date() })), truncated: false }),
    },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  clearSettingsCache(); clearUsageCache();
  async function req(path, token, method = "GET", body, contentType) {
    const headers = {};
    if (token) headers.authorization = "Bearer " + token;
    if (body !== undefined) headers["content-type"] = contentType || "application/json";
    const payload = body === undefined ? undefined : contentType ? body : JSON.stringify(body);
    return worker.fetch(new Request("http://localhost:8787/api" + path, { method, headers, body: payload }), env, ctx);
  }
  async function parent(plan) {
    const n = ++seq;
    const r = await req("/auth/register", undefined, "POST", { name: "Quest Parent " + n, email: "quest" + n + "@example.test", password: "Test-password-123", jurisdiction: "NSW" });
    assert.equal(r.status, 200);
    const data = await r.json();
    if (plan !== "FREE_PREVIEW") db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan, data.user.family_id);
    return { token: data.token, id: data.user.family_id, userId: data.user.id };
  }
  function makeOwner(p) {
    db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(), p.userId);
  }
  return { req, db, parent, makeOwner, storage };
}

const pdf = (text) => new TextEncoder().encode("%PDF-1.7\n" + text);
const details = { title: "Number Navigators", subtitle: "Year 3 Mathematics", year: 3, subject: "mathematics", description: "Place value and more.", pages: 120 };

async function publishedBook(h, extra = {}) {
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  const r = await h.req("/quest-books/admin/books", owner.token, "POST", { ...details, ...extra });
  assert.equal(r.status, 200);
  const id = (await r.json()).book.id;
  assert.equal((await h.req(`/quest-books/admin/books/${id}/files/book`, owner.token, "PUT", pdf("FULL BOOK"), "application/pdf")).status, 200);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/files/sample`, owner.token, "PUT", pdf("SAMPLE"), "application/pdf")).status, 200);
  return { owner, id };
}

test("Book details validate and get an id from the title", () => {
  assert.equal(slugify("Number Navigators: Year 3!"), "number-navigators-year-3");
  assert.equal(validateMeta(details).ok, true);
  assert.equal(validateMeta({ ...details, subject: "music" }).ok, false);
  assert.equal(validateMeta({ ...details, year: 11 }).ok, false);
  assert.equal(validateMeta({ ...details, price_cents: 50 }).ok, false);
  assert.equal(validateMeta({ ...details, title: "" }).ok, false);
});

test("Only the owner manages books; drafts without a PDF are hidden from families", async () => {
  const h = harness();
  const member = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req("/quest-books/admin/books", member.token, "POST", details)).status, 403);
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  const created = await (await h.req("/quest-books/admin/books", owner.token, "POST", details)).json();
  assert.equal(created.book.id, "number-navigators");
  assert.equal((await h.req("/quest-books/admin/books", owner.token, "POST", details)).status, 409, "same title can't silently overwrite");
  assert.equal((await (await h.req("/quest-books", member.token)).json()).books.length, 0, "draft hidden");
  assert.equal((await (await h.req("/quest-books", owner.token)).json()).books.length, 1, "owner sees draft");
  assert.equal((await h.req("/quest-books/admin/books/number-navigators/files/book", member.token, "PUT", pdf("x"), "application/pdf")).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators/files/book", owner.token, "PUT", new TextEncoder().encode("not a pdf"), "application/pdf")).status, 400);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators/files/book", owner.token, "PUT", pdf("FULL"), "application/pdf")).status, 200);
  const png = new Uint8Array(33);
  for (const [i, b] of [137, 80, 78, 71, 13, 10, 26, 10].entries()) png[i] = b;
  const dv = new DataView(png.buffer); dv.setUint32(16, 1200); dv.setUint32(20, 1600);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators/files/cover", owner.token, "PUT", png, "image/png")).status, 200);
  // Editing details (with the id) updates the price.
  assert.equal((await h.req("/quest-books/admin/books", owner.token, "POST", { ...details, id: "number-navigators", price_cents: 1995 })).status, 200);
  const list = await (await h.req("/quest-books", member.token)).json();
  assert.equal(list.books.length, 1);
  assert.deepEqual([list.books[0].has_cover, list.books[0].price_cents, list.books[0].can_download], [true, 1995, true]);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators", member.token, "DELETE")).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators", owner.token, "DELETE")).status, 200);
  assert.equal(h.storage.size, 0);
});

test("Members download the full book; free preview gets the sample only", async () => {
  const h = harness();
  const { id } = await publishedBook(h, { price_cents: 1495 });
  const member = await h.parent("ACTIVE_ANNUAL");
  const full = await h.req(`/quest-books/books/${id}/download`, member.token);
  assert.equal(full.status, 200);
  assert.equal(full.headers.get("content-type"), "application/pdf");
  assert.match(full.headers.get("content-disposition"), /attachment/);
  assert.match(await full.text(), /FULL BOOK/);
  const free = await h.parent("FREE_PREVIEW");
  const book = (await (await h.req(`/quest-books/books/${id}`, free.token)).json()).book;
  assert.deepEqual([book.can_download, book.has_sample], [false, true]);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, free.token)).status, 402);
  const sample = await h.req(`/quest-books/books/${id}/sample`, free.token);
  assert.equal(sample.status, 200);
  assert.match(await sample.text(), /SAMPLE/);
  assert.equal((await h.req(`/quest-books/books/${id}/download`)).status, 401);
});

test("A bought book can be downloaded for good, even after the preview ends", async () => {
  const h = harness();
  const { id } = await publishedBook(h, { price_cents: 1495 });
  const fam = await h.parent("FREE_PREVIEW");
  const session = (paid) => ({ object: "checkout.session", id: "cs_" + paid, mode: "payment", payment_status: paid, amount_total: 1495, currency: "aud", metadata: { kind: "quest_book", family_id: fam.id, book_id: id } });
  assert.equal(await recordQuestBookPurchase(h.db, { object: "checkout.session", mode: "subscription", metadata: { kind: "quest_book" } }, false), null);
  await recordQuestBookPurchase(h.db, session("unpaid"), false);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, fam.token)).status, 402);
  await recordQuestBookPurchase(h.db, session("paid"), false);
  await recordQuestBookPurchase(h.db, session("paid"), false); // webhook replay
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(fam.id);
  const book = (await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book;
  assert.deepEqual([book.owned, book.can_download, book.can_buy], [true, true, false]);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, fam.token)).status, 200);
});
