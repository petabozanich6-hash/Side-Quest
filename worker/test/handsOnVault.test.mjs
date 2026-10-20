import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { HANDS_ON_QUESTS, previewQuest } from "../src/handsOnVault.ts";
import { PARENT_LEARNING_GUIDES } from "../src/data/handsOnParentGuides.ts";
import { MORE_PARENT_LEARNING_GUIDES } from "../src/data/handsOnParentGuidesMore.ts";
import { spaceParentGuides } from "../src/data/handsOnSpace.ts";
import { soundParentGuides } from "../src/data/handsOnSound.ts";
import { codingParentGuides } from "../src/data/handsOnCoding.ts";
import { practicalParentGuides } from "../src/data/handsOnPractical.ts";
import { historyParentGuides } from "../src/data/handsOnHistory.ts";
import { lightParentGuides, forcesParentGuides } from "../src/data/handsOnExpansionPhysics.ts";
import { weatherParentGuides, plantsParentGuides } from "../src/data/handsOnExpansionNatural.ts";
import { logicParentGuides, dramaParentGuides } from "../src/data/handsOnExpansionCreative.ts";
import { inclusiveParentGuides, marketParentGuides } from "../src/data/handsOnExpansionDesign.ts";
import { earthParentGuides, civicsParentGuides } from "../src/data/handsOnExpansionEarthCivic.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";
import { sunParentGuides } from "../src/data/handsOnSun.ts";
import { bubbleParentGuides } from "../src/data/handsOnBubbles.ts";
import { coreRunbooks } from "../src/data/handsOnRunbookCore.ts";
import { middleRunbooks } from "../src/data/handsOnRunbookMiddle.ts";
import { expandedRunbooks } from "../src/data/handsOnRunbookExpanded.ts";
import { newRunbooks } from "../src/data/handsOnRunbookNew.ts";

let seq = 0;
function makeHarness() {
  const db = makeDb(), env = { DB: db, JWT_SECRET: "hands-on-vault-test-secret" };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  clearSettingsCache(); clearUsageCache();
  async function req(path, token, method = "GET", body) {
    const headers = {};
    if (token) headers.authorization = "Bearer " + token;
    if (body) headers["content-type"] = "application/json";
    return worker.fetch(new Request("http://localhost:8787/api" + path, {
      headers, method, body: body ? JSON.stringify(body) : undefined,
    }), env, ctx);
  }
  async function parent(plan) {
    const n = ++seq;
    const response = await req("/auth/register", undefined, "POST", {
      name: "Hands On Parent " + n, email: "hands-on-" + n + "@example.test",
      password: "Test-password-123", jurisdiction: "NSW",
    });
    assert.equal(response.status, 200);
    const data = await response.json();
    if (plan !== "FREE_PREVIEW") db.raw.prepare("UPDATE families SET plan=? WHERE id=?")
      .run(plan, data.user.family_id);
    return { token: data.token, userId: data.user.id, familyId: data.user.family_id };
  }
  return { req, parent, db };
}

