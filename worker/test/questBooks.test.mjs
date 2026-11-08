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
  async function child(p) {
    const n = ++seq;
    const r = await req("/students", p.token, "POST", { name: "Child " + n, username: "qbkid" + n, pin: "1234", stage: "S2" });
    assert.equal(r.status, 200);
    return (await r.json()).id;
  }
  return { req, db, parent, child, makeOwner, storage };
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
  assert.equal(validateMeta({ ...details, price_cents: 399, lessons_price_cents: 1500, lesson_price_cents: 100 }).ok, true);
  assert.equal(validateMeta({ ...details, price_cents: 399, lessons_price_cents: 420 }).ok, false, "bundle must be at least 50c more");
  assert.equal(validateMeta({ ...details, lessons_price_cents: 1500 }).ok, false, "bundle needs a book price");
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


const lessonBody = (title) => ({
  title, status: "ready",
  objectives: ["count to 10"],
  sections: [{ heading: "Counting", body: "Count each object once, touching it as you say the number." }],
  quiz: [{ question: "How many?", options: ["3", "4"], correct_index: 0, explanation: "Count them." }],
});
const chapterText = "Numbers to 10. Look, count, recognise and show. Count the dragon eggs one at a time and say each number.";

async function bookWithLessons(h) {
  const { owner, id } = await publishedBook(h, { price_cents: 399, lessons_price_cents: 1500, lesson_price_cents: 100 });
  const ch = await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", { chapters: [
    { title: "Numbers to 10", start: 7, end: 15, text: chapterText }, { title: "Numbers to 20", start: 16, end: 24, text: chapterText + " Twenty." }] });
  assert.equal(ch.status, 200);
  const l1 = (await (await h.req("/lessons", owner.token, "POST", lessonBody("Counting to 10"))).json()).id;
  const l2 = (await (await h.req("/lessons", owner.token, "POST", lessonBody("Counting to 20"))).json()).id;
  const pub = await h.req(`/quest-books/admin/books/${id}/lessons/publish`, owner.token, "POST", { items: [{ chapter_id: "c1", lesson_id: l1 }, { chapter_id: "c2", lesson_id: l2 }] });
  assert.equal(pub.status, 200);
  assert.equal((await pub.json()).published, 2);
  return { owner, id };
}

test("Only the owner manages chapters and publishes lessons", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const member = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req(`/quest-books/admin/books/${id}/chapters`, member.token)).status, 403);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/lessons/publish`, member.token, "POST", { items: [] })).status, 403);
  const bad = await h.req(`/quest-books/admin/books/${id}/chapters`, (await (async () => { const o = await h.parent("FREE_PREVIEW"); h.makeOwner(o); return o; })()).token, "PUT", { chapters: [{ title: "Empty", start: 1, end: 1, text: "" }] });
  assert.equal(bad.status, 400, "chapters need readable text");
});

test("Members add every chapter lesson once; free and book-only families can't", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const member = await h.parent("ACTIVE_ANNUAL");
  const detail = await (await h.req(`/quest-books/books/${id}`, member.token)).json();
  assert.equal(detail.lessons.length, 2);
  assert.ok(detail.lessons.every((l) => l.unlocked && !l.lesson_id));
  assert.equal(detail.book.can_add_lessons, true);
  const first = await (await h.req(`/quest-books/books/${id}/lessons/add`, member.token, "POST", {})).json();
  assert.equal(first.added, 2);
  assert.equal((await (await h.req(`/quest-books/books/${id}/lessons/add`, member.token, "POST", {})).json()).added, 0);
  const rows = h.db.raw.prepare("SELECT title, status, data FROM lessons WHERE family_id=?").all(member.id);
  assert.equal(rows.length, 2);
  assert.ok(rows.every((r) => r.status === "ready" && JSON.parse(r.data).source === "side_quest_book"));
  const free = await h.parent("FREE_PREVIEW");
  const freeDetail = await (await h.req(`/quest-books/books/${id}`, free.token)).json();
  assert.ok(freeDetail.lessons.every((l) => !l.unlocked));
  assert.equal(freeDetail.book.plus_price_cents, 1500);
  assert.equal((await h.req(`/quest-books/books/${id}/lessons/add`, free.token, "POST", {})).status, 402);
});

test("Bundle, upgrade and single-lesson purchases unlock the right lessons, which stay assignable after the preview", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const fam = await h.parent("FREE_PREVIEW");
  const kid = await h.child(fam);
  const paid = (sid, tier, extra = {}) => ({ object: "checkout.session", id: sid, mode: "payment", payment_status: "paid", amount_total: 100, currency: "aud", metadata: { kind: "quest_book", family_id: fam.id, book_id: id, tier, ...extra } });
  // One lesson on its own.
  await recordQuestBookPurchase(h.db, paid("cs_l1", "lesson", { lesson_key: "c2" }), false);
  let d = await (await h.req(`/quest-books/books/${id}`, fam.token)).json();
  assert.deepEqual(d.lessons.map((l) => l.unlocked), [false, true]);
  assert.equal(d.book.can_download, false, "a single lesson doesn't include the book");
  const one = await (await h.req(`/quest-books/books/${id}/lessons/add`, fam.token, "POST", {})).json();
  assert.equal(one.added, 1);
  // Book only, then upgrade to the bundle for the difference.
  await recordQuestBookPurchase(h.db, paid("cs_b", "book"), false);
  d = await (await h.req(`/quest-books/books/${id}`, fam.token)).json();
  assert.deepEqual([d.book.can_download, d.book.can_add_lessons, d.book.plus_price_cents], [true, false, 1101]);
  await recordQuestBookPurchase(h.db, paid("cs_p", "plus"), false);
  await recordQuestBookPurchase(h.db, paid("cs_p", "plus"), false); // replay
  d = await (await h.req(`/quest-books/books/${id}`, fam.token)).json();
  assert.deepEqual([d.book.owned_tier, d.book.can_add_lessons, d.book.can_buy_plus], ["plus", true, false]);
  assert.equal((await (await h.req(`/quest-books/books/${id}/lessons/add`, fam.token, "POST", {})).json()).added, 1);
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(fam.id);
  const ids = h.db.raw.prepare("SELECT id FROM lessons WHERE family_id=?").all(fam.id).map((r) => r.id);
  assert.equal(ids.length, 2);
  for (const lessonId of ids) assert.equal((await h.req("/assignments", fam.token, "POST", { student_id: kid, lesson_id: lessonId })).status, 200);
});
