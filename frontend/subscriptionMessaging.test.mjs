import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(frontendRoot, "src");

const ABOUT_HEADING = "Built for learning, not for profit.";
const ABOUT_PARAGRAPHS = [
  "Side-Quest was created to make quality home education more accessible, engaging and manageable for families.",
  "Running and improving the platform comes with ongoing costs, including hosting, development, maintenance and educational resources.",
  "Our subscription model is designed to help cover these costs rather than maximise profits. We're committed to keeping Side-Quest affordable, transparent and sustainable.",
];
const PRICING_SUMMARY =
  "Built for learning, not for profit. Subscriptions help cover running costs so Side-Quest stays affordable.";
const FUTURE_PRICING =
  "Subscription pricing will be shared before anyone is asked to pay. You will not be charged without agreeing to a subscription.";

const PRODUCT_FREE_CLAIMS = [
  /free for homeschool/i,
  /this platform is free/i,
  /currently free/i,
  /is side quest free/i,
  /it's free right now/i,
  /free, personal project/i,
  /no subscription/i,
  /permanently free/i,
  /always free/i,
  /completely free/i,
  /100% free/i,
  /free to use/i,
  /free service/i,
  /optional paid resources/i,
  /paid resource options/i,
  /if that ever changes/i,
  /was free/i,
  /used to be free/i,
  /no longer free/i,
  /previously free/i,
  /now paid/i,
  /free to paid/i,
];

const MESSAGING_FILES = [
  "src/content/subscriptionMessaging.js",
  "src/pages/About.jsx",
  "src/pages/Landing.jsx",
  "src/pages/parent/Dashboard.jsx",
  "src/pages/legal/legalContent.js",
  "src/pages/parent/TrustSupport.jsx",
  "public/index.html",
];

const PRICE_OR_CHARITY = [
  /not-for-profit/i,
  /non-profit/i,
  /nonprofit/i,
  /registered charity/i,
  /\$\s?\d/,
  /\bper month\b/i,
  /\bper year\b/i,
];

// Uses of "free" that are not a claim that Side Quest itself is free.
const ALLOWED_FREE = [
  "error free",
  "It's free.",
  "It's free, and you don't need to give a reason.",
  "can't type free messages",
  "free of unneeded personal details",
  "good, free guidance",
  "Free to access does not mean free to copy",
];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(js|jsx|html|css|mjs)$/.test(entry)) files.push(full);
  }
  return files;
}

function websiteFiles() {
  return [
    ...walk(srcRoot),
    path.join(frontendRoot, "public", "index.html"),
  ];
}

test("about statement and pricing summary stay exact", () => {
  const messaging = readFileSync(path.join(srcRoot, "content", "subscriptionMessaging.js"), "utf8");
  const about = readFileSync(path.join(srcRoot, "pages", "About.jsx"), "utf8");
  assert.ok(messaging.includes(ABOUT_HEADING));
  for (const paragraph of ABOUT_PARAGRAPHS) assert.ok(messaging.includes(paragraph), paragraph);
  assert.ok(messaging.includes(PRICING_SUMMARY));
  assert.ok(messaging.includes(FUTURE_PRICING));
  assert.match(about, /ABOUT_HEADING/);
  assert.match(about, /ABOUT_PARAGRAPHS\.map/);
  assert.match(about, /data-testid="about-statement"/);
  assert.match(about, /data-testid="future-pricing"[\s\S]*PRICING_SUMMARY[\s\S]*FUTURE_PRICING/);
});

test("shorter statement sits with future pricing on the public pages", () => {
  const landing = readFileSync(path.join(srcRoot, "pages", "Landing.jsx"), "utf8");
  const legal = readFileSync(path.join(srcRoot, "pages", "legal", "legalContent.js"), "utf8");
  const app = readFileSync(path.join(srcRoot, "App.js"), "utf8");
  assert.match(landing, /data-testid="subscription-support"[\s\S]*SUBSCRIPTION_SUPPORT/);
  assert.match(landing, /data-testid="future-pricing"[\s\S]*PRICING_SUMMARY[\s\S]*FUTURE_PRICING/);
  assert.match(readFileSync(path.join(srcRoot, "content", "subscriptionMessaging.js"), "utf8"), /subscription-supported/);
  assert.match(legal, /h: "Subscription"/);
  assert.match(legal, /PRICING_SUMMARY[\s\S]{0,80}FUTURE_PRICING/);
  assert.match(legal, /How is Side Quest supported\?/);
  assert.match(app, /path="\/about"/);
});

test("website copy no longer claims the product is free", () => {
  const offenders = [];
  for (const file of websiteFiles()) {
    const text = readFileSync(file, "utf8");
    for (const pattern of PRODUCT_FREE_CLAIMS) {
      if (pattern.test(text)) offenders.push(`${path.relative(frontendRoot, file)} matches ${pattern}`);
    }
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      if (!/\bfree\b/i.test(line)) return;
      if (ALLOWED_FREE.some((phrase) => line.includes(phrase))) return;
      offenders.push(`${path.relative(frontendRoot, file)}:${index + 1}: ${line.trim()}`);
    });
  }
  assert.deepEqual(offenders, []);
});

test("messaging does not invent a price or a charity registration", () => {
  const offenders = [];
  for (const relative of MESSAGING_FILES) {
    const text = readFileSync(path.join(frontendRoot, relative), "utf8");
    for (const pattern of PRICE_OR_CHARITY) {
      if (pattern.test(text)) offenders.push(`${relative} matches ${pattern}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("unrelated uses of free remain", () => {
  const legal = readFileSync(path.join(srcRoot, "pages", "legal", "legalContent.js"), "utf8");
  const resources = readFileSync(path.join(srcRoot, "pages", "parent", "Resources.jsx"), "utf8");
  for (const phrase of ALLOWED_FREE) {
    const haystack = phrase.startsWith("Free to access") ? resources : legal;
    assert.ok(haystack.includes(phrase), phrase);
  }
});