test("162 original family activities have practical printable guides and troubleshooting", () => {
  assert.equal(HANDS_ON_QUESTS.length, 162);
  assert.equal(new Set(HANDS_ON_QUESTS.map(q => q.id)).size, 162);
  assert.equal(new Set(HANDS_ON_QUESTS.map(q => q.category)).size, 27);
  const guides = { ...PARENT_LEARNING_GUIDES, ...MORE_PARENT_LEARNING_GUIDES,
    ...spaceParentGuides, ...soundParentGuides, ...codingParentGuides,
    ...practicalParentGuides, ...historyParentGuides,
    ...lightParentGuides, ...forcesParentGuides, ...weatherParentGuides, ...plantsParentGuides,
    ...logicParentGuides, ...dramaParentGuides, ...inclusiveParentGuides, ...marketParentGuides,
    ...earthParentGuides, ...civicsParentGuides,
    ...sunParentGuides, ...bubbleParentGuides };
  const runbooks = {...coreRunbooks, ...middleRunbooks, ...expandedRunbooks, ...newRunbooks};
  assert.equal(Object.keys(runbooks).length, 162);
  assert.equal(Object.keys(guides).length, 162, "each quest needs exactly one custom parent guide");
  for (const q of HANDS_ON_QUESTS) {
    assert.match(q.id, /^[a-z0-9-]+$/);
    assert.ok(q.title.length > 6 && q.description.length > 20, q.id);
    assert.ok(q.materials.length >= 3 && q.steps.length >= 4, q.id);
    assert.ok(q.wonder.length >= 2 && q.skills.length >= 2, q.id);
    assert.ok(q.safety.length >= 20 && q.extension.length >= 30, q.id);
    const howto = runbooks[q.id];
    assert.ok(howto, "missing workable setup and troubleshooting for " + q.id);
    for (const key of ["prepare", "expected", "troubleshoot"]) {
      assert.ok(howto[key].length > 45, q.id + " needs practical " + key);
    }
    const guide = guides[q.id];
    assert.ok(guide, "missing educational explanation for " + q.id);
    for (const field of ["objective", "explanation", "parentPrompt", "evidence"]) {
      assert.ok(typeof guide[field] === "string" && guide[field].length > (field === "objective" ? 30 : 45),
        "parent guide missing substantial " + field + " for " + q.id);
    }
    const preview = previewQuest(q);
    for (const key of ["materials", "steps", "wonder", "safety", "extension", "parentLearning", "runbook"]) {
      assert.ok(!(key in preview), "preview leaked " + key + " for " + q.id);
    }
  }
});
test("free preview gets metadata only, but never step-by-step guides", async () => {
  const h = makeHarness(), p = await h.parent("FREE_PREVIEW");
  const list = await h.req("/hands-on-quests", p.token);
  assert.equal(list.status, 200);
  assert.match(list.headers.get("cache-control"), /no-store/);
  const data = await list.json();
  assert.equal(data.unlocked, false);
  assert.equal(data.count, 162);
  assert.equal(data.items.length, 162);
  assert.equal(data.categories.length, 27);
  assert.ok(!("materials" in data.items[0]));
  assert.ok(!("steps" in data.items[0]));
  const detail = await h.req("/hands-on-quests/oobleck-lab", p.token);
  assert.equal(detail.status, 402);
  assert.equal((await detail.json()).code, "UPGRADE_REQUIRED");
  assert.equal((await h.req("/hands-on-quests", undefined)).status, 401);
  assert.equal((await h.req("/hands-on-quests/robot-command-maze", p.token)).status, 402);
  assert.equal((await h.req("/hands-on-quests/community-survey", p.token)).status, 402);
  assert.equal((await h.req("/hands-on-quests/solar-oven", p.token)).status, 402);
  assert.equal((await h.req("/hands-on-quests/rainbow-bubbles", p.token)).status, 402);
  const newItem = data.items.find(q => q.id === "robot-command-maze");
  assert.ok(newItem);
  assert.ok(!("materials" in newItem) && !("steps" in newItem) && !("parentLearning" in newItem) && !("runbook" in newItem));
});
test("paid families receive complete guides and own material search metadata", async () => {
  const h = makeHarness(), p = await h.parent("ACTIVE_MONTHLY");
  const listing = await (await h.req("/hands-on-quests", p.token)).json();
  assert.equal(listing.unlocked, true);
  assert.ok(listing.items[0].materials.length >= 3);
  assert.ok(!("steps" in listing.items[0]));
  assert.ok(!("parentLearning" in listing.items[0]));
  const r = await h.req("/hands-on-quests/oobleck-lab", p.token);
  assert.equal(r.status, 200);
  assert.match(r.headers.get("cache-control"), /no-store/);
  const details = await r.json();
  assert.equal(details.title, "The Dragon's Oobleck Quicksand");
  assert.ok(details.steps.length >= 4);
  assert.match(details.safety, /drains/i);
  assert.match(details.parentLearning.objective, /materials|force|behaviour/i);
  assert.match(details.parentLearning.explanation, /particles/i);
  assert.ok(details.parentLearning.parentPrompt.length > 30);
  assert.ok(details.parentLearning.evidence.length > 30);
  assert.match(details.runbook.prepare, /2 cups cornflour/);
  assert.match(details.runbook.troubleshoot, /runny/i);
  const second = await (await h.req("/hands-on-quests/leaf-detective", p.token)).json();
  assert.match(second.parentLearning.explanation, /leaves|classification|trait/i);
  const expanded = await (await h.req("/hands-on-quests/robot-command-maze", p.token)).json();
  assert.match(expanded.parentLearning.explanation, /algorithm/i);
  const newest = await (await h.req("/hands-on-quests/community-survey", p.token)).json();
  assert.match(newest.parentLearning.explanation, /survey/i);
  assert.ok(newest.steps.length >= 4);
  assert.ok(expanded.steps.length >= 4);
  const solar = await (await h.req("/hands-on-quests/solar-oven", p.token)).json();
  assert.ok(solar.steps.length >= 7);
  assert.match(solar.safety, /food|knife|blade/i);
  assert.match(solar.runbook.expected, /thermometer/i);
  const rainbow = await (await h.req("/hands-on-quests/rainbow-bubbles", p.token)).json();
  assert.ok(rainbow.steps.length >= 7);
  assert.match(rainbow.parentLearning.explanation, /soap molecules|film/i);
  assert.equal((await h.req("/hands-on-quests/not-a-real-quest", p.token)).status, 404);
});
test("expired memberships are locked; verified owner can read without payment", async () => {
  const h = makeHarness(), expired = await h.parent("PREVIEW_EXPIRED");
  assert.equal((await h.req("/hands-on-quests/oobleck-lab", expired.token)).status, 402);
  const owner = await h.parent("FREE_PREVIEW");
  h.db.raw.prepare("INSERT INTO user_roles(id,user_id,role,granted_by,reason) VALUES(?,?,'owner','test','test')")
    .run(crypto.randomUUID(), owner.userId);
  assert.equal((await h.req("/hands-on-quests/oobleck-lab", owner.token)).status, 200);
});
