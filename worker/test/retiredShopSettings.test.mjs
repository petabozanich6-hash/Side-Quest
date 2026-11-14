import test from "node:test";
import assert from "node:assert/strict";
import { defaultSettings, validateSetting } from "../src/platformSettings.ts";

test("retired in-app shop is not an Owner HQ feature switch", () => {
  const defaults = defaultSettings().features;
  assert.deepEqual(Object.keys(defaults).sort(), ["aiEnabled", "registrationsOpen", "videoSearch"].sort());
  assert.equal(Object.hasOwn(defaults, "shopOpen"), false);
});

test("settings saved before the Square migration ignore obsolete shopOpen without changing live feature switches", () => {
  const current = defaultSettings().features;
  const legacy = validateSetting("features", { ...current, shopOpen: true });
  assert.equal(legacy.ok, true);
  if (!legacy.ok) throw Error(legacy.error);
  assert.deepEqual(legacy.value, current);
});
