// Owner HQ, end to end through the real Worker (index.ts) against the real migrations on SQLite (fakeD1).
// Passkeys use a software authenticator, so SimpleWebAuthn's real signature checks run.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sign } from "hono/jwt";
import { makeDb } from "./fakeD1.mjs";
import { createSoftAuthenticator } from "./softAuthenticator.mjs";
import worker from "../src/index.ts";
import {
  OWNER_SCHEMA,
  ensureOwnerSchema,
  resetOwnerSchemaFlag,
} from "../src/ownerSchema.ts";
import {
  applyPlatformSettings,
  clearSettingsCache,
  clearUsageCache,
  validateSetting,
} from "../src/platformSettings.ts";
import { allowedOrigin } from "../src/adminRoutes.ts";
import {
  evaluate,
  grantSql,
  maskEmail,
  OWNERS_SQL,
} from "../scripts/owner-promotion.mjs";

const ORIGIN = "http://localhost:8787";
const PW = "Correct-horse-9";
const SECRET = "ZZ-PRIVATE-CONTENT-ZZ";

function harness() {
  const db = makeDb();
  const env = { DB: db, JWT_SECRET: "test-only-secret" };
  clearSettingsCache();
  clearUsageCache();
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  async function req(
    path,
    {
      method = "GET",
      token,
      body,
      admin = true,
      origin = ORIGIN,
      headers = {},
    } = {},
  ) {
    const h = { "content-type": "application/json", ...headers };
    if (token) h.authorization = `Bearer ${token}`;
    if (method !== "GET") {
      if (admin) h["x-sidequest-admin"] = "1";
      if (origin) h.origin = origin;
    }
    const r = await worker.fetch(
      new Request(ORIGIN + "/api" + path, {
        method,
        headers: h,
        body: body ? JSON.stringify(body) : undefined,
      }),
      env,
      ctx,
    );
    let json = null;
    try {
      json = await r.json();
    } catch {
      /* empty */
    }
    return { status: r.status, json, headers: r.headers };
  }
  async function register(email, name = "Parent") {
    const r = await req("/auth/register", {
      method: "POST",
      admin: false,
      body: { email, password: PW, name, jurisdiction: "NSW" },
    });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    return {
      token: r.json.token,
      id: r.json.user.id,
      familyId: r.json.user.family_id,
      email,
    };
  }
  const login = async (email) =>
    await req("/auth/login", {
      method: "POST",
      admin: false,
      body: { email, password: PW },
    });
  const makeOwner = (userId) =>
    db.raw
      .prepare(
        "INSERT INTO user_roles (id, user_id, role, granted_by, reason) VALUES (?, ?, 'owner', 'test', 'test')",
      )
      .run(crypto.randomUUID(), userId);
  async function addChild(parent, username) {
    const r = await req("/students", {
      method: "POST",
      token: parent.token,
      admin: false,
      body: { name: "Mia " + SECRET, username, pin: "4321", stage: "S2" },
    });
    assert.equal(r.status, 200, JSON.stringify(r.json));
    const l = await req("/auth/child-login", {
      method: "POST",
      admin: false,
      body: { username, pin: "4321" },
    });
    assert.equal(l.status, 200);
    return { id: r.json.id, token: l.json.token };
  }
  return { db, env, req, register, login, makeOwner, addChild };
}

/** Enrols a passkey (password re-check) and steps up. Returns the authenticator. */
async function stepUp(h, owner, auth) {
  auth ??= await createSoftAuthenticator();
  const status = await h.req("/admin/security/status", { token: owner.token });
  if (status.json.passkey_count === 0) {
    const o = await h.req("/admin/security/passkeys/register/options", {
      method: "POST",
      token: owner.token,
      body: { password: PW },
    });
    assert.equal(o.status, 200, JSON.stringify(o.json));
    const v = await h.req("/admin/security/passkeys/register/verify", {
      method: "POST",
      token: owner.token,
      body: {
        response: auth.register(o.json.options, ORIGIN),
        label: "Laptop",
      },
    });
    assert.equal(v.status, 201, JSON.stringify(v.json));
  }
  const a = await h.req("/admin/security/step-up/options", {
    method: "POST",
    token: owner.token,
  });
  assert.equal(a.status, 200, JSON.stringify(a.json));
  const r = await h.req("/admin/security/step-up/verify", {
    method: "POST",
    token: owner.token,
    body: {
      response: await auth.authenticate(a.json.options, ORIGIN, "localhost"),
    },
  });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  return auth;
}

