import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import { validateBook } from "../src/questBooks.ts";
import { recordQuestBookPurchase } from "../src/questBookPurchases.ts";

let seq = 0;
function harness() {
  const db = makeDb();
  const storage = new Map();
  const metadata = new Map();
  const env = {
    DB: db, JWT_SECRET: "quest-books-test-secret",
    BUCKET: {
      head: async (key) => (storage.has(key) ? { key } : null),
      get: async (key) => (storage.has(key) ? { body: new Response(storage.get(key)).body } : null),
      put: async (key, bytes, options) => { storage.set(key, bytes); metadata.set(key, options?.customMetadata || {}); return { key }; },
      delete: async (keys) => { for (const key of Array.isArray(keys) ? keys : [keys]) { storage.delete(key); metadata.delete(key); } },
      list: async ({ prefix } = {}) => ({ objects: [...storage.keys()].filter((k) => k.startsWith(prefix || "")).map((key) => ({ key, customMetadata: metadata.get(key), uploaded: new Date() })), truncated: false }),
    },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  clearSettingsCache(); clearUsageCache();
  async function req(path, token, method = "GET", body, contentType) {
    const headers = {};
    if (token) headers.authorization = "Bearer " + token;
    if (body !== undefined) headers["content-type"] = contentType || "application/json";
    const payload = body === undefined ? undefined : contentType === "image/png" ? body : typeof body === "string" ? body : JSON.stringify(body);
    return worker.fetch(new Request("http://localhost:8787/api" + path, { method, headers, body: payload }), env, ctx);
  }
  async function parent(plan, jurisdiction = "NSW") {
    const n = ++seq;
    const r = await req("/auth/register", undefined, "POST", { name: "Quest Parent " + n, email: "quest" + n + "@example.test", password: "Test-password-123", jurisdiction });
    assert.equal(r.status, 200);
    const data = await r.json();
    if (plan !== "FREE_PREVIEW") db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan, data.user.family_id);
    return { token: data.token, id: data.user.family_id, userId: data.user.id };
  }
  async function child(p) {
    const n = ++seq;
    const r = await req("/students", p.token, "POST", { name: "Child " + n, username: "questkid" + n, pin: "1234", stage: "S2" });
    assert.equal(r.status, 200);
    return (await r.json()).id;
  }
  function makeOwner(p) {
    db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')").run(crypto.randomUUID(), p.userId);
  }
  return { req, db, parent, child, makeOwner, storage };
}

const lesson = (title) => ({
  title,
  objectives: ["read and write numbers to 10 000"],
  sections: [{ heading: "Place value", body: "Each digit has a value that depends on its place." }],
  quiz: [{ question: "What is the value of the 4 in 4 312?", options: ["4", "40", "400", "4000"], correct_index: 3, explanation: "It is in the thousands place." }],
  outcome_codes: ["AC9M3N01"],
  duration_minutes: 30,
});
const book = (extra = {}) => ({
  id: "y3-mathematics", year: 3, subject: "mathematics", title: "Number Navigators", subtitle: "Year 3 Mathematics", theme: "ocean",
  description: "Place value, addition and more.",
  lessons: [
    { key: "u1-l1", unit: "Unit 1", lesson: lesson("Thousands in our town") },
    { key: "u1-l2", unit: "Unit 1", lesson: lesson("Ordering big numbers") },
  ],
  ...extra,
});

test("Book validation names the bad lesson and rejects duplicate keys", () => {
  assert.equal(validateBook(book()).ok, true);
  const dup = validateBook(book({ lessons: [{ key: "a", lesson: lesson("A") }, { key: "a", lesson: lesson("B") }] }));
  assert.equal(dup.ok, false);
  assert.match(dup.detail, /used twice/);
  const bad = validateBook(book({ lessons: [{ key: "a", lesson: { title: "" } }] }));
  assert.equal(bad.ok, false);
  assert.match(bad.detail, /Lesson 1 \(a\)/);
  assert.equal(validateBook(book({ subject: "music" })).ok, false);
  assert.equal(validateBook(book({ year: 11 })).ok, false);
});

test("Only the platform owner can import, replace, cover and delete books", async () => {
  const h = harness();
  const paid = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req("/quest-books/admin/books", paid.token, "POST", book())).status, 403);
  const owner = await h.parent("FREE_PREVIEW");
  h.makeOwner(owner);
  const ok = await h.req("/quest-books/admin/books", owner.token, "POST", book());
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).lessons, 2);
  assert.equal((await h.req("/quest-books/admin/books", owner.token, "POST", book())).status, 409);
  assert.equal((await h.req("/quest-books/admin/books?replace=1", owner.token, "POST", book({ title: "Number Navigators 2" }))).status, 200);
  const png = new Uint8Array(33);
  for (const [i, b] of [137, 80, 78, 71, 13, 10, 26, 10].entries()) png[i] = b;
  const dv = new DataView(png.buffer); dv.setUint32(16, 1200); dv.setUint32(20, 1600);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics/cover", paid.token, "POST", png, "image/png")).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics/cover", owner.token, "POST", png, "image/png")).status, 200);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics/price", paid.token, "PUT", { price_cents: 1995 })).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics/price", owner.token, "PUT", { price_cents: 5 })).status, 400);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics/price", owner.token, "PUT", { price_cents: 1995 })).status, 200);
  const list = await (await h.req("/quest-books", paid.token)).json();
  assert.equal(list.books.length, 1);
  assert.equal(list.books[0].price_cents, 1995);
  assert.equal(list.books[0].has_cover, true);
  assert.equal(list.books[0].title, "Number Navigators 2");
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics", paid.token, "DELETE")).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/y3-mathematics", owner.token, "DELETE")).status, 200);
  assert.equal((await (await h.req("/quest-books", paid.token)).json()).books.length, 0);
});

