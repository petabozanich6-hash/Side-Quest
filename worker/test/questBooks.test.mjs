import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import { validateMeta, validateChapters, chapterRevision, companionLessonIssues, retireSupersededBookDrafts, slugify, packPrice, plusPriceFor } from "../src/questBooks.ts";
import { recordQuestBookPurchase, saveCart } from "../src/questBookPurchases.ts";
import { createShopOrder, recordPaidShopOrder } from "../src/shopOrders.ts";
import { validatePlanRequest, normaliseSubsections, suggestBookSubsections } from "../src/questBookSubsections.ts";

let seq = 0;
function harness() {
  const db = makeDb();
  const storage = new Map();
  const toBytes = async (v) => (v instanceof ArrayBuffer ? new Uint8Array(v) : typeof v === "string" ? new TextEncoder().encode(v) : new Uint8Array(await new Response(v).arrayBuffer()));
  const env = {
    DB: db, JWT_SECRET: "quest-books-test-secret", STRIPE_SECRET_KEY: "sk_test_quest_books",
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
  async function parent(plan, jurisdiction = "NSW") {
    const n = ++seq;
    const r = await req("/auth/register", undefined, "POST", { name: "Quest Parent " + n, email: "quest" + n + "@example.test", password: "Test-password-123", jurisdiction });
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
  return { req, db, env, parent, child, makeOwner, storage };
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
  assert.deepEqual([list.books[0].has_cover, list.books[0].price_cents, list.books[0].can_download, list.books[0].included], [true, 1995, false, true]);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators", member.token, "DELETE")).status, 403);
  assert.equal((await h.req("/quest-books/admin/books/number-navigators", owner.token, "DELETE")).status, 200);
  assert.equal(h.storage.size, 0);
});

test("Members read and print year-level books in Side-Quest; only buyers get the PDF; free preview gets the sample", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h, { price_cents: 1495 });
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 9, 9]);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/read/1`, owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/read/2`, owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  const member = await h.parent("ACTIVE_ANNUAL");
  assert.equal((await h.req(`/quest-books/admin/books/${id}/read/3`, member.token, "PUT", jpeg, "image/jpeg")).status, 403);
  const mb = (await (await h.req(`/quest-books/books/${id}`, member.token)).json()).book;
  assert.deepEqual([mb.included, mb.can_read, mb.read_pages, mb.can_download, mb.can_buy], [true, true, 2, false, true]);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, member.token)).status, 402, "members don't get the PDF");
  const page = await h.req(`/quest-books/books/${id}/read/2`, member.token);
  assert.equal(page.status, 200);
  assert.equal(page.headers.get("content-type"), "image/jpeg");
  // Owner gets the PDF.
  const full = await h.req(`/quest-books/books/${id}/download`, owner.token);
  assert.equal(full.status, 200);
  assert.match(full.headers.get("content-disposition"), /attachment/);
  assert.match(await full.text(), /FULL BOOK/);
  const free = await h.parent("FREE_PREVIEW");
  const book = (await (await h.req(`/quest-books/books/${id}`, free.token)).json()).book;
  assert.deepEqual([book.can_download, book.can_read, book.has_sample], [false, false, true]);
  assert.equal((await h.req(`/quest-books/books/${id}/read/1`, free.token)).status, 402);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, free.token)).status, 402);
  const sample = await h.req(`/quest-books/books/${id}/sample`, free.token);
  assert.equal(sample.status, 200);
  assert.match(await sample.text(), /SAMPLE/);
  assert.equal((await h.req(`/quest-books/books/${id}/download`)).status, 401);
  // When membership ends, reading stops.
  h.db.raw.prepare("UPDATE families SET plan='CANCELLED' WHERE id=?").run(member.id);
  assert.equal((await h.req(`/quest-books/books/${id}/read/1`, member.token)).status, 402);
  // Removing the book removes its reader pages too.
  assert.equal((await h.req(`/quest-books/admin/books/${id}`, owner.token, "DELETE")).status, 200);
  assert.ok(![...h.storage.keys()].some((k) => k.includes("/read/")));
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