async function ownerSetup() {
  const h = harness();
  const owner = await h.register("owner@example.com", "Owner");
  h.makeOwner(owner.id);
  return { h, owner };
}

import {
  validateBook,
  qaBook,
  renderBook,
  mathDiagram,
} from "../src/bookForge.ts";
function bucket() {
  const files = new Map();
  return {
    files,
    async put(k, v) {
      files.set(k, new Uint8Array(await new Response(v).arrayBuffer()));
    },
    async get(k) {
      const v = files.get(k);
      return v ? { body: v, arrayBuffer: async () => v.buffer } : null;
    },
    async head(k) {
      return files.has(k) ? {} : null;
    },
  };
}
test("Forge: owner gate, CSRF, locking, stale writes, QA, PDF, approval and hidden Shop publication", async () => {
  const { h, owner } = await ownerSetup();
  const parent = await h.register("other@example.com");
  assert.equal((await h.req("/admin/book-forge")).status, 404);
  assert.equal(
    (await h.req("/admin/book-forge", { token: parent.token })).status,
    404,
  );
  assert.equal(
    (await h.req("/admin/book-forge", { token: owner.token })).status,
    401,
  );
  await stepUp(h, owner);
  const call = (path = "", method = "GET", body) =>
    h.req("/admin/book-forge" + path, { token: owner.token, method, body });
  assert.equal(
    (
      await h.req("/admin/book-forge", {
        token: owner.token,
        method: "POST",
        admin: false,
        body: { title: "Blocked" },
      })
    ).status,
    403,
  );
  let r = await call("", "POST", { title: "Woodland readers" });
  assert.equal(r.status, 201, JSON.stringify(r.json));
  let p = r.json;
  const id = p.id;
  const act = async (name, extra = {}) => {
    const r = await call("/" + id + "/" + name, "POST", {
      revision: p.revision,
      pageId: p.book.pages[0].id,
      ...extra,
    });
    if (r.status === 200 && r.json.book) p = r.json;
    return r;
  };
  h.db.raw
    .prepare(
      "INSERT INTO lessons (id,family_id,title,data,created_at,updated_at,version) VALUES (?,?,?,?,?,?,?)",
    )
    .run(
      "lesson-one",
      owner.familyId,
      "Reading",
      "{}",
      "2026-01-01",
      "2026-01-01",
      1,
    );
  p.book.pages[0] = {
    ...p.book.pages[0],
    title: "Forest words",
    goal: "Read and describe",
    text: "Read the word tree. Draw a tree.",
    lessonId: "lesson-one",
  };
  r = await call("/" + id, "PUT", { revision: p.revision, book: p.book });
  assert.equal(r.status, 200);
  p = r.json;
  assert.equal(
    (await call("/" + id, "PUT", { revision: 1, book: p.book })).status,
    409,
  );
  assert.equal((await act("approve", { reviewed: true })).status, 409);
  assert.equal((await act("lock")).status, 200);
  const tamper = structuredClone(p.book);
  tamper.pages[0].text = "Changed";
  assert.equal(
    (await call("/" + id, "PUT", { revision: p.revision, book: tamper }))
      .status,
    409,
  );
  assert.deepEqual((await act("qa")).json.issues, []);
  h.db.raw.prepare("UPDATE lessons SET version=2 WHERE id='lesson-one'").run();
  assert.equal((await act("qa")).json.issues.length, 1);
  assert.equal((await act("render")).status, 409);
  await act("unlock");
  await act("lock");
  assert.equal((await act("render")).status, 503);
  h.env.BUCKET = bucket();
  h.env.AI = {
    run: async () => ({ image: btoa(String.fromCharCode(255, 216, 255, 217)) }),
  };
  assert.equal(
    (await act("illustrate", { prompt: "An oak tree" })).status,
    200,
  );
  assert.equal(p.book.pages[0].text, "Read the word tree. Draw a tree.");
  const preview = await call("/" + id + "/preview");
  assert.equal(preview.status, 200);
  assert.match(preview.json.html, /data:image\/jpeg;base64/);
  h.env.BOOK_FORGE_CF_ACCOUNT_ID = "test";
  h.env.BOOK_FORGE_CF_API_TOKEN = "test-secret";
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    assert.match(url, /browser-rendering\/pdf$/);
    assert.equal(JSON.parse(init.body).pdfOptions.preferCSSPageSize, true);
    return new Response("%PDF-1.7 test");
  };
  try {
    assert.equal((await act("render")).status, 200);
  } finally {
    globalThis.fetch = original;
  }
  assert.equal((await act("publish")).status, 409);
  assert.equal((await act("approve")).status, 400);
  assert.equal((await act("approve", { reviewed: true })).status, 200);
  assert.equal((await act("publish")).status, 200);
  const release = p.book.releases[0];
  assert.ok(release.productId);
  const product = h.db.raw
    .prepare("SELECT * FROM shop_products WHERE id=?")
    .get(release.productId);
  assert.equal(product.visible, 0);
  assert.equal(product.status, "draft");
  assert.equal(product.fulfilment, "digital");
  assert.equal(product.price_cents, null);
  assert.ok(
    h.env.BUCKET.files.has("shop/products/" + release.productId + "/file"),
  );
  assert.equal((await act("publish")).status, 200);
  assert.equal(p.book.releases.length, 1);
  await act("unlock");
  assert.equal(p.book.approved, undefined);
  assert.equal(p.book.pdf, undefined);
  assert.equal(p.book.releases.length, 1);
  assert.equal(
    (await h.req("/admin/book-forge/" + id + "/pdf", { token: parent.token }))
      .status,
    404,
  );
});
test("Forge: renderer escapes content, blocks overflow and preserves locked page existence", () => {
  const book = {
    title: "<script>test</script>",
    template: "woodland",
    releases: [],
    pages: [
      {
        id: "p1",
        title: "<img onerror=bad>",
        text: "A".repeat(2400),
        goal: "Read",
        lessonId: "x",
        lessonSnapshot: "{}",
        locked: true,
        art: "saved",
      },
    ],
  };
  assert.match(renderBook(book), /&lt;script&gt;/);
  assert.doesNotMatch(renderBook(book), /<script>/);
  assert.ok(qaBook(book).some((x) => x.includes("split")));
  assert.throws(() =>
    validateBook(
      { ...book, pages: [{ ...book.pages[0], id: "different" }] },
      book,
    ),
  );
  const forged = {
    ...book,
    pages: [
      {
        ...book.pages[0],
        locked: false,
        art: "https://evil.example",
        lessonSnapshot: "fake",
      },
    ],
  };
  const clean = validateBook(forged, book);
  assert.equal(clean.pages[0].art, "saved");
  assert.equal(clean.pages[0].locked, true);
  assert.equal(clean.pages[0].lessonSnapshot, "{}");
});

