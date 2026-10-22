import { test } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { makeDb } from "./fakeD1.mjs";
import { registerCore } from "../src/core.ts";

function harness() {
  const db = makeDb();
  db.raw.prepare("INSERT INTO families (id,name,owner_id,created_at) VALUES (?,?,?,?)").run("fam", "fam", "parent", "2026-10-23T00:00:00Z");
  const app = new Hono();
  const auth = async (c, next) => { c.set("user", { id: "parent", family_id: "fam", role: "parent" }); await next(); };
  const parent = async (_c, next) => next();
  registerCore(app, auth, parent);
  const post = (url) => app.request("http://test/api/resources", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "Link", url }),
  }, { DB: db });
  return { db, post };
}

test("saved resource links must be web addresses", async () => {
  const { db, post } = harness();
  for (const bad of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "not a url"]) {
    assert.equal((await post(bad)).status, 400, bad);
  }
  assert.equal(db.raw.prepare("SELECT COUNT(*) AS n FROM resources").get().n, 0);
  const ok = await post("https://www.abc.net.au/education");
  const body = await ok.text();
  assert.equal(ok.status, 200, body);
  assert.equal(JSON.parse(body).url, "https://www.abc.net.au/education");
});