test("Any family can peek at a published lesson, but the preview leaves out the quiz content", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const free = await h.parent("FREE_PREVIEW");
  const r = await h.req(`/quest-books/books/${id}/lessons/c1/preview`, free.token);
  assert.equal(r.status, 200);
  const p = await r.json();
  assert.equal(p.title, "Counting to 10");
  assert.deepEqual(p.objectives, ["count to 10"]);
  assert.deepEqual(p.sections, ["Counting"]);
  assert.equal(p.includes.quiz, 1);
  assert.ok(!JSON.stringify(p).includes("How many?"), "quiz questions stay hidden");
  assert.equal((await h.req(`/quest-books/books/${id}/lessons/nope/preview`, free.token)).status, 404);
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

test("Specialist books: NAPLAN and HSC collections with topics, Years 11-12 and all ages", async () => {
  const naplan = validateMeta({ collection: "naplan", title: "Year 9 Numeracy Practice", year: 9, subject: "mathematics", topic: "Numeracy" });
  assert.equal(naplan.ok, true);
  assert.deepEqual([naplan.meta.collection, naplan.meta.topic], ["naplan", "Numeracy"]);
  assert.equal(validateMeta({ collection: "hsc", title: "Maths Advanced", year: 12, topic: "Mathematics Advanced" }).meta.year, 12);
  assert.equal(validateMeta({ collection: "study-skills", title: "Exam technique", year: "all", topic: "Exam technique" }).meta.year, null);
  assert.equal(validateMeta({ collection: "core", title: "x", year: 12, subject: "mathematics" }).ok, false, "core books stop at Year 10");
  assert.equal(validateMeta({ collection: "hsc", title: "x", year: 12 }).ok, false, "a specialist book needs a topic");
  assert.equal(validateMeta({ ...details }).meta.collection, "core", "old books default to the year-level shelf");

  const h = harness();
  const owner = await h.parent("FREE_PREVIEW"); h.makeOwner(owner);
  const r = await (await h.req("/quest-books/admin/books", owner.token, "POST", { collection: "hsc", title: "HSC English Standard", year: 12, topic: "English Standard", price_cents: 999 })).json();
  await h.req(`/quest-books/admin/books/${r.book.id}/files/book`, owner.token, "PUT", pdf("HSC"), "application/pdf");
  const member = await h.parent("ACTIVE_MONTHLY");
  const list = await (await h.req("/quest-books", member.token)).json();
  assert.ok(list.collections.some((c) => c.id === "naplan") && list.collections.some((c) => c.id === "hsc"));
  const b = list.books.find((x) => x.id === r.book.id);
  assert.deepEqual([b.collection, b.year_label, b.subject_label], ["hsc", "Year 12", "English Standard"]);
  // Specialist books aren't part of membership: members buy them like everyone else.
  assert.deepEqual([b.included, b.can_read, b.can_download, b.can_buy], [false, false, false, true]);
});


test("Pack pricing: each extra pack is 10% cheaper again, capped at 50% off; book owners pay the difference", async () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map((n) => packPrice(999, n)), [999, 899, 799, 699, 599, 499, 499]);
  const meta = { price_cents: 399, lessons_price_cents: 999 };
  assert.equal(plusPriceFor(meta, undefined, 0), 999);
  assert.equal(plusPriceFor(meta, "book", 0), 600);
  assert.equal(plusPriceFor(meta, "book", 5), 100);
  const h = harness();
  const { id } = await bookWithLessons(h);
  const fam = await h.parent("FREE_PREVIEW");
  let b = (await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book;
  assert.deepEqual([b.plus_price_cents, b.pack_discount_pct], [1500, 0]);
  for (const other of ["other-pack-a", "other-pack-b"]) {
    await recordQuestBookPurchase(h.db, { object: "checkout.session", id: "cs_" + other, mode: "payment", payment_status: "paid", amount_total: 999, currency: "aud", metadata: { kind: "quest_book", family_id: fam.id, book_id: other, tier: "plus" } }, false);
  }
  b = (await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book;
  assert.deepEqual([b.plus_price_cents, b.plus_full_price_cents, b.pack_discount_pct], [1200, 1500, 20]);
});

test("Look-inside pages: the owner uploads watermarked JPEGs, any parent can view them", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h);
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look/1`, owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look/2`, owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look/3`, owner.token, "PUT", pdf("nope"), "image/jpeg")).status, 400);
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look/9`, owner.token, "PUT", jpeg, "image/jpeg")).status, 400);
  const fam = await h.parent("FREE_PREVIEW");
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look/1`, fam.token, "PUT", jpeg, "image/jpeg")).status, 403);
  assert.equal((await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book.look_pages, 2);
  const page = await h.req(`/quest-books/books/${id}/look/1`, fam.token);
  assert.equal(page.status, 200);
  assert.equal(page.headers.get("content-type"), "image/jpeg");
  assert.equal((await h.req(`/quest-books/admin/books/${id}/look`, owner.token, "DELETE")).status, 200);
  assert.equal((await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book.look_pages, 0);
});

test("Published lessons carry codes for every state's curriculum; each family gets its own state's codes", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h, { price_cents: 399, lessons_price_cents: 999, lesson_price_cents: 100 });
  await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", { chapters: [{ title: "Place value", start: 7, end: 15, text: chapterText }] });
  const body = { ...lessonBody("Place value to 10 000"), learning_area: "Mathematics", stage: "S2", objectives: ["recognise, represent and order numbers to at least tens of thousands using place value"], key_words: [{ word: "place value" }, { word: "thousands" }] };
  const lid = (await (await h.req("/lessons", owner.token, "POST", body)).json()).id;
  assert.equal((await h.req(`/quest-books/admin/books/${id}/lessons/publish`, owner.token, "POST", { items: [{ chapter_id: "c1", lesson_id: lid }] })).status, 200);
  const stored = JSON.parse(new TextDecoder().decode(h.storage.get(`quest-books/v1/${id}/lessons.json`)));
  const codes = stored.lessons[0].codes;
  assert.ok(codes && Array.isArray(codes.NSW) && Array.isArray(codes.AC9) && Array.isArray(codes.WA), "codes for each framework");
  assert.ok(codes.AC9.every((c) => c.startsWith("AC9")));
  const qld = await h.parent("ACTIVE_MONTHLY");
  h.db.raw.prepare("UPDATE families SET jurisdiction='QLD' WHERE id=?").run(qld.id);
  assert.equal((await (await h.req(`/quest-books/books/${id}/lessons/add`, qld.token, "POST", {})).json()).added, 1);
  const row = h.db.raw.prepare("SELECT data FROM lessons WHERE family_id=?").get(qld.id);
  const got = JSON.parse(row.data).outcome_codes;
  assert.deepEqual(got, codes.AC9);
  assert.ok(got.every((c) => c.startsWith("AC9")), "no NSW codes for a QLD family");
});


test("Companion-session source and depth checks preserve exact workbook references", () => {
  const base = { id: "c1", title: "Build two-digit numbers", start: 12, end: 14,
    skill_goal: "Partition numbers into tens and ones", exercise_ref: "Page 14, questions 1–7",
    text: "Teach one focused skill, then explain tens and ones with blocks and practise reading place value." };
  const one = validateChapters({ chapters: [base] });
  assert.equal(one.ok, true);
  assert.equal(one.chapters[0].exercise_ref, "Page 14, questions 1–7");
  const fixedId = "s-abcdef0123456789abcd";
  const split = validateChapters({ chapters: [
    { ...base, id: fixedId, end: 13 },
    { ...base, id: "s-1234567890abcdef1234", title: "Regrouping", start: 14, end: 14 },
  ] });
  assert.equal(split.ok, true);
  assert.deepEqual(split.chapters.map((part) => part.id), [fixedId, "s-1234567890abcdef1234"],
    "splitting a chapter must preserve the assigned purchase keys");
  assert.equal(validateChapters({ chapters: [{ ...base, id: fixedId }, { ...base, id: fixedId }] }).ok, false,
    "duplicate paid lesson keys must be rejected");
  const revision = chapterRevision(one.chapters[0]);
  assert.equal(revision, chapterRevision(one.chapters[0]));
  assert.notEqual(revision, chapterRevision({ ...one.chapters[0], exercise_ref: "Page 15, questions 2–7" }));
  assert.notEqual(revision, chapterRevision({ ...one.chapters[0], text: base.text + " New example." }));
  assert.ok(companionLessonIssues(lessonBody("Too short")).length > 0);
  const full = {
    objectives: ["I can represent a number with blocks", "I can explain tens and ones"],
    sections: [{ heading: "Tens", body: "Each ten is ten ones." }, { heading: "Ones", body: "Extra ones stay separate." }],
    worked_examples: [
      { problem: "23", steps: ["Build two tens", "Add three ones"], answer: "2 tens and 3 ones" },
      { problem: "41", steps: ["Build four tens", "Add one one"], answer: "4 tens and 1 one" },
    ],
    guided_practice: Array.from({ length: 4 }, (_, i) => ({ prompt: "Build " + (20 + i), answer: "2 tens, " + i + " ones" })),
    activities: ["Place-value models", "Place-value words"].map((title) => ({
      title, instructions: "Complete these problems",
      tasks: Array.from({ length: 3 }, (_, i) => ({ prompt: "Model " + (30 + i), answer: "3 tens, " + i + " ones" })),
    })),
    questions: Array.from({ length: 3 }, (_, i) => ({ prompt: "Explain " + (40 + i), answer_key: "4 tens, " + i + " ones" })),
    quiz: Array.from({ length: 3 }, () => ({ question: "How many tens?", options: ["2", "3", "4"], correct_index: 2 })),
    parent_script: "Show a concrete model, then ask the student to explain the tens and ones.",
    answer_key: "Guided answers, activities, questions and quiz answers above.",
  };
  assert.deepEqual(companionLessonIssues(full), []);
});

test("Book-generated lessons require owner approval, complete teaching and fresh source before publication", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h, { price_cents: 399, lessons_price_cents: 999, lesson_price_cents: 100 });
  const raw = { title: "Place value", start: 7, end: 8, text: chapterText,
    skill_goal: "Represent tens and ones", exercise_ref: "Page 8 questions 1–5" };
  assert.equal((await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", { chapters: [raw] })).status, 200);
  const revision = chapterRevision({ ...raw, id: "c1" });
  const lid = (await (await h.req("/lessons", owner.token, "POST", lessonBody("Place value"))).json()).id;
  const old = JSON.parse(h.db.raw.prepare("SELECT data FROM lessons WHERE id=?").get(lid).data);
  const tagged = { ...old, quest_book_id: id, quest_chapter_id: "c1", quest_source_revision: revision };
  h.db.raw.prepare("UPDATE lessons SET data=?, status='ready' WHERE id=?").run(JSON.stringify(tagged), lid);
  const initialQueue = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft;
  assert.ok(Array.isArray(initialQueue.quality_issues), "owner review queue reports saved lesson quality gaps");
  assert.ok(initialQueue.quality_issues.includes("two complete teaching explanations"),
    "missing teaching sections appear in the queue before approval");
  const url = `/quest-books/admin/books/${id}/lessons/publish`;
  const item = { chapter_id: "c1", lesson_id: lid, reviewed: true };
  assert.equal((await h.req(url, owner.token, "POST", { items: [{ ...item, reviewed: false }] })).status, 409);
  assert.equal((await h.req(url, owner.token, "POST", { items: [item] })).status, 409, "thin lessons cannot be published");
  const thorough = {
    ...tagged, objectives: ["I can use tens", "I can use ones"],
    sections: [{ heading: "Tens", body: "Ten ones make a ten" }, { heading: "Ones", body: "One ones remain as units" }],
    worked_examples: [1, 2].map((i) => ({ problem: String(20 + i), steps: ["Build tens", "Add ones"], answer: "Two tens and extra ones" })),
    guided_practice: Array.from({ length: 4 }, (_, i) => ({ prompt: "Model " + i, answer: "Worked answer " + i })),
    activities: [1, 2].map((a) => ({ title: "Activity " + a, tasks: [1, 2, 3].map((i) => ({ prompt: "Prompt " + i, answer: "Answer " + i })) })),
    questions: [1, 2, 3].map((i) => ({ prompt: "Question " + i, answer_key: "Answer " + i })),
    quiz: [1, 2, 3].map((i) => ({ question: "Choose one", options: ["a", "b", "c"], correct_index: 1 })),
    parent_script: "Guide, model and review the student's response.", answer_key: "The complete answers are stored per task.",
  };
  h.db.raw.prepare("UPDATE lessons SET data=? WHERE id=?").run(JSON.stringify(thorough), lid);
  const completeQueue = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft;
  assert.deepEqual(completeQueue.quality_issues, [], "quality gaps disappear after content is repaired and saved");
  const reviewUrl = `/quest-books/admin/books/${id}/chapters/c1/review`;
  const saveUrl = `/quest-books/admin/books/${id}/chapters/c1/save-to-plan`;
  const version = (await (await h.req(`/lessons/${lid}`, owner.token)).json()).version;
  const nonOwner = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req(saveUrl, nonOwner.token, "POST", { lesson_id: lid, expected_version: version })).status, 403);
  assert.equal((await h.req(saveUrl, owner.token, "POST", { lesson_id: lid, expected_version: version - 1 })).status, 409,
    "outdated review screens cannot save to the book plan");
  assert.equal((await h.req(saveUrl, owner.token, "POST", { lesson_id: lid, expected_version: version })).status, 200);
  const linked = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft;
  assert.equal(linked.saved_to_plan, true);
  assert.equal(linked.version, version);
  assert.equal((await h.req(reviewUrl, nonOwner.token, "POST", { lesson_id: lid, approved: true })).status, 403, "family members cannot approve commercial lessons");
  assert.equal((await h.req(url, owner.token, "POST", { items: [item] })).status, 409, "browser checkbox alone cannot approve a book lesson");
  // Simulate an editor that saved the lesson but did not separately use Save to Book Plan.
  // Approving it should atomically record BOTH the review and the plan version.
  const unlinkedData = JSON.parse(h.db.raw.prepare("SELECT data FROM lessons WHERE id=?").get(lid).data);
  delete unlinkedData.book_plan_saved_version;
  delete unlinkedData.book_plan_saved_at;
  delete unlinkedData.book_plan_saved_by;
  h.db.raw.prepare("UPDATE lessons SET data=?, status='draft' WHERE id=?").run(JSON.stringify(unlinkedData), lid);
  assert.equal((await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft.saved_to_plan, false);
  assert.equal((await h.req(reviewUrl, owner.token, "POST", { lesson_id: lid, approved: true, expected_version: version })).status, 409,
    "a draft cannot be approved without explicit owner completion confirmation");
  assert.equal((await h.req(reviewUrl, owner.token, "POST", { lesson_id: lid, approved: true, complete_review: true, expected_version: version - 1 })).status, 409,
    "a stale review screen must never approve a newer version");
  assert.equal((await h.req(reviewUrl, owner.token, "POST", { lesson_id: lid, approved: true, complete_review: true, expected_version: version })).status, 200);
  let savedReview = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft;
  assert.equal(savedReview.status, "ready", "explicitly confirming an already-checked draft promotes it to Ready");
  assert.equal(savedReview.reviewed, true, "approval survives page reload");
  assert.equal(savedReview.saved_to_plan, true, "approval saves its lesson version to the book plan atomically");
  assert.equal((await h.req(reviewUrl, owner.token, "POST", { lesson_id: lid, approved: true, expected_version: version })).status, 200,
    "the original ready-lesson approval workflow remains supported");
  assert.ok(savedReview.reviewed_at, "review timestamp is stored");
  assert.equal((await h.req(url, owner.token, "POST", { items: [item] })).status, 200);
  const removal = await h.req(url, owner.token, "POST", { items: [] });
  assert.equal(removal.status, 409, "publishing an incomplete selection must not unpublish previously sold lessons");
  assert.equal((await removal.json()).code, "PUBLISHED_LESSON_KEY_REMOVED");
  const edited = await h.req(`/lessons/${lid}`, owner.token, "PUT", lessonBody("Place value revised"));
  assert.equal(edited.status, 200);
  savedReview = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft;
  assert.equal(savedReview.reviewed, false, "changing the lesson invalidates its previous review");
  assert.equal(savedReview.saved_to_plan, false, "new edits must be explicitly saved into the book plan");
  assert.equal((await h.req(saveUrl, owner.token, "POST", { lesson_id: lid, expected_version: Number(savedReview.version) })).status, 200);
  assert.equal((await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters[0].draft.saved_to_plan, true);
  assert.equal((await h.req(url, owner.token, "POST", { items: [item] })).status, 409, "unreviewed edits must not silently republish");
  const missingPaidKey = await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", {
    chapters: [{ ...raw, id: "s-1234567890abcdef1234" }],
  });
  assert.equal(missingPaidKey.status, 409, "a published lesson key cannot disappear during a rescan");
  assert.equal((await missingPaidKey.json()).code, "PUBLISHED_LESSON_KEY_REMOVED");
  const changed = { ...raw, exercise_ref: "Page 8 questions 6–9" };
  assert.equal((await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", { chapters: [changed] })).status, 200);
  const info = (await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters;
  assert.equal(info[0].draft.stale, true);
  assert.equal((await h.req(url, owner.token, "POST", { items: [item] })).status, 409);
});

test("Automatic chapter planner returns ordered, skill-level, source-bounded subsections", async () => {
  const pages = Array.from({ length: 9 }, (_, i) => ({ page: i + 11, text:
    `Page ${i + 11}. Model and practise the same skill using counters and worked examples. `.repeat(8) }));
  const cleaned = validatePlanRequest({ chapter_title: "Place value", pages });
  assert.equal(cleaned.ok, true);
  assert.equal(validatePlanRequest({ chapter_title: "Place value", pages: [pages[0], pages[2]] }).ok, false,
    "missing source pages are not silently skipped");
  const ai = { run: async () => ({ response: JSON.stringify({ subsections: [
    { start_page: 11, title: "Represent numbers", skill_goal: "Show numbers with tens and ones", exercise_ref: "p. 11 Q1–3" },
    { start_page: 15, title: "Partition numbers", skill_goal: "Partition numbers into tens and ones", exercise_ref: "p. 15 Q1–5" },
  ] }) }) };
  const sections = await suggestBookSubsections(ai, "Place value", pages, "Year 2", "Mathematics", "test");
  assert.deepEqual(sections.map((s) => [s.start, s.end]), [[11, 14], [15, 19]]);
  assert.deepEqual(sections.map((s) => s.title), ["Represent numbers", "Partition numbers"]);
  assert.equal(sections[0].exercise_ref, "p. 11 Q1–3");
  assert.throws(() => normaliseSubsections("Place value", pages, [{ start_page: 9000, title: "Fake" }]), /usable subsection boundaries/);
});

test("A single teaching skill spanning twelve PDF pages is ONE subsection, not six lessons", () => {
  const pages = Array.from({ length: 12 }, (_, i) => ({ page: i + 1, text: "Count and write. ".repeat(220) }));
  const out = normaliseSubsections("Counting", pages, [{ start_page: 1, title: "Count and write", skill_goal: "Fluent counting" }]);
  assert.deepEqual(out.map((s) => [s.start, s.end]), [[1, 12]]);
  const single = normaliseSubsections("Counting", [{ page: 1, text: "x".repeat(8001) }],
    [{ start_page: 1, title: "Counting" }]);
  assert.deepEqual(single.map((s) => [s.start, s.end]), [[1, 1]], "source length does not invent more lessons");
});

test("Overzealous AI cannot create a 45-minute lesson for each workbook page", () => {
  const pages = Array.from({ length: 12 }, (_, i) => ({ page: i + 21, text: "Instructions and practice for this topic ".repeat(15) }));
  const proposed = pages.map((page, i) => ({
    start_page: page.page, title: `Page topic ${i + 1}`, skill_goal: `Distinct page skill ${i + 1}`,
  }));
  const sections = normaliseSubsections("Place value", pages, proposed);
  assert.ok(sections.length <= 4, "one suggestion per page must be condensed to teaching sequences");
  assert.ok(sections.every((part) => part.end - part.start + 1 >= 3));
  assert.equal(sections[0].start, 21);
  assert.equal(sections.at(-1).end, 32);
  for (let i = 1; i < sections.length; i++) assert.equal(sections[i].start, sections[i-1].end + 1);
});

test("Short two- or three-page chapters are not split into one lesson per page", () => {
  for (const count of [2, 3]) {
    const pages = Array.from({ length: count }, (_, i) => ({ page: i + 1, text: "Teacher explanation and practice examples." }));
    const tooMany = pages.map((p, i) => ({ start_page: p.page, title: "Mini topic " + i,
      skill_goal: "Skill number " + i }));
    const out = normaliseSubsections("Chapter", pages, tooMany);
    assert.deepEqual(out.map((x) => [x.start, x.end]), [[1, count]]);
  }
});

test("Owner-only chapter planning does not save lessons or chapter data", async () => {
  const h = harness();
  const { id, owner } = await publishedBook(h, { price_cents: 399 });
  const user = await h.parent("ACTIVE_MONTHLY");
  const url = `/quest-books/admin/books/${id}/chapters/plan`;
  const input = { chapter_title: "Place value", pages: [
    { page: 4, text: chapterText.repeat(3) }, { page: 5, text: chapterText.repeat(3) },
  ] };
  assert.equal((await h.req(url, user.token, "POST", input)).status, 403);
  const noAi = await h.req(url, owner.token, "POST", input);
  assert.equal(noAi.status, 503);
  const storageKeys = [...h.storage.keys()];
  assert.equal(storageKeys.some((key) => key.endsWith("/chapters.json")), false);
});

test("Owner can reset an unpublished collection without re-uploading the PDF", async () => {
  const h = harness();
  const { owner, id } = await bookWithLessons(h);
  // The owner works on an internal plan (a free preview family can only hand-make two lessons).
  h.db.raw.prepare("UPDATE families SET plan='INTERNAL' WHERE id=?").run(owner.id);
  const lessonId = (await (await h.req("/lessons", owner.token, "POST", lessonBody("Outdated AI draft"))).json()).id;
  const row = h.db.raw.prepare("SELECT data FROM lessons WHERE id=?").get(lessonId);
  const tagged = { ...JSON.parse(row.data), ai_generated: true, source: "ai", quest_book_id: id, quest_chapter_id: "c1" };
  h.db.raw.prepare("UPDATE lessons SET data=? WHERE id=?").run(JSON.stringify(tagged), lessonId);
  const url = `/quest-books/admin/books/${id}/lessons/reset`;
  const member = await h.parent("ACTIVE_MONTHLY");
  assert.equal((await h.req(url, member.token, "POST", { confirm: "REBUILD_FROM_PDF" })).status, 403);
  assert.equal((await h.req(url, owner.token, "POST", { confirm: "anything" })).status, 400);
  const reset = await h.req(url, owner.token, "POST", { confirm: "REBUILD_FROM_PDF" });
  assert.equal(reset.status, 200);
  const result = await reset.json();
  assert.equal(result.cleared_plan, true);
  assert.equal(result.cleared_published, true);
  assert.equal(h.storage.has(`quest-books/v1/${id}/book.pdf`), true, "the original PDF is unchanged");
  assert.equal(h.storage.has(`quest-books/v1/${id}/chapters.json`), false);
  assert.equal(h.storage.has(`quest-books/v1/${id}/lessons.json`), false);
  assert.ok([...h.storage.keys()].some((key) => key.includes("rebuild-backup-")));
  const oldDraft = h.db.raw.prepare("SELECT archived_at FROM lessons WHERE id=?").get(lessonId);
  assert.ok(oldDraft.archived_at, "AI draft archived rather than deleted");
  assert.equal((await (await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token)).json()).chapters.length, 0);
});

test("A purchased book cannot have its published lesson identifiers reset", async () => {
  const h = harness();
  const { owner, id } = await bookWithLessons(h);
  const fam = await h.parent("FREE_PREVIEW");
  await recordQuestBookPurchase(h.db, {
    object: "checkout.session", id: "cs_rebuild_guard", mode: "payment", payment_status: "paid",
    amount_total: 999, currency: "aud",
    metadata: { kind: "quest_book", family_id: fam.id, book_id: id, tier: "plus" },
  }, false);
  const reset = await h.req(`/quest-books/admin/books/${id}/lessons/reset`, owner.token, "POST", { confirm: "REBUILD_FROM_PDF" });
  assert.equal(reset.status, 409);
  assert.equal((await reset.json()).code, "QUEST_BOOK_ALREADY_DISTRIBUTED");
  assert.equal(h.storage.has(`quest-books/v1/${id}/lessons.json`), true);
});

test("Remaking a generated lesson archives earlier AI drafts but retains new and manually authored lessons", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h);
  // The owner works on an internal plan (a free preview family can only hand-make two lessons).
  h.db.raw.prepare("UPDATE families SET plan='INTERNAL' WHERE id=?").run(owner.id);
  const add = async (title, aiGenerated) => {
    const lid = (await (await h.req("/lessons", owner.token, "POST", lessonBody(title))).json()).id;
    const row = h.db.raw.prepare("SELECT data FROM lessons WHERE id=?").get(lid);
    h.db.raw.prepare("UPDATE lessons SET data=? WHERE id=?").run(JSON.stringify({
      ...JSON.parse(row.data), quest_book_id: id, quest_chapter_id: "c1", ai_generated: aiGenerated, source: aiGenerated ? "ai" : "parent",
    }), lid);
    return lid;
  };
  const old = await add("Old AI draft", true);
  const edited = await add("Handmade lesson", false);
  const latest = await add("New AI lesson", true);
  assert.equal(await retireSupersededBookDrafts(h.db, owner.id, id, "c1", latest), 1);
  assert.ok(h.db.raw.prepare("SELECT archived_at FROM lessons WHERE id=?").get(old).archived_at);
  assert.equal(h.db.raw.prepare("SELECT archived_at FROM lessons WHERE id=?").get(edited).archived_at, null);
  assert.equal(h.db.raw.prepare("SELECT archived_at FROM lessons WHERE id=?").get(latest).archived_at, null);
});

test("Cart: the server prices it, a pack replaces the same book and its lessons, unsellable items drop out", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const { id: id2 } = await publishedBook(h, { title: "Second Book", price_cents: 399, lessons_price_cents: 999 });
  const fam = await h.parent("FREE_PREVIEW");
  const items = [{ book_id: id, tier: "book" }, { book_id: id, tier: "plus" }, { book_id: id, tier: "lesson", lesson_key: "c1" }, { book_id: id2, tier: "book" }, { book_id: id2, tier: "plus" }, { book_id: id2, tier: "book" }];
  const q = await (await h.req("/quest-books/cart/quote", fam.token, "POST", { items })).json();
  assert.deepEqual(q.lines.map((l) => [l.book_id, l.tier, l.amount_cents]), [[id, "plus", 1500], [id2, "book", 399]]);
  assert.equal(q.total_cents, 1899);
  assert.equal(q.removed.length, 1, "the second book has no lessons to sell");
  // Changed prices are caught before charging.
  const changed = await h.req("/quest-books/cart/checkout", fam.token, "POST", { items, expected_total_cents: 100 });
  assert.equal(changed.status, 409);
  assert.equal((await changed.json()).code, "CART_CHANGED");
  // Members can buy the PDFs to keep, but never the lessons membership already includes.
  const member = await h.parent("ACTIVE_MONTHLY");
  const mq = await (await h.req("/quest-books/cart/quote", member.token, "POST", { items })).json();
  assert.deepEqual(mq.lines.map((l) => [l.book_id, l.tier]), [[id, "book"], [id2, "book"]]);
});

test("A paid cart unlocks every item once, and its status turns paid", async () => {
  const h = harness();
  const { id } = await bookWithLessons(h);
  const { id: id2 } = await publishedBook(h, { title: "Second Book", price_cents: 399 });
  const fam = await h.parent("FREE_PREVIEW");
  const cartId = await saveCart(h.db, fam.id, [
    { book_id: id, tier: "plus", amount_cents: 1500, title: "pack" },
    { book_id: id2, tier: "book", amount_cents: 399, title: "book" },
  ], 1899);
  assert.equal((await (await h.req(`/quest-books/cart/${cartId}/status`, fam.token)).json()).paid, false);
  const session = { object: "checkout.session", id: "cs_cart1", mode: "payment", payment_status: "paid", amount_total: 1899, currency: "aud", metadata: { kind: "quest_cart", family_id: fam.id, cart_id: cartId } };
  assert.match(await recordQuestBookPurchase(h.db, session, false), /2 items/);
  await recordQuestBookPurchase(h.db, session, false); // a replay changes nothing
  assert.equal(h.db.raw.prepare("SELECT COUNT(*) AS n FROM quest_book_purchases WHERE family_id=?").get(fam.id).n, 2);
  assert.equal((await (await h.req(`/quest-books/books/${id}`, fam.token)).json()).book.owned_tier, "plus");
  assert.equal((await (await h.req(`/quest-books/books/${id2}`, fam.token)).json()).book.can_download, true);
  assert.equal((await (await h.req(`/quest-books/cart/${cartId}/status`, fam.token)).json()).paid, true);
  // Someone else's cart id tells them nothing.
  const other = await h.parent("FREE_PREVIEW");
  assert.equal((await (await h.req(`/quest-books/cart/${cartId}/status`, other.token)).json()).paid, false);
});


test("Only the owner can copy a private family lesson into a separate unpublished standalone draft", async () => {
  const h = harness();
  const owner = await h.parent("ACTIVE_MONTHLY"); h.makeOwner(owner);
  const other = await h.parent("ACTIVE_MONTHLY");
  const created = await h.req("/lessons", owner.token, "POST", lessonBody("For my children"));
  assert.equal(created.status, 200);
  const originalId = (await created.json()).id;
  const route = `/quest-books/admin/lessons/${originalId}/copy-to-standalone`;
  assert.equal((await h.req(route, other.token, "POST")).status, 403);
  const copied = await h.req(route, owner.token, "POST");
  assert.equal(copied.status, 200);
  const copyId = (await copied.json()).lesson.id;
  assert.notEqual(copyId, originalId);
  const familyOriginal = await (await h.req(`/lessons/${originalId}`, owner.token)).json();
  const standaloneCopy = await (await h.req(`/lessons/${copyId}`, owner.token)).json();
  assert.equal(familyOriginal.source, "parent", "the original must remain a family lesson");
  assert.equal(standaloneCopy.source, "side_quest_standalone");
  assert.equal(standaloneCopy.status, "draft", "copy is not automatically approved or published");
  const edited = await h.req(`/lessons/${copyId}`, owner.token, "PUT", lessonBody("Edited official standalone draft"));
  assert.equal(edited.status, 200);
  assert.equal((await edited.json()).source, "side_quest_standalone", "editing should not reclassify official drafts as personal");
  assert.equal((await (await h.req(`/lessons/${originalId}`, owner.token)).json()).title, "For my children");
});


test("VIC and WA families receive their OWN outcomes when adding an older book with no per-state snapshot", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h, { price_cents: 399, lessons_price_cents: 999, lesson_price_cents: 100 });
  const createdPlan = await h.req(`/quest-books/admin/books/${id}/chapters`, owner.token, "PUT", {
    chapters: [{ title: "Adding two-digit numbers with regrouping", start: 7, end: 9, text: chapterText }],
  });
  assert.equal(createdPlan.status, 200);
  const created = await h.req("/lessons", owner.token, "POST", {
    ...lessonBody("Adding two-digit numbers with regrouping"), learning_area: "Mathematics", year_level: "Year 3",
    objectives: ["add two-digit numbers using place value and regrouping"],
    sections: [{ heading: "Place value", body: "Model adding two-digit numbers and regrouping tens." }],
  });
  assert.equal(created.status, 200);
  const lessonId = (await created.json()).id;
  assert.equal((await h.req(`/quest-books/admin/books/${id}/lessons/publish`, owner.token, "POST",
    { items: [{ chapter_id: "c1", lesson_id: lessonId }] })).status, 200);

  // Simulate a book already published before VIC and WA mappings were stored.
  const key = `quest-books/v1/${id}/lessons.json`;
  const snapshot = JSON.parse(new TextDecoder().decode(h.storage.get(key)));
  snapshot.lessons[0].codes = {
    NSW: snapshot.lessons[0].codes?.NSW || [],
    // Legacy books can have an official state code that nevertheless belongs
    // to the wrong subject. Neither code may be applied to this Maths lesson.
    VIC: ["VC2HH4K01"], // Year 3-4 History
    WA: ["WA3HAKUG1"], // Year 3 Geography
  };
  h.storage.set(key, new TextEncoder().encode(JSON.stringify(snapshot)));
  const cat = (await import("../src/outcomeTracker.ts")).catalogueFor;
  for (const jurisdiction of ["VIC", "WA", "QLD"]) {
    const parent = await h.parent("ACTIVE_MONTHLY", jurisdiction);
    const added = await h.req(`/quest-books/books/${id}/lessons/add`, parent.token, "POST", {});
    assert.equal(added.status, 200, jurisdiction + ": book lesson import");
    const info = await added.json();
    const expectedFramework = jurisdiction === "QLD" ? "AC9" : jurisdiction;
    assert.equal(info.framework, expectedFramework);
    assert.equal(info.added, 1);
    assert.equal(info.matched, 1, jurisdiction + ": a Year 3 maths lesson should match available source summaries");
    assert.equal(info.without_matches, 0);
    const lessons = await (await h.req("/lessons", parent.token)).json();
    const owned = lessons.find((l) => l.quest_book_id === id);
    assert.ok(owned, "book copy exists in " + jurisdiction);
    assert.equal(owned.source, "side_quest_book");
    assert.ok(owned.outcome_codes.length > 0, jurisdiction + " should have curriculum references");
    assert.ok(owned.outcome_codes.every((code) => cat(jurisdiction).byCode.has(code)),
      jurisdiction + " must not inherit NSW or any other state's codes: " + owned.outcome_codes);
    if (jurisdiction !== "QLD") assert.ok(!owned.outcome_codes.some((code) => /^MA2-|^AC9/.test(code)),
      "State-specific VIC/WA copies must not carry NSW/AC9 codes into their outcome tracker");
    const ownerOriginal = await (await h.req(`/lessons/${lessonId}`, owner.token)).json();
    assert.equal(ownerOriginal.title, "Adding two-digit numbers with regrouping", "owner's reviewed master is unchanged");
  }
});


test("Member reader builds are resumable and only a verified complete generation replaces the active reader", async () => {
  const h = harness();
  const { owner, id } = await publishedBook(h, { price_cents: 399 });
  const member = await h.parent("ACTIVE_MONTHLY");
  const visitor = await h.parent("FREE_PREVIEW");
  const sourceRes = await h.req(`/quest-books/admin/books/${id}/read-source`, owner.token);
  assert.equal(sourceRes.status, 200);
  const { source_id } = await sourceRes.json();
  const one = "11111111-1111-4111-8111-111111111111";
  const two = "22222222-2222-4222-8222-222222222222";
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 9, 9]);
  const route = (g, p) => `/quest-books/admin/books/${id}/read-build/${g}/${p}`;
  assert.equal((await h.req(route(one, "1"), member.token, "PUT", jpeg, "image/jpeg")).status, 403,
    "members cannot generate or replace reader pages");
  assert.equal((await h.req(route(one, "1"), owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  assert.deepEqual((await (await h.req(route(one, "progress"), owner.token)).json()).uploaded, [1]);
  assert.equal((await h.req(route(one, "finish"), owner.token, "POST", { total: 2, source_id })).status, 409,
    "incomplete reader must not appear to members");
  const before = (await (await h.req(`/quest-books/books/${id}`, member.token)).json()).book;
  assert.equal(before.can_read, false);
  assert.equal(before.read_pages, 0);
  assert.equal((await h.req(route(one, "2"), owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  assert.equal((await h.req(route(one, "finish"), owner.token, "POST", { total: 2, source_id })).status, 200);
  const live = (await (await h.req(`/quest-books/books/${id}`, member.token)).json()).book;
  assert.equal(live.can_read, true);
  assert.equal(live.read_pages, 2);
  assert.equal((await h.req(`/quest-books/books/${id}/read/2`, member.token)).status, 200);
  assert.equal((await h.req(`/quest-books/books/${id}/download`, member.token)).status, 402);
  assert.equal((await h.req(`/quest-books/books/${id}/read/2`, visitor.token)).status, 402);

  // A replacement uploads to a new path, leaving the old complete reader
  // usable until the full new set is accepted.
  assert.equal((await h.req(route(two, "1"), owner.token, "PUT", jpeg, "image/jpeg")).status, 200);
  const stillLive = (await (await h.req(`/quest-books/books/${id}`, member.token)).json()).book;
  assert.equal(stillLive.read_pages, 2);
  assert.equal((await h.req(route(two, "finish"), owner.token, "POST", { total: 1, source_id: "wrong-source" })).status, 409);
  assert.equal((await h.req(route(two, "finish"), owner.token, "POST", { total: 1, source_id })).status, 200);
  const replaced = (await (await h.req(`/quest-books/books/${id}`, member.token)).json()).book;
  assert.equal(replaced.read_pages, 1);
  assert.equal((await h.req(`/quest-books/books/${id}/read/2`, member.token)).status, 409,
    "old generation pages cannot be accessed after a new generation is committed");
});


test("Public shop: closed by default; when open it lists books and a paid order downloads with its private link only", async () => {
  const h = harness();
  const { id } = await publishedBook(h, { price_cents: 399 });
  const get = (path) => worker.fetch(new Request("http://localhost:8787/api" + path), h.env, { waitUntil() {}, passThroughOnException() {} });
  assert.equal((await (await get("/shop")).json()).open, false);
  assert.equal((await get(`/shop/books/${id}/look/1`)).status, 404);
  h.db.raw.prepare("INSERT OR REPLACE INTO platform_settings (key, value_json) VALUES ('features', ?)")
    .run(JSON.stringify({ registrationsOpen: true, aiEnabled: true, videoSearch: true, shopOpen: true }));
  clearSettingsCache();
  const shop = await (await get("/shop")).json();
  assert.equal(shop.open, true);
  assert.deepEqual(shop.books.map((b) => [b.id, b.price_cents]), [[id, 399]]);
  assert.ok(!("can_download" in shop.books[0]), "no account details in the public list");
  // No Square configured in tests: checkout refuses rather than falling back to anything else.
  const co = await worker.fetch(new Request("http://localhost:8787/api/shop/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ book_ids: [id], email: "a@b.co" }) }), h.env, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(co.status, 503);
  // An order (as checkout would create it) unlocks only after the verified payment, and only with its token.
  const order = await createShopOrder(h.db, "buyer@example.com", [{ book_id: id, title: "Number Navigators", amount_cents: 399 }]);
  assert.equal((await (await get(`/shop/orders/${order.id}?t=${order.token}`)).json()).paid, false);
  assert.equal((await get(`/shop/orders/${order.id}/download/${id}?t=${order.token}`)).status, 404);
  assert.match(await recordPaidShopOrder(h.db, h.env, order.id, 1, "p", "https://x"), /does not match/);
  assert.match(await recordPaidShopOrder(h.db, h.env, order.id, 399, "p", "https://x"), /paid/);
  assert.equal((await (await get(`/shop/orders/${order.id}?t=${order.token}`)).json()).paid, true);
  const dl = await get(`/shop/orders/${order.id}/download/${id}?t=${order.token}`);
  assert.equal(dl.status, 200);
  assert.match(await dl.text(), /FULL BOOK/);
  assert.equal((await get(`/shop/orders/${order.id}/download/${id}?t=${"0".repeat(48)}`)).status, 404, "wrong token");
});