import {
  processBookForgeJobs,
  validateGeneratedSession,
} from "../src/bookForgeGeneration.ts";
import { countingSession } from "./fixtures/bookForgeSessions.mjs";
test("Forge autonomous creation persists steps, checks text, produces PDF and never auto-publishes", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  h.env.BUCKET = bucket();
  const draft = countingSession();
  let calls = 0;
  h.env.AI = {
    run: async (model, input) => {
      calls++;
      const prompt = input.messages?.[1]?.content || "";
      if (prompt.startsWith("Create a coherent"))
        return {
          response: {
            title: "Woodland Number Adventures",
            sessions: Array.from({ length: 8 }, (_, i) => ({
              title: "Counting quest " + (i + 1),
              goal: "Count objects with one-to-one correspondence.",
              code: "AC9MFN01",
            })),
          },
        };
      if (prompt.startsWith("Independently"))
        return { response: { pass: true, issues: [] } };
      return { response: draft };
    },
  };
  h.env.BROWSER = {
    quickAction: async (action, options) => {
      assert.equal(action, "pdf");
      assert.match(options.html, /Your learning|YOUR LEARNING/);
      assert.match(options.html, /Answers/);
      assert.match(options.html, /<svg/);
      return new Response("%PDF-1.7 generated-test");
    },
  };
  const start = await h.req("/admin/book-forge/generate", {
    method: "POST",
    token: owner.token,
    body: {
      brief: "Make a Foundation mathematics counting workbook",
      length: "short",
    },
  });
  assert.equal(start.status, 202, JSON.stringify(start.json));
  const id = start.json.id;
  assert.equal(
    (
      await h.req("/admin/book-forge/" + id, {
        method: "PUT",
        token: owner.token,
        body: { revision: 1, book: start.json.book },
      })
    ).status,
    409,
  );
  await Promise.all([processBookForgeJobs(h.env), processBookForgeJobs(h.env)]);
  assert.equal(calls, 1, "lease prevents duplicate planning");
  for (let i = 0; i < 10; i++) await processBookForgeJobs(h.env);
  const state = (
    await h.req("/admin/book-forge/" + id + "/generation", {
      token: owner.token,
    })
  ).json.job;
  assert.equal(state.status, "complete", JSON.stringify(state));
  const project = (
    await h.req("/admin/book-forge/" + id, { token: owner.token })
  ).json;
  assert.equal(project.book.pages.length, 24);
  assert.equal(project.book.pages[16].answerPage, true);
  assert.ok(project.book.pdf);
  assert.equal(project.book.approved, undefined);
  assert.equal(project.book.releases.length, 0);
  assert.equal(
    calls,
    17,
    "one plan plus two independent text calls for each session",
  );
  assert.deepEqual(qaBook(project.book), []);
});
test("Forge autonomous creation retries invalid output, then pauses without losing saved state", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  h.env.BUCKET = bucket();
  h.env.AI = {
    run: async () => ({ response: { title: "Incomplete", sessions: [] } }),
  };
  const start = await h.req("/admin/book-forge/generate", {
    method: "POST",
    token: owner.token,
    body: { brief: "Create Foundation mathematics workbook", length: "short" },
  });
  const id = start.json.id;
  for (let i = 0; i < 3; i++) await processBookForgeJobs(h.env);
  const state = (
    await h.req("/admin/book-forge/" + id + "/generation", {
      token: owner.token,
    })
  ).json.job;
  assert.equal(state.status, "failed");
  assert.match(state.error, /plan/);
  assert.equal(
    (
      await h.req("/admin/book-forge/" + id + "/retry", {
        method: "POST",
        token: owner.token,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await h.req("/admin/book-forge/" + id + "/cancel", {
        method: "POST",
        token: owner.token,
      })
    ).status,
    200,
  );
  await processBookForgeJobs(h.env);
  assert.equal(
    (
      await h.req("/admin/book-forge/" + id + "/generation", {
        token: owner.token,
      })
    ).json.job.status,
    "cancelled",
  );
  assert.throws(() =>
    validateGeneratedSession(
      { pages: [{}, {}], answers: "" },
      { title: "x", goal: "x", code: "x", lessonId: "x" },
      0,
    ),
  );
});

test("Forge plans longer focused books in batches without broadening their topic", async () => {
  const { h, owner } = await ownerSetup();
  await stepUp(h, owner);
  h.env.BUCKET = bucket();
  const batches = [];
  h.env.AI = {
    run: async (_model, input) => {
      const prompt = input.messages[1].content;
      assert.match(prompt, /Choose the references most relevant/);
      assert.doesNotMatch(prompt, /use these assigned curriculum references/);
      const count = Number(
        prompt.match(/Plan ONLY the next (\d+) sessions/)[1],
      );
      const start = Number(prompt.match(/starting at session (\d+)/)[1]);
      batches.push([start, count]);
      return {
        response: {
          title: "Counting Adventures",
          sessions: Array.from({ length: count }, (_, i) => ({
            title: `Counting session ${start + i}`,
            goal: "Count sets accurately.",
            code: "AC9MFN01",
          })),
        },
      };
    },
  };
  const result = await h.req("/admin/book-forge/generate", {
    method: "POST",
    token: owner.token,
    body: {
      brief: "Make a Foundation mathematics workbook about counting",
      length: "short",
      pageTarget: 101,
    },
  });
  assert.equal(result.status, 202, JSON.stringify(result.json));
  for (let i = 0; i < 3; i++) await processBookForgeJobs(h.env);
  assert.deepEqual(batches, [
    [1, 12],
    [13, 12],
    [25, 9],
  ]);
  const project = (
    await h.req(`/admin/book-forge/${result.json.id}`, { token: owner.token })
  ).json;
  assert.equal(project.book.plan.length, 33);
  assert.equal(new Set(project.book.plan.map((p) => p.lessonId)).size, 33);
  const state = (
    await h.req(`/admin/book-forge/${result.json.id}/generation`, {
      token: owner.token,
    })
  ).json.job;
  assert.equal(state.phase, "write");
  assert.equal(state.cursor, 0);
  assert.equal(state.total, 33);
});

test("Forge ten-frames show two rows of five with exactly the requested counters", () => {
  const small = mathDiagram({ type: "ten-frame", count: 4 });
  assert.equal((small.match(/<rect /g) || []).length, 10);
  assert.equal((small.match(/<circle /g) || []).length, 4);
  assert.match(small, /<rect x="10" y="55"/);
  const larger = mathDiagram({ type: "ten-frame", count: 16 });
  assert.equal((larger.match(/<rect /g) || []).length, 20);
  assert.equal((larger.match(/<circle /g) || []).length, 16);
  assert.match(larger, /<rect x="245" y="10"/);
});