test("Free preview sees the outline and can add only the free sample lesson; expired families can't add", async () => {
  const h = harness();
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  await h.req("/quest-books/admin/books", owner.token, "POST", book({ sample_key: "u1-l2", price_cents: 1495 }));
  const free = await h.parent("FREE_PREVIEW");
  const outline = await (await h.req("/quest-books/books/y3-mathematics", free.token)).json();
  assert.equal(outline.access, "sample");
  assert.equal(outline.book.lessons.length, 2);
  assert.equal(outline.book.price_cents, 1495);
  assert.equal(outline.book.lessons[0].sections, undefined, "outline never includes lesson content");
  assert.deepEqual(outline.book.lessons.map((l) => l.sample), [false, true]);
  const added = await (await h.req("/quest-books/books/y3-mathematics/add", free.token, "POST")).json();
  assert.deepEqual([added.added, added.sample_only], [1, true]);
  const rows = h.db.raw.prepare("SELECT title FROM lessons WHERE family_id=?").all(free.id);
  assert.deepEqual(rows.map((r) => r.title), ["Ordering big numbers"]);
  // The sample doesn't use one of the preview's two lessons the parent makes.
  const plan = await (await h.req("/account/plan", free.token)).json();
  assert.equal(plan.usage.manual_lessons, 0);
  const expired = await h.parent("PREVIEW_EXPIRED");
  assert.equal((await h.req("/quest-books/books/y3-mathematics/add", expired.token, "POST")).status, 402);
});

test("A bought book is fully added and stays assignable after the preview ends", async () => {
  const h = harness();
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  await h.req("/quest-books/admin/books", owner.token, "POST", book({ price_cents: 1495 }));
  const fam = await h.parent("FREE_PREVIEW");
  const kid = await h.child(fam);
  // Unpaid or foreign checkouts record nothing.
  assert.equal(await recordQuestBookPurchase(h.db, { object: "checkout.session", mode: "subscription", metadata: { kind: "quest_book" } }, false), null);
  await recordQuestBookPurchase(h.db, { object: "checkout.session", id: "cs_unpaid", mode: "payment", payment_status: "unpaid", amount_total: 1495, metadata: { kind: "quest_book", family_id: fam.id, book_id: "y3-mathematics" } }, false);
  assert.equal((await (await h.req("/quest-books/books/y3-mathematics", fam.token)).json()).owned, false);
  const paid = { object: "checkout.session", id: "cs_paid", mode: "payment", payment_status: "paid", amount_total: 1495, currency: "aud", metadata: { kind: "quest_book", family_id: fam.id, book_id: "y3-mathematics" } };
  await recordQuestBookPurchase(h.db, paid, false);
  await recordQuestBookPurchase(h.db, paid, false); // webhook replay
  const detail = await (await h.req("/quest-books/books/y3-mathematics", fam.token)).json();
  assert.deepEqual([detail.owned, detail.access, detail.can_buy], [true, "full", false]);
  const added = await (await h.req("/quest-books/books/y3-mathematics/add", fam.token, "POST")).json();
  assert.equal(added.added, 2);
  // A lesson the parent made themselves, before the preview ends.
  const own = await h.req("/lessons", fam.token, "POST", { ...lesson("My own lesson"), status: "ready" });
  assert.equal(own.status, 200);
  const ownId = (await own.json()).id;
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(fam.id);
  const ids = h.db.raw.prepare("SELECT id FROM lessons WHERE family_id=? AND title!='My own lesson' ORDER BY title").all(fam.id).map((r) => r.id);
  for (const lessonId of ids) {
    const a = await h.req("/assignments", fam.token, "POST", { student_id: kid, lesson_id: lessonId });
    assert.equal(a.status, 200, "bought book lessons stay assignable");
  }
  assert.equal((await h.req("/assignments", fam.token, "POST", { student_id: kid, lesson_id: ownId })).status, 402);
});

test("Adding a book copies ready lessons once; a grown book adds only the new ones", async () => {
  const h = harness();
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  await h.req("/quest-books/admin/books", owner.token, "POST", book());
  const paid = await h.parent("ACTIVE_MONTHLY", "VIC");
  const first = await (await h.req("/quest-books/books/y3-mathematics/add", paid.token, "POST")).json();
  assert.deepEqual([first.added, first.total], [2, 2]);
  const again = await (await h.req("/quest-books/books/y3-mathematics/add", paid.token, "POST")).json();
  assert.equal(again.added, 0);
  const rows = h.db.raw.prepare("SELECT title, status, learning_area, data FROM lessons WHERE family_id=?").all(paid.id);
  assert.equal(rows.length, 2);
  assert.ok(rows.every((r) => r.status === "ready" && r.learning_area === "Mathematics"));
  const data = JSON.parse(rows[0].data);
  assert.equal(data.quest_book_id, "y3-mathematics");
  assert.equal(data.source, "side_quest_book");

  const grown = book();
  grown.lessons.push({ key: "u2-l1", unit: "Unit 2", lesson: lesson("Adding with regrouping") });
  await h.req("/quest-books/admin/books?replace=1", owner.token, "POST", grown);
  const third = await (await h.req("/quest-books/books/y3-mathematics/add", paid.token, "POST")).json();
  assert.equal(third.added, 1);
  const list = await (await h.req("/quest-books", paid.token)).json();
  assert.equal(list.books[0].added_count, 3);
  const outline = await (await h.req("/quest-books/books/y3-mathematics", paid.token)).json();
  assert.ok(outline.book.lessons.every((l) => l.lesson_id));
});
